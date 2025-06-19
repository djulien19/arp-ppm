import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, Target, Users, FileText, AlertCircle } from 'lucide-react';
import { Initiative, CommitteeType } from '../types';
import { committeeNames, services } from '../data/mockData';

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
    type: 'idea',
    objectives: '',
    scope: '',
    budgetRange: { min: 0, max: 0 },
    timeline: { startDate: '', endDate: '' },
    assignedService: '',
    committeeType: undefined,
    ...initiative
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.assignedService) {
      newErrors.assignedService = 'Le service responsable est obligatoire';
    }

    if (!formData.budgetRange?.min || formData.budgetRange.min <= 0) {
      newErrors.budgetMin = 'Le budget minimum doit être supérieur à 0';
    }

    if (!formData.budgetRange?.max || formData.budgetRange.max <= 0) {
      newErrors.budgetMax = 'Le budget maximum doit être supérieur à 0';
    }

    if (formData.budgetRange?.min && formData.budgetRange?.max && 
        formData.budgetRange.min > formData.budgetRange.max) {
      newErrors.budgetMax = 'Le budget maximum doit être supérieur au minimum';
    }

    if (!formData.timeline?.startDate) {
      newErrors.startDate = 'La date de début est obligatoire';
    }

    if (!formData.timeline?.endDate) {
      newErrors.endDate = 'La date de fin est obligatoire';
    }

    if (formData.timeline?.startDate && formData.timeline?.endDate &&
        new Date(formData.timeline.startDate) >= new Date(formData.timeline.endDate)) {
      newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
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
          createdBy: 'Marie Dubois', // In real app, get from auth context
          status: 'draft' as const
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

  const handleBudgetChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      budgetRange: {
        ...prev.budgetRange!,
        [type]: numValue
      }
    }));
    
    if (errors[`budget${type === 'min' ? 'Min' : 'Max'}`]) {
      setErrors(prev => ({
        ...prev,
        [`budget${type === 'min' ? 'Min' : 'Max'}`]: ''
      }));
    }
  };

  const handleTimelineChange = (type: 'startDate' | 'endDate', value: string) => {
    setFormData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline!,
        [type]: value
      }
    }));
    
    if (errors[type]) {
      setErrors(prev => ({
        ...prev,
        [type]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Modifier l\'initiative' : 'Nouvelle initiative'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isEditing ? 'Modifiez les informations de l\'initiative' : 'Créez une nouvelle initiative ou signalez une anomalie'}
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
          {/* Type and Basic Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type d'initiative
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    name="type"
                    value="idea"
                    checked={formData.type === 'idea'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.type === 'idea' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Idée</div>
                        <div className="text-sm text-gray-600">Nouvelle proposition d'amélioration</div>
                      </div>
                    </div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    name="type"
                    value="anomaly"
                    checked={formData.type === 'anomaly'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.type === 'anomaly' 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-medium text-gray-900">Anomalie</div>
                        <div className="text-sm text-gray-600">Problème à résoudre</div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

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
          </div>

          {/* Objectives and Scope */}
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
                placeholder="Définissez le périmètre d'action de l'initiative"
              />
              {errors.scope && (
                <p className="mt-1 text-sm text-red-600">{errors.scope}</p>
              )}
            </div>
          </div>

          {/* Budget Range */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Fourchette budgétaire
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget minimum (€) *
                </label>
                <input
                  type="number"
                  id="budgetMin"
                  min="0"
                  step="1000"
                  value={formData.budgetRange?.min || ''}
                  onChange={(e) => handleBudgetChange('min', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.budgetMin ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.budgetMin && (
                  <p className="mt-1 text-sm text-red-600">{errors.budgetMin}</p>
                )}
              </div>
              <div>
                <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget maximum (€) *
                </label>
                <input
                  type="number"
                  id="budgetMax"
                  min="0"
                  step="1000"
                  value={formData.budgetRange?.max || ''}
                  onChange={(e) => handleBudgetChange('max', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.budgetMax ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.budgetMax && (
                  <p className="mt-1 text-sm text-red-600">{errors.budgetMax}</p>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Calendrier prévisionnel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début souhaitée *
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.timeline?.startDate || ''}
                  onChange={(e) => handleTimelineChange('startDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin souhaitée *
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.timeline?.endDate || ''}
                  onChange={(e) => handleTimelineChange('endDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.endDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Service Assignment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="assignedService" className="block text-sm font-medium text-gray-700 mb-2">
                Service responsable *
              </label>
              <select
                id="assignedService"
                value={formData.assignedService || ''}
                onChange={(e) => handleInputChange('assignedService', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.assignedService ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez un service</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              {errors.assignedService && (
                <p className="mt-1 text-sm text-red-600">{errors.assignedService}</p>
              )}
            </div>

            <div>
              <label htmlFor="committeeType" className="block text-sm font-medium text-gray-700 mb-2">
                Comité de validation suggéré
              </label>
              <select
                id="committeeType"
                value={formData.committeeType || ''}
                onChange={(e) => handleInputChange('committeeType', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">À déterminer par le PMO</option>
                {Object.entries(committeeNames).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Le PMO pourra ajuster le comité de validation si nécessaire
              </p>
            </div>
          </div>

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
                        : 'Créer l\'initiative'
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