const { db } = require('../Config/index');
const schema = require('../models/schema');
// Importamos los operadores necesarios de Drizzle
const { eq, and, ne, notInArray, desc, asc, count, sql } = require('drizzle-orm');
// Importamos alias para poder hacer JOIN a la misma tabla dos veces
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
            eq(schema.partidos.idArbitroPrincipal, id_arbitro),
            ne(schema.partidos.estado, 'Finalizado'),
            notInArray(schema.torneos.estado, ['Cancelado', 'Archivado'])
        )
    )
    .groupBy(schema.torneos.idTorneo, schema.clasificacionEquipo.descripcion)
    .orderBy(desc(schema.torneos.fechaInicio));

    return rows;
};

const obtenerPartidosPorTorneo = async (id_arbitro, id_torneo) => {
    // Creamos alias para la tabla equipos (Local y Visitante)
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
        nombre_cancha: schema.canchas.nombreCancha
    })
    .from(schema.partidos)
    .innerJoin(equipoLocal, eq(schema.partidos.idEquipoLocal, equipoLocal.idEquipo))
    .innerJoin(equipoVisitante, eq(schema.partidos.idEquipoVisitante, equipoVisitante.idEquipo))
    .innerJoin(schema.canchas, eq(schema.partidos.idCancha, schema.canchas.idCancha))
    .where(
        and(
            eq(schema.partidos.idArbitroPrincipal, id_arbitro),
            eq(schema.partidos.idTorneo, id_torneo),
            ne(schema.partidos.estado, 'Finalizado')
        )
    )
    .orderBy(asc(schema.partidos.fecha), asc(schema.partidos.hora));

    return rows;
};

const obtenerDetallePartido = async (id_arbitro, id_partido) => {
    // Alias para equipos y para los usuarios (entrenadores)
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
        cancha_direccion: schema.canchas.direccion
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
            eq(schema.partidos.idArbitroPrincipal, id_arbitro)
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
        nombre_cancha: schema.canchas.nombreCancha
    })
    .from(schema.partidos)
    .innerJoin(schema.torneos, eq(schema.partidos.idTorneo, schema.torneos.idTorneo))
    .innerJoin(equipoLocal, eq(schema.partidos.idEquipoLocal, equipoLocal.idEquipo))
    .innerJoin(equipoVisitante, eq(schema.partidos.idEquipoVisitante, equipoVisitante.idEquipo))
    .innerJoin(schema.canchas, eq(schema.partidos.idCancha, schema.canchas.idCancha))
    .where(
        and(
            eq(schema.partidos.idArbitroPrincipal, id_arbitro),
            ne(schema.partidos.estado, 'Finalizado')
        )
    )
    .orderBy(asc(schema.partidos.fecha), asc(schema.partidos.hora));

    return rows;
};

const marcarAsistenciaJugador = async (id_partido, id_jugador, estado) => {
    const rows = await db.insert(schema.asistenciaPartidos)
        .values({
            idPartido: id_partido,
            idJugador: id_jugador,
            estado: estado
        })
        .onConflictDoUpdate({
            // Definimos la llave primaria compuesta como objetivo del conflicto
            target: [schema.asistenciaPartidos.idPartido, schema.asistenciaPartidos.idJugador],
            set: { estado: estado }
        })
        .returning();

    return rows[0];
};

const obtenerAlineacionPartido = async (id_partido, id_equipo) => {
    const rows = await db.select({
        id_jugador: schema.jugadores.idJugador,
        nombre: schema.jugadores.nombre,
        apellido: schema.jugadores.apellido,
        numero_camiseta: schema.plantillaEquipo.numeroCamiseta,
        es_capitan: schema.plantillaEquipo.esCapitan,
        // Usamos sql`` literal para el COALESCE
        estado_asistencia: sql`COALESCE(${schema.asistenciaPartidos.estado}, 'Pendiente')`.as('estado_asistencia')
    })
    .from(schema.jugadores)
    .innerJoin(schema.plantillaEquipo, eq(schema.jugadores.idJugador, schema.plantillaEquipo.idJugador))
    .leftJoin(schema.asistenciaPartidos, and(
        eq(schema.jugadores.idJugador, schema.asistenciaPartidos.idJugador),
        eq(schema.asistenciaPartidos.idPartido, id_partido)
    ))
    .where(
        and(
            eq(schema.plantillaEquipo.idEquipo, id_equipo),
            eq(schema.plantillaEquipo.activo, true)
        )
    )
    .orderBy(asc(schema.plantillaEquipo.numeroCamiseta));

    return rows;
};

const actualizarEstadoPartido = async (id_partido, estado) => {
    const rows = await db.update(schema.partidos)
        .set({ estado: estado })
        .where(eq(schema.partidos.idPartido, id_partido))
        .returning();

    return rows[0];
};

const obtenerTorneosHistorial = async (id_arbitro) => {
    // Usamos el GROUP BY en lugar del DISTINCT y PARTITION OVER del raw SQL original
    // Drizzle y Postgres resuelven esto de forma mucho más limpia
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
            eq(schema.partidos.idArbitroPrincipal, id_arbitro),
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
        marcador_visitante: schema.partidos.marcadorVisitante
    })
    .from(schema.partidos)
    .innerJoin(equipoLocal, eq(schema.partidos.idEquipoLocal, equipoLocal.idEquipo))
    .innerJoin(equipoVisitante, eq(schema.partidos.idEquipoVisitante, equipoVisitante.idEquipo))
    .innerJoin(schema.canchas, eq(schema.partidos.idCancha, schema.canchas.idCancha))
    .where(
        and(
            eq(schema.partidos.idArbitroPrincipal, id_arbitro),
            eq(schema.partidos.idTorneo, id_torneo),
            eq(schema.partidos.estado, 'Finalizado')
        )
    )
    .orderBy(desc(schema.partidos.fecha), desc(schema.partidos.hora));

    return rows;
};

const obtenerResumenFinalizado = async (id_partido) => {
    // Primera consulta: Informe
    const informeRows = await db.select({ contenido: schema.informesPartido.contenido })
        .from(schema.informesPartido)
        .where(eq(schema.informesPartido.idPartido, id_partido))
        .limit(1);

    // Segunda consulta: Sanciones cruzando con jugadores y alineaciones
    const sancionesRows = await db.select({
        tipo_sancion: schema.sanciones.tipoSancion,
        motivo: schema.sanciones.motivo,
        nombre: schema.jugadores.nombre,
        apellido: schema.jugadores.apellido,
        equipo: schema.equipos.nombreOficial
    })
    .from(schema.sanciones)
    .innerJoin(schema.jugadores, eq(schema.sanciones.idJugador, schema.jugadores.idJugador))
    .innerJoin(schema.alineaciones, and(
        eq(schema.sanciones.idJugador, schema.alineaciones.idJugador),
        eq(schema.sanciones.idPartido, schema.alineaciones.idPartido)
    ))
    .innerJoin(schema.equipos, eq(schema.alineaciones.idEquipo, schema.equipos.idEquipo))
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