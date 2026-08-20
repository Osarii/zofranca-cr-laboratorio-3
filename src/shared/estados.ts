import type { EstadoSolicitud } from '../contrato';

export const ESTADOS_SOLICITUD = Object.freeze({
  PENDIENTE: 'pendiente' as EstadoSolicitud,
  RECOMENDADA: 'Recomendada' as EstadoSolicitud,
  REVISAR: 'Revisar' as EstadoSolicitud,
  RECHAZADA: 'Rechazada' as EstadoSolicitud,
});

export const ESTADOS_UI = Object.freeze({
  CARGANDO: 'cargando',
  LISTO: 'listo',
  ERROR: 'error',
});
