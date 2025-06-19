import React from 'react';
import { TrendingUp, Clock, AlertTriangle, DollarSign, FolderOpen, CheckSquare, Users, Target, FileText, ArrowRight } from 'lucide-react';
import { mockDashboardStats, mockInitiatives, mockProjects, workflowStatusLabels, documentTypeLabels } from '../data/mockData';
import { WorkflowStatus, DocumentType } from '../types';

const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const recentInitiatives = mockInitiatives.slice(0, 4);
  const activeProjects = mockProjects.filter(p => p.status === 'in_progress');

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

  const getDocumentTypeColor = (type: DocumentType) => {
    return type === 'FI' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
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

  const pendingValidations = mockInitiatives.filter(i => 
    ['pending_n1', 'pmo_review', 'committee_review'].includes(i.status)
  );

  const fiCount = mockInitiatives.filter(i => i.documentType === 'FI').length;
  const fpCount = mockInitiatives.filter(i => i.documentType === 'FP').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble du portefeuille de projets et du workflow FI → FP</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total FI + FP"
          value={stats.totalInitiatives}
          icon={FolderOpen}
          color="bg-blue-600"
          trend="+5 ce mois"
        />
        <StatCard
          title="En attente validation"
          value={stats.pendingReviews}
          icon={Clock}
          color="bg-amber-600"
        />
        <StatCard
          title="Projets actifs"
          value={stats.activeProjects}
          icon={CheckSquare}
          color="bg-emerald-600"
          trend="+2 ce mois"
        />
        <StatCard
          title="Approuvés (GO)"
          value={mockInitiatives.filter(i => i.status === 'approved').length}
          icon={Target}
          color="bg-green-600"
        />
      </div>

      {/* Workflow Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition FI / FP</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-gray-700">Formulaires d'Initiative (FI)</span>
              </div>
              <span className="font-semibold text-blue-600">{fiCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-700">Fiches Projet (FP)</span>
              </div>
              <span className="font-semibold text-green-600">{fpCount}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="bg-gray-200 rounded-full h-3">
                <div className="flex h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${(fiCount / (fiCount + fpCount)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${(fpCount / (fiCount + fpCount)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget et Utilisation</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Budget global utilisé</span>
                <span className="font-medium">{stats.budgetUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${stats.budgetUtilization}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">€2.1M</p>
                <p className="text-sm text-gray-600">Alloué</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">€1.4M</p>
                <p className="text-sm text-gray-600">Dépensé</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Status Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statuts dans le workflow</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(workflowStatusLabels).map(([status, label]) => {
            const count = mockInitiatives.filter(i => i.status === status).length;
            return (
              <div key={status} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                <div className="text-xs text-gray-600">{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents récents</h3>
          <div className="space-y-4">
            {recentInitiatives.map((initiative) => (
              <div key={initiative.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{initiative.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDocumentTypeColor(initiative.documentType)}`}>
                      {initiative.documentType}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{initiative.initiatingService}</span>
                    <span>•</span>
                    <span>{initiative.initiator}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(initiative.status)}`}>
                  {workflowStatusLabels[initiative.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projets actifs</h3>
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{project.governance.projectManager}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{project.monitoring.completionPercentage}% complété</span>
                    <span>Budget: {((project.budget.spent / project.budget.currentBudget) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProjectStatusColor(project.status)}`}>
                    {getProjectStatusLabel(project.status)}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {project.monitoring.healthStatus === 'green' ? '🟢' :
                     project.monitoring.healthStatus === 'orange' ? '🟡' : '🔴'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Validations Alert */}
      {pendingValidations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                Actions requises ({pendingValidations.length})
              </h3>
              <p className="text-amber-800 mb-4">
                Des documents sont en attente de validation dans le workflow.
              </p>
              <div className="space-y-2">
                {pendingValidations.slice(0, 3).map((initiative) => (
                  <div key={initiative.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentTypeColor(initiative.documentType)}`}>
                        {initiative.documentType}
                      </span>
                      <span className="font-medium text-gray-900">{initiative.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(initiative.status)}`}>
                        {workflowStatusLabels[initiative.status]}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
              {pendingValidations.length > 3 && (
                <p className="text-amber-700 text-sm mt-2">
                  Et {pendingValidations.length - 3} autres documents...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;