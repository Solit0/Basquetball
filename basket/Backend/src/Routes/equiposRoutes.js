const express = require('express');
const router = express.Router();
const equipoController = require('../Controllers/equiposController');

router.get('/', equipoController.obtenerEquipos);
router.get('/libres/disponibles', equipoController.obtenerEquiposLibres);
router.post('/', equipoController.crearEquipo);

router.get('/entrenador/:id', equipoController.obtenerEquipoDeEntrenador);

router.get('/:id', equipoController.obtenerEquipoPorId);
router.put('/:id', equipoController.actualizarEquipo);
router.get('/:id/estadisticas', equipoController.obtenerEstadisticasEquipo);
router.patch('/:id/deshabilitar', equipoController.deshabilitarEquipo);
router.patch('/:id/habilitar', equipoController.habilitarEquipo);
router.post('/:id/abandonar', equipoController.abandonarEquipo);
router.post('/:id/unirse', equipoController.unirseEquipo);

router.get('/:id/jugadores', equipoController.obtenerJugadores); 
module.exports = router;