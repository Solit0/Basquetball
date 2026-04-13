const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, desc,sql,asc } = require('drizzle-orm');

const obtenerSancionesPendientes = async () => {
    try {
        const rows = await db.select({
            id_sancion: schema.sanciones.idSancion,
            motivo: schema.sanciones.motivo,
            tipo_sancion: schema.sanciones.tipoSancion,
            fecha_reporte: schema.partidos.fecha,
            jugador_nombre: schema.jugadores.nombre,
            jugador_apellido: schema.jugadores.apellido,
            torneo_nombre: schema.torneos.nombreTorneo,
            id_torneo: schema.sanciones.idTorneo,
            id_jugador: schema.sanciones.idJugador,
            informe_partido: schema.informesPartido.contenido 
        })
        .from(schema.sanciones)
        .innerJoin(schema.jugadores, eq(schema.sanciones.idJugador, schema.jugadores.idJugador))
        .innerJoin(schema.partidos, eq(schema.sanciones.idPartido, schema.partidos.idPartido))
        .innerJoin(schema.torneos, eq(schema.sanciones.idTorneo, schema.torneos.idTorneo))
        .leftJoin(schema.informesPartido, eq(schema.sanciones.idPartido, schema.informesPartido.idPartido)) 
        .where(eq(schema.sanciones.estadoResolucion, 'Pendiente'))
        .orderBy(desc(schema.partidos.fecha));

        return rows;
    } catch (error) {
        console.error("[BACKEND ERROR] Error al obtener sanciones pendientes:", error);
        throw error;
    }
};

const dictarResolucion = async (id_sancion, datos_resolucion) => {
    const { partidos_suspension = 0, monto_multa = 0, observaciones_admin } = datos_resolucion;

    try {
        return await db.transaction(async (tx) => {
            
            const sancionInfo = await tx.select()
                .from(schema.sanciones)
                .where(eq(schema.sanciones.idSancion, id_sancion))
                .limit(1);

            if (sancionInfo.length === 0) {
                throw new Error("La sanción especificada no existe.");
            }

            const { idJugador, idTorneo } = sancionInfo[0];
            const [nuevaResolucion] = await tx.insert(schema.resolucionesDisciplinarias)
                .values({
                    idSancion: id_sancion,
                    partidosSuspension: partidos_suspension,
                    montoMulta: monto_multa,
                    observacionesAdmin: observaciones_admin,
                    estado: 'Activa'
                })
                .returning();
            await tx.update(schema.sanciones)
                .set({ estadoResolucion: 'Resuelta' })
                .where(eq(schema.sanciones.idSancion, id_sancion));
            if (partidos_suspension > 0) {
                const rosterInfo = await tx.select({ id_roster: schema.rosterTorneo.idRoster })
                    .from(schema.rosterTorneo)
                    .innerJoin(schema.inscripciones, eq(schema.rosterTorneo.idInscripcion, schema.inscripciones.idInscripcion))
                    .where(
                        and(
                            eq(schema.rosterTorneo.idJugador, idJugador),
                            eq(schema.inscripciones.idTorneo, idTorneo)
                        )
                    )
                    .limit(1);

                if (rosterInfo.length > 0) {
                    await tx.update(schema.rosterTorneo)
                        .set({ rolRoster: 'Suplente'})
                        .where(eq(schema.rosterTorneo.idRoster, rosterInfo[0].id_roster));
                }
            }
            return nuevaResolucion;
        });
    } catch (error) {
        console.error("[BACKEND ERROR] Error al dictar resolución:", error);
        throw error;
    }
};
const obtenerHistorialResoluciones = async () => {
    try {
        const rows = await db.select({
            id_resolucion: schema.resolucionesDisciplinarias.idResolucion,
            id_sancion: schema.sanciones.idSancion,
            jugador: sql`CONCAT(${schema.jugadores.nombre}, ' ', ${schema.jugadores.apellido})`.as('jugador'),
            torneo: schema.torneos.nombreTorneo,
            infraccion: schema.sanciones.tipoSancion,
            fecha_resolucion: schema.resolucionesDisciplinarias.fechaResolucion,
            partidos_suspension: schema.resolucionesDisciplinarias.partidosSuspension,
            partidos_cumplidos: schema.resolucionesDisciplinarias.partidosCumplidos,
            monto_multa: schema.resolucionesDisciplinarias.montoMulta,
            multa_pagada: schema.resolucionesDisciplinarias.multaPagada,
            estado_resolucion: schema.resolucionesDisciplinarias.estado,
            observaciones: schema.resolucionesDisciplinarias.observacionesAdmin
        })
        .from(schema.resolucionesDisciplinarias)
        .innerJoin(schema.sanciones, eq(schema.resolucionesDisciplinarias.idSancion, schema.sanciones.idSancion))
        .innerJoin(schema.jugadores, eq(schema.sanciones.idJugador, schema.jugadores.idJugador))
        .innerJoin(schema.torneos, eq(schema.sanciones.idTorneo, schema.torneos.idTorneo))
        .orderBy(desc(schema.resolucionesDisciplinarias.fechaResolucion));
        return rows.map(r => {
            let cumplimiento = 'Finalizado';
            
            if (r.partidos_suspension > 0) {
                cumplimiento = r.partidos_cumplidos >= r.partidos_suspension 
                    ? 'Cumplido' 
                    : `En cumplimiento (${r.partidos_cumplidos}/${r.partidos_suspension})`;
            }

            return {
                ...r,
                estado_cumplimiento: cumplimiento
            };
        });
    } catch (error) {
        console.error("Error al obtener historial:", error);
        throw error;
    }
};
const marcarMultaPagada = async (id_resolucion) => {
    try {
        const [actualizado] = await db.update(schema.resolucionesDisciplinarias)
            .set({ multaPagada: true })
            .where(eq(schema.resolucionesDisciplinarias.idResolucion, id_resolucion))
            .returning();
        return actualizado;
    } catch (error) {
        console.error("[BACKEND ERROR] Error al pagar multa:", error);
        throw error;
    }
};
module.exports = {
    obtenerSancionesPendientes,
    dictarResolucion,
    obtenerHistorialResoluciones,
    marcarMultaPagada
};