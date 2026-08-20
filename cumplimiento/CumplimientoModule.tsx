import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle, BarChart3, Bell, Building2, CheckCircle2, Clock3,
  DollarSign, FileCheck2, History, LoaderCircle, Send, Users
} from 'lucide-react';
import {
  evaluarReportesParalelo, obtenerEmpresas, obtenerEmpresa, obtenerReportesEmpresa,
  obtenerSolicitud, obtenerSolicitudes, guardarReporte,
  type AlertaCumplimiento, type ResultadoComparacion
} from './servicios';
import type { Empresa, ReporteCumplimiento, Solicitud } from '../shared/types';
import { useFeedback } from '../src/shared/feedback/FeedbackProvider';

type Vista = 'reporte' | 'alertas' | 'historial' | 'resumen';

interface ResumenCumplimiento {
  totalReportes: number;
  cumplidos: number;
  incumplidos: number;
  porcentajeCumplimiento: number;
  totalSolicitudes: number;
  porcentajeRecomendadas: number;
  tiempoPromedio: number;
}

const moneda = (valor: number) =>
  `₡${valor.toLocaleString('es-CR', { maximumFractionDigits: 0 })}`;

export function CumplimientoModule() {
  const { notificar } = useFeedback();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [empresaId, setEmpresaId] = useState<number | ''>('');
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [reportes, setReportes] = useState<ReporteCumplimiento[]>([]);
  const [resultados, setResultados] = useState<ResultadoComparacion[]>([]);
  const [todosLosResultados, setTodosLosResultados] = useState<ResultadoComparacion[]>([]);
  const [vista, setVista] = useState<Vista>('reporte');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState({
    empleosReales: '',
    inversionEjecutada: '',
    exportaciones: '',
    fecha: new Date().toISOString().slice(0, 10),
  });

  const cargarTodo = async () => {
    try {
      setCargando(true);
      setError('');

      const [empresasData, solicitudesData] = await Promise.all([
        obtenerEmpresas(),
        obtenerSolicitudes(),
      ]);

      setEmpresas(empresasData);
      setSolicitudes(solicitudesData);

      const grupos = await Promise.all(
        empresasData.map(async (empresa) => {
          const reportesEmpresa = await obtenerReportesEmpresa(empresa.id);
          return reportesEmpresa;
        }),
      );
      const reportesTodos = grupos.flat();
      const evaluados = await evaluarReportesParalelo(reportesTodos);
      setTodosLosResultados(evaluados);

      if (!empresaId && empresasData[0]) {
        setEmpresaId(empresasData[0].id);
      }
    } catch (e) {
      console.error(e);
      setError('No pudimos cargar la información de cumplimiento.');
    } finally {
      setCargando(false);
    }
  };

  const cargarEmpresa = async (id: number) => {
    try {
      setCargando(true);
      setError('');
      const empresa = await obtenerEmpresa(id);
      const solicitudData = await obtenerSolicitud(empresa.solicitudId);
      const reportesData = await obtenerReportesEmpresa(id);
      const evaluados = await evaluarReportesParalelo(reportesData);

      setSolicitud(solicitudData);
      setReportes(reportesData);
      setResultados(evaluados);
    } catch (e) {
      console.error(e);
      setError('No pudimos cargar el historial de esta empresa.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { void cargarTodo(); }, []);
  useEffect(() => {
    if (typeof empresaId === 'number') void cargarEmpresa(empresaId);
  }, [empresaId]);

  const alertas = useMemo<AlertaCumplimiento[]>(
    () => todosLosResultados.flatMap((resultado) => resultado.alertas),
    [todosLosResultados],
  );

  const resumen = useMemo(() => {
    const totalReportes = todosLosResultados.length;
    const cumplidos = todosLosResultados.filter((r) => r.cumple).length;
    const recomendadas = solicitudes.filter((s) => s.estado === 'Recomendada').length;
    const empresasConSolicitud = empresas
      .map((e) => solicitudes.find((s) => s.id === e.solicitudId))
      .filter(Boolean) as Solicitud[];

    const tiempos = empresasConSolicitud
      .map((s) => {
        const empresa = empresas.find((e) => e.solicitudId === s.id);
        if (!empresa) return null;
        const dias = (new Date(empresa.fechaInstalacion).getTime() - new Date(s.fecha).getTime()) / 86400000;
        return dias >= 0 ? dias : null;
      })
      .filter((v): v is number => v !== null);

    return {
      totalReportes,
      cumplidos,
      incumplidos: totalReportes - cumplidos,
      porcentajeCumplimiento: totalReportes ? Math.round((cumplidos / totalReportes) * 100) : 0,
      totalSolicitudes: solicitudes.length,
      porcentajeRecomendadas: solicitudes.length ? Math.round((recomendadas / solicitudes.length) * 100) : 0,
      tiempoPromedio: tiempos.length ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length) : 0,
    };
  }, [todosLosResultados, solicitudes, empresas]);

  const registrarReporte = async (event: React.FormEvent) => {
    event.preventDefault();
    if (typeof empresaId !== 'number' || !solicitud) return;

    try {
      setEnviando(true);
      setError('');
      setMensaje('');

      const datos = {
        empresaId,
        empleosReales: Number(form.empleosReales),
        inversionEjecutada: Number(form.inversionEjecutada),
        exportaciones: Number(form.exportaciones),
        fecha: form.fecha,
        cumple:
          Number(form.empleosReales) >= solicitud.empleosProyectados &&
          Number(form.inversionEjecutada) >= solicitud.inversionProyectada,
      };

      if ([datos.empleosReales, datos.inversionEjecutada, datos.exportaciones].some((n) => !Number.isFinite(n) || n < 0)) {
        throw new Error('Valores inválidos');
      }

      await guardarReporte(datos);
      setMensaje('Reporte registrado y evaluado correctamente.');
      notificar(
        datos.cumple ? 'exito' : 'advertencia',
        datos.cumple ? 'Reporte en cumplimiento' : 'Reporte con incumplimientos',
        datos.cumple ? 'Los compromisos de empleo e inversión fueron alcanzados.' : 'Se generaron alertas para revisar las brechas detectadas.',
      );
      setForm({
        empleosReales: '',
        inversionEjecutada: '',
        exportaciones: '',
        fecha: new Date().toISOString().slice(0, 10),
      });
      await cargarTodo();
      await cargarEmpresa(empresaId);
    } catch (e) {
      console.error(e);
      setError('No pudimos registrar el reporte. Revisá los datos e intentá de nuevo.');
      notificar('error', 'No se pudo registrar el reporte', 'Revisá los valores e intentá nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (cargando && empresas.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <LoaderCircle className="w-7 h-7 mx-auto animate-spin text-[#2D9CDB]" />
        <p className="mt-3 text-sm font-semibold text-[#0B2B4A]">Cargando cumplimiento...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#0B2B4A] tracking-tight">Cumplimiento y Fiscalización</h1>
          <p className="text-base text-[#4A5568] mt-1">
            Reportes periódicos, comparación contractual, alertas, historial y métricas del proceso.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {([
            ['reporte', 'Nuevo reporte', FileCheck2],
            ['alertas', `Alertas (${alertas.length})`, Bell],
            ['historial', 'Historial', History],
            ['resumen', 'Resumen PROCOMER', BarChart3],
          ] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setVista(id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                vista === id ? 'bg-[#0B2B4A] text-white border-[#0B2B4A]' : 'bg-white text-[#4A5568] border-slate-200 hover:bg-slate-50'
              }`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm">{error}</div>}
      {mensaje && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{mensaje}</div>}

      <AnimatePresence mode="wait" initial={false}>
      <motion.div key={vista} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
      {vista === 'reporte' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-6">
          <form onSubmit={registrarReporte} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#2D9CDB] flex items-center justify-center"><FileCheck2 className="w-5 h-5" /></div>
              <div>
                <h2 className="text-base font-extrabold text-[#0B2B4A]">Reporte periódico de cumplimiento</h2>
                <p className="text-xs text-[#4A5568]">RF-06 · Las metas se leen de la solicitud original.</p>
              </div>
            </div>

            <label className="block text-xs font-bold text-[#0B2B4A]">
              Empresa instalada
              <select value={empresaId} onChange={(e) => setEmpresaId(Number(e.target.value))}
                className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white font-medium text-sm focus-turquoise">
                {empresas.map((empresa) => <option key={empresa.id} value={empresa.id}>{empresa.nombre}</option>)}
              </select>
            </label>

            {solicitud && (
              <div className="grid grid-cols-2 gap-3">
                <Dato label="Empleos comprometidos" value={solicitud.empleosProyectados.toLocaleString('es-CR')} />
                <Dato label="Inversión comprometida" value={moneda(solicitud.inversionProyectada)} />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Campo label="Empleos reales" value={form.empleosReales} onChange={(v) => setForm({ ...form, empleosReales: v })} type="number" Icon={Users} />
              <Campo label="Inversión ejecutada (₡)" value={form.inversionEjecutada} onChange={(v) => setForm({ ...form, inversionEjecutada: v })} type="number" Icon={DollarSign} />
              <Campo label="Exportaciones (₡)" value={form.exportaciones} onChange={(v) => setForm({ ...form, exportaciones: v })} type="number" Icon={BarChart3} />
              <Campo label="Fecha del reporte" value={form.fecha} onChange={(v) => setForm({ ...form, fecha: v })} type="date" Icon={Clock3} />
            </div>

            <button disabled={enviando}
              className="w-full px-4 py-3 bg-[#2D9CDB] hover:bg-[#2387be] text-white rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 disabled:opacity-60">
              {enviando ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {enviando ? 'Registrando...' : 'Registrar reporte'}
            </button>
          </form>

          <div className="space-y-4">
            <div className="bg-[#0B2B4A] text-white rounded-2xl p-6">
              <p className="text-xs uppercase tracking-wider text-slate-300 font-bold">RF-07 · Comparación automática</p>
              <h3 className="mt-2 text-lg font-extrabold">Último resultado</h3>
              {resultados[resultados.length - 1] ? (
                <div className="mt-4 space-y-3">
                  <ResultadoFila label="Empleo" cumple={resultados[resultados.length - 1].cumpleEmpleos} />
                  <ResultadoFila label="Inversión" cumple={resultados[resultados.length - 1].cumpleInversion} />
                </div>
              ) : <p className="mt-3 text-sm text-slate-300">Todavía no hay reportes para esta empresa.</p>}
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-extrabold text-[#0B2B4A] text-sm">Regla de negocio</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#4A5568]">
                Empleo cumple si real ≥ proyectado. Inversión cumple si ejecutada ≥ proyectada. Si falla cualquiera, el reporte queda incumplido.
              </p>
            </div>
          </div>
        </div>
      )}

      {vista === 'alertas' && <PanelAlertas alertas={alertas} />}
      {vista === 'historial' && <PanelHistorial empresa={empresas.find((e) => e.id === empresaId)} solicitud={solicitud} resultados={resultados} />}
      {vista === 'resumen' && <PanelResumen resumen={resumen} alertas={alertas} />}
      </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Campo({ label, value, onChange, type, Icon }: { label: string; value: string; onChange: (v: string) => void; type: string; Icon: React.ElementType }) {
  return (
    <label className="text-xs font-bold text-[#0B2B4A]">
      <span className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5 text-[#2D9CDB]" />{label}</span>
      <input required min={type === 'date' ? undefined : 0} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus-turquoise" />
    </label>
  );
}

function ResultadoFila({ label, cumple }: { label: string; cumple: boolean }) {
  return <div className="flex items-center justify-between bg-white/10 rounded-xl p-3"><span className="text-sm font-semibold">{label}</span><span className={`text-xs font-extrabold px-2 py-1 rounded-full ${cumple ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{cumple ? 'Cumple' : 'Incumple'}</span></div>;
}

function PanelAlertas({ alertas }: { alertas: AlertaCumplimiento[] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Kpi icon={Bell} label="Alertas" value={alertas.length} />
        <Kpi icon={AlertTriangle} label="Prioridad alta" value={alertas.filter((a) => a.severidad === 'Alta').length} />
        <Kpi icon={Building2} label="Empresas afectadas" value={new Set(alertas.map((a) => a.empresaId)).size} />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-extrabold text-[#0B2B4A]">Panel de alertas</h2>
          <p className="text-xs text-[#4A5568] mt-1">RF-08 · Derivadas de los compromisos reales de `solicitudes`.</p>
        </div>
        {alertas.length === 0 ? (
          <div className="p-10 text-center"><CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" /><p className="mt-2 text-sm font-bold text-[#0B2B4A]">Sin incumplimientos detectados</p></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {alertas.map((a) => (
              <div key={a.id} className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-extrabold ${a.severidad === 'Alta' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>{a.severidad}</span>
                    <span className="text-[11px] font-bold text-slate-500">{a.categoria}</span>
                  </div>
                  <h3 className="mt-1 text-sm font-extrabold text-[#0B2B4A]">{a.empresa} · {a.titulo}</h3>
                  <p className="text-xs text-[#4A5568] mt-1">{a.descripcion}</p>
                </div>
                <div className="text-right"><div className="text-xs text-slate-500">Brecha</div><div className="font-extrabold text-rose-600">{a.brecha.toLocaleString('es-CR')}</div></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PanelHistorial({ empresa, solicitud, resultados }: { empresa?: Empresa; solicitud: Solicitud | null; resultados: ResultadoComparacion[] }) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#2D9CDB] flex items-center justify-center"><History className="w-5 h-5" /></div>
          <div><h2 className="text-base font-extrabold text-[#0B2B4A]">Trazabilidad de empresa</h2><p className="text-xs text-[#4A5568] mt-1">{empresa?.nombre ?? 'Seleccione una empresa'} → solicitud original → reportes → decisiones.</p></div>
        </div>
        {solicitud && <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3"><Dato label="Solicitud" value={`#${solicitud.id}`} /><Dato label="Estado" value={solicitud.estado} /><Dato label="Fecha solicitud" value={solicitud.fecha} /></div>}
      </div>
      <div className="space-y-3">
        {resultados.map((r) => (
          <div key={r.reporte.id} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between gap-4">
              <div><p className="text-xs font-bold text-slate-500">Reporte #{r.reporte.id} · {r.reporte.fecha}</p><p className="mt-1 text-sm font-extrabold text-[#0B2B4A]">{r.cumple ? 'Cumplimiento confirmado' : 'Incumplimiento detectado'}</p></div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${r.cumple ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{r.cumple ? 'Cumple' : 'Incumple'}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Dato label="Empleos reales" value={r.reporte.empleosReales.toLocaleString('es-CR')} />
              <Dato label="Empleos meta" value={r.solicitud.empleosProyectados.toLocaleString('es-CR')} />
              <Dato label="Inversión real" value={moneda(r.reporte.inversionEjecutada)} />
              <Dato label="Inversión meta" value={moneda(r.solicitud.inversionProyectada)} />
            </div>
            {r.alertas.length > 0 && <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">{r.alertas.map((a) => <div key={a.id}>• {a.titulo}: brecha {a.brecha.toLocaleString('es-CR')}</div>)}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelResumen({ resumen, alertas }: { resumen: ResumenCumplimiento; alertas: AlertaCumplimiento[] }) {
  const reducirMovimiento = useReducedMotion();
  const datosCumplimiento = [
    { name: 'Cumplidos', value: resumen.cumplidos, fill: '#10b981' },
    { name: 'Incumplidos', value: resumen.incumplidos, fill: '#f43f5e' },
  ];
  const datosAlertas = Object.entries(
    alertas.reduce<Record<string, number>>((acumulado, alerta) => {
      acumulado[alerta.categoria] = (acumulado[alerta.categoria] ?? 0) + 1;
      return acumulado;
    }, {}),
  ).map(([categoria, total]) => ({ categoria, total }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Kpi icon={FileCheck2} label="Reportes" value={resumen.totalReportes} />
        <Kpi icon={CheckCircle2} label="Cumplidos" value={resumen.cumplidos} />
        <Kpi icon={AlertTriangle} label="Incumplidos" value={resumen.incumplidos} />
        <Kpi icon={BarChart3} label="% cumplimiento" value={`${resumen.porcentajeCumplimiento}%`} />
        <Kpi icon={FileCheck2} label="Solicitudes" value={resumen.totalSolicitudes} />
        <Kpi icon={Clock3} label="Días promedio" value={resumen.tiempoPromedio} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-base font-extrabold text-[#0B2B4A]">Resumen consolidado para PROCOMER</h2>
          <p className="text-xs text-[#4A5568] mt-1">RF-09 · Estado agregado de los reportes.</p>
          <div className="mt-3 h-64" aria-label="Gráfica circular de cumplimiento de reportes">
            {resumen.totalReportes > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={datosCumplimiento} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={5} cornerRadius={7} isAnimationActive={!reducirMovimiento} animationDuration={1000} />
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 12 }} />
                  <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fill="#0B2B4A" fontSize="24" fontWeight="800">{resumen.porcentajeCumplimiento}%</text>
                  <text x="50%" y="59%" textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="11">cumplimiento</text>
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="flex h-full items-center justify-center text-sm text-slate-400">Sin reportes para graficar.</div>}
          </div>
          <div className="grid grid-cols-2 gap-3"><Dato label="% recomendadas" value={`${resumen.porcentajeRecomendadas}%`} /><Dato label="Tiempo promedio" value={`${resumen.tiempoPromedio} días`} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-base font-extrabold text-[#0B2B4A]">Alertas por categoría</h2>
          <p className="text-xs text-[#4A5568] mt-1">Incumplimientos agrupados para priorizar la fiscalización.</p>
          <div className="mt-3 h-72" aria-label="Gráfica de barras de alertas por categoría">
            {datosAlertas.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosAlertas} margin={{ top: 12, right: 8, left: -22, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="categoria" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 12 }} />
                  <Bar dataKey="total" name="Alertas" fill="#2D9CDB" radius={[8, 8, 0, 0]} isAnimationActive={!reducirMovimiento} animationDuration={1100} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="flex h-full flex-col items-center justify-center text-center"><CheckCircle2 className="h-9 w-9 text-emerald-500" /><p className="mt-2 text-sm font-bold text-[#0B2B4A]">No existen alertas activas</p></div>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">{label}</span><Icon className="w-4 h-4 text-[#2D9CDB]" /></div><div className="mt-2 text-2xl font-extrabold text-[#0B2B4A]">{value}</div></motion.div>;
}
function Dato({ label, value }: { label: string; value: string }) {
  return <div className="bg-slate-50 border border-slate-200 rounded-xl p-3"><div className="text-[10px] uppercase font-bold text-slate-500">{label}</div><div className="mt-1 text-sm font-extrabold text-[#0B2B4A]">{value}</div></div>;
}
