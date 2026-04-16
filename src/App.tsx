import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu, Database, Wifi } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-black text-cyan font-pixel relative overflow-hidden flex flex-col items-center p-4 md:p-12">
      {/* CRT & Noise Overlays */}
      <div className="crt-overlay" />
      <div className="scanline" />
      <div className="static-noise" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 mb-12 text-center w-full max-w-4xl border-b-2 border-cyan/30 pb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs opacity-50">
            <Terminal size={14} />
            <span>TERMINAL_ID: 0x7F_GLITCH</span>
          </div>
          <div className="flex items-center gap-2 text-xs opacity-50">
            <Wifi size={14} className="animate-pulse" />
            <span>UPLINK_STABLE</span>
          </div>
        </div>
        
        <h1 
          className="text-6xl md:text-8xl font-black tracking-tighter glitch-text mb-2"
          data-text="NEON_VOID"
        >
          NEON_VOID
        </h1>
        
        <div className="flex justify-center gap-8 mt-4">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-magenta">
            <Cpu size={12} />
            <span>CORE_SYNC: ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-cyan">
            <Database size={12} />
            <span>DATA_STREAM: ENCRYPTED</span>
          </div>
        </div>
      </motion.header>

      {/* Main Content Grid */}
      <main className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: System Logs */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
          <div className="border-2 border-cyan p-4 bg-black/80 relative">
            <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] text-magenta">SYSTEM_LOGS</div>
            <div className="space-y-2 font-mono text-[9px] leading-tight opacity-70">
              <p className="text-magenta">[00:01:23] INITIALIZING_GRID...</p>
              <p>[00:01:24] LOADING_NEURAL_SNAKE_V4.2</p>
              <p>[00:01:25] AUDIO_BUFFER_READY</p>
              <p className="text-magenta">[00:01:26] WARNING: MEMORY_LEAK_DETECTED</p>
              <p>[00:01:27] BYPASSING_SECURITY_PROTOCOLS</p>
              <p>[00:01:28] CONNECTION_ESTABLISHED</p>
              <p className="animate-pulse">_</p>
            </div>
          </div>

          <div className="border-2 border-magenta p-4 bg-black/80 relative">
            <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] text-cyan">ENCRYPTED_DATA</div>
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="h-4 bg-cyan/20 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Center: Snake Game */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="relative p-2 border-2 border-cyan bg-black/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-magenta" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-magenta" />
            <SnakeGame />
          </div>
        </motion.div>

        {/* Right: Music Player */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 flex justify-center lg:justify-end"
        >
          <div className="relative p-2 border-2 border-magenta bg-black/50 shadow-[0_0_20px_rgba(255,0,255,0.2)]">
            <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-cyan" />
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-cyan" />
            <MusicPlayer />
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-12 relative z-10 w-full flex justify-between items-end opacity-30 text-[10px] tracking-widest">
        <div>(C) 1984_VOID_CORP</div>
        <div className="text-right">UNAUTHORIZED_ACCESS_IS_PUNISHABLE_BY_DEATH</div>
      </footer>
    </div>
  );
}
