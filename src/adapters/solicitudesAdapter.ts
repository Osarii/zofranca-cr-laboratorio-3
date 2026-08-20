import type { SolicitudItem, SolicitudStatus } from '../types';
import type { SolicitudApi, ZonaFranca } from '../contrato';

const estadoCompatible = (estado: SolicitudApi['estado']): SolicitudStatus => {
  const equivalencias: Record<SolicitudApi['estado'], SolicitudStatus> = {
    pendiente: 'Pendiente',
    Recomendada: 'RECOMENDADA',
    Revisar: 'REVISAR',
    Rechazada: 'RECHAZADA',
  };
  return equivalencias[estado];
};

export function adaptarSolicitud(solicitud: SolicitudApi, zonas: ZonaFranca[]): SolicitudItem {
  const zona = zonas.find(({ id }) => String(id) === String(solicitud.zonaFrancaId));
  const fecha = new Intl.DateTimeFormat('es-CR').format(new Date(`${solicitud.fecha}T12:00:00`));

  return {
    id: `ZF-${solicitud.id}`,
    company: solicitud.empresa,
    companyName: solicitud.empresa,
    regimen: 'Solicitud de instalación',
    regimenType: 'Régimen de Zona Franca',
    sector: solicitud.sector,
    date: fecha,
    submissionDate: solicitud.fecha,
    aiScore: solicitud.puntaje,
    aiClassification: solicitud.estado === 'Recomendada'
      ? 'RECOMENDADA'
      : solicitud.estado === 'Revisar'
        ? 'REVISAR'
        : 'RECHAZADA',
    aiJustification: solicitud.justificacion || 'Solicitud pendiente de evaluación automática.',
    status: estadoCompatible(solicitud.estado),
    progress: solicitud.estado === 'pendiente' ? 25 : 100,
    investmentAmount: solicitud.inversionProyectada,
    investmentUSD: solicitud.inversionProyectada,
    projectedJobs: solicitud.empleosProyectados,
    jobsCommitment: solicitud.empleosProyectados,
    location: zona?.nombre ?? 'Zona no disponible',
    zonaFranca: zona?.nombre ?? 'Zona no disponible',
    expedienteNumber: `ZF-${solicitud.id}`,
    investmentType: 'Nueva instalación',
    description: `Solicitud de ${solicitud.empresa} para operar en el sector ${solicitud.sector}.`,
    timeline: [
      { date: fecha, action: 'Solicitud recibida en la plataforma', completed: true },
      ...(solicitud.estado === 'pendiente'
        ? []
        : [{ date: fecha, action: `Evaluación IA completada (${solicitud.puntaje}/100)`, completed: true }]),
    ],
  };
}
