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
const getCategorias = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT DISTINCT categoria FROM productos ORDER BY categoria ASC'
    );

    res.json(rows.map(row => row.categoria));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener categorías' });
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

const crearProducto = async (req, res) => {
  try {
    let {
      portada,
      nombre,
      autor,
      editorial,
      anio,
      isbn,
      categoria,
      descripcion,
      precio,
      stock
    } = req.body;

    categoria = (categoria||'')
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, letra => letra.toUpperCase());

    await db.query(
      `INSERT INTO productos
      (portada, nombre, autor, editorial, anio, isbn, categoria, descripcion, precio, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        portada,
        nombre,
        autor,
        editorial,
        anio,
        isbn,
        categoria,
        descripcion,
        precio,
        stock
      ]
    );

    res.json({ message: 'Producto agregado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
};
const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      portada,
      nombre,
      autor,
      editorial,
      anio,
      isbn,
      categoria,
      descripcion,
      precio,
      stock
    } = req.body;

    await db.query(
      `UPDATE productos
       SET portada = ?,
           nombre = ?,
           autor = ?,
           editorial = ?,
           anio = ?,
           isbn = ?,
           categoria = ?,
           descripcion = ?,
           precio = ?,
           stock = ?
       WHERE id = ?`,
      [
        portada,
        nombre,
        autor,
        editorial,
        anio,
        isbn,
        categoria,
        descripcion,
        precio,
        stock,
        id
      ]
    );

    res.json({
      success: true,
      message: 'Producto actualizado'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto'
    });
  }
};

module.exports = {
  getProductos,
  buscarProductos,
  getCategorias,
  getProductosByCategoria,
  getProductoById,
  crearProducto,
  updateProducto
};