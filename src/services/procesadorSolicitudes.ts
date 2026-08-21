import type { SolicitudApi } from '../contrato';
import { evaluarPerfilConIA } from './motorIa';
import {
  actualizarSolicitud,
  obtenerSolicitudesPendientes,
  obtenerZonaFranca,
} from './solicitudesApi';

export async function evaluarSolicitud(solicitud: SolicitudApi): Promise<SolicitudApi> {
  const zona = await obtenerZonaFranca(solicitud.zonaFrancaId);
  const resultado = await evaluarPerfilConIA(solicitud, zona);

  return actualizarSolicitud(solicitud.id, {
    estado: resultado.estado,
    puntaje: resultado.puntaje,
    justificacion: resultado.justificacion,
    evaluacionIa: {
      modelo: resultado.modelo,
      origen: resultado.origen,
      generadoEn: resultado.generadoEn,
      riesgos: resultado.riesgos,
      recomendaciones: resultado.recomendaciones,
    },
  });
}

export async function evaluarSolicitudesPendientes(): Promise<SolicitudApi[]> {
  const pendientes = await obtenerSolicitudesPendientes();

  // RF-13: las solicitudes se evalúan de forma concurrente.
  return Promise.all(pendientes.map((solicitud) => evaluarSolicitud(solicitud)));
}
