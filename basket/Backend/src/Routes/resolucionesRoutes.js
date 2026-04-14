const express = require('express');
const router = express.Router();
const resolucionesController = require('../Controllers/resolucionesController');
router.get('/pendientes', resolucionesController.obtenerPendientes);
router.patch('/historial/:id/pagar', resolucionesController.pagarMulta);
router.post('/:id/resolver', resolucionesController.dictarResolucion);
router.get('/historial', resolucionesController.obtenerHistorial);
module.exports = router;