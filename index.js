const express = require('express');
const fs = require('fs');
const { clasificarProducto, guardarCorreccion } = require('./logic/clasificador');
const { calcularRepartoPago } = require('./logic/pago');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/productos/clasificar', (req, res) => {
  const productos = req.body.productos;

  const resultados = productos.map(prod => clasificarProducto(prod));

  const guardados = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
  resultados.forEach(item => {
    if (!guardados.some(p => p.nombre.toLowerCase() === item.nombre.toLowerCase())) {
      guardados.push(item);
    }
  });
  fs.writeFileSync('./data/products.json', JSON.stringify(guardados, null, 2));

  res.json({ resultados });
});

app.put('/productos/corregir', (req, res) => {
  const { nombre, tipo } = req.body;
  const actualizado = guardarCorreccion(nombre, tipo);

  if (!actualizado) {
    return res.status(404).json({ error: 'Este producto no existe' });
  }

  res.json({ mensaje: 'Producto actualizado', producto: actualizado });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});