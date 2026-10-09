import React, { useState } from 'react';
import { 
  BarChart3, Plus, Flame, Check, Sparkles, Droplets, 
  BookOpen, FileCheck, Briefcase, Award 
} from 'lucide-react';
import { HabitItem } from '../types';

interface HabitTrackerSectionProps {
  habits: HabitItem[];
  onToggleHabitDay: (habitId: string, dayIndex: number) => void;
  onAddHabit: (habit: Omit<HabitItem, 'id' | 'streak'>) => void;
}

export const HabitTrackerSection: React.FC<HabitTrackerSectionProps> = ({
  habits,
  onToggleHabitDay,
  onAddHabit
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFrequency, setNewFrequency] = useState('Daily');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // Let's assume today is Friday (index 4) or dynamically calculated
  const todayIndex = 4;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddHabit({
      title: newTitle.trim(),
      targetFrequency: newFrequency,
      completedDays: [false, false, false, false, false, false, false],
      iconName: 'Sparkles'
    });

    setNewTitle('');
    setIsAdding(false);
  };

  const getHabitIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-5 h-5 text-sky-500" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'FileCheck': return <FileCheck className="w-5 h-5 text-emerald-500" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-amber-500" />;
      default: return <Sparkles className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <section id="habits" className="py-16 sm:py-20 px-4 sm:px-8 lg:px-[7%] bg-white border-b border-[#e4ebf4]">
      <div className="max-w-[1250px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
              <BarChart3 size={14} /> Build Good Habits
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#081a3d] tracking-tight">
              Habit & Consistency Tracker
            </h2>
            <p className="text-[#597092] text-base mt-2 max-w-xl">
              Consistent small actions yield extraordinary academic growth. Track your weekly streaks and stay accountable.
            </p>
          </div>

          <button
            id="add-habit-btn"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#081a3d] text-white text-sm font-bold shadow-md hover:bg-[#102f66] transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus size={18} />
            {isAdding ? 'Cancel' : 'New Habit'}
          </button>
        </div>

        {/* Add Habit Inline Form */}
        {isAdding && (
          <form 
            onSubmit={handleAddSubmit}
            className="bg-[#f8fbff] rounded-2xl p-6 mb-8 border-2 border-sky-200 shadow-sm animate-fade-up"
          >
            <h3 className="text-base font-bold text-[#081a3d] mb-4">
              Create a New Academic or Wellness Habit
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Habit Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read textbook summary, Drink 1L water, Review vocabulary"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Target Frequency
                </label>
                <select
                  value={newFrequency}
                  onChange={(e) => setNewFrequency(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white"
                >
                  <option value="Daily">Daily (7 days)</option>
                  <option value="Weekdays">School Days (Mon-Fri)</option>
                  <option value="3 days/week">3 days / week</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200/60 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-bold bg-[#1976d2] text-white rounded-xl hover:bg-[#1565c0]"
              >
                Save Habit
              </button>
            </div>
          </form>
        )}

        {/* Habits Table / Card Layout */}
        <div className="bg-[#f8fbff] rounded-2xl p-4 sm:p-6 border border-[#e2eaf4] shadow-sm">
          {/* Day Headers */}
          <div className="hidden sm:grid grid-cols-12 gap-2 pb-4 mb-2 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
            <div className="col-span-5">Habit</div>
            <div className="col-span-2 text-center">Streak</div>
            <div className="col-span-5 grid grid-cols-7 text-center">
              {daysOfWeek.map((day, idx) => (
                <span key={day} className={idx === todayIndex ? 'text-sky-600 font-extrabold' : ''}>
                  {day} {idx === todayIndex && '•'}
                </span>
              ))}
            </div>
          </div>

          {/* Habit Items */}
          <div className="divide-y divide-slate-200/80">
            {habits.map((habit) => (
              <div 
                key={habit.id}
                className="py-4 flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-2 sm:items-center hover:bg-white rounded-xl px-2 transition-colors"
              >
                {/* Habit Name & Icon */}
                <div className="sm:col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center flex-shrink-0">
                    {getHabitIcon(habit.iconName)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#13264b]">{habit.title}</h4>
                    <span className="text-[11px] text-slate-500">{habit.targetFrequency}</span>
                  </div>
                </div>

                {/* Streak Badge */}
                <div className="sm:col-span-2 flex items-center sm:justify-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-extrabold">
                    <Flame size={14} className="text-amber-500 fill-amber-500 animate-pulse" />
                    <span>{habit.streak} Day Streak</span>
                  </div>
                </div>

                {/* 7 Days Checkpoints */}
                <div className="sm:col-span-5 grid grid-cols-7 gap-1.5 sm:gap-2">
                  {habit.completedDays.map((isDone, dayIdx) => (
                    <div key={dayIdx} className="flex flex-col items-center">
                      <span className="sm:hidden text-[9px] font-semibold text-slate-400 mb-1">
                        {daysOfWeek[dayIdx]}
                      </span>
                      <button
                        onClick={() => onToggleHabitDay(habit.id, dayIdx)}
                        title={`${daysOfWeek[dayIdx]}: Click to toggle`}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isDone
                            ? 'bg-[#398ddd] text-white shadow-xs hover:bg-[#2574c4]'
                            : dayIdx === todayIndex
                            ? 'border-2 border-dashed border-sky-400 bg-white hover:bg-sky-50'
                            : 'bg-slate-100 text-transparent hover:bg-slate-200'
                        }`}
                      >
                        {isDone && <Check size={16} strokeWidth={2.8} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Student Quote Bar */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Award size={16} className="text-sky-500" />
              Tip: Checking off habits every day forms automatic subconscious pathways in 21 days.
            </span>
            <span className="text-sky-700 font-bold bg-sky-100/60 px-2.5 py-1 rounded-md">
              Today: {daysOfWeek[todayIndex]}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
