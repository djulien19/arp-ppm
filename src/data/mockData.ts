import { Initiative, Project, DashboardStats, WorkflowStatus, DocumentType, WorkflowComment } from '../types';

export const services = [
  'Direction Générale',
  'Direction Collectes',
  'Direction Propreté',
  'Direction Technique',
  'Direction RH',
  'Direction Financière',
  'Direction Commerciale',
  'PMO'
];

export const committeeNames = {
  codir: 'Comité de Direction (CODIR)',
  comex_proprete: 'Comité Exécutif Propreté',
  comex_filiales: 'Comité Exécutif Filiales',
  comex_commercial: 'Comité Exécutif Commercial',
  comex_collectes: 'Comité Exécutif Collectes'
};

export const workflowStatusLabels: Record<WorkflowStatus, string> = {
  'draft': 'En cours de rédaction',
  'pending_n1': 'En attente validation N+1',
  'rejected_n1': 'Rejeté par N+1',
  'pmo_review': 'En revue par PMO',
  'pmo_corrections': 'Corrections demandées par PMO',
  'committee_review': 'En revue par Comité décisionnel',
  'committee_corrections': 'Corrections demandées par CODIR',
  'approved': 'Approuvé par CODIR (GO)',
  'archived': 'Archivée'
};

export const documentTypeLabels: Record<DocumentType, string> = {
  'FI': 'Formulaire d\'Initiative',
  'FP': 'Fiche Projet'
};

export const healthStatusLabels = {
  green: 'Vert - Projet en bonne santé',
  orange: 'Orange - Points d\'attention',
  red: 'Rouge - Problèmes critiques'
};

export const scheduleStatusLabels = {
  ahead: 'En avance',
  on_time: 'Dans les temps',
  delayed: 'En retard'
};

export const raciResponsibilities = {
  R: 'Réalise',
  A: 'Approuve', 
  C: 'Consulté',
  I: 'Informé'
};

export const riskCategories = {
  technical: 'Technique',
  organizational: 'Organisationnel',
  financial: 'Financier',
  regulatory: 'Réglementaire',
  operational: 'Opérationnel'
};

// Données de test pour les initiatives
export const mockInitiatives: Initiative[] = [
  {
    id: '1',
    title: 'Optimisation des tournées de collecte',
    description: 'Mise en place d\'un nouveau système d\'optimisation des tournées pour réduire les coûts et améliorer l\'efficacité.',
    documentType: 'FI',
    status: 'committee_review',
    objectives: 'Réduire de 15% les coûts de collecte et améliorer la satisfaction client',
    scope: 'Toutes les tournées de collecte de la région Bruxelles-Capitale',
    budgetEstimated: 250000,
    timelineEstimated: {
      startDate: '2024-04-01',
      endDate: '2024-12-31'
    },
    initiatingService: 'Direction Collectes',
    initiator: 'Pierre Dupont',
    n1Validator: 'Marie Martin',
    createdBy: 'Pierre Dupont',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
    workflowComments: [
      {
        id: '1',
        author: 'Marie Martin',
        role: 'Chef de Service',
        comment: 'Initiative validée, transmission au PMO pour évaluation.',
        status: 'pending_n1',
        createdAt: '2024-01-20T10:00:00Z'
      },
      {
        id: '2',
        author: 'Jean PMO',
        role: 'PMO',
        comment: 'Dossier techniquement solide, à présenter en CODIR.',
        status: 'pmo_review',
        createdAt: '2024-02-05T15:30:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Digitalisation des processus RH',
    description: 'Modernisation des outils RH et automatisation des processus administratifs.',
    documentType: 'FP',
    status: 'approved',
    objectives: 'Automatiser 80% des processus RH et améliorer l\'expérience collaborateur',
    scope: 'Ensemble des processus RH : recrutement, formation, évaluation, congés',
    budgetEstimated: 150000,
    timelineEstimated: {
      startDate: '2024-03-01',
      endDate: '2024-10-31'
    },
    initiatingService: 'Direction RH',
    initiator: 'Sophie Leclerc',
    projectManager: 'Thomas Bernard',
    sponsor: 'Catherine Dubois',
    n1Validator: 'Catherine Dubois',
    fiId: '2-fi',
    createdBy: 'Sophie Leclerc',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-02-25T16:00:00Z',
    workflowComments: [
      {
        id: '3',
        author: 'Catherine Dubois',
        role: 'Directrice RH',
        comment: 'Projet stratégique, validation pour passage en réalisation.',
        status: 'pending_n1',
        createdAt: '2024-01-15T11:00:00Z'
      },
      {
        id: '4',
        author: 'Jean PMO',
        role: 'PMO',
        comment: 'Fiche projet complète et bien documentée.',
        status: 'pmo_review',
        createdAt: '2024-02-01T09:00:00Z'
      },
      {
        id: '5',
        author: 'Directeur Général',
        role: 'CODIR',
        comment: 'Projet approuvé. Lancement autorisé.',
        status: 'approved',
        createdAt: '2024-02-25T16:00:00Z'
      }
    ]
  },
  {
    id: '3',
    title: 'Nouveau système de géolocalisation',
    description: 'Déploiement d\'un système GPS avancé sur tous les véhicules de collecte.',
    documentType: 'FI',
    status: 'pmo_corrections',
    objectives: 'Améliorer le suivi des tournées et la communication avec les usagers',
    scope: 'Flotte complète de véhicules de collecte (120 véhicules)',
    budgetEstimated: 180000,
    initiatingService: 'Direction Technique',
    initiator: 'Marc Rousseau',
    n1Validator: 'Paul Morel',
    createdBy: 'Marc Rousseau',
    createdAt: '2024-02-01T08:30:00Z',
    updatedAt: '2024-02-28T10:15:00Z',
    correctionRequests: [
      'Préciser l\'analyse coût-bénéfice',
      'Détailler le plan de formation des chauffeurs',
      'Inclure l\'analyse d\'impact RGPD'
    ],
    workflowComments: [
      {
        id: '6',
        author: 'Paul Morel',
        role: 'Directeur Technique',
        comment: 'Initiative intéressante, transmission au PMO.',
        status: 'pending_n1',
        createdAt: '2024-02-10T14:00:00Z'
      },
      {
        id: '7',
        author: 'Jean PMO',
        role: 'PMO',
        comment: 'Le dossier nécessite des compléments avant présentation en comité.',
        status: 'pmo_corrections',
        createdAt: '2024-02-28T10:15:00Z'
      }
    ]
  },
  {
    id: '4',
    title: 'Modernisation du parc véhicules',
    description: 'Remplacement progressif de la flotte par des véhicules électriques et hybrides.',
    documentType: 'FI',
    status: 'draft',
    objectives: 'Réduire l\'empreinte carbone et les coûts de maintenance',
    scope: 'Remplacement de 50 véhicules sur 3 ans',
    budgetEstimated: 2500000,
    initiatingService: 'Direction Technique',
    initiator: 'Marc Rousseau',
    createdBy: 'Marc Rousseau',
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-02-15T09:00:00Z',
    workflowComments: []
  },
  {
    id: '5',
    title: 'Amélioration du tri sélectif',
    description: 'Campagne de sensibilisation et amélioration des infrastructures de tri.',
    documentType: 'FI',
    status: 'rejected_n1',
    objectives: 'Augmenter le taux de tri sélectif de 20%',
    scope: 'Ensemble des communes desservies',
    budgetEstimated: 300000,
    initiatingService: 'Direction Propreté',
    initiator: 'Amélie Fontaine',
    n1Validator: 'Claire Dubois',
    rejectionReason: 'Initiative intéressante mais budget insuffisant pour l\'ampleur du projet. Revoir à la baisse ou étaler sur plusieurs années.',
    createdBy: 'Amélie Fontaine',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-02-10T16:30:00Z',
    workflowComments: [
      {
        id: '8',
        author: 'Claire Dubois',
        role: 'Directrice Propreté',
        comment: 'Le budget demandé est trop important pour une année. Merci de revoir la proposition.',
        status: 'rejected_n1',
        createdAt: '2024-02-10T16:30:00Z'
      }
    ]
  }
];

// Projets actifs (issus de FP approuvées)
export const mockProjects: Project[] = [
  {
    id: '1',
    initiativeId: '2', // FP Digitalisation RH
    fiId: '2-fi',
    title: 'Digitalisation des processus RH',
    description: 'Modernisation des outils RH et automatisation des processus administratifs.',
    status: 'in_progress',
    committeeType: 'codir',
    committeeType: 'codir',
    governance: {
      raciMatrix: [
        {
          id: '1',
          name: 'Thomas Bernard',
          function: 'Chef de projet',
          responsibility: 'R',
          role: 'project_manager'
        },
        {
          id: '2',
          name: 'Catherine Dubois',
          function: 'Directrice RH',
          responsibility: 'A',
          role: 'sponsor'
        },
        {
          id: '3',
          name: 'Sophie Leclerc',
          function: 'Responsable formation',
          responsibility: 'C',
          role: 'other'
        },
        {
          id: '4',
          name: 'Jean PMO',
          function: 'PMO',
          responsibility: 'I',
          role: 'other'
        }
      ],
      sponsor: 'Catherine Dubois',
      projectManager: 'Thomas Bernard',
      steeringCommittee: ['Catherine Dubois', 'Directeur Général', 'Jean PMO']
    },
    budget: {
      initialEstimate: 150000,
      currentBudget: 155000,
      spent: 95000,
      remaining: 60000,
      externalCosts: 80000,
      internalCosts: 75000,
      budgetCode: 'PRJ-2024-HR-001',
      deliverableBudgets: [
        {
          id: '1',
          deliverableName: 'Analyse des besoins',
          milestoneId: '1',
          allocatedBudget: 25000,
          spentBudget: 25000
        },
        {
          id: '2',
          deliverableName: 'Développement module recrutement',
          milestoneId: '2',
          allocatedBudget: 70000,
          spentBudget: 45000
        }
      ],
      variance: 3.3
    },
    planning: {
      initialStartDate: '2024-03-01',
      initialEndDate: '2024-10-31',
      actualStartDate: '2024-03-01',
      currentEndDate: '2024-11-15',
      varianceDays: 15,
      totalDuration: 245
    },
    riskManagement: {
      globalRiskLevel: 'medium',
      riskCategories: [
        { category: 'technical', level: 'medium' },
        { category: 'organizational', level: 'high' },
        { category: 'financial', level: 'low' }
      ],
      risks: [
        {
          id: '1',
          description: 'Résistance au changement des équipes',
          category: 'organizational',
          probability: 'high',
          impact: 'medium',
          severity: 'medium',
          mitigation: 'Plan de formation renforcé et communication régulière',
          owner: 'Thomas Bernard',
          status: 'open',
          createdAt: '2024-03-15T09:00:00Z'
        }
      ],
      complexityFactors: [
        'Intégration avec les systèmes existants',
        'Formation de 200+ collaborateurs',
        'Migration de données historiques'
      ]
    },
    monitoring: {
      healthStatus: 'orange',
      scheduleStatus: 'delayed',
      completionPercentage: 65,
      lastAchievements: 'Module recrutement développé à 80%, tests utilisateurs en cours',
      nextMajorMilestone: 'Mise en production du module recrutement - prévu le 15/11/2024',
      blockers: [
        'Retard dans la validation des spécifications par les utilisateurs métier'
      ],
      attentionPoints: [
        'Formation des utilisateurs à planifier',
        'Test de charge à effectuer'
      ]
    },
    milestones: [
      {
        id: '1',
        name: 'Analyse des besoins terminée',
        description: 'Cartographie complète des processus actuels et spécifications détaillées',
        plannedDate: '2024-04-30',
        actualDate: '2024-04-30',
        status: 'completed',
        deliverables: [
          {
            id: '1',
            name: 'Rapport d\'analyse',
            description: 'Document de 50 pages détaillant les processus actuels',
            status: 'completed',
            dueDate: '2024-04-30'
          }
        ],
        budgetAllocated: 25000
      },
      {
        id: '2',
        name: 'Module recrutement livré',
        description: 'Développement et tests du module de gestion des recrutements',
        plannedDate: '2024-08-31',
        status: 'in_progress',
        deliverables: [
          {
            id: '2',
            name: 'Application web',
            description: 'Interface de gestion des candidatures',
            status: 'in_progress',
            dueDate: '2024-08-31'
          }
        ],
        budgetAllocated: 70000
      }
    ],
    resources: [
      {
        id: '1',
        name: 'Thomas Bernard',
        role: 'Chef de projet',
        allocation: 100,
        startDate: '2024-03-01',
        endDate: '2024-11-15',
        costPerDay: 600
      },
      {
        id: '2',
        name: 'Développeur externe',
        role: 'Développeur senior',
        allocation: 80,
        startDate: '2024-04-01',
        endDate: '2024-10-31',
        costPerDay: 500
      }
    ],
    scopeChanges: [],
    lastUpdated: '2024-02-10T10:00:00Z', // Mise à jour il y a 18 jours pour déclencher une notification
    nextUpdateDue: '2024-02-25T10:00:00Z',
    createdAt: '2024-03-01T09:00:00Z'
  },
  {
    id: '2',
    initiativeId: '3',
    fiId: '3-fi', 
    title: 'Optimisation des tournées de collecte',
    description: 'Mise en place d\'un nouveau système d\'optimisation des tournées pour réduire les coûts et améliorer l\'efficacité.',
    status: 'in_progress',
    committeeType: 'comex_collectes',
    governance: {
      raciMatrix: [
        {
          id: '1',
          name: 'Pierre Dupont',
          function: 'Chef de projet',
          responsibility: 'R',
          role: 'project_manager'
        },
        {
          id: '2', 
          name: 'Marie Martin',
          function: 'Directrice Collectes',
          responsibility: 'A',
          role: 'sponsor'
        }
      ],
      sponsor: 'Marie Martin',
      projectManager: 'Pierre Dupont',
      steeringCommittee: ['Marie Martin', 'Directeur Technique', 'PMO']
    },
    budget: {
      initialEstimate: 250000,
      currentBudget: 250000,
      spent: 45000,
      remaining: 205000,
      externalCosts: 150000,
      internalCosts: 100000,
      budgetCode: 'PRJ-2024-COL-002',
      deliverableBudgets: [],
      variance: -2.1
    },
    planning: {
      initialStartDate: '2024-04-01',
      initialEndDate: '2024-12-31',
      actualStartDate: '2024-04-01',
      currentEndDate: '2025-01-15',
      varianceDays: 15,
      totalDuration: 275
    },
    riskManagement: {
      globalRiskLevel: 'high',
      riskCategories: [
        { category: 'technical', level: 'high' },
        { category: 'operational', level: 'medium' }
      ],
      risks: [
        {
          id: '1',
          description: 'Intégration complexe avec les systèmes GPS existants',
          category: 'technical',
          probability: 'high',
          impact: 'high', 
          severity: 'high',
          mitigation: 'Tests approfondis et plan de fallback préparé',
          owner: 'Pierre Dupont',
          status: 'open',
          createdAt: '2024-04-15T09:00:00Z'
        }
      ],
      complexityFactors: [
        'Intégration avec 5 systèmes différents',
        'Formation de 120 chauffeurs',
        'Déploiement sur 3 sites'
      ]
    },
    monitoring: {
      healthStatus: 'orange',
      scheduleStatus: 'delayed',
      completionPercentage: 25,
      lastAchievements: 'Analyse des besoins terminée, sélection du fournisseur en cours',
      nextMajorMilestone: 'Signature du contrat fournisseur - prévu le 15/03/2024',
      blockers: [
        'Négociation contractuelle en cours avec le fournisseur principal',
        'Validation sécurité IT en attente'
      ],
      attentionPoints: [
        'Budget serré pour la phase d\'intégration', 
        'Planning serré pour la formation des utilisateurs'
      ]
    },
    milestones: [],
    resources: [],
    scopeChanges: [],
    lastUpdated: '2024-01-28T15:00:00Z', // Mise à jour il y a 32 jours pour déclencher une notification urgente
    nextUpdateDue: '2024-02-15T15:00:00Z',
    createdAt: '2024-04-01T09:00:00Z',
    performanceReports: []
  },
  {
    id: '3',
    initiativeId: '4',
    fiId: '4-fi',
    title: 'Modernisation du parc véhicules',
    description: 'Remplacement progressif de la flotte par des véhicules électriques et hybrides.',
    status: 'planning',
    committeeType: 'codir',
    governance: {
      raciMatrix: [
        {
          id: '1',
          name: 'Marc Rousseau',
          function: 'Chef de projet',
          responsibility: 'R',
          role: 'project_manager'
        }
      ],
      sponsor: 'Directeur Technique',
      projectManager: 'Marc Rousseau',
      steeringCommittee: ['Directeur Technique', 'Directeur Financier']
    },
    budget: {
      initialEstimate: 2500000,
      currentBudget: 2500000,
      spent: 0,
      remaining: 2500000,
      externalCosts: 2200000,
      internalCosts: 300000,
      budgetCode: 'PRJ-2024-VEH-003',
      deliverableBudgets: [],
      variance: 0
    },
    planning: {
      initialStartDate: '2024-06-01',
      initialEndDate: '2027-05-31',
      currentEndDate: '2027-05-31',
      varianceDays: 0,
      totalDuration: 1095
    },
    riskManagement: {
      globalRiskLevel: 'medium',
      riskCategories: [
        { category: 'financial', level: 'high' },
        { category: 'regulatory', level: 'medium' }
      ],
      risks: [],
      complexityFactors: []
    },
    monitoring: {
      healthStatus: 'green',
      scheduleStatus: 'on_time',
      completionPercentage: 5,
      lastAchievements: 'Études préliminaires en cours',
      nextMajorMilestone: 'Cahier des charges finalisé',
      blockers: [],
      attentionPoints: []
    },
    milestones: [],
    resources: [],
    scopeChanges: [],
    lastUpdated: '2024-02-20T14:00:00Z', // Projet récent, pas de notification
    nextUpdateDue: '2024-03-20T14:00:00Z',
    createdAt: '2024-02-01T09:00:00Z',
    performanceReports: []
  },
  {
    id: '2',
    initiativeId: '3',
    fiId: '3-fi', 
    title: 'Optimisation des tournées de collecte',
    description: 'Mise en place d\'un nouveau système d\'optimisation des tournées pour réduire les coûts et améliorer l\'efficacité.',
    status: 'in_progress',
    committeeType: 'comex_collectes',
    governance: {
      raciMatrix: [
        {
          id: '1',
          name: 'Pierre Dupont',
          function: 'Chef de projet',
          responsibility: 'R',
          role: 'project_manager'
        },
        {
          id: '2', 
          name: 'Marie Martin',
          function: 'Directrice Collectes',
          responsibility: 'A',
          role: 'sponsor'
        }
      ],
      sponsor: 'Marie Martin',
      projectManager: 'Pierre Dupont',
      steeringCommittee: ['Marie Martin', 'Directeur Technique', 'PMO']
    },
    budget: {
      initialEstimate: 250000,
      currentBudget: 250000,
      spent: 45000,
      remaining: 205000,
      externalCosts: 150000,
      internalCosts: 100000,
      budgetCode: 'PRJ-2024-COL-002',
      deliverableBudgets: [],
      variance: -2.1
    },
    planning: {
      initialStartDate: '2024-04-01',
      initialEndDate: '2024-12-31',
      actualStartDate: '2024-04-01',
      currentEndDate: '2025-01-15',
      varianceDays: 15,
      totalDuration: 275
    },
    riskManagement: {
      globalRiskLevel: 'high',
      riskCategories: [
        { category: 'technical', level: 'high' },
        { category: 'operational', level: 'medium' }
      ],
      risks: [
        {
          id: '1',
          description: 'Intégration complexe avec les systèmes GPS existants',
          category: 'technical',
          probability: 'high',
          impact: 'high', 
          severity: 'high',
          mitigation: 'Tests approfondis et plan de fallback préparé',
          owner: 'Pierre Dupont',
          status: 'open',
          createdAt: '2024-04-15T09:00:00Z'
        }
      ],
      complexityFactors: [
        'Intégration avec 5 systèmes différents',
        'Formation de 120 chauffeurs',
        'Déploiement sur 3 sites'
      ]
    },
    monitoring: {
      healthStatus: 'orange',
      scheduleStatus: 'delayed',
      completionPercentage: 25,
      lastAchievements: 'Analyse des besoins terminée, sélection du fournisseur en cours',
      nextMajorMilestone: 'Signature du contrat fournisseur - prévu le 15/03/2024',
      blockers: [
        'Négociation contractuelle en cours avec le fournisseur principal',
        'Validation sécurité IT en attente'
      ],
      attentionPoints: [
        'Budget serré pour la phase d\'intégration', 
        'Planning serré pour la formation des utilisateurs'
      ]
    },
    milestones: [],
    resources: [],
    scopeChanges: [],
    lastUpdated: '2024-01-28T15:00:00Z', // Mise à jour il y a 32 jours pour déclencher une notification urgente
    nextUpdateDue: '2024-02-15T15:00:00Z',
    createdAt: '2024-04-01T09:00:00Z',
    performanceReports: []
  },
  {
    id: '3',
    initiativeId: '4',
    fiId: '4-fi',
    title: 'Modernisation du parc véhicules',
    description: 'Remplacement progressif de la flotte par des véhicules électriques et hybrides.',
    status: 'planning',
    committeeType: 'codir',
    governance: {
      raciMatrix: [
        {
          id: '1',
          name: 'Marc Rousseau',
          function: 'Chef de projet',
          responsibility: 'R',
          role: 'project_manager'
        }
      ],
      sponsor: 'Directeur Technique',
      projectManager: 'Marc Rousseau',
      steeringCommittee: ['Directeur Technique', 'Directeur Financier']
    },
    budget: {
      initialEstimate: 2500000,
      currentBudget: 2500000,
      spent: 0,
      remaining: 2500000,
      externalCosts: 2200000,
      internalCosts: 300000,
      budgetCode: 'PRJ-2024-VEH-003',
      deliverableBudgets: [],
      variance: 0
    },
    planning: {
      initialStartDate: '2024-06-01',
      initialEndDate: '2027-05-31',
      currentEndDate: '2027-05-31',
      varianceDays: 0,
      totalDuration: 1095
    },
    riskManagement: {
      globalRiskLevel: 'medium',
      riskCategories: [
        { category: 'financial', level: 'high' },
        { category: 'regulatory', level: 'medium' }
      ],
      risks: [],
      complexityFactors: []
    },
    monitoring: {
      healthStatus: 'green',
      scheduleStatus: 'on_time',
      completionPercentage: 5,
      lastAchievements: 'Études préliminaires en cours',
      nextMajorMilestone: 'Cahier des charges finalisé',
      blockers: [],
      attentionPoints: []
    },
    milestones: [],
    resources: [],
    scopeChanges: [],
    lastUpdated: '2024-02-20T14:00:00Z', // Projet récent, pas de notification
    nextUpdateDue: '2024-03-20T14:00:00Z',
    createdAt: '2024-02-01T09:00:00Z',
    performanceReports: []
  }
];

export const mockDashboardStats: DashboardStats = {
  totalInitiatives: mockInitiatives.length,
  pendingReviews: mockInitiatives.filter(i => 
    ['pending_n1', 'pmo_review', 'committee_review'].includes(i.status)
  ).length,
  activeProjects: mockProjects.filter(p => p.status === 'in_progress').length,
  overdueUpdates: 2,
  budgetUtilization: 68,
  riskCount: {
    critical: 1,
    high: 3,
    medium: 8,
    low: 12
  }
};