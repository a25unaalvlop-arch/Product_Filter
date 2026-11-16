Copia y pega este código tal cual en tu archivo README.md:

Markdown
# Clasificador de Productos API

Ejercicio en Node.js y Express para clasificar productos utilizando un diccionario de palabras clave almacenado en `/data/keywords.json`.

## Instalación e inicio

Ejecuta los siguientes comandos en la terminal para inicializar el proyecto e instalar las dependencias:

```bash
npm init -y
npm install express
Peticiones de prueba
1. Clasificar productos
Método: POST

Endpoint: http://localhost:3000/productos/clasificar

Body (JSON):

JSON
{
  "productos": [
    { "nombre": "Tortilla de patatas", "categoria": "Platos preparados" },
    { "nombre": "Tomates de pera", "categoria": "Verdura" },
    { "nombre": "Empanada", "categoria": "Panadería" },
    { "nombre": "Salmón fresco", "categoria": "Pescadería" }
  ]
}
2. Calcular reparto en checkout
Método: POST

Endpoint: http://localhost:3000/checkout/reparto

Body (JSON):

JSON
{
  "carrito": [
    { "nombre": "Tortilla de patatas", "precio": 6.50, "cantidad": 2 },
    { "nombre": "Arroz con pollo", "precio": 7.00, "cantidad": 1 },
    { "nombre": "Tomates de pera", "precio": 2.00, "cantidad": 3 },
    { "nombre": "Café molido", "precio": 3.20, "cantidad": 1 }
  ]
}
3. Corregir tipo de producto
Método: PUT

Endpoint: http://localhost:3000/productos/corregir

Body (JSON):

JSON
{
  "nombre": "Arroz con pollo",
  "tipo": "Preparado"
}
