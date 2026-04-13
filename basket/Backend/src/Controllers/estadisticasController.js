const estadisticasService = require('../Services/estadisticasService');

const obtenerRanking = async (req, res, next) => {
    try {
        const { categoria } = req.query;
        const ranking = await estadisticasService.obtenerRankingEquipos(categoria);
        res.status(200).json(ranking);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerRanking
};