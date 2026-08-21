import React, { useState } from 'react';
import { AlertItem } from '../../types';
import { 
  Building2, 
  AlertTriangle, 
  Bell, 
  Calendar, 
  User, 
  Search, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Filter,
  Download,
  DollarSign,
  Users
} from 'lucide-react';

interface AlertsTableViewProps {
  alerts: AlertItem[];
  onSelectAlert: (alert: AlertItem) => void;
  onUpdateStatus?: (alertId: string, newStatus: string) => void;
}

export const AlertsTableView: React.FC<AlertsTableViewProps> = ({
  alerts,
  onSelectAlert,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.tipoIncumplimiento && alert.tipoIncumplimiento.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="bg-[#17181C] rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
      {/* Table Header Filter controls */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por empresa, alerta o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#17181C] border border-slate-200 rounded-lg focus-turquoise transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-[#17181C] border border-slate-200 rounded-lg text-[#E1B84C] focus-turquoise cursor-pointer"
          >
            <option value="all">Todas las Severidades</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-[#17181C] border border-slate-200 rounded-lg text-[#E1B84C] focus-turquoise cursor-pointer"
          >
            <option value="all">Todos los Estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Revisión">En Revisión</option>
            <option value="Notificado">Notificado</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100/70 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">Empresa / Ubicación</th>
              <th className="py-3.5 px-4">Incidencia / Tipo</th>
              <th className="py-3.5 px-4">Severidad</th>
              <th className="py-3.5 px-4">Responsable</th>
              <th className="py-3.5 px-4">Fecha Límite</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredAlerts.map((alert) => {
              const isHigh = alert.severity === 'Alta';
              const isMedium = alert.severity === 'Media';

              return (
                <tr
                  key={alert.id}
                  className="hover:bg-sky-50/40 transition-colors duration-150 group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-[#D2A12D] shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#E1B84C]">{alert.company}</div>
                        <div className="text-xs text-[#C5C2BA]">{alert.zonaFranca || 'Gran Área Metropolitana'}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 text-xs">{alert.title}</div>
                    <div className="text-[11px] text-[#C5C2BA] line-clamp-1 max-w-xs">{alert.tipoIncumplimiento || alert.description}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                        isHigh
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isMedium
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isHigh && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-alert-pulse"></span>}
                      {alert.severity}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5 text-xs text-[#C5C2BA]">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.assignedTo || 'Laura Monge'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5 text-xs text-[#C5C2BA]">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.dueDate || alert.date}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        alert.status === 'Resuelto'
                          ? 'bg-emerald-50 text-emerald-700'
                          : alert.status === 'En Revisión'
                          ? 'bg-sky-50 text-sky-700'
                          : alert.status === 'Notificado'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectAlert(alert)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-[#7A5B12] hover:text-white text-[#E1B84C] rounded-lg text-xs font-bold transition-all duration-150 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Revisar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAlerts.length === 0 && (
        <div className="p-8 text-center text-xs text-[#C5C2BA]">
          No hay incidencias que coincidan con los criterios de búsqueda.
        </div>
      )}
    </div>
  );
};
