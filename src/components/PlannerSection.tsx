import React, { useState, useRef } from 'react';
import { 
  Plus, Check, Trash2, Clock, Filter, 
  Calendar, CheckCircle2, ListFilter, Sparkles, AlertCircle,
  Paperclip, Download, Upload, X
} from 'lucide-react';
import { TaskItem, TaskAttachment } from '../types';

interface PlannerSectionProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted: () => void;
}

export const PlannerSection: React.FC<PlannerSectionProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onClearCompleted
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // New task form state
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('4:00 PM');
  const [category, setCategory] = useState<TaskItem['category']>('Mathematics');
  const [priority, setPriority] = useState<TaskItem['priority']>('medium');
  const [attachment, setAttachment] = useState<TaskAttachment | undefined>(undefined);
  const taskFileInputRef = useRef<HTMLInputElement | null>(null);

  const categories: Array<TaskItem['category']> = [
    'Mathematics', 'Reading', 'Assignment', 'Project', 'Science', 'Language', 'Other'
  ];

  const handleTaskFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setAttachment({
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        dataUrl: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      time,
      category,
      completed: false,
      priority,
      attachment
    });

    setTitle('');
    setAttachment(undefined);
    setIsAdding(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Mathematics': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Reading': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Assignment': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Project': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Science': return 'bg-teal-50 text-teal-700 border-teal-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <section id="planner" className="py-16 sm:py-20 px-4 sm:px-8 lg:px-[7%] bg-[#f6f9ff]">
      <div className="max-w-[1250px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-[#1976d2] text-xs font-bold uppercase tracking-wider mb-3">
              <Calendar size={14} /> Plan Your Day
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#081a3d] tracking-tight">
              Daily Study & Task Planner
            </h2>
            <p className="text-[#597092] text-base mt-2 max-w-xl">
              Organize your assignments, time-block your study sessions, and monitor today's academic progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="planner-add-task-btn"
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1976d2] text-white text-sm font-bold shadow-md hover:bg-[#1565c0] transition-all cursor-pointer"
            >
              <Plus size={18} />
              {isAdding ? 'Cancel' : 'Add New Task'}
            </button>
            {completedCount > 0 && (
              <button
                onClick={onClearCompleted}
                className="text-xs text-slate-500 hover:text-red-600 font-semibold px-3 py-2 transition-colors cursor-pointer"
              >
                Clear completed
              </button>
            )}
          </div>
        </div>

        {/* Progress Overview Card */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-[#e2eaf4] shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#13264b] text-base">Today's Progress</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {completedCount} of {tasks.length} Completed
                </span>
              </div>
              <span className="font-extrabold text-[#1976d2] text-lg">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-[#e7edf5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#398ddd] to-[#1976d2] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              {progressPercent === 100 
                ? 'Outstanding work! You completed all scheduled tasks for today!' 
                : `${tasks.length - completedCount} tasks remaining to crush today's study goals.`}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] rounded-xl p-4 text-center border border-blue-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">Daily Status</div>
            <div className="text-2xl font-black text-[#081a3d] mt-1">
              {progressPercent === 100 ? 'Mastered 🌟' : progressPercent >= 50 ? 'On Track 🚀' : 'Getting Ready 📖'}
            </div>
          </div>
        </div>

        {/* Add Task Form (Collapsible) */}
        {isAdding && (
          <form 
            onSubmit={handleFormSubmit}
            className="bg-white rounded-2xl p-6 mb-8 border-2 border-[#62c5fa]/50 shadow-md animate-fade-up"
          >
            <h3 className="text-lg font-bold text-[#081a3d] mb-4 flex items-center gap-2">
              <Plus size={18} className="text-[#1976d2]" /> Add Study Task or Assignment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Task Title
                </label>
                <input
                  id="new-task-title"
                  type="text"
                  required
                  placeholder="e.g. Study Biology Chapter 4 or Finish Essay"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1976d2] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Scheduled Time
                </label>
                <input
                  id="new-task-time"
                  type="text"
                  placeholder="e.g. 4:30 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1976d2] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject Category
                </label>
                <select
                  id="new-task-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskItem['category'])}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1976d2] focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Task File Attachment */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <input
                ref={taskFileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => handleTaskFileSelect(e.target.files)}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
              />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Paperclip size={15} className="text-[#1976d2]" />
                  <span className="text-xs font-bold text-slate-700">Attach Document / Worksheet:</span>
                </div>
                {attachment ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-[#1976d2] text-xs font-bold">
                    <span className="truncate max-w-[200px]">{attachment.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachment(undefined)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => taskFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
                  >
                    <Upload size={12} />
                    <span>Browse File</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">Priority:</span>
                {(['low', 'medium', 'high'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${
                      priority === p 
                        ? p === 'high' ? 'bg-red-500 text-white' : p === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="submit-new-task-btn"
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-[#1976d2] text-white rounded-xl hover:bg-[#1565c0] shadow-sm transition-all"
                >
                  Save Task
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
              <Filter size={14} /> Filter:
            </span>
            <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filter === 'all' ? 'bg-[#081a3d] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filter === 'pending' ? 'bg-[#081a3d] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({tasks.length - completedCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filter === 'completed' ? 'bg-[#081a3d] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <span className="text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Category:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap border ${
                selectedCategory === 'all' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              All Subjects
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap border transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards Grid */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
            <CheckCircle2 size={42} className="mx-auto text-emerald-500 mb-3" />
            <h4 className="text-lg font-bold text-slate-800">No tasks in this view</h4>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              All filtered tasks have been finished or none have been added yet. Click &quot;Add New Task&quot; above to schedule your next study objective!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className={`bg-white rounded-xl p-4 sm:p-5 border transition-all duration-200 flex items-start gap-3.5 group shadow-sm hover:shadow-md ${
                  task.completed 
                    ? 'border-emerald-200/80 bg-emerald-50/20 opacity-80' 
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => onToggleTask(task.id)}
                  aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 flex-shrink-0 cursor-pointer ${
                    task.completed
                      ? 'bg-[#419be7] border-[#419be7] text-white shadow-sm'
                      : 'border-[#a9bdd6] hover:border-[#419be7] bg-white'
                  }`}
                >
                  {task.completed && <Check size={14} strokeWidth={3} />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0" onClick={() => onToggleTask(task.id)}>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md border ${getCategoryColor(task.category)}`}>
                      {task.category}
                    </span>
                    {task.priority === 'high' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 flex items-center gap-0.5">
                        <AlertCircle size={10} /> High Priority
                      </span>
                    )}
                  </div>

                  <h4 className={`text-base font-bold transition-all ${
                    task.completed ? 'text-slate-400 line-through' : 'text-[#13264b]'
                  }`}>
                    {task.title}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <Clock size={13} className="text-slate-400" /> {task.time}
                    </span>

                    {task.attachment && (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (task.attachment?.dataUrl) {
                            const link = document.createElement('a');
                            link.href = task.attachment.dataUrl;
                            link.download = task.attachment.name;
                            link.click();
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-[#1976d2] font-semibold text-[11px] border border-blue-200 cursor-pointer transition-colors"
                        title={`Click to download/open ${task.attachment.name}`}
                      >
                        <Paperclip size={11} />
                        <span className="truncate max-w-[130px]">{task.attachment.name}</span>
                        <Download size={10} className="ml-0.5 opacity-70" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                  title="Delete task"
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
