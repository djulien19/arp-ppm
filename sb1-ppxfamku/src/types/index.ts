export interface Initiative {
  id: string;
  title: string;
  description: string;
  type: 'idea' | 'anomaly';
  status: 'draft' | 'service_review' | 'pmo_review' | 'committee_review' | 'validated' | 'rejected' | 'project';
  objectives: string;
  scope: string;
  budgetRange: {
    min: number;
    max: number;
  };
  timeline: {
    startDate: string;
    endDate: string;
  };
  assignedService: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  pmoReviewDate?: string;
  committeeReviewDate?: string;
  committeeType?: CommitteeType;
  rejectionReason?: string;
}

export interface Project {
  id: string;
  initiativeId: string;
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