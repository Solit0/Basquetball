const { db } = require('../Config/db');
const { canales, tipoCanal, transmisiones, partidos, torneos, equipos } = require('../models/schema');
const { desc, eq, and, alias } = require('drizzle-orm');

const obtenerTodos = async () => {
    const results = await db
        .select({
            idCanal: canales.idCanal,
            nombreCanal: canales.nombreCanal,
            urlSitio: canales.urlSitio,
            numeroCanal: canales.numeroCanal,
            horario: canales.horario,
            activo: canales.activo,
            idTipo: canales.idTipo,
            tipoCanal: tipoCanal.descripcion,
        })
        .from(canales)
        .leftJoin(tipoCanal, eq(canales.idTipo, tipoCanal.idTipo))
        .orderBy(desc(canales.idCanal));
    
    return results;
};

const crear = async (datosCanal) => {
    const { nombre_canal, id_tipo, url_sitio, numero_canal, horario } = datosCanal;
    
    const result = await db
        .insert(canales)
        .values({
            nombreCanal: nombre_canal,
            idTipo: id_tipo,
            urlSitio: url_sitio || null,
            numeroCanal: numero_canal || null,
            horario: horario || null,
        })
        .returning();
    
    return result[0];
};

const asignarTransmision = async (id_canal, id_partido, hora_transmision) => {
    const result = await db
        .insert(transmisiones)
        .values({
            idCanal: id_canal,
            idPartido: id_partido,
            horaTransmision: hora_transmision,
        })
        .returning();
    
    return result[0];
};

const obtenerTransmisionesPorCanal = async (id_canal) => {
    const equiposLocal = alias(equipos, 'equiposLocal');
    const equiposVisitante = alias(equipos, 'equiposVisitante');
    
    const results = await db
        .select({
            idTransmision: transmisiones.idTransmision,
            idCanal: transmisiones.idCanal,
            idPartido: transmisiones.idPartido,
            horaTransmision: transmisiones.horaTransmision,
            fecha: partidos.fecha,
            horaPartido: partidos.hora,
            torneoNombre: torneos.nombreTorneo,
            localNombre: equiposLocal.nombreOficial,
            visitanteNombre: equiposVisitante.nombreOficial,
        })
        .from(transmisiones)
        .innerJoin(partidos, eq(transmisiones.idPartido, partidos.idPartido))
        .innerJoin(torneos, eq(partidos.idTorneo, torneos.idTorneo))
        .innerJoin(equiposLocal, eq(partidos.idEquipoLocal, equiposLocal.idEquipo))
        .innerJoin(equiposVisitante, eq(partidos.idEquipoVisitante, equiposVisitante.idEquipo))
        .where(eq(transmisiones.idCanal, id_canal))
        .orderBy(partidos.fecha, transmisiones.horaTransmision);
    
    // Construir el encuentro en post-procesamiento
    return results.map(row => ({
        ...row,
        encuentro: `${row.localNombre} vs ${row.visitanteNombre}`
    }));
};

const eliminarTransmision = async (id_transmision) => {
    const result = await db
        .delete(transmisiones)
        .where(eq(transmisiones.idTransmision, id_transmision))
        .returning();
    
    if (result.length === 0) throw new Error("Transmisión no encontrada");
    return result[0];
};

module.exports = {
    obtenerTodos,
    crear,
    asignarTransmision,
    obtenerTransmisionesPorCanal,
    eliminarTransmision
};