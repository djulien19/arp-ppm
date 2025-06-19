import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Users, Calendar, DollarSign, Target, AlertTriangle, FileText, CheckSquare } from 'lucide-react';
import { Project, Milestone, Resource, Risk, ScopeChange, Deliverable } from '../types';
import { services } from '../data/mockData';

interface ProjectFormProps {
  project?: Project;
  onSave: (project: Partial<Project>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    status: 'planning',
    governance: {
      projectManager: '',
      sponsor: '',
      steeringCommittee: []
    },
    milestones: [],
    resources: [],
    budget: {
      allocated: 0,
      spent: 0,
      remaining: 0
    },
    scopeChanges: [],
    risks: [],
    ...project
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    if (!formData.governance?.projectManager?.trim()) {
      newErrors.projectManager = 'Le chef de projet est obligatoire';
    }

    if (!formData.governance?.sponsor?.trim()) {
      newErrors.sponsor = 'Le sponsor est obligatoire';
    }

    if (!formData.budget?.allocated || formData.budget.allocated <= 0) {
      newErrors.budgetAllocated = 'Le budget alloué doit être supérieur à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setActiveTab('basic');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...formData,
        lastUpdated: new Date().toISOString(),
        nextUpdateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        budget: {
          ...formData.budget!,
          remaining: (formData.budget?.allocated || 0) - (formData.budget?.spent || 0)
        },
        ...(isEditing ? {} : {
          id: Date.now().toString(),
          initiativeId: 'temp-' + Date.now(),
          createdAt: new Date().toISOString()
        })
      };

      await onSave(submissionData);
    } catch (error) {
      console.error('Error saving project:', error);
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

  const handleGovernanceChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      governance: {
        ...prev.governance!,
        [field]: value
      }
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBudgetChange = (field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      budget: {
        ...prev.budget!,
        [field]: numValue,
        ...(field === 'allocated' || field === 'spent' ? {
          remaining: field === 'allocated' 
            ? numValue - (prev.budget?.spent || 0)
            : (prev.budget?.allocated || 0) - numValue
        } : {})
      }
    }));
  };

  // Milestone management
  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      name: '',
      description: '',
      plannedDate: '',
      status: 'not_started',
      deliverables: []
    };
    
    setFormData(prev => ({
      ...prev,
      milestones: [...(prev.milestones || []), newMilestone]
    }));
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones?.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      ) || []
    }));
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones?.filter((_, i) => i !== index) || []
    }));
  };

  const addDeliverable = (milestoneIndex: number) => {
    const newDeliverable: Deliverable = {
      id: Date.now().toString(),
      name: '',
      description: '',
      status: 'pending',
      dueDate: ''
    };

    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones?.map((milestone, i) => 
        i === milestoneIndex 
          ? { ...milestone, deliverables: [...milestone.deliverables, newDeliverable] }
          : milestone
      ) || []
    }));
  };

  const updateDeliverable = (milestoneIndex: number, deliverableIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones?.map((milestone, i) => 
        i === milestoneIndex 
          ? {
              ...milestone,
              deliverables: milestone.deliverables.map((deliverable, j) =>
                j === deliverableIndex ? { ...deliverable, [field]: value } : deliverable
              )
            }
          : milestone
      ) || []
    }));
  };

  const removeDeliverable = (milestoneIndex: number, deliverableIndex: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones?.map((milestone, i) => 
        i === milestoneIndex 
          ? {
              ...milestone,
              deliverables: milestone.deliverables.filter((_, j) => j !== deliverableIndex)
            }
          : milestone
      ) || []
    }));
  };

  // Resource management
  const addResource = () => {
    const newResource: Resource = {
      id: Date.now().toString(),
      name: '',
      role: '',
      allocation: 100,
      startDate: '',
      endDate: ''
    };
    
    setFormData(prev => ({
      ...prev,
      resources: [...(prev.resources || []), newResource]
    }));
  };

  const updateResource = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources?.map((resource, i) => 
        i === index ? { ...resource, [field]: value } : resource
      ) || []
    }));
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources?.filter((_, i) => i !== index) || []
    }));
  };

  // Risk management
  const addRisk = () => {
    const newRisk: Risk = {
      id: Date.now().toString(),
      description: '',
      probability: 'medium',
      impact: 'medium',
      severity: 'medium',
      mitigation: '',
      owner: '',
      status: 'open',
      createdAt: new Date().toISOString()
    };
    
    setFormData(prev => ({
      ...prev,
      risks: [...(prev.risks || []), newRisk]
    }));
  };

  const updateRisk = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      risks: prev.risks?.map((risk, i) => 
        i === index ? { ...risk, [field]: value } : risk
      ) || []
    }));
  };

  const removeRisk = (index: number) => {
    setFormData(prev => ({
      ...prev,
      risks: prev.risks?.filter((_, i) => i !== index) || []
    }));
  };

  const addSteeringCommitteeMember = () => {
    const newMember = '';
    setFormData(prev => ({
      ...prev,
      governance: {
        ...prev.governance!,
        steeringCommittee: [...(prev.governance?.steeringCommittee || []), newMember]
      }
    }));
  };

  const updateSteeringCommitteeMember = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      governance: {
        ...prev.governance!,
        steeringCommittee: prev.governance?.steeringCommittee?.map((member, i) => 
          i === index ? value : member
        ) || []
      }
    }));
  };

  const removeSteeringCommitteeMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      governance: {
        ...prev.governance!,
        steeringCommittee: prev.governance?.steeringCommittee?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const tabs = [
    { id: 'basic', label: 'Informations de base', icon: FileText },
    { id: 'governance', label: 'Gouvernance', icon: Users },
    { id: 'milestones', label: 'Jalons', icon: Target },
    { id: 'resources', label: 'Ressources', icon: Users },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'risks', label: 'Risques', icon: AlertTriangle }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Modifier le projet' : 'Nouveau projet'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isEditing ? 'Modifiez les informations du projet' : 'Créez un nouveau projet avec tous les détails nécessaires'}
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

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du projet *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Donnez un titre clair au projet"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description du projet *
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez les objectifs et le contexte du projet"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Statut du projet
                  </label>
                  <select
                    id="status"
                    value={formData.status || 'planning'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="planning">Planification</option>
                    <option value="in_progress">En cours</option>
                    <option value="on_hold">En pause</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>
            )}

            {/* Governance Tab */}
            {activeTab === 'governance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="projectManager" className="block text-sm font-medium text-gray-700 mb-2">
                      Chef de projet *
                    </label>
                    <input
                      type="text"
                      id="projectManager"
                      value={formData.governance?.projectManager || ''}
                      onChange={(e) => handleGovernanceChange('projectManager', e.target.value)}
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
                      value={formData.governance?.sponsor || ''}
                      onChange={(e) => handleGovernanceChange('sponsor', e.target.value)}
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

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Comité de pilotage
                    </label>
                    <button
                      type="button"
                      onClick={addSteeringCommitteeMember}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Ajouter un membre</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.governance?.steeringCommittee?.map((member, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={member}
                          onChange={(e) => updateSteeringCommitteeMember(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nom du membre du comité"
                        />
                        <button
                          type="button"
                          onClick={() => removeSteeringCommitteeMember(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Milestones Tab */}
            {activeTab === 'milestones' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Jalons du projet</h3>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter un jalon</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.milestones?.map((milestone, index) => (
                    <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-900">Jalon {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du jalon
                          </label>
                          <input
                            type="text"
                            value={milestone.name}
                            onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nom du jalon"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date prévue
                          </label>
                          <input
                            type="date"
                            value={milestone.plannedDate}
                            onChange={(e) => updateMilestone(index, 'plannedDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={milestone.description}
                          onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Description du jalon"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Statut
                        </label>
                        <select
                          value={milestone.status}
                          onChange={(e) => updateMilestone(index, 'status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="not_started">Non commencé</option>
                          <option value="in_progress">En cours</option>
                          <option value="completed">Terminé</option>
                          <option value="delayed">En retard</option>
                        </select>
                      </div>

                      {/* Deliverables */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Livrables
                          </label>
                          <button
                            type="button"
                            onClick={() => addDeliverable(index)}
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Ajouter</span>
                          </button>
                        </div>
                        <div className="space-y-2">
                          {milestone.deliverables.map((deliverable, deliverableIndex) => (
                            <div key={deliverable.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                              <input
                                type="text"
                                value={deliverable.name}
                                onChange={(e) => updateDeliverable(index, deliverableIndex, 'name', e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="Nom du livrable"
                              />
                              <select
                                value={deliverable.status}
                                onChange={(e) => updateDeliverable(index, deliverableIndex, 'status', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="pending">En attente</option>
                                <option value="in_progress">En cours</option>
                                <option value="completed">Terminé</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => removeDeliverable(index, deliverableIndex)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Équipe projet</h3>
                  <button
                    type="button"
                    onClick={addResource}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter une ressource</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.resources?.map((resource, index) => (
                    <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-900">Ressource {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeResource(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom
                          </label>
                          <input
                            type="text"
                            value={resource.name}
                            onChange={(e) => updateResource(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nom de la personne"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rôle
                          </label>
                          <input
                            type="text"
                            value={resource.role}
                            onChange={(e) => updateResource(index, 'role', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Rôle dans le projet"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Allocation (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={resource.allocation}
                            onChange={(e) => updateResource(index, 'allocation', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date de début
                          </label>
                          <input
                            type="date"
                            value={resource.startDate}
                            onChange={(e) => updateResource(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date de fin
                          </label>
                          <input
                            type="date"
                            value={resource.endDate}
                            onChange={(e) => updateResource(index, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Tab */}
            {activeTab === 'budget' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Gestion budgétaire</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="budgetAllocated" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget alloué (€) *
                    </label>
                    <input
                      type="number"
                      id="budgetAllocated"
                      min="0"
                      step="1000"
                      value={formData.budget?.allocated || ''}
                      onChange={(e) => handleBudgetChange('allocated', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.budgetAllocated ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.budgetAllocated && (
                      <p className="mt-1 text-sm text-red-600">{errors.budgetAllocated}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="budgetSpent" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget dépensé (€)
                    </label>
                    <input
                      type="number"
                      id="budgetSpent"
                      min="0"
                      step="1000"
                      value={formData.budget?.spent || ''}
                      onChange={(e) => handleBudgetChange('spent', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget restant (€)
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                      {((formData.budget?.allocated || 0) - (formData.budget?.spent || 0)).toLocaleString('fr-FR')}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Utilisation budgétaire</h4>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(100, ((formData.budget?.spent || 0) / (formData.budget?.allocated || 1)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {(((formData.budget?.spent || 0) / (formData.budget?.allocated || 1)) * 100).toFixed(1)}% du budget utilisé
                  </p>
                </div>
              </div>
            )}

            {/* Risks Tab */}
            {activeTab === 'risks' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Gestion des risques</h3>
                  <button
                    type="button"
                    onClick={addRisk}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter un risque</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.risks?.map((risk, index) => (
                    <div key={risk.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-900">Risque {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeRisk(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description du risque
                          </label>
                          <textarea
                            rows={2}
                            value={risk.description}
                            onChange={(e) => updateRisk(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Décrivez le risque identifié"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Probabilité
                            </label>
                            <select
                              value={risk.probability}
                              onChange={(e) => updateRisk(index, 'probability', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="low">Faible</option>
                              <option value="medium">Moyenne</option>
                              <option value="high">Élevée</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Impact
                            </label>
                            <select
                              value={risk.impact}
                              onChange={(e) => updateRisk(index, 'impact', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="low">Faible</option>
                              <option value="medium">Moyen</option>
                              <option value="high">Élevé</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Criticité
                            </label>
                            <select
                              value={risk.severity}
                              onChange={(e) => updateRisk(index, 'severity', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="low">Faible</option>
                              <option value="medium">Moyenne</option>
                              <option value="high">Élevée</option>
                              <option value="critical">Critique</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Statut
                            </label>
                            <select
                              value={risk.status}
                              onChange={(e) => updateRisk(index, 'status', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="open">Ouvert</option>
                              <option value="mitigated">Atténué</option>
                              <option value="closed">Fermé</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Plan d'atténuation
                            </label>
                            <textarea
                              rows={2}
                              value={risk.mitigation}
                              onChange={(e) => updateRisk(index, 'mitigation', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Actions pour atténuer le risque"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Propriétaire
                            </label>
                            <input
                              type="text"
                              value={risk.owner}
                              onChange={(e) => updateRisk(index, 'owner', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Responsable du suivi"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
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
                        ? 'Mettre à jour le projet' 
                        : 'Créer le projet'
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

export default ProjectForm;