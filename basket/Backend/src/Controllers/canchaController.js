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
        if (error.message.includes('Ya existe una cancha')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};
const crearCanchaConZonas = async (req, res, next) => {
    try {
        const cancha = await canchaService.crearCanchaConZonas(req.body);
        
        res.status(201).json({ 
            mensaje: "Cancha y zonas creadas exitosamente", 
            cancha: cancha 
        });
    } catch (error) {
        res.status(400).json({ error: error.message || "Error al crear la cancha" });
    }
};
const getSedeYZonasPorEquipo = async (req, res, next) => {
    try {
        // Obtenemos el ID sin importar si la ruta lo llamó id_equipo o id_entrenador
        const id = req.params.id_entrenador || req.params.id_equipo;
        
        if (!id) {
            return res.status(400).json({ error: "ID no proporcionado" });
        }

        const idLimpio = id.replace(/['"]/g, '').trim();
        const datosSede = await canchaService.obtenerCanchaYZonasPorEntrenador(idLimpio);
        
        res.status(200).json(datosSede);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const updateZonas = async (req, res, next) => {
    try {
        const { id_cancha } = req.params;
        const { zonas } = req.body; 

        if (!zonas || !Array.isArray(zonas)) {
            return res.status(400).json({ error: "Formato de zonas inválido." });
        }

        const resultado = await canchaService.sincronizarZonasCancha(id_cancha, zonas);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: "Ocurrió un error al guardar la configuración de las zonas." });
    }
};
module.exports = {
    obtenerCanchas,
    crearCancha,
    crearCanchaConZonas,
    getSedeYZonasPorEquipo,
    updateZonas

};