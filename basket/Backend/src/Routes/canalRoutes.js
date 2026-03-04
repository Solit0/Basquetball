const express = require('express');
const router = express.Router();
const canalController = require('../Controllers/canalesController');

router.get('/', canalController.obtenerCanales);
router.post('/', canalController.crearCanal);

module.exports = router;