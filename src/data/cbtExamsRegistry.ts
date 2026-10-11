import { ExamQuestion, SS2_ENGLISH_MOCK_QUESTIONS } from './mockExamData';
import { SS2_MATHEMATICS_MOCK_QUESTIONS } from './mathMockExamData';
import { SS2_ART_MOCK_QUESTIONS } from './artMockExamData';
import { SS2_SCIENCE_MOCK_QUESTIONS } from './scienceMockExamData';
import { SS1_MATHEMATICS_CBT_QUESTIONS } from './ss1MathematicsExamData';
import { 
  CHEMISTRY_CBT_QUESTIONS, 
  BIOLOGY_CBT_QUESTIONS, 
  PHYSICS_CBT_QUESTIONS, 
  CIVIC_EDUCATION_CBT_QUESTIONS 
} from './scienceSubjectExamsData';

export interface CBTExam {
  id: string;
  title: string;
  subject: string;
  studentClass: string; // e.g. 'SS1', 'SS2', 'SS3', 'JSS3'
  stream?: 'science' | 'art' | 'general';
  durationMinutes: number; // Default 30 minutes
  description: string;
  badgeColor: string;
  questions: ExamQuestion[];
  isCustom?: boolean;
  createdAt?: string;
  createdBy?: string;
}

export const DEFAULT_CBT_EXAMS: CBTExam[] = [
  // ==========================================
  // SCIENCE EXAMS (For Science Students)
  // Math, Science Course, Chemistry, Biology, Physics, Civic, etc.
  // ==========================================
  {
    id: 'ss1-math-cbt-2026',
    title: 'SS1 Mathematics CBT Examination (Official Syllabus Paper)',
    subject: 'Mathematics',
    studentClass: 'SS1',
    stream: 'science',
    durationMinutes: 30,
    description: 'Turned from official SS1_Mathematics_Exam.pdf. Comprehensive 50-question CBT exam testing Number Bases, Modular Arithmetic, Indices, Logarithms, Sets, Algebra, Quadratic Equations, Geometry, Trigonometry, Mensuration, Statistics and Probability.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    questions: SS1_MATHEMATICS_CBT_QUESTIONS
  },
  {
    id: 'ss2-math-2026',
    title: 'SS2 Science Mathematics — Advanced 2026 Mock',
    subject: 'Mathematics',
    studentClass: 'SS2',
    stream: 'science',
    durationMinutes: 30,
    description: 'Advanced Mock & Past-Question-Style Practice for Science Students. 50 authentic WAEC/NECO questions spanning quadratic equations, progressions, logarithms, indices, circle geometry, trigonometry, and probability.',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    questions: SS2_MATHEMATICS_MOCK_QUESTIONS
  },
  {
    id: 'ss2-science-core-2026',
    title: 'SS2 Science Course (Integrated Pure & Applied Sciences)',
    subject: 'Science Course',
    studentClass: 'SS2',
    stream: 'science',
    durationMinutes: 30,
    description: 'Strict 30-minute integrated science exam covering 50 authentic WAEC/NECO questions: Mechanics, Light & Electricity, Organic Chemistry, Chemical Bonding, Cell Biology, Genetics, Photosynthesis & Ecology.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    questions: SS2_SCIENCE_MOCK_QUESTIONS
  },
  {
    id: 'ss2-chemistry-core-2026',
    title: 'SS2 Chemistry CBT Examination — Senior Theory & Practicals',
    subject: 'Chemistry',
    studentClass: 'SS2',
    stream: 'science',
    durationMinutes: 30,
    description: 'Official 25-question Chemistry CBT paper: Periodic Trends, Stoichiometry, Mole Concept, Gas Laws, Acids/Bases/Salts, Redox, Electrolysis, Organic Hydrocarbons, and Qualitative Analysis.',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    questions: CHEMISTRY_CBT_QUESTIONS
  },
  {
    id: 'ss2-biology-core-2026',
    title: 'SS2 Biology CBT Examination — Living Systems & Ecology',
    subject: 'Biology',
    studentClass: 'SS2',
    stream: 'science',
    durationMinutes: 30,
    description: 'Comprehensive 25-question Biology CBT paper: Cell Biology, Microorganisms, Genetics, Photosynthesis, Plant & Animal Nutrition, Excretion, Human Physiology, Hormones, and Ecological Pyramids.',
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
    questions: BIOLOGY_CBT_QUESTIONS
  },
  {
    id: 'ss2-physics-core-2026',
    title: 'SS2 Physics CBT Examination — Mechanics, Optics & Fields',
    subject: 'Physics',
    studentClass: 'SS2',
    stream: 'science',
    durationMinutes: 30,
    description: 'Rigorous 25-question Physics CBT paper: SI Units, Equations of Motion, Newton\'s Laws, Work-Energy-Power, Wave Optics, Current Electricity, Electromagnetic Induction, and Modern Physics.',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    questions: PHYSICS_CBT_QUESTIONS
  },
  {
    id: 'ss2-civic-science-2026',
    title: 'SS2 Civic Education — National Values & Citizenship CBT Exam',
    subject: 'Civic',
    studentClass: 'SS2',
    stream: 'science',
    durationMinutes: 30,
    description: 'Essential 20-question Civic Education CBT paper: Values, Citizenship, Fundamental Human Rights (1999 Constitution), Rule of Law, Electoral Process, Good Governance, and Anti-Corruption Agencies.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    questions: CIVIC_EDUCATION_CBT_QUESTIONS
  },
  {
    id: 'ss2-science-english-2026',
    title: 'SS2 Science English Language CBT Exam — Lexis, Structure & Technical Comprehension',
    subject: 'English',
    studentClass: 'SS2',
    stream: 'science',
    durationMinutes: 30,
    description: 'Core English Language CBT Examination for Science Students. 50 authentic WAEC/JAMB format questions: Scientific Reading Comprehension, Lexis & Structure, Sentence Completion, Idiomatic Usage, Synonyms & Antonyms, and Oral English Stress Patterns.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    questions: SS2_ENGLISH_MOCK_QUESTIONS
  },
  {
    id: 'ss1-science-english-2026',
    title: 'SS1 Science English Language CBT Exam — Grammar & Composition Essentials',
    subject: 'English',
    studentClass: 'SS1',
    stream: 'science',
    durationMinutes: 30,
    description: 'Comprehensive foundational English paper for SS1 Science Class. Testing Lexis & Structure, Parts of Speech, Clauses, and Oral English Vowels & Consonants.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    questions: SS2_ENGLISH_MOCK_QUESTIONS
  },
  {
    id: 'ss3-science-english-2026',
    title: 'SS3 Science English Language CBT Exam — WAEC/JAMB Final Distinction Mock',
    subject: 'English',
    studentClass: 'SS3',
    stream: 'science',
    durationMinutes: 30,
    description: 'Exit examination for SS3 Science candidates preparing for WAEC, NECO, and UTME examinations. 50 rigorous questions covering high-level lexis, idioms, and reading analysis.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    questions: SS2_ENGLISH_MOCK_QUESTIONS
  },

  // ==========================================
  // ART EXAMS (For Art Students)
  // Literature, Math, English, and the rest CBT exams
  // ==========================================
  {
    id: 'ss2-art-gov-lit-2026',
    title: 'SS2 Literature-in-English & Government — Official Art Mock',
    subject: 'Literature',
    studentClass: 'SS2',
    stream: 'art',
    durationMinutes: 30,
    description: 'Strict 30-minute exam covering 50 curriculum questions: Literary Devices, Dramatic Theory, African Poetry, Sovereignty, Separation of Powers, Nigerian Pre-colonial & Constitutional History, Civics, and Social Philosophy.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    questions: SS2_ART_MOCK_QUESTIONS
  },
  {
    id: 'ss1-math-art-2026',
    title: 'SS1 General Mathematics CBT Exam (For Arts & Humanities)',
    subject: 'Math',
    studentClass: 'SS1',
    stream: 'art',
    durationMinutes: 30,
    description: 'Turned from official SS1_Mathematics_Exam.pdf. Tailored 50-question general mathematics exam for art and social science students: arithmetic, percentages, modular arithmetic, algebra, statistics, and probability.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    questions: SS1_MATHEMATICS_CBT_QUESTIONS
  },
  {
    id: 'ss2-art-english-lit-2026',
    title: 'SS2 English Language & Grammar Arts — Official 2026 Mock',
    subject: 'English',
    studentClass: 'SS2',
    stream: 'art',
    durationMinutes: 30,
    description: 'Strict 30-minute exam for Art students covering 50 curriculum questions: Lexis & Structure, Figures of Speech, Literary Analysis, Comprehension, Concord, and Rhetoric.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    questions: SS2_ENGLISH_MOCK_QUESTIONS
  },
  {
    id: 'ss1-art-english-2026',
    title: 'SS1 Arts English Language & Literature CBT Examination',
    subject: 'English',
    studentClass: 'SS1',
    stream: 'art',
    durationMinutes: 30,
    description: 'SS1 Arts syllabus English CBT paper: Literary devices, prose comprehension, basic rhetoric, grammatical concord, and lexis.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    questions: SS2_ENGLISH_MOCK_QUESTIONS
  },
  {
    id: 'ss3-art-english-2026',
    title: 'SS3 Arts English Language & Advanced Literature Final Mock',
    subject: 'English',
    studentClass: 'SS3',
    stream: 'art',
    durationMinutes: 30,
    description: 'SS3 Final graduation CBT mock for Arts students: Advanced literary analysis, poetry appreciation, complex vocabulary, and WAEC/JAMB format question bank.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    questions: SS2_ENGLISH_MOCK_QUESTIONS
  },
  {
    id: 'ss2-art-civic-2026',
    title: 'SS2 Civic Education & Social Studies — Art Stream CBT Paper',
    subject: 'Civic',
    studentClass: 'SS2',
    stream: 'art',
    durationMinutes: 30,
    description: 'Constitutional law, democratic institutions, human rights, civic responsibilities, and public leadership CBT examination for arts and humanities students.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    questions: CIVIC_EDUCATION_CBT_QUESTIONS
  },

  // ==========================================
  // JUNIOR SECONDARY CBT EXAMS (JSS1, JSS2, JSS3)
  // For Admin to carry out CBT exams across other classes
  // ==========================================
  {
    id: 'jss3-english-bece-2026',
    title: 'JSS3 English Language & Literature (BECE / Junior WAEC Mock Exam)',
    subject: 'English',
    studentClass: 'JSS3',
    stream: 'general',
    durationMinutes: 30,
    description: 'National Junior Certificate BECE Examination mock paper: Reading comprehension passages, grammar, tense agreements, nouns, adjectives, figures of speech, and oral phonetics.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    questions: SS2_ENGLISH_MOCK_QUESTIONS
  },
  {
    id: 'jss2-english-cbt-2026',
    title: 'JSS2 English Language & Composition CBT Examination',
    subject: 'English',
    studentClass: 'JSS2',
    stream: 'general',
    durationMinutes: 30,
    description: 'Intermediate Junior Secondary English paper: Direct and indirect speech, active/passive voice, punctuation rules, vocabulary development, and guided reading comprehension.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    questions: SS2_ENGLISH_MOCK_QUESTIONS
  },
  {
    id: 'jss1-english-cbt-2026',
    title: 'JSS1 English Language Foundations & Grammar CBT Examination',
    subject: 'English',
    studentClass: 'JSS1',
    stream: 'general',
    durationMinutes: 30,
    description: 'Foundational Junior Secondary English exam: Parts of speech (nouns, pronouns, verbs, adverbs, prepositions), spelling mastery, simple reading comprehension, and vowel sounds.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    questions: SS2_ENGLISH_MOCK_QUESTIONS
  }
];

const CUSTOM_EXAMS_STORAGE_KEY = 'echo_plan_custom_cbt_exams';
const DELETED_EXAMS_STORAGE_KEY = 'echo_plan_deleted_cbt_exams';

export const getStoredCBTExams = (): CBTExam[] => {
  try {
    const deletedRaw = localStorage.getItem(DELETED_EXAMS_STORAGE_KEY);
    const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    const saved = localStorage.getItem(CUSTOM_EXAMS_STORAGE_KEY);
    const customList: CBTExam[] = saved ? JSON.parse(saved) : [];

    const combined = [...DEFAULT_CBT_EXAMS, ...(Array.isArray(customList) ? customList : [])];
    const seen = new Set<string>();
    const result: CBTExam[] = [];

    for (const ex of combined) {
      if (!deletedIds.includes(ex.id) && !seen.has(ex.id)) {
        seen.add(ex.id);
        result.push(ex);
      }
    }
    return result;
  } catch {
    // fallback
  }
  return DEFAULT_CBT_EXAMS;
};

export const saveCustomCBTExam = (exam: CBTExam): CBTExam[] => {
  try {
    const deletedRaw = localStorage.getItem(DELETED_EXAMS_STORAGE_KEY);
    if (deletedRaw) {
      const deletedIds: string[] = JSON.parse(deletedRaw);
      const filtered = deletedIds.filter(id => id !== exam.id);
      localStorage.setItem(DELETED_EXAMS_STORAGE_KEY, JSON.stringify(filtered));
    }

    const saved = localStorage.getItem(CUSTOM_EXAMS_STORAGE_KEY);
    const existing: CBTExam[] = saved ? JSON.parse(saved) : [];
    const index = existing.findIndex(e => e.id === exam.id);
    let updated: CBTExam[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = exam;
    } else {
      updated = [exam, ...existing];
    }
    localStorage.setItem(CUSTOM_EXAMS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return getStoredCBTExams();
  } catch {
    return DEFAULT_CBT_EXAMS;
  }
};

export const deleteCustomCBTExam = (examId: string): CBTExam[] => {
  return deleteCBTExam(examId);
};

export const deleteCBTExam = (examId: string): CBTExam[] => {
  try {
    const saved = localStorage.getItem(CUSTOM_EXAMS_STORAGE_KEY);
    const existing: CBTExam[] = saved ? JSON.parse(saved) : [];
    const updated = existing.filter(e => e.id !== examId);
    localStorage.setItem(CUSTOM_EXAMS_STORAGE_KEY, JSON.stringify(updated));

    const deletedRaw = localStorage.getItem(DELETED_EXAMS_STORAGE_KEY);
    const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (!deletedIds.includes(examId)) {
      deletedIds.push(examId);
      localStorage.setItem(DELETED_EXAMS_STORAGE_KEY, JSON.stringify(deletedIds));
    }
    window.dispatchEvent(new Event('storage'));
    return getStoredCBTExams();
  } catch {
    return DEFAULT_CBT_EXAMS;
  }
};

export const restoreDefaultCBTExams = (): CBTExam[] => {
  try {
    localStorage.removeItem(DELETED_EXAMS_STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
    return getStoredCBTExams();
  } catch {
    return DEFAULT_CBT_EXAMS;
  }
};

/**
 * Filters CBT examination papers based on student department (Science vs Art)
 * Science students write Science CBT exams (Math, Science Course, Chemistry, Biology, Physics, Civic, etc.)
 * Art students write Art CBT exams (Literature, Math, English, Civic, etc.)
 * Admin sees all papers with stream filters.
 */
export const getCBTExamsForStream = (
  stream: 'science' | 'art' | 'general' = 'science',
  isAdmin: boolean = false
): CBTExam[] => {
  const all = getStoredCBTExams();
  if (isAdmin) return all;
  if (stream === 'science') {
    const scienceList = all.filter(e => e.stream === 'science' || e.stream === 'general');
    return scienceList.length > 0 ? scienceList : DEFAULT_CBT_EXAMS.filter(e => e.stream === 'science' || e.stream === 'general');
  }
  if (stream === 'art') {
    const artList = all.filter(e => e.stream === 'art' || e.stream === 'general');
    return artList.length > 0 ? artList : DEFAULT_CBT_EXAMS.filter(e => e.stream === 'art' || e.stream === 'general');
  }
  return all;
};
