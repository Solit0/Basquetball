const ticketingService = require('../Services/ticketingService');

const obtenerBoletosPorPartido = async (req, res, next) => {
    try {
        const { id_partido } = req.params;
        console.log(`\n [CONTROLLER] =======================================`);
        console.log(` [CONTROLLER] Petición GET recibida en /partido/${id_partido}`);
        
        const boletos = await ticketingService.obtenerBoletosDisponibles(id_partido);
        
        console.log(` [CONTROLLER] El servicio retornó ${boletos.length} tipos de boletos.`);
        console.log(` [CONTROLLER] =======================================\n`);
        
        res.status(200).json(boletos);
    } catch (error) {
        console.error("[CONTROLLER ERROR] Fallo en obtenerBoletosPorPartido:", error);
        next(error);
    }
};
const iniciarReserva = async (req, res, next) => {
    try {
        const { idUsuario, idBoleto, cantidad, montoTotal } = req.body;
        const resultado = await ticketingService.iniciarProcesoCompra(idUsuario, idBoleto, cantidad, montoTotal);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const confirmarPago = async (req, res, next) => {
    try {
        console.log("\n=============================================");
        console.log(" [CONTROLLER] Petición recibida en /confirmar-pago");
        console.log(" [CONTROLLER] Contenido crudo de req.body:", req.body);
        
        const { idTransaccion, email, nombre, detalles } = req.body;

        console.log(` [CONTROLLER] Variables extraídas -> Transaccion: ${idTransaccion}, Email: ${email}, Nombre: ${nombre}`);
        console.log("=============================================\n");

        if (!idTransaccion) return res.status(400).json({ error: "Falta el ID de la transacción." });
        if (!email) return res.status(400).json({ error: "Falta el correo electrónico del usuario (email)." });
        if (!nombre) return res.status(400).json({ error: "Falta el nombre del usuario." });

        await ticketingService.confirmarPagoExitoso(idTransaccion, email, nombre, detalles);
        
        res.status(200).json({ mensaje: "Pago confirmado, base de datos actualizada y recibo enviado." });
    } catch (error) {
        console.error(" [CONTROLLER ERROR] Fallo interno al confirmar pago:", error);
        res.status(500).json({ error: "Error interno al procesar la confirmación del pago." });
    }
};

const cancelarReservaManual = async (req, res, next) => {
    try {
        const { idTransaccion } = req.body;
        await ticketingService.cancelarReserva(idTransaccion);
        res.status(200).json({ mensaje: "Reserva liberada exitosamente." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getMisBoletos = async (req, res, next) => {
    try {
        let { id_usuario } = req.params;
        id_usuario = id_usuario.replace(/['"]/g, '').trim();

        if (!id_usuario) {
            return res.status(400).json({ error: "Falta el ID del usuario." });
        }

        const misBoletos = await ticketingService.obtenerMisBoletos(id_usuario);
        
        res.status(200).json(misBoletos);
    } catch (error) {
        console.error("📍 [CONTROLLER ERROR] al obtener mis boletos:", error);
        res.status(500).json({ error: "Error al cargar el historial de compras." });
    }
};
const postHabilitarVenta = async (req, res, next) => {
    try {
        const { idPartido, precios } = req.body; 

        if (!idPartido || !precios || precios.length === 0) {
            return res.status(400).json({ error: "Faltan datos para configurar la venta." });
        }

        const boletos = await ticketingService.habilitarVentaPartido(idPartido, precios);
        
        res.status(201).json({
            mensaje: "Venta habilitada exitosamente para el partido.",
            inventario: boletos
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    obtenerBoletosPorPartido,
    iniciarReserva,
    confirmarPago,
    cancelarReservaManual,
    postHabilitarVenta,
    getMisBoletos
};