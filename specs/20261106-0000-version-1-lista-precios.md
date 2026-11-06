# Spec 20261106-0000-version-1-lista-precios

## Objetivo
Crear la versión 1 de la página: lista de precios del minimarket agrupada por categoría, con buscador por nombre y fecha de última actualización, usando 15 productos de abarrotes de ejemplo en 4 categorías.

## Contexto del brain aplicado
- decisiones.md: HTML, CSS y JS puro, sin frameworks ni dependencias. Publicación con GitHub Pages desde main (el trabajo se hace en una rama propia, nunca en main).
- convenciones.md:
  - Archivos en la raíz: index.html, styles.css, app.js. Además logica.js (módulo ES), precios.json y package.json con solo {"type": "module"}.
  - Precios en precios.json, nunca en el HTML. Formato "Bs 12,50".
  - Diseño mobile-first.
  - Variables y funciones en español, camelCase. Comentarios breves.
  - Lógica pura (formatear, buscar, agrupar) en logica.js; app.js solo maneja el DOM e importa de logica.js.
  - Pruebas en tests/*.test.js con `node --test`.
- producto.md (v1): productos por categoría, buscador por nombre, fecha de última actualización. Público: clientes desde el celular.
- CLAUDE.md: todo texto visible en español.
- No hay contradicciones con el brain.

## Alcance
- Incluye: index.html, styles.css, app.js, logica.js, precios.json (15 productos, 4 categorías, fecha de actualización), package.json, tests/logica.test.js.
- No incluye: carrito, pedidos, imágenes de productos, panel de edición, backend, frameworks, filtros por categoría, ordenamiento, configuración de GitHub Pages.

## Criterios de aceptación
1. precios.json tiene un campo `actualizado` (fecha ISO AAAA-MM-DD) y una lista `productos` de exactamente 15 elementos, cada uno con `nombre`, `categoria` y `precio` (número, en bolivianos).
2. Hay exactamente 4 categorías distintas (por ejemplo Arroz y fideos, Aceites y condimentos, Bebidas, Lácteos y huevos), todas con al menos 2 productos. Los productos son abarrotes típicos de Bolivia.
3. index.html no contiene precios ni nombres de productos escritos a mano; todo se carga desde precios.json.
4. La página muestra los productos agrupados bajo un título por categoría.
5. Cada precio se muestra como "Bs 12,50" (prefijo "Bs", coma decimal, 2 decimales).
6. Hay un campo de búsqueda; al escribir se filtran los productos por nombre, sin distinguir mayúsculas ni tildes. Las categorías sin resultados no se muestran.
7. Si la búsqueda no encuentra nada, se muestra un mensaje en español (por ejemplo "No se encontraron productos").
8. Se muestra "Última actualización: <fecha en español>" (por ejemplo "6 de noviembre de 2026") tomada de `actualizado`.
9. Todo el texto visible está en español, con `<html lang="es">`.
10. Diseño mobile-first: con viewport meta, se lee bien a 360 px de ancho sin scroll horizontal.
11. app.js importa de logica.js; logica.js no toca el DOM y exporta funciones puras.
12. Si falla la carga de precios.json se muestra un mensaje de error en español.
13. `node --test` pasa sin dependencias instaladas.
14. Nombres de variables y funciones en español, camelCase.

## Tareas
1. Crear rama propia para la tarea (no usar main/master).
2. Crear package.json con solo {"type": "module"}.
3. Crear precios.json con `actualizado` y 15 productos en 4 categorías.
4. Crear logica.js con funciones puras exportadas: `formatearPrecio(numero)`, `formatearFecha(textoIso)`, `normalizarTexto(texto)` (minúsculas, sin tildes), `buscarProductos(productos, consulta)`, `agruparPorCategoria(productos)` (conserva el orden de aparición de las categorías).
5. Crear tests/logica.test.js con las pruebas de esas funciones y de precios.json (ver abajo). Verificar con `node --test`.
6. Crear index.html (estructura: título, fecha de actualización, buscador, contenedor de lista, mensaje de vacío/error), con viewport meta.
7. Crear styles.css mobile-first (una columna, tipografía legible, buscador grande, precios alineados a la derecha; ajuste opcional para pantallas anchas con media query).
8. Crear app.js: cargar precios.json con fetch, mostrar fecha, renderizar grupos, filtrar en cada pulsación del buscador, manejar errores. Sin lógica de negocio propia.
9. Revisión manual en navegador (servidor estático local) a 360 px de ancho.
10. Registrar en brain/decisiones.md la estructura de precios.json (`actualizado` + `productos[]` con `nombre`, `categoria`, `precio` numérico) y el formato de fecha, como decisión nueva.

## Pruebas requeridas
En tests/logica.test.js (node --test):
- formatearPrecio: 12.5 -> "Bs 12,50"; 3 -> "Bs 3,00"; 1250 -> "Bs 1250,00" (o con separador de miles si se decide, documentado en la prueba).
- formatearFecha: "2026-11-06" -> "6 de noviembre de 2026" (sin errores de zona horaria).
- normalizarTexto: "Azúcar" -> "azucar".
- buscarProductos: coincidencia parcial, insensible a mayúsculas y tildes; consulta vacía devuelve todos; sin coincidencias devuelve [].
- agruparPorCategoria: agrupa correctamente y conserva el orden.
- Datos: leer precios.json y comprobar 15 productos, 4 categorías, campos válidos, `precio` numérico positivo y `actualizado` con formato AAAA-MM-DD.

## Riesgo
medio: lógica nueva y varios archivos nuevos. Define la estructura de datos de precios.json, pero al no existir datos previos no se borra ni se rompe nada ni se contradice el brain.
