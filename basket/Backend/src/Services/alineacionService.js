const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, inArray } = require('drizzle-orm');

const asignarCapitanInterino = async (id_partido, id_equipo, id_jugador) => {
    try {
        return await db.transaction(async (tx) => {
            
            const partidoInfo = await tx.select({ idTorneo: schema.partidos.idTorneo })
                .from(schema.partidos)
                .where(eq(schema.partidos.idPartido, id_partido))
                .limit(1);
            if (partidoInfo.length === 0) throw new Error("El partido no existe.");
            const id_torneo = partidoInfo[0].idTorneo;

            const rosterEquipo = await tx.select({ idRoster: schema.rosterTorneo.idRoster, idJugador: schema.rosterTorneo.idJugador })
                .from(schema.rosterTorneo)
                .innerJoin(schema.inscripciones, eq(schema.rosterTorneo.idInscripcion, schema.inscripciones.idInscripcion))
                .where(
                    and(
                        eq(schema.inscripciones.idTorneo, id_torneo),
                        eq(schema.inscripciones.idEquipo, id_equipo)
                    )
                );
            
            const idsRosterEquipo = rosterEquipo.map(r => r.idRoster);
            const rosterDelJugador = rosterEquipo.find(r => r.idJugador === id_jugador);

            if (!rosterDelJugador) {
                throw new Error("El jugador no forma parte del roster de tu equipo para este torneo.");
            }
            if (idsRosterEquipo.length > 0) {
                await tx.update(schema.asistenciaPartidos)
                    .set({ esCapitanInterino: false })
                    .where(
                        and(
                            eq(schema.asistenciaPartidos.idPartido, id_partido),
                            inArray(schema.asistenciaPartidos.idRoster, idsRosterEquipo)
                        )
                    );
            }
            const asistenciaPrevia = await tx.select()
                .from(schema.asistenciaPartidos)
                .where(
                    and(
                        eq(schema.asistenciaPartidos.idPartido, id_partido),
                        eq(schema.asistenciaPartidos.idRoster, rosterDelJugador.idRoster)
                    )
                );

            let actualizado;
            if (asistenciaPrevia.length === 0) {
                [actualizado] = await tx.insert(schema.asistenciaPartidos)
                    .values({
                        idPartido: id_partido,
                        idRoster: rosterDelJugador.idRoster,
                        estado: 'Pendiente',
                        esCapitanInterino: true
                    })
                    .returning();
            } else {
                [actualizado] = await tx.update(schema.asistenciaPartidos)
                    .set({ esCapitanInterino: true })
                    .where(
                        and(
                            eq(schema.asistenciaPartidos.idPartido, id_partido),
                            eq(schema.asistenciaPartidos.idRoster, rosterDelJugador.idRoster)
                        )
                    )
                    .returning();
            }

            return actualizado;
        });
    } catch (error) {
        console.error("[BACKEND ERROR] Error al asignar capitán interino:", error);
        throw error;
    }
};

module.exports = {
    asignarCapitanInterino
};