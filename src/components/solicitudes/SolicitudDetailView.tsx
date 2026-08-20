import React, { useState } from 'react';
import { SolicitudZF } from '../../types';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  FileText, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download, 
  Share2, 
  ShieldCheck, 
  FileCheck,
  Send,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface SolicitudDetailViewProps {
  solicitud: SolicitudZF;
  onBack: () => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
  onOpenExportModal: () => void;
  currentUser: string;
}

export const SolicitudDetailView: React.FC<SolicitudDetailViewProps> = ({
  solicitud,
  onBack,
  onUpdateStatus,
  onOpenExportModal,
  currentUser,
}) => {
  const [isReevaluating, setIsReevaluating] = useState(false);
  const [currentScore, setCurrentScore] = useState(solicitud.aiScore);
  const [internalNotes, setInternalNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleReevaluate = () => {
    setIsReevaluating(true);
    setTimeout(() => {
      const variation = Math.floor(Math.random() * 5) - 2;
      const newScore = Math.min(100, Math.max(50, currentScore + variation));
      setCurrentScore(newScore);
      setIsReevaluating(false);
      setStatusMessage('Recálculo de viabilidad completado con datos actualizados de BCCR y PROCOMER');
      setTimeout(() => setStatusMessage(null), 4000);
    }, 1200);
  };

  const handleStatusChange = (newStatus: string) => {
    onUpdateStatus(solicitud.id, newStatus);
    setStatusMessage(`Estado actualizado a: ${newStatus}`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // SVG Gauge calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * (circumference * 0.75); // 270 deg gauge

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-bold text-[#0B2B4A] hover:text-[#2D9CDB] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al listado de solicitudes</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenExportModal}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-[#0B2B4A] text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-150 flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#2D9CDB]" />
            <span>Generar Dictamen Oficial (PDF)</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-sky-50 border border-sky-200 text-[#0B2B4A] rounded-xl text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-2">
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Grid: Left Column Details & Right Column AI Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Company & Project Detail */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#2D9CDB]">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-slate-500">{solicitud.id}</div>
                  <h1 className="text-xl font-extrabold text-[#0B2B4A] leading-tight">
                    {solicitud.companyName}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
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
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div>
                <span className="text-[11px] text-[#4A5568] uppercase font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  Ubicación
                </span>
                <p className="text-xs font-bold text-[#0B2B4A] mt-1">{solicitud.zonaFranca}</p>
                <p className="text-[11px] text-[#4A5568]">{solicitud.locationType}</p>
              </div>

              <div>
                <span className="text-[11px] text-[#4A5568] uppercase font-bold flex items-center gap-1">
                  <Layers className="w-3 h-3 text-slate-400" />
                  Régimen
                </span>
                <p className="text-xs font-bold text-[#0B2B4A] mt-1">{solicitud.regimenType}</p>
                <p className="text-[11px] text-[#4A5568]">{solicitud.sector}</p>
              </div>

              <div>
                <span className="text-[11px] text-[#4A5568] uppercase font-bold flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#2D9CDB]" />
                  Inversión Total
                </span>
                <p className="text-xs font-extrabold text-[#0B2B4A] mt-1">
                  ${(solicitud.investmentUSD / 1000000).toFixed(2)}M USD
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold">Min: $150k USD</p>
              </div>

              <div>
                <span className="text-[11px] text-[#4A5568] uppercase font-bold flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#2D9CDB]" />
                  Empleo Proyectado
                </span>
                <p className="text-xs font-extrabold text-[#0B2B4A] mt-1">
                  {solicitud.jobsCommitment} Plazas
                </p>
                <p className="text-[11px] text-[#4A5568]">Directas / Formales</p>
              </div>
            </div>
          </div>

          {/* Project Details & Legal compliance */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#0B2B4A]">
              Memoria Descriptiva del Proyecto
            </h2>
            <p className="text-xs text-[#4A5568] leading-relaxed">
              {solicitud.description}
            </p>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="text-xs font-bold text-[#0B2B4A] uppercase tracking-wide">
                Requisitos Normativos y Formalidades Ley 7210
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800">Inversión Mínima Inicial:</span>
                    <p className="text-[#4A5568] text-[11px]">Supera con creces el umbral mínimo legal requerido para zona franca.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800">Vínculo con Proveeduría Local:</span>
                    <p className="text-[#4A5568] text-[11px]">Contempla encadenamientos productivos con PYMES costarricenses.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800">Cumplimiento Ambiental:</span>
                    <p className="text-[#4A5568] text-[11px]">Viabilidad ambiental SETENA tramitada conforme al reglamento.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800">Estructura Societaria y Fiscal:</span>
                    <p className="text-[#4A5568] text-[11px]">Personería jurídica al día y sin deudas tributarias en Tributación Directa.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Notes & Decision Panel */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#0B2B4A]">
              Resolución y Dictamen Técnico
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#4A5568]">Notas de Evaluación Técnica</label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Ingrese observaciones técnicas para el acta de recomendación a COMEX..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus-turquoise transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-[#4A5568]">
                Dictaminado por: <strong className="text-slate-800">{currentUser}</strong>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStatusChange('Rechazada')}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-all duration-150 cursor-pointer"
                >
                  Denegar
                </button>
                <button
                  onClick={() => handleStatusChange('En Evaluación')}
                  className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-xl transition-all duration-150 cursor-pointer"
                >
                  Solicitar Prevención
                </button>
                <button
                  onClick={() => handleStatusChange('Aprobada')}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all duration-150 flex items-center space-x-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Recomendar Otorgamiento</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis & Viability Engine */}
        <div className="space-y-6">
          {/* AI Score Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#0B2B4A]">
                  Motor de IA ZoFranca
                </h3>
              </div>

              <button
                onClick={handleReevaluate}
                disabled={isReevaluating}
                className="p-1.5 text-xs text-[#2D9CDB] hover:bg-sky-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-bold disabled:opacity-50"
                title="Recalcular con IA"
              >
                {isReevaluating ? (
                  /* Custom Turquoise spinner as requested */
                  <div className="w-4 h-4 border-2 border-[#2D9CDB] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Sparkles className="w-4 h-4 text-[#2D9CDB]" />
                )}
                <span>{isReevaluating ? 'Calculando...' : 'Reevaluar'}</span>
              </button>
            </div>

            {/* Visual Circular Gauge */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-135" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                    strokeDasharray={circumference * 0.75}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={currentScore >= 80 ? '#10b981' : currentScore >= 60 ? '#2D9CDB' : '#ef4444'}
                    strokeWidth="12"
                    strokeDasharray={circumference * 0.75}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[34px] font-extrabold text-[#0B2B4A] tracking-tight">
                    {currentScore}%
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A5568]">
                    {currentScore >= 80 ? 'Alta Viabilidad' : currentScore >= 60 ? 'Viabilidad Media' : 'Riesgo Elevado'}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Breakdown Criteria */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-[#0B2B4A] uppercase tracking-wide">
                Desglose Algorítmico
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#4A5568]">
                  <span>Solvencia Financiera:</span>
                  <span className="font-bold text-[#0B2B4A]">92%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-[#2D9CDB] h-1.5 rounded-full" style={{ width: '92%' }}></div>
                </div>

                <div className="flex justify-between items-center text-[#4A5568] pt-1">
                  <span>Impacto en Empleo Técnico:</span>
                  <span className="font-bold text-[#0B2B4A]">88%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '88%' }}></div>
                </div>

                <div className="flex justify-between items-center text-[#4A5568] pt-1">
                  <span>Riesgo de Deslocalización:</span>
                  <span className="font-bold text-emerald-600">Bajo (12%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>

            {/* AI Summary Recommendation */}
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1 text-xs">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Recomendación del Asistente
              </span>
              <p className="text-indigo-900/80 text-[11px] leading-relaxed">
                El proyecto cumple satisfactoriamente con los umbrales de la Ley 7210. Se sugiere dictamen favorable sujeto a la verificación semestral de metas de contratación técnica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
