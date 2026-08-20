import React from 'react';
import { AlertItem } from '../../types';
import { 
  Building2, 
  AlertTriangle, 
  Calendar, 
  User, 
  ChevronRight,
  MoreVertical,
  Plus,
  Users,
  DollarSign
} from 'lucide-react';

interface AlertsKanbanViewProps {
  alerts: AlertItem[];
  onSelectAlert: (alert: AlertItem) => void;
  onUpdateStatus: (alertId: string, newStatus: string) => void;
}

export const AlertsKanbanView: React.FC<AlertsKanbanViewProps> = ({
  alerts,
  onSelectAlert,
  onUpdateStatus,
}) => {
  const columns = [
    { id: 'Pendiente', label: 'Pendiente', color: 'border-t-rose-500 bg-rose-50/30' },
    { id: 'En Revisión', label: 'En Revisión', color: 'border-t-sky-500 bg-sky-50/30' },
    { id: 'Notificado', label: 'Notificado a Empresa', color: 'border-t-amber-500 bg-amber-50/30' },
    { id: 'Resuelto', label: 'Resuelto / Archivado', color: 'border-t-emerald-500 bg-emerald-50/30' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
      {columns.map((column) => {
        const columnAlerts = alerts.filter((a) => a.status === column.id);

        return (
          <div
            key={column.id}
            className={`bg-slate-100/70 rounded-2xl p-4 border border-slate-200 border-t-4 ${column.color} flex flex-col min-h-[500px]`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B2B4A]">
                  {column.label}
                </h3>
                <span className="w-5 h-5 rounded-full bg-white text-slate-700 text-[11px] font-bold flex items-center justify-center border border-slate-200 shadow-xs">
                  {columnAlerts.length}
                </span>
              </div>
            </div>

            {/* Kanban Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
              {columnAlerts.map((alert) => {
                const isHigh = alert.severity === 'Alta';

                return (
                  <div
                    key={alert.id}
                    onClick={() => onSelectAlert(alert)}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs card-hover-effect cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          isHigh
                            ? 'bg-rose-100 text-rose-800 animate-alert-pulse'
                            : alert.severity === 'Media'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[11px] text-[#4A5568] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {alert.date}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0B2B4A]">
                        <Building2 className="w-3.5 h-3.5 text-[#2D9CDB]" />
                        <span className="truncate">{alert.company}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800 mt-1 line-clamp-2">
                        {alert.title}
                      </h4>
                    </div>

                    {alert.deficitValue && (
                      <div className="text-[11px] bg-slate-50 p-1.5 rounded border border-slate-100 flex items-center justify-between text-[#4A5568]">
                        <span>Déficit:</span>
                        <span className="font-bold text-rose-600">{alert.deficitValue}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#4A5568]">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px] truncate max-w-[100px]">{alert.assignedTo || 'Laura M.'}</span>
                      </div>
                      <span className="text-[#2D9CDB] font-bold text-[11px] hover:underline flex items-center gap-0.5">
                        Ver <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}

              {columnAlerts.length === 0 && (
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  Sin casos en este estado
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
