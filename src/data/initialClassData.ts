import { ClassAnnouncement, ClassStudent, ClassAssignment, User, RegisteredStudentItem } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Victoria Okajoe',
    email: 'ijikevictoriaokajoe@gmail.com',
    role: 'student_admin',
    grade: undefined, // Admin does NOT have a class
    classSection: 'Lead Administrator',
    avatarBg: 'bg-indigo-600'
  },
  {
    id: 'user-student-1',
    name: 'Maya Chen',
    email: 'maya.chen@student.echo.edu',
    role: 'student',
    grade: 'SS2',
    classSection: 'King\'s College • Class SS2',
    avatarBg: 'bg-emerald-600'
  }
];

export const INITIAL_ANNOUNCEMENTS: ClassAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Midterm Calculus Review Session - Room 204',
    content: 'Our student study group is hosting a peer review session this Thursday at 4:00 PM. Bring your practice problem sets and formulas!',
    author: 'Victoria Okajoe',
    authorRole: 'School Administrator',
    timestamp: 'Today at 10:15 AM',
    priority: 'urgent'
  },
  {
    id: 'ann-2',
    title: 'Chemistry Lab Safety Sheets & Group Submissions',
    content: 'Reminder to all lab teams: please upload your Titration Lab hypotheses before Friday 5:00 PM. Check with your lab partner today.',
    author: 'Victoria Okajoe',
    authorRole: 'School Administrator',
    timestamp: 'Yesterday at 3:45 PM',
    priority: 'reminder'
  },
  {
    id: 'ann-3',
    title: 'Shared Literature Flashcards Deck Added to Learn & Grow',
    content: 'I have compiled all 35 vocabulary terms for English AP Lit into our shared flashcard section. Review them before Monday quiz.',
    author: 'Samira Patel',
    authorRole: 'Study Leader',
    timestamp: '2 days ago',
    priority: 'general'
  }
];

export const INITIAL_CLASS_STUDENTS: ClassStudent[] = [
  {
    id: 'stud-1',
    name: 'Alex Vance',
    age: 16,
    grade: 'SS3',
    status: 'Ready',
    attendance: true,
    avatarBg: 'bg-sky-500',
    lastActive: '5m ago'
  },
  {
    id: 'stud-2',
    name: 'Chloe Taylor',
    age: 16,
    grade: 'SS3',
    status: 'Studying',
    attendance: true,
    avatarBg: 'bg-rose-500',
    lastActive: '12m ago'
  },
  {
    id: 'stud-3',
    name: 'Ethan Davis',
    age: 17,
    grade: 'SS2',
    status: 'Submitted',
    attendance: true,
    avatarBg: 'bg-amber-500',
    lastActive: '25m ago'
  },
  {
    id: 'stud-4',
    name: 'Maya Chen',
    age: 16,
    grade: 'SS2',
    status: 'Ready',
    attendance: true,
    avatarBg: 'bg-emerald-500',
    lastActive: 'Just now'
  },
  {
    id: 'stud-5',
    name: 'Leo Martinez',
    age: 16,
    grade: 'SS1',
    status: 'Needs Partner',
    attendance: true,
    avatarBg: 'bg-purple-500',
    lastActive: '1h ago'
  },
  {
    id: 'stud-6',
    name: 'Zoe Williams',
    age: 15,
    grade: 'JSS3',
    status: 'Studying',
    attendance: true,
    avatarBg: 'bg-cyan-500',
    lastActive: '2h ago'
  },
  {
    id: 'stud-7',
    name: 'Samira Patel',
    age: 14,
    grade: 'JSS2',
    status: 'Ready',
    attendance: true,
    avatarBg: 'bg-indigo-500',
    lastActive: '30m ago'
  },
  {
    id: 'stud-8',
    name: 'Noah Robinson',
    age: 13,
    grade: 'JSS1',
    status: 'Needs Partner',
    attendance: false,
    avatarBg: 'bg-teal-500',
    lastActive: '4h ago'
  }
];

export const INITIAL_CLASS_ASSIGNMENTS: ClassAssignment[] = [
  {
    id: 'ca-1',
    subject: 'Mathematics',
    title: 'Trigonometry Problem Set #4 (Pages 118-124)',
    dueDate: 'Tomorrow at 11:59 PM',
    assignedBy: 'Mrs. Gable',
    submissionRate: 88
  },
  {
    id: 'ca-2',
    subject: 'Science',
    title: 'Photosynthesis & Cellular Respiration Lab Report',
    dueDate: 'Friday at 5:00 PM',
    assignedBy: 'Mr. Harrison',
    submissionRate: 62
  },
  {
    id: 'ca-3',
    subject: 'Reading',
    title: 'The Great Gatsby: Chapter 4-6 Socratic Prep',
    dueDate: 'Next Monday at 9:00 AM',
    assignedBy: 'Dr. Evelyn',
    submissionRate: 94
  }
];

export const INITIAL_REGISTERED_STUDENTS: RegisteredStudentItem[] = [
  {
    id: 'reg-std-1',
    studentName: 'Chidubem Okafor',
    studentClass: 'SS3',
    school: "King's College, Lagos",
    phoneNumber: '+234 802 345 6789',
    email: 'chidubem.okafor@student.echo.edu.ng',
    password: 'Chidubem#SS3',
    age: 17,
    registeredAt: 'Sep 18, 2026, 08:30 AM',
    lastLoginAt: 'Just now',
    isOnline: true,
    activeLocation: 'CBT Practice Arena',
    status: 'Active',
    avatarBg: 'bg-emerald-600',
    timetableUploaded: true,
    timetableName: 'SS3_Science_Term1_Timetable.jpg',
    timetableDataUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'reg-std-2',
    studentName: 'Amina Bello',
    studentClass: 'SS3',
    school: "Queen's College, Yaba Lagos",
    phoneNumber: '+234 813 987 6543',
    email: 'amina.bello@student.echo.edu.ng',
    password: 'Amina#Queens26',
    age: 17,
    registeredAt: 'Sep 18, 2026, 11:15 AM',
    lastLoginAt: '3 minutes ago',
    isOnline: true,
    activeLocation: 'Study Tools',
    status: 'Active',
    avatarBg: 'bg-sky-600',
    timetableUploaded: true,
    timetableName: 'Queens_College_SS3A_Schedule.pdf'
  },
  {
    id: 'reg-std-3',
    studentName: 'Babajide Adeyemi',
    studentClass: 'SS2',
    school: "Corona Secondary School, Agbara",
    phoneNumber: '+234 805 112 2334',
    email: 'babajide.adeyemi@student.echo.edu.ng',
    password: 'Babajide@SS2',
    age: 16,
    registeredAt: 'Sep 19, 2026, 09:40 AM',
    lastLoginAt: 'Yesterday, 08:10 PM',
    isOnline: false,
    status: 'Active',
    avatarBg: 'bg-indigo-600',
    timetableUploaded: false
  },
  {
    id: 'reg-std-4',
    studentName: 'Ngozi Eze',
    studentClass: 'SS2',
    school: "Federal Government College, Enugu",
    phoneNumber: '+234 703 456 7890',
    email: 'ngozi.eze@student.echo.edu.ng',
    password: 'Ngozi@Enugu26',
    age: 16,
    registeredAt: 'Sep 19, 2026, 02:20 PM',
    lastLoginAt: '8 minutes ago',
    isOnline: true,
    activeLocation: 'Class Workspace',
    status: 'Active',
    avatarBg: 'bg-rose-600',
    timetableUploaded: true,
    timetableName: 'FGC_Enugu_SS2_Daily_Schedule.png',
    timetableDataUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'reg-std-5',
    studentName: 'Kelechi Nwosu',
    studentClass: 'SS1',
    school: "Loyola Jesuit College, Abuja",
    phoneNumber: '+234 809 334 5566',
    email: 'kelechi.nwosu@student.echo.edu.ng',
    password: 'Kelechi@Loyola',
    age: 15,
    registeredAt: 'Sep 19, 2026, 04:10 PM',
    lastLoginAt: '2 days ago',
    isOnline: false,
    status: 'Active',
    avatarBg: 'bg-amber-600',
    timetableUploaded: false
  },
  {
    id: 'reg-std-6',
    studentName: 'Fatima Danjuma',
    studentClass: 'JSS3',
    school: "Command Secondary School, Kaduna",
    phoneNumber: '+234 814 778 8990',
    email: 'fatima.danjuma@student.echo.edu.ng',
    password: 'Fatima#JSS3',
    age: 14,
    registeredAt: 'Sep 20, 2026, 07:50 AM',
    lastLoginAt: '12 minutes ago',
    isOnline: true,
    activeLocation: 'CBT Practice Arena',
    status: 'Active',
    avatarBg: 'bg-purple-600',
    timetableUploaded: true,
    timetableName: 'JSS3_BECE_Prep_Timetable.jpg',
    timetableDataUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'reg-std-7',
    studentName: 'Olumide Fashola',
    studentClass: 'JSS2',
    school: "Vivian Fowler Memorial College, Ikeja",
    phoneNumber: '+234 802 998 8776',
    email: 'olumide.fashola@student.echo.edu.ng',
    password: 'Olumide@Fowler',
    age: 13,
    registeredAt: 'Sep 20, 2026, 08:25 AM',
    lastLoginAt: '3 days ago',
    isOnline: false,
    status: 'Active',
    avatarBg: 'bg-teal-600',
    timetableUploaded: false
  },
  {
    id: 'reg-std-8',
    studentName: 'Zainab Abubakar',
    studentClass: 'JSS1',
    school: "Federal Government Academy, Suleja",
    phoneNumber: '+234 818 223 3445',
    email: 'zainab.abubakar@student.echo.edu.ng',
    password: 'Zainab#Suleja26',
    age: 12,
    registeredAt: 'Sep 20, 2026, 10:05 AM',
    lastLoginAt: '4 days ago',
    isOnline: false,
    status: 'Active',
    avatarBg: 'bg-pink-600',
    timetableUploaded: false
  }
];

