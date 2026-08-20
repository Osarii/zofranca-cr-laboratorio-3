import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Activity,
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
  ShieldCheck,
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
  const reducirMovimiento = useReducedMotion();
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
  const datosEstados = useMemo(() => [
    { name: 'Pendientes', value: solicitudes.filter((item) => item.estado === 'pendiente').length, fill: '#B88958' },
    { name: 'Recomendadas', value: solicitudes.filter((item) => item.estado === 'Recomendada').length, fill: '#737B55' },
    { name: 'Revisar', value: solicitudes.filter((item) => item.estado === 'Revisar').length, fill: '#9A4D5D' },
    { name: 'Rechazadas', value: solicitudes.filter((item) => item.estado === 'Rechazada').length, fill: '#7C2D3E' },
  ], [solicitudes]);

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
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2B0D16] via-[#5A1F2D] to-[#7A3443] p-6 text-white shadow-2xl shadow-[#5A1F2D]/20 sm:p-8"
      >
        <motion.div aria-hidden className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#C98A78]/30 blur-3xl" animate={{ x: [0, -28, 0], y: [0, 24, 0], scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div aria-hidden className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#D7B58A]/20 blur-3xl" animate={{ x: [0, 35, 0], scale: [1.1, 0.9, 1.1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-sky-200">Persona A · Admisión inteligente</span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-bold text-emerald-200"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />Motor IA activo</span>
            </div>
            <h1 className="max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">Decisiones de instalación más claras y rápidas</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">Evaluá perfiles empresariales, detectá riesgos y visualizá la afinidad con cada zona franca desde un solo centro de control.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.97 }} type="button" onClick={onOpenNewModal} className="flex items-center gap-2 rounded-xl bg-[#9A4D5D] px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-sky-500/20 hover:bg-[#B76B78]"><Plus className="h-4 w-4" /> Nueva solicitud</motion.button>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => void onEvaluateAll()} disabled={procesando || pendientes === 0} className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-extrabold text-white backdrop-blur hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50">
                {procesando ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-300" />}
                {procesando ? 'Evaluando…' : `Evaluar pendientes (${pendientes})`}
              </motion.button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-wider text-sky-200">Pulso de admisión</p><p className="mt-1 text-sm font-extrabold text-white">Resumen en tiempo real</p></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/20 text-sky-200"><Activity className="h-5 w-5" /></span></div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-black/15 p-3"><p className="text-[10px] text-slate-300">Registradas</p><p className="mt-1 text-xl font-black text-white">{solicitudes.length}</p></div>
              <div className="rounded-xl bg-black/15 p-3"><p className="text-[10px] text-slate-300">Afinidad</p><p className="mt-1 text-xl font-black text-emerald-300">{promedio}%</p></div>
              <div className="rounded-xl bg-black/15 p-3"><p className="text-[10px] text-slate-300">Pendientes</p><p className="mt-1 text-xl font-black text-amber-300">{pendientes}</p></div>
            </div>
            <div className="mt-4 space-y-3">
              <div><div className="mb-1.5 flex justify-between text-[10px] text-slate-300"><span>Afinidad promedio</span><span>{promedio}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: `${promedio}%` }} transition={{ duration: 1.1, delay: 0.35 }} className="h-full rounded-full bg-gradient-to-r from-[#C98A78] to-[#D7B58A]" /></div></div>
              <div className="flex items-center gap-2 rounded-xl border border-emerald-300/15 bg-emerald-400/10 p-3 text-xs text-emerald-100"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" /><span>Clasificación automática y trazabilidad activas</span></div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { titulo: 'Total registradas', valor: solicitudes.length, Icono: Building2, color: 'text-[#9A4D5D]', fondo: 'bg-sky-50' },
          { titulo: 'Pendientes IA', valor: pendientes, Icono: Cpu, color: 'text-amber-600', fondo: 'bg-amber-50' },
          { titulo: 'Recomendadas', valor: recomendadas, Icono: Sparkles, color: 'text-emerald-600', fondo: 'bg-emerald-50' },
          { titulo: 'Afinidad promedio', valor: `${promedio}/100`, Icono: DollarSign, color: 'text-indigo-600', fondo: 'bg-indigo-50' },
        ].map(({ titulo, valor, Icono, color, fondo }, indice) => (
          <motion.div
            key={titulo}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: indice * 0.07 }}
            whileHover={{ y: -4, boxShadow: '0 14px 30px -15px rgba(90, 31, 45, 0.28)' }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5A52]">{titulo}</span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${fondo} ${color}`}><Icono className="h-4 w-4" /></span>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-[#5A1F2D]">{valor}</div>
          </motion.div>
        ))}
      </div>

      <motion.section initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_1.25fr]" aria-labelledby="grafica-estados-titulo">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9A4D5D]">Distribución en tiempo real</p>
          <h2 id="grafica-estados-titulo" className="mt-2 text-lg font-extrabold text-[#5A1F2D]">Estado de las solicitudes</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">La gráfica se anima al cargar y se actualiza automáticamente después de cada evaluación.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {datosEstados.map((dato) => <div key={dato.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dato.fill }} />{dato.name}</span><strong className="text-[#5A1F2D]">{dato.value}</strong></div>)}
          </div>
        </div>
        <div className="h-64" aria-label="Gráfica circular de solicitudes por estado">
          {solicitudes.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={datosEstados} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={92} paddingAngle={4} cornerRadius={6} isAnimationActive={!reducirMovimiento} animationDuration={900} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#E8DCCB', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex h-full items-center justify-center text-sm text-slate-400">La gráfica aparecerá al registrar solicitudes.</div>}
        </div>
      </motion.section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Filtros de solicitudes">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          <div className="relative md:col-span-2 xl:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar empresa, código, sector o zona…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs focus-turquoise" />
          </div>
          <select aria-label="Filtrar por estado" value={estado} onChange={(e) => setEstado(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#5A1F2D] focus-turquoise">
            <option value="todos">Todos los estados</option>
            {Object.values(ESTADOS_SOLICITUD).map((item) => <option key={item} value={item}>{rotulosEstado[item]}</option>)}
          </select>
          <select aria-label="Filtrar por zona" value={zona} onChange={(e) => setZona(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#5A1F2D] focus-turquoise">
            <option value="todas">Todas las zonas</option>
            {zonasFrancas.map((item) => <option key={item.id} value={String(item.id)}>{item.nombre}</option>)}
          </select>
          <select aria-label="Filtrar por sector" value={sector} onChange={(e) => setSector(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#5A1F2D] focus-turquoise">
            <option value="todos">Todos los sectores</option>
            {sectores.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label className="relative"><CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input aria-label="Fecha desde" title="Fecha desde" type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-2 text-xs focus-turquoise" /></label>
          <label className="relative"><CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input aria-label="Fecha hasta" title="Fecha hasta" type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-2 text-xs focus-turquoise" /></label>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{filtradas.length} de {solicitudes.length} solicitudes</span>
          <button type="button" onClick={limpiarFiltros} className="flex items-center gap-1.5 font-bold text-[#9A4D5D] hover:underline"><Filter className="h-3.5 w-3.5" /> Limpiar filtros</button>
        </div>
      </section>

      {error && (
        <div role="alert" className="flex flex-col items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center">
          <span><strong>No se pudieron cargar los datos.</strong> {error} Verifique que `npm run dev:api` esté activo.</span>
          <button type="button" onClick={() => void onRetry()} className="rounded-lg bg-rose-700 px-3 py-2 text-xs font-bold text-white">Reintentar</button>
        </div>
      )}

      {cargando ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white"><RefreshCw className="h-7 w-7 animate-spin text-[#9A4D5D]" /><span className="ml-3 text-sm font-semibold text-slate-600">Cargando solicitudes…</span></div>
      ) : filtradas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center"><Building2 className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-3 font-bold text-[#5A1F2D]">No hay resultados</h2><p className="mt-1 text-sm text-slate-500">Ajuste los filtros o registre una nueva solicitud.</p></div>
      ) : (
        <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtradas.map((solicitud, indice) => {
            const zonaActual = zonasPorId.get(String(solicitud.zonaFrancaId));
            return (
              <motion.button key={solicitud.id} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(indice * 0.04, 0.28) }} whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }} type="button" onClick={() => onSelectSolicitud(solicitud)} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:border-sky-200 hover:shadow-lg">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded bg-slate-100 px-2 py-1 font-mono text-[11px] font-bold text-slate-500">SOL-{solicitud.id}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${estilosEstado[solicitud.estado]}`}>{rotulosEstado[solicitud.estado]}</span>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-[#9A4D5D]"><Building2 className="h-5 w-5" /></span>
                    <div><h2 className="font-extrabold leading-tight text-[#5A1F2D]">{solicitud.empresa}</h2><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{zonaActual?.nombre ?? 'Zona no disponible'}</p></div>
                  </div>
                  <span className="mt-4 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">{solicitud.sector}</span>
                </div>
                <div className="space-y-2 border-y border-slate-100 bg-slate-50 px-5 py-4 text-xs">
                  <div className="flex justify-between"><span className="flex items-center gap-1.5 text-slate-500"><DollarSign className="h-3.5 w-3.5 text-[#9A4D5D]" />Inversión</span><strong className="text-slate-800">${solicitud.inversionProyectada.toLocaleString('en-US')}</strong></div>
                  <div className="flex justify-between"><span className="flex items-center gap-1.5 text-slate-500"><Users className="h-3.5 w-3.5 text-[#9A4D5D]" />Empleos</span><strong className="text-slate-800">{solicitud.empleosProyectados}</strong></div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-2"><span className="flex items-center gap-1.5 font-bold text-[#5A1F2D]"><Cpu className="h-3.5 w-3.5 text-indigo-500" />Afinidad IA</span><strong className={solicitud.estado === 'pendiente' ? 'text-amber-600' : 'text-indigo-600'}>{solicitud.estado === 'pendiente' ? 'Sin evaluar' : `${solicitud.puntaje}/100`}</strong></div>
                </div>
                <div className="flex items-center justify-between px-5 py-3 text-xs text-slate-500"><span>{new Intl.DateTimeFormat('es-CR').format(new Date(`${solicitud.fecha}T12:00:00`))}</span><span className="flex items-center gap-1 font-bold text-[#9A4D5D]">Ver detalle <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span></div>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
