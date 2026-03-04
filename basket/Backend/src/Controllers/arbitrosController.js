const arbitrosService = require('../Services/arbitrosService');

const getTorneos = async (req, res, next) => {
    try {
        const { id_arbitro } = req.params;
        const torneos = await arbitrosService.obtenerTorneosAsignados(id_arbitro);
        res.status(200).json(torneos);
    } catch (error) {
        next(error);
    }
};

const getPartidos = async (req, res, next) => {
    try {
        const { id_arbitro, id_torneo } = req.params;
        const partidos = await arbitrosService.obtenerPartidosPorTorneo(id_arbitro, id_torneo);
        res.status(200).json(partidos);
    } catch (error) {
        next(error);
    }
};

const getDetallePartido = async (req, res, next) => {
    try {
        const { id_arbitro, id_partido } = req.params;
        const detalle = await arbitrosService.obtenerDetallePartido(id_arbitro, id_partido);
        if (!detalle) {
            return res.status(404).json({ error: 'Partido no encontrado o no autorizado' });
        }
        res.status(200).json(detalle);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTorneos,
    getPartidos,
    getDetallePartido
};