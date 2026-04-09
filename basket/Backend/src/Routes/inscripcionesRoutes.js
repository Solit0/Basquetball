const express = require('express');
const router = express.Router();
const inscripcionesController = require('../Controllers/inscripcionesController');
router.get('/mis-solicitudes/:idEntrenador', inscripcionesController.obtenerMisInscripciones);
router.post('/:idTorneo/solicitar', inscripcionesController.solicitarInscripcion);
router.get('/:idTorneo/roster', inscripcionesController.obtenerMiRoster);
router.get('/:idTorneo/roster-publico/:idEquipo', inscripcionesController.obtenerRosterPublico);
router.put('/:idTorneo/roster', inscripcionesController.editarRosterTorneo);
module.exports = router;