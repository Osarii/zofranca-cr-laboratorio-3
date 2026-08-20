import React, { useState } from 'react';
import { AlertItem } from '../../types';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar, 
  AlertTriangle, 
  Bell, 
  ChevronRight, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  User, 
  TrendingDown,
  ArrowUpDown
} from 'lucide-react';

interface AlertsCardsViewProps {
  alerts: AlertItem[];
  onSelectAlert: (alert: AlertItem) => void;
  onUpdateStatus?: (alertId: string, newStatus: string) => void;
}

export const AlertsCardsView: React.FC<AlertsCardsViewProps> = ({
  alerts,
  onSelectAlert,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = 
      alert.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.tipoIncumplimiento && alert.tipoIncumplimiento.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || alert.category === categoryFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por empresa, motivo o palabra clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus-turquoise transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-[#0B2B4A] focus-turquoise cursor-pointer"
          >
            <option value="all">Todas las Severidades</option>
            <option value="Alta">Severidad Alta</option>
            <option value="Media">Severidad Media</option>
            <option value="Baja">Severidad Baja</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-[#0B2B4A] focus-turquoise cursor-pointer"
          >
            <option value="all">Todos los Estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Revisión">En Revisión</option>
            <option value="Notificado">Notificado</option>
            <option value="Resuelto">Resuelto</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-[#0B2B4A] focus-turquoise cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Empleo">Empleo</option>
            <option value="Inversión">Inversión</option>
            <option value="Fiscal">Fiscal</option>
            <option value="Ambiental">Ambiental</option>
            <option value="Operativo">Operativo</option>
          </select>
        </div>
      </div>

      {/* Cards Grid with subtle shadow intensifying on hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAlerts.map((alert) => {
          const isHigh = alert.severity === 'Alta';
          const isMedium = alert.severity === 'Media';

          return (
            <div
              key={alert.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm card-hover-effect flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0B2B4A] font-bold shrink-0">
                      <Building2 className="w-5 h-5 text-[#2D9CDB]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0B2B4A] leading-tight">
                        {alert.company}
                      </h3>
                      <div className="flex items-center text-xs text-[#4A5568] mt-0.5">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                        <span>{alert.zonaFranca || 'Zona Franca Central'}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 ${
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
                </div>

                <div className="space-y-1 mt-2">
                  <h4 className="text-sm font-bold text-slate-800 leading-snug">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-[#4A5568] line-clamp-2 leading-relaxed">
                    {alert.description || alert.tipoIncumplimiento}
                  </p>
                </div>
              </div>

              {/* Metrics / Compliance Context */}
              <div className="px-5 py-3 bg-slate-50 border-y border-slate-100 space-y-2 text-xs">
                {alert.deficitValue && (
                  <div className="flex items-center justify-between text-[#4A5568]">
                    <span className="font-medium flex items-center gap-1.5">
                      {alert.category === 'Empleo' ? <Users className="w-3.5 h-3.5 text-[#2D9CDB]" /> : <DollarSign className="w-3.5 h-3.5 text-[#2D9CDB]" />}
                      Déficit Registrado:
                    </span>
                    <span className="font-bold text-rose-600">
                      {alert.deficitValue}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#4A5568]">
                  <span className="font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Responsable Asignado:
                  </span>
                  <span className="font-semibold text-slate-700">
                    {alert.assignedTo || 'Laura Monge'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#4A5568]">
                  <span className="font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Fecha Límite:
                  </span>
                  <span className="font-semibold text-slate-700">
                    {alert.dueDate || '15 Mar 2026'}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      alert.status === 'Resuelto'
                        ? 'bg-emerald-500'
                        : alert.status === 'En Revisión'
                        ? 'bg-sky-500'
                        : alert.status === 'Notificado'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {alert.status}
                  </span>
                </div>

                <button
                  onClick={() => onSelectAlert(alert)}
                  className="px-3.5 py-1.5 bg-[#0B2B4A] hover:bg-[#153e6b] active:bg-[#071d33] text-white text-xs font-bold rounded-lg shadow-xs hover:shadow-md transition-all duration-150 flex items-center gap-1 cursor-pointer"
                >
                  <span>Atender Caso</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0B2B4A]">No se encontraron alertas con estos filtros</h3>
          <p className="text-xs text-[#4A5568] max-w-sm mx-auto">
            Prueba ajustando los términos de búsqueda o restableciendo los selectores de severidad y categoría.
          </p>
        </div>
      )}
    </div>
  );
};
