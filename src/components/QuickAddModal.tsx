import React, { useState } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { TaskItem } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('6:00 PM');
  const [category, setCategory] = useState<TaskItem['category']>('Mathematics');
  const [priority, setPriority] = useState<TaskItem['priority']>('medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      time,
      category,
      completed: false,
      priority
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-up">
      <div 
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Calendar size={18} />
            </div>
            <h3 className="text-lg font-bold text-[#081a3d]">Add to My Plan</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Task or Subject
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Physics Formula Practice"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="4:00 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskItem['category'])}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Reading">Reading</option>
                <option value="Assignment">Assignment</option>
                <option value="Project">Project</option>
                <option value="Science">Science</option>
                <option value="Language">Language</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Priority
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                    priority === p 
                      ? p === 'high' ? 'bg-red-500 text-white' : p === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-bold bg-[#1976d2] text-white hover:bg-[#1565c0] rounded-xl shadow-sm flex items-center justify-center gap-1"
            >
              <Plus size={16} /> Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
