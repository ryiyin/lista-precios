# Convenciones de código

- Archivos: index.html, styles.css, app.js en la raíz.
- Los precios se guardan en precios.json, nunca escritos dentro del HTML.
- Precios en bolivianos con formato "Bs 12,50".
- Diseño que funcione primero en celular.
- Nombres de variables y funciones en español, en camelCase.
- Comentarios breves solo donde algo no sea obvio.
- Cada cambio de comportamiento debe tener una prueba en tests/.
- Los archivos de prueba van en tests/ y su nombre termina en .test.js (ejemplo: tests/logica.test.js).

## Pruebas
- La lógica pura (formatear precios, buscar, agrupar) va en logica.js como módulo ES (export).
- app.js solo maneja la página e importa desde logica.js.
- Las pruebas van en tests/ y usan el corredor nativo: node --test tests/
- package.json solo contiene {"type": "module"}, sin dependencias.
