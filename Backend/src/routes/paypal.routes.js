import express from 'express';
const router = express.Router();

import { createOrder, captureOrder } from '../controllers/paypal.controllers.js';

router.post('/create-order', createOrder);
router.post('/capture-order', captureOrder);

export default router;