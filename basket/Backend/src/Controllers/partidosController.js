const partidosService = require('../Services/partidosService');

const crearBulk = async (req, res, next) => {
    try {
        const { partidos } = req.body;
        const nuevosPartidos = await partidosService.crearMultiples(partidos);
        res.status(201).json({ mensaje: 'Calendario generado exitosamente', partidos: nuevosPartidos });
    } catch (error) {
        if (error.message.includes('no tiene una cancha asignada')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};
const obtenerResumen = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resumen = await partidosService.obtenerResumenPartido(id);
        res.status(200).json(resumen);
    } catch (error) { next(error); }
};
const obtenerPorTorneo = async (req, res, next) => {
    try {
        const partidos = await partidosService.obtenerPorTorneo(req.params.id_torneo);
        res.status(200).json(partidos);
    } catch (error) { next(error); }
};
const registrarResultado = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resultado = await partidosService.finalizarPartido(id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};
module.exports = { crearBulk, obtenerPorTorneo, registrarResultado, obtenerResumen };