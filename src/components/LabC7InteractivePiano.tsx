import { useState } from 'react';
import { Music } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7InteractivePiano({ onExit }: LabProps) {
  const [activeKey, setActiveKey] = useState<number | null>(null);

  const keys = [
    { id: 1, note: 'C', freq: 261.63 },
    { id: 2, note: 'D', freq: 293.66 },
    { id: 3, note: 'E', freq: 329.63 },
    { id: 4, note: 'F', freq: 349.23 },
    { id: 5, note: 'G', freq: 392.00 },
    { id: 6, note: 'A', freq: 440.00 },
    { id: 7, note: 'B', freq: 493.88 },
    { id: 8, note: 'C5', freq: 523.25 }
  ];

  const playNote = (keyId: number, freq: number) => {
    setActiveKey(keyId);
    
    // Create simple web audio api beep
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1);
    } catch (e) {
      console.warn("AudioContext not supported or blocked");
    }

    setTimeout(() => {
      setActiveKey(null);
    }, 200);
  };

  return (
    <div className="flex h-screen font-sans bg-slate-900 text-slate-100">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto items-center">
        <LabHeader onExit={onExit} title="Interactive Piano" />

        <h1 className="text-3xl font-bold mb-2 text-white">Interactive Piano</h1>
        <p className="text-slate-400 mb-12">Click the keys to trigger different sounds, simulating a programmed Scratch digital piano.</p>

        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-4xl w-full">
          
          <div className="flex justify-center mb-8">
            <div className="bg-slate-900 px-6 py-3 rounded-full border border-slate-700 flex items-center text-emerald-400 font-mono shadow-inner">
              <Music className="w-5 h-5 mr-3" />
              {activeKey ? `PLAYING NOTE: ${keys.find(k=>k.id===activeKey)?.note}` : 'READY TO PLAY'}
            </div>
          </div>

          <div className="flex justify-center h-64 bg-slate-900 p-4 rounded-xl shadow-inner border border-slate-700 relative">
            {keys.map((key) => (
              <div 
                key={key.id}
                onMouseDown={() => playNote(key.id, key.freq)}
                className={`
                  w-16 mx-1 border-2 border-b-8 rounded-b-lg cursor-pointer transition-all flex items-end justify-center pb-4
                  ${activeKey === key.id 
                    ? 'bg-slate-200 border-slate-400 border-b-4 translate-y-2' 
                    : 'bg-slate-50 border-slate-300 shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:bg-slate-50'
                  }
                `}
              >
                <span className="font-bold text-slate-800 text-xl pointer-events-none">{key.note}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-slate-500 text-sm font-medium">
            Programming Concept: Event Listeners (When Sprite Clicked -{'>'} Play Sound)
          </div>
        </div>

      </div>
    </div>
  );
}
