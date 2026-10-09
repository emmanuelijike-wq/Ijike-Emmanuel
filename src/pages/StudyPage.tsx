import React, { useState } from 'react';
import { StudyTipsSection } from '../components/StudyTipsSection';
import { PracticeExamCenter } from '../components/PracticeExamCenter';
import { 
  BookOpen, Brain, Sparkles, Compass, ShieldCheck, 
  Plus, Trash2, AlertCircle, CheckCircle2, Award, Clock
} from 'lucide-react';
import { User, ClassStudyGuideline } from '../types';
import { AdminStudyGuidelineModal } from '../components/AdminStudyGuidelineModal';
import { playSuccessSound } from '../utils/sound';

interface StudyPageProps {
  currentUser: User | null;
}

const INITIAL_GUIDELINES: ClassStudyGuideline[] = [
  {
    id: 'g-1',
    title: 'WAEC & NECO External Examination Directives',
    category: 'Examination & Core',
    directive: 'Complete the 50 Mock Multiple Choice Questions in the CBT Arena prior to external exams.',
    content: 'All candidates must practice with the English Language mock examination. Questions span Grammar, Vocabulary, Phonetics, Figures of Speech, Comprehension, and Sentence Usage.',
    urgency: 'high',
    postedBy: 'Victoria Okajoe (Administrator)',
    updatedAt: 'Today'
  },
  {
    id: 'g-2',
    title: 'WAEC Mathematics Formula Sheet & Scientific Calculator Protocol',
    category: 'Mathematics & Core',
    directive: 'Use FX-991ES or approved standard models. Memory reset will be inspected at door.',
    content: 'Review the official formula sheet for Trigonometric identities and Circle Geometry theorems. All practice past question solutions must detail step-by-step working to score full method marks.',
    urgency: 'high',
    postedBy: 'Victoria Okajoe (Administrator)',
    updatedAt: 'Yesterday'
  },
  {
    id: 'g-3',
    title: 'Physics & Chemistry Practical Lab Guidelines',
    category: 'Sciences & Practical',
    directive: 'All lab reports and titration calculations must be recorded to 2 decimal places.',
    content: 'Students attending tomorrow’s Science review should bring their logbooks and practical manuals. Tabulate observations before calculating standard deviation.',
    urgency: 'normal',
    postedBy: 'Victoria Okajoe (Administrator)',
    updatedAt: '3 days ago'
  }
];

export const StudyPage: React.FC<StudyPageProps> = ({ currentUser }) => {
  const [activeStudyTab, setActiveStudyTab] = useState<'exam_practice' | 'timer_tools' | 'guidelines'>('exam_practice');

  const [guidelines, setGuidelines] = useState<ClassStudyGuideline[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_class_study_guidelines');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_GUIDELINES;
  });

  const [isGuidelineModalOpen, setIsGuidelineModalOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'student_admin';

  const handleAddGuideline = (newGuideline: Omit<ClassStudyGuideline, 'id' | 'updatedAt'>) => {
    const item: ClassStudyGuideline = {
      ...newGuideline,
      id: `cg-${Date.now()}`,
      updatedAt: 'Just now'
    };
    const updated = [item, ...guidelines];
    setGuidelines(updated);
    try {
      localStorage.setItem('echo_plan_class_study_guidelines', JSON.stringify(updated));
    } catch {
      // fallback
    }
    playSuccessSound();
  };

  const handleDeleteGuideline = (id: string) => {
    const updated = guidelines.filter(g => g.id !== id);
    setGuidelines(updated);
    try {
      localStorage.setItem('echo_plan_class_study_guidelines', JSON.stringify(updated));
    } catch {
      // fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9ff]">
      {/* Dedicated Header */}
      <section className="relative py-14 px-6 sm:px-10 lg:px-[7%] bg-[#071a3d] text-white overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 75% 35%, rgba(98, 197, 250, 0.25), transparent 45%), linear-gradient(115deg, #071a3d, #0b2b62 60%, #164b91)'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-blue-400/40 rounded-full bg-white/5 text-[#bae6fd] text-xs font-black tracking-widest uppercase backdrop-blur-sm">
            <BookOpen size={14} className="text-[#62c5fa]" /> CBT EXAM PRACTICE & STUDY TOOLS
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            External Exam Practice & Revision Hub
          </h1>
          <p className="text-[#c8daf3] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Practice for external exams with authentic CBT mock tests. Answer all 50 questions with answers locked until completion, and automatically record your marks and performance.
          </p>

          {/* Quick Sub-Navigation Pills (Place not a page) */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStudyTab('exam_practice')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeStudyTab === 'exam_practice'
                  ? 'bg-[#62c5fa] text-[#081a3d] shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
              }`}
            >
              <Award size={16} />
              <span>CBT Practice Exam (SS2 English 50 Questions)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStudyTab('timer_tools')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeStudyTab === 'timer_tools'
                  ? 'bg-[#62c5fa] text-[#081a3d] shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
              }`}
            >
              <Clock size={16} />
              <span>Sprint Focus Timer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStudyTab('guidelines')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeStudyTab === 'guidelines'
                  ? 'bg-[#62c5fa] text-[#081a3d] shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
              }`}
            >
              <ShieldCheck size={16} />
              <span>Official Academic Guidelines</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="py-8 px-6 sm:px-10 lg:px-[7%] max-w-[1280px] mx-auto space-y-10">

        {/* 1. CBT EXAM PRACTICE ARENA */}
        {activeStudyTab === 'exam_practice' && (
          <div className="space-y-6 animate-fade-in">
            <PracticeExamCenter currentUser={currentUser} />
          </div>
        )}

        {/* 2. FOCUS TIMER & EVIDENCE-BASED STUDY TOOLS */}
        {activeStudyTab === 'timer_tools' && (
          <div className="animate-fade-in">
            <StudyTipsSection />
          </div>
        )}

        {/* 3. COHORT ACADEMIC GUIDELINES */}
        {activeStudyTab === 'guidelines' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1976d2] text-[11px] font-black uppercase tracking-wider mb-1.5">
                    <ShieldCheck size={13} /> Cohort Academic Directives
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#081a3d]">
                    Official Exam & Revision Guidelines
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isAdmin 
                      ? 'As verified Admin, you can publish and update official revision directives and exam rules.'
                      : 'Official directives and external exam preparations issued by the School Administrator.'}
                  </p>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => setIsGuidelineModalOpen(true)}
                    className="px-4 py-2.5 bg-[#081a3d] hover:bg-[#122e66] text-white text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer flex-shrink-0 active:scale-95"
                  >
                    <Plus size={15} className="text-[#62c5fa]" />
                    <span>Admin: Add Guideline</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guidelines.map((g) => (
                  <div
                    key={g.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      g.urgency === 'high'
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-[#f8fbff] border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                        {g.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {g.updatedAt}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteGuideline(g.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete this guideline"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-sm font-extrabold text-[#081a3d] mb-1.5">
                      {g.title}
                    </h3>

                    <div className="p-2 rounded-xl bg-white border border-slate-100 text-xs font-semibold text-indigo-900 mb-2.5 flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">👉</span>
                      <span>{g.directive}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {g.content}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-400 font-medium">
                      <span>Author: {g.postedBy}</span>
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Official Notice
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Admin Study Guideline Modal */}
      <AdminStudyGuidelineModal
        isOpen={isGuidelineModalOpen}
        onClose={() => setIsGuidelineModalOpen(false)}
        onAddGuideline={handleAddGuideline}
        adminName={currentUser?.name || 'Victoria Okajoe'}
      />
    </div>
  );
};
