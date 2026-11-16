const fs = require('fs');
const path = require('path');
const keywords = require('../data/keywords.json');
const rutaProducts = path.join(__dirname, '../data/products.json');

function limpiarTexto(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function clasificarProducto(producto) {
  const guardados = JSON.parse(fs.readFileSync(rutaProducts, 'utf-8'));
  const existente = guardados.find(p => limpiarTexto(p.nombre) === limpiarTexto(producto.nombre));
  if (existente) return existente;

  const textoCompleto = limpiarTexto(`${producto.nombre} ${producto.unidad || ''} ${producto.categoria || ''} ${producto.variedad || ''}`);
  const tiposDetectados = [];
  const palabrasEncontradas = [];

  for (const [tipo, listaPalabras] of Object.entries(keywords.tipos)) {
    for (const palabra of listaPalabras) {
      if (textoCompleto.includes(limpiarTexto(palabra))) {
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
    } 
    else {
        
        const resultadoIA = consultarIAFallback(producto, tiposDetectados); //Logica para peticiones de AI
        if (resultadoIA && resultadoIA.confianza >= 0.75) {
            return {
                ...producto,
                tipo: resultadoIA.tipo,
                confianza: resultadoIA.confianza,
                motivo: `Resuelto por IA: ${resultadoIA.razon}`,
                plan_semanal: ClasificarPlan(producto)
            };
            
                                                                            ///////////////////////////////
        }else{
            if (tiposDetectados.length > 1) {
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
    }
}

function guardarCorreccion(nombre, nuevoTipo) {
  const guardados = JSON.parse(fs.readFileSync(rutaProducts, 'utf-8'));
  let producto = guardados.find(p => limpiarTexto(p.nombre) === limpiarTexto(nombre));

  if (producto) {
    producto.tipo = nuevoTipo;
    producto.confianza = 1.0;
    producto.motivo = 'Editado';
  } else {
    producto = {
      nombre,
      tipo: nuevoTipo,
      confianza: 1.0,
      motivo: 'Editado',
      plan_semanal: ClasificarPlan({ nombre })
    };
    guardados.push(producto);
  }
  fs.writeFileSync(rutaProducts, JSON.stringify(guardados, null, 2));
  return producto;
}

function consultarIAFallback(producto, candidatos) {
    //Logica para peticiones de AI

    
  if (!process.env.AI_API_KEY) return null;
  return null;
}

function ClasificarPlan(producto) {
  const texto = limpiarTexto(`${producto.nombre} ${producto.variedad || ''}`);
  const planes = [];

  for (const [tipo, palabras] of Object.entries(keywords.plan_semanal)) {
    if (palabras.some(p => texto.includes(limpiarTexto(p)))) {
      planes.push(tipo);
    }
  }

  if (planes.length > 0) {
    return planes;
  } else {
    return ['general'];
  }
}

module.exports = { clasificarProducto, guardarCorreccion, limpiarTexto };