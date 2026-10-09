import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, Clock, CheckCircle2, XCircle, AlertCircle, 
  HelpCircle, ChevronRight, ChevronLeft, RotateCcw, 
  Sparkles, Award, FileText, Check, ShieldCheck, Flag, 
  Eye, ListChecks, Printer, BarChart3, ArrowRight, User as UserIcon,
  ShieldAlert, AlertTriangle, Plus, Trash2, Atom, Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  SS2_ENGLISH_MOCK_QUESTIONS, 
  COMPREHENSION_PASSAGE, 
  ExamQuestion, 
  ExamSubmissionRecord, 
  calculateExamGrade 
} from '../data/mockExamData';
import { 
  CBTExam, 
  DEFAULT_CBT_EXAMS,
  getStoredCBTExams,
  deleteCBTExam,
  restoreDefaultCBTExams
} from '../data/cbtExamsRegistry';
import { User, ExamRedFlagStrike, RegisteredStudentItem } from '../types';
import { playSuccessSound } from '../utils/sound';
import { getEffectiveStudentStream, setEffectiveStudentStream } from '../utils/authManager';
import { AdminAiPdfToCbtModal } from './AdminAiPdfToCbtModal';

interface PracticeExamCenterProps {
  currentUser: User | null;
  onNavigateToStudyPage?: () => void;
}

const STRICT_EXAM_DURATION_SECONDS = 30 * 60; // Strictly 30 minutes timed exam

export const PracticeExamCenter: React.FC<PracticeExamCenterProps> = ({
  currentUser
}) => {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'student_admin' || currentUser?.isAdmin || currentUser?.email === 'ijikevictoriaokajoe@gmail.com';
  
  // Student department stream ('science' or 'art')
  const [studentStream, setStudentStream] = useState<'science' | 'art'>(() => {
    return getEffectiveStudentStream(currentUser);
  });
  const [adminStreamFilter, setAdminStreamFilter] = useState<'all' | 'science' | 'art'>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // CBT Exams Registry
  const [exams, setExams] = useState<CBTExam[]>(() => {
    const list = getStoredCBTExams();
    return Array.isArray(list) && list.length > 0 ? list : DEFAULT_CBT_EXAMS;
  });

  const [selectedExamId, setSelectedExamId] = useState<string>(() => {
    try {
      const target = sessionStorage.getItem('echo_plan_active_cbt_exam');
      if (target) {
        return target;
      }
    } catch {
      // ignore
    }
    const initialStream = getEffectiveStudentStream(currentUser);
    return initialStream === 'art' ? 'ss2-art-gov-lit-2026' : 'ss2-science-core-2026';
  });

  // Keep exams and stream synchronized when custom exams are saved or stream changes
  useEffect(() => {
    const syncExams = () => {
      const list = getStoredCBTExams();
      if (Array.isArray(list) && list.length > 0) {
        setExams(list);
      }
      setStudentStream(getEffectiveStudentStream(currentUser));
      try {
        const target = sessionStorage.getItem('echo_plan_active_cbt_exam');
        if (target) {
          setSelectedExamId(target);
          sessionStorage.removeItem('echo_plan_active_cbt_exam');
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', syncExams);
    window.addEventListener('focus', syncExams);
    syncExams();

    return () => {
      window.removeEventListener('storage', syncExams);
      window.removeEventListener('focus', syncExams);
    };
  }, [currentUser]);

  const [isAiPdfModalOpen, setIsAiPdfModalOpen] = useState<boolean>(false);
  const [examToDelete, setExamToDelete] = useState<CBTExam | null>(null);

  // Available CBT exams:
  // Science students only see Science CBT exams.
  // Art students only see Art CBT exams.
  // Admin sees all and can filter.
  const visibleExams = useMemo(() => {
    const validList = Array.isArray(exams) && exams.length > 0 ? exams : DEFAULT_CBT_EXAMS;
    let list: CBTExam[];
    if (isAdmin) {
      if (adminStreamFilter === 'science') list = validList.filter(e => e.stream === 'science');
      else if (adminStreamFilter === 'art') list = validList.filter(e => e.stream === 'art');
      else list = validList;
    } else if (studentStream === 'science') {
      const sciList = validList.filter(e => e.stream === 'science');
      list = sciList.length > 0 ? sciList : DEFAULT_CBT_EXAMS.filter(e => e.stream === 'science');
    } else {
      const artList = validList.filter(e => e.stream === 'art');
      list = artList.length > 0 ? artList : DEFAULT_CBT_EXAMS.filter(e => e.stream === 'art');
    }

    if (selectedSubjectFilter !== 'all') {
      return list.filter(e => e.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase()));
    }
    return list;
  }, [exams, isAdmin, adminStreamFilter, studentStream, selectedSubjectFilter]);

  // Active exam with complete null-safety
  const activeExam = useMemo(() => {
    const validList = visibleExams.length > 0 ? visibleExams : DEFAULT_CBT_EXAMS;
    const found = validList.find(e => e.id === selectedExamId);
    if (found) return found;
    return validList[0] || DEFAULT_CBT_EXAMS[0];
  }, [visibleExams, selectedExamId]);

  const currentQuestions = (activeExam && Array.isArray(activeExam.questions)) ? activeExam.questions : [];
  const totalQuestions = currentQuestions.length;

  // Exam State: 'intro' | 'active' | 'results' | 'review' | 'breached'
  const [examState, setExamState] = useState<'intro' | 'active' | 'results' | 'review' | 'breached'>('intro');

  // Active disciplinary red flag strike if student breached exam rules
  const [activeStrike, setActiveStrike] = useState<ExamRedFlagStrike | null>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_exam_strike');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // fallback
    }
    return null;
  });

  // Active question index (0 to N-1)
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Student answers: Record<questionNumber, 'A' | 'B' | 'C' | 'D'>
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});

  // Flagged questions for review
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});

  // Timer configuration - strictly 30 minutes
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(STRICT_EXAM_DURATION_SECONDS);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active filter in review mode
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  // Submit confirmation dialog
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Latest calculated result
  const [latestResult, setLatestResult] = useState<ExamSubmissionRecord | null>(null);

  // Stored past exam history from localStorage (safely ensured to be an array)
  const [examHistory, setExamHistory] = useState<ExamSubmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_exam_results');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Adjustable CBT Exam Font Size: 'compact' | 'normal' | 'large'
  // Default to 'compact' for Admin to significantly reduce font size and make it adjustable
  const [cbtFontSize, setCbtFontSize] = useState<'compact' | 'normal' | 'large'>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_cbt_font_size');
      if (saved === 'compact' || saved === 'normal' || saved === 'large') return saved;
    } catch {
      // fallback
    }
    return isAdmin ? 'compact' : 'normal';
  });

  const handleSetFontSize = (size: 'compact' | 'normal' | 'large') => {
    setCbtFontSize(size);
    try {
      localStorage.setItem('echo_plan_cbt_font_size', size);
    } catch {}
    playSuccessSound();
  };

  // Font sizing styles based on adjustable setting
  const fontConfig = {
    compact: {
      questionTitle: 'text-xs sm:text-[14px] font-bold leading-snug',
      optionPadding: 'p-2 sm:p-2.5',
      optionBadge: 'w-6 h-6 text-xs rounded-lg',
      optionText: 'text-xs leading-normal',
      passageBox: 'p-2.5 text-xs',
      cardPadding: 'p-3 sm:p-5',
      headerTitle: 'text-base sm:text-lg font-black',
      headerDesc: 'text-xs text-slate-500',
      matrixBtn: 'h-7 text-[11px]',
      reviewCard: 'p-3.5 text-xs',
      badgeText: 'text-[10px]'
    },
    normal: {
      questionTitle: 'text-sm sm:text-base font-bold leading-normal',
      optionPadding: 'p-3 sm:p-3.5',
      optionBadge: 'w-7 h-7 text-xs rounded-xl',
      optionText: 'text-xs sm:text-sm leading-relaxed',
      passageBox: 'p-3.5 text-xs sm:text-sm',
      cardPadding: 'p-5 sm:p-6',
      headerTitle: 'text-lg sm:text-xl font-black',
      headerDesc: 'text-xs sm:text-sm text-slate-500',
      matrixBtn: 'h-8 text-xs',
      reviewCard: 'p-4 text-xs sm:text-sm',
      badgeText: 'text-[11px]'
    },
    large: {
      questionTitle: 'text-base sm:text-lg font-extrabold leading-relaxed',
      optionPadding: 'p-3.5 sm:p-4',
      optionBadge: 'w-8 h-8 text-sm rounded-xl',
      optionText: 'text-sm sm:text-base leading-relaxed',
      passageBox: 'p-4 text-sm',
      cardPadding: 'p-6 sm:p-8',
      headerTitle: 'text-xl sm:text-2xl font-black',
      headerDesc: 'text-sm text-slate-500',
      matrixBtn: 'h-9 text-xs font-bold',
      reviewCard: 'p-5 text-sm',
      badgeText: 'text-xs'
    }
  }[cbtFontSize];

  // Reusable font size selector control
  const FontSizeSelector = ({ dark = false }: { dark?: boolean }) => (
    <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs ${
      dark 
        ? 'bg-white/10 border-white/20 text-white' 
        : 'bg-slate-100 border-slate-200 text-slate-700 shadow-2xs'
    }`}>
      <span className={`text-[10px] font-black uppercase px-1.5 flex items-center gap-1 ${dark ? 'text-sky-200' : 'text-slate-500'}`}>
        <Sparkles size={11} className={dark ? 'text-sky-300' : 'text-indigo-600'} />
        <span>Font:</span>
      </span>
      <button
        type="button"
        onClick={() => handleSetFontSize('compact')}
        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          cbtFontSize === 'compact'
            ? 'bg-indigo-600 text-white shadow-xs'
            : dark ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
        }`}
        title="Compact (Admin Default): Small fonts & condensed spacing"
      >
        A- Compact {isAdmin ? '(Admin)' : ''}
      </button>
      <button
        type="button"
        onClick={() => handleSetFontSize('normal')}
        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          cbtFontSize === 'normal'
            ? 'bg-indigo-600 text-white shadow-xs'
            : dark ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
        }`}
        title="Standard font size"
      >
        A Standard
      </button>
      <button
        type="button"
        onClick={() => handleSetFontSize('large')}
        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          cbtFontSize === 'large'
            ? 'bg-indigo-600 text-white shadow-xs'
            : dark ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
        }`}
        title="Large font size"
      >
        A+ Large
      </button>
    </div>
  );

  // Current active question
  const currentQuestion: ExamQuestion = currentQuestions[currentIndex] || currentQuestions[0] || {
    id: 1,
    questionNumber: 1,
    sectionTitle: 'General',
    questionText: 'Loading exam question...',
    options: { A: '', B: '', C: '', D: '' },
    correctAnswer: 'A',
    explanation: ''
  };

  const currentQNum = currentQuestion.questionNumber || currentQuestion.id || (currentIndex + 1);
  const currentQText = currentQuestion.questionText || currentQuestion.question || '';
  const currentQSection = currentQuestion.sectionTitle || currentQuestion.topic || 'General Examination';

  // Count answered questions
  const answeredCount = Object.keys(answers).length;

  // Timer tick effect
  useEffect(() => {
    if (examState === 'active') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
        if (isTimed) {
          setTimeRemainingSeconds(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              handleAutoSubmitOnTimeout();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examState, isTimed]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Trigger Red Flag Disciplinary Strike if student leaves the exam room
  const triggerExamBreach = (reason: string) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const strike: ExamRedFlagStrike = {
      id: `strike-${Date.now()}`,
      studentName: currentUser?.name || 'Student Candidate',
      studentEmail: currentUser?.email,
      dateStr: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      examTitle: `${activeExam.title} (Strict 30 Mins)`,
      reason,
      active: true,
      habitStreakPenalty: true
    };

    setActiveStrike(strike);
    setExamState('breached');

    try {
      // 1. Save active strike
      localStorage.setItem('echo_plan_exam_strike', JSON.stringify(strike));

      // 2. Append to strike history
      const savedHistory = localStorage.getItem('echo_plan_exam_strike_history');
      const hist = savedHistory ? JSON.parse(savedHistory) : [];
      localStorage.setItem('echo_plan_exam_strike_history', JSON.stringify([strike, ...hist]));

      // 3. Apply strike penalty to Daily Habit Tracker
      localStorage.setItem('echo_plan_habit_red_flag_penalty', JSON.stringify({
        active: true,
        struckAt: new Date().toISOString(),
        reason: strike.reason,
        studentName: strike.studentName,
        dateStr: strike.dateStr
      }));

      // 4. Update student in registered students roster
      const savedStudents = localStorage.getItem('echo_plan_registered_students');
      if (savedStudents) {
        const parsed = JSON.parse(savedStudents);
        if (Array.isArray(parsed)) {
          const updated = parsed.map((s: RegisteredStudentItem) => {
            const matchesName = currentUser?.name && s.studentName.toLowerCase().includes(currentUser.name.toLowerCase());
            const matchesEmail = currentUser?.email && s.email === currentUser.email;
            if (matchesName || matchesEmail) {
              return {
                ...s,
                hasRedFlag: true,
                redFlagReason: reason,
                redFlagDate: strike.dateStr
              };
            }
            return s;
          });
          localStorage.setItem('echo_plan_registered_students', JSON.stringify(updated));
        }
      }
    } catch {
      // ignore
    }

    // Trigger storage event so Home and Habits pages react immediately
    window.dispatchEvent(new Event('storage'));
  };

  // Anti-cheating & Examination Room Integrity Monitor
  useEffect(() => {
    if (examState !== 'active') return;

    let hasBreached = false;

    const onVisibilityChange = () => {
      if (document.hidden && !hasBreached) {
        hasBreached = true;
        triggerExamBreach('Navigated away or switched browser tabs during active 30-minute CBT exam.');
      }
    };

    const onWindowBlur = () => {
      if (!hasBreached) {
        hasBreached = true;
        triggerExamBreach('Clicked outside the exam window or switched applications during active 30-minute CBT exam.');
      }
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Warning: Leaving the exam will trigger a Red Flag Strike on your habit streak!';
      return e.returnValue;
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [examState, currentUser]);

  // Select Exam Paper
  const handleSelectExam = (exam: CBTExam) => {
    setSelectedExamId(exam.id);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setElapsedSeconds(0);
    setTimeRemainingSeconds((exam.durationMinutes || 30) * 60);
  };

  // Start Exam - Strictly 30 Minutes
  const handleStartExam = () => {
    setIsTimed(true);
    setTimeRemainingSeconds((activeExam?.durationMinutes || 30) * 60);
    setElapsedSeconds(0);
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setShowSubmitModal(false);
    setExamState('active');
  };

  // Select Option
  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    if (examState !== 'active') return;
    setAnswers(prev => ({
      ...prev,
      [currentQNum]: option
    }));
  };

  // Toggle flag
  const toggleFlag = (qNum: number) => {
    setFlagged(prev => ({
      ...prev,
      [qNum]: !prev[qNum]
    }));
  };

  // Auto-submit when timer expires
  const handleAutoSubmitOnTimeout = () => {
    executeSubmission();
  };

  // Execute Submission & Calculate Grade
  const executeSubmission = () => {
    setShowSubmitModal(false);

    // Calculate score
    let totalScore = 0;
    const sectionScores: Record<string, { correct: number; total: number }> = {};

    currentQuestions.forEach((q, idx) => {
      const secTitle = q.sectionTitle || q.topic || 'General Examination';
      if (!sectionScores[secTitle]) {
        sectionScores[secTitle] = { correct: 0, total: 0 };
      }
      sectionScores[secTitle].total += 1;

      const qNum = q.questionNumber || q.id || (idx + 1);
      const studentAns = answers[qNum];
      if (studentAns === q.correctAnswer) {
        totalScore += 1;
        sectionScores[secTitle].correct += 1;
      }
    });

    const gradeInfo = calculateExamGrade(totalScore, totalQuestions);

    const submission: ExamSubmissionRecord = {
      id: `exam-${Date.now()}`,
      studentName: currentUser?.name || 'Student Practice Attempt',
      studentEmail: currentUser?.email,
      studentClass: activeExam.studentClass || currentUser?.grade || 'SS2',
      examTitle: activeExam.title,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      score: totalScore,
      totalQuestions,
      percentage: gradeInfo.percentage,
      grade: gradeInfo.grade,
      timeSpentSeconds: elapsedSeconds,
      answers,
      sectionScores
    };

    setLatestResult(submission);
    setExamState('results');

    // Save record to local storage
    try {
      const updatedHistory = [submission, ...examHistory];
      setExamHistory(updatedHistory);
      localStorage.setItem('echo_plan_exam_results', JSON.stringify(updatedHistory));
    } catch {
      // ignore
    }

    playSuccessSound();

    if (gradeInfo.percentage >= 50) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Filtered review questions
  const reviewQuestions = useMemo(() => {
    if (!latestResult) return currentQuestions;
    return currentQuestions.filter((q, idx) => {
      const qNum = q.questionNumber || q.id || (idx + 1);
      const studentAns = latestResult.answers[qNum];
      const isCorrect = studentAns === q.correctAnswer;
      if (reviewFilter === 'correct') return isCorrect;
      if (reviewFilter === 'incorrect') return !isCorrect;
      return true;
    });
  }, [latestResult, reviewFilter, currentQuestions]);

  // Dynamic sections breakdown from the active exam questions
  const examSections = useMemo(() => {
    const map: Record<string, number> = {};
    currentQuestions.forEach(q => {
      const sec = q.sectionTitle || q.topic || 'General Curriculum';
      map[sec] = (map[sec] || 0) + 1;
    });
    return Object.entries(map).map(([title, count], idx) => ({
      letter: String.fromCharCode(65 + idx),
      title,
      count
    }));
  }, [currentQuestions]);

  return (
    <div id="practice-exam-hall" className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden my-8 scroll-mt-24">
      
      {/* ------------------------------------------------------------------ */}
      {/* VIEW 1: INTRO & DASHBOARD SCREEN                                   */}
      {/* ------------------------------------------------------------------ */}
      {examState === 'intro' && (
        <div className="p-6 sm:p-10 space-y-8">
          {/* Top Title Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-wider border border-indigo-100">
                  <Award size={14} className="text-indigo-600" />
                  CBT External Exam Practice Center
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 border ${
                  activeExam.stream === 'science'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : activeExam.stream === 'art'
                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {activeExam.stream === 'science' ? <Atom size={12} /> : <Palette size={12} />}
                  <span>{activeExam.stream === 'science' ? 'Science Exam' : activeExam.stream === 'art' ? 'Art Exam' : 'General Exam'}</span>
                </span>
              </div>
              <h2 className={`${fontConfig.headerTitle} text-[#081a3d] tracking-tight`}>
                {activeExam.title}
              </h2>
              <p className={`${fontConfig.headerDesc} mt-1 max-w-2xl leading-relaxed`}>
                {activeExam.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Font Size Selector directly in Exam Header */}
              <div className="flex items-center">
                <FontSizeSelector />
              </div>

              {isAdmin && activeExam && (
                <button
                  type="button"
                  onClick={() => setExamToDelete(activeExam)}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center gap-1.5 border border-rose-200 transition-all cursor-pointer"
                  title={`Admin: Delete ${activeExam.title}`}
                >
                  <Trash2 size={14} className="text-rose-600" />
                  <span>Delete Paper</span>
                </button>
              )}

              <button
                id="start-cbt-practice-exam-btn"
                type="button"
                onClick={handleStartExam}
                className="px-5 py-3 rounded-2xl bg-[#081a3d] hover:bg-[#122e66] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 group"
              >
                <Clock size={15} className="text-[#62c5fa] group-hover:rotate-12 transition-transform" />
                <span>Start Timed Exam ({activeExam.durationMinutes || 30}m)</span>
                <ArrowRight size={15} className="text-[#62c5fa]" />
              </button>
            </div>
          </div>

          {/* Department Academic Stream Bar (Science vs Art) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-sky-50/30 to-indigo-50/40 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-xs ${
                studentStream === 'science' ? 'bg-blue-600' : 'bg-purple-600'
              }`}>
                {studentStream === 'science' ? <Atom size={20} /> : <Palette size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#081a3d]">
                    Your Academic Stream: <span className="capitalize">{studentStream} Student</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    studentStream === 'science' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {studentStream === 'science' ? 'Writing Science CBT' : 'Writing Art CBT'}
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-600 mt-0.5">
                  {studentStream === 'science'
                    ? 'Science students write official Science courses: Mathematics, Science Course, Chemistry, Biology, Physics, Civic, and related science exams.'
                    : 'Art students write official Art courses: Literature, Math, English, Civic, and related arts/humanities CBT exams.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => {
                  const nextStream = studentStream === 'science' ? 'art' : 'science';
                  setStudentStream(nextStream);
                  setEffectiveStudentStream(nextStream, currentUser);
                  setSelectedExamId(nextStream === 'art' ? 'ss2-art-gov-lit-2026' : 'ss2-science-core-2026');
                  playSuccessSound();
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95 ${
                  studentStream === 'science'
                    ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                }`}
                title={`Switch your department to ${studentStream === 'science' ? 'Art' : 'Science'} student`}
              >
                <span>Switch to {studentStream === 'science' ? '🎨 Art Student' : '🔬 Science Student'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Exam Paper Switcher & Stream Organizing Sections */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText size={14} className="text-indigo-600" />
                  <span>
                    Official CBT Examination Papers ({visibleExams.length} Available 
                    {!isAdmin && ` for ${studentStream === 'science' ? 'Science' : 'Art'} Stream`})
                  </span>
                </h3>
                <span className="text-[11px] text-slate-400 font-semibold">
                  {isAdmin 
                    ? 'Administrator View: Displaying both Science and Arts stream curriculum papers' 
                    : `Organized for ${studentStream === 'science' ? 'Science Students (Math, Chemistry, Biology, Physics, Civic)' : 'Arts Students (Literature, Math, English, Civic)'}`}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {isAdmin ? (
                  <>
                    {/* Admin Stream Filter Tabs */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold mr-1">
                      <button
                        type="button"
                        onClick={() => { setAdminStreamFilter('all'); setSelectedSubjectFilter('all'); }}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          adminStreamFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        All ({exams.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAdminStreamFilter('science'); setSelectedSubjectFilter('all'); }}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                          adminStreamFilter === 'science' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Atom size={12} />
                        <span>Science</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAdminStreamFilter('art'); setSelectedSubjectFilter('all'); }}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                          adminStreamFilter === 'art' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Palette size={12} />
                        <span>Art</span>
                      </button>
                    </div>
                    {/* Admin Font Sizing Tool */}
                    <FontSizeSelector />
                    <button
                      type="button"
                      onClick={() => setIsAiPdfModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      title="Admin Only: Add a new CBT exam paper via PDF upload or verified sample"
                    >
                      <Plus size={14} />
                      <span>+ Add CBT Exam</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Restore all default WAEC/NECO CBT examination papers?')) {
                          const restored = restoreDefaultCBTExams();
                          setExams(restored);
                          playSuccessSound();
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                      title="Restore all default CBT examination papers"
                    >
                      <RotateCcw size={12} />
                      <span className="hidden sm:inline">Reset Defaults</span>
                    </button>
                  </>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold border border-slate-200/80 flex items-center gap-1.5">
                    <ShieldAlert size={12} className="text-slate-400" />
                    <span>CBT Exams Managed by Admin (Students Cannot Add)</span>
                  </span>
                )}
              </div>
            </div>

            {/* SUBJECT PILL TAGS: Quick filter by Subject */}
            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Filter by Subject Tag:</span>
                <span className="text-[10px] text-slate-400 font-normal">Click a tag to focus on specific course papers</span>
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                <button
                  type="button"
                  onClick={() => setSelectedSubjectFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedSubjectFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  All Subjects ({visibleExams.length})
                </button>
                {(isAdmin || studentStream === 'science') && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedSubjectFilter('Math')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        selectedSubjectFilter === 'Math'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <span>📐 Mathematics</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSubjectFilter('Science Course')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        selectedSubjectFilter === 'Science Course'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                      }`}
                    >
                      <span>🔬 Science Course</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSubjectFilter('Chemistry')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        selectedSubjectFilter === 'Chemistry'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-white text-teal-700 hover:bg-teal-50 border border-teal-200'
                      }`}
                    >
                      <span>🧪 Chemistry</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSubjectFilter('Biology')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        selectedSubjectFilter === 'Biology'
                          ? 'bg-green-600 text-white shadow-xs'
                          : 'bg-white text-green-700 hover:bg-green-50 border border-green-200'
                      }`}
                    >
                      <span>🌿 Biology</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSubjectFilter('Physics')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        selectedSubjectFilter === 'Physics'
                          ? 'bg-cyan-600 text-white shadow-xs'
                          : 'bg-white text-cyan-700 hover:bg-cyan-50 border border-cyan-200'
                      }`}
                    >
                      <span>⚡ Physics</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSubjectFilter('Civic')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        selectedSubjectFilter === 'Civic'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
                      }`}
                    >
                      <span>🏛️ Civic</span>
                    </button>
                  </>
                )}
                {(isAdmin || studentStream === 'art') && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedSubjectFilter('Literature')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        selectedSubjectFilter === 'Literature'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
                      }`}
                    >
                      <span>📖 Literature</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSubjectFilter('English')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        selectedSubjectFilter === 'English'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
                      }`}
                    >
                      <span>✍️ English</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSubjectFilter('Math')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        selectedSubjectFilter === 'Math'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <span>📐 Math (Arts)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSubjectFilter('Civic')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        selectedSubjectFilter === 'Civic'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
                      }`}
                    >
                      <span>🏛️ Civic (Arts)</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* SEPARATE CARD SECTIONS: Science Section & Arts Section */}
            {/* 1. SCIENCE STREAM CARD SECTION */}
            {(isAdmin ? (adminStreamFilter === 'all' || adminStreamFilter === 'science') : studentStream === 'science') && (
              <div className="space-y-3.5 bg-blue-50/40 p-4 sm:p-5 rounded-3xl border border-blue-200/80">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Atom size={16} />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-blue-950 flex items-center gap-2">
                        <span>Science Stream CBT Examination Hall</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full border border-blue-200">
                          {visibleExams.filter(e => e.stream === 'science').length} Papers
                        </span>
                      </h4>
                      <p className="text-[11px] text-blue-800/80">
                        Math, Science Course, Chemistry, Biology, Physics, Civic, and Pure Sciences
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex text-[10px] font-black uppercase text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full border border-blue-300">
                    Science Department
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {visibleExams.filter(e => e.stream === 'science').map(exam => {
                    const isSelected = exam.id === activeExam?.id;
                    return (
                      <div
                        key={exam.id}
                        onClick={() => handleSelectExam(exam)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-white shadow-md ring-2 ring-blue-300'
                            : 'border-blue-100 bg-white hover:border-blue-300 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border flex items-center gap-1 ${exam.badgeColor}`}>
                              <Atom size={10} />
                              <span>{exam.subject} • {exam.studentClass}</span>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                {(exam.questions || []).length} Qs
                              </span>
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExamToDelete(exam);
                                  }}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title={`Admin: Delete ${exam.title}`}
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              🔬 Science Course Paper
                            </span>
                          </div>
                          <h4 className="font-black text-sm text-[#081a3d] leading-snug">
                            {exam.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {exam.description}
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-500 flex items-center gap-1">
                            <Clock size={12} /> {exam.durationMinutes} Mins Timed
                          </span>
                          {isSelected ? (
                            <span className="text-blue-700 font-black flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-lg">
                              <Check size={14} /> Selected
                            </span>
                          ) : (
                            <span className="text-slate-400 group-hover:text-slate-600 font-bold">
                              Select Paper →
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {visibleExams.filter(e => e.stream === 'science').length === 0 && (
                    <div className="col-span-full py-8 text-center text-xs text-blue-800/70 font-semibold bg-white rounded-2xl border border-blue-100">
                      No science exams match the active subject filter. Click "All Subjects" above to see all papers.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. ART STREAM CARD SECTION */}
            {(isAdmin ? (adminStreamFilter === 'all' || adminStreamFilter === 'art') : studentStream === 'art') && (
              <div className="space-y-3.5 bg-purple-50/40 p-4 sm:p-5 rounded-3xl border border-purple-200/80">
                <div className="flex items-center justify-between pb-2 border-b border-purple-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                      <Palette size={16} />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-purple-950 flex items-center gap-2">
                        <span>Arts & Humanities Stream CBT Examination Hall</span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded-full border border-purple-200">
                          {visibleExams.filter(e => e.stream === 'art').length} Papers
                        </span>
                      </h4>
                      <p className="text-[11px] text-purple-800/80">
                        Literature, Math, English, Civic, Government, and Arts Subjects
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex text-[10px] font-black uppercase text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-full border border-purple-300">
                    Art Department
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {visibleExams.filter(e => e.stream === 'art').map(exam => {
                    const isSelected = exam.id === activeExam?.id;
                    return (
                      <div
                        key={exam.id}
                        onClick={() => handleSelectExam(exam)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-purple-600 bg-white shadow-md ring-2 ring-purple-300'
                            : 'border-purple-100 bg-white hover:border-purple-300 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border flex items-center gap-1 ${exam.badgeColor}`}>
                              <Palette size={10} />
                              <span>{exam.subject} • {exam.studentClass}</span>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                {(exam.questions || []).length} Qs
                              </span>
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExamToDelete(exam);
                                  }}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title={`Admin: Delete ${exam.title}`}
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                              🎨 Art Student Exam
                            </span>
                          </div>
                          <h4 className="font-black text-sm text-[#081a3d] leading-snug">
                            {exam.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {exam.description}
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-500 flex items-center gap-1">
                            <Clock size={12} /> {exam.durationMinutes} Mins Timed
                          </span>
                          {isSelected ? (
                            <span className="text-purple-700 font-black flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-lg">
                              <Check size={14} /> Selected
                            </span>
                          ) : (
                            <span className="text-slate-400 group-hover:text-slate-600 font-bold">
                              Select Paper →
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {visibleExams.filter(e => e.stream === 'art').length === 0 && (
                    <div className="col-span-full py-8 text-center text-xs text-purple-800/70 font-semibold bg-white rounded-2xl border border-purple-100">
                      No art exams match the active subject filter. Click "All Subjects" above to see all papers.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Active Red Flag Alert Notice if student was previously struck */}
          {activeStrike && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                  🚩
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <span>Disciplinary Red Flag on Record</span>
                    <span className="text-[10px] bg-rose-200 px-2 py-0.5 rounded-full font-bold">{activeStrike.dateStr}</span>
                  </div>
                  <p className="text-xs text-rose-900 mt-0.5 font-medium">
                    You departed the 30-minute exam room: <em>&ldquo;{activeStrike.reason}&rdquo;</em>. Your habit streak was struck.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExamState('breached')}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
              >
                View Disciplinary Decision
              </button>
            </div>
          )}

          {/* Exam Structure Grid (Dynamic Sections from Active Paper) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Exam Syllabus & Question Sections (Total: {totalQuestions} Questions)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {examSections.map((sec) => (
                <div key={sec.title} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-700 uppercase">Section {sec.letter}</span>
                    <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {sec.count} Questions
                    </span>
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm mt-1">{sec.title}</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Standard curriculum topics tested in {activeExam.subject} for {activeExam.studentClass}.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Test Instructions Banner */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-300 text-amber-950 space-y-2.5">
            <div className="flex items-center gap-2 font-black text-sm text-amber-900">
              <AlertCircle size={18} className="text-amber-700 flex-shrink-0" />
              <span>External Exam Integrity & Anti-Malpractice Code</span>
            </div>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-amber-900 font-medium">
              <li><strong>Strictly 30 Minutes:</strong> The practice questions are timed strictly at 30:00 minutes. When time expires, your answers auto-submit.</li>
              <li><strong className="text-rose-700">Strict Presence (Red Flag Strike Rule):</strong> If you go outside the practice questions (by switching browser tabs, minimizing the exam window, or clicking outside), you will immediately receive an official <strong>RED FLAG STRIKE</strong>, and a penalty will deduct from your active study habit streak.</li>
              <li><strong>Hidden Answers:</strong> Answers are strictly concealed until the test is completed. Upon submission, your exact mark and complete examiner answer key are displayed and recorded.</li>
              <li>You can flag questions to review before final submission.</li>
            </ul>
          </div>

          {/* Past Exam Attempts History */}
          {(examHistory || []).length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BarChart3 size={15} className="text-indigo-600" />
                  <span>Previous Practice Exam Marks & Records ({(examHistory || []).length})</span>
                </h3>
              </div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                {examHistory.slice(0, 5).map((rec, i) => {
                  const gradeInfo = calculateExamGrade(rec.score, rec.totalQuestions);
                  return (
                    <div key={rec.id || i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${gradeInfo.color}`}>
                            Grade {rec.grade} • {rec.percentage}%
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {rec.score} / {rec.totalQuestions} marks
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Completed on {rec.submittedAt} • Student: {rec.studentName}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setLatestResult(rec);
                          setExamState('results');
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        View Mark Slip & Answers →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VIEW 2: ACTIVE EXAM IN PROGRESS (ANSWERS STRICTLY CONCEALED)       */}
      {/* ------------------------------------------------------------------ */}
      {examState === 'active' && (
        <div className="flex flex-col min-h-[600px]">
          
          {/* Top Sticky Test Bar */}
          <div className="sticky top-0 z-20 bg-[#081a3d] text-white px-5 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#62c5fa] font-black text-xs">
                CBT
              </div>
              <div>
                <div className="text-xs font-black text-white">{activeExam?.title || 'CBT Practice Mock Exam'}</div>
                <div className="text-[11px] text-[#c8daf3] flex items-center gap-2">
                  <span>Question <strong>{currentQNum}</strong> of {totalQuestions}</span>
                  <span>•</span>
                  <span>{currentQSection}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Adjustable Font Selector during exam */}
              <div className="flex items-center">
                <FontSizeSelector dark={true} />
              </div>

              {/* Presence Monitor Badge */}
              <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 text-rose-200 text-xs font-bold border border-rose-500/30">
                <ShieldAlert size={13} className="text-rose-400" />
                <span>Do not leave window • 🚩 Strike Rule Active</span>
              </div>

              {/* Timer indicator - Strictly 30 Mins */}
              <div className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 ${
                timeRemainingSeconds < 300 ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/10 text-white border border-white/15'
              }`}>
                <Clock size={14} className={timeRemainingSeconds < 300 ? 'text-white' : 'text-[#62c5fa]'} />
                <span>Time Left: {formatTime(timeRemainingSeconds)} (Strict 30m)</span>
              </div>

              {/* Answered progress pill */}
              <div className="text-xs font-bold text-slate-300 hidden sm:inline">
                Answered: <strong className="text-emerald-400">{answeredCount}</strong> / {totalQuestions}
              </div>

              {/* Finish Exam Button */}
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                <span>Submit Exam</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5">
            <div 
              className="bg-emerald-500 h-1.5 transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Main Question Body & Sidebar Matrix */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            
            {/* LEFT / CENTER: QUESTION CARD */}
            <div className={`lg:col-span-8 ${fontConfig.cardPadding} flex flex-col justify-between space-y-5`}>
              
              <div className="space-y-4">
                {/* Section Badge & Flag Button */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black uppercase tracking-wider">
                    {currentQSection}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleFlag(currentQNum)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      flagged[currentQNum]
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <Flag size={13} className={flagged[currentQNum] ? 'text-amber-600 fill-amber-500' : 'text-slate-400'} />
                    <span>{flagged[currentQNum] ? 'Flagged for Review' : 'Flag Question'}</span>
                  </button>
                </div>

                {/* Comprehension Passage Box (For Questions 41 - 45) */}
                {currentQuestion.passage && (
                  <div className={`${fontConfig.passageBox} rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2`}>
                    <div className="flex items-center gap-2 text-xs font-black text-indigo-900 uppercase tracking-wider">
                      <BookOpen size={14} className="text-indigo-600" />
                      <span>Reading Passage</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif italic bg-white p-3 rounded-xl border border-indigo-100">
                      "{currentQuestion.passage}"
                    </p>
                  </div>
                )}

                {/* Question Prompt */}
                <div className={`${fontConfig.questionTitle} text-[#081a3d]`}>
                  <span className="text-indigo-600 mr-2">{currentQNum}.</span>
                  {currentQText}
                </div>

                {/* Multiple Choice Options (A, B, C, D) */}
                <div className="space-y-2.5 pt-1">
                  {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                    const isSelected = answers[currentQNum] === letter;
                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => handleSelectOption(letter)}
                        className={`w-full ${fontConfig.optionPadding} rounded-xl border text-left flex items-start gap-2.5 sm:gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-200 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className={`${fontConfig.optionBadge} font-black flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {letter}
                        </div>
                        <div className={`flex-1 pt-0.5 ${fontConfig.optionText} font-semibold text-slate-900`}>
                          {currentQuestion.options[letter]}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Anti-spoiler assurance notice */}
                <div className="text-[11px] text-slate-400 font-medium italic flex items-center gap-1.5 pt-1">
                  <HelpCircle size={13} />
                  <span>Answers will remain locked and hidden until you finish and submit the test.</span>
                </div>
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  Question {currentIndex + 1} of {totalQuestions}
                </div>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                    className="px-5 py-2.5 rounded-xl bg-[#081a3d] hover:bg-[#122e66] text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <CheckCircle2 size={16} />
                    <span>Review & Finish Exam</span>
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT: QUESTION MATRIX */}
            <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-50/70 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Question Palette (1 - {totalQuestions})
                  </h4>
                  <span className="text-[11px] font-bold text-indigo-600">
                    {answeredCount}/{totalQuestions}
                  </span>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-white border border-slate-300 inline-block" />
                    <span>Unanswered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
                    <span>Flagged</span>
                  </div>
                </div>

                {/* Grid of Questions */}
                <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-1.5 max-h-[400px] overflow-y-auto pr-1">
                  {currentQuestions.map((q, idx) => {
                    const isAnswered = Boolean(answers[q.questionNumber]);
                    const isCurrent = idx === currentIndex;
                    const isFlagged = Boolean(flagged[q.questionNumber]);

                    let btnClass = 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300';
                    if (isAnswered) {
                      btnClass = 'bg-indigo-600 text-white border-indigo-600 font-bold';
                    }
                    if (isFlagged) {
                      btnClass = 'bg-amber-400 text-amber-950 border-amber-500 font-black';
                    }
                    if (isCurrent) {
                      btnClass += ' ring-2 ring-[#62c5fa] ring-offset-1 scale-105';
                    }

                    return (
                      <button
                        key={q.id || q.questionNumber}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`${fontConfig.matrixBtn} rounded-lg border flex items-center justify-center transition-all cursor-pointer ${btnClass}`}
                        title={`Question ${q.questionNumber} (${q.sectionTitle})`}
                      >
                        {q.questionNumber}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button in Palette */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Submit Exam Now</span>
                </button>
                <div className="text-[10px] text-center text-slate-400">
                  Unanswered questions will receive 0 marks.
                </div>
              </div>
            </div>

          </div>

          {/* CONFIRMATION SUBMIT MODAL */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={26} />
                </div>
                
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-black text-[#081a3d]">
                    Ready to Submit Your Exam?
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Once submitted, your answers will be permanently marked and your final score will be calculated and saved.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">Answered Questions:</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {answeredCount} of {totalQuestions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">Unanswered Questions:</span>
                    <span className={totalQuestions - answeredCount > 0 ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200' : 'text-slate-400'}>
                      {totalQuestions - answeredCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">Time Elapsed:</span>
                    <span className="text-slate-800">{formatTime(elapsedSeconds)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Return to Test
                  </button>
                  <button
                    type="button"
                    onClick={executeSubmission}
                    className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Yes, Submit & Grade</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VIEW 3: RESULTS & MARK SLIP SCREEN                                 */}
      {/* ------------------------------------------------------------------ */}
      {examState === 'results' && latestResult && (
        <div className="p-6 sm:p-10 space-y-8 animate-fade-in">
          
          {/* Header Mark Display */}
          <div className="bg-gradient-to-br from-[#081a3d] to-[#163875] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-white/10">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#62c5fa] text-xs font-extrabold uppercase tracking-wider mb-2">
                  <Award size={14} /> Official Examination Result Slip
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {latestResult.examTitle}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#c8daf3] mt-1 font-semibold">
                  <UserIcon size={14} />
                  <span>Student: <strong>{latestResult.studentName}</strong></span>
                  <span>•</span>
                  <span>Date: {latestResult.submittedAt}</span>
                </div>
              </div>

              {/* High Score Badge */}
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-sm self-start md:self-auto">
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#62c5fa]">Final Score</span>
                  <div className="text-3xl sm:text-4xl font-black text-white">
                    {latestResult.score}<span className="text-lg text-slate-300">/{latestResult.totalQuestions}</span>
                  </div>
                </div>

                <div className="h-10 w-px bg-white/20" />

                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">Grade</span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                    {latestResult.grade}
                  </div>
                </div>

                <div className="h-10 w-px bg-white/20" />

                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">Percentage</span>
                  <div className="text-3xl sm:text-4xl font-black text-amber-300">
                    {latestResult.percentage}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Correct Answers</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {latestResult.score} Questions
              </div>
              <span className="text-[11px] text-slate-400">Points Earned</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Incorrect / Skipped</span>
              <div className="text-2xl font-black text-rose-600 mt-1">
                {latestResult.totalQuestions - latestResult.score} Questions
              </div>
              <span className="text-[11px] text-slate-400">Areas for Revision</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Time Spent</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {formatTime(latestResult.timeSpentSeconds)}
              </div>
              <span className="text-[11px] text-slate-400">Completion Duration</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Standing</span>
              <div className="text-xl font-black text-[#081a3d] mt-1">
                {calculateExamGrade(latestResult.score, latestResult.totalQuestions).remark}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">WAEC Benchmark</span>
            </div>
          </div>

          {/* Section-by-Section Score Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
              Section-by-Section Marks Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(latestResult.sectionScores).map(([sectionTitle, val]) => {
                const scoreData = val as { correct: number; total: number };
                const secPercent = Math.round((scoreData.correct / scoreData.total) * 100);
                return (
                  <div key={sectionTitle} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="truncate pr-2">{sectionTitle}</span>
                      <span className="font-black text-indigo-600">{scoreData.correct}/{scoreData.total}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-full rounded-full ${
                          secPercent >= 70 ? 'bg-emerald-500' : secPercent >= 50 ? 'bg-indigo-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${secPercent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-1.5 flex justify-between">
                      <span>Performance</span>
                      <span className="font-bold text-slate-600">{secPercent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExamState('review')}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Eye size={16} />
                <span>Review All 50 Questions & Correct Answers</span>
              </button>

              <button
                type="button"
                onClick={() => handleStartExam()}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw size={15} />
                <span>Retake Exam</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Printer size={15} />
              <span>Print Result Slip</span>
            </button>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VIEW 4: ANSWERS & DETAILED CORRECTIONS REVIEW                      */}
      {/* ------------------------------------------------------------------ */}
      {examState === 'review' && latestResult && (
        <div className="p-6 sm:p-10 space-y-6 animate-fade-in">
          
          {/* Top Review Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider mb-1">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Answers & Solutions Mode (Unlocked)
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#081a3d]">
                Detailed Question Analysis & Explanations
              </h2>
            </div>

            {/* Filter buttons & Font Size Selector */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <FontSizeSelector />

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviewFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({latestResult.totalQuestions})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('incorrect')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviewFilter === 'incorrect' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:text-rose-900'
                  }`}
                >
                  Mistakes Only ({latestResult.totalQuestions - latestResult.score})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('correct')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviewFilter === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-900'
                  }`}
                >
                  Correct Only ({latestResult.score})
                </button>
              </div>
            </div>
          </div>

          {/* List of Questions with answers revealed */}
          <div className="space-y-6">
            {reviewQuestions.map((q, idx) => {
              const qNum = q.questionNumber || q.id || (idx + 1);
              const qText = q.questionText || q.question || '';
              const secTitle = q.sectionTitle || q.topic || 'Curriculum Section';
              const studentAnswer = latestResult.answers[qNum];
              const isCorrect = studentAnswer === q.correctAnswer;

              return (
                <div 
                  key={q.id || idx}
                  className={`${fontConfig.reviewCard} rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-white border-emerald-200/80 shadow-2xs'
                      : 'bg-rose-50/20 border-rose-200 shadow-2xs'
                  }`}
                >
                  {/* Question header */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 font-black text-xs flex items-center justify-center">
                        {qNum}
                      </span>
                      <span className="text-[11px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        {secTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                          <Check size={13} /> Correct (+1)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-700 bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                          <XCircle size={13} /> {studentAnswer ? `Your Choice: ${studentAnswer}` : 'Skipped / No Answer'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Passage if present */}
                  {q.passage && (
                    <div className="mb-2.5 p-2.5 bg-indigo-50/50 rounded-xl text-xs text-slate-700 italic border border-indigo-100 font-serif">
                      "{q.passage}"
                    </div>
                  )}

                  {/* Question Text */}
                  <p className={`${fontConfig.questionTitle} text-[#081a3d] mb-3`}>
                    {qText}
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                      const isStudentChoice = studentAnswer === letter;
                      const isKey = q.correctAnswer === letter;

                      let optClass = 'bg-white border-slate-200 text-slate-700';
                      if (isKey) {
                        optClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-200';
                      } else if (isStudentChoice && !isCorrect) {
                        optClass = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold line-through';
                      }

                      return (
                        <div
                          key={letter}
                          className={`${fontConfig.optionPadding} rounded-xl border flex items-center justify-between text-xs transition-colors ${optClass}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center shrink-0 ${
                              isKey ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {letter}
                            </span>
                            <span className={`font-semibold ${fontConfig.optionText}`}>{q.options[letter]}</span>
                          </div>
                          {isKey && (
                            <span className="text-[10px] font-black text-emerald-700 uppercase shrink-0">
                              Key ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Marking Scheme Explanation */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-black text-[#081a3d] block">
                      💡 WAEC / NECO Examiner Explanation:
                    </span>
                    <p className="leading-relaxed text-slate-600 font-medium">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Back Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setExamState('results')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ChevronLeft size={16} />
              <span>Back to Mark Slip</span>
            </button>

            <button
              type="button"
              onClick={handleStartExam}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw size={15} />
              <span>Retake Practice Exam</span>
            </button>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VIEW 5: DISCIPLINARY RED FLAG STRIKE SCREEN (EXAM BREACH)          */}
      {/* ------------------------------------------------------------------ */}
      {examState === 'breached' && (
        <div className="p-6 sm:p-10 space-y-6 animate-fade-in bg-rose-50/50">
          <div className="bg-gradient-to-br from-rose-950 via-red-900 to-[#3b0808] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border-2 border-rose-500/60">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/30 text-rose-200 text-xs font-black uppercase tracking-wider mb-3 border border-rose-400/40">
                  <Flag size={14} className="text-rose-300 animate-bounce" />
                  Official Examination Procedure Breach
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  <span>🚩 RED FLAG STRIKE ISSUED</span>
                </h2>
                <p className="text-xs sm:text-sm text-rose-100/90 mt-2 max-w-2xl leading-relaxed">
                  You went outside or switched away from the active CBT practice examination room during your strictly timed 30-minute test.
                  Exam procedures require continuous uninterrupted invigilation. Your exam has been terminated and flagged.
                </p>
              </div>

              <div className="bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-sm self-start md:self-auto text-center shrink-0">
                <div className="text-[10.5px] font-black uppercase tracking-wider text-rose-200">Disciplinary Penalty</div>
                <div className="text-2xl font-black text-white mt-1">🚩 RED FLAG</div>
                <div className="text-[11px] text-rose-200 font-bold mt-0.5">Habit Streak Penalized</div>
              </div>
            </div>
          </div>

          {/* Infraction Details & Penalties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-black text-xs uppercase tracking-wider">
                <ShieldAlert size={16} /> Infraction Logged
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                {activeStrike?.reason || 'Departed active CBT test room'}
              </div>
              <div className="text-xs text-slate-500">
                Candidate: <strong>{activeStrike?.studentName || currentUser?.name || 'Student Candidate'}</strong> • {activeStrike?.dateStr || 'Today'}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-black text-xs uppercase tracking-wider">
                <AlertTriangle size={16} /> Daily Habit Strike
              </div>
              <div className="text-sm font-extrabold text-rose-700">
                Daily Habit Streak Reset
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your daily habit tracker streak has been penalized with a red flag strike for violating CBT examination continuous focus rules.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-black text-xs uppercase tracking-wider">
                <Flag size={16} /> Home Page Alert
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                Disciplinary Notice Affixed
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                A warning banner is now displayed on your Home Page and logged in the school administrator student roster.
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              <strong className="text-slate-900">Academic Code of Conduct:</strong> During your next attempt, remain on this screen until all 50 questions are completed.
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setExamState('intro')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all cursor-pointer shadow-sm"
              >
                Acknowledge Directive & Return to CBT Hall
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add CBT Exam Modal */}
      {isAdmin && (
        <AdminAiPdfToCbtModal
          isOpen={isAiPdfModalOpen}
          currentUser={currentUser}
          onClose={() => setIsAiPdfModalOpen(false)}
          onExamCreated={(newExam) => {
            const list = getStoredCBTExams();
            setExams(list);
            setSelectedExamId(newExam.id);
          }}
          onNavigateToExam={(examId) => {
            setSelectedExamId(examId);
            setExamState('intro');
          }}
          initialClass={currentUser?.grade || 'SS2'}
        />
      )}

      {/* Admin Delete CBT Exam Confirmation Modal */}
      {isAdmin && examToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black uppercase tracking-wider mb-2 border border-rose-200">
              Admin Exam Management
            </div>

            <h3 className="text-xl font-black text-[#081a3d] mb-1.5">
              Delete CBT Examination Paper?
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900 font-bold">&ldquo;{examToDelete.title}&rdquo;</strong>? Students will no longer see or take this paper.
            </p>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subject:</span>
                <strong className="text-slate-900">{examToDelete.subject}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Class / Stream:</span>
                <strong className="text-slate-900">{examToDelete.studentClass} • {examToDelete.stream || 'General'}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Questions:</span>
                <strong className="text-slate-900">{(examToDelete.questions || []).length} Questions</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setExamToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = examToDelete.id;
                  const updated = deleteCBTExam(targetId);
                  setExams(updated);
                  if (selectedExamId === targetId) {
                    if (updated.length > 0) {
                      setSelectedExamId(updated[0].id);
                    }
                  }
                  setExamToDelete(null);
                  playSuccessSound();
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Yes, Delete Exam</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
