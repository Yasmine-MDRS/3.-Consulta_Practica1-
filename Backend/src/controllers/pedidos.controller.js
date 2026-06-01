const { db } = require('../config/db');
const { enviarReciboXML } = require('../services/brevo.service');

const escapeXml = (value = '') => {
  return String(value).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  }[m] || m));
};

const generarXML = (usuario, items, total) => {
  const fecha = new Date().toISOString();

  let conceptos = '';

  for (const p of items) {
    const cantidad = Number(p.cantidad) || 1;
    const precio = Number(p.precio);
    const importe = cantidad * precio;

    conceptos += `
      <cfdi:Concepto 
        ClaveProdServ="01010101"
        Cantidad="${cantidad}"
        ClaveUnidad="H87"
        Descripcion="${escapeXml(p.nombre)}"
        ValorUnitario="${precio.toFixed(2)}"
        Importe="${importe.toFixed(2)}"/>
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante 
  Version="4.0"
  Fecha="${fecha}"
  SubTotal="${Number(total).toFixed(2)}"
  Total="${Number(total).toFixed(2)}"
  Moneda="MXN"
  xmlns:cfdi="http://www.sat.gob.mx/cfd/4">

  <cfdi:Emisor 
    Nombre="Starlight Libreria"
    Rfc="XAXX010101000"/>

  <cfdi:Receptor 
    Nombre="${escapeXml(usuario.nombre_completo || 'Cliente General')}"
    Rfc="${escapeXml(usuario.rfc || 'XAXX010101000')}"
    UsoCFDI="${escapeXml(usuario.uso_cfdi || 'G03')}"
    DomicilioFiscalReceptor="${escapeXml(usuario.codigo_postal || '00000')}"
    RegimenFiscalReceptor="${escapeXml(usuario.regimen_fiscal || '616')}"/>

  <cfdi:Conceptos>
    ${conceptos}
  </cfdi:Conceptos>

</cfdi:Comprobante>`;
};

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
    const { id_user, total, items, xml } = req.body;

    if (!id_user || !total || !items || items.length === 0) {
      return res.status(400).json({
        message: 'Datos del pedido incompletos'
      });
    }

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

    const [usuarios] = await db.query(
      `SELECT correo, nombre_completo, rfc, uso_cfdi, codigo_postal, regimen_fiscal
       FROM usuarios
       WHERE id_user = ?`,
      [id_user]
    );

    const usuario = usuarios[0];

    if (usuario && usuario.correo) {
      const xml = generarXML(usuario, items, total);

      await enviarReciboXML(
        usuario.correo,
        usuario.nombre_completo,
        xml
      );
    }

    res.json({
      message: 'Pedido guardado correctamente y recibo enviado por correo',
      id_pedido
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al guardar pedido o enviar recibo'
    });
  }
};

module.exports = {
  getPedidos,
  crearPedido
};