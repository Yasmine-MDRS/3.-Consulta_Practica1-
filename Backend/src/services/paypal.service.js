import { paypalConfig } from '../config/paypal.config.js';
import { db } from '../config/db.js';

function getBasicAuth() {
  return Buffer
    .from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`)
    .toString('base64');
}

export async function getAccessToken() {
  const response = await fetch(`${paypalConfig.baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${getBasicAuth()}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error obteniendo access token: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}

async function validarStock(items) {
  for (const item of items) {
    const [rows] = await db.query(
      'SELECT stock FROM productos WHERE id = ?',
      [item.id]
    );

    const stock = rows[0]?.stock || 0;

    if (stock < item.cantidad) {
      throw new Error(`Sin stock suficiente para: ${item.nombre}`);
    }
  }
}

async function descontarStock(items) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (const item of items) {
      const [rows] = await connection.query(
        'SELECT stock FROM productos WHERE id = ? FOR UPDATE',
        [item.id]
      );

      const stock = rows[0]?.stock || 0;

      if (stock < item.cantidad) {
        throw new Error(`Stock insuficiente en: ${item.nombre}`);
      }

      await connection.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.id]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function createPaypalOrder(orderData) {

  await validarStock(orderData.items);

  const accessToken = await getAccessToken();

  let total = 0;

  const items = orderData.items.map(item => {
    const cantidad = Number(item.cantidad) || 1;
    const precio = Number(item.precio);

    total += cantidad * precio;

    return {
      name: item.nombre,
      quantity: String(cantidad),
      unit_amount: {
        currency_code: 'MXN',
        value: precio.toFixed(2)
      }
    };
  });

  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'MXN',
          value: total.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'MXN',
              value: total.toFixed(2)
            }
          }
        },
        items
      }
    ]
  };

  const response = await fetch(`${paypalConfig.baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error creando orden PayPal: ${JSON.stringify(data)}`);
  }

  return data;
}

export async function capturePaypalOrder(orderId, items) {

  const accessToken = await getAccessToken();

  const response = await fetch(
    `${paypalConfig.baseUrl}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error capturando orden PayPal: ${JSON.stringify(data)}`);
  }

  if (data.status === 'COMPLETED') {
    await descontarStock(items);
  }

  return data;
}