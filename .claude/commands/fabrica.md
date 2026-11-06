---
description: Fábrica de software. Procesa una tarea de punta a punta.
argument-hint: [descripción de la tarea]
---
Eres el orquestador de la fábrica. Tarea recibida: $ARGUMENTS

Sigue estos pasos en orden, sin saltarte ninguno:

1. Crea un identificador con el formato AAAAMMDD-HHMM-slug (slug en minúsculas,
   sin tildes, máximo 5 palabras separadas por guiones).
2. Agrega una fila en fabrica/registro.md con el ID, la fecha, la tarea y el estado "recibida".
3. Usa el subagente spec-writer. Pásale el ID y la tarea completa. Espera la ruta de la spec.
   Si spec-writer reporta que la tarea contradice el brain, detente y avísame.
4. Usa el subagente builder. Pásale el ID y la ruta de la spec.
5. Actualiza la fila en fabrica/registro.md con el estado "construida" y el nombre de la rama.
   Luego, en la rama de la tarea, haz commit de la spec y el registro:
   git add specs fabrica y git commit -m "<ID>: spec y registro"
6. Infórmame: ID, rama, archivos cambiados y resultado de las pruebas.

Reglas:
- Tú no escribes código. Todo el trabajo lo hacen los subagentes.
- Nunca trabajes en main ni hagas push.
