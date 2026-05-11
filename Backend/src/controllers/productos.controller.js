const { db } = require('../config/db');

const getProductos = async (req, res) => {
  try {
    const [resultados] = await db.query('SELECT * FROM productos');
    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const buscarProductos = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.json([]);

    const termino = `%${q}%`;

    const [resultados] = await db.query(
      'SELECT * FROM productos WHERE nombre LIKE ? OR autor LIKE ?',
      [termino, termino]
    );

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en búsqueda' });
  }
};
const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM productos WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};
const getProductosByCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;

    const [resultados] = await db.query(
      'SELECT * FROM productos WHERE categoria = ?',
      [categoria]
    );

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al filtrar productos' });
  }
};
module.exports = {
  getProductos,
  buscarProductos,
  getProductoById,
  getProductosByCategoria
};