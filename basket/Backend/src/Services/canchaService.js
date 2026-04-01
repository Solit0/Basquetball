const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, asc, sql } = require('drizzle-orm');

const obtenerTodas = async () => {
    const rows = await db.select({
        id: schema.canchas.idCancha,
        name: schema.canchas.nombreCancha,
        address: schema.canchas.direccion,
        capacity: schema.canchas.capacidad
    })
    .from(schema.canchas)
    .where(eq(schema.canchas.activo, true))
    .orderBy(asc(schema.canchas.nombreCancha));

    return rows;
};

const crear = async (canchaData) => {
    const checkResult = await db.select({ id_cancha: schema.canchas.idCancha })
        .from(schema.canchas)
        .where(sql`LOWER(${schema.canchas.direccion}) = LOWER(${canchaData.direccion})`);
    
    if (checkResult.length > 0) {
        throw new Error("Ya existe una cancha registrada con esta misma dirección exacta.");
    }
    
    // Insertamos la nueva cancha
    const rows = await db.insert(schema.canchas)
        .values({
            nombreCancha: canchaData.nombre_cancha,
            direccion: canchaData.direccion,
            capacidad: canchaData.capacidad || null
        })
        .returning();
    
    return rows[0];
};

module.exports = {
    obtenerTodas,
    crear
};