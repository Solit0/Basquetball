const estadisticasService = require('../Services/estadisticasService');

const obtenerRanking = async (req, res, next) => {
    try {
        const { categoria, clasificacion, torneo } = req.query;
        
        const ranking = await estadisticasService.obtenerRankingEquipos(categoria, clasificacion, torneo);
        res.status(200).json(ranking);
    } catch (error) {
        next(error);
    }
};
const listarClasificaciones = async (req, res, next) => {
    try {
        const data = await estadisticasService.obtenerTodasLasClasificaciones();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};
module.exports = { obtenerRanking, listarClasificaciones };