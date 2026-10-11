import React, { useState, useEffect } from 'react';
import { 
  Globe, ShieldCheck, Search, Filter, RefreshCw, 
  User as UserIcon, Smartphone, Laptop, CheckCircle2, 
  MapPin, Clock, Wifi, ShieldAlert, Sparkles, X, 
  Activity, ArrowRight, Copy, Check
} from 'lucide-react';
import { 
  StudentLoginAuditLog, 
  getAllStudentLoginLogs, 
  fetchGlobalStudentLoginsFromServer,
  logStudentLoginEvent, 
  resetLoginLogsToSeed, 
  clearAllLoginLogs 
} from '../utils/loginAuditManager';
import { playSuccessSound } from '../utils/sound';

interface AdminGlobalLoginMonitorProps {
  onClose?: () => void;
  adminName?: string;
}

export const AdminGlobalLoginMonitor: React.FC<AdminGlobalLoginMonitorProps> = ({
  onClose,
  adminName = 'Victoria Okajoe'
}) => {
  const [logs, setLogs] = useState<StudentLoginAuditLog[]>(() => getAllStudentLoginLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Synchronize live with backend server every 4 seconds and local events
  useEffect(() => {
    let isMounted = true;

    const pullFromServer = async () => {
      try {
        const serverLogs = await fetchGlobalStudentLoginsFromServer();
        if (isMounted && Array.isArray(serverLogs) && serverLogs.length > 0) {
          setLogs(serverLogs);
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch (e) {
        // fallback
      }
    };

    pullFromServer();
    const interval = setInterval(pullFromServer, 4000);

    const handleSync = () => {
      setLogs(getAllStudentLoginLogs());
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('echo_plan_student_login_event', handleSync);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('echo_plan_student_login_event', handleSync);
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    playSuccessSound();
    const serverLogs = await fetchGlobalStudentLoginsFromServer();
    if (serverLogs && serverLogs.length > 0) {
      setLogs(serverLogs);
    } else {
      setLogs(getAllStudentLoginLogs());
    }
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    playSuccessSound();
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleSimulateNewLogin = () => {
    const sampleStudents = [
      { name: 'Kelechi Okafor', grade: 'SS3', school: "King's College Lagos", email: 'kelechi.o@student.echo.edu.ng' },
      { name: 'Zainab Danjuma', grade: 'SS2', school: 'Queen\'s College Yaba', email: 'zainab.d@student.echo.edu.ng' },
      { name: 'David Adeleke', grade: 'SS1', school: 'Corona Secondary School', email: 'david.a@student.echo.edu.ng' },
      { name: 'Emeka Nnamdi', grade: 'SS3', school: 'Federal Government College Lagos', email: 'emeka.n@student.echo.edu.ng' }
    ];
    const picked = sampleStudents[Math.floor(Math.random() * sampleStudents.length)];
    const newLog = logStudentLoginEvent(picked);
    setLogs(getAllStudentLoginLogs());
    playSuccessSound();
    setFeedbackNotice(`Live event captured: Student ${newLog.studentName} logged in from ${newLog.city}, ${newLog.country}!`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleResetLogs = () => {
    const reset = resetLoginLogsToSeed();
    setLogs(reset);
    playSuccessSound();
    setFeedbackNotice('Audit feed reset to authentic global seed records.');
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      log.studentName.toLowerCase().includes(q) ||
      log.email.toLowerCase().includes(q) ||
      log.school.toLowerCase().includes(q) ||
      log.city.toLowerCase().includes(q) ||
      log.ipAddress.includes(q);

    const matchesClass = classFilter === 'all' || log.studentClass === classFilter;
    const matchesLocation = locationFilter === 'all' || log.city.toLowerCase() === locationFilter.toLowerCase();

    return matchesSearch && matchesClass && matchesLocation;
  });

  // Calculate live stats
  const totalLogins = logs.length;
  const onlineCount = logs.filter(l => l.status === 'online').length;
  const uniqueCities = Array.from(new Set(logs.map(l => l.city)));
  const uniqueSchools = Array.from(new Set(logs.map(l => l.school)));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden animate-fade-in flex flex-col">
      {/* Executive Command Header */}
      <div className="bg-gradient-to-r from-[#071a3d] via-[#0d2a5e] to-[#14397d] text-white p-5 sm:p-7 border-b border-indigo-700/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Worldwide Live Login Feed • Global Access</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Globe className="text-[#62c5fa]" size={28} />
              <span>Global Student Login & Live Session Monitor</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#c8daf3] max-w-2xl leading-relaxed">
              Administrator <strong>{adminName}</strong> can view and audit each student as they log into the website from any smartphone, tablet, or PC anywhere across the globe.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className={`p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white transition-all cursor-pointer border border-white/20 ${isRefreshing ? 'animate-spin' : ''}`}
              title="Refresh live stream"
            >
              <RefreshCw size={17} />
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-rose-500/80 text-white transition-all cursor-pointer border border-white/20"
                title="Close"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Global Live Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={13} className="text-emerald-400" />
              <span>Online Students Now</span>
            </div>
            <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1.5">
              <span>{onlineCount}</span>
              <span className="text-xs font-normal text-emerald-300">Live Active</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={13} className="text-[#62c5fa]" />
              <span>Total Logins Logged</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {totalLogins}
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={13} className="text-amber-400" />
              <span>Worldwide Cities</span>
            </div>
            <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1.5">
              <span>{uniqueCities.length}</span>
              <span className="text-xs font-normal text-amber-300">Global Hubs</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-purple-400" />
              <span>Schools Represented</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {uniqueSchools.length}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name, email, school, IP, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Classes</option>
            <option value="SS3">Class SS3</option>
            <option value="SS2">Class SS2</option>
            <option value="SS1">Class SS1</option>
            <option value="JSS3">Class JSS3</option>
            <option value="JSS2">Class JSS2</option>
            <option value="JSS1">Class JSS1</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Global Locations</option>
            {uniqueCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* Test Simulation Button */}
          <button
            type="button"
            onClick={handleSimulateNewLogin}
            className="px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
            title="Demonstrate real-time global login capture"
          >
            <Wifi size={13} />
            <span>Simulate Live Sign-In</span>
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackNotice && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Login Audit Stream List */}
      <div className="p-4 sm:p-6 overflow-y-auto max-h-[580px] space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Globe size={26} />
            </div>
            <div className="text-sm font-black text-slate-700">No student login events found</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No login logs match your current search query or class filter. Try resetting your search.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isOnline = log.status === 'online';
            const isRecent = log.status === 'active_recently';
            const isCopied = copiedEmail === log.email;

            return (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left: Student Identity & Session */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs relative">
                    <span>{log.studentName.charAt(0)}</span>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      isOnline ? 'bg-emerald-500' : isRecent ? 'bg-amber-400' : 'bg-slate-400'
                    }`} />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-slate-900">{log.studentName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase">
                        Class {log.studentClass}
                      </span>
                      {log.academicStream && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {log.academicStream}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                        isOnline 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : isRecent 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isOnline ? 'bg-emerald-500 animate-pulse' : isRecent ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                        <span>{isOnline ? 'Online Now' : isRecent ? 'Active Recently' : 'Signed In'}</span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                      <span className="truncate max-w-[200px] sm:max-w-xs">{log.school}</span>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(log.email)}
                        className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1 font-mono cursor-pointer"
                        title="Copy student email"
                      >
                        <span>{log.email}</span>
                        {isCopied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Device & Global Location Details */}
                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 sm:gap-1 text-xs pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                    <Clock size={13} className="text-indigo-500" />
                    <span>{log.timestamp}</span>
                  </div>

                  {/* Device & Browser Badge */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                    {log.deviceType.toLowerCase().includes('mobile') || log.deviceType.toLowerCase().includes('iphone') ? (
                      <Smartphone size={12} className="text-slate-600" />
                    ) : (
                      <Laptop size={12} className="text-slate-600" />
                    )}
                    <span>{log.deviceType}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-medium text-slate-600">{log.browser}</span>
                  </div>

                  {/* Global Location & IP */}
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <span className="text-sm">{log.flag}</span>
                    <span>{log.city}, {log.country}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                      IP: {log.ipAddress}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Utility */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Continuous Worldwide Session Logging Active • Lead Administrator: Victoria Okajoe</span>
        </div>

        <button
          type="button"
          onClick={handleResetLogs}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
        >
          Reset to Standard Global Audit History
        </button>
      </div>
    </div>
  );
};
