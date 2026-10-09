import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle2, BookOpen, Clock, Sparkles, 
  ChevronLeft, ChevronRight, Check, X, RotateCcw, 
  Award, ShieldCheck, Flame, Info
} from 'lucide-react';
import { playSuccessSound } from '../utils/sound';

export interface PlannedStudyDay {
  dateStr: string; // YYYY-MM-DD
  ticked: boolean;
  subjects?: string[];
  targetHours?: number;
  note?: string;
}

interface StudyPlanningCalendarProps {
  currentUserName?: string;
  currentUserGrade?: string;
}

const STORAGE_CALENDAR_KEY = 'echo_plan_student_study_days_calendar';

const SUBJECT_OPTIONS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'English Language', 'Literature in English', 'Civic Education',
  'Economics', 'Further Math', 'Technical Drawing'
];

export const StudyPlanningCalendar: React.FC<StudyPlanningCalendarProps> = ({
  currentUserName = 'Student',
  currentUserGrade = 'SS3'
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [studyDaysMap, setStudyDaysMap] = useState<Record<string, PlannedStudyDay>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CALENDAR_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default initial seeded study days for current month (Mon, Wed, Fri, Sat)
    const initial: Record<string, PlannedStudyDay> = {};
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const dayDate = new Date(y, m, d);
      const dayOfWeek = dayDate.getDay();
      // Tick weekdays Mon, Wed, Fri and Sat by default
      if ([1, 3, 5, 6].includes(dayOfWeek) && d <= 25) {
        const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        initial[dateKey] = {
          dateStr: dateKey,
          ticked: true,
          subjects: dayOfWeek === 6 ? ['Mathematics', 'Physics'] : ['English Language', 'Biology'],
          targetHours: dayOfWeek === 6 ? 3 : 2
        };
      }
    }
    return initial;
  });

  const [activeDayDetail, setActiveDayDetail] = useState<string | null>(null);

  // Synchronize with localStorage
  const persistStudyDays = (updated: Record<string, PlannedStudyDay>) => {
    setStudyDaysMap(updated);
    try {
      localStorage.setItem(STORAGE_CALENDAR_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setActiveDayDetail(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setActiveDayDetail(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setActiveDayDetail(null);
  };

  // Toggle tick on a day
  const handleToggleDay = (dateKey: string) => {
    const existing = studyDaysMap[dateKey];
    const isCurrentlyTicked = existing?.ticked;
    const updated: Record<string, PlannedStudyDay> = {
      ...studyDaysMap,
      [dateKey]: {
        dateStr: dateKey,
        ticked: !isCurrentlyTicked,
        subjects: existing?.subjects || ['Mathematics', 'Science'],
        targetHours: existing?.targetHours || 2,
        note: existing?.note || ''
      }
    };
    persistStudyDays(updated);
    playSuccessSound();
  };

  // Quick Action Presets
  const handleTickWeekdays = () => {
    const updated = { ...studyDaysMap };
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dDate = new Date(year, month, d);
      const dow = dDate.getDay();
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (dow >= 1 && dow <= 5) {
        updated[dateKey] = {
          dateStr: dateKey,
          ticked: true,
          subjects: updated[dateKey]?.subjects || ['WAEC Core Subjects'],
          targetHours: updated[dateKey]?.targetHours || 2
        };
      }
    }
    persistStudyDays(updated);
    playSuccessSound();
  };

  const handleTickAllDays = () => {
    const updated = { ...studyDaysMap };
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      updated[dateKey] = {
        dateStr: dateKey,
        ticked: true,
        subjects: updated[dateKey]?.subjects || ['Intensive Study'],
        targetHours: updated[dateKey]?.targetHours || 2.5
      };
    }
    persistStudyDays(updated);
    playSuccessSound();
  };

  const handleClearMonth = () => {
    const updated = { ...studyDaysMap };
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (updated[dateKey]) {
        updated[dateKey] = {
          ...updated[dateKey],
          ticked: false
        };
      }
    }
    persistStudyDays(updated);
    playSuccessSound();
  };

  // Update subject tags for active day
  const handleToggleSubjectForDay = (dateKey: string, subject: string) => {
    const currentDay = studyDaysMap[dateKey] || { dateStr: dateKey, ticked: true, subjects: [], targetHours: 2 };
    const currentSubjects = currentDay.subjects || [];
    const hasSubject = currentSubjects.includes(subject);
    const newSubjects = hasSubject 
      ? currentSubjects.filter(s => s !== subject)
      : [...currentSubjects, subject];

    const updated = {
      ...studyDaysMap,
      [dateKey]: {
        ...currentDay,
        ticked: true,
        subjects: newSubjects
      }
    };
    persistStudyDays(updated);
    playSuccessSound();
  };

  // Count study days ticked in current month
  let tickedDaysThisMonth = 0;
  let plannedHoursThisMonth = 0;
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (studyDaysMap[dateKey]?.ticked) {
      tickedDaysThisMonth++;
      plannedHoursThisMonth += studyDaysMap[dateKey]?.targetHours || 2;
    }
  }

  const studyCommitmentPercentage = Math.round((tickedDaysThisMonth / totalDaysInMonth) * 100);

  // Calendar Day Grid calculations
  const daysArray = [];
  // Empty spaces before first day of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  // Days of month
  for (let d = 1; d <= totalDaysInMonth; d++) {
    daysArray.push(d);
  }

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDateNum = isCurrentMonth ? today.getDate() : null;

  return (
    <div id="study-planning-calendar" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-fade-in space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#071a3d] via-[#092558] to-[#124b91] text-white p-6 sm:p-8 relative overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at 80% 30%, #60a5fa, transparent 50%), radial-gradient(circle at 10% 70%, #34d399, transparent 40%)'
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-[#62c5fa] text-xs font-black uppercase tracking-wider border border-[#62c5fa]/30">
              <Calendar size={14} />
              <span>Days of Studies Planner</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Study Calendar: Tick Your Planned Days of Studies</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#c8daf3] max-w-xl leading-relaxed">
              Take ownership of your academic routine. Click and <strong>tick the days you want to study</strong> this month. Echo Plan calculates your total planned days and keeps your commitment visible.
            </p>
          </div>

          {/* Month Stats Summary Pill */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-13 h-13 rounded-2xl bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0">
              <BookOpen size={26} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block">
                {monthName} Planned Studies
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {tickedDaysThisMonth} Days Ticked
              </div>
              <span className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                <span>{plannedHoursThisMonth} study hours</span>
                <span>•</span>
                <span className="text-emerald-300 font-bold">{studyCommitmentPercentage}% of month</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">

        {/* Calendar Navigation & Month Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#081a3d]">
              {monthName} {year}
            </h3>

            <button
              type="button"
              onClick={goToToday}
              className="px-3 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold border border-sky-200 transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>

          {/* Quick Tick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTickWeekdays}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <Check size={13} className="text-emerald-600" />
              <span>Tick Mon-Fri Weekdays</span>
            </button>

            <button
              type="button"
              onClick={handleTickAllDays}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <Flame size={13} className="text-indigo-600" />
              <span>Tick All 30 Days</span>
            </button>

            <button
              type="button"
              onClick={handleClearMonth}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Reset Month</span>
            </button>
          </div>
        </div>

        {/* Day-of-Week Table Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-black uppercase tracking-wider text-slate-400 pb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dName, idx) => (
            <div key={dName} className={idx === 0 || idx === 6 ? 'text-amber-600/80 font-bold' : ''}>
              {dName}
            </div>
          ))}
        </div>

        {/* Days of Studies Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {daysArray.map((dayNum, index) => {
            if (dayNum === null) {
              return (
                <div key={`empty-${index}`} className="min-h-[85px] sm:min-h-[105px] rounded-2xl bg-slate-50/50 border border-dashed border-slate-200/50 opacity-40" />
              );
            }

            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const studyInfo = studyDaysMap[dateKey];
            const isTicked = Boolean(studyInfo?.ticked);
            const isToday = dayNum === todayDateNum;
            const isSelectedForDetail = activeDayDetail === dateKey;

            return (
              <div
                key={dateKey}
                onClick={() => handleToggleDay(dateKey)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setActiveDayDetail(dateKey);
                }}
                className={`relative min-h-[85px] sm:min-h-[105px] p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between group ${
                  isTicked
                    ? 'bg-gradient-to-b from-emerald-50/90 to-emerald-100/40 border-emerald-400 shadow-xs ring-2 ring-emerald-400/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                } ${isToday ? 'border-sky-500 ring-2 ring-sky-300' : ''}`}
                title={`Click to tick/untick study day. Right-click to customize subjects.`}
              >
                {/* Top Row: Day Number & Tick Status */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs sm:text-sm font-black flex items-center gap-1 ${
                    isTicked ? 'text-emerald-950 font-black' : 'text-slate-800'
                  }`}>
                    <span>{dayNum}</span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                    )}
                  </span>

                  {/* Tick Box Indicator */}
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center transition-all ${
                    isTicked
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-transparent border border-slate-300 group-hover:border-slate-400'
                  }`}>
                    <Check size={13} className={isTicked ? 'opacity-100' : 'opacity-0'} />
                  </div>
                </div>

                {/* Middle: Study Day Badge */}
                <div className="my-1">
                  {isTicked ? (
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[9.5px] sm:text-[10px] tracking-tight shadow-xs">
                        <BookOpen size={10} />
                        <span>Study Day</span>
                      </span>

                      {/* Display first 1 or 2 subjects */}
                      {studyInfo?.subjects && studyInfo.subjects.length > 0 && (
                        <div className="text-[9px] sm:text-[10px] text-emerald-900 font-bold truncate max-w-full">
                          {studyInfo.subjects[0]}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      + Tick Day
                    </span>
                  )}
                </div>

                {/* Bottom Row: Target Hours */}
                <div className="flex items-center justify-between text-[9px] text-slate-500 font-medium">
                  {isTicked ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <Clock size={10} /> {studyInfo?.targetHours || 2}h
                    </span>
                  ) : (
                    <span />
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDayDetail(isSelectedForDetail ? null : dateKey);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-800 text-[10px] font-bold p-0.5"
                    title="Customize subjects"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Day Focus Customizer Drawer */}
        {activeDayDetail && (
          <div className="p-5 rounded-3xl bg-slate-50 border-2 border-emerald-400/80 space-y-4 animate-fade-in shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Check size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#081a3d]">
                    Customize Study Day: {activeDayDetail}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Pick target subjects and hours for this study day.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveDayDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Subject selector tags */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-700 block">
                Select Focus Subjects for {activeDayDetail}:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SUBJECT_OPTIONS.map(subj => {
                  const dayObj = studyDaysMap[activeDayDetail];
                  const isChecked = dayObj?.subjects?.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => handleToggleSubjectForDay(activeDayDetail, subj)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-600 text-white border-emerald-600 font-black shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {subj}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">
                Changes are automatically saved to your calendar!
              </span>
              <button
                type="button"
                onClick={() => setActiveDayDetail(null)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Footer Guidance Note */}
        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-start gap-3 text-xs text-slate-700">
          <Info size={16} className="text-sky-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Study Tip:</strong> Research in high school learning demonstrates that committing to specific study days on a calendar increases exam completion rates by <strong>300%</strong> compared to vague intentions. Click any day square above to tick your schedule!
          </p>
        </div>

      </div>
    </div>
  );
};
