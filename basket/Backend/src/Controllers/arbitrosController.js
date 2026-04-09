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
        if (error.message && error.message.includes('Regla_Sancion')) {
            return res.status(400).json({ error: error.message.replace('Regla_Sancion: ', '') });
        }
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
const getTorneosHistorial = async (req, res, next) => {
    try {
        const torneos = await arbitrosService.obtenerTorneosHistorial(req.params.id_arbitro);
        res.status(200).json(torneos);
    } catch (error) { next(error); }
};

const getPartidosHistorial = async (req, res, next) => {
    try {
        const { id_arbitro, id_torneo } = req.params;
        const partidos = await arbitrosService.obtenerPartidosHistorial(id_arbitro, id_torneo);
        res.status(200).json(partidos);
    } catch (error) { next(error); }
};

const getResumenPartido = async (req, res, next) => {
    try {
        const resumen = await arbitrosService.obtenerResumenFinalizado(req.params.id_partido);
        res.status(200).json(resumen);
    } catch (error) { next(error); }
};
const getEvaluaciones = async (req, res, next) => {
    try {
        const evaluaciones = await arbitrosService.obtenerEvaluaciones(req.params.id_arbitro);
        res.status(200).json(evaluaciones);
    } catch (error) { next(error); }
};

const postRespuestaEvaluacion = async (req, res, next) => {
    try {
        const { respuesta } = req.body;
        const evaluacion = await arbitrosService.responderEvaluacion(req.params.id_evaluacion, respuesta);
        res.status(200).json(evaluacion);
    } catch (error) { next(error); }
};

const getPromedio = async (req, res, next) => {
    try {
        const stats = await arbitrosService.obtenerPromedioArbitro(req.params.id_arbitro);
        res.status(200).json(stats);
    } catch (error) { next(error); }
};
module.exports = {
    getTorneos,
    getPartidos,
    getDetallePartido,
    getAllPartidos,
    setAsistencia,
    getAlineacion,
    iniciarPartido,
    getTorneosHistorial,
    getPartidosHistorial,
    getResumenPartido,
    getEvaluaciones,
    postRespuestaEvaluacion,
    getPromedio
};