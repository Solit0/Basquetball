const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, sql, inArray, notInArray } = require('drizzle-orm');

const calcularEdadEnFecha = (fechaNacimiento, fechaReferencia) => {
    const nacimiento = new Date(fechaNacimiento);
    const referencia = new Date(fechaReferencia);
    let edad = referencia.getFullYear() - nacimiento.getFullYear();
    const mes = referencia.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && referencia.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
};

const solicitarInscripcion = async (id_torneo, id_entrenador) => {
    return await db.transaction(async (tx) => {
        
        const equipoResult = await tx.select({ 
            id_equipo: schema.equipos.idEquipo,
            id_clasificacion: schema.equipos.idClasificacion 
        })
        .from(schema.equipos)
        .where(
            and(
                eq(schema.equipos.idEntrenador, id_entrenador),
                eq(schema.equipos.activo, true)
            )
        )
        .limit(1);

        if (equipoResult.length === 0) {
            throw new Error('REGLA_INSCRIPCIÓN: No tienes ningún equipo activo asignado para inscribir.');
        }
        const equipo = equipoResult[0];
        const torneoResult = await tx.select({
            fecha_inicio: schema.torneos.fechaInicio,
            fecha_fin: schema.torneos.fechaFin,
            categoria: schema.torneos.categoria,
            id_clasificacion: schema.torneos.idClasificacion,
            estado: schema.torneos.estado
        })
        .from(schema.torneos)
        .where(eq(schema.torneos.idTorneo, id_torneo))
        .limit(1);
        if (torneoResult.length === 0) throw new Error('El torneo no existe.');
        const torneo = torneoResult[0];

        if (torneo.estado !== 'En inscripción') {
            throw new Error('REGLA_INSCRIPCIÓN: Este torneo no está recibiendo solicitudes actualmente.');
        }
        if (equipo.id_clasificacion !== torneo.id_clasificacion) {
            throw new Error('REGLA_INSCRIPCIÓN: La clasificación de tu equipo (Varonil/Femenil/Mixto) no coincide con la categoría de este torneo.');
        }
        const totalJugadores = await tx.select({ count: sql`COUNT(*)::int` })
            .from(schema.plantillaEquipo)
            .where(
                and(
                    eq(schema.plantillaEquipo.idEquipo, equipo.id_equipo),
                    eq(schema.plantillaEquipo.activo, true)
                )
            );

        if (totalJugadores[0].count === 0) {
            throw new Error('REGLA_INSCRIPCIÓN: Tu equipo está vacío. Debes tener al menos 1 jugador en la plantilla para enviar la solicitud.');
        }

        // 5. Validar si ya existe una solicitud previa para este mismo torneo
        const solicitudPrevia = await tx.select({ id: schema.inscripciones.idInscripcion })
            .from(schema.inscripciones)
            .where(
                and(
                    eq(schema.inscripciones.idTorneo, id_torneo),
                    eq(schema.inscripciones.idEquipo, equipo.id_equipo)
                )
            );
        
        if (solicitudPrevia.length > 0) {
            throw new Error('REGLA_INSCRIPCIÓN: Ya has enviado una solicitud para este torneo anteriormente.');
        }
        const formatYYYYMMDD = (d) => {
            const date = new Date(d);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        };
        const inicioStr = formatYYYYMMDD(torneo.fecha_inicio);
        const finStr = formatYYYYMMDD(torneo.fecha_fin);

        const torneosSolapados = await tx.select({ id: schema.torneos.idTorneo })
            .from(schema.inscripciones)
            .innerJoin(schema.torneos, eq(schema.inscripciones.idTorneo, schema.torneos.idTorneo))
            .where(
                and(
                    eq(schema.inscripciones.idEquipo, equipo.id_equipo),
                    inArray(schema.inscripciones.estadoInscripcion, ['Pendiente', 'Aprobada']),
                    notInArray(schema.torneos.estado, ['Cancelado', 'Finalizado']), 
                    sql`${schema.torneos.fechaInicio} <= ${finStr} AND ${schema.torneos.fechaFin} >= ${inicioStr}`
                )
            );

        if (torneosSolapados.length > 0) {
            throw new Error('REGLA_INSCRIPCIÓN: Las fechas de este torneo se solapan con otro torneo en el que tu equipo ya está inscrito o en revisión.');
        }
        if (torneo.categoria !== 'Libre') {
            const titulares = await tx.select({
                nombre: schema.jugadores.nombre,
                apellido: schema.jugadores.apellido,
                fecha_nacimiento: schema.jugadores.fechaNacimiento
            })
            .from(schema.plantillaEquipo)
            .innerJoin(schema.jugadores, eq(schema.plantillaEquipo.idJugador, schema.jugadores.idJugador))
            .where(
                and(
                    eq(schema.plantillaEquipo.idEquipo, equipo.id_equipo),
                    eq(schema.plantillaEquipo.rolEquipo, 'Titular'),
                    eq(schema.plantillaEquipo.activo, true)
                )
            );

            for (const titular of titulares) {
                if (!titular.fecha_nacimiento) {
                    throw new Error(`REGLA_EDAD: El titular ${titular.nombre} ${titular.apellido} no tiene fecha de nacimiento registrada.`);
                }
                
                const edad = calcularEdadEnFecha(titular.fecha_nacimiento, torneo.fecha_inicio);
                
                if (torneo.categoria === 'Sub-12' && edad > 12) throw new Error(`REGLA_EDAD: El titular ${titular.nombre} tendrá ${edad} años al iniciar el torneo. El límite para Sub-12 es 12 años.`);
                if (torneo.categoria === 'Sub-15' && edad > 15) throw new Error(`REGLA_EDAD: El titular ${titular.nombre} tendrá ${edad} años al iniciar el torneo. El límite para Sub-15 es 15 años.`);
                if (torneo.categoria === 'Sub-18' && edad > 18) throw new Error(`REGLA_EDAD: El titular ${titular.nombre} tendrá ${edad} años al iniciar el torneo. El límite para Sub-18 es 18 años.`);
                if (torneo.categoria === 'U-23' && edad > 23) throw new Error(`REGLA_EDAD: El titular ${titular.nombre} tendrá ${edad} años al iniciar el torneo. El límite para U-23 es 23 años.`);
                
                if (torneo.categoria === 'Veteranos' && edad < 35) throw new Error(`REGLA_EDAD: El titular ${titular.nombre} tendrá ${edad} años. La categoría Veteranos requiere mínimo 35 años.`);
                if (torneo.categoria === 'Maxi-Baloncesto' && edad < 45) throw new Error(`REGLA_EDAD: El titular ${titular.nombre} tendrá ${edad} años. Maxi-Baloncesto requiere mínimo 45 años.`);
            }
        }
        const [nuevaSolicitud] = await tx.insert(schema.inscripciones)
            .values({
                idTorneo: id_torneo,
                idEquipo: equipo.id_equipo,
                estadoInscripcion: 'Pendiente'
            })
            .returning();

        return nuevaSolicitud;
    });
};

module.exports = {
    solicitarInscripcion
};