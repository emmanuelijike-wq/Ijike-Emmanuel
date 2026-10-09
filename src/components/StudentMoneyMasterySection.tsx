import React, { useState } from 'react';
import { 
  DollarSign, PiggyBank, TrendingUp, Clock, CheckCircle2, 
  Sparkles, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, 
  HelpCircle, Calendar, Flame, Award, Heart, Check, Plus, Trash2
} from 'lucide-react';
import { playSuccessSound } from '../utils/sound';

interface ExpenseItem {
  id: string;
  item: string;
  amount: number;
  category: 'needs' | 'wants' | 'savings';
  date: string;
}

export const StudentMoneyMasterySection: React.FC = () => {
  // Parental Work-Hours Calculator state
  const [itemPrice, setItemPrice] = useState<number>(12000);
  const [parentHourlyWage, setParentHourlyWage] = useState<number>(1500);

  // 50/30/20 Student Allowance Calculator
  const [studentAllowance, setStudentAllowance] = useState<number>(10000);

  // Daily Expense Log
  const [expenseLog, setExpenseLog] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_expense_log');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: '1', item: 'Mathematics Textbook Past Paper', amount: 2500, category: 'needs', date: 'Yesterday' },
      { id: '2', item: 'Saved 20% in Opportunity Jar', amount: 2000, category: 'savings', date: 'Yesterday' },
      { id: '3', item: 'Fruit Snack & Cold Water', amount: 800, category: 'wants', date: 'Today' }
    ];
  });

  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCat, setNewExpenseCat] = useState<'needs' | 'wants' | 'savings'>('needs');

  // Dedicated Student Daily Savings Tracker (Put down how much you save & auto-sum)
  interface SavingsEntry {
    id: string;
    label: string;
    amount: number;
    date: string;
    source: string;
  }

  const [savingsEntries, setSavingsEntries] = useState<SavingsEntry[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_student_daily_savings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'sav-1', label: 'Monday 20% Transport Savings', amount: 500, date: 'Today', source: 'Weekly Allowance' },
      { id: 'sav-2', label: 'Snack Impulse Delayed', amount: 350, date: 'Yesterday', source: 'Canteen Change' },
      { id: 'sav-3', label: 'Weekend Errand Token Saved', amount: 1000, date: '2 days ago', source: 'Home Chores Reward' }
    ];
  });

  const [savingLabel, setSavingLabel] = useState('');
  const [savingAmount, setSavingAmount] = useState('');
  const [savingSource, setSavingSource] = useState('Daily Allowance');

  const handleAddSavings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!savingLabel.trim() || !savingAmount) return;
    const num = parseFloat(savingAmount);
    if (isNaN(num) || num <= 0) return;

    const newEntry: SavingsEntry = {
      id: `sav-${Date.now()}`,
      label: savingLabel.trim(),
      amount: num,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      source: savingSource
    };

    const updated = [newEntry, ...savingsEntries];
    setSavingsEntries(updated);
    try {
      localStorage.setItem('echo_plan_student_daily_savings', JSON.stringify(updated));
    } catch {}
    setSavingLabel('');
    setSavingAmount('');
    playSuccessSound();
  };

  const handleDeleteSavings = (id: string) => {
    const updated = savingsEntries.filter(s => s.id !== id);
    setSavingsEntries(updated);
    try {
      localStorage.setItem('echo_plan_student_daily_savings', JSON.stringify(updated));
    } catch {}
  };

  const totalSavedSum = savingsEntries.reduce((acc, curr) => acc + curr.amount, 0);

  // Month-End Savings Analysis & Whole Money Projection
  const now = new Date();
  const currentMonthName = now.toLocaleString('en-US', { month: 'long' });
  const currentYear = now.getFullYear();
  const daysInCurrentMonth = new Date(currentYear, now.getMonth() + 1, 0).getDate();
  const currentDayOfMonth = now.getDate();
  const daysRemainingInMonth = Math.max(0, daysInCurrentMonth - currentDayOfMonth);

  // Student's Target Monthly Savings Goal
  const [monthlySavingsGoal, setMonthlySavingsGoal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_monthly_savings_goal');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 15000;
  });

  // Daily Savings Pace for Projecting Whole Money at Month-End
  const [projectedDailyPace, setProjectedDailyPace] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_daily_savings_pace');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 500;
  });

  const handleUpdateMonthlyGoal = (amount: number) => {
    setMonthlySavingsGoal(amount);
    try {
      localStorage.setItem('echo_plan_monthly_savings_goal', String(amount));
    } catch {}
    playSuccessSound();
  };

  const handleUpdateDailyPace = (amount: number) => {
    setProjectedDailyPace(amount);
    try {
      localStorage.setItem('echo_plan_daily_savings_pace', String(amount));
    } catch {}
    playSuccessSound();
  };

  // Whole Money that will be in the end of the month
  const projectedRemainingSavings = projectedDailyPace * daysRemainingInMonth;
  const wholeMoneyEndOfMonth = totalSavedSum + projectedRemainingSavings;
  const goalSurplusOrDeficit = wholeMoneyEndOfMonth - monthlySavingsGoal;
  const goalProgressPct = Math.min(100, Math.round((wholeMoneyEndOfMonth / Math.max(1, monthlySavingsGoal)) * 100));
  const currentSavedPct = Math.min(100, Math.round((totalSavedSum / Math.max(1, monthlySavingsGoal)) * 100));
  const neededDailyPaceToHitGoal = daysRemainingInMonth > 0 
    ? Math.max(0, Math.ceil((monthlySavingsGoal - totalSavedSum) / daysRemainingInMonth))
    : 0;

  // Highest single deposit
  const highestDeposit = savingsEntries.length > 0 
    ? Math.max(...savingsEntries.map(s => s.amount))
    : 0;
  const avgDeposit = savingsEntries.length > 0
    ? Math.round(totalSavedSum / savingsEntries.length)
    : 0;

  // 30-Day Money Habits Streak & Checklist
  const [habitStreak, setHabitStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_money_streak');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 7;
  });

  const [dailyHabits, setDailyHabits] = useState([
    { id: 'h1', text: 'Pay Yourself First: Saved 20% of today’s income/allowance before spending', done: true },
    { id: 'h2', text: 'Enforced 24-Hour Rule: Delayed a non-essential impulse craving', done: true },
    { id: 'h3', text: '60-Second Audit: Logged every naira/dollar spent today', done: true },
    { id: 'h4', text: 'Asset vs. Liability: Chose an educational/productive resource over vanity', done: false },
    { id: 'h5', text: 'Refused Peer Spending: Stood firm when friends urged unnecessary treats', done: false },
    { id: 'h6', text: 'Zero-Debt Principle: Did not borrow money for snacks, vanity, or impulse items', done: true }
  ]);

  const toggleHabit = (id: string) => {
    setDailyHabits(prev => {
      const updated = prev.map(h => h.id === id ? { ...h, done: !h.done } : h);
      const allDone = updated.every(h => h.done);
      if (allDone) {
        setHabitStreak(s => {
          const next = s + 1;
          try {
            localStorage.setItem('echo_plan_money_streak', next.toString());
          } catch {}
          return next;
        });
      }
      return updated;
    });
    playSuccessSound();
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName.trim() || !newExpenseAmount) return;
    const amount = parseFloat(newExpenseAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      item: newExpenseName.trim(),
      amount,
      category: newExpenseCat,
      date: 'Today'
    };

    const updated = [newItem, ...expenseLog];
    setExpenseLog(updated);
    try {
      localStorage.setItem('echo_plan_expense_log', JSON.stringify(updated));
    } catch {}
    setNewExpenseName('');
    setNewExpenseAmount('');
    playSuccessSound();
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenseLog.filter(x => x.id !== id);
    setExpenseLog(updated);
    try {
      localStorage.setItem('echo_plan_expense_log', JSON.stringify(updated));
    } catch {}
  };

  // Calculations
  const calculatedWorkHours = parentHourlyWage > 0 
    ? (itemPrice / parentHourlyWage).toFixed(1) 
    : '0';

  const needsAllocation = Math.round(studentAllowance * 0.50);
  const wantsAllocation = Math.round(studentAllowance * 0.30);
  const savingsAllocation = Math.round(studentAllowance * 0.20);

  const completedHabitsCount = dailyHabits.filter(h => h.done).length;
  const habitPercentage = Math.round((completedHabitsCount / dailyHabits.length) * 100);

  return (
    <div className="space-y-12 animate-fade-in text-slate-900">
      
      {/* Title Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-200">
          <PiggyBank size={14} className="text-emerald-600" />
          <span>Financial Mastery & Wealth Habits</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#081a3d] tracking-tight">
          How to Save Money & Build Ironclad Money Habits
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Wealth is not about how much pocket money passes through your fingers—it is about what you keep, how you govern your habits, and how you respect the sacrifices of your parents.
        </p>
      </div>

      {/* =================================================================== */}
      {/* SECTION 1: HOW TO SAVE MONEY — THE 5 PILLARS                        */}
      {/* =================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Pillar 1 • Step-by-Step System
          </span>
          <h3 className="text-2xl font-black text-[#081a3d] mt-2">
            The Fundamental Principles of Saving Money
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Proven strategies to retain capital, eliminate reckless spending, and grow independent savings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Rule 1: Pay Yourself First */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white border border-emerald-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
              1
            </div>
            <h4 className="font-extrabold text-[#081a3d] text-base">
              The "Pay Yourself First" Law
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Most students save whatever is leftover after buying snacks, phone data, and fun. The result? <strong>Zero savings</strong>. Young leaders flip the script: when you receive allowance or earnings, transfer <strong>20% immediately</strong> into savings before spending a single kobo or cent.
            </p>
            <div className="p-3 bg-emerald-100/60 rounded-xl text-[11px] font-bold text-emerald-950">
              💡 Formula: Income - Savings = Spending (Never the reverse!)
            </div>
          </div>

          {/* Rule 2: 24-Hour & 72-Hour Anti-Impulse Rules */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-sky-50/60 to-white border border-sky-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black shadow-xs">
              2
            </div>
            <h4 className="font-extrabold text-[#081a3d] text-base">
              The 24-Hour Anti-Impulse Rule
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Commercial stores and peer culture rely on sudden dopamine rushes. When you feel the overwhelming urge to purchase non-essential shoes, snacks, or games, force a mandatory <strong>24-hour waiting window</strong> (or 72 hours for high-cost items). 85% of cravings evaporate naturally once the emotion cools!
            </p>
            <div className="p-3 bg-sky-100/60 rounded-xl text-[11px] font-bold text-sky-950">
              ⏱ If you still need it 72 hours later, then evaluate it calmly.
            </div>
          </div>

          {/* Rule 3: The 3-Jar Savings System */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-50/60 to-white border border-purple-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-xs">
              3
            </div>
            <h4 className="font-extrabold text-[#081a3d] text-base">
              The 3-Jar Tangible Savings System
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Split your saved capital into 3 distinct envelopes or bank sub-accounts:
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li><strong>Emergency Shield (50%):</strong> For sudden textbook costs or transport issues.</li>
              <li><strong>Dream Goal (30%):</strong> For a laptop, study desk, or educational certification.</li>
              <li><strong>Generosity & Seed (20%):</strong> Supporting family and seed capital for small ventures.</li>
            </ul>
          </div>

        </div>

        {/* Interactive Allowance 50/30/20 Calculator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Interactive Calculation
              </span>
              <h4 className="text-lg font-black text-[#081a3d] mt-1">
                Student 50/30/20 Allowance Allocator
              </h4>
              <p className="text-xs text-slate-500">
                Input your weekly or monthly pocket money to view your exact responsible distribution.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Pocket Money (₦):</label>
              <input 
                type="number"
                value={studentAllowance}
                onChange={(e) => setStudentAllowance(Math.max(0, Number(e.target.value)))}
                className="w-32 px-3 py-1.5 rounded-xl border border-slate-300 font-black text-xs text-[#081a3d] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-black uppercase text-slate-500 flex items-center justify-between">
                <span>Needs (50%)</span>
                <span className="text-blue-600">Transport & Books</span>
              </span>
              <div className="text-2xl font-black text-[#081a3d]">
                ₦{needsAllocation.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                School lunch, notebooks, uniform repairs, mandatory transport.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-black uppercase text-slate-500 flex items-center justify-between">
                <span>Wants (30%)</span>
                <span className="text-purple-600">Recreation & Fun</span>
              </span>
              <div className="text-2xl font-black text-[#081a3d]">
                ₦{wantsAllocation.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                Occasional soda, snacks with friends, leisure internet data.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-emerald-400 shadow-xs space-y-1">
              <span className="text-[11px] font-black uppercase text-emerald-800 flex items-center justify-between">
                <span>Savings & Growth (20%)</span>
                <span className="text-emerald-700">Future Freedom</span>
              </span>
              <div className="text-2xl font-black text-emerald-600">
                ₦{savingsAllocation.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-800 font-semibold">
                Protected capital for emergency reserves, laptop fund, and investments.
              </p>
            </div>
          </div>
        </div>

        {/* The Parental Work-Hours Price Calculator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-slate-50 border border-amber-200 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
            <Clock size={18} className="text-amber-700" />
            <span>Parental Labor & Sacrifice Metric ("The Work-Hours Reality Check")</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Money doesn't come from ATM machines—it comes from the life energy, sweat, and fatigue of parents. Before demanding an expensive designer bag or trendy smartphone, convert the price into how many hours of hard labor your parents had to work to earn that exact amount.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end pt-2">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">
                Item Price (₦)
              </label>
              <input 
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                placeholder="e.g. 15000"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">
                Parent Estimated Hourly Wage (₦/hr)
              </label>
              <input 
                type="number"
                value={parentHourlyWage}
                onChange={(e) => setParentHourlyWage(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                placeholder="e.g. 1500"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-amber-300 text-center shadow-xs">
              <span className="text-[10px] font-black uppercase text-amber-800 block">
                Parental Labor Required
              </span>
              <div className="text-2xl font-black text-amber-900">
                {calculatedWorkHours} Hours
              </div>
              <span className="text-[10.5px] text-slate-500 font-medium">
                of exhausting work for this single item!
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* =================================================================== */}
      {/* SECTION 2: HOW TO GROW MONEY HABITS (THE PSYCHOLOGY & HABIT LOOP)   */}
      {/* =================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            Pillar 2 • Behavioral Habit Engineering
          </span>
          <h3 className="text-2xl font-black text-[#081a3d] mt-2">
            How to Grow Long-Term Money Habits
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Transforming discipline from a painful chore into an automatic subconscious identity.
          </p>
        </div>

        {/* The Habit Loop Model */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-black text-[#081a3d] text-sm">1. The Cue (Trigger)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Boredom, school dismissal bell, walking past canteen, or peer boasting on WhatsApp.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-black text-[#081a3d] text-sm">2. The Craving</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Desire for instant dopamine sugar rush or wanting to appear cool and wealthy in front of classmates.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="font-black text-amber-950 text-sm">3. The Routine (Rewire)</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Old Bad Habit:</strong> Buy junk food.<br/>
              <strong>Leader Habit:</strong> Pause 10 seconds, drink water, log in Echo Plan, and save ₦100!
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
              4
            </span>
            <h4 className="font-black text-emerald-950 text-sm">4. The Reward</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              The deep pride of self-control, growing streak, and knowing you are becoming financially independent!
            </p>
          </div>
        </div>

        {/* The 6 Atomic Money Habits Grid */}
        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-wider text-slate-600">
            The 6 Atomic Money Habits of High-Performing Students
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-[#081a3d]">
                <span className="p-1 rounded-md bg-indigo-100 text-indigo-700">✍️</span>
                <span>The 60-Second Daily Audit</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before going to bed, spend 60 seconds noting down every naira/dollar spent during the day. What gets measured gets managed!
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-[#081a3d]">
                <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">🌱</span>
                <span>Assets vs. Liabilities Discrimination</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                An asset puts money/value into your pocket (books, coding lessons, study tools). A liability drains it (designer t-shirts, junk food). Always choose assets.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-[#081a3d]">
                <span className="p-1 rounded-md bg-purple-100 text-purple-700">🛡</span>
                <span>Defeating Lifestyle Creep</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                When your pocket money increases by 50%, do not increase your snack spending by 50%. Increase your savings rate instead!
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 hover:border-rose-300 transition-all bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-[#081a3d]">
                <span className="p-1 rounded-md bg-rose-100 text-rose-700">🚫</span>
                <span>The Zero-Debt for Consumption Law</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                A young leader never borrows money to buy snacks, show off clothes, or impress friends. Debt for lifestyle is a trap that destroys peace.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-[#081a3d]">
                <span className="p-1 rounded-md bg-amber-100 text-amber-700">🪙</span>
                <span>Loose Change Auto-Drop</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Whenever you get small change from transport or canteen purchases (₦50, ₦100 notes), immediately drop it into your savings jar without thinking.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-[#081a3d]">
                <span className="p-1 rounded-md bg-blue-100 text-blue-700">📚</span>
                <span>15-Minute Financial Study</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Read 15 minutes of financial education or leadership literature weekly. Knowledge compounds faster than money!
              </p>
            </div>

          </div>
        </div>

        {/* 30-Day Money Habits Streak & Interactive Daily Checklist */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-amber-500 fill-amber-500" />
                <h4 className="text-lg font-black text-[#081a3d]">
                  Interactive Daily Money Habits Tracker
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Check off each habit daily to maintain your financial discipline streak.
              </p>
            </div>

            {/* Streak Counter Badge */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="px-4 py-2 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs flex items-center gap-2 shadow-2xs">
                <Flame size={16} className="text-amber-600 fill-amber-500" />
                <span>{habitStreak} Day Money Streak</span>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-xs">
                <span>{habitPercentage}% Today</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dailyHabits.map((habit) => (
              <div 
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  habit.done 
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold' 
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                  habit.done ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                }`}>
                  {habit.done && <Check size={13} />}
                </div>
                <span className="text-xs leading-relaxed">
                  {habit.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dedicated Daily Savings Tracker: Put down how much you save & Sums it up */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border-2 border-emerald-300 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider border border-emerald-300 mb-1.5">
                <PiggyBank size={14} className="text-emerald-700" />
                <span>Echo Plan Student Daily Savings Jar</span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-[#081a3d]">
                Log Your Daily Savings & Live Sum-Up Calculator
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Put down how much money you save every day. Echo Plan tracks your progress and automatically sums up your total accumulated wealth!
              </p>
            </div>

            {/* Total Accumulated Savings Sum Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-600 text-white shadow-md flex items-center gap-3.5 self-start sm:self-auto shrink-0 ring-2 ring-emerald-300">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <span className="text-[10.5px] uppercase font-black text-emerald-100 block">
                  Total Money Saved (Summed Up)
                </span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight">
                  ₦{totalSavedSum.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-200 block font-semibold">
                  {savingsEntries.length} Deposits Recorded
                </span>
              </div>
            </div>
          </div>

          {/* Form to put down daily savings */}
          <form onSubmit={handleAddSavings} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
            <div className="sm:col-span-5">
              <label className="text-[11px] font-black uppercase text-emerald-950 block mb-1">
                Savings Note / Goal
              </label>
              <input 
                type="text"
                required
                value={savingLabel}
                onChange={(e) => setSavingLabel(e.target.value)}
                placeholder="e.g. Saved 20% today, Skipped meat pie, Errand change"
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-xs font-bold text-slate-800 bg-emerald-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[11px] font-black uppercase text-emerald-950 block mb-1">
                Amount Saved (₦)
              </label>
              <input 
                type="number"
                min="1"
                required
                value={savingAmount}
                onChange={(e) => setSavingAmount(e.target.value)}
                placeholder="e.g. 500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-xs font-bold text-slate-800 bg-emerald-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-black uppercase text-emerald-950 block mb-1">
                Money Source
              </label>
              <select
                value={savingSource}
                onChange={(e) => setSavingSource(e.target.value)}
                className="w-full px-2.5 py-2.5 rounded-xl border border-emerald-300 text-xs font-bold text-slate-800 bg-emerald-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
              >
                <option value="Daily Allowance">Allowance</option>
                <option value="Snack Cutback">Snack Cutback</option>
                <option value="Canteen Change">Canteen Change</option>
                <option value="Home Reward">Home Reward</option>
                <option value="Holiday Gift">Holiday Gift</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <Plus size={15} />
                <span>Put Down Savings</span>
              </button>
            </div>
          </form>

          {/* List of saved deposits */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Your Savings Deposit Log</span>
              <span>Accumulated Wealth Sum: <strong className="text-emerald-700">₦{totalSavedSum.toLocaleString()}</strong></span>
            </div>

            <div className="divide-y divide-emerald-100 border border-emerald-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto bg-white">
              {savingsEntries.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between hover:bg-emerald-50/50 transition-colors text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0">
                      💰
                    </span>
                    <div>
                      <div className="font-black text-slate-800 flex items-center gap-1.5">
                        <span>{item.label}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                          {item.source}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[10.5px]">Recorded {item.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-emerald-700 text-sm">
                      +₦{item.amount.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSavings(item.id)}
                      className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                      title="Remove entry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {savingsEntries.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400">
                  No savings recorded yet. Use the form above to put down your first savings amount!
                </div>
              )}
            </div>
          </div>

          {/* ================================================================= */}
          {/* END-OF-MONTH WHOLE MONEY FORECAST & SAVINGS ANALYZER             */}
          {/* Requirement: "it helps students analyze the money and the whole   */}
          {/* money that will be in the end of the month"                       */}
          {/* ================================================================= */}
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#081a3d] via-[#0d2a5e] to-[#081a3d] text-white shadow-xl border-2 border-[#62c5fa]/30 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#62c5fa]/20 text-[#62c5fa] text-[11px] font-black uppercase tracking-wider border border-[#62c5fa]/30 mb-1.5">
                  <Sparkles size={14} className="text-[#62c5fa]" />
                  <span>Echo Plan Money Intelligence</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>End-of-Month Whole Money Analyzer</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Analyze your savings habits and see <strong>the whole money that will be in your hands</strong> by the end of {currentMonthName}.
                </p>
              </div>

              {/* Month Calendar Progress Badge */}
              <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-right self-start sm:self-auto">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  {currentMonthName} Timeline
                </div>
                <div className="text-sm font-black text-[#62c5fa]">
                  Day {currentDayOfMonth} of {daysInCurrentMonth}
                </div>
                <div className="text-[11px] text-emerald-300 font-semibold">
                  {daysRemainingInMonth} days remaining
                </div>
              </div>
            </div>

            {/* 4 Analytics Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              
              {/* 1. Money Saved So Far */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-slate-400 block">
                  1. Current Saved Wealth
                </span>
                <div className="text-2xl font-black text-emerald-400">
                  ₦{totalSavedSum.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-300 block">
                  {savingsEntries.length} deposits recorded
                </span>
              </div>

              {/* 2. Days Remaining */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-slate-400 block">
                  2. Days Left in Month
                </span>
                <div className="text-2xl font-black text-sky-300">
                  {daysRemainingInMonth} Days
                </div>
                <span className="text-[11px] text-slate-300 block">
                  Until end of {currentMonthName}
                </span>
              </div>

              {/* 3. Daily Pace */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-slate-400 block">
                  3. Projected Daily Pace
                </span>
                <div className="text-2xl font-black text-amber-300">
                  ₦{projectedDailyPace.toLocaleString()}
                  <span className="text-xs text-slate-300 font-normal"> / day</span>
                </div>
                <span className="text-[11px] text-slate-300 block">
                  +₦{(projectedDailyPace * daysRemainingInMonth).toLocaleString()} remaining
                </span>
              </div>

              {/* 4. THE WHOLE MONEY AT END OF MONTH (HERO) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/30 via-emerald-500/20 to-teal-500/20 border-2 border-amber-400/80 shadow-lg space-y-1 ring-2 ring-amber-400/30">
                <span className="text-[10.5px] uppercase font-black text-amber-300 block tracking-wide flex items-center justify-between">
                  <span>Whole Money at Month-End</span>
                  <span className="text-xs">💰</span>
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ₦{wholeMoneyEndOfMonth.toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-200 block font-bold">
                  Total Accumulated Wealth
                </span>
              </div>

            </div>

            {/* Interactive Daily Pace Selector */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-[#62c5fa]" />
                    <span>Test Different Daily Savings Paces:</span>
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Select or write how much you plan to save each day. Watch the whole month-end money recalculate:
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-[#62c5fa] bg-white/10 px-3 py-1 rounded-xl">
                  Pace: ₦{projectedDailyPace.toLocaleString()} / day
                </div>
              </div>

              {/* Quick Pace Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[200, 500, 1000, 2000].map((pace) => {
                  const isSelected = projectedDailyPace === pace;
                  const monthEnd = totalSavedSum + (pace * daysRemainingInMonth);
                  return (
                    <button
                      key={pace}
                      type="button"
                      onClick={() => handleUpdateDailyPace(pace)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#62c5fa] text-[#081a3d] border-[#62c5fa] font-black shadow-md'
                          : 'bg-white/10 hover:bg-white/15 text-white border-white/10 font-bold'
                      }`}
                    >
                      <div className="text-xs">Save ₦{pace.toLocaleString()} / day</div>
                      <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#081a3d]/80' : 'text-emerald-300'}`}>
                        End of Month: ₦{monthEnd.toLocaleString()}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Daily Pace Input */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <span className="text-[11px] font-bold text-slate-300 shrink-0">
                  Custom Daily Savings Pace:
                </span>
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₦</span>
                  <input
                    type="number"
                    min="10"
                    step="50"
                    value={projectedDailyPace}
                    onChange={(e) => handleUpdateDailyPace(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#62c5fa]"
                  />
                </div>
                <span className="text-[11px] text-slate-400">
                  = <strong>₦{(projectedDailyPace * daysRemainingInMonth).toLocaleString()}</strong> in {daysRemainingInMonth} days
                </span>
              </div>
            </div>

            {/* Monthly Target Goal Analysis */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-200">
                    Monthly Savings Target: ₦{monthlySavingsGoal.toLocaleString()}
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Projected Month-End Money: <strong>₦{wholeMoneyEndOfMonth.toLocaleString()}</strong> ({goalProgressPct}% of Target)
                  </p>
                </div>

                {/* Quick Target Presets */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Target Goals:</span>
                  {[10000, 15000, 25000, 50000].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleUpdateMonthlyGoal(t)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                        monthlySavingsGoal === t
                          ? 'bg-amber-400 text-slate-900 font-black'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      ₦{(t / 1000)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Dual Visual Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative flex">
                  {/* Current Saved Portion */}
                  <div 
                    style={{ width: `${Math.min(100, currentSavedPct)}%` }}
                    className="h-full bg-emerald-500 transition-all duration-500"
                    title={`Current Saved: ₦${totalSavedSum.toLocaleString()} (${currentSavedPct}%)`}
                  />
                  {/* Projected Remainder Portion */}
                  <div 
                    style={{ width: `${Math.min(100 - currentSavedPct, Math.max(0, goalProgressPct - currentSavedPct))}%` }}
                    className="h-full bg-amber-400/80 transition-all duration-500"
                    title={`Projected Addition: ₦${(projectedDailyPace * daysRemainingInMonth).toLocaleString()}`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10.5px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Saved So Far: ₦{totalSavedSum.toLocaleString()} ({currentSavedPct}%)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span>Projected Month-End: ₦{wholeMoneyEndOfMonth.toLocaleString()} ({goalProgressPct}%)</span>
                  </span>
                </div>
              </div>

              {/* Verdict Banner */}
              <div className={`p-3 rounded-xl border text-xs leading-relaxed flex items-center gap-2.5 ${
                goalSurplusOrDeficit >= 0
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
              }`}>
                {goalSurplusOrDeficit >= 0 ? (
                  <>
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    <div>
                      <strong>Goal Victory!</strong> At this pace, you will surpass your ₦{monthlySavingsGoal.toLocaleString()} target by <strong>+₦{goalSurplusOrDeficit.toLocaleString()}</strong> by the end of {currentMonthName}!
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} className="text-amber-400 shrink-0" />
                    <div>
                      <strong>Goal Target Shortfall:</strong> You are ₦{Math.abs(goalSurplusOrDeficit).toLocaleString()} short of your ₦{monthlySavingsGoal.toLocaleString()} goal. Increase your daily savings by <strong>₦{neededDailyPaceToHitGoal.toLocaleString()}/day</strong> for the remaining {daysRemainingInMonth} days to hit your target!
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Real-World Student Purchasing Power Guide */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs font-black uppercase text-[#62c5fa] tracking-wider">
                💡 What Your Projected Whole Money (₦{wholeMoneyEndOfMonth.toLocaleString()}) Can Realize at Month-End:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-emerald-300 font-bold block mb-0.5">📚 School Materials</span>
                  Full term exercise books, mathematical set, past question guides, and essential school study supplies.
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-sky-300 font-bold block mb-0.5">🔬 STEM & Maker Parts</span>
                  Components for your DIY quadcopter drone, solar charger cells, or robotics exploration kit.
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-amber-300 font-bold block mb-0.5">🏦 Independent Freedom</span>
                  Never needing to ask parents for petty snacks, phone data, or emergency school dues.
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 60-Second Daily Expense Log Book */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-black text-[#081a3d]">
                Student Daily Expense Ledger (The 60-Second Habit)
              </h4>
              <p className="text-xs text-slate-500">
                Log every single expenditure so you never ask "Where did my allowance go?".
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {expenseLog.length} Entries Recorded
            </span>
          </div>

          <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
                Item / Expense Description
              </label>
              <input 
                type="text"
                value={newExpenseName}
                onChange={(e) => setNewExpenseName(e.target.value)}
                placeholder="e.g. Notebook, Bus Fare, Soft Drink"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
                Amount (₦)
              </label>
              <input 
                type="number"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
                placeholder="e.g. 500"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
                Category
              </label>
              <select
                value={newExpenseCat}
                onChange={(e: any) => setNewExpenseCat(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-slate-50 focus:bg-white"
              >
                <option value="needs">Needs</option>
                <option value="wants">Wants</option>
                <option value="savings">Savings</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              >
                <Plus size={14} />
                <span>Add Record</span>
              </button>
            </div>
          </form>

          {/* List of expenses */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
            {expenseLog.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-xs">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                    item.category === 'savings' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : item.category === 'needs' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {item.category}
                  </span>
                  <span className="font-bold text-slate-800">{item.item}</span>
                  <span className="text-slate-400 text-[10.5px]">({item.date})</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-slate-900">
                    ₦{item.amount.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteExpense(item.id)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
