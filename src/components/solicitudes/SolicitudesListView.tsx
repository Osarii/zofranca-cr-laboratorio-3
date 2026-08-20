import React, { useState } from 'react';
import { SolicitudZF } from '../../types';
import { 
  FileText, 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileCheck,
  TrendingUp,
  Download
} from 'lucide-react';

interface SolicitudesListViewProps {
  solicitudes: SolicitudZF[];
  onSelectSolicitud: (solicitud: SolicitudZF) => void;
  onOpenNewModal: () => void;
  onOpenExportModal?: () => void;
}

export const SolicitudesListView: React.FC<SolicitudesListViewProps> = ({
  solicitudes,
  onSelectSolicitud,
  onOpenNewModal,
  onOpenExportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regimenFilter, setRegimenFilter] = useState('all');

  const filtered = solicitudes.filter((s) => {
    const matchesSearch = 
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.zonaFranca.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesRegimen = regimenFilter === 'all' || s.regimenType === regimenFilter;

    return matchesSearch && matchesStatus && matchesRegimen;
  });

  const totalInvestment = solicitudes.reduce((acc, curr) => acc + curr.investmentUSD, 0);
  const totalJobs = solicitudes.reduce((acc, curr) => acc + curr.jobsCommitment, 0);
  const avgViability = Math.round(
    solicitudes.reduce((acc, curr) => acc + curr.aiScore, 0) / (solicitudes.length || 1)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header zone with action button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#0B2B4A] tracking-tight">
            Gestión de Solicitudes de Régimen
          </h1>
          <p className="text-base text-[#4A5568] mt-1">
            Evaluación automatizada con IA para nuevas empresas e inversión bajo Ley 7210
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenExportModal && (
            <button
              onClick={onOpenExportModal}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-[#0B2B4A] text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#2D9CDB]" />
              <span>Exportar PDF</span>
            </button>
          )}

          <button
            onClick={onOpenNewModal}
            className="px-5 py-2.5 bg-[#2D9CDB] hover:bg-[#2387be] active:bg-[#1d73a3] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-150 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Solicitud</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-hover-effect">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Inversión Comprometida</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[28px] font-extrabold text-[#0B2B4A]">
            ${(totalInvestment / 1000000).toFixed(1)}M <span className="text-xs font-normal text-[#4A5568]">USD</span>
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>En {solicitudes.length} proyectos analizados</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-hover-effect">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Empleos Proyectados</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#2D9CDB] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[28px] font-extrabold text-[#0B2B4A]">
            {totalJobs.toLocaleString()} <span className="text-xs font-normal text-[#4A5568]">plazas directas</span>
          </div>
          <div className="text-xs text-[#2D9CDB] font-semibold mt-0.5">
            Cumplimiento promedio: 100%
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-hover-effect">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Índice Viabilidad IA</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[28px] font-extrabold text-indigo-600">
            {avgViability}/100
          </div>
          <div className="text-xs text-indigo-600 font-semibold mt-0.5">
            Evaluación algorítmica de riesgo
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, empresa, sector o parque industrial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus-turquoise transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-[#0B2B4A] focus-turquoise cursor-pointer"
          >
            <option value="all">Todos los Estados</option>
            <option value="Aprobada">Aprobada</option>
            <option value="En Evaluación">En Evaluación</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Rechazada">Rechazada</option>
          </select>

          <select
            value={regimenFilter}
            onChange={(e) => setRegimenFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-[#0B2B4A] focus-turquoise cursor-pointer"
          >
            <option value="all">Todos los Tipos de Régimen</option>
            <option value="Servicios (Inciso c)">Servicios (Inciso c)</option>
            <option value="Manufactura (Inciso a)">Manufactura (Inciso a)</option>
            <option value="Comercializadora (Inciso b)">Comercializadora (Inciso b)</option>
            <option value="Administradora de Parque (Inciso f)">Administradora de Parque</option>
          </select>
        </div>
      </div>

      {/* Grid of Solicitudes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((solicitud) => {
          const isHighViability = solicitud.aiScore >= 80;
          const isMediumViability = solicitud.aiScore >= 60 && solicitud.aiScore < 80;

          return (
            <div
              key={solicitud.id}
              onClick={() => onSelectSolicitud(solicitud)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm card-hover-effect cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {solicitud.id}
                  </span>
                  
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      solicitud.status === 'Aprobada'
                        ? 'bg-emerald-100 text-emerald-800'
                        : solicitud.status === 'En Evaluación'
                        ? 'bg-sky-100 text-sky-800'
                        : solicitud.status === 'Pendiente'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {solicitud.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2.5 mt-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#2D9CDB] shrink-0 font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0B2B4A] leading-tight">
                      {solicitud.companyName}
                    </h3>
                    <div className="text-xs text-[#4A5568] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{solicitud.zonaFranca}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                  {solicitud.regimenType}
                </div>
              </div>

              {/* Data & AI Score */}
              <div className="px-5 py-3 bg-slate-50 border-y border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#4A5568]">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#2D9CDB]" />
                    Inversión:
                  </span>
                  <span className="font-bold text-slate-900">
                    ${(solicitud.investmentUSD / 1000000).toFixed(2)}M USD
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#4A5568]">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#2D9CDB]" />
                    Empleos:
                  </span>
                  <span className="font-bold text-slate-900">
                    {solicitud.jobsCommitment} directos
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="flex items-center gap-1 font-bold text-[#0B2B4A]">
                    <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                    Viabilidad IA:
                  </span>
                  <span
                    className={`font-extrabold text-xs px-2 py-0.5 rounded ${
                      isHighViability
                        ? 'bg-emerald-100 text-emerald-800'
                        : isMediumViability
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {solicitud.aiScore}%
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-white flex items-center justify-between text-xs text-[#4A5568]">
                <span>Ingreso: {solicitud.submissionDate}</span>
                <span className="font-bold text-[#2D9CDB] flex items-center gap-0.5 group-hover:underline">
                  Ver Dictamen <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0B2B4A]">No se encontraron solicitudes</h3>
          <p className="text-xs text-[#4A5568] max-w-sm mx-auto">
            Ajusta los filtros de búsqueda o registra una nueva solicitud de régimen para comenzar.
          </p>
        </div>
      )}
    </div>
  );
};
