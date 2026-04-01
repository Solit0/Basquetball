const { db } = require('../Config/db');
const { torneos, inscripciones, partidos, equipos, canchas, plantillaEquipo, clasificacionEquipo, usuarios } = require('../models/schema');
const { eq, and, ne, notInArray, notExists, alias, count, sql } = require('drizzle-orm');

const crearTorneo = async (datosTorneo) => {
    const { nombre_torneo, descripcion, categoria, fecha_inicio, fecha_fin, numero_equipos, id_clasificacion, reglamento } = datosTorneo;
    
    if (numero_equipos > 32) {
        throw new Error('El límite máximo de equipos permitidos por torneo es 32.');
    }

    const result = await db
        .insert(torneos)
        .values({
            nombreTorneo: nombre_torneo,
            descripcion: descripcion || null,
            categoria: categoria || null,
            fechaInicio: fecha_inicio,
            fechaFin: fecha_fin,
            numeroEquipos: numero_equipos,
            idClasificacion: id_clasificacion || null,
            reglamento: reglamento || null,
        })
        .returning();

    return result[0];
};

const quitarEquipo = async (id_torneo, id_equipo) => {
    return await db.transaction(async (tx) => {
        // Validar estado del torneo
        const torneoInfo = await tx
            .select({ estado: torneos.estado })
            .from(torneos)
            .where(eq(torneos.idTorneo, id_torneo));

        if (torneoInfo.length === 0) {
            throw new Error('El torneo no existe.');
        }

        if (torneoInfo[0].estado !== 'En inscripción') {
            throw new Error('No puedes quitar equipos de un torneo que ya está en curso o finalizado.');
        }

        // Validar que no haya partidos generados
        const partidosCount = await tx
            .select({ count: count(partidos.idPartido) })
            .from(partidos)
            .where(eq(partidos.idTorneo, id_torneo));

        if ((partidosCount[0]?.count || 0) > 0) {
            await tx.update(torneos).set({ estado: 'En curso' }).where(eq(torneos.idTorneo, id_torneo));
            throw new Error('Bloqueo de seguridad: No puedes expulsar a un equipo porque el torneo ya tiene partidos generados.');
        }

        // Eliminar inscripción
        const result = await tx
            .delete(inscripciones)
            .where(and(eq(inscripciones.idTorneo, id_torneo), eq(inscripciones.idEquipo, id_equipo)))
            .returning();

        if (result.length === 0) {
            throw new Error('El equipo no estaba inscrito en este torneo.');
        }

        return result[0];
    });
};

const editarTorneo = async (id_torneo, datosTorneo) => {
    return await db.transaction(async (tx) => {
        // Validar estado del torneo
        const estadoInfo = await tx
            .select({ estado: torneos.estado })
            .from(torneos)
            .where(eq(torneos.idTorneo, id_torneo));

        if (estadoInfo[0]?.estado !== 'En inscripción') {
            throw new Error('Solo puedes editar un torneo antes de que inicie.');
        }

        // Validar que no haya partidos generados
        const partidosCount = await tx
            .select({ count: count(partidos.idPartido) })
            .from(partidos)
            .where(eq(partidos.idTorneo, id_torneo));

        if ((partidosCount[0]?.count || 0) > 0) {
            await tx.update(torneos).set({ estado: 'En curso' }).where(eq(torneos.idTorneo, id_torneo));
            throw new Error('Bloqueo de seguridad: No puedes editar las bases de un torneo que ya tiene partidos programados.');
        }

        const { nombre_torneo, descripcion, categoria, fecha_inicio, fecha_fin, numero_equipos, reglamento } = datosTorneo;

        const result = await tx
            .update(torneos)
            .set({
                nombreTorneo: nombre_torneo || torneos.nombreTorneo,
                descripcion: descripcion || torneos.descripcion,
                categoria: categoria || torneos.categoria,
                fechaInicio: fecha_inicio || torneos.fechaInicio,
                fechaFin: fecha_fin || torneos.fechaFin,
                numeroEquipos: numero_equipos || torneos.numeroEquipos,
                reglamento: reglamento || torneos.reglamento,
            })
            .where(eq(torneos.idTorneo, id_torneo))
            .returning();

        return result[0];
    });
};

const iniciarTorneo = async (id_torneo) => {
    return await db.transaction(async (tx) => {
        // Obtener información del torneo
        const torneoInfo = await tx
            .select({ numeroEquipos: torneos.numeroEquipos })
            .from(torneos)
            .where(eq(torneos.idTorneo, id_torneo));

        const limiteEquipos = torneoInfo[0]?.numeroEquipos;

        // Contar equipos inscritos
        const equiposInscritos = await tx
            .select({ count: count(inscripciones.idEquipo) })
            .from(inscripciones)
            .where(eq(inscripciones.idTorneo, id_torneo));

        const cantidad = equiposInscritos[0]?.count || 0;

        // Validaciones
        if (cantidad === 0) {
            throw new Error('No puedes iniciar un torneo sin equipos.');
        }

        if (cantidad !== limiteEquipos) {
            throw new Error(`REGLA_TORNEO: El torneo requiere exactamente ${limiteEquipos} equipos para iniciar, pero actualmente solo hay ${cantidad} inscritos.`);
        }

        if (cantidad % 2 !== 0) {
            throw new Error('REGLA_TORNEO: El torneo debe tener una cantidad PAR de equipos para poder iniciar.');
        }

        // Actualizar estado
        const result = await tx
            .update(torneos)
            .set({ estado: 'En curso' })
            .where(eq(torneos.idTorneo, id_torneo))
            .returning();

        return result[0];
    });
};

const eliminarTorneo = async (id_torneo) => {
    return await db.transaction(async (tx) => {
        // Obtener todos los partidos del torneo
        const partidosData = await tx
            .select({ estado: partidos.estado, rondaTorneo: partidos.rondaTorneo })
            .from(partidos)
            .where(eq(partidos.idTorneo, id_torneo));

        const totalPartidos = partidosData.length;
        const partidosFinalizados = partidosData.filter(p => p.estado === 'Finalizado').length;

        const tieneFinalJugada = partidosData.some(p =>
            (p.rondaTorneo === 'Final' || p.rondaTorneo === 'Gran Final') && p.estado === 'Finalizado'
        );

        let nuevoEstado = '';

        // Lógica de máquina de estados
        if (totalPartidos === 0 || (totalPartidos > 0 && partidosFinalizados === 0)) {
            nuevoEstado = 'Cancelado';
        } else if (tieneFinalJugada) {
            nuevoEstado = 'Archivado';
        } else {
            throw new Error('BLOQUEO DE SEGURIDAD: El torneo está a la mitad de su desarrollo. Solo puedes eliminar torneos vacíos, torneos sin arrancar o torneos finalizados por completo.');
        }

        // Actualizar estado del torneo
        await tx
            .update(torneos)
            .set({ estado: nuevoEstado })
            .where(eq(torneos.idTorneo, id_torneo));

        return {
            mensaje: `El torneo fue ${nuevoEstado.toLowerCase()} exitosamente y ha sido removido de la vista principal.`
        };
    });
};

const obtenerTodosActivos = async () => {
    const inscritosSubquery = db
        .select({
            idTorneo: inscripciones.idTorneo,
            equiposInscritos: count(inscripciones.idEquipo),
        })
        .from(inscripciones)
        .where(ne(inscripciones.estadoInscripcion, 'Rechazada'))
        .groupBy(inscripciones.idTorneo)
        .as('inscritos');

    const results = await db
        .select({
            idTorneo: torneos.idTorneo,
            nombreTorneo: torneos.nombreTorneo,
            descripcion: torneos.descripcion,
            categoria: torneos.categoria,
            fechaInicio: torneos.fechaInicio,
            fechaFin: torneos.fechaFin,
            numeroEquipos: torneos.numeroEquipos,
            estado: torneos.estado,
            idClasificacion: torneos.idClasificacion,
            reglamento: torneos.reglamento,
            clasificacionGenero: clasificacionEquipo.descripcion,
            equiposInscritos: inscritosSubquery.equiposInscritos,
        })
        .from(torneos)
        .leftJoin(clasificacionEquipo, eq(torneos.idClasificacion, clasificacionEquipo.idClasificacion))
        .leftJoin(inscritosSubquery, eq(torneos.idTorneo, inscritosSubquery.idTorneo))
        .where(notInArray(torneos.estado, ['Cancelado', 'Archivado']))
        .orderBy(torneos.fechaInicio);

    return results;
};

const obtenerEquiposElegibles = async (id_torneo) => {
    // Equipos que NO están inscritos en este torneo
    const results = await db
        .select({
            idEquipo: equipos.idEquipo,
            nombreOficial: equipos.nombreOficial,
            siglas: equipos.siglas,
            nombreCancha: canchas.nombreCancha,
            totalJugadores: count(plantillaEquipo.idJugador),
        })
        .from(equipos)
        .leftJoin(canchas, eq(equipos.idCancha, canchas.idCancha))
        .leftJoin(plantillaEquipo, and(eq(plantillaEquipo.idEquipo, equipos.idEquipo), eq(plantillaEquipo.activo, true)))
        .where(
            and(
                eq(equipos.activo, true),
                notExists(
                    db
                        .select()
                        .from(inscripciones)
                        .where(
                            and(
                                eq(inscripciones.idTorneo, id_torneo),
                                eq(inscripciones.idEquipo, equipos.idEquipo),
                                ne(inscripciones.estadoInscripcion, 'Rechazada')
                            )
                        )
                )
            )
        )
        .groupBy(equipos.idEquipo, canchas.nombreCancha);

    return results;
};

const inscribirEquipo = async (id_torneo, id_equipo) => {
    try {
        const result = await db
            .insert(inscripciones)
            .values({
                idTorneo: id_torneo,
                idEquipo: id_equipo,
                estadoInscripcion: 'Aprobada',
            })
            .returning();

        return result[0];
    } catch (error) {
        if (error.code === '23505') {
            throw new Error('El equipo ya está inscrito en este torneo.');
        }
        throw error;
    }
};

const obtenerEquiposInscritos = async (id_torneo) => {
    const results = await db
        .select({
            idEquipo: equipos.idEquipo,
            nombreOficial: equipos.nombreOficial,
            siglas: equipos.siglas,
            idCancha: canchas.idCancha,
            nombreCancha: canchas.nombreCancha,
        })
        .from(inscripciones)
        .innerJoin(equipos, eq(inscripciones.idEquipo, equipos.idEquipo))
        .leftJoin(canchas, eq(equipos.idCancha, canchas.idCancha))
        .where(and(eq(inscripciones.idTorneo, id_torneo), eq(inscripciones.estadoInscripcion, 'Aprobada')));

    return results;
};

const obtenerTorneosDeEntrenador = async (id_entrenador) => {
    const results = await db
        .select({
            idTorneo: torneos.idTorneo,
            nombreTorneo: torneos.nombreTorneo,
            fechaInicio: torneos.fechaInicio,
            fechaFin: torneos.fechaFin,
            estado: torneos.estado,
            categoria: torneos.categoria,
            reglamento: torneos.reglamento,
            idEquipo: equipos.idEquipo,
            estadoInscripcion: inscripciones.estadoInscripcion,
        })
        .from(torneos)
        .innerJoin(inscripciones, eq(torneos.idTorneo, inscripciones.idTorneo))
        .innerJoin(equipos, eq(inscripciones.idEquipo, equipos.idEquipo))
        .where(and(eq(equipos.idEntrenador, id_entrenador), eq(inscripciones.estadoInscripcion, 'Aprobada')))
        .orderBy(torneos.fechaInicio);

    return results;
};

module.exports = {
    crearTorneo,
    editarTorneo,
    iniciarTorneo,
    eliminarTorneo,
    quitarEquipo,
    obtenerTodosActivos,
    obtenerEquiposElegibles,
    inscribirEquipo,
    obtenerEquiposInscritos,
    obtenerTorneosDeEntrenador
};