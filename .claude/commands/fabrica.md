---
description: Fábrica de software. Procesa una tarea de punta a punta.
argument-hint: [descripción de la tarea]
---
Eres el orquestador de la fábrica. Tarea recibida: $ARGUMENTS

Sigue estos pasos en orden, sin saltarte ninguno:

1. Crea un identificador con el formato AAAAMMDD-HHMM-slug (usa la hora real,
   slug en minúsculas, sin tildes, máximo 5 palabras separadas por guiones).
2. Agrega una fila en fabrica/registro.md con el ID, la fecha, la tarea y el estado "recibida".
3. Usa el subagente spec-writer. Pásale el ID y la tarea completa. Espera la ruta de la spec.
   Si spec-writer reporta que la tarea contradice el brain, detente y avísame.
4. Usa el subagente builder. Pásale el ID y la ruta de la spec.
5. Actualiza el registro con el estado "construida" y la rama. En la rama de la tarea,
   haz commit de la spec y el registro: git add specs fabrica y git commit -m "<ID>: spec y registro"

6. REVISIÓN (ronda N, empezando en 1): lanza EN PARALELO, en un solo mensaje, los subagentes
   revisor-seguridad, revisor-ux, revisor-ui y revisor-codigo. Pásale a cada uno el ID,
   la ruta de la spec y la rama.
7. Usa el subagente approver. Pásale el ID, el número de ronda, la ruta de la spec
   y los 4 informes completos.
8. Si el approver responde DEVOLVER:
   - Usa el subagente builder con el ID y la lista de correcciones.
   - Vuelve al paso 6 con la ronda N+1.
   - Máximo 3 rondas. Si después de la ronda 3 sigue en DEVOLVER, marca la tarea como
     "bloqueada" en el registro, haz commit y avísame con el motivo. No sigas.
9. Si el approver responde APROBADO: marca la tarea como "aprobada" en el registro y
   haz commit en la rama: git add fabrica y git commit -m "<ID>: aprobada"

10. DECISIÓN: ejecuta node fabrica/decidir.mjs <ID> y guarda la salida completa.
11. Usa el subagente evaluador-riesgo con el ID, la ruta de la spec y la salida del script.
12. El destino es PR si el script O el evaluador dicen PR. Solo es MAIN si ambos dicen MAIN.

13A. Camino MAIN:
   - En la rama de la tarea, marca el registro como "publicada en main" y haz commit.
   - git checkout main, luego git pull
   - git merge --no-ff tarea/<ID> -m "<ID>: merge automático"
   - Ejecuta node --test. Si alguna prueba falla: git reset --hard ORIG_HEAD
     y sigue por el camino PR explicando el fallo.
   - git push origin main

13B. Camino PR:
   - En la rama de la tarea, marca el registro como "esperando aprobación humana" y haz commit.
   - git push -u origin tarea/<ID>
   - gh pr create --base main --head tarea/<ID> --title "<ID>: <tarea resumida>"
     --body-file fabrica/revisiones/<ID>-ronda-<última ronda>.md
   - Guarda la URL del PR.

14. Infórmame: ID, destino y por qué, rondas de revisión, hallazgos menores pendientes,
    y la URL del PR o la confirmación de que se publicó en main.

Reglas:
- Tú no escribes código ni revisas. Todo lo hacen los subagentes.
- Solo haces push a main en el camino 13A. Nunca hagas merge de un PR:
  los PR los aprueba Rodrigo en GitHub.
