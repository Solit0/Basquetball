const express = require('express');
const router = express.Router();
const arbitrosController = require('../Controllers/arbitrosController');

router.get('/:id_arbitro/torneos', arbitrosController.getTorneos);

router.get('/:id_arbitro/torneos/:id_torneo/partidos', arbitrosController.getPartidos);

router.get('/:id_arbitro/partidos/:id_partido', arbitrosController.getDetallePartido);

module.exports = router;