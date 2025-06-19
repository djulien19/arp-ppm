import React, { useState } from 'react';
import { Users, Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Eye, Filter, ChevronRight, ArrowLeft, Edit, Save, X } from 'lucide-react';
import { committeeNames, mockProjects } from '../data/mockData';
import { CommitteeType, Project, PerformanceReport, PerformanceStatus } from '../types';

const CommitteeReporting: React.FC = () => {
  const [selectedCommittee, setSelectedCommittee] = useState<CommitteeType | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showPerformanceForm, setShowPerformanceForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data for projects with committee assignment
  const projectsWithCommittees = mockProjects.map(project => ({
    ...project,
    committeeType: 'codir' as CommitteeType, // In real app, this would come from database
    performanceReports: [
      {
        id: '1',
        projectId: project.id,
        reportDate: '2024-02-28',
        period: {
          startDate: '2024-02-01',
          endDate: '2024-02-28'
        },
        performance: {
          budget: {
            status: 'mise_en_garde' as PerformanceStatus,
            evolution: 'conforme' as PerformanceStatus
          },
          planning: {
            status: 'a_risque' as PerformanceStatus,
            evolution: 'mise_en_garde' as PerformanceStatus
          },
          scope: {
            status: 'conforme' as PerformanceStatus,
            evolution: 'conforme' as PerformanceStatus
          }
        },
        achievements: 'Module recrutement développé à 80%, tests utilisateurs réalisés, formation des key users démarrée. Intégration avec le SIRH en cours.',
        nextPlans: 'Finalisation du module recrutement, tests de charge, préparation de la mise en production, formation élargie des utilisateurs.',
        nextPeriod: {
          startDate: '2024-03-01',
          endDate: '2024-03-31'
        },
        reportedBy: 'Thomas Bernard',
        createdAt: '2024-02-28T17:00:00Z'
      }
    ]
  }));

  const getCommitteeProjects = (committeeType: CommitteeType) => {
    return projectsWithCommittees.filter(p => p.committeeType === committeeType);
  };

  const getPerformanceStatusColor = (status: PerformanceStatus) => {
    switch (status) {
      case 'conforme': return 'bg-green-100 text-green-800';
      case 'mise_en_garde': return 'bg-yellow-100 text-yellow-800';
      case 'a_risque': return 'bg-orange-100 text-orange-800';
      case 'en_derive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceStatusLabel = (status: PerformanceStatus) => {
    switch (status) {
      case 'conforme': return 'Conforme';
      case 'mise_en_garde': return 'Mise en garde';
      case 'a_risque': return 'À risque';
      case 'en_derive': return 'En dérive';
      default: return status;
    }
  };

  const getPerformanceStatusIcon = (status: PerformanceStatus) => {
    switch (status) {
      case 'conforme': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'mise_en_garde': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'a_risque': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'en_derive': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEvolutionIcon = (current: PerformanceStatus, evolution: PerformanceStatus) => {
    const statusValues = { 'conforme': 1, 'mise_en_garde': 2, 'a_risque': 3, 'en_derive': 4 };
    const currentValue = statusValues[current];
    const evolutionValue = statusValues[evolution];
    
    if (evolutionValue < currentValue) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (evolutionValue > currentValue) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <span className="h-4 w-4 text-gray-400">→</span>;
  };

  const getProjectHealthColor = (project: Project) => {
    switch (project.monitoring.healthStatus) {
      case 'green': return 'text-green-600';
      case 'orange': return 'text-orange-600';
      case 'red': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-emerald-100 text-emerald-800';
      case 'on_hold': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'Planification';
      case 'in_progress': return 'En cours';
      case 'on_hold': return 'En pause';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  // Performance Report Form Component
  const PerformanceReportForm: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
    const [formData, setFormData] = useState({
      period: {
        startDate: '2024-03-01',
        endDate: '2024-03-31'
      },
      performance: {
        budget: { status: 'conforme' as PerformanceStatus, evolution: 'conforme' as PerformanceStatus },
        planning: { status: 'conforme' as PerformanceStatus, evolution: 'conforme' as PerformanceStatus },
        scope: { status: 'conforme' as PerformanceStatus, evolution: 'conforme' as PerformanceStatus }
      },
      achievements: '',
      nextPlans: '',
      nextPeriod: {
        startDate: '2024-04-01',
        endDate: '2024-04-30'
      }
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // In real app, save to database
      console.log('Saving performance report:', formData);
      onClose();
    };

    const handlePerformanceChange = (dimension: 'budget' | 'planning' | 'scope', field: 'status' | 'evolution', value: PerformanceStatus) => {
      setFormData(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          [dimension]: {
            ...prev.performance[dimension],
            [field]: value
          }
        }
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Actualisation du projet</h2>
                <p className="text-sm text-gray-600 mt-1">{project.title}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Période */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Période concernée</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                  <input
                    type="date"
                    value={formData.period.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, period: { ...prev.period, startDate: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Indicateurs de performance</h3>
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Dimension</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Performance actuelle</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Évolution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {(['budget', 'planning', 'scope'] as const).map((dimension) => (
                      <tr key={dimension}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                          {dimension === 'scope' ? 'Périmètre' : dimension.charAt(0).toUpperCase() + dimension.slice(1)}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={formData.performance[dimension].status}
                            onChange={(e) => handlePerformanceChange(dimension, 'status', e.target.value as PerformanceStatus)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="conforme">✅ Tout va bien, conforme au plan</option>
                            <option value="mise_en_garde">⚠️ Mise en garde - Léger retard/surcoût</option>
                            <option value="a_risque">🔶 À risque - Délai/surcoût important</option>
                            <option value="en_derive">🚨 En dérive - Solution d'urgence requise</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={formData.performance[dimension].evolution}
                            onChange={(e) => handlePerformanceChange(dimension, 'evolution', e.target.value as PerformanceStatus)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="conforme">✅ Évolution positive</option>
                            <option value="mise_en_garde">⚠️ Évolution à surveiller</option>
                            <option value="a_risque">🔶 Évolution préoccupante</option>
                            <option value="en_derive">🚨 Évolution critique</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Commentaires */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Réalisations sur la période ({formData.period.startDate} au {formData.period.endDate})
                </label>
                <textarea
                  rows={6}
                  value={formData.achievements}
                  onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez les principales réalisations, livrables produits, jalons atteints..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prévisions période suivante ({formData.nextPeriod.startDate} au {formData.nextPeriod.endDate})
                </label>
                <textarea
                  rows={6}
                  value={formData.nextPlans}
                  onChange={(e) => setFormData(prev => ({ ...prev, nextPlans: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez les activités prévues, objectifs à atteindre, livrables attendus..."
                />
              </div>
            </div>

            {/* Période suivante */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Période suivante</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                  <input
                    type="date"
                    value={formData.nextPeriod.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, nextPeriod: { ...prev.nextPeriod, startDate: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                  <input
                    type="date"
                    value={formData.nextPeriod.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, nextPeriod: { ...prev.nextPeriod, endDate: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
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

  // Project Detail Modal
  const ProjectDetailModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
    const latestReport = project.performanceReports?.[0];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProjectStatusColor(project.status)}`}>
                    {getProjectStatusLabel(project.status)}
                  </span>
                  <span className={`text-2xl ${getProjectHealthColor(project)}`}>
                    {project.monitoring.healthStatus === 'green' ? '🟢' :
                     project.monitoring.healthStatus === 'orange' ? '🟡' : '🔴'}
                  </span>
                  <span className="text-sm text-gray-600">
                    Chef de projet: {project.governance.projectManager}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPerformanceForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Nouvelle actualisation</span>
                </button>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {latestReport ? (
              <>
                {/* En-tête du rapport */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dernière actualisation - {new Date(latestReport.reportDate).toLocaleDateString('fr-FR')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Période: {new Date(latestReport.period.startDate).toLocaleDateString('fr-FR')} au {new Date(latestReport.period.endDate).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Par: {latestReport.reportedBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {project.monitoring.completionPercentage}%
                      </div>
                      <div className="text-sm text-gray-600">Avancement global</div>
                    </div>
                  </div>
                </div>

                {/* Tableau de performance */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3">
                    <h4 className="text-lg font-medium text-gray-900">Indicateurs de performance</h4>
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Dimension</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Performance</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Évolution</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tendance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(latestReport.performance).map(([dimension, perf]) => (
                        <tr key={dimension}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                            {dimension === 'scope' ? 'Périmètre' : dimension.charAt(0).toUpperCase() + dimension.slice(1)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {getPerformanceStatusIcon(perf.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceStatusColor(perf.status)}`}>
                                {getPerformanceStatusLabel(perf.status)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceStatusColor(perf.evolution)}`}>
                              {getPerformanceStatusLabel(perf.evolution)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {getEvolutionIcon(perf.status, perf.evolution)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Commentaires */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      ✅ Réalisations de la période
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{latestReport.achievements}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      🎯 Prévisions période suivante
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{latestReport.nextPlans}</p>
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="text-sm text-blue-700">
                        Prochaine période: {new Date(latestReport.nextPeriod.startDate).toLocaleDateString('fr-FR')} au {new Date(latestReport.nextPeriod.endDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations complémentaires */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Budget</h5>
                    <div className="text-2xl font-bold text-gray-900">
                      {((project.budget.spent / project.budget.currentBudget) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {project.budget.spent.toLocaleString('fr-FR')} € / {project.budget.currentBudget.toLocaleString('fr-FR')} €
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Planning</h5>
                    <div className="text-2xl font-bold text-gray-900">
                      {project.planning.varianceDays > 0 ? '+' : ''}{project.planning.varianceDays}j
                    </div>
                    <div className="text-sm text-gray-600">Écart vs initial</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Prochaine échéance</h5>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(project.nextUpdateDue).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-gray-600">Prochaine actualisation</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune actualisation disponible</h3>
                <p className="text-gray-600 mb-6">Ce projet n'a pas encore d'actualisation de performance.</p>
                <button
                  onClick={() => setShowPerformanceForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Créer la première actualisation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Committee Overview
  const CommitteeOverview: React.FC = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reporting Projets par Comité</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble des projets et de leur performance par comité de pilotage</p>
        </div>
      </div>

      {/* Committee Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(committeeNames).map(([type, name]) => {
          const projects = getCommitteeProjects(type as CommitteeType);
          const healthStats = {
            green: projects.filter(p => p.monitoring.healthStatus === 'green').length,
            orange: projects.filter(p => p.monitoring.healthStatus === 'orange').length,
            red: projects.filter(p => p.monitoring.healthStatus === 'red').length
          };

          return (
            <div
              key={type}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-600">{projects.length} projet(s)</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCommittee(type as CommitteeType)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>Voir détails</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {projects.length > 0 ? (
                <>
                  {/* Health indicators */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{healthStats.green}</div>
                      <div className="text-xs text-green-700">🟢 Vert</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{healthStats.orange}</div>
                      <div className="text-xs text-orange-700">🟡 Orange</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{healthStats.red}</div>
                      <div className="text-xs text-red-700">🔴 Rouge</div>
                    </div>
                  </div>

                  {/* Recent projects */}
                  <div className="space-y-2">
                    {projects.slice(0, 2).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className={`text-lg ${getProjectHealthColor(project)}`}>
                            {project.monitoring.healthStatus === 'green' ? '🟢' :
                             project.monitoring.healthStatus === 'orange' ? '🟡' : '🔴'}
                          </span>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{project.title}</div>
                            <div className="text-xs text-gray-600">{project.governance.projectManager}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {project.monitoring.completionPercentage}%
                          </div>
                          <div className="text-xs text-gray-600">Avancement</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>Aucun projet assigné à ce comité</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Committee Detail View
  const CommitteeDetailView: React.FC = () => {
    if (!selectedCommittee) return null;
    
    const projects = getCommitteeProjects(selectedCommittee);
    const filteredProjects = statusFilter === 'all' ? projects : projects.filter(p => p.status === statusFilter);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedCommittee(null)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {committeeNames[selectedCommittee]}
              </h1>
              <p className="text-gray-600 mt-1">Projets sous la responsabilité de ce comité</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="planning">Planification</option>
              <option value="in_progress">En cours</option>
              <option value="on_hold">En pause</option>
              <option value="completed">Terminé</option>
            </select>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const latestReport = project.performanceReports?.[0];
            
            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {project.title}
                      </button>
                      <span className={`text-2xl ${getProjectHealthColor(project)}`}>
                        {project.monitoring.healthStatus === 'green' ? '🟢' :
                         project.monitoring.healthStatus === 'orange' ? '🟡' : '🔴'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProjectStatusColor(project.status)}`}>
                        {getProjectStatusLabel(project.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Informations générales</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>Chef de projet: {project.governance.projectManager}</div>
                          <div>Avancement: {project.monitoring.completionPercentage}%</div>
                          <div>Budget: {((project.budget.spent / project.budget.currentBudget) * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                      
                      {latestReport && (
                        <>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Performance actuelle</h4>
                            <div className="space-y-2">
                              {Object.entries(latestReport.performance).map(([dimension, perf]) => (
                                <div key={dimension} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 capitalize">
                                    {dimension === 'scope' ? 'Périmètre' : dimension}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    {getPerformanceStatusIcon(perf.status)}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPerformanceStatusColor(perf.status)}`}>
                                      {getPerformanceStatusLabel(perf.status)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Dernière actualisation</h4>
                            <div className="text-sm text-gray-600">
                              <div>{new Date(latestReport.reportDate).toLocaleDateString('fr-FR')}</div>
                              <div>Par: {latestReport.reportedBy}</div>
                              <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                                Période: {new Date(latestReport.period.startDate).toLocaleDateString('fr-FR')} au {new Date(latestReport.period.endDate).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'Aucun projet n\'est assigné à ce comité.'
                : `Aucun projet avec le statut "${getProjectStatusLabel(statusFilter)}" trouvé.`
              }
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="transition-all duration-300 ease-in-out">
        {selectedCommittee ? <CommitteeDetailView /> : <CommitteeOverview />}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Performance Report Form Modal */}
      {showPerformanceForm && selectedProject && (
        <PerformanceReportForm
          project={selectedProject}
          onClose={() => setShowPerformanceForm(false)}
        />
      )}
    </div>
  );
};

export default CommitteeReporting;