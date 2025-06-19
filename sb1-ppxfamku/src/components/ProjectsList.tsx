import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Clock, CheckCircle, AlertTriangle, TrendingUp, Users, Calendar, DollarSign, Target, Shield } from 'lucide-react';
import { mockProjects, healthStatusLabels, scheduleStatusLabels, raciResponsibilities, riskCategories } from '../data/mockData';
import { Project } from '../types';
import ProjectForm from './ProjectForm';

const ProjectsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveProject = (projectData: Partial<Project>) => {
    if (editingProject) {
      setProjects(prev => prev.map(proj => 
        proj.id === editingProject.id 
          ? { ...proj, ...projectData }
          : proj
      ));
    } else {
      const newProject = {
        ...projectData,
        id: Date.now().toString(),
        initiativeId: 'temp-' + Date.now(),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        nextUpdateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      } as Project;
      
      setProjects(prev => [newProject, ...prev]);
    }
    
    setShowForm(false);
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-emerald-100 text-emerald-800';
      case 'on_hold': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'Planification';
      case 'in_progress': return 'En cours';
      case 'on_hold': return 'En pause';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'green': return '🟢';
      case 'orange': return '🟡';
      case 'red': return '🔴';
      default: return '⚪';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
                <span className="text-lg">
                  {getHealthStatusIcon(project.monitoring.healthStatus)}
                </span>
                <span className="text-sm text-gray-600">
                  {project.monitoring.completionPercentage}% complété
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* 1. GOUVERNANCE */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              👤 GOUVERNANCE
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Matrice RACI</h4>
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nom</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fonction</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">RACI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {project.governance.raciMatrix.map((person) => (
                        <tr key={person.id}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{person.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{person.function}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              person.responsibility === 'A' ? 'bg-red-100 text-red-800' :
                              person.responsibility === 'R' ? 'bg-blue-100 text-blue-800' :
                              person.responsibility === 'C' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {person.responsibility}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(raciResponsibilities).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-1">
                        <span className="font-medium">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Rôles clés</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="text-sm font-medium text-gray-700">Sponsor</div>
                    <div className="text-gray-900">{project.governance.sponsor}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="text-sm font-medium text-gray-700">Chef de projet</div>
                    <div className="text-gray-900">{project.governance.projectManager}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="text-sm font-medium text-gray-700">Comité de pilotage</div>
                    <div className="text-gray-900">
                      {project.governance.steeringCommittee.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. BUDGET */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-6 w-6 mr-2 text-green-600" />
              💰 BUDGET
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {project.budget.initialEstimate.toLocaleString('fr-FR')} €
                    </div>
                    <div className="text-sm text-gray-600">Budget initial</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {project.budget.currentBudget.toLocaleString('fr-FR')} €
                    </div>
                    <div className="text-sm text-gray-600">Budget actuel</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {project.budget.spent.toLocaleString('fr-FR')} €
                    </div>
                    <div className="text-sm text-gray-600">Dépensé</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {project.budget.remaining.toLocaleString('fr-FR')} €
                    </div>
                    <div className="text-sm text-gray-600">Restant</div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Répartition des coûts</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Coûts externes</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {project.budget.externalCosts.toLocaleString('fr-FR')} €
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Coûts internes</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {project.budget.internalCosts.toLocaleString('fr-FR')} €
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                  <div className="text-sm text-gray-600 mb-1">Code d'imputation</div>
                  <div className="font-mono text-sm font-semibold text-gray-900">
                    {project.budget.budgetCode}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Écart budgétaire</div>
                  <div className={`text-2xl font-bold ${
                    project.budget.variance > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {project.budget.variance > 0 ? '+' : ''}{project.budget.variance.toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(project.budget.spent / project.budget.currentBudget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {project.budget.deliverableBudgets.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Budget par livrable</h4>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Livrable</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Alloué</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Dépensé</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Restant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {project.budget.deliverableBudgets.map((budget) => (
                        <tr key={budget.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">{budget.deliverableName}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            {budget.allocatedBudget.toLocaleString('fr-FR')} €
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            {budget.spentBudget.toLocaleString('fr-FR')} €
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            {(budget.allocatedBudget - budget.spentBudget).toLocaleString('fr-FR')} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* 3. PLANNING */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-purple-600" />
              ⏱️ PLANNING
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Dates clés</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Début initial:</span>
                      <span className="font-medium">
                        {new Date(project.planning.initialStartDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fin prévue initiale:</span>
                      <span className="font-medium">
                        {new Date(project.planning.initialEndDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {project.planning.actualStartDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Début réel:</span>
                        <span className="font-medium">
                          {new Date(project.planning.actualStartDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fin prévue actuelle:</span>
                      <span className="font-medium">
                        {new Date(project.planning.currentEndDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Écarts et durée</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Écart planning:</span>
                      <span className={`font-medium ${
                        project.planning.varianceDays > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {project.planning.varianceDays > 0 ? '+' : ''}{project.planning.varianceDays} jours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée totale:</span>
                      <span className="font-medium">{project.planning.totalDuration} jours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut planning:</span>
                      <span className={`font-medium ${
                        project.monitoring.scheduleStatus === 'delayed' ? 'text-red-600' :
                        project.monitoring.scheduleStatus === 'ahead' ? 'text-green-600' :
                        'text-blue-600'
                      }`}>
                        {scheduleStatusLabels[project.monitoring.scheduleStatus]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. RISQUES ET COMPLEXITÉ */}
          <div className="bg-red-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-red-600" />
              ⚠️ RISQUES ET COMPLEXITÉ
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Niveau de risque global</h4>
                  <div className={`text-2xl font-bold ${getRiskLevelColor(project.riskManagement.globalRiskLevel)}`}>
                    {project.riskManagement.globalRiskLevel === 'low' ? 'Faible' :
                     project.riskManagement.globalRiskLevel === 'medium' ? 'Moyen' : 'Élevé'}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Catégories de risque</h4>
                  <div className="space-y-2">
                    {project.riskManagement.riskCategories.map((cat, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">
                          {riskCategories[cat.category]}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cat.level === 'low' ? 'bg-green-100 text-green-800' :
                          cat.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {cat.level === 'low' ? 'Faible' :
                           cat.level === 'medium' ? 'Moyen' : 'Élevé'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                {project.riskManagement.complexityFactors.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Facteurs de complexité</h4>
                    <ul className="space-y-2">
                      {project.riskManagement.complexityFactors.map((factor, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-gray-700 text-sm">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {project.riskManagement.risks.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Risques identifiés</h4>
                <div className="space-y-3">
                  {project.riskManagement.risks.map((risk) => (
                    <div key={risk.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{risk.description}</h5>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-gray-600">
                              Catégorie: {riskCategories[risk.category]}
                            </span>
                            <span className="text-gray-600">
                              Propriétaire: {risk.owner}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            risk.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            risk.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {risk.severity === 'critical' ? 'Critique' :
                             risk.severity === 'high' ? 'Élevé' :
                             risk.severity === 'medium' ? 'Moyen' : 'Faible'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            risk.status === 'open' ? 'bg-red-100 text-red-800' :
                            risk.status === 'mitigated' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {risk.status === 'open' ? 'Ouvert' :
                             risk.status === 'mitigated' ? 'Atténué' : 'Fermé'}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <strong>Mitigation:</strong> {risk.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. SUIVI ET AVANCEMENT */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="h-6 w-6 mr-2 text-indigo-600" />
              📊 SUIVI ET AVANCEMENT
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">État de santé du projet</h4>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">
                      {getHealthStatusIcon(project.monitoring.healthStatus)}
                    </span>
                    <span className="text-lg font-medium">
                      {healthStatusLabels[project.monitoring.healthStatus]}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        project.monitoring.healthStatus === 'green' ? 'bg-green-500' :
                        project.monitoring.healthStatus === 'orange' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${project.monitoring.completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-600 mt-1">
                    {project.monitoring.completionPercentage}% complété
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Dernières réalisations</h4>
                  <p className="text-gray-700 text-sm">{project.monitoring.lastAchievements}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Prochaine étape majeure</h4>
                  <p className="text-gray-700 text-sm">{project.monitoring.nextMajorMilestone}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {project.monitoring.blockers.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-3">🚫 Blocages</h4>
                    <ul className="space-y-2">
                      {project.monitoring.blockers.map((blocker, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-start space-x-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{blocker}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {project.monitoring.attentionPoints.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-3">⚠️ Points d'attention</h4>
                    <ul className="space-y-2">
                      {project.monitoring.attentionPoints.map((point, index) => (
                        <li key={index} className="text-sm text-orange-700 flex items-start space-x-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Jalons et Équipe (sections existantes) */}
          {project.milestones.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Jalons du projet</h3>
              <div className="space-y-4">
                {project.milestones.map((milestone) => (
                  <div key={milestone.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                        {getStatusLabel(milestone.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{milestone.description}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Prévu: {new Date(milestone.plannedDate).toLocaleDateString('fr-FR')}</span>
                      {milestone.actualDate && (
                        <span>Réalisé: {new Date(milestone.actualDate).toLocaleDateString('fr-FR')}</span>
                      )}
                      {milestone.budgetAllocated && (
                        <span>Budget: {milestone.budgetAllocated.toLocaleString('fr-FR')} €</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Dernière mise à jour: {new Date(project.lastUpdated).toLocaleDateString('fr-FR')}</span>
              <span>Prochaine mise à jour due: {new Date(project.nextUpdateDue).toLocaleDateString('fr-FR')}</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-600 mt-1">Suivi et gestion des projets actifs</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau projet</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
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
              <option value="planning">Planification</option>
              <option value="in_progress">En cours</option>
              <option value="on_hold">En pause</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {getHealthStatusIcon(project.monitoring.healthStatus)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{project.governance.projectManager}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Maj: {new Date(project.lastUpdated).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Budget: {((project.budget.spent / project.budget.currentBudget) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {project.monitoring.completionPercentage}% complété
                  </span>
                </div>
              </div>

              {(project.monitoring.blockers.length > 0 || project.riskManagement.risks.some(r => r.status === 'open')) && (
                <div className="flex items-center justify-between text-sm">
                  {project.monitoring.blockers.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-red-600 text-xs">
                        {project.monitoring.blockers.length} blocage(s)
                      </span>
                    </div>
                  )}
                  {project.riskManagement.risks.some(r => r.status === 'open') && (
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-amber-500" />
                      <span className="text-amber-600 text-xs">
                        {project.riskManagement.risks.filter(r => r.status === 'open').length} risque(s)
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    project.monitoring.healthStatus === 'green' ? 'bg-green-500' :
                    project.monitoring.healthStatus === 'orange' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${project.monitoring.completionPercentage}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">
                  {project.budget.spent.toLocaleString('fr-FR')} € / {project.budget.currentBudget.toLocaleString('fr-FR')} €
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEditProject(project)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          project={editingProject || undefined}
          onSave={handleSaveProject}
          onCancel={handleCancelForm}
          isEditing={!!editingProject}
        />
      )}
    </div>
  );
};

export default ProjectsList;