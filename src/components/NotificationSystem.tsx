import React, { useState, useEffect } from 'react';
import { 
  Bell, Clock, AlertTriangle, CheckCircle, Users, Calendar, 
  Send, Filter, Search, Eye, Edit, X, Play, Pause,
  Mail, MessageSquare, Settings
} from 'lucide-react';
import { mockProjects } from '../data/mockData';
import { Project } from '../types';
import ProjectUpdateForm from './ProjectUpdateForm';

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  daysSinceLastUpdate: number;
  enabled: boolean;
  channels: ('email' | 'teams')[];
  maxNotificationsPerWeek: number;
}

interface ProjectNotification {
  id: string;
  projectId: string;
  projectManagerId: string;
  projectManager: string;
  type: 'update_reminder' | 'overdue' | 'urgent';
  message: string;
  createdAt: string;
  sentAt?: string;
  acknowledged?: boolean;
  daysSinceLastUpdate: number;
  nextNotificationDate?: string;
  notificationCount: number; // Nombre de notifications envoyées cette semaine
  priority: 'low' | 'medium' | 'high';
  emailSubject: string;
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<ProjectNotification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<ProjectNotification | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRulesConfig, setShowRulesConfig] = useState(false);
  
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: 'Rappel standard',
      description: 'Notification après 15 jours sans mise à jour',
      daysSinceLastUpdate: 15,
      enabled: true,
      channels: ['email'],
      maxNotificationsPerWeek: 1
    },
    {
      id: '2',
      name: 'Urgence',
      description: 'Notification urgente après 30 jours sans mise à jour',
      daysSinceLastUpdate: 30,
      enabled: true,
      channels: ['email', 'teams'],
      maxNotificationsPerWeek: 2
    }
  ]);

  // Génération d'exemples de notifications basés sur les projets réels
  useEffect(() => {
    const generateNotifications = () => {
      const now = new Date();
      const newNotifications: ProjectNotification[] = [];

      // Créer des notifications d'exemple pour chaque projet
      mockProjects.forEach(project => {
        // Simuler différents délais pour les exemples
        const daysSinceUpdate = project.id === '1' ? 18 : project.id === '2' ? 32 : 8;
        const lastUpdate = new Date(now.getTime() - daysSinceUpdate * 24 * 60 * 60 * 1000);
        
        // Vérifier les règles de notification
        const applicableRules = notificationRules
          .filter(rule => rule.enabled && daysSinceUpdate >= rule.daysSinceLastUpdate)
          .sort((a, b) => b.daysSinceLastUpdate - a.daysSinceLastUpdate);

        if (applicableRules.length > 0) {
          const rule = applicableRules[0];
          
          const weeklyCount = Math.min(daysSinceUpdate >= 30 ? 2 : 1, rule.maxNotificationsPerWeek);
          
          if (daysSinceUpdate >= rule.daysSinceLastUpdate) {
            const notificationType = daysSinceUpdate >= 30 ? 'urgent' : 
                                   daysSinceUpdate >= 20 ? 'overdue' : 'update_reminder';

            newNotifications.push({
              id: `${project.id}-${daysSinceUpdate}`,
              projectId: project.id,
              projectManagerId: 'pm-' + project.id,
              projectManager: project.governance.projectManager,
              type: notificationType,
              message: getNotificationMessage(project, daysSinceUpdate, notificationType),
              createdAt: now.toISOString(),
              daysSinceLastUpdate: daysSinceUpdate,
              notificationCount: weeklyCount,
              nextNotificationDate: new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString(),
              priority: notificationType === 'urgent' ? 'high' : notificationType === 'overdue' ? 'medium' : 'low',
              emailSubject: getEmailSubject(project, daysSinceUpdate, notificationType),
              sentAt: project.id === '1' ? new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() : undefined
            });
          }
        }
      });

      setNotifications(newNotifications);
    };

    generateNotifications();
  }, [notificationRules]);

  const getNotificationMessage = (project: Project, days: number, type: string) => {
    switch (type) {
      case 'urgent':
        return `URGENT: Le projet "${project.title}" n'a pas été mis à jour depuis ${days} jours. Une actualisation immédiate est requise pour maintenir le suivi du portefeuille. Merci de procéder à la mise à jour dans les plus brefs délais.`;
      case 'overdue':
        return `Le projet "${project.title}" n'a pas été mis à jour depuis ${days} jours. Merci de procéder à l'actualisation de votre projet (performance, avancement, risques, etc.).`;
      default:
        return `Rappel automatique: Le projet "${project.title}" nécessite une mise à jour de son statut (${days} jours depuis la dernière actualisation). Merci de renseigner l'avancement et les indicateurs de performance.`;
    }
  };

  const getEmailSubject = (project: Project, days: number, type: string) => {
    const prefix = type === 'urgent' ? '[URGENT]' : type === 'overdue' ? '[ACTION REQUISE]' : '[RAPPEL]';
    return `${prefix} Mise à jour requise - Projet: ${project.title}`;
  };
  const handleSendNotification = async (notification: ProjectNotification) => {
    // Simulation envoi notification (email + Teams)
    setNotifications(prev => prev.map(n => 
      n.id === notification.id 
        ? { ...n, sentAt: new Date().toISOString() }
        : n
    ));
    
    // Simulation d'envoi avec détails
    const project = getProjectById(notification.projectId);
    const channels = notificationRules.find(r => r.daysSinceLastUpdate <= notification.daysSinceLastUpdate)?.channels || ['email'];
    
    alert(
      `✅ Notification envoyée avec succès!\n\n` +
      `📧 Destinataire: ${notification.projectManager}\n` +
      `📋 Projet: ${project?.title}\n` +
      `📊 Canaux: ${channels.includes('email') ? 'Email' : ''} ${channels.includes('teams') ? 'Teams' : ''}\n` +
      `⚠️ Priorité: ${notification.priority === 'high' ? 'Élevée' : notification.priority === 'medium' ? 'Moyenne' : 'Normale'}\n` +
      `📅 Délai: ${notification.daysSinceLastUpdate} jours sans mise à jour`
    );
  };

  const handleAcknowledgeNotification = (notification: ProjectNotification) => {
    setNotifications(prev => prev.map(n => 
      n.id === notification.id 
        ? { ...n, acknowledged: true }
        : n
    ));
  };

  const handleOpenUpdateForm = (notification: ProjectNotification) => {
    const project = getProjectById(notification.projectId);
    if (project) {
      setSelectedProject(project);
      setShowUpdateForm(true);
    }
  };

  const getProjectById = (projectId: string): Project | null => {
    return mockProjects.find(p => p.id === projectId) || null;
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200 ring-2 ring-red-300';
      case 'overdue': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'update_reminder': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />;
      case 'overdue': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'update_reminder': return <Bell className="h-4 w-4 text-blue-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const project = getProjectById(notification.projectId);
    const matchesSearch = project?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.projectManager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'pending' && !notification.sentAt) ||
                         (statusFilter === 'sent' && notification.sentAt && !notification.acknowledged) ||
                         (statusFilter === 'acknowledged' && notification.acknowledged);
    return matchesSearch && matchesStatus;
  });

  // Configuration des règles
  const NotificationRulesConfig: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Configuration des règles de notification</h2>
            <button
              onClick={() => setShowRulesConfig(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {notificationRules.map((rule, index) => (
            <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                  <p className="text-sm text-gray-600">{rule.description}</p>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(e) => {
                      const newRules = [...notificationRules];
                      newRules[index].enabled = e.target.checked;
                      setNotificationRules(newRules);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Activé</span>
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Délai (jours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rule.daysSinceLastUpdate}
                    onChange={(e) => {
                      const newRules = [...notificationRules];
                      newRules[index].daysSinceLastUpdate = parseInt(e.target.value) || 1;
                      setNotificationRules(newRules);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max notifications/semaine
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={rule.maxNotificationsPerWeek}
                    onChange={(e) => {
                      const newRules = [...notificationRules];
                      newRules[index].maxNotificationsPerWeek = parseInt(e.target.value) || 1;
                      setNotificationRules(newRules);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Canaux
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={rule.channels.includes('email')}
                        onChange={(e) => {
                          const newRules = [...notificationRules];
                          if (e.target.checked) {
                            newRules[index].channels = [...new Set([...rule.channels, 'email'])];
                          } else {
                            newRules[index].channels = rule.channels.filter(c => c !== 'email');
                          }
                          setNotificationRules(newRules);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Mail className="h-4 w-4 ml-2 mr-1" />
                      <span>Email</span>
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={rule.channels.includes('teams')}
                        onChange={(e) => {
                          const newRules = [...notificationRules];
                          if (e.target.checked) {
                            newRules[index].channels = [...new Set([...rule.channels, 'teams'])];
                          } else {
                            newRules[index].channels = rule.channels.filter(c => c !== 'teams');
                          }
                          setNotificationRules(newRules);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <MessageSquare className="h-4 w-4 ml-2 mr-1" />
                      <span>Teams</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Système de Notifications Projets</h1>
          <p className="text-gray-600 mt-1">
            Gestion automatisée des rappels de mise à jour pour les responsables de projet
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowRulesConfig(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Configurer les règles</span>
          </button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => !n.sentAt).length}
              </div>
              <div className="text-sm text-gray-600">En attente d'envoi</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.sentAt && !n.acknowledged).length}
              </div>
              <div className="text-sm text-gray-600">Envoyées</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.type === 'urgent').length}
              </div>
              <div className="text-sm text-gray-600">Urgentes</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.acknowledged).length}
              </div>
              <div className="text-sm text-gray-600">Traitées</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un projet ou responsable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les notifications</option>
              <option value="pending">En attente d'envoi</option>
              <option value="sent">Envoyées</option>
              <option value="acknowledged">Traitées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Notifications ({filteredNotifications.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => {
            const project = getProjectById(notification.projectId);
            if (!project) return null;

            return (
              <div key={notification.id} className={`p-6 hover:bg-gray-50 transition-colors ${
                notification.type === 'urgent' ? 'bg-red-50 border-l-4 border-red-500' : 
                notification.type === 'overdue' ? 'bg-orange-50 border-l-4 border-orange-500' : ''
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getNotificationTypeIcon(notification.type)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getNotificationTypeColor(notification.type)}`}>
                        {notification.type === 'urgent' ? '🚨 URGENT' :
                         notification.type === 'overdue' ? 'En retard' : 'Rappel'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                        notification.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        Priorité {notification.priority === 'high' ? 'Élevée' : notification.priority === 'medium' ? 'Moyenne' : 'Normale'}
                      </span>
                      {notification.sentAt && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Envoyée</span>
                        </span>
                      )}
                      {notification.acknowledged && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
                        <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                        <div className="bg-gray-50 p-3 rounded-lg mb-2">
                          <p className="text-gray-700 text-sm">{notification.message}</p>
                        </div>
                        
                        {/* Détails de l'email */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-900 text-sm">Sujet de l'email:</span>
                          </div>
                          <p className="text-blue-800 text-sm font-medium">{notification.emailSubject}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{notification.projectManager}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Dernière maj: {new Date(project.lastUpdated).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{notification.daysSinceLastUpdate} jours</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="mb-2">
                          <div className="text-sm text-gray-600">Créé le</div>
                          <div className="font-medium text-gray-900">
                            {new Date(notification.createdAt).toLocaleDateString('fr-FR')} à {new Date(notification.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        
                        {notification.sentAt && (
                          <div className="mb-2">
                            <div className="text-sm text-gray-600">Envoyé le</div>
                            <div className="font-medium text-gray-900">
                              {new Date(notification.sentAt).toLocaleDateString('fr-FR')} à {new Date(notification.sentAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        )}
                        
                        <div className="bg-gray-100 rounded-lg p-2">
                          <div className="text-xs text-gray-600">Notifications cette semaine</div>
                          <div className="text-sm font-medium text-gray-900">
                            {notification.notificationCount} / {notificationRules.find(r => r.daysSinceLastUpdate <= notification.daysSinceLastUpdate)?.maxNotificationsPerWeek || 1}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.sentAt && (
                      <button
                        onClick={() => handleSendNotification(notification)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 shadow-sm"
                      >
                        <Send className="h-4 w-4" />
                        <span>Envoyer</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleOpenUpdateForm(notification)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 shadow-sm"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Actualiser</span>
                    </button>
                    
                    {notification.sentAt && !notification.acknowledged && (
                      <button
                        onClick={() => handleAcknowledgeNotification(notification)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2 shadow-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Marquer traité</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedNotification(notification)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Project Health Indicators */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {notification.type === 'urgent' && (
                    <div className="mb-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          Action immédiate requise - Projet en retard de mise à jour
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">État de santé</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg">
                          {project.monitoring.healthStatus === 'green' ? '🟢' :
                           project.monitoring.healthStatus === 'orange' ? '🟡' : '🔴'}
                        </span>
                        <span className="font-medium">
                          {project.monitoring.healthStatus === 'green' ? 'Vert' :
                           project.monitoring.healthStatus === 'orange' ? 'Orange' : 'Rouge'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Avancement</div>
                      <div className="mt-1">
                        <div className="font-medium text-gray-900">{project.monitoring.completionPercentage}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className={`h-1.5 rounded-full ${
                              project.monitoring.healthStatus === 'green' ? 'bg-green-500' :
                              project.monitoring.healthStatus === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${project.monitoring.completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Budget utilisé</div>
                      <div className="font-medium text-gray-900 mt-1">
                        {((project.budget.spent / project.budget.currentBudget) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Indicateurs supplémentaires pour les notifications urgentes */}
                  {notification.type === 'urgent' && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Prochaine échéance</div>
                          <div className="font-medium text-gray-900">
                            {new Date(project.nextUpdateDue).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Risques ouverts</div>
                          <div className="font-medium text-red-600">
                            {project.riskManagement.risks.filter(r => r.status === 'open').length} actif(s)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification trouvée</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'Aucune notification de mise à jour n\'est actuellement en attente.'
                : 'Aucune notification ne correspond aux filtres sélectionnés.'
              }
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Actualiser les notifications
            </button>
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          project={getProjectById(selectedNotification.projectId)}
          onClose={() => setSelectedNotification(null)}
          onOpenUpdateForm={() => {
            handleOpenUpdateForm(selectedNotification);
            setSelectedNotification(null);
          }}
        />
      )}

      {/* Rules Configuration Modal */}
      {showRulesConfig && <NotificationRulesConfig />}

      {/* Project Update Form Modal */}
      {showUpdateForm && selectedProject && (
        <ProjectUpdateForm
          project={selectedProject}
          onSave={(updatedProject) => {
            alert('✅ Projet mis à jour avec succès!\n\nLa notification a été automatiquement supprimée.');
            setShowUpdateForm(false);
            setSelectedProject(null);
            // Retirer la notification correspondante
            setNotifications(prev => prev.filter(n => n.projectId !== selectedProject.id));
          }}
          onCancel={() => {
            setShowUpdateForm(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );

  // Modal de détail d'une notification
  const NotificationDetailModal: React.FC<{
    notification: ProjectNotification;
    project: Project | null;
    onClose: () => void;
    onOpenUpdateForm: () => void;
  }> = ({ notification, project, onClose, onOpenUpdateForm }) => {
    if (!project) return null;

    const rule = notificationRules.find(r => r.daysSinceLastUpdate <= notification.daysSinceLastUpdate);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  {getNotificationTypeIcon(notification.type)}
                  <h2 className="text-xl font-bold text-gray-900">Détail de la notification</h2>
                </div>
                <p className="text-gray-600">{project.title}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Résumé de la notification */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">📬 Message de notification</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">Sujet:</div>
                  <div className="text-gray-900">{notification.emailSubject}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Message:</div>
                  <div className="text-gray-900 bg-white p-3 rounded border">{notification.message}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Destinataire:</div>
                    <div className="text-gray-900">{notification.projectManager}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Canaux:</div>
                    <div className="flex items-center space-x-2">
                      {rule?.channels.includes('email') && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </span>
                      )}
                      {rule?.channels.includes('teams') && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Teams
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* État actuel du projet */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">📊 État actuel du projet</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded border">
                  <div className="text-sm text-gray-600">Santé du projet</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xl">
                      {project.monitoring.healthStatus === 'green' ? '🟢' :
                       project.monitoring.healthStatus === 'orange' ? '🟡' : '🔴'}
                    </span>
                    <span className="font-medium">
                      {project.monitoring.healthStatus === 'green' ? 'Vert' :
                       project.monitoring.healthStatus === 'orange' ? 'Orange' : 'Rouge'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <div className="text-sm text-gray-600">Avancement</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {project.monitoring.completionPercentage}%
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <div className="text-sm text-gray-600">Budget utilisé</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {((project.budget.spent / project.budget.currentBudget) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {project.monitoring.blockers.length > 0 && (
                <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded">
                  <div className="text-sm font-medium text-red-800">🚫 Blocages actifs:</div>
                  <ul className="mt-1 text-sm text-red-700">
                    {project.monitoring.blockers.map((blocker, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{blocker}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
              <button
                onClick={onOpenUpdateForm}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Actualiser le projet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default NotificationSystem;