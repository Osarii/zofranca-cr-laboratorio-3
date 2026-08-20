# ZoFranca CR — Requerimientos Persona B (Kevin)

## Alcance
RF-06, RF-07, RF-08, RF-09, RF-13, RF-14 y RF-18. Rama: `feature/kevin`.

## Reglas de negocio
1. Solo una empresa asociada a una solicitud `Recomendada` puede reportar.
2. Los compromisos se leen siempre de `solicitudes`.
3. Empleo cumple si `empleosReales >= empleosProyectados`.
4. Inversión cumple si `inversionEjecutada >= inversionProyectada`.
5. El reporte cumple cuando ambos compromisos se cumplen.
6. Si un umbral falla se genera una alerta derivada.
7. El historial conserva empresa → solicitud → reportes → resultado.
8. Los reportes se evalúan de forma independiente.
9. La evaluación múltiple usa `Promise.all`.
10. Los errores se registran en consola y muestran un mensaje no técnico.
11. `db.json` es la fuente única de verdad.

## Criterios de aceptación

### RF-06
- Dado que existe una empresa instalada, cuando se abre el formulario, entonces aparecen los campos de reporte.
- Dado un formulario válido, cuando se envía, entonces se hace POST a `/reportesCumplimiento`.
- Dado un registro exitoso, cuando termina la operación, entonces se confirma al usuario.
- Dado un error, cuando falla el servidor, entonces se registra en consola y se muestra un mensaje claro.

### RF-07
- Dado un reporte, cuando se evalúa, entonces se obtiene la solicitud asociada.
- Dado un compromiso de empleo, cuando se compara, entonces se usa `empleosReales >= empleosProyectados`.
- Dado un compromiso de inversión, cuando se compara, entonces se usa `inversionEjecutada >= inversionProyectada`.
- Dado que la solicitud es la fuente de compromisos, entonces no se duplican metas en el reporte.

### RF-08
- Dado un reporte que cumple, entonces no se genera alerta.
- Dado un incumplimiento de empleo, entonces se genera alerta de empleo.
- Dado un incumplimiento de inversión, entonces se genera alerta de inversión.
- Dado más de un incumplimiento, entonces se muestran todas las alertas.

### RF-09
- Dado que existen reportes, entonces el resumen consolida resultados.
- Dado que existen cumplidos e incumplidos, entonces ambos se distinguen.
- Dado que no existen reportes, entonces se muestra estado vacío.

### RF-13
- Dado que existen múltiples reportes, cuando se evalúan, entonces se usa `Promise.all`.
- Dado que existen múltiples reportes, entonces se solicitan en paralelo.
- Dado un error, entonces se maneja sin congelar la interfaz.

### RF-14
- Dado una empresa, cuando se consulta historial, entonces se muestra su solicitud asociada.
- Dado reportes existentes, entonces se muestran todos sus períodos.
- Dado un incumplimiento, entonces la alerta aparece dentro del historial.
- Dado varios reportes, entonces cada resultado permanece separado.

### RF-18
- Total de solicitudes.
- Porcentaje de solicitudes `Recomendada`.
- Tiempo promedio entre `solicitudes.fecha` y `empresas.fechaInstalacion`.
