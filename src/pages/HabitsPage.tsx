import React, { useState, useEffect } from 'react';
import { HabitTrackerSection } from '../components/HabitTrackerSection';
import { DroneTechMakerSection } from '../components/DroneTechMakerSection';
import { HabitItem, User, ClassHabitChallenge, ExamRedFlagStrike } from '../types';
import { 
  BarChart3, Flame, Sparkles, CheckCircle2, ShieldCheck, Settings, Plus, 
  Award, Target, Flag, AlertTriangle, ShieldAlert, Cpu, Layers, Eye
} from 'lucide-react';
import { AdminHabitChallengeModal } from '../components/AdminHabitChallengeModal';
import { playSuccessSound } from '../utils/sound';

interface HabitsPageProps {
  habits: HabitItem[];
  onToggleHabitDay: (habitId: string, dayIndex: number) => void;
  onAddHabit: (habit: Omit<HabitItem, 'id' | 'streak'>) => void;
  currentUser: User | null;
}

const DEFAULT_HABIT_CHALLENGE: ClassHabitChallenge = {
  id: 'challenge-waec-1',
  title: '90-Min Daily Mathematics & Science Drill',
  description: 'Class cohort daily revision sprint focusing on WAEC past questions and active recall problem sets.',
  targetDays: 5,
  category: 'Academics',
  bonusPoints: 100,
  iconName: 'BookOpen',
  active: true,
  setBy: 'Victoria Okajoe (Sole Administrator)',
  updatedAt: 'Today'
};

export const HabitsPage: React.FC<HabitsPageProps> = ({
  habits,
  onToggleHabitDay,
  onAddHabit,
  currentUser
}) => {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [activeHabitTab, setActiveHabitTab] = useState<'all' | 'habits' | 'drone'>('all');
  const [challenge, setChallenge] = useState<ClassHabitChallenge>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_class_habit_challenge');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_HABIT_CHALLENGE;
  });

  // Disciplinary Red Flag Strike Penalty state
  const [activeStrike, setActiveStrike] = useState<ExamRedFlagStrike | null>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_exam_strike');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('echo_plan_exam_strike');
        setActiveStrike(saved ? JSON.parse(saved) : null);
      } catch {
        setActiveStrike(null);
      }
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const [adoptedMessage, setAdoptedMessage] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'student_admin';

  const handleDismissStrike = () => {
    setActiveStrike(null);
    try {
      localStorage.removeItem('echo_plan_exam_strike');
      localStorage.removeItem('echo_plan_habit_red_flag_penalty');
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
    playSuccessSound();
  };

  const handleSaveChallenge = (updated: ClassHabitChallenge) => {
    setChallenge(updated);
    try {
      localStorage.setItem('echo_plan_class_habit_challenge', JSON.stringify(updated));
    } catch {
      // fallback
    }
    playSuccessSound();
  };

  const handleAdoptChallenge = () => {
    // Check if already in habits
    const existing = habits.find(h => (h.title || '').toLowerCase() === (challenge.title || '').toLowerCase());
    if (existing) {
      setAdoptedMessage('This challenge is already in your daily habit tracker!');
      setTimeout(() => setAdoptedMessage(null), 3000);
      return;
    }

    onAddHabit({
      title: challenge.title,
      completedDays: [false, false, false, false, false, false, false],
      targetFrequency: `${challenge.targetDays} days / week`,
      iconName: challenge.iconName
    });

    playSuccessSound();
    setAdoptedMessage(`Added "${challenge.title}" to your active tracker! (+${challenge.bonusPoints} pts target)`);
    setTimeout(() => setAdoptedMessage(null), 4000);
  };

  const totalStreaks = habits.reduce((acc, h) => acc + h.streak, 0);
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  return (
    <div className="min-h-screen bg-[#f6f9ff]">
      {/* Dedicated Header */}
      <section className="relative py-16 px-6 sm:px-10 lg:px-[7%] bg-[#071a3d] text-white overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 75% 35%, rgba(16, 185, 129, 0.25), transparent 45%), linear-gradient(115deg, #071a3d, #0b2b62 60%, #164b91)'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-400/40 rounded-full bg-white/5 text-[#a7f3d0] text-xs font-bold tracking-widest uppercase mb-2 backdrop-blur-sm">
            <BarChart3 size={14} className="text-emerald-400" /> BUILD GOOD HABITS & PRACTICAL SKILLS
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
            Daily Habits, Strikes & Tech Devices
          </h1>
          <p className="text-[#c8daf3] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Atomic routines that compound into exceptional academic and personal success. Explore optional tech devices like building drones, adopt daily challenges, and maintain your clean streak.
          </p>

          {/* Module Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveHabitTab('all')}
              className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                activeHabitTab === 'all'
                  ? 'bg-emerald-400 text-[#071a3d] font-black scale-102 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Layers size={14} />
              <span>All Modules</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveHabitTab('habits')}
              className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                activeHabitTab === 'habits'
                  ? 'bg-emerald-400 text-[#071a3d] font-black scale-102 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Flame size={14} />
              <span>Daily Habits & Strikes</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveHabitTab('drone')}
              className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                activeHabitTab === 'drone'
                  ? 'bg-sky-400 text-[#071a3d] font-black scale-102 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Cpu size={14} />
              <span>Drone & Tech Devices (Optional)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Official Disciplinary Red Flag Strike Penalty on Daily Habits */}
      {activeStrike && (
        <section className="py-5 px-6 sm:px-10 lg:px-[7%] bg-gradient-to-r from-[#4d0707] via-rose-900 to-[#310606] text-white border-b-2 border-rose-500 shadow-md animate-fade-in">
          <div className="max-w-[1250px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-2xl shrink-0 border border-rose-400/50 shadow-md">
                🚩
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10.5px] uppercase tracking-wider border border-rose-400/50">
                    Daily Habit Red Flag Strike Active
                  </span>
                  <span className="text-rose-200 text-xs font-semibold">
                    {activeStrike.studentName} • Infraction: {activeStrike.dateStr}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Exam Procedure Violation: Habit Streak Struck Down
                </h3>
                <p className="text-xs sm:text-sm text-rose-100 max-w-3xl leading-relaxed">
                  You went outside or switched away from the active 30-minute CBT practice exam room. As per academic discipline regulations, 
                  <strong> you have been flagged with a Red Flag Strike</strong> and your daily habit consistency score has been docked to enforce exam procedures.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={handleDismissStrike}
                className="px-4 py-2.5 rounded-xl bg-white text-rose-950 hover:bg-rose-100 font-black text-xs transition-all shadow-md cursor-pointer active:scale-95"
              >
                Acknowledge Disciplinary Strike
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Admin Habit Challenge Options Banner */}
      {challenge.active && (
        <section className="py-4 px-6 sm:px-10 lg:px-[7%] bg-gradient-to-r from-emerald-900 via-[#0a3523] to-[#081a3d] text-white border-b border-emerald-500/30">
          <div className="max-w-[1250px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Flame size={24} className="text-amber-400 fill-amber-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                    Official Class Cohort Challenge
                  </span>
                  <span className="text-xs text-emerald-200/80">
                    Target: {challenge.targetDays} Days / Wk • +{challenge.bonusPoints} Pts
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                  {challenge.title}
                </h3>
                <p className="text-xs text-emerald-100/90 line-clamp-1 max-w-2xl">
                  {challenge.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto">
              {/* If Admin: can change this option! */}
              {isAdmin ? (
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="px-4 py-2 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-emerald-200 active:scale-95"
                  title="Admin Option: Edit or change this challenge for everyone"
                >
                  <Settings size={14} className="text-emerald-700" />
                  <span>Admin: Change Challenge</span>
                </button>
              ) : (
                <button
                  onClick={handleAdoptChallenge}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus size={14} />
                  <span>+ Adopt Challenge into My Habits</span>
                </button>
              )}
            </div>
          </div>

          {adoptedMessage && (
            <div className="max-w-[1250px] mx-auto mt-2 text-xs text-emerald-200 font-semibold bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-400/30 animate-fade-up">
              ✓ {adoptedMessage}
            </div>
          )}
        </section>
      )}

      {/* Streak Dashboard Bar */}
      <section className="py-8 px-6 sm:px-10 lg:px-[7%] bg-white border-b border-slate-200">
        <div className={`max-w-[1250px] mx-auto grid grid-cols-1 ${activeStrike ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-6`}>
          {activeStrike && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
                🚩
              </div>
              <div>
                <div className="text-xl font-black text-rose-700">1 Red Flag</div>
                <div className="text-xs font-semibold text-rose-900">CBT Procedure Strike</div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-[#f8fbff] border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Flame size={24} className="fill-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#081a3d]">
                {activeStrike ? Math.max(0, longestStreak - 1) : longestStreak} Days
              </div>
              <div className="text-xs font-semibold text-slate-500">
                {activeStrike ? 'Streak (Docked by Strike)' : 'Longest Active Streak'}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8fbff] border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-[#081a3d]">{habits.length} Habits</div>
              <div className="text-xs font-semibold text-slate-500">Active Daily Routines</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8fbff] border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-[#081a3d]">{totalStreaks} Check-ins</div>
              <div className="text-xs font-semibold text-slate-500">Total Consistency Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Habit Tracker & Habit Stacking Section */}
      {(activeHabitTab === 'all' || activeHabitTab === 'habits') && (
        <>
          <HabitTrackerSection
            habits={habits}
            onToggleHabitDay={onToggleHabitDay}
            onAddHabit={onAddHabit}
          />

          {/* Habit Stacking Strategy Guide */}
          <section className="py-14 px-6 sm:px-10 lg:px-[7%] max-w-[1250px] mx-auto">
            <div className="bg-gradient-to-r from-emerald-950 to-[#071a3d] text-white rounded-3xl p-8 sm:p-12 shadow-lg">
              <div className="max-w-3xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                  The Science of Habit Stacking
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-4">
                  How to never miss a daily study routine
                </h2>
                <p className="text-sm text-emerald-100 leading-relaxed mb-6">
                  Anchor a new habit onto something you already do without thinking. For example:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-200">
                  <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                    “After I pour my afternoon glass of water, I will immediately open Echo Plan and check today&apos;s assignments.”
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                    “After I finish dinner, I will immediately review 15 minutes of flashcards before watching television.”
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Tech Device Workshop & Drone Maker Section (Optional Suggestion - Not a must) */}
      {(activeHabitTab === 'all' || activeHabitTab === 'drone') && (
        <section id="drone-maker" className="py-8 px-4 sm:px-8 lg:px-[7%] max-w-[1250px] mx-auto">
          <DroneTechMakerSection onAddHabit={onAddHabit} />
        </section>
      )}

      {/* Admin Habit Challenge Modal */}
      <AdminHabitChallengeModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        challenge={challenge}
        onSave={handleSaveChallenge}
      />
    </div>
  );
};

