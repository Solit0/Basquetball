const resolucionesService = require('../Services/resolucionesService');

const obtenerPendientes = async (req, res, next) => {
    try {
        const sanciones = await resolucionesService.obtenerSancionesPendientes();
        res.status(200).json(sanciones);
    } catch (error) {
        next(error);
    }
};
const dictarResolucion = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const datos_resolucion = req.body;
        
        const resultado = await resolucionesService.dictarResolucion(id, datos_resolucion);
        res.status(201).json({
            mensaje: "Resolución dictada exitosamente.",
            resolucion: resultado
        });
    } catch (error) {
        next(error);
    }
};
const obtenerHistorial = async (req, res, next) => {
    try {
        const historial = await resolucionesService.obtenerHistorialResoluciones();
        res.status(200).json(historial);
    } catch (error) {
        next(error);
    }
};
const pagarMulta = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const resultado = await resolucionesService.marcarMultaPagada(id);
        res.status(200).json({ mensaje: "Multa marcada como pagada", resolucion: resultado });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    obtenerPendientes,
    dictarResolucion,
    obtenerHistorial,
    pagarMulta
};