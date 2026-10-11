import { User, RegisteredStudentItem } from '../types';
import { INITIAL_REGISTERED_STUDENTS } from '../data/initialClassData';
import { logStudentLoginEvent } from './loginAuditManager';

export interface PermanentAdminAccount {
  id: string; // 'admin-1'
  name: string;
  email: string;
  password: string; // Permanent password written by admin
  grade?: string; // Admin does NOT have a class
  school: string;
  isPermanent: true;
  registeredAt: string;
  slotNumber: 1;
}

export const STORAGE_KEY_ADMINS = 'echo_plan_permanent_admins';
export const STORAGE_KEY_ADMIN = 'echo_plan_permanent_admin';
export const STORAGE_KEY_STUDENTS = 'echo_plan_registered_students';
export const STORAGE_KEY_USER = 'echo_plan_user';
export const STORAGE_KEY_NIGERIA = 'echo_plan_nigeria_registration';

// User's specified email for the Sole Administrator
export const PERMANENT_ADMIN_EMAIL = 'ijikevictoriaokajoe@gmail.com';
export const PERMANENT_ADMIN_NAME = 'Victoria Okajoe';

// Maximum number of administrators allowed in the system: STRICTLY 1 ADMIN ONLY
export const MAX_ADMINS = 1;

// Default Sole Admin configuration
const DEFAULT_SOLE_ADMIN: PermanentAdminAccount = {
  id: 'admin-1',
  name: PERMANENT_ADMIN_NAME,
  email: PERMANENT_ADMIN_EMAIL,
  password: 'admin123',
  school: 'General School Administration',
  isPermanent: true,
  registeredAt: 'Sole Administrator',
  slotNumber: 1
};

/**
 * Retrieves the sole permanent administrator account.
 * Strictly enforces that there is ONLY ONE admin allowed, and that admin is Victoria Okajoe.
 */
export const getPermanentAdmin = (): PermanentAdminAccount => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ADMIN);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed) {
        return {
          id: 'admin-1',
          name: parsed.name || PERMANENT_ADMIN_NAME,
          email: PERMANENT_ADMIN_EMAIL,
          password: parsed.password || 'admin123',
          school: parsed.school || 'General School Administration',
          isPermanent: true,
          registeredAt: 'Sole Administrator',
          slotNumber: 1
        };
      }
    }
  } catch {
    // fallback
  }

  // Check legacy array storage key
  try {
    const savedAdmins = localStorage.getItem(STORAGE_KEY_ADMINS);
    if (savedAdmins) {
      const parsedList = JSON.parse(savedAdmins);
      if (Array.isArray(parsedList) && parsedList.length > 0) {
        const first = parsedList[0];
        const admin: PermanentAdminAccount = {
          id: 'admin-1',
          name: first.name || PERMANENT_ADMIN_NAME,
          email: PERMANENT_ADMIN_EMAIL,
          password: first.password || 'admin123',
          school: first.school || 'General School Administration',
          isPermanent: true,
          registeredAt: 'Sole Administrator',
          slotNumber: 1
        };
        localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(admin));
        localStorage.setItem(STORAGE_KEY_ADMINS, JSON.stringify([admin]));
        return admin;
      }
    }
  } catch {
    // ignore
  }

  // Persist default sole admin
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(DEFAULT_SOLE_ADMIN));
    localStorage.setItem(STORAGE_KEY_ADMINS, JSON.stringify([DEFAULT_SOLE_ADMIN]));
  } catch {
    // ignore
  }
  return DEFAULT_SOLE_ADMIN;
};

/**
 * Returns array containing the sole administrator (for backwards compatibility).
 */
export const getPermanentAdmins = (): PermanentAdminAccount[] => {
  const admin = getPermanentAdmin();
  return [admin];
};

/**
 * Clears any other logged-in user or student sessions across the entire app.
 * Ensures only the sole admin remains logged in (or all are cleared).
 */
export const clearAllOtherLogins = (activeAdminUser?: User): { cleared: boolean; count: number } => {
  try {
    // Clear Nigerian student active registration session
    localStorage.removeItem(STORAGE_KEY_NIGERIA);

    if (activeAdminUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(activeAdminUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }

    // Broadcast event to notify all open components to clear state immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('echo_plan_clear_logins', {
          detail: { activeAdmin: activeAdminUser || null }
        })
      );
    }

    return { cleared: true, count: 1 };
  } catch {
    return { cleared: false, count: 0 };
  }
};

/**
 * Registers a permanent password for the SOLE administrator.
 * User requirement: "It should be only 1 admin and and should be me and there should not be student admin only admin and allow me register as admin and let it be only me"
 */
export const registerPermanentAdmin = (data: {
  name?: string;
  email?: string;
  password: string; // The permanent password written by the admin
  school?: string;
  clearOtherLogins?: boolean;
}): { success: boolean; user?: User; admin?: PermanentAdminAccount; error?: string } => {
  const pwd = (data.password || '').trim();
  if (!pwd) {
    return {
      success: false,
      error: 'Permanent password is required. Please enter the permanent admin password.'
    };
  }

  // Check: "and allow me register as admin and let it be only me"
  // If email is specified and doesn't match Victoria Okajoe's email, reject!
  const emailInput = (data.email || '').trim().toLowerCase();
  if (emailInput && emailInput !== PERMANENT_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: `Registration Restricted: Only Victoria Okajoe (${PERMANENT_ADMIN_EMAIL}) is permitted to register as the School Administrator. There is strictly only 1 Admin in this system.`
    };
  }

  const currentAdmin = getPermanentAdmin();
  const adminName = (data.name || '').trim() || currentAdmin.name || PERMANENT_ADMIN_NAME;

  const updatedAdmin: PermanentAdminAccount = {
    id: 'admin-1',
    name: adminName,
    email: PERMANENT_ADMIN_EMAIL,
    password: pwd, // Admin writes their own permanent password
    school: (data.school || '').trim() || currentAdmin.school || 'General School Administration',
    isPermanent: true,
    registeredAt: 'Sole Administrator',
    slotNumber: 1
  };

  try {
    localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(updatedAdmin));
    localStorage.setItem(STORAGE_KEY_ADMINS, JSON.stringify([updatedAdmin]));
  } catch {
    // ignore
  }

  const adminUser: User = {
    id: updatedAdmin.id,
    name: updatedAdmin.name,
    email: updatedAdmin.email,
    role: 'admin', // Sole Admin role (NOT student_admin)
    grade: undefined, // Admin does NOT have a class
    classSection: 'Sole Administrator',
    avatarBg: 'bg-indigo-600',
    school: updatedAdmin.school,
    password: updatedAdmin.password
  };

  // Clear all other student or visitor logins
  if (data.clearOtherLogins !== false) {
    clearAllOtherLogins(adminUser);
  }

  return {
    success: true,
    user: adminUser,
    admin: updatedAdmin
  };
};

/**
 * Initializes or updates permanent admin.
 */
export const setPermanentAdmin = (
  account: Omit<PermanentAdminAccount, 'isPermanent' | 'registeredAt'>
): PermanentAdminAccount => {
  const res = registerPermanentAdmin({
    name: account.name,
    email: account.email,
    password: account.password,
    school: account.school,
    clearOtherLogins: false
  });
  return res.admin || getPermanentAdmin();
};

/**
 * Validates whether the given password matches the sole permanent admin password.
 */
export const validateAdminPassword = (password: string): boolean => {
  if (!password) return false;
  const admin = getPermanentAdmin();
  return admin.password.trim() === password.trim();
};

/**
 * Attempt to register or login as admin.
 * STRICT RULE: Only 1 admin exists in the school system: Victoria Okajoe (ijikevictoriaokajoe@gmail.com).
 */
export const attemptAdminAccess = (credentials: {
  password: string;
  name?: string;
  email?: string;
  school?: string;
}): { success: boolean; user?: User; error?: string } => {
  const admin = getPermanentAdmin();

  if (!credentials.password || !credentials.password.trim()) {
    return {
      success: false,
      error: 'Please enter your permanent administrator password.'
    };
  }

  const pwd = credentials.password.trim();
  const emailInput = (credentials.email || '').trim().toLowerCase();

  // If email is provided, verify it belongs to Victoria Okajoe
  if (emailInput && emailInput !== PERMANENT_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: `Access Denied: Only Victoria Okajoe (${PERMANENT_ADMIN_EMAIL}) is the authorized School Administrator.`
    };
  }

  if (admin.password.trim() !== pwd) {
    return {
      success: false,
      error: 'Incorrect administrator password. Please enter your permanent password or register your admin account.'
    };
  }

  const adminUser: User = {
    id: admin.id,
    name: credentials.name?.trim() || admin.name,
    email: admin.email,
    role: 'admin',
    grade: undefined, // Admin does NOT have a class
    classSection: 'Sole Administrator',
    avatarBg: 'bg-indigo-600',
    school: credentials.school || admin.school,
    password: admin.password
  };

  return {
    success: true,
    user: adminUser
  };
};

/**
 * Generates or derives a unique, distinct default password for a student
 * based on their registered name and class (never 'student123').
 */
export const getDistinctStudentPassword = (name: string, studentClass?: string): string => {
  const firstName = (name || 'Student').trim().split(/\s+/)[0] || 'Student';
  const cleaned = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const cls = (studentClass || 'SS1').replace(/[^a-zA-Z0-9]/g, '') || 'SS1';
  return `${cleaned}#${cls}`;
};

/**
 * Returns all registered students from localStorage, seeding with initial students if empty.
 * Automatically upgrades any legacy accounts using 'student123' to their distinct individual passwords.
 */
export const getAllRegisteredStudents = (): RegisteredStudentItem[] => {
  try {
    const existingStr = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (existingStr) {
      const parsed = JSON.parse(existingStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let hasLegacyStudent123 = false;
        const normalized = parsed.map((std: RegisteredStudentItem) => {
          if (!std.password || std.password === 'student123') {
            hasLegacyStudent123 = true;
            const initMatch = INITIAL_REGISTERED_STUDENTS.find(
              i => (i.email && std.email && i.email.toLowerCase() === std.email.toLowerCase()) ||
                   i.studentName.toLowerCase() === std.studentName.toLowerCase()
            );
            return {
              ...std,
              password: initMatch?.password || getDistinctStudentPassword(std.studentName, std.studentClass)
            };
          }
          return std;
        });

        if (hasLegacyStudent123) {
          localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(normalized));
        }
        return normalized;
      }
    }
  } catch {
    // ignore
  }

  // Seed with INITIAL_REGISTERED_STUDENTS
  try {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_REGISTERED_STUDENTS));
  } catch {
    // ignore
  }
  return INITIAL_REGISTERED_STUDENTS;
};

/**
 * Register a student.
 * Requirement:
 * "When a student logs in, let the app not generate a password for the student when they register.
 * Let the student write his password, not the app. When the student writes the password, let it be
 * put in his own account so other people can't register to his own account. So when he's logging in,
 * if the password corresponds with his password, name, and then email, let the person log into the account."
 */
export const registerStudentMember = (data: {
  name: string;
  email?: string;
  password?: string;
  grade: string; // Required: student must have an assigned class
  school?: string;
  age?: number | string;
  phoneNumber?: string;
}): { success: boolean; user?: User; student?: RegisteredStudentItem; error?: string } => {
  const studentName = (data.name || '').trim();
  if (!studentName) {
    return {
      success: false,
      error: 'Student full name is necessary for registration.'
    };
  }

  const finalGrade = (data.grade || '').trim();
  if (!finalGrade) {
    return {
      success: false,
      error: 'Every registered student must have an assigned class (e.g. SS3, SS2, SS1).'
    };
  }

  const school = (data.school || '').trim() || 'General Secondary School';

  const rawPassword = (data.password || '').trim();
  if (!rawPassword) {
    return {
      success: false,
      error: 'Password is required. The app does not generate passwords for students; please write your own password.'
    };
  }

  if (rawPassword.toLowerCase() === 'student123') {
    return {
      success: false,
      error: 'Registration rejected: "student123" is not allowed. Please write your own unique personal student password.'
    };
  }

  const email = (data.email || '').trim() || `${studentName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@student.echo.edu.ng`;

  // Protect Admin email from being used as student
  if (email.toLowerCase() === PERMANENT_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: 'This email is reserved for the School Administrator. Please use your student email address or register as Administrator.'
    };
  }

  // STRICT INDIVIDUAL ACCOUNT SECURITY:
  // "When the student writes the password, let it be put in his own account so other people can't register to his own account."
  try {
    const existing = getAllRegisteredStudents();

    // Check if email already registered
    const existingWithEmail = existing.find(
      s => s.email && s.email.toLowerCase() === email.toLowerCase()
    );
    if (existingWithEmail) {
      return {
        success: false,
        error: `This email (${email}) is already registered and locked to student "${existingWithEmail.studentName}". Other people cannot register to an existing account. Please switch to Student Sign In to log into your account.`
      };
    }

    // Check if exact full name is already registered
    const existingWithName = existing.find(
      s => s.studentName.toLowerCase() === studentName.toLowerCase()
    );
    if (existingWithName) {
      return {
        success: false,
        error: `A student account is already registered under the name "${studentName}" (${existingWithName.email}). To protect student accounts and prevent others from registering to your profile, please sign in using your registered password.`
      };
    }

    const studentItem: RegisteredStudentItem = {
      id: `user-student-${Date.now()}`,
      studentName,
      studentClass: finalGrade,
      school,
      email,
      password: rawPassword, // Persist the exact password the student wrote
      age: data.age || 16,
      phoneNumber: data.phoneNumber?.trim() || undefined,
      registeredAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastLoginAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Active',
      avatarBg: 'bg-emerald-600',
      timetableUploaded: false
    };

    const studentUser: User = {
      id: studentItem.id,
      name: studentName,
      email: studentItem.email || email,
      role: 'student',
      grade: finalGrade,
      classSection: `${school} • Class ${finalGrade}`,
      avatarBg: 'bg-emerald-600',
      school,
      age: studentItem.age,
      password: rawPassword
    };

    const updatedList = [studentItem, ...existing];
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updatedList));

    try {
      logStudentLoginEvent({
        id: studentItem.id,
        name: studentItem.studentName,
        email: studentItem.email,
        grade: studentItem.studentClass,
        school: studentItem.school
      });
    } catch {
      // ignore
    }

    return {
      success: true,
      user: studentUser,
      student: studentItem
    };
  } catch {
    return {
      success: false,
      error: 'An error occurred while saving your student registration. Please try again.'
    };
  }
};

/**
 * Validates login credentials for a student against registered student records.
 * User requirement:
 * "When a student logs in, let the app not generate a password for the student when they register.
 * Let the student write his password, not the app. When the student writes the password, let it be
 * put in his own account so other people can't register to his own account. So when he's logging in,
 * if the password corresponds with his password, name, and then email, let the person log into the account.
 * When students are logging in, give passwords to students, and the passwords should be different.
 * Each student should have a password relating to the password the student wrote when registering into a new account.
 * So students are not supposed to be registering as student123. Let it correspond with their own password
 * they wrote when registering. Let it be saved. When you register and you write your password, let it be saved.
 * When you're logging in, it should be saved. When you're logging in, use the same password, the same email,
 * the same name, not student123."
 */
export const attemptStudentLogin = (credentials: {
  email: string;
  password: string;
  name?: string;
  grade?: string;
}): { success: boolean; user?: User; student?: RegisteredStudentItem; error?: string } => {
  const emailInput = (credentials.email || '').trim().toLowerCase();
  const nameInput = (credentials.name || '').trim();
  const passwordInput = (credentials.password || '').trim();
  const gradeInput = (credentials.grade || '').trim().toUpperCase();

  if (!emailInput) {
    return {
      success: false,
      error: 'Please enter your registered student email address.'
    };
  }

  if (!passwordInput) {
    return {
      success: false,
      error: 'Please enter your registered student password. Each account is private.'
    };
  }

  // Reject generic 'student123'
  if (passwordInput.toLowerCase() === 'student123') {
    return {
      success: false,
      error: 'Access denied: "student123" is not your registered password. Please enter the private password you created when registering.'
    };
  }

  // Prevent logging in as admin through student portal
  if (emailInput === PERMANENT_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: 'This email belongs to the School Administrator. Please switch to the Administrator Login tab to log in.'
    };
  }

  const registered = getAllRegisteredStudents();

  // Find candidate student by registered email
  const student = registered.find(s => (s.email || '').toLowerCase() === emailInput);

  if (!student) {
    return {
      success: false,
      error: `No registered student account found for email "${credentials.email}". Please verify your email or click "Create New Account" to register.`
    };
  }

  // If student name is provided, ensure it corresponds with registered name
  if (nameInput) {
    const registeredName = student.studentName.trim().toLowerCase();
    const inputName = nameInput.toLowerCase();
    if (registeredName !== inputName && !registeredName.includes(inputName) && !inputName.includes(registeredName)) {
      return {
        success: false,
        error: `Name mismatch: The name "${credentials.name}" does not correspond with the registered name for this email account ("${student.studentName}").`
      };
    }
  }

  // Check student class / grade
  if (gradeInput && student.studentClass && student.studentClass.toUpperCase() !== gradeInput) {
    return {
      success: false,
      error: `Class mismatch: Your account is registered in Class ${student.studentClass}, not Class ${credentials.grade}. Please select Class ${student.studentClass} to log in.`
    };
  }

  // STRICT PASSWORD VERIFICATION:
  // Must correspond with student's saved password (not student123)
  const storedPassword = student.password || getDistinctStudentPassword(student.studentName, student.studentClass);
  if (passwordInput !== storedPassword) {
    return {
      success: false,
      error: `Incorrect student password. Access denied: other users cannot access this account. The password entered does not correspond with the password registered for student "${student.studentName}". Please enter the password you wrote when registering.`
    };
  }

  // Update last login
  student.lastLoginAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Log real-time student login event for global administrator monitoring
  try {
    logStudentLoginEvent({
      id: student.id,
      name: student.studentName,
      email: student.email || emailInput,
      grade: student.studentClass,
      school: student.school
    });
  } catch {
    // ignore
  }

  const studentUser: User = {
    id: student.id,
    name: student.studentName,
    email: student.email || emailInput,
    role: 'student', // Strictly Student
    grade: student.studentClass,
    classSection: `${student.school} • Class ${student.studentClass}`,
    avatarBg: student.avatarBg || 'bg-emerald-600',
    school: student.school,
    age: student.age,
    password: storedPassword
  };

  return {
    success: true,
    user: studentUser,
    student
  };
};

/**
 * Validates Administrator login credentials.
 * User requirement:
 * "admin will just only put his name, password, and email"
 */
export const attemptAdminLogin = (credentials: {
  name: string;
  email: string;
  password: string;
}): { success: boolean; user?: User; error?: string } => {
  const nameInput = (credentials.name || '').trim();
  const emailInput = (credentials.email || '').trim().toLowerCase();
  const passwordInput = (credentials.password || '').trim();

  if (!nameInput) {
    return { success: false, error: 'Please enter administrator full name.' };
  }
  if (!emailInput) {
    return { success: false, error: 'Please enter administrator email address.' };
  }
  if (!passwordInput) {
    return { success: false, error: 'Please enter administrator password.' };
  }

  if (emailInput !== PERMANENT_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: `Access Denied: Only Victoria Okajoe (${PERMANENT_ADMIN_EMAIL}) is the authorized Administrator. Students must use the Student Login tab.`
    };
  }

  const admin = getPermanentAdmin();
  if (admin.password.trim() !== passwordInput) {
    return {
      success: false,
      error: `Incorrect administrator password for ${admin.name}. Please enter your permanent administrator password.`
    };
  }

  const adminUser: User = {
    id: admin.id,
    name: nameInput || admin.name,
    email: PERMANENT_ADMIN_EMAIL,
    role: 'admin', // Sole Administrator
    grade: undefined,
    classSection: 'Sole Administrator',
    avatarBg: 'bg-indigo-600',
    school: admin.school,
    password: admin.password
  };

  return {
    success: true,
    user: adminUser
  };
};

/**
 * Look up a student by email or name to show their registered details
 */
export const findStudentByEmailOrName = (query: string): RegisteredStudentItem | undefined => {
  if (!query || !query.trim()) return undefined;
  const clean = query.trim().toLowerCase();
  const registered = getAllRegisteredStudents();
  return registered.find(s => 
    (s.email && s.email.toLowerCase() === clean) ||
    s.studentName.toLowerCase() === clean ||
    (s.phoneNumber && s.phoneNumber.replace(/\s+/g, '') === clean.replace(/\s+/g, ''))
  );
};

/**
 * Unified Login for both Student and Sole Admin (Victoria Okajoe).
 * User requirement:
 * "It should be only 1 admin and and should be me and there should not be student admin only admin and allow me register as admin and let it be only me"
 * "Rearrange the login so it for both student and admin so you just write your name password and email"
 */
export const attemptUnifiedLogin = (credentials: {
  name: string;
  email: string;
  password: string;
}): { success: boolean; user?: User; role?: 'admin' | 'student'; error?: string } => {
  const nameInput = (credentials.name || '').trim();
  const emailInput = (credentials.email || '').trim().toLowerCase();
  const passwordInput = (credentials.password || '').trim();

  if (!nameInput) {
    return {
      success: false,
      error: 'Please enter your name.'
    };
  }

  if (!emailInput) {
    return {
      success: false,
      error: 'Please enter your email address.'
    };
  }

  if (!passwordInput) {
    return {
      success: false,
      error: 'Please enter your password.'
    };
  }

  const admin = getPermanentAdmin();
  const registeredStudents = getAllRegisteredStudents();

  // 1. CHECK IF USER IS THE SOLE ADMINISTRATOR (VICTORIA OKAJOE)
  const isVictoriaEmail = emailInput === PERMANENT_ADMIN_EMAIL.toLowerCase();
  const isVictoriaName = nameInput.toLowerCase().includes('victoria') || nameInput.toLowerCase().includes('okajoe');
  const isPasswordMatchAdmin = admin.password.trim() === passwordInput;

  if (isVictoriaEmail || (isVictoriaName && isPasswordMatchAdmin)) {
    if (!isPasswordMatchAdmin) {
      return {
        success: false,
        error: `Incorrect password for Administrator (${admin.name}). Please enter your permanent admin password.`
      };
    }

    const adminUser: User = {
      id: admin.id,
      name: nameInput || admin.name,
      email: PERMANENT_ADMIN_EMAIL,
      role: 'admin', // Sole Administrator
      grade: undefined, // Admins oversee all classes
      classSection: 'Sole Administrator',
      avatarBg: 'bg-indigo-600',
      school: admin.school,
      password: admin.password
    };

    return {
      success: true,
      user: adminUser,
      role: 'admin'
    };
  }

  // If someone attempts to log in as admin with non-Victoria email
  if (emailInput.includes('admin') && !isVictoriaEmail) {
    return {
      success: false,
      error: `Access Denied: Only Victoria Okajoe (${PERMANENT_ADMIN_EMAIL}) is the Administrator. Other users must log in as registered students.`
    };
  }

  // 2. CHECK IF CREDENTIALS MATCH A REGISTERED STUDENT
  const matchedStudent = registeredStudents.find(s => {
    const sEmail = (s.email || '').toLowerCase();
    const sName = (s.studentName || '').toLowerCase();
    return sEmail === emailInput || sName === nameInput.toLowerCase();
  });

  if (matchedStudent) {
    const storedPassword = matchedStudent.password || getDistinctStudentPassword(matchedStudent.studentName, matchedStudent.studentClass);
    if (storedPassword !== passwordInput) {
      return {
        success: false,
        error: `Incorrect password for student "${matchedStudent.studentName}". Please enter your registered student password (do not use "student123").`
      };
    }

    // Success as Student!
    const studentUser: User = {
      id: matchedStudent.id,
      name: matchedStudent.studentName,
      email: matchedStudent.email || emailInput,
      role: 'student',
      grade: matchedStudent.studentClass,
      classSection: `${matchedStudent.school} • Class ${matchedStudent.studentClass}`,
      avatarBg: matchedStudent.avatarBg || 'bg-emerald-600',
      school: matchedStudent.school,
      age: matchedStudent.age,
      password: storedPassword
    };

    return {
      success: true,
      user: studentUser,
      role: 'student'
    };
  }

  // Fallback match: if password matches student by partial name
  const studentByPassword = registeredStudents.find(
    s => s.password && s.password !== 'student123' && s.password === passwordInput
  );
  if (studentByPassword && (
    studentByPassword.studentName.toLowerCase().includes(nameInput.toLowerCase()) || 
    nameInput.toLowerCase().includes(studentByPassword.studentName.toLowerCase())
  )) {
    const studentUser: User = {
      id: studentByPassword.id,
      name: studentByPassword.studentName,
      email: studentByPassword.email || emailInput,
      role: 'student',
      grade: studentByPassword.studentClass,
      classSection: `${studentByPassword.school} • Class ${studentByPassword.studentClass}`,
      avatarBg: studentByPassword.avatarBg || 'bg-emerald-600',
      school: studentByPassword.school,
      age: studentByPassword.age,
      password: studentByPassword.password
    };
    return {
      success: true,
      user: studentUser,
      role: 'student'
    };
  }

  return {
    success: false,
    error: "Account details do not correspond. If you are a student, tap 'Register as Student' to create your account. If you are Victoria Okajoe, verify your permanent admin password or tap 'Register as Admin'."
  };
};

/**
 * Returns all registered students (legacy wrapper).
 */
export const getRegisteredStudentsList = (): RegisteredStudentItem[] => {
  return getAllRegisteredStudents();
};

export const STORAGE_KEY_STUDENT_STREAM = 'echo_plan_student_stream';

/**
 * Retrieves the effective academic stream for a student: 'science' | 'art'
 * Respects student profile, registration, and active selection.
 */
export const getEffectiveStudentStream = (user?: User | null): 'science' | 'art' => {
  if (user?.academicStream === 'art') return 'art';
  if (user?.academicStream === 'science') return 'science';

  try {
    const saved = localStorage.getItem(STORAGE_KEY_STUDENT_STREAM);
    if (saved === 'art' || saved === 'science') return saved;

    const nigeriaRaw = localStorage.getItem(STORAGE_KEY_NIGERIA);
    if (nigeriaRaw) {
      const parsed = JSON.parse(nigeriaRaw);
      if (parsed?.academicStream === 'art') return 'art';
      if (parsed?.academicStream === 'science') return 'science';
    }

    const userRaw = localStorage.getItem(STORAGE_KEY_USER);
    if (userRaw) {
      const parsed = JSON.parse(userRaw);
      if (parsed?.academicStream === 'art') return 'art';
      if (parsed?.academicStream === 'science') return 'science';
    }
  } catch {
    // fallback
  }

  return 'science';
};

/**
 * Saves and broadcasts academic stream change across the app.
 */
export const setEffectiveStudentStream = (stream: 'science' | 'art', user?: User | null) => {
  try {
    localStorage.setItem(STORAGE_KEY_STUDENT_STREAM, stream);

    if (user) {
      user.academicStream = stream;
    }

    const userRaw = localStorage.getItem(STORAGE_KEY_USER);
    if (userRaw) {
      const parsed = JSON.parse(userRaw);
      parsed.academicStream = stream;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(parsed));
    }

    const nigeriaRaw = localStorage.getItem(STORAGE_KEY_NIGERIA);
    if (nigeriaRaw) {
      const parsed = JSON.parse(nigeriaRaw);
      parsed.academicStream = stream;
      localStorage.setItem(STORAGE_KEY_NIGERIA, JSON.stringify(parsed));
    }

    window.dispatchEvent(new Event('storage'));
  } catch {
    // ignore
  }
};

