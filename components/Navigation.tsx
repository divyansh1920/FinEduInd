import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { BookOpen, Home, Calculator, Bot, Menu, X, TrendingUp, ShieldCheck, Gamepad2, ChevronRight } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: ViewState.HOME, label: 'Home', icon: Home },
    { id: ViewState.MODULE, label: 'Learn', icon: BookOpen },
    { id: ViewState.SIMULATOR, label: 'Trade', icon: Gamepad2 },
    { id: ViewState.TOOLS, label: 'Tools', icon: Calculator },
    { id: ViewState.AI_TUTOR, label: 'AI', icon: Bot },
  ];

  return (
    <>
      {/* Desktop Full Width Sticky Navigation */}
      <nav className={`hidden md:block sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm' 
          : 'bg-white border-b border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo Area */}
          <div 
            onClick={() => setView(ViewState.HOME)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-indigo-200">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-tight text-slate-900 leading-none">FinEdu</span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider leading-none">India</span>
            </div>
          </div>

          {/* Centered Nav Items */}
          <div className="flex items-center bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2
                  ${currentView === item.id 
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Area: Vault */}
          <button
            onClick={() => setView(ViewState.LEGACY_VAULT)}
            className="pl-4 pr-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2 border border-transparent hover:border-indigo-100"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Family Vault</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="flex justify-between items-center px-4 h-16">
          <div className="flex items-center gap-2" onClick={() => setView(ViewState.HOME)}>
             <div className="bg-indigo-600 p-1.5 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
             </div>
             <span className="font-display font-bold text-lg text-slate-900">FinEdu</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden pt-20 px-4 animate-fade-in">
           <div className="flex flex-col gap-2">
              {[...navItems, { id: ViewState.LEGACY_VAULT, label: 'Family Vault', icon: ShieldCheck }].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setView(item.id); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between p-4 rounded-xl border ${currentView === item.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-semibold text-lg">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 opacity-50" />
                </button>
              ))}
           </div>
        </div>
      )}
    </>
  );
};

export default Navigation;