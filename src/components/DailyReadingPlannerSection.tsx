import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Bookmark, CheckCircle2, Search, Filter, 
  Sparkles, Clock, ArrowRight, BookMarked, User, 
  Atom, Palette, Award, Check, ChevronDown, ChevronUp,
  HelpCircle, Eye, PlusCircle, Plus, Trash2, Zap, FileText, Edit3, Compass
} from 'lucide-react';
import { 
  ReadingBook, 
  READING_BOOKS_CATALOG, 
  getStoredReadingBooks, 
  deleteCustomReadingBook,
  TopicLessonPlan,
  getLessonPlanForTopic
} from '../data/readingBooksData';
import { User as UserType, TaskItem } from '../types';
import { playSuccessSound } from '../utils/sound';
import { getEffectiveStudentStream, setEffectiveStudentStream } from '../utils/authManager';
import { AdminAddBookModal } from './AdminAddBookModal';
import { AdminAiPdfToCbtModal } from './AdminAiPdfToCbtModal';
import { AdminAiBookUploadModal } from './AdminAiBookUploadModal';
import { TopicLessonPlanModal } from './TopicLessonPlanModal';
import { CBTExam } from '../data/cbtExamsRegistry';

interface DailyReadingPlannerSectionProps {
  currentUser: UserType | null;
  onAddReadingTask?: (task: Omit<TaskItem, 'id'>) => void;
  onNavigateToExam?: (examId: string) => void;
  onNavigateToLifeSkills?: () => void;
  onNavigateToLeadership?: () => void;
}

export const DailyReadingPlannerSection: React.FC<DailyReadingPlannerSectionProps> = ({
  currentUser,
  onAddReadingTask,
  onNavigateToExam,
  onNavigateToLifeSkills,
  onNavigateToLeadership
}) => {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'student_admin' || currentUser?.isAdmin || currentUser?.email === 'ijikevictoriaokajoe@gmail.com';
  
  // Student department stream ('science' or 'art')
  const [studentStream, setStudentStream] = useState<'science' | 'art'>(() => {
    return getEffectiveStudentStream(currentUser);
  });

  const [books, setBooks] = useState<ReadingBook[]>(() => {
    const list = getStoredReadingBooks();
    return Array.isArray(list) && list.length > 0 ? list : READING_BOOKS_CATALOG;
  });

  // Synchronize when books or stream update
  useEffect(() => {
    const handleStorage = () => {
      setBooks(getStoredReadingBooks());
      setStudentStream(getEffectiveStudentStream(currentUser));
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleStorage);
    };
  }, [currentUser]);

  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState<boolean>(false);
  const [bookToEdit, setBookToEdit] = useState<ReadingBook | null>(null);
  const [isAiPdfModalOpen, setIsAiPdfModalOpen] = useState<boolean>(false);
  const [isAiBookUploadModalOpen, setIsAiBookUploadModalOpen] = useState<boolean>(false);
  const [selectedTopicPlan, setSelectedTopicPlan] = useState<TopicLessonPlan | null>(null);
  const [selectedTopicBook, setSelectedTopicBook] = useState<ReadingBook | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<ReadingBook | null>(null);

  const handleOpenTopicLessonPlan = (book: ReadingBook, topicTitle: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const plan = getLessonPlanForTopic(book, topicTitle);
    setSelectedTopicPlan(plan);
    setSelectedTopicBook(book);
    playSuccessSound();
  };
  const [completedBooksMap, setCompletedBooksMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_completed_books');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return {};
  });

  const [addedTasksMap, setAddedTasksMap] = useState<Record<string, boolean>>({});

  // Books strictly filtered by academic stream:
  // Science students only read Science books.
  // Art students only read Art books.
  // Admin sees all books.
  // Any student can switch to Independence & Life Skills tab to learn self-reliance.
  const streamBooks = useMemo(() => {
    if (isAdmin) return books;
    if (activeTab === 'life_skills') {
      return books.filter(b => b.stream === 'life_skills');
    }
    if (studentStream === 'science') {
      return books.filter(b => b.stream === 'science' || b.stream === 'both');
    } else {
      return books.filter(b => b.stream === 'art' || b.stream === 'both');
    }
  }, [books, studentStream, isAdmin, activeTab]);

  // Toggle book read status
  const handleToggleCompleted = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSuccessSound();
    setCompletedBooksMap(prev => {
      const next = { ...prev, [bookId]: !prev[bookId] };
      try {
        localStorage.setItem('echo_plan_completed_books', JSON.stringify(next));
      } catch {
        // fallback
      }
      return next;
    });
  };

  const handleDeleteBook = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this recommended book from the shelf?')) return;
    const updated = deleteCustomReadingBook(bookId);
    setBooks(updated);
    if (selectedBook?.id === bookId) setSelectedBook(null);
    playSuccessSound();
  };

  // Add this book directly to the student's daily planner tasks
  const handleAddBookToDailyTasks = (book: ReadingBook, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onAddReadingTask) return;

    let category: TaskItem['category'] = 'Reading';
    if (book.subject.includes('Math')) category = 'Mathematics';
    else if (book.subject.includes('Science') || book.subject.includes('Physics') || book.subject.includes('Biology')) category = 'Science';
    else if (book.subject.includes('Literature') || book.subject.includes('English')) category = 'Reading';

    onAddReadingTask({
      title: `Daily Book Reading: ${book.title}`,
      time: '4:30 PM',
      category: category,
      completed: false,
      priority: 'high'
    });

    setAddedTasksMap(prev => ({ ...prev, [book.id]: true }));
    playSuccessSound();
  };

  // Filter books by subject tab & search
  const filteredBooks = useMemo(() => {
    return streamBooks.filter(book => {
      if (activeTab === 'life_skills') {
        return book.stream === 'life_skills';
      }

      if (isAdmin) {
        if (activeTab === 'science' && book.stream !== 'science') return false;
        if (activeTab === 'art' && book.stream !== 'art') return false;
        if (activeTab === 'life_skills' && book.stream !== 'life_skills') return false;
      } else if (studentStream === 'science') {
        if (activeTab === 'physics' && !book.subject.toLowerCase().includes('physics')) return false;
        if (activeTab === 'chemistry' && !book.subject.toLowerCase().includes('chemistry')) return false;
        if (activeTab === 'biology' && !book.subject.toLowerCase().includes('biology')) return false;
        if (activeTab === 'math' && !book.subject.toLowerCase().includes('math')) return false;
        if (activeTab === 'computer' && !book.subject.toLowerCase().includes('computer')) return false;
      } else {
        if (activeTab === 'literature' && !book.subject.toLowerCase().includes('literature')) return false;
        if (activeTab === 'government' && !book.subject.toLowerCase().includes('government')) return false;
        if (activeTab === 'crs' && !book.subject.toLowerCase().includes('religious') && !book.subject.toLowerCase().includes('ethics')) return false;
        if (activeTab === 'history' && !book.subject.toLowerCase().includes('history')) return false;
        if (activeTab === 'writing' && !book.subject.toLowerCase().includes('creative') && !book.subject.toLowerCase().includes('rhetoric')) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = book.title.toLowerCase().includes(query);
        const matchAuthor = book.author.toLowerCase().includes(query);
        const matchSubject = book.subject.toLowerCase().includes(query);
        const matchDesc = book.description.toLowerCase().includes(query);
        return matchTitle || matchAuthor || matchSubject || matchDesc;
      }
      return true;
    });
  }, [streamBooks, isAdmin, studentStream, activeTab, searchQuery]);

  const completedCount = Object.values(completedBooksMap).filter(Boolean).length;

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fade-in my-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-[11px] uppercase tracking-wider border border-indigo-100">
              <BookOpen size={13} className="text-indigo-600" />
              Daily Study Reading Shelf
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              {completedCount} of {books.length} Chapters Completed
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 border ${
              studentStream === 'science' 
                ? 'bg-blue-100 text-blue-800 border-blue-200' 
                : 'bg-purple-100 text-purple-800 border-purple-200'
            }`}>
              {studentStream === 'science' ? <Atom size={12} /> : <Palette size={12} />}
              <span className="capitalize">{studentStream} Student Shelf</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#081a3d]">
            {isAdmin 
              ? 'Children & Students Daily Reading Books' 
              : studentStream === 'science' 
              ? 'Science Students Daily Reading Books' 
              : 'Art Students Daily Reading Books'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {studentStream === 'science'
              ? 'Essential textbooks for Science students: Physics, Chemistry, Biology, Advanced Science Mathematics, and Computing. Read daily chapters and schedule directly into your planner.'
              : 'Prescribed textbooks for Art students: Literature in English, Government & Civics, Christian Religious Studies, African History, and Creative Writing.'}
          </p>
        </div>

        {/* Action Controls & Stream Prompt */}
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => setIsAiBookUploadModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                title="Admin Only: Upload PDF textbook or document notes and convert to a full normal book with lesson plans using Gemini AI"
              >
                <Sparkles size={15} className="text-yellow-300" />
                <span>🤖 Upload File to AI Book (Admin)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAiPdfModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                title="Admin Only: Upload PDF past questions or study notes and convert to CBT exam with Gemini AI"
              >
                <Zap size={15} className="text-yellow-300" />
                <span>Turn PDF to CBT Exam</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBookToEdit(null);
                  setIsAddBookModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus size={15} />
                <span>+ Add Book</span>
              </button>
            </>
          )}

          {(onNavigateToLeadership || onNavigateToLifeSkills) && (
            <button
              type="button"
              onClick={onNavigateToLeadership || onNavigateToLifeSkills}
              className="px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Award size={14} className="text-emerald-600" />
              <span>🧭 Leadership & Problem Solving Page →</span>
            </button>
          )}

          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-3.5 rounded-2xl border border-sky-100 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shrink-0">
              📖
            </div>
            <div>
              <div className="text-xs font-black text-[#081a3d]">Recommended Daily Habit</div>
              <div className="text-[10.5px] text-slate-600">20–30 mins daily reading builds distinction.</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI PDF TO CBT EXAM FEATURE BANNER */}
      <div className="bg-gradient-to-r from-[#071a3d] via-[#0b2b62] to-[#124b91] rounded-3xl p-5 sm:p-6 text-white border border-blue-400/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            background: 'radial-gradient(circle at 80% 30%, #62c5fa, transparent 50%)'
          }}
        />
        <div className="relative z-10 space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-[#62c5fa] text-[11px] font-black uppercase tracking-wider border border-blue-400/30">
              <Sparkles size={13} /> {isAdmin ? 'Admin AI Assessment Suite' : 'CBT Examination Arena'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10.5px] font-black border border-emerald-400/30">
              {isAdmin ? 'Document ➔ Timed CBT Arena' : `${studentStream === 'art' ? '🎨 Art' : '🔬 Science'} Student CBT Exam Ready`}
            </span>
            {!isAdmin && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                🔒 CBT Exams Managed by Admin
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {isAdmin 
              ? 'Put PDF File ➔ Turn It to CBT Practice Exam' 
              : studentStream === 'art'
              ? 'Art Student CBT Exam Hall (Literature & Government)'
              : 'Science Student CBT Exam Hall (Pure Science & Mathematics)'}
          </h3>
          <p className="text-xs sm:text-sm text-[#c8daf3] leading-relaxed">
            {isAdmin 
              ? 'Admin Superpower: Upload any past questions PDF, WAEC model test, syllabus, or lesson summary. The AI instantly generates an authentic, timed CBT practice exam with marking scheme explanations.' 
              : studentStream === 'art'
              ? 'Art students write dedicated Art CBT exams (Literature, Government, Arts & Humanities). Answers remain strictly hidden until submission.'
              : 'Science students write dedicated Science CBT exams (Physics, Chemistry, Biology & Science Math). Answers remain strictly hidden until submission.'}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5 shrink-0">
          {isAdmin ? (
            <button
              type="button"
              onClick={() => setIsAiPdfModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#62c5fa] hover:bg-sky-300 text-[#071a3d] font-black text-xs sm:text-sm shadow-md hover:shadow-sky-400/20 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Zap size={16} className="text-[#071a3d]" />
              <span>Upload PDF & Turn to CBT</span>
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const targetExamId = studentStream === 'art' ? 'ss2-art-gov-lit-2026' : 'ss2-science-core-2026';
                if (onNavigateToExam) {
                  onNavigateToExam(targetExamId);
                } else {
                  sessionStorage.setItem('echo_plan_active_cbt_exam', targetExamId);
                  sessionStorage.setItem('echo_plan_active_class_tab', 'mock_exam');
                  window.location.hash = '#class-cbt-exam-section';
                }
              }}
              className="px-5 py-3 rounded-2xl bg-[#62c5fa] hover:bg-sky-300 text-[#071a3d] font-black text-xs sm:text-sm shadow-md hover:shadow-sky-400/20 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Award size={16} className="text-[#071a3d]" />
              <span>Enter CBT Examination Hall ({studentStream === 'art' ? 'Art Exam' : 'Science Exam'})</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Department Academic Stream Bar (Science vs Art) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-sky-50/25 to-indigo-50/35 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-xs ${
            studentStream === 'science' ? 'bg-blue-600' : 'bg-purple-600'
          }`}>
            {studentStream === 'science' ? <Atom size={20} /> : <Palette size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#081a3d]">
                Active Bookshelf: <span className="capitalize">{studentStream} Student</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                studentStream === 'science' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {studentStream === 'science' ? 'Science Books' : 'Art Books'}
              </span>
            </div>
            <p className="text-[11.5px] text-slate-600 mt-0.5">
              {studentStream === 'science'
                ? 'Science students read Physics, Biology, Chemistry, Advanced Math & Computer Science books. Art books are kept separate.'
                : 'Art students read Literature Anthology, Government, CRS & African History books. Pure Science books are kept separate.'}
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
              setActiveTab('all');
              playSuccessSound();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95 ${
              studentStream === 'science'
                ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
            }`}
            title={`Switch to ${studentStream === 'science' ? 'Art' : 'Science'} student shelf`}
          >
            <span>Switch to {studentStream === 'science' ? '🎨 Art Student' : '🔬 Science Student'}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Stream & Subject Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
          {isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-[#081a3d] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Books ({books.length})
              </button>
              <button
                onClick={() => setActiveTab('science')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'science'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Atom size={13} />
                <span>Science ({books.filter(b => b.stream === 'science').length})</span>
              </button>
              <button
                onClick={() => setActiveTab('art')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'art'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Palette size={13} />
                <span>Art ({books.filter(b => b.stream === 'art').length})</span>
              </button>
            </>
          ) : studentStream === 'science' ? (
            <>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Science ({streamBooks.length})
              </button>
              <button
                onClick={() => setActiveTab('physics')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'physics'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>⚡ Physics</span>
              </button>
              <button
                onClick={() => setActiveTab('chemistry')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'chemistry'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🧪 Chemistry</span>
              </button>
              <button
                onClick={() => setActiveTab('biology')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'biology'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🧬 Biology</span>
              </button>
              <button
                onClick={() => setActiveTab('math')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'math'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📐 Mathematics</span>
              </button>
              <button
                onClick={() => setActiveTab('computer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'computer'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>💻 Computing</span>
              </button>
              <button
                onClick={() => setActiveTab('life_skills')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'life_skills'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🧭 Independence & Money</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Art ({streamBooks.length})
              </button>
              <button
                onClick={() => setActiveTab('literature')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'literature'
                    ? 'bg-fuchsia-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📖 Literature</span>
              </button>
              <button
                onClick={() => setActiveTab('government')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'government'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🏛️ Government</span>
              </button>
              <button
                onClick={() => setActiveTab('crs')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'crs'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🕊️ CRS & Ethics</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'history'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📜 History</span>
              </button>
              <button
                onClick={() => setActiveTab('writing')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'writing'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>✍️ Creative Writing</span>
              </button>
              <button
                onClick={() => setActiveTab('life_skills')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'life_skills'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🧭 Independence & Money</span>
              </button>
            </>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={studentStream === 'science' ? "Search Physics, Chemistry..." : "Search Literature, Government..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 bg-slate-50 font-medium"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.map((book) => {
          const isCompleted = Boolean(completedBooksMap[book.id]);
          const isAddedToTasks = Boolean(addedTasksMap[book.id]);

          return (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${book.coverColor} absolute top-0 left-0`} />

              <div>
                {/* Header Tag and Class */}
                <div className="flex items-center justify-between gap-2 mb-3 pt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase tracking-wider border ${book.badgeBg}`}>
                    {book.subject}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {book.stream === 'science' && (
                      <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                        <Atom size={11} /> Science
                      </span>
                    )}
                    {book.stream === 'art' && (
                      <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 flex items-center gap-1">
                        <Palette size={11} /> Art
                      </span>
                    )}
                    {book.stream === 'both' && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        General
                      </span>
                    )}
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookToEdit(book);
                            setIsAddBookModalOpen(true);
                          }}
                          title={`Admin: Edit "${book.title}"`}
                          className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50 transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteBook(book.id, e)}
                          title={`Admin: Remove "${book.title}" from shelf`}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title & Author */}
                <h3 className="font-extrabold text-[#081a3d] text-base group-hover:text-indigo-600 transition-colors leading-snug">
                  {book.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  By {book.author}
                </p>

                {/* Brief description */}
                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {book.description}
                </p>

                {/* Key Topics Badges - Clickable to open Interactive Lesson Plan */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                    <span>Lesson Plans: Tap to Learn</span>
                    <span className="text-[9px] bg-indigo-50 px-1.5 py-0.5 rounded font-bold">Interactive</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(book.keyTopics || []).slice(0, 3).map((topic, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => handleOpenTopicLessonPlan(book, topic, e)}
                        className="text-[10px] font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 px-2 py-0.5 rounded-md border border-slate-200/80 hover:border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title={`Open step-by-step lesson plan for ${topic}`}
                      >
                        <span>💡 {topic}</span>
                      </button>
                    ))}
                    {(book.keyTopics || []).length > 3 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBook(book);
                        }}
                        className="text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded-md cursor-pointer"
                      >
                        +{(book.keyTopics || []).length - 3} more
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <Clock size={13} className="text-indigo-600" />
                  <span>{book.estimatedMinutesPerSession} mins daily</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Mark Read Toggle */}
                  <button
                    type="button"
                    title={isCompleted ? 'Mark as to-read' : 'Mark reading session as completed'}
                    onClick={(e) => handleToggleCompleted(book.id, e)}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      isCompleted 
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                        : 'bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                  </button>

                  {/* Add to Daily Plan Task */}
                  {onAddReadingTask && (
                    <button
                      type="button"
                      title="Add reading session to your daily planner tasks"
                      onClick={(e) => handleAddBookToDailyTasks(book, e)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isAddedToTasks
                          ? 'bg-emerald-500 text-white'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {isAddedToTasks ? (
                        <>
                          <Check size={12} />
                          <span>Planned</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle size={12} />
                          <span>Plan Session</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Read Excerpt Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedBook(book)}
                    className="px-2.5 py-1 rounded-lg bg-[#081a3d] hover:bg-[#122e66] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <BookOpen size={36} className="mx-auto text-slate-400 mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No books found matching your search</h4>
          <p className="text-xs text-slate-500 mt-1">Try searching for "Math", "English", "Physics", or "Literature".</p>
        </div>
      )}

      {/* Book Reader Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedBook.coverColor} text-white flex items-start justify-between gap-4`}>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10.5px] font-black uppercase tracking-wider backdrop-blur-xs">
                    {selectedBook.subject}
                  </span>
                  <span className="text-xs text-blue-100 font-medium">
                    {selectedBook.targetClass}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {selectedBook.title}
                </h3>
                <p className="text-xs text-blue-100 font-medium">
                  By {selectedBook.author} • {selectedBook.chaptersCount} Chapters • ~{selectedBook.estimatedMinutesPerSession} mins daily reading
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setBookToEdit(selectedBook);
                        setIsAddBookModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Admin: Edit this reading book"
                    >
                      <Edit3 size={13} />
                      <span>Edit Book</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteBook(selectedBook.id, e)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Admin: Delete this reading book from shelf"
                    >
                      <Trash2 size={13} />
                      <span>Delete Book</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Curriculum Topics with Clickable Lesson Plans */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-indigo-600" />
                    Interactive Lesson Plans (Tap Topic to Learn & Solve)
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Includes Worked Examples & Formulas
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(selectedBook.keyTopics || []).map((topic, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOpenTopicLessonPlan(selectedBook, topic)}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-800 hover:text-indigo-900 transition-all text-left flex items-center justify-between cursor-pointer group shadow-xs active:scale-95"
                    >
                      <span className="truncate pr-2">💡 {topic}</span>
                      <span className="text-[10px] font-black uppercase text-indigo-600 opacity-80 group-hover:opacity-100 flex items-center gap-1 shrink-0">
                        <span>Open Lesson</span>
                        <ArrowRight size={11} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reading Excerpt / Textbook Lesson */}
              <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                    <BookMarked size={15} className="text-amber-700" />
                    Essential Reading Excerpt
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Syllabus Lesson
                  </span>
                </div>
                <div className="text-sm font-sans text-slate-800 whitespace-pre-line leading-relaxed font-normal bg-white p-4 rounded-xl border border-amber-100">
                  {selectedBook.readingExcerpt}
                </div>
              </div>

              {/* Comprehension & Revision Questions */}
              <div className="bg-sky-50/60 rounded-2xl p-5 border border-sky-200/80 space-y-3">
                <h4 className="text-xs font-black uppercase text-sky-950 tracking-wider flex items-center gap-1.5">
                  <HelpCircle size={15} className="text-sky-700" />
                  Self-Check Study Revision Questions
                </h4>
                <div className="space-y-2">
                  {(selectedBook.studyQuestions || []).map((q, idx) => (
                    <div key={idx} className="text-xs text-slate-800 font-medium flex items-start gap-2 bg-white p-3 rounded-xl border border-sky-100">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-black flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-snug pt-0.5">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleToggleCompleted(selectedBook.id, e)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    completedBooksMap[selectedBook.id]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  <span>
                    {completedBooksMap[selectedBook.id] ? 'Marked as Completed ✓' : 'Mark Lesson Completed'}
                  </span>
                </button>

                {onAddReadingTask && (
                  <button
                    type="button"
                    onClick={(e) => handleAddBookToDailyTasks(selectedBook, e)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-all cursor-pointer flex items-center gap-1.5 border border-indigo-200"
                  >
                    <PlusCircle size={15} />
                    <span>Add to Daily Plan Schedule</span>
                  </button>
                )}

                {isAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setBookToEdit(selectedBook);
                        setIsAddBookModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-200"
                    >
                      <Edit3 size={14} />
                      <span>Edit Book Content</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteBook(selectedBook.id, e)}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
                      title="Admin: Delete this book"
                    >
                      <Trash2 size={14} />
                      <span>Delete Book</span>
                    </button>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="px-5 py-2 bg-[#081a3d] hover:bg-[#122e66] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Book Modal */}
      <AdminAddBookModal
        currentUser={currentUser}
        isOpen={isAddBookModalOpen}
        bookToEdit={bookToEdit}
        onClose={() => {
          setIsAddBookModalOpen(false);
          setBookToEdit(null);
        }}
        onBookAdded={(updated) => {
          setBooks(updated);
          if (selectedBook) {
            const currentSelected = updated.find(b => b.id === selectedBook.id);
            if (currentSelected) setSelectedBook(currentSelected);
          }
        }}
      />

      {/* AI PDF to CBT Exam Converter Modal (Admin Only) */}
      <AdminAiPdfToCbtModal
        isOpen={isAiPdfModalOpen}
        currentUser={currentUser}
        onClose={() => setIsAiPdfModalOpen(false)}
        onNavigateToExam={onNavigateToExam}
        onAddStudyTask={onAddReadingTask}
        initialClass={currentUser?.grade || 'SS2'}
      />
      {/* Admin AI PDF/File to Book Synthesizer Modal */}
      <AdminAiBookUploadModal
        isOpen={isAiBookUploadModalOpen}
        currentUser={currentUser}
        onClose={() => setIsAiBookUploadModalOpen(false)}
        onBookCreated={(newBook) => {
          setBooks(getStoredReadingBooks());
          setSelectedBook(newBook);
        }}
      />

      {/* Interactive Topic Lesson Plan Modal */}
      <TopicLessonPlanModal
        isOpen={Boolean(selectedTopicPlan)}
        onClose={() => {
          setSelectedTopicPlan(null);
          setSelectedTopicBook(null);
        }}
        lessonPlan={selectedTopicPlan}
        book={selectedTopicBook}
        onAddStudyTask={onAddReadingTask}
      />
    </section>
  );
};
