import React, { useState } from 'react';
import { 
  X, ShieldCheck, Check, Sparkles, BookOpen, 
  Users, Calendar, Clock, AlertCircle, CheckCircle2, 
  Send, Plus, Award, ChevronRight, Layers, Megaphone
} from 'lucide-react';
import { CBTExam } from '../data/cbtExamsRegistry';
import { User, ClassAnnouncement } from '../types';
import { playSuccessSound } from '../utils/sound';

interface AdminDeployCbtModalProps {
  isOpen: boolean;
  onClose: () => void;
  exams: CBTExam[];
  onExamDeployed?: (newExams: CBTExam[]) => void;
  currentUser?: User | null;
}

const ALL_CLASSES = ['SS1', 'SS2', 'SS3', 'JSS1', 'JSS2', 'JSS3'];

export const AdminDeployCbtModal: React.FC<AdminDeployCbtModalProps> = ({
  isOpen,
  onClose,
  exams,
  onExamDeployed,
  currentUser
}) => {
  const [selectedBaseExamId, setSelectedBaseExamId] = useState<string>(() => {
    return exams[0]?.id || 'ss2-science-english-2026';
  });

  const [targetClasses, setTargetClasses] = useState<string[]>(['SS1', 'SS2', 'SS3']);
  const [targetStream, setTargetStream] = useState<'science' | 'art' | 'general'>('general');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [adminNote, setAdminNote] = useState<string>(
    'Official CBT Examination deployed by Administrator Victoria Okajoe. All students in this class are scheduled to complete this practice paper.'
  );
  const [broadcastAnnouncement, setBroadcastAnnouncement] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [deployedSummary, setDeployedSummary] = useState<string>('');

  if (!isOpen) return null;

  const baseExam = exams.find(e => e.id === selectedBaseExamId) || exams[0];

  const handleToggleClass = (cls: string) => {
    if (targetClasses.includes(cls)) {
      if (targetClasses.length > 1) {
        setTargetClasses(targetClasses.filter(c => c !== cls));
      }
    } else {
      setTargetClasses([...targetClasses, cls]);
    }
  };

  const handleSelectAllSenior = () => {
    setTargetClasses(['SS1', 'SS2', 'SS3']);
  };

  const handleSelectAllJunior = () => {
    setTargetClasses(['JSS1', 'JSS2', 'JSS3']);
  };

  const handleSelectAllClasses = () => {
    setTargetClasses([...ALL_CLASSES]);
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseExam || targetClasses.length === 0) return;

    try {
      // Get existing custom exams
      const customRaw = localStorage.getItem('echo_plan_custom_cbt_exams');
      const existingCustom: CBTExam[] = customRaw ? JSON.parse(customRaw) : [];

      const newlyCreatedExams: CBTExam[] = [];

      targetClasses.forEach((cls) => {
        const examId = `cbt-deploy-${cls.toLowerCase()}-${baseExam.subject.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
        const titleToUse = customTitle.trim() || `${cls} ${baseExam.subject} CBT Examination (Admin Deployed)`;

        const deployedExam: CBTExam = {
          id: examId,
          title: titleToUse,
          subject: baseExam.subject,
          studentClass: cls,
          stream: targetStream,
          durationMinutes: Number(durationMinutes) || 30,
          description: `${adminNote} Deployed for ${cls} students (${targetStream.toUpperCase()} department).`,
          badgeColor: targetStream === 'science' 
            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
            : targetStream === 'art' 
              ? 'bg-purple-100 text-purple-800 border-purple-200' 
              : 'bg-rose-100 text-rose-800 border-rose-200',
          questions: baseExam.questions,
          isCustom: true,
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          createdBy: currentUser?.name || 'Victoria Okajoe (Administrator)'
        };

        newlyCreatedExams.push(deployedExam);
      });

      // Save to localStorage
      const updatedCustom = [...newlyCreatedExams, ...existingCustom];
      localStorage.setItem('echo_plan_custom_cbt_exams', JSON.stringify(updatedCustom));

      // Broadcast Class Announcement if enabled
      if (broadcastAnnouncement) {
        try {
          const annRaw = localStorage.getItem('echo_plan_class_announcements');
          const existingAnn: ClassAnnouncement[] = annRaw ? JSON.parse(annRaw) : [];

          const newAnnouncement: ClassAnnouncement = {
            id: `ann-cbt-${Date.now()}`,
            title: `📢 New CBT Exam Scheduled: ${baseExam.subject} for ${targetClasses.join(', ')}`,
            content: `Administrator Victoria Okajoe has deployed a new ${baseExam.subject} CBT examination to ${targetClasses.join(', ')} (${targetStream.toUpperCase()} stream). Students should navigate to the Examination Hall to complete their 30-minute test.`,
            author: currentUser?.name || 'Victoria Okajoe',
            authorRole: 'Sole Administrator',
            timestamp: 'Just now',
            priority: 'urgent'
          };

          localStorage.setItem('echo_plan_class_announcements', JSON.stringify([newAnnouncement, ...existingAnn]));
        } catch {
          // ignore
        }
      }

      // Dispatch global events for instant reactive updates across tabs and components
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('echo_plan_cbt_exams_updated', { detail: newlyCreatedExams }));

      if (onExamDeployed) {
        onExamDeployed(newlyCreatedExams);
      }

      playSuccessSound();
      setDeployedSummary(
        `✓ Success! ${newlyCreatedExams.length} CBT exam(s) deployed across classes ${targetClasses.join(', ')} for ${targetStream.toUpperCase()} department.`
      );
      setIsSuccess(true);
    } catch {
      // ignore
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col transition-all max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#071a3d] via-[#0d2a5e] to-[#14397d] text-white p-5 sm:p-6 border-b border-indigo-700/50">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-400/40">
                <ShieldCheck size={13} />
                <span>Administrator Academic Operations</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Award className="text-amber-400" size={22} />
                <span>Carry Out & Deploy CBT Exams to Other Classes</span>
              </h2>
              <p className="text-xs text-[#c8daf3]">
                Deploy tests across <strong>SS1, SS2, SS3, JSS1, JSS2, and JSS3</strong>. Students in target classes will immediately see and take the exam in their CBT Hall.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/80 text-white transition-colors cursor-pointer shrink-0"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                CBT Examination Successfully Deployed!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium leading-relaxed">
                {deployedSummary}
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Return to CBT Examination Hall
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDeploy} className="space-y-4">
              {/* 1. Select Source Exam */}
              <div>
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-indigo-600" />
                  <span>1. Choose Source Examination to Carry Out:</span>
                </label>
                <select
                  value={selectedBaseExamId}
                  onChange={(e) => setSelectedBaseExamId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <optgroup label="Core Subjects (English & Mathematics)">
                    {exams.filter(e => e.subject === 'English' || e.subject === 'Mathematics' || e.subject === 'Math').map(e => (
                      <option key={e.id} value={e.id}>
                        {e.title} ({e.questions.length} questions • Class {e.studentClass})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Science Subjects (Chemistry, Physics, Biology, Science Course)">
                    {exams.filter(e => e.stream === 'science' && e.subject !== 'English' && e.subject !== 'Mathematics').map(e => (
                      <option key={e.id} value={e.id}>
                        {e.title} ({e.questions.length} questions)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Arts Subjects (Literature, Government, Civic)">
                    {exams.filter(e => e.stream === 'art' && e.subject !== 'English' && e.subject !== 'Math').map(e => (
                      <option key={e.id} value={e.id}>
                        {e.title} ({e.questions.length} questions)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Junior & General Curriculum Subjects">
                    {exams.filter(e => e.stream === 'general' && e.subject !== 'English').map(e => (
                      <option key={e.id} value={e.id}>
                        {e.title} ({e.questions.length} questions)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* 2. Target Classes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={14} className="text-indigo-600" />
                    <span>2. Select Target Classes to Deploy Exam To:</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleSelectAllSenior}
                      className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Senior Classes
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={handleSelectAllJunior}
                      className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Junior Classes
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={handleSelectAllClasses}
                      className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      All Classes
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {ALL_CLASSES.map(cls => {
                    const isSelected = targetClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => handleToggleClass(cls)}
                        className={`py-2 px-3 rounded-xl border text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs ring-2 ring-indigo-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Check size={12} className={isSelected ? 'text-white' : 'opacity-0'} />
                        <span>{cls}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Department Stream */}
              <div>
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-1.5">
                  3. Target Stream / Department:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className={`p-2.5 rounded-xl border cursor-pointer text-xs font-black transition-all flex items-center justify-between ${
                    targetStream === 'general' ? 'border-rose-500 bg-rose-50/50 text-rose-900 ring-1 ring-rose-500' : 'border-slate-200 bg-white text-slate-700'
                  }`}>
                    <span>Both (General Core)</span>
                    <input
                      type="radio"
                      name="deploy_stream"
                      checked={targetStream === 'general'}
                      onChange={() => setTargetStream('general')}
                      className="accent-rose-600"
                    />
                  </label>

                  <label className={`p-2.5 rounded-xl border cursor-pointer text-xs font-black transition-all flex items-center justify-between ${
                    targetStream === 'science' ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-500' : 'border-slate-200 bg-white text-slate-700'
                  }`}>
                    <span>Science Only</span>
                    <input
                      type="radio"
                      name="deploy_stream"
                      checked={targetStream === 'science'}
                      onChange={() => setTargetStream('science')}
                      className="accent-emerald-600"
                    />
                  </label>

                  <label className={`p-2.5 rounded-xl border cursor-pointer text-xs font-black transition-all flex items-center justify-between ${
                    targetStream === 'art' ? 'border-purple-500 bg-purple-50/50 text-purple-900 ring-1 ring-purple-500' : 'border-slate-200 bg-white text-slate-700'
                  }`}>
                    <span>Arts Only</span>
                    <input
                      type="radio"
                      name="deploy_stream"
                      checked={targetStream === 'art'}
                      onChange={() => setTargetStream('art')}
                      className="accent-purple-600"
                    />
                  </label>
                </div>
              </div>

              {/* 4. Optional Custom Title & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-1">
                    Custom Title (Optional Override)
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. ${targetClasses.join('/')} ${baseExam?.subject || 'English'} CBT Mid-Term Examination`}
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-1">
                    Timer Duration
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={10}
                      max={180}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-500">mins</span>
                  </div>
                </div>
              </div>

              {/* 5. Admin Directive Note */}
              <div>
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-1">
                  Official Directive Note for Students:
                </label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* 6. Broadcast Announcement Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={broadcastAnnouncement}
                  onChange={(e) => setBroadcastAnnouncement(e.target.checked)}
                  className="accent-indigo-600 mt-0.5"
                />
                <div className="text-xs">
                  <span className="font-black text-indigo-950 block flex items-center gap-1">
                    <Megaphone size={12} className="text-indigo-600" />
                    Broadcast Official Class Announcement to Students
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    Pins an official notice in the Class Workspace alerting students that a new CBT exam has been deployed for their class.
                  </span>
                </div>
              </label>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 hover:from-indigo-500 hover:to-blue-600 text-white font-black text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <Send size={16} />
                  <span>Deploy & Carry Out CBT Exam across {targetClasses.length} Class(es)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
