//ruta de archivo : Backend/src/Routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/usuarioController');
router.put('/:id/perfil', authController.actualizarMiPerfil);
router.post('/login', authController.login);
router.get('/', authController.obtenerUsuarios); 
router.post('/', authController.crearUsuario);
module.exports = router;