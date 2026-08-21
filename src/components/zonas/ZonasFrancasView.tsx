import React, { useState } from 'react';
import { Building2, DollarSign, MapPinned, Plus, Save, Users } from 'lucide-react';
import type { NuevaZonaFranca, ZonaFranca } from '../../contrato';

interface ZonasFrancasViewProps {
  zonasFrancas: ZonaFranca[];
  onCreate: (zona: NuevaZonaFranca) => Promise<void>;
}

export const ZonasFrancasView: React.FC<ZonasFrancasViewProps> = ({ zonasFrancas, onCreate }) => {
  const [nombre, setNombre] = useState('');
  const [inversionMinima, setInversionMinima] = useState(0);
  const [empleosMinimos, setEmpleosMinimos] = useState(0);
  const [sectores, setSectores] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const guardar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    const sectoresPermitidos = sectores.split(',').map((sector) => sector.trim()).filter(Boolean);
    if (sectoresPermitidos.length === 0) {
      setError('Ingrese al menos un sector permitido.');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await onCreate({ nombre: nombre.trim(), inversionMinima: Number(inversionMinima), empleosMinimos: Number(empleosMinimos), sectoresPermitidos });
      setNombre('');
      setInversionMinima(0);
      setEmpleosMinimos(0);
      setSectores('');
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : 'No fue posible guardar la zona franca.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div><p className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#D2A12D]">RF-01 · Configuración</p><h1 className="text-[28px] font-extrabold tracking-tight text-[#E1B84C]">Zonas francas y criterios mínimos</h1><p className="mt-1 text-sm text-[#C5C2BA]">Registre los parámetros que utilizará el motor para medir afinidad empresarial.</p></div>

      <div className="grid gap-6 lg:grid-cols-5">
        <form onSubmit={guardar} className="space-y-4 rounded-2xl border border-slate-200 bg-[#17181C] p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-[#D2A12D]"><Plus className="h-5 w-5" /></span><div><h2 className="font-extrabold text-[#E1B84C]">Registrar zona franca</h2><p className="text-xs text-slate-500">Todos los criterios son obligatorios.</p></div></div>
          {error && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</div>}
          <Campo etiqueta="Nombre de la zona" id="nombre"><input id="nombre" required maxLength={100} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Green Valley Free Zone" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus-turquoise" /></Campo>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Inversión mínima (USD)" id="inversion"><input id="inversion" required min={1} type="number" value={inversionMinima || ''} onChange={(e) => setInversionMinima(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus-turquoise" /></Campo>
            <Campo etiqueta="Empleos mínimos" id="empleos"><input id="empleos" required min={1} type="number" value={empleosMinimos || ''} onChange={(e) => setEmpleosMinimos(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus-turquoise" /></Campo>
          </div>
          <Campo etiqueta="Sectores permitidos" id="sectores"><textarea id="sectores" required rows={3} value={sectores} onChange={(e) => setSectores(e.target.value)} placeholder="Tecnología, Servicios Digitales, Semiconductores" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus-turquoise" /><p className="mt-1 text-[11px] text-slate-500">Separe cada sector con una coma.</p></Campo>
          <button type="submit" disabled={guardando} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A77B1C] px-5 py-3 text-xs font-bold text-white hover:bg-[#BF9124] disabled:opacity-60">{guardando ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}{guardando ? 'Guardando…' : 'Guardar zona franca'}</button>
        </form>

        <section className="space-y-4 lg:col-span-3">
          <div className="flex items-center justify-between"><h2 className="font-extrabold text-[#E1B84C]">Zonas registradas</h2><span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">{zonasFrancas.length}</span></div>
          {zonasFrancas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#17181C] py-16 text-center"><MapPinned className="mx-auto h-10 w-10 text-slate-300" /><p className="mt-3 text-sm font-bold text-[#E1B84C]">Aún no hay zonas registradas</p></div>
          ) : zonasFrancas.map((zona) => (
            <article key={zona.id} className="rounded-2xl border border-slate-200 bg-[#17181C] p-5 shadow-sm">
              <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#D2A12D]"><Building2 className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><h3 className="font-extrabold text-[#E1B84C]">{zona.nombre}</h3><span className="font-mono text-[11px] font-bold text-slate-400">ZF-{zona.id}</span></div><div className="mt-3 grid gap-3 text-xs sm:grid-cols-2"><span className="flex items-center gap-2 text-slate-600"><DollarSign className="h-4 w-4 text-emerald-600" />Mínimo: <strong className="text-slate-800">${zona.inversionMinima.toLocaleString('en-US')}</strong></span><span className="flex items-center gap-2 text-slate-600"><Users className="h-4 w-4 text-[#D2A12D]" />Mínimo: <strong className="text-slate-800">{zona.empleosMinimos} empleos</strong></span></div><div className="mt-4 flex flex-wrap gap-2">{zona.sectoresPermitidos.map((sector) => <span key={sector} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">{sector}</span>)}</div></div></div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

const Campo: React.FC<{ etiqueta: string; id: string; children: React.ReactNode }> = ({ etiqueta, id, children }) => (
  <div><label htmlFor={id} className="mb-1.5 block text-xs font-bold text-[#E1B84C]">{etiqueta}</label>{children}</div>
);
