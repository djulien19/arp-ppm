import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight, MessageSquare, FileText, Target } from 'lucide-react';
import { mockInitiatives } from '../data/mockData';
import { Initiative, WorkflowStatus, DocumentType } from '../types';
import { workflowStatusLabels, documentTypeLabels } from '../data/mockData';
import InitiativeForm from './InitiativeForm';

const InitiativesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
  const [initiatives, setInitiatives] = useState<Initiative[]>(mockInitiatives);

  const filteredInitiatives = initiatives.filter((initiative) => {
    const matchesSearch = initiative.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         initiative.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || initiative.status === statusFilter;
    const matchesType = typeFilter === 'all' || initiative.documentType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
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
        workflowComments: []
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

  const getStatusIcon = (status: WorkflowStatus) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected_n1':
      case 'archived': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'committee_review':
      case 'pmo_review':
      case 'pending_n1': return <Clock className="h-4 w-4 text-amber-600" />;
      case 'pmo_corrections':
      case 'committee_corrections': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_n1': return 'bg-blue-100 text-blue-800';
      case 'rejected_n1': return 'bg-red-100 text-red-800';
      case 'pmo_review': return 'bg-purple-100 text-purple-800';
      case 'pmo_corrections': return 'bg-orange-100 text-orange-800';
      case 'committee_review': return 'bg-amber-100 text-amber-800';
      case 'committee_corrections': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeIcon = (type: DocumentType) => {
    return type === 'FI' ? <Target className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  const getDocumentTypeColor = (type: DocumentType) => {
    return type === 'FI' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const InitiativeModal: React.FC<{ initiative: Initiative; onClose: () => void }> = ({ initiative, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">{initiative.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getDocumentTypeColor(initiative.documentType)}`}>
                  {getDocumentTypeIcon(initiative.documentType)}
                  <span>{documentTypeLabels[initiative.documentType]}</span>
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(initiative.status)}`}>
                  {workflowStatusLabels[initiative.status]}
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
                {initiative.budgetEstimated ? 
                  `${initiative.budgetEstimated.toLocaleString('fr-FR')} €` : 
                  'Non défini'
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Calendrier estimé</h3>
              <p className="text-gray-700">
                {initiative.timelineEstimated?.startDate && initiative.timelineEstimated?.endDate ? 
                  `Du ${new Date(initiative.timelineEstimated.startDate).toLocaleDateString('fr-FR')} au ${new Date(initiative.timelineEstimated.endDate).toLocaleDateString('fr-FR')}` :
                  'Non défini'
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service initiateur</h3>
              <p className="text-gray-700">{initiative.initiatingService}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Initiateur</h3>
              <p className="text-gray-700">{initiative.initiator}</p>
            </div>
          </div>

          {initiative.documentType === 'FP' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Chef de projet</h3>
                <p className="text-gray-700">{initiative.projectManager || 'Non défini'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Sponsor</h3>
                <p className="text-gray-700">{initiative.sponsor || 'Non défini'}</p>
              </div>
            </div>
          )}

          {initiative.rejectionReason && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Raison du rejet</h3>
              <p className="text-red-700 bg-red-50 p-3 rounded-lg">{initiative.rejectionReason}</p>
            </div>
          )}

          {initiative.correctionRequests && initiative.correctionRequests.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Corrections demandées</h3>
              <ul className="list-disc list-inside space-y-1">
                {initiative.correctionRequests.map((request, index) => (
                  <li key={index} className="text-orange-700 bg-orange-50 p-2 rounded">{request}</li>
                ))}
              </ul>
            </div>
          )}

          {initiative.workflowComments && initiative.workflowComments.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Historique des validations
              </h3>
              <div className="space-y-3">
                {initiative.workflowComments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">({comment.role})</span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                          {workflowStatusLabels[comment.status]}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Créé le {new Date(initiative.createdAt).toLocaleDateString('fr-FR')}</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Initiatives et Projets</h1>
          <p className="text-gray-600 mt-1">Suivi du processus FI → FP selon le workflow de validation</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau document</span>
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {initiatives.filter(i => i.documentType === 'FI').length}
          </div>
          <div className="text-sm text-gray-600">Formulaires d'Initiative</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {initiatives.filter(i => i.documentType === 'FP').length}
          </div>
          <div className="text-sm text-gray-600">Fiches Projet</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-amber-600">
            {initiatives.filter(i => ['pending_n1', 'pmo_review', 'committee_review'].includes(i.status)).length}
          </div>
          <div className="text-sm text-gray-600">En attente validation</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {initiatives.filter(i => i.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-600">Approuvés (GO)</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="FI">Formulaires d'Initiative</option>
              <option value="FP">Fiches Projet</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">En cours de rédaction</option>
              <option value="pending_n1">En attente validation N+1</option>
              <option value="rejected_n1">Rejeté par N+1</option>
              <option value="pmo_review">En revue par PMO</option>
              <option value="pmo_corrections">Corrections demandées par PMO</option>
              <option value="committee_review">En revue par Comité</option>
              <option value="committee_corrections">Corrections demandées par CODIR</option>
              <option value="approved">Approuvé par CODIR (GO)</option>
              <option value="archived">Archivée</option>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getDocumentTypeColor(initiative.documentType)}`}>
                        {getDocumentTypeIcon(initiative.documentType)}
                        <span>{initiative.documentType}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{initiative.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>{initiative.initiatingService}</span>
                      <span>•</span>
                      <span>{initiative.initiator}</span>
                      {initiative.budgetEstimated && (
                        <>
                          <span>•</span>
                          <span>{initiative.budgetEstimated.toLocaleString('fr-FR')} €</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Créé le {new Date(initiative.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(initiative.status)}`}>
                      {workflowStatusLabels[initiative.status]}
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

      {filteredInitiatives.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
          <p className="text-gray-600">
            Aucun document ne correspond aux critères de recherche sélectionnés.
          </p>
        </div>
      )}

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