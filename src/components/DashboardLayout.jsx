import { useState } from 'react'
import Sidebar from './Sidebar'
import KnapsackSolver from './KnapsackSolver'
import History from './History'
import Profile from './Profile'

function DashboardLayout({ user, onLogout }) {
  const [activeView, setActiveView] = useState('solver')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderContent = () => {
    switch (activeView) {
      case 'solver':
        return <KnapsackSolver />
      case 'history':
        return <History />
      case 'profile':
        return <Profile user={user} />
      default:
        return <KnapsackSolver />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        user={user}
        onLogout={onLogout}
        onCollapseChange={setSidebarCollapsed}
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {activeView === 'solver' && 'Knapsack Problem Solver'}
                  {activeView === 'history' && 'Problem History'}
                  {activeView === 'profile' && 'User Profile'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {activeView === 'solver' && 'Solve knapsack problems with step-by-step visualization'}
                  {activeView === 'history' && 'View and manage your saved problems'}
                  {activeView === 'profile' && 'Manage your account information'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

