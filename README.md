# ZoFranca CR — Plataforma de Gestión y Cumplimiento

Base visual: plantilla entregada por el equipo. Integración de Persona B (Kevin).

## Ramas
- Persona A — Jared: `feature/jared`
- Persona B — Kevin: `feature/kevin`

## Backend local
El contrato compartido usa `json-server` en `http://localhost:3001`.

Terminal 1:
```bash
npm run backend
```

Terminal 2:
```bash
npm install
npm run dev
```

Frontend: `http://localhost:3000`

## Contrato
La fuente de verdad es `db.json`. Las definiciones compartidas están en:
- `shared/types.ts`
- `shared/estados.ts`
- `shared/apiClient.ts`

El módulo de Kevin está en:
- `cumplimiento/`

## Alcance integrado
RF-06, RF-07, RF-08, RF-09, RF-13, RF-14 y RF-18.

Las alertas se derivan de la comparación contra `solicitudes`; no se agrega una colección `alertas` al contrato.

RF-18 usa `GET /solicitudes` únicamente para calcular métricas de lectura; no modifica solicitudes.

## Datos de prueba
`db.json` incluye tres solicitudes `Recomendada`, sus empresas instaladas y reportes con casos de cumplimiento e incumplimiento.

## Integración final
Antes de fusionar:
- confirmar que las alertas aparecen en el historial;
- confirmar que RF-07 lee los compromisos reales de `solicitudes`;
- confirmar que Jared conserva los nombres/estados del contrato;
- no renombrar campos del contrato compartido.
