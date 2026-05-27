const { db } = require('../config/db');
const getPedidos = async (req, res) => {
  try {
    const { id_user } = req.params;

    const [pedidos] = await db.query(
      `SELECT id_pedido, total, fecha_compra, estado
       FROM pedidos
       WHERE id_user = ?
       ORDER BY fecha_compra DESC`,
      [id_user]
    );

    for (const pedido of pedidos) {
      const [detalles] = await db.query(
        `SELECT nombre_producto, cantidad, precio_unitario, importe
         FROM pedido_detalle
         WHERE id_pedido = ?`,
        [pedido.id_pedido]
      );

      pedido.detalles = detalles;
    }

    res.json(pedidos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

const crearPedido = async (req, res) => {
  try {
    const { id_user, total, items } = req.body;

    const [pedido] = await db.query(
      `INSERT INTO pedidos (id_user, total, estado)
       VALUES (?, ?, 'PAGADO')`,
      [id_user, total]
    );

    const id_pedido = pedido.insertId;

    for (const item of items) {
      const cantidad = Number(item.cantidad) || 1;
      const precio = Number(item.precio);
      const importe = cantidad * precio;

      await db.query(
        `INSERT INTO pedido_detalle
         (id_pedido, id_producto, nombre_producto, cantidad, precio_unitario, importe)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id_pedido,
          item.id,
          item.nombre,
          cantidad,
          precio,
          importe
        ]
      );
    }

    res.json({
      message: 'Pedido guardado correctamente',
      id_pedido
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar pedido' });
  }
};

module.exports = {
  getPedidos,
  crearPedido
};