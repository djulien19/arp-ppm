import React, { useState } from 'react';
import { X, Save, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Project } from '../types';

interface ProjectUpdateProps {
  project: Project;
  onSave: (updatedProject: Partial<Project>) => void;
  onCancel: () => void;
}

interface UpdateFormData {
  period: {
    startDate: string;
    endDate: string;
  };
  performance: {
    budget: {
      status: 'conforme' | 'mise_en_garde' | 'a_risque' | 'en_derive';
      evolution: 'ameliore' | 'stable' | 'degrade';
    };
    planning: {
      status: 'conforme' | 'mise_en_garde' | 'a_risque' | 'en_derive';
      evolution: 'ameliore' | 'stable' | 'degrade';
    };
    scope: {
      status: 'conforme' | 'mise_en_garde' | 'a_risque' | 'en_derive';
      evolution: 'ameliore' | 'stable' | 'degrade';
    };
  };
  achievements: string;
  nextPlans: string;
  blockers: string[];
  attentionPoints: string[];
  completionPercentage: number;
  healthStatus: 'green' | 'orange' | 'red';
  newBlocker: string;
  newAttentionPoint: string;
}

const ProjectUpdateForm: React.FC<ProjectUpdateProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UpdateFormData>({
    period: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    performance: {
      budget: { status: 'conforme', evolution: 'stable' },
      planning: { status: 'conforme', evolution: 'stable' },
      scope: { status: 'conforme', evolution: 'stable' }
    },
    achievements: '',
    nextPlans: '',
    blockers: [...project.monitoring.blockers],
    attentionPoints: [...project.monitoring.attentionPoints],
    completionPercentage: project.monitoring.completionPercentage,
    healthStatus: project.monitoring.healthStatus,
    newBlocker: '',
    newAttentionPoint: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const performanceStatusOptions = [
    { value: 'conforme', label: '✅ Conforme - Tout va bien', color: 'text-green-600' },
    { value: 'mise_en_garde', label: '⚠️ Mise en garde - À surveiller', color: 'text-yellow-600' },
    { value: 'a_risque', label: '🔶 À risque - Action requise', color: 'text-orange-600' },
    { value: 'en_derive', label: '🚨 En dérive - Intervention urgente', color: 'text-red-600' }
  ];

  const evolutionOptions = [
    { value: 'ameliore', label: '📈 Amélioré', color: 'text-green-600' },
    { value: 'stable', label: '➡️ Stable', color: 'text-gray-600' },
    { value: 'degrade', label: '📉 Dégradé', color: 'text-red-600' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.achievements.trim()) {
      newErrors.achievements = 'Les réalisations sont obligatoires';
    }

    if (!formData.nextPlans.trim()) {
      newErrors.nextPlans = 'Les prévisions sont obligatoires';
    }

    if (formData.completionPercentage < 0 || formData.completionPercentage > 100) {
      newErrors.completionPercentage = 'Le pourcentage doit être entre 0 et 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Calculer le statut de santé global basé sur les performances
    const overallHealth = calculateOverallHealth();
    
    const updatedProject: Partial<Project> = {
      ...project,
      lastUpdated: new Date().toISOString(),
      nextUpdateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      monitoring: {
        ...project.monitoring,
        healthStatus: overallHealth,
        completionPercentage: formData.completionPercentage,
        lastAchievements: formData.achievements,
        blockers: formData.blockers,
        attentionPoints: formData.attentionPoints
      }
    };

    onSave(updatedProject);
  };

  const calculateOverallHealth = (): 'green' | 'orange' | 'red' => {
    const statuses = [
      formData.performance.budget.status,
      formData.performance.planning.status,
      formData.performance.scope.status
    ];
    
    if (statuses.includes('en_derive')) return 'red';
    if (statuses.includes('a_risque')) return 'red';
    if (statuses.includes('mise_en_garde')) return 'orange';
    return 'green';
  };

  const addBlocker = () => {
    if (formData.newBlocker.trim()) {
      setFormData(prev => ({
        ...prev,
        blockers: [...prev.blockers, prev.newBlocker.trim()],
        newBlocker: ''
      }));
    }
  };

  const removeBlocker = (index: number) => {
    setFormData(prev => ({
      ...prev,
      blockers: prev.blockers.filter((_, i) => i !== index)
    }));
  };

  const addAttentionPoint = () => {
    if (formData.newAttentionPoint.trim()) {
      setFormData(prev => ({
        ...prev,
        attentionPoints: [...prev.attentionPoints, prev.newAttentionPoint.trim()],
        newAttentionPoint: ''
      }));
    }
  };

  const removeAttentionPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attentionPoints: prev.attentionPoints.filter((_, i) => i !== index)
    }));
  };

  const getEvolutionIcon = (evolution: string) => {
    switch (evolution) {
      case 'ameliore': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'degrade': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <span className="h-4 w-4 text-gray-400">→</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Actualisation du projet</h2>
              <p className="text-sm text-gray-600 mt-1">{project.title}</p>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-sm text-gray-600">
                  Dernière mise à jour: {new Date(project.lastUpdated).toLocaleDateString('fr-FR')}
                </span>
                <span className="text-sm text-gray-600">
                  ({Math.floor((Date.now() - new Date(project.lastUpdated).getTime()) / (1000 * 60 * 60 * 24))} jours)
                </span>
              </div>
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
          {/* Période concernée */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📅 Période concernée par cette actualisation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={formData.period.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, period: { ...prev.period, startDate: e.target.value } }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={formData.period.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, period: { ...prev.period, endDate: e.target.value } }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tableau de performance */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Indicateurs de performance</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Dimension</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Statut actuel</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Évolution</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Tendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(['budget', 'planning', 'scope'] as const).map((dimension) => (
                    <tr key={dimension}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {dimension === 'budget' ? '💰 Budget' :
                         dimension === 'planning' ? '⏱️ Planning' : '🎯 Périmètre'}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={formData.performance[dimension].status}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            performance: {
                              ...prev.performance,
                              [dimension]: {
                                ...prev.performance[dimension],
                                status: e.target.value as any
                              }
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          {performanceStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={formData.performance[dimension].evolution}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            performance: {
                              ...prev.performance,
                              [dimension]: {
                                ...prev.performance[dimension],
                                evolution: e.target.value as any
                              }
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          {evolutionOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getEvolutionIcon(formData.performance[dimension].evolution)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Avancement global */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Avancement global du projet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pourcentage d'avancement
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.completionPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, completionPercentage: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">
                      {formData.completionPercentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${formData.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  État de santé global
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'green', label: '🟢 Vert - Projet en bonne santé', desc: 'Aucun problème majeur' },
                    { value: 'orange', label: '🟡 Orange - Points d\'attention', desc: 'Surveillance requise' },
                    { value: 'red', label: '🔴 Rouge - Problèmes critiques', desc: 'Intervention immédiate' }
                  ].map(status => (
                    <label key={status.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="healthStatus"
                        value={status.value}
                        checked={formData.healthStatus === status.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, healthStatus: e.target.value as any }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{status.label}</div>
                        <div className="text-sm text-gray-600">{status.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Réalisations et prévisions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ✅ Réalisations sur la période
              </h3>
              <textarea
                rows={6}
                value={formData.achievements}
                onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.achievements ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Décrivez les principales réalisations, livrables produits, jalons atteints..."
              />
              {errors.achievements && (
                <p className="mt-1 text-sm text-red-600">{errors.achievements}</p>
              )}
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                🎯 Prévisions période suivante
              </h3>
              <textarea
                rows={6}
                value={formData.nextPlans}
                onChange={(e) => setFormData(prev => ({ ...prev, nextPlans: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.nextPlans ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Décrivez les activités prévues, objectifs à atteindre, livrables attendus..."
              />
              {errors.nextPlans && (
                <p className="mt-1 text-sm text-red-600">{errors.nextPlans}</p>
              )}
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-blue-700">
                  Prochaine période: {new Date(formData.period.startDate).toLocaleDateString('fr-FR')} au {new Date(formData.period.endDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Blocages et points d'attention */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                🚫 Blocages identifiés
              </h3>
              <div className="space-y-3">
                {formData.blockers.map((blocker, index) => (
                  <div key={index} className="flex items-start justify-between bg-white p-3 rounded-lg border border-red-200">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{blocker}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBlocker(index)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.newBlocker}
                    onChange={(e) => setFormData(prev => ({ ...prev, newBlocker: e.target.value }))}
                    placeholder="Nouveau blocage..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBlocker())}
                  />
                  <button
                    type="button"
                    onClick={addBlocker}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                ⚠️ Points d'attention
              </h3>
              <div className="space-y-3">
                {formData.attentionPoints.map((point, index) => (
                  <div key={index} className="flex items-start justify-between bg-white p-3 rounded-lg border border-orange-200">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{point}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttentionPoint(index)}
                      className="text-orange-600 hover:text-orange-800 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.newAttentionPoint}
                    onChange={(e) => setFormData(prev => ({ ...prev, newAttentionPoint: e.target.value }))}
                    placeholder="Nouveau point d'attention..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttentionPoint())}
                  />
                  <button
                    type="button"
                    onClick={addAttentionPoint}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé des informations actuelles */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📋 Informations actuelles du projet</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Budget</h4>
                <div className="text-2xl font-bold text-gray-900">
                  {((project.budget.spent / project.budget.currentBudget) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  {project.budget.spent.toLocaleString('fr-FR')} € / {project.budget.currentBudget.toLocaleString('fr-FR')} €
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Planning</h4>
                <div className="text-2xl font-bold text-gray-900">
                  {project.planning.varianceDays > 0 ? '+' : ''}{project.planning.varianceDays}j
                </div>
                <div className="text-sm text-gray-600">Écart vs planning initial</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Équipe</h4>
                <div className="text-sm text-gray-900">
                  <div>Chef de projet: {project.governance.projectManager}</div>
                  <div>Sponsor: {project.governance.sponsor}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Enregistrer l'actualisation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectUpdateForm;