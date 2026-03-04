const express = require('express');
const router = express.Router();
const canchaController = require('../Controllers/canchaController');

router.get('/', canchaController.obtenerCanchas);
router.post('/', canchaController.crearCancha);

module.exports = router;