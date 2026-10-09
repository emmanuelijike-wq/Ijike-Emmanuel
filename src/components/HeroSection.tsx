import React from 'react';
import { ArrowRight, Play, Check, Plus, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { TaskItem, HomePageCustomization } from '../types';

interface HeroSectionProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onOpenQuickAdd: () => void;
  onMotivateMe: () => void;
  onGetStarted: () => void;
  customization?: HomePageCustomization;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  tasks,
  onToggleTask,
  onOpenQuickAdd,
  onMotivateMe,
  onGetStarted,
  customization
}) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Display top 4 tasks in the hero plan card
  const heroTasks = tasks.slice(0, 4);

  const heroMotto = customization?.heroMotto || 'PLAN TODAY • ACHIEVE TOMORROW';
  const heroSubtitle = customization?.heroSubtitle || 'Your Smart School Companion';
  const heroDescription = customization?.heroDescription || 
    'Plan your studies, stay organized, build good habits and become the best version of yourself. ECHO PLAN helps you stay focused, grow academically and lead a greater future.';

  return (
    <section id="hero" className="relative min-h-[640px] lg:min-h-[700px] px-4 sm:px-8 lg:px-[7%] py-16 sm:py-20 overflow-hidden bg-[#071a3d] text-white">
      {/* Background gradients and atmospheric light */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 75% 35%, rgba(71, 141, 226, 0.35), transparent 32%),
            linear-gradient(115deg, #071a3d, #0b2b62 55%, #164b91)
          `
        }}
      />

      {/* Decorative concentric glowing rings */}
      <div 
        className="absolute w-[620px] h-[620px] rounded-full border border-white/10 -right-[120px] -top-[150px] pointer-events-none hidden md:block" 
      />
      <div 
        className="absolute w-[390px] h-[390px] rounded-full border border-white/[0.08] right-[40px] -top-[20px] pointer-events-none hidden md:block" 
      />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-[1250px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* Left Side: Hero Copy */}
        <div className="animate-fade-up text-left lg:pr-4">
          
          {/* Tag */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 border border-[#62c5fa]/35 rounded-full bg-white/[0.06] text-[#ccecff] text-[11px] font-bold tracking-[2px] mb-6 backdrop-blur-sm shadow-sm">
            <span className="text-[#63c7fb] text-[14px]">✦</span>
            <span>{heroMotto}</span>
          </div>

          {/* Title */}
          <h1 className="text-[52px] sm:text-[72px] md:text-[84px] lg:text-[96px] xl:text-[104px] font-extrabold leading-[0.92] tracking-[-3px] sm:tracking-[-5px] text-white mb-6">
            ECHO <span className="text-[#61c6fb]">PLAN</span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-[22px] sm:text-[25px] font-extrabold text-white mb-4 tracking-tight">
            {heroSubtitle}
          </h2>

          {/* Description */}
          <p className="max-w-[570px] text-[#c8daf3] text-[15px] sm:text-[16px] leading-[1.75] mb-8">
            {heroDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              id="hero-btn-get-started"
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-[#61c6fb] text-[#082044] text-[14px] font-extrabold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] cursor-pointer"
            >
              Get Started <ArrowRight size={18} />
            </button>

            <button
              id="hero-btn-motivate-me"
              onClick={onMotivateMe}
              className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-[14px] font-extrabold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(124,58,237,0.35)] cursor-pointer border border-purple-400/40"
              title="Tap to display inspiring daily motivation"
            >
              <Sparkles size={18} className="text-amber-300 animate-pulse" />
              Motivate Me
            </button>
          </div>

          {/* Micro Student Proof / Stats */}
          <div className="mt-10 pt-6 border-t border-white/10 flex items-center gap-6 text-[13px] text-[#9bb7df]">
            <div className="flex -space-x-2">
              <span className="inline-block h-8 w-8 rounded-full ring-2 ring-[#071a3d] bg-sky-400 text-[#071a3d] flex items-center justify-center font-bold text-xs">A+</span>
              <span className="inline-block h-8 w-8 rounded-full ring-2 ring-[#071a3d] bg-blue-300 text-[#071a3d] flex items-center justify-center font-bold text-xs">🎓</span>
              <span className="inline-block h-8 w-8 rounded-full ring-2 ring-[#071a3d] bg-indigo-300 text-[#071a3d] flex items-center justify-center font-bold text-xs">📚</span>
            </div>
            <span>Trusted by proactive students mastering daily homework & exams</span>
          </div>

        </div>

        {/* Right Side: Visual Image & Floating Plan Card */}
        <div className="relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center mt-6 lg:mt-0">
          
          {/* Circular Student Visual */}
          <div className="w-[300px] sm:w-[380px] md:w-[430px] lg:w-[450px] h-[300px] sm:h-[380px] md:h-[430px] lg:h-[450px] rounded-full overflow-hidden relative shadow-[0_30px_80px_rgba(0,0,0,0.35)] animate-float bg-gradient-to-br from-[#4e9ce5] to-[#102f66] ring-4 ring-white/10">
            <img
              src="/src/assets/images/teen_students_hero_1789589609561.jpg"
              alt="High school teenage students studying together"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              loading="eager"
            />
          </div>

          {/* Floating Plan Card */}
          <div 
            id="hero-plan-card"
            className="absolute right-0 -bottom-6 sm:bottom-auto sm:top-[65px] w-[275px] sm:w-[295px] bg-white/[0.98] text-[#13264b] rounded-[22px] p-5 sm:p-[22px] shadow-[0_25px_55px_rgba(0,0,0,0.28)] border border-white/60 backdrop-blur-md animate-card-float z-20"
          >
            {/* Plan Card Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#e7edf6] mb-4">
              <div className="flex items-center gap-2.5 font-extrabold text-[16px] sm:text-[17px] text-[#13264b]">
                <div className="w-[30px] h-[30px] rounded-[9px] bg-[#e3f2ff] text-[#1976d2] flex items-center justify-center text-[15px]">
                  <CalendarIcon size={16} />
                </div>
                <span>My Plan</span>
              </div>
              <button
                id="hero-card-add-btn"
                onClick={onOpenQuickAdd}
                title="Add new task"
                className="w-7 h-7 rounded-full bg-sky-50 text-[#1976d2] hover:bg-sky-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Progress Row */}
            <div className="flex justify-between items-center text-[12px] font-bold mb-2">
              <strong className="text-[#18315a]">Today's Progress</strong>
              <span className="text-[#398ddd] font-extrabold">
                {completedCount}/{totalCount}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-[7px] bg-[#e7edf5] rounded-[10px] overflow-hidden mb-4">
              <div 
                className="h-full bg-[#398ddd] rounded-[10px] transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Interactive Tasks List */}
            <div className="space-y-1">
              {heroTasks.map((task) => (
                <div
                  key={task.id}
                  id={`hero-task-${task.id}`}
                  onClick={() => onToggleTask(task.id)}
                  className="flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-sky-50/70 transition-colors cursor-pointer group select-none"
                >
                  <div
                    className={`w-[23px] h-[23px] rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      task.completed
                        ? 'bg-[#419be7] border-[#419be7] text-white'
                        : 'border-[#a9bdd6] group-hover:border-[#419be7]'
                    }`}
                  >
                    {task.completed && <Check size={13} strokeWidth={3} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-[11.5px] font-bold truncate ${
                      task.completed ? 'text-[#7e92ad] line-through' : 'text-[#18315a]'
                    }`}>
                      {task.title}
                    </div>
                    <span className="block text-[9.5px] text-[#8494aa]">
                      {task.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote Card Footer */}
            <div className="mt-3.5 p-3 rounded-[12px] bg-[#edf6ff] text-[#2869a7] text-[10.5px] leading-relaxed font-semibold italic border border-sky-100/60 flex items-start gap-1.5">
              <Sparkles size={13} className="flex-shrink-0 mt-0.5 text-[#398ddd]" />
              <span>“Small steps today can create a greater tomorrow.”</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
