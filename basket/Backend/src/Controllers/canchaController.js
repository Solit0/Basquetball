const canchaService = require('../Services/canchaService');

const obtenerCanchas = async (req, res, next) => {
    try {
        const canchas = await canchaService.obtenerTodas();
        res.status(200).json(canchas);
    } catch (error) {
        next(error);
    }
};

const crearCancha = async (req, res, next) => {
    try {
        const nuevaCancha = await canchaService.crear(req.body);
        res.status(201).json({
            mensaje: 'Cancha registrada exitosamente',
            cancha: nuevaCancha
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerCanchas,
    crearCancha
};