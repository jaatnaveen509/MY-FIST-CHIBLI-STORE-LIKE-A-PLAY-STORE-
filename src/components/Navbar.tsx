import React, { useState } from 'react';
import { User, AppConfig } from '../types';
import { Cloud, Search, LogIn, Sparkles, UserCheck, ShieldAlert, LogOut, ArrowRight, Star } from 'lucide-react';

interface NavbarProps {
  config: AppConfig;
  user: User | null;
  onSearch: (query: string) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onGoHome: () => void;
}

export default function Navbar({
  config,
  user,
  onSearch,
  onSelectCategory,
  selectedCategory,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
  onGoHome
}: NavbarProps) {
  const [query, setQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* 📣 Announcement Marquee Banner (Fully customizable by Admin) */}
      {config.isAnnounceEnabled && config.announcement && (
        <div id="global-announcement-scroll" className="bg-[#fef3c7] text-[#78350f] py-1.5 px-4 text-xs font-semibold border-b border-[#fcd34d] shadow-sm flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <div className="flex justify-center items-center gap-1.5 shrink-0 bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full text-[10px] scale-95 font-bold uppercase tracking-wider">
            <span>Notice</span>
          </div>
          <div className="w-full overflow-hidden">
            <div className="inline-block animate-marquee pl-[100%] hover:[animation-play-state:paused]">
              {config.announcement}
            </div>
          </div>
        </div>
      )}

      {/* Primary header bar */}
      <div className="bg-[#fffdfa]/95 backdrop-blur-md border-b-4 border-[#e3dcd3] shadow-[0_4px_12px_rgba(74,59,50,0.06)] px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Cute Ghibli Brand Logo */}
        <div id="navbar-brand-section" className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
          <div className="relative p-2.5 bg-[#faedd9] rounded-2xl border-2 border-[#e9bc9d] shadow-[0_4px_0_#e9bc9d] text-[#b45309] hover:scale-105 transition-all">
            <Cloud className="w-7 h-7 text-[#8fc1e3] fill-[#d4ebfc]" />
            <span className="absolute -bottom-1 -right-1 text-xs">🍃</span>
          </div>
          <div>
            <span className="text-2xl font-black text-[#5c4a3c] tracking-tight flex items-center gap-1">
              {config.siteName || 'Chibli Haven'}
              <span className="text-yellow-400 text-sm animate-pulse">★</span>
            </span>
            <p className="text-[10px] text-[#cca080] font-bold uppercase tracking-widest leading-none">
              Cozy APK Playground
            </p>
          </div>
        </div>

        {/* Categories Bar & Search Input Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Custom Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              id="global-search-input"
              placeholder="Search funny games or tools..."
              value={query}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#fdfbf7] text-[#5c4a3c] border-2 border-[#e3dcd3] focus:border-[#faad70] focus:shadow-[0_0_0_4px_#fbeee6] outline-none placeholder-[#c0b0a0] text-sm transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#cca080]" />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f5efe6] rounded-2xl border border-[#e3dcd3] max-w-full overflow-x-auto mini-scrollbar">
            {['All', ...(config.categories || ['Games', 'Apps', 'Tools', 'Editors Choice'])].map((cat) => (
              <button
                key={cat}
                id={`nav-${cat}`}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#84b06c] text-white shadow-[0_3px_0_#5d8349]'
                    : 'text-[#806c5a] hover:bg-[#fffdfa] hover:text-[#5c4a3c]'
                }`}
              >
                {cat === 'Editors Choice' ? '🏅 Editor’s Pick' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* User Account Controls */}
        <div id="navbar-user-actions" className="flex items-center gap-3.5">
          {user ? (
            <div className="flex items-center gap-2.5 bg-[#fbf9f4] border-2 border-[#e3dcd3] rounded-2xl py-1.5 px-3">
              {/* Profile Avatar with custom state */}
              <div className="w-8 h-8 rounded-full bg-[#fce8d5] border border-[#e9bc9d] flex items-center justify-center text-xs font-bold text-[#b45309] uppercase">
                {user.username.slice(0, 2)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-[#5c4a3c] truncate max-w-[110px]">
                  {user.username}
                </p>
                <p className="text-[9px] font-mono font-medium text-[#b45309] uppercase">
                  {user.isAdmin ? '👑 Arch-Commander' : '🍃 Traveler'}
                </p>
              </div>

              {user.isAdmin && (
                <button
                  id="navbar-admin-dash-btn"
                  onClick={onOpenAdmin}
                  className="p-1.5 bg-[#fff3e0] hover:bg-orange-100 text-orange-700 rounded-xl border border-orange-200 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="Secure Admin Station"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="hidden md:inline">Console</span>
                </button>
              )}

              <button
                id="navbar-logout-btn"
                onClick={onLogout}
                className="p-1 text-[#a08f80] hover:text-[#991b1b] transition-all cursor-pointer"
                title="Log out of shelter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="navbar-signup-btn"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black bg-[#fff3cd] text-[#854d0e] hover:bg-[#fef08a] rounded-2xl border-2 border-[#e9bc9d] shadow-[0_4px_0_#e9bc9d] hover:translate-y-[2px] hover:shadow-[0_2px_0_#e9bc9d] active:translate-y-[4px] active:shadow-none cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Join Chibli!</span>
              </button>
              <button
                id="navbar-login-btn"
                onClick={onOpenAuth}
                className="px-4 py-2.5 text-xs font-black text-[#5c4a3c] hover:bg-[#f5efe6] bg-transparent rounded-2xl border border-[#e3dcd3] cursor-pointer transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            </div>
          )}

          {/* Special trigger to instantly view Admin verification if they just want to jump straight to credentials */}
          <button
            id="instant-admin-shortcut-btn"
            onClick={onOpenAdmin}
            className="p-2 bg-[#f3eef4] hover:bg-[#eadeee] text-[#7c2d12] rounded-xl border border-[#d2cbd8] text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Fast track to 4-Step Verification"
          >
            <span>🔐 Admin Login</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
}
