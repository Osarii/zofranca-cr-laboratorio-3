import { Howl, Howler } from 'howler';

export type TipoSonido = 'exito' | 'advertencia' | 'error' | 'notificacion';

const archivos: Record<TipoSonido, string> = {
  exito: '/sounds/exito.wav',
  advertencia: '/sounds/advertencia.wav',
  error: '/sounds/error.wav',
  notificacion: '/sounds/notificacion.wav',
};

let bancoSonidos: Partial<Record<TipoSonido, Howl>> = {};
let volumenGeneral = 0.8;

export function reproducirSonido(tipo: TipoSonido) {
  if (typeof window === 'undefined') return;

  const sonido = bancoSonidos[tipo] ?? new Howl({
    src: [archivos[tipo]],
    volume: tipo === 'error' ? 0.95 : 0.85,
    preload: true,
  });

  bancoSonidos[tipo] = sonido;
  sonido.stop();
  sonido.play();
}

export function configurarVolumen(volumen: number) {
  volumenGeneral = Math.min(1, Math.max(0, volumen));
  Howler.volume(volumenGeneral);
}

export function obtenerVolumen() {
  return volumenGeneral;
}

export function liberarSonidos() {
  Object.values(bancoSonidos).forEach((sonido) => sonido?.unload());
  bancoSonidos = {};
}
