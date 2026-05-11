# FoodieApp - Taller de Debug & Features

Aplicación de pedidos de restaurante

## Nota Importante
Esta aplicación contiene **bugs intencionales** y **features por implementar** como parte del taller práctico.

##  Tecnologías
- React Native CLI 0.79.x
- React Navigation (Stack + Bottom Tabs)
- AsyncStorage
- Firebase/Firestore
- react-native-vector-icons

##  Configuración

```bash
# 1. Clonar el repositorio
git clone https://github.com/[USUARIO]/FoodieApp.git
cd FoodieApp

# 2. Instalar dependencias
npm install

# 3. Instalar pods (iOS)
cd ios && pod install && cd ..

# 4. Ejecutar
npx react-native run-ios
# o
npx react-native run-android
```

##  Estructura del Proyecto

```
src/
├── config/firebase.js        # Configuración Firebase
├── context/CartContext.js    # Estado global del carrito
├── navigation/               # Stack y Tab navigators
├── screens/                  # Pantallas de la app
├── styles/globalStyles.js    # Estilos compartidos
└── utils/seedData.js         # Datos del menú
```

##  Descripcion de Features

## F01: Barra de Búsqueda en Menú

**Conceptos involucrados:** `useState`, `TextInput`, `filter()`, `includes()`  

### Descripción

Agregar un `TextInput` como barra de búsqueda encima de la `FlatList` del menú. El usuario escribe el nombre de un plato y la lista se filtra en tiempo real mostrando solo los platos que coincidan.

### Criterios de Aceptación

- La búsqueda filtra la lista en tiempo real mientras el usuario escribe.
- El filtro **no** es sensible a mayúsculas/minúsculas (usar `.toLowerCase()`).
- Cuando no hay resultados, se muestra un mensaje indicándolo (ej: "No se encontraron platos").
- El campo incluye un botón "✕" para limpiar el texto de búsqueda y restaurar la lista completa.
- El placeholder del input indica su propósito (ej: "Buscar platos...").

## F02: Sistema de Favoritos

**Conceptos involucrados:** `AsyncStorage`, `useState`, `useEffect`  

### Descripción

Agregar un botón de corazón (♡/♥) en `DishDetailScreen` para marcar o desmarcar platos como favoritos. Los IDs de los platos favoritos se guardan en `AsyncStorage`. En `ProfileScreen`, mostrar la lista de platos marcados como favoritos.

### Criterios de Aceptación

- El botón de corazón alterna entre estado favorito (♥ relleno, color rojo) y no favorito (♡ vacío).
- Al abrir el detalle de un plato, se verifica si ya está en favoritos y se muestra el estado correcto.
- Los favoritos **persisten** al cerrar y reabrir la app (se guardan con `AsyncStorage`).
- En `ProfileScreen` se muestra una sección "Mis Favoritos" con la lista de platos guardados.
- Cada favorito en la lista tiene opción de eliminar (quitar de favoritos).

## F03: Notas Especiales por Plato en el Carrito

**Conceptos involucrados:** `useState`, `TextInput`, actualización de estado en arrays  

### Descripción

Agregar un `TextInput` debajo de cada item en el carrito para que el usuario pueda escribir notas especiales (ej: "sin cebolla", "extra picante", "poco sal"). Las notas se asocian al item correspondiente y se envían con el pedido al confirmar.

### Criterios de Aceptación

- Cada item del carrito tiene su propio campo de notas independiente.
- Las notas se guardan asociadas al item (ej: `item.notes = "sin cebolla"`).
- Al confirmar el pedido, las notas se incluyen en el objeto enviado a Firestore.
- El placeholder del campo indica su propósito (ej: "Notas especiales: sin cebolla, extra picante...").
- El campo es opcional: dejar vacío no causa errores.

## F04: Filtro Horizontal por Categoría

**Conceptos involucrados:** `useState`, `ScrollView` horizontal, `filter()`  

### Descripción

Agregar una fila horizontal de botones (chips) con las categorías del menú: Todas, Entradas, Sopas, Platos Fuertes, Postres, Bebidas. Al seleccionar una categoría, la lista se filtra mostrando solo los platos de esa categoría.

### Criterios de Aceptación

- Los botones de categoría se muestran en un `ScrollView` horizontal con scroll habilitado.
- La categoría activa se resalta visualmente (cambio de color de fondo y texto).
- "Todas" muestra todos los platos sin filtrar.
- El filtro se aplica instantáneamente al tocar una categoría.
- Las categorías disponibles provienen del array `CATEGORIES` en `src/utils/seedData.js`.

## F05: Toggle de Modo Oscuro

**Conceptos involucrados:** `AsyncStorage`, `useState`, `useEffect`, `Switch`  

### Descripción

Agregar un componente `Switch` (toggle) en `ProfileScreen` para alternar entre modo claro y modo oscuro. La preferencia del usuario se persiste con `AsyncStorage`. Al activar el modo oscuro, los colores de `ProfileScreen` cambian a una paleta oscura.

### Criterios de Aceptación

- El `Switch` alterna entre modo claro (por defecto) y modo oscuro.
- Al activar el modo oscuro, `ProfileScreen` usa fondos oscuros y textos claros.
- La preferencia del modo se guarda en `AsyncStorage` y se restaura al reabrir la app.
- Los colores oscuros son legibles y coherentes (no simplemente invertir colores).
- El toggle muestra una etiqueta que indica el modo actual (ej: "Modo Oscuro" con el switch).

## F06: Cálculo de Total con IVA (19%)

**Conceptos involucrados:** `useState`, cálculos numéricos, formateo de moneda  

### Descripción

Mostrar en la sección inferior del carrito tres líneas: Subtotal, IVA (19%) y Total Final. Los valores deben calcularse automáticamente a partir de los items del carrito y actualizarse cuando se agregan o eliminan productos.

### Criterios de Aceptación

- Se muestra el **Subtotal** (suma de precios × cantidades).
- Se muestra el **IVA** calculado como `subtotal × 0.19`.
- Se muestra el **Total** calculado como `subtotal + iva`.
- Todos los valores están formateados como moneda colombiana (`toLocaleString('es-CO')`).
- Los valores se actualizan automáticamente al agregar/eliminar items del carrito.
- El botón "Confirmar Pedido" muestra el total final (con IVA).

## F07: Sistema de Calificación Post-Pedido

**Conceptos involucrados:** `useState`, Firestore `update`, `TouchableOpacity`  

### Descripción

Agregar un componente de estrellas (1–5) en cada tarjeta de pedido del historial para que el usuario pueda calificar sus pedidos entregados. La calificación se guarda en el documento del pedido en Firestore (o en estado local si Firebase no está configurado).

### Criterios de Aceptación

- Solo los pedidos con status `"delivered"` pueden ser calificados.
- Se muestran 5 estrellas interactivas (☆ vacías / ★ llenas).
- Al tocar una estrella, se seleccionan todas las estrellas hasta esa posición.
- La calificación se guarda en Firestore (`db.collection('orders').doc(id).update({ rating: n })`).
- Si el pedido ya tiene calificación, se muestra al cargar y no se puede cambiar (o se permite editar una vez).

## F08: Selector de Cantidad (+/−) en el Carrito

**Conceptos involucrados:** `useState`, Context, lógica de incremento/decremento  

### Descripción

Agregar botones "+" y "−" junto a cada item en el carrito para ajustar la cantidad del plato. Si la cantidad llega a 0, el item se elimina automáticamente del carrito.

### Criterios de Aceptación

- Botón **+** incrementa la cantidad del item en 1.
- Botón **−** decrementa la cantidad en 1 (mínimo 1, o elimina el item si llega a 0).
- El subtotal del item individual se recalcula al cambiar la cantidad.
- El total general del carrito se actualiza automáticamente.
- Los botones tienen un diseño claro y son fáciles de tocar (tamaño mínimo 40×40).

