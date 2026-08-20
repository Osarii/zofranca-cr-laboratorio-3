import React, { useState } from 'react';
import { Bell, BarChart3, Building2, FileCheck2, LayoutDashboard, Settings } from 'lucide-react';
import { CumplimientoModule } from '../cumplimiento/CumplimientoModule';

export default function App() {
  const [tab, setTab] = useState('cumplimiento');

  const nav = [
    ['cumplimiento', 'Cumplimiento', FileCheck2],
    ['alertas', 'Alertas', Bell],
    ['empresas', 'Empresas', Building2],
    ['dashboard', 'Dashboard', LayoutDashboard],
    ['configuracion', 'Configuración', Settings],
  ] as const;

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#4A5568]">
      <header className="sticky top-0 z-40 bg-[#0B2B4A] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2D9CDB] to-emerald-400 flex items-center justify-center font-extrabold">Z</div>
              <div className="font-extrabold text-xl">ZoFranca CR <span className="text-sm">🇨🇷</span></div>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {nav.map(([id, label, Icon]) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${tab === id ? 'bg-white/15 text-white' : 'text-slate-200 hover:bg-white/10'}`}>
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </nav>
            <div className="text-xs text-slate-300 font-semibold">Persona B · Kevin</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {tab === 'cumplimiento' || tab === 'alertas' ? (
          <CumplimientoModule />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-[#2D9CDB]" />
              <div>
                <h1 className="text-xl font-extrabold text-[#0B2B4A]">Módulo reservado</h1>
                <p className="text-sm mt-1">Esta sección pertenece a la integración general del equipo.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
