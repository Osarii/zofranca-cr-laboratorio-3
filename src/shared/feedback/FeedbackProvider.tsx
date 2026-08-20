import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { configurarVolumen, reproducirSonido, type TipoSonido } from './soundManager';

type TipoFeedback = TipoSonido;

interface FeedbackContextValue {
  sonidosActivos: boolean;
  volumen: number;
  alternarSonidos: () => void;
  cambiarVolumen: (volumen: number) => void;
  probarSonido: (tipo: TipoSonido) => void;
  notificar: (tipo: TipoFeedback, mensaje: string, descripcion?: string) => void;
}

const CLAVE_SONIDOS = 'zofranca-sonidos-activos';
const CLAVE_VOLUMEN = 'zofranca-volumen';
const FeedbackContext = createContext<FeedbackContextValue | null>(null);

function leerPreferenciaSonidos() {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(CLAVE_SONIDOS) !== 'false';
}

function leerVolumen() {
  if (typeof window === 'undefined') return 0.8;
  const guardado = Number(window.localStorage.getItem(CLAVE_VOLUMEN));
  return Number.isFinite(guardado) && guardado >= 0 && guardado <= 1 ? guardado : 0.8;
}

export function FeedbackProvider({ children }: React.PropsWithChildren) {
  const [sonidosActivos, setSonidosActivos] = useState(leerPreferenciaSonidos);
  const [volumen, setVolumen] = useState(leerVolumen);

  useEffect(() => configurarVolumen(volumen), [volumen]);

  const alternarSonidos = useCallback(() => {
    const nuevos = !sonidosActivos;
    setSonidosActivos(nuevos);
    window.localStorage.setItem(CLAVE_SONIDOS, String(nuevos));
    if (nuevos) reproducirSonido('notificacion');
  }, [sonidosActivos]);

  const cambiarVolumen = useCallback((nuevoVolumen: number) => {
    const normalizado = Math.min(1, Math.max(0, nuevoVolumen));
    setVolumen(normalizado);
    configurarVolumen(normalizado);
    window.localStorage.setItem(CLAVE_VOLUMEN, String(normalizado));
  }, []);

  const probarSonido = useCallback((tipo: TipoSonido) => {
    reproducirSonido(tipo);
  }, []);

  const notificar = useCallback((tipo: TipoFeedback, mensaje: string, descripcion?: string) => {
    const opciones = { description: descripcion, duration: 5200 };

    if (tipo === 'exito') toast.success(mensaje, opciones);
    else if (tipo === 'advertencia') toast.warning(mensaje, opciones);
    else if (tipo === 'error') toast.error(mensaje, opciones);
    else toast.info(mensaje, opciones);

    if (sonidosActivos) reproducirSonido(tipo);
  }, [sonidosActivos]);

  const valor = useMemo(
    () => ({ sonidosActivos, volumen, alternarSonidos, cambiarVolumen, probarSonido, notificar }),
    [alternarSonidos, cambiarVolumen, notificar, probarSonido, sonidosActivos, volumen],
  );

  return (
    <FeedbackContext.Provider value={valor}>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster
          closeButton
          expand
          position="top-right"
          richColors
          toastOptions={{ className: 'zofranca-toast' }}
        />
      </MotionConfig>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const contexto = useContext(FeedbackContext);
  if (!contexto) throw new Error('useFeedback debe utilizarse dentro de FeedbackProvider.');
  return contexto;
}
