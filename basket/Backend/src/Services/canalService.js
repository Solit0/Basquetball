const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, desc, asc, sql } = require('drizzle-orm');
const { alias } = require('drizzle-orm/pg-core');

const obtenerTodos = async () => {
    const rows = await db.select({
        id_canal: schema.canales.idCanal,
        nombre_canal: schema.canales.nombreCanal,
        url_sitio: schema.canales.urlSitio,
        numero_canal: schema.canales.numeroCanal,
        horario: schema.canales.horario,
        activo: schema.canales.activo,
        id_tipo: schema.canales.idTipo,
        tipo_canal: schema.tipoCanal.descripcion
    })
    .from(schema.canales)
    .leftJoin(schema.tipoCanal, eq(schema.canales.idTipo, schema.tipoCanal.idTipo))
    .orderBy(desc(schema.canales.idCanal));

    return rows;
};

const crear = async (datosCanal) => {
    const { nombre_canal, id_tipo, url_sitio, numero_canal, horario } = datosCanal;
    
    const tipoEncontrado = await db.select({ id: schema.tipoCanal.idTipo })
        .from(schema.tipoCanal)
        .where(eq(schema.tipoCanal.descripcion, id_tipo))
        .limit(1);

    if (tipoEncontrado.length === 0) {
        throw new Error(`El tipo de canal '${id_tipo}' no existe en la base de datos.`);
    }

    const uuid_tipo_real = tipoEncontrado[0].id;

    const rows = await db.insert(schema.canales)
        .values({
            nombreCanal: nombre_canal,
            idTipo: uuid_tipo_real, 
            urlSitio: url_sitio || null,
            numeroCanal: numero_canal || null,
            horario: horario || null
        })
        .returning();
        
    return rows[0];
};

const asignarTransmision = async (id_canal, id_partido, hora_transmision) => {
    const rows = await db.insert(schema.transmisiones)
        .values({
            idCanal: id_canal,
            idPartido: id_partido,
            horaTransmision: hora_transmision
        })
        .returning();
        
    return rows[0];
};

const obtenerTransmisionesPorCanal = async (id_canal) => {
    const equipoLocal = alias(schema.equipos, 'equipo_local');
    const equipoVisitante = alias(schema.equipos, 'equipo_visitante');

    const rows = await db.select({
        id_transmision: schema.transmisiones.idTransmision,
        id_canal: schema.transmisiones.idCanal,
        id_partido: schema.transmisiones.idPartido,
        hora_transmision: schema.transmisiones.horaTransmision,
        fecha: schema.partidos.fecha,
        hora_partido: schema.partidos.hora,
        torneo_nombre: schema.torneos.nombreTorneo,
        local_nombre: equipoLocal.nombreOficial,
        visitante_nombre: equipoVisitante.nombreOficial,
        encuentro: sql`CONCAT(${equipoLocal.nombreOficial}, ' vs ', ${equipoVisitante.nombreOficial})`.as('encuentro')
    })
    .from(schema.transmisiones)
    .innerJoin(schema.partidos, eq(schema.transmisiones.idPartido, schema.partidos.idPartido))
    .innerJoin(schema.torneos, eq(schema.partidos.idTorneo, schema.torneos.idTorneo))
    .innerJoin(equipoLocal, eq(schema.partidos.idEquipoLocal, equipoLocal.idEquipo))
    .innerJoin(equipoVisitante, eq(schema.partidos.idEquipoVisitante, equipoVisitante.idEquipo))
    .where(eq(schema.transmisiones.idCanal, id_canal))
    .orderBy(asc(schema.partidos.fecha), asc(schema.transmisiones.horaTransmision));

    return rows;
};

const eliminarTransmision = async (id_transmision) => {
    const rows = await db.delete(schema.transmisiones)
        .where(eq(schema.transmisiones.idTransmision, id_transmision))
        .returning();
        
    if (rows.length === 0) throw new Error("Transmisión no encontrada");
    
    return rows[0];
};

module.exports = {
    obtenerTodos,
    crear,
    asignarTransmision,
    obtenerTransmisionesPorCanal,
    eliminarTransmision
};