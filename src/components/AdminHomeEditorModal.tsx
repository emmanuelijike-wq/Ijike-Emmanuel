import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Sparkles, Check, RotateCcw, 
  Megaphone, School, Award, FileText, ArrowRight
} from 'lucide-react';
import { HomePageCustomization } from '../types';
import { DEFAULT_HOME_CUSTOMIZATION } from '../data/initialCustomization';

interface AdminHomeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: HomePageCustomization;
  onSave: (updated: HomePageCustomization) => void;
  adminName: string;
}

export const AdminHomeEditorModal: React.FC<AdminHomeEditorModalProps> = ({
  isOpen,
  onClose,
  customization,
  onSave,
  adminName
}) => {
  const [formData, setFormData] = useState<HomePageCustomization>(customization);

  useEffect(() => {
    if (isOpen) {
      setFormData(customization);
    }
  }, [isOpen, customization]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleResetDefaults = () => {
    setFormData(DEFAULT_HOME_CUSTOMIZATION);
    onSave(DEFAULT_HOME_CUSTOMIZATION);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#081a3d]/80 backdrop-blur-md animate-fade-up overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#081a3d] text-white p-5 sm:p-6 relative border-b border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-[#62c5fa] text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-indigo-400/30">
            <ShieldCheck size={14} /> Admin Home Page Control Panel
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Customize Home Page
          </h2>
          <p className="text-xs sm:text-sm text-[#c8daf3] mt-1">
            Logged in as <strong>{adminName}</strong>. Update the school announcement, hero motto, and academic goals displayed on the home page for all students.
          </p>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-left">
          
          {/* Section 1: School Announcement Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone size={16} className="text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  School / Class Announcement Banner
                </h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.announcementActive}
                  onChange={(e) => setFormData({ ...formData, announcementActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-2 text-xs font-bold text-slate-700">
                  {formData.announcementActive ? 'Visible' : 'Hidden'}
                </span>
              </label>
            </div>

            {formData.announcementActive && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Badge Label / Tag
                    </label>
                    <input
                      type="text"
                      value={formData.announcementTag}
                      onChange={(e) => setFormData({ ...formData, announcementTag: e.target.value })}
                      placeholder="e.g. Exam Notice, Term 3 Alert, Holiday"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Date / Frequency
                    </label>
                    <input
                      type="text"
                      value={formData.announcementDate}
                      onChange={(e) => setFormData({ ...formData, announcementDate: e.target.value })}
                      placeholder="e.g. Updated Today, Oct 2026"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Announcement Headline
                  </label>
                  <input
                    type="text"
                    required={formData.announcementActive}
                    value={formData.announcementTitle}
                    onChange={(e) => setFormData({ ...formData, announcementTitle: e.target.value })}
                    placeholder="e.g. Third Term Mock Examinations Begin Monday"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Announcement Details / Message to Students
                  </label>
                  <textarea
                    rows={2}
                    value={formData.announcementContent}
                    onChange={(e) => setFormData({ ...formData, announcementContent: e.target.value })}
                    placeholder="Explain key deadlines, homework guidance, or instructions..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Hero Titles & School Motto */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={15} className="text-[#1976d2]" />
              Hero Section Branding & Motto
            </h3>

            {/* Motto */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                <span>Top Hero Slogan / School Motto Badge</span>
                <span className="text-[10px] text-slate-400">Shown in glowing pill badge</span>
              </label>
              <input
                type="text"
                required
                value={formData.heroMotto}
                onChange={(e) => setFormData({ ...formData, heroMotto: e.target.value.toUpperCase() })}
                placeholder="e.g. PLAN TODAY • ACHIEVE TOMORROW or DISCIPLINE AND EXCELLENCE"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hero Subtitle
              </label>
              <input
                type="text"
                required
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                placeholder="e.g. Your Smart School Companion"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Hero Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hero Guidance Message / Description
              </label>
              <textarea
                rows={3}
                required
                value={formData.heroDescription}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                placeholder="Describe your school's vision or advice for students..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Section 3: School Name & Academic Term Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <School size={13} className="text-[#1976d2]" /> School / Institute Name
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                placeholder="e.g. Queen's College Lagos"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Award size={13} className="text-amber-500" /> Current Term Academic Goal
              </label>
              <input
                type="text"
                value={formData.termGoal}
                onChange={(e) => setFormData({ ...formData, termGoal: e.target.value })}
                placeholder="e.g. 100% Submission Rate on All Practicals"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Live Preview Bar */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5">
            <div className="text-[10px] text-[#62c5fa] font-extrabold uppercase tracking-wider">
              Live Preview Summary:
            </div>
            <div className="font-bold text-white">
              ✦ {formData.heroMotto}
            </div>
            <div className="text-slate-300 text-[11px]">
              {formData.heroSubtitle} • {formData.schoolName}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#081a3d] hover:bg-[#122e66] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Check size={16} className="text-[#62c5fa]" />
                <span>Save Changes to Home Page</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
