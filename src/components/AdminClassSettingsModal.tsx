import React, { useState, useEffect } from 'react';
import { ShieldCheck, School, X, Check, BookOpen, Clock, Target } from 'lucide-react';

export interface ClassSettings {
  motto: string;
  roomSchedule: string;
  targetPassRate: string;
  focusSubject: string;
}

interface AdminClassSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ClassSettings;
  onSave: (updated: ClassSettings) => void;
}

export const AdminClassSettingsModal: React.FC<AdminClassSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [formData, setFormData] = useState<ClassSettings>(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#081a3d]/80 backdrop-blur-md animate-fade-up overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#081a3d] text-white p-4 sm:p-6 relative border-b border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>

          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider mb-2 border border-indigo-400/30">
            <ShieldCheck size={13} /> Admin Options • Class Page
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            Class Cohort Settings & Options
          </h2>
          <p className="text-xs text-[#c8daf3] mt-1">
            As the verified administrator, customize class information, objectives, and schedule.
          </p>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <School size={14} className="text-indigo-600" />
              Class Academic Motto
            </label>
            <input
              type="text"
              required
              value={formData.motto}
              onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              placeholder="e.g. Leadership, Integrity & Academic Distinction"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BookOpen size={14} className="text-indigo-600" />
              Primary Subject Focus
            </label>
            <input
              type="text"
              required
              value={formData.focusSubject}
              onChange={(e) => setFormData({ ...formData, focusSubject: e.target.value })}
              placeholder="e.g. WAEC Science, Mathematics & Technical Studies"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock size={14} className="text-indigo-600" />
                Room & Schedule
              </label>
              <input
                type="text"
                required
                value={formData.roomSchedule}
                onChange={(e) => setFormData({ ...formData, roomSchedule: e.target.value })}
                placeholder="e.g. Senior Hall 302 • Mon-Fri 8:00 AM"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Target size={14} className="text-emerald-600" />
                Target Pass Rate
              </label>
              <input
                type="text"
                required
                value={formData.targetPassRate}
                onChange={(e) => setFormData({ ...formData, targetPassRate: e.target.value })}
                placeholder="e.g. 98% Distinction"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-2.5 sm:gap-3 sticky bottom-0 bg-white pb-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 sm:py-3 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 sm:py-3 bg-[#081a3d] hover:bg-[#122e66] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
            >
              <Check size={16} /> Save Class Options
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
