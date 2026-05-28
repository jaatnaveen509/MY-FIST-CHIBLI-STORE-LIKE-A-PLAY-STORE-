import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppItem, Slide, User, UserNotification, AppConfig } from '../types';
import { 
  ShieldCheck, Lock, Radio, Database, KeyRound, CheckCircle2, 
  Settings, Layers, DownloadCloud, PlusCircle, Trash2, Edit3, 
  Mail, Settings2, Sliders, Play, Image, UserCheck, X 
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  apps: AppItem[];
  slides: Slide[];
  users: User[];
  notifications: UserNotification[];
  config: AppConfig;
  onRefreshApps: () => void;
  onRefreshSlides: () => void;
  onRefreshNotifications: () => void;
  onRefreshConfig: () => void;
  currentUser?: User | null;
}

export default function AdminPanel({
  onClose,
  apps,
  slides,
  users,
  notifications,
  config,
  onRefreshApps,
  onRefreshSlides,
  onRefreshNotifications,
  onRefreshConfig,
  currentUser
}: AdminPanelProps) {
  // Verification steps: 0, 1, 2, 3, 4 (4 is fully unlocked)
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Auto-login / Auto-bypass for authenticated admin
  useEffect(() => {
    if (currentUser?.isAdmin || currentUser?.username === 'adminlogin@login') {
      setCurrentStep(4);
      setCompletedSteps([1, 2, 3, 4]);
    }
  }, [currentUser]);

  // Drag and Drop States
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const processApkFile = (file: File) => {
    if (!file) return;
    if (!file.name.endsWith('.apk')) {
      alert("🍃 Oh! Soot sprites can only process files with '.apk' file extensions.");
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);
    
    // Simulate Ghibli style parsing
    setTimeout(() => {
      setIsUploading(false);
      
      // Derive clean title from filename
      let cleanName = file.name
        .replace(/\.apk$/i, '')
        .split(/[_\-\s]+/)
        .map(word => {
          if (!word) return '';
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
      
      // Calculate human size
      let sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      let formattedSize = `${sizeMB} MB`;
      if (file.size === 0) formattedSize = "24.5 MB";
      
      // Generate package name
      let derivedPkg = `com.chibli.${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

      // Set form parameters!
      setAppForm(prev => ({
        ...prev,
        name: cleanName,
        size: formattedSize,
        packageName: derivedPkg,
        downloadUrl: `https://archive.org/download/cozy-apks/${file.name}`,
        developer: prev.developer || 'Cozy Studio'
      }));

      alert(`🎉 APK "${file.name}" (${formattedSize}) loaded successfully! App details auto-filled inside the form.`);
    }, 1500);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processApkFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processApkFile(e.target.files[0]);
    }
  };

  // Step 1 Input states
  const [step1User, setStep1User] = useState('');
  const [step1Pass, setStep1Pass] = useState('');

  // Step 2 Passcode
  const [step2Code, setStep2Code] = useState('');

  // Step 3 (Triggers API search for user in database)
  const [isDbChecking, setIsDbChecking] = useState(false);
  const [dbUserFound, setDbUserFound] = useState<User | null>(null);

  // Step 4 Second Pass
  const [step4SecondPass, setStep4SecondPass] = useState('');

  const [authError, setAuthError] = useState('');
  const [secProgressMsg, setSecProgressMsg] = useState('');

  // Tab management inside unlocked administration suite
  const [activeTab, setActiveTab] = useState<'apps' | 'slides' | 'mail' | 'config'>('apps');

  // APP FORM CRUD states
  const [selectedAppForEdit, setSelectedAppForEdit] = useState<AppItem | null>(null);
  const [appForm, setAppForm] = useState({
    id: '',
    name: '',
    packageName: '',
    category: 'Games' as string,
    genre: '',
    logoUrl: '',
    videoUrl: '',
    screenshotsString: '',
    description: '',
    version: '',
    size: '',
    developer: '',
    downloadUrl: '',
    isTrending: false,
  });

  // Dynamic categories management
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // SLIDE FORM state
  const [selectedSlideForEdit, setSelectedSlideForEdit] = useState<Slide | null>(null);
  const [slideForm, setSlideForm] = useState({
    id: '',
    title: '',
    description: '',
    badge: '★ EDITORS CHOICE',
    imageUrl: '',
    appId: '',
    buttonText: 'Discover'
  });

  // MAIL / SYSTEM NOTIFICATION state
  const [mailTitle, setMailTitle] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [mailStatus, setMailStatus] = useState('');

  // Graceful iframe-compatible delete confirmation states
  const [deleteConfirmAppId, setDeleteConfirmAppId] = useState<string | null>(null);
  const [deleteConfirmSlideId, setDeleteConfirmSlideId] = useState<string | null>(null);

  // CONFIGURATION state
  const [isAnnounce, setIsAnnounce] = useState(config.isAnnounceEnabled);
  const [announcementText, setAnnouncementText] = useState(config.announcement);
  const [siteName, setSiteName] = useState(config.siteName);
  const [bannerTitle, setBannerTitle] = useState(config.bannerTitle);
  const [welcomeSubtitle, setWelcomeSubtitle] = useState(config.welcomeSubtitle);

  // Synchronize config values when context triggers
  useEffect(() => {
    setIsAnnounce(config.isAnnounceEnabled);
    setAnnouncementText(config.announcement);
    setSiteName(config.siteName);
    setBannerTitle(config.bannerTitle);
    setWelcomeSubtitle(config.welcomeSubtitle);
  }, [config]);

  const resetAppForm = () => {
    setSelectedAppForEdit(null);
    setAppForm({
      id: '',
      name: '',
      packageName: '',
      category: 'Games',
      genre: 'Action RPG',
      logoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      screenshotsString: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600&h=350\nhttps://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600&h=350',
      description: '',
      version: '1.0.0',
      size: '25 MB',
      developer: 'Independent Dreamer',
      downloadUrl: 'https://archive.org/download/super-mario-run-apk/SuperCustomRunner.apk',
      isTrending: false,
    });
  };

  useEffect(() => {
    if (selectedAppForEdit) {
      setAppForm({
        id: selectedAppForEdit.id,
        name: selectedAppForEdit.name,
        packageName: selectedAppForEdit.packageName,
        category: selectedAppForEdit.category,
        genre: selectedAppForEdit.genre,
        logoUrl: selectedAppForEdit.logoUrl,
        videoUrl: selectedAppForEdit.videoUrl,
        screenshotsString: selectedAppForEdit.screenshots?.join('\n') || '',
        description: selectedAppForEdit.description,
        version: selectedAppForEdit.version,
        size: selectedAppForEdit.size,
        developer: selectedAppForEdit.developer,
        downloadUrl: selectedAppForEdit.downloadUrl,
        isTrending: selectedAppForEdit.isTrending,
      });
    } else {
      resetAppForm();
    }
  }, [selectedAppForEdit]);

  const resetSlideForm = () => {
    setSelectedSlideForEdit(null);
    setSlideForm({
      id: '',
      title: '',
      description: '',
      badge: '★ EDITORS CHOICE',
      imageUrl: '',
      appId: '',
      buttonText: 'Discover'
    });
  };

  useEffect(() => {
    if (selectedSlideForEdit) {
      setSlideForm({
        id: selectedSlideForEdit.id,
        title: selectedSlideForEdit.title,
        description: selectedSlideForEdit.description,
        badge: selectedSlideForEdit.badge,
        imageUrl: selectedSlideForEdit.imageUrl,
        appId: selectedSlideForEdit.appId || '',
        buttonText: selectedSlideForEdit.buttonText || 'Discover'
      });
    } else {
      resetSlideForm();
    }
  }, [selectedSlideForEdit]);

  /* ==========================================================================
     🔒 STEP-BY-STEP SECURE CHALLENGE HANDLERS
     ========================================================================== */

  // STEP 1 Credentials Validate
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/verify/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: step1User, password: step1Pass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCompletedSteps(prev => [...prev, 1]);
      setSecProgressMsg('✓ Step 1 unlocked. Welcome Arch-Admin credentials.');
      setCurrentStep(1); // progress to prompt for Step 2
    } catch (err: any) {
      setAuthError(err.message || 'Verification Error');
    }
  };

  // STEP 2 Security Key Validate
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/verify/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminCode: step2Code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCompletedSteps(prev => [...prev, 2]);
      setSecProgressMsg('✓ Step 2 approved. Celestial verification active.');
      setCurrentStep(2); // progress to Step 3 database trigger check
    } catch (err: any) {
      setAuthError(err.message || 'Key Rejected');
    }
  };

  // STEP 3 DB Check Integration Run
  const handleStep3Trigger = async () => {
    setAuthError('');
    setIsDbChecking(true);
    try {
      const res = await fetch('/api/admin/verify/step3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: step1User || 'adminlogin@login' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setDbUserFound(data.adminUser);
      setCompletedSteps(prev => [...prev, 3]);
      setSecProgressMsg('✓ Step 3 complete! Verified admin signature matched in local json files.');
      setTimeout(() => {
        setCurrentStep(3); // progress to Step 4 input
      }, 1000);
    } catch (err: any) {
      setAuthError(err.message || 'Database lookup mismatch');
    } finally {
      setIsDbChecking(false);
    }
  };

  // STEP 4 Final Second Passphrase Check
  const handleStep4Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/verify/step4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secondaryPassword: step4SecondPass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCompletedSteps(prev => [...prev, 4]);
      setSecProgressMsg('🎉 100% UNLOCKED. Magical Control Terminal ready.');
      setTimeout(() => {
        setCurrentStep(4); // Fully unlocked state
      }, 1200);
    } catch (err: any) {
      setAuthError(err.message || 'Step 4 master signature mismatch');
    }
  };

  /* ==========================================================================
     🛠️ APK & APP CRUD HANDLERS
     ========================================================================== */

  const handleAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedScreenshots = appForm.screenshotsString
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      ...appForm,
      screenshots: parsedScreenshots
    };

    const isUpdate = !!selectedAppForEdit;
    const url = isUpdate ? `/api/admin/apps/${selectedAppForEdit?.id}` : '/api/admin/apps';
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      alert(isUpdate ? 'Coordinates updated perfectly inside Ghibli index!' : 'New magical package has been planted in fields!');
      onRefreshApps();
      resetAppForm();
    } catch (err: any) {
      alert('Error updating APK library: ' + err.message);
    }
  };

  const handleAppDelete = async (id: string) => {
    if (deleteConfirmAppId !== id) {
      setDeleteConfirmAppId(id);
      // reset confirmation after 3 seconds of inactivity
      setTimeout(() => {
        setDeleteConfirmAppId(curr => curr === id ? null : curr);
      }, 3000);
      return;
    }
    setDeleteConfirmAppId(null);
    try {
      const res = await fetch(`/api/admin/apps/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete.');
      alert('App deleted successfully.');
      onRefreshApps();
      if (selectedAppForEdit?.id === id) resetAppForm();
    } catch (err: any) {
      alert(err.message);
    }
  };

  /* ==========================================================================
     🛠️ SLIDER BANNER HANDLERS
     ========================================================================== */

  const handleSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideForm)
      });
      if (!res.ok) throw new Error('Could not post slide');
      alert(selectedSlideForEdit ? 'Banner option updated elegantly!' : 'Banner option hung in sliding cloud rows!');
      onRefreshSlides();
      resetSlideForm();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSlideDelete = async (id: string) => {
    if (deleteConfirmSlideId !== id) {
      setDeleteConfirmSlideId(id);
      setTimeout(() => {
        setDeleteConfirmSlideId(curr => curr === id ? null : curr);
      }, 3000);
      return;
    }
    setDeleteConfirmSlideId(null);
    try {
      const res = await fetch(`/api/admin/slides/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error deleting.');
      alert('Slide swept away by soft breeze.');
      onRefreshSlides();
    } catch (err: any) {
      alert(err.message);
    }
  };

  /* ==========================================================================
     📢 NEWSLETTER / USER DIRECT NOTIFICATIONS
     ========================================================================== */

  const handleSendMail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMailStatus('Blowing warm carrier pigeon gusts...');
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: mailTitle, message: mailMessage })
      });
      if (!res.ok) throw new Error('Soot spirits dropped the letter.');
      setMailStatus('🎉 Successfully dispatched notification to all active browser sessions!');
      setMailTitle('');
      setMailMessage('');
      onRefreshNotifications();
      setTimeout(() => setMailStatus(''), 4000);
    } catch (err: any) {
      setMailStatus('Failed to send: ' + err.message);
    }
  };

  /* ==========================================================================
     🎨 CONFIGURATION / CUSTOMIZATION FRONTEND
     ========================================================================== */

  const handleConfigSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcement: announcementText,
          isAnnounceEnabled: isAnnounce,
          siteName,
          bannerTitle,
          welcomeSubtitle,
          categories: config.categories || ['Games', 'Apps', 'Tools', 'Editors Choice']
        })
      });
      if (!res.ok) throw new Error('Could not update metadata parameters.');
      alert('Site custom branding synchronized beautifully!');
      onRefreshConfig();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    
    // Check if category already exists
    const currentCats = config.categories || ['Games', 'Apps', 'Tools', 'Editors Choice'];
    if (currentCats.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      alert('🌸 Oh! This category already flourishes in our magical forest.');
      return;
    }

    const updatedCats = [...currentCats, trimmed];
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcement: announcementText,
          isAnnounceEnabled: isAnnounce,
          siteName,
          bannerTitle,
          welcomeSubtitle,
          categories: updatedCats
        })
      });
      if (!res.ok) throw new Error('Could not add custom category.');
      setNewCategoryInput('');
      alert(`✨ Magic category "${trimmed}" grew successfully!`);
      onRefreshConfig();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRemoveCategory = async (catToRemove: string) => {
    const currentCats = config.categories || ['Games', 'Apps', 'Tools', 'Editors Choice'];
    if (currentCats.length <= 1) {
      alert('🍃 A forest must have at least one canopy category remaining!');
      return;
    }
    const updatedCats = currentCats.filter(c => c !== catToRemove);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcement: announcementText,
          isAnnounceEnabled: isAnnounce,
          siteName,
          bannerTitle,
          welcomeSubtitle,
          categories: updatedCats
        })
      });
      if (!res.ok) throw new Error('Could not remove custom category.');
      alert(`🍂 Removed "${catToRemove}" category successfully.`);
      onRefreshConfig();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div id="admin-panel-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#fffefd] rounded-3xl border-4 border-[#e9bc9d] shadow-[0_16px_0_#e9bc9d] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-[#faedd9] px-6 py-4 border-b-2 border-[#e9bc9d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#b45309]" />
            <div>
              <h2 className="text-lg font-black text-[#5c4a3c] tracking-tight">
                Secure Arch-Admin Console
              </h2>
              <p className="text-[10px] font-mono font-bold text-[#b45309] uppercase tracking-wider">
                Shield Status: {currentStep === 4 ? '🔓 fully UNLOCKED' : `🔒 Step ${currentStep + 1} Challange Active`}
              </p>
            </div>
          </div>
          <button
            id="admin-panel-close-btn"
            onClick={onClose}
            className="p-1 text-[#b45309] hover:text-[#7c2d12] bg-[#fffdfa]/80 hover:bg-[#fffdfa] rounded-xl border border-[#e9bc9d]/50 cursor-pointer"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Dynamic Verification Progress Banner */}
        <div className="bg-[#fcfbee] px-6 py-2 border-b border-[#e3dcd1] flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-[#806c5a] shrink-0">Progress:</span>
          {[1, 2, 3, 4].map((stepNo) => (
            <div
              key={stepNo}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-all shrink-0 ${
                completedSteps.includes(stepNo)
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-stone-100 text-stone-500 border-stone-200'
              }`}
            >
              <span>Step {stepNo}</span>
              {completedSteps.includes(stepNo) && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
            </div>
          ))}
        </div>

        {/* Content body layout */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {/* SECURE 4-STEP VERIFICATION FORMS PANEL */}
          <AnimatePresence mode="wait">
            {currentStep < 4 && (
              <motion.div
                key="sec-lockbox"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto py-8 text-left space-y-6"
              >
                <div className="text-center">
                  <span className="inline-flex p-4 bg-orange-100 text-orange-700 rounded-full mb-3 border border-orange-200">
                    <Lock className="w-8 h-8 animate-bounce" />
                  </span>
                  <h3 className="text-xl font-extrabold text-[#4a3b32]">
                    Hierarchical 4-Step Verification required
                  </h3>
                  <p className="text-xs text-[#a08f80] mt-1">
                    To maintain strict control, please pass our security layers.
                  </p>
                </div>

                {authError && (
                  <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl font-semibold border border-red-200">
                    ⚠ Mismatch: {authError}
                  </div>
                )}

                {secProgressMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-semibold border border-emerald-200">
                    {secProgressMsg}
                  </div>
                )}

                {/* STEP 1 FORM: Credentials */}
                {currentStep === 0 && (
                  <form onSubmit={handleStep1Submit} className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                      <p className="text-[11px] font-mono leading-relaxed text-amber-900">
                        🔑 <strong className="uppercase">Verification Step 1 (Credentials):</strong> Enter Username & Password values provided in documentation specs.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#806c5a] font-bold uppercase tracking-wider mb-1.5">
                        Admin Login Username
                      </label>
                      <input
                        type="text"
                        placeholder="Enter admin email"
                        value={step1User}
                        onChange={(e) => setStep1User(e.target.value)}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#806c5a] font-bold uppercase tracking-wider mb-1.5">
                        Passcode Token
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={step1Pass}
                        onChange={(e) => setStep1Pass(e.target.value)}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      id="step1-verify-btn"
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase rounded-xl"
                    >
                      Verify Step 1 Credentials
                    </button>
                  </form>
                )}

                {/* STEP 2 FORM: Security Code */}
                {currentStep === 1 && (
                  <form onSubmit={handleStep2Submit} className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                      <p className="text-[11px] font-mono leading-relaxed text-blue-900">
                        🛡️ <strong className="uppercase">Verification Step 2 (Security Code):</strong> Submit matching Admin Code parameter.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#806c5a] font-bold uppercase tracking-wider mb-1.5">
                        Exact Admin Code
                      </label>
                      <input
                        type="text"
                        placeholder="Enter admin security code"
                        value={step2Code}
                        onChange={(e) => setStep2Code(e.target.value)}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      id="step2-verify-btn"
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase rounded-xl"
                    >
                      Authenticate Security Code
                    </button>
                  </form>
                )}

                {/* STEP 3 FORM: Database verify lookup */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl">
                      <p className="text-[11px] font-mono leading-relaxed text-purple-900">
                        🗄️ <strong className="uppercase">Verification Step 3 (Database Check):</strong> System must check if the provided username stands verified in local system files.
                      </p>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                      <p>Currently verifying criteria: <strong className="text-purple-800 font-medium">Administrator Local Entry Register</strong></p>
                    </div>

                    <button
                      id="step3-verify-btn"
                      type="button"
                      onClick={handleStep3Trigger}
                      disabled={isDbChecking}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Database className="w-4 h-4" />
                      <span>{isDbChecking ? 'Reading file registers...' : 'Query Active Database'}</span>
                    </button>
                  </div>
                )}

                {/* STEP 4 FORM: Secondary Password */}
                {currentStep === 3 && (
                  <form onSubmit={handleStep4Submit} className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <p className="text-[11px] font-mono leading-relaxed text-emerald-950">
                        🔐 <strong className="uppercase">Verification Step 4 (Secondary Password):</strong> Final security clearance phrase is required to decrypt UI components.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#806c5a] font-bold uppercase tracking-wider mb-1.5">
                        Second Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={step4SecondPass}
                        onChange={(e) => setStep4SecondPass(e.target.value)}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      id="step4-verify-btn"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-xl"
                    >
                      Trigger Master Access
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* FULLY UNLOCKED ADMINISTRATION DASHBOARD */}
          {currentStep === 4 && (
            <div id="unlocked-admin-dashboard" className="w-full text-left">
              
              {/* Tabs list headers */}
              <div className="flex border-b border-[#e3dcd1] mb-6 overflow-x-auto">
                <button
                  id="tab-apps-btn"
                  onClick={() => setActiveTab('apps')}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'apps' ? 'border-[#84b06c] text-[#5c7250]' : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>APK Manager</span>
                </button>
                <button
                  id="tab-slides-btn"
                  onClick={() => setActiveTab('slides')}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'slides' ? 'border-[#84b06c] text-[#5c7250]' : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Banner Slides</span>
                </button>
                <button
                  id="tab-mail-btn"
                  onClick={() => setActiveTab('mail')}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'mail' ? 'border-[#84b06c] text-[#5c7250]' : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>User Direct Mail</span>
                </button>
                <button
                  id="tab-config-btn"
                  onClick={() => setActiveTab('config')}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'config' ? 'border-[#84b06c] text-[#5c7250]' : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Settings2 className="w-4 h-4" />
                  <span>Global Tuning</span>
                </button>
              </div>

              {/* TAB 1 CONTENT: APK CRUD MANAGER */}
              {activeTab === 'apps' && (
                <div className="space-y-8">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                    <p className="text-xs text-green-950 font-medium">
                      🍃 <strong>APK Upload Station:</strong> Upload APK packages or configure direct download mirrors, trailer feeds, and visual display cards instantly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add/Edit App Form */}
                    <div className="bg-[#fffdfa] p-5 rounded-2xl border-2 border-[#e3dcd1]">
                      <h4 className="text-sm font-black text-[#5c4a3c] uppercase tracking-widest mb-4 flex items-center gap-1">
                        <PlusCircle className="w-4.5 h-4.5 text-orange-500" />
                        <span>{selectedAppForEdit ? `Edit APK: ${selectedAppForEdit.name}` : 'Plant New APK Entry'}</span>
                      </h4>

                      <form onSubmit={handleAppSubmit} className="space-y-4 text-xs font-bold text-[#806c5a]">
                        {/* 🌟 MAGICAL DRAG AND DROP APK HANDLER */}
                        <div className="p-1.5 border-2 border-dashed border-[#e9bc9d]/60 bg-orange-50/20 rounded-2xl">
                          <p className="text-[10px] uppercase font-black tracking-widest text-[#a88265] mb-1.5 flex items-center gap-1.5">
                            <span className="animate-pulse">☄️</span> Drag & Drop APK File
                          </p>
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('apk-drop-input')?.click()}
                            className={`p-5 rounded-xl text-center border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                              isDragging 
                                ? 'border-emerald-500 bg-[#eef7ea] scale-98' 
                                : 'border-[#e3dcd1] bg-[#faf8f4] hover:bg-[#fffdfa] hover:border-orange-300'
                            }`}
                          >
                            <input
                              type="file"
                              id="apk-drop-input"
                              accept=".apk"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            {isUploading ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="w-6 h-6 border-2 border-[#84b06c] border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] text-stone-600 font-bold animate-pulse">Reading APK bytes: {uploadedFileName}...</span>
                              </div>
                            ) : (
                              <>
                                <DownloadCloud className="w-6 h-6 text-emerald-600 animate-bounce" />
                                <div className="space-y-0.5">
                                  <p className="text-[11px] font-black text-[#5c4a3c]">Drag your .apk payload inside or Click to browse</p>
                                  <p className="text-[9px] text-[#cca080] font-medium">Auto-populates title, package name, download URL, and file size!</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-1">App/Game Title</label>
                            <input
                              type="text"
                              value={appForm.name}
                              onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                              placeholder="Castle High Climber"
                              className="w-full p-2 bg-stone-50 border rounded-xl"
                              required
                            />
                          </div>
                          <div>
                            <label className="block mb-1">Category Classification</label>
                            <select
                              value={appForm.category}
                              onChange={(e) => setAppForm({ ...appForm, category: e.target.value })}
                              className="w-full p-2 bg-white border rounded-xl"
                            >
                              {(config.categories || ['Games', 'Apps', 'Tools', 'Editors Choice']).map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-1">Android Package Name</label>
                            <input
                              type="text"
                              value={appForm.packageName}
                              onChange={(e) => setAppForm({ ...appForm, packageName: e.target.value })}
                              placeholder="com.games.castleclimber"
                              className="w-full p-2 bg-stone-50 border rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">Genre/Aesthetic</label>
                            <input
                              type="text"
                              value={appForm.genre}
                              onChange={(e) => setAppForm({ ...appForm, genre: e.target.value })}
                              placeholder="Strategy Simulator"
                              className="w-full p-2 bg-stone-50 border rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block mb-1">Version Title</label>
                            <input
                              type="text"
                              value={appForm.version}
                              onChange={(e) => setAppForm({ ...appForm, version: e.target.value })}
                              className="w-full p-2 bg-stone-50 border rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">File Size</label>
                            <input
                              type="text"
                              value={appForm.size}
                              onChange={(e) => setAppForm({ ...appForm, size: e.target.value })}
                              placeholder="52.4 MB"
                              className="w-full p-2 bg-stone-50 border rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">Developer Studio</label>
                            <input
                              type="text"
                              value={appForm.developer}
                              onChange={(e) => setAppForm({ ...appForm, developer: e.target.value })}
                              className="w-full p-2 bg-stone-50 border rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1 flex items-center gap-1">
                            <Image className="w-3.5 h-3.5 text-orange-500" />
                            <span>Media: App Logo Icon URL</span>
                          </label>
                          <input
                            type="url"
                            value={appForm.logoUrl}
                            onChange={(e) => setAppForm({ ...appForm, logoUrl: e.target.value })}
                            className="w-full p-2 bg-stone-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 flex items-center gap-1">
                            <Play className="w-3.5 h-3.5 text-orange-500" />
                            <span>Media: App Video Trailer MP4 link</span>
                          </label>
                          <input
                            type="url"
                            value={appForm.videoUrl}
                            onChange={(e) => setAppForm({ ...appForm, videoUrl: e.target.value })}
                            className="w-full p-2 bg-stone-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">Screenshots Gallery Photos URL List (One per line)</label>
                          <textarea
                            rows={3}
                            value={appForm.screenshotsString}
                            onChange={(e) => setAppForm({ ...appForm, screenshotsString: e.target.value })}
                            placeholder="https://images.unsplash.com/photo-1...\nhttps://..."
                            className="w-full p-2 bg-stone-50 border rounded-xl font-mono text-[10px]"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">Direct APK Download Link (Internal or Mirror)</label>
                          <input
                            type="url"
                            value={appForm.downloadUrl}
                            onChange={(e) => setAppForm({ ...appForm, downloadUrl: e.target.value })}
                            className="w-full p-2 bg-stone-50 border rounded-xl"
                            required
                          />
                        </div>

                        <div>
                          <label className="block mb-1">About/Description Body</label>
                          <textarea
                            rows={3}
                            value={appForm.description}
                            onChange={(e) => setAppForm({ ...appForm, description: e.target.value })}
                            className="w-full p-2 bg-stone-50 border rounded-xl"
                            required
                          />
                        </div>

                        <div className="flex items-center gap-2 py-2">
                          <input
                            type="checkbox"
                            checked={appForm.isTrending}
                            onChange={(e) => setAppForm({ ...appForm, isTrending: e.target.checked })}
                            className="w-4 h-4 text-emerald-600 rounded border-stone-350"
                          />
                          <label>Show as trending/popular on first section lists?</label>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="submit"
                            id="save-apk-form-btn"
                            className="flex-1 py-2.5 bg-[#84b06c] hover:bg-[#6c9c54] text-white rounded-xl text-xs uppercase"
                          >
                            {selectedAppForEdit ? 'Save Application Changes' : 'Plant Magic APK'}
                          </button>
                          {selectedAppForEdit && (
                            <button
                              id="cancel-apk-edit-btn"
                              type="button"
                              onClick={resetAppForm}
                              className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs uppercase"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* App List Container with CRUD triggers */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-[#5c4a3c] uppercase tracking-widest mb-1">
                        Active Seeded Library Index ({apps.length} Apps)
                      </h4>

                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 mini-scrollbar">
                        {apps.map((appItem) => (
                          <div key={appItem.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs font-semibold">
                            <div className="flex items-center gap-3">
                              <img src={appItem.logoUrl} alt="" className="w-10 h-10 object-cover rounded-lg border border-stone-300" referrerPolicy="no-referrer" />
                              <div className="text-left">
                                <p className="font-bold text-[#5c4a3c]">{appItem.name}</p>
                                <p className="text-[10px] text-stone-500 font-mono">v{appItem.version} | {appItem.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                id={`edit-app-btn-${appItem.id}`}
                                onClick={() => setSelectedAppForEdit(appItem)}
                                className="p-1 px-2 border border-[#84b06c] text-[#5c7250] bg-white rounded hover:bg-green-50 transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                id={`dalete-app-btn-${appItem.id}`}
                                onClick={() => handleAppDelete(appItem.id)}
                                className={`p-1 px-2 border transition-all cursor-pointer flex items-center gap-1 text-[10px] rounded ${
                                  deleteConfirmAppId === appItem.id
                                    ? 'border-red-600 bg-red-600 text-white hover:bg-red-700 animate-pulse'
                                    : 'border-red-300 text-red-600 bg-white hover:bg-red-50'
                                }`}
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>{deleteConfirmAppId === appItem.id ? 'Confirm?' : 'Delete'}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2 CONTENT: SLIDER BANNER CONTROL */}
              {activeTab === 'slides' && (
                <div className="space-y-8">
                  <div className="p-4 bg-[#fffdf6] border border-[#f5debe] rounded-2xl text-xs text-amber-900 leading-normal">
                    💡 Configure the dynamic image hero slider displayed on top of consumer index screens. Link them to active games or write global announcements.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Add slide form */}
                    <form onSubmit={handleSlideSubmit} className="space-y-4 text-xs font-bold text-[#806c5a] bg-[#fffdfa] p-5 rounded-2xl border border-stone-200">
                      <h4 className="text-xs uppercase tracking-wider font-black text-[#5c4a3c]">
                        {selectedSlideForEdit ? '✏️ Revise Slider Banner Item' : '📐 Hang Banner Item'}
                      </h4>
                      
                      <div>
                        <label className="block mb-1">Announce / Slide Title</label>
                        <input
                          type="text"
                          value={slideForm.title}
                          onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                          className="w-full p-2 bg-stone-50 border rounded-xl font-medium"
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-1">Subtitle / Summary</label>
                        <textarea
                          rows={2}
                          value={slideForm.description}
                          onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                          className="w-full p-2 bg-stone-50 border rounded-xl font-medium"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1">Color Sticker Badge</label>
                          <input
                            type="text"
                            value={slideForm.badge}
                            onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
                            className="w-full p-2 bg-stone-50 border rounded-xl font-medium"
                          />
                        </div>
                        <div>
                          <label className="block mb-1">Linked App ID</label>
                          <select
                            value={slideForm.appId}
                            onChange={(e) => setSlideForm({ ...slideForm, appId: e.target.value })}
                            className="w-full p-2 bg-white border rounded-xl font-medium"
                          >
                            <option value="">(No Game link - Announcement Only)</option>
                            {apps.map(a => (
                              <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1">Background Landscape URL image</label>
                        <input
                          type="url"
                          value={slideForm.imageUrl}
                          onChange={(e) => setSlideForm({ ...slideForm, imageUrl: e.target.value })}
                          className="w-full p-2 bg-stone-50 border rounded-xl font-medium"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          id="save-slide-btn"
                          className="flex-1 py-2 bg-[#84b06c] hover:bg-[#6c9c54] text-white font-bold rounded-xl text-xs uppercase"
                        >
                          {selectedSlideForEdit ? 'Save Slide Changes' : 'Publish Slider Layout'}
                        </button>
                        {selectedSlideForEdit && (
                          <button
                            type="button"
                            onClick={() => resetSlideForm()}
                            className="px-4 py-2 border border-stone-300 text-stone-600 bg-stone-150 hover:bg-stone-200 font-bold rounded-xl text-xs"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Active slides overview list */}
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-wider font-black text-[#5c4a3c]">Published slides</h4>
                      <div className="space-y-3">
                        {slides.map((sl) => (
                          <div key={sl.id} className="p-3 bg-stone-50 border rounded-xl flex items-start justify-between gap-4 text-xs font-semibold">
                            <div className="flex-1 text-left">
                              <p className="font-bold text-[#5c4a3c]">{sl.title}</p>
                              <p className="text-[10px] text-stone-500 italic font-mono">{sl.badge} | app: {sl.appId || 'none'}</p>
                            </div>
                            <div className="flex items-center gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => setSelectedSlideForEdit(sl)}
                                className="p-1 px-2 border border-blue-300 text-blue-600 bg-white rounded hover:bg-blue-50 text-[10px] transition-all cursor-pointer font-bold"
                              >
                                Edit
                              </button>
                              <button
                                id={`delete-slide-btn-${sl.id}`}
                                onClick={() => handleSlideDelete(sl.id)}
                                className={`p-1 px-2 border text-[10px] transition-all cursor-pointer rounded font-bold ${
                                  deleteConfirmSlideId === sl.id
                                    ? 'border-red-600 bg-red-600 text-white hover:bg-red-700 animate-pulse'
                                    : 'border-red-300 text-red-600 bg-white hover:bg-red-50'
                                }`}
                              >
                                {deleteConfirmSlideId === sl.id ? 'Sure?' : 'Uproot'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3 CONTENT: MAIL / ANNOUNCEMENT NOTIFICATIONS DISPATCH */}
              {activeTab === 'mail' && (
                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-xs text-orange-950 flex items-start gap-2">
                    <Mail className="w-5 h-5 text-orange-700 shrink-0" />
                    <div>
                      <p className="font-bold uppercase tracking-wider">User Mail & System Announcement</p>
                      <p className="mt-1">Broadcast newsletters, critical notifications, and direct system emails to users. Dispatches to client notifications inbox instantly.</p>
                    </div>
                  </div>

                  {mailStatus && (
                    <div className="p-3 bg-blue-50 text-blue-900 border border-blue-200 text-xs rounded-xl font-bold animate-pulse">
                      {mailStatus}
                    </div>
                  )}

                  <form onSubmit={handleSendMail} className="space-y-4 text-xs font-bold text-[#806c5a] bg-stone-50 p-5 rounded-2xl border">
                    <div>
                      <label className="block mb-1.5 uppercase font-black tracking-widest text-[#5c4a3c]">Notification Subject</label>
                      <input
                        type="text"
                        placeholder="📢 New Sky update or system warning..."
                        value={mailTitle}
                        onChange={(e) => setMailTitle(e.target.value)}
                        className="w-full p-2.5 bg-white border rounded-xl font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase font-black tracking-widest text-[#5c4a3c]">Body Content Details</label>
                      <textarea
                        rows={5}
                        placeholder="Write dynamic message text to send to registered emails and floating notices..."
                        value={mailMessage}
                        onChange={(e) => setMailMessage(e.target.value)}
                        className="w-full p-2.5 bg-white border rounded-xl font-mono"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      id="save-newsletter-btn"
                      className="w-full py-3 bg-[#e9bc9d] hover:bg-[#d5ad90] text-[#5c3e34] font-black rounded-xl uppercase tracking-widest cursor-pointer"
                    >
                      Dispatch Direct Client Mail 🕊️
                    </button>
                  </form>

                  {/* Sent messages logs */}
                  <div className="space-y-3 pt-4 text-left">
                    <h5 className="text-xs font-black uppercase text-[#806c5a]">History of Sent Announcements</h5>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 mini-scrollbar">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 bg-white border rounded-xl text-xs font-semibold">
                          <p className="font-bold text-[#5c4a3c]">{n.title}</p>
                          <p className="text-[#806c5a] text-[11px] mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-[#a08f80] font-mono mt-1 block">Sent on: {new Date(n.sentAt).toLocaleString()} | By: {n.sentBy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4 CONTENT: SITE TUNING CONFIGURATION */}
              {activeTab === 'config' && (
                <div className="max-w-xl mx-auto">
                  <form onSubmit={handleConfigSave} className="space-y-4 text-xs font-bold text-[#806c5a] bg-stone-50 p-6 rounded-2xl border">
                    <h4 className="text-sm font-black text-[#5c4a3c] uppercase tracking-widest mb-4 flex items-center gap-1">
                      <Settings className="w-5 h-5 text-amber-600" />
                      <span>Branding & Frontend Typography Parameter Customization</span>
                    </h4>

                    <div className="flex items-center gap-2 py-3 border-b-2 border-dashed border-stone-200">
                      <input
                        type="checkbox"
                        checked={isAnnounce}
                        onChange={(e) => setIsAnnounce(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <label>Enable top scrolling announcement marquee?</label>
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide text-xs">Marquee Message Text</label>
                      <textarea
                        rows={2}
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        className="w-full p-2.5 bg-white border rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1.5 uppercase tracking-wide text-xs">Site Brand Name</label>
                        <input
                          type="text"
                          value={siteName}
                          onChange={(e) => setSiteName(e.target.value)}
                          className="w-full p-2.5 bg-white border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block mb-1.5 uppercase tracking-wide text-xs">Primary Title Head</label>
                        <input
                          type="text"
                          value={bannerTitle}
                          onChange={(e) => setBannerTitle(e.target.value)}
                          className="w-full p-2.5 bg-white border rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide text-xs">Site Subtitle Header description</label>
                      <textarea
                        rows={2}
                        value={welcomeSubtitle}
                        onChange={(e) => setWelcomeSubtitle(e.target.value)}
                        className="w-full p-2.5 bg-white border rounded-xl"
                      />
                    </div>

                    <button
                      type="submit"
                      id="save-site-config-btn"
                      className="w-full py-3 bg-[#84b06c] hover:bg-[#6c9c54] text-white font-black rounded-xl uppercase cursor-pointer"
                    >
                      Save Site Parameters ✨
                    </button>
                  </form>

                  {/* Category Administration Box */}
                  <div className="mt-6 bg-[#fffdfb] p-6 rounded-2xl border-2 border-[#e3dcd3] text-xs font-bold text-[#806c5a]">
                    <h4 className="text-sm font-black text-[#5c4a3c] uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <Layers className="w-5 h-5 text-emerald-600" />
                      <span>Magical Category Administration</span>
                    </h4>
                    
                    {/* Category List */}
                    <p className="text-[10px] text-stone-500 mb-2 uppercase tracking-wide font-mono">Current Catalog Categories:</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(config.categories || ['Games', 'Apps', 'Tools', 'Editors Choice']).map((cat) => (
                        <div key={cat} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-[#cbd5e1]/40 rounded-xl shadow-sm text-[#5c4a3c] hover:border-orange-200 transition-colors">
                          <span className="font-bold text-[#5c4a3c]">{cat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(cat)}
                            className="text-stone-400 hover:text-red-500 text-xs transition-colors p-0.5 cursor-pointer rounded hover:bg-stone-100"
                            title={`Uproot ${cat}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Category Form */}
                    <form onSubmit={handleAddCategory} className="space-y-3">
                      <div>
                        <label className="block mb-1 text-xs uppercase text-stone-600">New Category Title</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newCategoryInput}
                            onChange={(e) => setNewCategoryInput(e.target.value)}
                            placeholder="Retro Emulators, Cozy Ambient"
                            className="bg-white border-2 border-[#e3dcd1] rounded-xl p-2.5 flex-1 outline-none text-stone-700 focus:border-emerald-500 font-medium"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#84b06c] hover:bg-[#6c9c54] text-white font-extrabold rounded-xl shrink-0 cursor-pointer flex items-center gap-1.5 uppercase text-[10px] tracking-wider shadow-sm active:translate-y-[1px]"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>Add Category</span>
                          </button>
                        </div>
                        <p className="text-[9px] text-[#cca080] font-medium mt-1 leading-relaxed">🌻 Will appear instantly in the filter line and app registration forms.</p>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Secure Logs Summary Info for administrative confidence */}
              <div className="mt-8 p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between text-[11px] text-[#806c5a] font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Secure administrative session active</span>
                </span>
                <span>Active registered database users: {users.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
