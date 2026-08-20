import React from 'react';
import { SolicitudZF, AlertItem, EmpresaItem } from '../../types';
import { 
  Building2, 
  FileText, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  Cpu, 
  Users, 
  DollarSign, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

interface DashboardViewProps {
  solicitudes: SolicitudZF[];
  alerts: AlertItem[];
  empresas: EmpresaItem[];
  onNavigateTab: (tab: string) => void;
  onOpenNewSolicitud: () => void;
  onSelectAlert: (alert: AlertItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  solicitudes,
  alerts,
  empresas,
  onNavigateTab,
  onOpenNewSolicitud,
  onSelectAlert,
}) => {
  const totalInvestmentUSD = empresas.reduce((acc, curr) => acc + curr.totalInvestmentUSD, 0);
  const totalEmployees = empresas.reduce((acc, curr) => acc + curr.employees, 0);
  const highSeverityAlerts = alerts.filter((a) => a.severity === 'Alta');
  const pendingSolicitudes = solicitudes.filter((s) => s.status === 'En Evaluación' || s.status === 'Pendiente');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#5A1F2D] tracking-tight">
            Panel de Control Zonas Francas
          </h1>
          <p className="text-base text-[#6B5A52] mt-1">
            Supervisión integral de empresas, cumplimiento de inversión y fiscalización Ley 7210
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('reportes')}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-[#5A1F2D] text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[#9A4D5D]" />
            <span>Auditoría de Cumplimiento</span>
          </button>

          <button
            onClick={onOpenNewSolicitud}
            className="px-5 py-2.5 bg-[#9A4D5D] hover:bg-[#7C3545] active:bg-[#713044] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-150 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Solicitud</span>
          </button>
        </div>
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Empresas */}
        <div 
          onClick={() => onNavigateTab('empresas')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-hover-effect cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5A52] uppercase tracking-wider">Empresas Activas</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#9A4D5D] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[28px] font-extrabold text-[#5A1F2D]">
            {empresas.length}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% registradas en PROCOMER</span>
          </div>
        </div>

        {/* Card 2: Inversión Total */}
        <div 
          onClick={() => onNavigateTab('reportes')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-hover-effect cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5A52] uppercase tracking-wider">Inversión Acumulada</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[28px] font-extrabold text-[#5A1F2D]">
            ${(totalInvestmentUSD / 1000000).toFixed(1)}M <span className="text-xs font-normal text-[#6B5A52]">USD</span>
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% respecto a metas</span>
          </div>
        </div>

        {/* Card 3: Empleos Directos */}
        <div 
          onClick={() => onNavigateTab('empresas')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-hover-effect cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5A52] uppercase tracking-wider">Empleos Directos</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[28px] font-extrabold text-[#5A1F2D]">
            {totalEmployees.toLocaleString()}
          </div>
          <div className="text-xs text-[#9A4D5D] font-semibold mt-0.5">
            Plazas formales validadas
          </div>
        </div>

        {/* Card 4: Alertas Activas */}
        <div 
          onClick={() => onNavigateTab('alertas')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-hover-effect cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5A52] uppercase tracking-wider">Alertas de Desvío</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[28px] font-extrabold text-rose-600">
            {alerts.length}
          </div>
          <div className="text-xs text-rose-600 font-semibold mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-alert-pulse"></span>
            <span>{highSeverityAlerts.length} casos de severidad alta</span>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Active Alerts requiring attention & Recent Solicitudes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Box: Critical Alerts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#5A1F2D]">
                Alertas de Cumplimiento Prioritarias
              </h2>
            </div>

            <button
              onClick={() => onNavigateTab('alertas')}
              className="text-xs font-bold text-[#9A4D5D] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Ver todas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 4).map((alert) => {
              const isHigh = alert.severity === 'Alta';

              return (
                <div
                  key={alert.id}
                  onClick={() => onSelectAlert(alert)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white card-hover-effect cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded uppercase shrink-0 ${
                          isHigh ? 'bg-rose-100 text-rose-800 animate-alert-pulse' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="font-bold text-xs text-[#5A1F2D] truncate">
                        {alert.company}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium truncate">
                      {alert.title}
                    </p>
                    <p className="text-[11px] text-[#6B5A52]">
                      Vence: {alert.dueDate || alert.date} • {alert.category}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    {alert.deficitValue && (
                      <span className="text-xs font-bold text-rose-600 block">
                        {alert.deficitValue}
                      </span>
                    )}
                    <span className="text-xs text-[#9A4D5D] font-semibold flex items-center gap-0.5">
                      Gestionar <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Box: Solicitudes in Pipeline */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#9A4D5D] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#5A1F2D]">
                Solicitudes de Régimen Recientes
              </h2>
            </div>

            <button
              onClick={() => onNavigateTab('solicitudes')}
              className="text-xs font-bold text-[#9A4D5D] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Ver todas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {solicitudes.slice(0, 4).map((sol) => (
              <div
                key={sol.id}
                onClick={() => onNavigateTab('solicitudes')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white card-hover-effect cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.2 rounded">
                      {sol.id}
                    </span>
                    <span className="font-bold text-xs text-[#5A1F2D] truncate">
                      {sol.companyName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#6B5A52]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {sol.zonaFranca}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">
                      ${(sol.investmentUSD / 1000000).toFixed(1)}M USD
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      sol.status === 'Aprobada'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sol.status === 'En Evaluación'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {sol.status}
                  </span>
                  <div className="text-[11px] text-indigo-600 font-bold mt-1 flex items-center justify-end gap-1">
                    <Cpu className="w-3 h-3" />
                    <span>{sol.aiScore}% IA</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
