const API_BASE_URL = 'http://localhost:3001';

export async function apiFetch<T>(
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(opciones.headers ?? {}),
    },
    ...opciones,
  });

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status} en ${ruta}`);
  }

  return respuesta.json() as Promise<T>;
}

export async function obtenerX<T>(ruta: string): Promise<T> {
  return apiFetch<T>(ruta);
}

export async function guardarX<T>(
  ruta: string,
  datos: unknown,
): Promise<T> {
  return apiFetch<T>(ruta, {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}
