import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, Target, Users, FileText, AlertCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { Initiative, DocumentType, WorkflowStatus, WorkflowComment } from '../types';
import { services, workflowStatusLabels, documentTypeLabels } from '../data/mockData';

interface InitiativeFormProps {
  initiative?: Initiative;
  onSave: (initiative: Partial<Initiative>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const InitiativeForm: React.FC<InitiativeFormProps> = ({
  initiative,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<Initiative>>({
    title: '',
    description: '',
    documentType: 'FI',
    status: 'draft',
    objectives: '',
    scope: '',
    budgetEstimated: 0,
    timelineEstimated: { startDate: '', endDate: '' },
    initiatingService: '',
    initiator: '',
    projectManager: '',
    sponsor: '',
    workflowComments: [],
    ...initiative
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showWorkflowActions, setShowWorkflowActions] = useState(false);

  useEffect(() => {
    if (initiative) {
      setFormData(initiative);
    }
  }, [initiative]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    if (!formData.objectives?.trim()) {
      newErrors.objectives = 'Les objectifs sont obligatoires';
    }

    if (!formData.scope?.trim()) {
      newErrors.scope = 'Le périmètre est obligatoire';
    }

    if (!formData.initiatingService) {
      newErrors.initiatingService = 'Le service initiateur est obligatoire';
    }

    if (!formData.initiator?.trim()) {
      newErrors.initiator = 'L\'initiateur est obligatoire';
    }

    // Validation spécifique pour FP
    if (formData.documentType === 'FP') {
      if (!formData.projectManager?.trim()) {
        newErrors.projectManager = 'Le chef de projet est obligatoire pour une FP';
      }
      if (!formData.sponsor?.trim()) {
        newErrors.sponsor = 'Le sponsor est obligatoire pour une FP';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...formData,
        updatedAt: new Date().toISOString(),
        ...(isEditing ? {} : {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          createdBy: 'Marie Dubois' // In real app, get from auth context
        })
      };

      await onSave(submissionData);
    } catch (error) {
      console.error('Error saving initiative:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleTimelineChange = (type: 'startDate' | 'endDate', value: string) => {
    setFormData(prev => ({
      ...prev,
      timelineEstimated: {
        ...prev.timelineEstimated,
        [type]: value
      }
    }));
  };

  const handleStatusChange = (newStatus: WorkflowStatus) => {
    if (newComment.trim()) {
      const comment: WorkflowComment = {
        id: Date.now().toString(),
        author: 'Marie Dubois', // Current user
        role: 'PMO',
        comment: newComment,
        status: newStatus,
        createdAt: new Date().toISOString()
      };

      setFormData(prev => ({
        ...prev,
        status: newStatus,
        workflowComments: [...(prev.workflowComments || []), comment]
      }));

      setNewComment('');
      setShowWorkflowActions(false);
    }
  };

  const getAvailableActions = (): Array<{action: WorkflowStatus, label: string, color: string}> => {
    if (!isEditing) return [];

    const currentStatus = formData.status;
    
    switch (currentStatus) {
      case 'draft':
        return [
          { action: 'pending_n1', label: 'Soumettre au N+1', color: 'bg-blue-600' }
        ];
      case 'pending_n1':
        return [
          { action: 'pmo_review', label: 'Valider et transmettre au PMO', color: 'bg-green-600' },
          { action: 'rejected_n1', label: 'Rejeter', color: 'bg-red-600' }
        ];
      case 'rejected_n1':
        return [
          { action: 'pending_n1', label: 'Resoumettre au N+1', color: 'bg-blue-600' }
        ];
      case 'pmo_review':
        return [
          { action: 'committee_review', label: 'Transmettre au Comité', color: 'bg-green-600' },
          { action: 'pmo_corrections', label: 'Demander des corrections', color: 'bg-orange-600' }
        ];
      case 'pmo_corrections':
        return [
          { action: 'pmo_review', label: 'Resoumettre au PMO', color: 'bg-blue-600' }
        ];
      case 'committee_review':
        return [
          { action: 'approved', label: 'Approuver (GO)', color: 'bg-green-600' },
          { action: 'committee_corrections', label: 'Demander des corrections', color: 'bg-orange-600' },
          { action: 'archived', label: 'Archiver', color: 'bg-gray-600' }
        ];
      case 'committee_corrections':
        return [
          { action: 'committee_review', label: 'Resoumettre au Comité', color: 'bg-blue-600' }
        ];
      case 'approved':
        if (formData.documentType === 'FI') {
          return [
            { action: 'draft', label: 'Créer la FP associée', color: 'bg-purple-600' }
          ];
        }
        return [];
      default:
        return [];
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing ? 'Modifier' : 'Créer'} {documentTypeLabels[formData.documentType as DocumentType]}
                </h2>
                {isEditing && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(formData.status as WorkflowStatus)}`}>
                    {workflowStatusLabels[formData.status as WorkflowStatus]}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {isEditing ? 'Modifiez les informations du document' : 'Saisissez les informations du nouveau document'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Type de document */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de document
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    name="documentType"
                    value="FI"
                    checked={formData.documentType === 'FI'}
                    onChange={(e) => handleInputChange('documentType', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.documentType === 'FI' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Formulaire d'Initiative (FI)</div>
                        <div className="text-sm text-gray-600">Nouvelle idée ou identification d'un problème</div>
                      </div>
                    </div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    name="documentType"
                    value="FP"
                    checked={formData.documentType === 'FP'}
                    onChange={(e) => handleInputChange('documentType', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.documentType === 'FP' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">Fiche Projet (FP)</div>
                        <div className="text-sm text-gray-600">Définition détaillée du projet à réaliser</div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {formData.documentType === 'FP' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">Fiche Projet (FP)</p>
                    <p>Cette fiche doit être créée suite à l'approbation d'une Formulaire d'Initiative (FI). 
                       Assurez-vous d'avoir tous les éléments détaillés du projet.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Informations de base */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre {formData.documentType === 'FI' ? 'de l\'initiative' : 'du projet'} *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Donnez un titre clair et descriptif"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description détaillée *
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Décrivez en détail le contexte, les enjeux et la solution proposée"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Objectifs et Périmètre */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-2">
                Objectifs *
              </label>
              <textarea
                id="objectives"
                rows={4}
                value={formData.objectives || ''}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.objectives ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Quels sont les objectifs mesurables à atteindre ?"
              />
              {errors.objectives && (
                <p className="mt-1 text-sm text-red-600">{errors.objectives}</p>
              )}
            </div>

            <div>
              <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-2">
                Périmètre *
              </label>
              <textarea
                id="scope"
                rows={4}
                value={formData.scope || ''}
                onChange={(e) => handleInputChange('scope', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.scope ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Définissez le périmètre d'action"
              />
              {errors.scope && (
                <p className="mt-1 text-sm text-red-600">{errors.scope}</p>
              )}
            </div>
          </div>

          {/* Budget estimé */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Budget estimé
            </h3>
            <div>
              <label htmlFor="budgetEstimated" className="block text-sm font-medium text-gray-700 mb-2">
                Montant estimé (€)
              </label>
              <input
                type="number"
                id="budgetEstimated"
                min="0"
                step="1000"
                value={formData.budgetEstimated || ''}
                onChange={(e) => handleInputChange('budgetEstimated', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Calendrier prévisionnel */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Calendrier prévisionnel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début souhaitée
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.timelineEstimated?.startDate || ''}
                  onChange={(e) => handleTimelineChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin souhaitée
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.timelineEstimated?.endDate || ''}
                  onChange={(e) => handleTimelineChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Responsabilités */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="initiatingService" className="block text-sm font-medium text-gray-700 mb-2">
                Service initiateur *
              </label>
              <select
                id="initiatingService"
                value={formData.initiatingService || ''}
                onChange={(e) => handleInputChange('initiatingService', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.initiatingService ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez un service</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              {errors.initiatingService && (
                <p className="mt-1 text-sm text-red-600">{errors.initiatingService}</p>
              )}
            </div>

            <div>
              <label htmlFor="initiator" className="block text-sm font-medium text-gray-700 mb-2">
                Initiateur *
              </label>
              <input
                type="text"
                id="initiator"
                value={formData.initiator || ''}
                onChange={(e) => handleInputChange('initiator', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.initiator ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nom de l'initiateur"
              />
              {errors.initiator && (
                <p className="mt-1 text-sm text-red-600">{errors.initiator}</p>
              )}
            </div>
          </div>

          {/* Champs spécifiques FP */}
          {formData.documentType === 'FP' && (
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Responsabilités projet (obligatoire pour FP)
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="projectManager" className="block text-sm font-medium text-gray-700 mb-2">
                    Chef de projet *
                  </label>
                  <input
                    type="text"
                    id="projectManager"
                    value={formData.projectManager || ''}
                    onChange={(e) => handleInputChange('projectManager', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.projectManager ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nom du chef de projet"
                  />
                  {errors.projectManager && (
                    <p className="mt-1 text-sm text-red-600">{errors.projectManager}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="sponsor" className="block text-sm font-medium text-gray-700 mb-2">
                    Sponsor *
                  </label>
                  <input
                    type="text"
                    id="sponsor"
                    value={formData.sponsor || ''}
                    onChange={(e) => handleInputChange('sponsor', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.sponsor ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nom du sponsor"
                  />
                  {errors.sponsor && (
                    <p className="mt-1 text-sm text-red-600">{errors.sponsor}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Historique des commentaires */}
          {isEditing && formData.workflowComments && formData.workflowComments.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-gray-600" />
                Historique des validations
              </h3>
              <div className="space-y-4">
                {formData.workflowComments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
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

          {/* Actions workflow */}
          {isEditing && getAvailableActions().length > 0 && (
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions disponibles</h3>
              
              {!showWorkflowActions ? (
                <button
                  type="button"
                  onClick={() => setShowWorkflowActions(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Effectuer une action de workflow
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commentaire (obligatoire)
                    </label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ajoutez un commentaire expliquant votre décision..."
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {getAvailableActions().map((action) => (
                      <button
                        key={action.action}
                        type="button"
                        onClick={() => handleStatusChange(action.action)}
                        disabled={!newComment.trim()}
                        className={`${action.color} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {action.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setShowWorkflowActions(false);
                        setNewComment('');
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                * Champs obligatoires
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span>
                    {isSubmitting 
                      ? 'Enregistrement...' 
                      : isEditing 
                        ? 'Mettre à jour' 
                        : 'Créer'
                    }
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitiativeForm;