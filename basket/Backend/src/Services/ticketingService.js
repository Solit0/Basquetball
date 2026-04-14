const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, sql, and } = require('drizzle-orm');
const stripeService = require('./stripeService');
const emailService = require('./emailService');

const obtenerBoletosDisponibles = async (idPartido) => {
    console.log(` [SERVICE] Ejecutando query SQL para el partido: ${idPartido}`);
    
    try {
        const resultados = await db.select({
            id_boleto: schema.boletosPartido.idBoleto,
            precio: schema.boletosPartido.precio,
            disponibles: schema.boletosPartido.disponibles,
            zona: schema.zonasCancha.nombreZona,
            capacidad: schema.zonasCancha.capacidad
        })
        .from(schema.boletosPartido)
        .innerJoin(schema.zonasCancha, eq(schema.boletosPartido.idZona, schema.zonasCancha.idZona))
        .where(eq(schema.boletosPartido.idPartido, idPartido));

        console.log(` [SERVICE] Resultado de la Base de Datos:`, resultados);
        
        return resultados;
    } catch (error) {
        console.error(" [SERVICE ERROR] Falló la consulta Drizzle:", error);
        throw error;
    }
};
const iniciarProcesoCompra = async (idUsuario, idBoleto, cantidad, montoTotal) => {
    try {
        const result = await db.execute(sql`
            SELECT reservar_boletos(
                ${idUsuario}::uuid, 
                ${idBoleto}::uuid, 
                ${cantidad}::integer, 
                ${montoTotal}::numeric
            )
        `);
        
        const idTransaccion = result[0].reservar_boletos;

        const paymentIntent = await stripeService.crearIntentoDePago(montoTotal, idTransaccion, idUsuario);

        return {
            idTransaccion,
            clientSecret: paymentIntent.client_secret,
            montoTotal
        };
    } catch (error) {
        console.error("[TICKETING SERVICE] Error al reservar:", error.message);
        throw new Error("No hay suficientes boletos o el asiento fue tomado.");
    }
};

const confirmarPagoExitoso = async (idTransaccion, emailDestino, nombreUsuario, detallesBoleto) => {
    console.log(`🗄️ [SERVICE] Iniciando actualización en BD para transacción: ${idTransaccion}`);
    
    try {
        await db.update(schema.transaccionesTicketing)
            .set({ 
                estadoPago: 'Exitoso',
                expiraEn: null 
            })
            .where(eq(schema.transaccionesTicketing.idTransaccion, idTransaccion));

        console.log("[SERVICE] BD actualizada correctamente. Disparando correo a:", emailDestino);

        emailService.enviarReciboCompra(emailDestino, nombreUsuario, detallesBoleto)
            .catch(err => console.error(" [SERVICE ERROR] Falló el envío de Nodemailer:", err));

        return true;
    } catch (error) {
        console.error(" [SERVICE ERROR] Error fatal al actualizar DB en confirmarPagoExitoso:", error);
        throw error;
    }
};

const cancelarReserva = async (idTransaccion) => {
    try {
        await db.execute(sql`
            SELECT cancelar_reserva_manual(${idTransaccion}::uuid)
        `);
        return true;
    } catch (error) {
        console.error("[TICKETING SERVICE] Error al cancelar manual:", error);
        throw new Error("Error al liberar los asientos.");
    }
};
const habilitarVentaPartido = async (idPartido, configuracionPrecios) => {
    try {
        return await db.transaction(async (tx) => {
            const nuevosBoletos = [];

            for (const item of configuracionPrecios) {
                const existeInventario = await tx.select()
                    .from(schema.boletosPartido)
                    .where(and(
                        eq(schema.boletosPartido.idPartido, idPartido),
                        eq(schema.boletosPartido.idZona, item.idZona)
                    )).limit(1);

                if (existeInventario.length > 0) {
                    throw new Error(`El inventario para una de las zonas ya fue generado previamente.`);
                }
                const zonaInfo = await tx.select({ capacidad: schema.zonasCancha.capacidad })
                    .from(schema.zonasCancha)
                    .where(eq(schema.zonasCancha.idZona, item.idZona))
                    .limit(1);

                if (zonaInfo.length === 0) throw new Error(`La zona especificada no existe.`);
                const [boletoCreado] = await tx.insert(schema.boletosPartido)
                    .values({
                        idPartido: idPartido,
                        idZona: item.idZona,
                        precio: item.precio,
                        disponibles: zonaInfo[0].capacidad 
                    })
                    .returning();
                
                nuevosBoletos.push(boletoCreado);
            }

            return nuevosBoletos;
        });
    } catch (error) {
        throw error;
    }
};
const obtenerMisBoletos = async (idUsuario) => {
    try {
        console.log(`🗄️ [SERVICE] Buscando boletos comprados para el usuario: ${idUsuario}`);
        
        const query = sql`
            SELECT 
                t.id_transaccion,
                t.cantidad,
                t.monto_total,
                t.fecha_compra AS fecha_transaccion, -- 🛠️ CORRECCIÓN: fecha_compra
                z.nombre_zona AS zona,
                p.fecha AS fecha_partido,
                p.hora AS hora_partido,
                el.nombre_oficial AS local_nombre,
                ev.nombre_oficial AS visitante_nombre,
                c.nombre_cancha AS sede
            FROM transacciones_ticketing t
            INNER JOIN boletos_partido bp ON t.id_boleto = bp.id_boleto
            INNER JOIN zonas_cancha z ON bp.id_zona = z.id_zona
            INNER JOIN partidos p ON bp.id_partido = p.id_partido
            INNER JOIN equipos el ON p.id_equipo_local = el.id_equipo
            INNER JOIN equipos ev ON p.id_equipo_visitante = ev.id_equipo
            INNER JOIN canchas c ON p.id_cancha = c.id_cancha
            WHERE t.id_usuario = ${idUsuario}::uuid 
              AND t.estado_pago = 'Exitoso'
            ORDER BY p.fecha DESC, p.hora DESC
        `;

        const resultados = await db.execute(query);

        console.log("🗄️ [SERVICE] Búsqueda exitosa.");
        
        return resultados.rows ? resultados.rows : resultados;
        
    } catch (error) {
        console.error("❌ [SERVICE ERROR REAL DE SQL]:", error);
        throw new Error("Fallo en la base de datos al obtener los boletos.");
    }
};
module.exports = {
    obtenerBoletosDisponibles,
    iniciarProcesoCompra,
    confirmarPagoExitoso,
    cancelarReserva,
    habilitarVentaPartido,
    obtenerMisBoletos

};