const express = require('express');
const router = express.Router();
const arbitrosController = require('../Controllers/arbitrosController');

router.get('/:id_arbitro/torneos', arbitrosController.getTorneos);

router.get('/:id_arbitro/torneos/:id_torneo/partidos', arbitrosController.getPartidos);
router.get('/:id_arbitro/historial-torneos', arbitrosController.getTorneosHistorial);
router.get('/:id_arbitro/historial-torneos/:id_torneo', arbitrosController.getPartidosHistorial);
router.get('/partido/:id_partido/resumen', arbitrosController.getResumenPartido);
router.get('/:id_arbitro/evaluaciones', arbitrosController.getEvaluaciones);
router.post('/evaluacion/:id_evaluacion/responder', arbitrosController.postRespuestaEvaluacion);
router.get('/:id_arbitro/promedio', arbitrosController.getPromedio);
router.get('/:id_arbitro/partidos/:id_partido', arbitrosController.getDetallePartido);
router.get('/:id_arbitro/partidos', arbitrosController.getAllPartidos);
router.put('/partidos/:id_partido/jugadores/:id_jugador/asistencia', arbitrosController.setAsistencia);
router.get('/partidos/:id_partido/equipos/:id_equipo/alineacion', arbitrosController.getAlineacion);
router.put('/partidos/:id_partido/iniciar', arbitrosController.iniciarPartido);
module.exports = router;