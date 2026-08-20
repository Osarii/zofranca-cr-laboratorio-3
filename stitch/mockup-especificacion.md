# Stitch — Pantallas Persona B

## Pantalla 1: Formulario de reporte de cumplimiento
- Encabezado: “Cumplimiento y Fiscalización”.
- Selector de empresa instalada.
- Bloque de compromisos originales: empleos e inversión.
- Campos: empleos reales, inversión ejecutada, exportaciones y fecha.
- Botón primario: “Registrar reporte”.
- Panel lateral de resultado de comparación.
- Estados: cargando, listo y error.
- Mantener tokens visuales: navy `#0B2B4A`, azul `#2D9CDB`, fondo `#f4f7fb`.

## Pantalla 2: Panel de alertas
- KPI de alertas.
- KPI de prioridad alta.
- KPI de empresas afectadas.
- Lista de alertas con empresa, categoría, descripción, brecha y severidad.
- Sin alertas: estado vacío con confirmación verde.
- Las alertas son derivadas de RF-07/RF-08 y no requieren una colección adicional en `db.json`.

## Navegación complementaria
- Historial: empresa → solicitud → reportes → decisiones/alertas.
- Resumen PROCOMER: reportes evaluados, cumplidos, incumplidos y porcentaje de cumplimiento.
