import { Howl, Howler } from 'howler';

export type TipoSonido = 'exito' | 'advertencia' | 'error' | 'notificacion';

const archivos: Record<TipoSonido, string> = {
  exito: '/sounds/exito.wav?v=13',
  advertencia: '/sounds/advertencia.wav?v=13',
  error: '/sounds/error.wav?v=13',
  notificacion: '/sounds/notificacion.wav?v=13',
};

const volumenPorTipo: Record<TipoSonido, number> = {
  exito: 0.72,
  advertencia: 0.69,
  error: 0.72,
  notificacion: 0.67,
};

let bancoSonidos: Partial<Record<TipoSonido, Howl>> = {};
let volumenGeneral = 0.8;

export function reproducirSonido(tipo: TipoSonido) {
  if (typeof window === 'undefined') return;

  const sonido = bancoSonidos[tipo] ?? new Howl({
    src: [archivos[tipo]],
    volume: volumenPorTipo[tipo],
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
