import React, { useState, useEffect } from 'react';
import { 
  Inbox, FileText, MessageSquare, Award, CheckCircle2, 
  Clock, Send, Trash2, Search, Filter, Sparkles, X, 
  ArrowRight, ShieldCheck, Mail, Check, User, ShieldAlert
} from 'lucide-react';
import { 
  AdminInboxMessage, 
  getAllAdminMessages, 
  replyAndGradeHomework, 
  replyContactUsMessage, 
  deleteAdminMessage 
} from '../utils/homeworkMessageManager';
import { playSuccessSound } from '../utils/sound';

interface AdminMessagesAndHomeworkDeskProps {
  onClose?: () => void;
  adminName?: string;
}

export const AdminMessagesAndHomeworkDesk: React.FC<AdminMessagesAndHomeworkDeskProps> = ({
  onClose,
  adminName = 'Victoria Okajoe'
}) => {
  // Authorization check: Only admins can view incoming messages & homework
  const isAuthorized = (() => {
    try {
      const saved = localStorage.getItem('echo_plan_user');
      if (saved) {
        const u = JSON.parse(saved);
        return Boolean(u && (u.role === 'admin' || u.role === 'student_admin'));
      }
    } catch {
      // fallback
    }
    return false;
  })();

  const [messages, setMessages] = useState<AdminInboxMessage[]>(() => getAllAdminMessages());
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'homework' | 'contact' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected message for viewing / grading modal
  const [activeMessage, setActiveMessage] = useState<AdminInboxMessage | null>(null);

  // Grading form states
  const [marksInput, setMarksInput] = useState('');
  const [modelAnswersInput, setModelAnswersInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Synchronize with storage
  useEffect(() => {
    const handleSync = () => {
      setMessages(getAllAdminMessages());
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-3 shadow-md max-w-lg mx-auto my-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <ShieldAlert size={28} />
        </div>
        <h3 className="text-lg font-black text-slate-900">
          Access Restricted • Administrator Only
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Visitors, unregistered users, and students do not have permission to view incoming messages or student homework submissions. This desk is accessible strictly to Administrator Victoria Okajoe.
        </p>
      </div>
    );
  }

  const openGradingPanel = (msg: AdminInboxMessage) => {
    setActiveMessage(msg);
    setMarksInput(msg.adminReply?.marks || '');
    setModelAnswersInput(msg.adminReply?.modelAnswers || '');
    setFeedbackInput(msg.adminReply?.feedbackNotes || '');
    setActionSuccessNotice(null);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMessage) return;

    if (activeMessage.type === 'homework_submission') {
      if (!marksInput.trim() || !modelAnswersInput.trim()) return;

      replyAndGradeHomework(activeMessage.id, {
        marks: marksInput.trim(),
        modelAnswers: modelAnswersInput.trim(),
        feedbackNotes: feedbackInput.trim() || 'Work reviewed and approved by administrator.',
        repliedBy: `${adminName} (Sole Administrator)`
      });

      setActionSuccessNotice(`✓ Graded "${activeMessage.homeworkTitle}"! Marks (${marksInput}) & model answers sent to ${activeMessage.studentName}.`);
    } else {
      // Contact Us reply
      if (!feedbackInput.trim()) return;

      replyContactUsMessage(activeMessage.id, feedbackInput.trim(), `${adminName} (Sole Administrator)`);
      setActionSuccessNotice(`✓ Replied to ${activeMessage.studentName}! Response sent to their message portal.`);
    }

    setMessages(getAllAdminMessages());
    playSuccessSound();

    setTimeout(() => {
      setActiveMessage(null);
      setActionSuccessNotice(null);
    }, 2000);
  };

  const handleDelete = (id: string) => {
    deleteAdminMessage(id);
    setMessages(getAllAdminMessages());
    if (activeMessage?.id === id) {
      setActiveMessage(null);
    }
    playSuccessSound();
  };

  // Filter messages
  const filteredList = messages.filter(item => {
    if (selectedFilter === 'homework' && item.type !== 'homework_submission') return false;
    if (selectedFilter === 'contact' && item.type !== 'contact_us') return false;
    if (selectedFilter === 'pending' && item.status !== 'pending') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (item.studentName || '').toLowerCase().includes(q);
      const matchEmail = (item.studentEmail || '').toLowerCase().includes(q);
      const matchSubject = (item.subject || '').toLowerCase().includes(q);
      const matchTitle = (item.homeworkTitle || item.topic || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchSubject || matchTitle;
    }
    return true;
  });

  const homeworkCount = messages.filter(m => m.type === 'homework_submission').length;
  const contactCount = messages.filter(m => m.type === 'contact_us').length;
  const pendingCount = messages.filter(m => m.status === 'pending').length;

  return (
    <div id="admin-homework-messages-desk" className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#071a3d] via-[#0d2a5e] to-[#124b91] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Sole Administrator Desk • Victoria Okajoe</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Contact Us & Homework Review Desk for Admin</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#c8daf3] max-w-2xl leading-relaxed">
            All messages submitted from <strong>Contact Us</strong> and all <strong>Student Homework Submissions</strong> arrive here in real time. Review homework solutions, award marks/scores, and return model answers.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Total Items</span>
            <span className="text-2xl font-black text-white">{messages.length}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-amber-200 block">Pending</span>
            <span className="text-2xl font-black text-amber-300">{pendingCount}</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Controls Bar: Filters & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-[#081a3d] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Items ({messages.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter('homework')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === 'homework'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <FileText size={13} />
              <span>Homework Submissions ({homeworkCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter('contact')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === 'contact'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <Mail size={13} />
              <span>Contact Us Inquiries ({contactCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter('pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === 'pending'
                  ? 'bg-amber-500 text-slate-900 shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Clock size={13} />
              <span>Needs Review ({pendingCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search student, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Message Items List */}
        <div className="space-y-3.5">
          {filteredList.map((item) => {
            const isHomework = item.type === 'homework_submission';
            const isGraded = item.status === 'graded';
            const isReviewed = item.status === 'reviewed';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.status === 'pending'
                    ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      isHomework ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isHomework ? <FileText size={18} /> : <Mail size={18} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">
                          {item.studentName}
                        </span>
                        {item.studentClass && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black">
                            {item.studentClass}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">
                          • {item.studentEmail}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <strong className="text-indigo-900">{isHomework ? `[Homework] ${item.subject}` : `[Contact Us] ${item.topic}`}</strong>
                        <span>• Submitted {item.submittedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {item.status === 'pending' ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10.5px] font-black border border-amber-200 flex items-center gap-1">
                        <Clock size={12} /> Needs Review
                      </span>
                    ) : isGraded ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-black border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Graded ({item.adminReply?.marks})
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10.5px] font-black border border-blue-200 flex items-center gap-1">
                        <Check size={12} /> Replied
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => openGradingPanel(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#081a3d] hover:bg-indigo-900 text-white font-black text-xs cursor-pointer transition-all shadow-xs flex items-center gap-1 active:scale-95"
                    >
                      <span>{isHomework ? (isGraded ? 'Edit Marks/Answers' : 'Grade Homework') : (isReviewed ? 'View Reply' : 'Reply to Student')}</span>
                      <ArrowRight size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="pt-3 space-y-2">
                  <h4 className="text-xs font-black text-slate-800">
                    {item.homeworkTitle || item.topic}
                  </h4>
                  <p className="text-xs text-slate-600 font-mono line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {item.messageContent}
                  </p>

                  {/* Display existing marks if already graded */}
                  {item.adminReply && (
                    <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-2">
                      <span>✓ Current Marks: <strong>{item.adminReply.marks || 'Graded'}</strong></span>
                      <span className="text-slate-500">Graded by {item.adminReply.repliedBy}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredList.length === 0 && (
            <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No messages or homework submissions found for the selected filter.
            </div>
          )}
        </div>

        {/* MODAL / DRAWER: GRADE HOMEWORK OR REPLY TO STUDENT */}
        {activeMessage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#081a3d]/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
            onClick={() => setActiveMessage(null)}
          >
            <div 
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold ${
                    activeMessage.type === 'homework_submission' ? 'bg-indigo-600' : 'bg-blue-600'
                  }`}>
                    {activeMessage.type === 'homework_submission' ? <Award size={20} /> : <Mail size={20} />}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#081a3d]">
                      {activeMessage.type === 'homework_submission' ? 'Grade Homework & Return Model Answers' : 'Reply to Student Contact Message'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Student: <strong>{activeMessage.studentName}</strong> ({activeMessage.studentClass || 'Student'}) • {activeMessage.studentEmail}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMessage(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Student's Submitted Work */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-black uppercase text-slate-600 block">
                  Student&apos;s Submitted Solution / Message:
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                  {activeMessage.messageContent}
                </div>
              </div>

              {/* Admin Grading & Solution Input Form */}
              <form onSubmit={handleGradeSubmit} className="space-y-4 pt-2">
                {activeMessage.type === 'homework_submission' ? (
                  <>
                    <div>
                      <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                        Award Marks / Score (e.g. 95 / 100 or Grade A) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 92 / 100 (Grade A Distinction)"
                        value={marksInput}
                        onChange={(e) => setMarksInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-400 font-black text-xs text-slate-900 bg-emerald-50/20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                        Official Model Answers & Step-by-Step Solutions *
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Provide the step-by-step correct answers and model working so the student can study where they excelled or made errors."
                        value={modelAnswersInput}
                        onChange={(e) => setModelAnswersInput(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </>
                ) : null}

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-700 block mb-1">
                    {activeMessage.type === 'homework_submission' ? 'Administrator Feedback & Advice' : 'Reply Message to Student *'}
                  </label>
                  <textarea
                    required={activeMessage.type === 'contact_us'}
                    rows={3}
                    placeholder="Provide constructive feedback, encouragement, or specific corrections for this student."
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {actionSuccessNotice && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>{actionSuccessNotice}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveMessage(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    <Send size={14} />
                    <span>{activeMessage.type === 'homework_submission' ? 'Save Marks & Send Answers' : 'Send Reply'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
