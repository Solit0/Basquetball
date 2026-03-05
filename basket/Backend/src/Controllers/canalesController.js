const canalService = require('../Services/canalService');

const obtenerCanales = async (req, res, next) => {
    try {
        const canales = await canalService.obtenerTodos();
        res.status(200).json(canales);
    } catch (error) {
        next(error);
    }
};

const crearCanal = async (req, res, next) => {
    try {
        // Validaciones básicas antes de tocar la base de datos
        const { nombre_canal, id_tipo } = req.body;
        
        if (!nombre_canal || !id_tipo) {
            return res.status(400).json({ 
                error: 'El nombre del canal y el tipo son obligatorios' 
            });
        }

        const nuevoCanal = await canalService.crear(req.body);
        
        res.status(201).json({
            mensaje: 'Canal registrado exitosamente',
            canal: nuevoCanal
        });
    } catch (error) {
        next(error);
    }
};
const crearTransmision = async (req, res, next) => {
    try {
        const { id_canal } = req.params;
        const { id_partido, hora_transmision } = req.body;
        
        if (!id_partido || !hora_transmision) {
            return res.status(400).json({ error: "Faltan datos de la transmisión" });
        }

        const nuevaTransmision = await canalService.asignarTransmision(id_canal, id_partido, hora_transmision);
        res.status(201).json(nuevaTransmision);
    } catch (error) {
        next(error);
    }
};

const getTransmisionesCanal = async (req, res, next) => {
    try {
        const { id_canal } = req.params;
        const transmisiones = await canalService.obtenerTransmisionesPorCanal(id_canal);
        res.status(200).json(transmisiones);
    } catch (error) {
        next(error);
    }
};

const deleteTransmision = async (req, res, next) => {
    try {
        const { id_transmision } = req.params;
        await canalService.eliminarTransmision(id_transmision);
        res.status(200).json({ message: "Transmisión eliminada exitosamente" });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    obtenerCanales,
    crearCanal,
    crearTransmision,
    getTransmisionesCanal,
    deleteTransmision
};