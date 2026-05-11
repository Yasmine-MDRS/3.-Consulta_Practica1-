const express = require('express');
const router = express.Router();

const {
  getProductos,
  buscarProductos,
  getProductoById,
  getProductosByCategoria
} = require('../controllers/productos.controller');

router.get('/', getProductos);
router.get('/buscar', buscarProductos);
router.get('/:id', getProductoById);
router.get('/categoria/:categoria', getProductosByCategoria);
module.exports = router;