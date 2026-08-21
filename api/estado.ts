import { obtenerEstadoGemini } from '../server/geminiService';

interface ApiResponse {
  status: (codigo: number) => ApiResponse;
  json: (datos: unknown) => void;
  setHeader: (nombre: string, valor: string) => void;
}

export default function handler(_request: unknown, response: ApiResponse) {
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json(obtenerEstadoGemini());
}
