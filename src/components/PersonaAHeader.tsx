import React from 'react';
import {
  BarChart3,
  Bell,
  Building2,
  FileText,
  LayoutDashboard,
  MapPinned,
  Plus,
  Settings,
  User,
} from 'lucide-react';

interface PersonaAHeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  alertsCount: number;
  onOpenNewSolicitud: () => void;
}

const perfiles = ['Jared Prendas', 'Laura Monge', 'Carlos Rodríguez'];

export const PersonaAHeader: React.FC<PersonaAHeaderProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  setCurrentUser,
  alertsCount,
  onOpenNewSolicitud,
}) => {
  const [menuAbierto, setMenuAbierto] = React.useState(false);
  const opciones = [
    { id: 'dashboard', label: 'Dashboard', icono: LayoutDashboard },
    { id: 'solicitudes', label: 'Solicitudes', icono: FileText },
    { id: 'zonas', label: 'Zonas', icono: MapPinned },
    { id: 'alertas', label: 'Alertas', icono: Bell, badge: alertsCount },
    { id: 'empresas', label: 'Empresas', icono: Building2 },
    { id: 'reportes', label: 'Cumplimiento', icono: BarChart3 },
    { id: 'configuracion', label: 'Configuración', icono: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B2B4A] text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <button type="button" onClick={() => setCurrentTab('solicitudes')} className="flex shrink-0 items-center gap-2.5 rounded-md py-1 text-left">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#2D9CDB] to-emerald-400 text-lg font-extrabold shadow-sm">Z</span>
            <span className="hidden text-xl font-extrabold tracking-tight sm:block">ZoFranca CR</span>
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-semibold">CR</span>
          </button>

          <nav className="hidden min-w-0 items-center gap-1 overflow-x-auto xl:flex" aria-label="Navegación principal">
            {opciones.map(({ id, label, icono: Icono, badge }) => (
              <button type="button" key={id} onClick={() => setCurrentTab(id)} className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold transition ${currentTab === id ? 'bg-white/15 text-white' : 'text-slate-200 hover:bg-white/10'}`}>
                <Icono className={`h-4 w-4 ${currentTab === id ? 'text-[#2D9CDB]' : ''}`} />{label}
                {!!badge && <span className="rounded-full bg-rose-500 px-1.5 text-[10px] font-bold">{badge}</span>}
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={onOpenNewSolicitud} className="hidden items-center gap-1.5 rounded-lg bg-[#2D9CDB] px-3.5 py-2 text-xs font-bold hover:bg-[#2387be] sm:flex"><Plus className="h-4 w-4" /> Nueva solicitud</button>
            <div className="relative">
              <button type="button" onClick={() => setMenuAbierto((actual) => !actual)} className="flex items-center gap-2 rounded-lg p-2 hover:bg-white/10" aria-label="Cambiar perfil"><User className="h-4 w-4" /><span className="hidden max-w-28 truncate text-xs font-bold lg:block">{currentUser}</span></button>
              {menuAbierto && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-xl">
                  {perfiles.map((perfil) => <button type="button" key={perfil} onClick={() => { setCurrentUser(perfil); setMenuAbierto(false); }} className={`w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-50 ${perfil === currentUser ? 'bg-sky-50 font-bold text-[#0B2B4A]' : ''}`}>{perfil}</button>)}
                </div>
              )}
            </div>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-2 xl:hidden" aria-label="Navegación móvil">
          {opciones.map(({ id, label, icono: Icono }) => <button type="button" key={id} onClick={() => setCurrentTab(id)} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${currentTab === id ? 'bg-white/15 text-white' : 'text-slate-300'}`}><Icono className="h-3.5 w-3.5" />{label}</button>)}
        </nav>
      </div>
    </header>
  );
};
