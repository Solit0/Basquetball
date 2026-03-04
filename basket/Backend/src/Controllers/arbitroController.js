const arbitroService = require('../Services/arbitroService');

// Obtener todos los árbitros (usuarios con rol = 3)
const obtenerArbitros = async (req, res, next) => {
    try {
        const arbitros = await arbitroService.obtenerTodos();
        res.status(200).json(arbitros);
    } catch (error) {
        next(error);
    }
};

// Obtener un árbitro por ID
const obtenerArbitroPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const arbitro = await arbitroService.obtenerPorId(id);
        
        if (!arbitro) {
            return res.status(404).json({ mensaje: 'Árbitro no encontrado' });
        }
        res.status(200).json(arbitro);
    } catch (error) {
        next(error);
    }
};

// Crear un nuevo árbitro
const crearArbitro = async (req, res, next) => {
    try {
        const nuevoArbitro = await arbitroService.crear(req.body);
        res.status(201).json({
            mensaje: 'Árbitro creado exitosamente',
            arbitro: nuevoArbitro
        });
    } catch (error) {
        next(error);
    }
};

// Actualizar un árbitro
const actualizarArbitro = async (req, res, next) => {
    try {
        const { id } = req.params;
        const arbitroActualizado = await arbitroService.actualizar(id, req.body);
        
        if (!arbitroActualizado) {
            return res.status(404).json({ mensaje: 'Árbitro no encontrado' });
        }
        res.status(200).json({
            mensaje: 'Árbitro actualizado exitosamente',
            arbitro: arbitroActualizado
        });
    } catch (error) {
        next(error);
    }
};

// Eliminar (desactivar) un árbitro
const eliminarArbitro = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resultado = await arbitroService.eliminar(id);
        
        if (!resultado) {
            return res.status(404).json({ mensaje: 'Árbitro no encontrado' });
        }
        res.status(200).json({ mensaje: 'Árbitro eliminado exitosamente' });
    } catch (error) {
        next(error);
    }
};

// Obtener partidos asignados a un árbitro
const obtenerPartidosAsignados = async (req, res, next) => {
    try {
        const { id } = req.params;
        const partidos = await arbitroService.obtenerPartidos(id);
        res.status(200).json(partidos);
    } catch (error) {
        next(error);
    }
};

// Obtener evaluaciones de un árbitro
const obtenerEvaluaciones = async (req, res, next) => {
    try {
        const { id } = req.params;
        const evaluaciones = await arbitroService.obtenerEvaluaciones(id);
        res.status(200).json(evaluaciones);
    } catch (error) {
        next(error);
    }
};

// Responder a una evaluación
const responderEvaluacion = async (req, res, next) => {
    try {
        const { idEvaluacion } = req.params;
        const { respuesta } = req.body;
        const resultado = await arbitroService.responderEvaluacion(idEvaluacion, respuesta);
        
        res.status(200).json({
            mensaje: 'Respuesta enviada exitosamente',
            evaluacion: resultado
        });
    } catch (error) {
        next(error);
    }
};

// Verificar disponibilidad de un árbitro
const verificarDisponibilidad = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { fecha, hora } = req.query;
        const disponible = await arbitroService.verificarDisponibilidad(id, fecha, hora);
        
        res.status(200).json({
            disponible,
            mensaje: disponible ? 'Árbitro disponible' : 'Árbitro no disponible'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerArbitros,
    obtenerArbitroPorId,
    crearArbitro,
    actualizarArbitro,
    eliminarArbitro,
    obtenerPartidosAsignados,
    obtenerEvaluaciones,
    responderEvaluacion,
    verificarDisponibilidad
};