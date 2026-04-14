const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, or, sql } = require('drizzle-orm');

const obtenerRankingEquipos = async (categoriaFiltro, idClasificacionFiltro, idTorneoFiltro) => {
    try {
        let query = db.select({
            id_equipo: schema.equipos.idEquipo,
            nombre_oficial: schema.equipos.nombreOficial,
            siglas: schema.equipos.siglas,
            partidos_jugados: sql`COUNT(${schema.partidos.idPartido})::int`.as('partidos_jugados'),
            partidos_ganados: sql`
                SUM(CASE
                    WHEN ${schema.partidos.idEquipoLocal} = ${schema.equipos.idEquipo} AND ${schema.partidos.marcadorLocal} > ${schema.partidos.marcadorVisitante} THEN 1
                    WHEN ${schema.partidos.idEquipoVisitante} = ${schema.equipos.idEquipo} AND ${schema.partidos.marcadorVisitante} > ${schema.partidos.marcadorLocal} THEN 1
                    ELSE 0
                END)::int
            `.as('partidos_ganados'),
            partidos_perdidos: sql`
                SUM(CASE
                    WHEN ${schema.partidos.idEquipoLocal} = ${schema.equipos.idEquipo} AND ${schema.partidos.marcadorLocal} < ${schema.partidos.marcadorVisitante} THEN 1
                    WHEN ${schema.partidos.idEquipoVisitante} = ${schema.equipos.idEquipo} AND ${schema.partidos.marcadorVisitante} < ${schema.partidos.marcadorLocal} THEN 1
                    ELSE 0
                END)::int
            `.as('partidos_perdidos')
        })
        .from(schema.equipos)
        .innerJoin(schema.partidos, 
            and(
                or(
                    eq(schema.partidos.idEquipoLocal, schema.equipos.idEquipo),
                    eq(schema.partidos.idEquipoVisitante, schema.equipos.idEquipo)
                ),
                eq(schema.partidos.estado, 'Finalizado')
            )
        )
        .innerJoin(schema.torneos, eq(schema.partidos.idTorneo, schema.torneos.idTorneo));
        const filtros = [eq(schema.partidos.estado, 'Finalizado')];

        if (categoriaFiltro && categoriaFiltro !== 'Todas') {
            filtros.push(eq(schema.torneos.categoria, categoriaFiltro));
        }
        if (idClasificacionFiltro && idClasificacionFiltro !== 'Todas') {
            filtros.push(eq(schema.torneos.idClasificacion, idClasificacionFiltro));
        }
        if (idTorneoFiltro && idTorneoFiltro !== 'Todos') {
            filtros.push(eq(schema.torneos.idTorneo, idTorneoFiltro));
        }
        query.where(and(...filtros))
             .groupBy(schema.equipos.idEquipo)
             .orderBy(sql`partidos_ganados DESC`);

        return await query;
    } catch (error) {
        console.error("[BACKEND ERROR] Error al generar ranking de equipos:", error);
        throw error;
    }
};
const obtenerTodasLasClasificaciones = async () => {
    try {
        return await db.select().from(schema.clasificacionEquipo);
    } catch (error) {
        console.error("[BACKEND ERROR] Error al obtener clasificaciones:", error);
        throw error;
    }
};

module.exports = { obtenerRankingEquipos, obtenerTodasLasClasificaciones };