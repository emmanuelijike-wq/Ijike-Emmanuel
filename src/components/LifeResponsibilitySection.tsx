import React, { useState } from 'react';
import { 
  ShieldCheck, Heart, Award, ArrowRight, CheckCircle2, 
  AlertCircle, Sparkles, Scale, Compass, Check, HelpCircle
} from 'lucide-react';
import { playSuccessSound } from '../utils/sound';

export const LifeResponsibilitySection: React.FC = () => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number>(0);
  const [userChoice, setUserChoice] = useState<number | null>(null);

  const RESPONSIBILITY_SCENARIOS = [
    {
      id: 'scen-1',
      title: 'The Cashier’s Excess Change Mistake',
      context: 'You bought a ₦1,000 notebook and handed the cashier a ₦2,000 note. Distracted by other customers, the cashier mistakenly handed you ₦4,000 in change instead of ₦1,000.',
      choices: [
        {
          label: 'Option A: Pocket the extra ₦3,000 silently as "luck"',
          isLeader: false,
          outcome: 'You committed silent theft. At the end of the day, that cashier must pay that ₦3,000 shortage out of their own meager salary. You sacrificed your soul and integrity for ₦3,000.'
        },
        {
          label: 'Option B: Hand it back immediately with respect: "Ma/Sir, you gave me excess change by mistake."',
          isLeader: true,
          outcome: 'True Leadership! You protected another human being’s livelihood and proved that your integrity cannot be bought. Integrity is who you are when nobody is watching.'
        }
      ]
    },
    {
      id: 'scen-2',
      title: 'The Broken Home Appliance While Parents Are Away',
      context: 'While trying a silly trick in the living room, you accidentally knocked over and cracked your family’s electric kettle. Nobody saw you do it.',
      choices: [
        {
          label: 'Option A: Place it back quietly and pretend you know nothing when parents ask',
          isLeader: false,
          outcome: 'Cowardice and deceit. A younger sibling or innocent person may get blamed, and you carry the invisible poison of guilt and dishonesty in your heart.'
        },
        {
          label: 'Option B: Own it proactively. Meet your parents at the door: "Mom/Dad, I made a mistake and cracked the kettle. I am truly sorry and want to help replace it."',
          isLeader: true,
          outcome: 'Extreme Ownership! Parents will be surprised by your honesty. Even if they are initially disappointed by the damage, their respect and trust in your adult maturity will skyrocket 10x.'
        }
      ]
    },
    {
      id: 'scen-3',
      title: 'Group Assignment Neglect by a Close Friend',
      context: 'You and a close friend were assigned a WAEC Biology group project. Your friend spent the entire weekend playing mobile games and failed to complete their half. Submission is in 2 hours.',
      choices: [
        {
          label: 'Option A: Yell at your friend and publicly shame them in front of the class',
          isLeader: false,
          outcome: 'Creates a defensive brawl, burns the friendship forever, and the teacher still awards a zero to both of you.'
        },
        {
          label: 'Option B: Pull them aside calmly: "I’ve finished my part and started an outline for yours. We have 90 minutes. Sit with me right now and let’s push through together, but next time we set an earlier deadline."',
          isLeader: true,
          outcome: 'Inspiring Leadership! You solved the immediate crisis, held them accountable with dignity, and taught them a lesson in teamwork and reliability.'
        }
      ]
    }
  ];

  const currentScenario = RESPONSIBILITY_SCENARIOS[selectedScenarioIdx];

  return (
    <div className="space-y-12 animate-fade-in text-slate-900">
      
      {/* Title Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-200">
          <ShieldCheck size={14} className="text-amber-700" />
          <span>Character & Sovereign Self-Governance</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#081a3d] tracking-tight">
          How to Be Responsible in Life
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Responsibility is not a burden forced upon you by authority; it is the ultimate source of self-respect, inner power, and genuine leadership.
        </p>
      </div>

      {/* =================================================================== */}
      {/* SECTION 1: THE EQUATION OF EXTREME OWNERSHIP                        */}
      {/* =================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Core Philosophy
          </span>
          <h3 className="text-2xl font-black text-[#081a3d] mt-2">
            The Equation of Extreme Ownership: E + R = O
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Why mature leaders never make excuses and how to master your outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-2xl font-black text-slate-400 block">E</span>
            <h4 className="font-black text-[#081a3d] text-base">The Event</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sudden rain, heavy traffic, power blackout, strict teacher, difficult exam questions, tough economic times.
            </p>
            <span className="text-[10.5px] font-bold text-rose-600 block mt-2">
              (0% You Can Control)
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 shadow-xs space-y-2">
            <span className="text-2xl font-black text-amber-600 block">R</span>
            <h4 className="font-black text-amber-950 text-base">Your Response</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Waking up at 5:00 AM, revising mistakes, controlling emotional temper, preparing backup study lamps, speaking respectfully.
            </p>
            <span className="text-[10.5px] font-black text-emerald-700 block mt-2">
              (100% Within Your Power!)
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-2xl font-black text-indigo-600 block">O</span>
            <h4 className="font-black text-[#081a3d] text-base">The Outcome</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Excellence in WAEC exams, respect from parents, self-confidence, financial independence, and a trusted reputation.
            </p>
            <span className="text-[10.5px] font-bold text-indigo-700 block mt-2">
              (Determined Entirely by R!)
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs sm:text-sm font-medium space-y-2">
          <strong className="text-amber-900 font-black block">The Victim vs. Leader Mindset:</strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white/80 rounded-xl border border-rose-200 space-y-1">
              <span className="font-black text-rose-700 block">❌ The Victim Mindset (External Locus)</span>
              <p className="text-slate-600">
                “The teacher dislikes me; the system is rigged; my phone died so I couldn’t study; my friends distracted me.”
              </p>
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-emerald-200 space-y-1">
              <span className="font-black text-emerald-800 block">✓ The Young Leader Mindset (Internal Locus)</span>
              <p className="text-slate-700">
                “I didn't revise early enough; I allowed distractions; I will wake up 1 hour earlier, solve 30 past questions, and master this topic!”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 2: RESPECT FOR PARENTS & PROACTIVE HOME STEWARDSHIP          */}
      {/* =================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            Pillar 2 • Filial Respect & Domestic Honor
          </span>
          <h3 className="text-2xl font-black text-[#081a3d] mt-2">
            Respecting Parents' Sacrifices & Proactive Home Stewardship
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            A leader who cannot be responsible at home will never lead anyone in the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
              <Heart size={20} />
            </div>
            <h4 className="font-black text-[#081a3d] text-base">
              Recognizing the Unseen Sacrifices
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Parents endure difficult bosses, grueling commutes, financial anxiety, and physical exhaustion to provide your school fees, meals, and clothes. When you speak respectfully and say <em>"Thank you, Mom/Dad"</em>, you replenish their spirit.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
              <CheckCircle2 size={20} />
            </div>
            <h4 className="font-black text-[#081a3d] text-base">
              Proactive Chores Without Being Told
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Children wait until parents shout before washing plates or cleaning the parlor. <strong>Young leaders act proactively</strong>: seeing unwashed dishes and cleaning them before parents even arrive home. This single habit earns enormous adult trust.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-black text-[#081a3d] text-base">
              Guarding Family Resources
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Turn off electrical appliances when not in use to lower electric bills. Take meticulous care of your school uniforms and textbooks so parents don't spend hard-earned funds replacing ruined items.
            </p>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 3: THE 10-10-10 DECISION MATRIX                             */}
      {/* =================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Decision Engineering
          </span>
          <h3 className="text-2xl font-black text-[#081a3d] mt-2">
            The 10-10-10 Life Decision Filter
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Created by business leader Suzy Welch: Filter every temptation through 3 lenses of time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
            <span className="text-xs font-black uppercase text-sky-800">Lens 1: The Present</span>
            <h4 className="font-black text-sky-950 text-base">In 10 Minutes</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              How will I feel right after this choice? (e.g. eating junk food, skipping study to play games, arguing with parents). It usually brings a quick dopamine high.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
            <span className="text-xs font-black uppercase text-indigo-800">Lens 2: The Near Future</span>
            <h4 className="font-black text-indigo-950 text-base">In 10 Months</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              How will this decision affect my upcoming WAEC/NECO mock examination results, my report card, my savings jar, and my teacher’s trust in me?
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
            <span className="text-xs font-black uppercase text-purple-800">Lens 3: The Destiny</span>
            <h4 className="font-black text-purple-950 text-base">In 10 Years</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Will this choice build the sovereign, honorable, independent adult I am destined to become, or will it create habits of excuse, debt, and regret?
            </p>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 4: REAL-LIFE RESPONSIBILITY & INTEGRITY SIMULATOR           */}
      {/* =================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Interactive Integrity Lab
            </span>
            <h3 className="text-2xl font-black text-[#081a3d] mt-1.5">
              Life Dilemma & Responsibility Simulator
            </h3>
            <p className="text-xs text-slate-500">
              Select real-life youth dilemmas to test your character and decision reflexes.
            </p>
          </div>

          {/* Scenario Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            {RESPONSIBILITY_SCENARIOS.map((scen, idx) => (
              <button
                key={scen.id}
                type="button"
                onClick={() => {
                  setSelectedScenarioIdx(idx);
                  setUserChoice(null);
                  playSuccessSound();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedScenarioIdx === idx
                    ? 'bg-white text-[#081a3d] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Case {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
          <div>
            <span className="text-[11px] font-black uppercase text-indigo-700">
              Case Study {selectedScenarioIdx + 1}
            </span>
            <h4 className="text-xl font-black text-[#081a3d] mt-1">
              {currentScenario.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 bg-white p-4 rounded-2xl border border-slate-200 font-medium leading-relaxed">
              {currentScenario.context}
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              What do you do? Choose your path:
            </span>

            <div className="space-y-3">
              {currentScenario.choices.map((choice, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setUserChoice(i);
                    playSuccessSound();
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    userChoice === i
                      ? choice.isLeader 
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs' 
                        : 'border-rose-400 bg-rose-50/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{choice.label}</span>
                    <span className="text-slate-400 text-[10px]">Select</span>
                  </div>

                  {userChoice === i && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs animate-fade-in leading-relaxed">
                      <strong className={choice.isLeader ? 'text-emerald-950 font-black' : 'text-rose-950 font-black'}>
                        {choice.isLeader ? '✓ Leader Outcome: ' : '✗ Weak Outcome: '}
                      </strong>
                      <span className={choice.isLeader ? 'text-emerald-900' : 'text-rose-900'}>
                        {choice.outcome}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
