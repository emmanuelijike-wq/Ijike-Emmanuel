import React, { useState } from 'react';
import { 
  X, Plus, Sparkles, MessageSquareHeart, UserCheck, Trash2, 
  Edit3, RotateCcw, Check, Search, ShieldCheck, Users, Heart
} from 'lucide-react';
import { ClassMotivation, RegisteredStudentItem } from '../types';
import { playSuccessSound } from '../utils/sound';

interface AdminMotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  motivations: ClassMotivation[];
  onAddMotivation: (item: Omit<ClassMotivation, 'id' | 'createdAt'>) => void;
  onUpdateMotivation: (item: ClassMotivation) => void;
  onDeleteMotivation: (id: string) => void;
  onResetMotivations: () => void;
  onClearAllMotivations?: () => void;
  registeredStudents?: RegisteredStudentItem[];
  adminName?: string;
}

export const AdminMotivationModal: React.FC<AdminMotivationModalProps> = ({
  isOpen,
  onClose,
  motivations = [],
  onAddMotivation,
  onUpdateMotivation,
  onDeleteMotivation,
  onResetMotivations,
  onClearAllMotivations,
  registeredStudents = [],
  adminName = 'Victoria Okajoe'
}) => {
  const safeMotivations = Array.isArray(motivations) ? motivations : [];
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [editingItem, setEditingItem] = useState<ClassMotivation | null>(null);

  // Form states for adding/editing
  const [orderNumber, setOrderNumber] = useState<number>(safeMotivations.length + 1);
  const [quoteText, setQuoteText] = useState('');
  const [authorName, setAuthorName] = useState(adminName);
  const [category, setCategory] = useState<ClassMotivation['category']>('Self-Belief');
  const [targetType, setTargetType] = useState<'general' | 'one_to_one'>('general');
  const [targetStudent, setTargetStudent] = useState('');
  const [targetClass, setTargetClass] = useState('SS3');
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  // Search & Filter in list
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTarget, setFilterTarget] = useState<'all' | 'one_to_one' | 'general'>('all');

  const categories: ClassMotivation['category'][] = [
    'Self-Belief',
    'Hard Work',
    'Perseverance',
    'Exam Success',
    'Daily Discipline',
    'Leadership',
    'Personal Encouragement'
  ];

  // Open add form
  const handleOpenAddForm = (prefillOneToOne?: boolean) => {
    setEditingItem(null);
    setOrderNumber(safeMotivations.length + 1);
    setQuoteText('');
    setAuthorName(adminName);
    setCategory(prefillOneToOne ? 'Personal Encouragement' : 'Self-Belief');
    setTargetType(prefillOneToOne ? 'one_to_one' : 'general');
    if (prefillOneToOne && (registeredStudents || []).length > 0) {
      setTargetStudent(registeredStudents[0].studentName);
      setTargetClass(registeredStudents[0].studentClass);
    } else {
      setTargetStudent('');
    }
    setActiveTab('add');
  };

  // Open edit form
  const handleStartEdit = (item: ClassMotivation) => {
    setEditingItem(item);
    setOrderNumber(item.orderNumber);
    setQuoteText(item.quote);
    setAuthorName(item.author);
    setCategory(item.category);
    setTargetType(item.targetType);
    setTargetStudent(item.targetStudentName || '');
    setTargetClass(item.targetStudentClass || 'SS3');
    setActiveTab('add');
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteText.trim()) return;

    if (editingItem) {
      onUpdateMotivation({
        ...editingItem,
        orderNumber: Number(orderNumber) || editingItem.orderNumber,
        quote: quoteText.trim(),
        author: authorName.trim() || adminName,
        category,
        targetType,
        targetStudentName: targetType === 'one_to_one' ? targetStudent.trim() : undefined,
        targetStudentClass: targetType === 'one_to_one' ? targetClass : undefined
      });
      setFormSuccess(`Updated Motivation #${orderNumber} successfully!`);
    } else {
      onAddMotivation({
        orderNumber: Number(orderNumber) || (motivations.length + 1),
        quote: quoteText.trim(),
        author: authorName.trim() || adminName,
        category,
        targetType,
        targetStudentName: targetType === 'one_to_one' ? targetStudent.trim() : undefined,
        targetStudentClass: targetType === 'one_to_one' ? targetClass : undefined,
        createdBy: adminName,
        likesCount: 10
      });
      setFormSuccess(`Added new Motivation #${orderNumber} successfully!`);
    }

    playSuccessSound();
    setTimeout(() => {
      setFormSuccess(null);
      setActiveTab('list');
      setEditingItem(null);
    }, 1200);
  };

  // Filtered motivations for table
  const filteredList = (motivations || []).filter((m) => {
    if (!m) return false;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      (m.quote || '').toLowerCase().includes(q) ||
      (m.author || '').toLowerCase().includes(q) ||
      (m.targetStudentName && m.targetStudentName.toLowerCase().includes(q)) ||
      (m.category || '').toLowerCase().includes(q);

    const matchesTarget = 
      filterTarget === 'all' || 
      m.targetType === filterTarget;

    return matchesSearch && matchesTarget;
  }).sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

  const oneToOneCount = (motivations || []).filter(m => m && m.targetType === 'one_to_one').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-200 animate-scale-in max-h-[92dvh] flex flex-col overflow-hidden my-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#3b3294] text-white flex items-center justify-center font-black shadow-md shrink-0">
              <Sparkles size={18} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-xl font-black text-[#081a3d]">
                  Class Motivations Hub {safeMotivations.length > 0 ? `(1 to ${safeMotivations.length})` : '(0 Motivations)'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] sm:text-[10.5px] font-extrabold">
                  Admin Privileges
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Manage daily motivation quotes, cycle sequence, delete any motivation, and send 1-to-1 student notes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs & Counters */}
        <div className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveTab('list');
                setEditingItem(null);
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap min-h-[38px] ${
                activeTab === 'list'
                  ? 'bg-[#3b3294] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>All Motivations ({safeMotivations.length})</span>
            </button>

            <button
              onClick={() => handleOpenAddForm(false)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap min-h-[38px] ${
                activeTab === 'add' && !editingItem && targetType === 'general'
                  ? 'bg-[#3b3294] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Plus size={14} />
              <span>Add Motivation</span>
            </button>

            <button
              onClick={() => handleOpenAddForm(true)}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap min-h-[38px]"
              title="Add a 1-to-1 personal encouragement note for a student"
            >
              <MessageSquareHeart size={14} className="text-rose-600" />
              <span>+ Add 1-to-1 Note ({oneToOneCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {onClearAllMotivations && safeMotivations.length > 0 && (
              confirmClearAll ? (
                <div className="flex items-center gap-1 animate-fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      onClearAllMotivations();
                      setConfirmClearAll(false);
                      setActionFeedback(`All ${safeMotivations.length} motivations were removed from the class hub.`);
                      playSuccessSound();
                      setTimeout(() => setActionFeedback(null), 3500);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm animate-pulse"
                  >
                    Confirm Clear All?
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClearAll(false)}
                    className="px-2 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  id="admin-clear-hub-btn"
                  onClick={() => setConfirmClearAll(true)}
                  className="px-3 py-1.5 rounded-lg text-rose-600 hover:text-rose-800 text-xs font-bold hover:bg-rose-50 border border-rose-200/80 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Delete all motivations from collection"
                >
                  <Trash2 size={13} />
                  <span>Clear Hub ({safeMotivations.length})</span>
                </button>
              )
            )}

            {confirmReset ? (
              <div className="flex items-center gap-1 animate-fade-in">
                <button
                  type="button"
                  onClick={() => {
                    onResetMotivations();
                    setConfirmReset(false);
                    setActionFeedback('Restored all 52 standard motivations.');
                    playSuccessSound();
                    setTimeout(() => setActionFeedback(null), 3500);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm animate-pulse"
                >
                  Confirm Reset 52 Defaults?
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="admin-reset-hub-defaults-btn"
                onClick={() => setConfirmReset(true)}
                className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset to 52 standard motivations"
              >
                <RotateCcw size={13} />
                <span>Reset 52 Defaults</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-4">
          
          {/* TAB 1: MOTIVATIONS LIST */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              
              {actionFeedback && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fade-in">
                  <Check size={16} className="text-emerald-600" />
                  <span>{actionFeedback}</span>
                </div>
              )}

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200">
                <div className="relative w-full sm:w-72">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search quote, author, student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 sm:py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-start sm:justify-end overflow-x-auto no-scrollbar pb-0.5">
                  <span className="text-[11px] text-slate-500 font-semibold shrink-0">Filter:</span>
                  {(['all', 'general', 'one_to_one'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterTarget(t)}
                      className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer shrink-0 whitespace-nowrap min-h-[32px] ${
                        filterTarget === t
                          ? 'bg-[#3b3294] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t === 'one_to_one' ? '1-to-1 Personal' : t === 'general' ? 'General' : 'All (1-50)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motivations Roster Cards */}
              <div className="space-y-3">
                {filteredList.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
                    <Sparkles size={32} className="mx-auto text-slate-300" />
                    <h4 className="text-sm font-extrabold text-slate-700">
                      {searchQuery ? `No motivations match "${searchQuery}"` : 'No Motivations in Collection'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {searchQuery 
                        ? 'Try clearing the search or choosing a different filter.' 
                        : 'All motivations have been deleted from the collection. You can create new ones or restore the 52 standard defaults.'}
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-2">
                      {searchQuery ? (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="px-3.5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors cursor-pointer"
                        >
                          Clear Search Filter
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenAddForm(false)}
                            className="px-4 py-2 rounded-xl bg-[#3b3294] text-white text-xs font-bold hover:bg-[#312782] transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus size={14} />
                            <span>Create Motivation</span>
                          </button>
                          <button
                            onClick={() => {
                              onResetMotivations();
                              playSuccessSound();
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <RotateCcw size={14} />
                            <span>Restore 52 Defaults</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  filteredList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        item.targetType === 'one_to_one'
                          ? 'bg-rose-50/40 border-rose-200 hover:border-rose-400'
                          : 'bg-white border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#3b3294] flex items-center justify-center font-black text-sm flex-shrink-0">
                          #{item.orderNumber}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[#3b3294] text-[10.5px] font-black">
                              {item.category}
                            </span>

                            {item.targetType === 'one_to_one' ? (
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10.5px] font-extrabold flex items-center gap-1">
                                <UserCheck size={12} />
                                1-to-1 For: {item.targetStudentName} (Class {item.targetStudentClass || 'Any'})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                                General Class
                              </span>
                            )}
                          </div>

                          <blockquote className="text-xs sm:text-sm font-bold text-[#081a3d] italic leading-relaxed">
                            &ldquo;{item.quote}&rdquo;
                          </blockquote>

                          <div className="text-[11px] text-slate-500 font-semibold">
                            — {item.author}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          id={`admin-edit-motivation-${item.orderNumber}`}
                          onClick={() => handleStartEdit(item)}
                          className="px-2.5 py-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-slate-200 hover:border-purple-200"
                          title={`Edit Motivation #${item.orderNumber}`}
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>

                        {confirmDeleteId === item.id ? (
                          <div className="flex items-center gap-1 animate-fade-in">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteMotivation(item.id);
                                setConfirmDeleteId(null);
                                setActionFeedback(`Motivation #${item.orderNumber} was deleted successfully.`);
                                playSuccessSound();
                                setTimeout(() => setActionFeedback(null), 3500);
                              }}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 shadow-sm animate-pulse"
                            >
                              <Trash2 size={13} />
                              <span>Delete?</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            id={`admin-delete-motivation-${item.orderNumber}`}
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="px-2.5 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-rose-200/80 hover:border-rose-300"
                            title={`Delete Motivation #${item.orderNumber}`}
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 2: ADD / EDIT FORM */}
          {activeTab === 'add' && (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto py-2">
              
              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fade-in">
                  <Check size={16} className="text-emerald-600" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#3b3294]">
                    {editingItem ? `Editing Motivation #${editingItem.orderNumber}` : 'Create New Motivation Word'}
                  </h4>
                  <p className="text-[11px] text-purple-700/80">
                    Supports general class motivation as well as 1-to-1 personal student messages.
                  </p>
                </div>

                <div className="w-24">
                  <label className="block text-[10px] font-black text-purple-900 uppercase">
                    Order #
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 bg-white border border-purple-200 rounded-lg text-xs font-bold text-purple-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Target Type Selector */}
              <div>
                <label className="block text-xs font-black text-[#081a3d] mb-1.5">
                  Motivation Target Audience *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetType('general')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      targetType === 'general'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-xs">General / Entire Class</div>
                    <div className="text-[11px] text-slate-500">Seen by all students in daily cycle</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('one_to_one')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      targetType === 'one_to_one'
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-xs flex items-center gap-1">
                      <MessageSquareHeart size={14} className="text-rose-600" />
                      <span>One-to-One Basis</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Directed to a specific individual student</div>
                  </button>
                </div>
              </div>

              {/* 1-to-1 Recipient Fields */}
              {targetType === 'one_to_one' && (
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3 animate-fade-in">
                  <div className="text-xs font-extrabold text-rose-900 flex items-center gap-1.5">
                    <UserCheck size={15} />
                    <span>Select Student Recipient for 1-to-1 Motivation</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-rose-800 mb-1">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        list="registered-students-datalist"
                        placeholder="e.g. Kelechi Eze"
                        value={targetStudent}
                        onChange={(e) => setTargetStudent(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                        required
                      />
                      <datalist id="registered-students-datalist">
                        {registeredStudents.map(s => (
                          <option key={s.id} value={s.studentName}>
                            {s.studentName} ({s.studentClass})
                          </option>
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-rose-800 mb-1">
                        Student Class
                      </label>
                      <select
                        value={targetClass}
                        onChange={(e) => setTargetClass(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="JSS1">JSS 1</option>
                        <option value="JSS2">JSS 2</option>
                        <option value="JSS3">JSS 3</option>
                        <option value="SS1">SS 1</option>
                        <option value="SS2">SS 2</option>
                        <option value="SS3">SS 3</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Motivational Words Textarea */}
              <div>
                <label className="block text-xs font-black text-[#081a3d] mb-1">
                  Motivational Quote Words *
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Believe in yourself, there is nothing you cannot do..."
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-serif leading-relaxed"
                  required
                />
              </div>

              {/* Author & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#081a3d] mb-1">
                    Author / Giver of Motivation
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Victoria Okajoe (Lead Admin)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#081a3d] mb-1">
                    Category Theme
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ClassMotivation['category'])}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('list');
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#3b3294] hover:bg-[#312782] text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>{editingItem ? 'Save Changes' : 'Publish Motivation'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Modal Footer Info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <div>
            Total Library: <strong className="text-slate-800">{safeMotivations.length}</strong> Motivations
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span>Echo Plan Academic Mentorship Engine</span>
          </div>
        </div>

      </div>
    </div>
  );
};
