import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ModuleView from './components/ModuleView';
import Tools from './components/Tools';
import AITutor from './components/AITutor';
import MarketTicker from './components/MarketTicker';
import Dashboard from './components/Dashboard';
import LegacyVault from './components/LegacyVault';
import MarketSimulator from './components/MarketSimulator'; 
import { ViewState } from './types';
import { TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);

  const renderContent = () => {
    switch (view) {
      case ViewState.MODULE:
        return <ModuleView onBack={() => setView(ViewState.HOME)} />;
      case ViewState.TOOLS:
        return <Tools />;
      case ViewState.AI_TUTOR:
        return <AITutor />;
      case ViewState.LEGACY_VAULT:
        return <LegacyVault />;
      case ViewState.SIMULATOR:
        return <MarketSimulator />;
      case ViewState.HOME:
      default:
        return <Dashboard setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <MarketTicker />
      <Navigation currentView={view} setView={setView} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
             <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg text-slate-800 font-[Poppins]">FinEdu India</span>
             </div>
             <p className="text-slate-500 text-sm max-w-xs">Democratizing financial knowledge for every Indian.</p>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
             <a href="#" className="hover:text-indigo-600 transition-colors">Modules</a>
             <a href="#" className="hover:text-indigo-600 transition-colors">Calculators</a>
             <a href="#" className="hover:text-indigo-600 transition-colors">Disclaimer</a>
          </div>
          <p className="text-slate-400 text-xs">© 2026 FinEdu India. Not financial advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;