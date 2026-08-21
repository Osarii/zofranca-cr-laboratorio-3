import React from 'react';
import { Command } from 'cmdk';
import {
  BarChart3,
  Bell,
  Building2,
  FileText,
  LayoutDashboard,
  MapPinned,
  Plus,
  Search,
  Settings,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (tab: string) => void;
  onOpenNewSolicitud: () => void;
}

const destinos = [
  { id: 'dashboard', label: 'Ir al Dashboard', descripcion: 'Resumen operativo', icono: LayoutDashboard, keywords: ['inicio', 'home', 'panel'] },
  { id: 'solicitudes', label: 'Ir a Solicitudes', descripcion: 'Admisión y evaluaciones', icono: FileText, keywords: ['admisión', 'gemini', 'evaluar'] },
  { id: 'alertas', label: 'Ir a Alertas', descripcion: 'Incidencias regulatorias', icono: Bell, keywords: ['riesgos', 'avisos'] },
  { id: 'empresas', label: 'Ir a Empresas', descripcion: 'Directorio empresarial', icono: Building2, keywords: ['compañías', 'directorio'] },
  { id: 'zonas', label: 'Ir a Zonas francas', descripcion: 'Parques y criterios', icono: MapPinned, keywords: ['ubicaciones', 'parques'] },
  { id: 'reportes', label: 'Ir a Cumplimiento', descripcion: 'Indicadores e informes', icono: BarChart3, keywords: ['reportes', 'métricas'] },
  { id: 'configuracion', label: 'Ir a Configuración', descripcion: 'Preferencias del sistema', icono: Settings, keywords: ['perfil', 'ajustes'] },
];

export function CommandPalette({ open, onOpenChange, onNavigate, onOpenNewSolicitud }: CommandPaletteProps) {
  React.useEffect(() => {
    const escucharAtajo = (evento: KeyboardEvent) => {
      if (evento.key.toLowerCase() === 'k' && (evento.ctrlKey || evento.metaKey)) {
        evento.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', escucharAtajo);
    return () => document.removeEventListener('keydown', escucharAtajo);
  }, [onOpenChange, open]);

  const ejecutar = (accion: () => void) => {
    accion();
    onOpenChange(false);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Comandos rápidos de ZoFranca CR"
      loop
      overlayClassName="fixed inset-0 z-[90] bg-black/75 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[14%] z-[100] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-[#4d4732] bg-[#1b1b1b] text-[#e2e2e2] shadow-[0_24px_80px_rgba(0,0,0,.55)]"
    >
      <div className="relative border-b border-[#4d4732]">
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ffd700]" />
        <Command.Input autoFocus placeholder="Buscar páginas o acciones…" className="h-16 w-full bg-transparent pl-14 pr-16 text-base text-[#fff6df] outline-none placeholder:text-[#77736a]" />
        <kbd className="absolute right-4 top-1/2 -translate-y-1/2 rounded border border-[#4d4732] bg-[#131313] px-2 py-1 text-[10px] font-bold text-[#999077]">ESC</kbd>
      </div>

      <Command.List className="max-h-[min(430px,60vh)] overflow-y-auto p-2">
        <Command.Empty className="px-4 py-12 text-center text-sm text-[#999077]">No encontramos esa opción.</Command.Empty>

        <Command.Group heading="Acciones" className="command-group">
          <Command.Item value="Crear nueva solicitud" keywords={['agregar', 'registrar', 'admisión']} onSelect={() => ejecutar(onOpenNewSolicitud)} className="command-item">
            <span className="command-icon bg-[#ffd700] text-[#131313]"><Plus className="h-4 w-4" /></span>
            <span className="min-w-0 flex-1"><strong className="block text-sm text-[#fff6df]">Nueva solicitud</strong><span className="mt-0.5 block text-xs text-[#999077]">Registrar una empresa para evaluación</span></span>
            <span className="text-[10px] font-bold uppercase text-[#ffd700]">Crear</span>
          </Command.Item>
        </Command.Group>

        <Command.Separator className="my-2 h-px bg-[#4d4732]" />
        <Command.Group heading="Navegación" className="command-group">
          {destinos.map(({ id, label, descripcion, icono: Icono, keywords }) => (
            <Command.Item key={id} value={label} keywords={keywords} onSelect={() => ejecutar(() => onNavigate(id))} className="command-item">
              <span className="command-icon"><Icono className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1"><strong className="block text-sm text-[#fff6df]">{label}</strong><span className="mt-0.5 block text-xs text-[#999077]">{descripcion}</span></span>
              <span className="text-[#77736a]">↵</span>
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>

      <div className="flex items-center justify-between border-t border-[#4d4732] bg-[#131313] px-4 py-3 text-[10px] text-[#77736a]">
        <span>↑↓ navegar · Enter seleccionar</span><span className="font-bold text-[#999077]">ZoFranca Command Center</span>
      </div>
    </Command.Dialog>
  );
}
