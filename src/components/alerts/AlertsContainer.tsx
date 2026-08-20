import React, { useState } from 'react';
import { AlertItem } from '../../types';
import { AlertsExecutiveView } from './AlertsExecutiveView';
import { AlertsKanbanView } from './AlertsKanbanView';
import { AlertsTableView } from './AlertsTableView';
import { AlertsCardsView } from './AlertsCardsView';
import { AlertDetailModal } from './AlertDetailModal';
import { 
  BarChart2, 
  Kanban, 
  Table as TableIcon, 
  Layers, 
  Bell, 
  ShieldAlert, 
  AlertTriangle
} from 'lucide-react';

interface AlertsContainerProps {
  alerts: AlertItem[];
  onUpdateStatus: (alertId: string, status: any) => void;
  onAssignAlert?: (alertId: string, user: string) => void;
  currentUser: string;
}

export const AlertsContainer: React.FC<AlertsContainerProps> = ({
  alerts,
  onUpdateStatus,
  onAssignAlert,
  currentUser,
}) => {
  const [activeView, setActiveView] = useState<'ejecutiva' | 'kanban' | 'tabla' | 'tarjetas'>('ejecutiva');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const viewModes = [
    { id: 'ejecutiva', label: 'Vista Ejecutiva', icon: BarChart2 },
    { id: 'kanban', label: 'Tablero Kanban', icon: Kanban },
    { id: 'tabla', label: 'Vista de Tabla', icon: TableIcon },
    { id: 'tarjetas', label: 'Vista de Tarjetas', icon: Layers },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Row with View Selector */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Bell className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-[28px] font-extrabold text-[#0B2B4A] tracking-tight">
              Alertas de Cumplimiento
            </h1>
          </div>
          <p className="text-xs text-[#4A5568] mt-1">
            Fiscalización y cumplimiento normativo del Régimen de Zonas Francas (Ley 7210)
          </p>
        </div>

        {/* View Mode Switcher Pills with hover effects */}
        <div className="flex flex-wrap items-center bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 gap-1">
          {viewModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeView === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveView(mode.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D9CDB] cursor-pointer ${
                  isActive
                    ? 'bg-[#0B2B4A] text-white shadow-xs'
                    : 'text-[#4A5568] hover:text-[#0B2B4A] hover:bg-white/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2D9CDB]' : 'text-slate-400'}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active View Mode */}
      {activeView === 'ejecutiva' && (
        <AlertsExecutiveView
          alerts={alerts}
          onSelectAlert={(alert) => setSelectedAlert(alert)}
          onManageAll={() => setActiveView('tabla')}
        />
      )}

      {activeView === 'kanban' && (
        <AlertsKanbanView
          alerts={alerts}
          onSelectAlert={(alert) => setSelectedAlert(alert)}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      {activeView === 'tabla' && (
        <AlertsTableView
          alerts={alerts}
          onSelectAlert={(alert) => setSelectedAlert(alert)}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      {activeView === 'tarjetas' && (
        <AlertsCardsView
          alerts={alerts}
          onSelectAlert={(alert) => setSelectedAlert(alert)}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      {/* Detail Modal */}
      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onStatusChange={onUpdateStatus}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
