const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, asc, sql, and } = require('drizzle-orm');

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
    
    const rows = await db.insert(schema.canchas)
        .values({
            nombreCancha: canchaData.nombre_cancha,
            direccion: canchaData.direccion,
            capacidad: canchaData.capacidad || null
        })
        .returning();
    
    return rows[0];
};
const crearCanchaConZonas = async (datosCancha) => {
    const { nombre_cancha, direccion, capacidad, zonas } = datosCancha;

    try {
        return await db.transaction(async (tx) => {
            const [nuevaCancha] = await tx.insert(schema.canchas)
                .values({
                    nombreCancha: nombre_cancha,
                    direccion: direccion,
                    capacidad: capacidad || null,
                    activo: true
                })
                .returning();
            const zonasAInsertar = (zonas && zonas.length > 0) 
                ? zonas.map(z => ({
                    idCancha: nuevaCancha.idCancha,
                    nombreZona: z.nombre_zona,
                    capacidad: z.capacidad
                }))
                : [{
                    idCancha: nuevaCancha.idCancha,
                    nombreZona: 'General',
                    capacidad: capacidad || 100 
                }];
            await tx.insert(schema.zonasCancha).values(zonasAInsertar);

            return nuevaCancha;
        });
    } catch (error) {
        console.error("Error al crear la cancha con zonas:", error);
        throw error;
    }
};
// Reemplaza obtenerCanchaYZonasPorEntrenador por esta:
const obtenerCanchaYZonasPorEntrenador = async (idEntrenador) => { // 🔴 Cambiamos el nombre de la variable para que tenga sentido
    try {
        console.log(`🗄️ [SERVICE] Buscando sede para el entrenador: ${idEntrenador}`);
        
        // 1. Buscamos el equipo ASIGNADO a este entrenador
        const equipo = await db.select({
            id_cancha: schema.equipos.idCancha,
            nombre_oficial: schema.equipos.nombreOficial
        })
        .from(schema.equipos)
        // 🔴 EL ERROR ESTABA AQUÍ: Ahora buscamos correctamente por el idEntrenador
        .where(eq(schema.equipos.idEntrenador, idEntrenador)) 
        .limit(1);

        if (equipo.length === 0 || !equipo[0].id_cancha) {
            const error = new Error("El entrenador no tiene un equipo con cancha registrada.");
            error.status = 404; // Aseguramos que devuelva 404 para que el frontend reaccione
            throw error;
        }

        const idCancha = equipo[0].id_cancha;

        // 2. Buscamos los datos de la cancha y sus zonas
        const cancha = await db.select().from(schema.canchas).where(eq(schema.canchas.idCancha, idCancha)).limit(1);
        const zonas = await db.select().from(schema.zonasCancha).where(eq(schema.zonasCancha.idCancha, idCancha));

        return {
            equipo: equipo[0].nombre_oficial,
            cancha: cancha[0],
            zonas: zonas
        };
    } catch (error) {
        console.error("Error al obtener datos de la sede:", error);
        throw error;
    }
};

const sincronizarZonasCancha = async (idCancha, zonasActualizadas) => {
    try {
        return await db.transaction(async (tx) => {
            
            for (const zona of zonasActualizadas) {
                if (zona.id_zona) {
                    await tx.update(schema.zonasCancha)
                        .set({ 
                            nombreZona: zona.nombre_zona, 
                            capacidad: zona.capacidad 
                        })
                        .where(eq(schema.zonasCancha.idZona, zona.id_zona));
                } else {
                    await tx.insert(schema.zonasCancha)
                        .values({
                            idCancha: idCancha,
                            nombreZona: zona.nombre_zona,
                            capacidad: zona.capacidad
                        });
                }
            }

            return { mensaje: "Zonas actualizadas correctamente" };
        });
    } catch (error) {
        console.error("Error al sincronizar las zonas:", error);
        throw error;
    }
};
module.exports = {
    obtenerTodas,
    crear,
    crearCanchaConZonas,
    obtenerCanchaYZonasPorEntrenador,
    sincronizarZonasCancha
};