# Spec 20261106-1202-filtro-categorias-botones

## Objetivo
Agregar, encima de la lista, una fila de botones de categoría que filtra los productos mostrados. El botón "Todas" está seleccionado por defecto y muestra todo.

## Contexto del brain aplicado
- HTML, CSS y JS puro, sin dependencias (decisiones.md). No se toca la estructura de precios.json; las categorías se derivan de los datos, no se escriben a mano en el HTML.
- Lógica pura en logica.js (export) y app.js solo maneja el DOM (convenciones.md).
- Cada cambio de comportamiento lleva prueba en tests/*.test.js, con `node --test`.
- Nombres en español y camelCase. Diseño primero para celular. Todo el texto visible en español.
- producto.md: "productos agrupados por categoría" y buscador siguen vigentes. No hay contradicción con el brain.

## Alcance
- Incluye:
  - Función pura `obtenerCategorias(productos)` (categorías únicas, en orden de aparición) y `filtrarPorCategoria(productos, categoria)` (categoría `null` o "Todas" devuelve todos) en logica.js.
  - Contenedor de botones en index.html entre el buscador y la lista, generado desde app.js a partir de los datos.
  - Botón "Todas" primero y activo al cargar; al pulsar otro botón se activa solo ese.
  - El filtro de categoría se combina con el buscador (ambos aplican a la vez).
  - Estilos en styles.css para botones (aptos para celular, con fila que haga wrap o scroll horizontal) y estado activo claramente visible. Uso de `aria-pressed` en los botones.
  - Mantener el mensaje "No se encontraron productos" si la combinación no da resultados.
- No incluye: cambios a precios.json, nuevas categorías, persistencia del filtro (URL/localStorage), contadores por categoría, ni cambios al formato de precio/fecha.

## Criterios de aceptación
1. Al cargar, aparece una fila de botones encima de la lista: "Todas" más una por cada categoría de precios.json (4 actualmente).
2. "Todas" está activo al cargar (aria-pressed="true" y estilo distinto) y se ven todos los productos (15).
3. Al pulsar una categoría solo se ven los productos de esa categoría, y solo ese botón queda activo.
4. Al pulsar "Todas" se vuelven a ver todos los productos.
5. Con una categoría activa, escribir en el buscador filtra dentro de esa categoría; y cambiar de categoría respeta el texto ya escrito.
6. Si la combinación no tiene resultados se muestra "No se encontraron productos".
7. Si falla la carga de precios.json no se muestran botones de categoría (solo el mensaje de error existente).
8. Los botones se usan bien en pantalla de celular (objetivo táctil de al menos unos 44px de alto, sin desbordar la pantalla) y se operan con teclado.
9. `node --test` pasa, incluidas las pruebas nuevas.

## Tareas
1. En logica.js agregar y exportar `obtenerCategorias` y `filtrarPorCategoria`. Probar por separado.
2. En index.html agregar el contenedor (p. ej. `<div id="filtros" role="group" aria-label="Filtrar por categoría"></div>`) entre buscador y mensaje.
3. En app.js: estado `categoriaActiva` (inicia en "Todas"); `crearBotones()` tras cargar datos; función que recalcula la vista con `filtrarPorCategoria` y luego `buscarProductos`; actualizar `aria-pressed`/clase activa al pulsar.
4. Hacer que el buscador use el mismo cálculo combinado.
5. Agregar estilos en styles.css para botones y estado activo.
6. Agregar pruebas en tests/logica.test.js.
7. Verificación manual en vista de celular de los criterios 1 a 8.

## Pruebas requeridas
En tests/logica.test.js:
- `obtenerCategorias`: devuelve únicas en orden de aparición; lista vacía devuelve [].
- `filtrarPorCategoria`: categoría concreta devuelve solo esos productos; `null`/"Todas" devuelve todos; categoría inexistente devuelve [].
- Combinación: `buscarProductos(filtrarPorCategoria(...), texto)` da el resultado esperado.
- Prueba contra precios.json real: `obtenerCategorias` devuelve 4 categorías.
La interfaz (botones, estado activo) se valida manualmente porque no hay pruebas de DOM en el proyecto.

## Riesgo
bajo-medio: lógica nueva en logica.js y app.js más cambios en HTML y CSS (varios archivos), pero sin cambios en datos ni en decisiones del brain. Tratar como medio.
