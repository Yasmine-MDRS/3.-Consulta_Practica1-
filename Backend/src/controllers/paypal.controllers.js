import { createPaypalOrder, capturePaypalOrder } from '../services/paypal.service.js';

const createOrder = async (req, res) => {
  try {
    const order = await createPaypalOrder(req.body);
    res.json(order);
  } catch (error) {
    console.error("ERROR PAYPAL:", error.message);
    res.status(500).json({ message: error.message });
  }
};
const captureOrder = async (req, res) => {
  try {
    const { orderId, items } = req.body;

    const capture = await capturePaypalOrder(orderId, items);

    res.json(capture);
  } catch (error) {
    console.error("ERROR PAYPAL:", error.message);
    res.status(500).json({ message: error.message });
  }
};
export { createOrder, captureOrder };