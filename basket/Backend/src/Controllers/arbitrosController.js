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
const getAllPartidos = async (req, res, next) => {
    try {
        const { id_arbitro } = req.params;
        const partidos = await arbitrosService.obtenerTodosPartidosAsignados(id_arbitro);
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
const setAsistencia = async (req, res, next) => {
    try {
        const { id_partido, id_jugador } = req.params;
        const { estado } = req.body; 
        
        const resultado = await arbitrosService.marcarAsistenciaJugador(id_partido, id_jugador, estado);
        res.status(200).json({ mensaje: 'Asistencia actualizada', data: resultado });
    } catch (error) {
        next(error);
    }
};

const getAlineacion = async (req, res, next) => {
    try {
        const { id_partido, id_equipo } = req.params;
        const alineacion = await arbitrosService.obtenerAlineacionPartido(id_partido, id_equipo);
        res.status(200).json(alineacion);
    } catch (error) {
        next(error);
    }
};
const iniciarPartido = async (req, res, next) => {
    try {
        const { id_partido } = req.params;
        
        const resultado = await arbitrosService.actualizarEstadoPartido(id_partido, 'En Juego'); 
        res.status(200).json({ mensaje: 'Partido iniciado con éxito', data: resultado });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getTorneos,
    getPartidos,
    getDetallePartido,
    getAllPartidos,
    setAsistencia,
    getAlineacion,
    iniciarPartido
};