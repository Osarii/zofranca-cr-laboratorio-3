import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BarChart3,
  Bell,
  Building2,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  Plus,
  Search,
  Settings,
  User,
  X,
} from 'lucide-react';
import { AudioControl } from './common/AudioControl';
import { CommandPalette } from './common/CommandPalette';
import { ZoFrancaLogo } from './brand/ZoFrancaLogo';

interface PersonaAHeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  alertsCount: number;
  onOpenNewSolicitud: () => void;
  detailMode?: boolean;
}

const perfiles = ['Jared Prendas', 'Laura Monge', 'Carlos Rodríguez'];

export const PersonaAHeader: React.FC<PersonaAHeaderProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  setCurrentUser,
  alertsCount,
  onOpenNewSolicitud,
  detailMode = false,
}) => {
  const [drawerAbierto, setDrawerAbierto] = React.useState(false);
  const [perfilAbierto, setPerfilAbierto] = React.useState(false);
  const [comandosAbiertos, setComandosAbiertos] = React.useState(false);

  const opciones = [
    { id: 'dashboard', label: 'Dashboard', icono: LayoutDashboard },
    { id: 'solicitudes', label: 'Solicitudes', icono: FileText },
    { id: 'alertas', label: 'Alertas', icono: Bell, badge: alertsCount },
    { id: 'empresas', label: 'Empresas', icono: Building2 },
    { id: 'zonas', label: 'Zonas francas', icono: MapPinned },
    { id: 'reportes', label: 'Cumplimiento', icono: BarChart3 },
    { id: 'configuracion', label: 'Configuración', icono: Settings },
  ];

  const navegar = (id: string) => {
    setCurrentTab(id);
    setDrawerAbierto(false);
  };

  const marca = (
    <button type="button" onClick={() => navegar('dashboard')} className="flex items-center gap-3 text-left" aria-label="Ir al dashboard">
      <ZoFrancaLogo className="h-10 w-10 shrink-0" />
      <span>
        <span className="block text-[19px] font-extrabold leading-tight tracking-[-.02em] text-[#fff6df]">ZoFranca CR</span>
        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[.18em] text-[#d0c6ab]">Gestión de cumplimiento</span>
      </span>
    </button>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-[#4d4732] bg-[#0e0e0e] px-6 py-7 lg:flex">
        {marca}

        <nav className="mt-10 flex-1 space-y-1.5" aria-label="Navegación principal">
          {opciones.map(({ id, label, icono: Icono, badge }) => {
            const activo = currentTab === id;
            return (
              <button
                type="button"
                key={id}
                onClick={() => navegar(id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition ${activo ? 'bg-[#fff6df] font-extrabold text-[#131313]' : 'font-semibold text-[#d0c6ab] hover:bg-[#1f1f1f] hover:text-[#fff6df]'}`}
              >
                <Icono className="h-5 w-5 shrink-0" />
                <span className="truncate">{label}</span>
                {!!badge && <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-extrabold ${activo ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#ffd700] text-[#131313]'}`}>{badge}</span>}
              </button>
            );
          })}
        </nav>

        <button type="button" onClick={onOpenNewSolicitud} className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffd700] px-4 py-3 text-xs font-extrabold uppercase tracking-[.05em] text-[#131313] transition hover:bg-[#ffe16d] active:scale-[.98]">
          <Plus className="h-4 w-4" /> Nueva solicitud
        </button>

        <div className="space-y-1 border-t border-[#4d4732] pt-5">
          <button type="button" className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-xs font-semibold text-[#d0c6ab] hover:bg-[#1f1f1f] hover:text-[#fff6df]"><HelpCircle className="h-4 w-4" /> Ayuda</button>
          <button type="button" className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-xs font-semibold text-[#d0c6ab] hover:bg-[#1f1f1f] hover:text-[#ffb4ab]"><LogOut className="h-4 w-4" /> Cerrar sesión</button>
        </div>
      </aside>

      <header className="fixed left-64 right-0 top-0 z-40 hidden h-20 items-center justify-between border-b border-[#4d4732] bg-[#131313]/96 px-10 backdrop-blur lg:flex xl:px-12">
        <button type="button" onClick={() => setComandosAbiertos(true)} className="group relative block w-full max-w-md text-left" aria-label="Abrir buscador global">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999077]" />
          <span className="flex w-full items-center justify-between rounded-lg border border-[#4d4732] bg-[#1f1f1f] py-2.5 pl-10 pr-3 text-sm text-[#77736a] transition group-hover:border-[#999077] group-hover:text-[#d0c6ab]"><span>Buscar o ejecutar una acción…</span><kbd className="rounded border border-[#4d4732] bg-[#131313] px-2 py-0.5 text-[10px] font-bold text-[#999077]">Ctrl K</kbd></span>
        </button>

        <div className="ml-8 flex items-center gap-3">
          <button type="button" onClick={() => navegar('alertas')} className="relative rounded-full p-2.5 text-[#d0c6ab] hover:bg-[#2a2a2a] hover:text-[#ffd700]" aria-label="Ver alertas">
            <Bell className="h-5 w-5" />
            {!!alertsCount && <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-[#131313] bg-[#ffd700]" />}
          </button>
          <AudioControl />
          <div className="h-7 w-px bg-[#4d4732]" />
          <div className="relative">
            <button type="button" onClick={() => setPerfilAbierto((actual) => !actual)} className="flex items-center gap-3 rounded-lg p-1.5 pr-3 hover:bg-[#1f1f1f]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#4d4732] bg-[#2a2a2a] text-[#ffd700]"><User className="h-4 w-4" /></span>
              <span className="text-left"><span className="block text-xs font-extrabold text-[#fff6df]">{currentUser}</span><span className="block text-[10px] text-[#999077]">Analista</span></span>
            </button>
            <AnimatePresence>
              {perfilAbierto && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 mt-2 w-52 rounded-lg border border-[#4d4732] bg-[#1f1f1f] p-2">
                  {perfiles.map((perfil) => <button type="button" key={perfil} onClick={() => { setCurrentUser(perfil); setPerfilAbierto(false); }} className={`w-full rounded-md px-3 py-2 text-left text-xs ${perfil === currentUser ? 'bg-[#ffd700] font-bold text-[#131313]' : 'text-[#d0c6ab] hover:bg-[#2a2a2a]'}`}>{perfil}</button>)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[#4d4732] bg-[#0e0e0e] px-4 lg:hidden">
        <button type="button" onClick={() => setDrawerAbierto(true)} className="rounded-lg p-2 text-[#fff6df]" aria-label="Abrir menú"><Menu className="h-6 w-6" /></button>
        <button type="button" onClick={() => navegar('dashboard')} className="text-lg font-black tracking-tight text-[#ffd700]">ZoFranca CR</button>
        <div className="flex items-center"><button type="button" onClick={() => setComandosAbiertos(true)} className="rounded-lg p-2 text-[#fff6df]" aria-label="Buscar"><Search className="h-5 w-5" /></button><button type="button" onClick={() => navegar('alertas')} className="relative rounded-lg p-2 text-[#fff6df]" aria-label="Ver alertas"><Bell className="h-5 w-5" />{!!alertsCount && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#ffd700]" />}</button></div>
      </header>

      <AnimatePresence>
        {drawerAbierto && (
          <>
            <motion.button type="button" aria-label="Cerrar menú" onClick={() => setDrawerAbierto(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/70 lg:hidden" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 340, damping: 34 }} className="fixed inset-y-0 left-0 z-[70] flex w-[84vw] max-w-xs flex-col border-r border-[#4d4732] bg-[#0e0e0e] p-5 lg:hidden">
              <div className="flex items-center justify-between">{marca}<button type="button" onClick={() => setDrawerAbierto(false)} className="rounded-lg p-2 text-[#d0c6ab]"><X className="h-5 w-5" /></button></div>
              <button type="button" onClick={() => { setDrawerAbierto(false); setComandosAbiertos(true); }} className="mt-6 flex items-center gap-3 rounded-lg border border-[#4d4732] bg-[#1f1f1f] px-4 py-3 text-left text-xs text-[#999077]"><Search className="h-4 w-4 text-[#ffd700]" />Buscar o ejecutar acción</button>
              <nav className="mt-8 flex-1 space-y-1.5">
                {opciones.map(({ id, label, icono: Icono, badge }) => <button type="button" key={id} onClick={() => navegar(id)} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm ${currentTab === id ? 'bg-[#fff6df] font-extrabold text-[#131313]' : 'font-semibold text-[#d0c6ab]'}`}><Icono className="h-5 w-5" />{label}{!!badge && <span className="ml-auto rounded-full bg-[#ffd700] px-2 py-0.5 text-[10px] font-bold text-[#131313]">{badge}</span>}</button>)}
              </nav>
              <button type="button" onClick={() => { onOpenNewSolicitud(); setDrawerAbierto(false); }} className="flex items-center justify-center gap-2 rounded-lg bg-[#ffd700] px-4 py-3 text-xs font-extrabold uppercase text-[#131313]"><Plus className="h-4 w-4" /> Nueva solicitud</button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <nav className={`fixed inset-x-0 bottom-0 z-50 h-20 items-center justify-around border-t border-[#4d4732] bg-[#0e0e0e] px-2 pb-[env(safe-area-inset-bottom)] lg:hidden ${detailMode ? 'hidden' : 'flex'}`} aria-label="Navegación móvil">
        {[
          { id: 'dashboard', label: 'Inicio', icono: LayoutDashboard },
          { id: 'solicitudes', label: 'Solicitudes', icono: FileText },
          { id: 'alertas', label: 'Alertas', icono: Bell, badge: alertsCount },
          { id: 'configuracion', label: 'Perfil', icono: User },
        ].map(({ id, label, icono: Icono, badge }) => {
          const activo = currentTab === id;
          return <button type="button" key={id} onClick={() => navegar(id)} className={`relative flex min-w-[68px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-bold transition ${activo ? 'bg-[#ffd700] text-[#131313]' : 'text-[#999077]'}`}><Icono className="h-5 w-5" />{label}{!!badge && id === 'alertas' && <span className="absolute right-1 top-1 rounded-full bg-[#93000a] px-1.5 text-[8px] text-[#ffdad6]">{badge}</span>}</button>;
        })}
      </nav>

      <CommandPalette open={comandosAbiertos} onOpenChange={setComandosAbiertos} onNavigate={navegar} onOpenNewSolicitud={onOpenNewSolicitud} />
    </>
  );
};
