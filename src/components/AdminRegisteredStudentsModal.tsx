import React, { useState } from 'react';
import { 
  X, Users, Search, Filter, Download, Trash2, 
  CheckCircle2, Phone, School, Calendar, FileText, 
  ExternalLink, UserPlus, Eye, ShieldCheck, Copy, Check,
  Wifi, MapPin, Activity, Radio, Flag, AlertTriangle, ShieldAlert,
  Atom, Palette, TrendingUp, BarChart3, Globe
} from 'lucide-react';
import { RegisteredStudentItem, User } from '../types';
import { playSuccessSound } from '../utils/sound';
import { AdminStudentScoreChart } from './AdminStudentScoreChart';
import { AdminGlobalLoginMonitor } from './AdminGlobalLoginMonitor';

interface AdminRegisteredStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredStudents: RegisteredStudentItem[];
  onDeleteStudent: (id: string) => void;
  onAddStudent?: (newStudent: RegisteredStudentItem) => void;
  currentUser: User | null;
}

export const AdminRegisteredStudentsModal: React.FC<AdminRegisteredStudentsModalProps> = ({
  isOpen,
  onClose,
  registeredStudents,
  onDeleteStudent,
  onAddStudent,
  currentUser
}) => {
  const [viewTab, setViewTab] = useState<'roster' | 'chart' | 'logins'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'with_timetable' | 'no_timetable' | 'red_flag'>('all');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [previewingTimetable, setPreviewingTimetable] = useState<RegisteredStudentItem | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [confirmDeleteStudentId, setConfirmDeleteStudentId] = useState<string | null>(null);

  // New Student Manual Add Form
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('SS3');
  const [newStream, setNewStream] = useState<'science' | 'art'>('science');
  const [newSchool, setNewSchool] = useState('');
  const [newPhone, setNewPhone] = useState('');

  if (!isOpen) return null;

  const classesList = ['all', 'JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];

  // Filter students based on search query, class, and timetable presence
  const filteredStudents = registeredStudents.filter((student) => {
    const q = (searchQuery || '').trim().toLowerCase();
    const name = (student.studentName || '').toLowerCase();
    const school = (student.school || '').toLowerCase();
    const sClass = (student.studentClass || '').toLowerCase();
    const phone = student.phoneNumber || '';

    const matchesSearch = !q ||
      name.includes(q) ||
      school.includes(q) ||
      phone.includes(q) ||
      sClass.includes(q);

    const matchesClass = selectedClass === 'all' || (student.studentClass || '').toUpperCase() === selectedClass.toUpperCase();

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'online' && Boolean(student.isOnline)) ||
      (statusFilter === 'with_timetable' && Boolean(student.timetableUploaded)) ||
      (statusFilter === 'no_timetable' && !student.timetableUploaded) ||
      (statusFilter === 'red_flag' && Boolean(student.hasRedFlag));

    return matchesSearch && matchesClass && matchesStatus;
  });

  // Calculate statistics
  const totalCount = registeredStudents.length;
  const onlineCount = registeredStudents.filter(s => s.isOnline).length;
  const withTimetableCount = registeredStudents.filter(s => s.timetableUploaded).length;
  const redFlagCount = registeredStudents.filter(s => s.hasRedFlag).length;

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    playSuccessSound();
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // Export roster as CSV
  const handleExportCSV = () => {
    const headers = ['Student ID', 'Student Name', 'Class', 'School', 'Phone Number', 'Email', 'Registration Date', 'Timetable Uploaded'];
    const rows = filteredStudents.map(s => [
      s.id,
      `"${s.studentName}"`,
      s.studentClass,
      `"${s.school}"`,
      s.phoneNumber || 'N/A',
      s.email || 'N/A',
      `"${s.registeredAt}"`,
      s.timetableUploaded ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nigerian_Registered_Students_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playSuccessSound();
  };

  const handleCreateStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSchool.trim()) return;

    if (onAddStudent) {
      const newStudent: RegisteredStudentItem = {
        id: `reg-std-${Date.now()}`,
        studentName: newName.trim(),
        studentClass: newClass,
        academicStream: newStream,
        school: newSchool.trim(),
        phoneNumber: newPhone.trim() || undefined,
        email: `${newName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@student.echo.edu.ng`,
        registeredAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }),
        status: 'Active',
        avatarBg: 'bg-emerald-600',
        timetableUploaded: false
      };
      onAddStudent(newStudent);
      setNewName('');
      setNewSchool('');
      setNewPhone('');
      setIsAddStudentOpen(false);
      playSuccessSound();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 md:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-5xl max-h-[92dvh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#081a3d] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-[#62c5fa] flex items-center justify-center flex-shrink-0">
              <Users size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  Admin Authority
                </span>
                <span className="text-xs text-sky-200 font-semibold">
                  Administrator: {currentUser?.name || 'Victoria Okajoe'}
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                All Registered Students Directory
              </h2>
              <p className="text-xs text-[#c8daf3] mt-0.5">
                Complete roster of Nigerian secondary students registered in the application.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* View Mode Toggle: Directory vs Performance Score Chart */}
            <div className="bg-white/10 p-0.5 rounded-xl flex items-center gap-1 border border-white/15">
              <button
                type="button"
                onClick={() => setViewTab('roster')}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewTab === 'roster'
                    ? 'bg-white text-[#081a3d] shadow-sm'
                    : 'text-sky-200 hover:text-white'
                }`}
              >
                Roster Cards
              </button>
              <button
                type="button"
                onClick={() => setViewTab('chart')}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewTab === 'chart'
                    ? 'bg-[#62c5fa] text-[#081a3d] shadow-sm font-black'
                    : 'text-sky-200 hover:text-white'
                }`}
              >
                <TrendingUp size={13} />
                <span>Score Chart</span>
              </button>
              <button
                type="button"
                onClick={() => setViewTab('logins')}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewTab === 'logins'
                    ? 'bg-emerald-400 text-[#081a3d] shadow-sm font-black'
                    : 'text-sky-200 hover:text-white'
                }`}
              >
                <Globe size={13} />
                <span>Live Logins</span>
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sky-200 text-xs font-bold transition-all cursor-pointer border border-white/10"
              title="Download CSV Roster"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsAddStudentOpen(!isAddStudentOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#62c5fa] hover:bg-sky-300 text-[#081a3d] text-xs font-extrabold transition-all cursor-pointer"
            >
              <UserPlus size={14} />
              <span>{isAddStudentOpen ? 'Close Form' : 'Enroll Student'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 sm:py-3.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 text-center sm:text-left shrink-0">
          <div className="bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Registered</span>
            <div className="text-base sm:text-xl font-black text-[#081a3d]">{totalCount} Students</div>
          </div>
          <div className="bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-emerald-200/80 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Logged In
            </span>
            <div className="text-base sm:text-xl font-black text-emerald-600">{onlineCount} Active</div>
          </div>
          <div className="bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-rose-200/80 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1 justify-center sm:justify-start">
              <Flag size={12} className="text-rose-600" />
              Red Flags
            </span>
            <div className="text-base sm:text-xl font-black text-rose-700">{redFlagCount} Flagged</div>
          </div>
          <div className="bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Timetables</span>
            <div className="text-base sm:text-xl font-black text-indigo-600">{withTimetableCount} Students</div>
          </div>
          <div className="bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filtered View</span>
            <div className="text-base sm:text-xl font-black text-sky-600">{filteredStudents.length} Students</div>
          </div>
        </div>

        {/* Manual Enroll Form Accordion */}
        {isAddStudentOpen && (
          <form onSubmit={handleCreateStudentSubmit} className="p-5 bg-indigo-50/70 border-b border-indigo-100 flex flex-col gap-4 animate-fade-down">
            <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
              <UserPlus size={16} className="text-indigo-600" />
              <span>Manually Register / Enroll a Student</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chukwuma Adebayo"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Class / Grade *</label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  <option value="JSS1">JSS 1</option>
                  <option value="JSS2">JSS 2</option>
                  <option value="JSS3">JSS 3</option>
                  <option value="SS1">SS 1</option>
                  <option value="SS2">SS 2</option>
                  <option value="SS3">SS 3</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Stream (Science or Art) *</label>
                <select
                  value={newStream}
                  onChange={(e) => setNewStream(e.target.value as 'science' | 'art')}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  <option value="science">🔬 Science Student</option>
                  <option value="art">🎨 Art Student</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nigerian School Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. King's College Lagos"
                  value={newSchool}
                  onChange={(e) => setNewSchool(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+234 803 000 0000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(false)}
                className="px-4 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm"
              >
                Confirm Enrollment
              </button>
            </div>
          </form>
        )}

        {/* Main Body: Either Performance Score Chart, Live Global Logins, or Directory Roster */}
        {viewTab === 'chart' ? (
          <div className="flex-1 overflow-y-auto p-3 sm:p-5">
            <AdminStudentScoreChart registeredStudents={registeredStudents} />
          </div>
        ) : viewTab === 'logins' ? (
          <div className="flex-1 overflow-y-auto p-3 sm:p-5">
            <AdminGlobalLoginMonitor adminName={currentUser?.name || 'Victoria Okajoe'} />
          </div>
        ) : (
          <>
            {/* Filter & Search Bar */}
            <div className="p-3 sm:p-4 md:p-5 border-b border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student name, school, phone number or class..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#62c5fa] bg-slate-50/50"
                />
              </div>

              {/* Class Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
                  <Filter size={12} /> Class:
                </span>
                {classesList.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                      selectedClass === cls
                        ? 'bg-[#081a3d] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>

              {/* Status & Online Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar pb-0.5">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    statusFilter === 'all' ? 'bg-white text-[#081a3d] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  onClick={() => setStatusFilter('online')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                    statusFilter === 'online' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-emerald-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Logged In ({onlineCount})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('red_flag')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap ${
                    statusFilter === 'red_flag' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500 hover:text-rose-700'
                  }`}
                >
                  <Flag size={11} className="text-rose-600" />
                  <span>Red Flag ({redFlagCount})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('with_timetable')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    statusFilter === 'with_timetable' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Timetable ({withTimetableCount})
                </button>
                <button
                  onClick={() => setStatusFilter('no_timetable')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    statusFilter === 'no_timetable' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>

            {/* Students Table / List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Users size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm font-bold text-slate-600">No registered students found matching the criteria.</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting the class or status filter, or clearing the search bar.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredStudents.map((student) => {
                    const initials = student.studentName
                      .split(' ')
                      .map(n => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();

                    return (
                      <div
                        key={student.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <div className={`w-11 h-11 rounded-2xl ${student.avatarBg || 'bg-emerald-600'} text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs`}>
                                {initials}
                              </div>
                              {student.isOnline && (
                                <span 
                                  className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse shadow-xs" 
                                  title="Currently Logged In & Online"
                                />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-black text-[#081a3d] group-hover:text-sky-700 transition-colors">
                                  {student.studentName}
                                </h3>
                                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase">
                                  {student.studentClass}
                                </span>
                                {student.academicStream && (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                                    student.academicStream === 'science'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {student.academicStream === 'science' ? <Atom size={10} /> : <Palette size={10} />}
                                    <span>{student.academicStream}</span>
                                  </span>
                                )}
                                {student.isOnline ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase flex items-center gap-1 border border-emerald-300 shadow-2xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                                    <span>Logged In</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold">
                                    Offline
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                                <School size={13} className="text-slate-400 flex-shrink-0" />
                                <span className="font-semibold line-clamp-1">{student.school}</span>
                              </div>

                              {/* Live Active Location / Page Indicator */}
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                <MapPin size={12} className="text-indigo-500 flex-shrink-0" />
                                <span>
                                  Location: <strong className="text-slate-700">{student.activeLocation || (student.isOnline ? 'Active in App' : 'Not in session')}</strong>
                                </span>
                              </div>

                              {student.phoneNumber && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                  <Phone size={12} className="text-slate-400 flex-shrink-0" />
                                  <span>{student.phoneNumber}</span>
                                  <button
                                    onClick={() => handleCopyPhone(student.phoneNumber!)}
                                    className="p-1 hover:text-sky-600 text-slate-400 transition-colors"
                                    title="Copy phone number"
                                  >
                                    {copiedPhone === student.phoneNumber ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Timetable Status Badge */}
                          <div className="text-right flex-shrink-0">
                            {student.timetableUploaded ? (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                                <CheckCircle2 size={12} className="text-emerald-600" />
                                <span>Timetable Uploaded</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-100">
                                <Calendar size={12} className="text-amber-600" />
                                <span>Pending Timetable</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Disciplinary Red Flag Alert Banner if Struck */}
                        {student.hasRedFlag && (
                          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-start gap-2 animate-fade-in">
                            <Flag size={14} className="text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-black text-rose-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                <span>Exam Procedure Red Flag Strike</span>
                                {student.redFlagDate && (
                                  <span className="text-[9.5px] bg-rose-200 px-1.5 py-0.2 rounded-full">{student.redFlagDate}</span>
                                )}
                              </div>
                              <p className="text-rose-900 mt-0.5 font-medium leading-tight">
                                {student.redFlagReason || 'Departed active CBT practice exam hall without submitting.'}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Bottom Metadata & Admin Actions */}
                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              <span>Joined: {student.registeredAt}</span>
                            </span>
                            {student.lastLoginAt && (
                              <span className="hidden sm:inline text-slate-400">
                                • Last seen: {student.lastLoginAt}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {student.timetableUploaded && (
                              <button
                                onClick={() => setPreviewingTimetable(student)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                <Eye size={12} />
                                <span>Timetable</span>
                              </button>
                            )}

                            {confirmDeleteStudentId === student.id ? (
                              <div className="flex items-center gap-1.5 animate-fade-in bg-rose-50 p-1 rounded-xl border border-rose-200">
                                <span className="text-[10.5px] font-black text-rose-800">Confirm?</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteStudent(student.id);
                                    setConfirmDeleteStudentId(null);
                                    playSuccessSound();
                                  }}
                                  className="px-2 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10.5px] font-black cursor-pointer shadow-xs"
                                >
                                  Yes, Delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteStudentId(null)}
                                  className="px-1.5 py-0.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10.5px] font-bold cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteStudentId(student.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                                title="Delete this student account from registry"
                              >
                                <Trash2 size={13} className="text-rose-500" />
                                <span>Delete Account</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-indigo-600" />
            <span>Authorized view for School Administrator. Data synchronizes live with student registrations.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#081a3d] text-white font-extrabold text-xs hover:bg-[#122e66] transition-colors cursor-pointer"
          >
            Done Viewing
          </button>
        </div>

      </div>

      {/* Timetable Preview Sub-Modal */}
      {previewingTimetable && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setPreviewingTimetable(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase">
                {previewingTimetable.studentClass}
              </span>
              <span className="text-xs text-slate-500">{previewingTimetable.school}</span>
            </div>
            <h3 className="text-xl font-black text-[#081a3d] mb-4">
              {previewingTimetable.studentName}'s Uploaded Timetable
            </h3>

            {previewingTimetable.timetableDataUrl ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-[420px] flex items-center justify-center">
                <img
                  src={previewingTimetable.timetableDataUrl}
                  alt={`${previewingTimetable.studentName}'s timetable`}
                  className="w-full h-auto max-h-[420px] object-contain"
                />
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-sky-50 border border-sky-100 text-center">
                <FileText size={40} className="mx-auto text-sky-600 mb-2" />
                <p className="font-bold text-sm text-[#081a3d]">{previewingTimetable.timetableName || 'Academic_Timetable.pdf'}</p>
                <p className="text-xs text-slate-500 mt-1">Uploaded to the student's daily plan repository.</p>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setPreviewingTimetable(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
