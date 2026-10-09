import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, Volume2, Copy, Check, Heart, 
  MessageSquareHeart, Settings, ArrowRight, ArrowLeft, Trash2, RotateCcw,
  Sun, UserCheck
} from 'lucide-react';
import { ClassMotivation, User, RegisteredStudentItem } from '../types';
import { playSuccessSound } from '../utils/sound';

interface ClassMotivationStationProps {
  currentUser: User | null;
  isAdmin: boolean;
  motivations: ClassMotivation[];
  onAddMotivation: (motivation: Omit<ClassMotivation, 'id' | 'createdAt'>) => void;
  onUpdateMotivation: (motivation: ClassMotivation) => void;
  onDeleteMotivation: (id: string) => void;
  onResetMotivations: () => void;
  onOpenAdminManager: () => void;
  registeredStudents?: RegisteredStudentItem[];
}

export const ClassMotivationStation: React.FC<ClassMotivationStationProps> = ({
  currentUser,
  isAdmin,
  motivations = [],
  onDeleteMotivation,
  onResetMotivations,
  onOpenAdminManager
}) => {
  const safeMotivations = Array.isArray(motivations) ? motivations : [];

  // Compute daily motivation index based on today's calendar date
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const dailyIndex = safeMotivations.length > 0 
    ? (getDayOfYear() % safeMotivations.length) 
    : 0;

  // Active motivation index
  const [currentIndex, setCurrentIndex] = useState<number>(() => dailyIndex);
  const [hasClickedMotivate, setHasClickedMotivate] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [confirmDeleteCurrent, setConfirmDeleteCurrent] = useState(false);

  // Find personalized 1-to-1 motivations for current user
  const personalMotivations = safeMotivations.filter(m => {
    if (!m || !currentUser?.name || typeof currentUser.name !== 'string') return false;
    if (m.targetType !== 'one_to_one' || !m.targetStudentName || typeof m.targetStudentName !== 'string') return false;
    return m.targetStudentName.trim().toLowerCase() === currentUser.name.trim().toLowerCase();
  });

  const hasPersonalNotes = personalMotivations.length > 0;

  useEffect(() => {
    if (currentIndex >= safeMotivations.length && safeMotivations.length > 0) {
      setCurrentIndex(0);
    }
  }, [safeMotivations.length, currentIndex]);

  const currentMotivation: ClassMotivation | undefined = safeMotivations[currentIndex] || safeMotivations[0];

  const handleMotivateMeClick = () => {
    playSuccessSound();
    setHasClickedMotivate(true);
    if (hasClickedMotivate && safeMotivations.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % safeMotivations.length);
    }
  };

  const handleNextMotivation = () => {
    if (safeMotivations.length <= 1) return;
    playSuccessSound();
    setCurrentIndex((prev) => (prev + 1) % safeMotivations.length);
  };

  const handlePrevMotivation = () => {
    if (safeMotivations.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + safeMotivations.length) % safeMotivations.length);
  };

  const handleJumpToDaily = () => {
    playSuccessSound();
    setCurrentIndex(dailyIndex);
  };

  const handleShowPersonalNote = () => {
    if (!hasPersonalNotes) return;
    playSuccessSound();
    const firstPersonal = personalMotivations[0];
    const foundIdx = safeMotivations.findIndex(m => m.id === firstPersonal.id);
    if (foundIdx !== -1) {
      setCurrentIndex(foundIdx);
    }
  };

  const handleCopyQuote = () => {
    if (!currentMotivation) return;
    const textToCopy = `"${currentMotivation.quote}" — ${currentMotivation.author} (Echo Plan Academic Motivation)`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    playSuccessSound();
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeakQuote = () => {
    if (!currentMotivation || !('speechSynthesis' in window)) return;
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
    if (!currentMotivation) return;
    const currentStatus = !!likedMap[currentMotivation.id];
    setLikedMap(prev => ({
      ...prev,
      [currentMotivation.id]: !currentStatus
    }));
    playSuccessSound();
  };

  const isCurrentDaily = currentIndex === dailyIndex;
  const isPersonal = currentMotivation?.targetType === 'one_to_one';

  return (
    <div className="bg-gradient-to-br from-[#0c1b3a] via-[#141b46] to-[#1f1747] rounded-2xl p-4 sm:p-5 border border-indigo-500/25 text-white shadow-lg relative overflow-hidden transition-all">
      {/* Sleek Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 relative z-10 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3b3294] text-purple-200 text-[11px] font-black uppercase tracking-wider border border-purple-400/30">
            <Sparkles size={12} className="text-amber-300" />
            Motivation Hub
          </span>

          {isCurrentDaily && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10.5px] font-extrabold border border-amber-400/30 flex items-center gap-1">
              <Sun size={11} /> Today&apos;s Word
            </span>
          )}

          {isPersonal && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-200 text-[10.5px] font-extrabold border border-rose-400/30 flex items-center gap-1">
              <MessageSquareHeart size={11} className="text-rose-300" />
              1-to-1 Personal Note
            </span>
          )}

          <span className="text-[11px] text-indigo-300/80 hidden md:inline">
            Tap &ldquo;MOTIVATE ME&rdquo; to cycle through daily academic words
          </span>
        </div>

        {/* Header Right Action Buttons */}
        <div className="flex items-center gap-1.5 ml-auto">
          {hasPersonalNotes && (
            <button
              onClick={handleShowPersonalNote}
              className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-[11px] font-black transition-all flex items-center gap-1 border border-rose-400/40 cursor-pointer shadow-xs"
              title="View personal note sent by Admin"
            >
              <MessageSquareHeart size={12} />
              <span>Note ({personalMotivations.length})</span>
            </button>
          )}

          {isAdmin && (
            <button
              id="admin-manage-motivations-btn"
              onClick={onOpenAdminManager}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-black transition-all flex items-center gap-1 border border-white/15 cursor-pointer shadow-xs"
              title="Admin: Manage Motivations (1 to 50)"
            >
              <Settings size={12} className="text-purple-300" />
              <span>Manage (1–50)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Streamlined Content: Compact Horizontal Stage */}
      {currentMotivation ? (
        <div className="pt-3.5 pb-2 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Left Column: Motivate Me Button & Quick Nav (4 cols) */}
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-center md:items-start justify-between gap-2.5">
            <button
              id="motivate-me-primary-btn"
              onClick={handleMotivateMeClick}
              className="w-full sm:w-auto md:w-full px-5 py-2.5 rounded-xl bg-[#3b3294] hover:bg-[#312782] active:scale-95 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md border border-purple-400/40 hover:border-purple-300 transition-all cursor-pointer flex items-center justify-center gap-2 group"
              title="Click to cycle uplifting motivations"
            >
              <Sparkles size={14} className="text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>MOTIVATE ME</span>
              <RefreshCw size={13} className={`text-purple-300 transition-transform ${hasClickedMotivate ? 'group-hover:rotate-180' : ''}`} />
            </button>

            {/* Quick Indicators & Cycling */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-purple-500/25 text-purple-200 font-extrabold text-[10.5px] border border-purple-400/25">
                #{currentMotivation?.orderNumber || (currentIndex + 1)}/{safeMotivations.length}
              </span>
              {currentMotivation?.category && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/25 text-indigo-200 font-semibold text-[10.5px]">
                  {currentMotivation.category}
                </span>
              )}

              {/* Prev / Next Tiny Arrows */}
              <div className="inline-flex items-center gap-1 ml-auto">
                <button
                  onClick={handlePrevMotivation}
                  className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                  title="Previous quote"
                >
                  <ArrowLeft size={12} />
                </button>
                <button
                  onClick={handleJumpToDaily}
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                    isCurrentDaily ? 'bg-amber-400 text-slate-900 font-black' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="Jump to Today's Daily"
                >
                  Daily
                </button>
                <button
                  onClick={handleNextMotivation}
                  className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                  title="Next quote"
                >
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Display & Actions (8 cols) */}
          <div className="md:col-span-8 bg-white/5 backdrop-blur-sm rounded-xl p-3.5 sm:p-4 border border-white/15 flex flex-col justify-between gap-3">
            
            {/* 1-to-1 Recipient Callout if applicable */}
            {isPersonal && currentMotivation.targetStudentName && (
              <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-400/30 text-[11px] text-rose-100 flex items-center gap-1.5">
                <UserCheck size={13} className="text-rose-300 flex-shrink-0" />
                <span>Personal Note for: <strong className="text-white underline">{currentMotivation.targetStudentName}</strong></span>
              </div>
            )}

            {/* Quote Words (Compact & Elegant) */}
            <blockquote className="text-sm sm:text-base md:text-lg font-bold text-white leading-relaxed font-serif italic tracking-tight selection:bg-purple-500">
              &ldquo;{currentMotivation.quote}&rdquo;
            </blockquote>

            {/* Author & Interactive Controls Row */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-black text-[11px] shadow-2xs">
                  {(currentMotivation.author || 'E').charAt(0)}
                </div>
                <div>
                  <span className="font-extrabold text-white text-xs">{currentMotivation.author}</span>
                  <span className="text-[10px] text-indigo-300 ml-1.5 hidden sm:inline">
                    • {currentMotivation.targetType === 'one_to_one' ? 'Personal Note' : currentMotivation.category}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Listen, Copy, Like, Admin Delete */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSpeakQuote}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    isSpeaking ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="Listen aloud"
                >
                  <Volume2 size={12} className={isSpeaking ? 'animate-bounce' : ''} />
                  <span>{isSpeaking ? 'Reading...' : 'Listen'}</span>
                </button>

                <button
                  onClick={handleCopyQuote}
                  className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  title="Copy quote"
                >
                  {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleToggleLike}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    likedMap[currentMotivation.id] ? 'bg-rose-500/80 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="Like quote"
                >
                  <Heart size={12} className={likedMap[currentMotivation.id] ? 'fill-white text-white' : ''} />
                  <span>{(currentMotivation.likesCount || 0) + (likedMap[currentMotivation.id] ? 1 : 0)}</span>
                </button>

                {isAdmin && (
                  confirmDeleteCurrent ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteMotivation(currentMotivation.id);
                          setConfirmDeleteCurrent(false);
                          playSuccessSound();
                        }}
                        className="px-2 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black cursor-pointer animate-pulse"
                      >
                        Confirm?
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteCurrent(false)}
                        className="px-1.5 py-1 rounded-md bg-white/10 text-white text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteCurrent(true)}
                      className="p-1 rounded-md bg-rose-500/20 hover:bg-rose-600 text-rose-200 hover:text-white transition-colors cursor-pointer"
                      title="Admin: Delete quote"
                    >
                      <Trash2 size={12} />
                    </button>
                  )
                )}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="py-4 text-center space-y-2">
          <p className="text-xs text-indigo-200/80">Class motivation collection is currently empty.</p>
          {isAdmin && (
            <button
              onClick={onResetMotivations}
              className="px-3 py-1.5 rounded-lg bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <RotateCcw size={12} /> Restore Motivations
            </button>
          )}
        </div>
      )}

      {/* Slim Category Quick Filter Row */}
      <div className="pt-2 mt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-indigo-200/80">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-white/90">Categories:</span>
          {['Self-Belief', 'Daily Discipline', 'Perseverance', 'Exam Success', 'Personal Encouragement'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                const foundIdx = motivations.findIndex(m => m.category === cat);
                if (foundIdx !== -1) {
                  setCurrentIndex(foundIdx);
                  setHasClickedMotivate(true);
                  playSuccessSound();
                }
              }}
              className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 text-indigo-100 text-[10px] font-bold transition-colors cursor-pointer border border-white/10"
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-indigo-300">
          Total: <strong className="text-white font-bold">{safeMotivations.length}</strong> (1 to {safeMotivations.length})
        </div>
      </div>
    </div>
  );
};
