import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { 
  ArrowRight, Zap, Calculator, Bot, BookOpen, 
  TrendingUp, TrendingDown, ShieldCheck, 
  Gamepad2, CheckCircle2, BarChart3, PieChart, ChevronRight,
  Newspaper, Clock, ExternalLink, Globe, Megaphone, Lock, Sparkles
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie as RePie, Cell } from 'recharts';

interface DashboardProps {
  setView: (view: ViewState) => void;
}

// Data
const CHART_DATA_GREEN = [{v:32100},{v:32150},{v:32120},{v:32200},{v:32180},{v:32250},{v:32420}];
const CHART_DATA_RED = [{v:61500},{v:61400},{v:61450},{v:61300},{v:61350},{v:61200},{v:61150}];
const SIM_DATA = [
  { name: 'M', val: 400 }, { name: 'T', val: 300 }, { name: 'W', val: 550 },
  { name: 'T', val: 450 }, { name: 'F', val: 600 }, { name: 'S', val: 700 }
];

const LIVE_NEWS = [
  { 
    id: 1, 
    title: "RBI launches 'e-Rupee 2.0' with offline UPI integration for rural payments across India.", 
    source: "RBI Press Release", 
    time: "12m ago", 
    tag: "Digital Currency", 
    url: "https://www.google.com/search?q=RBI+e-rupee+offline+UPI",
    impact: 'positive' 
  },
  { 
    id: 2, 
    title: "Tata Electronics begins 3nm chip export from Dholera Semiconductor Plant, stock rallies 5%.", 
    source: "Tech & Auto", 
    time: "45m ago", 
    tag: "Make In India", 
    url: "https://www.google.com/search?q=Tata+Electronics+semiconductor+export",
    impact: 'positive' 
  },
  { 
    id: 3, 
    title: "Nifty 50 breaches 34,500 mark as FII inflows hit record ₹45,000 Cr in Jan 2026.", 
    source: "Market Wrap", 
    time: "2h ago", 
    tag: "Market", 
    url: "https://www.google.com/search?q=Nifty+50+all+time+high+2026",
    impact: 'positive' 
  },
  { 
    id: 4, 
    title: "SEBI mandates 'AI-Risk Disclosure' for all algorithmic trading platforms starting April 1.", 
    source: "Regulatory", 
    time: "3h ago", 
    tag: "SEBI", 
    url: "https://www.google.com/search?q=SEBI+AI+risk+disclosure+norms",
    impact: 'neutral' 
  },
];

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const [indices, setIndices] = useState({
    nifty: { price: 34520.50, change: 0.85 },
    sensex: { price: 112140.20, change: 0.92 },
    bankNifty: { price: 68400.10, change: -0.21 }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => ({
        nifty: { price: prev.nifty.price + (Math.random() - 0.45) * 15, change: prev.nifty.change + (Math.random() - 0.5) * 0.05 },
        sensex: { price: prev.sensex.price + (Math.random() - 0.45) * 40, change: prev.sensex.change + (Math.random() - 0.5) * 0.05 },
        bankNifty: { price: prev.bankNifty.price + (Math.random() - 0.45) * 25, change: prev.bankNifty.change + (Math.random() - 0.5) * 0.05 }
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in min-h-screen pb-20">
      
      {/* Background Elements */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>
      
      {/* --- HERO SECTION --- */}
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-left space-y-8">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Live Learning Platform</span>
               </div>

               <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-[1.05] tracking-tight">
                  Master the <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Indian Markets.</span>
               </h1>
               
               <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
                  The complete ecosystem to learn Nifty technicals, practice with ₹10L virtual cash, and plan your financial freedom.
               </p>

               <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setView(ViewState.MODULE)}
                    className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:-translate-y-1 flex items-center gap-2"
                  >
                    Start Learning <ArrowRight className="h-4 w-4 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => setView(ViewState.SIMULATOR)}
                    className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-2"
                  >
                    <Gamepad2 className="h-4 w-4" /> Simulator
                  </button>
               </div>

               <div className="flex items-center gap-6 pt-4 border-t border-slate-200/60">
                  <div className="flex -space-x-2">
                     {[1,2,3].map(i => <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-slate-50"></div>)}
                  </div>
                  <div className="text-sm font-medium text-slate-500">
                     Trusted by <span className="text-slate-900 font-bold">10,000+</span> Students
                  </div>
               </div>
            </div>

            {/* Right Content: Market Widgets */}
            <div className="relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 rounded-full blur-[80px] -z-10"></div>
               
               <div className="grid gap-4 max-w-md mx-auto">
                  <MarketCard title="NIFTY 50" value={indices.nifty.price} change={indices.nifty.change} data={CHART_DATA_GREEN} />
                  <MarketCard title="BANK NIFTY" value={indices.bankNifty.price} change={indices.bankNifty.change} data={CHART_DATA_RED} />
                  
                  {/* Feature Teaser Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 mt-4 flex items-center justify-between">
                      <div>
                         <p className="text-xs font-bold text-slate-400 uppercase">Your Portfolio</p>
                         <p className="text-xl font-bold text-slate-900 mt-1">₹ 10,00,000</p>
                         <p className="text-xs text-emerald-600 font-bold mt-1">+0.00% Today</p>
                      </div>
                      <button onClick={() => setView(ViewState.SIMULATOR)} className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors">
                         <ChevronRight className="h-5 w-5" />
                      </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* --- LIVE NEWS SECTION --- */}
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
         <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg shadow-slate-100/50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
               <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                     <Newspaper className="h-5 w-5 text-indigo-600"/> Live Market News (2026)
                  </h3>
               </div>
               <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  <Globe className="h-3 w-3" />
                  Source: NSE / BSE / RBI
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {LIVE_NEWS.map((news) => (
                  <a 
                    key={news.id} 
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col justify-between h-full hover:bg-slate-50 p-4 -mx-3 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm"
                  >
                     <div>
                        <div className="flex items-center justify-between mb-3">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              news.tag === 'Digital Currency' ? 'bg-purple-100 text-purple-700' :
                              news.tag === 'Make In India' ? 'bg-emerald-100 text-emerald-700' :
                              news.tag === 'SEBI' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                           }`}>
                              {news.tag}
                           </span>
                           <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {news.time}
                           </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors mb-2">
                           {news.title}
                        </h4>
                     </div>
                     <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 border-dashed">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{news.source}</span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                           Read Full Story <ExternalLink className="h-3 w-3" />
                        </div>
                     </div>
                  </a>
               ))}
            </div>
         </div>
      </div>

      {/* --- BENTO GRID (THE ECOSYSTEM) --- */}
      <div className="relative z-10 py-16 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
               <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">The Ecosystem</h2>
                  <p className="text-slate-500 mt-2 text-lg">Your all-in-one toolkit for financial mastery.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
               
               {/* 1. LEARNING HUB (Large Square) */}
               <div 
                  onClick={() => setView(ViewState.MODULE)}
                  className="md:col-span-2 md:row-span-2 bg-slate-900 border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden group cursor-pointer shadow-2xl shadow-slate-200"
               >
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] group-hover:bg-indigo-500/30 transition-colors"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                     <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur border border-white/10 rounded-full text-white text-xs font-bold uppercase tracking-wider mb-6">
                            <Sparkles className="h-3 w-3 text-amber-400" /> Start Here
                        </div>
                        <h3 className="text-4xl font-display font-bold text-white mb-4">University of Finance</h3>
                        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                           A structured curriculum designed for Indians. Master <span className="text-white font-bold">Equity, F&O, Mutual Funds, and Taxation</span> through interactive modules.
                        </p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="text-2xl font-bold text-indigo-400 mb-1">7+</div>
                            <div className="text-xs text-slate-400 font-bold uppercase">Modules</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="text-2xl font-bold text-emerald-400 mb-1">Free</div>
                            <div className="text-xs text-slate-400 font-bold uppercase">Access</div>
                        </div>
                     </div>

                     <button className="mt-8 w-fit bg-white text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors">
                        Start Learning <ArrowRight className="h-4 w-4" />
                     </button>
                  </div>
               </div>

               {/* 2. MARKET SIMULATOR (Top Right) */}
               <div 
                  onClick={() => setView(ViewState.SIMULATOR)}
                  className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-6 relative overflow-hidden group cursor-pointer hover:border-indigo-300 transition-colors"
               >
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                          <Gamepad2 className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded">LIVE DEMO</div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Market Simulator</h3>
                  <p className="text-sm text-slate-500 mb-4">Trade with ₹10,00,000 virtual cash.</p>
                  
                  {/* Decorative Mini Chart */}
                  <div className="h-20 w-full opacity-50">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={SIM_DATA}>
                           <Bar dataKey="val" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* 3. AI TUTOR (Middle Right) */}
               <div 
                  onClick={() => setView(ViewState.AI_TUTOR)}
                  className="bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white rounded-[2rem] p-6 relative overflow-hidden group cursor-pointer shadow-lg shadow-violet-200"
               >
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                          <div className="p-3 bg-white/20 backdrop-blur rounded-xl border border-white/10">
                              <Bot className="h-6 w-6 text-white" />
                          </div>
                      </div>
                      <div>
                          <h3 className="text-xl font-bold mb-1">AI Tutor</h3>
                          <p className="text-violet-100 text-sm">24/7 doubts solver. Ask anything about finance.</p>
                      </div>
                      <div className="mt-4 bg-white/10 rounded-lg p-2 text-xs text-white/80 border border-white/10 truncate">
                          "Explain Call Options..."
                      </div>
                  </div>
               </div>

               {/* 4. FINANCIAL TOOLS (Bottom Left - Wide) */}
               <div 
                  onClick={() => setView(ViewState.TOOLS)}
                  className="md:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-6 flex items-center justify-between group cursor-pointer hover:shadow-xl hover:border-indigo-200 transition-all"
               >
                  <div className="flex items-center gap-6">
                      <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                          <Calculator className="h-8 w-8 text-emerald-600" />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-900">Financial Calculators</h3>
                          <p className="text-slate-500 mt-1">SIP, EMI, Goal Planner & Inflation tools.</p>
                          <div className="flex gap-2 mt-3">
                              <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">Wealth</span>
                              <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">Loans</span>
                              <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">Planning</span>
                          </div>
                      </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ChevronRight className="h-5 w-5" />
                  </div>
               </div>

               {/* 5. FAMILY VAULT (Bottom Right) */}
               <div 
                  onClick={() => setView(ViewState.LEGACY_VAULT)}
                  className="bg-white border border-slate-200 rounded-[2rem] p-6 relative overflow-hidden group cursor-pointer hover:shadow-xl hover:border-indigo-200 transition-all"
               >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="p-3 bg-slate-50 w-fit rounded-xl border border-slate-100">
                          <Lock className="h-6 w-6 text-slate-700" />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-900">Secure Vault</h3>
                          <p className="text-sm text-slate-500">Store asset details & reminders.</p>
                      </div>
                  </div>
               </div>

            </div>
         </div>
      </div>

    </div>
  );
};

// Component: Market Card (Widget Style)
const MarketCard = ({ title, value, change, data }: any) => {
   const isPositive = change >= 0;
   const color = isPositive ? '#10b981' : '#f43f5e'; // Emerald-500 vs Rose-500
   
   return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4">
         <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</h4>
            <div className="text-xl font-bold text-slate-900 mt-1 font-display">
               {value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <div className={`text-xs font-bold mt-1 flex items-center ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
               {isPositive ? <TrendingUp className="h-3 w-3 mr-1"/> : <TrendingDown className="h-3 w-3 mr-1"/>}
               {Math.abs(change).toFixed(2)}%
            </div>
         </div>
         <div className="h-12 w-24">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data}>
                  <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fillOpacity={0.1} fill={color} isAnimationActive={false} />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>
   );
};

export default Dashboard;