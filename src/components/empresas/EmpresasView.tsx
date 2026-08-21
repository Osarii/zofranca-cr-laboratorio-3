import React, { useState } from 'react';
import { EmpresaItem } from '../../types';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

interface EmpresasViewProps {
  empresas: EmpresaItem[];
}

export const EmpresasView: React.FC<EmpresasViewProps> = ({ empresas }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');

  const filtered = empresas.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.zonaFranca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'all' || emp.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#E1B84C] tracking-tight">
            Directorio de Empresas Beneficiarias
          </h1>
          <p className="text-base text-[#C5C2BA] mt-1">
            Empresas activas con contrato de operación bajo el Régimen de Zonas Francas en Costa Rica
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#17181C] p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de empresa, código o zona franca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus-turquoise transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-[#17181C] border border-slate-200 rounded-lg text-[#E1B84C] focus-turquoise cursor-pointer"
          >
            <option value="all">Todos los Sectores</option>
            <option value="Ciencias de la Vida">Ciencias de la Vida</option>
            <option value="Servicios Digitales">Servicios Digitales</option>
            <option value="Manufactura Avanzada">Manufactura Avanzada</option>
            <option value="Semiconductores">Semiconductores</option>
          </select>
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            className="bg-[#17181C] rounded-2xl border border-slate-200 shadow-sm card-hover-effect flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#D2A12D] font-bold shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#E1B84C] leading-tight">
                      {emp.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      {emp.code}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 shrink-0">
                  {emp.status}
                </span>
              </div>

              <div className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 mb-3">
                {emp.sector}
              </div>

              <div className="space-y-1.5 text-xs text-[#C5C2BA]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{emp.zonaFranca}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#D2A12D]" />
                  <span>Inversión Registrada: <strong className="text-slate-900">${(emp.totalInvestmentUSD / 1000000).toFixed(2)}M USD</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#D2A12D]" />
                  <span>Personal Activo: <strong className="text-slate-900">{emp.employees} colaboradores</strong></span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-[#C5C2BA]">
              <span>Ingreso al Régimen: {emp.joinDate || '2019'}</span>
              <span className="font-bold text-[#D2A12D] flex items-center gap-0.5">
                Ver Ficha <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
