import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Cpu,
  DollarSign,
  Filter,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Users,
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

const estilosEstado: Record<EstadoSolicitud, string> = {
  pendiente: 'bg-amber-100 text-amber-800',
  Recomendada: 'bg-emerald-100 text-emerald-800',
  Revisar: 'bg-sky-100 text-sky-800',
  Rechazada: 'bg-rose-100 text-rose-800',
};

const rotulosEstado: Record<EstadoSolicitud, string> = {
  pendiente: 'Pendiente',
  Recomendada: 'Recomendada',
  Revisar: 'Revisar',
  Rechazada: 'Rechazada',
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
  const [estado, setEstado] = useState('todos');
  const [zona, setZona] = useState('todas');
  const [sector, setSector] = useState('todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const zonasPorId = useMemo(
    () => new Map(zonasFrancas.map((item) => [String(item.id), item])),
    [zonasFrancas],
  );
  const sectores = useMemo(
    () => Array.from(new Set(solicitudes.map((item) => item.sector))).sort(),
    [solicitudes],
  );

  const filtradas = useMemo(() => solicitudes.filter((solicitud) => {
    const zonaActual = zonasPorId.get(String(solicitud.zonaFrancaId));
    const texto = `${solicitud.id} ${solicitud.empresa} ${solicitud.sector} ${zonaActual?.nombre ?? ''}`.toLowerCase();
    return texto.includes(busqueda.trim().toLowerCase())
      && (estado === 'todos' || solicitud.estado === estado)
      && (zona === 'todas' || String(solicitud.zonaFrancaId) === zona)
      && (sector === 'todos' || solicitud.sector === sector)
      && (!fechaDesde || solicitud.fecha >= fechaDesde)
      && (!fechaHasta || solicitud.fecha <= fechaHasta);
  }), [busqueda, estado, fechaDesde, fechaHasta, sector, solicitudes, zona, zonasPorId]);

  const pendientes = solicitudes.filter((item) => item.estado === ESTADOS_SOLICITUD.PENDIENTE).length;
  const recomendadas = solicitudes.filter((item) => item.estado === ESTADOS_SOLICITUD.RECOMENDADA).length;
  const evaluadas = solicitudes.filter((item) => item.estado !== ESTADOS_SOLICITUD.PENDIENTE);
  const promedio = evaluadas.length
    ? Math.round(evaluadas.reduce((total, item) => total + item.puntaje, 0) / evaluadas.length)
    : 0;

  const limpiarFiltros = () => {
    setBusqueda('');
    setEstado('todos');
    setZona('todas');
    setSector('todos');
    setFechaDesde('');
    setFechaHasta('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#2D9CDB]">Persona A · Admisión</p>
          <h1 className="text-[28px] font-extrabold tracking-tight text-[#0B2B4A]">Solicitudes de instalación</h1>
          <p className="mt-1 text-sm text-[#4A5568]">Consulta, filtra y evalúa perfiles empresariales contra los criterios de cada zona.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void onEvaluateAll()} disabled={procesando || pendientes === 0} className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50">
            {procesando ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {procesando ? 'Evaluando en paralelo…' : `Evaluar pendientes (${pendientes})`}
          </button>
          <button type="button" onClick={onOpenNewModal} className="flex items-center gap-2 rounded-xl bg-[#2D9CDB] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#2387be]">
            <Plus className="h-4 w-4" /> Nueva solicitud
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
  {
    titulo: 'Total registradas',
    valor: solicitudes.length,
    Icono: Building2,
    color: 'text-[#2D9CDB]',
    fondo: 'bg-sky-50',
  },
  {
    titulo: 'Pendientes IA',
    valor: pendientes,
    Icono: Cpu,
    color: 'text-amber-600',
    fondo: 'bg-amber-50',
  },
  {
    titulo: 'Recomendadas',
    valor: recomendadas,
    Icono: Sparkles,
    color: 'text-emerald-600',
    fondo: 'bg-emerald-50',
  },
  {
    titulo: 'Afinidad promedio',
    valor: `${promedio}/100`,
    Icono: DollarSign,
    color: 'text-indigo-600',
    fondo: 'bg-indigo-50',
  },
].map(({ titulo, valor, Icono, color, fondo }) => (
  <div
    key={titulo}
    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
  >
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">
        {titulo}
      </span>

      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${fondo} ${color}`}
      >
        <Icono className="h-4 w-4" />
      </span>
    </div>

    <div className="mt-3 text-3xl font-extrabold text-[#0B2B4A]">
      {valor}
    </div>
  </div>
))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Filtros de solicitudes">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          <div className="relative md:col-span-2 xl:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar empresa, código, sector o zona…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs focus-turquoise" />
          </div>
          <select aria-label="Filtrar por estado" value={estado} onChange={(e) => setEstado(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#0B2B4A] focus-turquoise">
            <option value="todos">Todos los estados</option>
            {Object.values(ESTADOS_SOLICITUD).map((item) => <option key={item} value={item}>{rotulosEstado[item]}</option>)}
          </select>
          <select aria-label="Filtrar por zona" value={zona} onChange={(e) => setZona(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#0B2B4A] focus-turquoise">
            <option value="todas">Todas las zonas</option>
            {zonasFrancas.map((item) => <option key={item.id} value={String(item.id)}>{item.nombre}</option>)}
          </select>
          <select aria-label="Filtrar por sector" value={sector} onChange={(e) => setSector(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#0B2B4A] focus-turquoise">
            <option value="todos">Todos los sectores</option>
            {sectores.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label className="relative"><CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input aria-label="Fecha desde" title="Fecha desde" type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-2 text-xs focus-turquoise" /></label>
          <label className="relative"><CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input aria-label="Fecha hasta" title="Fecha hasta" type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-2 text-xs focus-turquoise" /></label>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{filtradas.length} de {solicitudes.length} solicitudes</span>
          <button type="button" onClick={limpiarFiltros} className="flex items-center gap-1.5 font-bold text-[#2D9CDB] hover:underline"><Filter className="h-3.5 w-3.5" /> Limpiar filtros</button>
        </div>
      </section>

      {error && (
        <div role="alert" className="flex flex-col items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center">
          <span><strong>No se pudieron cargar los datos.</strong> {error} Verifique que `npm run dev:api` esté activo.</span>
          <button type="button" onClick={() => void onRetry()} className="rounded-lg bg-rose-700 px-3 py-2 text-xs font-bold text-white">Reintentar</button>
        </div>
      )}

      {cargando ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white"><RefreshCw className="h-7 w-7 animate-spin text-[#2D9CDB]" /><span className="ml-3 text-sm font-semibold text-slate-600">Cargando solicitudes…</span></div>
      ) : filtradas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center"><Building2 className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-3 font-bold text-[#0B2B4A]">No hay resultados</h2><p className="mt-1 text-sm text-slate-500">Ajuste los filtros o registre una nueva solicitud.</p></div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtradas.map((solicitud) => {
            const zonaActual = zonasPorId.get(String(solicitud.zonaFrancaId));
            return (
              <button key={solicitud.id} type="button" onClick={() => onSelectSolicitud(solicitud)} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lg">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded bg-slate-100 px-2 py-1 font-mono text-[11px] font-bold text-slate-500">SOL-{solicitud.id}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${estilosEstado[solicitud.estado]}`}>{rotulosEstado[solicitud.estado]}</span>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-[#2D9CDB]"><Building2 className="h-5 w-5" /></span>
                    <div><h2 className="font-extrabold leading-tight text-[#0B2B4A]">{solicitud.empresa}</h2><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{zonaActual?.nombre ?? 'Zona no disponible'}</p></div>
                  </div>
                  <span className="mt-4 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">{solicitud.sector}</span>
                </div>
                <div className="space-y-2 border-y border-slate-100 bg-slate-50 px-5 py-4 text-xs">
                  <div className="flex justify-between"><span className="flex items-center gap-1.5 text-slate-500"><DollarSign className="h-3.5 w-3.5 text-[#2D9CDB]" />Inversión</span><strong className="text-slate-800">${solicitud.inversionProyectada.toLocaleString('en-US')}</strong></div>
                  <div className="flex justify-between"><span className="flex items-center gap-1.5 text-slate-500"><Users className="h-3.5 w-3.5 text-[#2D9CDB]" />Empleos</span><strong className="text-slate-800">{solicitud.empleosProyectados}</strong></div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-2"><span className="flex items-center gap-1.5 font-bold text-[#0B2B4A]"><Cpu className="h-3.5 w-3.5 text-indigo-500" />Afinidad IA</span><strong className={solicitud.estado === 'pendiente' ? 'text-amber-600' : 'text-indigo-600'}>{solicitud.estado === 'pendiente' ? 'Sin evaluar' : `${solicitud.puntaje}/100`}</strong></div>
                </div>
                <div className="flex items-center justify-between px-5 py-3 text-xs text-slate-500"><span>{new Intl.DateTimeFormat('es-CR').format(new Date(`${solicitud.fecha}T12:00:00`))}</span><span className="flex items-center gap-1 font-bold text-[#2D9CDB]">Ver detalle <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span></div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};