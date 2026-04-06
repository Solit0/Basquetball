const inscripcionesService = require('../Services/inscripcionesService');

const solicitarInscripcion = async (req, res, next) => {
    try {
        const { idTorneo } = req.params;
        const { idEntrenador } = req.body; 
        const solicitud = await inscripcionesService.solicitarInscripcion(idTorneo, idEntrenador);
        
        res.status(201).json({ 
            mensaje: 'Solicitud de inscripción enviada correctamente. Espera la aprobación del administrador.',
            solicitud 
        });
    } catch (error) {
        if (error.message.includes('REGLA_')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};
module.exports = {
    solicitarInscripcion
};