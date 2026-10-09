import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, User as UserIcon, ArrowRight, ArrowLeft, 
  Sparkles, CheckCircle2, Eye, EyeOff, School, Check, Lock, 
  AlertCircle, BookOpen, Mail, Calendar, KeyRound, 
  GraduationCap, ShieldAlert, Send, HelpCircle
} from 'lucide-react';
import { User } from '../types';
import { 
  getPermanentAdmin, 
  registerPermanentAdmin,
  registerStudentMember,
  PERMANENT_ADMIN_EMAIL,
  PERMANENT_ADMIN_NAME,
  attemptStudentLogin,
  attemptAdminLogin
} from '../utils/authManager';
import { playSuccessSound } from '../utils/sound';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  previousPageName?: string;
  initialRole?: 'admin' | 'student_admin' | 'student';
  onOpenRegisterModal?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  previousPageName = 'Previous Page',
  initialRole = 'student'
}) => {
  // Portal selector: 'student' vs 'admin'
  const [portalRole, setPortalRole] = useState<'student' | 'admin'>(
    initialRole === 'admin' || initialRole === 'student_admin' ? 'admin' : 'student'
  );

  // Mode for Student: 'login' | 'register'
  const [studentMode, setStudentMode] = useState<'login' | 'register'>('login');

  // Mode for Admin: 'login' | 'register'
  const [adminMode, setAdminMode] = useState<'login' | 'register'>('login');

  // Form Fields - Strictly Empty on Mount to ensure Zero Exposure / Full Privacy!
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration Specific Fields (Facebook Style: First name, Surname, School, Class, DOB, Gender)
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [studentSchool, setStudentSchool] = useState('');
  const [studentClass, setStudentClass] = useState('SS3');
  const [birthDay, setBirthDay] = useState('15');
  const [birthMonth, setBirthMonth] = useState('Jun');
  const [birthYear, setBirthYear] = useState('2009');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Custom'>('Female');

  // Email Verification Code State
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmailTarget, setVerifiedEmailTarget] = useState('');
  const [verificationBanner, setVerificationBanner] = useState<string | null>(null);

  // Admin Specific
  const [adminName, setAdminName] = useState(PERMANENT_ADMIN_NAME);
  const [adminSchool, setAdminSchool] = useState('General School Administration');

  const [authError, setAuthError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Reset fields to ensure absolute privacy when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setAuthError(null);
    setSuccessNotice(null);
    setVerificationBanner(null);
    
    // Always start with completely clean, private inputs
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setFirstName('');
    setSurname('');
    setStudentSchool('');
    setEnteredCode('');
    setIsVerificationCodeSent(false);
    setIsEmailVerified(false);

    if (initialRole === 'admin' || initialRole === 'student_admin') {
      setPortalRole('admin');
      setAdminMode('login');
      setEmail(PERMANENT_ADMIN_EMAIL);
      setAdminName(PERMANENT_ADMIN_NAME);
    } else {
      setPortalRole('student');
      setStudentMode('login');
    }
  }, [isOpen, initialRole]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Sending Email Verification Code
  const handleSendVerificationCode = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setAuthError('Please enter your email address first before requesting a verification code.');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setAuthError('Please enter a valid email address (e.g. student@gmail.com).');
      return;
    }

    // Generate 6-digit security code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setIsVerificationCodeSent(true);
    setVerifiedEmailTarget(trimmedEmail);
    setIsEmailVerified(false);
    setAuthError(null);
    playSuccessSound();

    setVerificationBanner(
      `📨 Confirmation Code Sent to "${trimmedEmail}": [ ${code} ] — Write down this 6-digit code below to confirm ownership of your email.`
    );
  };

  // Handle Confirming the Verification Code
  const handleConfirmVerificationCode = () => {
    if (!enteredCode.trim()) {
      setAuthError('Please write down the 6-digit code that was sent to your email.');
      return;
    }

    if (enteredCode.trim() === generatedCode.trim()) {
      setIsEmailVerified(true);
      setAuthError(null);
      setSuccessNotice(`✓ Email verified! This student account is secured to ${verifiedEmailTarget}.`);
      setVerificationBanner(null);
      playSuccessSound();
    } else {
      setAuthError('Incorrect verification code. Please write down the exact 6-digit code sent to your email.');
    }
  };

  // Handle Form Submission (Login or Register)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessNotice(null);

    // =========================================================================
    // 1. ADMINISTRATOR PORTAL FLOW (EXECUTIVE SCHOOL MANAGEMENT)
    // =========================================================================
    if (portalRole === 'admin') {
      const trimmedName = adminName.trim();
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      if (!trimmedEmail) {
        setAuthError('Please enter administrator email address.');
        return;
      }
      if (!trimmedPassword) {
        setAuthError('Please enter administrator password.');
        return;
      }

      if (adminMode === 'register') {
        const regResult = registerPermanentAdmin({
          name: trimmedName || PERMANENT_ADMIN_NAME,
          email: PERMANENT_ADMIN_EMAIL,
          password: trimmedPassword,
          school: adminSchool.trim() || 'General School Administration'
        });

        if (!regResult.success || !regResult.user) {
          setAuthError(regResult.error || 'Failed to update administrator credentials.');
          return;
        }

        playSuccessSound();
        onLogin(regResult.user);
        onClose();
        return;
      }

      // Admin Login
      const loginResult = attemptAdminLogin({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword
      });

      if (!loginResult.success || !loginResult.user) {
        setAuthError(loginResult.error || 'Invalid administrator credentials.');
        return;
      }

      playSuccessSound();
      onLogin(loginResult.user);
      onClose();
      return;
    }

    // =========================================================================
    // 2. FACEBOOK-STYLE STUDENT REGISTRATION FLOW
    // "Let the account creation or registeration be like of Facebook when you are
    // creating a Facebook account. Let it carry school, your class, your name,
    // your email before you register. Let students be able to write their email.
    // Let it be necessary. And then the app sends a code. When you write down the code
    // and then send it back, you make sure it's your email as a student when you register.
    // You write in your own password and the password stays as your own password."
    // =========================================================================
    if (studentMode === 'register') {
      const trimmedFullName = `${firstName.trim()} ${surname.trim()}`.trim();
      const trimmedSchool = studentSchool.trim();
      const trimmedClass = studentClass.trim();
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedFullName) {
        setAuthError("Please write your name (First name and Surname).");
        return;
      }
      if (!trimmedSchool) {
        setAuthError("Please enter your school or college name.");
        return;
      }
      if (!trimmedClass) {
        setAuthError("Please select your student class.");
        return;
      }
      if (!trimmedEmail) {
        setAuthError("Email address is necessary when registering as a student.");
        return;
      }
      if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
        setAuthError("Please enter a valid email address.");
        return;
      }

      // Mandatory Email Verification Code Check
      if (!isEmailVerified || verifiedEmailTarget.toLowerCase() !== trimmedEmail.toLowerCase()) {
        setAuthError("Please verify your email address. Click 'Send Verification Code' and write down the code to confirm ownership.");
        return;
      }

      // Student writes their own password!
      if (!trimmedPassword) {
        setAuthError("Please enter a password for your account.");
        return;
      }
      if (trimmedPassword.toLowerCase() === 'student123') {
        setAuthError('Registration rejected: "student123" is not permitted. Write your own personal password.');
        return;
      }
      if (trimmedPassword.length < 4) {
        setAuthError("Password should be at least 4 characters long.");
        return;
      }

      // Guard against admin email being registered as student
      if (trimmedEmail.toLowerCase() === PERMANENT_ADMIN_EMAIL.toLowerCase()) {
        setAuthError(`This email (${PERMANENT_ADMIN_EMAIL}) is reserved strictly for Victoria Okajoe (Administrator).`);
        return;
      }

      const regResult = registerStudentMember({
        name: trimmedFullName,
        email: trimmedEmail,
        password: trimmedPassword,
        grade: trimmedClass,
        school: trimmedSchool,
        age: 16
      });

      if (!regResult.success || !regResult.user) {
        setAuthError(regResult.error || 'Student registration failed.');
        return;
      }

      playSuccessSound();
      onLogin(regResult.user);
      onClose();
      return;
    }

    // =========================================================================
    // 3. PRIVATE FACEBOOK-STYLE STUDENT LOGIN FLOW
    // "In the login system, nothing should show like the student's name or their password.
    // The password should be private account because each student has their own account.
    // Putting your email and then your password. That password gives you access to your account."
    // =========================================================================
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setAuthError("Please enter your registered student email address.");
      return;
    }
    if (!trimmedPassword) {
      setAuthError("Please enter your private student password.");
      return;
    }
    if (trimmedPassword.toLowerCase() === 'student123') {
      setAuthError('Access denied: "student123" is not permitted. Please enter the private password you wrote when registering.');
      return;
    }

    const studentLoginResult = attemptStudentLogin({
      email: trimmedEmail,
      password: trimmedPassword
    });

    if (!studentLoginResult.success || !studentLoginResult.user) {
      setAuthError(
        studentLoginResult.error ||
        "The email address or password you entered doesn't match any student account. Please try again."
      );
      return;
    }

    playSuccessSound();
    onLogin(studentLoginResult.user);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      {/* ===================================================================== */}
      {/* 1. STUDENT AUTHENTICATION: AUTHENTIC FACEBOOK STYLE                   */}
      {/* ===================================================================== */}
      {portalRole === 'student' ? (
        <div 
          className="relative w-full max-w-[430px] my-auto transition-all duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Facebook Header Branding */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-[#1877f2] font-black tracking-tight text-4xl sm:text-5xl font-sans inline-block cursor-default select-none uppercase">
              ECHO PLAN
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm font-normal mt-1 max-w-xs mx-auto leading-snug">
              Connect with your classes, homework, and study goals on Echo Plan.
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="mb-3 p-3.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs font-medium flex items-start gap-2 shadow-xs animate-shake">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{authError}</div>
            </div>
          )}

          {/* Verification Code Dispatch Banner */}
          {verificationBanner && (
            <div className="mb-3 p-3.5 rounded-lg bg-blue-50 border border-[#1877f2]/50 text-blue-950 text-xs font-medium flex items-start gap-2 shadow-xs">
              <Mail size={16} className="text-[#1877f2] shrink-0 mt-0.5" />
              <div className="leading-snug">{verificationBanner}</div>
            </div>
          )}

          {/* Success Banner */}
          {successNotice && (
            <div className="mb-3 p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* THE FACEBOOK LOGIN CARD */}
          {studentMode === 'login' ? (
            <div className="bg-white rounded-xl shadow-xl border border-[#dddfe2] p-5 sm:p-7 space-y-3.5">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Input 1: Email */}
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Email address or student ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-lg border border-[#dddfe2] text-sm sm:text-base focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[#1c1e21] placeholder-slate-400 bg-white transition-all"
                  />
                </div>

                {/* Input 2: Password */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-lg border border-[#dddfe2] text-sm sm:text-base focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[#1c1e21] placeholder-slate-400 bg-white pr-11 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Log In Button (Facebook Blue #1877f2) */}
                <button
                  type="submit"
                  className="w-full py-3 sm:py-3.5 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] active:bg-[#1465d2] text-white font-bold text-base sm:text-lg transition-colors cursor-pointer shadow-none"
                >
                  Log In
                </button>

                {/* Forgotten Password link */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthError("To reset your password, contact Administrator Victoria Okajoe via the Contact page or register with your verified email.")}
                    className="text-xs sm:text-sm text-[#1877f2] hover:underline font-normal cursor-pointer"
                  >
                    Forgotten password?
                  </button>
                </div>

                {/* Divider Line */}
                <div className="border-b border-[#dadde1] my-2" />

                {/* Create New Account Button (Facebook Green #42b72a) */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStudentMode('register');
                      setAuthError(null);
                      setPassword('');
                    }}
                    className="px-5 py-3 rounded-lg bg-[#42b72a] hover:bg-[#36a420] active:bg-[#2b9217] text-white font-bold text-sm sm:text-base transition-colors cursor-pointer inline-block"
                  >
                    Create new account
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* THE FACEBOOK SIGN UP MODAL CARD */
            <div className="bg-white rounded-xl shadow-2xl border border-[#dddfe2] overflow-hidden animate-fade-in">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#dadde1] flex items-start justify-between relative">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#1877f2] mb-0.5">
                    ECHO PLAN • STUDENT REGISTRATION
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c1e21] tracking-tight">
                    Sign Up
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    It&apos;s quick and easy. Create your Echo Plan student account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('login');
                    setAuthError(null);
                  }}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-md"
                  title="Close and return to login"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md border border-[#ccd0d5] text-xs sm:text-sm focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[#1c1e21] bg-[#f5f6f7] focus:bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md border border-[#ccd0d5] text-xs sm:text-sm focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[#1c1e21] bg-[#f5f6f7] focus:bg-white"
                  />
                </div>

                {/* School Name */}
                <input
                  type="text"
                  required
                  placeholder="School / College Name (e.g. King's College Lagos)"
                  value={studentSchool}
                  onChange={(e) => setStudentSchool(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-md border border-[#ccd0d5] text-xs sm:text-sm focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[#1c1e21] bg-[#f5f6f7] focus:bg-white"
                />

                {/* Student Class */}
                <div>
                  <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                    Student Class
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[#ccd0d5] text-xs sm:text-sm font-semibold text-[#1c1e21] bg-white focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none cursor-pointer"
                  >
                    <option value="SS3">SS3 (Senior Secondary 3)</option>
                    <option value="SS2">SS2 (Senior Secondary 2)</option>
                    <option value="SS1">SS1 (Senior Secondary 1)</option>
                    <option value="JSS3">JSS3</option>
                    <option value="JSS2">JSS2</option>
                    <option value="JSS1">JSS1</option>
                  </select>
                </div>

                {/* Mobile number or email address */}
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Mobile number or email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (isEmailVerified) setIsEmailVerified(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-md border text-xs sm:text-sm focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[#1c1e21] ${
                      isEmailVerified 
                        ? 'border-emerald-500 bg-emerald-50/40 font-semibold' 
                        : 'border-[#ccd0d5] bg-[#f5f6f7] focus:bg-white'
                    }`}
                  />
                </div>

                {/* EMAIL VERIFICATION CODE BOX */}
                <div className="p-3 rounded-lg bg-[#f0f2f5] border border-[#dddfe2] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Mail size={13} className="text-[#1877f2]" />
                      <span>Security Verification Code</span>
                    </span>
                    {isEmailVerified ? (
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-black text-[10px]">
                        ✓ Confirmed
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal text-[10px]">
                        Required
                      </span>
                    )}
                  </div>

                  {!isEmailVerified && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        className="px-2.5 py-1.5 rounded-md bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-xs cursor-pointer shrink-0"
                      >
                        {isVerificationCodeSent ? 'Resend Code' : 'Send Code'}
                      </button>

                      <input
                        type="text"
                        maxLength={6}
                        placeholder="6-digit code"
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full px-2.5 py-1.5 rounded-md border border-[#ccd0d5] font-mono font-bold text-xs text-center tracking-widest bg-white"
                      />

                      <button
                        type="button"
                        onClick={handleConfirmVerificationCode}
                        className="px-3 py-1.5 rounded-md bg-[#42b72a] hover:bg-[#36a420] text-white font-bold text-xs cursor-pointer shrink-0"
                      >
                        Confirm
                      </button>
                    </div>
                  )}

                  {isEmailVerified && (
                    <div className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>Email confirmed as student account owner.</span>
                    </div>
                  )}
                </div>

                {/* New Password */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="New password (you write it yourself)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md border border-[#ccd0d5] text-xs sm:text-sm focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[#1c1e21] bg-[#f5f6f7] focus:bg-white pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Date of Birth (Birthday) */}
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mb-1">
                    <span>Date of birth</span>
                    <HelpCircle size={11} className="text-slate-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      className="px-2 py-1.5 rounded-md border border-[#ccd0d5] text-xs font-normal text-[#1c1e21] bg-white cursor-pointer"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>

                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="px-2 py-1.5 rounded-md border border-[#ccd0d5] text-xs font-normal text-[#1c1e21] bg-white cursor-pointer"
                    >
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>

                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="px-2 py-1.5 rounded-md border border-[#ccd0d5] text-xs font-normal text-[#1c1e21] bg-white cursor-pointer"
                    >
                      {Array.from({ length: 15 }, (_, i) => 2014 - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mb-1">
                    <span>Gender</span>
                    <HelpCircle size={11} className="text-slate-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Female', 'Male', 'Custom'] as const).map(g => (
                      <label
                        key={g}
                        className={`flex items-center justify-between p-2 rounded-md border cursor-pointer text-xs transition-all ${
                          gender === g 
                            ? 'border-[#1877f2] bg-blue-50/30 text-[#1877f2] font-bold' 
                            : 'border-[#ccd0d5] bg-white text-[#1c1e21]'
                        }`}
                      >
                        <span>{g}</span>
                        <input
                          type="radio"
                          name="fb_gender"
                          value={g}
                          checked={gender === g}
                          onChange={() => setGender(g)}
                          className="accent-[#1877f2]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Terms fine print */}
                <p className="text-[10px] text-slate-500 leading-tight pt-1">
                  People who use our service may have uploaded your contact information to Echo Plan. By clicking Sign Up, you agree to our Terms and Privacy Policy.
                </p>

                {/* Facebook Sign Up Button (Centered Green) */}
                <div className="text-center pt-2">
                  <button
                    type="submit"
                    className="px-10 py-2.5 rounded-md bg-[#00a400] hover:bg-[#008f00] text-white font-extrabold text-sm sm:text-base transition-colors cursor-pointer shadow-sm active:scale-98"
                  >
                    Sign Up
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStudentMode('login');
                      setAuthError(null);
                    }}
                    className="text-xs text-[#1877f2] hover:underline font-semibold"
                  >
                    Already have an account?
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Institutional Switcher to Admin (Subtle Facebook Style Footer) */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => {
                setPortalRole('admin');
                setAuthError(null);
                setSuccessNotice(null);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <ShieldCheck size={14} className="text-indigo-600" />
              <span>Are you the School Administrator? <strong>Sign in as Sole Administrator →</strong></span>
            </button>
          </div>
        </div>
      ) : (
        /* =================================================================== */
        /* 2. ADMINISTRATOR LOGIN: DIFFERENT, EXECUTIVE & INSTITUTIONAL STYLE  */
        /* "leave the admin login different"                                   */
        /* =================================================================== */
        <div 
          className="relative w-full max-w-lg my-auto bg-[#071a3d] text-white rounded-3xl shadow-2xl border-2 border-indigo-500/40 overflow-hidden animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Executive Top Banner */}
          <div className="bg-gradient-to-r from-[#0b1f47] via-[#102a5c] to-[#163a75] p-6 sm:p-7 border-b border-indigo-700/50 relative overflow-hidden">
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                background: 'radial-gradient(circle at 80% 20%, #f59e0b, transparent 40%), radial-gradient(circle at 20% 80%, #62c5fa, transparent 40%)'
              }}
            />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10.5px] font-black uppercase tracking-wider border border-amber-400/40">
                  <ShieldCheck size={13} className="text-amber-400" />
                  <span>Sole Administrator Command Desk</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Lead Administrator Portal
                </h2>
                <p className="text-xs text-[#c8daf3] leading-relaxed">
                  Reserved strictly for <strong>Victoria Okajoe</strong>. Executive management of class curricula, homework grading, announcements, and CBT examination center.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Admin Body */}
          <div className="p-6 sm:p-8 space-y-5 bg-[#071a3d]">
            
            {/* Error Notification */}
            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-semibold flex items-start gap-2.5">
                <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div className="leading-snug">{authError}</div>
              </div>
            )}

            {/* Success Notification */}
            {successNotice && (
              <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* Admin Mode Switcher: Sign In vs Register Password */}
            <div className="flex items-center justify-between p-1 bg-white/5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setAdminMode('login');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  adminMode === 'login'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Lock size={14} />
                <span>Administrator Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdminMode('register');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  adminMode === 'register'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <KeyRound size={14} />
                <span>Update Admin Password</span>
              </button>
            </div>

            {/* Executive Admin Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block mb-1">
                  Administrator Full Name
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-700/80 bg-white/10 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15"
                />
              </div>

              {/* Official Admin Email */}
              <div>
                <label className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block mb-1">
                  Administrator Email Address (Official)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-700/80 bg-white/10 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15"
                />
                <span className="text-[10.5px] text-indigo-300/80 mt-1 block">
                  Official administrator address: <strong>{PERMANENT_ADMIN_EMAIL}</strong>
                </span>
              </div>

              {/* Secret Admin Password */}
              <div>
                <label className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block mb-1">
                  Executive Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter administrator password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-700/80 bg-white/10 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-indigo-300 hover:text-white cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {adminMode === 'register' && (
                <div>
                  <label className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block mb-1">
                    Institution / Department
                  </label>
                  <input
                    type="text"
                    required
                    value={adminSchool}
                    onChange={(e) => setAdminSchool(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-700/80 bg-white/10 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15"
                  />
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-98 border border-indigo-400/40"
                >
                  <ShieldCheck size={18} className="text-amber-300" />
                  <span>{adminMode === 'register' ? 'Save Administrator Password' : 'Sign In as Lead Administrator'}</span>
                </button>
              </div>
            </form>

            {/* Switch Back to Student Portal Link */}
            <div className="pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  setPortalRole('student');
                  setStudentMode('login');
                  setAuthError(null);
                  setSuccessNotice(null);
                  setPassword('');
                }}
                className="text-xs text-sky-300 hover:text-white font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Return to Student Login (Facebook Style)</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
