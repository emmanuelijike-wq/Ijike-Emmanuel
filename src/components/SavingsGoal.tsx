import React, { useState, useEffect, useMemo } from 'react';
import { 
  PiggyBank, TrendingUp, Target, Plus, Trash2, Calendar, 
  Sparkles, CheckCircle2, ArrowUpRight, DollarSign, Edit3, 
  Award, Clock, Check, HelpCircle, ShieldCheck
} from 'lucide-react';
import { playSuccessSound } from '../utils/sound';

export interface DailySavingsRecord {
  id: string;
  amount: number;
  label: string;
  category: 'Allowance' | 'Snack Cutback' | 'Errand Reward' | 'Gift' | 'Work/Odd Job' | 'Other';
  date: string; // ISO string or YYYY-MM-DD
  timestamp: number;
}

interface SavingsGoalProps {
  initialGoal?: number;
  onGoalUpdated?: (newGoal: number) => void;
}

const STORAGE_SAVINGS_KEY = 'echo_plan_student_daily_savings';
const STORAGE_GOAL_KEY = 'echo_plan_monthly_savings_goal';

const DEFAULT_INITIAL_SAVINGS: DailySavingsRecord[] = [
  {
    id: 'sav-sample-1',
    amount: 500,
    label: 'Saved 20% transport & lunch allowance',
    category: 'Allowance',
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now() - 86400000 * 2
  },
  {
    id: 'sav-sample-2',
    amount: 350,
    label: 'Skipped carbonated soda & meat pie',
    category: 'Snack Cutback',
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now() - 86400000
  },
  {
    id: 'sav-sample-3',
    amount: 1000,
    label: 'Weekend home chores diligence token',
    category: 'Errand Reward',
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now()
  }
];

export const SavingsGoal: React.FC<SavingsGoalProps> = ({
  initialGoal = 15000,
  onGoalUpdated
}) => {
  // 1. Target Monthly Savings Goal State
  const [goal, setGoal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GOAL_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return initialGoal;
  });

  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [goalInputVal, setGoalInputVal] = useState<string>(goal.toString());

  // 2. Daily Savings Entries List
  const [savingsList, setSavingsList] = useState<DailySavingsRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize existing data structure if coming from prior schema
          return parsed.map((item: any, idx: number) => ({
            id: item.id || `sav-${idx}-${Date.now()}`,
            amount: Number(item.amount) || 0,
            label: item.label || item.note || 'Savings Deposit',
            category: item.category || item.source || 'Allowance',
            date: item.date && item.date.length === 10 ? item.date : new Date().toISOString().split('T')[0],
            timestamp: item.timestamp || (Date.now() - idx * 3600000)
          }));
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_INITIAL_SAVINGS;
  });

  // 3. New Entry Form States
  const todayStr = new Date().toISOString().split('T')[0];
  const [inputDate, setInputDate] = useState<string>(todayStr);
  const [inputAmount, setInputAmount] = useState<string>('');
  const [inputLabel, setInputLabel] = useState<string>('');
  const [inputCategory, setInputCategory] = useState<DailySavingsRecord['category']>('Allowance');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Synchronize state across tabs or storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem(STORAGE_SAVINGS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setSavingsList(parsed);
          }
        }
        const savedGoal = localStorage.getItem(STORAGE_GOAL_KEY);
        if (savedGoal) {
          const g = parseInt(savedGoal, 10);
          if (!isNaN(g) && g > 0) setGoal(g);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save changes to localStorage
  const persistSavings = (updated: DailySavingsRecord[]) => {
    setSavingsList(updated);
    try {
      localStorage.setItem(STORAGE_SAVINGS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  };

  const handleSaveGoal = (newVal: number) => {
    if (newVal <= 0) return;
    setGoal(newVal);
    setGoalInputVal(newVal.toString());
    setIsEditingGoal(false);
    try {
      localStorage.setItem(STORAGE_GOAL_KEY, newVal.toString());
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
    if (onGoalUpdated) onGoalUpdated(newVal);
    playSuccessSound();
  };

  // Date and Time Calculations for Current Month
  const now = new Date();
  const currentMonthName = now.toLocaleString('en-US', { month: 'long' });
  const currentYear = now.getFullYear();
  const currentMonthNum = now.getMonth(); // 0-indexed
  const totalDaysInMonth = new Date(currentYear, currentMonthNum + 1, 0).getDate();
  const currentDayOfMonth = now.getDate();
  const daysRemainingInMonth = Math.max(0, totalDaysInMonth - currentDayOfMonth);

  // Filter savings for this current calendar month
  const currentMonthSavings = useMemo(() => {
    return savingsList.filter(item => {
      if (!item.date) return false;
      const [yearStr, monthStr] = item.date.split('-');
      return parseInt(yearStr, 10) === currentYear && parseInt(monthStr, 10) === (currentMonthNum + 1);
    });
  }, [savingsList, currentYear, currentMonthNum]);

  // Month Total Sum
  const monthTotal = useMemo(() => {
    return currentMonthSavings.reduce((acc, curr) => acc + curr.amount, 0);
  }, [currentMonthSavings]);

  // All-Time Total
  const allTimeTotal = useMemo(() => {
    return savingsList.reduce((acc, curr) => acc + curr.amount, 0);
  }, [savingsList]);

  // Progress Metrics
  const progressPercent = Math.min(100, Math.round((monthTotal / Math.max(1, goal)) * 100));
  const rawProgressPercent = ((monthTotal / Math.max(1, goal)) * 100).toFixed(1);
  const remainingToGoal = Math.max(0, goal - monthTotal);
  const isGoalAchieved = monthTotal >= goal;

  // Daily Average & Projection
  const dailyAverageThisMonth = currentDayOfMonth > 0 
    ? Math.round(monthTotal / currentDayOfMonth) 
    : 0;
  const projectedMonthEndTotal = monthTotal + (dailyAverageThisMonth * daysRemainingInMonth);
  const projectedProgressPercent = Math.min(100, Math.round((projectedMonthEndTotal / Math.max(1, goal)) * 100));

  // Required Daily Pace to Hit Goal
  const neededDailyPace = daysRemainingInMonth > 0 && remainingToGoal > 0
    ? Math.ceil(remainingToGoal / daysRemainingInMonth)
    : 0;

  // Handle Form Submit: Add Daily Savings
  const handleAddSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(inputAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const labelToSave = inputLabel.trim() || `Daily Savings (${inputCategory})`;

    const newRecord: DailySavingsRecord = {
      id: `sav-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      amount: parsedAmount,
      label: labelToSave,
      category: inputCategory,
      date: inputDate || todayStr,
      timestamp: Date.now()
    };

    const updated = [newRecord, ...savingsList];
    persistSavings(updated);

    setInputAmount('');
    setInputLabel('');
    playSuccessSound();

    setSuccessToast(`+₦${parsedAmount.toLocaleString()} added to your ${currentMonthName} savings!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleQuickAddChip = (amountToAdd: number) => {
    setInputAmount(amountToAdd.toString());
    playSuccessSound();
  };

  const handleDeleteEntry = (id: string) => {
    const target = savingsList.find(s => s.id === id);
    const updated = savingsList.filter(s => s.id !== id);
    persistSavings(updated);
    if (target) {
      setSuccessToast(`Removed ₦${target.amount.toLocaleString()} record.`);
      setTimeout(() => setSuccessToast(null), 2500);
    }
  };

  return (
    <div id="savings-goal-module" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#071a3d] via-[#0c2f6d] to-[#124b91] text-white p-6 sm:p-8 relative overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at 85% 20%, #34d399, transparent 50%), radial-gradient(circle at 10% 80%, #60a5fa, transparent 40%)'
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
              <PiggyBank size={14} className="text-emerald-400" />
              <span>Planner Financial Discipline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>SavingsGoal: Daily Savings & Monthly Target</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#c8daf3] max-w-xl leading-relaxed">
              Log how much you save every day, monitor your <strong>{currentMonthName} total</strong>, and track your visual progress bar towards your target savings milestone.
            </p>
          </div>

          {/* Month Summary Hero Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-13 h-13 rounded-2xl bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0">
              <TrendingUp size={26} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block">
                {currentMonthName} Total Saved
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ₦{monthTotal.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                <span>{currentMonthSavings.length} daily logs</span>
                <span>•</span>
                <span className="text-emerald-300 font-bold">{progressPercent}% of goal</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        
        {/* =================================================================== */}
        {/* SECTION 1: VISUAL PROGRESS BAR TOWARDS A SET GOAL                   */}
        {/* =================================================================== */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                <Target size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-[#081a3d]">
                    Monthly Goal Progress: ₦{monthTotal.toLocaleString()} / ₦{goal.toLocaleString()}
                  </h3>
                  {isGoalAchieved ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Check size={11} /> Goal Hit!
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                      {rawProgressPercent}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Target for {currentMonthName} {currentYear} • Day {currentDayOfMonth} of {totalDaysInMonth} ({daysRemainingInMonth} days left)
                </p>
              </div>
            </div>

            {/* Edit / Set Goal Controls */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {isEditingGoal ? (
                <div className="flex items-center gap-1.5 animate-fade-in">
                  <span className="text-xs font-bold text-slate-600">₦</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={goalInputVal}
                    onChange={(e) => setGoalInputVal(e.target.value)}
                    className="w-28 px-3 py-1.5 rounded-xl border border-emerald-400 font-bold text-xs text-[#081a3d] bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="15000"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveGoal(Number(goalInputVal) || initialGoal)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-xs"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingGoal(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingGoal(true)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Edit3 size={12} />
                    <span>Change Goal</span>
                  </button>

                  {/* Preset goal buttons */}
                  <div className="hidden lg:flex items-center gap-1">
                    {[10000, 15000, 20000, 30000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSaveGoal(amt)}
                        className={`px-2 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors ${
                          goal === amt
                            ? 'bg-emerald-600 text-white font-black'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        ₦{(amt / 1000)}k
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* THE VISUAL PROGRESS BAR */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>Saved So Far: <strong className="text-emerald-700 font-black">₦{monthTotal.toLocaleString()}</strong></span>
              </span>
              <span className="text-slate-600">
                {isGoalAchieved ? (
                  <span className="text-emerald-600 font-black flex items-center gap-1">
                    🎉 Goal Surpassed by ₦{(monthTotal - goal).toLocaleString()}!
                  </span>
                ) : (
                  <span>Remaining: <strong className="text-slate-900 font-black">₦{remainingToGoal.toLocaleString()}</strong></span>
                )}
              </span>
            </div>

            {/* Custom Styled Visual Progress Bar */}
            <div className="relative w-full h-7 rounded-2xl bg-slate-200/90 p-1 overflow-hidden shadow-inner flex items-center">
              <div
                style={{ width: `${progressPercent}%` }}
                className={`h-full rounded-xl transition-all duration-700 ease-out flex items-center justify-end pr-2.5 shadow-sm relative overflow-hidden ${
                  isGoalAchieved 
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400' 
                    : progressPercent > 50 
                    ? 'bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500' 
                    : 'bg-gradient-to-r from-blue-500 to-sky-400'
                }`}
              >
                {/* Subtle animated light gleam */}
                <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-pulse pointer-events-none" />
                {progressPercent >= 18 && (
                  <span className="text-[11px] font-black text-white drop-shadow-xs relative z-10">
                    {progressPercent}%
                  </span>
                )}
              </div>

              {/* Outside label if fill is very small */}
              {progressPercent < 18 && (
                <span className="text-[11px] font-black text-slate-600 pl-2">
                  {progressPercent}%
                </span>
              )}
            </div>

            {/* Projection & Pace Insight Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
                <Clock size={16} className="text-sky-600 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Daily Average</span>
                  <span className="font-black text-[#081a3d]">₦{dailyAverageThisMonth.toLocaleString()} / day</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
                <TrendingUp size={16} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Projected Month-End</span>
                  <span className="font-black text-emerald-700">₦{projectedMonthEndTotal.toLocaleString()} ({projectedProgressPercent}%)</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
                <Target size={16} className="text-amber-600 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pace Needed to Reach Goal</span>
                  <span className="font-black text-slate-800">
                    {isGoalAchieved ? 'Target already achieved!' : `₦${neededDailyPace.toLocaleString()} / day`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECTION 2: INPUT DAILY SAVINGS FORM                                 */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Daily Savings Form Card (Left / 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Plus size={16} />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#081a3d]">
                    Input Today&apos;s Daily Savings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter the exact amount you put into your piggy bank, envelope, or savings account today.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Add Amount Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 block">
                Quick One-Tap Savings Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {[200, 500, 1000, 2000, 5000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickAddChip(amt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                  >
                    <span>+₦{amt.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddSavings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Input */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
                    Date of Savings
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={inputDate}
                      onChange={(e) => setInputDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
                    Amount Saved (₦) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-black text-slate-400">₦</span>
                    <input
                      type="number"
                      required
                      min="10"
                      step="10"
                      placeholder="e.g. 500"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-emerald-400 font-black text-xs text-slate-900 bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Note / Purpose */}
              <div>
                <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
                  Note / Reason (What did you save or sacrifice?)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saved 20% allowance, Skipped meat pie, Sold craft paper"
                  value={inputLabel}
                  onChange={(e) => setInputLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category / Source */}
              <div>
                <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
                  Source of Money
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Allowance', 'Snack Cutback', 'Errand Reward', 'Gift', 'Work/Odd Job', 'Other'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setInputCategory(cat)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        inputCategory === cat
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-black'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-98"
              >
                <Plus size={16} />
                <span>Put Down Daily Savings (+₦{inputAmount ? Number(inputAmount).toLocaleString() : '0'})</span>
              </button>

              {successToast && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{successToast}</span>
                </div>
              )}
            </form>
          </div>

          {/* Month Summary & Recent Deposits (Right / 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Monthly Summary Statistics Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#071a3d] to-[#0f3460] text-white shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[11px] font-black uppercase text-emerald-300 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>{currentMonthName} Month Summary</span>
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {currentYear}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-[10px] text-slate-300 uppercase block font-semibold">Month&apos;s Total</span>
                  <div className="text-xl font-black text-emerald-300 mt-0.5">
                    ₦{monthTotal.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-[10px] text-slate-300 uppercase block font-semibold">Target Goal</span>
                  <div className="text-xl font-black text-white mt-0.5">
                    ₦{goal.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-[10px] text-slate-300 uppercase block font-semibold">Days Logged</span>
                  <div className="text-lg font-black text-sky-200 mt-0.5">
                    {currentMonthSavings.length} / {totalDaysInMonth}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-[10px] text-slate-300 uppercase block font-semibold">All-Time Saved</span>
                  <div className="text-lg font-black text-amber-200 mt-0.5">
                    ₦{allTimeTotal.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#c8daf3] flex items-center gap-1.5 border-t border-white/10">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>
                  {isGoalAchieved 
                    ? '🎉 You have fulfilled your target savings goal for this month!'
                    : `Keep going! ₦${remainingToGoal.toLocaleString()} left to achieve 100%.`}
                </span>
              </div>
            </div>

            {/* Daily Savings Ledger Card */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                  <Calendar size={14} className="text-emerald-600" />
                  <span>{currentMonthName} Savings Log ({currentMonthSavings.length})</span>
                </h4>
                <span className="text-[11px] font-black text-emerald-700">
                  ₦{monthTotal.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {currentMonthSavings.map(item => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition-all flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="font-bold text-slate-900 line-clamp-1">
                        {item.label}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-white border border-slate-200 text-slate-600 font-semibold">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-black text-emerald-700 text-sm">
                        +₦{item.amount.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(item.id)}
                        className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                        title="Delete deposit"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                {currentMonthSavings.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                    <p className="font-semibold">No savings logged yet for {currentMonthName}.</p>
                    <p className="text-[11px]">Use the form on the left to put down your first daily deposit!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
