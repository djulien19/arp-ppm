import { ValueList, ValueListItem } from '../types/valueLists';

export const valueListsData: ValueList[] = [
  {
    id: 'services',
    name: 'Services',
    description: 'Liste des services de l\'organisation',
    category: 'Organisation',
    systemKey: 'services',
    allowAdd: true,
    allowEdit: true,
    allowDelete: false, // Ne pas supprimer car utilisé dans les données existantes
    validationRules: {
      labelMinLength: 2,
      labelMaxLength: 100,
      uniqueLabel: true
    },
    items: [
      {
        id: '1',
        key: 'direction_generale',
        label: 'Direction Générale',
        order: 1,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '2',
        key: 'direction_collectes',
        label: 'Direction Collectes',
        order: 2,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '3',
        key: 'direction_proprete',
        label: 'Direction Propreté',
        order: 3,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '4',
        key: 'direction_technique',
        label: 'Direction Technique',
        order: 4,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '5',
        key: 'direction_rh',
        label: 'Direction RH',
        order: 5,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '6',
        key: 'direction_financiere',
        label: 'Direction Financière',
        order: 6,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '7',
        key: 'direction_commerciale',
        label: 'Direction Commerciale',
        order: 7,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '8',
        key: 'pmo',
        label: 'PMO',
        order: 8,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      }
    ],
    usageCount: 15,
    lastModified: '2024-01-01T00:00:00Z',
    modifiedBy: 'System'
  },
  {
    id: 'committees',
    name: 'Comités',
    description: 'Types de comités de validation',
    category: 'Gouvernance',
    systemKey: 'committees',
    allowAdd: true,
    allowEdit: true,
    allowDelete: false,
    validationRules: {
      keyPattern: '^[a-z_]+$',
      labelMinLength: 5,
      labelMaxLength: 50,
      uniqueKey: true,
      uniqueLabel: true
    },
    items: [
      {
        id: '1',
        key: 'codir',
        label: 'Comité de Direction (CODIR)',
        order: 1,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '2',
        key: 'comex_proprete',
        label: 'Comité Exécutif Propreté',
        order: 2,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '3',
        key: 'comex_filiales',
        label: 'Comité Exécutif Filiales',
        order: 3,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '4',
        key: 'comex_commercial',
        label: 'Comité Exécutif Commercial',
        order: 4,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '5',
        key: 'comex_collectes',
        label: 'Comité Exécutif Collectes',
        order: 5,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      }
    ],
    usageCount: 8,
    lastModified: '2024-01-01T00:00:00Z',
    modifiedBy: 'System'
  },
  {
    id: 'workflow_statuses',
    name: 'Statuts de workflow',
    description: 'Statuts dans le processus de validation FI/FP',
    category: 'Workflow',
    systemKey: 'workflow_statuses',
    allowAdd: false,
    allowEdit: true,
    allowDelete: false,
    validationRules: {
      keyPattern: '^[a-z_]+$',
      labelMinLength: 5,
      labelMaxLength: 50,
      uniqueKey: true
    },
    items: [
      {
        id: '1',
        key: 'draft',
        label: 'En cours de rédaction',
        order: 1,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '2',
        key: 'pending_n1',
        label: 'En attente validation N+1',
        order: 2,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '3',
        key: 'rejected_n1',
        label: 'Rejeté par N+1',
        order: 3,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '4',
        key: 'pmo_review',
        label: 'En revue par PMO',
        order: 4,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '5',
        key: 'pmo_corrections',
        label: 'Corrections demandées par PMO',
        order: 5,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '6',
        key: 'committee_review',
        label: 'En revue par Comité décisionnel',
        order: 6,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '7',
        key: 'committee_corrections',
        label: 'Corrections demandées par CODIR',
        order: 7,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '8',
        key: 'approved',
        label: 'Approuvé par CODIR (GO)',
        order: 8,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '9',
        key: 'archived',
        label: 'Archivée',
        order: 9,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      }
    ],
    usageCount: 25,
    lastModified: '2024-01-01T00:00:00Z',
    modifiedBy: 'System'
  },
  {
    id: 'performance_statuses',
    name: 'Statuts de performance',
    description: 'Niveaux de performance pour le reporting',
    category: 'Suivi',
    systemKey: 'performance_statuses',
    allowAdd: false,
    allowEdit: true,
    allowDelete: false,
    validationRules: {
      keyPattern: '^[a-z_]+$',
      labelMinLength: 5,
      labelMaxLength: 100,
      uniqueKey: true
    },
    items: [
      {
        id: '1',
        key: 'conforme',
        label: 'Tout va bien, conforme au plan',
        description: 'Performance optimale, aucune intervention requise',
        order: 1,
        active: true,
        metadata: { color: 'green', icon: '✅' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '2',
        key: 'mise_en_garde',
        label: 'Mise en garde - Léger retard ou surcoût',
        description: 'Situation à surveiller mais projet pas à risque',
        order: 2,
        active: true,
        metadata: { color: 'yellow', icon: '⚠️' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '3',
        key: 'a_risque',
        label: 'À risque - Délai important ou dépassement budget',
        description: 'Situation préoccupante nécessitant des actions correctives',
        order: 3,
        active: true,
        metadata: { color: 'orange', icon: '🔶' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '4',
        key: 'en_derive',
        label: 'En dérive - Solution d\'urgence requise',
        description: 'Situation critique, intervention immédiate nécessaire',
        order: 4,
        active: true,
        metadata: { color: 'red', icon: '🚨' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      }
    ],
    usageCount: 12,
    lastModified: '2024-01-01T00:00:00Z',
    modifiedBy: 'System'
  },
  {
    id: 'risk_categories',
    name: 'Catégories de risque',
    description: 'Types de risques dans la gestion de projet',
    category: 'Risques',
    systemKey: 'risk_categories',
    allowAdd: true,
    allowEdit: true,
    allowDelete: true,
    validationRules: {
      keyPattern: '^[a-z_]+$',
      labelMinLength: 3,
      labelMaxLength: 50,
      uniqueKey: true,
      uniqueLabel: true
    },
    items: [
      {
        id: '1',
        key: 'technical',
        label: 'Technique',
        description: 'Risques liés aux aspects techniques et technologiques',
        order: 1,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '2',
        key: 'organizational',
        label: 'Organisationnel',
        description: 'Risques liés à l\'organisation et aux ressources humaines',
        order: 2,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '3',
        key: 'financial',
        label: 'Financier',
        description: 'Risques budgétaires et financiers',
        order: 3,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '4',
        key: 'regulatory',
        label: 'Réglementaire',
        description: 'Risques liés à la conformité réglementaire',
        order: 4,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        id: '5',
        key: 'operational',
        label: 'Opérationnel',
        description: 'Risques liés aux opérations quotidiennes',
        order: 5,
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'System',
        updatedBy: 'System'
      }
    ],
    usageCount: 18,
    lastModified: '2024-01-01T00:00:00Z',
    modifiedBy: 'System'
  }
];

// Mock audit logs
export const mockAuditLogs = [
  {
    id: '1',
    listId: 'services',
    itemId: '8',
    action: 'create' as const,
    newValue: { key: 'pmo', label: 'PMO' },
    userId: 'admin1',
    userName: 'Marie Dubois',
    timestamp: '2024-02-15T10:30:00Z',
    reason: 'Ajout du service PMO suite à la restructuration'
  },
  {
    id: '2',
    listId: 'committees',
    itemId: '2',
    action: 'update' as const,
    oldValue: { label: 'Comité Exécutif Propreté' },
    newValue: { label: 'Comité Exécutif Propreté Urbaine' },
    userId: 'admin1',
    userName: 'Marie Dubois',
    timestamp: '2024-02-10T14:20:00Z',
    reason: 'Précision du périmètre du comité'
  }
];

// Mock backups
export const mockBackups = [
  {
    id: '1',
    listId: 'services',
    backupDate: '2024-02-01T00:00:00Z',
    backupBy: 'System',
    data: valueListsData.find(v => v.id === 'services')!,
    description: 'Sauvegarde automatique mensuelle'
  }
];