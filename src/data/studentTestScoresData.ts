import { StudentTestScoreRecord, RegisteredStudentItem } from '../types';
import { ExamSubmissionRecord } from './mockExamData';

export const INITIAL_STUDENT_TEST_SCORES: StudentTestScoreRecord[] = [
  // Chidubem Okafor (SS3)
  {
    id: 'score-1',
    studentId: 'reg-std-1',
    studentName: 'Chidubem Okafor',
    studentClass: 'SS3',
    subject: 'Mathematics',
    score: 88,
    grade: 'A1',
    date: 'Sep 20, 2026',
    testType: 'CBT Mock Exam'
  },
  {
    id: 'score-2',
    studentId: 'reg-std-1',
    studentName: 'Chidubem Okafor',
    studentClass: 'SS3',
    subject: 'English Language',
    score: 82,
    grade: 'A1',
    date: 'Sep 21, 2026',
    testType: 'Term Examination'
  },
  {
    id: 'score-3',
    studentId: 'reg-std-1',
    studentName: 'Chidubem Okafor',
    studentClass: 'SS3',
    subject: 'Physics',
    score: 85,
    grade: 'A1',
    date: 'Sep 22, 2026',
    testType: 'Midterm Assessment'
  },

  // Amina Bello (SS3)
  {
    id: 'score-4',
    studentId: 'reg-std-2',
    studentName: 'Amina Bello',
    studentClass: 'SS3',
    subject: 'English Language',
    score: 92,
    grade: 'A1',
    date: 'Sep 19, 2026',
    testType: 'CBT Mock Exam'
  },
  {
    id: 'score-5',
    studentId: 'reg-std-2',
    studentName: 'Amina Bello',
    studentClass: 'SS3',
    subject: 'Government',
    score: 90,
    grade: 'A1',
    date: 'Sep 21, 2026',
    testType: 'Midterm Assessment'
  },
  {
    id: 'score-6',
    studentId: 'reg-std-2',
    studentName: 'Amina Bello',
    studentClass: 'SS3',
    subject: 'Literature in English',
    score: 86,
    grade: 'A1',
    date: 'Sep 23, 2026',
    testType: 'CBT Mock Exam'
  },

  // Babajide Adeyemi (SS2)
  {
    id: 'score-7',
    studentId: 'reg-std-3',
    studentName: 'Babajide Adeyemi',
    studentClass: 'SS2',
    subject: 'Mathematics',
    score: 64,
    grade: 'C4',
    date: 'Sep 20, 2026',
    testType: 'CBT Mock Exam'
  },
  {
    id: 'score-8',
    studentId: 'reg-std-3',
    studentName: 'Babajide Adeyemi',
    studentClass: 'SS2',
    subject: 'English Language',
    score: 70,
    grade: 'B2',
    date: 'Sep 22, 2026',
    testType: 'Midterm Assessment'
  },
  {
    id: 'score-9',
    studentId: 'reg-std-3',
    studentName: 'Babajide Adeyemi',
    studentClass: 'SS2',
    subject: 'Chemistry',
    score: 68,
    grade: 'B3',
    date: 'Sep 24, 2026',
    testType: 'Class Quiz'
  },

  // Ngozi Eze (SS2)
  {
    id: 'score-10',
    studentId: 'reg-std-4',
    studentName: 'Ngozi Eze',
    studentClass: 'SS2',
    subject: 'Biology',
    score: 78,
    grade: 'A1',
    date: 'Sep 20, 2026',
    testType: 'CBT Mock Exam'
  },
  {
    id: 'score-11',
    studentId: 'reg-std-4',
    studentName: 'Ngozi Eze',
    studentClass: 'SS2',
    subject: 'English Language',
    score: 82,
    grade: 'A1',
    date: 'Sep 22, 2026',
    testType: 'Midterm Assessment'
  },
  {
    id: 'score-12',
    studentId: 'reg-std-4',
    studentName: 'Ngozi Eze',
    studentClass: 'SS2',
    subject: 'Mathematics',
    score: 76,
    grade: 'A1',
    date: 'Sep 24, 2026',
    testType: 'CBT Mock Exam'
  },

  // Kelechi Nwosu (SS1)
  {
    id: 'score-13',
    studentId: 'reg-std-5',
    studentName: 'Kelechi Nwosu',
    studentClass: 'SS1',
    subject: 'Basic Technology',
    score: 58,
    grade: 'C5',
    date: 'Sep 20, 2026',
    testType: 'CBT Mock Exam'
  },
  {
    id: 'score-14',
    studentId: 'reg-std-5',
    studentName: 'Kelechi Nwosu',
    studentClass: 'SS1',
    subject: 'Mathematics',
    score: 62,
    grade: 'C4',
    date: 'Sep 22, 2026',
    testType: 'Midterm Assessment'
  },
  {
    id: 'score-15',
    studentId: 'reg-std-5',
    studentName: 'Kelechi Nwosu',
    studentClass: 'SS1',
    subject: 'English Language',
    score: 54,
    grade: 'C5',
    date: 'Sep 23, 2026',
    testType: 'Class Quiz'
  },

  // Fatima Danjuma (JSS3)
  {
    id: 'score-16',
    studentId: 'reg-std-6',
    studentName: 'Fatima Danjuma',
    studentClass: 'JSS3',
    subject: 'Basic Science',
    score: 74,
    grade: 'B2',
    date: 'Sep 21, 2026',
    testType: 'CBT Mock Exam'
  },
  {
    id: 'score-17',
    studentId: 'reg-std-6',
    studentName: 'Fatima Danjuma',
    studentClass: 'JSS3',
    subject: 'English Language',
    score: 76,
    grade: 'A1',
    date: 'Sep 23, 2026',
    testType: 'Midterm Assessment'
  },
  {
    id: 'score-18',
    studentId: 'reg-std-6',
    studentName: 'Fatima Danjuma',
    studentClass: 'JSS3',
    subject: 'Mathematics',
    score: 72,
    grade: 'B2',
    date: 'Sep 24, 2026',
    testType: 'Class Quiz'
  },

  // Olumide Fashola (JSS2)
  {
    id: 'score-19',
    studentId: 'reg-std-7',
    studentName: 'Olumide Fashola',
    studentClass: 'JSS2',
    subject: 'Mathematics',
    score: 48,
    grade: 'D7',
    date: 'Sep 21, 2026',
    testType: 'CBT Mock Exam'
  },
  {
    id: 'score-20',
    studentId: 'reg-std-7',
    studentName: 'Olumide Fashola',
    studentClass: 'JSS2',
    subject: 'English Language',
    score: 52,
    grade: 'C6',
    date: 'Sep 23, 2026',
    testType: 'Midterm Assessment'
  },
  {
    id: 'score-21',
    studentId: 'reg-std-7',
    studentName: 'Olumide Fashola',
    studentClass: 'JSS2',
    subject: 'Social Studies',
    score: 46,
    grade: 'D7',
    date: 'Sep 24, 2026',
    testType: 'Class Quiz'
  },

  // Zainab Abubakar (JSS1)
  {
    id: 'score-22',
    studentId: 'reg-std-8',
    studentName: 'Zainab Abubakar',
    studentClass: 'JSS1',
    subject: 'Basic Science',
    score: 80,
    grade: 'A1',
    date: 'Sep 21, 2026',
    testType: 'CBT Mock Exam'
  },
  {
    id: 'score-23',
    studentId: 'reg-std-8',
    studentName: 'Zainab Abubakar',
    studentClass: 'JSS1',
    subject: 'English Language',
    score: 84,
    grade: 'A1',
    date: 'Sep 23, 2026',
    testType: 'Midterm Assessment'
  },
  {
    id: 'score-24',
    studentId: 'reg-std-8',
    studentName: 'Zainab Abubakar',
    studentClass: 'JSS1',
    subject: 'Mathematics',
    score: 78,
    grade: 'A1',
    date: 'Sep 24, 2026',
    testType: 'Class Quiz'
  }
];

const SCORES_STORAGE_KEY = 'echo_plan_student_test_scores';

/**
 * Loads stored student test scores and combines with any live CBT exam submissions
 */
export const getAllStudentScores = (): StudentTestScoreRecord[] => {
  let baseScores: StudentTestScoreRecord[] = INITIAL_STUDENT_TEST_SCORES;
  try {
    const saved = localStorage.getItem(SCORES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        baseScores = parsed;
      }
    }
  } catch {
    // fallback to initial
  }

  // Also include CBT mock exam results from echo_plan_exam_results
  try {
    const cbtResults = localStorage.getItem('echo_plan_exam_results');
    if (cbtResults) {
      const parsedResults: ExamSubmissionRecord[] = JSON.parse(cbtResults);
      if (Array.isArray(parsedResults)) {
        const cbtRecords: StudentTestScoreRecord[] = parsedResults.map((res) => ({
          id: `cbt-${res.id}`,
          studentName: res.studentName,
          studentEmail: res.studentEmail,
          studentClass: res.studentClass || 'SS2',
          subject: res.examTitle.split('—')[0]?.trim() || res.examTitle,
          score: res.percentage,
          grade: res.grade,
          date: res.submittedAt,
          testType: 'CBT Mock Exam'
        }));

        // Merge, avoiding duplicates by id
        const existingIds = new Set(baseScores.map(s => s.id));
        const newCbt = cbtRecords.filter(r => !existingIds.has(r.id));
        return [...baseScores, ...newCbt];
      }
    }
  } catch {
    // ignore
  }

  return baseScores;
};

/**
 * Save an updated list of test scores to localStorage
 */
export const saveStudentScores = (scores: StudentTestScoreRecord[]): void => {
  try {
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(scores));
    window.dispatchEvent(new Event('storage'));
  } catch {
    // ignore
  }
};

/**
 * Add a new test score record
 */
export const addStudentScore = (record: StudentTestScoreRecord): StudentTestScoreRecord[] => {
  const current = getAllStudentScores();
  const updated = [record, ...current];
  saveStudentScores(updated);
  return updated;
};

export interface StudentAverageData {
  id: string;
  studentName: string;
  shortName: string; // for compact chart labels
  studentClass: string;
  academicStream?: 'science' | 'art' | 'general';
  school: string;
  averageScore: number;
  testCount: number;
  highestScore: number;
  lowestScore: number;
  latestScore: number;
  latestSubject: string;
  performanceTier: 'Distinction' | 'Credit' | 'Pass' | 'Needs Support';
  barColor: string;
  scores: StudentTestScoreRecord[];
}

/**
 * Helper to compute average test score for all registered students
 */
export const computeStudentsAverageData = (
  students: RegisteredStudentItem[],
  scoresList?: StudentTestScoreRecord[]
): StudentAverageData[] => {
  const scores = scoresList || getAllStudentScores();

  return students.map((student) => {
    // Match scores by student ID, exact name, or case-insensitive name match
    const studentScores = scores.filter((s) => {
      if (s.studentId && s.studentId === student.id) return true;
      const sName = (s.studentName || '').toLowerCase().trim();
      const stdName = (student.studentName || '').toLowerCase().trim();
      return sName === stdName || sName.includes(stdName) || stdName.includes(sName);
    });

    const testCount = studentScores.length;
    let avg = 0;
    let highest = 0;
    let lowest = 0;
    let latest = 0;
    let latestSubject = 'N/A';

    if (testCount > 0) {
      const sum = studentScores.reduce((acc, curr) => acc + curr.score, 0);
      avg = Math.round((sum / testCount) * 10) / 10;
      highest = Math.max(...studentScores.map(s => s.score));
      lowest = Math.min(...studentScores.map(s => s.score));
      latest = studentScores[studentScores.length - 1].score;
      latestSubject = studentScores[studentScores.length - 1].subject;
    } else {
      // If student has no test record yet (e.g. freshly registered), calculate a baseline estimation
      // or default based on class
      avg = 70;
      highest = 70;
      lowest = 70;
      latest = 70;
      latestSubject = 'General Assessment';
    }

    let performanceTier: 'Distinction' | 'Credit' | 'Pass' | 'Needs Support';
    let barColor: string;

    if (avg >= 75) {
      performanceTier = 'Distinction';
      barColor = '#10b981'; // Emerald
    } else if (avg >= 60) {
      performanceTier = 'Credit';
      barColor = '#3b82f6'; // Blue
    } else if (avg >= 50) {
      performanceTier = 'Pass';
      barColor = '#f59e0b'; // Amber
    } else {
      performanceTier = 'Needs Support';
      barColor = '#f43f5e'; // Rose
    }

    // Short name for chart axis (First name + last initial)
    const nameParts = student.studentName.trim().split(/\s+/);
    const shortName = nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[1].charAt(0)}.`
      : student.studentName;

    return {
      id: student.id,
      studentName: student.studentName,
      shortName,
      studentClass: student.studentClass,
      academicStream: student.academicStream,
      school: student.school,
      averageScore: avg,
      testCount: testCount || 1,
      highestScore: highest,
      lowestScore: lowest,
      latestScore: latest,
      latestSubject,
      performanceTier,
      barColor,
      scores: studentScores
    };
  });
};

export interface ClassAverageData {
  studentClass: string;
  averageScore: number;
  studentCount: number;
  totalTests: number;
  highestAverage: number;
  lowestAverage: number;
  barColor: string;
}

/**
 * Compute average scores aggregated by class
 */
export const computeClassAverages = (studentAverages: StudentAverageData[]): ClassAverageData[] => {
  const classes = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
  const colors: Record<string, string> = {
    'JSS1': '#06b6d4', // Cyan
    'JSS2': '#0ea5e9', // Sky
    'JSS3': '#3b82f6', // Blue
    'SS1': '#6366f1',  // Indigo
    'SS2': '#8b5cf6',  // Purple
    'SS3': '#10b981'   // Emerald
  };

  return classes.map((cls) => {
    const classStudents = studentAverages.filter(
      s => (s.studentClass || '').toUpperCase() === cls.toUpperCase()
    );

    if (classStudents.length === 0) {
      return {
        studentClass: cls,
        averageScore: 0,
        studentCount: 0,
        totalTests: 0,
        highestAverage: 0,
        lowestAverage: 0,
        barColor: colors[cls] || '#64748b'
      };
    }

    const totalAvgSum = classStudents.reduce((acc, curr) => acc + curr.averageScore, 0);
    const classAvg = Math.round((totalAvgSum / classStudents.length) * 10) / 10;
    const totalTests = classStudents.reduce((acc, curr) => acc + curr.testCount, 0);
    const highestAverage = Math.max(...classStudents.map(s => s.averageScore));
    const lowestAverage = Math.min(...classStudents.map(s => s.averageScore));

    return {
      studentClass: cls,
      averageScore: classAvg,
      studentCount: classStudents.length,
      totalTests,
      highestAverage,
      lowestAverage,
      barColor: colors[cls] || '#64748b'
    };
  });
};
