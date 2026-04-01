const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, ne, sql, count, notExists } = require('drizzle-orm');

const obtenerPorEquipo = async (id_equipo) => {
    const rows = await db.select({
        id_jugador: schema.jugadores.idJugador,
        nombre: schema.jugadores.nombre,
        apellido: schema.jugadores.apellido,
        posicion: schema.jugadores.posicion,
        estatura: schema.jugadores.estatura,
        fecha_nacimiento: schema.jugadores.fechaNacimiento,
        numero_camiseta: schema.plantillaEquipo.numeroCamiseta,
        es_capitan: schema.plantillaEquipo.esCapitan,
        activo: schema.plantillaEquipo.activo,
        rol_equipo: schema.plantillaEquipo.rolEquipo
    })
    .from(schema.jugadores)
    .innerJoin(schema.plantillaEquipo, eq(schema.jugadores.idJugador, schema.plantillaEquipo.idJugador))
    .where(
        and(
            eq(schema.plantillaEquipo.idEquipo, id_equipo),
            eq(schema.plantillaEquipo.activo, true)
        )
    )
    .orderBy(schema.plantillaEquipo.numeroCamiseta);

    return rows;
};

const obtenerLibres = async () => {
    const rows = await db.select()
        .from(schema.jugadores)
        .where(
            and(
                eq(schema.jugadores.activo, true),
                notExists(
                    db.select()
                    .from(schema.plantillaEquipo)
                    .where(
                        and(
                            eq(schema.plantillaEquipo.idJugador, schema.jugadores.idJugador),
                            eq(schema.plantillaEquipo.activo, true)
                        )
                    )
                )
            )
        );

    return rows;
};

const crear = async (datosJugador) => {
    const { nombre, apellido, posicion, estatura, fecha_nacimiento, id_equipo, numero_camiseta, es_capitan, rol_equipo } = datosJugador;
    
    try {
        return await db.transaction(async (tx) => {
            
            const limiteResult = await tx.select({ count: count() })
                .from(schema.plantillaEquipo)
                .where(
                    and(
                        eq(schema.plantillaEquipo.idEquipo, id_equipo),
                        eq(schema.plantillaEquipo.activo, true)
                    )
                );
            
            if (Number(limiteResult[0].count) >= 15) {
                throw new Error('REGLA_BALONCESTO: El equipo ya alcanzó el límite máximo de 15 jugadores.');
            }

            if (es_capitan) {
                const capitanResult = await tx.select({ id: schema.plantillaEquipo.idJugador })
                    .from(schema.plantillaEquipo)
                    .where(
                        and(
                            eq(schema.plantillaEquipo.idEquipo, id_equipo),
                            eq(schema.plantillaEquipo.esCapitan, true),
                            eq(schema.plantillaEquipo.activo, true)
                        )
                    );
                
                if (capitanResult.length > 0) {
                    throw new Error('REGLA_BALONCESTO: El equipo ya tiene un capitán. Debes editar al actual y quitarle la capitanía antes de asignársela a alguien más.');
                }
            }
            
            const [nuevoJugador] = await tx.insert(schema.jugadores)
                .values({
                    nombre: nombre,
                    apellido: apellido,
                    posicion: posicion,
                    estatura: estatura || null,
                    fechaNacimiento: fecha_nacimiento || null
                })
                .returning({ id_jugador: schema.jugadores.idJugador });
            
            const [nuevaPlantilla] = await tx.insert(schema.plantillaEquipo)
                .values({
                    idEquipo: id_equipo,
                    idJugador: nuevoJugador.id_jugador,
                    numeroCamiseta: numero_camiseta,
                    esCapitan: es_capitan || false,
                    activo: true,
                    rolEquipo: rol_equipo || 'Suplente'
                })
                .returning();

            return { ...nuevoJugador, ...nuevaPlantilla };
        });

    } catch (error) {
        if (error.code === '23505') { 
            throw new Error(`REGLA_BALONCESTO: El número de camiseta ${numero_camiseta} ya está en uso en el equipo.`);
        }
        if (error.message.includes('REGLA_BALONCESTO')) {
            throw error;
        }
        throw error;
    }
};

const unirAEquipo = async (datosVinculacion) => {
    const { id_jugador, id_equipo, numero_camiseta, es_capitan, rol_equipo } = datosVinculacion;
    
    const limiteResult = await db.select({ count: count() })
        .from(schema.plantillaEquipo)
        .where(
            and(
                eq(schema.plantillaEquipo.idEquipo, id_equipo),
                eq(schema.plantillaEquipo.activo, true)
            )
        );
    
    if (Number(limiteResult[0].count) >= 15) {
        throw new Error('REGLA_BALONCESTO: Límite de 15 jugadores alcanzado.');
    }

    // 2. Validar que la camiseta no esté en uso por otro jugador activo
    const camisetaResult = await db.select({ id: schema.plantillaEquipo.idJugador })
        .from(schema.plantillaEquipo)
        .where(
            and(
                eq(schema.plantillaEquipo.idEquipo, id_equipo),
                eq(schema.plantillaEquipo.numeroCamiseta, numero_camiseta),
                eq(schema.plantillaEquipo.activo, true)
            )
        );
        
    if (camisetaResult.length > 0) {
        throw new Error(`REGLA_BALONCESTO: Camiseta ${numero_camiseta} en uso.`);
    }

    if (es_capitan) {
        const capitanResult = await db.select({ id: schema.plantillaEquipo.idJugador })
            .from(schema.plantillaEquipo)
            .where(
                and(
                    eq(schema.plantillaEquipo.idEquipo, id_equipo),
                    eq(schema.plantillaEquipo.esCapitan, true),
                    eq(schema.plantillaEquipo.activo, true)
                )
            );
        
        if (capitanResult.length > 0) {
            throw new Error('REGLA_BALONCESTO: El equipo ya tiene un capitán. Debes editar al actual y quitarle la capitanía antes de asignársela a alguien más.');
        }
    }

    const rows = await db.insert(schema.plantillaEquipo)
        .values({
            idEquipo: id_equipo,
            idJugador: id_jugador,
            numeroCamiseta: numero_camiseta,
            esCapitan: es_capitan || false,
            activo: true,
            rolEquipo: rol_equipo || 'Suplente'
        })
        .onConflictDoUpdate({
            
            target: [schema.plantillaEquipo.idEquipo, schema.plantillaEquipo.idJugador],
            set: {
                numeroCamiseta: numero_camiseta,
                esCapitan: es_capitan || false,
                rolEquipo: rol_equipo || 'Suplente',
                activo: true
            }
        })
        .returning();

    return rows[0];
};

const actualizar = async (id_jugador, datosJugador) => {
    const { nombre, apellido, posicion, estatura, fecha_nacimiento } = datosJugador;
    
    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (apellido !== undefined) updateData.apellido = apellido;
    if (posicion !== undefined) updateData.posicion = posicion;
    if (estatura !== undefined) updateData.estatura = estatura;
    if (fecha_nacimiento !== undefined) updateData.fechaNacimiento = fecha_nacimiento;

    const rows = await db.update(schema.jugadores)
        .set(updateData)
        .where(eq(schema.jugadores.idJugador, id_jugador))
        .returning();
        
    return rows[0];
};

const actualizarPlantilla = async (id_jugador, id_equipo, datosPlantilla) => {
    const { numero_camiseta, es_capitan, rol_equipo } = datosPlantilla;
    
    try {
        return await db.transaction(async (tx) => {
            
            if (es_capitan) {
                await tx.update(schema.plantillaEquipo)
                    .set({ esCapitan: false })
                    .where(
                        and(
                            eq(schema.plantillaEquipo.idEquipo, id_equipo),
                            ne(schema.plantillaEquipo.idJugador, id_jugador),
                            eq(schema.plantillaEquipo.activo, true)
                        )
                    );
            }

            const updateData = {};
            if (numero_camiseta !== undefined) updateData.numeroCamiseta = numero_camiseta;
            if (es_capitan !== undefined) updateData.esCapitan = es_capitan;
            if (rol_equipo !== undefined) updateData.rolEquipo = rol_equipo;

            const [plantillaActualizada] = await tx.update(schema.plantillaEquipo)
                .set(updateData)
                .where(
                    and(
                        eq(schema.plantillaEquipo.idJugador, id_jugador),
                        eq(schema.plantillaEquipo.idEquipo, id_equipo),
                        eq(schema.plantillaEquipo.activo, true)
                    )
                )
                .returning();
                
            return plantillaActualizada;
        });
    } catch (error) {
        if (error.code === '23505') {
            throw new Error(`El número de camiseta ${numero_camiseta} ya lo usa otro compañero.`);
        }
        if (error.message && error.message.includes('REGLA_BALONCESTO')) {
            throw error;
        }
        throw error;
    }
};

const eliminar = async (id_jugador, id_equipo) => {
    const rows = await db.update(schema.plantillaEquipo)
        .set({
            activo: false,
            fechaSalida: sql`CURRENT_DATE`,
            esCapitan: false
        })
        .where(
            and(
                eq(schema.plantillaEquipo.idJugador, id_jugador),
                eq(schema.plantillaEquipo.idEquipo, id_equipo)
            )
        )
        .returning();
        
    return rows[0];
};
module.exports = {
    obtenerPorEquipo,
    obtenerLibres,
    crear,
    unirAEquipo,
    actualizar,
    actualizarPlantilla,
    eliminar
};