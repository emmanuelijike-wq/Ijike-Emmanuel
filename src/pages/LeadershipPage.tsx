import React, { useState } from 'react';
import { 
  Award, Compass, DollarSign, Cpu, Heart, CheckCircle2, 
  ArrowRight, Sparkles, BookOpen, Lightbulb, Users, 
  ShieldCheck, HelpCircle, Check, AlertCircle, Play, 
  PlusCircle, Bookmark, RefreshCw, ChevronRight, Target, Plus, Trophy,
  Trash2
} from 'lucide-react';
import { 
  ReadingBook, 
  getStoredReadingBooksForStream, 
  deleteCustomReadingBook,
  TopicLessonPlan,
  getLessonPlanForTopic 
} from '../data/readingBooksData';
import { TopicLessonPlanModal } from '../components/TopicLessonPlanModal';
import { StudentMoneyMasterySection } from '../components/StudentMoneyMasterySection';
import { LeadershipRelativeStudiesSection } from '../components/LeadershipRelativeStudiesSection';
import { LifeResponsibilitySection } from '../components/LifeResponsibilitySection';
import { playSuccessSound } from '../utils/sound';
import { User, StudentGoal } from '../types';
import { INITIAL_GOALS } from '../data/initialData';

interface LeadershipPageProps {
  currentUser?: User | null;
  onNavigate?: (page: string) => void;
  onAddStudyTask?: (task: { title: string; category: any; time: string; priority: any }) => void;
}

export const LeadershipPage: React.FC<LeadershipPageProps> = ({
  currentUser,
  onNavigate,
  onAddStudyTask
}) => {
  const [selectedTopicPlan, setSelectedTopicPlan] = useState<TopicLessonPlan | null>(null);
  const [selectedTopicBook, setSelectedTopicBook] = useState<ReadingBook | null>(null);
  const [activeTab, setActiveTab] = useState<'money' | 'studies' | 'responsibility' | 'disciplines' | 'goals' | 'books' | 'simulator'>('money');

  // Interactive Budget Simulator State
  const [incomeInput, setIncomeInput] = useState<number>(10000);
  const [savingsPercent, setSavingsPercent] = useState<number>(20);
  const [testItemPrice, setTestItemPrice] = useState<number>(3500);

  // Interactive Conflict Scenario Simulator
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number>(0);
  const [scenarioChoice, setScenarioChoice] = useState<number | null>(null);

  // Leadership & Student Goals
  const [goals, setGoals] = useState<StudentGoal[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_student_goals');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_GOALS;
  });

  const [milestones, setMilestones] = useState(() => {
    try {
      const saved = localStorage.getItem('echo_plan_leadership_milestones');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { id: 'm1', label: 'Applied 10-second calm breathing before reacting to conflict', done: true },
      { id: 'm2', label: 'Explained a homework problem or lesson method to a classmate', done: true },
      { id: 'm3', label: 'Saved 20% of pocket money using the 50/30/20 rule', done: false },
      { id: 'm4', label: 'Performed house chores proactively without being reminded', done: false },
      { id: 'm5', label: 'Used the 10-10-10 rule to solve a tough personal dilemma', done: false }
    ];
  });

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('End of Term');
  const [newGoalCategory, setNewGoalCategory] = useState('Personal Leadership');

  const toggleMilestone = (id: string) => {
    setMilestones((prev: any[]) => {
      const updated = prev.map(m => m.id === id ? { ...m, done: !m.done } : m);
      localStorage.setItem('echo_plan_leadership_milestones', JSON.stringify(updated));
      return updated;
    });
    playSuccessSound();
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newGoal: StudentGoal = {
      id: `g-${Date.now()}`,
      title: newGoalTitle.trim(),
      targetDate: newGoalDate,
      progress: 15,
      category: newGoalCategory
    };

    const updated = [...goals, newGoal];
    setGoals(updated);
    localStorage.setItem('echo_plan_student_goals', JSON.stringify(updated));
    setNewGoalTitle('');
    setIsAddingGoal(false);
    playSuccessSound();
  };

  const updateGoalProgress = (id: string, delta: number) => {
    setGoals(prev => {
      const updated = prev.map(g => {
        if (g.id === id) {
          const next = Math.max(0, Math.min(100, g.progress + delta));
          return { ...g, progress: next };
        }
        return g;
      });
      localStorage.setItem('echo_plan_student_goals', JSON.stringify(updated));
      return updated;
    });
  };

  // Independence & Leadership books with state for dynamic deletion by admin
  const [leadershipBooks, setLeadershipBooks] = useState<ReadingBook[]>(() => 
    getStoredReadingBooksForStream('life_skills')
  );

  const isAdmin = currentUser?.role === 'admin';

  const handleDeleteLeadershipBook = (bookId: string) => {
    if (!confirm('Are you sure you want to remove this book from the Leadership Library?')) return;
    deleteCustomReadingBook(bookId);
    setLeadershipBooks(prev => prev.filter(b => b.id !== bookId));
    playSuccessSound();
  };

  const SCENARIOS = [
    {
      id: 'scen-1',
      title: 'The Borrowed Textbook Dilemma',
      description: 'Your close classmate borrowed your essential physics textbook without asking and forgot it at home on homework submission day.',
      options: [
        {
          label: 'Option A: Yell in class and accuse them of stealing',
          type: 'destructive',
          result: 'Triggers public humiliation, defensive shouting, damages friendship, and teacher penalizes both students for disruption.'
        },
        {
          label: 'Option B: Silent treatment and secretly taking their book tomorrow',
          type: 'passive',
          result: 'Passive-aggressive revenge creates toxic tension, escalates mistrust, and doesn’t solve the missing homework.'
        },
        {
          label: 'Option C: Calm 1-on-1 I-Statement & firm boundary',
          type: 'constructive',
          result: '“I felt stressed when I couldn’t find my textbook this morning because homework was due. I value our friendship, but I need you to ask first and bring it tomorrow.” Restores boundary with dignity!'
        }
      ]
    },
    {
      id: 'scen-2',
      title: 'Peer Pressure vs. WAEC Exam Preparation',
      description: 'Your best friends are going to a trendy party the night before a crucial WAEC mock test. They call you boring if you stay home.',
      options: [
        {
          label: 'Option A: Go to party, stay late, and gamble on the test',
          type: 'destructive',
          result: '10-minute fun; 10-month regret over failed test and damaged mock rankings. Surrendering your future for 2 hours of peer validation.'
        },
        {
          label: 'Option B: Apply 10-10-10 Rule: Stay home, study, propose weekend hangout',
          type: 'constructive',
          result: 'Text: “Wish I could be there, but I need to ace this mock. Let’s celebrate together this Saturday!” Respects your future, keeps true friends.'
        }
      ]
    },
    {
      id: 'scen-3',
      title: 'Parent Misunderstanding & House Chores',
      description: 'Your mother arrives home exhausted and finds the dishes unwashed because you were studying for an exam. She is angry.',
      options: [
        {
          label: 'Option A: Argue that studying is more important than plates',
          type: 'destructive',
          result: 'Shows disrespect and ingratitude for parents’ sacrifices; creates a tense household environment.'
        },
        {
          label: 'Option B: Extreme Ownership: Apologize respectfully & wash them immediately',
          type: 'constructive',
          result: '“Mom, I am sorry. You shouldn’t meet a messy kitchen after a long day. Please rest; I will clean everything in 15 minutes.” De-escalates instantly and earns tremendous adult respect.'
        }
      ]
    }
  ];

  const handleOpenLessonPlan = (book: ReadingBook, topicTitle: string) => {
    const plan = getLessonPlanForTopic(book, topicTitle);
    setSelectedTopicPlan(plan);
    setSelectedTopicBook(book);
    playSuccessSound();
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-900 pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#071a3d] via-[#0b2b62] to-[#124b91] text-white py-16 px-4 sm:px-8 lg:px-[7%] relative overflow-hidden">
        <div className="max-w-[1250px] mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
            <Award size={14} />
            <span>Echo Plan Leadership & Youth Mastery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl leading-tight">
            Leadership
          </h1>

          <p className="text-sm sm:text-base text-[#c8daf3] max-w-2xl leading-relaxed">
            True leadership starts with self-mastery: taking independent decisions, managing money responsibly, resolving relationship conflicts with composure, and embodying deep personal respect and extreme ownership.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('money')}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
                activeTab === 'money'
                  ? 'bg-emerald-500 text-[#071a3d]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <DollarSign size={14} />
              <span>Daily Savings & Money Tracker</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('studies')}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
                activeTab === 'studies'
                  ? 'bg-emerald-500 text-[#071a3d]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Sparkles size={14} />
              <span>Relative Studies & Science</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('responsibility')}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
                activeTab === 'responsibility'
                  ? 'bg-emerald-500 text-[#071a3d]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Life Responsibility & Ownership</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('disciplines')}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-sm ${
                activeTab === 'disciplines'
                  ? 'bg-emerald-500 text-[#071a3d]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              4 Core Disciplines
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('goals')}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-sm ${
                activeTab === 'goals'
                  ? 'bg-emerald-500 text-[#071a3d]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Milestones & Goals ({milestones.filter(m => m.done).length}/{milestones.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('books')}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-sm ${
                activeTab === 'books'
                  ? 'bg-emerald-500 text-[#071a3d]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Leadership Library ({leadershipBooks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-sm ${
                activeTab === 'simulator'
                  ? 'bg-emerald-500 text-[#071a3d]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Interactive Simulators
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-8 mt-10 space-y-12">

        {/* =================================================================== */}
        {/* TAB A: HOW TO SAVE MONEY & GROW MONEY HABITS                        */}
        {/* =================================================================== */}
        {activeTab === 'money' && (
          <StudentMoneyMasterySection />
        )}

        {/* =================================================================== */}
        {/* TAB B: RELATIVE STUDIES & BEHAVIORAL SCIENCE LAB                    */}
        {/* =================================================================== */}
        {activeTab === 'studies' && (
          <LeadershipRelativeStudiesSection />
        )}

        {/* =================================================================== */}
        {/* TAB C: HOW TO BE RESPONSIBLE IN LIFE                                */}
        {/* =================================================================== */}
        {activeTab === 'responsibility' && (
          <LifeResponsibilitySection />
        )}

        {/* =================================================================== */}
        {/* TAB 1: 4 CORE LEADERSHIP DISCIPLINES                                */}
        {/* =================================================================== */}
        {activeTab === 'disciplines' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Pillars of Self-Mastery
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#081a3d]">
                The Four Foundational Disciplines of a Young Leader
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Click on any discipline to study its step-by-step problem-solving methods, real-life examples, and decision matrices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Money & Financial Independence */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shadow-xs">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Leadership Discipline 1
                    </span>
                    <h3 className="text-xl font-black text-[#081a3d] mt-1.5">
                      Money Management & Financial Independence
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      How to budget allowance with the 50/30/20 rule, differentiate needs from wants, eliminate impulsive peer spending with the 24-Hour Rule, and never borrow out of desperation.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                    <strong className="text-emerald-950 font-bold block">Key Method: The 50/30/20 Student Rule</strong>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-white border border-emerald-100">
                        <span className="font-black text-emerald-700 block">50%</span>
                        <span className="text-[10px] text-slate-600">Needs (Books & Transport)</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-emerald-100">
                        <span className="font-black text-indigo-700 block">30%</span>
                        <span className="text-[10px] text-slate-600">Wants (Treats & Fun)</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-emerald-100">
                        <span className="font-black text-amber-700 block">20%</span>
                        <span className="text-[10px] text-slate-600">Savings (Independence)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (leadershipBooks[0]) {
                        handleOpenLessonPlan(leadershipBooks[0], 'Budgeting with the 50/30/20 Rule & Taking Independent Money Decisions');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>Open Money Lesson Plan</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('money')}
                    className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Full Money Habits & Savings Masterclass</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* 2. Relationships & Conflict Resolution */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 hover:border-rose-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black shadow-xs">
                    <Heart size={24} />
                  </div>
                  <div>
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Leadership Discipline 2
                    </span>
                    <h3 className="text-xl font-black text-[#081a3d] mt-1.5">
                      Healthy Relationships & Conflict Resolution
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      How to express grievances without yelling using "I-Statements", de-escalate tension with parents, handle peer pressure, and establish clean personal boundaries.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2 text-xs">
                    <strong className="text-rose-950 font-bold block">Key Formula: The "I-Statement" Method</strong>
                    <p className="text-slate-700 italic bg-white p-2.5 rounded-xl border border-rose-100 font-mono text-[11px]">
                      “I feel [Emotion] when [Action occurs], because [Reason]. What I need moving forward is [Respectful Request].”
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (leadershipBooks[1]) {
                        handleOpenLessonPlan(leadershipBooks[1], 'Resolving Relationship Conflicts Peacefully & Setting Healthy Boundaries');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>Open Relationship Lesson Plan</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('simulator')}
                    className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
                  >
                    Try Conflict Simulator →
                  </button>
                </div>
              </div>

              {/* 3. Respect & Personal Responsibility */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 hover:border-amber-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black shadow-xs">
                    <Award size={24} />
                  </div>
                  <div>
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Leadership Discipline 3
                    </span>
                    <h3 className="text-xl font-black text-[#081a3d] mt-1.5">
                      Character, Respect & Personal Responsibility
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      Taking 100% extreme ownership of your life. Respecting parents and teachers as an act of inner strength, eliminating excuses, and doing chores proactively before being asked.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                    <strong className="text-amber-950 font-bold block">The Equation of Responsibility</strong>
                    <div className="p-2.5 bg-white rounded-xl border border-amber-100 font-mono text-xs text-center font-bold text-amber-900">
                      Event (E) + Response (R) = Outcome (O)
                    </div>
                    <span className="text-[10.5px] text-slate-600 block text-center">
                      Immature people blame the Event. Leaders master their Response.
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (leadershipBooks[2]) {
                        handleOpenLessonPlan(leadershipBooks[2], 'Character, Moral Respect & Personal Responsibility: The Young Leader\'s Guide');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>Open Respect & Responsibility Plan</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('responsibility')}
                    className="text-xs font-bold text-amber-800 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Life Responsibility Masterclass</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* 4. The 5-Step Decision Making Matrix */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black shadow-xs">
                    <Compass size={24} />
                  </div>
                  <div>
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      Leadership Discipline 4
                    </span>
                    <h3 className="text-xl font-black text-[#081a3d] mt-1.5">
                      The 5-Step Decision Making & Problem Solving Matrix
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      How to overcome decision paralysis. Learn to define problems clearly, brainstorm 3 options, apply the 10-10-10 rule (10 mins, 10 months, 10 years), and execute without fear.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5 text-xs">
                    <strong className="text-blue-950 font-bold block">The 10-10-10 Rule Filter</strong>
                    <div className="text-[11px] text-slate-700 space-y-1">
                      <div>• <strong>10 Minutes:</strong> How does this feel in the moment?</div>
                      <div>• <strong>10 Months:</strong> How does this impact my exams & goals?</div>
                      <div>• <strong>10 Years:</strong> How does this shape my life character?</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (leadershipBooks[3]) {
                        handleOpenLessonPlan(leadershipBooks[3], 'The 5-Step Problem-Solving & Independent Decision-Making Matrix');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>Open Decision Matrix Plan</span>
                    <ArrowRight size={13} />
                  </button>

                  <span className="text-[11px] font-bold text-blue-700">
                    Independence Tool
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: MILESTONES & STRATEGIC GOALS                                 */}
        {/* =================================================================== */}
        {activeTab === 'goals' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-black text-[#081a3d]">
                  Personal Leadership Milestones & Strategic Goals
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Track real daily leadership actions and establish milestones that set you apart in school and life.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingGoal(!isAddingGoal)}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Plus size={14} />
                <span>{isAddingGoal ? 'Cancel' : '+ Add Strategic Goal'}</span>
              </button>
            </div>

            {/* Add Goal Form */}
            {isAddingGoal && (
              <form onSubmit={handleAddGoal} className="bg-indigo-50/60 p-5 rounded-3xl border border-indigo-200 space-y-4 animate-scale-in">
                <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider">
                  Create a New Strategic Leadership Goal
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="Goal title (e.g. Lead study group on Logarithms)"
                    className="sm:col-span-2 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                    required
                  />
                  <input
                    type="text"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    placeholder="Target Date (e.g. Next Friday)"
                    className="bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Save Goal
                  </button>
                </div>
              </form>
            )}

            {/* Daily Leadership Milestones Checklist */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase text-[#081a3d] tracking-wider flex items-center gap-2">
                  <Trophy size={16} className="text-amber-500" />
                  <span>Essential Leadership Habits & Milestones</span>
                </h3>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {milestones.filter(m => m.done).length} of {milestones.length} Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {milestones.map((m: any) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(m.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      m.done 
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                        m.done ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300'
                      }`}>
                        {m.done && <Check size={12} />}
                      </div>
                      <span className={`text-xs sm:text-sm ${m.done ? 'line-through text-slate-500' : 'font-semibold'}`}>
                        {m.label}
                      </span>
                    </div>

                    <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-400">
                      {m.done ? 'Earned ✓' : 'Tap to Complete'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {goal.category}
                      </span>
                      <h4 className="font-black text-sm text-[#081a3d] mt-1.5 leading-snug">
                        {goal.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 shrink-0">
                      Target: {goal.targetDate}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Execution Progress</span>
                      <span className="text-indigo-600">{goal.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 text-[11px]">Update status:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateGoalProgress(goal.id, -10)}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                      >
                        -10%
                      </button>
                      <button
                        type="button"
                        onClick={() => updateGoalProgress(goal.id, 10)}
                        className="px-2 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold cursor-pointer"
                      >
                        +10%
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: LEADERSHIP LIBRARY                                           */}
        {/* =================================================================== */}
        {activeTab === 'books' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-black text-[#081a3d]">
                  Leadership, Independence & Character Library
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Curated textbooks specifically designed to cultivate self-reliance, moral respect, and strategic problem-solving in youth.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                {leadershipBooks.length} Prescribed Books
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadershipBooks.map((book) => (
                <div 
                  key={book.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase border ${book.badgeBg}`}>
                        {book.subject}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">
                          {book.chaptersCount} Chapters • {book.estimatedMinutesPerSession} mins/day
                        </span>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteLeadershipBook(book.id)}
                            className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer border border-rose-200"
                            title="Admin: Delete this book from shelf"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-[#081a3d] leading-snug">
                      {book.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-semibold">
                      By {book.author} • {book.targetClass}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>

                    {/* Key Topics List */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        Key Lesson Plans (Tap to Learn & Solve):
                      </span>
                      <div className="space-y-1">
                        {(book.keyTopics || []).map((topic, i) => (
                          <div
                            key={i}
                            onClick={() => handleOpenLessonPlan(book, topic)}
                            className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-200 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer group"
                          >
                            <span className="truncate pr-2">💡 {topic}</span>
                            <span className="text-[10px] text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0">
                              <span>Open Plan</span>
                              <ArrowRight size={10} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const firstTopic = book.keyTopics?.[0] || 'Core Principles';
                        handleOpenLessonPlan(book, firstTopic);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#081a3d] hover:bg-[#122e66] text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <BookOpen size={13} className="text-[#62c5fa]" />
                      <span>Explore Interactive Lesson Plan</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDeleteLeadershipBook(book.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 border border-rose-200 transition-colors cursor-pointer"
                          title="Admin: Delete this book"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      )}

                      {onAddStudyTask && (
                        <button
                          type="button"
                          onClick={() => {
                            onAddStudyTask({
                              title: `Read Leadership Book: ${book.title}`,
                              time: '6:00 PM',
                              category: 'Reading',
                              priority: 'medium'
                            });
                            playSuccessSound();
                          }}
                          className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                        >
                          + Add to Daily Plan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: INTERACTIVE SIMULATORS                                       */}
        {/* =================================================================== */}
        {activeTab === 'simulator' && (
          <div className="space-y-10 animate-fade-in">
            
            {/* 1. Student Pocket Money & Budget Simulator */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                    <DollarSign size={13} />
                    <span>Leadership Simulation Tool 1</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#081a3d]">
                    Student Allowance & 50/30/20 Budget Decision Simulator
                  </h3>
                  <p className="text-xs text-slate-600">
                    Input your weekly or monthly pocket money/allowance to calculate your exact independence allocation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Inputs */}
                <div className="space-y-4 md:col-span-1 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">
                      Total Allowance / Income (₦)
                    </label>
                    <input 
                      type="number"
                      value={incomeInput}
                      onChange={(e) => setIncomeInput(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                      <span>Savings Rate</span>
                      <span className="text-emerald-700 font-bold">{savingsPercent}%</span>
                    </div>
                    <input 
                      type="range"
                      min={10}
                      max={50}
                      step={5}
                      value={savingsPercent}
                      onChange={(e) => setSavingsPercent(Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Recommended: 20% minimum for personal independence cushion.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">
                      Test Purchase Temptation (₦)
                    </label>
                    <input 
                      type="number"
                      value={testItemPrice}
                      onChange={(e) => setTestItemPrice(Math.max(0, Number(e.target.value) || 0))}
                      placeholder="e.g. ₦3,500 snack/shoes"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Test if you can afford this right now without hurting your savings!
                    </span>
                  </div>
                </div>

                {/* Output Breakdown */}
                <div className="md:col-span-2 space-y-4">
                  {(() => {
                    const savingsAmount = Math.round((incomeInput * savingsPercent) / 100);
                    const needsAmount = Math.round(incomeInput * 0.5);
                    const wantsAmount = Math.max(0, incomeInput - savingsAmount - needsAmount);
                    const canAffordWants = testItemPrice <= wantsAmount;

                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          
                          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block mb-1">
                              1. Independence Savings ({savingsPercent}%)
                            </span>
                            <div className="text-xl font-black text-emerald-900">
                              ₦{savingsAmount.toLocaleString()}
                            </div>
                            <span className="text-[10.5px] text-emerald-700 font-semibold block mt-1">
                              Pay yourself first! Transfer immediately to locked account.
                            </span>
                          </div>

                          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 block mb-1">
                              2. Mandatory Needs (50%)
                            </span>
                            <div className="text-xl font-black text-blue-900">
                              ₦{needsAmount.toLocaleString()}
                            </div>
                            <span className="text-[10.5px] text-blue-700 font-semibold block mt-1">
                              School books, transit fares, mandatory academic supplies.
                            </span>
                          </div>

                          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                            <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 block mb-1">
                              3. Available Wants ({100 - 50 - savingsPercent}%)
                            </span>
                            <div className="text-xl font-black text-purple-900">
                              ₦{wantsAmount.toLocaleString()}
                            </div>
                            <span className="text-[10.5px] text-purple-700 font-semibold block mt-1">
                              Snacks, entertainment, social activities with friends.
                            </span>
                          </div>

                        </div>

                        {/* Purchase Decision Result */}
                        <div className={`p-5 rounded-2xl border ${
                          canAffordWants 
                            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' 
                            : 'bg-amber-50/90 border-amber-300 text-amber-950'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className="text-2xl shrink-0">
                              {canAffordWants ? '✅' : '⚠️'}
                            </div>
                            <div className="space-y-1">
                              <strong className="text-sm font-black block">
                                {canAffordWants 
                                  ? `Independent Decision: You CAN afford this ₦${testItemPrice.toLocaleString()} purchase debt-free!` 
                                  : `Independent Decision: DO NOT BUY THIS ITEM RIGHT NOW!`}
                              </strong>
                              <p className="text-xs leading-relaxed">
                                {canAffordWants 
                                  ? `After taking out your ₦${savingsAmount.toLocaleString()} savings and ₦${needsAmount.toLocaleString()} school needs, you have ₦${wantsAmount.toLocaleString()} in your wants budget. You will have ₦${(wantsAmount - testItemPrice).toLocaleString()} remaining.`
                                  : `This purchase costs ₦${testItemPrice.toLocaleString()}, but your wants budget only has ₦${wantsAmount.toLocaleString()}! Buying it now would force you into debt or stealing from your transport/books money. Apply the 24-Hour Cool-Off rule or save for 2 periods.`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>
            </div>

            {/* 2. Conflict & Dilemma Decision Scenario Simulator */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider">
                    <Heart size={13} />
                    <span>Leadership Simulation Tool 2</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#081a3d]">
                    Real-Life Conflict & Dilemma Decision Simulator
                  </h3>
                  <p className="text-xs text-slate-600">
                    Choose a realistic teen conflict scenario and test different responses to see their real consequences.
                  </p>
                </div>
              </div>

              {/* Scenario Selector */}
              <div className="flex flex-wrap gap-2">
                {SCENARIOS.map((scen, idx) => (
                  <button
                    key={scen.id}
                    type="button"
                    onClick={() => {
                      setSelectedScenarioIdx(idx);
                      setScenarioChoice(null);
                      playSuccessSound();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedScenarioIdx === idx 
                        ? 'bg-[#081a3d] text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Scenario {idx + 1}: {scen.title}
                  </button>
                ))}
              </div>

              {/* Active Scenario Card */}
              {(() => {
                const currentScen = SCENARIOS[selectedScenarioIdx];
                return (
                  <div className="space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        The Situation:
                      </span>
                      <h4 className="text-base font-extrabold text-[#081a3d]">
                        {currentScen.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {currentScen.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                        What is your decision? Choose an option:
                      </span>
                      <div className="space-y-2">
                        {currentScen.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            onClick={() => {
                              setScenarioChoice(optIdx);
                              playSuccessSound();
                            }}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                              scenarioChoice === optIdx
                                ? opt.type === 'constructive'
                                  ? 'border-emerald-600 bg-emerald-50'
                                  : 'border-rose-600 bg-rose-50'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                              <span>{opt.label}</span>
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100">
                                {scenarioChoice === optIdx ? 'Selected' : 'Click to choose'}
                              </span>
                            </div>

                            {scenarioChoice === optIdx && (
                              <div className={`mt-3 pt-3 border-t text-xs font-medium leading-relaxed animate-fade-in ${
                                opt.type === 'constructive' 
                                  ? 'border-emerald-200 text-emerald-950 font-bold' 
                                  : 'border-rose-200 text-rose-950'
                              }`}>
                                <strong className="block mb-0.5">
                                  {opt.type === 'constructive' ? '🌟 Mature Leadership Outcome:' : '⚠️ Consequence:'}
                                </strong>
                                {opt.result}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        )}

      </div>

      {/* TOPIC LESSON PLAN MODAL */}
      <TopicLessonPlanModal
        isOpen={Boolean(selectedTopicPlan)}
        onClose={() => {
          setSelectedTopicPlan(null);
          setSelectedTopicBook(null);
        }}
        lessonPlan={selectedTopicPlan}
        book={selectedTopicBook}
        onAddStudyTask={onAddStudyTask}
      />
    </div>
  );
};
