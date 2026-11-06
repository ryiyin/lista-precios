import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  formatearPrecio,
  formatearPrecioMayor,
  textoPrecioMayor,
  validarPrecioMayor,
  formatearFecha,
  normalizarTexto,
  buscarProductos,
  agruparPorCategoria,
  obtenerCategorias,
  filtrarPorCategoria,
} from '../logica.js';

test('formatearPrecio', () => {
  assert.equal(formatearPrecio(12.5), 'Bs 12,50');
  assert.equal(formatearPrecio(3), 'Bs 3,00');
  // Decisión: sin separador de miles
  assert.equal(formatearPrecio(1250), 'Bs 1250,00');
});

test('formatearPrecioMayor', () => {
  assert.equal(formatearPrecioMayor(10, 6), 'Por mayor: Bs 10,00 (desde 6 u.)');
  assert.equal(formatearPrecioMayor(12.5, 12), 'Por mayor: Bs 12,50 (desde 12 u.)');
  assert.equal(formatearPrecioMayor(1250, 3), 'Por mayor: Bs 1250,00 (desde 3 u.)');
});

test('textoPrecioMayor', () => {
  assert.equal(
    textoPrecioMayor({ nombre: 'X', categoria: 'A', precio: 12, precioMayor: 10, cantidadMayor: 6 }),
    'Por mayor: Bs 10,00 (desde 6 u.)',
  );
  assert.equal(textoPrecioMayor({ nombre: 'X', categoria: 'A', precio: 12 }), '');
});

test('validarPrecioMayor', () => {
  const base = { nombre: 'X', categoria: 'A', precio: 12 };
  const esValido = (extra) => validarPrecioMayor({ ...base, ...extra }).length === 0;
  assert.ok(esValido({}));
  assert.ok(esValido({ precioMayor: 10, cantidadMayor: 6 }));
  assert.ok(esValido({ precioMayor: 12, cantidadMayor: 6 }));
  assert.ok(!esValido({ precioMayor: 10 }));
  for (const c of [6.5, '6', NaN, 0, -2]) {
    assert.ok(!esValido({ precioMayor: 10, cantidadMayor: c }), String(c));
  }
  for (const m of [0, -1, 'diez', NaN, Infinity]) {
    assert.ok(!esValido({ precioMayor: m, cantidadMayor: 6 }), String(m));
  }
  assert.ok(!esValido({ precioMayor: 13, cantidadMayor: 6 }));
  assert.ok(!esValido({ cantidadMayor: 6 }));
  assert.equal(typeof validarPrecioMayor({ ...base, precioMayor: 10 })[0], 'string');
});

test('formatearFecha', () => {
  assert.equal(formatearFecha('2026-11-06'), '6 de noviembre de 2026');
  assert.equal(formatearFecha('2026-01-01'), '1 de enero de 2026');
  assert.equal(formatearFecha('2026-12-31'), '31 de diciembre de 2026');
});

test('normalizarTexto', () => {
  assert.equal(normalizarTexto('Azúcar'), 'azucar');
  assert.equal(normalizarTexto('ÑANDÚ'), 'nandu');
});

const muestra = [
  { nombre: 'Azúcar blanca', categoria: 'A', precio: 1 },
  { nombre: 'Arroz', categoria: 'B', precio: 2 },
  { nombre: 'Aceite', categoria: 'A', precio: 3 },
];

test('buscarProductos', () => {
  assert.deepEqual(buscarProductos(muestra, 'azu').map((p) => p.nombre), ['Azúcar blanca']);
  assert.deepEqual(buscarProductos(muestra, 'AZUCAR').length, 1);
  assert.equal(buscarProductos(muestra, '').length, 3);
  assert.equal(buscarProductos(muestra, '   ').length, 3);
  assert.deepEqual(buscarProductos(muestra, 'zzz'), []);
});

test('agruparPorCategoria conserva el orden', () => {
  const grupos = agruparPorCategoria(muestra);
  assert.deepEqual(grupos.map((g) => g.categoria), ['A', 'B']);
  assert.deepEqual(grupos[0].productos.map((p) => p.nombre), ['Azúcar blanca', 'Aceite']);
  assert.equal(grupos[1].productos.length, 1);
  assert.deepEqual(agruparPorCategoria([]), []);
});

test('precios.json es válido', () => {
  const datos = JSON.parse(readFileSync(new URL('../precios.json', import.meta.url), 'utf8'));
  assert.match(datos.actualizado, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(datos.productos.length, 15);
  for (const p of datos.productos) {
    assert.equal(typeof p.nombre, 'string');
    assert.ok(p.nombre.length > 0);
    assert.equal(typeof p.categoria, 'string');
    assert.ok(p.categoria.length > 0);
    assert.equal(typeof p.precio, 'number');
    assert.ok(p.precio > 0);
    assert.deepEqual(validarPrecioMayor(p), []);
  }
  const conMayor = datos.productos.filter((p) => p.precioMayor !== undefined);
  assert.ok(conMayor.length >= 5);
  for (const p of conMayor) assert.ok(Number.isInteger(p.cantidadMayor));
  const grupos = agruparPorCategoria(datos.productos);
  assert.equal(grupos.length, 4);
  for (const g of grupos) assert.ok(g.productos.length >= 2);
});

test('obtenerCategorias', () => {
  assert.deepEqual(obtenerCategorias(muestra), ['A', 'B']);
  assert.deepEqual(obtenerCategorias([]), []);
});

test('filtrarPorCategoria', () => {
  assert.deepEqual(filtrarPorCategoria(muestra, 'A').map((p) => p.nombre), ['Azúcar blanca', 'Aceite']);
  assert.equal(filtrarPorCategoria(muestra, null).length, 3);
  assert.equal(filtrarPorCategoria(muestra, 'Todas').length, 3);
  assert.deepEqual(filtrarPorCategoria(muestra, 'Z'), []);
});

test('filtro de categoría combinado con búsqueda', () => {
  const r = buscarProductos(filtrarPorCategoria(muestra, 'A'), 'ace');
  assert.deepEqual(r.map((p) => p.nombre), ['Aceite']);
  assert.deepEqual(buscarProductos(filtrarPorCategoria(muestra, 'B'), 'ace'), []);
});

test('texto de precio por mayor en precios.json', () => {
  const datos = JSON.parse(readFileSync(new URL('../precios.json', import.meta.url), 'utf8'));
  for (const p of datos.productos) {
    if (p.precioMayor !== undefined) {
      assert.match(textoPrecioMayor(p), /^Por mayor: Bs \d+,\d{2} \(desde \d+ u\.\)$/);
    } else {
      assert.equal(textoPrecioMayor(p), '');
      assert.equal(p.cantidadMayor, undefined);
    }
  }
});

test('precios.json tiene 4 categorías', () => {
  const datos = JSON.parse(readFileSync(new URL('../precios.json', import.meta.url), 'utf8'));
  assert.equal(obtenerCategorias(datos.productos).length, 4);
});
