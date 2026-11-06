// Decide con reglas fijas si una tarea va directo a main o necesita PR con aprobación humana.
// Uso: node fabrica/decidir.mjs <ID>
import { execSync } from 'node:child_process';

const id = process.argv[2];
if (!id) {
  console.error('Uso: node fabrica/decidir.mjs <ID>');
  process.exit(2);
}

const rama = `tarea/${id}`;
const ejecutar = (comando) => execSync(comando, { encoding: 'utf8' }).trim();
const lineasDe = (texto) => texto.split('\n').filter(Boolean);

const LIMITE_LINEAS = 200;
const RUTAS_SENSIBLES = [
  /^brain\//,
  /^CLAUDE\.md$/,
  /^\.claude\//,
  /^package\.json$/,
  /^\.github\//,
  /^fabrica\/decidir\.mjs$/,
];

const motivos = [];

// 1. Archivos borrados o sensibles
for (const cambio of lineasDe(ejecutar(`git diff --name-status main...${rama}`))) {
  const partes = cambio.split('\t');
  const estado = partes[0];
  const ruta = partes[partes.length - 1];
  if (estado.startsWith('D')) motivos.push(`Borra un archivo: ${ruta}`);
  if (RUTAS_SENSIBLES.some((patron) => patron.test(ruta))) {
    motivos.push(`Modifica un archivo sensible: ${ruta}`);
  }
}

// 2. Tamaño del cambio
let totalLineas = 0;
for (const fila of lineasDe(ejecutar(`git diff --numstat main...${rama}`))) {
  const [agregadas, borradas] = fila.split('\t');
  totalLineas += (Number(agregadas) || 0) + (Number(borradas) || 0);
}
if (totalLineas > LIMITE_LINEAS) {
  motivos.push(`Cambio grande: ${totalLineas} líneas (límite ${LIMITE_LINEAS})`);
}

// 3. Riesgo declarado en la spec
let riesgo = 'desconocido';
try {
  const spec = ejecutar(`git show ${rama}:specs/${id}.md`);
  const coincidencia = spec.match(/##\s*Riesgo[\s\S]*?\b(bajo|medio|alto)\b/i);
  if (coincidencia) riesgo = coincidencia[1].toLowerCase();
} catch {
  motivos.push('No se encontró la spec en la rama');
}
if (riesgo !== 'bajo') motivos.push(`Riesgo de la spec: ${riesgo}`);

// Resultado
const destino = motivos.length === 0 ? 'MAIN' : 'PR';
console.log(`DESTINO: ${destino}`);
console.log(`Riesgo de la spec: ${riesgo}`);
console.log(`Líneas cambiadas: ${totalLineas}`);
if (motivos.length > 0) {
  console.log('Motivos:');
  for (const motivo of motivos) console.log(`- ${motivo}`);
}
