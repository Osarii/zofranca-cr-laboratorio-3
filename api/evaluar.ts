import { evaluarConGemini, ServicioIaError } from '../server/geminiService';

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status: (codigo: number) => ApiResponse;
  json: (datos: unknown) => void;
  setHeader: (nombre: string, valor: string) => void;
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.status(405).json({ message: 'Método no permitido.' });
    return;
  }

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const resultado = await evaluarConGemini(body);
    response.status(200).json(resultado);
  } catch (error) {
    const status = error instanceof ServicioIaError ? error.status : 500;
    const message = error instanceof Error ? error.message : 'Error inesperado en el servicio de IA.';
    response.status(status).json({ message });
  }
}
