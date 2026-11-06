import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  formatearPrecio,
  formatearFecha,
  normalizarTexto,
  buscarProductos,
  agruparPorCategoria,
} from '../logica.js';

test('formatearPrecio', () => {
  assert.equal(formatearPrecio(12.5), 'Bs 12,50');
  assert.equal(formatearPrecio(3), 'Bs 3,00');
  // Decisión: sin separador de miles
  assert.equal(formatearPrecio(1250), 'Bs 1250,00');
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
  }
  const grupos = agruparPorCategoria(datos.productos);
  assert.equal(grupos.length, 4);
  for (const g of grupos) assert.ok(g.productos.length >= 2);
});
