Ejercicio para clasificar productos.

Clasifica usando palabras clave guardadas en /data/keywords.json

iniciar con npm install -y && npm install express

Peticiones de prueba:

POST
http://localhost:3000/productos/clasificar
{
  "productos": [
    {
      "nombre": "Tortilla de patatas",
      "categoria": "Platos preparados"
    },
    {
      "nombre": "Tomates de pera",
      "categoria": "Verdura"
    },
    {
      "nombre": "Empanada",
      "categoria": "Panadería"
    },
    {
      "nombre": "Salmón fresco",
      "categoria": "Pescadería"
    }
  ]
}
/////////////////////////////////////////////
http://localhost:3000/checkout/reparto
{
  "carrito": [
    {
      "nombre": "Tortilla de patatas",
      "precio": 6.50,
      "cantidad": 2
    },
    {
      "nombre": "Arroz con pollo",
      "precio": 7.00,
      "cantidad": 1
    },
    {
      "nombre": "Tomates de pera",
      "precio": 2.00,
      "cantidad": 3
    },
    {
      "nombre": "Café molido",
      "precio": 3.20,
      "cantidad": 1
    }
  ]
}
/////////////////////////////////////////////
PUT
http://localhost:3000/productos/corregir
{
  "nombre": "Arroz con pollo",
  "tipo": "Preparado"
}
