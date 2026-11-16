const fs = require('fs');
const path = require('path');
const keywords = require('../data/keywords.json');
const rutaProducts = path.join(__dirname, '../data/products.json');


function clasificarProducto(producto) {
  const guardados = JSON.parse(fs.readFileSync(rutaProducts, 'utf-8'));
  const existente = guardados.find(p => p.nombre.toLowerCase() === producto.nombre.toLowerCase());
  if (existente) return existente;



  const textoCompleto = `${producto.nombre} ${producto.unidad || ''} ${producto.categoria || ''} ${producto.variedad || ''}`.toLowerCase();
  const tiposDetectados = [];
  const palabrasEncontradas = [];


  for (const [tipo, listaPalabras] of Object.entries(keywords.tipos)) {
    for (const palabra of listaPalabras) {
      if (textoCompleto.includes(palabra)) {
        if (!tiposDetectados.includes(tipo)) {
          tiposDetectados.push(tipo);
        }
        palabrasEncontradas.push(palabra);
      }
    }
  }



  if (tiposDetectados.length === 1) {
    return {
      ...producto,
      tipo: tiposDetectados[0],
      confianza: 0.9,
      motivo: "Coincide con alguna palabra clave de 1 solo tipo",
      plan_semanal: ClasificarPlan(producto)
    };
  } else if (tiposDetectados.length > 1) {
    return {
      ...producto,
      tipo: 'pendiente de revisión',
      confianza: 0.5,
      motivo: "Contiene palabras clave de más de 1 tipo",
      plan_semanal: ClasificarPlan(producto)
    };
  } else {
    return {
      ...producto,
      tipo: 'pendiente de revisión',
      confianza: 0.0,
      motivo: 'Ninguna palabra coincide',
      plan_semanal: ClasificarPlan(producto)
    };
  }
}


function guardarCorreccion(nombre, nuevoTipo) {
  const guardados = JSON.parse(fs.readFileSync(rutaProducts, 'utf-8'));
  const producto = guardados.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());

  if (!producto) return null;

  producto.tipo = nuevoTipo;
  producto.confianza = 1.0;
  producto.motivo = 'Editado manualmente';

  fs.writeFileSync(rutaProducts, JSON.stringify(guardados, null, 2));
  return producto;
}



function ClasificarPlan(producto) {
  const texto = `${producto.nombre} ${producto.variedad || ''}`.toLowerCase();
  const planes = [];

  for (const [tipo, palabras] of Object.entries(keywords.plan_semanal)) {
    if (palabras.some(p => texto.includes(p))) {
      planes.push(tipo);
    }
  }

  if (planes.length > 0) {
    return planes;
  } else {
    return ['general'];
  }
}

module.exports = { clasificarProducto, guardarCorreccion };