import React, { useState } from 'react';
import { 
  X, BookOpen, Sparkles, CheckCircle2, AlertTriangle, 
  HelpCircle, Lightbulb, ArrowRight, Check, Send, 
  Loader2, PlusCircle, Compass, Atom, Palette, Award, Bookmark
} from 'lucide-react';
import { TopicLessonPlan, ReadingBook } from '../data/readingBooksData';
import { playSuccessSound } from '../utils/sound';

interface TopicLessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonPlan: TopicLessonPlan | null;
  book: ReadingBook | null;
  onAddStudyTask?: (task: { title: string; category: any; time: string; priority: any }) => void;
}

export const TopicLessonPlanModal: React.FC<TopicLessonPlanModalProps> = ({
  isOpen,
  onClose,
  lessonPlan,
  book,
  onAddStudyTask
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'howToSolve' | 'workedExamples' | 'exercises'>('all');
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [taskAdded, setTaskAdded] = useState(false);

  // AI Tutor prompt
  const [userQuery, setUserQuery] = useState('');
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  if (!isOpen || !lessonPlan) return null;

  const toggleHint = (idx: number) => {
    setRevealedHints(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleAnswer = (idx: number) => {
    setRevealedAnswers(prev => ({ ...prev, [idx]: !prev[idx] }));
    playSuccessSound();
  };

  const handleAddPlanToTasks = () => {
    if (!onAddStudyTask) return;
    onAddStudyTask({
      title: `Study Lesson: ${lessonPlan.topicTitle.slice(0, 35)}...`,
      time: '5:00 PM',
      category: book?.subject.toLowerCase().includes('math') 
        ? 'Mathematics' 
        : book?.subject.toLowerCase().includes('sci') 
        ? 'Science' 
        : 'Reading',
      priority: 'high'
    });
    setTaskAdded(true);
    playSuccessSound();
  };

  const handleAskAiTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isAskingAi) return;

    setIsAskingAi(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/tutor-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: lessonPlan.topicTitle,
          subject: book?.subject || 'Curriculum Subject',
          userQuestion: userQuery.trim()
        })
      });
      const data = await res.json();
      if (data && data.answer) {
        setAiResponse(data.answer);
        playSuccessSound();
      } else {
        setAiResponse(`To solve this on ${lessonPlan.topicTitle}, break down the question into known variables, apply the governing rule, and check your result step by step.`);
      }
    } catch (err) {
      setAiResponse(`To solve questions on ${lessonPlan.topicTitle}, remember the standard step-by-step formula: 1) Identify given values, 2) State the governing law, 3) Execute the solution method, 4) Verify the final answer.`);
    } finally {
      setIsAskingAi(false);
    }
  };

  const isMathOrSci = book?.stream === 'science' || book?.subject.toLowerCase().includes('math');
  const isLifeSkills = book?.stream === 'life_skills' || lessonPlan.id.includes('life');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-label={`Lesson Plan: ${lessonPlan.topicTitle}`}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#071a3d] via-[#0e2c69] to-[#154694] text-white flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-sky-200 text-[10.5px] font-black uppercase tracking-wider border border-sky-400/40 flex items-center gap-1">
                <Bookmark size={11} />
                Interactive Lesson Plan & Solved Guide
              </span>
              {book && (
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[10.5px] font-bold">
                  {book.subject}
                </span>
              )}
              {isMathOrSci ? (
                <span className="px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-200 text-[10px] font-bold flex items-center gap-1">
                  <Atom size={10} /> Science / Math Stream
                </span>
              ) : isLifeSkills ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold flex items-center gap-1">
                  <Compass size={10} /> Life Skills & Independence
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-200 text-[10px] font-bold flex items-center gap-1">
                  <Palette size={10} /> Arts & Humanities
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {lessonPlan.topicTitle}
            </h2>

            {book && (
              <p className="text-xs text-sky-200 font-medium">
                From textbook: <strong className="text-white">{book.title}</strong>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Close Lesson Plan"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSection === 'all' ? 'bg-[#081a3d] text-white shadow-xs' : 'hover:bg-slate-200'
              }`}
            >
              All Sections
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('howToSolve')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                activeSection === 'howToSolve' ? 'bg-[#081a3d] text-white shadow-xs' : 'hover:bg-slate-200'
              }`}
            >
              <span>How to Solve & Steps</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('workedExamples')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                activeSection === 'workedExamples' ? 'bg-[#081a3d] text-white shadow-xs' : 'hover:bg-slate-200'
              }`}
            >
              <span>Worked Examples ({(lessonPlan.howToSolve?.workedExamples || []).length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('exercises')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                activeSection === 'exercises' ? 'bg-[#081a3d] text-white shadow-xs' : 'hover:bg-slate-200'
              }`}
            >
              <span>Practice Exercises ({(lessonPlan.practiceExercises || []).length})</span>
            </button>
          </div>

          {onAddStudyTask && (
            <button
              type="button"
              onClick={handleAddPlanToTasks}
              disabled={taskAdded}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                taskAdded 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              {taskAdded ? <Check size={13} /> : <PlusCircle size={13} />}
              <span>{taskAdded ? 'Added to Planner ✓' : 'Add to Today\'s Planner'}</span>
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          
          {/* Summary & Learning Objectives */}
          <div className="bg-gradient-to-r from-sky-50/80 to-indigo-50/60 rounded-2xl p-5 border border-sky-200/90">
            <h3 className="text-xs font-black uppercase text-[#081a3d] tracking-wider mb-2 flex items-center gap-1.5">
              <Award size={15} className="text-indigo-600" />
              Lesson Overview & Learning Goals
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
              {lessonPlan.summary}
            </p>

            <div className="space-y-1.5 pt-3 border-t border-sky-200/70">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                By the end of this lesson, you will be able to:
              </span>
              {(lessonPlan.learningObjectives || []).map((obj, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-800">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Theoretical Concept & Definitions */}
          {(activeSection === 'all') && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-black uppercase text-[#081a3d] tracking-wider flex items-center gap-1.5">
                <Lightbulb size={15} className="text-amber-500" />
                Foundational Principles & Theory
              </h3>
              <div className="text-xs sm:text-sm font-sans text-slate-700 whitespace-pre-line leading-relaxed font-normal bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
                {lessonPlan.coreConcept}
              </div>
            </div>
          )}

          {/* HOW TO SOLVE: Formula & Step-by-Step Guide */}
          {(activeSection === 'all' || activeSection === 'howToSolve') && (
            <div className="bg-indigo-50/60 rounded-2xl p-5 sm:p-6 border border-indigo-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase text-indigo-950 tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                    📐
                  </span>
                  <span>How to Solve: Standard Governing Method</span>
                </h3>
                <span className="text-[11px] font-black uppercase bg-indigo-200 text-indigo-900 px-2.5 py-0.5 rounded-full">
                  Step-by-Step Blueprint
                </span>
              </div>

              {lessonPlan.howToSolve?.ruleOrFormula && (
                <div className="p-4 rounded-xl bg-[#081a3d] text-white space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#62c5fa]">
                    Governing Rule / Formula Box
                  </span>
                  <div className="text-xs sm:text-sm font-mono font-bold text-sky-100 whitespace-pre-line">
                    {lessonPlan.howToSolve.ruleOrFormula}
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-900 block">
                  Methodical Step-by-Step Execution:
                </span>
                {(lessonPlan.howToSolve?.stepByStepGuide || []).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-indigo-100 shadow-xs">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WORKED EXAMPLES WITH STEP-BY-STEP SOLUTIONS */}
          {(activeSection === 'all' || activeSection === 'workedExamples') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <BookOpen size={15} className="text-blue-600" />
                  <span>Worked Examples with Full Marking Scheme Working</span>
                </h3>
                <span className="text-xs text-slate-500 font-bold">
                  {(lessonPlan.howToSolve?.workedExamples || []).length} Examples Available
                </span>
              </div>

              <div className="space-y-4">
                {(lessonPlan.howToSolve?.workedExamples || []).map((ex, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="p-4 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Worked Example #{idx + 1}
                      </span>
                      <span className="text-[10.5px] font-bold bg-white text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
                        Exam Model
                      </span>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Problem Statement */}
                      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs sm:text-sm font-bold text-[#081a3d]">
                        <strong>Problem: </strong>{ex.problem}
                      </div>

                      {/* Step by step solution */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                          Step-by-Step Solution:
                        </span>
                        <div className="p-4 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs whitespace-pre-line leading-relaxed overflow-x-auto">
                          {ex.solution}
                        </div>
                      </div>

                      {/* Examiner Explanation */}
                      <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                        <Lightbulb size={14} className="text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Examiner Tip & Insight: </strong>
                          <span>{ex.explanation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMMON MISTAKES & TRAPS */}
          {(activeSection === 'all') && (lessonPlan.commonMistakes || []).length > 0 && (
            <div className="bg-rose-50/70 rounded-2xl p-5 border border-rose-200/90 space-y-3">
              <h3 className="text-xs font-black uppercase text-rose-950 tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-rose-600" />
                Common Traps & Student Examination Errors to Avoid
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {lessonPlan.commonMistakes.map((mistake, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-rose-200 text-xs font-medium text-rose-950 flex items-start gap-2 shadow-xs">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span className="leading-snug">{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INTERACTIVE PRACTICE EXERCISES WITH HINTS & ANSWERS */}
          {(activeSection === 'all' || activeSection === 'exercises') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <HelpCircle size={15} className="text-emerald-600" />
                  <span>Self-Check Practice Exercises (Test Yourself!)</span>
                </h3>
                <span className="text-[11px] font-bold text-slate-500">
                  Try solving before revealing answers
                </span>
              </div>

              <div className="space-y-3">
                {(lessonPlan.practiceExercises || []).map((ex, idx) => {
                  const showHint = Boolean(revealedHints[idx]);
                  const showAns = Boolean(revealedAnswers[idx]);
                  return (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {ex.question}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => toggleHint(idx)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Lightbulb size={12} />
                          <span>{showHint ? 'Hide Hint' : '💡 Need a Hint?'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleAnswer(idx)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 size={12} />
                          <span>{showAns ? 'Hide Answer' : 'Reveal Verified Answer & Steps'}</span>
                        </button>
                      </div>

                      {showHint && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900 animate-fade-in">
                          <strong>Hint: </strong>{ex.hint}
                        </div>
                      )}

                      {showAns && (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-950 font-bold whitespace-pre-line animate-fade-in">
                          <strong>Answer & Solution: </strong>{ex.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LIFE SKILL & INDEPENDENCE TAKEAWAY */}
          {lessonPlan.lifeSkillTakeaway && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-2xl p-5 border border-emerald-200 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                <Compass size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
                  Independence, Problem-Solving & Real-Life Decision Value
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {lessonPlan.lifeSkillTakeaway}
                </p>
              </div>
            </div>
          )}

          {/* ASK AI STUDY TUTOR ON THIS TOPIC */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#62c5fa]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#62c5fa]">
                  Ask Echo Plan AI Study Tutor
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">
                Instant Step-by-Step Help
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Have a specific question on {lessonPlan.topicTitle}? Ask below to get an instant step-by-step breakdown.
            </p>

            <form onSubmit={handleAskAiTutor} className="flex gap-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder={`Ask anything about ${lessonPlan.topicTitle}...`}
                className="flex-1 bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-[#62c5fa]"
              />
              <button
                type="submit"
                disabled={isAskingAi || !userQuery.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#62c5fa] hover:bg-[#41b0ee] text-[#081a3d] font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isAskingAi ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                <span>Ask</span>
              </button>
            </form>

            {aiResponse && (
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 whitespace-pre-line leading-relaxed animate-fade-in">
                <strong className="text-[#62c5fa] block mb-1">AI Tutor Response:</strong>
                {aiResponse}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 font-medium hidden sm:inline">
            Echo Plan Interactive Curriculum & Mastery Hub
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#081a3d] hover:bg-[#122e66] text-white font-extrabold text-xs transition-all cursor-pointer ml-auto shadow-xs active:scale-95"
          >
            Finished Reading Lesson
          </button>
        </div>

      </div>
    </div>
  );
};
