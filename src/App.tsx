import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Database, ShieldAlert } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono">
      
      {/* Glitch Infrastructure */}
      <div className="scanlines" />
      <div className="static-noise" />
      
      {/* Jarring Color Accents (Magenta vs Cyan) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff] opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00ffff] opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }} />

      <header className="mb-12 text-center z-10">
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col items-center gap-2 mb-4"
        >
          <div className="flex items-center gap-4 text-3xl font-pixel uppercase tracking-tighter">
            <span className="text-[#ff00ff] glitch-text" data-text="VOID_">VOID_</span>
            <span className="text-[#00ffff] glitch-text" data-text="RUNNER">RUNNER</span>
          </div>
          <div className="h-0.5 w-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" />
        </motion.div>
        <p className="text-[10px] text-[#00ffff]/60 uppercase tracking-[0.2em] animate-pulse">
            [ACCESS_GRANTED] // SESSION_ID: 0xDEADBEEF
        </p>
      </header>

      <main className="flex flex-col xl:flex-row items-center justify-center gap-16 z-10 w-full max-w-7xl">
        
        {/* Left Peripheral: Machine Stats */}
        <div className="hidden xl:flex flex-col gap-8 w-72">
          <div className="terminal-box">
            <div className="flex items-center gap-2 text-[#ff00ff] mb-3 text-[10px] font-pixel">
              <Database size={14} />
              <span>CORE_DATA</span>
            </div>
            <div className="space-y-1 text-[9px] opacity-70">
                <p>Uptime: 00:04:21:09</p>
                <p>Buffers: 100%_SYNC</p>
                <p>Latent: NIL</p>
            </div>
          </div>
          
          <div className="terminal-box border-[#ff00ff] shadow-none">
              <div className="flex items-center gap-2 text-[#00ffff] mb-3 text-[10px] font-pixel">
                  <ShieldAlert size={14} />
                  <span>SECURITY</span>
              </div>
              <div className="text-[9px] text-[#ff00ff] animate-pulse">
                  &gt; THREAT_LEVEL: OMEGA
              </div>
          </div>

          <div className="flex flex-wrap gap-1 opacity-20">
              {[...Array(24)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-[#00ffff]" style={{ opacity: Math.random() }} />
              ))}
          </div>
        </div>

        {/* Core Process: Snake Module */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* Jarring UI Brackets */}
          <div className="absolute -top-6 -left-6 w-16 h-16 border-t-4 border-l-4 border-[#ff00ff]" />
          <div className="absolute -bottom-6 -right-6 w-16 h-16 border-b-4 border-r-4 border-[#00ffff]" />
          
          <SnakeGame />
        </motion.div>

        {/* Right Peripheral: Audio Frequency */}
        <div className="w-full max-w-[400px] xl:w-80 flex flex-col gap-10">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <MusicPlayer />
          </motion.div>

          <div className="terminal-box overflow-hidden">
              <div className="flex items-center gap-2 text-[#00ffff] mb-4 text-[10px] font-pixel">
                  <Terminal size={14} />
                  <span>PROCESS_LOG</span>
              </div>
              <div className="space-y-1 font-mono text-[8px] text-[#00ffff]/60 leading-tight">
                  <p>&gt; INITIALIZING_NEURAL_BUS...</p>
                  <p>&gt; MOUNTING_EXTERNAL_DRIVE_X:/</p>
                  <p className="text-[#ff00ff]">&gt; WARNING: BIT-ROT_DETECTED</p>
                  <p>&gt; BYPASSING_SECURITY_LAYER...</p>
                  <p className="text-white bg-[#00ffff] px-1 text-black font-bold">&gt; KERNEL_PANIC: RESOLVED</p>
                  <p>&gt; STREAMING_ENCRYPTED_PCM...</p>
              </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 text-[#00ffff]/20 text-[8px] font-pixel tracking-tighter z-10 flex flex-col items-center gap-4">
        <div className="flex gap-12">
            <span className="hover:text-[#ff00ff] hover:line-through cursor-wait transition-all">PROTOCOL_9</span>
            <span className="hover:text-[#ff00ff] hover:line-through cursor-wait transition-all">SHADOW_RECORDS</span>
            <span className="hover:text-[#ff00ff] hover:line-through cursor-wait transition-all">NULL_VOID</span>
        </div>
        <p className="opacity-50">BY_MACHINE_FOR_MACHINE // 2026</p>
      </footer>
    </div>
  );
}
