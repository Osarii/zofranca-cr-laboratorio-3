import React, { useState } from 'react';
import { EmpresaItem, AlertItem } from '../../types';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Users, 
  Building2, 
  Download, 
  TrendingUp, 
  Filter, 
  Search, 
  Calendar,
  Layers,
  FileCheck,
  MapPin,
  Sparkles
} from 'lucide-react';

interface ReporteCumplimientoProps {
  empresas: EmpresaItem[];
  alerts: AlertItem[];
  onOpenExportModal: () => void;
}

export const ReporteCumplimientoView: React.FC<ReporteCumplimientoProps> = ({
  empresas,
  alerts,
  onOpenExportModal,
}) => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmpresas = empresas.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.zonaFranca.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'all' || emp.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const totalCommittedInvestment = filteredEmpresas.reduce((acc, curr) => acc + curr.totalInvestmentUSD, 0);
  const totalActualInvestment = totalCommittedInvestment * 0.94; // 94% actual aggregate
  const totalCommittedJobs = filteredEmpresas.reduce((acc, curr) => acc + curr.employees, 0);
  const totalActualJobs = Math.round(totalCommittedJobs * 0.91);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#5A1F2D] tracking-tight">
            Auditoría y Fiscalización de Cumplimiento
          </h1>
          <p className="text-base text-[#6B5A52] mt-1">
            Informe anual de compromisos contractuales vs ejecución real (Ley de Régimen de Zonas Francas)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExportModal}
            className="px-5 py-2.5 bg-[#5A1F2D] hover:bg-[#6E2638] active:bg-[#2B0D16] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-150 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#9A4D5D]" />
            <span>Descargar Informe Anual (PDF)</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inversión Ejecutada vs Comprometida */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover-effect space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#5A1F2D]">Cumplimiento de Inversión</h3>
                <p className="text-xs text-[#6B5A52]">Compromiso Contractual vs Activos Fijos</p>
              </div>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
              94.0% Global
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#6B5A52]">
              <span>Ejecutado Real: <strong>${(totalActualInvestment / 1000000).toFixed(1)}M USD</strong></span>
              <span>Comprometido: <strong>${(totalCommittedInvestment / 1000000).toFixed(1)}M USD</strong></span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div className="bg-emerald-500 h-3 rounded-full transition-all duration-700" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>

        {/* Empleos Ejecutados vs Comprometidos */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover-effect space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#9A4D5D] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#5A1F2D]">Cumplimiento de Empleo</h3>
                <p className="text-xs text-[#6B5A52]">Planillas CCSS vs Metas Acordadas</p>
              </div>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-sky-100 text-sky-800">
              91.0% Global
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#6B5A52]">
              <span>Plazas Reales: <strong>{totalActualJobs.toLocaleString()}</strong></span>
              <span>Compromiso: <strong>{totalCommittedJobs.toLocaleString()}</strong></span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div className="bg-[#9A4D5D] h-3 rounded-full transition-all duration-700" style={{ width: '91%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por empresa fiscalizada o parque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus-turquoise transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-[#5A1F2D] focus-turquoise cursor-pointer"
          >
            <option value="2025">Ejercicio 2025</option>
            <option value="2024">Ejercicio 2024</option>
            <option value="2023">Ejercicio 2023</option>
          </select>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-[#5A1F2D] focus-turquoise cursor-pointer"
          >
            <option value="all">Todos los Sectores</option>
            <option value="Ciencias de la Vida">Ciencias de la Vida</option>
            <option value="Servicios Digitales">Servicios Digitales</option>
            <option value="Manufactura Avanzada">Manufactura Avanzada</option>
          </select>
        </div>
      </div>

      {/* Company Compliance Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/80 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Empresa Beneficiaria</th>
                <th className="py-3.5 px-4">Sector / Ubicación</th>
                <th className="py-3.5 px-4">Inversión (Meta vs Real)</th>
                <th className="py-3.5 px-4">Empleos (Meta vs Real)</th>
                <th className="py-3.5 px-4">Semáforo</th>
                <th className="py-3.5 px-4">Auditoría Fiscal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEmpresas.map((emp) => {
                const hasAlert = alerts.some((a) => a.company === emp.name && a.status !== 'Resuelto');
                const compScore = emp.complianceScore || 95;

                return (
                  <tr key={emp.id} className="hover:bg-sky-50/40 transition-colors duration-150">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#9A4D5D] font-bold">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-[#5A1F2D]">{emp.name}</div>
                          <div className="text-[11px] font-mono text-[#6B5A52]">{emp.code}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-semibold text-slate-800">{emp.sector}</div>
                      <div className="text-[11px] text-[#6B5A52] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {emp.zonaFranca}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-bold text-slate-900">
                        ${(emp.totalInvestmentUSD / 1000000).toFixed(2)}M USD
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold">100% de la meta</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-bold text-slate-900">
                        {emp.employees} Plazas
                      </div>
                      <div className="text-[11px] text-[#6B5A52]">Reportadas a CCSS</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {hasAlert ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 animate-alert-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Con Incidencia</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Conforme</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-semibold text-slate-700">
                        {emp.lastAuditDate || '12 Ene 2026'}
                      </div>
                      <div className="text-[11px] text-slate-500">Dictamen Favorable</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
