import React, { useState } from 'react';
import { 
  Menu, X, Home, Info, Sparkles, Calendar, 
  BarChart3, BookOpen, Users, Mail, ShieldCheck, 
  LogIn, LogOut, User as UserIcon, Edit3, Lock, UserPlus, Compass, Award, Globe
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  onNavigate: (pageId: string) => void;
  currentPage: string;
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenEditName?: () => void;
  onOpenRegistration?: () => void;
  onOpenAdminStudents?: () => void;
  onOpenLiveLogins?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, 
  currentPage,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenEditName,
  onOpenRegistration,
  onOpenAdminStudents,
  onOpenLiveLogins
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAV_PAGES = [
    { id: 'home', label: 'Home', icon: Home, requiresReg: false },
    { id: 'features', label: 'Features', icon: Sparkles, requiresReg: false },
    { id: 'about', label: 'About Us', icon: Info, requiresReg: false },
    { id: 'leadership', label: 'Leadership', icon: Award, requiresReg: false },
    { id: 'planner', label: 'Daily Plan', icon: Calendar, requiresReg: true },
    { id: 'habits', label: 'Habits & Strikes', icon: BarChart3, requiresReg: true },
    { id: 'class', label: 'Classes & CBT', icon: ShieldCheck, requiresReg: true, isAdminBadge: true },
    { id: 'contact', label: 'Contact Us', icon: Mail, requiresReg: false },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#081a3d] text-white border-b border-white/10 shadow-md">
      <div className="max-w-[1440px] mx-auto h-[80px] sm:h-[86px] px-4 sm:px-6 lg:px-6 flex items-center justify-between gap-4">
        
        {/* Logo / Brand Area */}
        <button
          id="nav-logo-btn"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer shrink-0"
        >
          <div className="w-[42px] h-[42px] sm:w-[44px] sm:h-[44px] rounded-[13px] bg-[#56bdf7] text-[#081a3d] flex items-center justify-center font-black text-[15px] tracking-wider shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            EP
          </div>
          <div className="leading-tight">
            <h2 className="font-brand-title text-[19px] sm:text-[22px] font-bold tracking-wide text-white group-hover:text-[#62c5fa] transition-colors">
              ECHO PLAN
            </h2>
            <span className="block text-[8px] sm:text-[8.5px] tracking-[3px] sm:tracking-[3.5px] uppercase text-[#83bce1] font-semibold">
              SCHOOL HELPER
            </span>
          </div>
        </button>

        {/* Desktop Header Navigation Links (Always on Header) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_PAGES.map((page) => {
            const isActive = currentPage === page.id;
            const isRestricted = page.requiresReg && !currentUser;
            const Icon = page.icon;

            return (
              <button
                key={page.id}
                id={`nav-link-${page.id}`}
                onClick={() => handleNavClick(page.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] xl:text-[13.5px] font-semibold transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-[#62c5fa] text-[#081a3d] font-bold shadow-xs'
                    : 'text-[#dbe7fa] hover:text-white hover:bg-white/10'
                }`}
                title={page.label + (isRestricted ? ' (Requires Student Registration)' : '')}
              >
                <Icon size={14} className={isActive ? 'text-[#081a3d]' : 'text-[#83bce1]'} />
                <span>{page.label}</span>
                {isRestricted && (
                  <Lock size={12} className={isActive ? 'text-[#081a3d]' : 'text-amber-300'} />
                )}
                {page.isAdminBadge && (currentUser?.role === 'admin' || currentUser?.role === 'student_admin') && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account / Auth Actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2">
              {(currentUser.role === 'admin' || currentUser.role === 'student_admin') && onOpenAdminStudents && (
                <button
                  id="nav-admin-view-students-btn"
                  onClick={onOpenAdminStudents}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/25 hover:bg-indigo-500/40 text-[#c7d2fe] hover:text-white border border-indigo-400/40 text-xs font-black transition-all cursor-pointer shadow-xs"
                  title="Admin: View all registered students directory"
                >
                  <Users size={14} className="text-[#62c5fa]" />
                  <span className="hidden xl:inline">Registered Students</span>
                  <span className="xl:hidden">Students</span>
                </button>
              )}

              {(currentUser.role === 'admin' || currentUser.role === 'student_admin') && onOpenLiveLogins && (
                <button
                  id="nav-admin-live-logins-btn"
                  onClick={onOpenLiveLogins}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-200 hover:text-white border border-emerald-400/40 text-xs font-black transition-all cursor-pointer shadow-xs"
                  title="Admin: View student logins across the globe in real time"
                >
                  <Globe size={14} className="text-emerald-400" />
                  <span className="hidden xl:inline">Live Logins (Global)</span>
                  <span className="xl:hidden">Live Logins</span>
                </button>
              )}

              <button
                onClick={() => handleNavClick('class')}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-colors text-left cursor-pointer"
                title="Go to Class page"
              >
                <div className={`w-7 h-7 rounded-full ${currentUser.avatarBg || 'bg-indigo-600'} text-white flex items-center justify-center font-bold text-xs`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left leading-none">
                  <div className="text-xs font-bold text-white truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[9.5px] text-[#62c5fa] font-semibold mt-0.5 truncate max-w-[120px]">
                    {currentUser.role === 'admin' || currentUser.role === 'student_admin' ? 'Sole Administrator' : `Class ${currentUser.grade || 'SS3'} Student`}
                  </div>
                </div>
              </button>

              {onOpenEditName && (
                <button
                  onClick={onOpenEditName}
                  className="p-2 text-slate-300 hover:text-[#62c5fa] rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  title="Change display name"
                  aria-label="Change display name"
                >
                  <Edit3 size={15} />
                </button>
              )}

              <button
                onClick={onLogout}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {onOpenRegistration && (
                <button
                  onClick={onOpenRegistration}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/20"
                >
                  <UserPlus size={13} />
                  <span>Register as Student</span>
                </button>
              )}
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-sky-400/40 text-sky-200 hover:text-white hover:bg-white/10 text-xs font-bold transition-all cursor-pointer"
              >
                <LogIn size={14} />
                <span>Log In</span>
              </button>
            </div>
          )}

          <button
            id="nav-cta-btn"
            onClick={() => handleNavClick('planner')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#62c5fa] text-[#092044] text-[13px] font-extrabold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(98,197,250,0.35)] cursor-pointer"
          >
            <span>Daily Plan</span>
            {!currentUser ? <Lock size={12} className="text-[#092044]" /> : <Calendar size={13} />}
          </button>
        </div>

        {/* Mobile Hamburger & Quick Login Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          {!currentUser ? (
            <div className="flex items-center gap-1.5">
              {onOpenRegistration && (
                <button
                  onClick={onOpenRegistration}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow-xs"
                >
                  <UserPlus size={12} /> Register
                </button>
              )}
              <button
                onClick={onOpenLogin}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 text-sky-200 text-xs font-bold flex items-center gap-1"
              >
                <LogIn size={12} /> Login
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('class')}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1"
            >
              <ShieldCheck size={13} /> Class
            </button>
          )}

          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/90 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62c5fa]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile & Tablet Header Page Navigation Ribbon - Pages prominently on the header! */}
      <div 
        id="header-mobile-pages-ribbon"
        className="lg:hidden border-t border-white/10 bg-[#061430]/95 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar shadow-inner"
      >
        {NAV_PAGES.map((page) => {
          const isActive = currentPage === page.id;
          const isRestricted = page.requiresReg && !currentUser;
          const Icon = page.icon;

          return (
            <button
              key={page.id}
              id={`nav-header-pill-${page.id}`}
              onClick={() => handleNavClick(page.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#62c5fa] text-[#081a3d] font-extrabold shadow-sm ring-1 ring-sky-300/50'
                  : 'text-[#c8daf3] bg-white/5 hover:bg-white/15 hover:text-white border border-white/10'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-[#081a3d]' : 'text-sky-300'} />
              <span>{page.label}</span>
              {isRestricted && (
                <Lock size={11} className={isActive ? 'text-[#081a3d]' : 'text-amber-300'} />
              )}
              {page.isAdminBadge && (currentUser?.role === 'admin' || currentUser?.role === 'student_admin') && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#081a3d]/98 border-b border-white/10 px-6 py-5 flex flex-col gap-2 backdrop-blur-md animate-fade-up">
          {currentUser && (
            <div className="p-3 mb-2 rounded-2xl bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full ${currentUser.avatarBg || 'bg-indigo-600'} text-white flex items-center justify-center font-bold text-xs`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-indigo-300">
                    {currentUser.role === 'admin' || currentUser.role === 'student_admin'
                      ? 'Sole Administrator (All Classes)' 
                      : `Class ${currentUser.grade || 'SS3'} • Registered Student`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {onOpenEditName && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenEditName();
                    }}
                    className="text-xs text-sky-300 font-bold p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
                    title="Change Name"
                  >
                    <Edit3 size={13} />
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="text-xs text-rose-300 font-bold px-2.5 py-1 rounded-lg bg-rose-950/40"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'student_admin') && onOpenAdminStudents && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminStudents();
              }}
              className="w-full mb-2 p-3 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 text-white flex items-center justify-between text-xs font-black cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#62c5fa]" />
                <span>View All Registered Students (Admin Directory)</span>
              </div>
              <span className="text-[10px] bg-indigo-500/40 px-2 py-0.5 rounded-full">Open</span>
            </button>
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'student_admin') && onOpenLiveLogins && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLiveLogins();
              }}
              className="w-full mb-2 p-3 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 text-white flex items-center justify-between text-xs font-black cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-emerald-400" />
                <span>🌐 Live Student Logins (Worldwide Feed)</span>
              </div>
              <span className="text-[10px] bg-emerald-500/40 px-2 py-0.5 rounded-full">Live</span>
            </button>
          )}

          {!currentUser && (
            <div className="mb-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
              <span>Unregistered Visitor</span>
              {onOpenRegistration && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegistration();
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs"
                >
                  Register Now
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-3 text-left text-xs font-semibold py-2 px-3 rounded-xl ${
              currentPage === 'home' ? 'bg-[#62c5fa] text-[#081a3d] font-bold' : 'text-[#dbe7fa] hover:bg-white/5'
            }`}
          >
            <Home size={15} /> Home
          </button>

          <button
            onClick={() => handleNavClick('features')}
            className={`flex items-center gap-3 text-left text-xs font-semibold py-2 px-3 rounded-xl ${
              currentPage === 'features' ? 'bg-[#62c5fa] text-[#081a3d] font-bold' : 'text-[#dbe7fa] hover:bg-white/5'
            }`}
          >
            <Sparkles size={15} /> Features
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`flex items-center gap-3 text-left text-xs font-semibold py-2 px-3 rounded-xl ${
              currentPage === 'about' ? 'bg-[#62c5fa] text-[#081a3d] font-bold' : 'text-[#dbe7fa] hover:bg-white/5'
            }`}
          >
            <Info size={15} /> About Us
          </button>

          <button
            onClick={() => handleNavClick('planner')}
            className={`flex items-center justify-between text-left text-xs font-semibold py-2 px-3 rounded-xl ${
              currentPage === 'planner' ? 'bg-[#62c5fa] text-[#081a3d] font-bold' : 'text-[#dbe7fa] hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar size={15} /> Daily Plan
            </div>
            {!currentUser && <Lock size={13} className="text-amber-300" />}
          </button>

          <button
            onClick={() => handleNavClick('habits')}
            className={`flex items-center justify-between text-left text-xs font-semibold py-2 px-3 rounded-xl ${
              currentPage === 'habits' ? 'bg-[#62c5fa] text-[#081a3d] font-bold' : 'text-[#dbe7fa] hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 size={15} /> Habits & Strikes
            </div>
            {!currentUser && <Lock size={13} className="text-amber-300" />}
          </button>

          <button
            onClick={() => handleNavClick('class')}
            className={`flex items-center justify-between text-left text-xs font-bold py-2 px-3 rounded-xl ${
              currentPage === 'class' ? 'bg-indigo-600 text-white font-bold' : 'text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={15} className="text-[#818cf8]" /> Classes
            </div>
            {!currentUser && <Lock size={13} className="text-amber-300" />}
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`flex items-center gap-3 text-left text-xs font-semibold py-2 px-3 rounded-xl ${
              currentPage === 'contact' ? 'bg-[#62c5fa] text-[#081a3d] font-bold' : 'text-[#dbe7fa] hover:bg-white/5'
            }`}
          >
            <Mail size={15} /> Contact Us
          </button>

          {!currentUser && (
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2 mt-2">
              {onOpenRegistration && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegistration();
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-center rounded-xl flex items-center justify-center gap-2"
                >
                  <UserPlus size={15} /> Register as Student
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-center rounded-xl flex items-center justify-center gap-2"
              >
                <LogIn size={15} /> Log In
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
