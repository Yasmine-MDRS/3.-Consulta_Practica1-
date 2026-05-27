const express = require('express');
const router = express.Router();

const {
  getPerfil,
  updatePerfil
} = require('../controllers/perfil.controller.js');

router.get('/:id_user', getPerfil);
router.put('/:id_user', updatePerfil);

module.exports = router;