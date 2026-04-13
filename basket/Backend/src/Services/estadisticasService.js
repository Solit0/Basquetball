const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, or, sql, desc } = require('drizzle-orm');

const obtenerRankingEquipos = async (categoriaFiltro) => {
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

        if (categoriaFiltro && categoriaFiltro !== 'Todas') {
            query.where(eq(schema.torneos.categoria, categoriaFiltro));
        }
        query.groupBy(schema.equipos.idEquipo)
            .orderBy(sql`partidos_ganados DESC`);

        const resultados = await query;
        return resultados;

    } catch (error) {
        console.error("[BACKEND ERROR] Error al generar ranking de equipos:", error);
        throw error;
    }
};

module.exports = {
    obtenerRankingEquipos
};