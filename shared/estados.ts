export const ESTADOS_SOLICITUD = {
  RECOMENDADA: 'Recomendada',
  REVISAR: 'Revisar',
  RECHAZADA: 'Rechazada',
} as const;

export const ESTADOS_UI = {
  CARGANDO: 'cargando',
  LISTO: 'listo',
  ERROR: 'error',
} as const;

export type EstadoSolicitud =
  (typeof ESTADOS_SOLICITUD)[keyof typeof ESTADOS_SOLICITUD];

export type EstadoUI = (typeof ESTADOS_UI)[keyof typeof ESTADOS_UI];
