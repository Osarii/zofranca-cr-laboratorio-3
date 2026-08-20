import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  FileText, 
  Building2, 
  BarChart3, 
  Settings, 
  LayoutDashboard,
  User,
  Plus,
  ChevronDown,
  Cpu
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  alertsCount: number;
  onOpenNewSolicitud: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  setCurrentUser,
  alertsCount,
  onOpenNewSolicitud,
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const users = [
    { name: 'Laura Monge', role: 'Analista de Cumplimiento', email: 'lmonge@procomer.com' },
    { name: 'Carlos Rodríguez', role: 'Usuario Admin', email: 'crodriguez@procomer.com' },
    { name: 'María Rodríguez', role: 'Directora de Zonas Francas', email: 'mrodriguez@procomer.com' },
    { name: 'Carlos M.', role: 'Auditor Fiscal', email: 'cmora@hacienda.go.cr' },
  ];

  const currentRole = users.find(u => u.name === currentUser)?.role || 'Usuario';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'solicitudes', label: 'Solicitudes', icon: FileText },
    { id: 'alertas', label: 'Alertas', icon: Bell, badge: alertsCount },
    { id: 'empresas', label: 'Empresas', icon: Building2 },
    { id: 'reportes', label: 'Cumplimiento', icon: BarChart3 },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B2B4A] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Zone */}
          <div className="flex items-center space-x-3 shrink-0">
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center space-x-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D9CDB] rounded-md py-1 cursor-pointer transition-transform duration-150 hover:scale-[1.02]"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2D9CDB] to-emerald-400 flex items-center justify-center font-extrabold text-white text-lg shadow-sm">
                Z
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#2D9CDB] transition-colors">
                  ZoFranca CR
                </span>
                <span className="bg-white/10 text-white/90 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                  🇨🇷
                </span>
              </div>
            </button>
          </div>

          {/* Nav zone */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D9CDB] cursor-pointer ${
                    isActive
                      ? 'bg-white/15 text-white shadow-inner font-semibold'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white hover:shadow-xs'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2D9CDB]' : 'opacity-80'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-rose-500 text-white animate-alert-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action & User zone */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Quick new application button with hover elevation */}
            <button
              onClick={onOpenNewSolicitud}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#2D9CDB] hover:bg-[#2387be] active:bg-[#1d73a3] text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Solicitud</span>
            </button>

            {/* Bell button with subtle pulse if alerts exist */}
            <button
              onClick={() => setCurrentTab('alertas')}
              className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D9CDB] cursor-pointer"
              title="Alertas de Cumplimiento"
              aria-label="Ver alertas"
            >
              <Bell className="w-5 h-5" />
              {alertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-[#0B2B4A] animate-pulse" />
              )}
            </button>

            {/* User Dropdown Selector */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-white/10 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D9CDB] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#2D9CDB] border border-white/20 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden lg:block text-left leading-tight">
                  <div className="text-xs font-bold text-white truncate max-w-[130px]">{currentUser}</div>
                  <div className="text-[11px] text-slate-300 truncate max-w-[130px]">{currentRole}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in-50 duration-100">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cambiar Perfil Demo</p>
                  </div>
                  {users.map((u) => (
                    <button
                      key={u.name}
                      onClick={() => {
                        setCurrentUser(u.name);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        currentUser === u.name ? 'bg-sky-50 text-[#0B2B4A] font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-[#4A5568]">{u.role}</div>
                        </div>
                      </div>
                      {currentUser === u.name && (
                        <span className="text-xs text-[#2D9CDB] font-bold">Activo</span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                    <button 
                      onClick={() => {
                        onOpenNewSolicitud();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#2D9CDB] hover:bg-sky-50 rounded-md font-bold flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nueva Solicitud de Régimen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
