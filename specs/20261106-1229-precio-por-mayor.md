# Spec 20261106-1229-precio-por-mayor (versión 2, reemplaza la anterior)

## Objetivo
Permitir que cada producto de precios.json tenga, de forma opcional, un precio por mayor con su cantidad mínima (`precioMayor` + `cantidadMayor`) y mostrarlo debajo del precio normal como "Por mayor: Bs 10,00 (desde 6 u.)". Los productos sin precio por mayor no muestran esa línea.

## Contexto del brain aplicado
- decisiones.md, "Estructura de precios.json": define `nombre`, `categoria` y `precio`. Este cambio la amplía. Rodrigo aprobó explícitamente el cambio de estructura (riesgo alto), así que no hay contradicción pendiente. Hay que registrarlo con fecha y motivo.
- decisiones.md, "Precio por mayor en precios.json": la entrada ya escrita en la rama es obsoleta (dice obligatorio, sin cantidad mínima, texto sin cantidad). Hay que corregirla.
- decisiones.md, "Tecnología": HTML, CSS y JS puro, sin dependencias. Se respeta.
- convenciones.md: formato "Bs 12,50" (sin separador de miles); precios en precios.json, no en el HTML; lógica pura en logica.js (módulo ES) y app.js solo DOM; nombres en español camelCase; todo cambio de comportamiento con prueba en tests/*.test.js (`node --test`); celular primero.
- CLAUDE.md: texto visible en español; rama propia (ya existe tarea/20261106-1229-precio-por-mayor); decisión nueva de estructura se registra en brain/decisiones.md.
- producto.md: sin cambios.

## Estado actual de la rama (implementación previa) y qué cambiar
- precios.json: los 15 productos tienen `precioMayor` obligatorio, sin `cantidadMayor`. Cambiar: dejar `precioMayor` + `cantidadMayor` en solo 6 productos y quitar `precioMayor` de los otros 9.
- logica.js: `formatearPrecioMayor(numero)` devuelve "Por mayor: Bs X,XX" (sin cantidad). Cambiar: debe recibir también la cantidad. Añadir validación.
- app.js: siempre crea `span.precio-mayor` con `p.precioMayor`; con producto sin precioMayor fallaría (`undefined.toFixed`). Cambiar: crearlo solo si el producto lo tiene.
- styles.css: `.precios` (columna, alineada a la derecha) y `.precio-mayor` ya sirven. Sin cambios, salvo que la línea más larga desborde en 360 px (ver criterio 6; si ocurre, permitir `white-space: normal` y `text-align: right` en `.precio-mayor`).
- tests/logica.test.js: pruebas actuales asumen precioMayor obligatorio en los 15 productos y el texto sin cantidad. Hay que reescribirlas.
- brain/decisiones.md: entrada de precio por mayor desactualizada. Corregirla.

## Alcance
- Incluye:
  - Campos opcionales `precioMayor` (número en bolivianos) y `cantidadMayor` (entero) en cada producto. Reglas: si hay `precioMayor`, `cantidadMayor` es obligatorio.
  - Función pura de formato con cantidad, función pura de texto por producto (vacío si no hay precio por mayor) y función pura de validación en logica.js.
  - app.js muestra la línea solo si el producto tiene precioMayor.
  - Datos de ejemplo: precio por mayor en 6 productos (mínimo pedido: 5), los otros 9 sin él. Valores provisionales.
  - Corrección de la entrada en brain/decisiones.md.
  - Pruebas en tests/logica.test.js.
- No incluye:
  - Buscar o filtrar por precio por mayor.
  - Varios escalones de precio por mayor por producto.
  - Cambios en búsqueda, botones de categoría o fecha de actualización.
  - Cambiar el diseño visual de la línea (ya existe `.precio-mayor`).

## Reglas de datos y validación
Un producto es válido respecto al precio por mayor si:
1. Sin `precioMayor` y sin `cantidadMayor`: válido (caso normal).
2. Con `precioMayor`: debe ser número finito mayor que 0, y `cantidadMayor` debe existir y ser entero (`Number.isInteger`) mayor que 0.
3. SUPUESTO (no pedido por Rodrigo, confirmar): `precioMayor <= precio` se mantiene (ya existía en las pruebas previas; un precio por mayor más caro que el normal sería casi seguro un error de tipeo). Se permite igualdad.
4. SUPUESTO (no pedido por Rodrigo, confirmar): `cantidadMayor` sin `precioMayor` es inválido (dato huérfano). Entero > 0 también es supuesto (se acepta 1 aunque sea poco útil; no se exige mínimo 2).

## Criterios de aceptación
1. `formatearPrecioMayor(10, 6)` devuelve exactamente "Por mayor: Bs 10,00 (desde 6 u.)"; `formatearPrecioMayor(12.5, 12)` devuelve "Por mayor: Bs 12,50 (desde 12 u.)".
2. Un producto sin `precioMayor` no muestra ninguna línea "Por mayor" (ni vacía ni "undefined") y la página no falla.
3. precios.json: al menos 5 productos (quedan 6) tienen `precioMayor` y `cantidadMayor`; los demás no tienen ninguno de los dos campos. Siguen siendo 15 productos y 4 categorías.
4. La validación rechaza: `precioMayor` sin `cantidadMayor`; `cantidadMayor` no entero (6.5, "6", NaN); `cantidadMayor` 0 o negativa; `precioMayor` 0, negativo o no numérico; (supuesto) `precioMayor > precio`; (supuesto) `cantidadMayor` sin `precioMayor`. Acepta producto sin ambos campos.
5. Todos los productos de precios.json pasan la validación.
6. En celular (aprox. 360 px) el nombre y los precios no se desbordan ni se superponen; los precios quedan alineados a la derecha, la línea por mayor en letra más pequeña. Un producto sin por mayor muestra solo el precio normal.
7. Búsqueda y botones de categoría siguen funcionando y muestran la línea por mayor solo en los productos que la tienen.
8. Todo el texto visible en español; ningún precio escrito en index.html.
9. decisiones.md tiene la entrada corregida (ver tarea 1) con fecha 2026-11-06 y el motivo pedido.
10. `node --test` pasa completo.

## Tareas
1. Brain: en brain/decisiones.md reescribir la entrada "2026-11-06 · Precio por mayor en precios.json" (no duplicarla). Contenido: Decisión: cada producto puede tener `precioMayor` (número en bolivianos, opcional) y `cantidadMayor` (entero, obligatorio si hay `precioMayor`); se muestra como "Por mayor: Bs 10,00 (desde 6 u.)" debajo del precio normal y, si no hay `precioMayor`, no se muestra la línea. Motivo: "Se agregan precios por mayor para clientes que compran en cantidad". Nota: Aprobado por Rodrigo. Mantener la línea "Actualizada: ver 'Precio por mayor' más abajo" en la entrada "Estructura de precios.json", y ajustarla si dice que `precioMayor` es obligatorio. Si se adopta el supuesto `precioMayor <= precio`, anotarlo como regla de validación.
2. Lógica: en logica.js cambiar `formatearPrecioMayor(precioMayor, cantidadMayor)` para devolver `'Por mayor: ' + formatearPrecio(precioMayor) + ' (desde ' + cantidadMayor + ' u.)'`. Probar con 10 y 6.
3. Lógica: añadir `textoPrecioMayor(producto)` que devuelve `formatearPrecioMayor(...)` si el producto tiene `precioMayor`, y `''` si no. Probar con y sin precioMayor.
4. Lógica: añadir `validarPrecioMayor(producto)` que devuelve un arreglo de mensajes de error en español (vacío si es válido) según "Reglas de datos y validación". Probar cada regla por separado.
5. Datos: en precios.json dejar `precioMayor` y `cantidadMayor` solo en estos 6 productos (valores provisionales, Rodrigo los ajustará): Arroz grano de oro 1 kg: 7.5, desde 6; Fideo tallarín 400 g: 4.5, desde 12; Aceite Fino 900 ml: 14, desde 6; Azúcar 1 kg: 6.5, desde 10; Coca-Cola 2 litros: 12.5, desde 6; Leche PIL 1 litro: 6.5, desde 12. Quitar `precioMayor` de los otros 9 productos. No tocar `precio`, `nombre`, `categoria` ni `actualizado`.
6. Página: en app.js importar `textoPrecioMayor`, quitar la importación directa de `formatearPrecioMayor` si ya no se usa, y crear `span.precio-mayor` solo si `textoPrecioMayor(p)` no es vacío. Usar `textContent`, no `innerHTML`.
7. Estilos: verificar en 360 px; ajustar `.precio-mayor` solo si la línea larga desborda.
8. Pruebas: reescribir según la sección siguiente y ejecutar `node --test`.
9. Revisión manual en ancho de celular con búsqueda y filtros.

## Pruebas requeridas
En tests/logica.test.js:
- Reescribir `formatearPrecioMayor`: (10, 6) -> "Por mayor: Bs 10,00 (desde 6 u.)"; (12.5, 12) -> "Por mayor: Bs 12,50 (desde 12 u.)"; (1250, 3) -> "Por mayor: Bs 1250,00 (desde 3 u.)".
- Nueva `textoPrecioMayor`: producto con precioMayor y cantidadMayor devuelve el texto con cantidad; producto sin precioMayor devuelve `''` (cubre "producto sin precioMayor").
- Nueva `validarPrecioMayor`: válido sin campos; válido con ambos; error si falta cantidadMayor; error si cantidadMayor es 6.5, "6", 0 o -2; error si precioMayor es 0, negativo o texto; error si precioMayor > precio (supuesto); error si hay cantidadMayor sin precioMayor (supuesto); precioMayor igual a precio es válido (supuesto).
- Ajustar "precios.json es válido": mantener 15 productos y 4 categorías; quitar la exigencia de `precioMayor` en todos; exigir `validarPrecioMayor(p)` vacío en cada producto; exigir que al menos 5 productos tengan precioMayor y que los que lo tienen tengan cantidadMayor entero.
- Reemplazar la prueba "todos los productos producen texto de precio por mayor válido" por una que, para los productos con precioMayor, compruebe `/^Por mayor: Bs \d+,\d{2} \(desde \d+ u\.\)$/` y, para los que no, que `textoPrecioMayor` sea `''`.
- La parte de DOM (no mostrar la línea y apilado) se comprueba manualmente (criterios 2, 6 y 7), porque el proyecto no tiene entorno de DOM en pruebas.

## Riesgo
alto. Cambia la estructura de datos de precios.json y la decisión registrada del brain (aprobado explícitamente por Rodrigo). Toca varios archivos (brain, precios.json, logica.js, app.js, tests y posiblemente styles.css). Mitigación: los campos son opcionales y aditivos, no se renombra ni borra ningún campo existente, y la validación se prueba tanto con datos sintéticos como con precios.json real.
