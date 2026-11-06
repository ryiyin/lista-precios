# Spec 20261106-1229-precio-por-mayor

## Objetivo
Agregar a cada producto de precios.json un precio por mayor (`precioMayor`) y mostrarlo debajo del precio normal en la lista, con el texto "Por mayor: Bs 10,00".

## Contexto del brain aplicado
- decisiones.md, "Estructura de precios.json" (2026-11-06): define que cada producto tiene solo `nombre`, `categoria` y `precio`. Este cambio la modifica. Rodrigo aprobó explícitamente el cambio, así que la contradicción está resuelta. Hay que registrar la nueva decisión (ver tarea 1).
- decisiones.md, "Tecnología": HTML, CSS y JS puro, sin dependencias. Se respeta.
- convenciones.md: precios en formato "Bs 12,50", sin separador de miles. Los precios viven en precios.json, no en el HTML. La lógica pura va en logica.js (módulo ES) y app.js solo maneja el DOM. Variables y funciones en español y camelCase. Todo cambio de comportamiento lleva prueba en tests/*.test.js, con `node --test`. Diseño primero para celular.
- CLAUDE.md: todo el texto visible en español. Trabajar en rama propia, nunca en main. Nueva decisión de estructura se registra en brain/decisiones.md.
- producto.md: no requiere cambios (la página sigue siendo la misma lista de precios). Se puede añadir una línea en "versión 1" o dejarlo como está. Se deja sin cambios.

## Alcance
- Incluye:
  - Campo `precioMayor` (número en bolivianos), obligatorio en los 15 productos de precios.json.
  - Función pura nueva en logica.js que devuelve el texto "Por mayor: Bs X,XX".
  - app.js muestra el precio por mayor debajo del precio normal en cada fila.
  - Ajuste mínimo de styles.css para apilar los dos precios y alinearlos a la derecha.
  - Registro de la decisión en brain/decisiones.md y actualización de la decisión anterior de estructura.
  - Pruebas en tests/logica.test.js.
- No incluye:
  - Cantidad mínima para el precio por mayor (confirmado: no hay).
  - Buscar o filtrar por precio por mayor.
  - Cambios en búsqueda, filtros de categoría o fecha de actualización.
  - Productos sin precio por mayor (no existen: es obligatorio).

## Criterios de aceptación
1. Los 15 productos de precios.json tienen `precioMayor` de tipo número, mayor que 0 y menor o igual que `precio`.
2. Cada fila de la lista muestra el precio normal ("Bs 8,50") y, debajo, "Por mayor: Bs 7,50" (formato de convenciones: coma decimal, dos decimales, sin separador de miles).
3. El texto visible está en español y el precio por mayor no está escrito en index.html.
4. En celular (ancho aprox. 360 px) el nombre y los dos precios no se desbordan ni se superponen; los precios quedan alineados a la derecha, el por mayor en letra más pequeña y con peso normal.
5. La búsqueda y los botones de categoría siguen funcionando igual, y siguen mostrando el precio por mayor.
6. decisiones.md tiene una entrada fechada 2026-11-06 que explica el cambio de estructura y su motivo; la entrada anterior queda marcada como reemplazada (ver tarea 1).
7. `node --test` pasa completo.

## Tareas
1. Brain: en brain/decisiones.md, añadir la entrada "2026-11-06 · Precio por mayor en precios.json". Contenido: decisión (cada producto tiene además `precioMayor`, número en bolivianos, obligatorio, sin cantidad mínima; se muestra como "Por mayor: Bs 10,00" debajo del precio normal), motivo (el market vende por mayor y el cliente quiere ver ambos precios antes de ir) y nota "Aprobado por Rodrigo". En la entrada "Estructura de precios.json" agregar una línea "Actualizada: ver 'Precio por mayor' más abajo", sin borrar el texto original.
2. Datos: en precios.json agregar `precioMayor` a cada producto. Valores propuestos (provisionales, Rodrigo puede ajustarlos después): Arroz 7.5, Fideo tallarín 4.5, Fideo codito 4.5, Quinua 16, Aceite 14, Azúcar 6.5, Sal 2.5, Comino 4, Coca-Cola 12.5, Jugo del Valle 11, Agua Vital 7, Leche 6.5, Yogur 14, Queso criollo 25, Huevos maple 34. No cambiar `actualizado` salvo que el builder lo considere necesario (no es requisito).
3. Lógica: en logica.js exportar `formatearPrecioMayor(numero)` que devuelve `'Por mayor: ' + formatearPrecio(numero)`. Prueba: 10 -> "Por mayor: Bs 10,00".
4. Página: en app.js importar `formatearPrecioMayor`. En cada `li`, reemplazar el `span.precio` simple por un contenedor `span.precios` con dos hijos: `span.precio` (precio normal, como hoy) y `span.precio-mayor` (texto de `formatearPrecioMayor(p.precioMayor)`), cada uno en su propia línea. Usar `textContent`, no `innerHTML`.
5. Estilos: en styles.css hacer que `.precios` sea `display: flex; flex-direction: column; align-items: flex-end;`, y `.precio-mayor` con `font-size: .9rem; font-weight: 400; color: #555; white-space: nowrap;`. Mantener `.precio` como está.
6. Pruebas: actualizar y agregar según la sección siguiente. Ejecutar `node --test`.
7. Revisar manualmente la página en ancho de celular con búsqueda y filtros.

## Pruebas requeridas
En tests/logica.test.js:
- Nueva prueba `formatearPrecioMayor`: 10 -> "Por mayor: Bs 10,00"; 12.5 -> "Por mayor: Bs 12,50"; 1250 -> "Por mayor: Bs 1250,00".
- Ampliar la prueba "precios.json es válido": para cada producto, `typeof p.precioMayor === 'number'`, `p.precioMayor > 0` y `p.precioMayor <= p.precio`. Mantener las comprobaciones existentes (15 productos, 4 categorías).
- Nueva prueba de contrato: todos los productos de precios.json producen un texto que cumple `/^Por mayor: Bs \d+,\d{2}$/` con `formatearPrecioMayor`.
- Actualizar el arreglo `muestra` con `precioMayor` solo si algún test lo necesita (los tests actuales de búsqueda/agrupar/filtrar no lo requieren).
- La parte de DOM (apilado visual) se comprueba manualmente según el criterio 4, porque el proyecto no tiene entorno de DOM en pruebas.

## Riesgo
alto. Cambia la estructura de datos de precios.json y contradice una decisión registrada del brain (aprobado explícitamente por Rodrigo). Toca varios archivos (precios.json, logica.js, app.js, styles.css, tests, brain). Mitigación: el campo es aditivo y no se elimina ni renombra ningún campo existente, y las pruebas validan la estructura de los 15 productos.
