import React, { useState, useEffect } from 'react';
import { 
  X, BookOpen, Plus, Trash2, Sparkles, Check, Atom, Palette, 
  HelpCircle, BookMarked, Clock, Edit3 
} from 'lucide-react';
import { ReadingBook, saveCustomReadingBook, updateReadingBook, deleteCustomReadingBook } from '../data/readingBooksData';
import { User } from '../types';
import { playSuccessSound } from '../utils/sound';

interface AdminAddBookModalProps {
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: (books: ReadingBook[]) => void;
  bookToEdit?: ReadingBook | null;
}

export const AdminAddBookModal: React.FC<AdminAddBookModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onBookAdded,
  bookToEdit
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [customSubject, setCustomSubject] = useState('');
  const [stream, setStream] = useState<'science' | 'art' | 'both'>('both');
  const [targetClass, setTargetClass] = useState('Senior Classes (SS1 - SS3)');
  const [description, setDescription] = useState('');
  const [chaptersCount, setChaptersCount] = useState<number>(15);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(20);
  const [keyTopicsInput, setKeyTopicsInput] = useState('');
  const [readingExcerpt, setReadingExcerpt] = useState('');
  const [questionsInput, setQuestionsInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title || '');
      setAuthor(bookToEdit.author || '');
      const validSubjects = ['Mathematics', 'English Language', 'Physics & Chemistry', 'Biology & Health', 'Literature & Government', 'Economics & Business', 'Christian & Islamic Studies'];
      if (validSubjects.includes(bookToEdit.subject)) {
        setSubject(bookToEdit.subject);
        setCustomSubject('');
      } else {
        setSubject('Other');
        setCustomSubject(bookToEdit.subject);
      }
      setStream(bookToEdit.stream || 'both');
      setTargetClass(bookToEdit.targetClass || 'Senior Classes (SS1 - SS3)');
      setDescription(bookToEdit.description || '');
      setChaptersCount(bookToEdit.chaptersCount || 15);
      setEstimatedMinutes(bookToEdit.estimatedMinutesPerSession || 20);
      setKeyTopicsInput((bookToEdit.keyTopics || []).join('\n'));
      setReadingExcerpt(bookToEdit.readingExcerpt || '');
      setQuestionsInput((bookToEdit.studyQuestions || []).join('\n'));
    } else {
      setTitle('');
      setAuthor('');
      setSubject('Mathematics');
      setCustomSubject('');
      setStream('both');
      setTargetClass('Senior Classes (SS1 - SS3)');
      setDescription('');
      setChaptersCount(15);
      setEstimatedMinutes(20);
      setKeyTopicsInput('');
      setReadingExcerpt('');
      setQuestionsInput('');
    }
    setError(null);
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a book title.');
      return;
    }
    if (!author.trim()) {
      setError('Please provide the author or textbook publisher.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a brief textbook description or summary.');
      return;
    }
    if (!readingExcerpt.trim()) {
      setError('Please enter a syllabus chapter excerpt or lesson text for students to read.');
      return;
    }

    const finalSubject = subject === 'Other' ? (customSubject.trim() || 'General Studies') : subject;
    
    // Parse key topics
    const topics = keyTopicsInput
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);
    if (topics.length === 0) {
      topics.push('Foundational Curriculum Concepts', 'Exam Worked Examples', 'Revision Exercises');
    }

    // Parse questions
    const questions = questionsInput
      .split('\n')
      .map(q => q.trim())
      .filter(Boolean);
    if (questions.length === 0) {
      questions.push('What are the fundamental concepts highlighted in this reading chapter?', 'State two practical examples demonstrating this topic.');
    }

    // Determine colors
    let coverColor = 'from-blue-600 via-indigo-700 to-slate-900';
    let badgeBg = 'bg-blue-100 text-blue-800 border-blue-200';
    if (stream === 'science' || finalSubject.toLowerCase().includes('physics') || finalSubject.toLowerCase().includes('chemistry')) {
      coverColor = 'from-blue-700 via-teal-700 to-slate-900';
      badgeBg = 'bg-cyan-100 text-cyan-800 border-cyan-200';
    } else if (stream === 'art' || finalSubject.toLowerCase().includes('literature') || finalSubject.toLowerCase().includes('government')) {
      coverColor = 'from-purple-700 via-pink-700 to-stone-900';
      badgeBg = 'bg-purple-100 text-purple-800 border-purple-200';
    } else if (finalSubject.toLowerCase().includes('english')) {
      coverColor = 'from-amber-600 via-orange-700 to-slate-900';
      badgeBg = 'bg-amber-100 text-amber-800 border-amber-200';
    }

    const bookData: ReadingBook = {
      id: bookToEdit ? bookToEdit.id : `custom-book-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      subject: finalSubject,
      stream,
      targetClass,
      coverColor: bookToEdit?.coverColor || coverColor,
      badgeBg: bookToEdit?.badgeBg || badgeBg,
      description: description.trim(),
      chaptersCount: Number(chaptersCount) || 10,
      estimatedMinutesPerSession: Number(estimatedMinutes) || 20,
      keyTopics: topics,
      readingExcerpt: readingExcerpt.trim(),
      studyQuestions: questions,
      isCustom: bookToEdit ? bookToEdit.isCustom : true,
      createdAt: bookToEdit?.createdAt || new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
      addedBy: bookToEdit?.addedBy || currentUser?.name || 'Administrator'
    };

    const updated = updateReadingBook(bookData);
    onBookAdded(updated);
    playSuccessSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#081a3d] via-[#0d2a5d] to-[#154687] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              {bookToEdit ? <Edit3 size={20} className="text-[#62c5fa]" /> : <BookOpen size={20} className="text-[#62c5fa]" />}
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
                <span>Admin Academic Shelf Manager</span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-400/30">Verified Staff</span>
              </div>
              <h3 className="text-xl font-black text-white">
                {bookToEdit ? 'Edit Recommended Student Reading Book' : 'Add Recommended Student Reading Book'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Book Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Book Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Further Mathematics for Senior Secondary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Author / Publisher *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. P. N. Okeke & WAEC Advisory Board"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Subject, Stream & Target Class */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="English Language">English Language</option>
                <option value="Science & Physics">Science & Physics</option>
                <option value="Biology & Health">Biology & Health</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Literature in English">Literature in English</option>
                <option value="Government & History">Government & History</option>
                <option value="Civic & Social Studies">Civic & Social Studies</option>
                <option value="Economics & Commerce">Economics & Commerce</option>
                <option value="Other">Other / Custom</option>
              </select>
              {subject === 'Other' && (
                <input
                  type="text"
                  placeholder="Type subject name..."
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Academic Stream *
              </label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value as 'science' | 'art' | 'both')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              >
                <option value="both">General (Science & Art Students)</option>
                <option value="science">🔬 Science Stream Only</option>
                <option value="art">🎨 Art Stream Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Level *
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              >
                <option value="Senior Classes (SS1 - SS3)">Senior Classes (SS1 - SS3)</option>
                <option value="Junior Classes (JSS1 - JSS3)">Junior Classes (JSS1 - JSS3)</option>
                <option value="All Classes">All Secondary Classes</option>
              </select>
            </div>
          </div>

          {/* Time & Chapters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Estimated Reading Time per Session (Mins)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none pl-9"
                />
                <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Chapters in Book
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={chaptersCount}
                onChange={(e) => setChaptersCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Book Description / Syllabus Focus *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Brief summary explaining what students will learn from this book..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Key Topics Covered */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Key Chapter Topics Covered (One topic per line)
            </label>
            <textarea
              rows={3}
              placeholder="Quadratic Formula & Discriminant&#10;Circle Theorems&#10;Simultaneous Linear Graphs"
              value={keyTopicsInput}
              onChange={(e) => setKeyTopicsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none font-mono"
            />
          </div>

          {/* Syllabus Reading Excerpt / Lesson Text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Essential Reading Excerpt / Textbook Lesson Text *
              </label>
              <span className="text-[11px] text-slate-500 font-medium">Students read this inside the book reader</span>
            </div>
            <textarea
              required
              rows={6}
              placeholder="Type or paste the chapter lesson, key rules, formulas, examples, or literary analysis that students must read today..."
              value={readingExcerpt}
              onChange={(e) => setReadingExcerpt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-normal focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-sans leading-relaxed"
            />
          </div>

          {/* Self-Check Study Questions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Self-Check Revision Questions (One per line)
            </label>
            <textarea
              rows={3}
              placeholder="1. Define the core formula taught in this chapter.&#10;2. What is the distinction between simple and compound interest?&#10;3. Solve problem #4 on page 32."
              value={questionsInput}
              onChange={(e) => setQuestionsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {bookToEdit ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to permanently delete "${bookToEdit.title}" from the curriculum shelf?`)) {
                    const updated = deleteCustomReadingBook(bookToEdit.id);
                    onBookAdded(updated);
                    playSuccessSound();
                    onClose();
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5"
                title="Admin: Permanently delete this book"
              >
                <Trash2 size={14} />
                <span>Delete Book</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <Check size={15} />
                <span>{bookToEdit ? 'Save Changes to Book' : 'Publish Book to Reading Shelf'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
