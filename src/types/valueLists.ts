export interface ValueListItem {
  id: string;
  key: string;
  label: string;
  description?: string;
  order: number;
  active: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ValueList {
  id: string;
  name: string;
  description: string;
  category: string;
  systemKey: string;
  allowAdd: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  validationRules?: {
    keyPattern?: string;
    labelMinLength?: number;
    labelMaxLength?: number;
    uniqueKey?: boolean;
    uniqueLabel?: boolean;
  };
  items: ValueListItem[];
  usageCount: number; // Nombre d'éléments utilisant cette liste
  lastModified: string;
  modifiedBy: string;
}

export interface ValueListAuditLog {
  id: string;
  listId: string;
  itemId?: string;
  action: 'create' | 'update' | 'delete' | 'restore';
  oldValue?: any;
  newValue?: any;
  userId: string;
  userName: string;
  timestamp: string;
  reason?: string;
}

export interface ValueListBackup {
  id: string;
  listId: string;
  backupDate: string;
  backupBy: string;
  data: ValueList;
  description: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  impactedItems?: Array<{
    type: 'initiative' | 'project' | 'user';
    id: string;
    title: string;
    field: string;
  }>;
}