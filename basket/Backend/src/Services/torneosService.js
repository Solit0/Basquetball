const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, ne, notInArray, desc, sql, count } = require('drizzle-orm');

const crearTorneo = async (datosTorneo) => {
    const { nombre_torneo, descripcion, categoria, fecha_inicio, fecha_fin, numero_equipos, id_clasificacion, reglamento } = datosTorneo;
    if (numero_equipos > 32) throw new Error('El límite máximo de equipos permitidos por torneo es 32.');
    const clasificacionDb = await db.select({ id: schema.clasificacionEquipo.idClasificacion })
        .from(schema.clasificacionEquipo)
        .where(eq(schema.clasificacionEquipo.descripcion, id_clasificacion))
        .limit(1);

    if (clasificacionDb.length === 0) {
        throw new Error(`La clasificación de género '${id_clasificacion}' no existe en la base de datos.`);
    }
    const uuid_clasificacion_real = clasificacionDb[0].id;
    const rows = await db.insert(schema.torneos)
        .values({
            nombreTorneo: nombre_torneo,
            descripcion: descripcion,
            categoria: categoria,
            fechaInicio: fecha_inicio,
            fechaFin: fecha_fin,
            numeroEquipos: numero_equipos,
            idClasificacion: uuid_clasificacion_real, 
            reglamento: reglamento
        })
        .returning();
        
    return rows[0];
};
const quitarEquipo = async (id_torneo, id_equipo) => {
    return await db.transaction(async (tx) => {
        const torneoQuery = await tx.select({ estado: schema.torneos.estado })
            .from(schema.torneos)
            .where(eq(schema.torneos.idTorneo, id_torneo))
            .limit(1);
            
        if (torneoQuery.length === 0) throw new Error('El torneo no existe.');
        if (torneoQuery[0].estado !== 'En inscripción') {
            throw new Error('No puedes quitar equipos de un torneo que ya está en curso o finalizado.');
        }

        const partidosQuery = await tx.select({ count: count() })
            .from(schema.partidos)
            .where(eq(schema.partidos.idTorneo, id_torneo));
            
        if (Number(partidosQuery[0].count) > 0) {
            await tx.update(schema.torneos)
                .set({ estado: 'En curso' })
                .where(eq(schema.torneos.idTorneo, id_torneo));
            throw new Error('Bloqueo de seguridad: No puedes expulsar a un equipo porque el torneo ya tiene partidos generados.');
        }

        const rows = await tx.delete(schema.inscripciones)
            .where(
                and(
                    eq(schema.inscripciones.idTorneo, id_torneo),
                    eq(schema.inscripciones.idEquipo, id_equipo)
                )
            )
            .returning();
        
        if (rows.length === 0) throw new Error('El equipo no estaba inscrito en este torneo.');
        return rows[0];
    });
};

const editarTorneo = async (id_torneo, datosTorneo) => {
    return await db.transaction(async (tx) => {
    
        const estadoQuery = await tx.select({ estado: schema.torneos.estado })
            .from(schema.torneos)
            .where(eq(schema.torneos.idTorneo, id_torneo))
            .limit(1);
            
        if (estadoQuery.length === 0) throw new Error('Torneo no encontrado');
        if (estadoQuery[0].estado !== 'En inscripción') {
            throw new Error('Solo puedes editar un torneo antes de que inicie.');
        }

        const partidosQuery = await tx.select({ count: count() })
            .from(schema.partidos)
            .where(eq(schema.partidos.idTorneo, id_torneo));
            
        if (Number(partidosQuery[0].count) > 0) {
            await tx.update(schema.torneos)
                .set({ estado: 'En curso' })
                .where(eq(schema.torneos.idTorneo, id_torneo));
            throw new Error('Bloqueo de seguridad: No puedes editar las bases de un torneo que ya tiene partidos programados.');
        }

        const { nombre_torneo, descripcion, categoria, fecha_inicio, fecha_fin, numero_equipos, reglamento } = datosTorneo;
        
        const updateData = {};
        if (nombre_torneo !== undefined) updateData.nombreTorneo = nombre_torneo;
        if (descripcion !== undefined) updateData.descripcion = descripcion;
        if (categoria !== undefined) updateData.categoria = categoria;
        if (fecha_inicio !== undefined) updateData.fechaInicio = fecha_inicio;
        if (fecha_fin !== undefined) updateData.fechaFin = fecha_fin;
        if (numero_equipos !== undefined) updateData.numeroEquipos = numero_equipos;
        if (reglamento !== undefined) updateData.reglamento = reglamento;

        const rows = await tx.update(schema.torneos)
            .set(updateData)
            .where(eq(schema.torneos.idTorneo, id_torneo))
            .returning();
            
        return rows[0];
    });
};

const iniciarTorneo = async (id_torneo) => {
    return await db.transaction(async (tx) => {
        const torneoInfo = await tx.select({ numero_equipos: schema.torneos.numeroEquipos })
            .from(schema.torneos)
            .where(eq(schema.torneos.idTorneo, id_torneo))
            .limit(1);
            
        if (torneoInfo.length === 0) throw new Error('Torneo no encontrado');
        const limiteEquipos = torneoInfo[0].numero_equipos;

        const equiposInscritos = await tx.select({ count: count() })
            .from(schema.inscripciones)
            .where(eq(schema.inscripciones.idTorneo, id_torneo));
            
        const cantidad = Number(equiposInscritos[0].count);
        
        if (cantidad === 0) throw new Error('No puedes iniciar un torneo sin equipos.');
        if (cantidad !== limiteEquipos) {
            throw new Error(`REGLA_TORNEO: El torneo requiere exactamente ${limiteEquipos} equipos para iniciar, pero actualmente solo hay ${cantidad} inscritos.`);
        }
        if (cantidad % 2 !== 0) throw new Error('REGLA_TORNEO: El torneo debe tener una cantidad PAR de equipos para poder iniciar.');

        const rows = await tx.update(schema.torneos)
            .set({ estado: 'En curso' })
            .where(eq(schema.torneos.idTorneo, id_torneo))
            .returning();
            
        return rows[0];
    });
};

const eliminarTorneo = async (id_torneo) => {
    return await db.transaction(async (tx) => {
        const partidos = await tx.select({ 
            estado: schema.partidos.estado, 
            ronda_torneo: schema.partidos.rondaTorneo 
        })
        .from(schema.partidos)
        .where(eq(schema.partidos.idTorneo, id_torneo));
        
        const totalPartidos = partidos.length;
        const partidosFinalizados = partidos.filter(p => p.estado === 'Finalizado').length;
        
        const tieneFinalJugada = partidos.some(p => 
            (p.ronda_torneo === 'Final' || p.ronda_torneo === 'Gran Final') && p.estado === 'Finalizado'
        );

        let nuevoEstado = '';

        if (totalPartidos === 0 || (totalPartidos > 0 && partidosFinalizados === 0)) {
            nuevoEstado = 'Cancelado'; 
        } 
        else if (tieneFinalJugada) {
            nuevoEstado = 'Archivado'; 
        } 
        else {
            throw new Error('BLOQUEO DE SEGURIDAD: El torneo está a la mitad de su desarrollo. Solo puedes eliminar torneos vacíos, torneos sin arrancar o torneos finalizados por completo.');
        }

        await tx.update(schema.torneos)
            .set({ estado: nuevoEstado })
            .where(eq(schema.torneos.idTorneo, id_torneo));
        
        return { 
            mensaje: `El torneo fue ${nuevoEstado.toLowerCase()} exitosamente y ha sido removido de la vista principal.` 
        };
    });
};

const obtenerTodosActivos = async () => {
    const rows = await db.select({
        id_torneo: schema.torneos.idTorneo,
        nombre_torneo: schema.torneos.nombreTorneo,
        descripcion: schema.torneos.descripcion,
        categoria: schema.torneos.categoria,
        fecha_inicio: schema.torneos.fechaInicio,
        fecha_fin: schema.torneos.fechaFin,
        numero_equipos: schema.torneos.numeroEquipos,
        estado: schema.torneos.estado,
        id_clasificacion: schema.torneos.idClasificacion,
        reglamento: schema.torneos.reglamento,
        clasificacion_genero: schema.clasificacionEquipo.descripcion,
        equipos_inscritos: sql`(
            SELECT COUNT(*)::int 
            FROM inscripciones i 
            WHERE i.id_torneo = ${schema.torneos.idTorneo} 
              AND i.estado_inscripcion != 'Rechazada'
        )`.as('equipos_inscritos')
    })
    .from(schema.torneos)
    .leftJoin(schema.clasificacionEquipo, eq(schema.torneos.idClasificacion, schema.clasificacionEquipo.idClasificacion))
    .where(
        notInArray(schema.torneos.estado, ['Cancelado', 'Archivado'])
    )
    .orderBy(desc(schema.torneos.fechaInicio));

    return rows;
};

const obtenerEquiposElegibles = async (id_torneo) => {
    const rows = await db.select({
        id_equipo: schema.equipos.idEquipo,
        nombre_oficial: schema.equipos.nombreOficial,
        siglas: schema.equipos.siglas,
        nombre_cancha: schema.canchas.nombreCancha,
        total_jugadores: sql`(
            SELECT COUNT(*)::int 
            FROM plantilla_equipo pe 
            WHERE pe.id_equipo = ${schema.equipos.idEquipo} 
              AND pe.activo = true
        )`.as('total_jugadores')
    })
    .from(schema.equipos)
    .leftJoin(schema.canchas, eq(schema.equipos.idCancha, schema.canchas.idCancha))
    .where(
        and(
            eq(schema.equipos.activo, true),
            sql`${schema.equipos.idEquipo} NOT IN (
                SELECT id_equipo 
                FROM inscripciones 
                WHERE id_torneo = ${id_torneo} AND estado_inscripcion != 'Rechazada'
            )`
        )
    );

    return rows;
};

const inscribirEquipo = async (id_torneo, id_equipo) => {
    try {
        const rows = await db.insert(schema.inscripciones)
            .values({
                idTorneo: id_torneo,
                idEquipo: id_equipo,
                estadoInscripcion: 'Aprobada'
            })
            .returning();
            
        return rows[0];
    } catch (error) {
        if (error.message && error.message.includes('REGLA_TORNEO')) throw new Error(error.message);
        if (error.code === '23505') throw new Error('El equipo ya está inscrito en este torneo.');
        throw error;
    }
};

const obtenerEquiposInscritos = async (id_torneo) => {
    const rows = await db.select({
        id_equipo: schema.equipos.idEquipo,
        nombre_oficial: schema.equipos.nombreOficial,
        siglas: schema.equipos.siglas,
        id_cancha: schema.canchas.idCancha,
        nombre_cancha: schema.canchas.nombreCancha
    })
    .from(schema.inscripciones)
    .innerJoin(schema.equipos, eq(schema.inscripciones.idEquipo, schema.equipos.idEquipo))
    .leftJoin(schema.canchas, eq(schema.equipos.idCancha, schema.canchas.idCancha))
    .where(
        and(
            eq(schema.inscripciones.idTorneo, id_torneo),
            eq(schema.inscripciones.estadoInscripcion, 'Aprobada')
        )
    );

    return rows;
};

const obtenerTorneosDeEntrenador = async (id_entrenador) => {
    const rows = await db.select({
        id_torneo: schema.torneos.idTorneo,
        nombre_torneo: schema.torneos.nombreTorneo,
        fecha_inicio: schema.torneos.fechaInicio,
        fecha_fin: schema.torneos.fechaFin,
        estado: schema.torneos.estado,
        categoria: schema.torneos.categoria,
        reglamento: schema.torneos.reglamento,
        id_equipo: schema.equipos.idEquipo,
        estado_inscripcion: schema.inscripciones.estadoInscripcion
    })
    .from(schema.torneos)
    .innerJoin(schema.inscripciones, eq(schema.torneos.idTorneo, schema.inscripciones.idTorneo))
    .innerJoin(schema.equipos, eq(schema.inscripciones.idEquipo, schema.equipos.idEquipo))
    .where(
        and(
            eq(schema.equipos.idEntrenador, id_entrenador),
            eq(schema.inscripciones.estadoInscripcion, 'Aprobada')
        )
    )
    .orderBy(desc(schema.torneos.fechaInicio));

    return rows;
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