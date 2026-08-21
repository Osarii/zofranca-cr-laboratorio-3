import React from 'react';
import NumberFlow from '@number-flow/react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  FileSearch,
  FileText,
  Plus,
  TrendingUp,
} from 'lucide-react';
import type { AlertItem, EmpresaItem, SolicitudZF } from '../../types';

interface DashboardViewProps {
  solicitudes: SolicitudZF[];
  alerts: AlertItem[];
  empresas: EmpresaItem[];
  onNavigateTab: (tab: string) => void;
  onOpenNewSolicitud: () => void;
  onSelectAlert: (alert: AlertItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  solicitudes,
  alerts,
  empresas,
  onNavigateTab,
  onOpenNewSolicitud,
  onSelectAlert,
}) => {
  const pendientes = solicitudes.filter((item) => item.status === 'Pendiente' || item.status === 'En Evaluación').length;
  const criticas = alerts.filter((item) => item.severity === 'Alta' && item.status !== 'Resuelta' && item.status !== 'Resuelto');
  const recientes = [
    ...solicitudes.slice(0, 2).map((item) => ({
      id: `sol-${item.id}`,
      titulo: `Solicitud ${item.id} · ${item.companyName ?? item.company}`,
      detalle: item.zonaFranca ?? item.location,
      momento: item.submissionDate ?? item.date,
      estado: item.status,
      tipo: 'solicitud' as const,
    })),
    ...alerts.slice(0, 2).map((item) => ({
      id: `alert-${item.id}`,
      titulo: item.title,
      detalle: item.company,
      momento: item.date,
      estado: item.status,
      tipo: 'alerta' as const,
      alerta: item,
    })),
  ].slice(0, 3);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-extrabold tracking-[-.02em] text-[#fff6df] lg:hidden">Hola, Analista</h1>
        <p className="mt-1 text-sm text-[#d0c6ab] lg:hidden">Resumen de tu jornada de hoy.</p>

        <div className="mt-6 grid gap-6 lg:mt-0 lg:grid-cols-3">
          <article className="relative min-h-64 overflow-hidden rounded-lg border border-[#4d4732] border-t-4 border-t-[#ffd700] bg-[#2a2a2a] p-7 lg:min-h-[300px] lg:p-10">
            <BarChart3 className="absolute -bottom-8 -right-7 h-44 w-44 text-[#ffd700]/[.05]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#ffd700]">Panel operativo</p>
                <h2 className="mt-6 text-4xl font-extrabold leading-[1.06] tracking-[-.035em] text-[#fff6df] xl:text-5xl">Hola,<br />Analista</h2>
                <p className="mt-3 text-sm text-[#d0c6ab]">Resumen operativo del día.</p>
              </div>
              <p className="mt-8 text-xs font-semibold text-[#999077]">{empresas.length} empresas bajo supervisión</p>
            </div>
          </article>

          <MetricCard
            icono={FileText}
            etiqueta="Solicitudes pendientes"
            valor={pendientes}
            detalle="Requieren revisión de admisión"
            tendencia="Revisar bandeja"
            onClick={() => onNavigateTab('solicitudes')}
          />
          <MetricCard
            icono={AlertTriangle}
            etiqueta="Alertas críticas"
            valor={criticas.length}
            detalle="Acción regulatoria requerida"
            tendencia="Prioridad alta"
            critica
            onClick={() => onNavigateTab('alertas')}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-lg border border-[#4d4732] bg-[#1f1f1f] p-6">
          <h2 className="text-lg font-bold text-[#fff6df]">Accesos rápidos</h2>
          <div className="mt-5 space-y-3">
            <button type="button" onClick={onOpenNewSolicitud} className="flex w-full items-center justify-between rounded-lg bg-[#ffd700] px-4 py-4 text-left text-xs font-extrabold uppercase tracking-[.05em] text-[#131313] hover:bg-[#ffe16d]">
              <span className="flex items-center gap-3"><Plus className="h-5 w-5" /> Nueva solicitud</span><ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => onNavigateTab('alertas')} className="flex w-full items-center justify-between rounded-lg border border-[#4d4732] bg-[#131313] px-4 py-4 text-left text-xs font-extrabold uppercase tracking-[.05em] text-[#fff6df] hover:border-[#ffd700]">
              <span className="flex items-center gap-3"><Bell className="h-5 w-5 text-[#ffd700]" /> Ver alertas</span><ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => onNavigateTab('reportes')} className="flex w-full items-center justify-between rounded-lg border border-[#4d4732] bg-[#131313] px-4 py-4 text-left text-xs font-extrabold uppercase tracking-[.05em] text-[#fff6df] hover:border-[#ffd700]">
              <span className="flex items-center gap-3"><FileSearch className="h-5 w-5 text-[#ffd700]" /> Cumplimiento</span><ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>

        <article className="rounded-lg border border-[#4d4732] bg-[#1f1f1f] p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[#fff6df]">Actividad reciente</h2>
            <button type="button" onClick={() => onNavigateTab('solicitudes')} className="text-[11px] font-extrabold uppercase tracking-[.05em] text-[#ffd700] hover:underline">Ver todo</button>
          </div>
          <div className="mt-4 divide-y divide-[#4d4732]">
            {recientes.length ? recientes.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => item.tipo === 'alerta' && item.alerta ? onSelectAlert(item.alerta) : onNavigateTab('solicitudes')}
                className="flex w-full items-center gap-4 py-4 text-left hover:bg-[#2a2a2a]/50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#4d4732] bg-[#131313] text-[#d0c6ab]">
                  {item.tipo === 'alerta' ? <Bell className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[#e2e2e2]">{item.titulo}</span><span className="mt-1 block truncate text-xs text-[#999077]">{item.detalle}</span></span>
                <span className="hidden text-right sm:block"><span className="block text-[11px] font-bold text-[#d0c6ab]">{item.momento}</span><span className="mt-1 inline-block rounded bg-[#2a2a2a] px-2 py-1 text-[9px] font-extrabold uppercase text-[#ffd700]">{item.estado}</span></span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#999077]" />
              </button>
            )) : <div className="py-12 text-center text-sm text-[#999077]">La actividad aparecerá cuando existan solicitudes o alertas.</div>}
          </div>
        </article>
      </section>
    </div>
  );
};

interface MetricCardProps {
  icono: React.ComponentType<{ className?: string }>;
  etiqueta: string;
  valor: number;
  detalle: string;
  tendencia: string;
  critica?: boolean;
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ icono: Icono, etiqueta, valor, detalle, tendencia, critica, onClick }) => (
  <button type="button" onClick={onClick} className={`group min-h-56 rounded-lg border border-[#4d4732] border-t-4 bg-[#1f1f1f] p-7 text-left transition hover:bg-[#242424] lg:min-h-[300px] ${critica ? 'border-t-[#ffb4ab]' : 'border-t-[#ffd700]'}`}>
    <div className="flex items-start justify-between gap-4">
      <div><h2 className="text-lg font-bold text-[#e2e2e2]">{etiqueta}</h2><p className="mt-1 text-xs text-[#999077]">{detalle}</p></div>
      <Icono className={`h-7 w-7 ${critica ? 'text-[#ffb4ab]' : 'text-[#ffd700]'}`} />
    </div>
    <div className={`mt-12 text-6xl font-extrabold tabular-nums tracking-[-.04em] ${critica ? 'text-[#ffb4ab]' : 'text-[#fff6df]'}`}><NumberFlow value={valor} /></div>
    <div className={`mt-6 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.04em] ${critica ? 'text-[#ffb4ab]' : 'text-[#79f5ff]'}`}><TrendingUp className="h-4 w-4" /> {tendencia}</div>
  </button>
);
