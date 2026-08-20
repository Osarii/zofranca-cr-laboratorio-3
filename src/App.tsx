import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { PersonaAHeader as Header } from './components/PersonaAHeader';
import { AlertsContainer } from './components/alerts/AlertsContainer';
import { SolicitudesListView } from './components/solicitudes/SolicitudesListView';
import { SolicitudDetailView } from './components/solicitudes/SolicitudDetailView';
import { NewSolicitudModal } from './components/solicitudes/NewSolicitudModal';
import { ZonasFrancasView } from './components/zonas/ZonasFrancasView';
import { CumplimientoModule } from '../cumplimiento/CumplimientoModule';
import { DashboardView } from './components/dashboard/DashboardView';
import { EmpresasView } from './components/empresas/EmpresasView';
import { ConfiguracionView } from './components/configuracion/ConfiguracionView';
import { PDFExportModal } from './components/common/PDFExportModal';
import { initialAlerts, initialCompanies } from './data/mockData';
import { adaptarSolicitud } from './adapters/solicitudesAdapter';
import {
  guardarSolicitud,
  guardarZonaFranca,
  obtenerSolicitudes,
  obtenerZonasFrancas,
} from './services/solicitudesApi';
import { evaluarSolicitud, evaluarSolicitudesPendientes } from './services/procesadorSolicitudes';
import type {
  AlertItem,
  EmpresaItem,
  SolicitudItem,
} from './types';
import type { NuevaSolicitud, NuevaZonaFranca, SolicitudApi, ZonaFranca } from './contrato';

type TipoAviso = 'exito' | 'error' | 'info';
interface Aviso { tipo: TipoAviso; mensaje: string }

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('solicitudes');
  const [currentUser, setCurrentUser] = useState<string>('Jared Prendas');
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [companies] = useState<EmpresaItem[]>(initialCompanies);
  const [solicitudes, setSolicitudes] = useState<SolicitudApi[]>([]);
  const [zonasFrancas, setZonasFrancas] = useState<ZonaFranca[]>([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudApi | null>(null);
  const [isNewSolicitudOpen, setIsNewSolicitudOpen] = useState(false);
  const [pdfSolicitud, setPdfSolicitud] = useState<SolicitudItem | null>(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [errorCarga, setErrorCarga] = useState('');
  const [aviso, setAviso] = useState<Aviso | null>(null);

  const solicitudesCompatibles = useMemo(
    () => solicitudes.map((solicitud) => adaptarSolicitud(solicitud, zonasFrancas)),
    [solicitudes, zonasFrancas],
  );

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setErrorCarga('');
    try {
      const [solicitudesServidor, zonasServidor] = await Promise.all([
        obtenerSolicitudes(),
        obtenerZonasFrancas(),
      ]);
      setSolicitudes(solicitudesServidor);
      setZonasFrancas(zonasServidor);
      setSelectedSolicitud((actual) => actual
        ? solicitudesServidor.find((item) => String(item.id) === String(actual.id)) ?? null
        : null);
    } catch (fallo) {
      const mensaje = fallo instanceof Error ? fallo.message : 'Error inesperado al consultar el servidor.';
      setErrorCarga(mensaje);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { void cargarDatos(); }, [cargarDatos]);

  useEffect(() => {
    if (!aviso) return;
    const temporizador = window.setTimeout(() => setAviso(null), 5500);
    return () => window.clearTimeout(temporizador);
  }, [aviso]);

  const reemplazarSolicitud = (actualizada: SolicitudApi) => {
    setSolicitudes((actuales) => actuales.map((item) =>
      String(item.id) === String(actualizada.id) ? actualizada : item));
    setSelectedSolicitud((actual) =>
      actual && String(actual.id) === String(actualizada.id) ? actualizada : actual);
  };

  const crearSolicitud = async (datos: NuevaSolicitud): Promise<SolicitudApi> => {
    const creada = await guardarSolicitud(datos);
    setSolicitudes((actuales) => [creada, ...actuales]);
    setSelectedSolicitud(creada);
    setCurrentTab('solicitudes');

    try {
      const evaluada = await evaluarSolicitud(creada);
      reemplazarSolicitud(evaluada);
      setAviso({ tipo: 'exito', mensaje: `Solicitud ${evaluada.id} evaluada: ${evaluada.estado} (${evaluada.puntaje}/100).` });
      return evaluada;
    } catch (fallo) {
      const mensaje = fallo instanceof Error ? fallo.message : 'No fue posible ejecutar la evaluación.';
      setAviso({ tipo: 'error', mensaje: `La solicitud quedó guardada como pendiente. ${mensaje}` });
      return creada;
    }
  };

  const evaluarUna = async (solicitud: SolicitudApi) => {
    try {
      const evaluada = await evaluarSolicitud(solicitud);
      reemplazarSolicitud(evaluada);
      setAviso({ tipo: 'exito', mensaje: `Evaluación completada: ${evaluada.estado} con ${evaluada.puntaje}/100.` });
    } catch (fallo) {
      const mensaje = fallo instanceof Error ? fallo.message : 'No fue posible evaluar la solicitud.';
      setAviso({ tipo: 'error', mensaje });
      throw fallo;
    }
  };

  const evaluarPendientes = async () => {
    setProcesando(true);
    try {
      const evaluadas = await evaluarSolicitudesPendientes();
      const porId = new Map(evaluadas.map((item) => [String(item.id), item]));
      setSolicitudes((actuales) => actuales.map((item) => porId.get(String(item.id)) ?? item));
      setSelectedSolicitud((actual) => actual ? porId.get(String(actual.id)) ?? actual : null);
      setAviso({ tipo: 'exito', mensaje: `${evaluadas.length} solicitudes evaluadas en paralelo con Promise.all.` });
    } catch (fallo) {
      const mensaje = fallo instanceof Error ? fallo.message : 'La evaluación paralela no pudo completarse.';
      setAviso({ tipo: 'error', mensaje });
      await cargarDatos();
    } finally {
      setProcesando(false);
    }
  };

  const crearZonaFranca = async (datos: NuevaZonaFranca) => {
    const creada = await guardarZonaFranca(datos);
    setZonasFrancas((actuales) => [...actuales, creada]);
    setAviso({ tipo: 'exito', mensaje: `Zona franca “${creada.nombre}” registrada correctamente.` });
  };

  const activeAlertsCount = alerts.filter((item) => item.status !== 'Resuelta' && item.status !== 'Resuelto').length;
  const handleUpdateAlertStatus = (alertId: string, newStatus: string) => {
    setAlerts((actuales) => actuales.map((item) => item.id === alertId ? { ...item, status: newStatus as AlertItem['status'] } : item));
  };
  const handleAssignAlert = (alertId: string, user: string) => {
    setAlerts((actuales) => actuales.map((item) => item.id === alertId ? { ...item, assignedTo: user, status: 'En Revisión' } : item));
  };
  const navegar = (tab: string) => {
    setCurrentTab(tab);
    if (tab !== 'solicitudes') setSelectedSolicitud(null);
  };
  const abrirPdf = (solicitud: SolicitudApi) => setPdfSolicitud(adaptarSolicitud(solicitud, zonasFrancas));

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb] text-[#4A5568]">
      <Header currentTab={currentTab} setCurrentTab={navegar} currentUser={currentUser} setCurrentUser={setCurrentUser} alertsCount={activeAlertsCount} onOpenNewSolicitud={() => setIsNewSolicitudOpen(true)} />

      {aviso && (
        <div className={`fixed right-4 top-20 z-50 flex max-w-md items-start gap-3 rounded-xl border p-4 shadow-xl ${aviso.tipo === 'exito' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : aviso.tipo === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-sky-200 bg-sky-50 text-sky-800'}`} role="status">
          {aviso.tipo === 'exito' ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : aviso.tipo === 'error' ? <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> : <Info className="mt-0.5 h-5 w-5 shrink-0" />}
          <p className="text-sm font-semibold leading-relaxed">{aviso.mensaje}</p>
          <button type="button" onClick={() => setAviso(null)} className="rounded p-1 hover:bg-black/5" aria-label="Cerrar aviso"><X className="h-4 w-4" /></button>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {currentTab === 'dashboard' && (
          <DashboardView solicitudes={solicitudesCompatibles} alerts={alerts} empresas={companies} onNavigateTab={navegar} onOpenNewSolicitud={() => setIsNewSolicitudOpen(true)} onSelectAlert={() => setCurrentTab('alertas')} />
        )}

        {currentTab === 'alertas' && <AlertsContainer alerts={alerts} onUpdateStatus={handleUpdateAlertStatus} onAssignAlert={handleAssignAlert} currentUser={currentUser} />}

        {currentTab === 'solicitudes' && (selectedSolicitud ? (
          <SolicitudDetailView solicitud={selectedSolicitud} zonaFranca={zonasFrancas.find((zona) => String(zona.id) === String(selectedSolicitud.zonaFrancaId))} onBack={() => setSelectedSolicitud(null)} onEvaluate={evaluarUna} onOpenExportModal={() => abrirPdf(selectedSolicitud)} />
        ) : (
          <SolicitudesListView solicitudes={solicitudes} zonasFrancas={zonasFrancas} cargando={cargando} procesando={procesando} error={errorCarga} onSelectSolicitud={setSelectedSolicitud} onOpenNewModal={() => setIsNewSolicitudOpen(true)} onEvaluateAll={evaluarPendientes} onRetry={cargarDatos} />
        ))}

        {currentTab === 'zonas' && <ZonasFrancasView zonasFrancas={zonasFrancas} onCreate={crearZonaFranca} />}
        {currentTab === 'empresas' && <EmpresasView empresas={companies} />}
        {currentTab === 'reportes' && <CumplimientoModule />}
        {currentTab === 'configuracion' && <ConfiguracionView />}
      </main>

      <NewSolicitudModal isOpen={isNewSolicitudOpen} zonasFrancas={zonasFrancas} onClose={() => setIsNewSolicitudOpen(false)} onSubmit={crearSolicitud} />
      <PDFExportModal solicitud={pdfSolicitud} onClose={() => setPdfSolicitud(null)} />
    </div>
  );
}