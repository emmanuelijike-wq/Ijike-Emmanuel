import React, { useState, useEffect } from 'react';
import { 
  Send, FileText, CheckCircle2, Clock, Award, 
  HelpCircle, Sparkles, MessageSquare, BookOpen, AlertCircle, 
  Check, ArrowRight, UserCheck, ShieldCheck
} from 'lucide-react';
import { 
  AdminInboxMessage, 
  getAllAdminMessages, 
  submitStudentHomework 
} from '../utils/homeworkMessageManager';
import { playSuccessSound } from '../utils/sound';

interface StudentHomeworkSubmitSectionProps {
  currentUserName?: string;
  currentUserEmail?: string;
  currentUserClass?: string;
}

const COMMON_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'English Language', 'Literature in English', 'Civic Education',
  'Economics', 'Further Mathematics', 'Agricultural Science', 'Technical Studies'
];

export const StudentHomeworkSubmitSection: React.FC<StudentHomeworkSubmitSectionProps> = ({
  currentUserName = 'Chidubem Okafor',
  currentUserEmail = 'chidubem.okafor@student.echo.edu.ng',
  currentUserClass = 'SS3'
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');

  // Form Fields
  const [studentName, setStudentName] = useState(currentUserName);
  const [studentEmail, setStudentEmail] = useState(currentUserEmail);
  const [studentClass, setStudentClass] = useState(currentUserClass);
  const [subject, setSubject] = useState('Mathematics');
  const [homeworkTitle, setHomeworkTitle] = useState('');
  const [homeworkContent, setHomeworkContent] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState<string | null>(null);

  // Sync props when user changes
  useEffect(() => {
    if (currentUserName) setStudentName(currentUserName);
    if (currentUserEmail) setStudentEmail(currentUserEmail);
    if (currentUserClass) setStudentClass(currentUserClass);
  }, [currentUserName, currentUserEmail, currentUserClass]);

  // All messages / homework
  const [messages, setMessages] = useState<AdminInboxMessage[]>(() => getAllAdminMessages());

  useEffect(() => {
    const handleSync = () => {
      setMessages(getAllAdminMessages());
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  // Filter homework for current student
  const studentSubmissions = messages.filter(m => {
    if (m.type !== 'homework_submission') return false;
    const matchEmail = (m.studentEmail || '').toLowerCase() === (studentEmail || '').toLowerCase();
    const matchName = (m.studentName || '').toLowerCase() === (studentName || '').toLowerCase();
    return matchEmail || matchName;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim() || !homeworkTitle.trim() || !homeworkContent.trim()) {
      return;
    }

    const newHw = submitStudentHomework({
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim(),
      studentClass: studentClass.trim() || 'SS3',
      subject,
      homeworkTitle: homeworkTitle.trim(),
      messageContent: homeworkContent.trim(),
      attachmentName: attachmentName.trim() || undefined
    });

    setMessages(getAllAdminMessages());
    setHomeworkTitle('');
    setHomeworkContent('');
    setAttachmentName('');
    playSuccessSound();

    setSubmitSuccessNotice(`✓ Homework "${newHw.homeworkTitle}" has been submitted to Admin Victoria Okajoe! Check "My Submitted Homework & Marks" to view your marks.`);
    setActiveTab('history');
    setTimeout(() => setSubmitSuccessNotice(null), 6000);
  };

  const gradedCount = studentSubmissions.filter(s => s.status === 'graded').length;

  return (
    <div id="student-homework-section" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-fade-in space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#071a3d] via-[#0d2a5e] to-[#124b91] text-white p-6 sm:p-8 relative overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at 85% 20%, #60a5fa, transparent 50%), radial-gradient(circle at 15% 85%, #34d399, transparent 40%)'
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/25 text-[#a5b4fc] text-xs font-black uppercase tracking-wider border border-indigo-400/30">
              <FileText size={14} className="text-[#62c5fa]" />
              <span>Homework Submission & Grading Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Submit Homework to Admin & Receive Marks & Answers</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#c8daf3] max-w-xl leading-relaxed">
              When you submit your homework here, it goes directly to Administrator Victoria Okajoe in a message. The administrator reviews your work, awards your <strong>marks/score</strong>, and returns the <strong>official model answers</strong>.
            </p>
          </div>

          {/* Submissions Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-13 h-13 rounded-2xl bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center text-[#62c5fa] shrink-0">
              <Award size={26} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">
                My Homework Status
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {studentSubmissions.length} Submitted
              </div>
              <span className="text-[11px] text-emerald-300 flex items-center gap-1.5 font-bold">
                <span>{gradedCount} Graded with Answers</span>
                <span>•</span>
                <span>{studentSubmissions.length - gradedCount} Pending</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'submit'
                ? 'bg-[#081a3d] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Send size={14} className={activeTab === 'submit' ? 'text-[#62c5fa]' : 'text-slate-400'} />
            <span>Submit New Homework</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#081a3d] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award size={14} className={activeTab === 'history' ? 'text-amber-400' : 'text-slate-400'} />
            <span>My Submitted Homework & Marks ({studentSubmissions.length})</span>
          </button>
        </div>

        {submitSuccessNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-fade-in shadow-xs">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{submitSuccessNotice}</span>
          </div>
        )}

        {/* TAB 1: SUBMIT NEW HOMEWORK FORM */}
        {activeTab === 'submit' && (
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <UserCheck size={16} className="text-emerald-600" />
                <span>Student Submitter Information:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Chidubem Okafor"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
                    Student Registered Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="student@school.edu"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
                    Class (SS1 - SS3) *
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="SS3">SS3 (Senior Secondary 3)</option>
                    <option value="SS2">SS2 (Senior Secondary 2)</option>
                    <option value="SS1">SS1 (Senior Secondary 1)</option>
                    <option value="JSS3">JSS3</option>
                    <option value="JSS2">JSS2</option>
                    <option value="JSS1">JSS1</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                  Subject *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {COMMON_SUBJECTS.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                  Homework Title / Topic *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4: Simultaneous Equations Problem Set"
                  value={homeworkTitle}
                  onChange={(e) => setHomeworkTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                Your Homework Answers & Step-by-Step Solutions *
              </label>
              <textarea
                required
                rows={7}
                placeholder="Type your complete homework answers, equations, proofs, or essay solutions here. Make sure each question is clearly numbered (e.g. 1, 2, 3...) so the administrator can grade and return model answers."
                value={homeworkContent}
                onChange={(e) => setHomeworkContent(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-300 text-xs sm:text-sm font-mono text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                Optional Attachment / Reference Name
              </label>
              <input
                type="text"
                placeholder="e.g. Math_Exercise_Page42_Diagram.pdf"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-98"
            >
              <Send size={16} />
              <span>Submit Homework to Admin (Victoria Okajoe)</span>
            </button>
          </form>
        )}

        {/* TAB 2: MY SUBMITTED HOMEWORK & MARKS */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fade-in">
            {studentSubmissions.map(item => {
              const isGraded = item.status === 'graded';
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isGraded
                      ? 'bg-gradient-to-b from-emerald-50/40 to-white border-emerald-300 shadow-sm'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[10px] font-black border border-indigo-100 uppercase">
                          {item.subject}
                        </span>
                        <span className="text-xs text-slate-400">
                          Submitted {item.submittedAt}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-[#081a3d]">
                        {item.homeworkTitle}
                      </h4>
                    </div>

                    <div>
                      {isGraded ? (
                        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black flex items-center gap-1.5 shadow-2xs">
                          <CheckCircle2 size={15} className="text-emerald-700" />
                          <span>Graded & Answers Returned!</span>
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                          <Clock size={14} className="text-amber-600 animate-spin" />
                          <span>Pending Admin Review</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submitted Work Snippet */}
                  <div className="py-3">
                    <span className="text-[10.5px] font-black uppercase text-slate-400 block mb-1">
                      Your Submitted Homework Work:
                    </span>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {item.messageContent}
                    </div>
                  </div>

                  {/* ADMIN MARKS & MODEL ANSWERS (HERO FEATURE) */}
                  {isGraded && item.adminReply && (
                    <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white border-2 border-emerald-400/80 space-y-3 shadow-xs">
                      
                      {/* Score Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-200">
                        <div className="flex items-center gap-2">
                          <Award size={20} className="text-emerald-600" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Marks Awarded by Admin:</span>
                            <span className="text-lg font-black text-emerald-800">{item.adminReply.marks || '100%'}</span>
                          </div>
                        </div>

                        <span className="text-[11px] text-slate-500 font-medium">
                          Graded by <strong>{item.adminReply.repliedBy}</strong> • {item.adminReply.repliedAt}
                        </span>
                      </div>

                      {/* Official Model Answers */}
                      {item.adminReply.modelAnswers && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-black uppercase text-emerald-950 flex items-center gap-1.5">
                            <Sparkles size={13} className="text-emerald-600" />
                            <span>Official Model Answers & Corrections:</span>
                          </span>
                          <div className="p-3.5 rounded-xl bg-white border border-emerald-200 font-mono text-xs text-slate-800 whitespace-pre-wrap">
                            {item.adminReply.modelAnswers}
                          </div>
                        </div>
                      )}

                      {/* Feedback Notes */}
                      {item.adminReply.feedbackNotes && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-black uppercase text-emerald-950 flex items-center gap-1.5">
                            <MessageSquare size={13} className="text-emerald-600" />
                            <span>Administrator Feedback & Guidance:</span>
                          </span>
                          <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-emerald-200 leading-relaxed italic">
                            “{item.adminReply.feedbackNotes}”
                          </p>
                        </div>
                      )}

                    </div>
                  )}

                  {!isGraded && (
                    <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2">
                      <Clock size={13} className="shrink-0" />
                      <span>This homework is currently with Administrator Victoria Okajoe. When the administrator reviews and replies, your marks and model answers will appear right here!</span>
                    </div>
                  )}
                </div>
              );
            })}

            {studentSubmissions.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <FileText size={24} className="mx-auto text-slate-300" />
                <p className="font-bold text-slate-600">No homework submitted yet.</p>
                <p>Click &quot;Submit New Homework&quot; above to submit your assignments to Admin Victoria Okajoe!</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
