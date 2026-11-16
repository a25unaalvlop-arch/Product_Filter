const { clasificarProducto } = require('./clasificador');

const TIPOS_TICKET = ['Preparado'];

function calcularRepartoPago(carrito) {
  let totalTicket = 0;
  let totalTarjeta = 0;
  const detalle = [];

  for (const item of carrito) {
    const info = clasificarProducto(item);
    const subtotal = item.precio * item.cantidad;
    const esApto = TIPOS_TICKET.includes(info.tipo); //Només tipus preparado

    if (esApto) {
      totalTicket += subtotal;
    } else {
      totalTarjeta += subtotal;
    }

    detalle.push({
      nombre: item.nombre,
      tipo: info.tipo,
      cantidad: item.cantidad,
      subtotal: Number(subtotal.toFixed(2)),
      pagable_con_ticket: esApto
    });
  }

  return {
    total_carrito: Number((totalTicket + totalTarjeta).toFixed(2)),
    ticket_restaurant: Number(totalTicket.toFixed(2)),
    otro_metodo: Number(totalTarjeta.toFixed(2)),
    detalle
  };
}

module.exports = { calcularRepartoPago };