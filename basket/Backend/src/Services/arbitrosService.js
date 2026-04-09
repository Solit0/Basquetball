const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, ne, notInArray, desc, asc, count, sql, or } = require('drizzle-orm');
const { alias } = require('drizzle-orm/pg-core');

const obtenerTorneosAsignados = async (id_arbitro) => {
    const rows = await db.select({
        id_torneo: schema.torneos.idTorneo,
        nombre_torneo: schema.torneos.nombreTorneo,
        categoria: schema.torneos.categoria,
        clasificacion: schema.clasificacionEquipo.descripcion,
        partidos_pendientes: count(schema.partidos.idPartido)
    })
    .from(schema.torneos)
    .innerJoin(schema.partidos, eq(schema.torneos.idTorneo, schema.partidos.idTorneo))
    .leftJoin(schema.clasificacionEquipo, eq(schema.torneos.idClasificacion, schema.clasificacionEquipo.idClasificacion))
    .where(
        and(
            or(
                eq(schema.partidos.idArbitroPrincipal, id_arbitro),
                eq(schema.partidos.idArbitroAsistente1, id_arbitro),
                eq(schema.partidos.idArbitroAsistente2, id_arbitro)
            ),
            ne(schema.partidos.estado, 'Finalizado'),
            notInArray(schema.torneos.estado, ['Cancelado', 'Archivado'])
        )
    )
    .groupBy(schema.torneos.idTorneo, schema.clasificacionEquipo.descripcion)
    .orderBy(desc(schema.torneos.fechaInicio));

    return rows;
};

const obtenerPartidosPorTorneo = async (id_arbitro, id_torneo) => {
    const equipoLocal = alias(schema.equipos, 'equipo_local');
    const equipoVisitante = alias(schema.equipos, 'equipo_visitante');

    const rows = await db.select({
        id_partido: schema.partidos.idPartido,
        fecha: schema.partidos.fecha,
        hora: schema.partidos.hora,
        ronda_torneo: schema.partidos.rondaTorneo,
        estado: schema.partidos.estado,
        local_nombre: equipoLocal.nombreOficial,
        local_siglas: equipoLocal.siglas,
        visitante_nombre: equipoVisitante.nombreOficial,
        visitante_siglas: equipoVisitante.siglas,
        nombre_cancha: schema.canchas.nombreCancha,
        id_arbitro_principal: schema.partidos.idArbitroPrincipal, 
        rol_arbitral: sql`CASE 
            WHEN ${schema.partidos.idArbitroPrincipal} = ${id_arbitro} THEN 'Principal' 
            WHEN ${schema.partidos.idArbitroAsistente1} = ${id_arbitro} THEN 'Asistente 1' 
            ELSE 'Asistente 2' 
        END`.as('rol_arbitral')
    })
    .from(schema.partidos)
    .innerJoin(equipoLocal, eq(schema.partidos.idEquipoLocal, equipoLocal.idEquipo))
    .innerJoin(equipoVisitante, eq(schema.partidos.idEquipoVisitante, equipoVisitante.idEquipo))
    .innerJoin(schema.canchas, eq(schema.partidos.idCancha, schema.canchas.idCancha))
    .where(
        and(
            or(
                eq(schema.partidos.idArbitroPrincipal, id_arbitro),
                eq(schema.partidos.idArbitroAsistente1, id_arbitro),
                eq(schema.partidos.idArbitroAsistente2, id_arbitro)
            ),
            eq(schema.partidos.idTorneo, id_torneo),
            ne(schema.partidos.estado, 'Finalizado')
        )
    )
    .orderBy(asc(schema.partidos.fecha), asc(schema.partidos.hora));

    return rows;
};

const obtenerDetallePartido = async (id_arbitro, id_partido) => {
    const equipoLocal = alias(schema.equipos, 'equipo_local');
    const usuarioLocal = alias(schema.usuarios, 'usuario_local');
    const equipoVisitante = alias(schema.equipos, 'equipo_visitante');
    const usuarioVisitante = alias(schema.usuarios, 'usuario_visitante');

    const rows = await db.select({
        id_partido: schema.partidos.idPartido,
        fecha: schema.partidos.fecha,
        hora: schema.partidos.hora,
        ronda_torneo: schema.partidos.rondaTorneo,
        estado: schema.partidos.estado,
        id_local: equipoLocal.idEquipo,
        local_nombre: equipoLocal.nombreOficial,
        local_entrenador_nombre: usuarioLocal.nombre,
        local_entrenador_apellido: usuarioLocal.apellido,
        id_visitante: equipoVisitante.idEquipo,
        visitante_nombre: equipoVisitante.nombreOficial,
        visitante_entrenador_nombre: usuarioVisitante.nombre,
        visitante_entrenador_apellido: usuarioVisitante.apellido,
        nombre_cancha: schema.canchas.nombreCancha,
        cancha_direccion: schema.canchas.direccion,
        id_arbitro_principal: schema.partidos.idArbitroPrincipal,
        rol_arbitral: sql`CASE 
            WHEN ${schema.partidos.idArbitroPrincipal} = ${id_arbitro} THEN 'Principal' 
            WHEN ${schema.partidos.idArbitroAsistente1} = ${id_arbitro} THEN 'Asistente 1' 
            ELSE 'Asistente 2' 
        END`.as('rol_arbitral')
    })
    .from(schema.partidos)
    .innerJoin(equipoLocal, eq(schema.partidos.idEquipoLocal, equipoLocal.idEquipo))
    .leftJoin(usuarioLocal, eq(equipoLocal.idEntrenador, usuarioLocal.idUsuario))
    .innerJoin(equipoVisitante, eq(schema.partidos.idEquipoVisitante, equipoVisitante.idEquipo))
    .leftJoin(usuarioVisitante, eq(equipoVisitante.idEntrenador, usuarioVisitante.idUsuario))
    .innerJoin(schema.canchas, eq(schema.partidos.idCancha, schema.canchas.idCancha))
    .where(
        and(
            eq(schema.partidos.idPartido, id_partido),
            or(
                eq(schema.partidos.idArbitroPrincipal, id_arbitro),
                eq(schema.partidos.idArbitroAsistente1, id_arbitro),
                eq(schema.partidos.idArbitroAsistente2, id_arbitro)
            )
        )
    )
    .limit(1);

    return rows[0] || null;
};

const obtenerTodosPartidosAsignados = async (id_arbitro) => {
    const equipoLocal = alias(schema.equipos, 'equipo_local');
    const equipoVisitante = alias(schema.equipos, 'equipo_visitante');

    const rows = await db.select({
        id_partido: schema.partidos.idPartido,
        fecha: schema.partidos.fecha,
        hora: schema.partidos.hora,
        ronda_torneo: schema.partidos.rondaTorneo,
        estado: schema.partidos.estado,
        nombre_torneo: schema.torneos.nombreTorneo,
        local_nombre: equipoLocal.nombreOficial,
        visitante_nombre: equipoVisitante.nombreOficial,
        nombre_cancha: schema.canchas.nombreCancha,
        id_arbitro_principal: schema.partidos.idArbitroPrincipal,
        rol_arbitral: sql`CASE 
            WHEN ${schema.partidos.idArbitroPrincipal} = ${id_arbitro} THEN 'Principal' 
            WHEN ${schema.partidos.idArbitroAsistente1} = ${id_arbitro} THEN 'Asistente 1' 
            ELSE 'Asistente 2' 
        END`.as('rol_arbitral')
    })
    .from(schema.partidos)
    .innerJoin(schema.torneos, eq(schema.partidos.idTorneo, schema.torneos.idTorneo))
    .innerJoin(equipoLocal, eq(schema.partidos.idEquipoLocal, equipoLocal.idEquipo))
    .innerJoin(equipoVisitante, eq(schema.partidos.idEquipoVisitante, equipoVisitante.idEquipo))
    .innerJoin(schema.canchas, eq(schema.partidos.idCancha, schema.canchas.idCancha))
    .where(
        and(
            or(
                eq(schema.partidos.idArbitroPrincipal, id_arbitro),
                eq(schema.partidos.idArbitroAsistente1, id_arbitro),
                eq(schema.partidos.idArbitroAsistente2, id_arbitro)
            ),
            ne(schema.partidos.estado, 'Finalizado')
        )
    )
    .orderBy(asc(schema.partidos.fecha), asc(schema.partidos.hora));

    return rows;
};

const marcarAsistenciaJugador = async (id_partido, id_jugador, estado) => {
    try {
        const partidoInfo = await db.select({ idTorneo: schema.partidos.idTorneo })
            .from(schema.partidos)
            .where(eq(schema.partidos.idPartido, id_partido))
            .limit(1);
        if (partidoInfo.length === 0) throw new Error("Partido no encontrado");
        const idTorneo = partidoInfo[0].idTorneo;

        const rosterInfo = await db.select({ idRoster: schema.rosterTorneo.idRoster })
            .from(schema.rosterTorneo)
            .innerJoin(schema.inscripciones, eq(schema.rosterTorneo.idInscripcion, schema.inscripciones.idInscripcion))
            .where(
                and(
                    eq(schema.rosterTorneo.idJugador, id_jugador),
                    eq(schema.inscripciones.idTorneo, idTorneo)
                )
            )
            .limit(1);

        if (rosterInfo.length === 0) throw new Error("El jugador no está en el roster de este torneo");
        const idRoster = rosterInfo[0].idRoster;
        if (estado === 'Presente') {
            const suspensionActiva = await db.select()
                .from(schema.resolucionesDisciplinarias)
                .innerJoin(schema.sanciones, eq(schema.resolucionesDisciplinarias.idSancion, schema.sanciones.idSancion))
                .where(
                    and(
                        eq(schema.sanciones.idJugador, id_jugador),
                        eq(schema.sanciones.idTorneo, idTorneo),
                        eq(schema.resolucionesDisciplinarias.estado, 'Activa'),
                        sql`${schema.resolucionesDisciplinarias.partidosSuspension} > ${schema.resolucionesDisciplinarias.partidosCumplidos}`
                    )
                )
                .limit(1);

            if (suspensionActiva.length > 0) {
                throw new Error("Regla_Sancion: No se puede marcar como presente a un jugador con una suspensión activa.");
            }
        }

        const asistenciaExistente = await db.select()
            .from(schema.asistenciaPartidos)
            .where(
                and(
                    eq(schema.asistenciaPartidos.idPartido, id_partido),
                    eq(schema.asistenciaPartidos.idRoster, idRoster)
                )
            )
            .limit(1);

        if (asistenciaExistente.length > 0) {
            const rows = await db.update(schema.asistenciaPartidos)
                .set({ estado: estado })
                .where(
                    and(
                        eq(schema.asistenciaPartidos.idPartido, id_partido),
                        eq(schema.asistenciaPartidos.idRoster, idRoster)
                    )
                )
                .returning();
            return rows[0];
        } else {
            const rows = await db.insert(schema.asistenciaPartidos)
                .values({
                    idPartido: id_partido,
                    idRoster: idRoster,
                    estado: estado
                })
                .returning();
            return rows[0];
        }
    } catch (error) {
        console.error("Error en marcarAsistenciaJugador:", error);
        throw error;
    }
};
const obtenerAlineacionPartido = async (id_partido, id_equipo) => {
    const partidoInfo = await db.select({ idTorneo: schema.partidos.idTorneo })
        .from(schema.partidos)
        .where(eq(schema.partidos.idPartido, id_partido))
        .limit(1);
        
    if (partidoInfo.length === 0) return [];
    const idTorneo = partidoInfo[0].idTorneo;
    
    const rows = await db.select({
        id_jugador: schema.rosterTorneo.idJugador, 
        nombre: schema.jugadores.nombre,
        apellido: schema.jugadores.apellido,
        numero_camiseta: schema.rosterTorneo.numeroCamiseta, 
        es_capitan: schema.rosterTorneo.esCapitan, 
        estado_asistencia: sql`COALESCE(${schema.asistenciaPartidos.estado}, 'Pendiente')`.as('estado_asistencia'),
        esta_suspendido: sql`EXISTS (
            SELECT 1 FROM ${schema.resolucionesDisciplinarias} rd
            INNER JOIN ${schema.sanciones} s ON rd.id_sancion = s.id_sancion
            WHERE s.id_jugador = ${schema.rosterTorneo.idJugador}
              AND s.id_torneo = ${idTorneo}
              AND rd.estado = 'Activa'
              AND rd.partidos_suspension > rd.partidos_cumplidos
        )`.as('esta_suspendido')
    })
    .from(schema.rosterTorneo)
    .innerJoin(schema.jugadores, eq(schema.rosterTorneo.idJugador, schema.jugadores.idJugador))
    .innerJoin(schema.inscripciones, eq(schema.rosterTorneo.idInscripcion, schema.inscripciones.idInscripcion))
    .leftJoin(schema.asistenciaPartidos, and(
        eq(schema.rosterTorneo.idRoster, schema.asistenciaPartidos.idRoster),
        eq(schema.asistenciaPartidos.idPartido, id_partido)
    ))
    .where(
        and(
            eq(schema.inscripciones.idEquipo, id_equipo),
            eq(schema.inscripciones.idTorneo, idTorneo)
        )
    )
    .orderBy(asc(schema.rosterTorneo.numeroCamiseta));
    return rows.map(jugador => {
        if (jugador.esta_suspendido) {
            jugador.estado_asistencia = 'Inhabilitado';
        }
        return jugador;
    });
};

const actualizarEstadoPartido = async (id_partido, estado) => {
    const rows = await db.update(schema.partidos)
        .set({ estado: estado })
        .where(eq(schema.partidos.idPartido, id_partido))
        .returning();

    return rows[0];
};

const obtenerTorneosHistorial = async (id_arbitro) => {
    const rows = await db.select({
        id_torneo: schema.torneos.idTorneo,
        nombre_torneo: schema.torneos.nombreTorneo,
        categoria: schema.torneos.categoria,
        clasificacion: schema.clasificacionEquipo.descripcion,
        partidos_dirigidos: count(schema.partidos.idPartido)
    })
    .from(schema.torneos)
    .innerJoin(schema.partidos, eq(schema.torneos.idTorneo, schema.partidos.idTorneo))
    .leftJoin(schema.clasificacionEquipo, eq(schema.torneos.idClasificacion, schema.clasificacionEquipo.idClasificacion))
    .where(
        and(
            or(
                eq(schema.partidos.idArbitroPrincipal, id_arbitro),
                eq(schema.partidos.idArbitroAsistente1, id_arbitro),
                eq(schema.partidos.idArbitroAsistente2, id_arbitro)
            ),
            eq(schema.partidos.estado, 'Finalizado')
        )
    )
    .groupBy(schema.torneos.idTorneo, schema.clasificacionEquipo.descripcion)
    .orderBy(schema.torneos.nombreTorneo);

    return rows;
};

const obtenerPartidosHistorial = async (id_arbitro, id_torneo) => {
    const equipoLocal = alias(schema.equipos, 'equipo_local');
    const equipoVisitante = alias(schema.equipos, 'equipo_visitante');
    const rows = await db.select({
        id_partido: schema.partidos.idPartido,
        fecha: schema.partidos.fecha,
        hora: schema.partidos.hora,
        ronda_torneo: schema.partidos.rondaTorneo,
        estado: schema.partidos.estado,
        local_nombre: equipoLocal.nombreOficial,
        local_siglas: equipoLocal.siglas,
        visitante_nombre: equipoVisitante.nombreOficial,
        visitante_siglas: equipoVisitante.siglas,
        nombre_cancha: schema.canchas.nombreCancha,
        marcador_local: schema.partidos.marcadorLocal,
        marcador_visitante: schema.partidos.marcadorVisitante,
        rol_arbitral: sql`CASE 
            WHEN ${schema.partidos.idArbitroPrincipal} = ${id_arbitro} THEN 'Principal' 
            WHEN ${schema.partidos.idArbitroAsistente1} = ${id_arbitro} THEN 'Asistente 1' 
            ELSE 'Asistente 2' 
        END`.as('rol_arbitral')
    })
    .from(schema.partidos)
    .innerJoin(equipoLocal, eq(schema.partidos.idEquipoLocal, equipoLocal.idEquipo))
    .innerJoin(equipoVisitante, eq(schema.partidos.idEquipoVisitante, equipoVisitante.idEquipo))
    .innerJoin(schema.canchas, eq(schema.partidos.idCancha, schema.canchas.idCancha))
    .where(
        and(
            or(
                eq(schema.partidos.idArbitroPrincipal, id_arbitro),
                eq(schema.partidos.idArbitroAsistente1, id_arbitro),
                eq(schema.partidos.idArbitroAsistente2, id_arbitro)
            ),
            eq(schema.partidos.idTorneo, id_torneo),
            eq(schema.partidos.estado, 'Finalizado')
        )
    )
    .orderBy(desc(schema.partidos.fecha), desc(schema.partidos.hora));

    return rows;
};

const obtenerResumenFinalizado = async (id_partido) => {
    const partidoInfo = await db.select({ idTorneo: schema.partidos.idTorneo })
        .from(schema.partidos)
        .where(eq(schema.partidos.idPartido, id_partido))
        .limit(1);
    const idTorneo = partidoInfo[0]?.idTorneo;

    const informeRows = await db.select({ contenido: schema.informesPartido.contenido })
        .from(schema.informesPartido)
        .where(eq(schema.informesPartido.idPartido, id_partido))
        .limit(1);
        
    const sancionesRows = await db.select({
        tipo_sancion: schema.sanciones.tipoSancion,
        motivo: schema.sanciones.motivo,
        nombre: schema.jugadores.nombre,
        apellido: schema.jugadores.apellido,
        equipo: schema.equipos.nombreOficial
    })
    .from(schema.sanciones)
    .innerJoin(schema.jugadores, eq(schema.sanciones.idJugador, schema.jugadores.idJugador))
    .innerJoin(schema.rosterTorneo, eq(schema.jugadores.idJugador, schema.rosterTorneo.idJugador))
    .innerJoin(schema.inscripciones, and(
        eq(schema.rosterTorneo.idInscripcion, schema.inscripciones.idInscripcion),
        eq(schema.inscripciones.idTorneo, idTorneo)
    ))
    .innerJoin(schema.equipos, eq(schema.inscripciones.idEquipo, schema.equipos.idEquipo))
    .where(eq(schema.sanciones.idPartido, id_partido));

    return {
        informe: informeRows.length > 0 ? informeRows[0].contenido : null,
        sanciones: sancionesRows
    };
};

const obtenerEvaluaciones = async (id_arbitro) => {
    const evaluador = alias(schema.usuarios, 'evaluador');
    const equipoLocal = alias(schema.equipos, 'equipo_local');
    const equipoVisitante = alias(schema.equipos, 'equipo_visitante');

    const rows = await db.select({
        id_evaluacion: schema.evaluacionesArbitro.idEvaluacion,
        puntuacion: schema.evaluacionesArbitro.puntuacion,
        comentarios: schema.evaluacionesArbitro.comentarios,
        fecha_evaluacion: schema.evaluacionesArbitro.fechaEvaluacion,
        respuesta_arbitro: schema.evaluacionesArbitro.respuestaArbitro,
        fecha_respuesta: schema.evaluacionesArbitro.fechaRespuesta,
        evaluador_nombre: evaluador.nombre,
        evaluador_apellido: evaluador.apellido,
        fecha: schema.partidos.fecha,
        hora: schema.partidos.hora,
        local_nombre: equipoLocal.nombreOficial,
        visitante_nombre: equipoVisitante.nombreOficial,
        nombre_torneo: schema.torneos.nombreTorneo
    })
    .from(schema.evaluacionesArbitro)
    .innerJoin(evaluador, eq(schema.evaluacionesArbitro.idEvaluador, evaluador.idUsuario))
    .innerJoin(schema.informesPartido, eq(schema.evaluacionesArbitro.idInforme, schema.informesPartido.idInforme))
    .innerJoin(schema.partidos, eq(schema.informesPartido.idPartido, schema.partidos.idPartido))
    .innerJoin(schema.torneos, eq(schema.partidos.idTorneo, schema.torneos.idTorneo))
    .innerJoin(equipoLocal, eq(schema.partidos.idEquipoLocal, equipoLocal.idEquipo))
    .innerJoin(equipoVisitante, eq(schema.partidos.idEquipoVisitante, equipoVisitante.idEquipo))
    .where(eq(schema.evaluacionesArbitro.idArbitro, id_arbitro))
    .orderBy(desc(schema.evaluacionesArbitro.fechaEvaluacion));

    return rows;
};

const responderEvaluacion = async (id_evaluacion, respuesta) => {
    const rows = await db.update(schema.evaluacionesArbitro)
        .set({
            respuestaArbitro: respuesta,
            fechaRespuesta: sql`CURRENT_TIMESTAMP`
        })
        .where(eq(schema.evaluacionesArbitro.idEvaluacion, id_evaluacion))
        .returning();

    return rows[0];
};

const obtenerPromedioArbitro = async (id_arbitro) => {
    const rows = await db.select({
        promedio: sql`COALESCE(ROUND(AVG(${schema.evaluacionesArbitro.puntuacion}), 1), 0)`.as('promedio'),
        total_evaluaciones: count(schema.evaluacionesArbitro.idEvaluacion)
    })
    .from(schema.evaluacionesArbitro)
    .where(eq(schema.evaluacionesArbitro.idArbitro, id_arbitro));

    return rows[0];
};

module.exports = {
    obtenerTorneosAsignados,
    obtenerPartidosPorTorneo,
    obtenerDetallePartido,
    obtenerTodosPartidosAsignados,
    marcarAsistenciaJugador,
    obtenerAlineacionPartido,
    actualizarEstadoPartido,
    obtenerTorneosHistorial,
    obtenerPartidosHistorial,
    obtenerResumenFinalizado,
    obtenerEvaluaciones,
    responderEvaluacion,
    obtenerPromedioArbitro
};