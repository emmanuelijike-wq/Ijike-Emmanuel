import React, { useState } from 'react';
import { 
  X, FileText, Upload, Sparkles, CheckCircle2, AlertCircle, 
  Clock, Award, BookOpen, ArrowRight, Check, RotateCcw, 
  HelpCircle, ChevronDown, ChevronUp, Copy, Eye, Zap, 
  ShieldCheck, Loader2, ShieldAlert
} from 'lucide-react';
import { CBTExam, saveCustomCBTExam } from '../data/cbtExamsRegistry';
import { ExamQuestion } from '../data/mockExamData';
import { playSuccessSound } from '../utils/sound';
import { User } from '../types';

interface AdminAiPdfToCbtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamCreated?: (exam: CBTExam) => void;
  onNavigateToExam?: (examId: string) => void;
  onAddStudyTask?: (task: { title: string; category: any; time: string; priority: any }) => void;
  initialClass?: string;
  currentUser?: User | null;
}

// Sample Nigerian Curriculum Exam Documents ready for immediate one-click testing
const SAMPLE_DOCUMENTS = [
  {
    id: 'sample-ss1-math-pdf',
    name: 'SS1_Mathematics_Exam.pdf',
    subject: 'Mathematics',
    studentClass: 'SS1',
    stream: 'science' as const,
    badge: 'Uploaded by User',
    description: 'User-provided SS1 Mathematics exam paper: Number Bases, Modular Arithmetic, Indices, Logarithms, Sets, Quadratic Equations, Geometry, Trigonometric Ratios, Mensuration, and Probability.',
    sampleText: `SENIOR SECONDARY SCHOOL CERTIFICATE EXAMINATION (SSCE / WAEC)
SUBJECT: MATHEMATICS (CORE)
CLASS: SS1
TIME ALLOWED: 30 MINUTES

INSTRUCTIONS: Answer all questions. Each question is followed by four options lettered A to D.

SECTION A: NUMBER BASES & INDICES
1. Convert 11011_two to a number in base ten (denary).
A. 25
B. 27
C. 29
D. 31

2. If 23_five = x_ten, calculate the value of x.
A. 11
B. 13
C. 15
D. 17

3. Evaluate (38 + 27) (mod 7).
A. 2
B. 3
C. 4
D. 5

4. Simplify completely: (81 / 16)^(-3/4).
A. 8 / 27
B. 27 / 8
C. 16 / 81
D. 4 / 9

5. Solve for x in the equation: 3^(2x - 1) = 243.
A. 2
B. 3
C. 4
D. 5

SECTION B: LOGARITHMS & SETS
6. Given that log_10(2) = 0.3010 and log_10(3) = 0.4771, calculate log_10(12).
A. 0.7781
B. 1.0791
C. 1.2552
D. 1.3802

7. If Universal Set U = {x : 1 <= x <= 12, x is an integer} and Set P = {prime numbers in U}, find the number of elements in set P, n(P).
A. 4
B. 5
C. 6
D. 7

8. In a class of 40 students, 25 study Mathematics, 20 study Physics, and 8 study neither. How many students study both Mathematics and Physics?
A. 10
B. 13
C. 15
D. 17

SECTION C: ALGEBRA & QUADRATICS
9. Factorize completely: 6x^2 - 13x - 5.
A. (2x - 5)(3x + 1)
B. (3x - 5)(2x + 1)
C. (6x - 1)(x + 5)
D. (2x + 5)(3x - 1)

10. Find the quadratic equation whose roots are 3 and -4.
A. x^2 + x - 12 = 0
B. x^2 - x - 12 = 0
C. x^2 + 7x + 12 = 0
D. x^2 - 7x - 12 = 0

11. Solve for x and y: 2x + y = 11 and 3x - 2y = 6.
A. x = 4, y = 3
B. x = 3, y = 5
C. x = 5, y = 1
D. x = 4, y = 2

12. Make r the subject of the formula: V = (1/3) * pi * r^2 * h.
A. r = sqrt((3V) / (pi * h))
B. r = (3V) / (pi * h)
C. r = sqrt((V) / (3 * pi * h))
D. r = (3V * pi) / h

SECTION D: GEOMETRY & TRIGONOMETRY
13. Calculate the size of each interior angle of a regular octagon (8-sided polygon).
A. 120 degrees
B. 135 degrees
C. 140 degrees
D. 144 degrees

14. In a right-angled triangle, if sin(theta) = 3/5, find the value of tan(theta).
A. 3/4
B. 4/3
C. 4/5
D. 5/4

15. An angle subtended by a diameter at any point on the circumference of a circle is always:
A. 45 degrees
B. 60 degrees
C. 90 degrees (right angle)
D. 180 degrees

SECTION E: MENSURATION & PROBABILITY
16. Find the perimeter of a sector of a circle of radius 7cm which subtends an angle of 60 degrees at the centre (Take pi = 22/7).
A. 7.33 cm
B. 14.67 cm
C. 21.33 cm
D. 28.00 cm

17. A cylinder has a base radius of 3.5 cm and a height of 10 cm. Calculate its curved surface area (Take pi = 22/7).
A. 220 cm^2
B. 110 cm^2
C. 440 cm^2
D. 385 cm^2

18. Calculate the mean of the numbers: 12, 15, 18, 22, 28.
A. 18
B. 19
C. 20
D. 21

19. A fair die with faces numbered 1 to 6 is rolled once. What is the probability of obtaining a prime number?
A. 1/6
B. 1/3
C. 1/2
D. 2/3

20. A bag contains 6 red, 4 blue, and 5 green balls. If one ball is picked at random, what is the probability that it is NOT blue?
A. 4/15
B. 11/15
C. 2/3
D. 1/3`
  },
  {
    id: 'sample-math',
    name: 'WAEC_SS2_Mathematics_2026_Model_Paper.pdf',
    subject: 'Mathematics',
    studentClass: 'SS2',
    description: 'Comprehensive WAEC past paper on Quadratic Equations, Logarithms, Circle Geometry, Matrices and Probability.',
    sampleText: `WEST AFRICAN EXAMINATIONS COUNCIL (WAEC)
SENIOR SECONDARY CERTIFICATE EXAMINATION
SUBJECT: MATHEMATICS (CORE)
CLASS: SS2 / SS3
TIME ALLOWED: 30 MINUTES

INSTRUCTIONS: Answer all questions. Each question is followed by four options lettered A to D.

TOPIC 1: QUADRATIC EQUATIONS & ALGEBRA
1. Solve for x in the equation 2x^2 - 5x - 3 = 0.
A. x = 3 or x = -1/2
B. x = -3 or x = 1/2
C. x = 2 or x = -3/2
D. x = 1 or x = -3

2. If log_10(2) = 0.3010 and log_10(3) = 0.4771, calculate the value of log_10(18) without using mathematical tables.
A. 1.2552
B. 0.9542
C. 1.1073
D. 1.3802

3. Find the 10th term of the Arithmetic Progression (A.P.): 5, 9, 13, 17, ...
A. 37
B. 41
C. 45
D. 49

TOPIC 2: GEOMETRY & TRIGONOMETRY
4. In a right-angled triangle ABC with angle B = 90 degrees, AB = 6 cm and BC = 8 cm. What is the value of cos(A)?
A. 3/5
B. 4/5
C. 3/4
D. 4/3

5. The angle of elevation of the top of a radio mast from a point 40m away from its base on level ground is 30 degrees. Calculate the height of the mast in meters (giving answer in surd form).
A. 40 / sqrt(3)
B. 20 * sqrt(3)
C. 40 * sqrt(3)
D. 80 / sqrt(3)

TOPIC 3: CIRCLE THEOREMS & MENSURATION
6. The angle subtended by an arc at the center of a circle is 120 degrees. If the radius is 7cm, calculate the length of the arc (Take pi = 22/7).
A. 14.67 cm
B. 15.33 cm
C. 22.00 cm
D. 44.00 cm

7. Two chords AB and CD of a circle intersect internally at point X. If AX = 4cm, XB = 6cm, and CX = 3cm, find XD.
A. 8 cm
B. 5 cm
C. 7 cm
D. 9 cm

TOPIC 4: STATISTICS & PROBABILITY
8. A bag contains 5 red balls, 3 blue balls, and 2 green balls. If one ball is picked at random, what is the probability that it is NOT green?
A. 4/5
B. 1/5
C. 3/10
D. 7/10

9. Calculate the mean deviation of the numbers: 2, 4, 6, 8, 10.
A. 2.4
B. 2.0
C. 3.0
D. 1.8

10. If 3^(2x - 1) = 81, find the value of x.
A. 2.5
B. 2
C. 3
D. 1.5`
  },
  {
    id: 'sample-english',
    name: 'SS2_English_Language_Grammar_Literature.pdf',
    subject: 'English Language',
    studentClass: 'SS2',
    description: 'WAEC/NECO Grammar & Concord, Figures of Speech, Antonyms, and Literary Theory examination paper.',
    sampleText: `SENIOR SECONDARY SCHOOL CERTIFICATE EXAMINATION (SSCE)
SUBJECT: ENGLISH LANGUAGE & LITERATURE
CLASS: SS2
TIME: 30 MINUTES

SECTION A: LEXIS AND STRUCTURE (CONCORD & GRAMMAR)
1. The Chairman, together with his committee members, _____ attending the emergency meeting today.
A. is
B. are
C. were
D. have been

2. Neither the principal nor the teachers _____ happy with the delayed examination results.
A. was
B. were
C. is
D. has been

3. Choose the option opposite in meaning to the italicized word: The student gave a *plausible* explanation for his lateness.
A. unbelievable
B. credible
C. realistic
D. acceptable

4. She has been studying in this school _____ five years.
A. for
B. since
C. during
D. by

5. By this time next month, we _____ our final secondary school examinations.
A. will have completed
B. will complete
C. have completed
D. are completing

SECTION B: FIGURES OF SPEECH & LITERATURE
6. "The wind whispered secrets through the dense forest" is an example of:
A. Personification
B. Metaphor
C. Simile
D. Hyperbole

7. A speech delivered by a single character alone on stage expressing private thoughts is called a:
A. Soliloquy
B. Monologue
C. Aside
D. Dialogue

8. In poetry, the deliberate repetition of consonant sounds at the beginning of words in close proximity is known as:
A. Alliteration
B. Assonance
C. Onomatopoeia
D. Consonance

9. "He is as brave as a lion in combat" exemplifies which literary device?
A. Simile
B. Metaphor
C. Litotes
D. Metonymy

10. The climax of a tragedy that evokes pity and fear leading to emotional purification is called:
A. Catharsis
B. Hamartia
C. Nemesis
D. Peripeteia`
  },
  {
    id: 'sample-science',
    name: 'SS2_Sciences_Chemistry_Physics_PastQuestions.pdf',
    subject: 'Chemistry & Physics',
    studentClass: 'SS2',
    description: 'Senior Secondary Science Paper: Stoichiometry, Periodic Table Trends, Mechanics, and Energy transformations.',
    sampleText: `SENIOR SECONDARY SCIENCE PRACTICE EXAMINATION
SUBJECT: CHEMISTRY & PHYSICS
CLASS: SS2
TIME: 30 MINUTES

SECTION A: CHEMISTRY
1. What is the oxidation number of sulfur in H2SO4?
A. +6
B. +4
C. -2
D. +2

2. The formula of an organic compound is C2H4. It belongs to the homologous series of:
A. Alkenes
B. Alkanes
C. Alkynes
D. Alkanols

3. Calculate the percentage by mass of nitrogen in ammonium trioxonitrate (V), NH4NO3. [Relative atomic masses: N = 14, H = 1, O = 16]
A. 35.0%
B. 17.5%
C. 28.0%
D. 42.0%

4. Elements in the same group of the Periodic Table have the same number of:
A. Valence electrons
B. Electron shells
C. Protons
D. Neutrons

5. The gas produced when dilute hydrochloric acid reacts with calcium trioxocarbonate (IV) is:
A. Carbon (IV) oxide
B. Hydrogen gas
C. Oxygen gas
D. Chlorine gas

SECTION B: PHYSICS
6. A car accelerates uniformly from rest at 2 m/s^2 for 10 seconds. Calculate the total distance covered.
A. 100 meters
B. 200 meters
C. 50 meters
D. 20 meters

7. The work done when a force of 50 N moves a block across a horizontal distance of 6 meters is:
A. 300 Joules
B. 300 Watts
C. 250 Joules
D. 44 Joules

8. A transformer has 500 turns on its primary coil and 100 turns on its secondary coil. If the primary voltage is 240 V, what is the secondary voltage?
A. 48 V
B. 1200 V
C. 24 V
D. 120 V

9. Which electromagnetic radiation has the highest frequency and penetrating power?
A. Gamma rays
B. X-rays
C. Ultraviolet rays
D. Radio waves

10. The property of a body to resist changes in its state of rest or uniform motion in a straight line is called:
A. Inertia
B. Momentum
C. Acceleration
D. Friction`
  }
];

export const AdminAiPdfToCbtModal: React.FC<AdminAiPdfToCbtModalProps> = ({
  isOpen,
  onClose,
  onExamCreated,
  onNavigateToExam,
  onAddStudyTask,
  initialClass = 'SS2',
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

  // Exam parameters
  const [targetClass, setTargetClass] = useState<string>(initialClass);
  const [subject, setSubject] = useState<string>('Mathematics');
  const [examStream, setExamStream] = useState<'science' | 'art' | 'general'>('science');
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedExam, setGeneratedExam] = useState<CBTExam | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(1);
  const [adminFontSize, setAdminFontSize] = useState<'compact' | 'normal'>('compact');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  // STRICT SECURITY CHECK: Students cannot add CBT exams, only admin can add
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
            Only School Admin Can Add CBT Exams
          </h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Students are not permitted to add, upload, or create CBT examination papers. Only administrators have permission to compile and publish Computer-Based Tests. You can practice with published exams in the CBT Examination Hall.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onNavigateToExam) {
                  onNavigateToExam('ss2-math-2026');
                }
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#081a3d] hover:bg-[#122e66] text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Go to CBT Examination Hall</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSelectedFile(file);
    setFileName(file.name);

    // Auto-detect subject from file name
    const lowerName = file.name.toLowerCase();
    if (lowerName.includes('math')) setSubject('Mathematics');
    else if (lowerName.includes('eng')) setSubject('English Language');
    else if (lowerName.includes('chem')) setSubject('Chemistry');
    else if (lowerName.includes('phys')) setSubject('Physics');
    else if (lowerName.includes('bio')) setSubject('Biology');
    else if (lowerName.includes('lit')) setSubject('Literature & Government');
    else if (lowerName.includes('gov')) setSubject('Government');
    else if (lowerName.includes('econ')) setSubject('Economics');

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.readAsDataURL(file);

    // If it's a text-based file, read text as well
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const textReader = new FileReader();
      textReader.onload = () => {
        setExtractedText(textReader.result as string);
      };
      textReader.readAsText(file);
    }
  };

  // Select sample document
  const handleSelectSample = (sample: typeof SAMPLE_DOCUMENTS[0]) => {
    setSelectedFile(null);
    setFileBase64(null);
    setFileName(sample.name);
    setSubject(sample.subject);
    setTargetClass(sample.studentClass);
    if ((sample as any).stream) {
      setExamStream((sample as any).stream);
    }
    setExtractedText(sample.sampleText);
    setError(null);
    playSuccessSound();
  };

  // Trigger Gemini API conversion
  const handleGenerateExam = async () => {
    if (!isAdmin) {
      setError('Students are not authorized to add or generate CBT exams. Only administrators have this privilege.');
      return;
    }

    if (!fileBase64 && !extractedText) {
      setError('Please upload a PDF document or select one of the verified sample past question papers.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationStep('Reading and analyzing document contents...');

    try {
      setTimeout(() => setGenerationStep('Parsing past questions, topics and syllabus benchmarks...'), 1200);
      setTimeout(() => setGenerationStep('Synthesizing 4-option multiple choice questions & marking scheme...'), 2800);
      setTimeout(() => setGenerationStep('Formatting official 30-minute CBT Mock Exam...'), 4500);

      const response = await fetch('/api/ai/convert-pdf-to-cbt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64: fileBase64,
          fileName: fileName || 'Uploaded_Document.pdf',
          textContent: extractedText,
          subject,
          studentClass: targetClass,
          targetQuestionCount: questionCount,
          durationMinutes
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate CBT Exam from document.');
      }

      setGeneratedExam(data.exam);
      setIsSaved(false);
      playSuccessSound();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI service. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save exam to CBT registry
  const handleSaveToCbt = () => {
    if (!isAdmin) {
      setError('Students are not authorized to add CBT exams. Only administrators can save or publish exams.');
      return;
    }
    if (!generatedExam) return;
    const examToSave: CBTExam = {
      ...generatedExam,
      stream: examStream
    };
    saveCustomCBTExam(examToSave);
    setIsSaved(true);
    playSuccessSound();

    if (onExamCreated) {
      onExamCreated(examToSave);
    }

    // Optional: add to daily planner as task
    if (onAddStudyTask) {
      onAddStudyTask({
        title: `CBT Exam Practice: ${generatedExam.title}`,
        category: generatedExam.subject.includes('Math') ? 'Mathematics' : 'Assignment',
        time: '5:00 PM',
        priority: 'high'
      });
    }
  };

  // Launch directly into CBT Exam Hall
  const handleLaunchInExamHall = () => {
    if (!generatedExam) return;
    if (!isAdmin) {
      setError('Students are not authorized to create CBT exams.');
      return;
    }
    if (!isSaved) {
      saveCustomCBTExam(generatedExam);
    }
    try {
      sessionStorage.setItem('echo_plan_active_cbt_exam', generatedExam.id);
      sessionStorage.setItem('echo_plan_active_class_tab', 'mock_exam');
    } catch {
      // ignore
    }
    if (onNavigateToExam) {
      onNavigateToExam(generatedExam.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-scale-in overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-7 bg-[#071a3d] text-white flex items-start justify-between relative overflow-hidden">
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: 'radial-gradient(circle at 85% 20%, #62c5fa, transparent 50%), linear-gradient(115deg, #071a3d, #0b2b62 60%, #164b91)'
            }}
          />

          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-[#a5b4fc] text-xs font-black uppercase tracking-wider border border-indigo-400/30">
              <Sparkles size={14} className="text-[#62c5fa]" />
              <span>AI Daily Plan Assessment Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>PDF-to-CBT Exam Converter</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-[#071a3d] text-[10px] font-black uppercase">
                Gemini Powered
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#c8daf3] max-w-2xl leading-relaxed">
              Upload past question PDFs, textbook chapters, or syllabus notes. The AI parses the text and automatically compiles an official timed Computer-Based Test (CBT) mock exam for Nigerian secondary students.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="relative z-10 p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* If an exam has already been generated */}
          {generatedExam ? (
            <div className="space-y-6 animate-fade-in">
              
              {/* Exam Success Banner */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider border border-emerald-300">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>CBT Exam Successfully Generated!</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#081a3d]">
                    {generatedExam.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-semibold">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">
                      📚 Subject: <strong className="text-slate-900">{generatedExam.subject}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">
                      🏫 Target Class: <strong className="text-indigo-600">{generatedExam.studentClass}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">
                      ⏱ Duration: <strong className="text-slate-900">{generatedExam.durationMinutes} Minutes</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                      ✓ {generatedExam.questions.length} Questions Created
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setGeneratedExam(null);
                      setIsSaved(false);
                    }}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw size={14} />
                    <span>Upload Another</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLaunchInExamHall}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <Award size={16} />
                    <span>Take Exam in CBT Hall Now</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              {/* Questions List Preview */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-indigo-600" />
                    <h4 className="text-sm font-black text-[#081a3d] uppercase tracking-wider">
                      Generated Questions Preview & Marking Scheme ({generatedExam.questions.length})
                    </h4>
                  </div>
                  
                  {/* Font Size Adjuster for Admin */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                    <span className="text-[10px] font-black uppercase text-slate-500 px-1">Display Size:</span>
                    <button
                      type="button"
                      onClick={() => setAdminFontSize('compact')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminFontSize === 'compact' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      A- Compact (Admin)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminFontSize('normal')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminFontSize === 'normal' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      A Normal
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {generatedExam.questions.map((q, idx) => {
                    const isExpanded = expandedQuestionId === q.id;
                    return (
                      <div 
                        key={q.id || idx}
                        className={`rounded-2xl border transition-all ${
                          adminFontSize === 'compact' ? 'p-3' : 'p-4'
                        } ${
                          isExpanded ? 'bg-white border-indigo-300 shadow-sm' : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div 
                          onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          className="flex items-start justify-between gap-3 cursor-pointer"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className={`${
                              adminFontSize === 'compact' ? 'w-6 h-6 text-[11px]' : 'w-7 h-7 text-xs'
                            } rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center shrink-0`}>
                              {q.questionNumber || idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                  {q.sectionTitle || 'Section'}
                                </span>
                                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  Correct Key: Option {q.correctAnswer}
                                </span>
                              </div>
                              <p className={`font-bold text-[#081a3d] leading-snug ${
                                adminFontSize === 'compact' ? 'text-xs' : 'text-sm'
                              }`}>
                                {q.questionText}
                              </p>
                            </div>
                          </div>

                          <div className="text-slate-400 pt-1 shrink-0">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 animate-fade-in pl-10">
                            {q.passage && (
                              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs italic text-slate-700 font-serif">
                                "{q.passage}"
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {(['A', 'B', 'C', 'D'] as const).map(letter => {
                                const isCorrect = q.correctAnswer === letter;
                                return (
                                  <div 
                                    key={letter}
                                    className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                                      isCorrect 
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold' 
                                        : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <span className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center ${
                                      isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                                    }`}>
                                      {letter}
                                    </span>
                                    <span>{q.options[letter]}</span>
                                    {isCorrect && <span className="ml-auto text-[10px] text-emerald-700 font-black">✓ Correct</span>}
                                  </div>
                                );
                              })}
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                              <span className="font-black text-[#081a3d] flex items-center gap-1">
                                💡 Marking Scheme Explanation:
                              </span>
                              <p className="text-slate-600 leading-relaxed">
                                {q.explanation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* Upload / Configuration Screen */
            <div className="space-y-6">
              
              {/* Tab Selector: Upload Custom PDF vs Pre-loaded Sample Past Papers */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-md">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'upload' 
                      ? 'bg-white text-[#081a3d] shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload size={14} />
                  <span>Upload Your PDF File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sample')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'sample' 
                      ? 'bg-white text-[#081a3d] shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Award size={14} className="text-amber-500" />
                  <span>Choose Sample Past Paper</span>
                </button>
              </div>

              {/* VIEW A: UPLOAD CUSTOM PDF */}
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl p-8 text-center transition-all bg-slate-50/50 hover:bg-indigo-50/30 group">
                    <input
                      type="file"
                      id="ai-pdf-file-input"
                      accept=".pdf,.txt,.docx,.doc"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="ai-pdf-file-input" 
                      className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
                        <Upload size={26} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-[#081a3d]">
                          {fileName ? fileName : 'Click to select or drag and drop a PDF file here'}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Supports WAEC/NECO Past Questions, Lesson Notes, Textbook Chapters (.pdf, .txt)
                        </p>
                      </div>
                      <span className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700 transition-colors">
                        Browse Files on Device
                      </span>
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between text-xs text-indigo-950">
                      <div className="flex items-center gap-2.5">
                        <FileText size={18} className="text-indigo-600" />
                        <div>
                          <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </div>
                      </div>
                      <span className="text-emerald-700 font-black flex items-center gap-1">
                        <Check size={14} /> Ready for AI
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW B: CHOOSE SAMPLE HIGH SCHOOL PAPERS */}
              {activeTab === 'sample' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Click any model past question set to test immediately:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {SAMPLE_DOCUMENTS.map((sample) => {
                      const isChosen = fileName === sample.name;
                      return (
                        <div
                          key={sample.id}
                          onClick={() => handleSelectSample(sample)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            isChosen 
                              ? 'bg-indigo-50/80 border-indigo-600 shadow-sm ring-2 ring-indigo-200' 
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase">
                                {sample.studentClass} • {sample.subject}
                              </span>
                              {isChosen && <Check size={14} className="text-indigo-600" />}
                            </div>
                            <h4 className="text-xs sm:text-sm font-black text-[#081a3d] line-clamp-1 mb-1">
                              {sample.name.replace('.pdf', '')}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {sample.description}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">10 Curriculum Questions</span>
                            <span className={`font-bold ${isChosen ? 'text-indigo-600' : 'text-slate-600'}`}>
                              {isChosen ? 'Selected ✓' : 'Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Exam Options Matrix */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="text-xs font-black uppercase tracking-wider text-[#081a3d] flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-indigo-600" />
                  <span>Configure CBT Exam Options</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Target Class */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Student Class
                    </label>
                    <select
                      value={targetClass}
                      onChange={(e) => setTargetClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="SS3">Class SS3 (WAEC & JAMB Final)</option>
                      <option value="SS2">Class SS2 (Senior Secondary 2)</option>
                      <option value="SS1">Class SS1 (Senior Secondary 1)</option>
                      <option value="JSS3">Class JSS3 (Junior BECE Exam)</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Academic Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Mathematics, English, Biology"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Student Stream Assignment */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Student Stream Assignment
                    </label>
                    <select
                      value={examStream}
                      onChange={(e) => setExamStream(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="science">🔬 Science Stream (For Science Students)</option>
                      <option value="art">🎨 Art Stream (For Art Students)</option>
                      <option value="general">🌐 General (All Students Can Write)</option>
                    </select>
                  </div>

                  {/* Number of Questions */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Number of Questions
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={10}>10 Questions (Quick Quiz)</option>
                      <option value={20}>20 Questions (Standard Mock)</option>
                      <option value={30}>30 Questions (Full Paper)</option>
                      <option value={50}>50 Questions (Comprehensive WAEC Arena)</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Timer Duration
                    </label>
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={20}>20 Minutes</option>
                      <option value={30}>30 Minutes (Standard Exam)</option>
                      <option value={45}>45 Minutes (Extended Speed)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fade-in">
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Conversion Error:</strong> {error}
                  </div>
                </div>
              )}

              {/* Action Button & Loading Status */}
              <div className="pt-2">
                {isGenerating ? (
                  <div className="p-6 rounded-3xl bg-slate-900 text-white text-center space-y-3 shadow-lg">
                    <Loader2 size={32} className="mx-auto text-[#62c5fa] animate-spin" />
                    <div className="text-base font-extrabold tracking-wide">
                      Gemini AI Is Transforming Document into CBT Exam...
                    </div>
                    <div className="text-xs text-[#a5b4fc] animate-pulse">
                      {generationStep || 'Analyzing curriculum standards...'}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateExam}
                    disabled={!fileName}
                    className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg active:scale-95 ${
                      fileName
                        ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-600/25'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles size={18} />
                    <span>Generate Official CBT Mock Exam with Gemini AI</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>WAEC / NECO / JAMB Senior Secondary Syllabus Aligned</span>
          </div>

          <div className="flex items-center gap-2">
            {generatedExam && !isSaved && (
              <button
                type="button"
                onClick={handleSaveToCbt}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                Save Exam to Registry
              </button>
            )}

            {isSaved && (
              <span className="text-emerald-700 font-bold px-3 py-1 bg-emerald-100 rounded-lg">
                ✓ Saved to CBT Arena
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
