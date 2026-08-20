# ZoFranca CR — Persona A

Módulo de admisión y evaluación de solicitudes integrado en la plantilla visual de ZoFranca CR. Está preparado para `feature/jared` y conserva el módulo de cumplimiento asignado a Kevin.

## Funcionalidad

- RF-01: registro de zonas francas con inversión, empleos y sectores mínimos.
- RF-02: formulario de solicitud de instalación.
- RF-03: persistencia asíncrona mediante `json-server` y `db.json`.
- RF-04: motor simulado de afinidad de 0 a 100 con justificación.
- RF-05: clasificación `Recomendada`, `Revisar` o `Rechazada`.
- RF-13: evaluación concurrente de pendientes mediante `Promise.all`.
- RF-15: búsqueda y filtros por estado, zona, sector y fechas.
- Vistas de formulario, tablero/listado y detalle de evaluación.
- Notificaciones accesibles con estados de éxito, advertencia, información y error.
- Sonidos locales para acciones relevantes, con control persistente para silenciarlos.
- Transiciones de vistas y microinteracciones que respetan `prefers-reduced-motion`.
- Gráficas animadas para estados de solicitudes, cumplimiento y categorías de alertas.

## Ejecución

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Interfaz: `http://localhost:3000`

API REST: `http://localhost:3001`

Servicios separados:

```bash
npm run dev:api
npm run dev:web
```

## Verificación

```bash
npm run lint
npm test
npm run build
```

## API y contrato compartido

`db.json` incluye las colecciones `zonasFrancas`, `solicitudes`, `empresas` y `reportesCumplimiento`.

- `GET/POST /zonasFrancas`
- `GET /zonasFrancas/:id`
- `GET/POST /solicitudes`
- `GET /solicitudes?estado=pendiente`
- `PATCH /solicitudes/:id`

La URL base se declara una sola vez en `src/shared/apiClient.ts`. El clasificador es local y determinista, por lo que la demostración no necesita credenciales externas y puede reiniciarse restaurando `db.json`.

## Archivos principales

```text
src/
├── adapters/solicitudesAdapter.ts
├── components/solicitudes/
├── components/zonas/ZonasFrancasView.tsx
├── services/motorIa.ts
├── services/procesadorSolicitudes.ts
├── services/solicitudesApi.ts
├── shared/apiClient.ts
├── shared/estados.ts
├── shared/feedback/
├── contrato.ts
└── types.ts (compatibilidad con la plantilla)
```

Los efectos de sonido se sirven desde `public/sounds` y no requieren conexión a servicios externos.

Los errores de red se muestran en la interfaz y se registran en consola para facilitar el diagnóstico.

La especificación completa, con glosario, reglas de negocio y criterios de aceptación, está en `docs/requerimientos-persona-a.md`.
