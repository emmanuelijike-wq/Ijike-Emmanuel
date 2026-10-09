import React, { useState } from 'react';
import { 
  BookOpen, Brain, TrendingUp, Sparkles, Scale, 
  Award, Clock, CheckCircle2, AlertCircle, ArrowRight, 
  HelpCircle, RefreshCw, BarChart2
} from 'lucide-react';
import { playSuccessSound } from '../utils/sound';

export const LeadershipRelativeStudiesSection: React.FC = () => {
  // Compound Interest Calculator State
  const [monthlyContribution, setMonthlyContribution] = useState<number>(3000);
  const [annualRate, setAnnualRate] = useState<number>(12);
  const [yearsDuration, setYearsDuration] = useState<number>(5);

  // Marshmallow Experiment Simulation State
  const [marshmallowChoice, setMarshmallowChoice] = useState<'eat_now' | 'wait' | null>(null);

  // Compound calculation:
  // FV = P * [((1 + r/n)^(nt) - 1) / (r/n)]
  const calculateCompound = () => {
    const r = annualRate / 100 / 12;
    const n = yearsDuration * 12;
    if (r === 0) {
      const total = monthlyContribution * n;
      return {
        futureValue: total,
        totalDeposited: total,
        interestEarned: 0
      };
    }
    const futureValue = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    const totalDeposited = monthlyContribution * n;
    const interestEarned = futureValue - totalDeposited;
    return {
      futureValue: Math.round(futureValue),
      totalDeposited: Math.round(totalDeposited),
      interestEarned: Math.round(interestEarned)
    };
  };

  const compoundResult = calculateCompound();
  const ruleOf72Years = annualRate > 0 ? (72 / annualRate).toFixed(1) : '∞';

  return (
    <div className="space-y-12 animate-fade-in text-slate-900">
      
      {/* Title Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider border border-indigo-200">
          <Brain size={14} className="text-indigo-600" />
          <span>Behavioral Science & Historical Studies</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#081a3d] tracking-tight">
          Relative Studies on Money Habits & Self-Mastery
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Grounding leadership, patience, and money habits in rigorous scientific experiments and timeless economic literature.
        </p>
      </div>

      {/* =================================================================== */}
      {/* STUDY 1: THE STANFORD MARSHMALLOW EXPERIMENT                        */}
      {/* =================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Landmark Behavioral Study 1
            </span>
            <h3 className="text-2xl font-black text-[#081a3d] mt-1.5">
              The Stanford Marshmallow Test: Delayed Gratification
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Conducted by Prof. Walter Mischel, Stanford University (1972)
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-2xl bg-rose-100 text-rose-900 text-xs font-black self-start md:self-auto border border-rose-200">
            #1 Predictor of Life Success
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Children aged 4 to 6 were seated in a private room with a single marshmallow on a plate. The researcher made a simple proposition:
            </p>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 italic font-serif text-slate-800">
              “You can eat this marshmallow right now. But if you wait until I return in 15 minutes, you will receive TWO marshmallows.”
            </div>
            <p>
              Some children devoured the treat immediately. Others turned their backs, closed their eyes, sang songs, and resisted the urge.
            </p>
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 font-medium space-y-1.5">
              <strong className="font-black text-indigo-900 block">The 40-Year Longitudinal Results:</strong>
              <p className="text-xs">
                The children who demonstrated the discipline to wait scored an average of <strong>210 points higher on the SAT examination</strong>, achieved higher university degrees, had significantly lower rates of debt and substance abuse, and accumulated vastly greater adult net worth.
              </p>
            </div>
            <p className="text-xs font-bold text-slate-700">
              Leadership Insight: <em>Impatience buys small temporary pleasure; delayed gratification builds sovereign lifelong power.</em>
            </p>
          </div>

          {/* Interactive Marshmallow Dilemma Simulator */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Test Your Instant Reaction
            </h4>
            <p className="text-xs text-slate-500">
              Imagine you have ₦1,000 pocket money today. What is your choice?
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setMarshmallowChoice('eat_now');
                  playSuccessSound();
                }}
                className={`w-full p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  marshmallowChoice === 'eat_now'
                    ? 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                🍬 Option A: Spend it right now on soda & snacks (Instant Gratification)
              </button>

              <button
                type="button"
                onClick={() => {
                  setMarshmallowChoice('wait');
                  playSuccessSound();
                }}
                className={`w-full p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  marshmallowChoice === 'wait'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                🛡 Option B: Put it in your 20% savings jar and wait (Delayed Gratification)
              </button>
            </div>

            {marshmallowChoice === 'eat_now' && (
              <div className="p-3 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-900 text-xs animate-fade-in">
                <strong>Result:</strong> 5 minutes of sugar rush, empty pockets tomorrow, zero asset growth. You surrendered future freedom for a brief moment of dopamine.
              </div>
            )}

            {marshmallowChoice === 'wait' && (
              <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-200 text-emerald-950 text-xs animate-fade-in font-medium">
                <strong>Result:</strong> Congratulations! You rewired your brain for compounding power. You proved you belong to the top tier of future achievers.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* STUDY 2: THE EXPONENTIAL MIRACLE OF COMPOUNDING                     */}
      {/* =================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Mathematical Study 2
            </span>
            <h3 className="text-2xl font-black text-[#081a3d] mt-1.5">
              The Compounding Principle: Einstein & Buffett
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              The 8th Wonder of the World: "He who understands it, earns it; he who doesn't, pays it."
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-black self-start md:self-auto border border-emerald-200">
            Exponential Growth
          </div>
        </div>

        {/* Real-World Case Study: Starting Early vs Waiting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">
              Student A: Started at Age 15
            </span>
            <h4 className="font-black text-[#081a3d] text-base">
              The Power of Starting as a Teenager
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student A saves <strong>₦5,000 monthly from age 15 to 25</strong> (10 years) at 12% compound return, and then NEVER deposits another kobo. By age 55, because of 40 years of uninterrupted compounding, that small early sum blossoms into over <strong>₦38,000,000</strong>!
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-600 text-white">
              Student B: Waited until Age 25
            </span>
            <h4 className="font-black text-[#081a3d] text-base">
              The Devastating Cost of Waiting
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student B waited until age 25 to start, then saved <strong>₦5,000 monthly for 30 consecutive years</strong> until age 55. Despite investing 3x more total capital than Student A, Student B ends up with <em>less money</em> because they lost the magic of early compound time!
            </p>
          </div>
        </div>

        {/* Interactive Compound Calculator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-50 via-sky-50/30 to-indigo-50/40 border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 font-black text-sm text-[#081a3d]">
            <TrendingUp size={18} className="text-indigo-600" />
            <span>Interactive Compound Habit & Wealth Growth Calculator</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                Monthly Savings (₦): {monthlyContribution.toLocaleString()}
              </label>
              <input 
                type="range"
                min="500"
                max="50000"
                step="500"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Range: ₦500 to ₦50,000/mo</span>
            </div>

            <div>
              <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                Annual Yield / Return: {annualRate}%
              </label>
              <input 
                type="range"
                min="5"
                max="25"
                step="1"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Rule of 72: Doubles every {ruleOf72Years} years</span>
            </div>

            <div>
              <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                Time Horizon: {yearsDuration} Years
              </label>
              <input 
                type="range"
                min="1"
                max="20"
                step="1"
                value={yearsDuration}
                onChange={(e) => setYearsDuration(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">From secondary school to career</span>
            </div>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-slate-400 block">
                Total Deposits (Your Pocket Money)
              </span>
              <div className="text-xl font-black text-slate-800 mt-1">
                ₦{compoundResult.totalDeposited.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-indigo-500 block">
                Compound Interest Earned (Free Growth)
              </span>
              <div className="text-xl font-black text-indigo-600 mt-1">
                +₦{compoundResult.interestEarned.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-emerald-400 shadow-xs">
              <span className="text-[10px] font-black uppercase text-emerald-700 block">
                Total Accumulated Wealth
              </span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                ₦{compoundResult.futureValue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* STUDY 3: THE 7 CURES FOR A LEAN PURSE (RICHEST MAN IN BABYLON)      */}
      {/* =================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Historical Classic Study 3
          </span>
          <h3 className="text-2xl font-black text-[#081a3d] mt-1.5">
            The 7 Cures for a Lean Purse
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            From George S. Clason's classic, *The Richest Man in Babylon*
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-black text-xs flex items-center justify-center">1</span>
            <h4 className="font-extrabold text-[#081a3d] text-xs">Start Thy Purse to Fattening</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              For every 10 coins you receive, spend only 9. That 10th coin belongs to your future self.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-black text-xs flex items-center justify-center">2</span>
            <h4 className="font-extrabold text-[#081a3d] text-xs">Control Thy Expenditures</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Do not confuse necessary expenses with personal desires. Desires will always grow to consume all available funds unless restrained.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-black text-xs flex items-center justify-center">3</span>
            <h4 className="font-extrabold text-[#081a3d] text-xs">Make Thy Gold Multiply</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every coin you save must become a worker that earns interest, and those earnings must also work and earn.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-black text-xs flex items-center justify-center">4</span>
            <h4 className="font-extrabold text-[#081a3d] text-xs">Guard Thy Treasures from Loss</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Protect your principal from get-rich-quick scams, unrealistic schemes, and lending to irresponsible peers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-black text-xs flex items-center justify-center">5</span>
            <h4 className="font-extrabold text-[#081a3d] text-xs">Make Thy Home a Profitable Asset</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Treat your home and living environment with pride, maintenance, and care to reduce household waste.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-black text-xs flex items-center justify-center">6</span>
            <h4 className="font-extrabold text-[#081a3d] text-xs">Increase Thy Ability to Earn</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Study hard, excel in school, master technical skills, and develop your character. Your earning capacity expands as your competence grows!
            </p>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* STUDY 4 & 5: BEHAVIORAL BIASES & THE MILLIONAIRE NEXT DOOR          */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Study 4: Mental Accounting */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            Nobel Prize Economics Study
          </span>
          <h4 className="font-black text-[#081a3d] text-lg">
            Mental Accounting Bias (Kahneman & Tversky)
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Psychologists discovered that human brains treat "windfall money" (gifts, pocket change, festival money) with less respect than earned money, spending it 4x faster on junk.
          </p>
          <div className="p-3 bg-purple-50 rounded-xl text-xs text-purple-900 font-bold">
            💡 Young Leader Rule: A gift of ₦5,000 has the exact same compounding power as ₦5,000 earned through 20 hours of work. Treat every naira with equal reverence!
          </div>
        </div>

        {/* Study 5: The Millionaire Next Door */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Empirical Wealth Study
          </span>
          <h4 className="font-black text-[#081a3d] text-lg">
            The Millionaire Next Door (Stanley & Danko)
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            In a 20-year empirical study of over 1,000 self-made millionaires, researchers discovered that 80%+ were first-generation, lived in modest homes, drove ordinary cars, and never bought luxury items to impress neighbors.
          </p>
          <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 font-bold">
            💡 True Wealth is Silent; Fake Wealth is Loud. Real leaders prioritize financial peace and freedom over peer validation.
          </div>
        </div>

      </div>

    </div>
  );
};
