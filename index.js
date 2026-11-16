const express = require('express');
const { clasificarProducto, guardarCorreccion } = require('./logic/clasificador');
const { calcularRepartoPago } = require('./logic/pay');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/productos/clasificar', (req, res) => {
  const productos = req.body.productos || (Array.isArray(req.body) ? req.body : []);
  const resultados = productos.map(prod => clasificarProducto(prod));
  res.json({ resultados });
});

const handlerCorregir = (req, res) => {
  const { nombre, tipo } = req.body;
  if (!nombre || !tipo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (nombre y tipo)' });
  }

  const actualizado = guardarCorreccion(nombre, tipo);
  res.json({ mensaje: 'Producto actualizado', producto: actualizado });
};

app.put('/productos/corregir', handlerCorregir);
app.post('/productos/corregir', handlerCorregir);

app.post('/checkout/reparto', (req, res) => {
  const carrito = req.body.carrito || (Array.isArray(req.body) ? req.body : []);
  const reparto = calcularRepartoPago(carrito);
  res.json(reparto);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});