import React, { useState, useEffect } from 'react';
import { Reminder, ReminderCategory } from '../types';
import { 
  CalendarClock, Plus, Trash2, Bell, Shield, TrendingUp, Landmark, 
  Home, Zap, Calendar, X,
  CheckSquare, Square, IndianRupee, AlertCircle
} from 'lucide-react';

const FinancialReminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    date: '',
    amount: 0,
    category: 'Insurance',
    recurring: 'Yearly'
  });

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('fin_reminders');
    if (saved) {
      setReminders(JSON.parse(saved));
    } else {
      // Default Indian Context Sample Data if empty (Updated for 2026 context)
      setReminders([
        { id: '1', title: 'Life Insurance Premium (LIC)', date: '2026-03-15', amount: 24000, category: 'Insurance', recurring: 'Yearly', completed: false },
        { id: '2', title: 'Income Tax Return (ITR)', date: '2026-07-31', amount: 0, category: 'Tax', recurring: 'Yearly', completed: false },
        { id: '3', title: 'Monthly SIP Deduction', date: '2026-05-10', amount: 10000, category: 'SIP/Investment', recurring: 'Monthly', completed: false },
      ]);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('fin_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const handleAdd = () => {
    if (!newReminder.title || !newReminder.date) return;
    
    const item: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      date: newReminder.date,
      amount: newReminder.amount || 0,
      category: newReminder.category as ReminderCategory,
      recurring: newReminder.recurring as any,
      completed: false
    };
    
    setReminders([...reminders, item].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setShowForm(false);
    setNewReminder({ title: '', date: '', amount: 0, category: 'Insurance', recurring: 'Yearly' });
  };

  const handleDelete = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const toggleReminderStatus = (id: string) => {
    const updated = reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
    setReminders(updated);
  };

  const addSmartTemplate = (template: Partial<Reminder>) => {
    setNewReminder({
        title: template.title || '',
        date: template.date || new Date().toISOString().split('T')[0],
        amount: template.amount || 0,
        category: template.category as ReminderCategory,
        recurring: template.recurring as any || 'Yearly',
        completed: false
    });
    setShowForm(true);
  };

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Get days remaining
  const getDaysRemaining = (dateStr: string) => {
    const today = new Date();
    const target = new Date(dateStr);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  // Icon Mapper
  const getIcon = (cat: ReminderCategory) => {
    switch(cat) {
      case 'Insurance': return <Shield className="h-5 w-5 text-emerald-600" />;
      case 'SIP/Investment': return <TrendingUp className="h-5 w-5 text-indigo-600" />;
      case 'Tax': return <Landmark className="h-5 w-5 text-orange-600" />;
      case 'EMI': return <Home className="h-5 w-5 text-blue-600" />;
      case 'Bill': return <Zap className="h-5 w-5 text-yellow-600" />;
      default: return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  // Calculate Upcoming Liability (Next 30 Days) - Filter out completed
  const upcomingLiability = reminders.filter(r => !r.completed).reduce((acc, curr) => {
    const days = getDaysRemaining(curr.date);
    if (days >= 0 && days <= 30) return acc + curr.amount;
    return acc;
  }, 0);

  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  const renderReminderItem = (reminder: Reminder) => {
    const daysLeft = getDaysRemaining(reminder.date);
    let statusColor = "bg-slate-100 text-slate-600";
    let borderClass = "border-slate-100";
    
    if (daysLeft < 0) {
      statusColor = "bg-red-100 text-red-700";
      borderClass = "border-red-100";
    } else if (daysLeft <= 7) {
      statusColor = "bg-amber-100 text-amber-700";
      borderClass = "border-amber-200";
    } else if (daysLeft <= 30) {
      statusColor = "bg-blue-50 text-blue-700";
      borderClass = "border-blue-100";
    }

    const isCompleted = reminder.completed;

    return (
      <div key={reminder.id} className={`bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between group transition-all hover:shadow-md ${isCompleted ? 'opacity-60 bg-slate-50' : borderClass}`}>
        <div className="flex items-start gap-4">
           <button 
              onClick={() => toggleReminderStatus(reminder.id)}
              className={`mt-1 flex-shrink-0 transition-colors ${isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
            >
                {isCompleted ? <CheckSquare className="h-6 w-6" /> : <Square className="h-6 w-6" />}
            </button>
           <div className={`p-3 rounded-xl bg-opacity-50 ${isCompleted ? 'bg-slate-100 grayscale' : statusColor}`}>
              {getIcon(reminder.category)}
           </div>
           <div className={isCompleted ? 'line-through text-slate-400' : ''}>
              <h4 className="font-bold text-lg">{reminder.title}</h4>
              <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                 <span className="font-medium">{new Date(reminder.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                 <span>•</span>
                 <span>{reminder.recurring}</span>
                 <span>•</span>
                 <span className="font-bold">{formatCurrency(reminder.amount)}</span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           {!isCompleted && (
               <div className={`text-right hidden sm:block px-3 py-1 rounded-lg text-xs font-bold ${statusColor}`}>
                  {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due Today' : `${daysLeft} Days Left`}
               </div>
           )}
           <button onClick={() => handleDelete(reminder.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
              <Trash2 className="h-5 w-5" />
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-[Poppins] flex items-center gap-2">
            <CalendarClock className="h-8 w-8 text-indigo-600" /> Smart Financial Calendar
          </h1>
          <p className="text-slate-500 mt-1">Never miss a premium payment, tax deadline, or SIP date again.</p>
        </div>
        <button 
           onClick={() => setShowForm(true)}
           className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary & Smart Actions */}
        <div className="space-y-6">
           {/* Liability Card */}
           <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-indigo-100 font-medium text-sm uppercase tracking-wide mb-1">Upcoming Payments (30 Days)</p>
                <h2 className="text-4xl font-bold font-[Poppins]">{formatCurrency(upcomingLiability)}</h2>
                <p className="text-xs text-indigo-200 mt-4 opacity-80">
                   Make sure your bank account is funded to avoid bounce charges or policy lapses.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                 <IndianRupee className="h-40 w-40" />
              </div>
           </div>

           {/* Smart Templates */}
           <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Zap className="h-4 w-4 text-amber-500 fill-amber-500"/> One-Click Add
              </h3>
              <div className="space-y-3">
                 <button 
                    onClick={() => addSmartTemplate({title: 'Income Tax Return (ITR)', date: '2026-07-31', category: 'Tax', amount: 0})}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3 text-sm font-medium text-slate-600"
                 >
                    <Landmark className="h-4 w-4" /> Add ITR Deadline (July 31)
                 </button>
                 <button 
                    onClick={() => addSmartTemplate({title: '80C Proof Submission', date: '2027-01-31', category: 'Tax', recurring: 'Yearly', amount: 0})}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3 text-sm font-medium text-slate-600"
                 >
                    <div className="h-4 w-4"><FileText className="h-4 w-4"/></div> Add 80C Proof Submission (Jan 31)
                 </button>
                 <button 
                    onClick={() => addSmartTemplate({title: 'PPF Min Deposit', date: '2026-03-31', category: 'SIP/Investment', amount: 500})}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3 text-sm font-medium text-slate-600"
                 >
                    <TrendingUp className="h-4 w-4" /> Add PPF Deadline (Mar 31)
                 </button>
                 <button 
                    onClick={() => addSmartTemplate({title: 'Advance Tax Installment 1', date: '2026-06-15', category: 'Tax', amount: 0})}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3 text-sm font-medium text-slate-600"
                 >
                    <Calendar className="h-4 w-4" /> Add Advance Tax (June 15)
                 </button>
              </div>
           </div>
        </div>

        {/* Right Column: Reminders List */}
        <div className="lg:col-span-2 space-y-4">
           {reminders.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                 <Bell className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-slate-700">No Reminders Yet</h3>
                 <p className="text-slate-400 mt-2">Add your medical insurance, SIP dates, or EMI schedules here.</p>
              </div>
           ) : (
            <>
              {activeReminders.map(renderReminderItem)}
              {completedReminders.length > 0 && (
                <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Completed</h3>
                    {completedReminders.map(renderReminderItem)}
                </div>
              )}
            </>
           )}
        </div>
      </div>

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-slate-900">Add New Reminder</h3>
                 <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X className="h-6 w-6" /></button>
              </div>
              <div className="p-8 space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input 
                       type="text"
                       placeholder="e.g. Health Insurance Renewal"
                       value={newReminder.title}
                       onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                       className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                        <input 
                        type="date"
                        value={newReminder.date}
                        onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                        <input 
                        type="number"
                        placeholder="0"
                        value={newReminder.amount}
                        onChange={(e) => setNewReminder({...newReminder, amount: Number(e.target.value)})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select 
                        value={newReminder.category}
                        onChange={(e) => setNewReminder({...newReminder, category: e.target.value as any})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                        <option>Insurance</option>
                        <option>SIP/Investment</option>
                        <option>Tax</option>
                        <option>EMI</option>
                        <option>Bill</option>
                        <option>School Fees</option>
                        <option>Other</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                        <select 
                        value={newReminder.recurring}
                        onChange={(e) => setNewReminder({...newReminder, recurring: e.target.value as any})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                        <option>One-time</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                        <option>Quarterly</option>
                        </select>
                     </div>
                 </div>

                 <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-800">
                       We will show this in your dashboard. For actual notifications, please sync with your Google Calendar.
                    </p>
                 </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                 <button onClick={() => setShowForm(false)} className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                 <button onClick={handleAdd} className="flex-1 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200">Save Reminder</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Simple Icon component helper
const FileText = ({className}:{className?:string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);

export default FinancialReminders;