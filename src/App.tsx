import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import AppDetail from './components/AppDetail';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import Splash from './components/Splash';
import { AppItem, Slide, User, UserNotification, AppConfig } from './types';
import { 
  Sparkles, Star, ChevronRight, MessageSquareCode, 
  Download, Moon, CloudRain, BellRing, Heart, CloudSun 
} from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Client states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [selectedAppReviews, setSelectedAppReviews] = useState<any[]>([]);

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Weather / cozy mood states (Fully interactive for true Ghibli feel!)
  const [currentMood, setCurrentMood] = useState<'Sunny' | 'Shower' | 'Starry'>('Sunny');

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/apps');
      const data = await res.json();
      setApps(data);
    } catch (err) {
      console.error('Error fetching dynamic apps list:', err);
    }
  };

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/slides');
      const data = await res.json();
      setSlides(data);
    } catch (err) {
      console.error('Error fetching banners slides:', err);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error('Error loading config:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notices list:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error loading registered state details:', err);
    }
  };

  // Pull reviews for active app highlight
  const fetchReviewsForApp = async (appId: string) => {
    try {
      const res = await fetch(`/api/apps/${appId}/reviews`);
      const data = await res.json();
      setSelectedAppReviews(data);
    } catch (err) {
      console.error('Error pulling reviews', err);
    }
  };

  // Trigger setup on component mount
  useEffect(() => {
    fetchApps();
    fetchSlides();
    fetchConfig();
    fetchNotifications();
    fetchUsers();

    // Check localStorage session keys to keep user logged in on page refresh!
    const savedUserStr = localStorage.getItem('chibli_saved_user');
    if (savedUserStr) {
      try {
        setCurrentUser(JSON.parse(savedUserStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Update selectedApp view data dynamically if apps list gets updated by admin
  useEffect(() => {
    if (selectedApp) {
      const found = apps.find(a => a.id === selectedApp.id);
      if (found) {
        setSelectedApp(found);
      }
    }
  }, [apps]);

  // Handle rating posts
  const handleAddReview = async (appId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/apps/${appId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          username: currentUser.username,
          rating,
          comment
        })
      });
      if (!response.ok) throw new Error('Rating post failed');
      
      // Update app counts in UI instantly
      await fetchApps();
      await fetchReviewsForApp(appId);
    } catch (err) {
      console.error(err);
    }
  };

  // Increment download counter state on download trigger
  const handleDownloadStarted = async (appId: string) => {
    try {
      const payload = currentUser ? { userId: currentUser.id } : {};
      const response = await fetch(`/api/apps/${appId}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        // Refresh apps to reflect counter instantly
        fetchApps();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('chibli_saved_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('chibli_saved_user');
  };

  const handleSelectAppFromId = (appId: string) => {
    const found = apps.find(a => a.id === appId);
    if (found) {
      setSelectedApp(found);
      fetchReviewsForApp(found.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter application items based on categories and query matching strings
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'All') return matchesSearch;
    return app.category === selectedCategory && matchesSearch;
  });

  const trendingApps = apps.filter(a => a.isTrending);

  // Ghibli colors styling presets
  const bgThemes = {
    Sunny: 'from-[#fefafd] via-[#fdf6ec] to-[#e4f1db]',
    Shower: 'from-[#f0f4f8] via-[#e2ecf5] to-[#cfe2f3]',
    Starry: 'from-[#1e1b4b] via-[#111827] to-[#0f172a]'
  };

  const textThemes = {
    Sunny: 'text-[#5c4a3c]',
    Shower: 'text-[#415a77]',
    Starry: 'text-[#e2e8f0]'
  };

  return (
    <div id="main-cozy-container">
      {/* 🚀 Whimsical entry splash screen */}
      {showSplash && <Splash onDismiss={() => setShowSplash(false)} />}

      <div className={`min-h-screen bg-gradient-to-b ${bgThemes[currentMood]} ${textThemes[currentMood]} transition-all duration-1000 pb-20 font-sans antialiased text-left`}>
        {/* Navbar */}
        <Navbar
          config={config || { siteName: 'Chibli Haven', announcement: '', isAnnounceEnabled: false, bannerTitle: '', welcomeSubtitle: '' }}
          user={currentUser}
          onSearch={(q) => {
            setSearchQuery(q);
            setSelectedApp(null); // return to lists automatically on search query entry
          }}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSelectedApp(null); // return to main index lists
          }}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onOpenAdmin={() => {
            if (currentUser?.isAdmin || currentUser?.username === 'adminlogin@login') {
              setShowAdminPanel(true);
            } else {
              alert("🌿 Welcome traveler! To open the secure admin panel, you must first log in using your Admin account under the User Panel. Let me open the doorway for you...");
              setShowAuthModal(true);
            }
          }}
          onGoHome={() => {
            setSelectedApp(null);
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />

        {/* Floating/Sliding Banner on home page */}
        {!selectedApp && !searchQuery && selectedCategory === 'All' && (
          <Banner 
            slides={slides} 
            onSelectApp={handleSelectAppFromId} 
          />
        )}

        {/* Whimsical mood controller bar (Unique custom aesthetic modifier) */}
        <div className="max-w-6xl mx-auto px-4 mt-2 mb-4 flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-xs font-black tracking-widest text-[#a88265] uppercase font-mono">
              🌻 Interactive Forest Climate
            </h3>
            <p className="text-[10px] text-stone-500 font-medium">Click sun, wind or star to change Ghibli colors!</p>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-white/70 backdrop-blur-sm rounded-2xl border border-stone-200">
            <button
              onClick={() => setCurrentMood('Sunny')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${currentMood === 'Sunny' ? 'bg-[#faedd9] text-[#b45309]' : 'text-stone-400 hover:text-stone-600'}`}
              title="Sunny Meadow Theme"
            >
              <CloudSun className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => setCurrentMood('Shower')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${currentMood === 'Shower' ? 'bg-[#d0ebfc] text-[#1e6191]' : 'text-stone-400 hover:text-stone-600'}`}
              title="Gentle Shower Theme"
            >
              <CloudRain className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* CORE APPLICATION BODY LAYOUT */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6">
          {selectedApp ? (
            /* App/Game Detail Page with trailer, countdown timer, images and interactive star ratings */
            <AppDetail
              app={selectedApp}
              user={currentUser}
              onBack={() => setSelectedApp(null)}
              onDownloadStarted={handleDownloadStarted}
              onAddReview={handleAddReview}
              reviews={selectedAppReviews}
            />
          ) : (
            /* Home Screen Dynamic Sections Layout */
            <div className="space-y-12">
              
              {/* Dynamic Announcement banner intro */}
              <div id="home-welcome-header" className="text-center md:text-left py-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fff8e6] text-[#b45309] text-xs font-black rounded-lg border border-[#fde68a] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>★ ANNOUNCING COZY SUMMER ★</span>
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-[#5c4a3c] mb-3">
                  {config?.bannerTitle || 'Handcrafted APKS & Cute Retro Games'}
                </h1>
                <p className="text-sm md:text-base text-[#8c745d] max-w-2xl font-medium leading-relaxed">
                  {config?.welcomeSubtitle || 'Skip dangerous app directories and enter our clean, warm meadow for secure, offline-safe apk programs! Complete with Ghibli illustrations and bouncy layouts.'}
                </p>
              </div>

              {/* SECTION A: TRENDING / POPULAR GAMES (Slid horizontal lists) */}
              {trendingApps.length > 0 && !searchQuery && (
                <div id="trending-section">
                  <div className="flex items-center justify-between mb-5 border-b-2 border-dashed border-stone-200 pb-2">
                    <h3 className="text-lg font-black text-[#5c4a3c] flex items-center gap-2 tracking-tight">
                      <span>🔥 Hot & Trending in Forest</span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider scale-95">Dynamic</span>
                    </h3>
                    <span className="text-xs text-amber-800 font-bold flex items-center gap-1 hover:underline cursor-pointer">
                      <span>Swipe right</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingApps.slice(0, 3).map((appItem) => (
                      <div
                        key={appItem.id}
                        id={`trending-card-${appItem.id}`}
                        onClick={() => handleSelectAppFromId(appItem.id)}
                        className="group bg-[#fffdfb] rounded-2xl border-2 border-[#e3dcd3] shadow-[0_6px_0_#e3dcd3] hover:translate-y-[2px] hover:shadow-[0_4px_0_#e3dcd3] active:translate-y-[5px] active:shadow-none transition-all duration-200 p-4 shrink-0 cursor-pointer flex gap-4 text-left relative overflow-hidden"
                      >
                        {/* Cut corner soft shadow design */}
                        <div className="absolute top-0 right-0 w-8 h-8 bg-amber-100 rounded-bl-xl border-l border-b border-[#e3dcd3] flex items-center justify-center text-amber-800 text-[10px] font-bold">
                          ★
                        </div>

                        <div className="w-16 h-16 rounded-xl bg-orange-50 border-2 border-[#e9bc9d] overflow-hidden shrink-0 flex items-center justify-center">
                          <img src={appItem.logoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase text-amber-700 tracking-wide font-mono leading-none mb-1">
                            {appItem.category}
                          </p>
                          <h4 className="text-sm font-black text-[#4a3b32] truncate">
                            {appItem.name}
                          </h4>
                          <p className="text-[11px] text-[#8a7566] font-medium line-clamp-1 mt-0.5">
                            {appItem.genre}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-stone-500 font-bold">
                            <span className="flex items-center gap-0.5 text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                              {appItem.rating.toFixed(1)}
                            </span>
                            <span>|</span>
                            <span>{appItem.size}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION B: CORE APK GRID SECTIONS */}
              <div id="general-apk-grid">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 border-b-2 border-dashed border-stone-200 pb-3">
                  <div>
                    <h3 className="text-xl font-black text-[#5c4a3c] flex items-center gap-2">
                      <span>🌱 Enchanted Catalog</span>
                      <span className="text-xs text-stone-500 font-mono">({filteredApps.length} packages listed)</span>
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">Safe offline applications verified with zero tracker scripts.</p>
                  </div>

                  <span className="text-xs font-bold text-amber-800 bg-[#faedd9] px-3 py-1 rounded-xl border border-orange-200 uppercase">
                    🌳 cozy & comfortable
                  </span>
                </div>

                {filteredApps.length === 0 ? (
                  <div className="text-center py-20 bg-[#fffdfb] rounded-3xl border-2 border-[#e3dcd3] p-8 text-stone-500">
                    <p className="text-sm font-mono font-bold animate-bounce">🌻 Soot sprites are searching the thickets...</p>
                    <p className="text-xs text-stone-400 mt-1">No matches found. Clear your search or click 'All' to resets filters!</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      className="mt-4 px-4 py-2 bg-[#84b06c] hover:bg-[#6c9c4d] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Reset Filter Criteria
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredApps.map((a) => (
                      <div
                        key={a.id}
                        id={`catalog-card-${a.id}`}
                        onClick={() => handleSelectAppFromId(a.id)}
                        className="group bg-[#fffdfc] rounded-3xl border-2 border-[#e3dcd3] p-4 text-left shadow-[0_6px_0_#e3dcd3] hover:translate-y-[2px] hover:shadow-[0_4px_0_#e3dcd3] active:translate-y-[5px] active:shadow-none transition-all duration-200 cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          {/* Centered logo box with neat custom border */}
                          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#fdfdfd] border-2 border-[#e9bc9d] overflow-hidden p-1 flex items-center justify-center relative shadow-sm group-hover:rotate-2 transition-all">
                            <img src={a.logoUrl} alt="" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                          </div>

                          <div className="mt-4 text-center">
                            <span className="inline-block px-2 py-0.5 bg-orange-50 text-amber-800 text-[10px] font-bold rounded border border-orange-100 uppercase tracking-widest leading-none mb-1.5">
                              {a.category}
                            </span>
                            <h4 className="text-base font-black text-[#5c4a3c] group-hover:text-emerald-700 transition-colors truncate">
                              {a.name}
                            </h4>
                            <p className="text-xs font-bold text-stone-500 font-mono mt-0.5 mb-1.5">{a.genre}</p>
                            
                            <div className="flex items-center justify-center gap-2 text-xs font-bold mt-2">
                              {/* Glowing gold rating indicator */}
                              <span className="flex items-center gap-0.5 text-[#d97706]">
                                <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                                <span>{a.rating.toFixed(1)}</span>
                              </span>
                              <span className="text-stone-300">|</span>
                              <span className="text-stone-500 font-mono text-[11px]">{a.size}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4.5 pt-3.5 border-t border-dashed border-stone-200">
                          <button
                            id={`card-download-btn-${a.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAppFromId(a.id);
                            }}
                            className="w-full py-2 bg-[#84b06c] hover:bg-[#6c9c54] text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider cursor-pointer shadow-sm group-hover:scale-103 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download APK</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER COZY SIDEBAR: LIVE USER BOARD & FLOATING NOTIFICATIONS INBOX */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t-2 border-dashed border-stone-200">
                
                {/* Panel 1: Tiny News desk broadcast */}
                <div className="bg-[#f0f9ff] text-[#075985] rounded-3xl border-2 border-[#bae6fd] p-5 text-left flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-[#075985] mb-2 flex items-center gap-1.5">
                      <BellRing className="w-4 h-4 text-[#0284c7]" />
                      <span>Cozy Letters Box ({notifications.length})</span>
                    </h4>
                    <p className="text-xs text-[#0369a1] leading-relaxed mb-4">
                      Direct alerts transmitted from the Forest Keepers. Rest secure under our watching skies.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {notifications.slice(0, 2).map((notice) => (
                      <div key={notice.id} className="p-3 bg-white/80 rounded-xl border border-[#bae6fd]">
                        <p className="text-xs font-bold text-[#0369a1]">{notice.title}</p>
                        <p className="text-[11px] text-[#0ea5e9] mt-0.5">{notice.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel 2: Cozy Ghibli quote space */}
                <div className="bg-[#fdfaf2] text-[#854d0e] rounded-3xl border-2 border-yellow-200 p-5 text-left flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-amber-900 mb-1">
                      🍃 Tree of Whispers
                    </h4>
                    <p className="text-[11px] text-[#b45309] font-medium italic mt-2 leading-relaxed">
                      "Trees and people used to be good friends... Always walk with kind eyes and verify your android payloads properly!"
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-start gap-1 pb-1">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                    <span className="text-[10px] text-amber-800 font-mono font-bold">Made with fluffy dreams for APK hunters.</span>
                  </div>
                </div>

              </div>

            </div>
          )}
        </main>

        {/* Global Footer trademark credits */}
        <footer id="global-cozy-footer" className="mt-16 border-t border-stone-200 pt-8 pb-12 max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-stone-400 font-medium">
            © 2026 {config?.siteName || 'Chibli Haven'} APK Playground Corp. Inspired by standard cozy animations and waterpainted designs under warm retro clouds.
          </p>
          <p className="text-[10px] text-stone-300 font-mono mt-1">
            All rights and magical layouts are persistently archived. No soot sprites were abused during compiled builds.
          </p>
        </footer>

        {/* AUTHENTICATION MODAL */}
        <AnimatePresence>
          {showAuthModal && (
            <AuthModal
              onClose={() => setShowAuthModal(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </AnimatePresence>

        {/* SECURE ADMIN TERMINAL WITH 4-STEP VERIFICATION */}
        <AnimatePresence>
          {showAdminPanel && (
            <AdminPanel
              onClose={() => setShowAdminPanel(false)}
              apps={apps}
              slides={slides}
              users={users}
              notifications={notifications}
              config={config || { siteName: 'Chibli Haven', announcement: '', isAnnounceEnabled: false, bannerTitle: '', welcomeSubtitle: '' }}
              onRefreshApps={fetchApps}
              onRefreshSlides={fetchSlides}
              onRefreshNotifications={fetchNotifications}
              onRefreshConfig={fetchConfig}
              currentUser={currentUser}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
