import React, { useState } from 'react';
import { 
  X, Upload, FileText, Sparkles, CheckCircle2, AlertCircle, 
  BookOpen, ArrowRight, Check, RotateCcw, HelpCircle, 
  Compass, Atom, Palette, ShieldCheck, Loader2, ShieldAlert,
  Edit3, BookMarked, Clock
} from 'lucide-react';
import { ReadingBook, saveCustomReadingBook, TopicLessonPlan } from '../data/readingBooksData';
import { playSuccessSound } from '../utils/sound';
import { User } from '../types';

interface AdminAiBookUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookCreated?: (book: ReadingBook) => void;
  currentUser?: User | null;
}

// Sample Nigerian & West African Textbooks ready for immediate testing
const SAMPLE_BOOK_DOCUMENTS = [
  {
    id: 'sample-math-book',
    name: 'WAEC_SS2_Core_Mathematics_Logarithms_Algebra.pdf',
    suggestedTitle: 'Senior Secondary Mathematics: Logarithms, Algebra & Coordinate Geometry',
    suggestedAuthor: 'A. J. S. Oluwasanmi & Mathematical Curriculum Panel',
    subject: 'Science Mathematics',
    stream: 'science' as const,
    targetClass: 'Senior Classes (SS1 - SS3)',
    description: 'Complete WAEC curriculum textbook on indices, logarithms, quadratic equations, trigonometry, and circle theorems with step-by-step lesson plans.',
    sampleText: `SENIOR SECONDARY SCHOOL MATHEMATICS (CORE)
CHAPTER 3: LOGARITHMS AND EXPONENTIAL RELATIONSHIPS

1. Concept and Foundations:
A logarithm is an exponent. If bʸ = x (b > 0, b ≠ 1, x > 0), then log_b(x) = y.
The argument of a real logarithm must always be strictly positive.

2. The 4 Fundamental Laws of Logarithms:
• Law 1 (Product Law): log_b(MN) = log_b(M) + log_b(N)
• Law 2 (Quotient Law): log_b(M / N) = log_b(M) - log_b(N)
• Law 3 (Power Law): log_b(Mᵏ) = k · log_b(M)
• Law 4: log_b(1) = 0 and log_b(b) = 1

3. Step-by-Step Method for Equation Solving:
Step 1: Use logarithm laws to condense expressions on each side into single log terms.
Step 2: Equate arguments or convert log_b(f(x)) = c to f(x) = bᶜ.
Step 3: Solve the resulting algebraic equation.
Step 4: Check for extraneous roots! Discard any root where the argument becomes ≤ 0.

Worked Example:
Solve for x: log₁₀(x + 3) + log₁₀(x - 3) = log₁₀(16)
Solution:
Combine left side: log₁₀[(x + 3)(x - 3)] = log₁₀(16)
(x + 3)(x - 3) = 16
x² - 9 = 16
x² = 25
x = 5 (reject x = -5 as log(-8) is undefined).`
  },
  {
    id: 'sample-money-book',
    name: 'Youth_Independence_Money_Relationships_Responsibility.pdf',
    suggestedTitle: 'The Young Leader’s Handbook to Independence: Money, Relationships & Character',
    suggestedAuthor: 'Victoria Okajoe & Youth Leadership Institute',
    subject: 'Independence & Life Skills',
    stream: 'life_skills' as const,
    targetClass: 'All Classes',
    description: 'Transformative guide teaching teenagers how to budget money with the 50/30/20 rule, resolve relationship disputes peacefully, honor parents with genuine respect, and take independent decisions.',
    sampleText: `CHAPTER 1: THE FOUR FOUNDATIONS OF INDEPENDENT YOUTH

1. MONEY & BUDGETING (The 50/30/20 Rule):
Independence begins when you manage what you have. 
• 50% for Needs: Transport, textbooks, essential health, mandatory school items.
• 30% for Wants: Treats, snacks, leisure.
• 20% for Independence Savings: Emergency fund, self-development courses.
Rule: "Pay yourself first before spending a single naira."

2. RELATIONSHIPS & CONFLICT RESOLUTION:
Mature people resolve disagreements with composure instead of screaming.
The "I-Statement" Formula: "I feel [EMOTION] when [ACTION] happens, because [REASON]. Moving forward, I need [REQUEST]."
Never speak when your heart rate is racing; take a 10-minute timeout to breathe.

3. RESPECT & RESPONSIBILITY:
Respecting elders, teachers, and peers is an expression of high character, not weakness.
Take 100% Extreme Ownership of chores, homework, and mistakes without making excuses.

4. THE 5-STEP DECISION-MAKING MATRIX:
When facing hard choices, apply the 10-10-10 Rule:
How will this choice feel in 10 minutes, 10 months, and 10 years? Independent leaders choose the 10-month and 10-year benefit over temporary 10-minute pleasure.`
  },
  {
    id: 'sample-literature-book',
    name: 'WAEC_Art_Literature_African_Drama_Poetry.pdf',
    suggestedTitle: 'African Dramatic Arts, Rhetoric & Poetic Traditions',
    suggestedAuthor: 'Prof. J. C. Banjo & West African Literary Critics',
    subject: 'Literature in English',
    stream: 'art' as const,
    targetClass: 'Senior Classes (SS1 - SS3)',
    description: 'Prescribed WAEC/NECO drama and poetry anthology with comprehensive lesson plans on dramatic irony, tragic flaws, oral poetic traditions, and critical appreciation.',
    sampleText: `SENIOR SECONDARY LITERATURE IN ENGLISH
CHAPTER 2: DRAMATIC STRUCTURE AND CHARACTER CONFLICT

1. Dramatic Irony and Tragic Flaws (Hamartia):
Dramatic irony occurs when the audience possesses critical knowledge that a character lacks.
In classical and African drama, the protagonist's tragic flaw precipitates their unavoidable fall.

2. Step-by-Step Method for Literary Criticism:
Step 1: Identify the central dramatic question and character motivation.
Step 2: Locate key textual passages demonstrating symbolism and irony.
Step 3: Analyze socio-political context: How does the text reflect pre-colonial traditions or post-colonial realities?
Step 4: Formulate a balanced, thesis-driven essay response with textual quotes.

Worked Example:
Discuss the symbolism of the locusts in Chinua Achebe's prose.
Solution: The locusts appear harmless and delightful at first, yet they devour the entire harvest. They prefigure the arrival of foreign colonial administrators, whose initial promises culminate in the unraveling of Umuofia's traditional fabric.`
  }
];

export const AdminAiBookUploadModal: React.FC<AdminAiBookUploadModalProps> = ({
  isOpen,
  onClose,
  onBookCreated,
  currentUser
}) => {
  const activeUser = currentUser || (() => {
    try {
      const raw = localStorage.getItem('echo_plan_user');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  })();

  const isAdmin = Boolean(
    activeUser?.role === 'admin' || 
    activeUser?.role === 'student_admin' || 
    activeUser?.isAdmin || 
    activeUser?.email === 'ijikevictoriaokajoe@gmail.com'
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'sample'>('upload');

  // Book parameters
  const [bookTitle, setBookTitle] = useState<string>('');
  const [bookAuthor, setBookAuthor] = useState<string>('');
  const [bookSubject, setBookSubject] = useState<string>('Mathematics');
  const [bookStream, setBookStream] = useState<'science' | 'art' | 'life_skills' | 'both'>('science');
  const [targetClass, setTargetClass] = useState<string>('Senior Classes (SS1 - SS3)');

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedBook, setGeneratedBook] = useState<ReadingBook | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  // STRICT SECURITY CHECK: Only admin can upload and generate books
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-200 text-center animate-scale-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <ShieldAlert size={32} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black uppercase tracking-wider mb-2 border border-rose-200">
            Administrator Privilege Required
          </div>
          <h3 className="text-xl font-black text-[#081a3d] mb-2">
            Only School Admin Can Upload Books
          </h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Students cannot publish or upload textbook files to the library. Only administrators have permission to upload documents and use AI to synthesize reading books and interactive lesson plans for students.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-[#081a3d] text-white font-black text-xs hover:bg-[#122e66] transition-colors cursor-pointer"
          >
            Return to Reading Shelf
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSelectedFile(file);
    setFileName(file.name);

    // Auto-detect stream and subject from file name
    const lowerName = file.name.toLowerCase();
    if (lowerName.includes('money') || lowerName.includes('relat') || lowerName.includes('independ') || lowerName.includes('habit')) {
      setBookStream('life_skills');
      setBookSubject('Independence & Life Skills');
    } else if (lowerName.includes('math') || lowerName.includes('phys') || lowerName.includes('chem') || lowerName.includes('bio')) {
      setBookStream('science');
      if (lowerName.includes('math')) setBookSubject('Mathematics');
      else if (lowerName.includes('phys')) setBookSubject('Physics & Mechanics');
      else if (lowerName.includes('chem')) setBookSubject('Chemistry');
      else if (lowerName.includes('bio')) setBookSubject('Biology');
    } else if (lowerName.includes('lit') || lowerName.includes('gov') || lowerName.includes('crs') || lowerName.includes('hist')) {
      setBookStream('art');
      if (lowerName.includes('lit')) setBookSubject('Literature in English');
      else if (lowerName.includes('gov')) setBookSubject('Government & Civics');
      else if (lowerName.includes('hist')) setBookSubject('History & Heritage');
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.readAsDataURL(file);

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const textReader = new FileReader();
      textReader.onload = () => {
        setExtractedText(textReader.result as string);
      };
      textReader.readAsText(file);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_BOOK_DOCUMENTS[0]) => {
    setSelectedFile(null);
    setFileBase64(null);
    setFileName(sample.name);
    setBookTitle(sample.suggestedTitle);
    setBookAuthor(sample.suggestedAuthor);
    setBookSubject(sample.subject);
    setBookStream(sample.stream);
    setTargetClass(sample.targetClass);
    setExtractedText(sample.sampleText);
    setError(null);
    playSuccessSound();
  };

  const handleGenerateBook = async () => {
    if (!fileBase64 && !extractedText) {
      setError('Please upload a PDF or document file, or select one of the verified sample textbooks.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationStep('Reading and analyzing document contents...');

    try {
      setTimeout(() => setGenerationStep('Synthesizing curriculum textbook chapters & definitions...'), 1200);
      setTimeout(() => setGenerationStep('Formulating interactive lesson plans with step-by-step methods & worked examples...'), 2600);
      setTimeout(() => setGenerationStep('Generating practice exercises, common mistakes & independence takeaways...'), 4200);

      const response = await fetch('/api/ai/convert-file-to-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64,
          fileName: fileName || 'Uploaded_Textbook.pdf',
          textContent: extractedText,
          suggestedTitle: bookTitle,
          suggestedAuthor: bookAuthor,
          suggestedSubject: bookSubject,
          targetStream: bookStream,
          targetClass: targetClass
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to transform document into book.');
      }

      setGeneratedBook(data.book);
      setIsSaved(false);
      playSuccessSound();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI service. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishBook = () => {
    if (!generatedBook) return;
    saveCustomReadingBook(generatedBook);
    setIsSaved(true);
    playSuccessSound();
    if (onBookCreated) onBookCreated(generatedBook);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-label="Admin AI PDF to Book Converter"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#071a3d] via-[#0d2a63] to-[#124b91] text-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10.5px] font-black uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1">
                <Sparkles size={11} />
                Gemini AI File-to-Book Synthesizer
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 text-[10px] font-black uppercase border border-indigo-400/30 flex items-center gap-1">
                <ShieldCheck size={10} /> Sole Admin Privilege
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Upload PDF or File to Create Normal Book
            </h2>
            <p className="text-xs text-[#c8daf3] leading-relaxed max-w-2xl">
              Upload a syllabus file, textbook notes, or document. Gemini AI will turn it into a normal book complete with interactive lesson plans, step-by-step problem solving, formulas, and worked examples!
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          
          {/* Tabs: Upload Your File vs Pick Sample Textbook */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`pb-3 px-4 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
                activeTab === 'upload' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Upload size={14} />
              <span>Upload My Document File (PDF / DOC / TXT)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sample')}
              className={`pb-3 px-4 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
                activeTab === 'sample' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <BookOpen size={14} />
              <span>Select Sample Textbook Document (1-Click Test)</span>
            </button>
          </div>

          {/* TAB 1: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label 
                htmlFor="book-file-upload-input"
                className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-indigo-50/20 hover:bg-indigo-50/50 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-all mb-3 shadow-xs">
                  <Upload size={26} />
                </div>
                <div className="text-sm font-extrabold text-[#081a3d]">
                  {selectedFile ? selectedFile.name : 'Click to select or drag and drop textbook file'}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF documents, Word notes (.docx), and plain text notes (.txt, .md). Up to 50MB.
                </p>
                {selectedFile && (
                  <span className="mt-3 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 size={13} />
                    File loaded ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                )}
                <input 
                  id="book-file-upload-input" 
                  type="file" 
                  accept=".pdf,.txt,.md,.doc,.docx"
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>
          )}

          {/* TAB 2: VERIFIED SAMPLE TEXTBOOKS */}
          {activeTab === 'sample' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Choose one of our curriculum sample documents to test the AI book generation instantly:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SAMPLE_BOOK_DOCUMENTS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      fileName === sample.name
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase mb-2 inline-block border ${
                        sample.stream === 'science' 
                          ? 'bg-blue-100 text-blue-800 border-blue-200' 
                          : sample.stream === 'life_skills'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}>
                        {sample.stream === 'science' ? 'Science' : sample.stream === 'life_skills' ? 'Life Skills' : 'Art'} • {sample.subject}
                      </span>
                      <h4 className="font-extrabold text-xs text-[#081a3d] leading-snug">
                        {sample.suggestedTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {sample.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-indigo-600">
                      <span>{fileName === sample.name ? 'Selected ✓' : 'Select Document'}</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Book Parameters Form */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-600" />
              Book Stream & Shelf Placement Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Stream */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Target Student Stream
                </label>
                <select
                  value={bookStream}
                  onChange={(e) => setBookStream(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value="science">🔬 Science Students Shelf</option>
                  <option value="art">🎨 Art Students Shelf</option>
                  <option value="life_skills">🧭 Independence & Life Skills Shelf</option>
                  <option value="both">🌐 All Students (General)</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Subject Category
                </label>
                <input
                  type="text"
                  value={bookSubject}
                  onChange={(e) => setBookSubject(e.target.value)}
                  placeholder="e.g. Mathematics, Physics, Independence"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Target Class */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Target Class Level
                </label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value="Senior Classes (SS1 - SS3)">Senior Classes (SS1 - SS3)</option>
                  <option value="Junior Classes (JSS1 - JSS3)">Junior Classes (JSS1 - JSS3)</option>
                  <option value="All Classes">All Classes (Whole School)</option>
                </select>
              </div>

              {/* Book Author */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Author / Publisher
                </label>
                <input
                  type="text"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  placeholder="e.g. Oluwasanmi & Eze"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Generate Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500 font-medium">
              {fileName ? `Ready to turn ${fileName} into book` : 'Select a document file to begin'}
            </div>

            <button
              type="button"
              disabled={isGenerating || (!fileBase64 && !extractedText)}
              onClick={handleGenerateBook}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>{generationStep || 'Synthesizing Book...'}</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-yellow-300" />
                  <span>Transform File into Book with AI</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

          {/* GENERATED BOOK PREVIEW */}
          {generatedBook && (
            <div className="p-6 rounded-3xl bg-gradient-to-b from-indigo-50/50 to-white border-2 border-indigo-200 shadow-md space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-black uppercase tracking-wider border border-emerald-200 flex items-center gap-1 w-fit mb-1.5">
                    <CheckCircle2 size={12} />
                    Book Successfully Synthesized!
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-[#081a3d]">
                    {generatedBook.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    By {generatedBook.author} • {generatedBook.subject} • {generatedBook.targetClass}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePublishBook}
                  disabled={isSaved}
                  className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                    isSaved
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                  }`}
                >
                  <Check size={16} />
                  <span>{isSaved ? 'Published to Reading Shelf ✓' : 'Publish Book to Reading Shelf'}</span>
                </button>
              </div>

              {/* Overview Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Shelf Stream
                  </span>
                  <span className="text-xs font-bold text-slate-800 capitalize flex items-center gap-1.5">
                    {generatedBook.stream === 'science' ? <Atom size={14} className="text-blue-600" /> : <Palette size={14} className="text-purple-600" />}
                    <span>{generatedBook.stream} Shelf</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Chapters & Lesson Time
                  </span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock size={14} className="text-indigo-600" />
                    <span>{generatedBook.chaptersCount} Chapters ({generatedBook.estimatedMinutesPerSession} mins/day)</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Interactive Lesson Plans
                  </span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>{(generatedBook.lessonPlans || []).length} Interactive Plans</span>
                  </span>
                </div>
              </div>

              {/* Key Topics List */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Key Chapters & Topics Covered:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(generatedBook.keyTopics || []).map((t, idx) => (
                    <span key={idx} className="text-xs font-semibold px-3 py-1 bg-white text-slate-700 rounded-lg border border-slate-200 shadow-xs">
                      • {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Excerpt */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Chapter Reading Excerpt Preview:
                </span>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 font-sans whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto font-normal">
                  {generatedBook.readingExcerpt}
                </div>
              </div>

              {/* Sample Lesson Plan Preview */}
              {(generatedBook.lessonPlans || []).length > 0 && (
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-indigo-600" />
                    Interactive Lesson Plan Generated for Students:
                  </span>
                  <div className="text-xs text-indigo-950 font-bold">
                    Topic: {generatedBook.lessonPlans![0].topicTitle}
                  </div>
                  <div className="text-[11px] text-slate-700 line-clamp-2">
                    {generatedBook.lessonPlans![0].summary}
                  </div>
                  <div className="text-[11px] text-indigo-700 font-bold">
                    ✓ Includes step-by-step method, worked examples, common mistakes, and practice questions.
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium hidden sm:inline">
            Echo Plan AI Curriculum Tools • West African Secondary Benchmark
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer ml-auto"
          >
            {isSaved ? 'Done' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
