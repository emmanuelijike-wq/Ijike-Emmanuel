import { TaskItem, HabitItem, StudyTip, StudentGoal } from '../types';

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'Study Mathematics',
    time: '4:00 PM',
    category: 'Mathematics',
    completed: true,
    priority: 'high',
  },
  {
    id: 't-2',
    title: 'Read & Learn',
    time: '5:30 PM',
    category: 'Reading',
    completed: true,
    priority: 'medium',
  },
  {
    id: 't-3',
    title: 'Complete Assignment',
    time: '7:00 PM',
    category: 'Assignment',
    completed: false,
    priority: 'high',
  },
  {
    id: 't-4',
    title: 'Personal Project',
    time: '8:30 PM',
    category: 'Project',
    completed: false,
    priority: 'medium',
  },
  {
    id: 't-5',
    title: 'Science Lab Notes Review',
    time: '9:15 PM',
    category: 'Science',
    completed: false,
    priority: 'low',
  }
];

export const INITIAL_HABITS: HabitItem[] = [
  {
    id: 'h-1',
    title: 'Morning Hydration & Routine',
    streak: 6,
    completedDays: [true, true, true, true, true, true, false],
    targetFrequency: 'Daily',
    iconName: 'Droplets'
  },
  {
    id: 'h-2',
    title: 'Complete Homework Before 6 PM',
    streak: 4,
    completedDays: [true, true, true, true, false, false, false],
    targetFrequency: 'Weekdays',
    iconName: 'BookOpen'
  },
  {
    id: 'h-3',
    title: 'Review Today\'s Class Notes (15m)',
    streak: 5,
    completedDays: [true, true, true, true, true, false, false],
    targetFrequency: '5 days/week',
    iconName: 'FileCheck'
  },
  {
    id: 'h-4',
    title: 'Pack School Bag the Night Before',
    streak: 7,
    completedDays: [true, true, true, true, true, true, true],
    targetFrequency: 'Daily',
    iconName: 'Briefcase'
  },
  {
    id: 'h-5',
    title: 'Read 20 Minutes for Pleasure',
    streak: 3,
    completedDays: [false, true, true, true, false, false, false],
    targetFrequency: 'Daily',
    iconName: 'Sparkles'
  }
];

export const STUDY_TIPS: StudyTip[] = [
  {
    id: 'tip-1',
    category: 'Retention',
    title: 'The Feynman Technique',
    description: 'Explain complex concepts in simple language as if teaching a younger student. Wherever you stumble is where your knowledge gap lies.',
    actionableStep: 'Grab a blank page, write the topic, and explain it using zero jargon in under 5 minutes.',
    icon: 'Lightbulb'
  },
  {
    id: 'tip-2',
    category: 'Focus',
    title: 'Pomodoro 25/5 Strategy',
    description: 'Work in hyper-focused 25-minute sprints followed by a strict 5-minute break away from screens.',
    actionableStep: 'Use the built-in Echo Plan timer below for your next study session.',
    icon: 'Clock'
  },
  {
    id: 'tip-3',
    category: 'Exams',
    title: 'Active Recall vs Passive Reading',
    description: 'Closing your book and testing yourself forces your brain to retrieve neural pathways, increasing retention by 300%.',
    actionableStep: 'Convert your notebook headlines into questions and quiz yourself before each class.',
    icon: 'Brain'
  },
  {
    id: 'tip-4',
    category: 'Energy',
    title: 'Spaced Repetition Schedule',
    description: 'Review new material within 24 hours, then at day 3, day 7, and day 14 to convert short-term memory to long-term memory.',
    actionableStep: 'Flag key formula cards with review dates.',
    icon: 'Calendar'
  }
];

export const INITIAL_GOALS: StudentGoal[] = [
  {
    id: 'g-1',
    title: 'Score 90%+ on Midterm Math Exam',
    targetDate: 'Oct 15',
    progress: 75,
    category: 'Academics'
  },
  {
    id: 'g-2',
    title: 'Read 3 Non-Fiction Books this Term',
    targetDate: 'Nov 30',
    progress: 60,
    category: 'Reading'
  },
  {
    id: 'g-3',
    title: 'Lead Science Fair Presentation',
    targetDate: 'Nov 12',
    progress: 40,
    category: 'Leadership'
  }
];
