import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Megaphone,
  PlusCircle, Calendar, Clock, BookOpen, UserPlus, 
  Send, Trash2, ArrowRight, ArrowLeft, Sparkles, Filter, Bell, Settings,
  Phone, School, Eye, Copy, Check, Download, Search, X, FileText,
  MessageSquareHeart, Award, MapPin, Flag, Wifi, Activity,
  Atom, Palette, BarChart3, TrendingUp, Inbox, Mail, Globe, Layers
} from 'lucide-react';
import { 
  User, ClassAnnouncement, ClassAssignment, 
  NigerianStudentRegistration, RegisteredStudentItem, ClassMotivation 
} from '../types';
import { 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_CLASS_ASSIGNMENTS,
  INITIAL_REGISTERED_STUDENTS
} from '../data/initialClassData';
import { INITIAL_MOTIVATIONS } from '../data/initialMotivations';
import { getStoredCBTExams } from '../data/cbtExamsRegistry';
import { playSuccessSound } from '../utils/sound';
import { AdminClassSettingsModal, ClassSettings } from '../components/AdminClassSettingsModal';
import { ClassMotivationStation } from '../components/ClassMotivationStation';
import { AdminMotivationModal } from '../components/AdminMotivationModal';
import { PracticeExamCenter } from '../components/PracticeExamCenter';
import { ClassStreamPromptModal } from '../components/ClassStreamPromptModal';
import { AdminStudentScoreChart } from '../components/AdminStudentScoreChart';
import { AdminMessagesAndHomeworkDesk } from '../components/AdminMessagesAndHomeworkDesk';
import { AdminGlobalLoginMonitor } from '../components/AdminGlobalLoginMonitor';
import { AdminDeployCbtModal } from '../components/AdminDeployCbtModal';
import { getEffectiveStudentStream, setEffectiveStudentStream } from '../utils/authManager';

interface ClassPageProps {
  currentUser: User | null;
  registeredStudent: NigerianStudentRegistration | null;
  onOpenRegistrationModal: () => void;
  onNavigate: (page: string) => void;
  onOpenLogin: () => void;
  onBack: () => void;
  previousPageName?: string;
  registeredStudents?: RegisteredStudentItem[];
  onDeleteRegisteredStudent?: (id: string) => void;
  onAddRegisteredStudent?: (student: RegisteredStudentItem) => void;
}

const DEFAULT_CLASS_SETTINGS: ClassSettings = {
  motto: 'Leadership, Integrity & Academic Distinction',
  roomSchedule: 'Senior Hall Room 302 • Mon-Fri 8:00 AM',
  targetPassRate: '98% Distinction',
  focusSubject: 'WAEC Science, Mathematics & Technical Studies'
};

export const ClassPage: React.FC<ClassPageProps> = ({
  currentUser,
  registeredStudent,
  onOpenRegistrationModal,
  onNavigate,
  onOpenLogin,
  onBack,
  previousPageName = 'Previous Page',
  registeredStudents = INITIAL_REGISTERED_STUDENTS,
  onDeleteRegisteredStudent,
  onAddRegisteredStudent
}) => {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'student_admin';
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'registered_students' | 'academic_scores' | 'mock_exam' | 'inbox' | 'live_logins'>(() => {
    try {
      const targetTab = sessionStorage.getItem('echo_plan_active_class_tab');
      if (targetTab === 'mock_exam' || targetTab === 'registered_students' || targetTab === 'dashboard' || targetTab === 'academic_scores' || targetTab === 'inbox' || targetTab === 'live_logins') {
        sessionStorage.removeItem('echo_plan_active_class_tab');
        return targetTab as any;
      }
    } catch {
      // fallback
    }
    return 'dashboard';
  });

  const [isDeployCbtModalOpen, setIsDeployCbtModalOpen] = useState(false);

  // Automatically check tab on mount/focus
  useEffect(() => {
    const handleCheckTab = () => {
      try {
        const targetTab = sessionStorage.getItem('echo_plan_active_class_tab');
        if (targetTab === 'mock_exam' || targetTab === 'registered_students' || targetTab === 'dashboard' || targetTab === 'academic_scores') {
          setActiveAdminTab(targetTab as any);
          sessionStorage.removeItem('echo_plan_active_class_tab');
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('focus', handleCheckTab);
    handleCheckTab();
    return () => window.removeEventListener('focus', handleCheckTab);
  }, []);

  // Live registered students roster synchronized with props & localStorage
  const [liveStudents, setLiveStudents] = useState<RegisteredStudentItem[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_registered_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return registeredStudents;
  });

  // Keep in sync with parent props
  useEffect(() => {
    if (registeredStudents && registeredStudents.length > 0) {
      setLiveStudents(registeredStudents);
    }
  }, [registeredStudents]);

  // Synchronize when any student registers in any other modal or window
  useEffect(() => {
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === 'echo_plan_registered_students' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setLiveStudents(parsed);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  // Dashboard class filter for the Admin Class Workspace
  const [dashboardClassFilter, setDashboardClassFilter] = useState<string>('all');
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState<string>('');

  // Registered Students directory filtering state for admin
  const [studentSearch, setStudentSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [timetableFilter, setTimetableFilter] = useState<'all' | 'with_timetable' | 'no_timetable'>('all');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [previewStudentTimetable, setPreviewStudentTimetable] = useState<RegisteredStudentItem | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // Manual Enroll form state
  const [enrollName, setEnrollName] = useState('');
  const [enrollClass, setEnrollClass] = useState('SS3');
  const [enrollSchool, setEnrollSchool] = useState('');
  const [enrollPhone, setEnrollPhone] = useState('');

  const [classSettings, setClassSettings] = useState<ClassSettings>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_class_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CLASS_SETTINGS;
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [announcements, setAnnouncements] = useState<ClassAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_class_announcements');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Daily Motivations State (1 to 52, including 1-to-1 personalized notes)
  const [motivations, setMotivations] = useState<ClassMotivation[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_class_motivations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If the user had the previous 50 items and hasn't deleted/customized, ensure 51 & 52 are present
          const existingIds = new Set(parsed.map((p: ClassMotivation) => p.id));
          const missing51Or52 = INITIAL_MOTIVATIONS.filter(m => (m.id === 'mot-51' || m.id === 'mot-52') && !existingIds.has(m.id));
          const hasCustomFlag = localStorage.getItem('echo_plan_class_motivations_customized');
          if (missing51Or52.length > 0 && !hasCustomFlag) {
            const combined = [...parsed, ...missing51Or52];
            try {
              localStorage.setItem('echo_plan_class_motivations', JSON.stringify(combined));
            } catch {
              // ignore
            }
            return combined;
          }
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_MOTIVATIONS;
  });

  // Persist motivations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('echo_plan_class_motivations', JSON.stringify(motivations));
    } catch {
      // ignore
    }
  }, [motivations]);

  const [isAdminMotivationModalOpen, setIsAdminMotivationModalOpen] = useState(false);

  // Student academic stream state: 'science' or 'art'
  const [studentStream, setStudentStream] = useState<'science' | 'art'>(() => {
    return getEffectiveStudentStream(currentUser);
  });

  // Keep studentStream synced with global updates
  useEffect(() => {
    const handleStorage = () => {
      setStudentStream(getEffectiveStudentStream(currentUser));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [currentUser]);

  // Ask science or art student stream when entering class
  const [isStreamPromptOpen, setIsStreamPromptOpen] = useState(false);

  // Automatically prompt on first entry to class for the session
  useEffect(() => {
    const hasSeenPrompt = sessionStorage.getItem('echo_plan_class_stream_prompted');
    if (!isAdmin && !hasSeenPrompt) {
      setIsStreamPromptOpen(true);
      sessionStorage.setItem('echo_plan_class_stream_prompted', 'true');
    }
  }, [isAdmin]);

  const handleSelectStream = (stream: 'science' | 'art', updatedName?: string) => {
    setStudentStream(stream);
    setEffectiveStudentStream(stream, currentUser);
    const oldName = registeredStudent?.studentName || currentUser?.name || '';
    const newName = updatedName?.trim() || oldName;

    // Persist to currentUser
    if (currentUser) {
      currentUser.academicStream = stream;
      if (newName) currentUser.name = newName;
      try {
        localStorage.setItem('echo_plan_user', JSON.stringify(currentUser));
        localStorage.setItem('echo_plan_current_user', JSON.stringify(currentUser));
      } catch {
        // ignore
      }
    }
    // Persist to registeredStudent
    if (registeredStudent) {
      registeredStudent.academicStream = stream;
      if (newName) registeredStudent.studentName = newName;
      try {
        localStorage.setItem('echo_plan_nigeria_registration', JSON.stringify(registeredStudent));
        localStorage.setItem('echo_plan_registered_student', JSON.stringify(registeredStudent));
      } catch {
        // ignore
      }
    }
    // Update live student list
    setLiveStudents(prev => {
      const updated = prev.map(s => {
        if (s.studentName === oldName || (newName && s.studentName === newName)) {
          return { ...s, academicStream: stream, studentName: newName || s.studentName };
        }
        return s;
      });
      try {
        localStorage.setItem('echo_plan_registered_students', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    playSuccessSound();
  };

  // Motivation handlers
  const handleAddMotivation = (item: Omit<ClassMotivation, 'id' | 'createdAt'>) => {
    const newMotivation: ClassMotivation = {
      ...item,
      id: `mot-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setMotivations(prev => {
      const updated = [...prev, newMotivation];
      try {
        localStorage.setItem('echo_plan_class_motivations', JSON.stringify(updated));
        localStorage.setItem('echo_plan_class_motivations_customized', 'true');
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleUpdateMotivation = (updated: ClassMotivation) => {
    setMotivations(prev => {
      const updatedList = prev.map(m => m.id === updated.id ? updated : m);
      try {
        localStorage.setItem('echo_plan_class_motivations', JSON.stringify(updatedList));
        localStorage.setItem('echo_plan_class_motivations_customized', 'true');
      } catch {
        // ignore
      }
      return updatedList;
    });
  };

  const handleDeleteMotivation = (id: string) => {
    setMotivations(prev => {
      const updated = prev.filter(m => m.id !== id);
      try {
        localStorage.setItem('echo_plan_class_motivations', JSON.stringify(updated));
        localStorage.setItem('echo_plan_class_motivations_customized', 'true');
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearAllMotivations = () => {
    setMotivations([]);
    try {
      localStorage.setItem('echo_plan_class_motivations', JSON.stringify([]));
      localStorage.setItem('echo_plan_class_motivations_customized', 'true');
    } catch {
      // ignore
    }
  };

  const handleResetMotivations = () => {
    setMotivations(INITIAL_MOTIVATIONS);
    try {
      localStorage.setItem('echo_plan_class_motivations', JSON.stringify(INITIAL_MOTIVATIONS));
      localStorage.removeItem('echo_plan_class_motivations_customized');
    } catch {
      // ignore
    }
  };

  const [assignments, setAssignments] = useState<ClassAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_class_assignments');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CLASS_ASSIGNMENTS;
  });

  // Announcement state
  const [showAnnounceForm, setShowAnnounceForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<'urgent' | 'reminder' | 'general'>('general');

  // Assignment state
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignSubject, setAssignSubject] = useState('Mathematics');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDue, setAssignDue] = useState('Tomorrow at 5:00 PM');
  const [confirmDeleteStudentCardId, setConfirmDeleteStudentCardId] = useState<string | null>(null);

  // Save changes
  React.useEffect(() => {
    try {
      localStorage.setItem('echo_plan_class_settings', JSON.stringify(classSettings));
    } catch {
      // fallback
    }
  }, [classSettings]);

  React.useEffect(() => {
    try {
      localStorage.setItem('echo_plan_class_announcements', JSON.stringify(announcements));
    } catch {
      // fallback
    }
  }, [announcements]);

  React.useEffect(() => {
    try {
      localStorage.setItem('echo_plan_class_assignments', JSON.stringify(assignments));
    } catch {
      // fallback
    }
  }, [assignments]);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newAnn: ClassAnnouncement = {
      id: `ann-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: currentUser?.name || 'Victoria Okajoe (School Administrator)',
      authorRole: 'Lead Administrator',
      timestamp: 'Just now',
      priority: newPriority
    };

    setAnnouncements([newAnn, ...announcements]);
    setNewTitle('');
    setNewContent('');
    setShowAnnounceForm(false);
    playSuccessSound();
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;

    const newAssign: ClassAssignment = {
      id: `assign-${Date.now()}`,
      subject: assignSubject,
      title: assignTitle.trim(),
      dueDate: assignDue,
      assignedBy: currentUser?.name || 'Victoria Okajoe (Lead Administrator)',
      submissionRate: 15
    };

    setAssignments([newAssign, ...assignments]);
    setAssignTitle('');
    setShowAssignForm(false);
    playSuccessSound();
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  // Filter registered students list for Admin
  const filteredRegisteredStudents = (liveStudents || []).filter((student) => {
    if (!student) return false;
    const q = (studentSearch || '').trim().toLowerCase();
    const name = (student.studentName || '').toLowerCase();
    const school = (student.school || '').toLowerCase();
    const sClass = (student.studentClass || '').toLowerCase();
    const phone = student.phoneNumber || '';

    const matchesSearch = !q ||
      name.includes(q) ||
      school.includes(q) ||
      phone.includes(q) ||
      sClass.includes(q);

    const matchesClass = classFilter === 'all' || (student.studentClass || '').toUpperCase() === classFilter.toUpperCase();

    const matchesTimetable = 
      timetableFilter === 'all' ||
      (timetableFilter === 'with_timetable' && student.timetableUploaded) ||
      (timetableFilter === 'no_timetable' && !student.timetableUploaded);

    return matchesSearch && matchesClass && matchesTimetable;
  });

  // Filter students on the Admin Class Workspace Dashboard
  const dashboardFilteredStudents = (liveStudents || []).filter((student) => {
    if (!student) return false;
    const q = (dashboardSearchQuery || '').trim().toLowerCase();
    const name = (student.studentName || '').toLowerCase();
    const school = (student.school || '').toLowerCase();
    const sClass = (student.studentClass || '').toUpperCase();
    const phone = student.phoneNumber || '';

    const matchesSearch = !q ||
      name.includes(q) ||
      school.includes(q) ||
      phone.includes(q) ||
      sClass.includes(q.toUpperCase());

    const matchesFilter = 
      dashboardClassFilter === 'all' ||
      (dashboardClassFilter === 'online' && Boolean(student.isOnline)) ||
      (dashboardClassFilter === 'red_flag' && Boolean(student.hasRedFlag)) ||
      sClass === dashboardClassFilter.toUpperCase();

    return matchesSearch && matchesFilter;
  });

  const handleDeleteRegistered = (id: string, _name?: string) => {
    const updated = liveStudents.filter(s => s.id !== id);
    setLiveStudents(updated);
    try {
      localStorage.setItem('echo_plan_registered_students', JSON.stringify(updated));
    } catch {
      // ignore
    }
    if (onDeleteRegisteredStudent) {
      onDeleteRegisteredStudent(id);
    }
    playSuccessSound();
  };

  const handleCopyStudentPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    playSuccessSound();
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleExportRegisteredCSV = () => {
    const headers = ['Student ID', 'Student Name', 'Class', 'School', 'Phone Number', 'Email', 'Registration Date', 'Timetable Status'];
    const rows = filteredRegisteredStudents.map(s => [
      s.id,
      `"${s.studentName}"`,
      s.studentClass,
      `"${s.school}"`,
      s.phoneNumber || 'N/A',
      s.email || 'N/A',
      `"${s.registeredAt}"`,
      s.timetableUploaded ? 'Uploaded' : 'Pending'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nigerian_Registered_Students_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playSuccessSound();
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollName.trim() || !enrollSchool.trim()) return;

    const newStudent: RegisteredStudentItem = {
      id: `reg-std-${Date.now()}`,
      studentName: enrollName.trim(),
      studentClass: enrollClass,
      school: enrollSchool.trim(),
      phoneNumber: enrollPhone.trim() || undefined,
      email: `${enrollName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@student.echo.edu.ng`,
      registeredAt: `Today, ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
      status: 'Active',
      avatarBg: enrollClass.startsWith('SS') ? 'bg-purple-600' : 'bg-teal-600',
      timetableUploaded: false
    };

    const updated = [newStudent, ...liveStudents];
    setLiveStudents(updated);
    try {
      localStorage.setItem('echo_plan_registered_students', JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (onAddRegisteredStudent) {
      onAddRegisteredStudent(newStudent);
    }
    setEnrollName('');
    setEnrollSchool('');
    setEnrollPhone('');
    setIsEnrollModalOpen(false);
    playSuccessSound();
  };

  const classesList = ['all', 'JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];

  return (
    <div className="min-h-screen bg-[#f6f9ff] w-full overflow-x-hidden">
      
      {/* Top Student Admin Banner */}
      <section className="relative py-8 sm:py-12 md:py-16 px-3.5 sm:px-6 md:px-10 lg:px-[7%] bg-[#071a3d] text-white overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 75% 25%, rgba(98, 197, 250, 0.25), transparent 45%), linear-gradient(115deg, #071a3d, #0b2b62 60%, #164b91)'
          }}
        />

        <div className="relative z-10 max-w-[1250px] mx-auto">
          {/* Top Back Navigation Bar */}
          <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer border border-white/15 backdrop-blur-sm shadow-sm"
              title={`Go back to ${previousPageName}`}
            >
              <ArrowLeft size={16} className="text-[#62c5fa]" />
              <span>Back to {previousPageName}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs text-[#c8daf3] hover:text-white font-semibold transition-colors cursor-pointer px-2 py-1"
            >
              Exit to Home
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div className="w-full md:w-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-[#a5b4fc] text-[10.5px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-indigo-400/30 flex-wrap">
                <ShieldCheck size={14} className="text-[#818cf8]" /> {isAdmin ? 'SCHOOL ADMINISTRATOR HUB • ALL CLASSES' : `STUDENT HUB • CLASS ${currentUser?.grade || 'SS3'}`}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight break-words">
                {isAdmin ? 'School Administration & Class Hub' : (currentUser?.grade ? `Class ${currentUser.grade} Dashboard` : 'Class Dashboard')}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-emerald-200 mt-1.5 sm:mt-2 max-w-2xl font-semibold italic">
                “{classSettings.motto}”
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#c8daf3]">
                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                  📚 Focus: <strong className="text-white">{classSettings.focusSubject}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                  🕒 {classSettings.roomSchedule}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  🎯 Target: <strong>{classSettings.targetPassRate}</strong>
                </span>
                {isAdmin && (
                  <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="px-3 py-1 rounded-full bg-white text-slate-900 font-extrabold hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-md text-[11px]"
                    title="Admin Option: Change Class Motto, Focus & Schedule"
                  >
                    <Settings size={13} className="text-indigo-600" />
                    <span>Admin: Class Options</span>
                  </button>
                )}
              </div>
            </div>

            {/* Current Admin / User Badge */}
            <div className="w-full md:w-auto bg-white/10 border border-white/15 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm flex items-center gap-3 sm:gap-3.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md shrink-0">
                {(currentUser?.name || 'Victoria').charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] sm:text-xs text-[#a5b4fc] font-bold uppercase tracking-wider">
                  Logged In As:
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-white truncate">
                  {currentUser?.name || 'Victoria Okajoe'}
                </div>
                <div className="text-[10.5px] sm:text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="truncate">{isAdmin ? 'School Administrator (Two Admins System)' : `Registered Student (Class ${currentUser?.grade || 'SS3'})`}</span>
                </div>
              </div>

              {!currentUser && (
                <button
                  onClick={onOpenLogin}
                  className="ml-auto px-3 py-1.5 bg-[#61c6fb] text-[#081a3d] font-bold text-xs rounded-lg hover:bg-sky-300 transition-colors shrink-0"
                >
                  Switch User
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-6 pt-6 sm:mt-8 sm:pt-8 border-t border-white/10 text-center sm:text-left">
            <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-[#62c5fa]">{motivations.length}</div>
              <div className="text-[11px] sm:text-xs text-[#c8daf3] font-semibold">Daily Motivations</div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">{classSettings.targetPassRate}</div>
              <div className="text-[11px] sm:text-xs text-[#c8daf3] font-semibold">Target Pass Rate</div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-amber-400">{announcements.length}</div>
              <div className="text-[11px] sm:text-xs text-[#c8daf3] font-semibold">Active Notices</div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-indigo-400">{assignments.length}</div>
              <div className="text-[11px] sm:text-xs text-[#c8daf3] font-semibold">Class Assignments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Classroom Content */}
      <section className="py-6 sm:py-10 md:py-12 px-3.5 sm:px-6 md:px-10 lg:px-[7%] max-w-[1250px] mx-auto space-y-6 sm:space-y-8 w-full overflow-hidden">
        
        {/* Admin Navigation View Tabs - Fully Responsive Scrollable / Adaptive on All Devices */}
        {isAdmin && (
          <div className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto -mx-0.5 px-0.5">
              <button
                id="admin-tab-class-dashboard"
                onClick={() => setActiveAdminTab('dashboard')}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap min-h-[38px] sm:min-h-[42px] ${
                  activeAdminTab === 'dashboard'
                    ? 'bg-[#081a3d] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck size={16} className={activeAdminTab === 'dashboard' ? 'text-[#62c5fa]' : 'text-slate-400'} />
                <span>Class Workspace & Notices</span>
              </button>

              <button
                id="admin-tab-registered-students"
                onClick={() => setActiveAdminTab('registered_students')}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap min-h-[38px] sm:min-h-[42px] ${
                  activeAdminTab === 'registered_students'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-100'
                }`}
              >
                <Users size={16} />
                <span>All Registered Students ({registeredStudents.length})</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-100 text-[10px] font-black hidden sm:inline">
                  Directory
                </span>
              </button>

              <button
                id="admin-tab-academic-scores"
                onClick={() => setActiveAdminTab('academic_scores')}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap min-h-[38px] sm:min-h-[42px] ${
                  activeAdminTab === 'academic_scores'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100 border border-blue-200/70'
                }`}
              >
                <TrendingUp size={16} />
                <span>Academic Score Trends (Recharts)</span>
              </button>

              <button
                id="admin-tab-cbt-exam"
                onClick={() => setActiveAdminTab('mock_exam')}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap min-h-[38px] sm:min-h-[42px] ${
                  activeAdminTab === 'mock_exam'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200/60'
                }`}
              >
                <Award size={16} />
                <span>CBT Practice Exam</span>
              </button>

              <button
                id="admin-tab-messages-homework"
                onClick={() => setActiveAdminTab('inbox')}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap min-h-[38px] sm:min-h-[42px] ${
                  activeAdminTab === 'inbox'
                    ? 'bg-purple-700 text-white shadow-md'
                    : 'text-purple-800 bg-purple-50/80 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                <Inbox size={16} />
                <span>Contact Us & Homework Desk</span>
              </button>

              <button
                id="admin-tab-live-student-logins"
                onClick={() => setActiveAdminTab('live_logins')}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap min-h-[38px] sm:min-h-[42px] ${
                  activeAdminTab === 'live_logins'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200'
                }`}
                title="View live student logins from any device across the globe"
              >
                <Globe size={16} />
                <span>🌐 Live Student Logins (Worldwide)</span>
              </button>

              <button
                id="admin-tab-carry-out-cbt"
                onClick={() => setIsDeployCbtModalOpen(true)}
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold text-purple-900 bg-purple-100 hover:bg-purple-200 border border-purple-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 whitespace-nowrap min-h-[38px] sm:min-h-[42px]"
                title="Admin: Carry out and deploy CBT exams to other classes (SS1, SS2, SS3, JSS1, JSS2, JSS3)"
              >
                <Layers size={16} className="text-purple-700" />
                <span>🎯 Carry Out CBT to Other Classes</span>
              </button>

              <button
                id="admin-tab-ai-pdf-cbt-btn"
                onClick={() => onNavigate('planner')}
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold text-[#071a3d] bg-gradient-to-r from-[#62c5fa] to-sky-300 hover:from-sky-300 hover:to-sky-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0 whitespace-nowrap min-h-[38px] sm:min-h-[42px]"
                title="Admin AI Tool: Open Daily Plan to put a PDF file and turn it to a CBT exam"
              >
                <Sparkles size={16} className="text-[#071a3d]" />
                <span>🤖 AI PDF ➔ CBT (Daily Plan)</span>
              </button>

              <button
                id="admin-tab-motivations-btn"
                onClick={() => setIsAdminMotivationModalOpen(true)}
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold text-[#3b3294] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 whitespace-nowrap min-h-[38px] sm:min-h-[42px]"
                title="Manage 1 to 52 motivations and 1-to-1 notes"
              >
                <Sparkles size={16} className="text-purple-600" />
                <span>Motivations ({motivations.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto shrink-0 px-1">
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold">
                Administrator: <strong className="text-slate-800">{currentUser?.name || 'Victoria Okajoe'}</strong>
              </span>
            </div>
          </div>
        )}

        {/* VIEW 1: ADMIN REGISTERED STUDENTS DIRECTORY */}
        {isAdmin && activeAdminTab === 'registered_students' ? (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header & Metric Cards */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-2 border border-indigo-100">
                  <Users size={14} className="text-indigo-600" />
                  Official Student Registry
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#081a3d] tracking-tight">
                  All Registered Students in Nigeria
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                  Comprehensive roster of junior and senior secondary school students registered across Nigeria. Review classes, schools, and uploaded daily timetables.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                <button
                  onClick={handleExportRegisteredCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer min-h-[38px]"
                >
                  <Download size={14} className="text-slate-500" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={() => setIsEnrollModalOpen(!isEnrollModalOpen)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl bg-[#081a3d] hover:bg-[#122e66] text-white text-xs font-extrabold transition-all shadow-md cursor-pointer min-h-[38px]"
                >
                  <UserPlus size={14} className="text-[#62c5fa]" />
                  <span>{isEnrollModalOpen ? 'Close Form' : '+ Enroll Student'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-center sm:text-left">
              <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Registered</span>
                <div className="text-xl sm:text-2xl font-black text-[#081a3d] mt-0.5">{registeredStudents.length} Students</div>
                <span className="text-[10.5px] sm:text-[11px] text-emerald-600 font-semibold">Active in System</span>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Timetables Uploaded</span>
                <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">
                  {registeredStudents.filter(s => s.timetableUploaded).length}
                </div>
                <span className="text-[10.5px] sm:text-[11px] text-slate-400">Class Timetables Active</span>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filtered View</span>
                <div className="text-xl sm:text-2xl font-black text-indigo-600 mt-0.5">{filteredRegisteredStudents.length}</div>
                <span className="text-[10.5px] sm:text-[11px] text-slate-400">Showing on page</span>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Class Range</span>
                <div className="text-xl sm:text-2xl font-black text-sky-600 mt-0.5">JSS1 — SS3</div>
                <span className="text-[10.5px] sm:text-[11px] text-slate-400">Universal Coverage</span>
              </div>
            </div>

            {/* Academic Performance Trends Recharts Bar Chart */}
            <AdminStudentScoreChart registeredStudents={liveStudents} />

            {/* Enroll Student Accordion */}
            {isEnrollModalOpen && (
              <form onSubmit={handleEnrollSubmit} className="p-4 sm:p-6 bg-indigo-50/80 rounded-2xl sm:rounded-3xl border border-indigo-200/80 space-y-3 sm:space-y-4 animate-fade-down shadow-sm">
                <div className="flex items-center gap-2 text-indigo-950 font-extrabold text-sm">
                  <UserPlus size={18} className="text-indigo-600" />
                  <span>Register a New Student Directly (Admin Authority)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chukwuma Adebayo"
                      value={enrollName}
                      onChange={(e) => setEnrollName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Class / Grade *</label>
                    <select
                      value={enrollClass}
                      onChange={(e) => setEnrollClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-indigo-200 outline-none"
                    >
                      <option value="JSS1">JSS 1</option>
                      <option value="JSS2">JSS 2</option>
                      <option value="JSS3">JSS 3</option>
                      <option value="SS1">SS 1</option>
                      <option value="SS2">SS 2</option>
                      <option value="SS3">SS 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Nigerian School Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. King's College Lagos"
                      value={enrollSchool}
                      onChange={(e) => setEnrollSchool(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="+234 803 000 0000"
                      value={enrollPhone}
                      onChange={(e) => setEnrollPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 sm:px-6 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm cursor-pointer"
                  >
                    Confirm & Enroll Student
                  </button>
                </div>
              </form>
            )}

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search registered students by name, school, phone number, or class..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#62c5fa] bg-slate-50/50"
                />
              </div>

              {/* Class Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
                  <Filter size={12} /> Class:
                </span>
                {classesList.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setClassFilter(cls)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                      classFilter === cls
                        ? 'bg-[#081a3d] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>

              {/* Timetable Status Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar pb-0.5">
                <button
                  onClick={() => setTimetableFilter('all')}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    timetableFilter === 'all' ? 'bg-white text-[#081a3d] shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  All ({registeredStudents.length})
                </button>
                <button
                  onClick={() => setTimetableFilter('with_timetable')}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    timetableFilter === 'with_timetable' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Timetable Active
                </button>
                <button
                  onClick={() => setTimetableFilter('no_timetable')}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    timetableFilter === 'no_timetable' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>

            {/* Students Grid */}
            {filteredRegisteredStudents.length === 0 ? (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-slate-400 border border-slate-200">
                <Users size={44} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-base font-extrabold text-[#081a3d]">No registered students match your filter</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting the class filter or search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {filteredRegisteredStudents.map((student) => {
                  const initials = (student.studentName || 'ST')
                    .trim()
                    .split(/\s+/)
                    .map(n => n[0] || '')
                    .slice(0, 2)
                    .join('')
                    .toUpperCase() || 'ST';

                  return (
                    <div
                      key={student.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div>
                        {/* Top Row: Avatar, Name & Class */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-2xl ${student.avatarBg || 'bg-emerald-600'} text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs`}>
                              {initials}
                            </div>
                            <div>
                              <h3 className="text-sm sm:text-base font-black text-[#081a3d] group-hover:text-indigo-700 transition-colors">
                                {student.studentName}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[10.5px] font-black uppercase border border-indigo-100">
                                  Class {student.studentClass}
                                </span>
                                {student.academicStream && (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                                    student.academicStream === 'science' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {student.academicStream === 'science' ? <Atom size={10} /> : <Palette size={10} />}
                                    <span>{student.academicStream}</span>
                                  </span>
                                )}
                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                                  Enrolled
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Delete Action */}
                          {onDeleteRegisteredStudent && (
                            confirmDeleteStudentCardId === student.id ? (
                              <div className="flex items-center gap-1 animate-fade-in">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteRegistered(student.id);
                                    setConfirmDeleteStudentCardId(null);
                                  }}
                                  className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer animate-pulse"
                                >
                                  Delete?
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteStudentCardId(null)}
                                  className="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteStudentCardId(student.id)}
                                className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete student registration"
                              >
                                <Trash2 size={15} />
                              </button>
                            )
                          )}
                        </div>

                        {/* School Info */}
                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                          <School size={14} className="text-slate-400 flex-shrink-0" />
                          <span className="font-semibold line-clamp-1">{student.school}</span>
                        </div>

                        {/* Phone Number */}
                        {student.phoneNumber && (
                          <div className="mt-1.5 flex items-center justify-between text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                              <Phone size={13} className="text-slate-400 flex-shrink-0" />
                              <span className="font-mono font-medium">{student.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleCopyStudentPhone(student.phoneNumber!)}
                                className="p-1 hover:text-indigo-600 text-slate-400 transition-colors"
                                title="Copy Phone Number"
                              >
                                {copiedPhone === student.phoneNumber ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                              </button>
                              <a
                                href={`tel:${student.phoneNumber}`}
                                className="text-[11px] font-bold text-sky-600 hover:underline"
                              >
                                Call
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Timetable Status & Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[11px] text-slate-400">
                          <span>Joined: {student.registeredAt || 'Active'}</span>
                        </div>

                        <div>
                          {student.timetableUploaded ? (
                            <button
                              onClick={() => setPreviewStudentTimetable(student)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer border border-emerald-200/80"
                            >
                              <Eye size={13} className="text-emerald-600" />
                              <span>View Timetable</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-100">
                              <Calendar size={11} className="text-amber-600" />
                              <span>Pending Timetable</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        ) : isAdmin && activeAdminTab === 'academic_scores' ? (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <TrendingUp className="text-blue-600" size={16} />
                <span>Admin Academic Performance Trends & Test Scores (Recharts)</span>
              </div>
              <button
                onClick={() => setActiveAdminTab('dashboard')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                ← Return to Class Workspace
              </button>
            </div>
            <AdminStudentScoreChart registeredStudents={liveStudents} />
          </div>
        ) : activeAdminTab === 'mock_exam' ? (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Award className="text-emerald-600" size={16} />
                <span>Classroom Examination Practice Hall</span>
              </div>
              <button
                onClick={() => setActiveAdminTab('dashboard')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                ← Return to Class Workspace
              </button>
            </div>
            <PracticeExamCenter currentUser={currentUser} />
          </div>
        ) : isAdmin && activeAdminTab === 'inbox' ? (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Inbox className="text-purple-600" size={16} />
                <span>Contact Us Inquiries & Homework Submissions Review Desk</span>
              </div>
              <button
                onClick={() => setActiveAdminTab('dashboard')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                ← Return to Class Workspace
              </button>
            </div>
            <AdminMessagesAndHomeworkDesk adminName={currentUser?.name || 'Victoria Okajoe'} />
          </div>
        ) : isAdmin && activeAdminTab === 'live_logins' ? (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Globe className="text-emerald-600" size={16} />
                <span>Live Worldwide Student Logins & Active Sessions (Any Device)</span>
              </div>
              <button
                onClick={() => setActiveAdminTab('dashboard')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                ← Return to Class Workspace
              </button>
            </div>
            <AdminGlobalLoginMonitor adminName={currentUser?.name || 'Victoria Okajoe'} />
          </div>
        ) : (
          /* VIEW 2: STANDARD CLASS WORKSPACE & NOTICES */
          <div className="space-y-10">
            
            {/* 1. MOTIVATION STATION (MOTIVATE ME) - ABOVE STUDENT PICTURE & CBT EXAM */}
            <div id="class-motivation-section">
              <ClassMotivationStation
                currentUser={currentUser}
                isAdmin={isAdmin}
                motivations={motivations}
                onAddMotivation={handleAddMotivation}
                onUpdateMotivation={handleUpdateMotivation}
                onDeleteMotivation={handleDeleteMotivation}
                onResetMotivations={handleResetMotivations}
                onOpenAdminManager={() => setIsAdminMotivationModalOpen(true)}
                registeredStudents={liveStudents}
              />
            </div>

            {/* 2. STUDENT'S PICTURE & CLASSROOM COHORT VISUAL BANNER */}
            <div id="class-student-picture-section" className="space-y-6">
              {/* Teen Student Classroom Visual Banner (Student's Picture) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] ring-1 ring-slate-900/10">
                  <img
                    src="/src/assets/images/teen_class_students_1789589624600.jpg"
                    alt="High school teenage students collaborating in classroom"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081a3d]/85 via-[#081a3d]/20 to-transparent flex items-end p-5">
                    <div className="text-white">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/80 text-[10px] font-black uppercase tracking-wider mb-1">
                        Active Classroom Cohort
                      </span>
                      <div className="text-sm font-extrabold tracking-wide">
                        Class {currentUser?.grade || registeredStudent?.studentClass || 'SS2'} • Senior Secondary Hall
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                      {isAdmin ? 'Student Administrator Workspace' : 'Class Cohort Workspace'}
                    </span>
                    {/* Science vs Art Stream Badge with Change Button */}
                    <button
                      type="button"
                      onClick={() => setIsStreamPromptOpen(true)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                        studentStream === 'science'
                          ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                          : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                      }`}
                      title="Click to switch between Science student and Art student"
                    >
                      {studentStream === 'science' ? <Atom size={13} className="text-blue-600" /> : <Palette size={13} className="text-purple-600" />}
                      <span>{studentStream} Student</span>
                      <span className="text-[10px] font-bold text-slate-500 lowercase underline ml-0.5">(change)</span>
                    </button>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-[#081a3d] mb-3">
                    {isAdmin ? 'Coordinating Our High School Class' : `Class ${currentUser?.grade || 'SS2'} Student Workspace`}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {isAdmin 
                      ? 'As a verified Student Admin (Two Admins System), you have privileged authority to broadcast notices, schedule homework deadlines, set class options, and manage attendance for all cohorts.'
                      : 'Welcome to your classroom cohort. Here you can review daily motivations, monitor assignments, consult your reading plan, and complete external CBT practice mock exams.'}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => setShowAnnounceForm(true)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                        >
                          <Megaphone size={15} /> Post Announcement
                        </button>

                        <button
                          onClick={() => setShowAssignForm(true)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                        >
                          <PlusCircle size={15} /> Add Class Assignment
                        </button>

                        <button
                          onClick={() => setIsSettingsModalOpen(true)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                        >
                          <Settings size={15} /> Change Class Options
                        </button>

                        <button
                          onClick={() => setActiveAdminTab('academic_scores')}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                        >
                          <TrendingUp size={15} /> Academic Score Trends (Recharts)
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onNavigate('planner')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                      >
                        Open Personal Planner <ArrowRight size={14} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsStreamPromptOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      {studentStream === 'science' ? <Atom size={14} className="text-blue-600" /> : <Palette size={14} className="text-purple-600" />}
                      <span>Science / Art Stream Selector</span>
                    </button>

                    <button
                      onClick={() => onNavigate(isAdmin ? 'planner' : 'habits')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {isAdmin ? 'Go to Personal Planner' : 'View Class Habit Challenge'} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Verified Nigerian Student Admin Status Card */}
              {registeredStudent && (
                <div className="bg-gradient-to-r from-[#062419] to-[#0a3a29] rounded-3xl p-6 sm:p-7 border border-emerald-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-up">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600 border border-emerald-400/50 text-white flex items-center justify-center font-black text-2xl shadow-lg flex-shrink-0">
                      🇳🇬
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10.5px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                          Official Nigerian Student Registry
                        </span>
                        <span className="text-xs text-emerald-200/70">Verified & Active • {registeredStudent.registeredAt || 'Active'}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {registeredStudent.studentName}
                      </h3>
                      <div className="text-xs sm:text-sm text-emerald-100/90 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="font-semibold">📚 Class: <strong className="text-white">{registeredStudent.studentClass}</strong></span>
                        <span className="text-emerald-400">•</span>
                        <span className="font-semibold flex items-center gap-1">
                          {studentStream === 'science' ? <Atom size={13} className="text-cyan-300" /> : <Palette size={13} className="text-purple-300" />}
                          Department: <strong className="text-white capitalize">{studentStream}</strong>
                        </span>
                        <span className="text-emerald-400">•</span>
                        <span className="font-semibold">🏫 School: <strong className="text-white">{registeredStudent.school}</strong></span>
                        {registeredStudent.phoneNumber && (
                          <>
                            <span className="text-emerald-400">•</span>
                            <span className="font-mono font-bold text-emerald-300">📞 {registeredStudent.phoneNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsStreamPromptOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-cyan-200 border border-cyan-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {studentStream === 'science' ? <Atom size={13} /> : <Palette size={13} />}
                      <span>Change Stream</span>
                    </button>
                    <button
                      onClick={onOpenRegistrationModal}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-emerald-200 border border-emerald-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Update Info
                    </button>
                  </div>
                </div>
              )}

              {/* Entering Class Department Stream: Science Student or Art Student */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-wider border border-indigo-100 mb-1">
                      <School size={13} className="text-indigo-600" />
                      Classroom Stream Entry
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[#081a3d]">
                      Entering Your Class: Science Student or Art Student?
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your current selection is <strong className="capitalize text-[#081a3d]">{studentStream} Student</strong>. Students can enter either department stream below.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsStreamPromptOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
                  >
                    Open Stream Dialog
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Science Student Card */}
                  <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    studentStream === 'science' ? 'bg-blue-50/80 border-blue-600 shadow-xs' : 'bg-slate-50/60 border-slate-200'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            studentStream === 'science' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                          }`}>
                            <Atom size={22} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-[#081a3d]">Science Student</h4>
                            <p className="text-[11px] text-slate-500">Pure Sciences & Technical Department</p>
                          </div>
                        </div>
                        {studentStream === 'science' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Science Key Subjects */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                        <div className="font-bold text-blue-900 text-[11px] mb-0.5">Key Subjects:</div>
                        <div className="text-[11px] text-slate-600 leading-snug">
                          Mathematics, Physics, Chemistry, Biology, Further Maths, English Language
                        </div>
                      </div>
                    </div>

                    {/* Entry Action - Positioned a little below the key subjects */}
                    <div className="mt-3.5 pt-2.5 border-t border-blue-100">
                      <button
                        type="button"
                        onClick={() => handleSelectStream('science')}
                        className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                          studentStream === 'science'
                            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                            : 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 shadow-xs'
                        }`}
                      >
                        <span>{studentStream === 'science' ? 'Entered Science Class' : 'Enter Science Class'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Art Student Card */}
                  <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    studentStream === 'art' ? 'bg-purple-50/80 border-purple-600 shadow-xs' : 'bg-slate-50/60 border-slate-200'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            studentStream === 'art' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                          }`}>
                            <Palette size={22} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-[#081a3d]">Art Student</h4>
                            <p className="text-[11px] text-slate-500">Arts, Humanities & Social Sciences</p>
                          </div>
                        </div>
                        {studentStream === 'art' && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Art Key Subjects */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                        <div className="font-bold text-purple-900 text-[11px] mb-0.5">Key Subjects:</div>
                        <div className="text-[11px] text-slate-600 leading-snug">
                          Literature-in-English, Government, CRK/IRS, History, Economics, English
                        </div>
                      </div>
                    </div>

                    {/* Entry Action - Positioned a little below the key subjects */}
                    <div className="mt-3.5 pt-2.5 border-t border-purple-100">
                      <button
                        type="button"
                        onClick={() => handleSelectStream('art')}
                        className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                          studentStream === 'art'
                            ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
                            : 'bg-white text-purple-700 border border-purple-300 hover:bg-purple-50 shadow-xs'
                        }`}
                      >
                        <span>{studentStream === 'art' ? 'Entered Art Class' : 'Enter Art Class'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. CBT EXAM PRACTICE HALL (FOLLOWS MOTIVATION & STUDENT'S PICTURE) */}
            <div id="class-cbt-exam-section" className="bg-gradient-to-r from-[#071a3d] via-[#0d2a5d] to-[#154687] rounded-3xl p-6 sm:p-8 border border-blue-400/30 text-white shadow-xl space-y-6 animate-fade-up">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-[#62c5fa] text-[11px] font-black uppercase tracking-wider border border-blue-400/30">
                      <Award size={13} /> Official CBT Examination Hall (WAEC & NECO Aligned)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/30">
                      {studentStream === 'art' ? '🎨 Art Department CBT Arena' : '🔬 Science Department CBT Arena'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Computer-Based Test (CBT) Practice & Assessment Arena
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl leading-relaxed">
                    {studentStream === 'art'
                      ? 'Exams organized specifically for Arts students: Literature, Math, English, and Civic. Strict 30-minute exam room timer with answers hidden until submission.'
                      : 'Exams organized specifically for Science students: Math, Science Course, Chemistry, Biology, Physics, and Civic. Strict 30-minute exam room timer with answers hidden until submission.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onNavigate('planner')}
                      className="px-4 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-2xl transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      title="Upload past questions PDF and turn to CBT exam with AI in Daily Plan"
                    >
                      <Sparkles size={15} className="text-[#62c5fa]" />
                      <span>AI PDF ➔ CBT</span>
                    </button>
                  )}
                  <button
                    id="class-launch-exam-btn"
                    onClick={() => {
                      const targetExamId = studentStream === 'art' ? 'ss2-art-gov-lit-2026' : 'ss1-math-cbt-2026';
                      sessionStorage.setItem('echo_plan_active_cbt_exam', targetExamId);
                      setActiveAdminTab('mock_exam');
                    }}
                    className="px-6 py-3.5 bg-[#62c5fa] hover:bg-sky-300 text-[#081a3d] font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg hover:shadow-sky-400/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Award size={16} />
                    <span>Enter CBT Examination Hall ({studentStream === 'art' ? 'Arts Stream' : 'Science Stream'})</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Organized Subject Cards & Stream Tags */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
                    <span>Active Stream Curriculum Subjects ({studentStream === 'science' ? 'Science' : 'Arts'}):</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = studentStream === 'science' ? 'art' : 'science';
                        setStudentStream(next);
                        setEffectiveStudentStream(next, currentUser);
                        playSuccessSound();
                      }}
                      className="text-[11px] font-bold text-[#62c5fa] hover:text-white underline cursor-pointer"
                    >
                      Switch Stream to {studentStream === 'science' ? '🎨 Art Student' : '🔬 Science Student'}
                    </button>
                  </div>
                </div>

                {/* Subject Cards Grid organized by Stream */}
                {studentStream === 'science' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                    <div 
                      onClick={() => {
                        sessionStorage.setItem('echo_plan_active_cbt_exam', 'ss1-math-cbt-2026');
                        setActiveAdminTab('mock_exam');
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <span className="text-lg">📐</span>
                      <div className="mt-2">
                        <div className="text-xs font-black text-white">Math</div>
                        <div className="text-[10px] text-blue-200">SS1 & SS2 Papers</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        sessionStorage.setItem('echo_plan_active_cbt_exam', 'ss2-science-core-2026');
                        setActiveAdminTab('mock_exam');
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <span className="text-lg">🔬</span>
                      <div className="mt-2">
                        <div className="text-xs font-black text-white">Science Course</div>
                        <div className="text-[10px] text-emerald-300">Integrated Mock</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        sessionStorage.setItem('echo_plan_active_cbt_exam', 'ss2-chemistry-core-2026');
                        setActiveAdminTab('mock_exam');
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <span className="text-lg">🧪</span>
                      <div className="mt-2">
                        <div className="text-xs font-black text-white">Chemistry</div>
                        <div className="text-[10px] text-teal-300">25 WAEC Qs</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        sessionStorage.setItem('echo_plan_active_cbt_exam', 'ss2-biology-core-2026');
                        setActiveAdminTab('mock_exam');
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <span className="text-lg">🌿</span>
                      <div className="mt-2">
                        <div className="text-xs font-black text-white">Biology</div>
                        <div className="text-[10px] text-green-300">25 WAEC Qs</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        sessionStorage.setItem('echo_plan_active_cbt_exam', 'ss2-physics-core-2026');
                        setActiveAdminTab('mock_exam');
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <span className="text-lg">⚡</span>
                      <div className="mt-2">
                        <div className="text-xs font-black text-white">Physics</div>
                        <div className="text-[10px] text-cyan-300">25 WAEC Qs</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        sessionStorage.setItem('echo_plan_active_cbt_exam', 'ss2-civic-science-2026');
                        setActiveAdminTab('mock_exam');
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <span className="text-lg">🏛️</span>
                      <div className="mt-2">
                        <div className="text-xs font-black text-white">Civic</div>
                        <div className="text-[10px] text-amber-300">20 Qs Rights & Law</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div 
                      onClick={() => {
                        sessionStorage.setItem('echo_plan_active_cbt_exam', 'ss2-art-gov-lit-2026');
                        setActiveAdminTab('mock_exam');
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <span className="text-lg">📖</span>
                      <div className="mt-2">
                        <div className="text-xs font-black text-white">Literature</div>
                        <div className="text-[10px] text-purple-300">Literature & Gov Paper</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        sessionStorage.setItem('echo_plan_active_cbt_exam', 'ss1-math-art-2026');
                        setActiveAdminTab('mock_exam');
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <span className="text-lg">📐</span>
                      <div className="mt-2">
                        <div className="text-xs font-black text-white">Math</div>
                        <div className="text-[10px] text-blue-300">General Math for Arts</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        sessionStorage.setItem('echo_plan_active_cbt_exam', 'ss2-art-english-lit-2026');
                        setActiveAdminTab('mock_exam');
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <span className="text-lg">✍️</span>
                      <div className="mt-2">
                        <div className="text-xs font-black text-white">English</div>
                        <div className="text-[10px] text-rose-300">Language & Grammar</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        sessionStorage.setItem('echo_plan_active_cbt_exam', 'ss2-art-civic-2026');
                        setActiveAdminTab('mock_exam');
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <span className="text-lg">🏛️</span>
                      <div className="mt-2">
                        <div className="text-xs font-black text-white">Civic & Humanities</div>
                        <div className="text-[10px] text-amber-300">Constitution & Society</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

        {/* Section: Announcements & Class Homework */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Announcements Board */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Megaphone size={20} />
                </div>
                <div>
                  <h3 className="font-black text-[#081a3d] text-lg">Class Announcements</h3>
                  <p className="text-xs text-slate-500">Official student notices and study alerts</p>
                </div>
              </div>

              {isAdmin ? (
                <button
                  onClick={() => setShowAnnounceForm(!showAnnounceForm)}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {showAnnounceForm ? 'Cancel' : '+ New Notice'}
                </button>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                  Admin Broadcasts
                </span>
              )}
            </div>

            {/* New Announcement Form */}
            {showAnnounceForm && (
              <form onSubmit={handlePostAnnouncement} className="mb-6 p-4 rounded-2xl bg-[#f8fbff] border border-indigo-100 space-y-3 animate-fade-up">
                <div className="text-xs font-extrabold text-indigo-900 uppercase">
                  Broadcast Notice to Class
                </div>
                <input
                  type="text"
                  required
                  placeholder="Title (e.g., Biology Review Session in Room 204)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Details, instructions, or resources for classmates..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold text-slate-600">Priority:</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="general">General</option>
                      <option value="reminder">Reminder</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                  >
                    <Send size={13} /> Publish Notice
                  </button>
                </div>
              </form>
            )}

            {/* List of Announcements */}
            <div className="space-y-3.5">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    ann.priority === 'urgent'
                      ? 'bg-rose-50/50 border-rose-200'
                      : ann.priority === 'reminder'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-[#f8fbff] border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          ann.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : ann.priority === 'reminder'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ann.priority}
                        </span>
                        <span className="text-[11px] text-slate-400">{ann.timestamp}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-[#081a3d]">{ann.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.content}</p>
                      <div className="text-[11px] text-indigo-700 font-semibold mt-2">
                        Posted by {ann.author} • {ann.authorRole}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove announcement"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Assignments / Homework Distribution */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-black text-[#081a3d] text-lg">Class Homework</h3>
                  <p className="text-xs text-slate-500">Coordinated deadlines for 11-A</p>
                </div>
              </div>

              {isAdmin ? (
                <button
                  onClick={() => setShowAssignForm(!showAssignForm)}
                  className="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {showAssignForm ? 'Cancel' : '+ Add'}
                </button>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                  Admin Managed
                </span>
              )}
            </div>

            {isAdmin && showAssignForm && (
              <form onSubmit={handleAddAssignment} className="mb-4 p-4 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2.5 animate-fade-up">
                <div className="text-xs font-extrabold text-sky-900 uppercase">New Class Task</div>
                <input
                  type="text"
                  required
                  placeholder="Task title (e.g. Physics Quiz Chapter 4)"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={assignSubject}
                    onChange={(e) => setAssignSubject(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Reading">Reading</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                  <input
                    type="text"
                    value={assignDue}
                    onChange={(e) => setAssignDue(e.target.value)}
                    placeholder="Due date"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700 cursor-pointer"
                >
                  Broadcast to Class
                </button>
              </form>
            )}

            <div className="space-y-4">
              {assignments.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#f8fbff] border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                    <span className="text-sky-600">{item.subject}</span>
                    <div className="flex items-center gap-2">
                      <span>{item.dueDate}</span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteAssignment(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete assignment"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#081a3d] mb-2">{item.title}</h4>

                  {/* Class readiness / submission rate */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Class Completion</span>
                      <span className="text-emerald-600">{item.submissionRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${item.submissionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* ADMIN DASHBOARD: STREAMLINED REGISTERED STUDENTS SNAPSHOT */}
        {isAdmin && (
          <div id="admin-registered-students-class-section" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5 animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs border border-indigo-100">
                  <Users size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-[#081a3d]">
                      Student Roster & Cohort Management
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Live ({liveStudents.length})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Streamlined overview across JSS1–SS3. Detailed roster, phone numbers, and timetable downloads are consolidated in the Directory tab.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  id="admin-quick-enroll-student-btn"
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <UserPlus size={14} />
                  <span>+ Quick Enroll</span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('registered_students')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Users size={14} />
                  <span>Open Full Directory ({liveStudents.length})</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div 
                onClick={() => setActiveAdminTab('registered_students')}
                className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-indigo-700 uppercase">Total Enrolled</div>
                <div className="text-2xl font-black text-[#081a3d] mt-0.5">{liveStudents.length} Students</div>
                <div className="text-[10.5px] text-slate-500 mt-0.5">Across JSS1–SS3</div>
              </div>

              <div 
                onClick={() => setActiveAdminTab('registered_students')}
                className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online Now
                </div>
                <div className="text-2xl font-black text-emerald-800 mt-0.5">
                  {liveStudents.filter(s => s.isOnline).length} Active
                </div>
                <div className="text-[10.5px] text-slate-500 mt-0.5">Logged In Online</div>
              </div>

              <div 
                onClick={() => setActiveAdminTab('registered_students')}
                className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 hover:bg-sky-50 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-sky-700 uppercase">Timetables</div>
                <div className="text-2xl font-black text-sky-900 mt-0.5">
                  {liveStudents.filter(s => s.timetableUploaded).length} Uploaded
                </div>
                <div className="text-[10.5px] text-slate-500 mt-0.5">Verified Schedules</div>
              </div>

              <div 
                onClick={() => setActiveAdminTab('registered_students')}
                className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-rose-700 uppercase flex items-center gap-1">
                  <Flag size={12} className="text-rose-600" />
                  Red Flag Strikes
                </div>
                <div className="text-2xl font-black text-rose-900 mt-0.5">
                  {liveStudents.filter(s => s.hasRedFlag).length} Flagged
                </div>
                <div className="text-[10.5px] text-slate-500 mt-0.5">Exam Discipline</div>
              </div>
            </div>

            {/* Recent Registrations Mini-Roster */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Recent Registrations Activity:</span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => onNavigate('planner')}
                    className="text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={12} />
                    <span>Turn Past Questions PDF to CBT Exam (Daily Plan) ➔</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {liveStudents.slice(0, 3).map((student) => (
                  <div 
                    key={student.id} 
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl ${student.avatarBg || 'bg-indigo-600'} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                        {(student.studentName || 'ST').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-[#081a3d] truncate">
                          {student.studentName}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {student.school || 'High School'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                        {student.studentClass}
                      </span>
                      {student.academicStream && (
                        <span className="text-[9px] font-bold text-indigo-600 capitalize">
                          {student.academicStream}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

          </div>
        )}

      </section>

      {/* Student Timetable Preview Modal for Admin */}
      {previewStudentTimetable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#081a3d]">
                    {(previewStudentTimetable.studentName || 'Student')}&apos;s Timetable
                  </h3>
                  <p className="text-xs text-slate-500">
                    Class {previewStudentTimetable.studentClass} • {previewStudentTimetable.school}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewStudentTimetable(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-xs text-slate-600 space-y-1">
                <div><strong>Uploaded File:</strong> {previewStudentTimetable.timetableFileName || 'Weekly_School_Timetable.pdf'}</div>
                <div><strong>Uploaded On:</strong> {previewStudentTimetable.timetableUploadedAt || previewStudentTimetable.registeredAt || 'Verified Active'}</div>
              </div>

              {previewStudentTimetable.timetableDataUrl ? (
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 max-h-96 flex items-center justify-center p-2">
                  <img
                    src={previewStudentTimetable.timetableDataUrl}
                    alt={`${previewStudentTimetable.studentName || 'Student'} timetable preview`}
                    className="max-h-80 w-auto object-contain rounded-xl shadow-xs"
                  />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-700 mb-2">School Class Schedule Matrix (Verified Active)</div>
                  <div className="grid grid-cols-5 gap-2 text-center text-[11px]">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                      <div key={day} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="font-extrabold text-[#081a3d] mb-1.5">{day}</div>
                        <div className="space-y-1 text-[10px] text-slate-600">
                          <div className="p-1 bg-white rounded border border-slate-100 font-medium">8:00 AM Math</div>
                          <div className="p-1 bg-white rounded border border-slate-100 font-medium">9:30 AM English</div>
                          <div className="p-1 bg-white rounded border border-slate-100 font-medium">11:30 AM Physics</div>
                          <div className="p-1 bg-white rounded border border-slate-100 font-medium">1:30 PM Biology</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewStudentTimetable(null)}
                className="px-5 py-2.5 rounded-xl bg-[#081a3d] text-white text-xs font-bold hover:bg-[#112a5a] transition-all cursor-pointer shadow-xs"
              >
                Done Viewing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Class Settings Modal */}
      <AdminClassSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={classSettings}
        onSave={(updated) => {
          setClassSettings(updated);
          playSuccessSound();
        }}
      />

      {/* Admin Motivation Management Modal (1 to 52 & 1-to-1 notes) */}
      <AdminMotivationModal
        isOpen={isAdminMotivationModalOpen}
        onClose={() => setIsAdminMotivationModalOpen(false)}
        motivations={motivations}
        onAddMotivation={handleAddMotivation}
        onUpdateMotivation={handleUpdateMotivation}
        onDeleteMotivation={handleDeleteMotivation}
        onResetMotivations={handleResetMotivations}
        onClearAllMotivations={handleClearAllMotivations}
        registeredStudents={liveStudents}
        adminName={currentUser?.name || 'Victoria Okajoe'}
      />

      {/* Stream Selector Modal: Asking if Science or Art student when entering classes */}
      <ClassStreamPromptModal
        isOpen={isStreamPromptOpen}
        onClose={() => setIsStreamPromptOpen(false)}
        currentStream={studentStream}
        studentName={registeredStudent?.studentName || currentUser?.name}
        studentClass={registeredStudent?.studentClass || currentUser?.grade || 'SS2'}
        onSelectStream={handleSelectStream}
      />

      {/* Admin: Deploy / Carry Out CBT Exams to Other Classes Modal */}
      {isAdmin && isDeployCbtModalOpen && (
        <AdminDeployCbtModal
          isOpen={isDeployCbtModalOpen}
          onClose={() => setIsDeployCbtModalOpen(false)}
          exams={getStoredCBTExams()}
          currentUser={currentUser}
          onExamDeployed={() => {
            setIsDeployCbtModalOpen(false);
            setActiveAdminTab('mock_exam');
            playSuccessSound();
          }}
        />
      )}
    </div>
  );
};

