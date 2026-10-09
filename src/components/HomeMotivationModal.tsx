import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, Volume2, Copy, Check, Heart, 
  X, ArrowLeft, ArrowRight, Quote, CheckCircle2, User as UserIcon
} from 'lucide-react';
import { ClassMotivation, User } from '../types';
import { INITIAL_MOTIVATIONS } from '../data/initialMotivations';
import { playSuccessSound } from '../utils/sound';

interface HomeMotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
}

export const HomeMotivationModal: React.FC<HomeMotivationModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  // Load motivations from localStorage or fallback to INITIAL_MOTIVATIONS
  const [motivationsList, setMotivationsList] = useState<ClassMotivation[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_class_motivations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_MOTIVATIONS;
  });

  // Calculate day-of-year index
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const dailyIndex = motivationsList.length > 0 
    ? (getDayOfYear() % motivationsList.length) 
    : 0;

  const [currentIndex, setCurrentIndex] = useState<number>(dailyIndex);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Reload motivations when modal opens
  useEffect(() => {
    if (!isOpen) return;
    try {
      const saved = localStorage.getItem('echo_plan_class_motivations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMotivationsList(parsed);
        }
      }
    } catch {
      // fallback
    }

    // Check if there's a personalized motivation for the logged-in user
    if (currentUser?.name) {
      const personalIdx = motivationsList.findIndex(
        m => m.targetType === 'one_to_one' && 
             m.targetStudentName?.trim().toLowerCase() === currentUser.name.trim().toLowerCase()
      );
      if (personalIdx !== -1) {
        setCurrentIndex(personalIdx);
        return;
      }
    }

    setCurrentIndex(dailyIndex);
  }, [isOpen, currentUser?.name]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentMotivation: ClassMotivation = motivationsList[currentIndex] || motivationsList[0] || {
    id: 'mot-default',
    orderNumber: 1,
    quote: 'Believe in yourself, there is nothing you cannot do.',
    author: 'Lead Admin Victoria Okajoe',
    category: 'Self-Belief',
    targetType: 'general',
    createdAt: 'Daily Wisdom',
    createdBy: 'Victoria Okajoe',
    likesCount: 42
  };

  const handleNextMotivation = () => {
    if (motivationsList.length <= 1) return;
    playSuccessSound();
    setCurrentIndex(prev => (prev + 1) % motivationsList.length);
  };

  const handlePrevMotivation = () => {
    if (motivationsList.length <= 1) return;
    playSuccessSound();
    setCurrentIndex(prev => (prev - 1 + motivationsList.length) % motivationsList.length);
  };

  const handleCopyQuote = () => {
    const textToCopy = `"${currentMotivation.quote}" — ${currentMotivation.author} (Echo Plan Motivation)`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    playSuccessSound();
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeakQuote = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${currentMotivation.quote}. By ${currentMotivation.author}`);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleLike = () => {
    const currentStatus = !!likedMap[currentMotivation.id];
    setLikedMap(prev => ({
      ...prev,
      [currentMotivation.id]: !currentStatus
    }));
    playSuccessSound();
  };

  const handleClose = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    onClose();
  };

  const isPersonal = currentMotivation.targetType === 'one_to_one';
  const isLiked = !!likedMap[currentMotivation.id];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#051126]/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={handleClose}
    >
      <div 
        className="bg-gradient-to-br from-[#0c1b3a] via-[#141b46] to-[#1f1747] border border-indigo-500/30 rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden relative flex flex-col my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#061430]/60">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-bold text-xs transition-colors cursor-pointer border border-white/10"
            title="Go back to Home Page"
          >
            <ArrowLeft size={15} className="text-[#62c5fa]" />
            <span>← Back to Home</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-400/30">
            <Sparkles size={13} className="text-amber-300 animate-pulse" />
            <span>Daily Academic Motivation</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Motivation Card Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Category & Counter Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold border border-indigo-400/30">
              {currentMotivation.category || 'Academic Success'}
            </span>

            {isPersonal && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/40 flex items-center gap-1.5">
                <UserIcon size={13} />
                <span>Personalized Note for {currentMotivation.targetStudentName}</span>
              </span>
            )}

            <span className="text-xs text-slate-400 font-mono">
              Quote {currentIndex + 1} of {motivationsList.length}
            </span>
          </div>

          {/* Quotation Body */}
          <div className="relative py-4 sm:py-6 px-2">
            <Quote size={40} className="text-purple-400/20 absolute -top-2 -left-2 transform -scale-x-100 pointer-events-none" />
            
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed tracking-tight relative z-10 italic">
              &ldquo;{currentMotivation.quote}&rdquo;
            </p>

            <div className="mt-4 flex items-center justify-end">
              <span className="text-sm sm:text-base font-bold text-[#62c5fa]">
                — {currentMotivation.author}
              </span>
            </div>
          </div>

          {/* Interactive Tools Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              {/* Audio Read-Aloud */}
              <button
                type="button"
                onClick={handleSpeakQuote}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSpeaking
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                }`}
                title="Listen to quote audio"
              >
                <Volume2 size={16} />
                <span>{isSpeaking ? 'Listening...' : 'Listen'}</span>
              </button>

              {/* Copy Quote */}
              <button
                type="button"
                onClick={handleCopyQuote}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-white/10"
                title="Copy quote"
              >
                {isCopied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>

              {/* Like / Heart */}
              <button
                type="button"
                onClick={handleToggleLike}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isLiked
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                }`}
                title="Like motivation"
              >
                <Heart size={16} className={isLiked ? 'fill-rose-400 text-rose-400' : ''} />
                <span>{currentMotivation.likesCount + (isLiked ? 1 : 0)}</span>
              </button>
            </div>

            {/* Cycle / Motivate Me Again Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMotivation}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10"
                title="Previous motivation"
              >
                <ArrowLeft size={16} />
              </button>

              <button
                type="button"
                onClick={handleNextMotivation}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-2 shadow-md active:scale-95 border border-purple-400/40"
                title="Click to cycle next motivation"
              >
                <span>Motivate Me Again</span>
                <RefreshCw size={14} />
              </button>

              <button
                type="button"
                onClick={handleNextMotivation}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10"
                title="Next motivation"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Quick Affirmation Note */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-[#c8daf3]">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>
              Every morning when you open Echo Plan, your daily motivation aligns your mindset for academic distinction and productive study habits.
            </span>
          </div>

        </div>

        {/* Bottom Bar: Return to Home Page */}
        <div className="px-6 py-3.5 bg-[#061430]/60 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            ← Return to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};
