import React, { useState } from 'react';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
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

const rotulosEstado: Record<EstadoSolicitud, string> = {
  pendiente: 'Pendiente',
  Recomendada: 'Recomendada',
  Revisar: 'En revisión',
  Rechazada: 'Rechazada',
};

export const SolicitudDetailView: React.FC<SolicitudDetailViewProps> = ({ solicitud, zonaFranca, onBack, onEvaluate, onOpenExportModal }) => {
  const [evaluando, setEvaluando] = useState(false);
  const [error, setError] = useState('');

  const evaluar = async () => {
    setEvaluando(true);
    setError('');
    try { await onEvaluate(solicitud); }
    catch (fallo) { setError(fallo instanceof Error ? fallo.message : 'No fue posible completar la evaluación.'); }
    finally { setEvaluando(false); }
  };

  const formatoFecha = new Intl.DateTimeFormat('es-CR', { dateStyle: 'long' }).format(new Date(`${solicitud.fecha}T12:00:00`));
  const puntaje = solicitud.estado === 'pendiente' ? 0 : solicitud.puntaje;
  const riesgo = solicitud.estado === 'Rechazada' ? 'Alto' : solicitud.estado === 'Revisar' ? 'Medio' : solicitud.estado === 'Recomendada' ? 'Bajo' : 'Por calcular';
  const sectorPermitido = Boolean(zonaFranca?.sectoresPermitidos.includes(solicitud.sector));

  return (
    <div className="space-y-7 pb-20 lg:pb-0">
      <header>
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-[#d0c6ab] hover:text-[#ffd700]"><ArrowLeft className="h-4 w-4" /> Volver a solicitudes</button>
        <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3"><span className="rounded-lg border border-[#4d4732] bg-[#2a2a2a] px-3 py-1.5 font-mono text-[11px] font-extrabold uppercase tracking-[.1em] text-[#ffd700]">REQ-{solicitud.id}</span><span className="flex items-center gap-1.5 text-xs font-bold text-[#ffd700]"><RefreshCw className="h-3.5 w-3.5" />{rotulosEstado[solicitud.estado]}</span></div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-.03em] text-[#fff6df] sm:text-4xl lg:text-5xl">{solicitud.empresa}</h1>
            <p className="mt-2 text-sm text-[#999077]">Solicitud registrada el {formatoFecha}</p>
          </div>
          <button type="button" onClick={onOpenExportModal} disabled={solicitud.estado === 'pendiente'} className="hidden items-center gap-2 rounded-lg border border-[#ffd700] bg-[#131313] px-5 py-3 text-xs font-extrabold text-[#ffd700] hover:bg-[#282500] disabled:opacity-40 sm:flex"><Download className="h-4 w-4" /> Descargar dictamen</button>
        </div>
      </header>

      {error && <div role="alert" className="rounded-lg border border-[#983640] bg-[#270f12] p-4 text-sm font-semibold text-[#ffb4ab]">{error}</div>}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_.7fr]">
        <div className="space-y-6">
          <section className="rounded-lg border border-[#4d4732] border-l-4 border-l-[#ffd700] bg-[#1f1f1f] p-6 sm:p-8">
            <div className="flex items-center gap-3"><Cpu className="h-6 w-6 text-[#ffd700]" /><h2 className="text-xl font-bold text-[#fff6df]">Evaluación IA</h2></div>
            <div className="mt-7 grid items-center gap-7 sm:grid-cols-[170px_1fr]">
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full p-2" style={{ background: `conic-gradient(#ffd700 ${puntaje * 3.6}deg, #353535 0deg)` }}>
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#1f1f1f]"><span className="text-5xl font-extrabold tracking-[-.05em] text-[#ffd700]">{solicitud.estado === 'pendiente' ? '—' : puntaje}</span><span className="text-xs font-bold text-[#999077]">/ 100</span></div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3"><span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#999077]">Nivel de riesgo</span><span className="rounded-full border border-[#4d4732] bg-[#2a2a2a] px-3 py-1 text-[10px] font-extrabold uppercase text-[#fff6df]">{riesgo}</span></div>
                <p className="mt-4 text-sm leading-7 text-[#d0c6ab]">{solicitud.justificacion || 'La solicitud está almacenada y lista para compararse con los criterios mínimos de la zona franca seleccionada.'}</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#353535]"><div className="h-full rounded-full bg-[#ffd700] transition-all" style={{ width: `${puntaje}%` }} /></div>
              </div>
            </div>
          </section>

          <div className="hidden gap-6 md:grid md:grid-cols-2">
            <InfoCard titulo="Información general" icono={Building2}>
              <Dato etiqueta="Empresa" valor={solicitud.empresa} />
              <Dato etiqueta="Zona franca" valor={zonaFranca?.nombre ?? 'Zona no disponible'} />
              <Dato etiqueta="Sector" valor={solicitud.sector} />
            </InfoCard>
            <InfoCard titulo="Inversión" icono={DollarSign}>
              <Dato etiqueta="Inversión proyectada" valor={`$${solicitud.inversionProyectada.toLocaleString('en-US')} USD`} />
              <Dato etiqueta="Mínimo de la zona" valor={zonaFranca ? `$${zonaFranca.inversionMinima.toLocaleString('en-US')} USD` : 'No disponible'} />
              <Dato etiqueta="Resultado" valor={zonaFranca && solicitud.inversionProyectada >= zonaFranca.inversionMinima ? 'Cumple el mínimo' : 'Requiere revisión'} destacado />
            </InfoCard>
            <InfoCard titulo="Empleo proyectado" icono={Users} className="md:col-span-2">
              <div className="grid gap-5 sm:grid-cols-3"><Dato etiqueta="Plazas directas" valor={solicitud.empleosProyectados.toLocaleString('es-CR')} /><Dato etiqueta="Mínimo requerido" valor={zonaFranca?.empleosMinimos.toLocaleString('es-CR') ?? 'No disponible'} /><Dato etiqueta="Sector permitido" valor={sectorPermitido ? 'Sí' : 'No'} destacado /></div>
            </InfoCard>
          </div>

          <div className="space-y-3 md:hidden">
            <Accordion titulo="Información general" icono={Building2}><Dato etiqueta="Empresa" valor={solicitud.empresa} /><Dato etiqueta="Zona franca" valor={zonaFranca?.nombre ?? 'Zona no disponible'} /><Dato etiqueta="Sector" valor={solicitud.sector} /></Accordion>
            <Accordion titulo="Inversión" icono={DollarSign}><Dato etiqueta="Proyectada" valor={`$${solicitud.inversionProyectada.toLocaleString('en-US')} USD`} /><Dato etiqueta="Mínimo" valor={zonaFranca ? `$${zonaFranca.inversionMinima.toLocaleString('en-US')} USD` : 'No disponible'} /></Accordion>
            <Accordion titulo="Empleo proyectado" icono={Users}><Dato etiqueta="Plazas directas" valor={solicitud.empleosProyectados.toLocaleString('es-CR')} /><Dato etiqueta="Mínimo" valor={zonaFranca?.empleosMinimos.toLocaleString('es-CR') ?? 'No disponible'} /></Accordion>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-[#4d4732] bg-[#1f1f1f] p-6">
            <h2 className="text-lg font-bold text-[#fff6df]">Historial</h2>
            <div className="mt-6 space-y-0">
              <TimelineItem titulo="Solicitud recibida" detalle={formatoFecha} completado />
              <TimelineItem titulo="Validación documental" detalle="Documentos procesados" completado={solicitud.estado !== 'pendiente'} />
              <TimelineItem titulo="Evaluación automatizada" detalle={solicitud.estado === 'pendiente' ? 'Pendiente' : `${solicitud.puntaje}/100 puntos`} completado={solicitud.estado !== 'pendiente'} ultimo />
            </div>
          </section>

          <section className="hidden rounded-lg border border-[#ffd700] bg-[#191805] p-6 lg:block">
            <ShieldCheck className="h-6 w-6 text-[#ffd700]" />
            <h2 className="mt-4 text-lg font-bold text-[#fff6df]">Acciones del analista</h2>
            <p className="mt-2 text-xs leading-relaxed text-[#d0c6ab]">Ejecute o actualice la evaluación antes de emitir el dictamen final.</p>
            <button type="button" onClick={() => void evaluar()} disabled={evaluando} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffd700] px-4 py-3 text-xs font-extrabold uppercase text-[#131313] hover:bg-[#ffe16d] disabled:opacity-50">{evaluando ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{evaluando ? 'Evaluando…' : solicitud.estado === 'pendiente' ? 'Evaluar solicitud' : 'Reevaluar solicitud'}</button>
            <button type="button" onClick={onOpenExportModal} disabled={solicitud.estado === 'pendiente'} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#4d4732] px-4 py-3 text-xs font-extrabold text-[#fff6df] hover:border-[#ffd700] disabled:opacity-40"><Download className="h-4 w-4" /> Emitir dictamen</button>
          </section>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 flex gap-3 border-t border-[#4d4732] bg-[#0e0e0e] p-4 lg:hidden">
        <button type="button" onClick={onOpenExportModal} disabled={solicitud.estado === 'pendiente'} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#4d4732] py-3 text-xs font-extrabold text-[#fff6df] disabled:opacity-40"><Download className="h-4 w-4" /> Dictamen</button>
        <button type="button" onClick={() => void evaluar()} disabled={evaluando} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#ffd700] py-3 text-xs font-extrabold text-[#131313] disabled:opacity-50">{evaluando ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}{evaluando ? 'Evaluando…' : 'Evaluar'}</button>
      </div>
    </div>
  );
};

interface InfoCardProps { titulo: string; icono: React.ComponentType<{ className?: string }>; className?: string; children: React.ReactNode; }
const InfoCard: React.FC<InfoCardProps> = ({ titulo, icono: Icono, className = '', children }) => <section className={`rounded-lg border border-[#4d4732] bg-[#1f1f1f] p-6 ${className}`}><div className="flex items-center gap-3 border-b border-[#4d4732] pb-4"><Icono className="h-5 w-5 text-[#ffd700]" /><h2 className="font-bold text-[#fff6df]">{titulo}</h2></div><div className="mt-5 space-y-4">{children}</div></section>;

const Dato: React.FC<{ etiqueta: string; valor: string; destacado?: boolean }> = ({ etiqueta, valor, destacado }) => <div><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#999077]">{etiqueta}</p><p className={`mt-1.5 text-sm font-bold ${destacado ? 'text-[#ffd700]' : 'text-[#e2e2e2]'}`}>{valor}</p></div>;

const Accordion: React.FC<{ titulo: string; icono: React.ComponentType<{ className?: string }>; children: React.ReactNode }> = ({ titulo, icono: Icono, children }) => <details className="group rounded-lg border border-[#4d4732] bg-[#1f1f1f]"><summary className="flex cursor-pointer list-none items-center gap-3 p-4 font-bold text-[#fff6df]"><Icono className="h-5 w-5 text-[#ffd700]" /><span className="flex-1">{titulo}</span><ChevronDown className="h-4 w-4 text-[#999077] transition group-open:rotate-180" /></summary><div className="space-y-4 border-t border-[#4d4732] p-4">{children}</div></details>;

const TimelineItem: React.FC<{ titulo: string; detalle: string; completado: boolean; ultimo?: boolean }> = ({ titulo, detalle, completado, ultimo }) => <div className="flex gap-3"><div className="flex flex-col items-center"><span className={`mt-1 h-3 w-3 rounded-full border-2 ${completado ? 'border-[#ffd700] bg-[#ffd700]' : 'border-[#77736a] bg-[#1f1f1f]'}`} />{!ultimo && <span className="h-14 w-px bg-[#4d4732]" />}</div><div><p className="text-sm font-bold text-[#e2e2e2]">{titulo}</p><p className="mt-1 text-xs text-[#999077]">{detalle}</p></div></div>;
