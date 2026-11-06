import {
  formatearPrecio,
  formatearPrecioMayor,
  formatearFecha,
  buscarProductos,
  agruparPorCategoria,
  obtenerCategorias,
  filtrarPorCategoria,
} from './logica.js';

const lista = document.getElementById('lista');
const mensaje = document.getElementById('mensaje');
const buscador = document.getElementById('buscador');
const fecha = document.getElementById('fechaActualizacion');

const filtros = document.getElementById('filtros');

let productos = [];
let categoriaActiva = 'Todas';

// Filtra por categoría y luego por texto del buscador
function actualizarVista() {
  const porCategoria = filtrarPorCategoria(productos, categoriaActiva);
  mostrar(buscarProductos(porCategoria, buscador.value));
}

function crearBotones() {
  filtros.replaceChildren();
  for (const categoria of ['Todas', ...obtenerCategorias(productos)]) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = categoria;
    boton.addEventListener('click', () => {
      categoriaActiva = categoria;
      for (const b of filtros.children) {
        const activo = b === boton;
        b.setAttribute('aria-pressed', String(activo));
        b.classList.toggle('activo', activo);
      }
      actualizarVista();
    });
    boton.setAttribute('aria-pressed', String(categoria === categoriaActiva));
    boton.classList.toggle('activo', categoria === categoriaActiva);
    filtros.append(boton);
  }
}

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
      const precios = document.createElement('span');
      precios.className = 'precios';
      const precio = document.createElement('span');
      precio.className = 'precio';
      precio.textContent = formatearPrecio(p.precio);
      const precioMayor = document.createElement('span');
      precioMayor.className = 'precio-mayor';
      precioMayor.textContent = formatearPrecioMayor(p.precioMayor);
      precios.append(precio, precioMayor);
      li.append(nombre, precios);
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
    crearBotones();
    actualizarVista();
  } catch {
    buscador.disabled = true;
    mostrarMensaje('No se pudo cargar la lista de precios. Intenta de nuevo más tarde.');
  }
}

buscador.addEventListener('input', actualizarVista);
iniciar();
