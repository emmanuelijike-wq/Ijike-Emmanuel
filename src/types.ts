export interface TaskAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  time: string;
  category: 'Mathematics' | 'Reading' | 'Assignment' | 'Project' | 'Science' | 'Language' | 'Other';
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  attachment?: TaskAttachment;
}

export interface HabitItem {
  id: string;
  title: string;
  streak: number;
  completedDays: boolean[]; // e.g. Mon-Sun (7 days)
  targetFrequency: string;
  iconName: string;
}

export interface StudyTip {
  id: string;
  category: string;
  title: string;
  description: string;
  actionableStep: string;
  icon: string;
}

export interface StudentGoal {
  id: string;
  title: string;
  targetDate: string;
  progress: number;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student_admin' | 'student';
  grade?: string; // Admin has no class; registered students must have an assigned class
  academicStream?: 'science' | 'art' | 'general'; // Science student or Art student
  classSection: string;
  avatarBg?: string;
  school?: string;
  age?: number | string;
  password?: string;
}

export interface ClassAnnouncement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  timestamp: string;
  priority: 'urgent' | 'reminder' | 'general';
}

export interface ClassStudent {
  id: string;
  name: string;
  age: number;
  grade: string;
  status: 'Ready' | 'Studying' | 'Needs Partner' | 'Submitted';
  attendance: boolean;
  avatarBg: string;
  lastActive: string;
}

export interface ClassAssignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  assignedBy: string;
  submissionRate: number; // percentage, e.g. 85%
}

export interface NigerianStudentRegistration {
  studentName: string;
  studentClass: string;
  academicStream?: 'science' | 'art' | 'general'; // Science student or Art student
  school: string;
  email?: string;
  password?: string;
  age?: number | string;
  phoneNumber?: string; // Optional Nigerian phone number, e.g. +234 803 123 4567
  registeredAt: string;
  isAdmin?: boolean;
}

export interface PlannerFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: 'Syllabus' | 'Homework Sheet' | 'Lesson Notes' | 'Past Questions' | 'Timetable' | 'General';
  uploadedBy: string;
  uploadedRole: string;
  uploadedAt: string;
  dataUrl?: string;
  notes?: string;
}

export interface HomePageCustomization {
  heroMotto: string;
  heroSubtitle: string;
  heroDescription: string;
  announcementActive: boolean;
  announcementTag: string;
  announcementTitle: string;
  announcementContent: string;
  announcementDate: string;
  schoolName: string;
  termGoal: string;
}

export interface ClassHabitChallenge {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  category: string;
  bonusPoints: number;
  iconName: string;
  active: boolean;
  setBy: string;
  updatedAt: string;
}

export interface ClassStudyGuideline {
  id: string;
  title: string;
  category: string;
  content: string;
  directive: string;
  urgency: 'high' | 'normal' | 'tip';
  postedBy: string;
  updatedAt: string;
}

export interface RegisteredStudentItem {
  id: string;
  studentName: string;
  studentClass: string; // e.g. 'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3'
  academicStream?: 'science' | 'art' | 'general'; // Science student or Art student
  school: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  age?: number | string;
  registeredAt: string;
  lastLoginAt?: string;
  isOnline?: boolean;
  activeLocation?: string; // e.g. 'CBT Exam Arena' | 'Study Tools' | 'Class Workspace'
  hasRedFlag?: boolean;
  redFlagReason?: string;
  redFlagDate?: string;
  status: 'Active' | 'Enrolled' | 'Needs Partner' | 'Submitted';
  avatarBg: string;
  timetableUploaded?: boolean;
  timetableName?: string;
  timetableFileName?: string;
  timetableDataUrl?: string;
  timetableUploadedAt?: string;
}

export interface ExamRedFlagStrike {
  id: string;
  studentName: string;
  studentEmail?: string;
  dateStr: string;
  timestamp: string;
  examTitle: string;
  reason: string;
  active: boolean;
  habitStreakPenalty: boolean;
}

export interface StudentTimetable {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  dataUrl: string; // Base64 dataUrl or image URL
  uploadedAt: string;
  uploadedBy: string;
  studentClass?: string;
  term?: string;
  notes?: string;
}

export interface ClassMotivation {
  id: string;
  orderNumber: number; // e.g. 1 to 50
  quote: string;
  author: string;
  category: 'Self-Belief' | 'Hard Work' | 'Perseverance' | 'Exam Success' | 'Daily Discipline' | 'Leadership' | 'Personal Encouragement';
  targetType: 'general' | 'one_to_one';
  targetStudentName?: string; // If targetType is 'one_to_one'
  targetStudentClass?: string;
  createdAt: string;
  createdBy: string;
  likesCount?: number;
}

export interface StudentTestScoreRecord {
  id: string;
  studentId?: string;
  studentName: string;
  studentEmail?: string;
  studentClass: string;
  subject: string;
  score: number; // 0 to 100 percentage
  grade: string;
  date: string;
  testType: 'CBT Mock Exam' | 'Midterm Assessment' | 'Term Examination' | 'Class Quiz';
}



