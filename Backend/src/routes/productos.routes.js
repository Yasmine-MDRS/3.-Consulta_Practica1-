const express = require('express');
const router = express.Router();

const {
  getProductos,
  buscarProductos,
  getProductoById,
  getProductosByCategoria,
  crearProducto,
  updateProducto,
  getCategorias
} = require('../controllers/productos.controller');

router.get('/', getProductos);
router.get('/buscar', buscarProductos);
router.get('/categoria/:categoria', getProductosByCategoria);
router.get('/:id', getProductoById);

router.post('/', crearProducto);
router.put('/:id', updateProducto);
router.get('/categorias/lista', getCategorias);
module.exports = router;