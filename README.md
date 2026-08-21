# ZoFranca CR — Persona A

Módulo de admisión y evaluación de solicitudes integrado en la plantilla visual de ZoFranca CR. Está preparado para `feature/jared` y conserva el módulo de cumplimiento asignado a Kevin.

## Funcionalidad

- RF-01: registro de zonas francas con inversión, empleos y sectores mínimos.
- RF-02: formulario de solicitud de instalación.
- RF-03: persistencia asíncrona mediante `json-server` y `db.json`.
- RF-04: evaluación real con Gemini, justificación, riesgos y recomendaciones.
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
```

Antes del primer análisis con IA, cree una clave gratuita en [Google AI Studio](https://aistudio.google.com/apikey), copie `.env.example` como `.env` y reemplace el valor de `GEMINI_API_KEY`:

```env
GEMINI_API_KEY="su_clave_real"
GEMINI_MODEL="gemini-3.6-flash"
GEMINI_FALLBACK_MODELS="gemini-3.5-flash,gemini-2.5-flash"
```

Luego ejecute:

```bash
npm run dev
```

Interfaz: `http://localhost:3000`

API REST: `http://localhost:3001`

Servicio de IA: `http://localhost:3002`

Servicios separados:

```bash
npm run dev:api
npm run dev:ai
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

El puntaje y la clasificación se calculan mediante reglas locales verificables. Gemini 3.6 Flash utiliza esos resultados para elaborar la justificación, detectar riesgos y sugerir próximos pasos sin modificar el puntaje. La clave permanece exclusivamente en el servidor.

- `GET /api/estado`: indica si Gemini está configurado y qué modelo utiliza.
- `POST /api/evaluar`: ejecuta la evaluación de Gemini.

Para desplegar en Vercel, agregue `GEMINI_API_KEY` y `GEMINI_MODEL` como variables de entorno del proyecto. Nunca utilice una variable `VITE_GEMINI_API_KEY`, porque expondría la clave en el navegador.

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
server/
├── aiServer.ts
└── geminiService.ts
api/
├── estado.ts
└── evaluar.ts
```

Los efectos de sonido se sirven desde `public/sounds` y no requieren conexión a servicios externos.

Los errores de red se muestran en la interfaz y se registran en consola para facilitar el diagnóstico.

La especificación completa, con glosario, reglas de negocio y criterios de aceptación, está en `docs/requerimientos-persona-a.md`.
