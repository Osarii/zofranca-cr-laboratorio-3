import { obtenerX, guardarX } from '../shared/apiClient';
import type {
  Empresa,
  ReporteCumplimiento,
  Solicitud,
} from '../shared/types';

export interface ResultadoComparacion {
  reporte: ReporteCumplimiento;
  solicitud: Solicitud;
  cumpleEmpleos: boolean;
  cumpleInversion: boolean;
  cumple: boolean;
  alertas: AlertaCumplimiento[];
}

export interface AlertaCumplimiento {
  id: string;
  reporteId: number;
  empresaId: number;
  empresa: string;
  categoria: 'Empleo' | 'Inversión';
  titulo: string;
  descripcion: string;
  valorReportado: number;
  valorComprometido: number;
  brecha: number;
  severidad: 'Alta' | 'Media';
  fecha: string;
}

export async function obtenerEmpresas(): Promise<Empresa[]> {
  return obtenerX<Empresa[]>('/empresas');
}

export async function obtenerEmpresa(id: number): Promise<Empresa> {
  return obtenerX<Empresa>(`/empresas/${id}`);
}

export async function obtenerSolicitudes(): Promise<Solicitud[]> {
  return obtenerX<Solicitud[]>('/solicitudes');
}

export async function obtenerReporte(id: number): Promise<ReporteCumplimiento> {
  return obtenerX<ReporteCumplimiento>(`/reportesCumplimiento/${id}`);
}

export async function obtenerReportesEmpresa(
  empresaId: number,
): Promise<ReporteCumplimiento[]> {
  return obtenerX<ReporteCumplimiento[]>(
    `/reportesCumplimiento?empresaId=${empresaId}`,
  );
}

export async function obtenerSolicitud(id: number): Promise<Solicitud> {
  return obtenerX<Solicitud>(`/solicitudes/${id}`);
}

export async function guardarReporte(
  reporte: Omit<ReporteCumplimiento, 'id'>,
): Promise<ReporteCumplimiento> {
  return guardarX<ReporteCumplimiento>('/reportesCumplimiento', reporte);
}

export function compararCumplimiento(
  reporte: ReporteCumplimiento,
  solicitud: Solicitud,
  empresa: Empresa,
): ResultadoComparacion {
  const cumpleEmpleos = reporte.empleosReales >= solicitud.empleosProyectados;
  const cumpleInversion =
    reporte.inversionEjecutada >= solicitud.inversionProyectada;
  const cumple = cumpleEmpleos && cumpleInversion;

  const alertas: AlertaCumplimiento[] = [];

  if (!cumpleEmpleos) {
    const brecha = solicitud.empleosProyectados - reporte.empleosReales;
    alertas.push({
      id: `reporte-${reporte.id}-empleos`,
      reporteId: reporte.id,
      empresaId: empresa.id,
      empresa: empresa.nombre,
      categoria: 'Empleo',
      titulo: 'Incumplimiento de empleo',
      descripcion: `La empresa reportó ${reporte.empleosReales} empleos frente a ${solicitud.empleosProyectados} comprometidos.`,
      valorReportado: reporte.empleosReales,
      valorComprometido: solicitud.empleosProyectados,
      brecha,
      severidad: brecha / Math.max(solicitud.empleosProyectados, 1) >= 0.2 ? 'Alta' : 'Media',
      fecha: reporte.fecha,
    });
  }

  if (!cumpleInversion) {
    const brecha = solicitud.inversionProyectada - reporte.inversionEjecutada;
    alertas.push({
      id: `reporte-${reporte.id}-inversion`,
      reporteId: reporte.id,
      empresaId: empresa.id,
      empresa: empresa.nombre,
      categoria: 'Inversión',
      titulo: 'Incumplimiento de inversión',
      descripcion: `La empresa reportó una inversión de ₡${reporte.inversionEjecutada.toLocaleString('es-CR')} frente a ₡${solicitud.inversionProyectada.toLocaleString('es-CR')} comprometidos.`,
      valorReportado: reporte.inversionEjecutada,
      valorComprometido: solicitud.inversionProyectada,
      brecha,
      severidad: brecha / Math.max(solicitud.inversionProyectada, 1) >= 0.2 ? 'Alta' : 'Media',
      fecha: reporte.fecha,
    });
  }

  return {
    reporte,
    solicitud,
    cumpleEmpleos,
    cumpleInversion,
    cumple,
    alertas,
  };
}

export async function evaluarReporte(
  reporte: ReporteCumplimiento,
): Promise<ResultadoComparacion> {
  const empresa = await obtenerEmpresa(reporte.empresaId);
  const solicitud = await obtenerSolicitud(empresa.solicitudId);
  return compararCumplimiento(reporte, solicitud, empresa);
}

export async function evaluarReportesParalelo(
  reportes: ReporteCumplimiento[],
): Promise<ResultadoComparacion[]> {
  return Promise.all(reportes.map((reporte) => evaluarReporte(reporte)));
}
