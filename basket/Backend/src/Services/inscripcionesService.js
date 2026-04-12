const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, sql, inArray, notInArray,asc } = require('drizzle-orm');

const calcularEdadEnFecha = (fechaNacimiento, fechaReferencia) => {
    const nacimiento = new Date(fechaNacimiento);
    const referencia = new Date(fechaReferencia);
    let edad = referencia.getFullYear() - nacimiento.getFullYear();
    const mes = referencia.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && referencia.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
};

const solicitarInscripcion = async (id_torneo, id_entrenador, roster_enviado) => {
    try {
        return await db.transaction(async (tx) => {
            
            const equipoResult = await tx.select({ 
                id_equipo: schema.equipos.idEquipo,
                id_clasificacion: schema.equipos.idClasificacion 
            }).from(schema.equipos)
              .where(and(eq(schema.equipos.idEntrenador, id_entrenador), eq(schema.equipos.activo, true))).limit(1);
            if (equipoResult.length === 0) throw new Error('REGLA DE INSCRIPCIÓN: No tienes ningún equipo activo asignado para inscribir.');
            const equipo = equipoResult[0];
            const torneoResult = await tx.select({
                fecha_inicio: schema.torneos.fechaInicio,
                fecha_fin: schema.torneos.fechaFin,
                categoria: schema.torneos.categoria,
                id_clasificacion: schema.torneos.idClasificacion,
                estado: schema.torneos.estado
            }).from(schema.torneos).where(eq(schema.torneos.idTorneo, id_torneo)).limit(1);
            if (torneoResult.length === 0) throw new Error('El torneo no existe.');
            const torneo = torneoResult[0];
            if (torneo.estado !== 'En inscripción') throw new Error('REGLA DE INSCRIPCIÓN: El torneo ya no está recibiendo solicitudes.');
            if (equipo.id_clasificacion !== torneo.id_clasificacion) throw new Error('REGLA DE INSCRIPCIÓN: El género de tu equipo no coincide con la categoría de este torneo.');
            const solicitudPrevia = await tx.select({ id: schema.inscripciones.idInscripcion })
                .from(schema.inscripciones)
                .where(and(eq(schema.inscripciones.idTorneo, id_torneo), eq(schema.inscripciones.idEquipo, equipo.id_equipo)));
            
            if (solicitudPrevia.length > 0) throw new Error('REGLA DE INSCRIPCIÓN: Ya has enviado una solicitud para este torneo anteriormente.');
            const formatYYYYMMDD = (d) => {
                const date = new Date(d);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            };
            const inicioStr = formatYYYYMMDD(torneo.fecha_inicio);
            const finStr = formatYYYYMMDD(torneo.fecha_fin);
            const torneosSolapados = await tx.select({ id: schema.torneos.idTorneo })
                .from(schema.inscripciones)
                .innerJoin(schema.torneos, eq(schema.inscripciones.idTorneo, schema.torneos.idTorneo))
                .where(
                    and(
                        eq(schema.inscripciones.idEquipo, equipo.id_equipo),
                        inArray(schema.inscripciones.estadoInscripcion, ['Pendiente', 'Aprobada']),
                        notInArray(schema.torneos.estado, ['Cancelado', 'Finalizado']), 
                        sql`${schema.torneos.fechaInicio} <= ${finStr} AND ${schema.torneos.fechaFin} >= ${inicioStr}`
                    )
                );
            if (torneosSolapados.length > 0) {
                throw new Error('Error: Las fechas de este torneo se solapan con otro torneo en el que tu equipo ya está inscrito o en revisión.');
            }

            if (!roster_enviado || roster_enviado.length < 5) throw new Error('REGLA DE INSCRIPCIÓN: Debes incluir al menos 5 jugadores en el Roster.');

            const numerosSet = new Set();
            const jugadoresSet = new Set();
            let titularesIds = [];
            let capitanesCount = 0;
            let titularesCount = 0;
            for (const j of roster_enviado) {
                if (jugadoresSet.has(j.id_jugador)) throw new Error(`REGLA DE INSCRIPCIÓN: Has incluido al mismo jugador más de una vez.`);
                jugadoresSet.add(j.id_jugador);
                if (j.es_capitan) capitanesCount++;
                if (numerosSet.has(j.numero_camiseta)) throw new Error(`REGLA DE INSCRIPCIÓN: El dorsal #${j.numero_camiseta} está repetido.`);
                numerosSet.add(j.numero_camiseta);
                if (j.rol_roster === 'Titular') {
                    titularesCount++;
                    titularesIds.push(j.id_jugador);
                }
            }
            if (capitanesCount !== 1) throw new Error('REGLA DE INSCRIPCIÓN: Debes tener exactamente un (1) Capitán designado.');
            if (titularesCount !== 5) throw new Error('REGLA DE INSCRIPCIÓN: Debes tener exactamente 5 titulares para jugar.');
            if (torneo.categoria !== 'Libre' && titularesIds.length > 0) {
                const titularesDB = await tx.select({
                    id_jugador: schema.jugadores.idJugador,
                    nombre: schema.jugadores.nombre,
                    apellido: schema.jugadores.apellido,
                    fecha_nacimiento: schema.jugadores.fechaNacimiento
                }).from(schema.jugadores).where(inArray(schema.jugadores.idJugador, titularesIds));

                for (const titular of titularesDB) {
                    if (!titular.fecha_nacimiento) throw new Error(`REGLA DE EDAD: ${titular.nombre} ${titular.apellido} no tiene fecha de nacimiento registrada.`);
                    
                    const edad = calcularEdadEnFecha(titular.fecha_nacimiento, torneo.fecha_inicio);
                    
                    if (torneo.categoria === 'Sub-12' && (edad > 12 || edad < 11)) 
                        throw new Error(`REGLA DE EDAD: ${titular.nombre} tiene ${edad} años. Rango permitido en Sub-12: 11 y 12 años.`);
                    if (torneo.categoria === 'Sub-15' && (edad > 15 || edad < 14)) 
                        throw new Error(`REGLA DE EDAD: ${titular.nombre} tiene ${edad} años. Rango permitido en Sub-15: 14 y 15 años.`);
                    if (torneo.categoria === 'Sub-18' && (edad > 18 || edad < 17)) 
                        throw new Error(`REGLA DE EDAD: ${titular.nombre} tiene ${edad} años. Rango permitido en Sub-18: 17 y 18 años.`);
                    if (torneo.categoria === 'U-23' && (edad > 23 || edad < 21)) 
                        throw new Error(`REGLA DE EDAD: ${titular.nombre} tiene ${edad} años. Rango permitido en U-23: 21 a 23 años.`);
                    if (torneo.categoria === 'Veteranos' && edad < 35) 
                        throw new Error(`REGLA DE EDAD: ${titular.nombre} tiene ${edad} años. Categoría Veteranos requiere mínimo 35 años.`);
                    if (torneo.categoria === 'Maxi-Baloncesto' && edad < 45) 
                        throw new Error(`REGLA DE EDAD: ${titular.nombre} tiene ${edad} años. Categoría Maxi requiere mínimo 45 años.`);
                }
            }
            console.log("Intentando insertar en tabla 'inscripciones'...");
            const [nuevaSolicitud] = await tx.insert(schema.inscripciones)
                .values({
                    idTorneo: id_torneo,
                    idEquipo: equipo.id_equipo,
                    estadoInscripcion: 'Pendiente'
                })
                .returning({
                    idInscripcion_generado: schema.inscripciones.idInscripcion
                });
            
            console.log("Inscripción creada. ID:", nuevaSolicitud.idInscripcion_generado);

            if (!schema.rosterTorneo) {
                throw new Error("ERROR CRÍTICO DEL SISTEMA: La tabla 'rosterTorneo' no se encuentra exportada en el schema.js");
            }

            console.log("Intentando insertar en 'roster_torneo'...");
            const datosParaRoster = roster_enviado.map(jugador => ({
                idInscripcion: nuevaSolicitud.idInscripcion_generado, 
                idJugador: jugador.id_jugador,
                numeroCamiseta: parseInt(jugador.numero_camiseta),
                rolRoster: jugador.rol_roster,
                esCapitan: jugador.es_capitan || false
            }));

            await tx.insert(schema.rosterTorneo).values(datosParaRoster);
            
            console.log("Roster guardado exitosamente en la base de datos.");
            return nuevaSolicitud;
        });

    } catch (error) {
        console.error("ERROR EN TRANSACCIÓN DE INSCRIPCIÓN:", error);
        const dbErrorMsg = error.cause?.message || error.detail || error.message || String(error);
        if (dbErrorMsg.includes('REGLA') || dbErrorMsg.includes('ERROR CRÍTICO')) {
            const cleanMsg = dbErrorMsg.replace('PostgresError: ', '');
            throw new Error(cleanMsg);
        }
        if (dbErrorMsg.includes('unique_equipo_torneo') || dbErrorMsg.includes('duplicate key')) {
            throw new Error('REGLA DE INSCRIPCIÓN: Ya existe una solicitud para este torneo con tu equipo.');
        }
        throw new Error(`Ocurrió un problema guardando los datos: ${dbErrorMsg}`);
    }
};
const obtenerMisInscripciones = async (id_entrenador) => {
    const equipo = await db.select({ id_equipo: schema.equipos.idEquipo })
        .from(schema.equipos)
        .where(
            and(
                eq(schema.equipos.idEntrenador, id_entrenador),
                eq(schema.equipos.activo, true)
            )
        )
        .limit(1);

    if (equipo.length === 0) return [];  

    return await db.select({
        id_torneo: schema.inscripciones.idTorneo,
        estado: schema.inscripciones.estadoInscripcion
    })
    .from(schema.inscripciones)
    .where(eq(schema.inscripciones.idEquipo, equipo[0].id_equipo));
};
const obtenerMiRoster = async (id_torneo, id_entrenador) => {
    const inscripcionInfo = await db.select({
        id_inscripcion: schema.inscripciones.idInscripcion,
        id_equipo: schema.inscripciones.idEquipo
    })
    .from(schema.inscripciones)
    .innerJoin(schema.equipos, eq(schema.inscripciones.idEquipo, schema.equipos.idEquipo))
    .where(
        and(
            eq(schema.inscripciones.idTorneo, id_torneo),
            eq(schema.equipos.idEntrenador, id_entrenador)
        )
    )
    .limit(1);

    if (inscripcionInfo.length === 0) return [];
    
    const idInscripcion = inscripcionInfo[0].id_inscripcion;
    const idEquipo = inscripcionInfo[0].id_equipo;

    const rows = await db.select({
        id_jugador: schema.rosterTorneo.idJugador,
        nombre: schema.jugadores.nombre,
        apellido: schema.jugadores.apellido,
        numero_camiseta: schema.rosterTorneo.numeroCamiseta,
        rol_roster: schema.rosterTorneo.rolRoster,
        es_capitan: schema.rosterTorneo.esCapitan,
        suspendido_db: sql`EXISTS (
            SELECT 1 FROM ${schema.resolucionesDisciplinarias} rd
            INNER JOIN ${schema.sanciones} s ON rd.id_sancion = s.id_sancion
            WHERE s.id_jugador = ${schema.rosterTorneo.idJugador}
              AND s.id_torneo = ${id_torneo}
              AND rd.estado = 'Activa'
              AND rd.partidos_suspension > rd.partidos_cumplidos
        ) OR EXISTS (
            SELECT 1 FROM ${schema.sanciones} s2
            WHERE s2.id_jugador = ${schema.rosterTorneo.idJugador}
              AND s2.id_torneo = ${id_torneo}
              AND s2.estado_resolucion = 'Pendiente'
        )`.as('suspendido_db')
    })
    .from(schema.rosterTorneo)
    .innerJoin(schema.jugadores, eq(schema.rosterTorneo.idJugador, schema.jugadores.idJugador))
    .where(eq(schema.rosterTorneo.idInscripcion, idInscripcion))
    .orderBy(asc(schema.rosterTorneo.numeroCamiseta));
    return rows.map(r => ({
        ...r,
        esta_suspendido: r.suspendido_db === true || r.suspendido_db === 'true' || r.suspendido_db === 1
    }));
};

const editarRoster = async (id_torneo, id_entrenador, roster_actualizado) => {
    try {
        return await db.transaction(async (tx) => {
            const equipoResult = await tx.select({ id_equipo: schema.equipos.idEquipo })
                .from(schema.equipos).where(and(eq(schema.equipos.idEntrenador, id_entrenador), eq(schema.equipos.activo, true))).limit(1);
            if (equipoResult.length === 0) throw new Error('REGLA DE EDICIÓN: No tienes un equipo activo.');
            const equipo = equipoResult[0];
            const torneoResult = await tx.select({
                fecha_inicio: schema.torneos.fechaInicio,
                categoria: schema.torneos.categoria,
                estado: schema.torneos.estado
            }).from(schema.torneos).where(eq(schema.torneos.idTorneo, id_torneo)).limit(1);
            
            if (torneoResult.length === 0) throw new Error('El torneo no existe.');
            const torneo = torneoResult[0];

            if (torneo.estado !== 'En inscripción') {
                throw new Error('REGLA DE EDICIÓN: El torneo ya inició o finalizó. El Roster está bloqueado (Roster Freeze) y no se puede alterar.');
            }

            const inscripcionResult = await tx.select({
                idInscripcion: schema.inscripciones.idInscripcion,
                estado: schema.inscripciones.estadoInscripcion
            }).from(schema.inscripciones)
              .where(and(eq(schema.inscripciones.idTorneo, id_torneo), eq(schema.inscripciones.idEquipo, equipo.id_equipo))).limit(1);

            if (inscripcionResult.length === 0) throw new Error('No tienes una inscripción activa para editar en este torneo.');
            const inscripcion = inscripcionResult[0];

            if (inscripcion.estado === 'Rechazada') {
                throw new Error('REGLA DE EDICIÓN: Tu solicitud fue rechazada por el administrador. No puedes editar el roster.');
            }

            if (!roster_actualizado || roster_actualizado.length < 5) throw new Error('REGLA DE EDICIÓN: Debes incluir al menos 5 jugadores.');

            const numerosSet = new Set();
            const jugadoresSet = new Set();
            let titularesIds = [];
            let capitanesCount = 0;
            let titularesCount = 0;

            for (const j of roster_actualizado) {
                if (jugadoresSet.has(j.id_jugador)) throw new Error('REGLA DE EDICIÓN: Jugador repetido en la lista.');
                jugadoresSet.add(j.id_jugador);
                
                if (j.es_capitan) capitanesCount++;
                if (numerosSet.has(j.numero_camiseta)) throw new Error(`REGLA DE EDICIÓN: El dorsal #${j.numero_camiseta} está repetido.`);
                numerosSet.add(j.numero_camiseta);
                if (j.rol_roster === 'Titular') {
                    titularesCount++;
                    titularesIds.push(j.id_jugador);
                }
            }
            if (capitanesCount !== 1) throw new Error('REGLA DE EDICIÓN: Debes designar exactamente a un (1) Capitán.');
            if (titularesCount !== 5) throw new Error('REGLA DE EDICIÓN: Debes tener exactamente 5 titulares en cancha.');
            if (torneo.categoria !== 'Libre' && titularesIds.length > 0) {
                const titularesDB = await tx.select({
                    id_jugador: schema.jugadores.idJugador,
                    nombre: schema.jugadores.nombre,
                    fecha_nacimiento: schema.jugadores.fechaNacimiento
                }).from(schema.jugadores).where(inArray(schema.jugadores.idJugador, titularesIds));

                for (const titular of titularesDB) {
                    if (!titular.fecha_nacimiento) throw new Error(`REGLA DE EDAD: ${titular.nombre} no tiene fecha de nacimiento.`);
                    const edad = calcularEdadEnFecha(titular.fecha_nacimiento, torneo.fecha_inicio);
                    if (torneo.categoria === 'Sub-12' && (edad > 12 || edad < 11)) throw new Error(`REGLA DE EDAD: ${titular.nombre} tiene ${edad} años. Rango Sub-12: 11 y 12 años.`);
                    if (torneo.categoria === 'Sub-15' && (edad > 15 || edad < 14)) throw new Error(`REGLA DE EDAD: ${titular.nombre} tiene ${edad} años. Rango Sub-15: 14 y 15 años.`);
                    if (torneo.categoria === 'Sub-18' && (edad > 18 || edad < 17)) throw new Error(`REGLA DE EDAD: ${titular.nombre} tiene ${edad} años. Rango Sub-18: 17 y 18 años.`);
                    if (torneo.categoria === 'U-23' && (edad > 23 || edad < 21)) throw new Error(`REGLA DE EDAD: ${titular.nombre} tiene ${edad} años. Rango U-23: 21 a 23 años.`);
                    if (torneo.categoria === 'Veteranos' && edad < 35) throw new Error(`REGLA DE EDAD: ${titular.nombre} tiene ${edad} años. Rango Veteranos: 35+ años.`);
                    if (torneo.categoria === 'Maxi-Baloncesto' && edad < 45) throw new Error(`REGLA DE EDAD: ${titular.nombre} tiene ${edad} años. Rango Maxi: 45+ años.`);
                }
            }
            await tx.delete(schema.rosterTorneo).where(eq(schema.rosterTorneo.idInscripcion, inscripcion.idInscripcion));

            const datosParaRoster = roster_actualizado.map(jugador => ({
                idInscripcion: inscripcion.idInscripcion, 
                idJugador: jugador.id_jugador,
                numeroCamiseta: parseInt(jugador.numero_camiseta),
                rolRoster: jugador.rol_roster,
                esCapitan: jugador.es_capitan || false
            }));

            await tx.insert(schema.rosterTorneo).values(datosParaRoster);

            return { idInscripcion: inscripcion.idInscripcion, mensaje: "Roster actualizado" };
        });
    } catch (error) {
        const dbErrorMsg = error.cause?.message || error.detail || error.message || String(error);
        if (dbErrorMsg.includes('REGLA')) {
            throw new Error(dbErrorMsg.replace('PostgresError: ', ''));
        }
        throw new Error(`Ocurrió un problema guardando los datos: ${dbErrorMsg}`);
    }
};
const obtenerRosterPublico = async (id_torneo, id_equipo) => {
    const inscripcionInfo = await db.select({
        id_inscripcion: schema.inscripciones.idInscripcion
    })
    .from(schema.inscripciones)
    .where(
        and(
            eq(schema.inscripciones.idTorneo, id_torneo),
            eq(schema.inscripciones.idEquipo, id_equipo),
            eq(schema.inscripciones.estadoInscripcion, 'Aprobada')
        )
    )
    .limit(1);

    if (inscripcionInfo.length === 0) return [];
    const idInscripcion = inscripcionInfo[0].id_inscripcion;

    const rows = await db.select({
        id_jugador: schema.rosterTorneo.idJugador,
        nombre: schema.jugadores.nombre,
        apellido: schema.jugadores.apellido,
        numero_camiseta: schema.rosterTorneo.numeroCamiseta,
        es_capitan: schema.rosterTorneo.esCapitan,
        
        esta_suspendido: sql`EXISTS (
            SELECT 1 FROM ${schema.resolucionesDisciplinarias} rd
            INNER JOIN ${schema.sanciones} s ON rd.id_sancion = s.id_sancion
            WHERE s.id_jugador = ${schema.rosterTorneo.idJugador}
              AND s.id_torneo = ${id_torneo}
              AND rd.estado = 'Activa'
              AND rd.partidos_suspension > rd.partidos_cumplidos
        ) OR EXISTS (
            SELECT 1 FROM ${schema.sanciones} s2
            WHERE s2.id_jugador = ${schema.rosterTorneo.idJugador}
              AND s2.id_torneo = ${id_torneo}
              AND s2.estado_resolucion = 'Pendiente'
        )`.as('esta_suspendido')
        
    })
    .from(schema.rosterTorneo)
    .innerJoin(schema.jugadores, eq(schema.rosterTorneo.idJugador, schema.jugadores.idJugador))
    .where(eq(schema.rosterTorneo.idInscripcion, idInscripcion))
    .orderBy(asc(schema.rosterTorneo.numeroCamiseta));

    return rows;
};
module.exports = {
    solicitarInscripcion,
    obtenerMisInscripciones,
    obtenerMiRoster,
    editarRoster,
    obtenerRosterPublico
};