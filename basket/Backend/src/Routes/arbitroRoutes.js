const express = require('express');
const router = express.Router();
const arbitroController = require('../Controllers/arbitroController');

// Rutas básicas CRUD
router.get('/', arbitroController.obtenerArbitros);
router.get('/:id', arbitroController.obtenerArbitroPorId);
router.post('/', arbitroController.crearArbitro);
router.put('/:id', arbitroController.actualizarArbitro);
router.delete('/:id', arbitroController.eliminarArbitro);

// Rutas específicas
router.get('/:id/partidos', arbitroController.obtenerPartidosAsignados);
router.get('/:id/evaluaciones', arbitroController.obtenerEvaluaciones);
router.post('/evaluaciones/:idEvaluacion/responder', arbitroController.responderEvaluacion);
router.get('/:id/disponibilidad', arbitroController.verificarDisponibilidad);

module.exports = router;