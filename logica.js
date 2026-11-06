// Lógica pura: sin acceso al DOM.

const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

// 12.5 -> "Bs 12,50"
export function formatearPrecio(numero) {
  return 'Bs ' + numero.toFixed(2).replace('.', ',');
}

// (10, 6) -> "Por mayor: Bs 10,00 (desde 6 u.)"
export function formatearPrecioMayor(precioMayor, cantidadMayor) {
  return 'Por mayor: ' + formatearPrecio(precioMayor) + ' (desde ' + cantidadMayor + ' u.)';
}

// Texto del precio por mayor del producto; '' si no tiene
export function textoPrecioMayor(producto) {
  if (producto.precioMayor === undefined) return '';
  return formatearPrecioMayor(producto.precioMayor, producto.cantidadMayor);
}

// Devuelve mensajes de error en español; arreglo vacío si es válido
export function validarPrecioMayor(producto) {
  const errores = [];
  const { precio, precioMayor, cantidadMayor } = producto;
  if (precioMayor === undefined) {
    if (cantidadMayor !== undefined) errores.push('Hay cantidadMayor sin precioMayor');
    return errores;
  }
  if (typeof precioMayor !== 'number' || !Number.isFinite(precioMayor) || precioMayor <= 0) {
    errores.push('precioMayor debe ser un número mayor que 0');
  } else if (precioMayor > precio) {
    errores.push('precioMayor no puede ser mayor que precio');
  }
  if (cantidadMayor === undefined) {
    errores.push('Falta cantidadMayor');
  } else if (!Number.isInteger(cantidadMayor) || cantidadMayor <= 0) {
    errores.push('cantidadMayor debe ser un entero mayor que 0');
  }
  return errores;
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
