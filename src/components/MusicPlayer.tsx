import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS, Track } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipTrack = (direction: 'next' | 'prev') => {
    setIsPlaying(false);
    if (direction === 'next') {
      setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    }
    // Small delay to ensure audio src is updated
    setTimeout(() => setIsPlaying(true), 50);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const onEnded = () => skipTrack('next');

  return (
    <div className="w-full max-w-[400px] terminal-box relative overflow-hidden group">
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
      />

      <div className="flex items-center gap-4 relative z-10">
        <div className="relative w-20 h-20 shrink-0">
          <motion.div
            animate={{ 
              x: isPlaying ? [0, -2, 2, 0] : 0,
              filter: isPlaying ? ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)'] : 'grayscale(100%)'
            }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="w-full h-full border-2 border-[#ff00ff] overflow-hidden"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover grayscale opacity-70"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          <motion.h3 
            key={currentTrack.title}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-sm font-pixel truncate text-[#00ffff] glitch-text"
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </motion.h3>
          <p className="text-[9px] text-[#ff00ff] truncate font-mono mt-1">
            ORIGIN: {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar - Brutalist style */}
      <div className="mt-6 mb-4">
        <div className="w-full h-4 bg-[#00ffff]/20 border border-[#00ffff] relative">
          <motion.div 
            className="h-full bg-[#00ffff]"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'tween', ease: 'linear' }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-pixel text-black mix-blend-difference">
            {Math.floor(progress)}%_LOADED
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => skipTrack('prev')}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-[#00ffff] text-black hover:bg-[#ff00ff] transition-colors"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>

          <button 
            onClick={() => skipTrack('next')}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        {/* Binary Style Visualizer */}
        <div className="flex items-end gap-1 h-6 font-mono text-[8px] text-[#00ffff]">
          {isPlaying ? (
            <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.1, repeat: Infinity }}
            >
                10110...
            </motion.div>
          ) : (
            <div>00000</div>
          )}
        </div>
      </div>
    </div>
  );
}
