import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, Upload, Image as ImageIcon, FileText, Download, 
  Trash2, Maximize2, X, CheckCircle2, AlertCircle, Sparkles, 
  Clock, RefreshCw, ZoomIn, Eye, BookOpen, ChevronRight, School
} from 'lucide-react';
import { StudentTimetable, User } from '../types';
import { playSuccessSound } from '../utils/sound';

interface StudentTimetableSectionProps {
  currentUser: User | null;
  onTimetableUpdated?: (timetable: StudentTimetable | null) => void;
}

// Sample Nigerian Secondary School Timetable image
const SAMPLE_TIMETABLE_IMAGE = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80';

// Default standard Nigerian Secondary School timetable matrix for quick reference
const DEFAULT_WEEKLY_SCHEDULE = [
  { period: 'Assembly & Homeroom', time: '8:00 AM - 8:30 AM', mon: 'Morning Assembly & Devotion', tue: 'Form Inspection', wed: 'Mid-week Assembly', thu: 'Club Activities', fri: 'Sport & General Assembly' },
  { period: 'Period 1', time: '8:30 AM - 9:20 AM', mon: 'Mathematics', tue: 'English Language', wed: 'Physics / Accounting', thu: 'Chemistry / Literature', fri: 'Biology / Commerce' },
  { period: 'Period 2', time: '9:20 AM - 10:10 AM', mon: 'English Language', tue: 'Mathematics', wed: 'Biology / Commerce', thu: 'Physics / Government', fri: 'Further Mathematics' },
  { period: 'Period 3', time: '10:10 AM - 11:00 AM', mon: 'Chemistry / Economics', tue: 'Civic Education', wed: 'English Language', thu: 'Mathematics', fri: 'Computer Studies / ICT' },
  { period: 'Short Break', time: '11:00 AM - 11:40 AM', mon: 'Break & Snack Time', tue: 'Break & Snack Time', wed: 'Break & Snack Time', thu: 'Break & Snack Time', fri: 'Break & Snack Time' },
  { period: 'Period 4', time: '11:40 AM - 12:30 PM', mon: 'Civic Education', tue: 'Chemistry / Economics', wed: 'Agricultural Science', thu: 'Geography / CRK/IRK', fri: 'Technical Drawing / Foods' },
  { period: 'Period 5', time: '12:30 PM - 1:20 PM', mon: 'Physics / Government', tue: 'Computer Studies / ICT', wed: 'Civic Education', thu: 'English Language', fri: 'Literature in English' },
  { period: 'Period 6', time: '1:20 PM - 2:10 PM', mon: 'Data Processing', tue: 'Biology / Commerce', wed: 'Mathematics Practicals', thu: 'Economics / Chemistry Lab', fri: 'Class Cleanup & Closing' }
];

export const StudentTimetableSection: React.FC<StudentTimetableSectionProps> = ({
  currentUser,
  onTimetableUpdated
}) => {
  const studentStorageKey = `echo_plan_timetable_${currentUser?.id || currentUser?.name || 'guest'}`;

  const [timetable, setTimetable] = useState<StudentTimetable | null>(() => {
    try {
      const saved = localStorage.getItem(studentStorageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'uploaded' | 'matrix'>('uploaded');
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [timetableTitle, setTimetableTitle] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync timetable storage when student or timetable changes
  useEffect(() => {
    try {
      if (timetable) {
        localStorage.setItem(studentStorageKey, JSON.stringify(timetable));
      } else {
        localStorage.removeItem(studentStorageKey);
      }
    } catch {
      // storage quota or error fallback
    }
    if (onTimetableUpdated) {
      onTimetableUpdated(timetable);
    }
  }, [timetable, studentStorageKey]);

  // Handle uploaded files (images or PDFs)
  const processFile = (file: File) => {
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setNotification('File size exceeds 5MB limit. Please upload a compressed photo or PDF.');
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newTimetable: StudentTimetable = {
        id: `timetable-${Date.now()}`,
        title: timetableTitle.trim() || `${currentUser?.grade || 'Class'} Academic Timetable`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        dataUrl,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }),
        uploadedBy: currentUser?.name || 'Student',
        studentClass: currentUser?.grade || 'SS3',
        term: '1st Term 2026/2027 Session'
      };

      setTimetable(newTimetable);
      playSuccessSound();
      setNotification(`Timetable "${file.name}" uploaded successfully!`);
      setTimeout(() => setNotification(null), 4000);
    };

    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Load realistic sample Nigerian timetable
  const handleLoadSampleTimetable = () => {
    const sample: StudentTimetable = {
      id: `sample-timetable-${Date.now()}`,
      title: `${currentUser?.grade || 'SS3'} Master School Timetable`,
      fileName: 'Official_Nigerian_Secondary_Timetable_Term1.jpg',
      fileSize: 482000,
      fileType: 'image/jpeg',
      dataUrl: SAMPLE_TIMETABLE_IMAGE,
      uploadedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      uploadedBy: currentUser?.name || 'Student',
      studentClass: currentUser?.grade || 'SS3',
      term: '1st Term 2026/2027 Academic Session',
      notes: 'Contains double periods for Physics, Chemistry practicals and WAEC mock revisions.'
    };
    setTimetable(sample);
    playSuccessSound();
    setNotification('Sample Nigerian Secondary School Timetable loaded!');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRemoveTimetable = () => {
    setTimetable(null);
    playSuccessSound();
    setNotification('Timetable removed successfully.');
    setTimeout(() => setNotification(null), 3000);
  };

  const isImage = timetable?.fileType.startsWith('image/') || timetable?.dataUrl.startsWith('data:image/') || timetable?.dataUrl.includes('images.unsplash.com');

  return (
    <div id="student-timetable-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 transition-all">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Header Bar with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/10 flex-shrink-0">
            <Calendar size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[11px] font-black uppercase tracking-wider border border-sky-100">
                <School size={12} className="text-sky-600" />
                {currentUser?.grade ? `Class ${currentUser.grade}` : 'Student Academic Timetable'}
              </span>
              {timetable && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  Active Timetable Linked
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#081a3d] tracking-tight">
              My School Timetable
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Upload your class schedule to align your daily tasks, prep for double periods, and stay on track.
            </p>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('uploaded')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'uploaded'
                ? 'bg-white text-[#081a3d] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {timetable ? 'My Uploaded Timetable' : 'Upload Timetable'}
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-white text-[#081a3d] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Digital Schedule Grid
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-fade-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900">
            <X size={14} />
          </button>
        </div>
      )}

      {/* TAB 1: Uploaded Timetable View */}
      {activeTab === 'uploaded' && (
        <div className="mt-6">
          {timetable ? (
            /* Timetable Active Card */
            <div className="bg-[#f8fbff] rounded-3xl border border-sky-100 p-5 sm:p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-sky-100/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#1976d2] uppercase tracking-wider">
                      {timetable.term || 'Academic Session Timetable'}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-slate-500">
                      Uploaded {timetable.uploadedAt}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#081a3d] mt-0.5">
                    {timetable.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-semibold">{timetable.fileName}</span>
                    <span>({Math.round(timetable.fileSize / 1024)} KB)</span>
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold uppercase text-[10px]">
                      {timetable.fileType.split('/')[1] || 'FILE'}
                    </span>
                  </div>
                </div>

                {/* Timetable Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {isImage && (
                    <button
                      onClick={() => setIsFullscreenOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Maximize2 size={13} />
                      <span>View Fullscreen</span>
                    </button>
                  )}

                  <a
                    href={timetable.dataUrl}
                    download={timetable.fileName}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Download size={13} className="text-slate-500" />
                    <span>Download</span>
                  </a>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <RefreshCw size={13} className="text-slate-500" />
                    <span>Replace</span>
                  </button>

                  <button
                    onClick={handleRemoveTimetable}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer"
                    title="Delete Timetable"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Visual Display */}
              <div className="mt-5">
                {isImage ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center max-h-[480px]">
                    <img
                      src={timetable.dataUrl}
                      alt={timetable.title}
                      className="w-full h-auto max-h-[480px] object-contain rounded-2xl cursor-pointer transition-transform group-hover:scale-[1.01]"
                      onClick={() => setIsFullscreenOpen(true)}
                    />
                    <div 
                      onClick={() => setIsFullscreenOpen(true)}
                      className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer gap-2 text-white font-bold text-sm"
                    >
                      <ZoomIn size={20} />
                      <span>Click to Enlarge Fullscreen</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <FileText size={32} />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-[#081a3d]">{timetable.fileName}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Document timetable successfully linked to your daily plan. You can download and reference it anytime during your study periods.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={timetable.dataUrl}
                        download={timetable.fileName}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center gap-2 hover:bg-slate-800 shadow-md cursor-pointer"
                      >
                        <Download size={14} /> Open / Download
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Upload Dropzone (When No Timetable is Uploaded) */
            <div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer select-none ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01]'
                    : 'border-slate-300 hover:border-[#1976d2] bg-[#f8fbff] hover:bg-sky-50/50'
                }`}
              >
                <div className="max-w-md mx-auto flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
                    isDragging ? 'bg-indigo-600 text-white shadow-lg' : 'bg-blue-100 text-[#1976d2]'
                  }`}>
                    <Upload size={32} />
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-[#081a3d] mb-1">
                    Upload Your Daily / Term Timetable
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    Drag and drop your timetable image (JPG, PNG) or PDF here, or <span className="text-[#1976d2] font-bold underline">browse from your phone/laptop</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">Photo of Paper Timetable</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">School PDF</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">Max 5MB</span>
                  </div>
                </div>
              </div>

              {/* Instant Sample Preset Option */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-amber-900">
                  <Sparkles size={16} className="text-amber-600 flex-shrink-0" />
                  <span>
                    Don't have a file ready right now? Load an official sample secondary school timetable to preview how it looks!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLoadSampleTimetable}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer whitespace-nowrap"
                >
                  Load Sample Timetable
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Interactive Nigerian Secondary School Schedule Grid */}
      {activeTab === 'matrix' && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-sm font-extrabold text-[#081a3d]">
                Standard Nigerian Secondary School Weekly Schedule
              </h4>
              <p className="text-xs text-slate-500">
                Periods 1 to 6 with double periods for core WAEC subjects and laboratory practicals.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              Monday - Friday • 8:00 AM - 2:10 PM
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#081a3d] text-white uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">Period / Time</th>
                  <th className="py-3 px-3">Monday</th>
                  <th className="py-3 px-3">Tuesday</th>
                  <th className="py-3 px-3">Wednesday</th>
                  <th className="py-3 px-3">Thursday</th>
                  <th className="py-3 px-3">Friday</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {DEFAULT_WEEKLY_SCHEDULE.map((row, idx) => {
                  const isBreak = row.period.includes('Break');
                  return (
                    <tr 
                      key={idx} 
                      className={isBreak ? 'bg-amber-50/60 font-bold text-amber-900' : 'hover:bg-slate-50/80 transition-colors'}
                    >
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-800">
                        <div>{row.period}</div>
                        <div className="text-[10px] font-normal text-slate-400">{row.time}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{row.mon}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">{row.tue}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">{row.wed}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">{row.thu}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">{row.fri}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fullscreen Modal View for Timetable Images */}
      {isFullscreenOpen && timetable && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col p-4 sm:p-6 animate-fade-in">
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/20">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-[#62c5fa]" />
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">{timetable.title}</h3>
                <p className="text-xs text-slate-400">{timetable.fileName} • Uploaded by {timetable.uploadedBy}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={timetable.dataUrl}
                download={timetable.fileName}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
              >
                <Download size={13} /> Download
              </a>
              <button
                onClick={() => setIsFullscreenOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4">
            <img
              src={timetable.dataUrl}
              alt={timetable.title}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
