import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { HomeMotivationModal } from '../components/HomeMotivationModal';
import { TaskItem, HomePageCustomization, User } from '../types';
import { 
  Star, ArrowRight, ShieldCheck, Zap, Sparkles, 
  Megaphone, Edit3, School, Award, UserCheck, Compass, DollarSign, Heart
} from 'lucide-react';

interface HomePageProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onOpenQuickAdd: () => void;
  onNavigate: (page: string) => void;
  customization: HomePageCustomization;
  currentUser: User | null;
  onOpenAdminEditor: () => void;
  onOpenEditName: () => void;
  onMotivateMe?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  tasks,
  onToggleTask,
  onOpenQuickAdd,
  onNavigate,
  customization,
  currentUser,
  onOpenAdminEditor,
  onOpenEditName,
  onMotivateMe
}) => {
  const [isMotivationModalOpen, setIsMotivationModalOpen] = useState(false);

  const handleOpenMotivation = () => {
    if (onMotivateMe) {
      onMotivateMe();
    }
    setIsMotivationModalOpen(true);
  };
  const testimonials = [
    {
      quote: "Echo Plan completely changed how I prepare for AP Chemistry. The 25-minute Pomodoro sprints keep me from burning out, and checking off my habits daily feels awesome.",
      author: "Maya R.",
      role: "High School Junior • 4.0 GPA"
    },
    {
      quote: "My study group uses the daily planner every afternoon. We know exactly what assignments are due and we get everything finished before dinner!",
      author: "Jordan K.",
      role: "Sophomore Class President"
    },
    {
      quote: "The Active Recall tips and the habit streak tracker gave me the discipline I needed to boost my grades across all my STEM classes.",
      author: "Samantha L.",
      role: "Pre-Med Student"
    }
  ];

  return (
    <div>
      {/* Admin Quick Editor Ribbon (Visible for Sole Admin) */}
      {(currentUser?.role === 'admin' || currentUser?.role === 'student_admin') && (
        <div className="bg-[#0b1f47] text-white px-4 py-2.5 sm:px-8 border-b border-indigo-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#62c5fa] flex-shrink-0" />
            <span>
              <strong>Sole Administrator Mode:</strong> You are logged in as <strong>{currentUser.name}</strong>. You have permissions to customize home page text, manage student accounts, directives, and announcements.
            </span>
          </div>
          <button
            onClick={onOpenAdminEditor}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Edit3 size={13} />
            <span>Customize Home Page</span>
          </button>
        </div>
      )}

      {/* Personalized Student / User Welcome Greeting */}
      {currentUser && (
        <div className="bg-sky-50/90 border-b border-sky-100 px-4 py-2 sm:px-8 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span>👋 Welcome back,</span>
            <strong className="text-slate-900 font-bold">{currentUser.name}</strong>
            <span className="text-slate-400">•</span>
            <span className="text-[#1976d2] font-semibold">
              {currentUser.role === 'admin' || currentUser.role === 'student_admin' ? 'Sole Administrator' : 'Student Member'}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenEditName}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1976d2] hover:text-[#0b4d96] cursor-pointer hover:underline"
          >
            <Edit3 size={11} />
            <span>Change My Name</span>
          </button>
        </div>
      )}

      {/* Active School / Classroom Announcement Banner */}
      {customization.announcementActive && (
        <aside aria-label="School Announcement" className="bg-[#eef6ff] border-b border-blue-200/90 px-4 py-3 sm:px-8">
          <div className="max-w-[1250px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-start sm:items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10.5px] uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
                <Megaphone size={11} />
                {customization.announcementTag || 'Notice'}
              </span>
              <div className="text-xs sm:text-sm">
                <strong className="text-slate-900 font-bold mr-1">
                  {customization.announcementTitle}
                </strong>
                {customization.announcementContent && (
                  <span className="text-slate-600 hidden md:inline">
                    — {customization.announcementContent}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 self-end sm:self-auto">
              <span>{customization.announcementDate}</span>
              {(currentUser?.role === 'admin' || currentUser?.role === 'student_admin') && (
                <button
                  onClick={onOpenAdminEditor}
                  className="text-[#1976d2] hover:underline font-bold text-xs cursor-pointer"
                >
                  Edit Announcement
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* 1. Iconic Hero Section */}
      <HeroSection
        tasks={tasks}
        onToggleTask={onToggleTask}
        onOpenQuickAdd={onOpenQuickAdd}
        onMotivateMe={handleOpenMotivation}
        onGetStarted={() => onNavigate('planner')}
        customization={customization}
      />

      {/* 2. 4 Features Overview */}
      <FeaturesSection
        onSelectFeature={(featureKey) => onNavigate(featureKey)}
      />

      {/* 2.5 New Leadership, Character & Problem Solving Showcase Banner */}
      <section className="py-10 px-6 sm:px-10 lg:px-[7%] bg-gradient-to-r from-[#071a3d] via-[#0b295c] to-[#0f3b7d] text-white">
        <div className="max-w-[1250px] mx-auto rounded-3xl p-6 sm:p-10 border border-emerald-400/30 bg-white/[0.04] backdrop-blur-xs flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 lg:max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
              <Award size={14} />
              <span>Leadership, Character & Problem Solving</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Learn How to Master Life Skills: Money, Relationships & Extreme Responsibility
            </h2>
            <p className="text-xs sm:text-sm text-[#c8daf3] leading-relaxed">
              Empowering children and teenagers to become independent leaders and critical thinkers. Master budgeting with the 50/30/20 rule, resolve relationship disputes peacefully, honor elders with genuine respect, and take independent decisions with the 10-10-10 matrix.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-emerald-200 font-semibold">
              <span className="flex items-center gap-1.5">
                <DollarSign size={13} className="text-emerald-400" />
                <span>50/30/20 Money Rule</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Heart size={13} className="text-rose-400" />
                <span>Conflict De-escalation</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award size={13} className="text-amber-400" />
                <span>Extreme Ownership</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Compass size={13} className="text-sky-400" />
                <span>5-Step Decision Matrix</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('leadership')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#071a3d] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer active:scale-95"
            >
              <span>Explore Leadership Hub</span>
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('planner')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/20"
            >
              <span>Read Textbooks</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Daily Academic Workflow Showcase */}
      <section className="py-16 px-6 sm:px-10 lg:px-[7%] bg-[#f6f9ff]">
        <div className="max-w-[1250px] mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e2eaf4] shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#1976d2] text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles size={14} /> The Daily Routine
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#081a3d] tracking-tight mb-4">
                  How a Master Student Uses ECHO PLAN Every Day
                </h2>
                <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-slate-900 block text-sm">3:30 PM • The 5-Minute Brain Dump:</strong>
                      Enter your homework, lab readings, and project deadlines into the Daily Planner.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-slate-900 block text-sm">4:00 PM • Pomodoro Focus Sprints:</strong>
                      Activate the 25/5 study timer and pink noise to tackle the hardest subject first without distraction.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-slate-900 block text-sm">8:00 PM • Habit Check & Reflection:</strong>
                      Review today&apos;s habit streaks, pack your school bag, and celebrate your daily accomplishments.
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <button
                    onClick={() => onNavigate('planner')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1976d2] text-white font-bold rounded-full text-xs hover:bg-[#1565c0] shadow-md transition-all cursor-pointer"
                  >
                    Try the Planner Now <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => onNavigate('about')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
                  >
                    Read Our Philosophy →
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-[#081a3d] to-[#113166] text-white rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="text-xs uppercase font-extrabold tracking-widest text-[#62c5fa] mb-3 flex items-center justify-between">
                  <span>Student Snapshot</span>
                  {(currentUser?.role === 'admin' || currentUser?.role === 'student_admin') && (
                    <button
                      onClick={onOpenAdminEditor}
                      className="text-[10px] text-white/70 hover:text-white underline cursor-pointer"
                    >
                      Edit Goal
                    </button>
                  )}
                </div>
                <div className="text-xl font-bold mb-4">
                  &ldquo;Small steps today create a greater tomorrow.&rdquo;
                </div>
                <p className="text-xs text-[#c8daf3] leading-relaxed mb-6">
                  {customization.termGoal || 'Consistent students outperform intermittent geniuses. By building steady study rhythms, test anxiety is replaced by quiet confidence.'}
                </p>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#83bce1]">
                  <span>{customization.schoolName || 'Echo Plan Scholars'}</span>
                  <span className="font-bold text-[#62c5fa]">Grade A+ Target</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Student Reviews / Testimonials */}
      <section className="py-16 px-6 sm:px-10 lg:px-[7%] bg-white border-t border-slate-200">
        <div className="max-w-[1250px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1976d2]">Student Community</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081a3d] mt-1">
              Loved by Top Scholars Everywhere
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-[#f8fbff] rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="text-xs font-bold text-[#081a3d]">{t.author}</div>
                  <div className="text-[11px] text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Big Call to Action Banner */}
      <section className="py-16 px-6 sm:px-10 lg:px-[7%] bg-[#081a3d] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Take Control of Your School Day?
          </h2>
          <p className="text-sm sm:text-base text-[#c8daf3] max-w-xl mx-auto mb-8">
            Plan your homework, establish daily habits, and study smarter starting right now.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('planner')}
              className="px-8 py-4 bg-[#61c6fb] text-[#082044] font-extrabold text-sm rounded-full hover:shadow-[0_12px_25px_rgba(97,198,251,0.4)] transition-all cursor-pointer"
            >
              Open Daily Planner →
            </button>
            <button
              onClick={() => onNavigate('tips')}
              className="px-8 py-4 border border-white/40 text-white font-bold text-sm rounded-full hover:bg-white/10 transition-all cursor-pointer"
            >
              Explore Study Tools
            </button>
          </div>
        </div>
      </section>

      {/* Home Daily Academic Motivation Modal */}
      <HomeMotivationModal
        isOpen={isMotivationModalOpen}
        onClose={() => setIsMotivationModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
};

