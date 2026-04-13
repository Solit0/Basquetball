const alineacionService = require('../Services/alineacionService');

const establecerCapitan = async (req, res, next) => {
    try {
        const { id_partido, id_equipo, id_jugador } = req.body;
        const resultado = await alineacionService.asignarCapitanInterino(id_partido, id_equipo, id_jugador);
        res.status(200).json({
            mensaje: "Capitán interino asignado para este encuentro.",
            data: resultado
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { establecerCapitan };