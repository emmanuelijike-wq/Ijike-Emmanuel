import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, Target, Compass, Award, 
  CheckCircle2, ArrowRight, HeartHandshake, ShieldCheck
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const [selectedPersona, setSelectedPersona] = useState<'procrastinator' | 'highAchiever' | 'overwhelmed'>('highAchiever');

  const personas = {
    highAchiever: {
      title: 'The High-Achiever',
      trait: 'Balancing AP/honors courses, extracurriculars, and leadership roles.',
      advice: 'Echo Plan keeps your semester milestones synchronized so you never compromise on sleep while achieving high marks.'
    },
    procrastinator: {
      title: 'The Last-Minute Sprinter',
      trait: 'Waiting until 9:00 PM before starting assignments due the next morning.',
      advice: 'Our 25-minute Pomodoro sprints and bite-sized daily habit streaks break inertia and make starting effortless.'
    },
    overwhelmed: {
      title: 'The Busy Balancer',
      trait: 'Feeling buried under assignments, projects, sports, and exams.',
      advice: 'Time-block your afternoons with Echo Plan to discover 2+ hours of hidden free time each school day.'
    }
  };

  const values = [
    {
      icon: <Target className="w-6 h-6 text-sky-500" />,
      title: 'Actionable Discipline',
      desc: 'Motivation fades, but automated daily routines and scheduled study time blocks ensure long-term mastery.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      title: 'Cognitive Science First',
      desc: 'We integrate evidence-backed techniques like Spaced Repetition, Active Retrieval, and the Feynman Method.'
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-emerald-500" />,
      title: 'Student Well-Being',
      desc: 'Academic success should never come at the expense of sleep, mental peace, or extracurricular passions.'
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-500" />,
      title: 'Character & Leadership',
      desc: 'Echo Plan trains students to articulate ideas clearly, support classmates, and take ownership of their future.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f6f9ff]">
      {/* Page Header */}
      <section className="relative py-20 px-6 sm:px-10 lg:px-[7%] bg-[#071a3d] text-white overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 80% 20%, rgba(98, 197, 250, 0.25), transparent 45%), linear-gradient(120deg, #071a3d, #0b2b62 60%, #164b91)'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#62c5fa]/40 rounded-full bg-white/5 text-[#ccecff] text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            ✦ ABOUT ECHO PLAN
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Empowering Students to Learn with <span className="text-[#61c6fb]">Clarity & Purpose</span>
          </h1>
          <p className="text-[#c8daf3] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Echo Plan was built on a simple conviction: every student possesses extraordinary potential when given structured planning tools, atomic habits, and active learning strategies.
          </p>
        </div>
      </section>

      {/* Origin Story & Mission */}
      <section className="py-16 px-6 sm:px-10 lg:px-[7%] max-w-[1250px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#1976d2] bg-blue-100/70 px-3 py-1 rounded-full">
              Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#081a3d] mt-4 mb-6 leading-tight">
              Bridging the gap between school schedules and lifelong student success.
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
              <p>
                In high school and college, students are handed syllabi, assignment deadlines, and exam schedules—yet rarely taught <em>how</em> to actually manage their cognitive energy or structure a study evening.
              </p>
              <p>
                Echo Plan replaces chaotic paper checklists and random sticky notes with a calm, deliberate system: <strong>Plan your day</strong>, <strong>Learn & grow</strong> through proven cognitive techniques, <strong>Build good habits</strong> that compound, and <strong>Become a leader</strong> in the classroom.
              </p>
              <p>
                When your academic day is clear, anxiety evaporates and deep learning takes its place.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => onNavigate('planner')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1976d2] text-white font-bold rounded-full hover:bg-[#1565c0] shadow-md transition-all cursor-pointer text-sm"
              >
                Launch Daily Planner <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate('features')}
                className="px-6 py-3.5 border border-slate-300 text-slate-700 font-bold rounded-full hover:bg-white transition-all cursor-pointer text-sm"
              >
                Explore Features
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg relative">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h3 className="font-extrabold text-[#081a3d] text-lg">Academic Impact at a Glance</h3>
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">Proven System</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-[#f8fbff] border border-slate-100">
                <div className="text-3xl font-black text-[#1976d2]">94%</div>
                <div className="text-xs font-bold text-slate-700 mt-1">Assignment On-Time Rate</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Reported by regular users</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8fbff] border border-slate-100">
                <div className="text-3xl font-black text-[#1976d2]">3.2x</div>
                <div className="text-xs font-bold text-slate-700 mt-1">Exam Concept Recall</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Using active recall methods</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8fbff] border border-slate-100">
                <div className="text-3xl font-black text-[#1976d2]">12+ hrs</div>
                <div className="text-xs font-bold text-slate-700 mt-1">Time Reclaimed Weekly</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Eliminating procrastination</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8fbff] border border-slate-100">
                <div className="text-3xl font-black text-[#1976d2]">21 Days</div>
                <div className="text-xs font-bold text-slate-700 mt-1">To Automatic Study Habits</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Tracked via weekly streaks</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl overflow-hidden shadow-sm border border-slate-100 aspect-[16/9]">
              <img
                src="/src/assets/images/teen_class_students_1789589624600.jpg"
                alt="High school teenage students collaborating in class"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 leading-relaxed flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span>Designed specifically for teenage high school students to foster independent academic mastery.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6 sm:px-10 lg:px-[7%] bg-white border-y border-slate-200">
        <div className="max-w-[1250px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1976d2]">Our Foundation</span>
            <h2 className="text-3xl font-extrabold text-[#081a3d] mt-2">The Four Echo Principles</h2>
            <p className="text-slate-500 text-sm mt-2">
              The cornerstone philosophies guiding every feature in the Echo Plan companion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-[#f8fbff] rounded-2xl p-6 border border-slate-200/70 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-[#081a3d] mb-2">{v.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Persona Matcher */}
      <section className="py-16 px-6 sm:px-10 lg:px-[7%] max-w-[1250px] mx-auto">
        <div className="bg-gradient-to-br from-[#081a3d] to-[#123672] text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#62c5fa] text-xs font-bold uppercase mb-4">
              <Compass size={14} /> Student Archetypes
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              How Echo Plan Works for Your Study Style
            </h2>
            <p className="text-sm text-[#c8daf3] mb-8">
              Select your current study challenge to see how Echo Plan tailors your workflow:
            </p>

            <div className="flex flex-wrap gap-2.5 mb-8">
              {(Object.keys(personas) as Array<keyof typeof personas>).map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedPersona(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPersona === key
                      ? 'bg-[#62c5fa] text-[#081a3d] shadow-md font-extrabold'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {personas[key].title}
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
              <div className="text-xs uppercase font-bold text-[#62c5fa] tracking-wider mb-1">
                Your Profile:
              </div>
              <p className="text-sm text-white/90 font-medium mb-4">
                {personas[selectedPersona].trait}
              </p>
              <div className="pt-3 border-t border-white/10 text-xs text-[#c8daf3] flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#62c5fa] flex-shrink-0 mt-0.5" />
                <span><strong>Echo Recommendation:</strong> {personas[selectedPersona].advice}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
