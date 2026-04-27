const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productos.routes.js');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', productRoutes);

import('./routes/paypal.routes.js').then(modulo => {
app.use('/api/paypal', modulo.default);
}).catch(err => 
    console.error("Error cargando PayPal:", err));

module.exports = app;