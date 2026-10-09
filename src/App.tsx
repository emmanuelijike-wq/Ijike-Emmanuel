import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { QuickAddModal } from './components/QuickAddModal';
import { LoginModal } from './components/LoginModal';
import { NigeriaStudentModal } from './components/NigeriaStudentModal';
import { EditDisplayNameModal } from './components/EditDisplayNameModal';
import { AdminHomeEditorModal } from './components/AdminHomeEditorModal';
import { AccessRestrictedPrompt } from './components/AccessRestrictedPrompt';

// Dedicated Page Views
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PlannerPage } from './pages/PlannerPage';
import { HabitsPage } from './pages/HabitsPage';
import { StudyPage } from './pages/StudyPage';
import { LeadershipPage } from './pages/LeadershipPage';
import { ContactPage } from './pages/ContactPage';
import { ClassPage } from './pages/ClassPage';
import { AdminRegisteredStudentsModal } from './components/AdminRegisteredStudentsModal';

import { 
  TaskItem, HabitItem, User, NigerianStudentRegistration, 
  HomePageCustomization, PlannerFile, RegisteredStudentItem, StudentTimetable 
} from './types';
import { INITIAL_TASKS, INITIAL_HABITS } from './data/initialData';
import { DEMO_USERS, INITIAL_REGISTERED_STUDENTS } from './data/initialClassData';
import { DEFAULT_HOME_CUSTOMIZATION, INITIAL_PLANNER_FILES } from './data/initialCustomization';
import { playSuccessSound } from './utils/sound';

export default function App() {
  // Pages accessible without registration
  const ALLOWED_UNREGISTERED_PAGES = ['home', 'features', 'about', 'contact'];

  // Hash-based page routing with default to 'home'
  const getPageFromHash = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    const validPages = ['home', 'about', 'features', 'planner', 'habits', 'tips', 'leadership', 'contact', 'class'];
    return validPages.includes(hash) ? hash : 'home';
  };

  const [currentPage, setCurrentPage] = useState<string>(getPageFromHash);
  // Track previous page so students can always go back to where they previously were
  const [previousPage, setPreviousPage] = useState<string>('home');
  // Track pending page user attempted to access when prompted to register
  const [pendingTargetPage, setPendingTargetPage] = useState<string | null>(null);

  // Friendly name for previous page
  const getPageDisplayName = (pageId: string) => {
    switch (pageId) {
      case 'home': return 'Home';
      case 'planner': return 'Daily Plan';
      case 'features': return 'Features';
      case 'habits': return 'Habits and Strikes';
      case 'about': return 'About Us';
      case 'tips': return 'Study Tools';
      case 'leadership': return 'Goals';
      case 'contact': return 'Contact Us';
      case 'class': return 'Classes';
      default: return 'Home';
    }
  };

  // Nigerian Student Registration state
  const [registeredStudent, setRegisteredStudent] = useState<NigerianStudentRegistration | null>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_nigeria_registration');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const [isNigeriaModalOpen, setIsNigeriaModalOpen] = useState<boolean>(false);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.role === 'admin' || parsed.role === 'student_admin') {
            parsed.role = 'admin';
            parsed.email = 'ijikevictoriaokajoe@gmail.com';
            delete parsed.grade; // Admin has NO class
            if (!parsed.name || parsed.name === 'Jordan Reed') {
              parsed.name = 'Victoria Okajoe';
            }
          } else if (parsed.role === 'student' && !parsed.grade) {
            parsed.grade = 'SS3'; // Student must have a class
          }
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    // Return null if visitor has not registered or logged in
    return null;
  });

  const isRegistered = Boolean(currentUser || registeredStudent);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState<boolean>(false);
  const [isAdminHomeEditorOpen, setIsAdminHomeEditorOpen] = useState<boolean>(false);
  const [isAdminStudentsModalOpen, setIsAdminStudentsModalOpen] = useState<boolean>(false);

  // Registered students roster for the app (persisted in localStorage)
  const [registeredStudents, setRegisteredStudents] = useState<RegisteredStudentItem[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_registered_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => ({
            id: item.id || `reg-std-${idx}`,
            studentName: item.studentName || item.name || `Student ${idx + 1}`,
            studentClass: item.studentClass || item.grade || 'SS3',
            school: item.school || item.classSection || 'General High School',
            phoneNumber: item.phoneNumber || '',
            email: item.email || `${(item.studentName || item.name || 'student').toLowerCase().replace(/[^a-z0-9]/g, '.')}@student.echo.edu.ng`,
            registeredAt: item.registeredAt || 'Enrolled Student',
            lastLoginAt: item.lastLoginAt || 'Recent',
            isOnline: Boolean(item.isOnline),
            activeLocation: item.activeLocation,
            hasRedFlag: Boolean(item.hasRedFlag),
            redFlagReason: item.redFlagReason,
            redFlagDate: item.redFlagDate,
            status: item.status || 'Active',
            avatarBg: item.avatarBg || 'bg-emerald-600',
            timetableUploaded: Boolean(item.timetableUploaded),
            timetableFileName: item.timetableFileName || item.timetableName,
            timetableDataUrl: item.timetableDataUrl,
            timetableUploadedAt: item.timetableUploadedAt
          }));
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_REGISTERED_STUDENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('echo_plan_registered_students', JSON.stringify(registeredStudents));
    } catch (e) {
      console.warn('Failed to persist registered students', e);
    }
  }, [registeredStudents]);

  // Home page dynamic customization (editable by admin)
  const [homeCustomization, setHomeCustomization] = useState<HomePageCustomization>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_home_customization');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_HOME_CUSTOMIZATION;
  });

  // Planner vault uploaded files (admin uploadable, student accessible)
  const [plannerFiles, setPlannerFiles] = useState<PlannerFile[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_planner_files');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PLANNER_FILES;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_tasks');
      if (saved) return JSON.parse(saved);
    } catch {
      // storage error fallback
    }
    return INITIAL_TASKS;
  });

  const [habits, setHabits] = useState<HabitItem[]>(() => {
    try {
      const saved = localStorage.getItem('echo_plan_habits');
      if (saved) return JSON.parse(saved);
    } catch {
      // storage error fallback
    }
    return INITIAL_HABITS;
  });

  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);

  // Sync hash changes with browser navigation & protect restricted pages
  useEffect(() => {
    const handleHashChange = () => {
      const newPage = getPageFromHash();
      if (!isRegistered && !ALLOWED_UNREGISTERED_PAGES.includes(newPage)) {
        setPendingTargetPage(newPage);
        setCurrentPage('home');
        window.location.hash = '#/home';
        setIsNigeriaModalOpen(true);
        return;
      }
      setCurrentPage(prev => {
        if (prev !== newPage) {
          setPreviousPage(prev);
        }
        return newPage;
      });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isRegistered]);

  // Route guard: if currently on a restricted page while unregistered, redirect to home and open registration form
  useEffect(() => {
    if (!isRegistered && !ALLOWED_UNREGISTERED_PAGES.includes(currentPage)) {
      setPendingTargetPage(currentPage);
      setCurrentPage('home');
      window.location.hash = '#/home';
      setIsNigeriaModalOpen(true);
    }
  }, [currentPage, isRegistered]);

  // Update hash when page changes, or pop up registration form if user is not registered
  const navigateTo = (pageId: string) => {
    if (!isRegistered && !ALLOWED_UNREGISTERED_PAGES.includes(pageId)) {
      setPendingTargetPage(pageId);
      setIsNigeriaModalOpen(true);
      return;
    }

    if (pageId !== currentPage) {
      setPreviousPage(currentPage);
    }
    setCurrentPage(pageId);
    window.location.hash = `#/${pageId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe Back Navigation: takes the user back to where they previously were
  const handleGoBack = () => {
    setIsNigeriaModalOpen(false);
    setPendingTargetPage(null);
    if (!isRegistered && !ALLOWED_UNREGISTERED_PAGES.includes(currentPage)) {
      const target = ALLOWED_UNREGISTERED_PAGES.includes(previousPage) ? previousPage : 'home';
      setCurrentPage(target);
      window.location.hash = `#/${target}`;
    }
  };

  // Sync tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('echo_plan_tasks', JSON.stringify(tasks));
    } catch {
      // storage error fallback
    }
  }, [tasks]);

  // Sync habits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('echo_plan_habits', JSON.stringify(habits));
    } catch {
      // storage error fallback
    }
  }, [habits]);

  // Sync homeCustomization to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('echo_plan_home_customization', JSON.stringify(homeCustomization));
    } catch {
      // storage error fallback
    }
  }, [homeCustomization]);

  // Sync plannerFiles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('echo_plan_planner_files', JSON.stringify(plannerFiles));
    } catch {
      // storage error fallback
    }
  }, [plannerFiles]);

  // Listen for admin command to clear all other logged in sessions
  useEffect(() => {
    const handleClearLoginsEvent = (e: Event) => {
      const custom = e as CustomEvent<{ activeAdmin: User | null }>;
      if (custom.detail?.activeAdmin) {
        setCurrentUser(custom.detail.activeAdmin);
        setRegisteredStudent(null);
      } else {
        setCurrentUser(null);
        setRegisteredStudent(null);
      }
    };
    window.addEventListener('echo_plan_clear_logins', handleClearLoginsEvent);
    return () => window.removeEventListener('echo_plan_clear_logins', handleClearLoginsEvent);
  }, []);

  // Synchronize registeredStudents live presence and CBT red-flag strikes
  useEffect(() => {
    const studentUser = (currentUser && currentUser.role !== 'admin')
      ? currentUser
      : registeredStudent
        ? {
            name: registeredStudent.studentName,
            email: `${(registeredStudent.studentName || 'student').toLowerCase().replace(/[^a-z0-9]/g, '.')}@student.echo.edu.ng`,
            grade: registeredStudent.studentClass,
            school: registeredStudent.school
          }
        : null;

    let activeStrike: any = null;
    try {
      const strikeData = localStorage.getItem('echo_plan_exam_strike');
      if (strikeData) {
        activeStrike = JSON.parse(strikeData);
      }
    } catch {
      // ignore
    }

    const getLocationTitle = (page: string) => {
      switch (page) {
        case 'class': return 'CBT Exam Arena & Hall';
        case 'habits': return 'Habits Tracker & Strikes';
        case 'planner': return 'Daily Academic Planner';
        case 'tips': return 'Study Tools & Active Recall';
        case 'home': return 'Home & Announcements';
        case 'leadership': return 'Leadership & Problem Solving';
        case 'about': return 'About & Vision';
        case 'life-skills': return 'Leadership & Problem Solving';
        default: return 'Active in App';
      }
    };

    setRegisteredStudents(prevList => {
      let updated = [...prevList];
      let changed = false;

      // Sync strike if active
      if (activeStrike && activeStrike.studentName) {
        updated = updated.map(st => {
          if (
            st.studentName.toLowerCase() === activeStrike.studentName.toLowerCase() ||
            (activeStrike.studentEmail && st.email === activeStrike.studentEmail)
          ) {
            if (!st.hasRedFlag || st.redFlagReason !== activeStrike.reason) {
              changed = true;
              return {
                ...st,
                hasRedFlag: true,
                redFlagReason: activeStrike.reason || 'Departed active CBT practice exam room without submitting',
                redFlagDate: activeStrike.dateStr || 'Today'
              };
            }
          }
          return st;
        });
      }

      // Sync current student's online presence and location
      if (studentUser && studentUser.name) {
        const studentIndex = updated.findIndex(st => 
          st.studentName.toLowerCase() === studentUser.name.toLowerCase() ||
          (studentUser.email && st.email === studentUser.email)
        );

        const activeLocation = getLocationTitle(currentPage);

        if (studentIndex >= 0) {
          const currentEntry = updated[studentIndex];
          if (!currentEntry.isOnline || currentEntry.activeLocation !== activeLocation) {
            changed = true;
            updated[studentIndex] = {
              ...currentEntry,
              isOnline: true,
              lastLoginAt: 'Online now',
              activeLocation: activeLocation
            };
          }
        } else {
          changed = true;
          updated.unshift({
            id: `reg-std-${Date.now()}`,
            studentName: studentUser.name,
            studentClass: studentUser.grade || 'SS3',
            school: (studentUser as any).school || 'Nigerian Secondary School',
            phoneNumber: '+234 800 000 0000',
            email: studentUser.email || `${studentUser.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@student.echo.edu.ng`,
            registeredAt: 'Just now',
            lastLoginAt: 'Online now',
            isOnline: true,
            activeLocation: activeLocation,
            hasRedFlag: Boolean(activeStrike),
            redFlagReason: activeStrike?.reason,
            redFlagDate: activeStrike?.dateStr,
            status: 'Active',
            avatarBg: 'bg-emerald-600',
            timetableUploaded: false
          });
        }
      }

      return changed ? updated : prevList;
    });
  }, [currentUser, registeredStudent, currentPage]);

  // Registration handler for Nigerian student on the Class page
  const handleRegisterNigeria = (data: NigerianStudentRegistration) => {
    setRegisteredStudent(data);
    try {
      localStorage.setItem('echo_plan_nigeria_registration', JSON.stringify(data));
    } catch {
      // storage error fallback
    }

    // Synchronize currentUser profile
    const isUserAdmin = Boolean(data.isAdmin || currentUser?.role === 'admin' || currentUser?.role === 'student_admin');
    const updatedUser: User = {
      id: currentUser?.id || `user-ng-${Date.now()}`,
      name: data.studentName,
      email: isUserAdmin 
        ? 'ijikevictoriaokajoe@gmail.com' 
        : (currentUser?.email && currentUser.email !== 'ijikevictoriaokajoe@gmail.com' 
            ? currentUser.email 
            : `${data.studentName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@student.echo.edu.ng`),
      role: isUserAdmin ? 'admin' : 'student',
      grade: isUserAdmin ? undefined : data.studentClass, // Admin has NO class; registered student MUST have a class!
      academicStream: isUserAdmin ? undefined : (data.academicStream || 'science'),
      classSection: isUserAdmin ? 'Lead Administrator' : `${data.school} • Class ${data.studentClass} (${data.academicStream === 'art' ? 'Art' : 'Science'})`,
      avatarBg: isUserAdmin ? 'bg-indigo-600' : 'bg-emerald-600'
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('echo_plan_user', JSON.stringify(updatedUser));
    } catch {
      // storage error fallback
    }

    // Keep registered students roster in sync
    if (!isUserAdmin) {
      setRegisteredStudents(prev => {
        const studentNameClean = (data.studentName || '').trim().toLowerCase();
        const existingIdx = prev.findIndex(s => 
          (s.studentName || '').toLowerCase() === studentNameClean || 
          (data.phoneNumber && s.phoneNumber === data.phoneNumber)
        );
        const studentEntry: RegisteredStudentItem = {
          id: existingIdx >= 0 ? prev[existingIdx].id : `reg-std-${Date.now()}`,
          studentName: data.studentName,
          studentClass: data.studentClass,
          academicStream: data.academicStream || 'science',
          school: data.school,
          phoneNumber: data.phoneNumber,
          email: `${(data.studentName || 'student').toLowerCase().replace(/[^a-z0-9]/g, '.')}@student.echo.edu.ng`,
          registeredAt: data.registeredAt,
          lastLoginAt: 'Online now',
          isOnline: true,
          activeLocation: 'Academic Daily Planner',
          status: 'Active',
          avatarBg: 'bg-emerald-600',
          timetableUploaded: existingIdx >= 0 ? prev[existingIdx].timetableUploaded : false
        };

        if (existingIdx >= 0) {
          const copy = [...prev];
          copy[existingIdx] = { ...copy[existingIdx], ...studentEntry };
          return copy;
        }
        return [studentEntry, ...prev];
      });
    }

    setIsNigeriaModalOpen(false);
    playSuccessSound();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Navigate to the target page the student requested
    const destination = pendingTargetPage || 'planner';
    setPendingTargetPage(null);
    setCurrentPage(destination);
    window.location.hash = `#/${destination}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Student timetable updated handler (from Daily Plan page)
  const handleStudentTimetableUpdated = (timetable: StudentTimetable | null) => {
    if (!currentUser?.name) return;
    const currentUserNameClean = currentUser.name.trim().toLowerCase();
    setRegisteredStudents(prev => {
      return prev.map(student => {
        if ((student.studentName || '').trim().toLowerCase() === currentUserNameClean) {
          return {
            ...student,
            timetableUploaded: Boolean(timetable),
            timetableFileName: timetable?.fileName,
            timetableDataUrl: timetable?.dataUrl,
            timetableUploadedAt: timetable?.uploadedAt
          };
        }
        return student;
      });
    });
  };

  // Admin student directory management
  const handleDeleteRegisteredStudent = (id: string) => {
    setRegisteredStudents(prev => {
      const updated = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem('echo_plan_registered_students', JSON.stringify(updated));
      } catch {
        // fallback
      }
      return updated;
    });
    // If the deleted student was currently logged in, clear their session immediately
    if (currentUser && currentUser.id === id) {
      setCurrentUser(null);
      try {
        localStorage.removeItem('echo_plan_user');
        localStorage.removeItem('echo_plan_nigeria_registration');
      } catch {
        // fallback
      }
    }
    playSuccessSound();
  };

  const handleAddRegisteredStudent = (student: RegisteredStudentItem) => {
    setRegisteredStudents(prev => [student, ...prev]);
    playSuccessSound();
  };

  // Update user's chosen display name
  const handleUpdateUserName = (newName: string) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      name: newName
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('echo_plan_user', JSON.stringify(updatedUser));
    } catch {
      // storage error fallback
    }
    playSuccessSound();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Admin Home Page Customization update
  const handleUpdateHomeCustomization = (updated: HomePageCustomization) => {
    setHomeCustomization(updated);
    playSuccessSound();
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Admin File Upload in Planner
  const handleUploadPlannerFile = (fileData: Omit<PlannerFile, 'id' | 'uploadedAt'>) => {
    const newFile: PlannerFile = {
      ...fileData,
      id: `file-${Date.now()}`,
      uploadedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    };
    setPlannerFiles(prev => [newFile, ...prev]);
    playSuccessSound();
    confetti({
      particleCount: 60,
      spread: 65,
      origin: { y: 0.6 }
    });
  };

  // Delete File in Planner
  const handleDeletePlannerFile = (fileId: string) => {
    setPlannerFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Login handler
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('echo_plan_user', JSON.stringify(user));
    } catch {
      // storage error fallback
    }

    playSuccessSound();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setIsLoginModalOpen(false);
    const destination = pendingTargetPage || ((user.role === 'admin' || user.role === 'student_admin') ? 'class' : 'planner');
    setPendingTargetPage(null);
    setCurrentPage(destination);
    window.location.hash = `#/${destination}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setRegisteredStudent(null);
    try {
      localStorage.removeItem('echo_plan_user');
      localStorage.removeItem('echo_plan_nigeria_registration');
    } catch {
      // fallback
    }
    setPendingTargetPage(null);
    setCurrentPage('home');
    window.location.hash = '#/home';
  };

  // Toggle Task Completion
  const handleToggleTask = (id: string) => {
    setTasks(prevTasks => {
      const nextTasks = prevTasks.map(t => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            playSuccessSound();
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      });

      // Celebrate if all tasks completed
      const allDone = nextTasks.length > 0 && nextTasks.every(t => t.completed);
      if (allDone) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      return nextTasks;
    });
  };

  // Add Task
  const handleAddTask = (taskData: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
  };

  // Delete Task
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Clear Completed
  const handleClearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  // Toggle Habit Day
  const handleToggleHabitDay = (habitId: string, dayIndex: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const nextDays = [...h.completedDays];
        const wasDone = nextDays[dayIndex];
        nextDays[dayIndex] = !wasDone;
        if (!wasDone) playSuccessSound();

        const newStreak = !wasDone ? h.streak + 1 : Math.max(0, h.streak - 1);
        return {
          ...h,
          completedDays: nextDays,
          streak: newStreak
        };
      }
      return h;
    }));
  };

  // Add Habit
  const handleAddHabit = (habitData: Omit<HabitItem, 'id' | 'streak'>) => {
    const newHabit: HabitItem = {
      ...habitData,
      id: `habit-${Date.now()}`,
      streak: 1
    };
    setHabits(prev => [...prev, newHabit]);
  };

  return (
    <div className="min-h-screen bg-[#f6f9ff] text-[#13264b] flex flex-col justify-between selection:bg-[#61c6fb] selection:text-[#081a3d]">
      <div>
        {/* Top Navigation Bar with Authentication & Class tab */}
        <Navbar 
          onNavigate={navigateTo} 
          currentPage={currentPage}
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          onOpenEditName={() => setIsEditNameModalOpen(true)}
          onOpenRegistration={() => {
            setPendingTargetPage('planner');
            setIsNigeriaModalOpen(true);
          }}
          onOpenAdminStudents={() => setIsAdminStudentsModalOpen(true)}
        />

        {/* Dynamic Page Rendering */}
        <main className="transition-opacity duration-300">
          {currentPage === 'home' && (
            <HomePage
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
              onNavigate={navigateTo}
              customization={homeCustomization}
              currentUser={currentUser}
              onOpenAdminEditor={() => setIsAdminHomeEditorOpen(true)}
              onOpenEditName={() => setIsEditNameModalOpen(true)}
            />
          )}

          {currentPage === 'class' && (
            <ClassPage
              currentUser={currentUser}
              registeredStudent={registeredStudent}
              onOpenRegistrationModal={() => {
                setPendingTargetPage('class');
                setIsNigeriaModalOpen(true);
              }}
              onNavigate={navigateTo}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              onBack={handleGoBack}
              previousPageName={getPageDisplayName(previousPage)}
              registeredStudents={registeredStudents}
              onDeleteRegisteredStudent={handleDeleteRegisteredStudent}
              onAddRegisteredStudent={handleAddRegisteredStudent}
            />
          )}

          {currentPage === 'about' && (
            <AboutPage onNavigate={navigateTo} />
          )}

          {currentPage === 'features' && (
            <FeaturesPage onNavigate={navigateTo} />
          )}

          {currentPage === 'planner' && (
            isRegistered ? (
              <PlannerPage
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onClearCompleted={handleClearCompleted}
                currentUser={currentUser}
                plannerFiles={plannerFiles}
                onUploadPlannerFile={handleUploadPlannerFile}
                onDeletePlannerFile={handleDeletePlannerFile}
                onTimetableUpdated={handleStudentTimetableUpdated}
                onNavigateToExam={() => navigateTo('class')}
                onNavigateToLifeSkills={() => navigateTo('leadership')}
                onNavigateToLeadership={() => navigateTo('leadership')}
              />
            ) : (
              <AccessRestrictedPrompt
                pageName="Daily Plan"
                onRegister={() => {
                  setPendingTargetPage('planner');
                  setIsNigeriaModalOpen(true);
                }}
                onLogin={() => {
                  setPendingTargetPage('planner');
                  setIsLoginModalOpen(true);
                }}
                onGoHome={() => navigateTo('home')}
              />
            )
          )}

          {currentPage === 'habits' && (
            isRegistered ? (
              <HabitsPage
                habits={habits}
                onToggleHabitDay={handleToggleHabitDay}
                onAddHabit={handleAddHabit}
                currentUser={currentUser}
              />
            ) : (
              <AccessRestrictedPrompt
                pageName="Habits and Strikes"
                onRegister={() => {
                  setPendingTargetPage('habits');
                  setIsNigeriaModalOpen(true);
                }}
                onLogin={() => {
                  setPendingTargetPage('habits');
                  setIsLoginModalOpen(true);
                }}
                onGoHome={() => navigateTo('home')}
              />
            )
          )}

          {currentPage === 'tips' && (
            isRegistered ? (
              <StudyPage currentUser={currentUser} />
            ) : (
              <AccessRestrictedPrompt
                pageName="Study Tools"
                onRegister={() => {
                  setPendingTargetPage('tips');
                  setIsNigeriaModalOpen(true);
                }}
                onLogin={() => {
                  setPendingTargetPage('tips');
                  setIsLoginModalOpen(true);
                }}
                onGoHome={() => navigateTo('home')}
              />
            )
          )}

          {(currentPage === 'leadership' || currentPage === 'life-skills') && (
            <LeadershipPage 
              currentUser={currentUser}
              onNavigate={navigateTo}
              onAddStudyTask={handleAddTask}
            />
          )}

          {currentPage === 'contact' && (
            <ContactPage 
              currentUser={currentUser}
              onNavigateToClassAdmin={() => navigateTo('class')}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Adjustable Nigeria Student Registration Modal with Back Navigation */}
      <NigeriaStudentModal
        isOpen={isNigeriaModalOpen}
        onRegister={handleRegisterNigeria}
        onExit={handleGoBack}
        previousPageName={getPageDisplayName(previousPage)}
        targetPageName={pendingTargetPage ? getPageDisplayName(pendingTargetPage) : undefined}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* User Login & Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        previousPageName={getPageDisplayName(previousPage)}
      />

      {/* Edit Student Display Name Modal */}
      <EditDisplayNameModal
        isOpen={isEditNameModalOpen}
        onClose={() => setIsEditNameModalOpen(false)}
        currentName={currentUser?.name || ''}
        userRole={currentUser?.role || 'student'}
        onSaveName={handleUpdateUserName}
      />

      {/* Admin Home Page Editor Modal */}
      <AdminHomeEditorModal
        isOpen={isAdminHomeEditorOpen}
        onClose={() => setIsAdminHomeEditorOpen(false)}
        customization={homeCustomization}
        onSave={handleUpdateHomeCustomization}
      />

      {/* Video Tour & Ambient Focus Lounge Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Quick Add Task Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Admin Registered Students Directory Modal */}
      <AdminRegisteredStudentsModal
        isOpen={isAdminStudentsModalOpen}
        onClose={() => setIsAdminStudentsModalOpen(false)}
        registeredStudents={registeredStudents}
        onDeleteStudent={handleDeleteRegisteredStudent}
        onAddStudent={handleAddRegisteredStudent}
        currentUser={currentUser}
      />
    </div>
  );
}
