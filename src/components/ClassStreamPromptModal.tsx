import React, { useState, useEffect } from 'react';
import { Atom, Palette, CheckCircle2, ArrowRight, School, BookOpen, User, Sparkles, X } from 'lucide-react';
import { playSuccessSound } from '../utils/sound';

interface ClassStreamPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStream?: 'science' | 'art' | 'general';
  studentName?: string;
  studentClass?: string;
  onSelectStream: (stream: 'science' | 'art', updatedName?: string) => void;
}

export const ClassStreamPromptModal: React.FC<ClassStreamPromptModalProps> = ({
  isOpen,
  onClose,
  currentStream,
  studentName = '',
  studentClass = 'SS2',
  onSelectStream
}) => {
  const [selected, setSelected] = useState<'science' | 'art'>(
    currentStream === 'art' ? 'art' : 'science'
  );
  const [enteredName, setEnteredName] = useState<string>(studentName);

  useEffect(() => {
    if (studentName) {
      setEnteredName(studentName);
    }
  }, [studentName]);

  useEffect(() => {
    if (currentStream === 'art' || currentStream === 'science') {
      setSelected(currentStream);
    }
  }, [currentStream]);

  if (!isOpen) return null;

  const handleDirectEnter = (stream: 'science' | 'art') => {
    setSelected(stream);
    onSelectStream(stream, enteredName.trim() || undefined);
    playSuccessSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#081a3d]/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 animate-scale-in relative overflow-hidden my-auto max-h-[92dvh] flex flex-col">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 sm:h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 z-10" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-10"
          title="Close"
        >
          <X size={16} />
        </button>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 sm:p-7 overflow-y-auto flex-1 space-y-4 sm:space-y-5">
          {/* Header */}
          <div className="text-center space-y-1.5 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-black uppercase tracking-wider border border-indigo-100">
              <School size={13} className="text-indigo-600" />
              Classroom Entry • {studentClass} Cohort
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#081a3d] tracking-tight">
              Entering Your Classes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Please choose your department to enter. Are you a <strong>Science student</strong> or an <strong>Art student</strong>?
            </p>
          </div>

          {/* Student Name Confirmation Input - Enables Student Entry */}
          <div className="bg-slate-50/80 p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 space-y-1.5">
            <label className="block text-xs font-black text-[#081a3d] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User size={13} className="text-indigo-600" />
                Student Name For Class Entry
              </span>
              <span className="text-[10px] text-slate-500 font-semibold normal-case">
                (type your name to enter)
              </span>
            </label>
            <input
              type="text"
              value={enteredName}
              onChange={(e) => setEnteredName(e.target.value)}
              placeholder="e.g. Victoria Okafor"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-xs"
            />
          </div>

          {/* Science and Art Stream Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            {/* SCIENCE STUDENT CARD */}
            <div
              onClick={() => setSelected('science')}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                selected === 'science'
                  ? 'bg-blue-50/80 border-blue-600 shadow-md ring-2 ring-blue-300'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              {selected === 'science' && (
                <div className="absolute top-3 right-3 text-blue-600">
                  <CheckCircle2 size={18} />
                </div>
              )}

              <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                  selected === 'science' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Atom size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[#081a3d]">
                  Science Student
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pure Sciences & Technical Stream
                </p>
              </div>

              {/* Science Key Subjects */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1">
                <div className="font-bold text-blue-900 text-[11px]">Key Subjects:</div>
                <div className="text-[11px] text-slate-600 leading-snug">
                  Mathematics, Physics, Chemistry, Biology, Further Maths, English
                </div>

                {/* ENTRY BUTTON - POSITIONED A LITTLE BELOW THE KEY SUBJECTS */}
                <div className="pt-2.5 mt-2 border-t border-blue-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectEnter('science');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs transition-all shadow-md hover:shadow-blue-300/40 flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                  >
                    <span>Enter Science Class</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* ART STUDENT CARD */}
            <div
              onClick={() => setSelected('art')}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                selected === 'art'
                  ? 'bg-purple-50/80 border-purple-600 shadow-md ring-2 ring-purple-300'
                  : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50'
              }`}
            >
              {selected === 'art' && (
                <div className="absolute top-3 right-3 text-purple-600">
                  <CheckCircle2 size={18} />
                </div>
              )}

              <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                  selected === 'art' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                }`}>
                  <Palette size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[#081a3d]">
                  Art Student
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Arts, Humanities & Social Sciences
                </p>
              </div>

              {/* Art Key Subjects */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1">
                <div className="font-bold text-purple-900 text-[11px]">Key Subjects:</div>
                <div className="text-[11px] text-slate-600 leading-snug">
                  Literature, Government, CRK/IRS, History, Economics, English
                </div>

                {/* ENTRY BUTTON - POSITIONED A LITTLE BELOW THE KEY SUBJECTS */}
                <div className="pt-2.5 mt-2 border-t border-purple-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectEnter('art');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-xs transition-all shadow-md hover:shadow-purple-300/40 flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                  >
                    <span>Enter Art Class</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Informative Guidance Note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <BookOpen size={15} className="text-indigo-600 shrink-0 mt-0.5" />
            <span>
              Clicking <strong>Enter Science Class</strong> or <strong>Enter Art Class</strong> directly opens your classroom with customized reading books, assignments, and CBT exams.
            </span>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 bg-white border-t border-slate-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={() => handleDirectEnter(selected)}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs min-h-[40px]"
          >
            <span>Confirm Selected ({selected})</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
