import { HomePageCustomization, PlannerFile } from '../types';

export const DEFAULT_HOME_CUSTOMIZATION: HomePageCustomization = {
  heroMotto: 'PLAN TODAY • ACHIEVE TOMORROW',
  heroSubtitle: 'Your Smart School Companion',
  heroDescription: 'Plan your studies, stay organized, build good habits and become the best version of yourself. ECHO PLAN helps you stay focused, grow academically and lead a greater future.',
  announcementActive: true,
  announcementTag: 'School Notice',
  announcementTitle: 'Third Term Academic Timetable & Revision Sheets',
  announcementContent: 'Welcome scholars! Please check the Daily Planner for uploaded past question papers, assignment guides, and study timetables.',
  announcementDate: 'Term 3 Update',
  schoolName: "Queen's College Lagos",
  termGoal: 'Term 3 Goal: 100% Submission Rate & WASSCE Preparation'
};

export const INITIAL_PLANNER_FILES: PlannerFile[] = [
  {
    id: 'file-1',
    name: 'SSS3_Mathematics_Mock_Questions.pdf',
    size: 420000,
    type: 'application/pdf',
    category: 'Past Questions',
    uploadedBy: 'Jordan Reed (Admin)',
    uploadedRole: 'Student Admin',
    uploadedAt: 'Yesterday at 3:30 PM',
    notes: 'Past WAEC & NECO practice problems on Quadratic Equations and Calculus.'
  },
  {
    id: 'file-2',
    name: 'Biology_Genetics_Summary_Notes.docx',
    size: 285000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'Lesson Notes',
    uploadedBy: 'Jordan Reed (Admin)',
    uploadedRole: 'Student Admin',
    uploadedAt: 'Today at 9:15 AM',
    notes: 'Complete summary of Mendelian genetics, Punnett squares, and DNA replication.'
  },
  {
    id: 'file-3',
    name: 'Physics_Lab_Practical_Worksheet.pdf',
    size: 195000,
    type: 'application/pdf',
    category: 'Homework Sheet',
    uploadedBy: 'Jordan Reed (Admin)',
    uploadedRole: 'Student Admin',
    uploadedAt: 'Today at 11:00 AM',
    notes: 'Simple harmonic motion & pendulum experiment instructions.'
  }
];
