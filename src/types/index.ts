export type DocumentType = 'FI' | 'FP'; // Formulaire d'Initiative ou Fiche Projet

export type WorkflowStatus = 
  | 'draft'              // 0: En cours de rédaction
  | 'pending_n1'         // 1: En attente validation N+1
  | 'rejected_n1'        // 2: Rejeté par N+1
  | 'pmo_review'         // 3: En revue par PMO
  | 'pmo_corrections'    // 4: Corrections demandées par PMO
  | 'committee_review'   // 5: En revue par Comité décisionnel
  | 'committee_corrections' // 6: Corrections demandées par CODIR
  | 'approved'           // 7: Approuvé par CODIR (GO)
  | 'archived';          // 8: Archivée (projet non poursuivi)

export interface WorkflowComment {
  id: string;
  author: string;
  role: string;
  comment: string;
  status: WorkflowStatus;
  createdAt: string;
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  documentType: DocumentType; // FI ou FP
  status: WorkflowStatus;
  objectives: string;
  scope: string;
  budgetEstimated?: number;
  timelineEstimated?: {
    startDate?: string;
    endDate?: string;
  };
  initiatingService: string;
  initiator: string;
  projectManager?: string; // Obligatoire pour FP
  sponsor?: string; // Obligatoire pour FP
  n1Validator?: string; // Supérieur hiérarchique
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  workflowComments: WorkflowComment[];
  fiId?: string; // Pour FP : référence vers la FI d'origine
  rejectionReason?: string;
  correctionRequests?: string[];
}

export interface Project {
  id: string;
  initiativeId: string; // Référence vers la FP approuvée
  fiId: string; // Référence vers la FI d'origine
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  
  // 1. GOUVERNANCE
  governance: {
    raciMatrix: RACIRole[];
    sponsor: string;
    projectManager: string;
    steeringCommittee: string[];
  };
  
  // 2. BUDGET
  budget: {
    initialEstimate: number;
    currentBudget: number;
    spent: number;
    remaining: number;
    externalCosts: number;
    internalCosts: number;
    budgetCode: string;
    deliverableBudgets: DeliverableBudget[];
    variance: number; // percentage
  };
  
  // 3. PLANNING
  planning: {
    initialStartDate: string;
    initialEndDate: string;
    actualStartDate?: string;
    currentEndDate: string;
    varianceDays: number;
    totalDuration: number; // in days
  };
  
  // 4. RISQUES ET COMPLEXITÉ
  riskManagement: {
    globalRiskLevel: 'low' | 'medium' | 'high';
    riskCategories: RiskCategory[];
    risks: Risk[];
    complexityFactors: string[];
  };
  
  // 5. SUIVI ET AVANCEMENT
  monitoring: {
    healthStatus: 'green' | 'orange' | 'red';
    scheduleStatus: 'ahead' | 'on_time' | 'delayed';
    completionPercentage: number;
    lastAchievements: string;
    nextMajorMilestone: string;
    blockers: string[];
    attentionPoints: string[];
  };
  
  milestones: Milestone[];
  resources: Resource[];
  scopeChanges: ScopeChange[];
  lastUpdated: string;
  nextUpdateDue: string;
  createdAt: string;
}

export interface RACIRole {
  id: string;
  name: string;
  function: string;
  responsibility: 'R' | 'A' | 'C' | 'I'; // Responsible, Accountable, Consulted, Informed
  role: 'sponsor' | 'project_manager' | 'activity_manager' | 'steering_member' | 'other';
}

export interface DeliverableBudget {
  id: string;
  deliverableName: string;
  milestoneId: string;
  allocatedBudget: number;
  spentBudget: number;
}

export interface RiskCategory {
  category: 'technical' | 'organizational' | 'financial' | 'regulatory' | 'operational';
  level: 'low' | 'medium' | 'high';
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  plannedDate: string;
  actualDate?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  deliverables: Deliverable[];
  budgetAllocated?: number;
}

export interface Deliverable {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  budgetAllocated?: number;
}

export interface Resource {
  id: string;
  name: string;
  role: string;
  allocation: number; // percentage
  startDate: string;
  endDate: string;
  costPerDay?: number;
}

export interface ScopeChange {
  id: string;
  description: string;
  impact: string;
  budgetImpact: number;
  timelineImpact: number;
  status: 'proposed' | 'approved' | 'rejected';
  requestedBy: string;
  requestedAt: string;
}

export interface Risk {
  id: string;
  description: string;
  category: 'technical' | 'organizational' | 'financial' | 'regulatory' | 'operational';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  owner: string;
  status: 'open' | 'mitigated' | 'closed';
  createdAt: string;
}

export type CommitteeType = 'codir' | 'comex_proprete' | 'comex_filiales' | 'comex_commercial' | 'comex_collectes';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'service_manager' | 'pmo' | 'committee_member' | 'admin';
  service: string;
}

export interface DashboardStats {
  totalInitiatives: number;
  pendingReviews: number;
  activeProjects: number;
  overdueUpdates: number;
  budgetUtilization: number;
  riskCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}