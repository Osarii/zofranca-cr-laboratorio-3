import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Cpu, DollarSign, FileText, MapPin, Users, X } from 'lucide-react';
import type { NuevaSolicitud, SolicitudApi, ZonaFranca } from '../../contrato';
import { ESTADOS_SOLICITUD } from '../../shared/estados';

interface NewSolicitudModalProps {
  isOpen: boolean;
  zonasFrancas: ZonaFranca[];
  onClose: () => void;
  onSubmit: (solicitud: NuevaSolicitud) => Promise<SolicitudApi>;
}

export const NewSolicitudModal: React.FC<NewSolicitudModalProps> = ({
  isOpen,
  zonasFrancas,
  onClose,
  onSubmit,
}) => {
  const [empresa, setEmpresa] = useState('');
  const [zonaFrancaId, setZonaFrancaId] = useState<string>('');
  const [sector, setSector] = useState('');
  const [inversionProyectada, setInversionProyectada] = useState(0);
  const [empleosProyectados, setEmpleosProyectados] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const zonaSeleccionada = useMemo(
    () => zonasFrancas.find((zona) => String(zona.id) === zonaFrancaId),
    [zonaFrancaId, zonasFrancas],
  );

  useEffect(() => {
    if (!isOpen || zonasFrancas.length === 0) return;
    setZonaFrancaId((actual) => actual || String(zonasFrancas[0].id));
  }, [isOpen, zonasFrancas]);

  useEffect(() => {
    const sectores = zonaSeleccionada?.sectoresPermitidos ?? [];
    if (!sectores.includes(sector)) setSector(sectores[0] ?? '');
  }, [sector, zonaSeleccionada]);

  if (!isOpen) return null;

  const limpiarFormulario = () => {
    setEmpresa('');
    setInversionProyectada(0);
    setEmpleosProyectados(0);
    setError('');
  };

  const cerrar = () => {
    if (guardando) return;
    limpiarFormulario();
    onClose();
  };

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!zonaSeleccionada || !sector) {
      setError('Primero debe existir una zona franca con al menos un sector permitido.');
      return;
    }

    setGuardando(true);
    setError('');
    try {
      await onSubmit({
        empresa: empresa.trim(),
        sector,
        inversionProyectada: Number(inversionProyectada),
        empleosProyectados: Number(empleosProyectados),
        zonaFrancaId: zonaSeleccionada.id,
        estado: ESTADOS_SOLICITUD.PENDIENTE,
        puntaje: 0,
        justificacion: '',
        fecha: new Date().toISOString().slice(0, 10),
      });
      limpiarFormulario();
      onClose();
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : 'No fue posible guardar la solicitud.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#5A1F2D]/65 p-4 backdrop-blur-sm">
      <div className="my-6 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-[#5A1F2D] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#9A4D5D]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">Nueva solicitud de instalación</h2>
              <p className="text-xs text-slate-300">Registro, almacenamiento y evaluación automática</p>
            </div>
          </div>
          <button type="button" onClick={cerrar} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={enviar} className="space-y-5 p-6">
          {error && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="empresa" className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#5A1F2D]">
              <Building2 className="h-4 w-4 text-[#9A4D5D]" /> Empresa o razón social
            </label>
            <input id="empresa" required maxLength={120} value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Ej. Innovación Médica CR S.A." className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus-turquoise" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="zona" className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#5A1F2D]">
                <MapPin className="h-4 w-4 text-[#9A4D5D]" /> Zona franca
              </label>
              <select id="zona" required value={zonaFrancaId} onChange={(e) => setZonaFrancaId(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus-turquoise">
                {zonasFrancas.length === 0 && <option value="">No hay zonas registradas</option>}
                {zonasFrancas.map((zona) => <option key={zona.id} value={String(zona.id)}>{zona.nombre}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="sector" className="mb-1.5 block text-xs font-bold text-[#5A1F2D]">Sector productivo</label>
              <select id="sector" required value={sector} onChange={(e) => setSector(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus-turquoise">
                {(zonaSeleccionada?.sectoresPermitidos ?? []).map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>

          {zonaSeleccionada && (
            <div className="grid gap-3 rounded-xl border border-sky-100 bg-sky-50/70 p-4 text-xs sm:grid-cols-3">
              <div><span className="block text-slate-500">Inversión mínima</span><strong className="text-[#5A1F2D]">${zonaSeleccionada.inversionMinima.toLocaleString('en-US')}</strong></div>
              <div><span className="block text-slate-500">Empleos mínimos</span><strong className="text-[#5A1F2D]">{zonaSeleccionada.empleosMinimos}</strong></div>
              <div><span className="block text-slate-500">Sectores habilitados</span><strong className="text-[#5A1F2D]">{zonaSeleccionada.sectoresPermitidos.length}</strong></div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="inversion" className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#5A1F2D]"><DollarSign className="h-4 w-4 text-[#9A4D5D]" /> Inversión proyectada (USD)</label>
              <input id="inversion" required min={1} type="number" value={inversionProyectada || ''} onChange={(e) => setInversionProyectada(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus-turquoise" />
            </div>
            <div>
              <label htmlFor="empleos" className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#5A1F2D]"><Users className="h-4 w-4 text-[#9A4D5D]" /> Empleos proyectados</label>
              <input id="empleos" required min={1} type="number" value={empleosProyectados || ''} onChange={(e) => setEmpleosProyectados(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus-turquoise" />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-xs text-slate-500"><Cpu className="h-4 w-4 text-indigo-500" /> El motor asignará un puntaje de afinidad de 0 a 100.</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={cerrar} disabled={guardando} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancelar</button>
              <button type="submit" disabled={guardando || zonasFrancas.length === 0} className="flex items-center gap-2 rounded-xl bg-[#9A4D5D] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#7C3545] disabled:cursor-not-allowed disabled:opacity-50">
                {guardando && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {guardando ? 'Guardando y evaluando…' : 'Guardar y evaluar con IA'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
