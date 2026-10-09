import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Award,
  Users,
  Filter,
  ArrowUpDown,
  BookOpen,
  PlusCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  School,
  X,
  Plus,
  Atom,
  Palette,
  Download
} from 'lucide-react';
import { RegisteredStudentItem, StudentTestScoreRecord } from '../types';
import {
  getAllStudentScores,
  addStudentScore,
  computeStudentsAverageData,
  computeClassAverages,
  StudentAverageData
} from '../data/studentTestScoresData';
import { playSuccessSound } from '../utils/sound';

interface AdminStudentScoreChartProps {
  registeredStudents: RegisteredStudentItem[];
  className?: string;
  onSelectStudent?: (studentId: string) => void;
  compact?: boolean;
}

export const AdminStudentScoreChart: React.FC<AdminStudentScoreChartProps> = ({
  registeredStudents,
  className = '',
  onSelectStudent,
  compact = false
}) => {
  // Test scores state from storage + CBT submissions
  const [scoresList, setScoresList] = useState<StudentTestScoreRecord[]>(() => getAllStudentScores());

  // Listen for storage changes when CBT exams are completed or new scores added
  useEffect(() => {
    const handleSync = () => {
      setScoresList(getAllStudentScores());
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  // View mode: 'students' (individual student average) vs 'classes' (aggregated by grade) vs 'streams' (science vs art)
  const [viewMode, setViewMode] = useState<'students' | 'classes' | 'streams'>('students');

  // Filters
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStream, setSelectedStream] = useState<'all' | 'science' | 'art'>('all');
  const [sortBy, setSortBy] = useState<'score-desc' | 'score-asc' | 'name' | 'class'>('score-desc');
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);

  // Active inspected student details modal
  const [inspectStudent, setInspectStudent] = useState<StudentAverageData | null>(null);

  // Quick record test score modal
  const [isAddScoreModalOpen, setIsAddScoreModalOpen] = useState(false);
  const [newScoreStudentId, setNewScoreStudentId] = useState<string>(registeredStudents[0]?.id || '');
  const [newScoreSubject, setNewScoreSubject] = useState('Mathematics');
  const [newScoreValue, setNewScoreValue] = useState<number>(75);
  const [newScoreType, setNewScoreType] = useState<StudentTestScoreRecord['testType']>('CBT Mock Exam');

  // Compute live student average scores
  const allStudentAverages = useMemo(() => {
    return computeStudentsAverageData(registeredStudents, scoresList);
  }, [registeredStudents, scoresList]);

  // Compute live class average data
  const classAverages = useMemo(() => {
    return computeClassAverages(allStudentAverages);
  }, [allStudentAverages]);

  // Compute stream averages (Science vs Art)
  const streamAverages = useMemo(() => {
    const scienceStudents = allStudentAverages.filter(s => s.academicStream === 'science');
    const artStudents = allStudentAverages.filter(s => s.academicStream === 'art');
    const generalStudents = allStudentAverages.filter(s => !s.academicStream || s.academicStream === 'general');

    const getAvg = (list: StudentAverageData[]) =>
      list.length > 0
        ? Math.round((list.reduce((acc, curr) => acc + curr.averageScore, 0) / list.length) * 10) / 10
        : 0;

    return [
      {
        name: 'Science Stream',
        averageScore: getAvg(scienceStudents),
        count: scienceStudents.length,
        barColor: '#3b82f6',
        icon: '🔬'
      },
      {
        name: 'Art Stream',
        averageScore: getAvg(artStudents),
        count: artStudents.length,
        barColor: '#a855f7',
        icon: '🎨'
      },
      {
        name: 'General Cohort',
        averageScore: getAvg(generalStudents),
        count: generalStudents.length,
        barColor: '#10b981',
        icon: '📚'
      }
    ];
  }, [allStudentAverages]);

  // Filter and sort students for chart
  const filteredStudents = useMemo(() => {
    let result = [...allStudentAverages];

    // Filter by class
    if (selectedClass !== 'all') {
      result = result.filter(
        s => (s.studentClass || '').toUpperCase() === selectedClass.toUpperCase()
      );
    }

    // Filter by stream
    if (selectedStream !== 'all') {
      result = result.filter(s => s.academicStream === selectedStream);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'score-desc') return b.averageScore - a.averageScore;
      if (sortBy === 'score-asc') return a.averageScore - b.averageScore;
      if (sortBy === 'name') return a.studentName.localeCompare(b.studentName);
      if (sortBy === 'class') return a.studentClass.localeCompare(b.studentClass);
      return 0;
    });

    return result;
  }, [allStudentAverages, selectedClass, selectedStream, sortBy]);

  // Summary Key Trend Indicators
  const trendInsights = useMemo(() => {
    if (allStudentAverages.length === 0) {
      return {
        cohortAverage: 0,
        topStudent: null,
        topClass: null,
        needsSupportCount: 0,
        distinctionCount: 0,
        passingRate: 0
      };
    }

    const totalAvgSum = allStudentAverages.reduce((acc, curr) => acc + curr.averageScore, 0);
    const cohortAverage = Math.round((totalAvgSum / allStudentAverages.length) * 10) / 10;

    // Top student
    const sortedByScore = [...allStudentAverages].sort((a, b) => b.averageScore - a.averageScore);
    const topStudent = sortedByScore[0];

    // Top class
    const validClasses = classAverages.filter(c => c.studentCount > 0);
    validClasses.sort((a, b) => b.averageScore - a.averageScore);
    const topClass = validClasses[0] || null;

    // Counts
    const needsSupportCount = allStudentAverages.filter(s => s.averageScore < 50).length;
    const distinctionCount = allStudentAverages.filter(s => s.averageScore >= 75).length;
    const passingCount = allStudentAverages.filter(s => s.averageScore >= 50).length;
    const passingRate = Math.round((passingCount / allStudentAverages.length) * 100);

    return {
      cohortAverage,
      topStudent,
      topClass,
      needsSupportCount,
      distinctionCount,
      passingRate
    };
  }, [allStudentAverages, classAverages]);

  // Handle adding new test score
  const handleAddScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = registeredStudents.find(s => s.id === newScoreStudentId) || registeredStudents[0];
    if (!targetStudent) return;

    let grade = 'F9';
    if (newScoreValue >= 75) grade = 'A1';
    else if (newScoreValue >= 70) grade = 'B2';
    else if (newScoreValue >= 65) grade = 'B3';
    else if (newScoreValue >= 60) grade = 'C4';
    else if (newScoreValue >= 55) grade = 'C5';
    else if (newScoreValue >= 50) grade = 'C6';
    else if (newScoreValue >= 45) grade = 'D7';
    else if (newScoreValue >= 40) grade = 'E8';

    const newRecord: StudentTestScoreRecord = {
      id: `score-${Date.now()}`,
      studentId: targetStudent.id,
      studentName: targetStudent.studentName,
      studentEmail: targetStudent.email,
      studentClass: targetStudent.studentClass,
      subject: newScoreSubject.trim() || 'General Test',
      score: Number(newScoreValue),
      grade,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      testType: newScoreType
    };

    const updated = addStudentScore(newRecord);
    setScoresList(updated);
    setIsAddScoreModalOpen(false);
    playSuccessSound();
  };

  // Export CSV of student averages and test counts
  const handleExportCSV = () => {
    const headers = [
      'Student ID',
      'Student Name',
      'Class',
      'Stream',
      'School',
      'Average Test Score (%)',
      'Performance Tier',
      'Tests Taken',
      'Highest Score (%)',
      'Lowest Score (%)'
    ];
    const rows = filteredStudents.map(s => [
      s.id,
      `"${s.studentName}"`,
      s.studentClass,
      s.academicStream || 'general',
      `"${s.school}"`,
      s.averageScore,
      s.performanceTier,
      s.testCount,
      s.highestScore,
      s.lowestScore
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_Average_Test_Scores_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playSuccessSound();
  };

  // Custom Recharts Tooltip for Students Bar Chart
  const CustomStudentTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: StudentAverageData = payload[0].payload;
      return (
        <div className="bg-[#081a3d] text-white p-3.5 rounded-2xl shadow-2xl border border-white/15 text-xs max-w-[260px] animate-fade-in backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
            <span className="font-extrabold text-sm text-[#62c5fa] truncate">
              {data.studentName}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-black uppercase text-sky-200">
              {data.studentClass}
            </span>
          </div>

          <div className="space-y-1.5 text-slate-300 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Average Score:</span>
              <strong className="text-base font-black text-white">{data.averageScore}%</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Academic Standing:</span>
              <span
                className={`font-black uppercase text-[10px] px-2 py-0.5 rounded-full ${
                  data.performanceTier === 'Distinction'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : data.performanceTier === 'Credit'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : data.performanceTier === 'Pass'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                }`}
              >
                {data.performanceTier}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tests Recorded:</span>
              <strong className="text-white">{data.testCount} exam(s)</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Score Range:</span>
              <span className="text-white font-mono">
                {data.lowestScore}% — {data.highestScore}%
              </span>
            </div>

            <div className="pt-1.5 border-t border-white/10 text-[10px] text-slate-400 truncate">
              🏫 {data.school}
            </div>

            <div className="text-[9.5px] text-[#62c5fa] italic text-center pt-1 font-semibold">
              Click bar to inspect all test records
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Recharts Tooltip for Classes Bar Chart
  const CustomClassTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#081a3d] text-white p-3 rounded-2xl shadow-xl border border-white/15 text-xs animate-fade-in">
          <div className="font-extrabold text-sm text-[#62c5fa] mb-1">
            Class {data.studentClass}
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <span>Class Average:</span>
              <strong className="text-sm font-black text-white">{data.averageScore}%</strong>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Enrolled Students:</span>
              <strong className="text-white">{data.studentCount}</strong>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Total Tests:</span>
              <strong className="text-white">{data.totalTests}</strong>
            </div>
            {data.studentCount > 0 && (
              <div className="flex items-center justify-between gap-3 text-slate-400">
                <span>Range:</span>
                <span>{data.lowestAverage}% — {data.highestAverage}%</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const classesList = ['all', 'JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];

  return (
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      {/* Header & Controls Bar */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-[#081a3d] via-[#0d2a5c] to-[#123977] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1">
              <Sparkles size={11} /> Academic Analytics
            </span>
            <span className="text-xs text-sky-200 font-semibold">
              Live CBT & Assessment Trends
            </span>
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <TrendingUp size={22} className="text-[#62c5fa]" />
            <span>Average Test Scores & Academic Trends</span>
          </h3>
          <p className="text-xs text-[#c8daf3] mt-1 max-w-2xl">
            Visualizing average performance across all registered students in Nigerian junior and senior secondary classes to easily pinpoint academic trends.
          </p>
        </div>

        {/* View Mode Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Mode Switcher */}
          <div className="bg-white/10 p-1 rounded-xl flex items-center gap-1 border border-white/15 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setViewMode('students')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'students'
                  ? 'bg-white text-[#081a3d] shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              All Students ({filteredStudents.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('classes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'classes'
                  ? 'bg-white text-[#081a3d] shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              By Class
            </button>
            <button
              type="button"
              onClick={() => setViewMode('streams')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'streams'
                  ? 'bg-white text-[#081a3d] shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              Science vs Art
            </button>
          </div>

          {/* Quick Record Score Button */}
          <button
            type="button"
            onClick={() => setIsAddScoreModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#62c5fa] hover:bg-sky-300 text-[#081a3d] text-xs font-extrabold transition-all cursor-pointer shadow-sm active:scale-95"
            title="Log an exam score for a registered student"
          >
            <Plus size={14} className="stroke-[3]" />
            <span>Record Test</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/10"
            title="Export student scores as CSV report"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Trend Indicator Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 p-3.5 sm:p-5 bg-slate-50 border-b border-slate-200">
        {/* Cohort Average */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Overall Average
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#081a3d] mt-0.5">
            {trendInsights.cohortAverage}%
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
            <CheckCircle2 size={11} /> Pass Benchmark &gt; 50%
          </span>
        </div>

        {/* Top Performing Student */}
        <div className="bg-white p-3 rounded-2xl border border-emerald-200/90 shadow-2xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Top Student
          </span>
          <div className="text-sm sm:text-base font-black text-[#081a3d] mt-0.5 truncate" title={trendInsights.topStudent?.studentName}>
            {trendInsights.topStudent?.studentName || 'N/A'}
          </div>
          <span className="text-[10px] font-extrabold text-emerald-600">
            {trendInsights.topStudent ? `${trendInsights.topStudent.averageScore}% (${trendInsights.topStudent.studentClass})` : '—'}
          </span>
        </div>

        {/* Top Performing Class */}
        <div className="bg-white p-3 rounded-2xl border border-indigo-200/90 shadow-2xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
            Highest Class
          </span>
          <div className="text-xl sm:text-2xl font-black text-indigo-600 mt-0.5">
            {trendInsights.topClass ? `Class ${trendInsights.topClass.studentClass}` : '—'}
          </div>
          <span className="text-[10px] text-indigo-500 font-bold">
            {trendInsights.topClass ? `${trendInsights.topClass.averageScore}% avg` : '—'}
          </span>
        </div>

        {/* Distinction Rate */}
        <div className="bg-white p-3 rounded-2xl border border-blue-200/90 shadow-2xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
            Distinctions (≥75%)
          </span>
          <div className="text-xl sm:text-2xl font-black text-blue-600 mt-0.5">
            {trendInsights.distinctionCount} Students
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            Grade A1 Tier
          </span>
        </div>

        {/* Pass Rate */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Cohort Pass Rate
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">
            {trendInsights.passingRate}%
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            {allStudentAverages.length} total enrolled
          </span>
        </div>

        {/* Needs Support */}
        <div className="bg-white p-3 rounded-2xl border border-rose-200/90 shadow-2xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 uppercase tracking-wider block flex items-center gap-1">
            <AlertCircle size={11} className="text-rose-600" /> Needs Support
          </span>
          <div className="text-xl sm:text-2xl font-black text-rose-600 mt-0.5">
            {trendInsights.needsSupportCount} Students
          </div>
          <span className="text-[10px] text-rose-500 font-bold">
            Below 50% Threshold
          </span>
        </div>
      </div>

      {/* Filter and Sorting Toolbar for Students View */}
      {viewMode === 'students' && (
        <div className="p-3 sm:p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Class Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
              <Filter size={12} /> Class:
            </span>
            {classesList.map(cls => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase transition-all cursor-pointer shrink-0 ${
                  selectedClass === cls
                    ? 'bg-[#081a3d] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Academic Stream Filter & Sort Options */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Stream Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setSelectedStream('all')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedStream === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                All Streams
              </button>
              <button
                type="button"
                onClick={() => setSelectedStream('science')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedStream === 'science' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                }`}
              >
                <Atom size={11} className="text-blue-600" /> Science
              </button>
              <button
                type="button"
                onClick={() => setSelectedStream('art')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedStream === 'art' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600'
                }`}
              >
                <Palette size={11} className="text-purple-600" /> Art
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <span className="text-[11px] font-bold text-slate-500 px-1.5 flex items-center gap-1">
                <ArrowUpDown size={11} /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-white text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-lg border border-slate-200 outline-none cursor-pointer"
              >
                <option value="score-desc">Highest Score First</option>
                <option value="score-asc">Lowest Score First</option>
                <option value="name">Student Name (A-Z)</option>
                <option value="class">Class (JSS1 - SS3)</option>
              </select>
            </div>

            {/* Benchmark Toggle */}
            <button
              type="button"
              onClick={() => setShowBenchmark(!showBenchmark)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                showBenchmark
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
              title="Show target benchmark threshold lines on chart"
            >
              Benchmark Lines: {showBenchmark ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* Main Chart Area */}
      <div className="p-4 sm:p-6 flex-1 min-h-[360px] sm:min-h-[420px] bg-white">
        {viewMode === 'students' ? (
          filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
              <Users size={36} className="text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-600">No students match the selected filter.</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the class or stream filter above.</p>
            </div>
          ) : (
            <div className="w-full h-[360px] sm:h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredStudents}
                  margin={{ top: 20, right: 20, left: -10, bottom: 65 }}
                  onClick={(state: any) => {
                    if (state && state.activePayload && state.activePayload.length) {
                      const student: StudentAverageData = state.activePayload[0].payload;
                      setInspectStudent(student);
                      if (onSelectStudent) onSelectStudent(student.id);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="shortName"
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                    height={60}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 50, 60, 75, 100]}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip content={<CustomStudentTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.8 }} />

                  {/* Benchmark Lines for Academic Standards */}
                  {showBenchmark && (
                    <>
                      <ReferenceLine
                        y={75}
                        stroke="#10b981"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Distinction (75%)',
                          position: 'insideTopRight',
                          fill: '#059669',
                          fontSize: 10,
                          fontWeight: 700
                        }}
                      />
                      <ReferenceLine
                        y={50}
                        stroke="#f59e0b"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Credit Pass (50%)',
                          position: 'insideBottomRight',
                          fill: '#d97706',
                          fontSize: 10,
                          fontWeight: 700
                        }}
                      />
                    </>
                  )}

                  <Bar
                    dataKey="averageScore"
                    name="Average Test Score (%)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={45}
                    className="cursor-pointer transition-all hover:opacity-85"
                  >
                    {filteredStudents.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.id || index}`}
                        fill={entry.barColor}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        ) : viewMode === 'classes' ? (
          <div className="w-full h-[360px] sm:h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={classAverages}
                margin={{ top: 20, right: 20, left: -10, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="studentClass"
                  tick={{ fill: '#1e293b', fontSize: 13, fontWeight: 800 }}
                  label={{ value: 'Nigerian Secondary Class Cohorts', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#64748b' }}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 50, 60, 75, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  unit="%"
                />
                <Tooltip content={<CustomClassTooltip />} cursor={{ fill: '#f1f5f9' }} />

                {showBenchmark && (
                  <ReferenceLine
                    y={50}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{ value: 'Passing Threshold (50%)', position: 'insideTopLeft', fill: '#d97706', fontSize: 11, fontWeight: 700 }}
                  />
                )}

                <Bar
                  dataKey="averageScore"
                  name="Class Average Score (%)"
                  radius={[10, 10, 0, 0]}
                  maxBarSize={60}
                >
                  {classAverages.map((entry, index) => (
                    <Cell key={`class-cell-${index}`} fill={entry.barColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* Stream View (Science vs Art) */
          <div className="w-full h-[360px] sm:h-[420px] flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={streamAverages}
                margin={{ top: 20, right: 30, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#1e293b', fontSize: 13, fontWeight: 800 }}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  unit="%"
                />
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value}% (${item.payload.count} students enrolled)`,
                    'Average Score'
                  ]}
                  contentStyle={{ backgroundColor: '#081a3d', borderRadius: '12px', color: '#fff' }}
                />
                <Bar
                  dataKey="averageScore"
                  name="Stream Average (%)"
                  radius={[12, 12, 0, 0]}
                  maxBarSize={80}
                >
                  {streamAverages.map((entry, idx) => (
                    <Cell key={`stream-cell-${idx}`} fill={entry.barColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Legend & Performance Tier Indicator Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
            Performance Legend:
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-3 h-3 rounded-full bg-[#10b981]" />
            <span>Distinction (≥75%)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-3 h-3 rounded-full bg-[#3b82f6]" />
            <span>Credit (60–74%)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span>Pass (50–59%)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-3 h-3 rounded-full bg-[#f43f5e]" />
            <span>Needs Intervention (&lt;50%)</span>
          </span>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          💡 Click any student's bar to view specific subject score breakdown.
        </div>
      </div>

      {/* Student Details Inspection Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setInspectStudent(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[10.5px] font-black uppercase border border-indigo-100">
                Class {inspectStudent.studentClass}
              </span>
              {inspectStudent.academicStream && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10.5px] font-black uppercase">
                  {inspectStudent.academicStream} Stream
                </span>
              )}
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase ${
                  inspectStudent.performanceTier === 'Distinction'
                    ? 'bg-emerald-100 text-emerald-800'
                    : inspectStudent.performanceTier === 'Credit'
                    ? 'bg-blue-100 text-blue-800'
                    : inspectStudent.performanceTier === 'Pass'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {inspectStudent.performanceTier}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#081a3d] mt-1">
              {inspectStudent.studentName}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <School size={13} className="text-slate-400" />
              <span>{inspectStudent.school}</span>
            </p>

            {/* Quick Metrics in Modal */}
            <div className="grid grid-cols-3 gap-2.5 my-4">
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                <span className="text-[10px] font-bold text-indigo-700 uppercase">Average</span>
                <div className="text-xl font-black text-indigo-900">{inspectStudent.averageScore}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Highest</span>
                <div className="text-xl font-black text-emerald-900">{inspectStudent.highestScore}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Tests Logged</span>
                <div className="text-xl font-black text-slate-800">{inspectStudent.testCount}</div>
              </div>
            </div>

            {/* Recorded Test List */}
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-indigo-600" />
                <span>Recorded Subject Test Scores</span>
              </h4>

              {inspectStudent.scores.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl text-xs">
                  No separate tests logged yet for this candidate. Currently using baseline assessment.
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {inspectStudent.scores.map((sc, i) => (
                    <div
                      key={sc.id || i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-extrabold text-[#081a3d]">{sc.subject}</div>
                        <div className="text-[10.5px] text-slate-400">
                          {sc.testType} • {sc.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-indigo-700">{sc.score}%</div>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                          {sc.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInspectStudent(null)}
                className="px-5 py-2 rounded-xl bg-[#081a3d] text-white font-bold text-xs hover:bg-[#122e66] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Test Score Entry Modal */}
      {isAddScoreModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setIsAddScoreModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm mb-1">
              <PlusCircle size={18} className="text-indigo-600" />
              <span>Record Student Test Score</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Add a new classroom assessment, quiz, or CBT score to update student averages in real time.
            </p>

            <form onSubmit={handleAddScoreSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Student *</label>
                <select
                  value={newScoreStudentId}
                  onChange={e => setNewScoreStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-200 outline-none cursor-pointer"
                >
                  {registeredStudents.map(std => (
                    <option key={std.id} value={std.id}>
                      {std.studentName} ({std.studentClass}) — {std.school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Examination *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics, English Language, Physics"
                  value={newScoreSubject}
                  onChange={e => setNewScoreSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Score Percentage (0-100) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={newScoreValue}
                    onChange={e => setNewScoreValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-extrabold text-slate-800 focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Test Category *</label>
                  <select
                    value={newScoreType}
                    onChange={e => setNewScoreType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-200 outline-none cursor-pointer"
                  >
                    <option value="CBT Mock Exam">CBT Mock Exam</option>
                    <option value="Midterm Assessment">Midterm Assessment</option>
                    <option value="Term Examination">Term Examination</option>
                    <option value="Class Quiz">Class Quiz</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddScoreModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save & Update Chart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
