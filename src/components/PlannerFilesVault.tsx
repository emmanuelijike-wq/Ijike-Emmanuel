import React, { useState, useRef } from 'react';
import { 
  Upload, FileText, File, Download, Trash2, Plus, 
  CheckCircle2, Sparkles, Filter, Search, Tag, Eye,
  ShieldCheck, AlertCircle, FileCheck, FolderDown, Paperclip
} from 'lucide-react';
import { PlannerFile, TaskItem } from '../types';

interface PlannerFilesVaultProps {
  files: PlannerFile[];
  onUploadFile: (newFile: Omit<PlannerFile, 'id' | 'uploadedAt'>) => void;
  onDeleteFile: (fileId: string) => void;
  onAddTaskFromFile: (file: PlannerFile) => void;
  currentUserName: string;
  currentUserRole: string;
}

export const PlannerFilesVault: React.FC<PlannerFilesVaultProps> = ({
  files,
  onUploadFile,
  onDeleteFile,
  onAddTaskFromFile,
  currentUserName,
  currentUserRole
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PlannerFile['category']>('Past Questions');
  const [fileNotes, setFileNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories: Array<PlannerFile['category']> = [
    'Past Questions',
    'Lesson Notes',
    'Homework Sheet',
    'Syllabus',
    'Timetable',
    'General'
  ];

  // Process files from either drag-and-drop or manual click browse
  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    Array.from(selectedFiles).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;

        onUploadFile({
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          category: selectedCategory,
          uploadedBy: currentUserName,
          uploadedRole: currentUserRole === 'student_admin' ? 'Student Admin' : 'Student',
          dataUrl,
          notes: fileNotes.trim() || undefined
        });

        setUploadSuccessMsg(`Successfully uploaded "${file.name}"!`);
        setTimeout(() => setUploadSuccessMsg(null), 4000);
      };

      // Read as Data URL to enable downloads and previews
      reader.readAsDataURL(file);
    });

    setFileNotes('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleManualBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileCategoryColor = (cat: PlannerFile['category']) => {
    switch (cat) {
      case 'Past Questions': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Lesson Notes': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Homework Sheet': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Syllabus': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Timetable': return 'bg-sky-50 text-sky-800 border-sky-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getFileIcon = (type: string, name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (type.includes('pdf') || ext === 'pdf') {
      return <FileText className="text-rose-500" size={24} />;
    }
    if (type.includes('image') || ['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) {
      return <FileCheck className="text-purple-500" size={24} />;
    }
    if (type.includes('word') || ['doc', 'docx'].includes(ext || '')) {
      return <FileText className="text-blue-500" size={24} />;
    }
    if (type.includes('sheet') || ['xls', 'xlsx', 'csv'].includes(ext || '')) {
      return <FileText className="text-emerald-500" size={24} />;
    }
    return <File className="text-indigo-500" size={24} />;
  };

  // Filtered files
  const filteredFiles = files.filter(f => {
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesCat = filterCategory === 'all' || f.category === filterCategory;
    const matchesSearch = !q || 
      (f.name || '').toLowerCase().includes(q) ||
      (f.notes && f.notes.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mt-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-wider mb-2 border border-indigo-100">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span>Academic Resource Hub & File Vault</span>
          </div>
          <h3 className="text-2xl font-extrabold text-[#081a3d] tracking-tight">
            Class Files, Syllabi & Study Materials
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Admins and students can upload past questions, revision PDFs, and homework sheets directly into the planner to attach to daily tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualBrowseClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#081a3d] hover:bg-[#122e66] text-white font-extrabold text-xs transition-all shadow-md cursor-pointer active:scale-95"
          >
            <Upload size={15} className="text-[#62c5fa]" />
            <span>Upload New File</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {uploadSuccessMsg && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-up">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {/* Upload Zone (Supports Drag-and-Drop & Click to Browse) */}
      <div className="mt-6">
        {/* Hidden native input for manual click selection */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.zip"
        />

        {/* Drop Target Container */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleManualBrowseClick}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all cursor-pointer select-none ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01]'
              : 'border-slate-300 hover:border-[#1976d2] bg-[#f8fbff] hover:bg-sky-50/50'
          }`}
        >
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3.5 transition-all ${
              isDragging ? 'bg-indigo-600 text-white' : 'bg-blue-100 text-[#1976d2]'
            }`}>
              <Upload size={28} />
            </div>

            <h4 className="text-base font-extrabold text-[#081a3d] mb-1">
              Drag & Drop Study Files Here
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              or <span className="text-[#1976d2] font-bold underline">browse from your computer / phone</span>
            </p>

            <div className="text-[11px] text-slate-400">
              Accepts PDF past questions, Word notes, Excel sheets, and assignment photos
            </div>
          </div>
        </div>

        {/* Upload Category & Notes Bar */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Tag size={15} className="text-slate-500 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">File Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as PlannerFile['category'])}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <input
              type="text"
              placeholder="Optional notes or topic (e.g. WAEC 2024 Algebra, Chapter 3 Lab Sheet)"
              value={fileNotes}
              onChange={(e) => setFileNotes(e.target.value)}
              className="w-full px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Uploaded Files */}
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-[#081a3d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Files ({files.length})
          </button>
          {categories.map(c => {
            const count = files.filter(f => f.category === c).length;
            if (count === 0) return null;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterCategory === c
                    ? 'bg-[#081a3d] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search uploaded files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          />
        </div>
      </div>

      {/* Uploaded Files Grid / List */}
      <div className="mt-4">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-slate-200">
            <FolderDown size={32} className="text-slate-400 mx-auto mb-2" />
            <h5 className="text-sm font-bold text-slate-700">No files found</h5>
            <p className="text-xs text-slate-500 mt-0.5">
              {searchQuery ? 'Try matching a different keyword' : 'Drag and drop or click above to upload your first academic file.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <div 
                key={file.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 bg-white hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      {getFileIcon(file.type, file.name)}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getFileCategoryColor(file.category)}`}>
                      {file.category}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-[#081a3d] truncate group-hover:text-[#1976d2] transition-colors" title={file.name}>
                    {file.name}
                  </h5>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{file.uploadedAt}</span>
                  </div>

                  {file.notes && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-xl line-clamp-2 italic">
                      &ldquo;{file.notes}&rdquo;
                    </p>
                  )}

                  <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-indigo-500" />
                    <span>Uploaded by: <strong className="text-slate-600">{file.uploadedBy}</strong></span>
                  </div>
                </div>

                {/* File Action Controls */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {file.dataUrl && (
                      <a
                        href={file.dataUrl}
                        download={file.name}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#1976d2] text-xs font-bold transition-colors cursor-pointer border border-sky-100"
                        title="Download or view file"
                      >
                        <Download size={13} />
                        <span>Download</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onAddTaskFromFile(file)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer border border-emerald-100"
                      title="Add to today's study schedule as a task"
                    >
                      <Plus size={13} className="text-emerald-600" />
                      <span>+ Add to Tasks</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteFile(file.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete file"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
