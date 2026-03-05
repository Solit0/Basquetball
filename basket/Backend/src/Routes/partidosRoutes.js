const express = require('express');
const router = express.Router();
const partidosController = require('../Controllers/partidosController');

router.post('/bulk', partidosController.crearBulk);
router.get('/torneo/:id_torneo', partidosController.obtenerPorTorneo);
router.get('/entrenadores/:id_entrenador/historial', partidosController.obtenerHistorialEquipo);
router.post('/evaluaciones', partidosController.guardarEvaluacion);
router.post('/:id/finalizar', partidosController.registrarResultado);
router.get('/:id/resumen', partidosController.obtenerResumen);
module.exports = router;