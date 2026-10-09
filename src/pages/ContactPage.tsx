import React, { useState } from 'react';
import { 
  Mail, MessageSquare, HelpCircle, CheckCircle2, 
  Send, School, Sparkles, ChevronDown, ChevronUp,
  ShieldCheck, ArrowRight, Eye, User as UserIcon
} from 'lucide-react';
import { sendContactUsMessage } from '../utils/homeworkMessageManager';
import { AdminMessagesAndHomeworkDesk } from '../components/AdminMessagesAndHomeworkDesk';
import { playSuccessSound } from '../utils/sound';
import { User } from '../types';

interface ContactPageProps {
  currentUser?: User | null;
  onNavigateToClassAdmin?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  currentUser,
  onNavigateToClassAdmin
}) => {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'student_admin';
  const [showAdminDesk, setShowAdminDesk] = useState<boolean>(false);
  const canViewAdminDesk = Boolean(isAdmin && showAdminDesk);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    role: 'High School Student',
    topic: 'Study Support',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Echo Plan help me stop procrastinating on homework?',
      a: 'Echo Plan combines time-blocking with our 25-minute Pomodoro focus sprints. By breaking daunting projects into 25-minute low-friction intervals with scheduled rest breaks, the mental resistance to starting vanishes.'
    },
    {
      q: 'Are my tasks, habits, and goals saved if I close my browser tab?',
      a: 'Yes! Echo Plan utilizes reliable local browser persistence. Your daily plans, checked habits, and semester goals remain intact whenever you return.'
    },
    {
      q: 'Can educators or student council clubs use Echo Plan?',
      a: 'Absolutely. Many school study halls and student advisory periods adopt Echo Plan as a standardized daily planner to help students build self-directed study skills.'
    },
    {
      q: 'What is the most effective way to use the Active Recall tool?',
      a: 'Before opening your lecture notes, attempt to write down or speak the answer to the prompt. Testing yourself forces your brain to build robust neural pathways that hold up during exam pressure.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    sendContactUsMessage({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      topic: formData.topic,
      message: formData.message
    });

    playSuccessSound();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f6f9ff]">
      {/* Header */}
      <section className="relative py-20 px-6 sm:px-10 lg:px-[7%] bg-[#071a3d] text-white overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 75% 25%, rgba(98, 197, 250, 0.25), transparent 45%), linear-gradient(115deg, #071a3d, #0b2b62 60%, #164b91)'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#62c5fa]/40 rounded-full bg-white/5 text-[#ccecff] text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            ✦ STUDENT & EDUCATOR SUPPORT
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            We&apos;re Here to Help You <span className="text-[#61c6fb]">Succeed</span>
          </h1>
          <p className="text-[#c8daf3] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Have questions about study routines, feature suggestions, or bringing Echo Plan to your school or study group? Reach out to our student advisory team.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 px-6 sm:px-10 lg:px-[7%] max-w-[1250px] mx-auto space-y-8">
        
        {/* Strictly Visible ONLY to Authorized Administrators (Victoria Okajoe) */}
        {isAdmin && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0b1f47] text-white border border-indigo-500/50 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold border border-amber-400/30">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                  <span>👑 Administrator Access</span>
                  <span>•</span>
                  <span>Victoria Okajoe</span>
                </div>
                <h3 className="text-xs sm:text-sm font-black text-white">
                  Incoming Student Messages & Homework Review Desk
                </h3>
                <p className="text-[11px] text-[#c8daf3]">
                  All messages sent through Contact Us and all student homework submissions arrive in this secure inbox.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAdminDesk(!showAdminDesk)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-xs active:scale-95 border ${
                showAdminDesk
                  ? 'bg-amber-500 text-slate-900 border-amber-400 font-black shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <Eye size={14} />
              <span>{showAdminDesk ? '← Switch to Standard Contact View' : 'Open Administrator Messages & Homework Desk'}</span>
            </button>
          </div>
        )}

        {/* When Admin Desk is active AND user is strictly an admin, show the desk */}
        {canViewAdminDesk ? (
          <div className="animate-fade-in">
            <AdminMessagesAndHomeworkDesk adminName={currentUser?.name || 'Victoria Okajoe'} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md">
            <h2 className="text-2xl font-extrabold text-[#081a3d] mb-2 flex items-center gap-2">
              <MessageSquare size={22} className="text-[#1976d2]" />
              Send Us a Message
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Fill out the form below and our team will respond within 24 hours.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-fade-up">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-emerald-900">Message Received!</h3>
                <p className="text-sm text-emerald-700 mt-1 max-w-md mx-auto">
                  Thank you, {formData.name}. We have received your inquiry regarding &quot;{formData.topic}&quot; and our student mentors will be in touch shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', role: 'High School Student', topic: 'Study Support', message: '' });
                  }}
                  className="mt-5 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Taylor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@school.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      I Am A
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                    >
                      <option value="High School Student">High School Student</option>
                      <option value="College/University Student">College/University Student</option>
                      <option value="Middle School Student">Middle School Student</option>
                      <option value="Teacher/Educator">Teacher / Educator</option>
                      <option value="Parent">Parent / Guardian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                    >
                      <option value="Study Support">Study Habit Advice</option>
                      <option value="School License">School Pilot / Club Adoption</option>
                      <option value="Feature Request">Feature Suggestion</option>
                      <option value="Bug Report">Technical Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    How Can We Help You?
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what's on your mind or how Echo Plan can assist your academic routine..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1976d2] text-white font-bold rounded-xl text-sm hover:bg-[#1565c0] shadow-md transition-all cursor-pointer"
                >
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Quick Info & FAQ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-[#081a3d] to-[#14366e] text-white rounded-3xl p-6 sm:p-8 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-[#62c5fa] flex items-center justify-center mb-4">
                <School size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">School & Club Inquiries</h3>
              <p className="text-xs text-[#c8daf3] leading-relaxed mb-4">
                Interested in using Echo Plan across your homeroom, honors program, or athletic study hall? We offer ready-made student templates and printable schedules.
              </p>
              <div className="text-xs text-[#83bce1] font-semibold flex items-center gap-1.5">
                <Mail size={14} /> support@echoplan.school
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-base font-bold text-[#081a3d] mb-4 flex items-center gap-2">
                <HelpCircle size={18} className="text-sky-600" /> Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left p-3.5 text-xs font-bold text-[#081a3d] bg-[#f8fbff] flex justify-between items-center hover:bg-slate-100 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {openFaq === idx && (
                      <div className="p-3.5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100 animate-fade-up">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        )}
      </section>
    </div>
  );
};
