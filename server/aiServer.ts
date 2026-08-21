import 'dotenv/config';
import express from 'express';
import { evaluarConGemini, obtenerEstadoGemini, ServicioIaError } from './geminiService';

const app = express();
const puerto = Number(process.env.AI_PORT || 3002);

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

app.get('/api/estado', (_request, response) => {
  response.json(obtenerEstadoGemini());
});

app.post('/api/evaluar', async (request, response) => {
  try {
    const resultado = await evaluarConGemini(request.body);
    response.json(resultado);
  } catch (error) {
    const status = error instanceof ServicioIaError ? error.status : 500;
    const message = error instanceof Error ? error.message : 'Error inesperado en el servicio de IA.';
    response.status(status).json({ message });
  }
});

app.use((_request, response) => {
  response.status(404).json({ message: 'Ruta del servicio de IA no encontrada.' });
});

app.listen(puerto, '127.0.0.1', () => {
  const estado = obtenerEstadoGemini();
  console.log(`[IA] Servicio disponible en http://127.0.0.1:${puerto}`);
  console.log(`[IA] Modelo: ${estado.modelo} · ${estado.configurado ? 'clave configurada' : 'falta GEMINI_API_KEY'}`);
});
