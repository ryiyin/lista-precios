// Lógica pura: sin acceso al DOM.

const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

// 12.5 -> "Bs 12,50"
export function formatearPrecio(numero) {
  return 'Bs ' + numero.toFixed(2).replace('.', ',');
}

// 10 -> "Por mayor: Bs 10,00"
export function formatearPrecioMayor(numero) {
  return 'Por mayor: ' + formatearPrecio(numero);
}

// "2026-11-06" -> "6 de noviembre de 2026" (sin usar Date, evita zonas horarias)
export function formatearFecha(textoIso) {
  const [anio, mes, dia] = textoIso.split('-').map(Number);
  return `${dia} de ${meses[mes - 1]} de ${anio}`;
}

export function normalizarTexto(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function buscarProductos(productos, consulta) {
  const buscado = normalizarTexto(consulta.trim());
  if (buscado === '') return productos;
  return productos.filter((p) => normalizarTexto(p.nombre).includes(buscado));
}

// Devuelve [{ categoria, productos }] en orden de aparición
export function agruparPorCategoria(productos) {
  const grupos = [];
  for (const producto of productos) {
    let grupo = grupos.find((g) => g.categoria === producto.categoria);
    if (!grupo) {
      grupo = { categoria: producto.categoria, productos: [] };
      grupos.push(grupo);
    }
    grupo.productos.push(producto);
  }
  return grupos;
}

// Categorías únicas en orden de aparición
export function obtenerCategorias(productos) {
  return [...new Set(productos.map((p) => p.categoria))];
}

// categoria null o "Todas" devuelve todos los productos
export function filtrarPorCategoria(productos, categoria) {
  if (categoria === null || categoria === 'Todas') return productos;
  return productos.filter((p) => p.categoria === categoria);
}
