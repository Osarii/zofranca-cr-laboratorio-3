import React, { useState } from 'react';
import { SolicitudZF } from '../../types';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  FileText, 
  Cpu, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface NewSolicitudModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSolicitud: (solicitud: SolicitudZF) => void;
}

export const NewSolicitudModal: React.FC<NewSolicitudModalProps> = ({
  isOpen,
  onClose,
  onAddSolicitud,
}) => {
  if (!isOpen) return null;

  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('Ciencias de la Vida');
  const [regimenType, setRegimenType] = useState('Servicios (Inciso c)');
  const [zonaFranca, setZonaFranca] = useState('Coyol Free Zone');
  const [locationType, setLocationType] = useState('Dentro de GAM');
  const [investmentUSD, setInvestmentUSD] = useState(2500000);
  const [jobsCommitment, setJobsCommitment] = useState(75);
  const [description, setDescription] = useState('');
  const [isSimulatingAI, setIsSimulatingAI] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  const handleSimulateAI = () => {
    setIsSimulatingAI(true);
    setTimeout(() => {
      // Calculate realistic AI viability score based on inputs
      let score = 75;
      if (investmentUSD >= 2000000) score += 10;
      if (jobsCommitment >= 50) score += 8;
      if (locationType === 'Fuera de GAM') score += 5; // Decentralization bonus in Costa Rica
      score = Math.min(98, score);
      
      setCalculatedScore(score);
      setIsSimulatingAI(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) return;

    const newId = `ZF-2026-${Math.floor(100 + Math.random() * 900)}`;
    const finalScore = calculatedScore || Math.floor(78 + Math.random() * 18);

    const newSolicitud: SolicitudZF = {
      id: newId,
      company: companyName,
      companyName,
      sector,
      regimen: regimenType,
      regimenType,
      zonaFranca,
      location: zonaFranca,
      locationType: locationType as 'Dentro de GAM' | 'Fuera de GAM',
      investmentAmount: Number(investmentUSD),
      investmentUSD: Number(investmentUSD),
      projectedJobs: Number(jobsCommitment),
      jobsCommitment: Number(jobsCommitment),
      date: new Date().toLocaleDateString('es-CR'),
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'En Evaluación',
      aiScore: finalScore,
      aiClassification: finalScore >= 80 ? 'RECOMENDADA' : finalScore >= 60 ? 'REVISAR' : 'RECHAZADA',
      aiJustification: `Evaluación algorítmica completada con viabilidad de ${finalScore}%. Inversión de $${(investmentUSD/1000000).toFixed(2)}M USD y ${jobsCommitment} plazas directas.`,
      progress: 40,
      expedienteNumber: newId,
      investmentType: 'Nueva Instalación',
      description: description || `Proyecto de expansión e instalación bajo el Régimen de Zonas Francas en ${zonaFranca}, sector ${sector}.`,
      timeline: [
        { date: new Date().toLocaleDateString('es-CR'), action: 'Recepción formal y registro de expediente', completed: true },
        { date: new Date().toLocaleDateString('es-CR'), action: 'Pre-evaluación IA de viabilidad regulatoria', completed: true },
      ]
    };

    onAddSolicitud(newSolicitud);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B2B4A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B2B4A] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#2D9CDB] flex items-center justify-center text-white font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                Nueva Solicitud de Ingreso al Régimen
              </h2>
              <p className="text-xs text-slate-300">
                Formulario Oficial Ley 7210 — PROCOMER / COMEX
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Company Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B2B4A] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#2D9CDB]" />
              Nombre de la Empresa o Razón Social *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ej. Medtronic Costa Rica S.A."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus-turquoise transition-all"
            />
          </div>

          {/* Sector & Regimen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B2B4A]">Sector Productivo</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus-turquoise font-medium"
              >
                <option value="Ciencias de la Vida">Ciencias de la Vida / Medtech</option>
                <option value="Servicios Digitales">Servicios Digitales / TI</option>
                <option value="Manufactura Avanzada">Manufactura Avanzada / Aeroespacial</option>
                <option value="Semiconductores">Semiconductores / Hardware</option>
                <option value="Logística Internacional">Logística Internacional</option>
                <option value="Servicios Compartidos">Servicios Compartidos / Backoffice</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B2B4A]">Categoría de Régimen (Ley 7210)</label>
              <select
                value={regimenType}
                onChange={(e) => setRegimenType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus-turquoise font-medium"
              >
                <option value="Servicios (Inciso c)">Servicios (Inciso c)</option>
                <option value="Manufactura (Inciso a)">Manufactura (Inciso a)</option>
                <option value="Comercializadora (Inciso b)">Comercializadora (Inciso b)</option>
                <option value="Administradora de Parque (Inciso f)">Administradora de Parque (Inciso f)</option>
              </select>
            </div>
          </div>

          {/* Location & Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B2B4A] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2D9CDB]" />
                Parque o Zona Franca Sede
              </label>
              <select
                value={zonaFranca}
                onChange={(e) => setZonaFranca(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus-turquoise font-medium"
              >
                <option value="Coyol Free Zone">Coyol Free Zone (Alajuela)</option>
                <option value="Evolution Free Zone">Evolution Free Zone (Grecia)</option>
                <option value="America Free Zone (AFZ)">America Free Zone (Heredia)</option>
                <option value="UltraPark I & II">UltraPark I & II (Heredia)</option>
                <option value="Zona Franca La Lima">Zona Franca La Lima (Cartago)</option>
                <option value="Zona Franca El Coyol">Zona Franca El Coyol</option>
                <option value="Puntarenas Free Zone">Puntarenas Free Zone (Fuera GAM)</option>
                <option value="Limón Free Trade Zone">Limón Free Trade Zone (Fuera GAM)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B2B4A]">Región Geográfica</label>
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="locationType"
                    value="Dentro de GAM"
                    checked={locationType === 'Dentro de GAM'}
                    onChange={() => setLocationType('Dentro de GAM')}
                    className="text-[#2D9CDB] focus:ring-[#2D9CDB]"
                  />
                  <span>Dentro de GAM</span>
                </label>
                <label className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="locationType"
                    value="Fuera de GAM"
                    checked={locationType === 'Fuera de GAM'}
                    onChange={() => setLocationType('Fuera de GAM')}
                    className="text-[#2D9CDB] focus:ring-[#2D9CDB]"
                  />
                  <span className="font-semibold text-emerald-700">Fuera de GAM (+Incentivos)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Investment & Jobs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B2B4A] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#2D9CDB]" />
                Inversión Comprometida (USD) *
              </label>
              <input
                type="number"
                required
                min={150000}
                step={50000}
                value={investmentUSD}
                onChange={(e) => setInvestmentUSD(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus-turquoise transition-all font-mono"
              />
              <p className="text-[11px] text-[#4A5568]">Mínimo de ley: $150,000 USD</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B2B4A] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#2D9CDB]" />
                Compromiso de Nuevos Empleos *
              </label>
              <input
                type="number"
                required
                min={5}
                value={jobsCommitment}
                onChange={(e) => setJobsCommitment(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus-turquoise transition-all font-mono"
              />
              <p className="text-[11px] text-[#4A5568]">Plazas directas formales (CCSS)</p>
            </div>
          </div>

          {/* Project description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B2B4A]">Descripción y Alcance de Operaciones</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describa la naturaleza de las operaciones industriales o de servicios..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus-turquoise"
            />
          </div>

          {/* Pre-flight AI simulation box with Turquoise spinner */}
          <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Cpu className="w-5 h-5 text-[#2D9CDB]" />
              <div>
                <div className="text-xs font-bold text-[#0B2B4A]">
                  Pre-calificación IA Instantánea
                </div>
                <div className="text-[11px] text-[#4A5568]">
                  Calcula el índice preliminar de viabilidad regulatoria
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {calculatedScore !== null && (
                <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                  {calculatedScore}% Viabilidad
                </span>
              )}

              <button
                type="button"
                onClick={handleSimulateAI}
                disabled={isSimulatingAI}
                className="px-3 py-1.5 bg-white border border-sky-200 hover:bg-sky-100 text-[#0B2B4A] text-xs font-bold rounded-lg shadow-xs transition-all duration-150 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSimulatingAI ? (
                  /* Custom turquoise spinner */
                  <div className="w-3.5 h-3.5 border-2 border-[#2D9CDB] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#2D9CDB]" />
                )}
                <span>{isSimulatingAI ? 'Analizando...' : 'Evaluar con IA'}</span>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2D9CDB] hover:bg-[#2387be] active:bg-[#1d73a3] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-150 flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Registrar e Iniciar Trámite</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
