import React from 'react';
import { TrendingUp, Clock, AlertTriangle, DollarSign, FolderOpen, CheckSquare, Users, Target } from 'lucide-react';
import { mockDashboardStats, mockInitiatives, mockProjects } from '../data/mockData';

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

  const recentInitiatives = mockInitiatives.slice(0, 3);
  const activeProjects = mockProjects.filter(p => p.status === 'in_progress');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'committee_review': return 'bg-amber-100 text-amber-800';
      case 'pmo_review': return 'bg-blue-100 text-blue-800';
      case 'service_review': return 'bg-purple-100 text-purple-800';
      case 'validated': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'committee_review': return 'En attente comité';
      case 'pmo_review': return 'Relecture PMO';
      case 'service_review': return 'Révision service';
      case 'validated': return 'Validée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble de votre portefeuille de projets</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Initiatives totales"
          value={stats.totalInitiatives}
          icon={FolderOpen}
          color="bg-blue-600"
          trend="+12% ce mois"
        />
        <StatCard
          title="Révisions en attente"
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
          title="Mises à jour en retard"
          value={stats.overdueUpdates}
          icon={AlertTriangle}
          color="bg-red-600"
        />
      </div>

      {/* Budget and Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation du budget</h3>
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risques par criticité</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Critique</span>
              </div>
              <span className="font-semibold text-red-600">{stats.riskCount.critical}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Élevé</span>
              </div>
              <span className="font-semibold text-orange-600">{stats.riskCount.high}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Moyen</span>
              </div>
              <span className="font-semibold text-yellow-600">{stats.riskCount.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Faible</span>
              </div>
              <span className="font-semibold text-green-600">{stats.riskCount.low}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Initiatives récentes</h3>
          <div className="space-y-4">
            {recentInitiatives.map((initiative) => (
              <div key={initiative.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{initiative.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{initiative.assignedService}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(initiative.status)}`}>
                  {getStatusLabel(initiative.status)}
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
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Maj: {new Date(project.lastUpdated).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;