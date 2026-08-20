import React from 'react';
import { Settings, ShieldCheck, Scale, Bell, CheckCircle2, Cpu, Building2, DollarSign, Users } from 'lucide-react';

export const ConfiguracionView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#0B2B4A] tracking-tight">
            Configuración y Parámetros Regulatorios
          </h1>
          <p className="text-base text-[#4A5568] mt-1">
            Reglas de validación, umbrales y motores de auditoría Ley 7210 Costa Rica
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-[#0B2B4A] text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#2D9CDB]" />
              <span>Umbrales de Inversión Mínima (GAM vs Fuera de GAM)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="font-semibold text-[#4A5568] block mb-1">Dentro de Gran Área Metropolitana (GAM)</label>
                <input 
                  type="text" 
                  disabled 
                  value="USD $150,000 / $2,000,000 en Parque" 
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-slate-800 focus-turquoise" 
                />
              </div>
              <div>
                <label className="font-semibold text-[#4A5568] block mb-1">Fuera de GAM (Zonas Rurales / Costeras)</label>
                <input 
                  type="text" 
                  disabled 
                  value="USD $100,000 / $500,000 en Parque" 
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-slate-800 focus-turquoise" 
                />
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-[#0B2B4A] text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Reglas de Disparo para Alertas Automáticas</span>
            </h3>
            <div className="space-y-2.5 text-[#4A5568]">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#2D9CDB] focus:ring-[#2D9CDB]" />
                <span className="text-xs">Alerta automática cuando el empleo real reportado a CCSS sea menor al 90% del compromiso.</span>
              </label>
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#2D9CDB] focus:ring-[#2D9CDB]" />
                <span className="text-xs">Notificación preventiva con 30 días de anticipación al vencimiento del canon PROCOMER.</span>
              </label>
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#2D9CDB] focus:ring-[#2D9CDB]" />
                <span className="text-xs">Bloqueo preventivo de exenciones aduaneras TICA ante reporte de irregularidad tributaria.</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
