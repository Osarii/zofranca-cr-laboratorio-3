export const API_BASE_URL = 'http://localhost:3001';

const TIEMPO_LIMITE_MS = 10000;

export class ApiError extends Error {
  status: number;

  constructor(mensaje: string, status = 0) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function solicitar<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE_MS);
  const metodo = opciones.method ?? 'GET';

  try {
    const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
      ...opciones,
      signal: controlador.signal,
      headers: {
        Accept: 'application/json',
        ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
        ...opciones.headers,
      },
    });

    const texto = respuesta.status === 204 ? '' : await respuesta.text();
    const datos = texto ? JSON.parse(texto) : null;

    if (!respuesta.ok) {
      throw new ApiError(datos?.message || `La solicitud falló con estado ${respuesta.status}.`, respuesta.status);
    }

    return datos as T;
  } catch (error) {
    const normalizado =
      error instanceof ApiError
        ? error
        : error instanceof DOMException && error.name === 'AbortError'
          ? new ApiError('El servidor tardó demasiado en responder.')
          : new ApiError('No fue posible conectar con el servidor de datos.');

    console.error(`[apiClient] ${metodo} ${ruta}`, error);
    throw normalizado;
  } finally {
    clearTimeout(temporizador);
  }
}

export function obtener<T>(ruta: string): Promise<T> {
  return solicitar<T>(ruta);
}

export function guardar<T>(ruta: string, datos: unknown): Promise<T> {
  return solicitar<T>(ruta, { method: 'POST', body: JSON.stringify(datos) });
}

export function actualizar<T>(ruta: string, cambios: unknown): Promise<T> {
  return solicitar<T>(ruta, { method: 'PATCH', body: JSON.stringify(cambios) });
}
