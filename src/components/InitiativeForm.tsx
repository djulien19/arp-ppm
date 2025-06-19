import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, Target, Users, FileText, AlertCircle, ArrowRight, ArrowLeft, Send, Star } from 'lucide-react';
import { Initiative, DocumentType, WorkflowStatus } from '../types';
import { services } from '../data/mockData';
import { valueListsData } from '../data/valueLists';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Initiative & {
    implementationDate: string;
    projectOwner: string;
    affectedServices: string[];
    associatedValues: string[];
    newOptions: string[];
    estimatedImpact: number;
    requiredResources: string;
    projectedBudget: number;
  }>>({
    title: '',
    description: '',
    documentType: 'FI',
    status: 'draft',
    objectives: '',
    implementationDate: '',
    projectOwner: '',
    affectedServices: [],
    associatedValues: [],
    newOptions: [],
    estimatedImpact: 3,
    requiredResources: '',
    projectedBudget: 0,
    budgetEstimated: 0,
    timelineEstimated: { startDate: '', endDate: '' },
    initiatingService: '',
    initiator: '',
    workflowComments: [],
    ...initiative
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initiative) {
      setFormData(initiative);
    }
  }, [initiative]);

  // Options disponibles pour les nouvelles fonctionnalités
  const availableOptions = [
    'Interface utilisateur améliorée',
    'Intégration mobile',
    'Rapports automatisés',
    'Notifications en temps réel',
    'API externe',
    'Sécurité renforcée',
    'Analytics avancés',
    'Workflow personnalisé'
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title?.trim()) {
        newErrors.title = 'Le titre est obligatoire';
      }
      if (!formData.description?.trim()) {
        newErrors.description = 'La description est obligatoire';
      }
      if (!formData.objectives?.trim()) {
        newErrors.objectives = 'Les objectifs sont obligatoires';
      }
      if (!formData.implementationDate) {
        newErrors.implementationDate = 'La date de mise en œuvre est obligatoire';
      }
      if (!formData.projectOwner?.trim()) {
        newErrors.projectOwner = 'Le porteur du projet est obligatoire';
      }
      if (!formData.affectedServices || formData.affectedServices.length === 0) {
        newErrors.affectedServices = 'Au moins un service concerné est obligatoire';
      }
    }

    if (step === 2) {
      if (!formData.associatedValues || formData.associatedValues.length === 0) {
        newErrors.associatedValues = 'Au moins une valeur associée est obligatoire';
      }
      if (!formData.requiredResources?.trim()) {
        newErrors.requiredResources = 'Les ressources nécessaires sont obligatoires';
      }
      if (!formData.projectedBudget || formData.projectedBudget <= 0) {
        newErrors.projectedBudget = 'Le budget prévisionnel doit être supérieur à 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...formData,
        status: 'draft' as WorkflowStatus,
        budgetEstimated: formData.projectedBudget,
        timelineEstimated: {
          startDate: formData.implementationDate,
          endDate: ''
        },
        initiatingService: formData.affectedServices?.[0] || '',
        initiator: formData.projectOwner,
        updatedAt: new Date().toISOString(),
        ...(isEditing ? {} : {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          createdBy: 'Marie Dubois'
        })
      };

      await onSave(submissionData);
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForValidation = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      if (!validateStep(1)) {
        setCurrentStep(1);
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...formData,
        status: 'pending_n1' as WorkflowStatus,
        budgetEstimated: formData.projectedBudget,
        timelineEstimated: {
          startDate: formData.implementationDate,
          endDate: ''
        },
        initiatingService: formData.affectedServices?.[0] || '',
        initiator: formData.projectOwner,
        updatedAt: new Date().toISOString(),
        workflowComments: [
          {
            id: Date.now().toString(),
            author: 'Marie Dubois',
            role: 'Initiateur',
            comment: 'Initiative soumise pour validation N+1',
            status: 'pending_n1' as WorkflowStatus,
            createdAt: new Date().toISOString()
          }
        ],
        ...(isEditing ? {} : {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          createdBy: 'Marie Dubois'
        })
      };

      await onSave(submissionData);
    } catch (error) {
      console.error('Error submitting for validation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleMultiSelectChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[field as keyof typeof prev] as string[] || [];
      if (checked) {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [field]: currentValues.filter(v => v !== value)
        };
      }
    });
  };

  const getStepProgress = () => {
    return (currentStep / 2) * 100;
  };

  // Récupérer les listes de valeurs pour les options
  const valuesList = valueListsData.find(vl => vl.systemKey === 'services');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Modifier l\'initiative' : 'Nouvelle initiative'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Étape {currentStep} sur 2 - {currentStep === 1 ? 'Informations principales' : 'Options et valeurs'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && (
            /* Page 1 - Informations principales */
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'initiative *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Donnez un titre clair et descriptif à votre initiative"
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
                  placeholder="Décrivez en détail votre initiative, le contexte et les enjeux"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-2">
                  Objectifs visés *
                </label>
                <textarea
                  id="objectives"
                  rows={3}
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
                <label htmlFor="implementationDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date souhaitée de mise en œuvre *
                </label>
                <input
                  type="date"
                  id="implementationDate"
                  value={formData.implementationDate || ''}
                  onChange={(e) => handleInputChange('implementationDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.implementationDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.implementationDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.implementationDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="projectOwner" className="block text-sm font-medium text-gray-700 mb-2">
                  Porteur du projet *
                </label>
                <input
                  type="text"
                  id="projectOwner"
                  value={formData.projectOwner || ''}
                  onChange={(e) => handleInputChange('projectOwner', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.projectOwner ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nom du responsable du projet"
                />
                {errors.projectOwner && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectOwner}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Service(s) concerné(s) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {services.map((service) => (
                    <label key={service} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.affectedServices?.includes(service) || false}
                        onChange={(e) => handleMultiSelectChange('affectedServices', service, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
                {errors.affectedServices && (
                  <p className="mt-1 text-sm text-red-600">{errors.affectedServices}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            /* Page 2 - Options et valeurs */
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Liste des valeurs associées *
                </label>
                <select
                  multiple
                  value={formData.associatedValues || []}
                  onChange={(e) => {
                    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                    handleInputChange('associatedValues', selectedValues);
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 ${
                    errors.associatedValues ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {valuesList?.items.filter(item => item.active).map((item) => (
                    <option key={item.id} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs valeurs
                </p>
                {errors.associatedValues && (
                  <p className="mt-1 text-sm text-red-600">{errors.associatedValues}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nouvelles options disponibles
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableOptions.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.newOptions?.includes(option) || false}
                        onChange={(e) => handleMultiSelectChange('newOptions', option, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="estimatedImpact" className="block text-sm font-medium text-gray-700 mb-2">
                  Impact estimé (échelle de 1 à 5) *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    id="estimatedImpact"
                    min="1"
                    max="5"
                    value={formData.estimatedImpact || 3}
                    onChange={(e) => handleInputChange('estimatedImpact', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= (formData.estimatedImpact || 3)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-8">
                    {formData.estimatedImpact || 3}/5
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  1 = Impact faible, 5 = Impact très élevé
                </div>
              </div>

              <div>
                <label htmlFor="requiredResources" className="block text-sm font-medium text-gray-700 mb-2">
                  Ressources nécessaires *
                </label>
                <textarea
                  id="requiredResources"
                  rows={4}
                  value={formData.requiredResources || ''}
                  onChange={(e) => handleInputChange('requiredResources', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.requiredResources ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Décrivez les ressources humaines, techniques et matérielles nécessaires"
                />
                {errors.requiredResources && (
                  <p className="mt-1 text-sm text-red-600">{errors.requiredResources}</p>
                )}
              </div>

              <div>
                <label htmlFor="projectedBudget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget prévisionnel (€) *
                </label>
                <input
                  type="number"
                  id="projectedBudget"
                  min="0"
                  step="1000"
                  value={formData.projectedBudget || ''}
                  onChange={(e) => handleInputChange('projectedBudget', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.projectedBudget ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.projectedBudget && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectedBudget}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
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
              
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Précédent</span>
                </button>
              )}
              
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>Suivant</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              
              {currentStep === 2 && (
                <>
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    <span>Sauvegarder en brouillon</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitForValidation}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    <span>
                      {isSubmitting ? 'Envoi...' : 'Envoyer pour validation'}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiativeForm;