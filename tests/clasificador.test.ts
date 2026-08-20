import assert from 'node:assert/strict';
import test from 'node:test';
import { generarResultadoClasificacion } from '../src/services/motorIa';
import type { SolicitudApi, ZonaFranca } from '../src/contrato';

const zona: ZonaFranca = {
  id: 1,
  nombre: 'Zona de prueba',
  inversionMinima: 500000,
  empleosMinimos: 20,
  sectoresPermitidos: ['Tecnología', 'Servicios'],
};

function solicitud(cambios: Partial<SolicitudApi>): SolicitudApi {
  return {
    id: 1,
    empresa: 'Empresa de prueba',
    sector: 'Tecnología',
    inversionProyectada: 500000,
    empleosProyectados: 20,
    zonaFrancaId: 1,
    estado: 'pendiente',
    puntaje: 0,
    justificacion: '',
    fecha: '2026-08-20',
    ...cambios,
  };
}

test('recomienda una solicitud que cumple todos los criterios', () => {
  const resultado = generarResultadoClasificacion(solicitud({}), zona);
  assert.equal(resultado.puntaje, 100);
  assert.equal(resultado.estado, 'Recomendada');
});

test('envía a revisión una solicitud parcialmente compatible', () => {
  const resultado = generarResultadoClasificacion(
    solicitud({ inversionProyectada: 250000, empleosProyectados: 10 }),
    zona,
  );
  assert.equal(resultado.estado, 'Revisar');
  assert.equal(resultado.puntaje, 63);
});

test('rechaza una solicitud cuyo sector no está permitido', () => {
  const resultado = generarResultadoClasificacion(solicitud({ sector: 'Agroindustria' }), zona);
  assert.equal(resultado.estado, 'Rechazada');
  assert.equal(resultado.desglose.sectorPermitido, false);
});
