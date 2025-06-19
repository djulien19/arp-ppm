import React, { useState, useEffect } from 'react';
import { 
  Settings, List, Plus, Edit, Trash2, Save, X, Eye, AlertTriangle, 
  Clock, User, Search, Filter, ArrowUp, ArrowDown, History, 
  RotateCcw, Shield, CheckCircle, XCircle, AlertCircle, Info,
  Download, Upload, FileText, Database
} from 'lucide-react';
import { ValueList, ValueListItem, ValueListAuditLog, ValidationResult } from '../types/valueLists';
import { valueListsData, mockAuditLogs, mockBackups } from '../data/valueLists';

const ValueListsManagement: React.FC = () => {
  const [valueLists, setValueLists] = useState<ValueList[]>(valueListsData);
  const [selectedList, setSelectedList] = useState<ValueList | null>(null);
  const [editingItem, setEditingItem] = useState<ValueListItem | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showBackups, setShowBackups] = useState(false);
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs);
  const [validationResults, setValidationResults] = useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  // Check if user is admin (in real app, get from auth context)
  const isAdmin = true; // For demo purposes

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-600">
            Cette interface est réservée aux administrateurs autorisés.
          </p>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(valueLists.map(list => list.category)));
  const filteredLists = valueLists.filter(list => {
    const matchesSearch = list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         list.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || list.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Validation logic
  const validateChanges = (list: ValueList, item?: ValueListItem, action?: 'add' | 'edit' | 'delete'): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const impactedItems: any[] = [];

    // Check validation rules
    if (item && list.validationRules) {
      const rules = list.validationRules;
      
      if (rules.keyPattern && !new RegExp(rules.keyPattern).test(item.key)) {
        errors.push(`La clé "${item.key}" ne respecte pas le format requis (${rules.keyPattern})`);
      }
      
      if (rules.labelMinLength && item.label.length < rules.labelMinLength) {
        errors.push(`Le libellé doit contenir au moins ${rules.labelMinLength} caractères`);
      }
      
      if (rules.labelMaxLength && item.label.length > rules.labelMaxLength) {
        errors.push(`Le libellé ne peut pas dépasser ${rules.labelMaxLength} caractères`);
      }
      
      if (rules.uniqueKey) {
        const duplicateKey = list.items.find(i => i.id !== item.id && i.key === item.key);
        if (duplicateKey) {
          errors.push(`La clé "${item.key}" existe déjà`);
        }
      }
      
      if (rules.uniqueLabel) {
        const duplicateLabel = list.items.find(i => i.id !== item.id && i.label === item.label);
        if (duplicateLabel) {
          errors.push(`Le libellé "${item.label}" existe déjà`);
        }
      }
    }

    // Check usage impact for deletions or key changes
    if (action === 'delete' && item) {
      if (list.usageCount > 0) {
        warnings.push(`Cette valeur est utilisée dans ${list.usageCount} éléments. Sa suppression peut causer des problèmes.`);
        // Mock impacted items
        impactedItems.push({
          type: 'initiative',
          id: '1',
          title: 'Optimisation des tournées',
          field: 'service'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      impactedItems
    };
  };

  // CRUD operations with audit logging
  const logAction = (action: 'create' | 'update' | 'delete' | 'restore', listId: string, itemId?: string, oldValue?: any, newValue?: any, reason?: string) => {
    const newLog: ValueListAuditLog = {
      id: Date.now().toString(),
      listId,
      itemId,
      action,
      oldValue,
      newValue,
      userId: 'current-user-id',
      userName: 'Marie Dubois', // Get from auth context
      timestamp: new Date().toISOString(),
      reason
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleSaveItem = (item: Partial<ValueListItem>) => {
    if (!selectedList) return;

    const isEditing = !!editingItem;
    const itemData: ValueListItem = {
      id: editingItem?.id || Date.now().toString(),
      key: item.key || '',
      label: item.label || '',
      description: item.description,
      order: item.order || (selectedList.items.length + 1),
      active: item.active ?? true,
      metadata: item.metadata,
      createdAt: editingItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: editingItem?.createdBy || 'Marie Dubois',
      updatedBy: 'Marie Dubois'
    };

    // Validate
    const validation = validateChanges(selectedList, itemData, isEditing ? 'edit' : 'add');
    setValidationResults(validation);
    setShowValidation(true);

    if (!validation.isValid) {
      return;
    }

    // Update the list
    const updatedList = {
      ...selectedList,
      items: isEditing 
        ? selectedList.items.map(i => i.id === itemData.id ? itemData : i)
        : [...selectedList.items, itemData],
      lastModified: new Date().toISOString(),
      modifiedBy: 'Marie Dubois'
    };

    setValueLists(prev => prev.map(list => list.id === selectedList.id ? updatedList : list));
    setSelectedList(updatedList);

    // Log the action
    logAction(
      isEditing ? 'update' : 'create',
      selectedList.id,
      itemData.id,
      editingItem,
      itemData,
      `${isEditing ? 'Modification' : 'Ajout'} de l'élément "${itemData.label}"`
    );

    setShowItemForm(false);
    setEditingItem(null);
    setShowValidation(false);
  };

  const handleDeleteItem = (item: ValueListItem) => {
    if (!selectedList) return;

    const validation = validateChanges(selectedList, item, 'delete');
    setValidationResults(validation);
    setShowValidation(true);

    if (validation.warnings.length > 0) {
      // Show confirmation dialog
      if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${item.label}" ?\n\n${validation.warnings.join('\n')}`)) {
        return;
      }
    }

    const updatedList = {
      ...selectedList,
      items: selectedList.items.filter(i => i.id !== item.id),
      lastModified: new Date().toISOString(),
      modifiedBy: 'Marie Dubois'
    };

    setValueLists(prev => prev.map(list => list.id === selectedList.id ? updatedList : list));
    setSelectedList(updatedList);

    logAction('delete', selectedList.id, item.id, item, null, `Suppression de l'élément "${item.label}"`);
    setShowValidation(false);
  };

  const handleMoveItem = (item: ValueListItem, direction: 'up' | 'down') => {
    if (!selectedList) return;

    const items = [...selectedList.items].sort((a, b) => a.order - b.order);
    const currentIndex = items.findIndex(i => i.id === item.id);
    
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === items.length - 1)) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetItem = items[targetIndex];

    // Swap orders
    const updatedItems = selectedList.items.map(i => {
      if (i.id === item.id) return { ...i, order: targetItem.order };
      if (i.id === targetItem.id) return { ...i, order: item.order };
      return i;
    });

    const updatedList = {
      ...selectedList,
      items: updatedItems,
      lastModified: new Date().toISOString(),
      modifiedBy: 'Marie Dubois'
    };

    setValueLists(prev => prev.map(list => list.id === selectedList.id ? updatedList : list));
    setSelectedList(updatedList);

    logAction('update', selectedList.id, item.id, item, { ...item, order: targetItem.order }, `Déplacement de l'élément "${item.label}"`);
  };

  // Export/Import functions
  const handleExportList = (list: ValueList) => {
    const dataStr = JSON.stringify(list, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${list.systemKey}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateBackup = (list: ValueList) => {
    // In real app, this would save to database
    console.log('Creating backup for list:', list.id);
    alert('Sauvegarde créée avec succès');
  };

  // Item Form Component
  const ItemForm: React.FC<{ list: ValueList; item?: ValueListItem; onSave: (item: Partial<ValueListItem>) => void; onCancel: () => void }> = ({ list, item, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<ValueListItem>>({
      key: item?.key || '',
      label: item?.label || '',
      description: item?.description || '',
      order: item?.order || (list.items.length + 1),
      active: item?.active ?? true,
      metadata: item?.metadata || {}
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {item ? 'Modifier' : 'Ajouter'} un élément - {list.name}
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clé *</label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="identifiant_unique"
                disabled={!list.allowAdd && !list.allowEdit}
              />
              {list.validationRules?.keyPattern && (
                <p className="text-xs text-gray-500 mt-1">Format: {list.validationRules.keyPattern}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Libellé *</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Libellé affiché"
                disabled={!list.allowEdit}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Description optionnelle"
                disabled={!list.allowEdit}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordre</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Actif</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Enregistrer</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Validation Results Modal
  const ValidationModal: React.FC = () => {
    if (!showValidation || !validationResults) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {validationResults.isValid ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                Résultat de la validation
              </h3>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {validationResults.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-900">Erreurs</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                  {validationResults.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResults.warnings.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h4 className="font-medium text-orange-900">Avertissements</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-orange-700 text-sm">
                  {validationResults.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResults.impactedItems && validationResults.impactedItems.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Éléments impactés</h4>
                </div>
                <ul className="space-y-2 text-blue-700 text-sm">
                  {validationResults.impactedItems.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>{item.type}: {item.title} (champ: {item.field})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => setShowValidation(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Audit Log Modal
  const AuditLogModal: React.FC = () => {
    if (!showAuditLog) return null;

    const filteredLogs = selectedList 
      ? auditLogs.filter(log => log.listId === selectedList.id)
      : auditLogs;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Journal d'audit {selectedList ? `- ${selectedList.name}` : ''}
              </h3>
              <button
                onClick={() => setShowAuditLog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.action === 'create' ? 'bg-green-100 text-green-800' :
                        log.action === 'update' ? 'bg-blue-100 text-blue-800' :
                        log.action === 'delete' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.action === 'create' ? 'Création' :
                         log.action === 'update' ? 'Modification' :
                         log.action === 'delete' ? 'Suppression' : 'Restauration'}
                      </span>
                      <span className="font-medium text-gray-900">{log.userName}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  {log.reason && (
                    <p className="text-sm text-gray-700 mb-2">{log.reason}</p>
                  )}
                  {log.oldValue && log.newValue && (
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="font-medium text-gray-700 mb-1">Avant</div>
                        <pre className="bg-red-50 p-2 rounded text-red-800 overflow-x-auto">
                          {JSON.stringify(log.oldValue, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700 mb-1">Après</div>
                        <pre className="bg-green-50 p-2 rounded text-green-800 overflow-x-auto">
                          {JSON.stringify(log.newValue, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des listes de valeurs</h1>
          <p className="text-gray-600 mt-1">
            Configuration des données de référence du système
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAuditLog(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <History className="h-4 w-4" />
            <span>Journal d'audit</span>
          </button>
          <button
            onClick={() => setShowBackups(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Database className="h-4 w-4" />
            <span>Sauvegardes</span>
          </button>
        </div>
      </div>

      {!selectedList ? (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher une liste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLists.map((list) => (
              <div
                key={list.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{list.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {list.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{list.description}</p>
                  </div>
                  <List className="h-6 w-6 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Éléments</span>
                    <span className="font-medium">{list.items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Utilisé dans</span>
                    <span className="font-medium">{list.usageCount} éléments</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dernière modification</span>
                    <span className="font-medium">
                      {new Date(list.lastModified).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-1">
                    {list.allowAdd && (
                      <span className="w-2 h-2 bg-green-500 rounded-full" title="Ajout autorisé"></span>
                    )}
                    {list.allowEdit && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full" title="Modification autorisée"></span>
                    )}
                    {list.allowDelete && (
                      <span className="w-2 h-2 bg-red-500 rounded-full" title="Suppression autorisée"></span>
                    )}
                  </div>
                  <div className="flex-1"></div>
                  <button
                    onClick={() => handleExportList(list)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Exporter"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleCreateBackup(list)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Créer une sauvegarde"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedList(list)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Gérer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Selected List Detail */
        <div className="space-y-6">
          {/* List Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedList(null)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <ArrowUp className="h-5 w-5 rotate-180" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedList.name}</h2>
                  <p className="text-gray-600">{selectedList.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {selectedList.allowAdd && (
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setShowItemForm(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter</span>
                  </button>
                )}
                <button
                  onClick={() => setShowAuditLog(true)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                >
                  <History className="h-4 w-4" />
                  <span>Historique</span>
                </button>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Éléments ({selectedList.items.length})
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {selectedList.items
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 ${item.active ? 'border-gray-200' : 'border-gray-200 bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {item.key}
                            </span>
                            <span className="font-medium text-gray-900">{item.label}</span>
                            {!item.active && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                Inactif
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => handleMoveItem(item, 'up')}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              disabled={item.order === 1}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleMoveItem(item, 'down')}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              disabled={item.order === selectedList.items.length}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </button>
                          </div>
                          {selectedList.allowEdit && (
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setShowItemForm(true);
                              }}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {selectedList.allowDelete && (
                            <button
                              onClick={() => handleDeleteItem(item)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showItemForm && selectedList && (
        <ItemForm
          list={selectedList}
          item={editingItem || undefined}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowItemForm(false);
            setEditingItem(null);
          }}
        />
      )}

      <ValidationModal />
      <AuditLogModal />
    </div>
  );
};

export default ValueListsManagement;