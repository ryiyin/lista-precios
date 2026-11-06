# Registro de decisiones

## 2026-11-06 · Tecnología
- Decisión: HTML, CSS y JavaScript puro, sin frameworks ni dependencias.
- Motivo: proyecto de prueba, debe ser simple de revisar.
- No cambiar sin aprobación de Rodrigo.

## 2026-11-06 · Publicación
- Decisión: GitHub Pages desde la rama main.
- Motivo: gratis y automático.

## 2026-11-06 · Estructura de precios.json
- Actualizada: ver 'Precio por mayor' más abajo.
- Decisión: precios.json tiene `actualizado` (fecha ISO AAAA-MM-DD) y `productos[]`, cada uno con `nombre`, `categoria` y `precio` (número en bolivianos). La fecha se muestra en español ("6 de noviembre de 2026"), formateada a mano sin Date para evitar errores de zona horaria. Precio sin separador de miles ("Bs 1250,00").
- Motivo: estructura simple de editar a mano y de probar; la lógica de formato vive en logica.js.

## 2026-11-06 · Precio por mayor en precios.json
- Decisión: cada producto tiene además `precioMayor` (número en bolivianos, obligatorio, sin cantidad mínima). Se muestra como "Por mayor: Bs 10,00" debajo del precio normal.
- Motivo: el market vende por mayor y el cliente quiere ver ambos precios antes de ir.
- Aprobado por Rodrigo.
