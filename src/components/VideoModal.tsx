import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, Volume2, Sparkles, CheckCircle, Headphones, 
  ArrowLeft, Upload, Film, Link as LinkIcon, ShieldCheck, 
  Trash2, RefreshCw, Check, Clock, AlertCircle, User as UserIcon
} from 'lucide-react';
import { User } from '../types';
import { playSuccessSound } from '../utils/sound';

export interface CustomVideoData {
  videoType: 'file' | 'url' | 'default';
  videoUrl: string;
  videoFileName?: string;
  title: string;
  description: string;
  duration: string;
  uploadedAt?: string;
  uploadedBy?: string;
}

const STORAGE_KEY_CUSTOM_VIDEO = 'echo_plan_custom_video';

const DEFAULT_VIDEO_DATA: CustomVideoData = {
  videoType: 'default',
  videoUrl: '',
  title: 'Mastering Your School Routine with ECHO PLAN',
  description: 'Discover how top students structure their day: prioritizing high-impact assignments, staying consistent with daily habits, and studying without burnout.',
  duration: '2:45 min',
  uploadedBy: 'Victoria Okajoe (Administrator)'
};

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
}

export const VideoModal: React.FC<VideoModalProps> = ({ 
  isOpen, 
  onClose,
  currentUser 
}) => {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'student_admin';

  // Video data state loaded from localStorage
  const [videoData, setVideoData] = useState<CustomVideoData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_VIDEO);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_VIDEO_DATA;
  });

  // Admin Video Upload Panel Toggle
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Admin Upload Form Fields
  const [editTitle, setEditTitle] = useState(videoData.title);
  const [editDescription, setEditDescription] = useState(videoData.description);
  const [editDuration, setEditDuration] = useState(videoData.duration);
  const [editUrl, setEditUrl] = useState(videoData.videoUrl);
  const [selectedFileName, setSelectedFileName] = useState(videoData.videoFileName || '');
  const [pendingBlobUrl, setPendingBlobUrl] = useState<string | null>(null);

  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Video Playing / Simulation State
  const [isPlayingDefaultVideo, setIsPlayingDefaultVideo] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioContext | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (!isOpen) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_VIDEO);
      if (saved) {
        const parsed = JSON.parse(saved);
        setVideoData(parsed);
        setEditTitle(parsed.title);
        setEditDescription(parsed.description);
        setEditDuration(parsed.duration);
        setEditUrl(parsed.videoUrl);
        setSelectedFileName(parsed.videoFileName || '');
      }
    } catch {
      // fallback
    }
    setUploadSuccessNotice(null);
    setUploadError(null);
  }, [isOpen]);

  // Keyboard Escape listener to go back
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle ambient pink noise study lounge
  const toggleAmbientSound = () => {
    try {
      if (isPlayingSound) {
        if (audioSource) {
          audioSource.close();
          setAudioSource(null);
        }
        setIsPlayingSound(false);
      } else {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();

        // Create pink noise generator for soothing study background
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        noise.connect(gain);
        gain.connect(ctx.destination);
        noise.start();

        setAudioSource(ctx);
        setIsPlayingSound(true);
      }
    } catch {
      // Audio context fallback
    }
  };

  // Safe Close Handler (Restores Audio and Closes)
  const handleClose = () => {
    if (audioSource) {
      audioSource.close();
      setAudioSource(null);
      setIsPlayingSound(false);
    }
    setIsPlayingDefaultVideo(false);
    onClose();
  };

  // Handle Admin File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setUploadError('Please select a valid video file (MP4, WebM, etc.).');
      return;
    }

    // Create object URL for local playback
    const blobUrl = URL.createObjectURL(file);
    setPendingBlobUrl(blobUrl);
    setSelectedFileName(file.name);
    setEditUrl(blobUrl);
    setUploadError(null);
  };

  // Handle Admin Save Video
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    const finalTitle = editTitle.trim() || 'School Study Routine & Guidelines';
    const finalDescription = editDescription.trim() || 'Official Echo Plan student tutorial and class briefing.';
    const finalDuration = editDuration.trim() || '3:00 min';

    let finalType: 'file' | 'url' | 'default' = 'default';
    let finalUrl = editUrl.trim();

    if (pendingBlobUrl) {
      finalType = 'file';
      finalUrl = pendingBlobUrl;
    } else if (finalUrl) {
      finalType = 'url';
    }

    const updatedData: CustomVideoData = {
      videoType: finalType,
      videoUrl: finalUrl,
      videoFileName: selectedFileName || undefined,
      title: finalTitle,
      description: finalDescription,
      duration: finalDuration,
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      uploadedBy: currentUser?.name || 'Victoria Okajoe (Administrator)'
    };

    setVideoData(updatedData);

    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_VIDEO, JSON.stringify(updatedData));
    } catch {
      // ignore
    }

    playSuccessSound();
    setUploadSuccessNotice('✓ Video published successfully by Administrator Victoria Okajoe! Students can now view this video.');
    setIsAdminPanelOpen(false);
  };

  // Handle Admin Reset Video to Default
  const handleResetToDefault = () => {
    setVideoData(DEFAULT_VIDEO_DATA);
    setEditTitle(DEFAULT_VIDEO_DATA.title);
    setEditDescription(DEFAULT_VIDEO_DATA.description);
    setEditDuration(DEFAULT_VIDEO_DATA.duration);
    setEditUrl('');
    setSelectedFileName('');
    setPendingBlobUrl(null);

    try {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_VIDEO);
    } catch {
      // ignore
    }

    playSuccessSound();
    setUploadSuccessNotice('✓ Video reset to default Echo Plan Student Tour.');
    setIsAdminPanelOpen(false);
  };

  // Format YouTube or generic embed URL if provided
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  };

  const isEmbedable = videoData.videoUrl.includes('youtube.com') || videoData.videoUrl.includes('youtu.be');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#051126]/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={handleClose}
    >
      <div 
        className="bg-[#081a3d] border border-white/20 rounded-3xl max-w-4xl w-full text-white shadow-2xl overflow-hidden relative flex flex-col my-auto max-h-[95vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar with PROMINENT GO BACK BUTTON for Logged In Users & Visitors */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-[#061430] flex-shrink-0">
          
          {/* Prominent Back Button */}
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer border border-white/20 shadow-xs"
            title="Go back to Home Page"
          >
            <ArrowLeft size={16} className="text-[#62c5fa]" />
            <span>← Go Back to Home Page</span>
          </button>

          {/* User Status / Account Indicator */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <UserIcon size={12} className="text-emerald-400" />
                <span>Logged in: <strong>{currentUser.name}</strong> {currentUser.grade ? `(${currentUser.grade})` : ''}</span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Guest Visitor Mode
              </span>
            )}

            {/* Admin Upload Video Toggle */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setIsAdminPanelOpen(!isAdminPanelOpen);
                  setUploadSuccessNotice(null);
                  setUploadError(null);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs border ${
                  isAdminPanelOpen
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-400/40'
                }`}
                title="Admin: Upload or replace the home page video"
              >
                <Upload size={13} />
                <span>{isAdminPanelOpen ? 'Close Admin Studio' : '👑 Upload / Change Video (Admin)'}</span>
              </button>
            )}

            {/* Close X Button */}
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Close and return to Home Page"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
          
          {/* Success / Error Banners */}
          {uploadSuccessNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
              <span>{uploadSuccessNotice}</span>
            </div>
          )}

          {uploadError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-400 text-rose-200 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* ADMIN VIDEO UPLOAD / EDIT PANEL */}
          {isAdmin && isAdminPanelOpen && (
            <div className="bg-[#0c234f] border-2 border-amber-400/60 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                  <ShieldCheck size={18} />
                  <span>Admin Video Studio • Victoria Okajoe</span>
                </div>
                <span className="text-[11px] text-[#83bce1]">
                  Upload video file or paste web embed link
                </span>
              </div>

              <form onSubmit={handleSaveVideo} className="space-y-4">
                {/* 1. File Upload Option */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Option A: Upload Video File from Device (MP4, WebM)
                  </label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="video/*" 
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Film size={15} />
                      <span>Choose Video File...</span>
                    </button>
                    <span className="text-xs text-[#c8daf3] truncate">
                      {selectedFileName ? `Selected: ${selectedFileName}` : 'No local file chosen'}
                    </span>
                  </div>
                </div>

                {/* 2. Web Link Option */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Option B: Or Paste Video Web URL / YouTube Embed Link
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="e.g. https://www.youtube.com/watch?v=... or direct MP4 URL"
                      value={editUrl}
                      onChange={(e) => {
                        setEditUrl(e.target.value);
                        setPendingBlobUrl(null);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#62c5fa]"
                    />
                    <LinkIcon size={14} className="absolute right-3.5 top-3 text-slate-400" />
                  </div>
                </div>

                {/* Video Title */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Video Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mastering Your School Routine with ECHO PLAN"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-white/20 bg-white/10 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#62c5fa]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Duration Badge
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3:15 min"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-white/20 bg-white/10 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#62c5fa]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Video Brief / Student Instructions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe what students will learn from this video..."
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-white/20 bg-white/10 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#62c5fa]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    <Check size={15} />
                    <span>Save & Publish Video to Home Page</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw size={13} />
                    <span>Reset to Default Echo Plan Tour</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MAIN VIDEO PLAYER DISPLAY */}
          <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black relative">
            
            {/* Case 1: Custom Embed Link (YouTube, Vimeo, etc.) */}
            {videoData.videoUrl && isEmbedable ? (
              <div className="relative aspect-video w-full">
                <iframe
                  src={getEmbedUrl(videoData.videoUrl)}
                  title={videoData.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : videoData.videoUrl ? (
              /* Case 2: Custom Uploaded Video File (MP4, WebM Blob/URL) */
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <video
                  src={videoData.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  poster="/src/assets/images/teen_students_hero_1789589609561.jpg"
                >
                  Your browser does not support HTML5 video playback.
                </video>
              </div>
            ) : (
              /* Case 3: Interactive Default Student Masterclass Tour */
              <div className="relative aspect-video bg-gradient-to-tr from-[#0a2048] via-[#0d3170] to-[#1a4f9c] flex flex-col items-center justify-center p-6 sm:p-10 text-center select-none overflow-hidden">
                
                {/* Play Button Simulation */}
                <div 
                  onClick={() => setIsPlayingDefaultVideo(!isPlayingDefaultVideo)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#62c5fa] text-[#081a3d] flex items-center justify-center shadow-lg shadow-sky-500/40 mb-4 cursor-pointer hover:scale-110 active:scale-95 transition-transform group"
                  title={isPlayingDefaultVideo ? 'Pause Video' : 'Play Video'}
                >
                  {isPlayingDefaultVideo ? (
                    <Pause size={30} className="fill-current text-[#081a3d]" />
                  ) : (
                    <Play size={32} className="fill-current ml-1 text-[#081a3d]" />
                  )}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#62c5fa] text-[11px] font-extrabold uppercase tracking-wider mb-2">
                  <Sparkles size={12} />
                  <span>Echo Plan Video Masterclass</span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 max-w-xl">
                  {videoData.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#c8daf3] max-w-lg mx-auto leading-relaxed">
                  {videoData.description}
                </p>

                {isPlayingDefaultVideo && (
                  <div className="mt-4 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold animate-pulse">
                    ▶ Now Playing: Student Success Strategies & Daily Focus Tour
                  </div>
                )}

                <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between text-[11px] text-white/70">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-[#62c5fa]" /> {videoData.duration}
                  </span>
                  <span>{videoData.uploadedBy || 'Echo Plan Academic Council'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Details & Study Ambient Sound Panel */}
          <div className="p-5 sm:p-6 bg-[#091f46] rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle size={16} className="text-[#62c5fa]" /> 3 Core Study Pillars for Students:
              </h4>
              <ul className="text-xs text-[#c8daf3] space-y-1.5 list-disc list-inside">
                <li>Review class notes within 24 hours of each lecture.</li>
                <li>Tackle homework with 25-minute Pomodoro focus sprints.</li>
                <li>Tick your Days of Studies calendar to maintain study consistency.</li>
              </ul>
            </div>

            {/* Ambient Pink Noise Study Generator */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-[#62c5fa] flex items-center justify-center">
                  <Headphones size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Focus Noise Generator</div>
                  <div className="text-[11px] text-[#83bce1]">Gentle Pink Noise for Deep Work</div>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleAmbientSound}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                  isPlayingSound 
                    ? 'bg-amber-400 text-amber-950 hover:bg-amber-300' 
                    : 'bg-[#62c5fa] text-[#081a3d] hover:bg-sky-300'
                }`}
              >
                <Volume2 size={14} />
                <span>{isPlayingSound ? 'Pause Sound' : 'Play Sound'}</span>
              </button>
            </div>
          </div>

          {/* Sticky Bottom Go Back Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer border border-white/20 inline-flex items-center gap-2"
            >
              <ArrowLeft size={15} className="text-[#62c5fa]" />
              <span>← Return to Home Page</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
