const express = require('express');
const router = express.Router();
const inscripcionesController = require('../Controllers/inscripcionesController');
router.post('/:idTorneo/solicitar', inscripcionesController.solicitarInscripcion);
module.exports = router;