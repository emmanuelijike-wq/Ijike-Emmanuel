import React, { useState, useEffect } from 'react';
import { User as UserIcon, Check, X, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { User } from '../types';

interface EditDisplayNameModalProps {
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onSaveName: (newName: string) => void;
}

export const EditDisplayNameModal: React.FC<EditDisplayNameModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSaveName
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onSaveName(trimmed);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081a3d]/80 backdrop-blur-md animate-fade-up"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#081a3d] text-white p-6 relative border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#62c5fa] text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} /> Personalize Account
          </div>
          <h2 className="text-xl font-black text-white">
            Change Your Display Name
          </h2>
          <p className="text-xs text-[#c8daf3] mt-1">
            Choose any name you want to be logged in and addressed as across Echo Plan.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <UserIcon size={14} className="text-[#1976d2]" />
              Your Chosen Display Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Victoria, Alex, Samuel, Maya"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1976d2]"
            />
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
              <span>💡</span>
              <span>This will immediately update your name on the navbar, greeting cards, and classroom lists.</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Account Role:</span>
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                {currentUser.role === 'admin' || currentUser.role === 'student_admin' ? '🛡️ Sole School Admin' : '🎓 Student Member'}
              </span>
            </div>

            {currentUser.role === 'student' && (
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold">Assigned Class:</span>
                <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  Class {currentUser.grade || 'SS3'}
                </span>
              </div>
            )}

            {(currentUser.role === 'admin' || currentUser.role === 'student_admin') && (
              <div className="pt-2 border-t border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Class Status:</span>
                  <span className="font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                    No Class (Oversees All)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Lock size={11} className="text-indigo-600" /> Permanent Email:
                  </span>
                  <span className="font-mono font-bold text-indigo-950 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/70">
                    ijikevictoriaokajoe@gmail.com
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Lock size={11} className="text-indigo-600" /> Admin Password:
                  </span>
                  <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    •••••••• (Permanent)
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200/80 text-[10.5px] text-amber-900 font-medium leading-relaxed">
                  🔒 <strong>Permanent Credentials:</strong> The administrator email (ijikevictoriaokajoe@gmail.com) and password are permanent with no changes permitted.
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#1976d2] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Check size={16} />
              <span>Save Name</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
