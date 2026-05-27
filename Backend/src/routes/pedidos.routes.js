const express = require('express');
const router = express.Router();

const {
  getPedidos,
  crearPedido
} = require('../controllers/pedidos.controller.js');

router.get('/:id_user', getPedidos);
router.post('/', crearPedido);

module.exports = router;