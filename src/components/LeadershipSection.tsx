import React, { useState } from 'react';
import { Users, Target, Plus, CheckCircle2, Trophy, Compass, Star } from 'lucide-react';
import { StudentGoal } from '../types';
import { INITIAL_GOALS } from '../data/initialData';

export const LeadershipSection: React.FC = () => {
  const [goals, setGoals] = useState<StudentGoal[]>(INITIAL_GOALS);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('Nov 15');
  const [newCategory, setNewCategory] = useState('Academics');

  const [milestones, setMilestones] = useState([
    { id: 'm1', label: 'Spoke up and asked a clarifying question in class', done: true },
    { id: 'm2', label: 'Explained a homework problem to help a peer', done: true },
    { id: 'm3', label: 'Organized my weekly study calendar without procrastinating', done: false },
    { id: 'm4', label: 'Practiced public speaking for 10 minutes', done: false }
  ]);

  const toggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, done: !m.done } : m));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: StudentGoal = {
      id: `g-${Date.now()}`,
      title: newTitle.trim(),
      targetDate: newDate,
      progress: 10,
      category: newCategory
    };

    setGoals([...goals, newGoal]);
    setNewTitle('');
    setIsAdding(false);
  };

  const updateGoalProgress = (id: string, delta: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const next = Math.max(0, Math.min(100, g.progress + delta));
        return { ...g, progress: next };
      }
      return g;
    }));
  };

  return (
    <section id="leadership" className="py-16 sm:py-20 px-4 sm:px-8 lg:px-[7%] bg-white border-b border-[#e4ebf4]">
      <div className="max-w-[1250px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Users size={14} /> Become a Leader
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#081a3d] tracking-tight">
              Academic Ambitions & Leadership
            </h2>
            <p className="text-[#597092] text-base mt-2 max-w-xl">
              Build confidence, sharpen communication, and establish milestones that set you apart in school and beyond.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1976d2] text-white text-sm font-bold shadow-md hover:bg-[#1565c0] transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus size={18} />
            {isAdding ? 'Cancel' : 'Set New Milestone'}
          </button>
        </div>

        {/* Add Goal Form */}
        {isAdding && (
          <form onSubmit={handleAddGoal} className="bg-[#f8fbff] rounded-2xl p-6 mb-8 border-2 border-indigo-200 shadow-sm animate-fade-up">
            <h3 className="text-base font-bold text-[#081a3d] mb-4">Add Long-Term Student Goal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Goal Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead school debate club or Achieve straight A grades"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Target Date</label>
                <input
                  type="text"
                  placeholder="e.g. Dec 1"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
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
                Save Milestone
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Goals Column */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-[#081a3d] flex items-center gap-2 mb-4">
              <Target size={18} className="text-[#1976d2]" />
              Strategic Semester Goals
            </h3>

            {goals.map((goal) => (
              <div key={goal.id} className="bg-[#f8fbff] rounded-2xl p-5 border border-[#e2eaf4] shadow-xs hover:border-indigo-200 transition-all">
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div>
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {goal.category}
                    </span>
                    <h4 className="text-base font-bold text-[#13264b] mt-1.5">{goal.title}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    Target: {goal.targetDate}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1.5">
                    <span>Progress</span>
                    <span className="text-[#1976d2]">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Quick update:</span>
                  <button
                    onClick={() => updateGoalProgress(goal.id, -10)}
                    className="px-2 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-50 font-bold"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => updateGoalProgress(goal.id, 10)}
                    className="px-2 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-50 font-bold text-emerald-600"
                  >
                    +10%
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Leadership Checklist Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#081a3d] to-[#123168] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="text-amber-400" size={22} />
                <h3 className="text-lg font-bold text-white">
                  Student Leadership Habits
                </h3>
              </div>
              <p className="text-xs text-[#b0c8ea] leading-relaxed mb-6">
                Real leadership begins in your everyday classroom interactions. Check off the habits you practiced this week:
              </p>

              <div className="space-y-3">
                {milestones.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleMilestone(m.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      m.done
                        ? 'bg-white/15 border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                      m.done ? 'bg-amber-400 text-slate-900 font-bold' : 'border border-white/40'
                    }`}>
                      {m.done && <CheckCircle2 size={15} />}
                    </div>
                    <span className={`text-xs font-semibold leading-relaxed ${m.done ? 'line-through opacity-90' : ''}`}>
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/15 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                <Star size={18} />
              </div>
              <div className="text-[11px] text-[#b0c8ea] leading-normal italic">
                “Leadership is not about a title; it is about positive influence and taking initiative in your studies.”
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
