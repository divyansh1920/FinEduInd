import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import { 
  Target, TrendingUp, Home, Percent, Briefcase, 
  Landmark, Flame, Calculator, ChevronRight, 
  Menu, X, DollarSign, ShieldCheck, Umbrella, IndianRupee, ArrowUpRight,
  ShoppingBag, BarChart4
} from 'lucide-react';

type ToolCategory = 'WEALTH' | 'TAX & SALARY' | 'GOALS' | 'RETIREMENT' | 'LOANS' | 'UTILITY';
type ToolType = 'sip' | 'stepup' | 'lumpsum' | 'goal' | 'fire' | 'nps' | 'hra' | 'tax' | 'emi' | 'inflation' | 'ppf' | 'gst' | 'cagr';

const COLORS = {
  primary: '#4f46e5', // Indigo 600
  secondary: '#10b981', // Emerald 500
  accent: '#f43f5e', // Rose 500
  neutral: '#94a3b8', // Slate 400
  purple: '#8b5cf6', // Violet 500
  orange: '#f97316', // Orange 500
};

const Tools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('sip');

  // --- STATES ---

  // WEALTH: SIP, Lumpsum, Step-Up
  const [invAmount, setInvAmount] = useState(5000);
  const [invRate, setInvRate] = useState(12);
  const [invYears, setInvYears] = useState(10);
  const [stepUpRate, setStepUpRate] = useState(10); // For Step Up SIP
  const [wealthData, setWealthData] = useState<any[]>([]);
  const [wealthSummary, setWealthSummary] = useState({ invested: 0, gain: 0, total: 0 });

  // GOALS: Goal Planner
  const [goalTarget, setGoalTarget] = useState(5000000); // 50 Lakhs
  const [goalYears, setGoalYears] = useState(10);
  const [goalInflation, setGoalInflation] = useState(6);
  const [goalSipResult, setGoalSipResult] = useState({ monthlyNeed: 0, totalCost: 0 });

  // TAX: Regime (Old vs New)
  const [income, setIncome] = useState(1200000);
  const [deductions80C, setDeductions80C] = useState(150000);
  const [deductions80D, setDeductions80D] = useState(25000);
  const [hraExemption, setHraExemption] = useState(0);
  const [taxResult, setTaxResult] = useState({ oldTax: 0, newTax: 0, diff: 0, better: '' });

  // TAX: HRA Calculator
  const [basicSalary, setBasicSalary] = useState(500000); // Annual
  const [da, setDa] = useState(0);
  const [hraReceived, setHraReceived] = useState(200000);
  const [rentPaid, setRentPaid] = useState(180000);
  const [isMetro, setIsMetro] = useState(true);
  const [hraResult, setHraResult] = useState({ exempt: 0, taxable: 0 });

  // RETIREMENT: FIRE
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(50); // For FIRE or NPS
  const [monthlyExpense, setMonthlyExpense] = useState(40000);
  const [currentCorpus, setCurrentCorpus] = useState(500000);
  const [fireResult, setFireResult] = useState({ corpusNeeded: 0, yearsToFire: 0, fireAge: 0 });

  // RETIREMENT: NPS
  const [npsContribution, setNpsContribution] = useState(5000);
  const [npsReturn, setNpsReturn] = useState(10);
  const [npsAge, setNpsAge] = useState(25);
  const [npsRetireAge, setNpsRetireAge] = useState(60);
  const [npsResult, setNpsResult] = useState({ totalCorpus: 0, monthlyPension: 0, lumpSum: 0 });

  // LOANS: EMI
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [emiResult, setEmiResult] = useState({ emi: 0, interest: 0, total: 0 });

  // PLANNING: Inflation
  const [currentCost, setCurrentCost] = useState(100000); // e.g., College Fees today
  const [inflationRate, setInflationRate] = useState(7);
  const [inflationYears, setInflationYears] = useState(10);
  const [inflationResult, setInflationResult] = useState(0);

  // UTILITY: PPF
  const [ppfAmount, setPpfAmount] = useState(150000); // Yearly
  const [ppfResult, setPpfResult] = useState({ invested: 0, interest: 0, total: 0 });

  // UTILITY: GST
  const [gstAmount, setGstAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [gstType, setGstType] = useState<'ADD' | 'REMOVE'>('ADD');
  const [gstResult, setGstResult] = useState({ net: 0, gst: 0, gross: 0 });

  // UTILITY: CAGR
  const [cagrStart, setCagrStart] = useState(10000);
  const [cagrEnd, setCagrEnd] = useState(20000);
  const [cagrYears, setCagrYears] = useState(5);
  const [cagrResult, setCagrResult] = useState(0);

  // --- CALCULATIONS ---

  // Wealth Calculator (Unified for SIP, Lumpsum, Step-Up)
  useEffect(() => {
    let data = [];
    let totalInvested = 0;
    let currentVal = activeTool === 'lumpsum' ? invAmount : 0;
    
    // Step Up variables
    let currentMonthlyInv = invAmount;

    for (let yr = 1; yr <= invYears; yr++) {
      let yearInvested = 0;
      
      if (activeTool === 'lumpsum') {
        totalInvested = invAmount; // Fixed
        currentVal = invAmount * Math.pow(1 + invRate/100, yr);
      } else {
        // Monthly Loop for precision
        for (let m = 0; m < 12; m++) {
          currentVal = (currentVal + currentMonthlyInv) * (1 + (invRate/12/100));
          yearInvested += currentMonthlyInv;
        }
        totalInvested += yearInvested;
        
        // Apply Step Up for next year
        if (activeTool === 'stepup') {
          currentMonthlyInv = currentMonthlyInv * (1 + stepUpRate/100);
        }
      }
      
      data.push({
        year: `Y${yr}`,
        invested: Math.round(totalInvested),
        value: Math.round(currentVal),
        wealthGain: Math.round(currentVal - totalInvested)
      });
    }

    setWealthData(data);
    setWealthSummary({
      invested: Math.round(totalInvested),
      total: Math.round(currentVal),
      gain: Math.round(currentVal - totalInvested)
    });
  }, [invAmount, invRate, invYears, stepUpRate, activeTool]);

  // Goal Planner
  useEffect(() => {
    // FV = Target. Need PMT.
    // Adjust target for inflation first
    const adjustedTarget = goalTarget * Math.pow(1 + goalInflation/100, goalYears);
    const r = invRate / 12 / 100;
    const n = goalYears * 12;
    
    // PMT = (FV * r) / ((1 + r)^n - 1)
    const monthlyNeeded = (adjustedTarget * r) / (Math.pow(1 + r, n) - 1);
    
    setGoalSipResult({
        monthlyNeed: Math.round(monthlyNeeded),
        totalCost: Math.round(adjustedTarget)
    });
  }, [goalTarget, goalYears, invRate, goalInflation]);

  // Tax Estimator (FY 2025-26) - Fixed Logic
  useEffect(() => {
    // Calculate Old Regime Tax
    const taxableOld = Math.max(0, income - 50000 - deductions80C - deductions80D - hraExemption);
    let taxOld = 0;
    
    // Old Regime Slabs (0-2.5L Nil, 2.5-5L 5%, 5-10L 20%, >10L 30%)
    if (taxableOld > 1000000) {
      taxOld += (taxableOld - 1000000) * 0.30;
      taxOld += 500000 * 0.20; // 5L to 10L
      taxOld += 250000 * 0.05; // 2.5L to 5L
    } else if (taxableOld > 500000) {
      taxOld += (taxableOld - 500000) * 0.20;
      taxOld += 250000 * 0.05;
    } else if (taxableOld > 250000) {
      taxOld += (taxableOld - 250000) * 0.05;
    }
    
    // Rebate 87A Old (Limit 5L taxable income => 12500 max tax relief)
    if (taxableOld <= 500000) taxOld = 0;

    // Calculate New Regime Tax
    const taxableNew = Math.max(0, income - 75000); // Standard Deduction 75k
    let taxNew = 0;

    // New Regime Slabs (0-3L Nil, 3-7L 5%, 7-10L 10%, 10-12L 15%, 12-15L 20%, >15L 30%)
    if (taxableNew > 1500000) {
      taxNew += (taxableNew - 1500000) * 0.30;
      taxNew += 300000 * 0.20; // 12-15L
      taxNew += 200000 * 0.15; // 10-12L
      taxNew += 300000 * 0.10; // 7-10L
      taxNew += 400000 * 0.05; // 3-7L
    } else if (taxableNew > 1200000) {
      taxNew += (taxableNew - 1200000) * 0.20;
      taxNew += 200000 * 0.15;
      taxNew += 300000 * 0.10;
      taxNew += 400000 * 0.05;
    } else if (taxableNew > 1000000) {
      taxNew += (taxableNew - 1000000) * 0.15;
      taxNew += 300000 * 0.10;
      taxNew += 400000 * 0.05;
    } else if (taxableNew > 700000) {
      taxNew += (taxableNew - 700000) * 0.10;
      taxNew += 400000 * 0.05;
    } else if (taxableNew > 300000) {
      taxNew += (taxableNew - 300000) * 0.05;
    }

    // Rebate 87A New (Limit 7L taxable income => 25000 max tax relief)
    if (taxableNew <= 700000) taxNew = 0;

    // Cess 4%
    taxOld = Math.round(taxOld * 1.04);
    taxNew = Math.round(taxNew * 1.04);

    setTaxResult({
        oldTax: taxOld, newTax: taxNew,
        diff: Math.abs(taxOld - taxNew),
        better: taxNew < taxOld ? 'New Regime' : 'Old Regime'
    });
  }, [income, deductions80C, deductions80D, hraExemption]);

  // HRA Calculator
  useEffect(() => {
    const salary = basicSalary + da;
    const cond1 = hraReceived;
    const cond2 = isMetro ? salary * 0.5 : salary * 0.4;
    const cond3 = Math.max(0, rentPaid - (salary * 0.1));
    
    const exempt = Math.min(cond1, cond2, cond3);
    setHraResult({
        exempt: Math.round(exempt),
        taxable: Math.round(hraReceived - exempt)
    });
  }, [basicSalary, da, hraReceived, rentPaid, isMetro]);

  // NPS Calculator
  useEffect(() => {
    const years = npsRetireAge - npsAge;
    const r = npsReturn / 12 / 100;
    const n = years * 12;
    // FV of SIP
    const corpus = npsContribution * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    
    // 60% Withdrawal, 40% Annuity
    const lumpSum = corpus * 0.6;
    const annuityCorpus = corpus * 0.4;
    // Assuming 6% annuity rate
    const monthlyPension = (annuityCorpus * 0.06) / 12;

    setNpsResult({
        totalCorpus: Math.round(corpus),
        lumpSum: Math.round(lumpSum),
        monthlyPension: Math.round(monthlyPension)
    });
  }, [npsContribution, npsReturn, npsAge, npsRetireAge]);

  // EMI Logic
  useEffect(() => {
    const r = loanRate / 12 / 100;
    const n = loanTenure * 12;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    setEmiResult({
      emi: Math.round(emi),
      interest: Math.round(totalPayment - loanAmount),
      total: Math.round(totalPayment)
    });
  }, [loanAmount, loanRate, loanTenure]);

  // Inflation
  useEffect(() => {
    const futureVal = currentCost * Math.pow(1 + inflationRate/100, inflationYears);
    setInflationResult(Math.round(futureVal));
  }, [currentCost, inflationRate, inflationYears]);

  // PPF Calculator
  useEffect(() => {
    // PPF is compounded annually, tenure 15 years
    let balance = 0;
    const rate = 7.1 / 100;
    for(let i=0; i<15; i++) {
        balance = (balance + ppfAmount) * (1 + rate);
    }
    setPpfResult({
        invested: ppfAmount * 15,
        interest: Math.round(balance - (ppfAmount * 15)),
        total: Math.round(balance)
    });
  }, [ppfAmount]);

  // GST Calculator
  useEffect(() => {
    let gross = 0, net = 0, gst = 0;
    const rate = gstRate / 100;
    
    if (gstType === 'ADD') {
        net = gstAmount;
        gst = gstAmount * rate;
        gross = gstAmount + gst;
    } else {
        gross = gstAmount;
        net = gstAmount / (1 + rate);
        gst = gross - net;
    }
    
    setGstResult({
        net: Math.round(net),
        gst: Math.round(gst),
        gross: Math.round(gross)
    });
  }, [gstAmount, gstRate, gstType]);

  // CAGR Calculator
  useEffect(() => {
    if (cagrStart > 0 && cagrEnd > 0 && cagrYears > 0) {
        const cagr = (Math.pow(cagrEnd / cagrStart, 1 / cagrYears) - 1) * 100;
        setCagrResult(parseFloat(cagr.toFixed(2)));
    }
  }, [cagrStart, cagrEnd, cagrYears]);


  // --- HELPERS ---
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const menuItems: { id: ToolType; label: string; icon: any; category: ToolCategory }[] = [
    { id: 'sip', label: 'SIP Calculator', icon: TrendingUp, category: 'WEALTH' },
    { id: 'stepup', label: 'Step-Up SIP', icon: ArrowUpRight, category: 'WEALTH' },
    { id: 'lumpsum', label: 'Lumpsum Growth', icon: Briefcase, category: 'WEALTH' },
    { id: 'goal', label: 'Goal Planner', icon: Target, category: 'GOALS' },
    { id: 'inflation', label: 'Lifestyle Inflation', icon: Percent, category: 'GOALS' },
    { id: 'hra', label: 'HRA Exemption', icon: Home, category: 'TAX & SALARY' },
    { id: 'tax', label: 'Tax Regime (Old/New)', icon: Landmark, category: 'TAX & SALARY' },
    { id: 'fire', label: 'FIRE Planner', icon: Flame, category: 'RETIREMENT' },
    { id: 'nps', label: 'NPS Calculator', icon: ShieldCheck, category: 'RETIREMENT' },
    { id: 'ppf', label: 'PPF Calculator', icon: ShieldCheck, category: 'RETIREMENT' },
    { id: 'emi', label: 'Loan EMI', icon: DollarSign, category: 'LOANS' },
    { id: 'gst', label: 'GST Calculator', icon: ShoppingBag, category: 'UTILITY' },
    { id: 'cagr', label: 'CAGR Calculator', icon: BarChart4, category: 'UTILITY' },
  ];

  const categories: ToolCategory[] = ['WEALTH', 'GOALS', 'TAX & SALARY', 'RETIREMENT', 'LOANS', 'UTILITY'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full md:w-64 flex-shrink-0">
           <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm sticky top-24 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-2 mb-6 px-2">
                 <div className="bg-indigo-600 p-2 rounded-lg">
                    <Calculator className="h-5 w-5 text-white" />
                 </div>
                 <h3 className="font-bold text-lg text-slate-900 font-[Poppins]">Toolkit</h3>
              </div>
              
              <div className="space-y-6">
                 {categories.map(cat => (
                     <div key={cat}>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 px-2">{cat}</p>
                        <div className="space-y-1">
                            {menuItems.filter(i => i.category === cat).map(item => (
                                <button 
                                    key={item.id} 
                                    onClick={() => setActiveTool(item.id)} 
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${activeTool === item.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`h-4 w-4 ${activeTool === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} /> 
                                        {item.label}
                                    </div>
                                    {activeTool === item.id && <ChevronRight className="h-3 w-3 text-white/70" />}
                                </button>
                            ))}
                        </div>
                     </div>
                 ))}
              </div>
           </div>
        </div>

        {/* MAIN TOOL AREA */}
        <div className="flex-grow">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[600px]">
                
                {/* 1. WEALTH TOOLS (SIP, STEP-UP, LUMPSUM) */}
                {['sip', 'stepup', 'lumpsum'].includes(activeTool) && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                        <div className="lg:col-span-4 bg-slate-50 p-8 border-r border-slate-200 overflow-y-auto">
                             <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><TrendingUp className="h-6 w-6" /></div>
                                <h2 className="text-2xl font-bold font-[Poppins] text-slate-900">{menuItems.find(i => i.id === activeTool)?.label}</h2>
                             </div>
                             <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                                {activeTool === 'stepup' ? 'See how increasing your investment annually creates massive wealth.' : 
                                 activeTool === 'lumpsum' ? 'Calculate returns on a one-time investment.' : 
                                 'The magic of compounding with regular monthly savings.'}
                             </p>
                             
                             <div className="space-y-8">
                                <RangeInput 
                                    label={activeTool === 'lumpsum' ? "Total Investment" : "Monthly Investment"} 
                                    value={invAmount} onChange={setInvAmount} 
                                    min={500} max={100000} step={500} prefix="₹" 
                                />
                                {activeTool === 'stepup' && (
                                   <RangeInput 
                                      label="Annual Step-Up" 
                                      value={stepUpRate} onChange={setStepUpRate} 
                                      min={1} max={50} suffix="%" 
                                   />
                                )}
                                <RangeInput 
                                    label="Exp. Return (CAGR)" 
                                    value={invRate} onChange={setInvRate} 
                                    min={5} max={30} step={0.5} suffix="%" 
                                />
                                <RangeInput 
                                    label="Time Period" 
                                    value={invYears} onChange={setInvYears} 
                                    min={1} max={40} suffix=" Years" 
                                />
                             </div>
                        </div>
                        <div className="lg:col-span-8 p-8 flex flex-col">
                             <div className="grid grid-cols-3 gap-4 mb-8">
                                 <StatBox label="Invested" value={formatCurrency(wealthSummary.invested)} />
                                 <StatBox label="Wealth Gained" value={formatCurrency(wealthSummary.gain)} color="text-emerald-600" />
                                 <StatBox label="Total Value" value={formatCurrency(wealthSummary.total)} color="text-indigo-600" large />
                             </div>
                             <div className="flex-grow min-h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={wealthData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                        <YAxis tickFormatter={(val) => `₹${val/1000}k`} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                        <RechartsTooltip 
                                            contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                            formatter={(val: number) => formatCurrency(val)}
                                        />
                                        <Area type="monotone" dataKey="value" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} name="Total Value" />
                                        <Area type="monotone" dataKey="invested" stroke={COLORS.neutral} fillOpacity={0} strokeDasharray="5 5" strokeWidth={2} name="Invested Amount" />
                                    </AreaChart>
                                </ResponsiveContainer>
                             </div>
                        </div>
                    </div>
                )}

                {/* 2. GOAL PLANNER */}
                {activeTool === 'goal' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                        <div className="lg:col-span-5 bg-slate-50 p-8 border-r border-slate-200">
                             <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><Target className="h-6 w-6" /></div>
                                <h2 className="text-2xl font-bold font-[Poppins] text-slate-900">Goal Planner</h2>
                             </div>
                             <p className="text-sm text-slate-500 mb-8">Planning for a Car, House, or Education? Find out how much to save.</p>
                             
                             <div className="space-y-8">
                                <RangeInput 
                                    label="Target Goal Amount (Today's Cost)" 
                                    value={goalTarget} onChange={setGoalTarget} 
                                    min={100000} max={50000000} step={100000} prefix="₹" 
                                />
                                <RangeInput 
                                    label="Years to Goal" 
                                    value={goalYears} onChange={setGoalYears} 
                                    min={1} max={30} suffix=" Years" 
                                />
                                <RangeInput 
                                    label="Exp. Return (SIP)" 
                                    value={invRate} onChange={setInvRate} 
                                    min={5} max={25} suffix="%" 
                                />
                                <RangeInput 
                                    label="Inflation Rate" 
                                    value={goalInflation} onChange={setGoalInflation} 
                                    min={0} max={12} suffix="%" 
                                />
                             </div>
                        </div>
                        <div className="lg:col-span-7 p-8 flex flex-col justify-center items-center">
                             <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg text-center max-w-sm w-full relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Required Monthly SIP</p>
                                 <h2 className="text-5xl font-bold text-indigo-600 font-[Poppins] mb-2">{formatCurrency(goalSipResult.monthlyNeed)}</h2>
                                 <p className="text-slate-500 text-sm">to reach your goal.</p>
                                 
                                 <div className="mt-8 pt-8 border-t border-slate-100">
                                     <div className="flex justify-between text-sm mb-2">
                                         <span className="text-slate-500">Target (Inflation Adj.)</span>
                                         <span className="font-bold text-slate-900">{formatCurrency(goalSipResult.totalCost)}</span>
                                     </div>
                                     <div className="flex justify-between text-sm">
                                         <span className="text-slate-500">Inflation Impact</span>
                                         <span className="font-bold text-rose-500">+{formatCurrency(goalSipResult.totalCost - goalTarget)}</span>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                )}

                {/* 3. TAX & HRA */}
                {(activeTool === 'hra' || activeTool === 'tax') && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                        <div className="lg:col-span-5 bg-slate-50 p-8 border-r border-slate-200">
                             <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Landmark className="h-6 w-6" /></div>
                                <h2 className="text-2xl font-bold font-[Poppins] text-slate-900">{activeTool === 'hra' ? 'HRA Calculator' : 'Tax Estimator'}</h2>
                             </div>
                             
                             {activeTool === 'hra' ? (
                                 <div className="space-y-6 mt-6">
                                    <RangeInput label="Basic Salary (Annual)" value={basicSalary} onChange={setBasicSalary} min={100000} max={5000000} step={10000} prefix="₹" />
                                    <RangeInput label="DA (Annual)" value={da} onChange={setDa} min={0} max={1000000} step={5000} prefix="₹" />
                                    <RangeInput label="HRA Received" value={hraReceived} onChange={setHraReceived} min={10000} max={2000000} step={5000} prefix="₹" />
                                    <RangeInput label="Rent Paid (Annual)" value={rentPaid} onChange={setRentPaid} min={0} max={2000000} step={5000} prefix="₹" />
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                        <span className="text-sm font-bold text-slate-700">Live in Metro?</span>
                                        <button 
                                            onClick={() => setIsMetro(!isMetro)} 
                                            className={`relative w-12 h-6 rounded-full transition-colors ${isMetro ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                        >
                                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isMetro ? 'translate-x-6' : ''}`}></span>
                                        </button>
                                    </div>
                                 </div>
                             ) : (
                                 <div className="space-y-6 mt-6">
                                    <RangeInput label="Gross Income" value={income} onChange={setIncome} min={500000} max={5000000} step={50000} prefix="₹" />
                                    <div className="pt-4 border-t border-slate-200 space-y-4">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Old Regime Deductions</p>
                                        <RangeInput label="80C (PPF, ELSS)" value={deductions80C} onChange={setDeductions80C} min={0} max={150000} step={5000} prefix="₹" />
                                        <RangeInput label="80D (Health)" value={deductions80D} onChange={setDeductions80D} min={0} max={100000} step={5000} prefix="₹" />
                                        <RangeInput label="HRA Exemption" value={hraExemption} onChange={setHraExemption} min={0} max={500000} step={10000} prefix="₹" />
                                    </div>
                                 </div>
                             )}
                        </div>
                        <div className="lg:col-span-7 p-8 flex flex-col justify-center">
                             {activeTool === 'hra' ? (
                                 <div className="grid grid-cols-2 gap-6">
                                     <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                         <p className="text-emerald-700 font-bold uppercase text-xs">Exempt HRA</p>
                                         <p className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(hraResult.exempt)}</p>
                                         <p className="text-xs text-slate-500 mt-1">Tax Free</p>
                                     </div>
                                     <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                                         <p className="text-rose-700 font-bold uppercase text-xs">Taxable HRA</p>
                                         <p className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(hraResult.taxable)}</p>
                                         <p className="text-xs text-slate-500 mt-1">Added to Income</p>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="space-y-6">
                                     <div className="flex gap-6">
                                         <div className={`flex-1 p-6 rounded-2xl border-2 ${taxResult.better === 'New Regime' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white'}`}>
                                             <p className="text-xs font-bold text-slate-500">NEW REGIME TAX</p>
                                             <p className="text-2xl font-bold text-slate-900">{formatCurrency(taxResult.newTax)}</p>
                                         </div>
                                         <div className={`flex-1 p-6 rounded-2xl border-2 ${taxResult.better === 'Old Regime' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white'}`}>
                                             <p className="text-xs font-bold text-slate-500">OLD REGIME TAX</p>
                                             <p className="text-2xl font-bold text-slate-900">{formatCurrency(taxResult.oldTax)}</p>
                                         </div>
                                     </div>
                                     <div className="bg-slate-900 text-white p-6 rounded-2xl">
                                         <p className="text-lg">Recommendation: <span className="font-bold text-emerald-400">{taxResult.better}</span></p>
                                         <p className="text-sm text-slate-400 mt-1">You save {formatCurrency(taxResult.diff)} by choosing this regime.</p>
                                     </div>
                                 </div>
                             )}
                        </div>
                    </div>
                )}

                {/* 4. NPS & PPF CALCULATOR */}
                {(activeTool === 'nps' || activeTool === 'ppf') && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                        <div className="lg:col-span-4 bg-slate-50 p-8 border-r border-slate-200">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><ShieldCheck className="h-6 w-6" /></div>
                                <h2 className="text-2xl font-bold font-[Poppins] text-slate-900">{activeTool === 'nps' ? 'NPS Calculator' : 'PPF Calculator'}</h2>
                            </div>
                            
                            {activeTool === 'nps' ? (
                                <div className="space-y-8 mt-6">
                                    <RangeInput label="Monthly Contribution" value={npsContribution} onChange={setNpsContribution} min={500} max={200000} step={500} prefix="₹" />
                                    <RangeInput label="Current Age" value={npsAge} onChange={setNpsAge} min={18} max={50} suffix=" Years" />
                                    <RangeInput label="Retirement Age" value={npsRetireAge} onChange={setNpsRetireAge} min={npsAge + 1} max={75} suffix=" Years" />
                                    <RangeInput label="Expected Return" value={npsReturn} onChange={setNpsReturn} min={5} max={15} suffix="%" />
                                </div>
                            ) : (
                                <div className="space-y-8 mt-6">
                                    <p className="text-sm text-slate-500 mb-4">Public Provident Fund is a government backed, tax-free investment with 15 years lock-in.</p>
                                    <RangeInput label="Yearly Investment" value={ppfAmount} onChange={setPpfAmount} min={500} max={150000} step={500} prefix="₹" />
                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                        <p className="text-xs text-indigo-700 font-bold uppercase">Current Interest Rate</p>
                                        <p className="text-xl font-bold text-indigo-900">7.1% (Tax Free)</p>
                                    </div>
                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                        <p className="text-xs text-amber-700 font-bold uppercase">Lock-in Period</p>
                                        <p className="text-xl font-bold text-amber-900">15 Years</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-8 p-8 flex flex-col justify-center">
                            {activeTool === 'nps' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <StatBox label="Total Corpus" value={formatCurrency(npsResult.totalCorpus)} large />
                                        <StatBox label="Lumpsum (Tax Free)" value={formatCurrency(npsResult.lumpSum)} color="text-emerald-600" />
                                    </div>
                                    <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-center justify-between">
                                        <div>
                                            <p className="text-indigo-900 font-bold text-lg">Monthly Pension</p>
                                            <p className="text-indigo-600/70 text-sm">Annuity from remaining 40%</p>
                                        </div>
                                        <p className="text-3xl font-bold text-indigo-600">{formatCurrency(npsResult.monthlyPension)}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <StatBox label="Invested Amount" value={formatCurrency(ppfResult.invested)} />
                                        </div>
                                        <div className="flex-1">
                                            <StatBox label="Interest Earned" value={formatCurrency(ppfResult.interest)} color="text-emerald-600" />
                                        </div>
                                    </div>
                                    <div className="bg-slate-900 text-white p-8 rounded-3xl text-center">
                                        <p className="text-slate-400 font-bold uppercase text-sm mb-2">Maturity Value (15 Years)</p>
                                        <p className="text-5xl font-bold font-[Poppins]">{formatCurrency(ppfResult.total)}</p>
                                        <p className="mt-4 text-sm text-slate-400 bg-white/10 inline-block px-4 py-1 rounded-full">Fully Tax Free under Section 80C</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 5. EMI CALCULATOR */}
                {activeTool === 'emi' && (
                   <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                     <div className="lg:col-span-4 bg-slate-50 p-8 border-r border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-violet-100 rounded-lg text-violet-600"><DollarSign className="h-6 w-6" /></div>
                            <h2 className="text-2xl font-bold font-[Poppins] text-slate-900">EMI Planner</h2>
                        </div>
                        <div className="space-y-8">
                           <RangeInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} min={100000} max={10000000} step={100000} prefix="₹" />
                           <RangeInput label="Interest Rate" value={loanRate} onChange={setLoanRate} min={6} max={15} step={0.1} suffix="%" />
                           <RangeInput label="Loan Tenure" value={loanTenure} onChange={setLoanTenure} min={1} max={30} suffix=" Years" />
                        </div>
                     </div>
                     <div className="lg:col-span-8 p-8 flex flex-col justify-center">
                         <div className="flex flex-col md:flex-row items-center gap-12">
                             <div className="relative w-64 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={[{ name: 'Principal', value: loanAmount }, { name: 'Interest', value: emiResult.interest }]} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                                            <Cell fill={COLORS.primary} />
                                            <Cell fill={COLORS.accent} />
                                        </Pie>
                                        <RechartsTooltip formatter={(val:number) => formatCurrency(val)} />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-400 font-bold uppercase">Monthly EMI</p>
                                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(emiResult.emi)}</p>
                                    </div>
                                </div>
                             </div>
                             
                             <div className="space-y-4 flex-1 w-full">
                                <StatBox label="Principal Amount" value={formatCurrency(loanAmount)} />
                                <StatBox label="Total Interest Payable" value={formatCurrency(emiResult.interest)} color="text-rose-600" />
                                <StatBox label="Total Payment" value={formatCurrency(emiResult.total)} large />
                             </div>
                         </div>
                     </div>
                   </div>
                )}

                {/* 6. UTILITY TOOLS (GST & CAGR) */}
                {(activeTool === 'gst' || activeTool === 'cagr') && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                        <div className="lg:col-span-5 bg-slate-50 p-8 border-r border-slate-200">
                             <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                                    {activeTool === 'gst' ? <ShoppingBag className="h-6 w-6" /> : <BarChart4 className="h-6 w-6" />}
                                </div>
                                <h2 className="text-2xl font-bold font-[Poppins] text-slate-900">{activeTool === 'gst' ? 'GST Calculator' : 'CAGR Calculator'}</h2>
                             </div>
                             
                             {activeTool === 'gst' ? (
                                <div className="space-y-6">
                                    <div className="flex bg-white rounded-xl p-1 border border-slate-200">
                                        <button onClick={() => setGstType('ADD')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${gstType === 'ADD' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Add GST</button>
                                        <button onClick={() => setGstType('REMOVE')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${gstType === 'REMOVE' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Remove GST</button>
                                    </div>
                                    <RangeInput label="Amount" value={gstAmount} onChange={setGstAmount} min={100} max={1000000} step={100} prefix="₹" />
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-3">GST Rate</label>
                                        <div className="flex gap-2">
                                            {[5, 12, 18, 28].map(rate => (
                                                <button key={rate} onClick={() => setGstRate(rate)} className={`flex-1 py-2 rounded-lg font-bold border transition-all ${gstRate === rate ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-white border-slate-200 text-slate-600 hover:border-pink-300'}`}>
                                                    {rate}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                             ) : (
                                <div className="space-y-6">
                                    <RangeInput label="Initial Value" value={cagrStart} onChange={setCagrStart} min={1000} max={10000000} step={1000} prefix="₹" />
                                    <RangeInput label="Final Value" value={cagrEnd} onChange={setCagrEnd} min={1000} max={100000000} step={1000} prefix="₹" />
                                    <RangeInput label="Duration" value={cagrYears} onChange={setCagrYears} min={1} max={50} suffix=" Years" />
                                </div>
                             )}
                        </div>
                        <div className="lg:col-span-7 p-8 flex flex-col justify-center">
                             {activeTool === 'gst' ? (
                                <div className="space-y-4">
                                    <StatBox label="Net Amount" value={formatCurrency(gstResult.net)} />
                                    <StatBox label={`GST Amount (${gstRate}%)`} value={formatCurrency(gstResult.gst)} color="text-pink-600" />
                                    <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center">
                                        <span className="text-slate-400 font-bold uppercase text-sm">Total Gross</span>
                                        <span className="text-3xl font-bold font-[Poppins]">{formatCurrency(gstResult.gross)}</span>
                                    </div>
                                </div>
                             ) : (
                                <div className="text-center">
                                    <p className="text-slate-500 mb-4 text-lg">Your investment grew at an annual rate of</p>
                                    <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-10 rounded-full shadow-2xl shadow-indigo-200">
                                        <p className="text-5xl font-bold font-[Poppins]">{cagrResult}%</p>
                                        <p className="text-xs font-bold uppercase opacity-80 mt-1">CAGR</p>
                                    </div>
                                    <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 max-w-sm mx-auto">
                                        Absolute Return: <span className="font-bold text-emerald-600">{((cagrEnd - cagrStart)/cagrStart * 100).toFixed(2)}%</span>
                                    </div>
                                </div>
                             )}
                        </div>
                    </div>
                )}

                {/* 7. INFLATION / FIRE */}
                {activeTool === 'inflation' && (
                     <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                        <div className="lg:col-span-5 bg-slate-50 p-8 border-r border-slate-200">
                             <h2 className="text-2xl font-bold font-[Poppins] text-slate-900 mb-6">Inflation Calculator</h2>
                             <div className="space-y-8">
                                <RangeInput label="Current Cost" value={currentCost} onChange={setCurrentCost} min={1000} max={10000000} step={1000} prefix="₹" />
                                <RangeInput label="Inflation Rate" value={inflationRate} onChange={setInflationRate} min={2} max={15} suffix="%" />
                                <RangeInput label="Time Period" value={inflationYears} onChange={setInflationYears} min={1} max={50} suffix=" Years" />
                             </div>
                        </div>
                        <div className="lg:col-span-7 p-8 flex flex-col justify-center items-center">
                             <div className="text-center">
                                 <p className="text-slate-500 mb-2">In {inflationYears} years, this will cost:</p>
                                 <p className="text-6xl font-bold text-rose-600 font-[Poppins]">{formatCurrency(inflationResult)}</p>
                                 <p className="text-xs bg-rose-50 text-rose-800 px-3 py-1 rounded-full inline-block mt-4">
                                     Value eroded by {Math.round((1 - currentCost/inflationResult)*100)}%
                                 </p>
                             </div>
                        </div>
                     </div>
                )}

                {activeTool === 'fire' && (
                     <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                        <div className="lg:col-span-5 bg-slate-50 p-8 border-r border-slate-200">
                             <h2 className="text-2xl font-bold font-[Poppins] text-slate-900 mb-6">FIRE Planner</h2>
                             <div className="space-y-8">
                                <RangeInput label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={60} suffix=" Yrs" />
                                <RangeInput label="Monthly Expense" value={monthlyExpense} onChange={setMonthlyExpense} min={10000} max={500000} prefix="₹" />
                                <RangeInput label="Current Savings" value={currentCorpus} onChange={setCurrentCorpus} min={0} max={50000000} step={100000} prefix="₹" />
                             </div>
                        </div>
                        <div className="lg:col-span-7 p-8 flex flex-col justify-center items-center">
                             <p className="text-xs font-bold uppercase text-slate-400 mb-4">Your Financial Independence Number</p>
                             <h2 className="text-6xl font-bold text-slate-900 mb-8">{formatCurrency(monthlyExpense * 12 * 25)}</h2>
                             <div className="bg-slate-100 p-4 rounded-xl text-sm text-slate-600 max-w-sm text-center">
                                Based on the <strong>Rule of 25</strong>, you need 25 times your annual expense to retire safely.
                             </div>
                        </div>
                     </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const RangeInput = ({ label, value, onChange, min, max, step = 1, prefix = '', suffix = '' }: any) => (
  <div>
    <div className="flex justify-between mb-3">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <div className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-slate-700 font-mono font-bold text-sm shadow-sm">
        {prefix}{value.toLocaleString('en-IN')}{suffix}
      </div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
    />
  </div>
);

const StatBox = ({ label, value, color = "text-slate-900", large = false }: any) => (
    <div className={`bg-slate-50 border border-slate-100 rounded-2xl p-4 ${large ? 'bg-indigo-50 border-indigo-100' : ''}`}>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className={`${large ? 'text-3xl' : 'text-xl'} font-bold ${color} mt-1`}>{value}</p>
    </div>
);

export default Tools;