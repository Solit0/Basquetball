const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, or, desc, asc, sql } = require('drizzle-orm');
const { alias } = require('drizzle-orm/pg-core');

const crearMultiples = async (partidos) => {
    if (partidos.length === 0) return [];

    return await db.transaction(async (tx) => {
        const resultados = [];
        const idTorneo = partidos[0].id_torneo;
        
        const torneoInfo = await tx.select({
            fecha_inicio: schema.torneos.fechaInicio,
            fecha_fin: schema.torneos.fechaFin
        })
        .from(schema.torneos)
        .where(eq(schema.torneos.idTorneo, idTorneo));

        if (torneoInfo.length === 0) throw new Error('El torneo no existe.');
        
        const { fecha_inicio, fecha_fin } = torneoInfo[0];

        const formatYYYYMMDD = (d) => {
            const date = new Date(d);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const limiteInicio = formatYYYYMMDD(fecha_inicio);
        const limiteFin = formatYYYYMMDD(fecha_fin);

        for (const p of partidos) {
            if (!p.id_cancha) {
                throw new Error(`El equipo local "${p.local_nombre}" no tiene cancha. Asignale una.`);
            }
            if (!p.id_arbitro_principal) {
                throw new Error(`Falta asignar un árbitro para el partido de ${p.local_nombre} vs ${p.visitante_nombre}.`);
            }

            if (p.fecha < limiteInicio || p.fecha > limiteFin) {
                throw new Error(`REGLA_TORNEO: La fecha elegida (${p.fecha}) para ${p.local_nombre} vs ${p.visitante_nombre} está fuera del rango (${limiteInicio} al ${limiteFin}).`);
            }
            
            const [nuevoPartido] = await tx.insert(schema.partidos)
                .values({
                    idTorneo: p.id_torneo,
                    idEquipoLocal: p.id_equipo_local,
                    idEquipoVisitante: p.id_equipo_visitante,
                    idCancha: p.id_cancha,
                    fecha: p.fecha,
                    hora: p.hora,
                    rondaTorneo: p.ronda_torneo,
                    idArbitroPrincipal: p.id_arbitro_principal
                })
                .returning();
                
            resultados.push(nuevoPartido);
        }
        
        await tx.update(schema.torneos)
            .set({ estado: 'En curso' })
            .where(eq(schema.torneos.idTorneo, idTorneo));

        return resultados;
    });
};

const obtenerPorTorneo = async (id_torneo) => {
    const equipoLocal = alias(schema.equipos, 'equipo_local');
    const equipoVisitante = alias(schema.equipos, 'equipo_visitante');

    const rows = await db.select({
        id_partido: schema.partidos.idPartido,
        id_torneo: schema.partidos.idTorneo,
        id_equipo_local: schema.partidos.idEquipoLocal,
        id_equipo_visitante: schema.partidos.idEquipoVisitante,
        id_cancha: schema.partidos.idCancha,
        id_arbitro_principal: schema.partidos.idArbitroPrincipal,
        fecha: schema.partidos.fecha,
        hora: schema.partidos.hora,
        ronda_torneo: schema.partidos.rondaTorneo,
        estado: schema.partidos.estado,
        marcador_local: schema.partidos.marcadorLocal,
        marcador_visitante: schema.partidos.marcadorVisitante,
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
    .where(eq(schema.partidos.idTorneo, id_torneo))
    .orderBy(asc(schema.partidos.fecha), asc(schema.partidos.hora));

    return rows;
};

const obtenerResumenPartido = async (id_partido) => {

    const resPuntos = await db.select({
        puntos_anotados: schema.estadisticasPartido.puntosAnotados,
        nombre: schema.jugadores.nombre,
        apellido: schema.jugadores.apellido,
        id_equipo: schema.plantillaEquipo.idEquipo,
        numero_camiseta: schema.plantillaEquipo.numeroCamiseta
    })
    .from(schema.estadisticasPartido)
    .innerJoin(schema.jugadores, eq(schema.estadisticasPartido.idJugador, schema.jugadores.idJugador))
    .innerJoin(schema.plantillaEquipo, eq(schema.jugadores.idJugador, schema.plantillaEquipo.idJugador))
    .where(eq(schema.estadisticasPartido.idPartido, id_partido))
    .orderBy(desc(schema.estadisticasPartido.puntosAnotados));

    const resSanciones = await db.select({
        tipo_sancion: schema.sanciones.tipoSancion,
        motivo: schema.sanciones.motivo,
        fecha_fin: schema.sanciones.fechaFin,
        nombre: schema.jugadores.nombre,
        apellido: schema.jugadores.apellido,
        numero_camiseta: schema.plantillaEquipo.numeroCamiseta,
        id_equipo: schema.plantillaEquipo.idEquipo
    })
    .from(schema.sanciones)
    .innerJoin(schema.jugadores, eq(schema.sanciones.idJugador, schema.jugadores.idJugador))
    .innerJoin(schema.plantillaEquipo, eq(schema.jugadores.idJugador, schema.plantillaEquipo.idJugador))
    .where(eq(schema.sanciones.idPartido, id_partido));

    const resInforme = await db.select({ contenido: schema.informesPartido.contenido })
        .from(schema.informesPartido)
        .where(eq(schema.informesPartido.idPartido, id_partido))
        .limit(1);

    return {
        anotaciones: resPuntos,
        sanciones: resSanciones,
        informe: resInforme.length > 0 ? resInforme[0].contenido : 'No se redactó informe.'
    };
};

const finalizarPartido = async (id_partido, datosResultado) => {
    const { 
        marcador_local, marcador_visitante, id_arbitro, 
        informe_contenido, incidentes, sanciones, puntos_jugadores,
        id_torneo, id_equipo_local, id_equipo_visitante
    } = datosResultado;

    return await db.transaction(async (tx) => {

        await tx.update(schema.partidos)
            .set({
                marcadorLocal: marcador_local,
                marcadorVisitante: marcador_visitante,
                idArbitroPrincipal: id_arbitro,
                estado: 'Finalizado'
            })
            .where(eq(schema.partidos.idPartido, id_partido));

        const id_perdedor = marcador_local < marcador_visitante ? id_equipo_local : id_equipo_visitante;
        await tx.update(schema.inscripciones)
            .set({ estadoInscripcion: 'Eliminado' })
            .where(
                and(
                    eq(schema.inscripciones.idTorneo, id_torneo),
                    eq(schema.inscripciones.idEquipo, id_perdedor)
                )
            );

        const [nuevoInforme] = await tx.insert(schema.informesPartido)
            .values({
                idPartido: id_partido,
                idArbitro: id_arbitro,
                contenido: informe_contenido,
                enviado: true
            })
            .returning({ id_informe: schema.informesPartido.idInforme });
            
        const id_informe = nuevoInforme.id_informe;

        if (incidentes && incidentes.length > 0) {
            const incidentesData = incidentes.map(inc => ({
                idInforme: id_informe,
                tipoIncidente: inc.tipo_incidente,
                minutoAprox: inc.minuto_aprox,
                descripcionBreve: inc.descripcion_breve
            }));
            await tx.insert(schema.incidentes).values(incidentesData);
        }

        // 5. Registrar Sanciones (Bulk Insert)
        if (sanciones && sanciones.length > 0) {
            const sancionesData = sanciones.map(san => ({
                idJugador: san.id_jugador,
                idTorneo: id_torneo,
                idPartido: id_partido,
                motivo: san.motivo,
                fechaInicio: san.fecha_inicio,
                fechaFin: san.fecha_fin,
                tipoSancion: san.tipo_sancion
            }));
            await tx.insert(schema.sanciones).values(sancionesData);
        }

        if (puntos_jugadores && puntos_jugadores.length > 0) {
            const puntosData = puntos_jugadores
                .filter(pj => pj.puntos > 0)
                .map(pj => ({
                    idPartido: id_partido,
                    idJugador: pj.id_jugador,
                    puntosAnotados: pj.puntos
                }));
            
            if (puntosData.length > 0) {
                await tx.insert(schema.estadisticasPartido).values(puntosData);
            }
        }

        return { mensaje: 'Partido finalizado, informe guardado y perdedor eliminado.' };
    });
};

const obtenerHistorialEquipo = async (id_entrenador) => {
    const equipoLocal = alias(schema.equipos, 'equipo_local');
    const equipoVisitante = alias(schema.equipos, 'equipo_visitante');

    const rows = await db.select({
        id_partido: schema.partidos.idPartido,
        nombre_torneo: schema.torneos.nombreTorneo,
        local_nombre: equipoLocal.nombreOficial,
        visitante_nombre: equipoVisitante.nombreOficial,
        id_equipo_local: schema.partidos.idEquipoLocal,
        id_equipo_visitante: schema.partidos.idEquipoVisitante,
        marcador_local: schema.partidos.marcadorLocal,
        marcador_visitante: schema.partidos.marcadorVisitante,
        fecha: schema.partidos.fecha,
        hora: schema.partidos.hora,
        id_arbitro_principal: schema.partidos.idArbitroPrincipal,
        id_informe: schema.informesPartido.idInforme,
        informe_contenido: schema.informesPartido.contenido,
        id_evaluacion: schema.evaluacionesArbitro.idEvaluacion,
        puntuacion: schema.evaluacionesArbitro.puntuacion,
        comentarios: schema.evaluacionesArbitro.comentarios,
        respuesta_arbitro: schema.evaluacionesArbitro.respuestaArbitro,
        
        sanciones_partido: sql`(
            SELECT COALESCE(json_agg(json_build_object(
                'tipo_sancion', s.tipo_sancion,
                'motivo', s.motivo,
                'nombre_jugador', j.nombre,
                'apellido_jugador', j.apellido,
                'id_equipo', pe.id_equipo
            )), '[]'::json)
            FROM sanciones s
            JOIN jugadores j ON s.id_jugador = j.id_jugador
            JOIN plantilla_equipo pe ON j.id_jugador = pe.id_jugador AND pe.activo = true
            WHERE s.id_partido = ${schema.partidos.idPartido}
        )`.as('sanciones_partido')
    })
    .from(schema.partidos)
    .innerJoin(schema.torneos, eq(schema.partidos.idTorneo, schema.torneos.idTorneo))
    .innerJoin(equipoLocal, eq(schema.partidos.idEquipoLocal, equipoLocal.idEquipo))
    .innerJoin(equipoVisitante, eq(schema.partidos.idEquipoVisitante, equipoVisitante.idEquipo))
    .leftJoin(schema.informesPartido, eq(schema.partidos.idPartido, schema.informesPartido.idPartido))
    .leftJoin(schema.evaluacionesArbitro, and(
        eq(schema.informesPartido.idInforme, schema.evaluacionesArbitro.idInforme),
        eq(schema.evaluacionesArbitro.idEvaluador, id_entrenador)
    ))
    .where(
        and(
            or(
                eq(equipoLocal.idEntrenador, id_entrenador),
                eq(equipoVisitante.idEntrenador, id_entrenador)
            ),
            eq(schema.partidos.estado, 'Finalizado')
        )
    )
    .orderBy(desc(schema.partidos.fecha), desc(schema.partidos.hora));

    return rows;
};

const guardarEvaluacion = async (datosEval) => {
    const rows = await db.insert(schema.evaluacionesArbitro)
        .values({
            idInforme: datosEval.id_informe,
            idArbitro: datosEval.id_arbitro,
            idEvaluador: datosEval.id_evaluador,
            puntuacion: datosEval.puntuacion,
            comentarios: datosEval.comentarios
        })
        .returning();
        
    return rows[0];
};

const obtenerPartidosPublicos = async () => {
    const equipoLocal = alias(schema.equipos, 'equipo_local');
    const equipoVisitante = alias(schema.equipos, 'equipo_visitante');
    const arbitro = alias(schema.usuarios, 'arbitro');

    const rows = await db.select({
        id_partido: schema.partidos.idPartido,
        fecha: schema.partidos.fecha,
        hora: schema.partidos.hora,
        estado: schema.partidos.estado,
        ronda_torneo: schema.partidos.rondaTorneo,
        marcador_local: schema.partidos.marcadorLocal,
        marcador_visitante: schema.partidos.marcadorVisitante,
        nombre_torneo: schema.torneos.nombreTorneo,
        id_local: equipoLocal.idEquipo,
        local_nombre: equipoLocal.nombreOficial,
        local_siglas: equipoLocal.siglas,
        id_visitante: equipoVisitante.idEquipo,
        visitante_nombre: equipoVisitante.nombreOficial,
        visitante_siglas: equipoVisitante.siglas,
        nombre_cancha: schema.canchas.nombreCancha,
        arbitro_nombre: arbitro.nombre,
        arbitro_apellido: arbitro.apellido
    })
    .from(schema.partidos)
    .innerJoin(schema.torneos, eq(schema.partidos.idTorneo, schema.torneos.idTorneo))
    .innerJoin(equipoLocal, eq(schema.partidos.idEquipoLocal, equipoLocal.idEquipo))
    .innerJoin(equipoVisitante, eq(schema.partidos.idEquipoVisitante, equipoVisitante.idEquipo))
    .innerJoin(schema.canchas, eq(schema.partidos.idCancha, schema.canchas.idCancha))
    .leftJoin(arbitro, eq(schema.partidos.idArbitroPrincipal, arbitro.idUsuario))
    .orderBy(desc(schema.partidos.fecha), desc(schema.partidos.hora));

    return rows;
};

const obtenerFichaTecnicaPublica = async (id_partido) => {
    
    const partidoInfo = await db.select({
        id_equipo_local: schema.partidos.idEquipoLocal,
        id_equipo_visitante: schema.partidos.idEquipoVisitante
    })
    .from(schema.partidos)
    .where(eq(schema.partidos.idPartido, id_partido))
    .limit(1);
    
    if (partidoInfo.length === 0) throw new Error("Partido no encontrado");
    const { id_equipo_local, id_equipo_visitante } = partidoInfo[0];

    const getAlineacion = async (idEquipo) => {
        return await db.select({
            id_jugador: schema.plantillaEquipo.idJugador,
            estado_asistencia: sql`COALESCE(${schema.asistenciaPartidos.estado}, 'Ausente')`.as('estado_asistencia'),
            puntos_anotados: sql`COALESCE(${schema.estadisticasPartido.puntosAnotados}, 0)`.as('puntos_anotados'),
            rol_partido: sql`COALESCE(${schema.alineaciones.rolPartido}, ${schema.plantillaEquipo.rolEquipo}, 'Suplente')`.as('rol_partido'),
            nombre: schema.jugadores.nombre,
            apellido: schema.jugadores.apellido,
            numero_camiseta: schema.plantillaEquipo.numeroCamiseta,
            es_capitan: schema.plantillaEquipo.esCapitan
        })
        .from(schema.plantillaEquipo)
        .innerJoin(schema.jugadores, eq(schema.plantillaEquipo.idJugador, schema.jugadores.idJugador))
        .leftJoin(schema.asistenciaPartidos, and(
            eq(schema.plantillaEquipo.idJugador, schema.asistenciaPartidos.idJugador),
            eq(schema.asistenciaPartidos.idPartido, id_partido)
        ))
        .leftJoin(schema.estadisticasPartido, and(
            eq(schema.plantillaEquipo.idJugador, schema.estadisticasPartido.idJugador),
            eq(schema.estadisticasPartido.idPartido, id_partido)
        ))
        .leftJoin(schema.alineaciones, and(
            eq(schema.plantillaEquipo.idJugador, schema.alineaciones.idJugador),
            eq(schema.alineaciones.idPartido, id_partido)
        ))
        .where(
            and(
                eq(schema.plantillaEquipo.idEquipo, idEquipo),
                eq(schema.plantillaEquipo.activo, true)
            )
        )
        .orderBy(asc(schema.plantillaEquipo.numeroCamiseta));
    };

    const alineacionLocal = await getAlineacion(id_equipo_local);
    const alineacionVisitante = await getAlineacion(id_equipo_visitante);

    const sanciones = await db.select({
        tipo_sancion: schema.sanciones.tipoSancion,
        motivo: schema.sanciones.motivo,
        nombre_jugador: schema.jugadores.nombre,
        apellido_jugador: schema.jugadores.apellido,
        equipo_nombre: schema.equipos.nombreOficial
    })
    .from(schema.sanciones)
    .innerJoin(schema.jugadores, eq(schema.sanciones.idJugador, schema.jugadores.idJugador))
    .innerJoin(schema.plantillaEquipo, and(
        eq(schema.jugadores.idJugador, schema.plantillaEquipo.idJugador),
        eq(schema.plantillaEquipo.activo, true)
    ))
    .innerJoin(schema.equipos, eq(schema.plantillaEquipo.idEquipo, schema.equipos.idEquipo))
    .where(eq(schema.sanciones.idPartido, id_partido));

    return {
        alineacionLocal,
        alineacionVisitante,
        sanciones
    };
};

module.exports = { 
    crearMultiples, 
    obtenerPorTorneo, 
    finalizarPartido, 
    obtenerResumenPartido, 
    obtenerHistorialEquipo, 
    guardarEvaluacion, 
    obtenerPartidosPublicos, 
    obtenerFichaTecnicaPublica 
};