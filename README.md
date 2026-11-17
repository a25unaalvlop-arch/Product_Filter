Este programa automatiza la clasificación de productos de diferentes comercios en 4 tipos principales, y gestión de pagos:
<br><br>
---
**Preparado**: Tortilla de patatas, lasaña, ensalada lista, etc.  
<br>
**Ingrediente**: Tomates, pechuga de pollo, queso, huevos, etc.  
<br>
**Suplemento**: Proteína en polvo, colágeno, vitaminas, etc.  
<br>
**Alacena**: Arroz, aceite, legumbres en bote, café, etc.  


---

El sistema de clasificación procesa los productos de la siguiente forma:
<br><br>
**Correcciones Manuales Prioritarias (data/products.json):**  
Si se fija el tipo de un producto manualmente, esa decisión manda con confianza máxima (1.0), tiene prioridad sobre las reglas automáticas y desactiva el flag de revisión.
<br>

**Filtro por Palabras (data/keywords.json):**  
Detecta límites de palabra para eliminar falsos positivos (evita que "pan" coincida dentro de "empanada" o "sal" dentro de "salmón") y palabras en plural o singular.
<br>

**Fallback Asistido por AI (consultarIAFallback):**  
Cuando un producto es ambiguo, se hace una petición a un LLM para analizar el producto.
<br><br>
**Fallback en caso de AI no funcional:**  
Si un producto es ambiguo y el fallback a AI falla por desconexión o porque no ha sido capaz de categorizarlo, lo marca pendiente de revisión humana.
<br>

**Clasificación para Plan Semanal:**  
Cada producto se cataloga automáticamente: comodidad (listo para comer), salud (frescos, eco, sin sal) o ahorro (granel, formatos familiares, alacena).
<br><br><br>

---

**Reparto de Pago en Checkout (Ticket Restaurant)**

Los tickets restaurant solo pueden utilizarse para comida de categoría (Preparado). 

El endpoint /checkout/reparto:

- Analiza cada ítem del carrito.
- Suma al total de Ticket Restaurant únicamente los productos clasificados como Preparado.
- Usa tarjeta para los ingredientes crudos, alacena, suplementos y productos en revisión.

---

Instalación y uso

Instalar dependencias:
```bash
npm install
```

Arrancar el servidor (puerto 3000 por defecto):
```bash
node index.js
```

---

Clasificar Productos

* **Método:** `POST`
* **URL:** `http://localhost:3000/productos/clasificar`

**Body (JSON):**
```json
{
  "productos": [
    {
      "nombre": "Tortilla de patatas",
      "unidad": "unidad",
      "categoria": "Platos preparados",
      "variedad": "con cebolla",
      "precio": 6.50
    },
    {
      "nombre": "Tomates",
      "unidad": "kg",
      "categoria": "Verdura",
      "variedad": "pera ecológico",
      "precio": 2.30
    },
    {
      "nombre": "Arroz con pollo",
      "unidad": "porción 400g",
      "categoria": "Platos preparados",
      "variedad": "estilo casero",
      "precio": 6.90
    },
    {
      "nombre": "Artilugio misterioso",
      "unidad": "unidad",
      "categoria": "Bazar",
      "variedad": "desconocida",
      "precio": 9.99
    }
  ]
}
```

---

Corrección Manual de Comercio

* **Método:** `PUT`
* **URL:** `http://localhost:3000/productos/corregir`

**Body (JSON):**
```json
{
  "nombre": "Artilugio misterioso",
  "tipo": "Alacena"
}
```

---

Reparto de Pago en Checkout

* **Método:** `POST`
* **URL:** `http://localhost:3000/checkout/reparto`

**Body (JSON):**
```json
{
  "carrito": [
    {
      "nombre": "Tortilla de patatas",
      "precio": 6.50,
      "cantidad": 2
    },
    {
      "nombre": "Arroz con pollo",
      "precio": 6.90,
      "cantidad": 1
    },
    {
      "nombre": "Tomates",
      "precio": 2.30,
      "cantidad": 2
    }
  ]
}
```

**Respuesta ejemplo:**
```json
{
  "total_carrito": 24.50,
  "ticket_restaurant": 19.90,
  "otro_metodo": 4.60,
  "detalle": [
    {
      "nombre": "Tortilla de patatas",
      "tipo": "Preparado",
      "cantidad": 2,
      "subtotal": 13.00,
      "pagable_con_ticket": true
    },
    {
      "nombre": "Arroz con pollo",
      "tipo": "Preparado",
      "cantidad": 1,
      "subtotal": 6.90,
      "pagable_con_ticket": true
    },
    {
      "nombre": "Tomates",
      "tipo": "Ingrediente",
      "cantidad": 2,
      "subtotal": 4.60,
      "pagable_con_ticket": false
    }
  ]
}
```
