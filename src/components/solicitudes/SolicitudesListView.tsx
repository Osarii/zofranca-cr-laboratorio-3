import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Download,
  Eye,
  Filter,
  History,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import type { EstadoSolicitud, SolicitudApi, ZonaFranca } from '../../contrato';
import { ESTADOS_SOLICITUD } from '../../shared/estados';

interface SolicitudesListViewProps {
  solicitudes: SolicitudApi[];
  zonasFrancas: ZonaFranca[];
  cargando: boolean;
  procesando: boolean;
  error: string;
  onSelectSolicitud: (solicitud: SolicitudApi) => void;
  onOpenNewModal: () => void;
  onEvaluateAll: () => Promise<void>;
  onRetry: () => Promise<void>;
}

const rotulosEstado: Record<EstadoSolicitud, string> = {
  pendiente: 'Pendiente',
  Recomendada: 'Aprobada',
  Revisar: 'En proceso',
  Rechazada: 'Rechazada',
};

const estilosEstado: Record<EstadoSolicitud, string> = {
  pendiente: 'border-[#ffd700] bg-[#ffd700] text-[#131313]',
  Recomendada: 'border-[#77736a] bg-[#353535] text-[#e2e2e2]',
  Revisar: 'border-[#00dbe8] bg-[#073237] text-[#79f5ff]',
  Rechazada: 'border-[#983640] bg-[#3b1519] text-[#ffb4ab]',
};

export const SolicitudesListView: React.FC<SolicitudesListViewProps> = ({
  solicitudes,
  zonasFrancas,
  cargando,
  procesando,
  error,
  onSelectSolicitud,
  onOpenNewModal,
  onEvaluateAll,
  onRetry,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState<'todos' | EstadoSolicitud>('todos');
  const [zona, setZona] = useState('todas');
  const [filtrosMoviles, setFiltrosMoviles] = useState(false);
  const zonasPorId = useMemo(() => new Map(zonasFrancas.map((item) => [String(item.id), item])), [zonasFrancas]);

  const filtradas = useMemo(() => solicitudes.filter((solicitud) => {
    const nombreZona = zonasPorId.get(String(solicitud.zonaFrancaId))?.nombre ?? '';
    const texto = `${solicitud.id} ${solicitud.empresa} ${solicitud.sector} ${nombreZona}`.toLowerCase();
    return texto.includes(busqueda.trim().toLowerCase())
      && (estado === 'todos' || solicitud.estado === estado)
      && (zona === 'todas' || String(solicitud.zonaFrancaId) === zona);
  }), [busqueda, estado, solicitudes, zona, zonasPorId]);

  const pendientes = solicitudes.filter((item) => item.estado === ESTADOS_SOLICITUD.PENDIENTE).length;
  const fecha = (valor: string) => new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${valor}T12:00:00`));

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#ffd700]">Admisión al régimen</p>
          <h1 className="text-3xl font-extrabold tracking-[-.025em] text-[#fff6df] sm:text-4xl lg:text-5xl">Gestión de Solicitudes</h1>
          <p className="mt-2 text-sm text-[#d0c6ab] sm:text-base">Administre y supervise los trámites de ingreso al régimen.</p>
        </div>
        <button type="button" onClick={onOpenNewModal} className="hidden items-center gap-2 rounded-lg bg-[#ffd700] px-5 py-3 text-xs font-extrabold uppercase tracking-[.04em] text-[#131313] hover:bg-[#ffe16d] sm:flex"><Plus className="h-4 w-4" /> Nueva solicitud</button>
      </header>

      <section className="rounded-lg border border-[#4d4732] border-t-2 border-t-[#ffd700] bg-[#1f1f1f] p-4" aria-label="Filtros de solicitudes">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex gap-2">
              <label className="relative min-w-0 flex-1 lg:w-72 lg:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999077]" />
                <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} className="focus-turquoise w-full rounded-lg border border-[#4d4732] bg-[#2a2a2a] py-2.5 pl-10 pr-3 text-sm" placeholder="Buscar solicitud, ID o empresa..." />
              </label>
              <button type="button" onClick={() => setFiltrosMoviles((actual) => !actual)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#4d4732] bg-[#2a2a2a] text-[#ffd700] lg:hidden" aria-label="Mostrar filtros"><Filter className="h-4 w-4" /></button>
            </div>

            <div className={`${filtrosMoviles ? 'flex' : 'hidden'} flex-wrap gap-2 lg:flex`}>
              {([
                ['todos', 'Todas'],
                ['pendiente', 'Pendientes'],
                ['Revisar', 'En proceso'],
                ['Recomendada', 'Aprobadas'],
              ] as const).map(([id, etiqueta]) => (
                <button type="button" key={id} onClick={() => setEstado(id)} className={`rounded-full border px-3 py-2 text-[11px] font-extrabold transition ${estado === id ? 'border-[#ffd700] bg-[#282500] text-[#ffd700]' : 'border-[#4d4732] bg-[#131313] text-[#d0c6ab] hover:border-[#999077]'}`}>
                  {etiqueta}
                </button>
              ))}
              <select aria-label="Filtrar por zona" value={zona} onChange={(event) => setZona(event.target.value)} className="rounded-full border border-[#4d4732] bg-[#131313] px-3 py-2 text-[11px] font-bold text-[#d0c6ab] focus:border-[#ffd700]">
                <option value="todas">Todas las zonas</option>
                {zonasFrancas.map((item) => <option key={item.id} value={String(item.id)}>{item.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => void onEvaluateAll()} disabled={procesando || pendientes === 0} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#4d4732] bg-[#131313] px-4 py-2.5 text-[11px] font-extrabold text-[#fff6df] hover:border-[#ffd700] disabled:opacity-45 xl:flex-none">
              {procesando ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[#ffd700]" />} {procesando ? 'Evaluando…' : `Evaluar (${pendientes})`}
            </button>
            <button type="button" onClick={() => window.print()} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#ffd700] bg-[#131313] px-4 py-2.5 text-[11px] font-extrabold text-[#ffd700] hover:bg-[#282500] xl:flex-none"><Download className="h-4 w-4" /> Exportar</button>
          </div>
        </div>
      </section>

      {error && <div role="alert" className="flex flex-col items-start justify-between gap-3 rounded-lg border border-[#983640] bg-[#270f12] p-4 text-sm text-[#ffb4ab] sm:flex-row sm:items-center"><span><strong>No se pudieron cargar los datos.</strong> {error}</span><button type="button" onClick={() => void onRetry()} className="rounded-lg bg-[#93000a] px-3 py-2 text-xs font-bold text-[#ffdad6]">Reintentar</button></div>}

      {cargando ? (
        <div className="flex min-h-64 items-center justify-center rounded-lg border border-[#4d4732] bg-[#1f1f1f]"><RefreshCw className="h-6 w-6 animate-spin text-[#ffd700]" /><span className="ml-3 text-sm font-semibold text-[#d0c6ab]">Cargando solicitudes…</span></div>
      ) : filtradas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#4d4732] bg-[#1f1f1f] py-16 text-center"><h2 className="font-bold text-[#fff6df]">No hay resultados</h2><p className="mt-1 text-sm text-[#999077]">Ajuste los filtros o registre una nueva solicitud.</p></div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-lg border border-[#4d4732] bg-[#1f1f1f] md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                <thead className="border-b border-[#4d4732] bg-[#2a2a2a] text-[10px] font-extrabold uppercase tracking-[.1em] text-[#d0c6ab]">
                  <tr><th className="px-5 py-4">ID Solicitud</th><th className="px-5 py-4">Empresa</th><th className="px-5 py-4">Tipo de inversión</th><th className="px-5 py-4">Fecha de ingreso</th><th className="px-5 py-4">Estado</th><th className="px-5 py-4 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-[#4d4732]/70">
                  {filtradas.map((solicitud) => (
                    <tr key={solicitud.id} className="group text-[#e2e2e2] hover:bg-[#2a2a2a]/60">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-[#ffd700]">REQ-{solicitud.id}</td>
                      <td className="px-5 py-4 font-bold text-[#fff6df]">{solicitud.empresa}</td>
                      <td className="px-5 py-4 text-[#d0c6ab]">{solicitud.sector}</td>
                      <td className="px-5 py-4 text-[#d0c6ab]">{fecha(solicitud.fecha)}</td>
                      <td className="px-5 py-4"><span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase ${estilosEstado[solicitud.estado]}`}>{rotulosEstado[solicitud.estado]}</span></td>
                      <td className="px-5 py-4"><div className="flex justify-end gap-1"><button type="button" onClick={() => onSelectSolicitud(solicitud)} className="rounded-md p-2 text-[#d0c6ab] hover:bg-[#353535] hover:text-[#ffd700]" title="Ver detalle"><Eye className="h-4 w-4" /></button><button type="button" onClick={() => onSelectSolicitud(solicitud)} className="rounded-md p-2 text-[#d0c6ab] hover:bg-[#353535] hover:text-[#ffd700]" title="Historial"><History className="h-4 w-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-[#4d4732] bg-[#2a2a2a] px-5 py-4 text-xs text-[#999077]"><span>Mostrando <strong className="text-[#e2e2e2]">{filtradas.length}</strong> de <strong className="text-[#e2e2e2]">{solicitudes.length}</strong> registros</span><span className="rounded bg-[#ffd700] px-3 py-1.5 font-extrabold text-[#131313]">1</span></div>
          </div>

          <div className="space-y-4 md:hidden">
            {filtradas.map((solicitud) => (
              <button type="button" key={solicitud.id} onClick={() => onSelectSolicitud(solicitud)} className={`block w-full rounded-lg border border-[#4d4732] bg-[#1f1f1f] p-5 text-left ${solicitud.estado === 'pendiente' ? 'border-t-4 border-t-[#ffd700]' : ''}`}>
                <div className="flex items-start justify-between gap-3"><span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#d0c6ab]">REQ-{solicitud.id}</span><span className={`rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase ${estilosEstado[solicitud.estado]}`}>{rotulosEstado[solicitud.estado]}</span></div>
                <h2 className="mt-4 text-lg font-bold text-[#fff6df]">{solicitud.empresa}</h2>
                <p className="mt-1 text-sm leading-relaxed text-[#d0c6ab]">{solicitud.sector} · {zonasPorId.get(String(solicitud.zonaFrancaId))?.nombre ?? 'Zona por confirmar'}</p>
                <div className="mt-5 flex items-center justify-between border-t border-[#4d4732] pt-4"><span className="flex items-center gap-2 text-xs text-[#999077]"><CalendarDays className="h-4 w-4" />{fecha(solicitud.fecha)}</span><span className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#ffd700]">Ver detalle <ArrowRight className="h-4 w-4" /></span></div>
              </button>
            ))}
            <button type="button" className="w-full rounded-lg border border-[#4d4732] py-3 text-[11px] font-extrabold uppercase text-[#d0c6ab]">Cargar más</button>
          </div>
        </>
      )}

      <button type="button" onClick={onOpenNewModal} className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#ffd700] text-[#131313] md:hidden" aria-label="Nueva solicitud"><Plus className="h-6 w-6" /></button>
    </div>
  );
};
