const equiposService = require('../Services/equiposServices');

const obtenerEquipos = async (req, res, next) => {
    try {
        const equipos = await equiposService.obtenerTodos();
        res.status(200).json(equipos);
    } catch (error) {
        next(error);
    }
};

const obtenerEquipoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const equipo = await equiposService.obtenerPorId(id);
        
        if (!equipo) {
            return res.status(404).json({ mensaje: 'Equipo no encontrado' });
        }
        res.status(200).json(equipo);
    } catch (error) {
        next(error);
    }
};

const crearEquipo = async (req, res, next) => {
    try {
        const nuevoEquipo = await equiposService.crear(req.body);
        res.status(201).json({
            mensaje: 'Equipo creado exitosamente',
            equipo: nuevoEquipo
        });
    } catch (error) {
        next(error);
    }
};

const actualizarEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const equipoActualizado = await equiposService.actualizar(id, req.body);
        
        if (!equipoActualizado) {
            return res.status(404).json({ mensaje: 'Equipo no encontrado' });
        }
        res.status(200).json({
            mensaje: 'Equipo actualizado exitosamente',
            equipo: equipoActualizado
        });
    } catch (error) {
        if(error.message.includes('DIRECCION_REPETIDA')) {
            return res.status(400).json({ error: error.message.replace('DIRECCION_REPETIDA: ', '') });
        }
        next(error);
    }
};

const deshabilitarEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const equipoDeshabilitado = await equiposService.cambiarEstado(id, false);
        
        res.status(200).json({
            mensaje: 'Equipo deshabilitado correctamente',
            equipo: equipoDeshabilitado
        });
    } catch (error) {
        if (error.message === 'No puedes deshabilitar el equipo porque actualmente está compitiendo en un torneo en curso.') {
            return res.status(400).json({ error: error.message });
        }
        
        // Si es otro error (como caída de BD), lo pasamos al middleware global
        next(error);
    }
};

const habilitarEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const equipoHabilitado = await equiposService.cambiarEstado(id, true);
        
        res.status(200).json({
            mensaje: 'Equipo habilitado correctamente',
            equipo: equipoHabilitado
        });
    } catch (error) {
        next(error);
    }
};

const obtenerEquipoDeEntrenador = async (req, res, next) => {
    try {
        const { id } = req.params;
        const equipo = await equiposService.obtenerPorEntrenador(id);
        
        if (!equipo) {
            return res.status(404).json({ mensaje: 'No tiene equipo registrado' });
        }
        res.status(200).json(equipo);
    } catch (error) {
        next(error);
    }
};

const obtenerEstadisticasEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const estadisticas = await equiposService.obtenerEstadisticas(id);
        res.status(200).json(estadisticas);
    } catch (error) {
        next(error);
    }
};
const obtenerJugadores = async (req, res, next) => {
    try {
        const { id } = req.params;
        const jugadores = await equiposService.obtenerJugadoresPorEquipo(id);
        res.status(200).json(jugadores);
    } catch (error) {
        next(error);
    }
};
const obtenerEquiposLibres = async (req, res, next) => {
    try {
        const equipos = await equiposService.obtenerEquiposLibres();
        res.status(200).json(equipos);
    } catch (error) {
        next(error);
    }
};

const abandonarEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        await equiposService.abandonarEquipo(id);
        
        res.status(200).json({ mensaje: 'Has abandonado el equipo exitosamente' });
    } catch (error) {
        if (error.message === 'No puedes abandonar el equipo porque actualmente está compitiendo en un torneo en curso.') {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

const unirseEquipo = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { id_entrenador } = req.body;
        
        if (!id_entrenador) {
            return res.status(400).json({ error: 'ID del entrenador es requerido' });
        }
        const equipoExistente = await equiposService.obtenerPorEntrenador(id_entrenador);
        if (equipoExistente) {
            return res.status(400).json({ error: 'Ya diriges un equipo actualmente. Debes abandonarlo primero.' });
        }

        const equipoAsignado = await equiposService.unirseEquipo(id, id_entrenador);
        res.status(200).json({ 
            mensaje: 'Te has unido al equipo exitosamente',
            equipo: equipoAsignado 
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    obtenerEquipos,
    obtenerEquipoPorId,
    crearEquipo,
    actualizarEquipo,
    deshabilitarEquipo,
    habilitarEquipo,
    obtenerEquipoDeEntrenador,
    obtenerEstadisticasEquipo,
    obtenerEquiposLibres,
    abandonarEquipo,
    unirseEquipo,
    obtenerJugadores
};