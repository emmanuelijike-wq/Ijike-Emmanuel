import React from 'react';
import { Lock, UserPlus, LogIn, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

interface AccessRestrictedPromptProps {
  pageName: string;
  onRegister: () => void;
  onLogin: () => void;
  onGoHome: () => void;
}

export const AccessRestrictedPrompt: React.FC<AccessRestrictedPromptProps> = ({
  pageName,
  onRegister,
  onLogin,
  onGoHome,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl text-center">
        {/* Lock Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-6 shadow-xs">
          <Lock size={32} />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldCheck size={14} className="text-emerald-600" />
          Student Registration Required
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081a3d] mb-3">
          Register to Access {pageName}
        </h2>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
          You can freely browse <strong>Features</strong>, <strong>Home</strong>, <strong>About Us</strong>, and <strong>Contact Us</strong>. 
          To unlock <strong>{pageName}</strong>, please complete your quick student registration first.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onRegister}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
          >
            <UserPlus size={18} />
            <span>Register as a Student</span>
          </button>

          <button
            type="button"
            onClick={onLogin}
            className="w-full py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogIn size={16} />
            <span>Already have an account? Log In</span>
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Micro note */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Sparkles size={14} className="text-amber-500" />
          <span>Instant setup • Choose your school & class</span>
        </div>
      </div>
    </div>
  );
};
