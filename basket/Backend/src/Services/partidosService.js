const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, or, desc, asc, sql, inArray, ne } = require('drizzle-orm');
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

        const arbitrosInvolucrados = new Set();
        const fechasInvolucradas = new Set();
        const asignacionesNuevas = [];

        for (const p of partidos) {
            if (!p.id_cancha) throw new Error(`El equipo local "${p.local_nombre}" no tiene cancha. Asignale una.`);
            
            if (!p.id_arbitro_principal || !p.id_arbitro_asistente1 || !p.id_arbitro_asistente2) {
                throw new Error(`Falta asignar la terna arbitral completa para el partido de ${p.local_nombre} vs ${p.visitante_nombre}.`);
            }
            
            if (p.id_arbitro_principal === p.id_arbitro_asistente1 || p.id_arbitro_principal === p.id_arbitro_asistente2 || p.id_arbitro_asistente1 === p.id_arbitro_asistente2) {
                throw new Error(`No puedes asignar a la misma persona en múltiples roles para un mismo partido.`);
            }

            if (p.fecha < limiteInicio || p.fecha > limiteFin) {
                throw new Error(`REGLA TORNEO: La fecha elegida (${p.fecha}) para ${p.local_nombre} vs ${p.visitante_nombre} está fuera del rango.`);
            }

            const arbs = [p.id_arbitro_principal, p.id_arbitro_asistente1, p.id_arbitro_asistente2];
            arbs.forEach(idArb => {
                arbitrosInvolucrados.add(idArb);
                asignacionesNuevas.push({ id_arbitro: idArb, fecha: p.fecha, hora: p.hora });
            });
            fechasInvolucradas.add(p.fecha);
        }

        const arbitrosArr = Array.from(arbitrosInvolucrados);
        
        let partidosExistentes = [];
        if (arbitrosArr.length > 0) {
            partidosExistentes = await tx.select({
                fecha: schema.partidos.fecha,
                hora: schema.partidos.hora,
                id_principal: schema.partidos.idArbitroPrincipal,
                id_asistente1: schema.partidos.idArbitroAsistente1,
                id_asistente2: schema.partidos.idArbitroAsistente2
            })
            .from(schema.partidos)
            .where(
                and(
                    ne(schema.partidos.estado, 'Finalizado'), 
                    or(
                        inArray(schema.partidos.idArbitroPrincipal, arbitrosArr),
                        inArray(schema.partidos.idArbitroAsistente1, arbitrosArr),
                        inArray(schema.partidos.idArbitroAsistente2, arbitrosArr)
                    )
                )
            );
        }

        const asignacionesGlobales = [...asignacionesNuevas];

        partidosExistentes.forEach(p => {
            const fechaDBStr = typeof p.fecha === 'string' ? p.fecha.split('T')[0] : p.fecha.toISOString().split('T')[0];
            if (fechasInvolucradas.has(fechaDBStr)) {
                if (arbitrosArr.includes(p.id_principal)) asignacionesGlobales.push({ id_arbitro: p.id_principal, fecha: fechaDBStr, hora: p.hora });
                if (arbitrosArr.includes(p.id_asistente1)) asignacionesGlobales.push({ id_arbitro: p.id_asistente1, fecha: fechaDBStr, hora: p.hora });
                if (arbitrosArr.includes(p.id_asistente2)) asignacionesGlobales.push({ id_arbitro: p.id_asistente2, fecha: fechaDBStr, hora: p.hora });
            }
        });

        const mapaHorarios = {};
        for (const a of asignacionesGlobales) {
            const key = `${a.id_arbitro}_${a.fecha}`;
            if (!mapaHorarios[key]) mapaHorarios[key] = [];
            mapaHorarios[key].push(new Date(`1970-01-01T${a.hora}`));
        }

        for (const [key, horarios] of Object.entries(mapaHorarios)) {
            if (horarios.length > 2) {
                throw new Error(`REGLA de ARBITRAJE: Uno de los árbitros de la terna esta asignado a más de 2 partidos en la misma fecha en otro torneo.`);
            }
            if (horarios.length === 2) {
                horarios.sort((a, b) => a - b);
                const diffHoras = (horarios[1] - horarios[0]) / (1000 * 60 * 60);
                if (diffHoras < 6) {
                    throw new Error(`REGLA de ARBITRAJE: Uno de los árbitros asignados tendría menos de 6 horas de descanso frente a un partido que ya tiene programado en otro torneo.`);
                }
            }
        }
        for (const p of partidos) {
            const [nuevoPartido] = await tx.insert(schema.partidos)
                .values({
                    idTorneo: p.id_torneo,
                    idEquipoLocal: p.id_equipo_local,
                    idEquipoVisitante: p.id_equipo_visitante,
                    idCancha: p.id_cancha,
                    fecha: p.fecha,
                    hora: p.hora,
                    rondaTorneo: p.ronda_torneo,
                    idArbitroPrincipal: p.id_arbitro_principal,
                    idArbitroAsistente1: p.id_arbitro_asistente1,
                    idArbitroAsistente2: p.id_arbitro_asistente2
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
        id_arbitro_asistente1: schema.partidos.idArbitroAsistente1, 
        id_arbitro_asistente2: schema.partidos.idArbitroAsistente2, 
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
    const pInfo = await db.select({ id_torneo: schema.partidos.idTorneo })
        .from(schema.partidos)
        .where(eq(schema.partidos.idPartido, id_partido))
        .limit(1);
    const idTorneo = pInfo[0]?.id_torneo;

    const resPuntos = await db.select({
        puntos_anotados: schema.estadisticasPartido.puntosAnotados,
        nombre: schema.jugadores.nombre,
        apellido: schema.jugadores.apellido,
        id_equipo: schema.inscripciones.idEquipo,
        numero_camiseta: schema.rosterTorneo.numeroCamiseta
    })
    .from(schema.estadisticasPartido)
    .innerJoin(schema.rosterTorneo, eq(schema.estadisticasPartido.idRoster, schema.rosterTorneo.idRoster))
    .innerJoin(schema.jugadores, eq(schema.rosterTorneo.idJugador, schema.jugadores.idJugador))
    .innerJoin(schema.inscripciones, eq(schema.rosterTorneo.idInscripcion, schema.inscripciones.idInscripcion))
    .where(eq(schema.estadisticasPartido.idPartido, id_partido))
    .orderBy(desc(schema.estadisticasPartido.puntosAnotados));

    const resSanciones = await db.select({
        tipo_sancion: schema.sanciones.tipoSancion,
        motivo: schema.sanciones.motivo,
        nombre: schema.jugadores.nombre,
        apellido: schema.jugadores.apellido,
        numero_camiseta: schema.rosterTorneo.numeroCamiseta,
        id_equipo: schema.inscripciones.idEquipo,
        estado_resolucion: schema.sanciones.estadoResolucion 
    })
    .from(schema.sanciones)
    .innerJoin(schema.jugadores, eq(schema.sanciones.idJugador, schema.jugadores.idJugador))
    .innerJoin(schema.rosterTorneo, eq(schema.jugadores.idJugador, schema.rosterTorneo.idJugador))
    .innerJoin(schema.inscripciones, and(
        eq(schema.rosterTorneo.idInscripcion, schema.inscripciones.idInscripcion), 
        eq(schema.inscripciones.idTorneo, idTorneo)
    ))
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

    try {
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

            if (sanciones && sanciones.length > 0) {
                
                const tiposValidos = [
                    'Conducta Antideportiva', 
                    'Agresión Física', 
                    'Acumulación de Faltas Técnicas', 
                    'Falta Flagrante', 
                    'Otro'
                ];

                const sancionesData = sanciones.map(san => {
                    if (!tiposValidos.includes(san.tipo_sancion)) {
                        throw new Error(`El tipo de sanción '${san.tipo_sancion}' no es válido o fue manipulado.`);
                    }
                    return {
                        idJugador: san.id_jugador,
                        idTorneo: id_torneo,
                        idPartido: id_partido,
                        motivo: san.motivo,
                        tipoSancion: san.tipo_sancion,
                        estadoResolucion: 'Pendiente' 
                    };
                });
                await tx.insert(schema.sanciones).values(sancionesData);
                for (const san of sancionesData) {
                    const rosterInfo = await tx.select({ id_roster: schema.rosterTorneo.idRoster })
                        .from(schema.rosterTorneo)
                        .innerJoin(schema.inscripciones, eq(schema.rosterTorneo.idInscripcion, schema.inscripciones.idInscripcion))
                        .where(
                            and(
                                eq(schema.rosterTorneo.idJugador, san.idJugador),
                                eq(schema.inscripciones.idTorneo, id_torneo)
                            )
                        )
                        .limit(1);

                    if (rosterInfo.length > 0) {
                        await tx.update(schema.rosterTorneo)
                            .set({ 
                                rolRoster: 'Suplente', 
                                esCapitan: false 
                            })
                            .where(eq(schema.rosterTorneo.idRoster, rosterInfo[0].id_roster));
                    }
                }
            }

            if (puntos_jugadores && puntos_jugadores.length > 0) {
                const rosters = await tx.select({
                    id_jugador: schema.rosterTorneo.idJugador,
                    id_roster: schema.rosterTorneo.idRoster
                })
                .from(schema.rosterTorneo)
                .innerJoin(schema.inscripciones, eq(schema.rosterTorneo.idInscripcion, schema.inscripciones.idInscripcion))
                .where(eq(schema.inscripciones.idTorneo, id_torneo));
                
                const mapaRosters = {};
                rosters.forEach(r => {
                    mapaRosters[r.id_jugador] = r.id_roster;
                });
                
                const puntosData = puntos_jugadores
                    .filter(pj => pj.puntos > 0)
                    .map(pj => {
                        const rosterCorrecto = mapaRosters[pj.id_jugador];
                        if (!rosterCorrecto) {
                            throw new Error(`El jugador ${pj.id_jugador} que anotó puntos no pertenece al roster de este torneo.`);
                        }
                        
                        return {
                            idPartido: id_partido,
                            idRoster: rosterCorrecto, 
                            puntosAnotados: pj.puntos
                        };
                    });
                
                if (puntosData.length > 0) {
                    await tx.insert(schema.estadisticasPartido).values(puntosData);
                }
            }

            return { mensaje: 'Partido finalizado, informe guardado, castigos preventivos aplicados y perdedor eliminado.' };
        });
    } catch (error) {
        console.error("Mensaje principal:", error.message);
        if (error.cause) {
            console.error("Causa (PostgresError):", error.cause.message);
            console.error("Detalle:", error.cause.detail);
        }
        throw error;
    }
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
                'id_equipo', i.id_equipo
            )), '[]'::json)
            FROM sanciones s
            JOIN jugadores j ON s.id_jugador = j.id_jugador
            JOIN roster_torneo rt ON j.id_jugador = rt.id_jugador
            JOIN inscripciones i ON rt.id_inscripcion = i.id_inscripcion AND i.id_torneo = ${schema.partidos.idTorneo}
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
        id_torneo: schema.partidos.idTorneo, 
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
        id_torneo: schema.partidos.idTorneo, 
        id_equipo_local: schema.partidos.idEquipoLocal,
        id_equipo_visitante: schema.partidos.idEquipoVisitante
    })
    .from(schema.partidos)
    .where(eq(schema.partidos.idPartido, id_partido))
    .limit(1);
    
    if (partidoInfo.length === 0) throw new Error("Partido no encontrado");
    const { id_torneo, id_equipo_local, id_equipo_visitante } = partidoInfo[0];

    const getAlineacion = async (idEquipo) => {
        return await db.select({
            id_jugador: schema.rosterTorneo.idJugador,
            estado_asistencia: sql`COALESCE(${schema.asistenciaPartidos.estado}, 'Ausente')`.as('estado_asistencia'),
            puntos_anotados: sql`COALESCE(${schema.estadisticasPartido.puntosAnotados}, 0)`.as('puntos_anotados'),
            rol_partido: schema.rosterTorneo.rolRoster, 
            nombre: schema.jugadores.nombre,
            apellido: schema.jugadores.apellido,
            numero_camiseta: schema.rosterTorneo.numeroCamiseta,
            es_capitan: schema.rosterTorneo.esCapitan
        })
        .from(schema.rosterTorneo)
        .innerJoin(schema.inscripciones, eq(schema.rosterTorneo.idInscripcion, schema.inscripciones.idInscripcion))
        .innerJoin(schema.jugadores, eq(schema.rosterTorneo.idJugador, schema.jugadores.idJugador))
        
        .leftJoin(schema.asistenciaPartidos, and(
            eq(schema.rosterTorneo.idRoster, schema.asistenciaPartidos.idRoster),
            eq(schema.asistenciaPartidos.idPartido, id_partido)
        ))
        
        .leftJoin(schema.estadisticasPartido, and(
            eq(schema.rosterTorneo.idRoster, schema.estadisticasPartido.idRoster),
            eq(schema.estadisticasPartido.idPartido, id_partido)
        ))
        .where(
            and(
                eq(schema.inscripciones.idEquipo, idEquipo),
                eq(schema.inscripciones.idTorneo, id_torneo)
            )
        )
        .orderBy(asc(schema.rosterTorneo.numeroCamiseta));
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
    .innerJoin(schema.rosterTorneo, eq(schema.jugadores.idJugador, schema.rosterTorneo.idJugador))
    .innerJoin(schema.inscripciones, and(
        eq(schema.rosterTorneo.idInscripcion, schema.inscripciones.idInscripcion),
        eq(schema.inscripciones.idTorneo, id_torneo)
    ))
    .innerJoin(schema.equipos, eq(schema.inscripciones.idEquipo, schema.equipos.idEquipo))
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