import React, { useState } from 'react';
import { ShieldCheck, BookOpen, X, Check, AlertCircle, Sparkles } from 'lucide-react';
import { ClassStudyGuideline } from '../types';

interface AdminStudyGuidelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGuideline: (guideline: Omit<ClassStudyGuideline, 'id' | 'updatedAt'>) => void;
  adminName: string;
}

export const AdminStudyGuidelineModal: React.FC<AdminStudyGuidelineModalProps> = ({
  isOpen,
  onClose,
  onAddGuideline,
  adminName
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('WAEC Examination Prep');
  const [directive, setDirective] = useState('');
  const [content, setContent] = useState('');
  const [urgency, setUrgency] = useState<'high' | 'normal' | 'tip'>('normal');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddGuideline({
      title: title.trim(),
      category,
      directive: directive.trim() || 'Official Revision Directive',
      content: content.trim(),
      urgency,
      postedBy: adminName
    });

    setTitle('');
    setContent('');
    setDirective('');
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

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-indigo-400/30">
            <ShieldCheck size={13} /> Admin Options • Study Page
          </div>
          <h2 className="text-xl font-black text-white">
            Publish Class Study Guideline
          </h2>
          <p className="text-xs text-[#c8daf3] mt-1">
            As a school administrator, set official exam instructions and revision strategies for your classmates.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Guideline Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mathematics Formula Sheet Rules & Seating"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1976d2] bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="WAEC Examination Prep">WAEC Examination Prep</option>
                <option value="Sciences & Practical">Sciences & Practical</option>
                <option value="Mathematics & Core">Mathematics & Core</option>
                <option value="General Study Rules">General Study Rules</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Priority Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="normal">Normal Guideline</option>
                <option value="high">High Priority (Urgent)</option>
                <option value="tip">Study Tip & Strategy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              One-Line Action Directive
            </label>
            <input
              type="text"
              value={directive}
              onChange={(e) => setDirective(e.target.value)}
              placeholder="e.g. Bring scientific calculator model FX-991ES or similar only"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Full Instructions & Guidance
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Explain the required preparation steps and venue rules..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white leading-relaxed"
            />
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
              className="flex-1 py-3 bg-[#081a3d] hover:bg-[#122e66] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check size={16} /> Publish Guideline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
