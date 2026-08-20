export type Severity = 'Alta' | 'Media' | 'Baja';
export type AlertStatus = 'Pendiente' | 'En Revisión' | 'En Proceso' | 'Resuelta' | 'Resuelto' | 'Notificado' | 'Acción Requerida';
export type SolicitudStatus = 'Aprobado' | 'Aprobada' | 'En Revisión' | 'En Evaluación' | 'Pendiente' | 'Rechazado' | 'Rechazada' | 'RECOMENDADA' | 'REVISAR' | 'RECHAZADA';

export interface AlertItem {
  id: string;
  title: string;
  company: string;
  severity: Severity;
  status: AlertStatus;
  date: string;
  description?: string;
  tipoIncumplimiento?: string;
  assignedTo?: string;
  progress?: number;
  dueDate?: string;
  category?: 'Fiscal' | 'Laboral' | 'Ambiental' | 'Aduanero' | 'Operativo' | 'Inversión' | 'Empleo';
  deficitValue?: string;
  zonaFranca?: string;
}

export interface SolicitudItem {
  id: string;
  company: string;
  companyName?: string;
  regimen: string;
  regimenType?: string;
  sector: string;
  date: string;
  submissionDate?: string;
  aiScore: number;
  aiClassification: 'RECOMENDADA' | 'REVISAR' | 'RECHAZADA';
  aiJustification: string;
  status: SolicitudStatus;
  progress: number;
  investmentAmount: number;
  investmentUSD?: number;
  projectedJobs: number;
  jobsCommitment?: number;
  location: string;
  zonaFranca?: string;
  locationType?: 'Dentro de GAM' | 'Fuera de GAM';
  expedienteNumber: string;
  investmentType: string;
  description?: string;
  attachedFiles?: string[];
  comments?: string;
  timeline: {
    date: string;
    action: string;
    user?: string;
    completed?: boolean;
  }[];
  analystDecision?: {
    status: string;
    comments: string;
    date?: string;
    analystName?: string;
  };
}

export type SolicitudZF = SolicitudItem;

export interface ComplianceReport {
  company: string;
  taxId: string;
  location: string;
  registrationDate: string;
  fiscalPeriod: string;
  selectedPeriod: string;
  committedJobs: number;
  realJobs: number;
  committedInvestment: number;
  realInvestment: number;
  committedExports: number;
  realExports: number;
  files: string[];
}

export interface CompanyItem {
  id: string;
  name: string;
  legalId: string;
  park: string;
  zonaFranca?: string;
  code?: string;
  province: string;
  sector: string;
  employees: number;
  investment: number;
  totalInvestmentUSD?: number;
  regimenType: string;
  status: 'Activa' | 'En Auditoría' | 'En Riesgo' | 'Suspendida';
  activeAlerts: number;
  complianceScore: number;
  joinDate?: string;
  lastAuditDate?: string;
}

export type EmpresaItem = CompanyItem;
