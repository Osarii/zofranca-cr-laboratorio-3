import type { EstadoSolicitud, SolicitudApi, ZonaFranca } from '../contrato';
import { ESTADOS_SOLICITUD } from '../shared/estados';

export interface ComparacionAfinidad {
  puntaje: number;
  sectorPermitido: boolean;
  puntajeInversion: number;
  puntajeEmpleos: number;
  puntajeSector: number;
}

export interface ResultadoEvaluacion {
  estado: EstadoSolicitud;
  puntaje: number;
  justificacion: string;
  desglose: ComparacionAfinidad;
}

const normalizar = (valor: unknown) =>
  String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

function calcularCumplimiento(valor: number, minimo: number, peso: number) {
  if (!Number.isFinite(minimo) || minimo <= 0) return peso;
  return Math.round(Math.max(0, Math.min(valor / minimo, 1)) * peso);
}

export function compararSolicitudConZona(
  solicitud: Pick<SolicitudApi, 'sector' | 'inversionProyectada' | 'empleosProyectados'>,
  zona: ZonaFranca,
): ComparacionAfinidad {
  const sectorPermitido = zona.sectoresPermitidos.some(
    (sector) => normalizar(sector) === normalizar(solicitud.sector),
  );
  const puntajeInversion = calcularCumplimiento(solicitud.inversionProyectada, zona.inversionMinima, 40);
  const puntajeEmpleos = calcularCumplimiento(solicitud.empleosProyectados, zona.empleosMinimos, 35);
  const puntajeSector = sectorPermitido ? 25 : 0;

  return {
    puntaje: puntajeInversion + puntajeEmpleos + puntajeSector,
    sectorPermitido,
    puntajeInversion,
    puntajeEmpleos,
    puntajeSector,
  };
}

export function clasificarSolicitud(comparacion: ComparacionAfinidad): EstadoSolicitud {
  if (!comparacion.sectorPermitido) return ESTADOS_SOLICITUD.RECHAZADA;
  if (comparacion.puntaje >= 80) return ESTADOS_SOLICITUD.RECOMENDADA;
  if (comparacion.puntaje >= 50) return ESTADOS_SOLICITUD.REVISAR;
  return ESTADOS_SOLICITUD.RECHAZADA;
}

export function generarResultadoClasificacion(
  solicitud: Pick<SolicitudApi, 'sector' | 'inversionProyectada' | 'empleosProyectados'>,
  zona: ZonaFranca,
): ResultadoEvaluacion {
  const desglose = compararSolicitudConZona(solicitud, zona);
  const estado = clasificarSolicitud(desglose);
  const inversionCumple = solicitud.inversionProyectada >= zona.inversionMinima;
  const empleosCumplen = solicitud.empleosProyectados >= zona.empleosMinimos;
  const hallazgos = [
    desglose.sectorPermitido
      ? `El sector ${solicitud.sector} está permitido.`
      : `El sector ${solicitud.sector} no está permitido en esta zona franca.`,
    inversionCumple
      ? 'La inversión proyectada alcanza el mínimo solicitado.'
      : 'La inversión proyectada está por debajo del mínimo solicitado.',
    empleosCumplen
      ? 'La proyección de empleos alcanza el mínimo solicitado.'
      : 'La proyección de empleos está por debajo del mínimo solicitado.',
  ];

  return {
    estado,
    puntaje: desglose.puntaje,
    justificacion: `${estado} con ${desglose.puntaje}/100. ${hallazgos.join(' ')}`,
    desglose,
  };
}

export async function evaluarPerfilConIA(
  solicitud: Pick<SolicitudApi, 'sector' | 'inversionProyectada' | 'empleosProyectados'>,
  zona: ZonaFranca,
  latenciaMs = 600,
) {
  await new Promise((resolver) => setTimeout(resolver, latenciaMs));
  return generarResultadoClasificacion(solicitud, zona);
}
