import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { mockInitiatives, committeeNames } from '../data/mockData';
import { Initiative } from '../types';
import InitiativeForm from './InitiativeForm';

const InitiativesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
  const [initiatives, setInitiatives] = useState<Initiative[]>(mockInitiatives);

  const filteredInitiatives = initiatives.filter((initiative) => {
    const matchesSearch = initiative.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         initiative.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || initiative.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveInitiative = (initiativeData: Partial<Initiative>) => {
    if (editingInitiative) {
      // Update existing initiative
      setInitiatives(prev => prev.map(init => 
        init.id === editingInitiative.id 
          ? { ...init, ...initiativeData }
          : init
      ));
    } else {
      // Create new initiative
      const newInitiative = {
        ...initiativeData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Marie Dubois', // In real app, get from auth context
        status: 'draft' as const
      } as Initiative;
      
      setInitiatives(prev => [newInitiative, ...prev]);
    }
    
    setShowForm(false);
    setEditingInitiative(null);
  };

  const handleEditInitiative = (initiative: Initiative) => {
    setEditingInitiative(initiative);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingInitiative(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'committee_review':
      case 'pmo_review':
      case 'service_review': return <Clock className="h-4 w-4 text-amber-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'service_review': return 'bg-purple-100 text-purple-800';
      case 'pmo_review': return 'bg-blue-100 text-blue-800';
      case 'committee_review': return 'bg-amber-100 text-amber-800';
      case 'validated': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'project': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'service_review': return 'Révision service';
      case 'pmo_review': return 'Relecture PMO';
      case 'committee_review': return 'En attente comité';
      case 'validated': return 'Validée';
      case 'rejected': return 'Rejetée';
      case 'project': return 'Devenu projet';
      default: return status;
    }
  };

  const InitiativeModal: React.FC<{ initiative: Initiative; onClose: () => void }> = ({ initiative, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{initiative.title}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(initiative.status)}`}>
                  {getStatusLabel(initiative.status)}
                </span>
                <span className="text-sm text-gray-600">
                  {initiative.type === 'idea' ? 'Idée' : 'Anomalie'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{initiative.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Objectifs</h3>
              <p className="text-gray-700">{initiative.objectives}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Périmètre</h3>
              <p className="text-gray-700">{initiative.scope}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Budget estimé</h3>
              <p className="text-gray-700">
                {initiative.budgetRange.min.toLocaleString('fr-FR')} € - {initiative.budgetRange.max.toLocaleString('fr-FR')} €
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Calendrier</h3>
              <p className="text-gray-700">
                Du {new Date(initiative.timeline.startDate).toLocaleDateString('fr-FR')} au{' '}
                {new Date(initiative.timeline.endDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service responsable</h3>
              <p className="text-gray-700">{initiative.assignedService}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Créée par</h3>
              <p className="text-gray-700">{initiative.createdBy}</p>
            </div>
          </div>

          {initiative.committeeType && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Comité de validation</h3>
              <p className="text-gray-700">{committeeNames[initiative.committeeType]}</p>
            </div>
          )}

          {initiative.rejectionReason && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Raison du rejet</h3>
              <p className="text-red-700 bg-red-50 p-3 rounded-lg">{initiative.rejectionReason}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Créée le {new Date(initiative.createdAt).toLocaleDateString('fr-FR')}</span>
              <span>Mise à jour le {new Date(initiative.updatedAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Initiatives</h1>
          <p className="text-gray-600 mt-1">Gestion des idées et anomalies</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle initiative</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher une initiative..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="service_review">Révision service</option>
              <option value="pmo_review">Relecture PMO</option>
              <option value="committee_review">En attente comité</option>
              <option value="validated">Validée</option>
              <option value="rejected">Rejetée</option>
              <option value="project">Devenu projet</option>
            </select>
          </div>
        </div>
      </div>

      {/* Initiatives List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {filteredInitiatives.map((initiative) => (
              <div
                key={initiative.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(initiative.status)}
                      <h3 className="font-semibold text-gray-900">{initiative.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {initiative.type === 'idea' ? 'Idée' : 'Anomalie'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{initiative.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>{initiative.assignedService}</span>
                      <span>•</span>
                      <span>{initiative.createdBy}</span>
                      <span>•</span>
                      <span>
                        {initiative.budgetRange.min.toLocaleString('fr-FR')} € - {initiative.budgetRange.max.toLocaleString('fr-FR')} €
                      </span>
                      <span>•</span>
                      <span>Créée le {new Date(initiative.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(initiative.status)}`}>
                      {getStatusLabel(initiative.status)}
                    </span>
                    <button
                      onClick={() => setSelectedInitiative(initiative)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditInitiative(initiative)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Initiative Detail Modal */}
      {selectedInitiative && (
        <InitiativeModal
          initiative={selectedInitiative}
          onClose={() => setSelectedInitiative(null)}
        />
      )}

      {/* Initiative Form Modal */}
      {showForm && (
        <InitiativeForm
          initiative={editingInitiative || undefined}
          onSave={handleSaveInitiative}
          onCancel={handleCancelForm}
          isEditing={!!editingInitiative}
        />
      )}
    </div>
  );
};

export default InitiativesList;