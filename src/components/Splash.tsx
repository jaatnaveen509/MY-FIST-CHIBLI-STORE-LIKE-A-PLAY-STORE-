import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CloudSun, Star } from 'lucide-react';

interface SplashProps {
  onDismiss: () => void;
}

export default function Splash({ onDismiss }: SplashProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDismiss, 600); // Allow exit transitions to finish
    }, 2800);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="cozy-splash-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -80, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#e3f2fd] via-[#fdfbf7] to-[#fff3e0] text-[#5c4a3c] overflow-hidden"
        >
          {/* Animated cute clouds flying around */}
          <motion.div
            animate={{ x: [-100, 100, -100] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className="absolute top-12 left-10 opacity-30 pointer-events-none"
          >
            <CloudSun className="w-24 h-24 text-white" />
          </motion.div>

          <motion.div
            animate={{ x: [150, -150, 150] }}
            transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
            className="absolute bottom-24 right-12 opacity-25 pointer-events-none"
          >
            <CloudSun className="w-32 h-32 text-orange-200" />
          </motion.div>

          {/* Gentle hill design in the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#bde0fe] opacity-20 rounded-t-[50%] transform scale-x-125" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#e2f0d9] opacity-40 rounded-t-[40%] transform scale-x-110" />

          {/* Center Content Box */}
          <div className="relative text-center px-6 max-w-lg">
            <motion.div
              initial={{ scale: 0.4, rotate: -15, y: 50 }}
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0], y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
              className="inline-block p-5 bg-[#fffdf9] rounded-full border-4 border-[#e9bc9d] shadow-[0_8px_0_#e9bc9d] mb-6"
            >
              <div className="relative">
                <CloudSun className="w-16 h-16 text-[#f59e0b] filter drop-shadow-md" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-2 -right-2 text-yellow-400"
                >
                  <Sparkles className="w-6 h-6 fill-current" />
                </motion.div>
                <div className="absolute -bottom-2 -left-2 text-[#ffd166]">
                  <Star className="w-5 h-5 fill-current text-amber-400" />
                </div>
              </div>
            </motion.div>

            {/* Whimsical Text */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-[#5c4a3c] drop-shadow-sm font-sans"
            >
              Chibli App Haven
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-3 text-sm md:text-base text-[#806c5a] font-medium tracking-wide flex items-center justify-center gap-2"
            >
              <span>🌱 Handcrafted games & utilities</span>
              <span className="text-amber-500 font-bold">★</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-8 flex flex-col items-center gap-2"
            >
              <span className="text-xs text-[#a08f80] uppercase tracking-widest animate-pulse font-mono">
                summoning soot sprites...
              </span>
              <div className="w-36 h-2 bg-[#e9bc9d]/30 rounded-full overflow-hidden border border-[#e9bc9d]/50">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.2, ease: 'easeOut' }}
                  className="h-full bg-[#83b06c]"
                />
              </div>

              {/* Instant Join button to skip wait */}
              <button
                id="skip-splash-btn"
                onClick={() => {
                  setShow(false);
                  setTimeout(onDismiss, 600);
                }}
                className="mt-4 px-4 py-1.5 text-xs text-[#83b06c] hover:text-[#527d3b] hover:bg-[#83b06c]/10 rounded-full border border-[#83b06c]/40 font-semibold cursor-pointer transition-all active:scale-95"
              >
                Skip Magic Entrance 🍃
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
