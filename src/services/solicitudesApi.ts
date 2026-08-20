import type { NuevaSolicitud, NuevaZonaFranca, SolicitudApi, ZonaFranca } from '../contrato';
import { ESTADOS_SOLICITUD } from '../shared/estados';
import { actualizar, guardar, obtener } from '../shared/apiClient';

const codificarId = (id: string | number) => encodeURIComponent(String(id));

export const obtenerZonasFrancas = () => obtener<ZonaFranca[]>('/zonasFrancas');

export const obtenerZonaFranca = (id: string | number) =>
  obtener<ZonaFranca>(`/zonasFrancas/${codificarId(id)}`);

export const guardarZonaFranca = (zona: NuevaZonaFranca) =>
  guardar<ZonaFranca>('/zonasFrancas', zona);

export const obtenerSolicitudes = () => obtener<SolicitudApi[]>('/solicitudes');

export const obtenerSolicitudesPendientes = () =>
  obtener<SolicitudApi[]>(`/solicitudes?estado=${encodeURIComponent(ESTADOS_SOLICITUD.PENDIENTE)}`);

export const guardarSolicitud = (solicitud: NuevaSolicitud) =>
  guardar<SolicitudApi>('/solicitudes', solicitud);

export const actualizarSolicitud = (id: string | number, cambios: Partial<SolicitudApi>) =>
  actualizar<SolicitudApi>(`/solicitudes/${codificarId(id)}`, cambios);
