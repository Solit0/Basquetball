const express = require('express');
const router = express.Router();
const jugadoresController = require('../Controllers/jugadoresController');

router.get('/libres/disponibles', jugadoresController.obtenerJugadoresLibres);
router.get('/equipo/:idEquipo', jugadoresController.obtenerJugadoresPorEquipo);
router.post('/', jugadoresController.crearJugador);
router.post('/:id/vincular', jugadoresController.vincularJugador);
router.put('/:id', jugadoresController.actualizarJugador);
router.delete('/:id/equipo/:idEquipo', jugadoresController.eliminarJugador);

module.exports = router;