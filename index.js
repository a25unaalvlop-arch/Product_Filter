const express = require('express');
const { clasificarProducto, guardarCorreccion } = require('./logic/clasificador');
const { calcularRepartoPago } = require('./logic/pago');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/productos/clasificar', (req, res) => {
  const productos = req.body.productos;

  const resultados = productos.map(prod => clasificarProducto(prod));
  res.json({ resultados });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});