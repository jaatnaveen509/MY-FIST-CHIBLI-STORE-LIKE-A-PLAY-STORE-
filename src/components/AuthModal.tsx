import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, AlertCircle, Heart, Mail, ShieldAlert, Key } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (!username.trim()) {
      setError('A true forest spirit needs a cozy name!');
      setLoading(false);
      return;
    }

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? { username, email } : { username };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'The wind blowing tells of an authentication block.');
      }

      setSuccessMsg(data.message || 'Success under sunny skies!');
      
      setTimeout(() => {
        onLoginSuccess(data.user);
        onClose();
      }, 1200);

    } catch (err: any) {
      setError(err.message || 'Validation failed. Soot sprites are scattered!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#fffdfa] border-4 border-[#e9bc9d] rounded-3xl p-6 sm:p-8 shadow-[0_12px_0_#e9bc9d] overflow-hidden"
      >
        {/* Soft whimsical background designs */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#fed7aa] opacity-40 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#bfdbfe] opacity-30 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 relative">
          <div className="flex items-center gap-1">
            <Heart className="w-5 h-5 text-red-400 fill-current animate-pulse" />
            <span className="text-sm font-black uppercase text-[#9e7655] tracking-widest font-mono">
              {isRegister ? 'New Spirit Signup' : 'Return to Shelter'}
            </span>
          </div>
          <button
            id="auth-close-btn"
            onClick={onClose}
            className="p-1 text-[#cca080] hover:text-[#5c4a3c] hover:bg-[#faedd9]/60 rounded-full transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Brand visual heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#5c4a3c] tracking-tight leading-none flex items-center justify-center gap-1.5">
            <span>{isRegister ? 'Adopt a Cozy Alias' : 'Step Inside Haven'}</span>
            <Sparkles className="w-5 h-5 text-amber-400 fill-current" />
          </h2>
          <p className="text-xs text-[#a38c75] mt-1.5 font-medium">
            {isRegister 
              ? 'Join our circle to rate magic APK files and track your download history!'
              : 'Enter your custom name. Missing name? We will instantly create one! 🌱'
            }
          </p>
        </div>

        {/* Error / Success boxes */}
        {error && (
          <div className="mb-4 p-3 bg-[#fef2f2] border border-red-200 text-red-800 rounded-2xl text-xs font-semibold flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] rounded-2xl text-xs font-semibold flex items-start gap-2">
            <Sparkles className="w-4.5 h-4.5 text-green-500 shrink-0 animate-ping" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Core Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <div>
            <label className="block text-xs font-black uppercase text-[#806c5a] tracking-widest mb-1.5 ml-1">
              Forest Name / Email Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="auth-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="SpriteFan, TotoroBud, or administration details"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#fdfbf8] text-[#5c4a3c] border-2 border-[#e3dcd4] focus:border-[#e9bc9d] outline-none text-sm transition-all font-medium"
                required
              />
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#cca080]" />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-black uppercase text-[#806c5a] tracking-widest mb-1.5 ml-1">
                Magical Mail Coordinates
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="auth-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@forest.net (Optional)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#fdfbf8] text-[#5c4a3c] border-2 border-[#e3dcd4] focus:border-[#e9bc9d] outline-none text-sm transition-all font-medium"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#cca080]" />
              </div>
            </div>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#e9bc9d] hover:bg-[#dec2af] text-[#5c3e34] font-black rounded-2xl border-b-4 border-[#ca8a61] text-xs uppercase tracking-wider transition-all hover:translate-y-[1px] hover:border-b-2 active:translate-y-[3px] active:border-b-0 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>{isRegister ? 'Unleash Magic Spell' : 'Step In Doorway'}</span>
                <Sparkles className="w-4 h-4 text-white fill-current" />
              </>
            )}
          </button>
        </form>

        {/* Toggle registered status helper bar */}
        <div className="mt-6 pt-4 border-t border-[#e3dcd4] text-center">
          <p className="text-xs text-[#a38c75] font-semibold">
            {isRegister ? 'Already visited us under the clouds?' : 'New traveler seeking refuge?'}
          </p>
          <button
            id="auth-toggle-btn"
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccessMsg('');
            }}
            className="mt-2 text-xs font-black text-[#b45309] hover:text-[#9a3412] underline cursor-pointer transition-all"
          >
            {isRegister ? '← Switch to Quick Login' : 'Register a fresh Cozy Account →'}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
