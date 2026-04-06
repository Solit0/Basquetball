const torneosService = require('../Services/torneosService');

const crear = async (req, res, next) => {
    try {
        const nuevoTorneo = await torneosService.crearTorneo(req.body);
        res.status(201).json({ 
            mensaje: 'Torneo creado exitosamente', 
            torneo: nuevoTorneo 
        });
    } catch (error) { 
        next(error); 
    }
};
const removerEquipo = async (req, res, next) => {
    try {
        const { id, id_equipo } = req.params;
        await torneosService.quitarEquipo(id, id_equipo);
        res.status(200).json({ mensaje: 'Equipo removido del torneo exitosamente.' });
    } catch (error) {
        if (error.message.includes('ya está en curso')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};
const getTorneosDeEntrenador = async (req, res, next) => {
    try {
        
        const { id_entrenador } = req.params;
        
        const torneos = await torneosService.obtenerTorneosDeEntrenador(id_entrenador);
        
        res.status(200).json(torneos);
    } catch (error) {
        next(error);
    }
};
const editar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const torneo = await torneosService.editarTorneo(id, req.body);
        res.status(200).json({ 
            mensaje: 'Bases del torneo actualizadas exitosamente', 
            torneo 
        });
    } catch (error) { 
        
        if (error.message.includes('Solo puedes editar')) {
            return res.status(400).json({ error: error.message });
        }
        next(error); 
    }
};
const eliminar = async (req, res, next) => {
    try {
        const { id } = req.params;
        await torneosService.eliminarTorneo(id);
        res.status(200).json({ mensaje: 'Torneo cancelado exitosamente.' });
    } catch (error) {
        if (error.message.includes('REGLA_TORNEO')) {
            return res.status(400).json({ error: error.message.replace('REGLA_TORNEO: ', '') });
        }
        next(error);
    }
};

const iniciar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const torneo = await torneosService.iniciarTorneo(id);
        res.status(200).json({ 
            mensaje: '¡El torneo ha comenzado oficialmente! Las inscripciones han sido cerradas.', 
            torneo 
        });
    } catch (error) {
        
        if (error.message.includes('REGLA_TORNEO') || error.message.includes('sin equipos')) {
            return res.status(400).json({ error: error.message.replace('REGLA_TORNEO: ', '') });
        }
        next(error);
    }
};

const obtenerActivos = async (req, res, next) => {
    try {
        const torneos = await torneosService.obtenerTodosActivos();
        res.status(200).json(torneos);
    } catch (error) { 
        next(error); 
    }
};

const obtenerElegibles = async (req, res, next) => {
    try {
        const { id } = req.params;
        const equipos = await torneosService.obtenerEquiposElegibles(id);
        res.status(200).json(equipos);
    } catch (error) { 
        next(error); 
    }
};

const agregarEquipo = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { id_equipo } = req.body;
        
        await torneosService.inscribirEquipo(id, id_equipo);
        
        res.status(201).json({ 
            mensaje: 'Equipo inscrito al torneo exitosamente.' 
        });
    } catch (error) {
    
        if (error.message.includes('REGLA_TORNEO') || error.message.includes('ya está inscrito')) {
            return res.status(400).json({ error: error.message.replace('REGLA_TORNEO: ', '') });
        }
        next(error);
    }
};
const obtenerInscritos = async (req, res, next) => {
    try {
        const equipos = await torneosService.obtenerEquiposInscritos(req.params.id);
        res.status(200).json(equipos);
    } catch (error) { next(error); }
};
const obtenerInscripciones = async (req, res, next) => {
    try {
        const { idTorneo } = req.params; 
        
        const inscripciones = await torneosService.obtenerInscripcionesPorTorneo(idTorneo);
        
        res.status(200).json(inscripciones); 
    } catch (error) {
        next(error);
    }
};
const responderInscripcion = async (req, res, next) => {
    try {
        const { idTorneo, idEquipo } = req.params;
        const { estado_nuevo } = req.body;
        
        const resultado = await torneosService.responderInscripcion(idTorneo, idEquipo, estado_nuevo);
        
        res.status(200).json({ 
            mensaje: `Solicitud ${estado_nuevo.toLowerCase()} con éxito`,
            inscripcion: resultado
        });
    } catch (error) {
        if (error.message.includes('REGLA_TORNEO')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};
module.exports = {
    crear, 
    editar,
    obtenerInscripciones,
    responderInscripcion,
    iniciar, 
    obtenerActivos,
    obtenerElegibles, 
    agregarEquipo,
    eliminar,
    obtenerInscritos,
    removerEquipo,
    getTorneosDeEntrenador
};