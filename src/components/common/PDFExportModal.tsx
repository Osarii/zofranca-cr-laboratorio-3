import React from 'react';
import { SolicitudZF } from '../../types';
import { X, Printer, Download, CheckCircle2, ShieldCheck, FileText, Building2, DollarSign, Users, Cpu } from 'lucide-react';

interface PDFProps {
  solicitud?: SolicitudZF | null;
  item?: any;
  onClose: () => void;
}

export const PDFExportModal: React.FC<PDFProps> = ({ solicitud, item, onClose }) => {
  const currentItem = solicitud || item;
  if (!currentItem) return null;

  const company = currentItem.companyName || currentItem.company || 'Empresa Beneficiaria';
  const sector = currentItem.sector || 'Ciencias de la Vida';
  const score = currentItem.aiScore || 88;
  const investment = currentItem.investmentUSD || currentItem.investmentAmount || 2500000;
  const jobs = currentItem.jobsCommitment || currentItem.projectedJobs || 75;
  const status = currentItem.status || 'En Evaluación';
  const expNumber = currentItem.id || 'ZF-2026-001';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#7A5B12]/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#17181C] rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#7A5B12] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#D2A12D]" />
            <span className="font-extrabold text-sm">ZoFranca CR — Dictamen Oficial Ley 7210</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-300 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate preview */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 text-xs bg-slate-50/50">
          <div className="border-b-2 border-[#7A5B12] pb-4 flex justify-between items-start">
            <div>
              <div className="text-xl font-extrabold text-[#E1B84C]">PROCOMER / COMEX</div>
              <div className="text-[11px] text-[#C5C2BA] font-semibold">República de Costa Rica — Régimen de Zonas Francas</div>
            </div>
            <div className="text-right font-mono text-[11px] text-[#C5C2BA]">
              <div>Expediente: <strong className="text-slate-800">{expNumber}</strong></div>
              <div>Fecha: {new Date().toLocaleDateString('es-CR')}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#E1B84C] uppercase tracking-wide">
              Certificado de Dictamen Técnico de Viabilidad
            </h3>
            <p className="text-[#C5C2BA] mt-1 leading-relaxed text-xs">
              Por medio del presente se certifica que la empresa <strong className="text-slate-900">{company}</strong> ha sido evaluada mediante los estándares técnicos y legales de la Ley N° 7210 para operar en el sector <strong className="text-slate-900">{sector}</strong>.
            </p>
          </div>

          <div className="bg-[#17181C] p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 shadow-xs">
            <div>
              <span className="font-bold text-[#C5C2BA] block text-[11px] uppercase">Puntaje Viabilidad IA:</span>
              <span className="text-base font-extrabold text-[#D2A12D] flex items-center gap-1">
                <Cpu className="w-4 h-4" /> {score} / 100
              </span>
            </div>
            <div>
              <span className="font-bold text-[#C5C2BA] block text-[11px] uppercase">Estado Dictamen:</span>
              <span className="text-base font-extrabold text-[#E1B84C]">{status}</span>
            </div>
            <div>
              <span className="font-bold text-[#C5C2BA] block text-[11px] uppercase">Inversión Comprometida:</span>
              <span className="text-slate-900 font-bold text-xs">USD ${(investment).toLocaleString()}</span>
            </div>
            <div>
              <span className="font-bold text-[#C5C2BA] block text-[11px] uppercase">Empleos Directos:</span>
              <span className="text-slate-900 font-bold text-xs">{jobs} Plazas Formales</span>
            </div>
          </div>

          <div className="text-[11px] text-[#C5C2BA] leading-relaxed bg-[#17181C] p-3.5 rounded-xl border border-slate-200">
            <strong>Fundamento Normativo:</strong> El proyecto satisface los requisitos de inversión en activos fijos nuevos y generación de empleo formal en consonancia con los objetivos de desarrollo económico y descentralización territorial de Costa Rica.
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-center">
            <div className="w-44 border-t border-slate-400 pt-1 text-[10px] text-[#C5C2BA] font-bold">
              Firma Digital Analista
            </div>
            <div className="w-44 border-t border-slate-400 pt-1 text-[10px] text-[#C5C2BA] font-bold">
              Sello Dirección General COMEX
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex justify-end gap-2">
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 bg-[#17181C] border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-[#A77B1C] hover:bg-[#BF9124] active:bg-[#8A6516] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Dictamen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
