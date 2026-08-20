export interface ZonaFranca {
  id: number;
  nombre: string;
  inversionMinima: number;
  empleosMinimos: number;
  sectoresPermitidos: string[];
}

export interface Solicitud {
  id: number;
  empresa: string;
  sector: string;
  inversionProyectada: number;
  empleosProyectados: number;
  zonaFrancaId: number;
  estado: 'pendiente' | 'Recomendada' | 'Revisar' | 'Rechazada';
  puntaje: number;
  justificacion: string;
  fecha: string;
}

export interface Empresa {
  id: number;
  nombre: string;
  solicitudId: number;
  fechaInstalacion: string;
}

export interface ReporteCumplimiento {
  id: number;
  empresaId: number;
  empleosReales: number;
  inversionEjecutada: number;
  exportaciones: number;
  fecha: string;
  cumple: boolean;
}
