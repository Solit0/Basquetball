const express = require('express');
const router = express.Router();
const canalController = require('../Controllers/canalesController');

router.get('/', canalController.obtenerCanales);
router.post('/', canalController.crearCanal);
router.post('/:id_canal/transmisiones', canalController.crearTransmision);
router.get('/:id_canal/transmisiones', canalController.getTransmisionesCanal);
router.delete('/transmisiones/:id_transmision', canalController.deleteTransmision);
module.exports = router;