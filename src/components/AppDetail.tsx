import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppItem, ReviewRating, User } from '../types';
import { Star, ArrowLeft, Gamepad2, ArrowDownCircle, RefreshCw, Calendar, CheckSquare, Sparkles, Send, ShieldAlert } from 'lucide-react';

interface AppDetailProps {
  app: AppItem;
  user: User | null;
  onBack: () => void;
  onDownloadStarted: (appId: string) => void;
  onAddReview: (appId: string, rating: number, comment: string) => Promise<void>;
  reviews: ReviewRating[];
}

export default function AppDetail({
  app,
  user,
  onBack,
  onDownloadStarted,
  onAddReview,
  reviews
}: AppDetailProps) {
  const [downloadTimer, setDownloadTimer] = useState<number | null>(null);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [userComment, setUserComment] = useState('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string>(app.screenshots[0] || '');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [rateSuccess, setRateSuccess] = useState(false);

  useEffect(() => {
    // Sync active screenshot when switching apps
    setSelectedScreenshot(app.screenshots[0] || '');
    setDownloadTimer(null);
    setTriggerDownload(false);
    setRateSuccess(false);
  }, [app]);

  // Handle rating cast
  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please quick-login first using the top buttons to submit reviews! 🌱');
      return;
    }
    setSubmittingRating(true);
    try {
      await onAddReview(app.id, selectedRating, userComment);
      setUserComment('');
      setRateSuccess(true);
      setTimeout(() => setRateSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingRating(false);
    }
  };

  // Start the countdown sequence for custom secure downloads
  const triggerDirectDownloadFile = () => {
    onDownloadStarted(app.id);
    const proxyUrl = `/api/download?url=${encodeURIComponent(app.downloadUrl)}`;
    try {
      // Direct assignment securely triggers files download manager on mobile phones instantly
      window.location.href = proxyUrl;
    } catch (err) {
      const anchor = document.createElement('a');
      anchor.href = proxyUrl;
      anchor.setAttribute('download', `${app.name}.apk`);
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  const handleStartDownload = () => {
    if (downloadTimer !== null || triggerDownload) return;
    
    // Trigger direct user-initiated navigation instantly to bypass mobile popup and defer blockers!
    triggerDirectDownloadFile();
    setDownloadTimer(5);
  };

  useEffect(() => {
    if (downloadTimer === null) return;
    if (downloadTimer === 0) {
      setTriggerDownload(true);
      setDownloadTimer(null);
      return;
    }

    const timer = setTimeout(() => {
      setDownloadTimer(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [downloadTimer, app]);

  return (
    <div id="cozy-app-detail-container" className="max-w-5xl mx-auto py-6 px-4 animate-fade-in text-[#5c4a3c] text-left">
      {/* Back Button with subtle bounce */}
      <button
        id="app-detail-back-btn"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-4 py-2 font-bold bg-[#fffdfa] hover:bg-[#faedd9] text-[#5c4a3c] rounded-2xl border-2 border-[#e3dcd3] shadow-[0_4px_0_#e3dcd3] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer mb-6"
      >
        <ArrowLeft className="w-4 h-4 text-emerald-600" />
        <span>Return to Sunny Lawn</span>
      </button>

      {/* Main App Showcase Card */}
      <div className="bg-[#fffdfb] rounded-3xl border-4 border-[#e3dcd3] shadow-[0_12px_0_#e3dcd3] overflow-hidden p-6 sm:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 border-b-2 border-dashed border-[#e3dcd3] pb-8">
          {/* Main Logo icon with shadow container */}
          <motion.div
            initial={{ scale: 0.9, rotate: -3 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-3xl bg-[#fcf8f2] border-4 border-[#e9bc9d] shadow-[0_6px_0_#e9bc9d] overflow-hidden flex items-center justify-center p-1"
          >
            <img
              src={app.logoUrl}
              alt={app.name}
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Core Info & Metadata Title */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#e0f2fe] text-[#0369a1] text-xs font-bold rounded-lg border border-[#bae6fd]">
                {app.category}
              </span>
              <span className="px-3 py-1 bg-[#fef3c7] text-[#b45309] text-xs font-bold rounded-lg border border-[#fde68a]">
                {app.genre}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#4a3b32] tracking-tight leading-snug mb-2 break-all sm:break-words">
              {app.name}
            </h1>
            <p className="text-xs font-mono font-medium text-amber-700 mb-4 bg-orange-50 inline-block px-2 py-0.5 rounded break-all max-w-full">
              Package: {app.packageName}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-2 text-xs font-bold max-w-lg">
              <div className="bg-[#fcfbf9] p-2 sm:p-2.5 rounded-xl border border-[#e3dcd3] min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase text-[#a08f80] font-mono tracking-widest mb-0.5 truncate">Rating</p>
                <p className="text-xs sm:text-sm text-[#4a3b32] flex items-center gap-1 min-w-0">
                  <Star className="w-4 h-4 text-amber-400 fill-current shrink-0" />
                  <span className="whitespace-nowrap truncate">{app.rating.toFixed(1)} / 5</span>
                </p>
              </div>
              <div className="bg-[#fcfbf9] p-2 sm:p-2.5 rounded-xl border border-[#e3dcd3] min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase text-[#a08f80] font-mono tracking-widest mb-0.5 truncate">File Size</p>
                <p className="text-xs sm:text-sm text-[#4a3b32] truncate">{app.size}</p>
              </div>
              <div className="bg-[#fcfbf9] p-2 sm:p-2.5 rounded-xl border border-[#e3dcd3] min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase text-[#a08f80] font-mono tracking-widest mb-0.5 truncate">downloads</p>
                <p className="text-xs sm:text-sm text-[#4a3b32] truncate">{app.downloadCount.toLocaleString()}</p>
              </div>
              <div className="bg-[#fcfbf9] p-2 sm:p-2.5 rounded-xl border border-[#e3dcd3] min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase text-[#a08f80] font-mono tracking-widest mb-0.5 truncate">Version</p>
                <p className="text-xs sm:text-sm text-[#4a3b32] truncate">v{app.version}</p>
              </div>
            </div>
          </div>

          {/* Secure Download Trigger Box with Countdown Timer */}
          <div className="relative w-full md:w-64 flex flex-col items-center justify-center p-4 bg-[#fbf9f4] border-2 border-[#e3dcd3] rounded-2xl shrink-0 mt-4 md:mt-0 overflow-hidden min-h-[190px]">
            <AnimatePresence mode="wait">
              {downloadTimer !== null ? (
                <motion.div
                  key="counting"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="text-center py-2 w-full flex flex-col items-center justify-center"
                >
                  <p className="text-[10px] font-black uppercase text-[#e9803e] tracking-widest mb-3.5 animate-pulse">
                    Preparing Sacred Files
                  </p>
                  
                  {/* Progress Circle SVG */}
                  <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                    {/* Background Soft Track */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="36"
                        stroke="#ebdcb9"
                        strokeWidth="6"
                        fill="transparent"
                        className="opacity-40"
                      />
                      {/* Active green animated indicator with smooth dashoffset transitions */}
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="36"
                        stroke="#84b06c"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 36}
                        animate={{ 
                          strokeDashoffset: (2 * Math.PI * 36) - ((5 - downloadTimer) / 5) * (2 * Math.PI * 36) 
                        }}
                        transition={{ duration: 1, ease: 'linear' }}
                        strokeLinecap="round"
                      />
                    </svg>
                    
                    {/* Concentric Text Container */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span 
                        key={downloadTimer}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-2xl font-black text-[#5c4a3c] font-mono leading-none"
                      >
                        {downloadTimer}
                      </motion.span>
                      <span className="text-[9px] text-[#8a7667] font-semibold leading-none mt-0.5">sec</span>
                    </div>

                    {/* Cute floating magical leaf/sparkle decoration */}
                    <motion.span 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="absolute w-full h-full top-0 left-0 pointer-events-none flex items-start justify-center"
                    >
                      <span className="text-amber-500 text-xs -mt-1 scale-110">✦</span>
                    </motion.span>
                  </div>

                  <p className="text-[9px] text-[#8a7667] font-medium leading-normal max-w-[175px] mx-auto">
                    Securing tunnel nodes from ancient winds...
                  </p>
                  <a
                    href={`/api/download?url=${encodeURIComponent(app.downloadUrl)}`}
                    download={`${app.name}.apk`}
                    className="mt-2 text-[10.5px] text-[#3b662a] hover:text-[#52893c] underline font-extrabold cursor-pointer inline-flex items-center gap-1 z-10"
                  >
                    <span>🍃 Tap to download instantly</span>
                  </a>
                </motion.div>
              ) : triggerDownload ? (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="text-center py-2 w-full flex flex-col items-center justify-center leading-normal"
                >
                  <motion.div 
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10, delay: 0.1 }}
                    className="p-3 bg-emerald-100 rounded-full text-emerald-700 mb-2 relative"
                  >
                    <ArrowDownCircle className="w-8 h-8" />
                    <span className="absolute -top-1 -right-1 text-yellow-500 text-xs animate-bounce">★</span>
                  </motion.div>
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-tight">
                    Downloading Started!
                  </p>
                  <p className="text-[9px] text-[#8a7667] mt-1 font-medium max-w-[180px] mx-auto">
                    Check your browser downloads bar.
                  </p>
                  <a
                    href={`/api/download?url=${encodeURIComponent(app.downloadUrl)}`}
                    download={`${app.name}.apk`}
                    className="mt-1.5 text-[10.5px] text-amber-800 hover:text-amber-950 underline font-black cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>🍂 Problem? Tap to download directly</span>
                  </a>
                  <button
                    id="reset-download-btn"
                    onClick={() => setTriggerDownload(false)}
                    className="mt-3 px-4 py-1.5 bg-white hover:bg-orange-50 border border-[#e3dcd3] rounded-xl text-[10px] font-black text-amber-800 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm hover:scale-103"
                  >
                    <RefreshCw className="w-3 h-3 text-emerald-600 animate-spin" style={{ animationDuration: '3s' }} />
                    <span>Download Again</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center w-full"
                >
                  <motion.button
                    id="secure-download-trigger"
                    onClick={handleStartDownload}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 px-4 bg-[#84b06c] hover:bg-[#6c9c54] text-white font-extrabold rounded-xl border-b-4 border-[#5d8349] hover:border-b-2 active:translate-y-[2px] cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 text-sm sm:text-base relative overflow-hidden group"
                  >
                    <ArrowDownCircle className="w-5.5 h-5.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span>Secure APK Download</span>
                    
                    {/* Bounding hover light shimmer */}
                    <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  </motion.button>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#a08f80] font-mono">
                    <span>● Direct & Safe Link</span>
                    <span>|</span>
                    <span>● 100% Virus Checked</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Video Trailer Playback & Screenshots Slide Gallery Section */}
        <div className="mt-8">
          <h2 className="text-lg font-black tracking-tight text-[#4a3b32] mb-4 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-emerald-600" />
            <span>Gameplay Video Preview & screenshots gallery</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Direct Gameplay Trailer video frame (using BBB mock to ensure live functionality) */}
            <div className="md:col-span-2 bg-[#eae7de] rounded-2xl border-2 border-[#e3dcd3] overflow-hidden relative shadow-inner aspect-video">
              <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm text-white text-[9px] font-mono uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
                📽️ Gameplay Trailer
              </div>
              <video
                src={app.videoUrl}
                controls
                className="w-full h-full object-cover"
                poster={app.screenshots[0]}
                playsInline
              />
            </div>

            {/* Screenshots Slide Panel */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-black uppercase text-[#a08f80] tracking-widest">
                Screenshost Gallery
              </p>
              {/* Big showcase window */}
              <div className="flex-1 bg-[#eae7de] rounded-xl border-2 border-[#e3dcd3] overflow-hidden relative aspect-video md:aspect-auto">
                <img
                  src={selectedScreenshot}
                  alt="App Screenshot Highlight"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Mini thumbnails row */}
              <div className="flex gap-2.5 overflow-x-auto p-1 bg-[#fffdfa] rounded-xl border border-[#e3dcd3]">
                {app.screenshots.map((s, idx) => (
                  <button
                    key={idx}
                    id={`screenshot-thumb-${idx}`}
                    onClick={() => setSelectedScreenshot(s)}
                    className={`w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedScreenshot === s ? 'border-orange-400 scale-105' : 'border-[#e3dcd3] hover:border-orange-200'
                    }`}
                  >
                    <img src={s} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive "About" descriptive breakdown */}
        <div className="mt-8 pt-8 border-t border-dashed border-[#e3dcd3]">
          <h2 className="text-lg font-black text-[#4a3b32] mb-3">
            Description & About the Game / App
          </h2>
          <div className="text-sm text-[#705e52] leading-relaxed space-y-3 font-medium">
            <p>{app.description}</p>
          </div>

          {/* Expanded technical specification drawer */}
          <div className="mt-6 p-4 rounded-2xl bg-[#fdfbf6] border border-[#e3dcd3] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-[#705e52]">
            <div>
              <p className="text-[#a08f80] font-mono tracking-widest uppercase mb-1">Developer Studio</p>
              <p className="text-sm font-sans text-emerald-800 font-extrabold">{app.developer}</p>
            </div>
            <div>
              <p className="text-[#a08f80] font-mono tracking-widest uppercase mb-1">Upload Date coordinates</p>
              <p className="text-sm font-medium">{new Date(app.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Structured User Review section (featuring 5-star ratings custom form) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Rating Submission section */}
        <div className="bg-[#fffdfb] rounded-3xl border-4 border-[#e3dcd3] shadow-[0_8px_0_#e3dcd3] p-6 text-left">
          <h3 className="text-lg font-black text-[#4a3b32] mb-2 flex items-center gap-1.5">
            <Sparkles className="text-amber-500 w-5 h-5 fill-current" />
            <span>Cast your rating!</span>
          </h3>
          <p className="text-xs text-[#806c5a] mb-4">
            If you walked through our skies and enjoyed this apk, please submit a rating comment for the creator.
          </p>

          {rateSuccess && (
            <div className="mb-4 p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xl font-bold animate-pulse">
              ★ Rating synchronized in high clouds! Thank you.
            </div>
          )}

          {user ? (
            <form onSubmit={handleRateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#806c5a] tracking-widest mb-1">
                  How many stars?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      id={`star-btn-${star}`}
                      type="button"
                      onClick={() => setSelectedRating(star)}
                      className="p-1 cursor-pointer hover:scale-125 focus:scale-125 transition-all outline-none"
                    >
                      <Star
                        className={`w-8 h-8 filter drop-shadow-[0_2px_0_rgba(0,0,0,0.05)] ${
                          star <= selectedRating
                            ? 'text-yellow-400 fill-[#fec006]'
                            : 'text-[#e3dcd3] fill-transparent'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-amber-800 font-bold ml-2">({selectedRating} out of 5)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#806c5a] tracking-widest mb-1">
                  Review / Whisper
                </label>
                <textarea
                  id="user-review-comment"
                  rows={3}
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Whisper kind thoughts about your stay/experience..."
                  className="w-full p-3 rounded-xl bg-[#fdfbf8] text-[#5c4a3c] border-2 border-[#e3dcd1] focus:border-amber-400 focus:outline-none text-xs font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                id="submit-rating-btn"
                disabled={submittingRating}
                className="w-full py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white font-black rounded-xl border-b-4 border-[#b45309] text-xs uppercase tracking-wider cursor-pointer"
              >
                {submittingRating ? 'Sending scroll...' : 'Submit Rating ✨'}
              </button>
            </form>
          ) : (
            <div className="p-4 bg-[#fbf9f4] border border-[#e3dcd3] rounded-2xl text-center space-y-3">
              <span className="inline-block p-2 bg-[#faedd9] text-[#b45309] rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <p className="text-xs font-bold text-[#806c5a]">
                You must login to rate apps! Custom reviews require a secure profile namespace.
              </p>
              <button
                id="detail-login-shortcut-btn"
                onClick={() => alert('Please use the dynamic register/login button in the top navbar! 🍃')}
                className="text-xs font-black text-amber-700 underline cursor-pointer hover:text-amber-900"
              >
                Launch Account Manager
              </button>
            </div>
          )}
        </div>

        {/* Existing Reviews and comments lists */}
        <div className="md:col-span-2 bg-[#fffdfb] rounded-3xl border-4 border-[#e3dcd3] shadow-[0_8px_0_#e3dcd3] p-6 text-left flex flex-col">
          <h3 className="text-lg font-black text-[#4a3b32] mb-4">
            Recent Reviews from Other Spirits ({reviews.length})
          </h3>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-72 mini-scrollbar">
            {reviews.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#a08f80] font-mono">
                🐣 No reviews cast in the garden. Be the first!
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="p-3 bg-[#fdfaf5] border border-[#eef1e6] rounded-2xl">
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-bold text-[#5c4a3c] flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] uppercase font-bold text-orange-700">
                        {r.username.slice(0, 2)}
                      </span>
                      <span>{r.username}</span>
                    </span>
                    <span className="text-[10px] text-[#a08f80] font-mono">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Gold Stars */}
                  <div className="flex gap-0.5 mb-1.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < r.rating ? 'text-amber-400 fill-current' : 'text-[#e3dcd3]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#705e52] font-semibold italic">
                    "{r.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
