const express = require('express');
const router = express.Router();
const torneosController = require('../Controllers/torneosController');

router.post('/', torneosController.crear);
router.get('/activos', torneosController.obtenerActivos);
router.get('/entrenadores/:id_entrenador/torneos', torneosController.getTorneosDeEntrenador);
router.put('/:id', torneosController.editar);
router.delete('/:id', torneosController.eliminar);
router.put('/:id/iniciar', torneosController.iniciar);
router.get('/:id/equipos-elegibles', torneosController.obtenerElegibles);
router.post('/:id/equipos', torneosController.agregarEquipo);
router.get('/:id/equipos-inscritos', torneosController.obtenerInscritos);
router.delete('/:id/equipos/:id_equipo', torneosController.removerEquipo);
module.exports = router;