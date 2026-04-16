import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "NEON_DREAMS",
    artist: "CYBER_SYNTH_AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/300/300"
  },
  {
    id: 2,
    title: "MIDNIGHT_GRID",
    artist: "RETRO_WAVE_BOT",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/300/300"
  },
  {
    id: 3,
    title: "DIGITAL_RAIN",
    artist: "LOFI_ALGORITHM",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/300/300"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => skipForward();
  const skipForward = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const skipBack = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-full max-w-md bg-black border-2 border-magenta p-6 flex flex-col gap-6 shadow-[8px_8px_0_#00ffff]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-4 border-b border-magenta/30 pb-4">
        <div className="relative w-20 h-20 flex-shrink-0 border border-cyan">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-full h-full p-1"
          >
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale contrast-150"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <div className="flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h3
              key={currentTrack.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-2xl font-black text-white truncate glitch-text"
              data-text={currentTrack.title}
            >
              {currentTrack.title}
            </motion.h3>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTrack.artist}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="text-xs text-cyan tracking-[0.2em]"
            >
              {currentTrack.artist}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-4 w-full bg-cyan/10 border border-cyan/30 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-magenta"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white mix-blend-difference">
            STREAMING_BUFFER_DATA... {Math.round(progress)}%
          </div>
        </div>
        <div className="flex justify-between text-[8px] text-cyan/40 tracking-widest">
          <span>00:00:00</span>
          <span>LIVE_FEED</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <button
          onClick={skipBack}
          className="p-2 text-cyan hover:text-magenta transition-colors"
        >
          <SkipBack size={24} fill="currentColor" />
        </button>
        
        <button
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center bg-magenta text-white hover:bg-cyan hover:text-black transition-all border-b-4 border-r-4 border-cyan active:translate-y-1 active:translate-x-1 active:border-none"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
        </button>

        <button
          onClick={skipForward}
          className="p-2 text-cyan hover:text-magenta transition-colors"
        >
          <SkipForward size={24} fill="currentColor" />
        </button>
      </div>

      <div className="flex items-center gap-3 px-2">
        <Volume2 size={14} className="text-cyan/40" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-cyan/20 appearance-none cursor-pointer accent-magenta"
        />
      </div>

      <div className="pt-4 border-t border-magenta/20">
        <div className="flex items-center gap-2 text-[10px] text-magenta/60 tracking-widest mb-3">
          <Music size={12} />
          <span>PLAYLIST_INDEX</span>
        </div>
        <div className="space-y-1">
          {TRACKS.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
              className={`w-full flex items-center justify-between p-2 transition-all text-left ${
                currentTrackIndex === idx 
                  ? 'bg-magenta text-white' 
                  : 'hover:bg-cyan/10 text-cyan/60'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-[8px] opacity-50">[{idx.toString().padStart(2, '0')}]</span>
                <span className="truncate text-xs font-bold tracking-tight">{track.title}</span>
              </div>
              {currentTrackIndex === idx && isPlaying && (
                <div className="flex gap-0.5 items-end h-3">
                  <div className="w-0.5 bg-white animate-pulse" style={{ height: '100%' }} />
                  <div className="w-0.5 bg-white animate-pulse" style={{ height: '60%', animationDelay: '0.2s' }} />
                  <div className="w-0.5 bg-white animate-pulse" style={{ height: '80%', animationDelay: '0.4s' }} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
