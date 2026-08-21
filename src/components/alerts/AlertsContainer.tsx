import React, { useMemo, useState } from 'react';
import NumberFlow from '@number-flow/react';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  ChevronRight,
  Download,
  Search,
  ShieldCheck,
} from 'lucide-react';
import type { AlertItem, Severity } from '../../types';
import { AlertDetailModal } from './AlertDetailModal';

interface AlertsContainerProps {
  alerts: AlertItem[];
  onUpdateStatus: (alertId: string, status: AlertItem['status']) => void;
  onAssignAlert?: (alertId: string, user: string) => void;
  currentUser: string;
}

const estilosSeveridad: Record<Severity, { texto: string; borde: string; fondo: string; icono: React.ElementType }> = {
  Alta: { texto: 'text-[#ffb4ab]', borde: 'border-l-[#ffb4ab]', fondo: 'bg-[#270f12]', icono: AlertCircle },
  Media: { texto: 'text-[#ffd700]', borde: 'border-l-[#ffd700]', fondo: 'bg-[#241f00]', icono: AlertTriangle },
  Baja: { texto: 'text-[#c8c6c5]', borde: 'border-l-[#77736a]', fondo: 'bg-[#1f1f1f]', icono: ShieldCheck },
};

export const AlertsContainer: React.FC<AlertsContainerProps> = ({ alerts, onUpdateStatus, onAssignAlert, currentUser }) => {
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [severidad, setSeveridad] = useState<'Todas' | Severity>('Todas');
  const [busqueda, setBusqueda] = useState('');
  const activas = alerts.filter((item) => item.status !== 'Resuelta' && item.status !== 'Resuelto');
  const filtradas = useMemo(() => activas.filter((item) => {
    const coincideTexto = `${item.id} ${item.company} ${item.title} ${item.category ?? ''}`.toLowerCase().includes(busqueda.trim().toLowerCase());
    return coincideTexto && (severidad === 'Todas' || item.severity === severidad);
  }), [activas, busqueda, severidad]);

  const gestionar = (alerta: AlertItem) => {
    if (!alerta.assignedTo && onAssignAlert) onAssignAlert(alerta.id, currentUser);
    setSelectedAlert(alerta);
  };

  return (
    <div className="industrial-grid -mx-4 -my-8 min-h-[calc(100vh-6rem)] px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 xl:-mx-12 xl:px-12">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#ffd700]">Monitoreo regulatorio</p>
            <h1 className="text-3xl font-extrabold tracking-[-.03em] text-[#fff6df] sm:text-4xl lg:text-5xl">Alertas de Cumplimiento</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#d0c6ab] sm:text-base">Monitor de incidencias operativas y regulatorias en tiempo real. Las alertas críticas requieren atención inmediata.</p>
          </div>
          <button type="button" onClick={() => window.print()} className="hidden items-center gap-2 rounded-lg border border-[#ffd700] bg-[#131313] px-5 py-3 text-xs font-extrabold uppercase text-[#ffd700] hover:bg-[#282500] sm:flex"><Download className="h-4 w-4" /> Exportar CSV</button>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Resumen etiqueta="Total activas" valor={activas.length} color="border-l-[#fff6df]" />
          <Resumen etiqueta="Críticas" valor={activas.filter((item) => item.severity === 'Alta').length} color="border-l-[#ffb4ab]" valorClase="text-[#ffb4ab]" />
          <Resumen etiqueta="Medias" valor={activas.filter((item) => item.severity === 'Media').length} color="border-l-[#ffd700]" valorClase="text-[#ffd700]" />
          <Resumen etiqueta="Bajas" valor={activas.filter((item) => item.severity === 'Baja').length} color="border-l-[#77736a]" />
        </section>

        <section className="rounded-lg border border-[#4d4732] bg-[#1f1f1f] p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="navigation-scroll flex gap-2 overflow-x-auto">
              {(['Todas', 'Alta', 'Media', 'Baja'] as const).map((item) => {
                const cantidad = item === 'Todas' ? activas.length : activas.filter((alerta) => alerta.severity === item).length;
                return <button type="button" key={item} onClick={() => setSeveridad(item)} className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-extrabold ${severidad === item ? 'border-[#ffd700] bg-[#ffd700] text-[#131313]' : 'border-[#4d4732] bg-[#131313] text-[#d0c6ab] hover:border-[#999077]'}`}>{item === 'Todas' ? 'Todas' : item === 'Alta' ? 'Críticas' : item === 'Media' ? 'Medias' : 'Bajas'} ({cantidad})</button>;
              })}
            </div>
            <label className="relative block lg:w-80"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999077]" /><input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} className="focus-turquoise w-full rounded-lg border border-[#4d4732] bg-[#131313] py-2.5 pl-10 pr-3 text-sm" placeholder="Filtrar por empresa o tipo..." /></label>
          </div>
        </section>

        <div className="hidden overflow-hidden rounded-lg border border-[#4d4732] bg-[#1f1f1f] md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="border-b border-[#4d4732] bg-[#0e0e0e] text-[10px] font-extrabold uppercase tracking-[.1em] text-[#d0c6ab]"><tr><th className="px-5 py-4">Severidad</th><th className="px-5 py-4">Empresa</th><th className="px-5 py-4">Tipo de alerta</th><th className="px-5 py-4">Fecha</th><th className="px-5 py-4">Estado</th><th className="px-5 py-4 text-right">Acción</th></tr></thead>
              <tbody className="divide-y divide-[#4d4732]/70">
                {filtradas.map((alerta) => {
                  const estilo = estilosSeveridad[alerta.severity];
                  const Icono = estilo.icono;
                  return <tr key={alerta.id} className={`border-l-4 ${estilo.borde} hover:bg-[#2a2a2a]/60`}><td className="px-5 py-4"><span className={`flex items-center gap-2 text-xs font-extrabold ${estilo.texto}`}><Icono className="h-4 w-4" />{alerta.severity}</span></td><td className="px-5 py-4 font-bold text-[#fff6df]">{alerta.company}</td><td className="max-w-sm px-5 py-4"><p className="truncate font-semibold text-[#e2e2e2]">{alerta.tipoIncumplimiento ?? alerta.title}</p><p className="mt-1 truncate text-xs text-[#999077]">{alerta.category ?? 'Cumplimiento'}</p></td><td className="px-5 py-4 font-mono text-xs text-[#d0c6ab]">{alerta.date}</td><td className="px-5 py-4"><span className="rounded border border-[#4d4732] bg-[#2a2a2a] px-2.5 py-1 text-[9px] font-extrabold uppercase text-[#d0c6ab]">{alerta.status}</span></td><td className="px-5 py-4 text-right"><button type="button" onClick={() => gestionar(alerta)} className="rounded-lg border border-[#ffd700] px-3 py-2 text-[10px] font-extrabold uppercase text-[#ffd700] hover:bg-[#ffd700] hover:text-[#131313]">Gestionar</button></td></tr>;
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[#4d4732] bg-[#2a2a2a] px-5 py-4 text-xs text-[#999077]"><span>Mostrando {filtradas.length} de {activas.length} alertas</span><span className="rounded bg-[#ffd700] px-3 py-1.5 font-extrabold text-[#131313]">1</span></div>
        </div>

        <div className="space-y-4 md:hidden">
          {filtradas.map((alerta) => {
            const estilo = estilosSeveridad[alerta.severity];
            const Icono = estilo.icono;
            return <button type="button" key={alerta.id} onClick={() => gestionar(alerta)} className={`flex w-full gap-4 rounded-lg border border-[#4d4732] border-l-4 bg-[#1f1f1f] p-5 text-left ${estilo.borde}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${estilo.fondo} ${estilo.texto}`}><Icono className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-3"><span className="truncate font-bold text-[#fff6df]">{alerta.company}</span><span className="shrink-0 text-[10px] text-[#999077]">{alerta.date}</span></span><span className="mt-2 block text-sm leading-relaxed text-[#d0c6ab]">{alerta.tipoIncumplimiento ?? alerta.title}</span><span className={`mt-3 inline-block text-[10px] font-extrabold uppercase ${estilo.texto}`}>{alerta.severity} · {alerta.status}</span></span><ChevronRight className="mt-2 h-4 w-4 shrink-0 text-[#999077]" /></button>;
          })}
        </div>

        {filtradas.length === 0 && <div className="rounded-lg border border-dashed border-[#4d4732] bg-[#1f1f1f] py-14 text-center"><Bell className="mx-auto h-8 w-8 text-[#999077]" /><p className="mt-3 text-sm font-bold text-[#fff6df]">No hay alertas para este filtro</p></div>}
      </div>

      {selectedAlert && <AlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} onStatusChange={onUpdateStatus} currentUser={currentUser} />}
    </div>
  );
};

const Resumen: React.FC<{ etiqueta: string; valor: number; color: string; valorClase?: string }> = ({ etiqueta, valor, color, valorClase = 'text-[#fff6df]' }) => <article className={`rounded-lg border border-[#4d4732] border-l-4 bg-[#1f1f1f] p-4 sm:p-5 ${color}`}><p className="text-[9px] font-extrabold uppercase tracking-[.12em] text-[#999077] sm:text-[10px]">{etiqueta}</p><p className={`mt-3 text-3xl font-extrabold tabular-nums tracking-[-.03em] ${valorClase}`}><NumberFlow value={valor} /></p></article>;
