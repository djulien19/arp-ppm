import React, { useState } from 'react';
import { Users, Calendar, CheckCircle, Clock, XCircle, Eye, FileText, Filter, ArrowLeft, ChevronRight, ExternalLink, Download, MapPin, UserCheck } from 'lucide-react';
import { committeeNames, mockInitiatives, mockProjects } from '../data/mockData';
import { CommitteeType, Initiative, Project } from '../types';

interface CommitteeSession {
  id: string;
  committeeType: CommitteeType;
  date: string;
  time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  initiatives: Array<{
    id: string;
    title: string;
    status: 'pending' | 'approved' | 'rejected';
    recommendation?: string;
    projectId?: string;
  }>;
  attendees: string[];
  location: string;
  notes?: string;
  documents?: Array<{
    id: string;
    name: string;
    type: 'agenda' | 'presentation' | 'report' | 'minutes';
    url: string;
  }>;
}

const mockCommitteeSessions: CommitteeSession[] = [
  {
    id: '1',
    committeeType: 'comex_collectes',
    date: '2024-02-28',
    time: '14:00',
    status: 'scheduled',
    initiatives: [
      {
        id: '1',
        title: 'Optimisation des tournées de collecte',
        status: 'pending',
        recommendation: 'Recommandation favorable du PMO avec quelques ajustements budgétaires',
        projectId: '1'
      },
      {
        id: '3',
        title: 'Nouveau système de géolocalisation',
        status: 'pending'
      }
    ],
    attendees: ['Directeur Collectes', 'Chef PMO', 'Responsable Budget', 'Directeur Technique'],
    location: 'Salle de conférence A - Siège social',
    documents: [
      { id: '1', name: 'Ordre du jour - Session février 2024', type: 'agenda', url: '#' },
      { id: '2', name: 'Présentation optimisation tournées', type: 'presentation', url: '#' }
    ]
  },
  {
    id: '2',
    committeeType: 'codir',
    date: '2024-02-15',
    time: '09:30',
    status: 'completed',
    initiatives: [
      {
        id: '2',
        title: 'Digitalisation des processus RH',
        status: 'approved',
        recommendation: 'Validation avec budget alloué de 100,000€',
        projectId: '2'
      },
      {
        id: '4',
        title: 'Modernisation du parc véhicules',
        status: 'approved',
        recommendation: 'Projet approuvé pour passage en phase de réalisation'
      }
    ],
    attendees: ['Directeur Général', 'Directeur Technique', 'Directeur RH', 'Directeur Financier'],
    location: 'Salle du conseil d\'administration',
    notes: 'Session productive avec validation de 2 projets majeurs. Budget global approuvé pour 2024.',
    documents: [
      { id: '3', name: 'Procès-verbal - Session février 2024', type: 'minutes', url: '#' },
      { id: '4', name: 'Rapport budgétaire 2024', type: 'report', url: '#' }
    ]
  },
  {
    id: '3',
    committeeType: 'comex_proprete',
    date: '2024-03-05',
    time: '10:00',
    status: 'scheduled',
    initiatives: [
      {
        id: '5',
        title: 'Amélioration du tri sélectif',
        status: 'pending'
      }
    ],
    attendees: ['Directeur Propreté', 'Chef PMO', 'Responsable Qualité'],
    location: 'Salle de réunion B - Site Neder-Over-Heembeek'
  },
  {
    id: '4',
    committeeType: 'comex_commercial',
    date: '2024-03-12',
    time: '15:30',
    status: 'scheduled',
    initiatives: [],
    attendees: ['Directeur Commercial', 'Chef PMO', 'Responsable Marketing'],
    location: 'Salle de conférence C - Siège social'
  }
];

const CommitteeManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<'overview' | 'session'>('overview');
  const [selectedCommittee, setSelectedCommittee] = useState<CommitteeType | null>(null);
  const [selectedSession, setSelectedSession] = useState<CommitteeSession | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [initiativeStatusFilter, setInitiativeStatusFilter] = useState<string>('all');

  // Get current session for selected committee
  const getCurrentSession = (committeeType: CommitteeType): CommitteeSession | null => {
    const sessions = mockCommitteeSessions
      .filter(s => s.committeeType === committeeType)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sessions[0] || null;
  };

  // Get committee statistics
  const getCommitteeStats = (committeeType: CommitteeType) => {
    const sessions = mockCommitteeSessions.filter(s => s.committeeType === committeeType);
    const totalInitiatives = sessions.reduce((acc, session) => acc + session.initiatives.length, 0);
    const pendingInitiatives = sessions.reduce((acc, session) => 
      acc + session.initiatives.filter(i => i.status === 'pending').length, 0);
    const approvedInitiatives = sessions.reduce((acc, session) => 
      acc + session.initiatives.filter(i => i.status === 'approved').length, 0);
    
    return { totalInitiatives, pendingInitiatives, approvedInitiatives, totalSessions: sessions.length };
  };

  // Filter initiatives in session view
  const getFilteredInitiatives = (initiatives: CommitteeSession['initiatives']) => {
    return initiatives.filter(initiative => 
      initiativeStatusFilter === 'all' || initiative.status === initiativeStatusFilter
    );
  };

  // Get project details for an initiative
  const getProjectForInitiative = (projectId?: string): Project | null => {
    if (!projectId) return null;
    return mockProjects.find(p => p.id === projectId) || null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programmée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getInitiativeStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitiativeStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Rejetée';
      default: return status;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'agenda': return '📋';
      case 'presentation': return '📊';
      case 'report': return '📄';
      case 'minutes': return '📝';
      default: return '📎';
    }
  };

  const handleCommitteeClick = (committeeType: CommitteeType) => {
    setSelectedCommittee(committeeType);
    setCurrentView('session');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedCommittee(null);
    setSelectedSession(null);
  };

  // Overview of all committees
  const CommitteeOverview: React.FC = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Comités</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble des comités de validation</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Programmer une session</span>
        </button>
      </div>

      {/* Committee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(committeeNames).map(([type, name]) => {
          const stats = getCommitteeStats(type as CommitteeType);
          const currentSession = getCurrentSession(type as CommitteeType);
          
          return (
            <div
              key={type}
              onClick={() => handleCommitteeClick(type as CommitteeType)}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                {name}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sessions totales</span>
                  <span className="font-medium text-gray-900">{stats.totalSessions}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Initiatives traitées</span>
                  <span className="font-medium text-gray-900">{stats.totalInitiatives}</span>
                </div>
                
                {stats.pendingInitiatives > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">
                        {stats.pendingInitiatives} initiative(s) en attente
                      </span>
                    </div>
                  </div>
                )}
                
                {currentSession && (
                  <div className="border-t border-gray-200 pt-3">
                    <div className="text-xs text-gray-500 mb-1">Prochaine session</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(currentSession.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentSession.status)}`}>
                        {getStatusLabel(currentSession.status)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Sessions Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions récentes</h3>
        <div className="space-y-3">
          {mockCommitteeSessions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedCommittee(session.committeeType);
                  setCurrentView('session');
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {committeeNames[session.committeeType]}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString('fr-FR')} à {session.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {session.initiatives.length} initiative(s)
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                    {getStatusLabel(session.status)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Detailed session view
  const SessionDetailView: React.FC = () => {
    if (!selectedCommittee) return null;
    
    const currentSession = getCurrentSession(selectedCommittee);
    if (!currentSession) {
      return (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune session programmée</h3>
          <p className="text-gray-600">Aucune session n'est actuellement programmée pour ce comité.</p>
        </div>
      );
    }

    const filteredInitiatives = getFilteredInitiatives(currentSession.initiatives);

    return (
      <div className="space-y-6">
        {/* Header with breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToOverview}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <button
                  onClick={handleBackToOverview}
                  className="hover:text-blue-600 transition-colors"
                >
                  Comités
                </button>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium">
                  {committeeNames[selectedCommittee]}
                </span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">
                Session du {new Date(currentSession.date).toLocaleDateString('fr-FR')}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentSession.status)}`}>
              {getStatusLabel(currentSession.status)}
            </span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Exporter PV</span>
            </button>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Date et heure</div>
                <div className="font-medium text-gray-900">
                  {new Date(currentSession.date).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} à {currentSession.time}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Lieu</div>
                <div className="font-medium text-gray-900">{currentSession.location}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <UserCheck className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Participants</div>
                <div className="font-medium text-gray-900">{currentSession.attendees.length} personnes</div>
              </div>
            </div>
          </div>
          
          {currentSession.attendees.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Liste des participants</div>
              <div className="flex flex-wrap gap-2">
                {currentSession.attendees.map((attendee, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm"
                  >
                    {attendee}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Documents */}
        {currentSession.documents && currentSession.documents.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents associés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSession.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                    <div>
                      <div className="font-medium text-gray-900">{doc.name}</div>
                      <div className="text-sm text-gray-600 capitalize">{doc.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Initiatives Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Initiatives à l'ordre du jour ({filteredInitiatives.length})
            </h3>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={initiativeStatusFilter}
                onChange={(e) => setInitiativeStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvées</option>
                <option value="rejected">Rejetées</option>
              </select>
            </div>
          </div>
        </div>

        {/* Initiatives List */}
        <div className="space-y-4">
          {filteredInitiatives.map((initiative) => {
            const project = getProjectForInitiative(initiative.projectId);
            
            return (
              <div
                key={initiative.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{initiative.title}</h4>
                    {initiative.recommendation && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <div className="text-sm font-medium text-blue-900 mb-1">Recommandation PMO</div>
                        <p className="text-sm text-blue-800">{initiative.recommendation}</p>
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInitiativeStatusColor(initiative.status)}`}>
                    {getInitiativeStatusLabel(initiative.status)}
                  </span>
                </div>
                
                {project && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Projet associé</div>
                        <div className="font-medium text-gray-900">{project.title}</div>
                        <div className="text-sm text-gray-600">
                          Chef de projet: {project.governance.projectManager}
                        </div>
                      </div>
                      <button className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm">Voir le projet</span>
                      </button>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Budget</div>
                        <div className="font-medium text-gray-900">
                          {project.budget.currentBudget.toLocaleString('fr-FR')} €
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Avancement</div>
                        <div className="font-medium text-gray-900">
                          {project.monitoring.completionPercentage}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Statut</div>
                        <div className="font-medium text-gray-900">
                          {project.monitoring.healthStatus === 'green' ? '🟢 Vert' :
                           project.monitoring.healthStatus === 'orange' ? '🟡 Orange' : '🔴 Rouge'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredInitiatives.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune initiative trouvée</h3>
            <p className="text-gray-600">
              {initiativeStatusFilter === 'all' 
                ? 'Aucune initiative n\'est à l\'ordre du jour de cette session.'
                : `Aucune initiative avec le statut "${getInitiativeStatusLabel(initiativeStatusFilter)}" trouvée.`
              }
            </p>
          </div>
        )}

        {/* Session Notes */}
        {currentSession.notes && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes de session</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{currentSession.notes}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="transition-all duration-300 ease-in-out">
        {currentView === 'overview' ? <CommitteeOverview /> : <SessionDetailView />}
      </div>
    </div>
  );
};

export default CommitteeManagement;