import { formatearPrecio, formatearFecha, buscarProductos, agruparPorCategoria } from './logica.js';

const lista = document.getElementById('lista');
const mensaje = document.getElementById('mensaje');
const buscador = document.getElementById('buscador');
const fecha = document.getElementById('fechaActualizacion');

let productos = [];

function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  mensaje.hidden = texto === '';
}

function mostrar(listaProductos) {
  lista.replaceChildren();
  mostrarMensaje(listaProductos.length === 0 ? 'No se encontraron productos' : '');
  for (const grupo of agruparPorCategoria(listaProductos)) {
    const titulo = document.createElement('h2');
    titulo.textContent = grupo.categoria;
    const ul = document.createElement('ul');
    for (const p of grupo.productos) {
      const li = document.createElement('li');
      const nombre = document.createElement('span');
      nombre.textContent = p.nombre;
      const precio = document.createElement('span');
      precio.className = 'precio';
      precio.textContent = formatearPrecio(p.precio);
      li.append(nombre, precio);
      ul.append(li);
    }
    lista.append(titulo, ul);
  }
}

async function iniciar() {
  try {
    const respuesta = await fetch('precios.json');
    if (!respuesta.ok) throw new Error('Error ' + respuesta.status);
    const datos = await respuesta.json();
    productos = datos.productos;
    fecha.textContent = 'Última actualización: ' + formatearFecha(datos.actualizado);
    mostrar(productos);
  } catch {
    buscador.disabled = true;
    mostrarMensaje('No se pudo cargar la lista de precios. Intenta de nuevo más tarde.');
  }
}

buscador.addEventListener('input', () => mostrar(buscarProductos(productos, buscador.value)));
iniciar();
