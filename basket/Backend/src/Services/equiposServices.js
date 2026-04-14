const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, ne, isNull, asc, sql } = require('drizzle-orm');

const obtenerTodos = async () => {
    const rows = await db.select({
        id_equipo: schema.equipos.idEquipo,
        nombre_oficial: schema.equipos.nombreOficial,
        siglas: schema.equipos.siglas,
        clasificacion: schema.clasificacionEquipo.descripcion,
        nombre_cancha: schema.canchas.nombreCancha,
        direccion_cancha: schema.canchas.direccion,
        id_entrenador: schema.equipos.idEntrenador,
        activo: schema.equipos.activo
    })
    .from(schema.equipos)
    .leftJoin(schema.clasificacionEquipo, eq(schema.equipos.idClasificacion, schema.clasificacionEquipo.idClasificacion))
    .leftJoin(schema.canchas, eq(schema.equipos.idCancha, schema.canchas.idCancha))
    .orderBy(asc(schema.equipos.nombreOficial));
    
    return rows;
};

const obtenerJugadoresPorEquipo = async (id_equipo) => {
    try {
        const rows = await db.select({
            id_jugador: schema.jugadores.idJugador,
            nombre: schema.jugadores.nombre,
            apellido: schema.jugadores.apellido,
            fecha_nacimiento: schema.jugadores.fechaNacimiento,
            posicion: schema.jugadores.posicion,
            estatura: schema.jugadores.estatura,
            activo: schema.plantillaEquipo.activo,
            
            suspendido_db: sql`EXISTS (
                SELECT 1 FROM ${schema.resolucionesDisciplinarias} rd
                INNER JOIN ${schema.sanciones} s ON rd.id_sancion = s.id_sancion
                WHERE s.id_jugador = ${schema.jugadores.idJugador}
                  AND rd.estado = 'Activa'
                  AND rd.partidos_suspension > rd.partidos_cumplidos
            ) OR EXISTS (
                SELECT 1 FROM ${schema.sanciones} s2
                WHERE s2.id_jugador = ${schema.jugadores.idJugador}
                  AND s2.estado_resolucion = 'Pendiente'
            )`.mapWith(Boolean).as('suspendido_db'),
            
            detalle_sancion_motivo: sql`(
                SELECT s.tipo_sancion 
                FROM ${schema.sanciones} s
                LEFT JOIN ${schema.resolucionesDisciplinarias} rd ON s.id_sancion = rd.id_sancion
                WHERE s.id_jugador = ${schema.jugadores.idJugador} 
                  AND (s.estado_resolucion = 'Pendiente' OR (rd.estado = 'Activa' AND rd.partidos_suspension > rd.partidos_cumplidos))
                LIMIT 1
            )`.mapWith(String).as('detalle_sancion_motivo'),

            detalle_sancion_partidos: sql`(
                SELECT (rd.partidos_suspension - rd.partidos_cumplidos)::int
                FROM ${schema.resolucionesDisciplinarias} rd
                INNER JOIN ${schema.sanciones} s ON rd.id_sancion = s.id_sancion
                WHERE s.id_jugador = ${schema.jugadores.idJugador} 
                  AND rd.estado = 'Activa'
                LIMIT 1
            )`.mapWith(Number).as('detalle_sancion_partidos'),
            detalle_monto_multa: sql`(
                SELECT rd.monto_multa
                FROM ${schema.resolucionesDisciplinarias} rd
                INNER JOIN ${schema.sanciones} s ON rd.id_sancion = s.id_sancion
                WHERE s.id_jugador = ${schema.jugadores.idJugador} 
                  AND rd.estado = 'Activa'
                LIMIT 1
            )`.mapWith(Number).as('detalle_monto_multa'),
            
            detalle_multa_pagada: sql`(
                SELECT rd.multa_pagada
                FROM ${schema.resolucionesDisciplinarias} rd
                INNER JOIN ${schema.sanciones} s ON rd.id_sancion = s.id_sancion
                WHERE s.id_jugador = ${schema.jugadores.idJugador} 
                  AND rd.estado = 'Activa'
                LIMIT 1
            )`.mapWith(Boolean).as('detalle_multa_pagada')

        })
        .from(schema.jugadores)
        .innerJoin(schema.plantillaEquipo, eq(schema.jugadores.idJugador, schema.plantillaEquipo.idJugador))
        .where(
            and(
                eq(schema.plantillaEquipo.idEquipo, id_equipo),
                eq(schema.plantillaEquipo.activo, true)
            )
        );

        return rows.map(r => {
            const estaSancionado = !!r.suspendido_db;
            const partidosPendientes = parseInt(r.detalle_sancion_partidos) || 0;
            const motivo = r.detalle_sancion_motivo || 'Pendiente de revisión';
            return {
                id_jugador: r.id_jugador,
                nombre: r.nombre,
                apellido: r.apellido,
                fecha_nacimiento: r.fecha_nacimiento,
                posicion: r.posicion,
                estatura: r.estatura,
                activo: r.activo,
                numero_camiseta: null,
                rol_equipo: 'N/A',
                es_capitan: false,
                esta_suspendido: estaSancionado,
                sancion_motivo: motivo,
                partidos_restantes: partidosPendientes,
                monto_multa: parseFloat(r.detalle_monto_multa) || 0,
                multa_pagada: r.detalle_multa_pagada === true
            };
        });

    } catch (error) {
        console.error(`[BACKEND ERROR] Falló la consulta SQL en obtenerJugadoresPorEquipo:`, error);
        throw error;
    }
};
const obtenerPorId = async (id_equipo) => {
    const rows = await db.select({
        id_equipo: schema.equipos.idEquipo,
        nombre_oficial: schema.equipos.nombreOficial,
        siglas: schema.equipos.siglas,
        id_clasificacion: schema.equipos.idClasificacion,
        id_entrenador: schema.equipos.idEntrenador,
        id_cancha: schema.equipos.idCancha,
        activo: schema.equipos.activo,
        clasificacion: schema.clasificacionEquipo.descripcion,
        nombre_cancha: schema.canchas.nombreCancha,
        direccion_cancha: schema.canchas.direccion,
        capacidad_cancha: schema.canchas.capacidad,
        entrenador_nombre: sql`CONCAT(${schema.usuarios.nombre}, ' ', ${schema.usuarios.apellido})`.as('entrenador_nombre')
    })
    .from(schema.equipos)
    .leftJoin(schema.clasificacionEquipo, eq(schema.equipos.idClasificacion, schema.clasificacionEquipo.idClasificacion))
    .leftJoin(schema.canchas, eq(schema.equipos.idCancha, schema.canchas.idCancha))
    .leftJoin(schema.usuarios, eq(schema.equipos.idEntrenador, schema.usuarios.idUsuario))
    .where(eq(schema.equipos.idEquipo, id_equipo))
    .limit(1);

    return rows[0] || null;
};

const obtenerPorEntrenador = async (id_entrenador) => {
    const rows = await db.select({
        id_equipo: schema.equipos.idEquipo,
        nombre_oficial: schema.equipos.nombreOficial,
        siglas: schema.equipos.siglas,
        id_clasificacion: schema.equipos.idClasificacion,
        id_entrenador: schema.equipos.idEntrenador,
        id_cancha: schema.equipos.idCancha,
        activo: schema.equipos.activo,
        clasificacion: schema.clasificacionEquipo.descripcion,
        nombre_cancha: schema.canchas.nombreCancha,
        direccion_cancha: schema.canchas.direccion,
        capacidad_cancha: schema.canchas.capacidad
    })
    .from(schema.equipos)
    .leftJoin(schema.clasificacionEquipo, eq(schema.equipos.idClasificacion, schema.clasificacionEquipo.idClasificacion))
    .leftJoin(schema.canchas, eq(schema.equipos.idCancha, schema.canchas.idCancha))
    .where(eq(schema.equipos.idEntrenador, id_entrenador))
    .limit(1);

    return rows[0] || null;
};

const crear = async (datosEquipo) => {
    const { nombre_oficial, siglas, id_clasificacion, id_entrenador, id_cancha, nueva_cancha } = datosEquipo;
    
    return await db.transaction(async (tx) => {
        const clasificacionDb = await tx.select({ id: schema.clasificacionEquipo.idClasificacion })
            .from(schema.clasificacionEquipo)
            .where(eq(schema.clasificacionEquipo.descripcion, id_clasificacion))
            .limit(1);
        if (clasificacionDb.length === 0) {
            throw new Error(`La clasificación '${id_clasificacion}' no existe.`);
        }
        const uuid_clasificacion_real = clasificacionDb[0].id;
        let canchaAsignadaId = id_cancha;

        if (!canchaAsignadaId && nueva_cancha) {
            const [nueva] = await tx.insert(schema.canchas)
                .values({
                    nombreCancha: nueva_cancha.nombre,
                    direccion: nueva_cancha.direccion,
                    capacidad: nueva_cancha.capacidad || null
                })
                .returning({ id_cancha: schema.canchas.idCancha });
                
            canchaAsignadaId = nueva.id_cancha;
        }

        const [nuevoEquipo] = await tx.insert(schema.equipos)
            .values({
                nombreOficial: nombre_oficial,
                siglas: siglas,
                idClasificacion: uuid_clasificacion_real, 
                idCancha: canchaAsignadaId,
                idEntrenador: id_entrenador || null
            })
            .returning();

        return nuevoEquipo;
    });
};

const actualizar = async (id_equipo, datosEquipo) => {
    const { 
        nombre_oficial, siglas, id_clasificacion, 
        id_cancha, nombre_cancha, direccion_cancha, capacidad_cancha 
    } = datosEquipo;
    
    try {
        return await db.transaction(async (tx) => {
            let canchaFinalId = id_cancha;
            if (id_cancha && direccion_cancha) {
                const duplicateCheck = await tx.select({ id: schema.canchas.idCancha })
                    .from(schema.canchas)
                    .where(
                        and(
                            eq(schema.canchas.direccion, direccion_cancha),
                            ne(schema.canchas.idCancha, id_cancha)
                        )
                    );
                
                if (duplicateCheck.length > 0) throw new Error('DIRECCION_REPETIDA: Ya existe otra sede deportiva registrada exactamente con esa misma dirección.');

                const updateCanchaData = {};
                if (nombre_cancha !== undefined) updateCanchaData.nombreCancha = nombre_cancha;
                if (direccion_cancha !== undefined) updateCanchaData.direccion = direccion_cancha;
                if (capacidad_cancha !== undefined) updateCanchaData.capacidad = capacidad_cancha || null;

                if (Object.keys(updateCanchaData).length > 0) {
                    await tx.update(schema.canchas)
                        .set(updateCanchaData)
                        .where(eq(schema.canchas.idCancha, id_cancha));
                }
            } 
            else if (!id_cancha && direccion_cancha) {
                const duplicateCheck = await tx.select({ id: schema.canchas.idCancha })
                    .from(schema.canchas)
                    .where(eq(schema.canchas.direccion, direccion_cancha));
                
                if (duplicateCheck.length > 0) throw new Error('DIRECCION_REPETIDA: Ya existe otra sede deportiva registrada exactamente con esa misma dirección.');

                const [nuevaCancha] = await tx.insert(schema.canchas)
                    .values({
                        nombreCancha: nombre_cancha,
                        direccion: direccion_cancha,
                        capacidad: capacidad_cancha || null
                    })
                    .returning({ id_cancha: schema.canchas.idCancha });
                
                canchaFinalId = nuevaCancha.id_cancha;
            }

            let uuid_clasificacion_real = undefined;
            if (id_clasificacion) {
                const clasificacionDb = await tx.select({ id: schema.clasificacionEquipo.idClasificacion })
                    .from(schema.clasificacionEquipo)
                    .where(eq(schema.clasificacionEquipo.descripcion, id_clasificacion))
                    .limit(1);

                if (clasificacionDb.length > 0) {
                    uuid_clasificacion_real = clasificacionDb[0].id;
                }
            }

            const updateEquipoData = {};
            if (nombre_oficial !== undefined) updateEquipoData.nombreOficial = nombre_oficial;
            if (siglas !== undefined) updateEquipoData.siglas = siglas;
            if (uuid_clasificacion_real !== undefined) updateEquipoData.idClasificacion = uuid_clasificacion_real;
            if (canchaFinalId !== undefined) updateEquipoData.idCancha = canchaFinalId;

            const [equipoActualizado] = await tx.update(schema.equipos)
                .set(updateEquipoData)
                .where(eq(schema.equipos.idEquipo, id_equipo))
                .returning();

            return equipoActualizado;
        });
    } catch (error) {
        if (error.code === '23505') throw new Error('El nombre oficial del equipo o sus siglas ya están siendo utilizados.');
        throw error;
    }
};

const cambiarEstado = async (id_equipo, activo) => {
    // 🔴 1. Si intentan DESACTIVAR, validamos que no esté jugando un torneo
    if (activo === false) {
        const torneosEnCurso = await db.select({ id: schema.inscripciones.idInscripcion })
            .from(schema.inscripciones)
            .innerJoin(schema.torneos, eq(schema.inscripciones.idTorneo, schema.torneos.idTorneo))
            .where(
                and(
                    eq(schema.inscripciones.idEquipo, id_equipo),
                    eq(schema.inscripciones.estadoInscripcion, 'Aprobada'),
                    eq(schema.torneos.estado, 'En curso')
                )
            )
            .limit(1); // Solo necesitamos saber si existe al menos uno

        if (torneosEnCurso.length > 0) {
            throw new Error('No puedes deshabilitar el equipo porque actualmente está compitiendo en un torneo en curso.');
        }
    }

    // 2. Si todo está bien (o si lo están activando), procedemos con la actualización
    const rows = await db.update(schema.equipos)
        .set({ activo: activo })
        .where(eq(schema.equipos.idEquipo, id_equipo))
        .returning();
        
    return rows[0];
};

const eliminar = async (id_equipo) => {
    const rows = await db.update(schema.equipos)
        .set({ activo: false })
        .where(eq(schema.equipos.idEquipo, id_equipo))
        .returning();
        
    return rows[0];
};

const obtenerEstadisticas = async (id_equipo) => {
    const rows = await db.select({
        jugadores_activos: sql`COUNT(DISTINCT ${schema.plantillaEquipo.idJugador})::int`,
        partidos_jugados: sql`COUNT(DISTINCT ${schema.partidos.idPartido})::int`,
        victorias: sql`COUNT(DISTINCT CASE 
            WHEN ${schema.partidos.marcadorLocal} > ${schema.partidos.marcadorVisitante} AND ${schema.partidos.idEquipoLocal} = ${id_equipo} THEN 1
            WHEN ${schema.partidos.marcadorVisitante} > ${schema.partidos.marcadorLocal} AND ${schema.partidos.idEquipoVisitante} = ${id_equipo} THEN 1 
        END)::int`
    })
    .from(schema.equipos)
    .leftJoin(schema.plantillaEquipo, and(
        eq(schema.equipos.idEquipo, schema.plantillaEquipo.idEquipo),
        eq(schema.plantillaEquipo.activo, true)
    ))
    .leftJoin(schema.partidos, and(
        sql`(${schema.equipos.idEquipo} = ${schema.partidos.idEquipoLocal} OR ${schema.equipos.idEquipo} = ${schema.partidos.idEquipoVisitante})`,
        eq(schema.partidos.estado, 'Finalizado')
    ))
    .where(eq(schema.equipos.idEquipo, id_equipo))
    .groupBy(schema.equipos.idEquipo);

    return rows[0] || { jugadores_activos: 0, partidos_jugados: 0, victorias: 0 };
};

const obtenerEquiposLibres = async () => {
    const rows = await db.select({
        id_equipo: schema.equipos.idEquipo,
        nombre_oficial: schema.equipos.nombreOficial,
        siglas: schema.equipos.siglas,
        clasificacion: schema.clasificacionEquipo.descripcion,
        nombre_cancha: schema.canchas.nombreCancha,
        direccion_cancha: schema.canchas.direccion
    })
    .from(schema.equipos)
    .leftJoin(schema.clasificacionEquipo, eq(schema.equipos.idClasificacion, schema.clasificacionEquipo.idClasificacion))
    .leftJoin(schema.canchas, eq(schema.equipos.idCancha, schema.canchas.idCancha))
    .where(
        and(
            isNull(schema.equipos.idEntrenador),
            eq(schema.equipos.activo, true)
        )
    )
    .orderBy(asc(schema.equipos.nombreOficial));

    return rows;
};

const abandonarEquipo = async (id_equipo) => {
    try {
        const rows = await db.update(schema.equipos)
            .set({ idEntrenador: null })
            .where(eq(schema.equipos.idEquipo, id_equipo))
            .returning();
            
        return rows[0];
    } catch (error) {
        if (error.message && error.message.includes('REGLA_TORNEO')) {
            throw new Error('No puedes abandonar el equipo porque actualmente está compitiendo en un torneo en curso.');
        }
        throw error;
    }
};

const unirseEquipo = async (id_equipo, id_entrenador) => {
    const rows = await db.update(schema.equipos)
        .set({ idEntrenador: id_entrenador })
        .where(eq(schema.equipos.idEquipo, id_equipo))
        .returning();
        
    return rows[0];
};

module.exports = {
    obtenerTodos, obtenerPorId, obtenerPorEntrenador, crear, actualizar,
    cambiarEstado, eliminar, obtenerEstadisticas, obtenerEquiposLibres,
    abandonarEquipo, unirseEquipo, obtenerJugadoresPorEquipo
};