const express = require('express');
const router = express.Router();
const estadisticasController = require('../Controllers/estadisticasController');

router.get('/ranking', estadisticasController.obtenerRanking);
router.get('/clasificaciones', estadisticasController.listarClasificaciones);
module.exports = router;