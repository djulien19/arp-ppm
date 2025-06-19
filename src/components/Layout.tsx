import React from 'react';
import { Building2, BarChart3, FolderOpen, CheckSquare, Users, Settings, Bell, PieChart, Database } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'initiatives', label: 'FI / FP', icon: FolderOpen },
    { id: 'projects', label: 'Projets', icon: CheckSquare },
    { id: 'committees', label: 'Reporting Comités', icon: PieChart },
    { id: 'value-lists', label: 'Listes de valeurs', icon: Database },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-blue-900" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bruxelles-Propreté</h1>
                <p className="text-sm text-gray-600">Gestion de Portefeuille de Projets</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-900 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">MD</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Marie Dubois</div>
                  <div className="text-gray-600">Administrateur PMO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onViewChange(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        currentView === item.id
                          ? 'bg-blue-50 text-blue-900 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;