const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productos.routes.js');
const paypalRoutes = require('./routes/paypal.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const perfilRoutes = require('./routes/perfil.routes.js');
const pedidosRoutes = require('./routes/pedidos.routes.js');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/productos', productRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/pedidos', pedidosRoutes);
module.exports = app;