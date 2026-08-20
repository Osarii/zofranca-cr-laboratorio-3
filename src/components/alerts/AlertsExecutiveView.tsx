import React, { useState } from 'react';
import { AlertItem } from '../../types';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Building2, 
  ChevronRight, 
  Filter, 
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  User,
  Users,
  DollarSign,
  MapPin
} from 'lucide-react';

interface AlertsExecutiveProps {
  alerts: AlertItem[];
  onSelectAlert: (alert: AlertItem) => void;
  onManageAll: () => void;
}

export const AlertsExecutiveView: React.FC<AlertsExecutiveProps> = ({
  alerts,
  onSelectAlert,
  onManageAll,
}) => {
  const [activeFilter, setActiveFilter] = useState<'Todas' | 'Alta' | 'Media' | 'Baja'>('Todas');

  const totalAlerts = alerts.length;
  const highAlerts = alerts.filter(a => a.severity === 'Alta').length;
  const mediumAlerts = alerts.filter(a => a.severity === 'Media').length;
  const lowAlerts = alerts.filter(a => a.severity === 'Baja').length;

  const filteredAlerts = activeFilter === 'Todas'
    ? alerts
    : alerts.filter(a => a.severity === activeFilter);

  // Sparkline data points for 30-day trend chart
  const sparklineData = [12, 14, 11, 16, 18, 15, 20, 22, 19, 24, 23, 27];
  const highSparkData = [3, 4, 3, 5, 6, 4, 7, 8, 6, 8, 7, 9];
  const mediumSparkData = [8, 9, 7, 10, 11, 9, 12, 13, 11, 14, 13, 16];

  const renderSparkline = (data: number[], color: string) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 140;
    const height = 36;
    
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Highlight latest point */}
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * (height - 8) - 4}
          r="3.5"
          fill={color}
          className="animate-pulse"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 3 Top Summary Sparkline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Alertas (30 días) */}
        <div 
          onClick={() => setActiveFilter('Todas')}
          className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer card-hover-effect ${
            activeFilter === 'Todas' ? 'border-[#9A4D5D] ring-2 ring-[#9A4D5D]/20' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5A52] uppercase tracking-wider">
              Total Alertas (30 días)
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#9A4D5D]">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-baseline justify-between mt-3">
            <div>
              <div className="text-[32px] font-extrabold text-[#5A1F2D] leading-tight">
                {totalAlerts}
              </div>
              <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18% este mes</span>
              </div>
            </div>
            <div className="pr-1">
              {renderSparkline(sparklineData, '#9A4D5D')}
            </div>
          </div>
        </div>

        {/* Card 2: Severidad Alta */}
        <div 
          onClick={() => setActiveFilter('Alta')}
          className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer card-hover-effect ${
            activeFilter === 'Alta' ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-alert-pulse"></span>
              Severidad Alta
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-baseline justify-between mt-3">
            <div>
              <div className="text-[32px] font-extrabold text-rose-600 leading-tight">
                {highAlerts}
              </div>
              <div className="text-xs text-rose-600 font-semibold mt-0.5">
                Requieren atención urgente
              </div>
            </div>
            <div className="pr-1">
              {renderSparkline(highSparkData, '#ef4444')}
            </div>
          </div>
        </div>

        {/* Card 3: Severidad Media */}
        <div 
          onClick={() => setActiveFilter('Media')}
          className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer card-hover-effect ${
            activeFilter === 'Media' ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Severidad Media
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-baseline justify-between mt-3">
            <div>
              <div className="text-[32px] font-extrabold text-amber-600 leading-tight">
                {mediumAlerts}
              </div>
              <div className="text-xs text-amber-600 font-semibold mt-0.5">
                En seguimiento preventivo
              </div>
            </div>
            <div className="pr-1">
              {renderSparkline(mediumSparkData, '#f59e0b')}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Executive Alert Cards */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#5A1F2D]">
              Panel Ejecutivo de Incidencias
            </h2>
            <p className="text-sm text-[#6B5A52] mt-0.5">
              Supervisión de compromisos de inversión, empleo y normativa Ley 7210
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('Todas')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                activeFilter === 'Todas'
                  ? 'bg-[#5A1F2D] text-white shadow-sm'
                  : 'bg-slate-100 text-[#6B5A52] hover:bg-slate-200'
              }`}
            >
              Todas ({totalAlerts})
            </button>
            <button
              onClick={() => setActiveFilter('Alta')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                activeFilter === 'Alta'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Alta ({highAlerts})
            </button>
            <button
              onClick={() => setActiveFilter('Media')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                activeFilter === 'Media'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Media ({mediumAlerts})
            </button>
          </div>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAlerts.slice(0, 8).map((alert) => {
            const isHigh = alert.severity === 'Alta';
            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert(alert)}
                className={`bg-white rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer card-hover-effect ${
                  isHigh ? 'border-slate-200 hover:border-rose-300' : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 truncate">
                    <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-[#9A4D5D] shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#5A1F2D] truncate" title={alert.company}>
                      {alert.company}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase shrink-0 ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-alert-pulse'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 line-clamp-2">
                    {alert.title}
                  </div>
                  <p className="text-[11px] text-[#6B5A52] line-clamp-2 leading-relaxed">
                    {alert.description || alert.tipoIncumplimiento}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#6B5A52]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {alert.date}
                  </span>
                  <span className="font-semibold text-[#9A4D5D] group-hover:underline flex items-center gap-0.5">
                    Detalle <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Manage All Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={onManageAll}
            className="px-6 py-2.5 bg-[#5A1F2D] hover:bg-[#6E2638] active:bg-[#2B0D16] text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all duration-150 flex items-center space-x-2 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#9A4D5D]" />
            <span>Gestionar Todas las Alertas en Vista Detallada</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
