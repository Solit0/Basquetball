const express = require('express');
const router = express.Router();
const canchaController = require('../Controllers/canchaController');

router.get('/', canchaController.obtenerCanchas);
router.post('/', canchaController.crearCancha);
router.post('/con-zonas', canchaController.crearCanchaConZonas);
router.get('/sede-equipo/:id_equipo', canchaController.getSedeYZonasPorEquipo);
router.put('/:id_cancha/zonas', canchaController.updateZonas);
module.exports = router;