import React from 'react';
import { PlannerSection } from '../components/PlannerSection';
import { PlannerFilesVault } from '../components/PlannerFilesVault';
import { StudentTimetableSection } from '../components/StudentTimetableSection';
import { DailyReadingPlannerSection } from '../components/DailyReadingPlannerSection';
import { SavingsGoal } from '../components/SavingsGoal';
import { StudyPlanningCalendar } from '../components/StudyPlanningCalendar';
import { StudentHomeworkSubmitSection } from '../components/StudentHomeworkSubmitSection';
import { TaskItem, PlannerFile, User, StudentTimetable } from '../types';
import { Calendar, Sparkles, BookOpen, Clock, PlusCircle, PiggyBank, FileText, CheckCircle2 } from 'lucide-react';

interface PlannerPageProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted: () => void;
  plannerFiles: PlannerFile[];
  onUploadPlannerFile: (file: Omit<PlannerFile, 'id' | 'uploadedAt'>) => void;
  onDeletePlannerFile: (fileId: string) => void;
  currentUser: User | null;
  onTimetableUpdated?: (timetable: StudentTimetable | null) => void;
  onNavigateToExam?: (examId: string) => void;
  onNavigateToLifeSkills?: () => void;
  onNavigateToLeadership?: () => void;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onClearCompleted,
  plannerFiles,
  onUploadPlannerFile,
  onDeletePlannerFile,
  currentUser,
  onTimetableUpdated,
  onNavigateToExam,
  onNavigateToLifeSkills,
  onNavigateToLeadership
}) => {
  const quickTemplates = [
    { title: 'Math Problem Set Review', category: 'Mathematics' as const, time: '4:00 PM', priority: 'high' as const },
    { title: 'History Chapter Summary', category: 'Reading' as const, time: '5:30 PM', priority: 'medium' as const },
    { title: 'Draft English Essay Outline', category: 'Assignment' as const, time: '7:00 PM', priority: 'high' as const },
    { title: 'Biology Flashcard Recall', category: 'Science' as const, time: '8:30 PM', priority: 'low' as const }
  ];

  const handleAddTaskFromFile = (file: PlannerFile) => {
    let taskCat: TaskItem['category'] = 'Assignment';
    if (file.category === 'Past Questions') taskCat = 'Mathematics';
    else if (file.category === 'Lesson Notes') taskCat = 'Reading';
    else if (file.category === 'Homework Sheet') taskCat = 'Assignment';
    else if (file.category === 'Syllabus') taskCat = 'Project';

    onAddTask({
      title: `Study & Review: ${file.name.replace(/\.[^/.]+$/, '')}`,
      time: '5:00 PM',
      category: taskCat,
      completed: false,
      priority: 'high',
      attachment: {
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: file.dataUrl
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f9ff]">
      {/* Dedicated Page Hero Banner */}
      <section className="relative py-16 px-6 sm:px-10 lg:px-[7%] bg-[#071a3d] text-white overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 80% 30%, rgba(98, 197, 250, 0.25), transparent 45%), linear-gradient(115deg, #071a3d, #0b2b62 60%, #164b91)'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#62c5fa]/40 rounded-full bg-white/5 text-[#ccecff] text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-sm">
            <Calendar size={14} className="text-[#62c5fa]" /> PLAN YOUR DAY
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Daily Academic Schedule & Tasks
          </h1>
          <p className="text-[#c8daf3] text-sm sm:text-base max-w-xl mx-auto">
            Time-block your study sessions, stay on top of assignments, and celebrate steady progress.
          </p>
        </div>
      </section>

      {/* Quick Add Preset Templates Bar */}
      <section className="py-6 px-6 sm:px-10 lg:px-[7%] bg-white border-b border-slate-200">
        <div className="max-w-[1250px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
            <Sparkles size={16} className="text-amber-500" />
            <span>One-Click Homework Presets:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {quickTemplates.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onAddTask({ ...item, completed: false })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 hover:bg-sky-100 text-xs font-bold transition-colors cursor-pointer border border-sky-100"
              >
                <PlusCircle size={13} className="text-sky-600" />
                <span>+ {item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Student Timetable Upload & Schedule Section */}
      <div className="max-w-[1250px] mx-auto px-6 sm:px-10 lg:px-[7%] pt-8">
        <StudentTimetableSection
          currentUser={currentUser}
          onTimetableUpdated={onTimetableUpdated}
        />
      </div>

      {/* Children Daily Reading Books (Math, English, Science, Literature) */}
      <div className="max-w-[1250px] mx-auto px-6 sm:px-10 lg:px-[7%]">
        <DailyReadingPlannerSection
          currentUser={currentUser}
          onAddReadingTask={onAddTask}
          onNavigateToExam={onNavigateToExam}
          onNavigateToLifeSkills={onNavigateToLifeSkills}
          onNavigateToLeadership={onNavigateToLeadership || onNavigateToLifeSkills}
        />
      </div>

      {/* Days of Studies: Student Planning Calendar */}
      <div className="max-w-[1250px] mx-auto px-6 sm:px-10 lg:px-[7%] py-4">
        <StudyPlanningCalendar 
          currentUserName={currentUser?.name} 
          currentUserGrade={currentUser?.grade} 
        />
      </div>

      {/* Student Daily Savings & Monthly Goal Tracker */}
      <div className="max-w-[1250px] mx-auto px-6 sm:px-10 lg:px-[7%] py-4">
        <SavingsGoal />
      </div>

      {/* Student Homework Submission to Admin */}
      <div className="max-w-[1250px] mx-auto px-6 sm:px-10 lg:px-[7%] py-4">
        <StudentHomeworkSubmitSection
          currentUserName={currentUser?.name}
          currentUserEmail={currentUser?.email}
          currentUserClass={currentUser?.grade}
        />
      </div>

      {/* Core Planner Section */}
      <PlannerSection
        tasks={tasks}
        onToggleTask={onToggleTask}
        onAddTask={onAddTask}
        onDeleteTask={onDeleteTask}
        onClearCompleted={onClearCompleted}
      />

      {/* Academic Files & Resource Vault */}
      <div className="max-w-[1250px] mx-auto px-6 sm:px-10 lg:px-[7%] pb-16">
        <PlannerFilesVault
          files={plannerFiles}
          onUploadFile={onUploadPlannerFile}
          onDeleteFile={onDeletePlannerFile}
          onAddTaskFromFile={handleAddTaskFromFile}
          currentUserName={currentUser?.name || 'Academic Scholar'}
          currentUserRole={currentUser?.role || 'student'}
        />
      </div>
    </div>
  );
};

