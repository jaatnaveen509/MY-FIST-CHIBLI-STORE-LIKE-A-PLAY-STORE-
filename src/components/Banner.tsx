import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, Sparkles, Wand2 } from 'lucide-react';
import { Slide } from '../types';

interface BannerProps {
  slides: Slide[];
  onSelectApp: (appId: string) => void;
}

export default function Banner({ slides, onSelectApp }: BannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[current];

  return (
    <div id="cozy-hero-banner" className="relative vintage-slider bg-[#fffdfa] rounded-3xl overflow-hidden border-4 border-[#e3dcd3] shadow-[0_8px_0_#e3dcd3] transition-all p-3 max-w-6xl mx-auto my-6">
      <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-[#eef1e6]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col md:flex-row items-stretch"
          >
            {/* Background Image / Creative Sky Decor */}
            <div className="relative w-full md:w-3/5 h-1/2 md:h-full overflow-hidden">
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#fffdfa] via-[#fffdfa]/50 to-transparent pointer-events-none md:block hidden" />
              {/* Soft decorative clouds on over image */}
              <div className="absolute top-2 w-16 h-8 bg-white/70 rounded-full blur-[1px] opacity-60 animate-bounce" style={{ animationDuration: '6s' }} />
            </div>

            {/* Left Content Column */}
            <div className="relative w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-center bg-[#fffdfa]/95 text-left md:bg-transparent">
              {/* Badge */}
              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-[#faedd9] text-[#b45309] border border-[#f59e0b]/20">
                  <Wand2 className="w-3.5 h-3.5" />
                  {currentSlide.badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#4a3b32] tracking-tight leading-tight mb-2">
                {currentSlide.title}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#705e52] leading-relaxed mb-5 line-clamp-3">
                {currentSlide.description}
              </p>

              {/* Slider Button */}
              {currentSlide.appId ? (
                <button
                  id={`hero-slide-btn-${current}`}
                  onClick={() => currentSlide.appId && onSelectApp(currentSlide.appId)}
                  className="inline-flex items-center justify-center gap-2 mr-auto px-5 py-2.5 text-xs sm:text-sm font-bold bg-[#84b06c] hover:bg-[#6c9c54] text-white rounded-2xl border-b-4 border-[#5d8349] shadow-[0_4px_10px_rgba(132,176,108,0.25)] hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-yellow-200 fill-current" />
                  <span>{currentSlide.buttonText || 'Discover Now 🍂'}</span>
                </button>
              ) : (
                <span className="text-xs font-mono font-medium text-[#c08253] italic">
                  🌻 Global Announcement
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous Button */}
        <button
          id="hero-prev-btn"
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#fffdfa] hover:bg-[#faedd9] text-[#4a3b32] border-2 border-[#e3dcd3] hover:border-[#f5a16d] shadow-[0_4px_0_#e3dcd3] active:translate-y-[-14px] active:shadow-[0_1px_0_#e3dcd3] cursor-pointer transition-all snap-none z-10"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Next Button */}
        <button
          id="hero-next-btn"
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#fffdfa] hover:bg-[#faedd9] text-[#4a3b32] border-2 border-[#e3dcd3] hover:border-[#f5a16d] shadow-[0_4px_0_#e3dcd3] active:translate-y-[-14px] active:shadow-[0_1px_0_#e3dcd3] cursor-pointer transition-all snap-none z-10"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div id="slide-dots-panel" className="flex justify-center items-center gap-1.5 mt-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              id={`slide-dot-${idx}`}
              onClick={() => setCurrent(idx)}
              className={`h-2.5 rounded-full cursor-pointer transition-all ${
                idx === current ? 'w-6 bg-[#f59e0b]' : 'w-2.5 bg-[#e3dcd3] hover:bg-[#c0b4a6]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
