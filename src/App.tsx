import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
import { useFeedback } from './shared/feedback/FeedbackProvider';
import type {
  AlertItem,
  EmpresaItem,
  SolicitudItem,
} from './types';
import type { NuevaSolicitud, NuevaZonaFranca, SolicitudApi, ZonaFranca } from './contrato';

export default function App() {
  const { notificar } = useFeedback();
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
      const tipo = evaluada.estado === 'Recomendada' ? 'exito' : evaluada.estado === 'Rechazada' ? 'error' : 'advertencia';
      notificar(tipo, `Solicitud ${evaluada.id}: ${evaluada.estado}`, `Afinidad calculada: ${evaluada.puntaje}/100.`);
      return evaluada;
    } catch (fallo) {
      const mensaje = fallo instanceof Error ? fallo.message : 'No fue posible ejecutar la evaluación.';
      notificar('error', 'La solicitud quedó guardada como pendiente', mensaje);
      return creada;
    }
  };

  const evaluarUna = async (solicitud: SolicitudApi) => {
    try {
      const evaluada = await evaluarSolicitud(solicitud);
      reemplazarSolicitud(evaluada);
      const tipo = evaluada.estado === 'Recomendada' ? 'exito' : evaluada.estado === 'Rechazada' ? 'error' : 'advertencia';
      notificar(tipo, `Evaluación completada: ${evaluada.estado}`, `Puntaje de afinidad: ${evaluada.puntaje}/100.`);
    } catch (fallo) {
      const mensaje = fallo instanceof Error ? fallo.message : 'No fue posible evaluar la solicitud.';
      notificar('error', 'No fue posible evaluar la solicitud', mensaje);
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
      notificar('exito', `${evaluadas.length} solicitudes evaluadas`, 'El procesamiento paralelo finalizó correctamente.');
    } catch (fallo) {
      const mensaje = fallo instanceof Error ? fallo.message : 'La evaluación paralela no pudo completarse.';
      notificar('error', 'La evaluación paralela no pudo completarse', mensaje);
      await cargarDatos();
    } finally {
      setProcesando(false);
    }
  };

  const crearZonaFranca = async (datos: NuevaZonaFranca) => {
    const creada = await guardarZonaFranca(datos);
    setZonasFrancas((actuales) => [...actuales, creada]);
    notificar('exito', 'Zona franca registrada', `“${creada.nombre}” ya está disponible.`);
  };

  const activeAlertsCount = alerts.filter((item) => item.status !== 'Resuelta' && item.status !== 'Resuelto').length;
  const handleUpdateAlertStatus = (alertId: string, newStatus: string) => {
    setAlerts((actuales) => actuales.map((item) => item.id === alertId ? { ...item, status: newStatus as AlertItem['status'] } : item));
    notificar('exito', 'Estado de alerta actualizado', `Nuevo estado: ${newStatus}.`);
  };
  const handleAssignAlert = (alertId: string, user: string) => {
    setAlerts((actuales) => actuales.map((item) => item.id === alertId ? { ...item, assignedTo: user, status: 'En Revisión' } : item));
    notificar('notificacion', 'Alerta asignada', `${user} quedó a cargo de la revisión.`);
  };
  const navegar = (tab: string) => {
    setCurrentTab(tab);
    if (tab !== 'solicitudes') setSelectedSolicitud(null);
  };
  const abrirPdf = (solicitud: SolicitudApi) => setPdfSolicitud(adaptarSolicitud(solicitud, zonasFrancas));

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F0E6] text-[#6B5A52]">
      <Header
        currentTab={currentTab}
        setCurrentTab={navegar}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        alertsCount={activeAlertsCount}
        onOpenNewSolicitud={() => setIsNewSolicitudOpen(true)}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${currentTab}-${selectedSolicitud?.id ?? 'principal'}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
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
        </motion.div>
        </AnimatePresence>
      </main>

      <NewSolicitudModal isOpen={isNewSolicitudOpen} zonasFrancas={zonasFrancas} onClose={() => setIsNewSolicitudOpen(false)} onSubmit={crearSolicitud} />
      <PDFExportModal solicitud={pdfSolicitud} onClose={() => setPdfSolicitud(null)} />
    </div>
  );
}
