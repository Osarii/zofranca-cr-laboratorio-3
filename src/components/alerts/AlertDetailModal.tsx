import React, { useState } from 'react';
import { AlertItem } from '../../types';
import { 
  X, 
  Building2, 
  AlertTriangle, 
  Calendar, 
  User, 
  Mail, 
  FileText, 
  Send, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  TrendingDown, 
  AlertCircle,
  FileCheck,
  RotateCw,
  MapPin,
  DollarSign,
  Users,
  MessageSquare
} from 'lucide-react';

interface AlertDetailModalProps {
  alert: AlertItem | null;
  onClose: () => void;
  onStatusChange: (alertId: string, status: string) => void;
  currentUser: string;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  onStatusChange,
  currentUser,
}) => {
  if (!alert) return null;

  const [notificationNote, setNotificationNote] = useState('');
  const [selectedAction, setSelectedAction] = useState<'notificar' | 'prorroga' | 'inspeccion' | 'cerrar'>('notificar');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  const isHigh = alert.severity === 'Alta';

  const handleGenerateAIDraft = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      setGeneratedDraft(
        `OFICIO-ZF-${alert.company.substring(0, 3).toUpperCase()}-2026-042\n\n` +
        `Estimados Señores ${alert.company},\n\n` +
        `Por medio del presente, la Dirección de Régimen de Zonas Francas de PROCOMER comunica el hallazgo respecto al incumplimiento en el indicador de ${alert.category}: "${alert.title}".\n\n` +
        `Detalle técnico: ${alert.description || alert.tipoIncumplimiento}. Se registra una desviación de ${alert.deficitValue || '15%'} respecto al contrato de inversión aprobado.\n\n` +
        `De conformidad con el Artículo 23 de la Ley 7210, se le concede un plazo improrrogable de 10 días hábiles para presentar el plan de subsanación correspondiente.\n\n` +
        `Atentamente,\n` +
        `${currentUser}\n` +
        `Analista de Cumplimiento - PROCOMER`
      );
      setIsGeneratingAI(false);
    }, 900);
  };

  const handleExecuteAction = () => {
    if (selectedAction === 'cerrar') {
      onStatusChange(alert.id, 'Resuelto');
    } else if (selectedAction === 'notificar') {
      onStatusChange(alert.id, 'Notificado');
    } else {
      onStatusChange(alert.id, 'En Revisión');
    }
    setSentSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#5A1F2D]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-[#5A1F2D] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              {isHigh ? <AlertTriangle className="w-5 h-5 text-rose-400" /> : <AlertCircle className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                Expediente de Incidencia
              </span>
              <h2 className="text-lg font-extrabold text-white">
                {alert.company} — {alert.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {sentSuccess ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#5A1F2D]">
                Gestión Registrada Exitosamente
              </h3>
              <p className="text-sm text-[#6B5A52]">
                El estado de la alerta ha sido actualizado y se archivó la constancia oficial en el expediente.
              </p>
            </div>
          ) : (
            <>
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-[#6B5A52] uppercase font-bold">Severidad</div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-extrabold ${
                        isHigh ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isHigh && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-alert-pulse"></span>}
                      {alert.severity}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-[#6B5A52] uppercase font-bold">Categoría</div>
                  <div className="mt-1 text-xs font-bold text-[#5A1F2D] flex items-center gap-1">
                    {alert.category === 'Empleo' ? <Users className="w-3.5 h-3.5 text-[#9A4D5D]" /> : <DollarSign className="w-3.5 h-3.5 text-[#9A4D5D]" />}
                    {alert.category}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-[#6B5A52] uppercase font-bold">Estado Actual</div>
                  <div className="mt-1 text-xs font-bold text-slate-800">
                    {alert.status}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-[#6B5A52] uppercase font-bold">Fecha Límite</div>
                  <div className="mt-1 text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {alert.dueDate || '15 Mar 2026'}
                  </div>
                </div>
              </div>

              {/* Problem Breakdown */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-[#5A1F2D] uppercase tracking-wide">
                  Descripción del Incumplimiento Normativo
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {alert.description || alert.tipoIncumplimiento || 'Incumplimiento en metas contractuales estipuladas en el acuerdo ejecutivo.'}
                </p>

                {alert.deficitValue && (
                  <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-900 flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-rose-600" />
                      Magnitud de la brecha fiscal/operativa:
                    </span>
                    <span className="font-extrabold text-rose-700 text-sm">
                      {alert.deficitValue}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#5A1F2D] uppercase tracking-wide">
                  Seleccionar Acción Correctiva
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAction('notificar')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all duration-150 cursor-pointer ${
                      selectedAction === 'notificar'
                        ? 'border-[#9A4D5D] bg-sky-50 text-[#5A1F2D] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Mail className="w-4 h-4 mb-1 text-[#9A4D5D]" />
                    <div>Notificar Formalmente</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAction('prorroga')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all duration-150 cursor-pointer ${
                      selectedAction === 'prorroga'
                        ? 'border-[#9A4D5D] bg-sky-50 text-[#5A1F2D] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="w-4 h-4 mb-1 text-[#9A4D5D]" />
                    <div>Otorgar Prórroga</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAction('inspeccion')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all duration-150 cursor-pointer ${
                      selectedAction === 'inspeccion'
                        ? 'border-[#9A4D5D] bg-sky-50 text-[#5A1F2D] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FileCheck className="w-4 h-4 mb-1 text-[#9A4D5D]" />
                    <div>Auditoría en Sitio</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAction('cerrar')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all duration-150 cursor-pointer ${
                      selectedAction === 'cerrar'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 mb-1 text-emerald-600" />
                    <div>Subsanado / Cerrar</div>
                  </button>
                </div>
              </div>

              {/* AI Draft Generator with Turquoise Spinner */}
              <div className="space-y-3 bg-gradient-to-br from-sky-50/60 to-slate-50 p-4 rounded-xl border border-sky-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-[#9A4D5D]" />
                    <span className="text-xs font-bold text-[#5A1F2D]">
                      Asistente IA ZoFranca: Redacción Automatizada de Oficio Legal
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateAIDraft}
                    disabled={isGeneratingAI}
                    className="px-3 py-1.5 bg-[#9A4D5D] hover:bg-[#7C3545] active:bg-[#713044] text-white text-xs font-bold rounded-lg shadow-xs hover:shadow-md transition-all duration-150 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingAI ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generando...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generar con IA</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={6}
                    value={generatedDraft !== null ? generatedDraft : notificationNote}
                    onChange={(e) => {
                      if (generatedDraft !== null) setGeneratedDraft(e.target.value);
                      else setNotificationNote(e.target.value);
                    }}
                    placeholder="Escriba notas adicionales o genere el borrador automático de notificación oficial..."
                    className="w-full p-3 text-xs font-mono bg-white border border-slate-200 rounded-lg focus-turquoise transition-all"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        {!sentSuccess && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-[#6B5A52] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Operando como: <strong className="text-slate-800">{currentUser}</strong></span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                className="px-5 py-2 bg-[#5A1F2D] hover:bg-[#6E2638] active:bg-[#2B0D16] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-150 flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#9A4D5D]" />
                <span>Aplicar Gestión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
