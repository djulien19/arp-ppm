import { Initiative, Project, User, DashboardStats, CommitteeType } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Marie Dubois',
  email: 'marie.dubois@bruxelles.be',
  role: 'pmo',
  service: 'PMO'
};

export const mockInitiatives: Initiative[] = [
  {
    id: '1',
    title: 'Optimisation des tournées de collecte',
    description: 'Améliorer l\'efficacité des tournées de collecte des déchets ménagers en utilisant des algorithmes d\'optimisation',
    type: 'idea',
    status: 'committee_review',
    objectives: 'Réduire de 15% le temps de collecte et les coûts de carburant',
    scope: 'Toutes les communes de la Région de Bruxelles-Capitale',
    budgetRange: { min: 150000, max: 200000 },
    timeline: { startDate: '2024-03-01', endDate: '2024-12-31' },
    assignedService: 'Service Collectes',
    createdBy: 'Jean Martin',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-10',
    pmoReviewDate: '2024-02-05',
    committeeType: 'comex_collectes'
  },
  {
    id: '2',
    title: 'Digitalisation des processus RH',
    description: 'Mise en place d\'un système de gestion RH digitalisé pour automatiser les processus administratifs',
    type: 'idea',
    status: 'pmo_review',
    objectives: 'Réduire de 40% le temps de traitement des dossiers RH',
    scope: 'Tous les services de Bruxelles-Propreté',
    budgetRange: { min: 80000, max: 120000 },
    timeline: { startDate: '2024-04-01', endDate: '2024-10-31' },
    assignedService: 'Ressources Humaines',
    createdBy: 'Sophie Laurent',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-15'
  },
  {
    id: '3',
    title: 'Résolution problème de tri sélectif',
    description: 'Anomalie détectée dans le processus de tri sélectif causant des contaminations',
    type: 'anomaly',
    status: 'service_review',
    objectives: 'Éliminer les contaminations dans le tri sélectif',
    scope: 'Centre de tri de Neder-Over-Heembeek',
    budgetRange: { min: 25000, max: 40000 },
    timeline: { startDate: '2024-02-15', endDate: '2024-06-30' },
    assignedService: 'Service Tri',
    createdBy: 'Marc Vandenberghe',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-12'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    initiativeId: '4',
    title: 'Modernisation du parc véhicules',
    description: 'Remplacement progressif de la flotte par des véhicules électriques et hybrides',
    status: 'in_progress',
    
    // 1. GOUVERNANCE
    governance: {
      raciMatrix: [
        {
          id: '1',
          name: 'Directeur Technique',
          function: 'Directeur du Service Technique',
          responsibility: 'A',
          role: 'sponsor'
        },
        {
          id: '2',
          name: 'Pierre Janssens',
          function: 'Chef de Projet Senior',
          responsibility: 'R',
          role: 'project_manager'
        },
        {
          id: '3',
          name: 'Sarah Kowalski',
          function: 'Responsable Parc Automobile',
          responsibility: 'R',
          role: 'activity_manager'
        },
        {
          id: '4',
          name: 'Marie Dubois',
          function: 'PMO',
          responsibility: 'C',
          role: 'steering_member'
        },
        {
          id: '5',
          name: 'Jean-Claude Van Damme',
          function: 'Directeur Financier',
          responsibility: 'C',
          role: 'steering_member'
        },
        {
          id: '6',
          name: 'Anne Moreau',
          function: 'Responsable Achats',
          responsibility: 'I',
          role: 'other'
        }
      ],
      sponsor: 'Directeur Technique',
      projectManager: 'Pierre Janssens',
      steeringCommittee: ['Marie Dubois', 'Jean-Claude Van Damme', 'Anne Moreau']
    },
    
    // 2. BUDGET
    budget: {
      initialEstimate: 2200000,
      currentBudget: 2500000,
      spent: 185000,
      remaining: 2315000,
      externalCosts: 2000000,
      internalCosts: 500000,
      budgetCode: 'AB-2024-FLEET-001',
      deliverableBudgets: [
        {
          id: '1',
          deliverableName: 'Étude de faisabilité',
          milestoneId: '1',
          allocatedBudget: 50000,
          spentBudget: 45000
        },
        {
          id: '2',
          deliverableName: 'Appel d\'offres',
          milestoneId: '2',
          allocatedBudget: 25000,
          spentBudget: 15000
        }
      ],
      variance: 13.6 // (2500000 - 2200000) / 2200000 * 100
    },
    
    // 3. PLANNING
    planning: {
      initialStartDate: '2024-01-01',
      initialEndDate: '2024-10-31',
      actualStartDate: '2024-01-08',
      currentEndDate: '2024-12-15',
      varianceDays: 45,
      totalDuration: 341
    },
    
    // 4. RISQUES ET COMPLEXITÉ
    riskManagement: {
      globalRiskLevel: 'medium',
      riskCategories: [
        { category: 'technical', level: 'medium' },
        { category: 'financial', level: 'high' },
        { category: 'operational', level: 'low' }
      ],
      risks: [
        {
          id: '1',
          description: 'Retard de livraison des véhicules par le fournisseur',
          category: 'operational',
          probability: 'medium',
          impact: 'high',
          severity: 'high',
          mitigation: 'Négociation de clauses pénales et recherche de fournisseurs alternatifs',
          owner: 'Pierre Janssens',
          status: 'open',
          createdAt: '2024-02-01'
        },
        {
          id: '2',
          description: 'Dépassement budgétaire lié à l\'inflation des prix',
          category: 'financial',
          probability: 'high',
          impact: 'medium',
          severity: 'high',
          mitigation: 'Révision budgétaire et négociation avec les fournisseurs',
          owner: 'Jean-Claude Van Damme',
          status: 'open',
          createdAt: '2024-02-10'
        }
      ],
      complexityFactors: [
        'Coordination avec 5 services différents',
        'Intégration avec les systèmes existants',
        'Formation de 150+ conducteurs'
      ]
    },
    
    // 5. SUIVI ET AVANCEMENT
    monitoring: {
      healthStatus: 'orange',
      scheduleStatus: 'delayed',
      completionPercentage: 25,
      lastAchievements: 'Finalisation de l\'étude de faisabilité technique et validation des spécifications par le comité technique',
      nextMajorMilestone: 'Lancement de l\'appel d\'offres public prévu pour avril 2024',
      blockers: [
        'Attente validation budgétaire pour l\'extension du périmètre',
        'Retard dans l\'obtention des autorisations environnementales'
      ],
      attentionPoints: [
        'Risque de dépassement budgétaire de 15%',
        'Nécessité de renforcer l\'équipe projet',
        'Coordination avec les syndicats pour la formation'
      ]
    },
    
    milestones: [
      {
        id: '1',
        name: 'Étude de faisabilité',
        description: 'Analyse technique et financière du remplacement',
        plannedDate: '2024-02-28',
        actualDate: '2024-03-05',
        status: 'completed',
        budgetAllocated: 50000,
        deliverables: [
          {
            id: '1',
            name: 'Rapport d\'étude technique',
            description: 'Document détaillant les spécifications techniques',
            status: 'completed',
            dueDate: '2024-02-25',
            budgetAllocated: 30000
          },
          {
            id: '2',
            name: 'Analyse financière',
            description: 'Étude de rentabilité et impact budgétaire',
            status: 'completed',
            dueDate: '2024-02-28',
            budgetAllocated: 20000
          }
        ]
      },
      {
        id: '2',
        name: 'Appel d\'offres',
        description: 'Lancement de la procédure de marché public',
        plannedDate: '2024-04-15',
        status: 'in_progress',
        budgetAllocated: 25000,
        deliverables: [
          {
            id: '3',
            name: 'Cahier des charges',
            description: 'Spécifications pour l\'appel d\'offres',
            status: 'in_progress',
            dueDate: '2024-04-10',
            budgetAllocated: 15000
          },
          {
            id: '4',
            name: 'Dossier de consultation',
            description: 'Documentation complète pour les soumissionnaires',
            status: 'pending',
            dueDate: '2024-04-15',
            budgetAllocated: 10000
          }
        ]
      }
    ],
    
    resources: [
      {
        id: '1',
        name: 'Pierre Janssens',
        role: 'Chef de projet',
        allocation: 80,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        costPerDay: 450
      },
      {
        id: '2',
        name: 'Sarah Kowalski',
        role: 'Analyste technique',
        allocation: 50,
        startDate: '2024-01-15',
        endDate: '2024-06-30',
        costPerDay: 380
      },
      {
        id: '3',
        name: 'Marc Durand',
        role: 'Consultant externe',
        allocation: 100,
        startDate: '2024-02-01',
        endDate: '2024-04-30',
        costPerDay: 650
      }
    ],
    
    scopeChanges: [
      {
        id: '1',
        description: 'Ajout de 5 véhicules supplémentaires pour le service balayage',
        impact: 'Extension du périmètre pour couvrir les nouveaux besoins',
        budgetImpact: 150000,
        timelineImpact: 30,
        status: 'approved',
        requestedBy: 'Service Balayage',
        requestedAt: '2024-02-20'
      }
    ],
    
    lastUpdated: '2024-02-15',
    nextUpdateDue: '2024-02-29',
    createdAt: '2024-01-01'
  },
  
  {
    id: '2',
    initiativeId: '5',
    title: 'Digitalisation des processus RH',
    description: 'Mise en place d\'un système de gestion RH digitalisé',
    status: 'planning',
    
    governance: {
      raciMatrix: [
        {
          id: '1',
          name: 'Directeur RH',
          function: 'Directeur des Ressources Humaines',
          responsibility: 'A',
          role: 'sponsor'
        },
        {
          id: '2',
          name: 'Sophie Laurent',
          function: 'Chef de Projet RH',
          responsibility: 'R',
          role: 'project_manager'
        }
      ],
      sponsor: 'Directeur RH',
      projectManager: 'Sophie Laurent',
      steeringCommittee: ['Marie Dubois', 'Directeur IT']
    },
    
    budget: {
      initialEstimate: 100000,
      currentBudget: 120000,
      spent: 15000,
      remaining: 105000,
      externalCosts: 80000,
      internalCosts: 40000,
      budgetCode: 'AB-2024-RH-002',
      deliverableBudgets: [],
      variance: 20
    },
    
    planning: {
      initialStartDate: '2024-04-01',
      initialEndDate: '2024-10-31',
      actualStartDate: '2024-04-01',
      currentEndDate: '2024-11-15',
      varianceDays: 15,
      totalDuration: 228
    },
    
    riskManagement: {
      globalRiskLevel: 'low',
      riskCategories: [
        { category: 'technical', level: 'low' },
        { category: 'organizational', level: 'medium' }
      ],
      risks: [],
      complexityFactors: ['Résistance au changement', 'Formation des utilisateurs']
    },
    
    monitoring: {
      healthStatus: 'green',
      scheduleStatus: 'on_time',
      completionPercentage: 10,
      lastAchievements: 'Validation du cahier des charges fonctionnel',
      nextMajorMilestone: 'Sélection de la solution technique',
      blockers: [],
      attentionPoints: ['Planification de la formation utilisateurs']
    },
    
    milestones: [],
    resources: [],
    scopeChanges: [],
    lastUpdated: '2024-02-20',
    nextUpdateDue: '2024-03-05',
    createdAt: '2024-02-01'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalInitiatives: 12,
  pendingReviews: 5,
  activeProjects: 8,
  overdueUpdates: 2,
  budgetUtilization: 68,
  riskCount: {
    critical: 1,
    high: 3,
    medium: 8,
    low: 12
  }
};

export const committeeNames: Record<CommitteeType, string> = {
  'codir': 'Comité de Direction',
  'comex_proprete': 'Comex Propreté',
  'comex_filiales': 'Comex Filiales',
  'comex_commercial': 'Comex Commercial',
  'comex_collectes': 'Comex Collectes Ménagères'
};

export const services = [
  'PMO',
  'Service Collectes',
  'Service Balayage',
  'Service Tri',
  'Ressources Humaines',
  'Finance',
  'Technique',
  'Commercial'
];

export const raciResponsibilities = {
  'R': 'Responsable (Réalise)',
  'A': 'Approbateur (Décide)',
  'C': 'Consulté (Conseille)',
  'I': 'Informé (Reçoit l\'info)'
};

export const riskCategories = {
  'technical': 'Technique',
  'organizational': 'Organisationnel',
  'financial': 'Financier',
  'regulatory': 'Réglementaire',
  'operational': 'Opérationnel'
};

export const healthStatusLabels = {
  'green': '🟢 Vert - Projet en bonne santé',
  'orange': '🟡 Orange - Attention requise',
  'red': '🔴 Rouge - Problèmes critiques'
};

export const scheduleStatusLabels = {
  'ahead': 'En avance',
  'on_time': 'Dans les temps',
  'delayed': 'En retard'
};