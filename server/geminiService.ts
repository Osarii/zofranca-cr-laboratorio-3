import { GoogleGenAI, Type } from '@google/genai';
import type { SolicitudApi, ZonaFranca } from '../src/contrato';
import { generarResultadoClasificacion, type ResultadoEvaluacionIA } from '../src/services/motorIa';

type DatosSolicitudIA = Pick<SolicitudApi, 'empresa' | 'sector' | 'inversionProyectada' | 'empleosProyectados'>;

interface EntradaEvaluacionIA {
  solicitud: DatosSolicitudIA;
  zona: ZonaFranca;
}

interface NarrativaGemini {
  justificacion: string;
  riesgos: string[];
  recomendaciones: string[];
}

export class ServicioIaError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ServicioIaError';
    this.status = status;
  }
}

const esObjeto = (valor: unknown): valor is Record<string, unknown> => typeof valor === 'object' && valor !== null;

const textoValido = (valor: unknown, maximo: number): valor is string => typeof valor === 'string' && valor.trim().length > 0 && valor.trim().length <= maximo;

const numeroValido = (valor: unknown): valor is number => typeof valor === 'number' && Number.isFinite(valor) && valor >= 0 && valor <= 1_000_000_000;

export function validarEntradaEvaluacion(valor: unknown): EntradaEvaluacionIA {
  if (!esObjeto(valor) || !esObjeto(valor.solicitud) || !esObjeto(valor.zona)) {
    throw new ServicioIaError('La solicitud para Gemini no tiene el formato esperado.', 400);
  }

  const solicitud = valor.solicitud;
  const zona = valor.zona;
  if (
    !textoValido(solicitud.empresa, 160)
    || !textoValido(solicitud.sector, 100)
    || !numeroValido(solicitud.inversionProyectada)
    || !numeroValido(solicitud.empleosProyectados)
    || !textoValido(zona.nombre, 160)
    || !numeroValido(zona.inversionMinima)
    || !numeroValido(zona.empleosMinimos)
    || !Array.isArray(zona.sectoresPermitidos)
    || zona.sectoresPermitidos.length === 0
    || zona.sectoresPermitidos.length > 50
    || !zona.sectoresPermitidos.every((sector) => textoValido(sector, 100))
  ) {
    throw new ServicioIaError('Hay datos incompletos o fuera de rango para ejecutar la evaluación.', 400);
  }

  const empresa = solicitud.empresa as string;
  const sectorSolicitud = solicitud.sector as string;
  const inversionProyectada = solicitud.inversionProyectada as number;
  const empleosProyectados = solicitud.empleosProyectados as number;
  const nombreZona = zona.nombre as string;
  const inversionMinima = zona.inversionMinima as number;
  const empleosMinimos = zona.empleosMinimos as number;
  const sectoresPermitidos = zona.sectoresPermitidos as string[];

  return {
    solicitud: {
      empresa: empresa.trim(),
      sector: sectorSolicitud.trim(),
      inversionProyectada,
      empleosProyectados,
    },
    zona: {
      id: typeof zona.id === 'number' || typeof zona.id === 'string' ? zona.id : 'sin-id',
      nombre: nombreZona.trim(),
      inversionMinima,
      empleosMinimos,
      sectoresPermitidos: sectoresPermitidos.map((sector) => sector.trim()),
    },
  };
}

const limpiarLista = (valor: unknown, maximo: number) => Array.isArray(valor)
  ? valor.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).map((item) => item.trim()).slice(0, maximo)
  : [];

function repararJsonTruncado(texto: string) {
  let limpio = texto.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  const inicio = limpio.indexOf('{');
  if (inicio > 0) limpio = limpio.slice(inicio);

  const pila: string[] = [];
  let dentroDeCadena = false;
  let escapado = false;
  for (const caracter of limpio) {
    if (dentroDeCadena) {
      if (escapado) escapado = false;
      else if (caracter === '\\') escapado = true;
      else if (caracter === '"') dentroDeCadena = false;
      continue;
    }
    if (caracter === '"') dentroDeCadena = true;
    else if (caracter === '{') pila.push('}');
    else if (caracter === '[') pila.push(']');
    else if ((caracter === '}' || caracter === ']') && pila[pila.length - 1] === caracter) pila.pop();
  }

  if (dentroDeCadena) limpio += '"';
  limpio = limpio.replace(/:\s*$/, ':""').replace(/,\s*$/, '');
  while (pila.length) limpio += pila.pop();
  return limpio;
}

function interpretarNarrativa(texto: string): NarrativaGemini | null {
  for (const candidato of [texto.trim(), repararJsonTruncado(texto)]) {
    try {
      const narrativa = JSON.parse(candidato) as Partial<NarrativaGemini>;
      const justificacion = typeof narrativa.justificacion === 'string' ? narrativa.justificacion.trim() : '';
      const riesgos = limpiarLista(narrativa.riesgos, 4);
      const recomendaciones = limpiarLista(narrativa.recomendaciones, 4);
      if (justificacion && riesgos.length > 0 && recomendaciones.length > 0) return { justificacion, riesgos, recomendaciones };
    } catch {
      // Se intenta la versión reparada y, si sigue incompleta, se solicita nuevamente.
    }
  }
  return null;
}

export function obtenerEstadoGemini() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  return {
    configurado: Boolean(apiKey && !apiKey.includes('pegue_aqui') && !apiKey.includes('MY_GEMINI')),
    modelo: process.env.GEMINI_MODEL?.trim() || 'gemini-3.6-flash',
  };
}

export async function evaluarConGemini(entradaDesconocida: unknown): Promise<ResultadoEvaluacionIA> {
  const entrada = validarEntradaEvaluacion(entradaDesconocida);
  const estadoGemini = obtenerEstadoGemini();
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!estadoGemini.configurado || !apiKey) {
    throw new ServicioIaError('Gemini no está configurado. Agregue GEMINI_API_KEY al archivo .env y reinicie npm run dev.', 503);
  }

  const base = generarResultadoClasificacion(entrada.solicitud, entrada.zona);
  const cliente = new GoogleGenAI({ apiKey });
  const contexto = {
    empresa: entrada.solicitud.empresa,
    sector: entrada.solicitud.sector,
    zonaFranca: entrada.zona.nombre,
    inversion: {
      proyectadaUSD: entrada.solicitud.inversionProyectada,
      minimaUSD: entrada.zona.inversionMinima,
    },
    empleo: {
      proyectado: entrada.solicitud.empleosProyectados,
      minimo: entrada.zona.empleosMinimos,
    },
    sectoresPermitidos: entrada.zona.sectoresPermitidos,
    resultadoVerificable: {
      estado: base.estado,
      puntaje: base.puntaje,
      desglose: base.desglose,
    },
  };

  try {
    const modelos = Array.from(new Set([
      estadoGemini.modelo,
      ...(process.env.GEMINI_FALLBACK_MODELS?.split(',').map((modelo) => modelo.trim()).filter(Boolean) ?? []),
      'gemini-3.5-flash',
      'gemini-2.5-flash',
    ]));
    let narrativaFinal: NarrativaGemini | null = null;
    let modeloUsado = '';
    let ultimoError: unknown;

    for (const modelo of modelos) {
      for (let intento = 1; intento <= 2; intento += 1) {
        try {
          const respuesta = await cliente.models.generateContent({
            model: modelo,
            contents: `Analice esta solicitud de admisión a una zona franca de Costa Rica. Use exclusivamente los datos entregados. El estado y el puntaje ya fueron calculados por reglas verificables y no deben modificarse. Responda de forma breve: justificación de máximo 3 oraciones, hasta 3 riesgos y hasta 3 recomendaciones; cada elemento debe tener menos de 140 caracteres.\n\nDATOS:\n${JSON.stringify(contexto, null, 2)}`,
            config: {
              systemInstruction: 'Usted es un asistente de apoyo para analistas de admisión del Régimen de Zonas Francas de Costa Rica. No invente normas, documentos, montos ni hechos. No presente la salida como una decisión legal definitiva. Sea claro, breve y escriba en español de Costa Rica.',
              temperature: 0.1,
              candidateCount: 1,
              maxOutputTokens: 1600,
              thinkingConfig: { thinkingBudget: 0 },
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  justificacion: { type: Type.STRING, description: 'Explicación ejecutiva de máximo 3 oraciones.' },
                  riesgos: { type: Type.ARRAY, description: 'Entre 1 y 3 riesgos breves.', items: { type: Type.STRING } },
                  recomendaciones: { type: Type.ARRAY, description: 'Entre 1 y 3 acciones breves.', items: { type: Type.STRING } },
                },
                required: ['justificacion', 'riesgos', 'recomendaciones'],
              },
            },
          });
          if (!respuesta.text) throw new Error(`El modelo ${modelo} no produjo contenido.`);
          const narrativa = interpretarNarrativa(respuesta.text);
          if (!narrativa) throw new Error(`El modelo ${modelo} devolvió JSON incompleto en el intento ${intento}.`);
          narrativaFinal = narrativa;
          modeloUsado = modelo;
          break;
        } catch (errorModelo) {
          ultimoError = errorModelo;
          const detalleModelo = errorModelo instanceof Error ? errorModelo.message : String(errorModelo);
          if (/api.?key|401|403|permission|429|quota|rate limit/i.test(detalleModelo)) throw errorModelo;
          console.warn(`[geminiService] ${modelo}, intento ${intento}, no completado.`, detalleModelo);
        }
      }
      if (narrativaFinal) break;
    }

    if (!narrativaFinal || !modeloUsado) throw ultimoError ?? new Error('Ningún modelo de Gemini respondió.');

    return {
      ...base,
      justificacion: `${base.estado} con ${base.puntaje}/100. ${narrativaFinal.justificacion}`,
      riesgos: narrativaFinal.riesgos,
      recomendaciones: narrativaFinal.recomendaciones,
      modelo: modeloUsado,
      origen: 'gemini',
      generadoEn: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof ServicioIaError) throw error;
    const detalle = error instanceof Error ? error.message : '';
    if (/429|quota|rate limit/i.test(detalle)) throw new ServicioIaError('Se alcanzó temporalmente el límite gratuito de Gemini. Espere un momento y vuelva a intentar.', 429);
    if (/api.?key|401|403|permission/i.test(detalle)) throw new ServicioIaError('La clave de Gemini no es válida o no tiene permisos. Revise GEMINI_API_KEY.', 503);
    if (/404|not found|not supported|model/i.test(detalle)) throw new ServicioIaError('Los modelos configurados no están disponibles para esta clave. Revise el acceso de la clave en Google AI Studio.', 502);
    if (/400|invalid argument|schema/i.test(detalle)) throw new ServicioIaError('Gemini rechazó el formato de la evaluación. Reinicie el servidor y vuelva a intentarlo.', 502);
    console.error('[geminiService] Error de Gemini:', error);
    const detalleSeguro = detalle.replace(/AIza[\w-]+/g, '[clave protegida]').slice(0, 180);
    throw new ServicioIaError(`Gemini no pudo completar la evaluación. ${detalleSeguro || 'Revise la terminal del servicio IA.'}`, 502);
  }
}
