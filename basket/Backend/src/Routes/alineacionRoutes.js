const express = require('express');
const router = express.Router();
const alineacionController = require('../Controllers/alineacionController');

router.post('/capitan-interino', alineacionController.establecerCapitan);

module.exports = router;