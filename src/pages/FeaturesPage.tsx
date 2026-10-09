import React from 'react';
import { 
  Calendar, BookOpen, BarChart3, Users, Clock, 
  CheckCircle2, ArrowRight, Brain, Zap, Shield, Sparkles 
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (page: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  const comparisonData = [
    {
      feature: 'Cognitive Science Integration',
      traditional: 'Generic empty checkboxes',
      echoPlan: 'Built-in Active Recall, Feynman method, and Spaced Repetition'
    },
    {
      feature: 'Study Sprints & Focus Management',
      traditional: 'Requires separate apps/alarms',
      echoPlan: 'Embedded 25m Pomodoro timer with pink-noise audio generator'
    },
    {
      feature: 'Habit Formation',
      traditional: 'No streak tracking or routine building',
      echoPlan: 'Weekly matrix with 21-day streak accountability'
    },
    {
      feature: 'Long-term Growth & Leadership',
      traditional: 'Only short-term one-off tasks',
      echoPlan: 'Semester milestone progress bars and classroom leadership habits'
    },
    {
      feature: 'Data Privacy & Offline Persistence',
      traditional: 'Heavy paywalls or lost on refresh',
      echoPlan: 'Instant local storage persistence with zero friction'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f6f9ff]">
      {/* Header */}
      <section className="relative py-20 px-6 sm:px-10 lg:px-[7%] bg-[#071a3d] text-white overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(98, 197, 250, 0.25), transparent 40%), linear-gradient(115deg, #071a3d, #0b2b62 55%, #164b91)'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#62c5fa]/40 rounded-full bg-white/5 text-[#ccecff] text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            ✦ PRODUCT SUITE & CAPABILITIES
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Everything You Need to <span className="text-[#61c6fb]">Excel in School</span>
          </h1>
          <p className="text-[#c8daf3] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            From daily assignment time-blocking to deep-work study sprints and leadership milestones, Echo Plan integrates the entire student productivity stack.
          </p>
        </div>
      </section>

      {/* Feature Deep Dives */}
      <section className="py-16 px-6 sm:px-10 lg:px-[7%] max-w-[1250px] mx-auto space-y-16">
        
        {/* Feature 1: Planner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1976d2] flex items-center justify-center mb-4">
              <Calendar size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1976d2]">Pillar 01</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081a3d] mt-1 mb-4">
              Smart Academic Day Planner
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Organize homework, lab write-ups, and study sessions by time of day. Color-code by subject (Math, Science, Reading, Projects) and filter by pending or completed tasks.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Live visual completion meter with sound chimes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Subject filtering & high/medium/low priority tags
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Celebration confetti when 100% of tasks are completed
              </li>
            </ul>
            <button
              onClick={() => onNavigate('planner')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1976d2] text-white font-bold rounded-full text-xs hover:bg-[#1565c0] shadow-md transition-all cursor-pointer"
            >
              Open Daily Planner <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-[#f8fbff] rounded-2xl p-6 border border-slate-200">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                <div>
                  <div className="text-xs font-bold text-[#081a3d]">Study Mathematics</div>
                  <div className="text-[10px] text-slate-400">4:00 PM • Trigonometry Practice</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">Math</span>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                <div>
                  <div className="text-xs font-bold text-[#081a3d]">Read & Learn</div>
                  <div className="text-[10px] text-slate-400">5:30 PM • History Chapter 8</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Reading</span>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                <div>
                  <div className="text-xs font-bold text-[#081a3d]">Complete Assignment</div>
                  <div className="text-[10px] text-slate-400">7:00 PM • Chemistry Lab Report</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">High Priority</span>
            </div>
          </div>
        </div>

        {/* Feature 2: Learn & Grow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm">
          <div className="order-2 lg:order-1 bg-gradient-to-br from-[#081a3d] to-[#164385] text-white rounded-2xl p-6 sm:p-8">
            <div className="text-xs uppercase font-extrabold tracking-widest text-[#62c5fa] mb-2 flex items-center gap-2">
              <Clock size={16} /> Pomodoro 25/5 Sprint
            </div>
            <div className="text-5xl font-black font-mono my-4 text-white">25:00</div>
            <p className="text-xs text-[#b8d1f2] leading-relaxed mb-4">
              25 minutes of hyper-focus eliminates procrastination by shrinking task size. Includes audio bells and optional pink noise.
            </p>
            <div className="p-3 rounded-xl bg-white/10 text-xs text-[#c8daf3] flex items-center gap-2">
              <Brain size={16} className="text-[#62c5fa]" />
              <span>Active recall flashcard tool built right beside the timer</span>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <BookOpen size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pillar 02</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081a3d] mt-1 mb-4">
              Learn & Grow: Study Science
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Stop passive rereading. Echo Plan provides evidence-based study protocols: The Feynman Technique, Spaced Retrieval schedules, and focused work sprints.
            </p>
            <button
              onClick={() => onNavigate('tips')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#081a3d] text-white font-bold rounded-full text-xs hover:bg-[#102f66] shadow-md transition-all cursor-pointer"
            >
              Start Focus Session <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Feature 3: Habit Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <BarChart3 size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Pillar 03</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081a3d] mt-1 mb-4">
              Consistency & Habit Streaks
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Small routines like reviewing class notes for 15 minutes each evening or packing your bag before bed eliminate morning stress and build academic endurance.
            </p>
            <button
              onClick={() => onNavigate('habits')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-full text-xs hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
            >
              View Habit Tracker <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-[#f8fbff] rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-700">Weekly Consistency</span>
              <span className="text-xs font-extrabold text-amber-600">🔥 7 Day Streak</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold">{d}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    i < 5 ? 'bg-sky-500 text-white' : 'border border-slate-300 text-slate-300'
                  }`}>
                    {i < 5 ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 4: Leadership */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm">
          <div className="order-2 lg:order-1 bg-[#eff6ff] rounded-2xl p-6 sm:p-8 border border-blue-100">
            <div className="text-xs font-extrabold text-blue-700 uppercase tracking-widest mb-3">
              Strategic Semester Goals
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Score 90%+ on Midterm Math Exam</span>
                  <span className="text-blue-700">75%</span>
                </div>
                <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-blue-600 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Lead Science Fair Presentation</span>
                  <span className="text-blue-700">40%</span>
                </div>
                <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div className="w-2/5 h-full bg-blue-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Pillar 04</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081a3d] mt-1 mb-4">
              Classroom Leadership & Milestones
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Track long-term semester ambitions and practice everyday classroom leadership: speaking up with confidence, tutoring classmates, and presenting ideas clearly.
            </p>
            <button
              onClick={() => onNavigate('leadership')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-full text-xs hover:bg-indigo-700 shadow-md transition-all cursor-pointer"
            >
              Open Goals & Milestones <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </section>

      {/* Comparison Matrix */}
      <section className="py-16 px-6 sm:px-10 lg:px-[7%] bg-white border-t border-slate-200">
        <div className="max-w-[1250px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1976d2]">Why Echo Plan</span>
            <h2 className="text-3xl font-extrabold text-[#081a3d] mt-2">
              Traditional To-Do Lists vs. Echo Plan
            </h2>
          </div>

          <div className="bg-[#f8fbff] rounded-2xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-12 p-4 bg-[#081a3d] text-white text-xs font-bold uppercase tracking-wider">
              <div className="col-span-4">Capability</div>
              <div className="col-span-4 text-slate-300">Basic Sticky Notes / Apps</div>
              <div className="col-span-4 text-[#62c5fa]">Echo Plan School Helper</div>
            </div>

            <div className="divide-y divide-slate-200">
              {comparisonData.map((row, i) => (
                <div key={i} className="grid grid-cols-12 p-4 text-xs sm:text-sm items-center hover:bg-white transition-colors">
                  <div className="col-span-4 font-bold text-[#081a3d]">{row.feature}</div>
                  <div className="col-span-4 text-slate-500">{row.traditional}</div>
                  <div className="col-span-4 font-semibold text-[#1976d2]">{row.echoPlan}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
