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

module.exports = {
    obtenerCanales,
    crearCanal
};