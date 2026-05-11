const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productos.routes.js');
const paypalRoutes = require('./routes/paypal.routes.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/productos', productRoutes);
app.use('/api/paypal', paypalRoutes);

module.exports = app;