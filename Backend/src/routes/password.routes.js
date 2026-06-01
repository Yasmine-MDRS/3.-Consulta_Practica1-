const express = require('express');
const router = express.Router();

const {
  solicitarPin,
  verificarPin,
  cambiarPassword
} = require('../controllers/password.controller');

router.post('/solicitar-pin', solicitarPin);
router.post('/verificar-pin', verificarPin);
router.post('/cambiar-password', cambiarPassword);

module.exports = router;