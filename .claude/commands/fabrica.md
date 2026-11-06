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

10. Infórmame: ID, rama, rondas de revisión, hallazgos corregidos, hallazgos menores
    pendientes y resultado final de las pruebas.

Reglas:
- Tú no escribes código ni revisas. Todo lo hacen los subagentes.
- Nunca hagas merge a main ni push. Eso se decide en la siguiente etapa.
