const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, sql, count, notExists } = require('drizzle-orm');

const obtenerPorEquipo = async (id_equipo) => {
    const rows = await db.select({
        id_jugador: schema.jugadores.idJugador,
        nombre: schema.jugadores.nombre,
        apellido: schema.jugadores.apellido,
        posicion: schema.jugadores.posicion,
        estatura: schema.jugadores.estatura,
        fecha_nacimiento: schema.jugadores.fechaNacimiento,
        activo: schema.plantillaEquipo.activo
    })
    .from(schema.jugadores)
    .innerJoin(schema.plantillaEquipo, eq(schema.jugadores.idJugador, schema.plantillaEquipo.idJugador))
    .where(
        and(
            eq(schema.plantillaEquipo.idEquipo, id_equipo),
            eq(schema.plantillaEquipo.activo, true)
        )
    )
    .orderBy(schema.jugadores.nombre); 

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
    const { nombre, apellido, posicion, estatura, fecha_nacimiento, id_equipo } = datosJugador;
    
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
            
            if (Number(limiteResult[0].count) >= 20) {
                throw new Error('REGLA_BALONCESTO: El club ya alcanzó el límite máximo de 20 jugadores en su base de datos.');
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
                    activo: true
                })
                .returning();

            return { ...nuevoJugador, ...nuevaPlantilla };
        });

    } catch (error) {
        console.error("\n====== DETALLE DEL ERROR DE BASE DE DATOS ======");
        console.error("Mensaje principal:", error.message);
        if (error.cause) {
            console.error("Causa (PostgresError):", error.cause.message);
            console.error("Código de error Postgres (Code):", error.cause.code);
            console.error("Detalle (Detail):", error.cause.detail);
            console.error("Restricción (Constraint):", error.cause.constraint);
            console.error("Tabla afectada:", error.cause.table);
            console.error("Columna afectada:", error.cause.column);
        }
        if (error.detail) console.error("Detail directo:", error.detail);
        if (error.code) console.error("Code directo:", error.code);

        console.error("======================================================\n");

        if (error.message.includes('REGLA_BALONCESTO')) {
            throw error;
        }
        const mensajeReal = error.cause?.message || error.detail || error.message;
        throw new Error(`Error exacto de Postgres: ${mensajeReal}`);
    }
};

const unirAEquipo = async (datosVinculacion) => {
    const { id_jugador, id_equipo } = datosVinculacion;
    
    const limiteResult = await db.select({ count: count() })
        .from(schema.plantillaEquipo)
        .where(
            and(
                eq(schema.plantillaEquipo.idEquipo, id_equipo),
                eq(schema.plantillaEquipo.activo, true)
            )
        );
    
    if (Number(limiteResult[0].count) >= 20) {
        throw new Error('REGLA_BALONCESTO: Límite global de 20 jugadores alcanzado.');
    }

    const rows = await db.insert(schema.plantillaEquipo)
        .values({
            idEquipo: id_equipo,
            idJugador: id_jugador,
            activo: true
        })
        .onConflictDoUpdate({
            target: [schema.plantillaEquipo.idEquipo, schema.plantillaEquipo.idJugador],
            set: {
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
    
    if (Object.keys(updateData).length === 0) {
        return { id_jugador }; 
    }

    const rows = await db.update(schema.jugadores)
        .set(updateData)
        .where(eq(schema.jugadores.idJugador, id_jugador))
        .returning();
        
    return rows[0];
};

const actualizarPlantilla = async (id_jugador, id_equipo, datosPlantilla) => {
    return { id_jugador, id_equipo, mensaje: "Actualización global delegada al roster del torneo." };
};

const eliminar = async (id_jugador, id_equipo) => {
    const rows = await db.update(schema.plantillaEquipo)
        .set({
            activo: false,
            fechaSalida: sql`CURRENT_DATE`
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