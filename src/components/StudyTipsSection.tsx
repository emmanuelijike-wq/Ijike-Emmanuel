import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, Play, Pause, RotateCcw, Lightbulb, 
  Brain, Sparkles, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';
import { STUDY_TIPS } from '../data/initialData';
import { playTimerBell } from '../utils/sound';

export const StudyTipsSection: React.FC = () => {
  // Focus Timer state
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Flashcard mini-tool state
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const sampleFlashcards = [
    {
      q: 'What is the "Active Recall" study technique?',
      a: 'Closing your study materials and actively generating the answers from memory rather than passively rereading the text.'
    },
    {
      q: 'How does Spaced Repetition enhance exam scores?',
      a: 'By reviewing information at increasing intervals (1 day, 3 days, 1 week), your brain interrupts the forgetting curve and cements knowledge in long-term memory.'
    },
    {
      q: 'What is the core rule of the Feynman Technique?',
      a: 'Explain the concept to an imaginary 10-year-old using plain, simple vocabulary. Any point where you need complex terms reveals a gap in understanding.'
    }
  ];

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playTimerBell();
      if (mode === 'focus') {
        alert('🎉 Focus sprint completed! Great job! Take a 5-minute break.');
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        alert('Break ended. Ready for the next focus session?');
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = mode === 'focus' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <section id="tips" className="py-16 sm:py-20 px-4 sm:px-8 lg:px-[7%] bg-[#f6f9ff]">
      <div className="max-w-[1250px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen size={14} /> Learn & Grow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#081a3d] tracking-tight">
            Science-Backed Study Tools & Tips
          </h2>
          <p className="text-[#597092] text-base mt-2">
            Supercharge your retention, beat procrastination with our focus timer, and master active learning techniques.
          </p>
        </div>

        {/* Dual Column Layout: Focus Timer & Interactive Flashcard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Pomodoro Focus Timer Box */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#081a3d] to-[#102f66] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-[#62c5fa]" />
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#83bce1]">
                    Focus Sprint Timer
                  </span>
                </div>
                <div className="flex bg-white/10 rounded-full p-1 text-xs">
                  <button
                    onClick={() => switchMode('focus')}
                    className={`px-3 py-1 rounded-full font-bold transition-colors ${
                      mode === 'focus' ? 'bg-[#62c5fa] text-[#081a3d]' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    25m Study
                  </button>
                  <button
                    onClick={() => switchMode('break')}
                    className={`px-3 py-1 rounded-full font-bold transition-colors ${
                      mode === 'break' ? 'bg-[#62c5fa] text-[#081a3d]' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    5m Break
                  </button>
                </div>
              </div>

              {/* Huge Digital Display */}
              <div className="text-center py-6">
                <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-white mb-2">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-xs text-[#9bb7df] font-medium uppercase tracking-wider">
                  {isRunning 
                    ? mode === 'focus' ? '🔥 Deep Study Session In Progress' : '☕ Relax & Recharge Your Brain' 
                    : 'Timer Paused • Ready to Start'}
                </p>

                {/* Progress bar */}
                <div className="w-full max-w-xs mx-auto h-2 bg-white/10 rounded-full overflow-hidden mt-6">
                  <div 
                    className="h-full bg-[#62c5fa] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
              <button
                id="timer-toggle-btn"
                onClick={toggleTimer}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-extrabold text-sm transition-all shadow-md cursor-pointer ${
                  isRunning 
                    ? 'bg-amber-400 text-amber-950 hover:bg-amber-300' 
                    : 'bg-[#62c5fa] text-[#081a3d] hover:bg-sky-300'
                }`}
              >
                {isRunning ? <Pause size={16} /> : <Play size={16} className="fill-current" />}
                {isRunning ? 'Pause Sprint' : 'Start Focus Sprint'}
              </button>

              <button
                onClick={resetTimer}
                title="Reset Timer"
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Mini Interactive Self-Testing Flashcard Tool */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e2eaf4] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain size={20} className="text-[#1976d2]" />
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#1976d2]">
                    Active Recall Trainer
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Card {flashcardIndex + 1} of {sampleFlashcards.length}
                </span>
              </div>

              <div className="bg-[#f6faff] border border-[#d6e5fb] rounded-2xl p-6 min-h-[170px] flex flex-col justify-center my-4">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <HelpCircle size={14} /> Question:
                </span>
                <p className="text-base sm:text-lg font-bold text-[#081a3d]">
                  {sampleFlashcards[flashcardIndex].q}
                </p>

                {showAnswer && (
                  <div className="mt-4 pt-3 border-t border-sky-200 animate-fade-up">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 block">
                      Answer:
                    </span>
                    <p className="text-sm text-slate-700 font-medium">
                      {sampleFlashcards[flashcardIndex].a}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="px-4 py-2.5 rounded-xl border border-sky-400 text-sky-700 font-bold text-xs hover:bg-sky-50 transition-colors"
              >
                {showAnswer ? 'Hide Answer' : 'Reveal Answer 💡'}
              </button>

              <button
                onClick={() => {
                  setShowAnswer(false);
                  setFlashcardIndex((flashcardIndex + 1) % sampleFlashcards.length);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#081a3d] text-white font-bold text-xs hover:bg-[#102f66] transition-colors"
              >
                Next Concept <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* 4 Core Study Strategies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STUDY_TIPS.map((tip) => (
            <div 
              key={tip.id} 
              className="bg-white rounded-2xl p-6 border border-[#e2eaf4] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#1976d2] flex items-center justify-center mb-4">
                  <Lightbulb size={20} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                  {tip.category}
                </span>
                <h3 className="text-lg font-bold text-[#081a3d] mt-1 mb-2">
                  {tip.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#597092] mb-4">
                  {tip.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-emerald-700 flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" />
                  <span>Action: {tip.actionableStep}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
