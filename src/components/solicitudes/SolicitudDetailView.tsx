import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Cpu,
  DollarSign,
  Download,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import type { EstadoSolicitud, SolicitudApi, ZonaFranca } from '../../contrato';

interface SolicitudDetailViewProps {
  solicitud: SolicitudApi;
  zonaFranca?: ZonaFranca;
  onBack: () => void;
  onEvaluate: (solicitud: SolicitudApi) => Promise<void>;
  onOpenExportModal: () => void;
}

const estilosEstado: Record<EstadoSolicitud, { chip: string; barra: string; titulo: string }> = {
  pendiente: { chip: 'bg-amber-100 text-amber-800', barra: 'bg-amber-500', titulo: 'Pendiente de evaluación' },
  Recomendada: { chip: 'bg-emerald-100 text-emerald-800', barra: 'bg-emerald-500', titulo: 'Perfil recomendado' },
  Revisar: { chip: 'bg-sky-100 text-sky-800', barra: 'bg-sky-500', titulo: 'Requiere revisión' },
  Rechazada: { chip: 'bg-rose-100 text-rose-800', barra: 'bg-rose-500', titulo: 'Perfil rechazado' },
};

export const SolicitudDetailView: React.FC<SolicitudDetailViewProps> = ({
  solicitud,
  zonaFranca,
  onBack,
  onEvaluate,
  onOpenExportModal,
}) => {
  const [evaluando, setEvaluando] = useState(false);
  const [error, setError] = useState('');
  const estilo = estilosEstado[solicitud.estado];

  const evaluar = async () => {
    setEvaluando(true);
    setError('');
    try {
      await onEvaluate(solicitud);
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : 'No fue posible completar la evaluación.');
    } finally {
      setEvaluando(false);
    }
  };

  const formatoFecha = new Intl.DateTimeFormat('es-CR', { dateStyle: 'long' })
    .format(new Date(`${solicitud.fecha}T12:00:00`));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="flex items-center gap-2 py-1 text-xs font-bold text-[#5A1F2D] hover:text-[#9A4D5D]"><ArrowLeft className="h-4 w-4" /> Volver al listado</button>
        <button type="button" onClick={onOpenExportModal} disabled={solicitud.estado === 'pendiente'} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#5A1F2D] shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4 text-[#9A4D5D]" /> Generar dictamen</button>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-[#9A4D5D]"><Building2 className="h-6 w-6" /></span>
                <div><p className="font-mono text-xs font-bold text-slate-500">SOL-{solicitud.id}</p><h1 className="text-xl font-extrabold text-[#5A1F2D]">{solicitud.empresa}</h1><p className="mt-1 text-xs text-slate-500">Registrada el {formatoFecha}</p></div>
              </div>
              <span className={`self-start rounded-full px-3 py-1.5 text-xs font-extrabold ${estilo.chip}`}>{estilo.titulo}</span>
            </div>

            <div className="grid gap-5 pt-5 sm:grid-cols-2">
              <Dato icono={MapPin} etiqueta="Zona franca" valor={zonaFranca?.nombre ?? 'Zona no disponible'} />
              <Dato icono={ShieldCheck} etiqueta="Sector" valor={solicitud.sector} />
              <Dato icono={DollarSign} etiqueta="Inversión proyectada" valor={`$${solicitud.inversionProyectada.toLocaleString('en-US')} USD`} />
              <Dato icono={Users} etiqueta="Empleos proyectados" valor={`${solicitud.empleosProyectados} plazas directas`} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-[#5A1F2D]">Comparación con criterios de la zona</h2>
            {zonaFranca ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Comparacion etiqueta="Inversión mínima" proyectado={solicitud.inversionProyectada} requerido={zonaFranca.inversionMinima} formato="moneda" />
                <Comparacion etiqueta="Empleos mínimos" proyectado={solicitud.empleosProyectados} requerido={zonaFranca.empleosMinimos} />
                <div className={`rounded-xl border p-4 ${zonaFranca.sectoresPermitidos.includes(solicitud.sector) ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Sector permitido</p>
                  <p className="mt-2 text-sm font-extrabold text-[#5A1F2D]">{zonaFranca.sectoresPermitidos.includes(solicitud.sector) ? 'Sí' : 'No'}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{zonaFranca.sectoresPermitidos.join(', ')}</p>
                </div>
              </div>
            ) : <p className="mt-3 text-sm text-slate-500">No fue posible recuperar los criterios de la zona asociada.</p>}
          </section>

          {solicitud.estado === 'Recomendada' && (
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><div><h2 className="font-extrabold text-emerald-900">Lista para continuar al módulo de instalación</h2><p className="mt-1 text-sm text-emerald-800">La solicitud recomendada queda disponible mediante el identificador <strong>{solicitud.id}</strong>. El módulo de cumplimiento puede consultarla sin modificar este flujo.</p></div></div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><Cpu className="h-5 w-5" /></span><div><h2 className="text-sm font-extrabold text-[#5A1F2D]">Motor de afinidad IA</h2><p className="text-[11px] text-slate-500">Evaluación asíncrona · 0 a 100</p></div></div>
            <div className="py-7 text-center">
              <div className="text-6xl font-black tracking-tight text-[#5A1F2D]">{solicitud.estado === 'pendiente' ? '—' : solicitud.puntaje}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">{solicitud.estado === 'pendiente' ? 'Sin evaluar' : 'de 100 puntos'}</div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all ${estilo.barra}`} style={{ width: `${solicitud.puntaje}%` }} /></div>
              <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-400"><span>0</span><span>Revisar: 50</span><span>Recomendar: 80</span><span>100</span></div>
            </div>
            <div className={`rounded-xl p-4 text-xs leading-relaxed ${solicitud.estado === 'pendiente' ? 'bg-amber-50 text-amber-800' : 'bg-slate-50 text-slate-600'}`}>
              <strong className="mb-1 block text-[#5A1F2D]">Justificación automática</strong>
              {solicitud.justificacion || 'La solicitud está almacenada y lista para ser comparada con los criterios mínimos de su zona franca.'}
            </div>
            <button type="button" onClick={() => void evaluar()} disabled={evaluando} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-60">
              {evaluando ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {evaluando ? 'Evaluando perfil…' : solicitud.estado === 'pendiente' ? 'Evaluar ahora' : 'Reevaluar perfil'}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
};

interface DatoProps {
  icono: React.ComponentType<{ className?: string }>;
  etiqueta: string;
  valor: string;
}

const Dato: React.FC<DatoProps> = ({ icono: Icono, etiqueta, valor }) => (
  <div><p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500"><Icono className="h-3.5 w-3.5 text-[#9A4D5D]" />{etiqueta}</p><p className="mt-1.5 text-sm font-extrabold text-[#5A1F2D]">{valor}</p></div>
);

interface ComparacionProps {
  etiqueta: string;
  proyectado: number;
  requerido: number;
  formato?: 'moneda';
}

const Comparacion: React.FC<ComparacionProps> = ({ etiqueta, proyectado, requerido, formato }) => {
  const cumple = proyectado >= requerido;
  const mostrar = (valor: number) => formato === 'moneda' ? `$${valor.toLocaleString('en-US')}` : valor.toLocaleString('es-CR');
  return (
    <div className={`rounded-xl border p-4 ${cumple ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{etiqueta}</p>
      <p className="mt-2 text-sm font-extrabold text-[#5A1F2D]">{mostrar(proyectado)}</p>
      <p className="mt-1 text-[11px] text-slate-500">Requerido: {mostrar(requerido)} · <strong>{cumple ? 'Cumple' : 'No cumple'}</strong></p>
    </div>
  );
};
