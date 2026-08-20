import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BarChart3,
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  MapPinned,
  Plus,
  Settings,
  User,
} from 'lucide-react';
import { AudioControl } from './common/AudioControl';
import { ZoFrancaLogo } from './brand/ZoFrancaLogo';

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
  const navegacionMovilRef = React.useRef<HTMLElement>(null);
  const [limitesScroll, setLimitesScroll] = React.useState({ inicio: true, fin: false });
  const opciones = [
    { id: 'dashboard', label: 'Dashboard', icono: LayoutDashboard },
    { id: 'solicitudes', label: 'Solicitudes', icono: FileText },
    { id: 'zonas', label: 'Zonas', icono: MapPinned },
    { id: 'alertas', label: 'Alertas', icono: Bell, badge: alertsCount },
    { id: 'empresas', label: 'Empresas', icono: Building2 },
    { id: 'reportes', label: 'Cumplimiento', icono: BarChart3 },
    { id: 'configuracion', label: 'Configuración', icono: Settings },
  ];

  const actualizarLimitesScroll = React.useCallback(() => {
    const navegacion = navegacionMovilRef.current;
    if (!navegacion) return;
    setLimitesScroll({
      inicio: navegacion.scrollLeft <= 4,
      fin: navegacion.scrollLeft + navegacion.clientWidth >= navegacion.scrollWidth - 4,
    });
  }, []);

  React.useEffect(() => {
    const navegacion = navegacionMovilRef.current;
    if (!navegacion) return undefined;
    actualizarLimitesScroll();
    navegacion.addEventListener('scroll', actualizarLimitesScroll, { passive: true });
    window.addEventListener('resize', actualizarLimitesScroll);
    return () => {
      navegacion.removeEventListener('scroll', actualizarLimitesScroll);
      window.removeEventListener('resize', actualizarLimitesScroll);
    };
  }, [actualizarLimitesScroll]);

  React.useEffect(() => {
    const activo = navegacionMovilRef.current?.querySelector<HTMLElement>(`[data-nav-id="${currentTab}"]`);
    activo?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentTab]);

  const desplazarNavegacion = (direccion: -1 | 1) => {
    navegacionMovilRef.current?.scrollBy({ left: direccion * 230, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#D7B58A]/15 bg-[#5A1F2D]/95 text-white shadow-[0_12px_30px_-18px_rgba(63,17,30,.9)] backdrop-blur-xl">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#D7B58A] to-transparent opacity-80" />
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <button type="button" onClick={() => setCurrentTab('solicitudes')} className="group flex shrink-0 items-center gap-2.5 rounded-xl py-1 text-left" aria-label="Ir a solicitudes">
            <motion.span whileHover={{ rotate: -4, scale: 1.06 }} whileTap={{ scale: 0.94 }} className="relative flex shrink-0 drop-shadow-lg"><ZoFrancaLogo className="h-10 w-10" /><span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#5A1F2D] bg-emerald-400" /></motion.span>
            <span className="hidden sm:block">
              <span className="block text-lg font-black leading-none tracking-tight text-white">ZoFranca</span>
              <span className="mt-1 block text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#E7C9A5]">Costa Rica</span>
            </span>
          </button>

          <nav className="hidden min-w-0 items-center gap-1 rounded-xl border border-white/10 bg-black/10 p-1 shadow-inner min-[1450px]:flex" aria-label="Navegación principal">
            {opciones.map(({ id, label, icono: Icono, badge }) => (
              <button type="button" key={id} onClick={() => setCurrentTab(id)} className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold transition ${currentTab === id ? 'text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                {currentTab === id && <motion.span layoutId="navegacion-activa" className="absolute inset-0 rounded-lg border border-[#D7B58A]/25 bg-gradient-to-b from-white/20 to-white/10 shadow-sm" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span className="relative flex items-center gap-1.5"><Icono className={`h-4 w-4 ${currentTab === id ? 'text-[#E7C9A5]' : ''}`} />{label}</span>
                {!!badge && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative rounded-full bg-rose-500 px-1.5 text-[10px] font-bold">{badge}</motion.span>}
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={onOpenNewSolicitud} className="hidden items-center gap-1.5 rounded-lg bg-[#9A4D5D] px-3.5 py-2 text-xs font-bold hover:bg-[#7C3545] sm:flex"><Plus className="h-4 w-4" /> Nueva solicitud</button>
            <AudioControl />
            <div className="relative">
              <button type="button" onClick={() => setMenuAbierto((actual) => !actual)} className="flex items-center gap-2 rounded-lg p-2 hover:bg-white/10" aria-label="Cambiar perfil"><User className="h-4 w-4" /><span className="hidden max-w-28 truncate text-xs font-bold lg:block">{currentUser}</span></button>
              <AnimatePresence>
              {menuAbierto && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-xl">
                  {perfiles.map((perfil) => <button type="button" key={perfil} onClick={() => { setCurrentUser(perfil); setMenuAbierto(false); }} className={`w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-50 ${perfil === currentUser ? 'bg-sky-50 font-bold text-[#5A1F2D]' : ''}`}>{perfil}</button>)}
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="relative -mx-4 border-t border-white/10 sm:-mx-6 min-[1450px]:hidden">
          <div className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#5A1F2D] via-[#5A1F2D]/90 to-transparent transition-opacity ${limitesScroll.inicio ? 'opacity-0' : 'opacity-100'}`} />
          <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#5A1F2D] via-[#5A1F2D]/90 to-transparent transition-opacity ${limitesScroll.fin ? 'opacity-0' : 'opacity-100'}`} />
          <button type="button" onClick={() => desplazarNavegacion(-1)} disabled={limitesScroll.inicio} aria-label="Ver opciones anteriores" className={`absolute left-1 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#6B2738] text-white shadow-lg transition ${limitesScroll.inicio ? 'pointer-events-none opacity-0' : 'opacity-100 hover:bg-[#7D3346]'}`}><ChevronLeft className="h-4 w-4" /></button>
          <nav ref={navegacionMovilRef} className="navigation-scroll flex snap-x snap-mandatory gap-1 overflow-x-auto px-10 py-2 sm:px-12" aria-label="Navegación móvil">
            {opciones.map(({ id, label, icono: Icono, badge }) => (
              <motion.button
                type="button"
                data-nav-id={id}
                key={id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setCurrentTab(id)}
                className={`relative flex shrink-0 snap-center items-center gap-1.5 overflow-hidden rounded-xl px-3.5 py-2 text-[11px] font-bold transition ${currentTab === id ? 'text-white shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              >
                {currentTab === id && <motion.span layoutId="navegacion-movil-activa" className="absolute inset-0 rounded-xl border border-[#D7B58A]/25 bg-gradient-to-r from-[#9A4D5D]/45 to-[#B88958]/20" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative flex items-center gap-1.5"><Icono className={`h-3.5 w-3.5 ${currentTab === id ? 'text-[#E7C9A5]' : ''}`} />{label}</span>
                {!!badge && <span className="relative rounded-full bg-rose-500 px-1.5 text-[9px] text-white">{badge}</span>}
              </motion.button>
            ))}
          </nav>
          <button type="button" onClick={() => desplazarNavegacion(1)} disabled={limitesScroll.fin} aria-label="Ver más opciones" className={`absolute right-1 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#6B2738] text-white shadow-lg transition ${limitesScroll.fin ? 'pointer-events-none opacity-0' : 'opacity-100 hover:bg-[#7D3346]'}`}><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </header>
  );
};
