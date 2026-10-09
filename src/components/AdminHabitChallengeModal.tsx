import React, { useState, useEffect } from 'react';
import { ShieldCheck, Flame, X, Check, Sparkles, Target, Award } from 'lucide-react';
import { ClassHabitChallenge } from '../types';

interface AdminHabitChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: ClassHabitChallenge;
  onSave: (updated: ClassHabitChallenge) => void;
}

export const AdminHabitChallengeModal: React.FC<AdminHabitChallengeModalProps> = ({
  isOpen,
  onClose,
  challenge,
  onSave
}) => {
  const [formData, setFormData] = useState<ClassHabitChallenge>(challenge);

  useEffect(() => {
    setFormData(challenge);
  }, [challenge, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081a3d]/80 backdrop-blur-md animate-fade-up overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#081a3d] text-white p-6 relative border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-emerald-400/30">
            <ShieldCheck size={13} /> Admin Options • Habits Page
          </div>
          <h2 className="text-xl font-black text-white">
            Change Class Habit Challenge
          </h2>
          <p className="text-xs text-[#c8daf3] mt-1">
            As a class administrator, update the official habit challenge for your cohort.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Flame size={14} className="text-amber-500" />
              Challenge Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 90-Min Daily Past Questions Sprint"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Description & Objectives for Classmates
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain why this habit is crucial for upcoming exams..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 bg-white leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Target size={14} className="text-indigo-600" />
                Target Days Per Week
              </label>
              <select
                value={formData.targetDays}
                onChange={(e) => setFormData({ ...formData, targetDays: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white"
              >
                <option value={3}>3 Days / Week (Mild)</option>
                <option value={4}>4 Days / Week (Moderate)</option>
                <option value={5}>5 Days / Week (Recommended)</option>
                <option value={6}>6 Days / Week (Intense)</option>
                <option value={7}>7 Days / Week (Daily Mastery)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Award size={14} className="text-amber-500" />
                Bonus Study Points
              </label>
              <input
                type="number"
                min={10}
                max={500}
                step={10}
                value={formData.bonusPoints}
                onChange={(e) => setFormData({ ...formData, bonusPoints: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Active Status</span>
              <span className="text-[11px] text-slate-500">Show this challenge on the Habits page</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
