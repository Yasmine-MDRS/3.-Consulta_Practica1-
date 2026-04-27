import { createPaypalOrder, capturePaypalOrder } from '../services/paypal.service.js';
const createOrder = async (req, res) => {
  try {
    const order = await createPaypalOrder(req.body);
    res.json(order);
  } catch (error) {
  console.error("ERROR PAYPAL:", error.message, error);
    res.status(500).json({ error: 'Error al crear orden' });
  }
};

const captureOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const capture = await capturePaypalOrder(orderId);
    res.json(capture);
  } catch (error) {
    console.error("ERROR PAYPAL:", error.message, error);
    res.status(500).json({ error: 'Error al capturar orden' });
  }
};
export { createOrder, captureOrder };
