export type EstadoSolicitud = 'pendiente' | 'Recomendada' | 'Revisar' | 'Rechazada';

export interface ZonaFranca {
  id: string | number;
  nombre: string;
  inversionMinima: number;
  empleosMinimos: number;
  sectoresPermitidos: string[];
}

export interface SolicitudApi {
  id: string | number;
  empresa: string;
  sector: string;
  inversionProyectada: number;
  empleosProyectados: number;
  zonaFrancaId: string | number;
  estado: EstadoSolicitud;
  puntaje: number;
  justificacion: string;
  fecha: string;
}

export type NuevaSolicitud = Omit<SolicitudApi, 'id'>;
export type NuevaZonaFranca = Omit<ZonaFranca, 'id'>;
