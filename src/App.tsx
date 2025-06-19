import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InitiativesList from './components/InitiativesList';
import ProjectsList from './components/ProjectsList';
import CommitteeReporting from './components/CommitteeReporting';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'initiatives':
        return <InitiativesList />;
      case 'projects':
        return <ProjectsList />;
      case 'committees':
        return <CommitteeReporting />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Paramètres</h2>
            <p className="text-gray-600">Configuration et paramètres de l'application</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;