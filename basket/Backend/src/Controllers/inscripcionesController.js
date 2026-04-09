const inscripcionesService = require('../Services/inscripcionesService');

const solicitarInscripcion = async (req, res, next) => {
    try {
        const { idTorneo } = req.params;
        const { idEntrenador, roster } = req.body; 
        
        const solicitud = await inscripcionesService.solicitarInscripcion(idTorneo, idEntrenador, roster);
        
        res.status(201).json({ 
            mensaje: 'Solicitud de inscripción y Roster enviados correctamente. Espera la aprobación del administrador.',
            solicitud 
        });
    } catch (error) {
        if (error.message.includes('REGLA DE ')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};
const obtenerMisInscripciones = async (req, res, next) => {
    try {
        const { idEntrenador } = req.params; 
        const inscripciones = await inscripcionesService.obtenerMisInscripciones(idEntrenador);
        res.status(200).json(inscripciones); 
    } catch (error) {
        next(error);
    }
};
const obtenerMiRoster = async (req, res, next) => {
    try {
        const { idTorneo } = req.params;
        const { idEntrenador } = req.query; 
        
        const roster = await inscripcionesService.obtenerMiRoster( idEntrenador, idTorneo);
        res.status(200).json(roster);
    } catch (error) {
        next(error);
    }
};
const editarRosterTorneo = async (req, res, next) => {
    try {
        const { idTorneo } = req.params;
        const { idEntrenador, roster } = req.body; 
        
        const resultado = await inscripcionesService.editarRoster(idTorneo, idEntrenador, roster);
        
        res.status(200).json({ 
            mensaje: 'Tu Roster Oficial ha sido actualizado correctamente.',
            resultado 
        });
    } catch (error) {
        if (error.message.includes('REGLA')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};
const obtenerRosterPublico = async (req, res, next) => {
    try {
        
        const idTorneo = req.params.idTorneo || req.params.id_torneo || req.query.idTorneo || req.query.id_torneo;
        const idEquipo = req.params.idEquipo || req.params.id_equipo || req.query.idEquipo || req.query.id_equipo;
        
        if (!idTorneo || !idEquipo || idTorneo === 'undefined' || idEquipo === 'undefined') {
            return res.status(400).json({ error: "Faltan los IDs correctos del torneo o del equipo." });
        }
        const roster = await inscripcionesService.obtenerRosterPublico(idTorneo, idEquipo);
        
        res.status(200).json(roster);
    } catch (error) {
        next(error);
    }
};
module.exports = {
    solicitarInscripcion,
    obtenerMisInscripciones,
    obtenerMiRoster,
    editarRosterTorneo,
    obtenerRosterPublico
};