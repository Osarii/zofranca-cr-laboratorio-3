import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, Bell, CheckCircle2, SlidersHorizontal, Volume2, VolumeX, XCircle } from 'lucide-react';
import { useFeedback } from '../../shared/feedback/FeedbackProvider';
import type { TipoSonido } from '../../shared/feedback/soundManager';

const pruebas: Array<{ tipo: TipoSonido; etiqueta: string; Icono: React.ElementType; estilo: string }> = [
  { tipo: 'exito', etiqueta: 'Éxito', Icono: CheckCircle2, estilo: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
  { tipo: 'advertencia', etiqueta: 'Aviso', Icono: AlertTriangle, estilo: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
  { tipo: 'error', etiqueta: 'Error', Icono: XCircle, estilo: 'bg-rose-50 text-rose-700 hover:bg-rose-100' },
  { tipo: 'notificacion', etiqueta: 'Alerta', Icono: Bell, estilo: 'bg-sky-50 text-sky-700 hover:bg-sky-100' },
];

export function AudioControl() {
  const [abierto, setAbierto] = useState(false);
  const { alternarSonidos, cambiarVolumen, probarSonido, sonidosActivos, volumen } = useFeedback();

  return (
    <div className="relative">
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => setAbierto((actual) => !actual)}
        aria-expanded={abierto}
        aria-label="Abrir controles de sonido"
        className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-bold transition ${sonidosActivos ? 'border-[#5A4615] bg-[#241D0D] text-[#E1B84C]' : 'border-[#34363C] bg-transparent text-slate-600'}`}
      >
        {sonidosActivos ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        <span className="hidden lg:inline">Sonido</span>
        {sonidosActivos && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
      </motion.button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-2xl border border-slate-200 bg-[#17181C] p-4 text-slate-700 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div><p className="font-extrabold text-[#E1B84C]">Centro de sonido</p><p className="mt-0.5 text-[11px] text-slate-500">Probá cada efecto inmediatamente.</p></div>
              <button type="button" onClick={alternarSonidos} className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${sonidosActivos ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{sonidosActivos ? 'Activo' : 'Silenciado'}</button>
            </div>

            <label className="mt-4 block rounded-xl bg-slate-50 p-3">
              <span className="flex items-center justify-between text-xs font-bold text-[#E1B84C]"><span className="flex items-center gap-1.5"><SlidersHorizontal className="h-3.5 w-3.5" />Volumen</span><span>{Math.round(volumen * 100)}%</span></span>
              <input aria-label="Volumen de los sonidos" type="range" min="0" max="1" step="0.05" value={volumen} onChange={(evento) => cambiarVolumen(Number(evento.target.value))} className="mt-2 w-full accent-[#A77B1C]" />
            </label>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {pruebas.map(({ tipo, etiqueta, Icono, estilo }) => (
                <motion.button key={tipo} type="button" whileTap={{ scale: 0.95 }} onClick={() => probarSonido(tipo)} className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold ${estilo}`}><Icono className="h-4 w-4" />{etiqueta}</motion.button>
              ))}
            </div>
            <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-400">Los botones de prueba siempre reproducen audio. El interruptor controla los sonidos automáticos.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
