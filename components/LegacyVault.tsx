import React, { useState, useEffect } from 'react';
import { Asset, AssetType, Reminder, ReminderCategory } from '../types';
import { 
  ShieldCheck, Lock, User, LogIn, 
  LayoutGrid, CalendarClock, Plus, Trash2, 
  LogOut, Wallet, Bell, CheckCircle2, AlertCircle, 
  TrendingUp, Home, Landmark, Zap, Shield, X, CheckSquare, Square, HeartPulse, Receipt, KeyRound, ArrowLeft
} from 'lucide-react';

// --- Types for Auth ---
interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

interface VaultData {
  assets: Asset[];
  reminders: Reminder[];
}

const LegacyVault: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD'>('LOGIN');
  
  // Forgot Password State
  const [forgotStep, setForgotStep] = useState<1 | 2>(1); // 1: Input ID, 2: Input OTP & New Pass
  const [forgotForm, setForgotForm] = useState({ identifier: '', otp: '', newPassword: '', confirmPassword: '' });
  const [generatedOtp, setGeneratedOtp] = useState<string>('');

  // Vault Data State
  const [activeTab, setActiveTab] = useState<'ASSETS' | 'REMINDERS'>('ASSETS');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Form States
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  
  // New Asset Form
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    type: 'Bank Account', institutionName: '', accountNumber: '', nomineeName: '', notes: ''
  });

  // New Reminder Form
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '', date: '', amount: 0, category: 'Insurance', recurring: 'Yearly'
  });

  const [notification, setNotification] = useState<{msg: string, type: 'error'|'success'} | null>(null);

  // --- Auth Logic ---

  const showNotify = (msg: string, type: 'error'|'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSignup = () => {
    if (!signupForm.name || !signupForm.email || !signupForm.mobile || !signupForm.password) {
      showNotify("All fields are required", 'error');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      showNotify("Passwords do not match", 'error');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('fin_users') || '[]');
    if (existingUsers.find((u: UserProfile) => u.email === signupForm.email || u.mobile === signupForm.mobile)) {
      showNotify("User already exists with this Email or Mobile", 'error');
      return;
    }

    const newUser: UserProfile = {
      name: signupForm.name,
      email: signupForm.email,
      mobile: signupForm.mobile,
      password: signupForm.password
    };

    localStorage.setItem('fin_users', JSON.stringify([...existingUsers, newUser]));
    showNotify("Account created successfully! Please login.", 'success');
    setAuthMode('LOGIN');
  };

  const handleLogin = () => {
    const existingUsers = JSON.parse(localStorage.getItem('fin_users') || '[]');
    const foundUser = existingUsers.find((u: UserProfile) => 
      (u.email === loginForm.identifier || u.mobile === loginForm.identifier) && u.password === loginForm.password
    );

    if (foundUser) {
      setUser(foundUser);
      loadVaultData(foundUser.email);
    } else {
      showNotify("Invalid Credentials", 'error');
    }
  };

  const handleSendOtp = () => {
    if (!forgotForm.identifier) {
      showNotify("Please enter Email or Mobile", 'error');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('fin_users') || '[]');
    const foundUser = existingUsers.find((u: UserProfile) => 
      u.email === forgotForm.identifier || u.mobile === forgotForm.identifier
    );

    if (!foundUser) {
      showNotify("User not found", 'error');
      return;
    }

    // Generate random 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    
    // Simulate SMS/Email
    showNotify(`OTP Sent: ${otp}`, 'success'); 
    setForgotStep(2);
  };

  const handleResetPassword = () => {
    if (forgotForm.otp !== generatedOtp) {
      showNotify("Invalid OTP", 'error');
      return;
    }
    if (forgotForm.newPassword.length < 4) {
      showNotify("Password must be at least 4 characters", 'error');
      return;
    }
    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      showNotify("Passwords do not match", 'error');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('fin_users') || '[]');
    const updatedUsers = existingUsers.map((u: UserProfile) => {
      if (u.email === forgotForm.identifier || u.mobile === forgotForm.identifier) {
        return { ...u, password: forgotForm.newPassword };
      }
      return u;
    });

    localStorage.setItem('fin_users', JSON.stringify(updatedUsers));
    showNotify("Password Reset Successfully! Please Login.", 'success');
    setAuthMode('LOGIN');
    setForgotForm({ identifier: '', otp: '', newPassword: '', confirmPassword: '' });
    setForgotStep(1);
  };

  const handleLogout = () => {
    setUser(null);
    setAssets([]);
    setReminders([]);
    setLoginForm({ identifier: '', password: '' });
  };

  // --- Data Persistence ---

  const loadVaultData = (userEmail: string) => {
    const dataStr = localStorage.getItem(`vault_data_${userEmail}`);
    if (dataStr) {
      const data: VaultData = JSON.parse(dataStr);
      setAssets(data.assets || []);
      setReminders(data.reminders || []);
    } else {
      // Initialize empty for new user
      setAssets([]);
      setReminders([]);
    }
  };

  const saveData = () => {
    if (!user) return;
    const data: VaultData = { assets, reminders };
    localStorage.setItem(`vault_data_${user.email}`, JSON.stringify(data));
  };

  useEffect(() => {
    if (user) saveData();
  }, [assets, reminders]);

  // --- Asset Logic ---

  const handleAddAsset = () => {
    if (!newAsset.institutionName || !newAsset.accountNumber) return;
    const asset: Asset = {
      id: Date.now().toString(),
      type: newAsset.type as AssetType,
      institutionName: newAsset.institutionName!,
      accountNumber: newAsset.accountNumber!,
      nomineeName: newAsset.nomineeName || 'Not Assigned',
      notes: newAsset.notes
    };
    setAssets([...assets, asset]);
    setShowAssetForm(false);
    setNewAsset({ type: 'Bank Account', institutionName: '', accountNumber: '', nomineeName: '', notes: '' });
  };

  // --- Reminder Logic ---

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.date) return;
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title!,
      date: newReminder.date!,
      amount: newReminder.amount || 0,
      category: newReminder.category as ReminderCategory,
      recurring: newReminder.recurring as any || 'Yearly',
      completed: false
    };
    setReminders([...reminders, reminder].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setShowReminderForm(false);
    setNewReminder({ title: '', date: '', amount: 0, category: 'Insurance', recurring: 'Yearly' });
  };

  const toggleReminderStatus = (id: string) => {
    const updated = reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
    setReminders(updated);
  };

  const handleSuggestion = (template: Partial<Reminder>) => {
    setNewReminder({
        title: template.title || '',
        date: template.date || new Date().toISOString().split('T')[0],
        amount: template.amount || 0,
        category: template.category || 'Other',
        recurring: template.recurring || 'Yearly',
        completed: false
    });
    setShowReminderForm(true);
  };

  // Helper: Get Icon for Reminders
  const getReminderIcon = (cat: ReminderCategory) => {
    switch(cat) {
      case 'Insurance': return <Shield className="h-5 w-5 text-emerald-600" />;
      case 'SIP/Investment': return <TrendingUp className="h-5 w-5 text-indigo-600" />;
      case 'Tax': return <Landmark className="h-5 w-5 text-orange-600" />;
      case 'EMI': return <Home className="h-5 w-5 text-blue-600" />;
      case 'Bill': return <Zap className="h-5 w-5 text-yellow-600" />;
      default: return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  const getDaysRemaining = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(dateStr);
    target.setHours(0,0,0,0);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };


  // --- Render Auth Screen ---
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4 animate-fade-in bg-slate-50">
        <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
          
          {/* Left Side: Brand & Info */}
          <div className="md:w-5/12 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
             </div>
             
             <div className="relative z-10">
               <ShieldCheck className="h-12 w-12 text-indigo-400 mb-6" />
               <h2 className="text-3xl font-bold font-[Poppins] mb-4">Family Legacy Vault</h2>
               <p className="text-slate-400 leading-relaxed">
                 A secure, encrypted space for your family's financial future. Store asset details and critical payment reminders in one private place.
               </p>
             </div>
             
             <div className="relative z-10 mt-12 space-y-4">
               <div className="flex items-center gap-3 text-sm text-slate-300">
                 <div className="p-2 bg-white/10 rounded-lg"><Lock className="h-4 w-4" /></div>
                 <span>Local Device Encryption</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-300">
                 <div className="p-2 bg-white/10 rounded-lg"><User className="h-4 w-4" /></div>
                 <span>Personalized Access</span>
               </div>
             </div>
          </div>

          {/* Right Side: Forms */}
          <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
             <div className="max-w-sm mx-auto w-full">
                
                {authMode !== 'FORGOT_PASSWORD' && (
                  <div className="flex gap-6 mb-8 border-b border-slate-100">
                     <button 
                       onClick={() => { setAuthMode('LOGIN'); setNotification(null); }}
                       className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors ${authMode === 'LOGIN' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
                     >
                       Login
                     </button>
                     <button 
                       onClick={() => { setAuthMode('SIGNUP'); setNotification(null); }}
                       className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors ${authMode === 'SIGNUP' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
                     >
                       Sign Up
                     </button>
                  </div>
                )}

                {authMode === 'LOGIN' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email or Mobile</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-300" />
                        <input 
                          type="text" 
                          placeholder="Enter your registered ID"
                          value={loginForm.identifier}
                          onChange={(e) => setLoginForm({...loginForm, identifier: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase">Password</label>
                        <button 
                          onClick={() => { setAuthMode('FORGOT_PASSWORD'); setForgotStep(1); setNotification(null); }}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-300" />
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleLogin}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 mt-4"
                    >
                      Access Vault
                    </button>
                  </div>
                )}

                {authMode === 'SIGNUP' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile</label>
                        <input 
                          type="text" 
                          placeholder="9876543210"
                          value={signupForm.mobile}
                          onChange={(e) => setSignupForm({...signupForm, mobile: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                        <input 
                          type="email" 
                          placeholder="you@mail.com"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                      <input 
                        type="password" 
                        placeholder="Create a strong password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm Password</label>
                      <input 
                        type="password" 
                        placeholder="Repeat password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <button 
                      onClick={handleSignup}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 mt-4"
                    >
                      Create Secure Account
                    </button>
                  </div>
                )}

                {authMode === 'FORGOT_PASSWORD' && (
                  <div className="space-y-4 animate-fade-in">
                    <button 
                      onClick={() => setAuthMode('LOGIN')}
                      className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-bold mb-4"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back to Login
                    </button>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h3>
                    
                    {forgotStep === 1 ? (
                      <div className="space-y-4">
                        <p className="text-slate-500 text-sm mb-4">Enter your registered Email or Mobile number to receive an OTP.</p>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email or Mobile</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-slate-300" />
                            <input 
                              type="text" 
                              placeholder="Enter your ID"
                              value={forgotForm.identifier}
                              onChange={(e) => setForgotForm({...forgotForm, identifier: e.target.value})}
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={handleSendOtp}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                        >
                          Send OTP
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-fade-in">
                        <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-center gap-2">
                           <KeyRound className="h-4 w-4"/> OTP Sent to {forgotForm.identifier}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Enter OTP</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 1234"
                            maxLength={4}
                            value={forgotForm.otp}
                            onChange={(e) => setForgotForm({...forgotForm, otp: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-center font-mono text-lg tracking-widest"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Password</label>
                          <input 
                            type="password" 
                            placeholder="New strong password"
                            value={forgotForm.newPassword}
                            onChange={(e) => setForgotForm({...forgotForm, newPassword: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm Password</label>
                          <input 
                            type="password" 
                            placeholder="Repeat new password"
                            value={forgotForm.confirmPassword}
                            onChange={(e) => setForgotForm({...forgotForm, confirmPassword: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <button 
                          onClick={handleResetPassword}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                        >
                          Reset Password
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {notification && (
                  <div className={`mt-6 p-3 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 ${notification.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {notification.type === 'error' ? <AlertCircle className="h-4 w-4"/> : <CheckCircle2 className="h-4 w-4"/>}
                    {notification.msg}
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  }
  
  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  const renderReminderItem = (reminder: Reminder) => {
    const daysLeft = getDaysRemaining(reminder.date);
    let statusColor = "bg-slate-100 text-slate-600";
    
    if (daysLeft < 0) statusColor = "bg-red-100 text-red-700";
    else if (daysLeft <= 7) statusColor = "bg-amber-100 text-amber-700";
    else if (daysLeft <= 30) statusColor = "bg-blue-50 text-blue-700";

    const isCompleted = reminder.completed;

    return (
      <div key={reminder.id} className={`p-4 rounded-xl border shadow-sm flex items-center justify-between transition-all ${isCompleted ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-200'}`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => toggleReminderStatus(reminder.id)}
              className={`flex-shrink-0 transition-colors ${isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
            >
                {isCompleted ? <CheckSquare className="h-6 w-6" /> : <Square className="h-6 w-6" />}
            </button>
            
            <div className={`p-3 rounded-xl bg-opacity-20 ${isCompleted ? 'bg-slate-100 grayscale' : statusColor.split(' ')[0]}`}>
                {getReminderIcon(reminder.category)}
            </div>
            
            <div className={isCompleted ? 'line-through text-slate-400' : ''}>
                <h4 className={`font-bold ${isCompleted ? 'text-slate-500' : 'text-slate-800'}`}>{reminder.title}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="font-medium">{new Date(reminder.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>₹{reminder.amount.toLocaleString('en-IN')}</span>
                  <span>•</span>
                  <span>{reminder.recurring}</span>
                </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isCompleted && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor}`}>
                  {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Today' : `${daysLeft} Days`}
              </span>
            )}
            <button 
              onClick={() => {
                  const newReminders = reminders.filter(r => r.id !== reminder.id);
                  setReminders(newReminders);
              }}
              className="text-slate-300 hover:text-red-500 transition-colors"
            >
                <Trash2 className="h-4 w-4" />
            </button>
          </div>
      </div>
    );
  };

  // --- Render Vault (Authenticated) ---
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
             <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-[Poppins]">Welcome, {user.name}</h1>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <ShieldCheck className="h-3 w-3 text-emerald-500" /> Vault Unlocked
            </p>
          </div>
        </div>
        <button 
           onClick={handleLogout}
           className="text-slate-400 hover:text-red-500 text-sm font-semibold flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-8 max-w-md">
        <button
          onClick={() => setActiveTab('ASSETS')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'ASSETS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Wallet className="h-4 w-4" /> My Assets
        </button>
        <button
          onClick={() => setActiveTab('REMINDERS')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'REMINDERS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <CalendarClock className="h-4 w-4" /> Smart Calendar
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'ASSETS' && (
        <div className="animate-fade-in">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Asset Registry</h2>
              <button 
                 onClick={() => setShowAssetForm(true)}
                 className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Asset
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                   <LayoutGrid className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                   <p className="text-slate-500 font-medium">No assets recorded yet.</p>
                </div>
              ) : (
                assets.map(asset => (
                  <div key={asset.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
                     <button onClick={() => {
                        const newAssets = assets.filter(a => a.id !== asset.id);
                        setAssets(newAssets);
                     }} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                     </button>
                     <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md mb-3">{asset.type}</span>
                     <h3 className="font-bold text-slate-900 text-lg mb-1">{asset.institutionName}</h3>
                     <p className="text-slate-500 font-mono text-sm mb-4">**** {asset.accountNumber.slice(-4)}</p>
                     <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                        <div>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">Nominee</p>
                           <p className="text-sm font-medium text-slate-700">{asset.nomineeName}</p>
                        </div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      )}

      {activeTab === 'REMINDERS' && (
        <div className="animate-fade-in">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Financial Reminders</h2>
                <p className="text-xs text-slate-500">Track premiums, taxes, and EMI dates.</p>
              </div>
              <button 
                onClick={() => {
                    setNewReminder({ title: '', date: '', amount: 0, category: 'Insurance', recurring: 'Yearly' });
                    setShowReminderForm(true);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                <Plus className="h-4 w-4" /> Custom Reminder
              </button>
           </div>

           {/* Suggestions */}
           <div className="mb-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Add Suggestions (Editable)</p>
              <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleSuggestion({title: 'Life Insurance (LIC)', category: 'Insurance', recurring: 'Yearly'})} 
                    className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100 hover:bg-emerald-100 transition-colors flex items-center gap-2">
                    <Shield className="h-3 w-3" /> LIC/Term Plan
                  </button>
                  <button onClick={() => handleSuggestion({title: 'Health Insurance Renewal', category: 'Insurance', recurring: 'Yearly'})} 
                    className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-2">
                    <HeartPulse className="h-3 w-3" /> Mediclaim
                  </button>
                  <button onClick={() => handleSuggestion({title: 'Monthly SIP', category: 'SIP/Investment', recurring: 'Monthly'})} 
                    className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" /> SIP Investment
                  </button>
                  <button onClick={() => handleSuggestion({title: 'NPS Contribution', category: 'Tax', recurring: 'Yearly', amount: 50000})} 
                    className="px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold border border-orange-100 hover:bg-orange-100 transition-colors flex items-center gap-2">
                    <Landmark className="h-3 w-3" /> NPS (Tax Saving)
                  </button>
                  <button onClick={() => handleSuggestion({title: 'Credit Card Bill', category: 'Bill', recurring: 'Monthly'})} 
                    className="px-3 py-2 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold border border-rose-100 hover:bg-rose-100 transition-colors flex items-center gap-2">
                    <Receipt className="h-3 w-3" /> Credit Card Bill
                  </button>
              </div>
           </div>

           <div className="space-y-6">
              {reminders.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                   <Bell className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                   <p className="text-slate-500 font-medium">No reminders set.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                     {activeReminders.map(renderReminderItem)}
                  </div>
                  
                  {completedReminders.length > 0 && (
                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Completed</h3>
                        <div className="space-y-3">
                          {completedReminders.map(renderReminderItem)}
                        </div>
                    </div>
                  )}
                </>
              )}
           </div>
        </div>
      )}

      {/* Asset Form Modal */}
      {showAssetForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg">Add New Asset</h3>
                 <button onClick={() => setShowAssetForm(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
              </div>
              <div className="space-y-4">
                 <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({...newAsset, type: e.target.value as AssetType})}
                 >
                    <option>Bank Account</option>
                    <option>Insurance Policy</option>
                    <option>Mutual Fund Folio</option>
                    <option>Stock Broker (Demat)</option>
                    <option>Real Estate</option>
                    <option>PF/PPF Account</option>
                 </select>
                 <input 
                    type="text" placeholder="Institution Name (e.g. HDFC)"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newAsset.institutionName}
                    onChange={(e) => setNewAsset({...newAsset, institutionName: e.target.value})}
                 />
                 <input 
                    type="text" placeholder="Account Number"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newAsset.accountNumber}
                    onChange={(e) => setNewAsset({...newAsset, accountNumber: e.target.value})}
                 />
                 <input 
                    type="text" placeholder="Nominee Name"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newAsset.nomineeName}
                    onChange={(e) => setNewAsset({...newAsset, nomineeName: e.target.value})}
                 />
                 <button onClick={handleAddAsset} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">Save Asset</button>
              </div>
           </div>
        </div>
      )}

      {/* Reminder Form Modal */}
      {showReminderForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg">Add New Reminder</h3>
                 <button onClick={() => setShowReminderForm(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
              </div>
              <div className="space-y-4">
                 <input 
                    type="text" placeholder="Title (e.g. Health Insurance)"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                 />
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                        type="date"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newReminder.date}
                        onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                    />
                    <input 
                        type="number" placeholder="Amount"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newReminder.amount}
                        onChange={(e) => setNewReminder({...newReminder, amount: parseInt(e.target.value)})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <select 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newReminder.category}
                        onChange={(e) => setNewReminder({...newReminder, category: e.target.value as any})}
                     >
                        <option>Insurance</option>
                        <option>SIP/Investment</option>
                        <option>Tax</option>
                        <option>EMI</option>
                        <option>Bill</option>
                        <option>Other</option>
                     </select>
                     <select 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newReminder.recurring}
                        onChange={(e) => setNewReminder({...newReminder, recurring: e.target.value as any})}
                     >
                        <option>One-time</option>
                        <option>Yearly</option>
                        <option>Monthly</option>
                     </select>
                 </div>
                 <button onClick={handleAddReminder} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Save Reminder</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default LegacyVault;