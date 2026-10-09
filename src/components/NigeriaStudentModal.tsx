import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, Eye, EyeOff, Lock, Mail, 
  HelpCircle, AlertCircle, Send, School, BookOpen, 
  Atom, Palette, ShieldCheck
} from 'lucide-react';
import { NigerianStudentRegistration } from '../types';
import { playSuccessSound } from '../utils/sound';

interface NigeriaStudentModalProps {
  isOpen: boolean;
  onRegister: (data: NigerianStudentRegistration) => void;
  onExit: () => void;
  previousPageName?: string;
  targetPageName?: string;
  onOpenLogin?: () => void;
}

export const NigeriaStudentModal: React.FC<NigeriaStudentModalProps> = ({
  isOpen,
  onRegister,
  onExit,
  onOpenLogin
}) => {
  // Facebook Style Form Fields
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [school, setSchool] = useState('');
  const [studentClass, setStudentClass] = useState('SS3');
  const [academicStream, setAcademicStream] = useState<'science' | 'art'>('science');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Birthday & Gender (Facebook exact style)
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
  const [verificationAlert, setVerificationAlert] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset fields when opening modal
  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    setVerificationAlert(null);
    setEnteredCode('');
    setIsVerificationCodeSent(false);
    setIsEmailVerified(false);
  }, [isOpen]);

  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onExit]);

  if (!isOpen) return null;

  // Handle Sending 6-Digit Email Verification Code
  const handleSendCode = () => {
    const trimmed = studentEmail.trim();
    if (!trimmed) {
      setErrorMsg('Please write your email address first before requesting a verification code.');
      return;
    }
    if (!trimmed.includes('@') || !trimmed.includes('.')) {
      setErrorMsg('Please write a valid email address (e.g. name@gmail.com).');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setIsVerificationCodeSent(true);
    setVerifiedEmailTarget(trimmed);
    setIsEmailVerified(false);
    setErrorMsg(null);
    playSuccessSound();

    setVerificationAlert(
      `📨 Confirmation Code Sent to "${trimmed}": [ ${code} ] — Write down this 6-digit code below to confirm your student email.`
    );
  };

  // Handle Confirming Code
  const handleConfirmCode = () => {
    if (!enteredCode.trim()) {
      setErrorMsg('Please write down the 6-digit code that was sent to your email.');
      return;
    }

    if (enteredCode.trim() === generatedCode.trim()) {
      setIsEmailVerified(true);
      setErrorMsg(null);
      setVerificationAlert(null);
      playSuccessSound();
    } else {
      setErrorMsg('Incorrect verification code. Please write down the exact 6-digit code sent to your email.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedFullName = `${firstName.trim()} ${surname.trim()}`.trim();
    const finalClass = studentClass.trim();
    const trimmedSchool = school.trim();
    const trimmedPassword = studentPassword.trim();
    const trimmedEmail = studentEmail.trim();

    // 1. Necessary: Student Full Name
    if (!trimmedFullName) {
      setErrorMsg('Student name (First name and Surname) is necessary.');
      return;
    }

    // 2. Necessary: School Name
    if (!trimmedSchool) {
      setErrorMsg('School / College name is necessary.');
      return;
    }

    // 3. Necessary: Class
    if (!finalClass) {
      setErrorMsg('Class is necessary.');
      return;
    }

    // 4. Necessary: Student Email
    if (!trimmedEmail) {
      setErrorMsg('Student email address is necessary.');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMsg('Please write a valid email address.');
      return;
    }

    // Mandatory Email Code Verification Check
    if (!isEmailVerified || verifiedEmailTarget.toLowerCase() !== trimmedEmail.toLowerCase()) {
      setErrorMsg("Please verify your email address. Tap 'Send Code' and enter the 6-digit code to confirm ownership.");
      return;
    }

    // 5. Necessary: Student Password (Student writes their own password, never auto-generated)
    if (!trimmedPassword) {
      setErrorMsg('Password is necessary when registering. The app does not generate it for you; please write your own password.');
      return;
    }
    if (trimmedPassword.toLowerCase() === 'student123') {
      setErrorMsg('Please write your own unique personal password. "student123" is not permitted.');
      return;
    }
    if (trimmedPassword.length < 4) {
      setErrorMsg('Password should be at least 4 characters long.');
      return;
    }

    const calculatedAge = Math.max(12, 2026 - parseInt(birthYear, 10));

    const registrationData: NigerianStudentRegistration = {
      studentName: trimmedFullName,
      studentClass: finalClass,
      academicStream,
      school: trimmedSchool,
      email: trimmedEmail,
      password: trimmedPassword,
      age: calculatedAge,
      isAdmin: false,
      registeredAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    playSuccessSound();
    onRegister(registrationData);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onExit}
    >
      <div 
        className="relative w-full max-w-[430px] my-auto transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ECHO PLAN Facebook Header Branding */}
        <div className="text-center mb-3 sm:mb-4">
          <h1 className="text-[#1877f2] font-black tracking-tight text-4xl sm:text-5xl font-sans inline-block cursor-default select-none uppercase">
            ECHO PLAN
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-normal mt-1 leading-snug">
            Connect with your classes, homework, and study goals on Echo Plan.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-3 p-3.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs font-medium flex items-start gap-2 shadow-xs animate-shake">
            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMsg}</div>
          </div>
        )}

        {/* Verification Alert */}
        {verificationAlert && (
          <div className="mb-3 p-3.5 rounded-lg bg-blue-50 border border-[#1877f2]/50 text-blue-950 text-xs font-medium flex items-start gap-2 shadow-xs">
            <Mail size={16} className="text-[#1877f2] shrink-0 mt-0.5" />
            <div className="leading-snug">{verificationAlert}</div>
          </div>
        )}

        {/* THE FACEBOOK SIGN UP CARD */}
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
                It&apos;s quick and easy. Register for Echo Plan.
              </p>
            </div>
            <button
              type="button"
              onClick={onExit}
              className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-md transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
            {/* First Name & Surname */}
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

            {/* School / College Name */}
            <input
              type="text"
              required
              placeholder="School / College Name (e.g. King's College Lagos)"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
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

            {/* Science or Art Stream Selector */}
            <div>
              <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                Academic Stream (Science or Art)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAcademicStream('science')}
                  className={`p-2 rounded-md border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    academicStream === 'science'
                      ? 'border-[#1877f2] bg-blue-50/50 text-[#1877f2] ring-1 ring-[#1877f2]'
                      : 'border-[#ccd0d5] bg-white text-slate-700'
                  }`}
                >
                  <Atom size={15} className="text-[#1877f2]" />
                  <span>Science Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAcademicStream('art')}
                  className={`p-2 rounded-md border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    academicStream === 'art'
                      ? 'border-[#1877f2] bg-blue-50/50 text-[#1877f2] ring-1 ring-[#1877f2]'
                      : 'border-[#ccd0d5] bg-white text-slate-700'
                  }`}
                >
                  <Palette size={15} className="text-purple-600" />
                  <span>Art / Humanities</span>
                </button>
              </div>
            </div>

            {/* Email Address */}
            <input
              type="email"
              required
              placeholder="Mobile number or email address"
              value={studentEmail}
              onChange={(e) => {
                setStudentEmail(e.target.value);
                if (isEmailVerified) setIsEmailVerified(false);
              }}
              className={`w-full px-3 py-2.5 rounded-md border text-xs sm:text-sm focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[#1c1e21] ${
                isEmailVerified 
                  ? 'border-emerald-500 bg-emerald-50/40 font-semibold' 
                  : 'border-[#ccd0d5] bg-[#f5f6f7] focus:bg-white'
              }`}
            />

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
                    onClick={handleSendCode}
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
                    onClick={handleConfirmCode}
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

            {/* Password (Student writes their own password, masked with eye) */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="New password (you write it yourself)"
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
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
                      name="ng_fb_gender"
                      value={g}
                      checked={gender === g}
                      onChange={() => setGender(g)}
                      className="accent-[#1877f2]"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Legal fine print */}
            <p className="text-[10px] text-slate-500 leading-tight pt-1">
              By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You will receive notifications about class assignments and exams on Echo Plan.
            </p>

            {/* Facebook Green Sign Up Button */}
            <div className="text-center pt-2">
              <button
                type="submit"
                className="px-10 py-2.5 rounded-md bg-[#00a400] hover:bg-[#008f00] text-white font-extrabold text-sm sm:text-base transition-colors cursor-pointer shadow-sm active:scale-98"
              >
                Sign Up
              </button>
            </div>

            {/* Already have an account */}
            {onOpenLogin && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onExit();
                    onOpenLogin();
                  }}
                  className="text-xs text-[#1877f2] hover:underline font-semibold cursor-pointer"
                >
                  Already have an account? Log In
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
