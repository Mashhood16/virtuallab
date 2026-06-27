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
    <div className="flex flex-col h-screen font-sans text-slate-100" style={{backgroundColor: '#0f172a'}}>
      <LabHeader onExit={onExit} title="Interactive Piano" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto items-center">

        <p className="text-slate-400 mb-12">Click the keys to trigger different sounds, simulating a programmed Scratch digital piano.</p>

        <div className="p-8 rounded-2xl shadow-2xl max-w-4xl w-full" style={{backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: '1px', borderStyle: 'solid'}}>
          
          <div className="flex justify-center mb-8">
            <div className="bg-slate-900 dark:bg-slate-800 px-6 py-3 rounded-full border border-slate-700 dark:border-slate-500 flex items-center text-emerald-400 font-mono shadow-inner">
              <Music className="w-5 h-5 mr-3" />
              {activeKey ? `PLAYING NOTE: ${keys.find(k=>k.id===activeKey)?.note}` : 'READY TO PLAY'}
            </div>
          </div>

          <div className="flex justify-center h-64 bg-slate-900 dark:bg-slate-800 p-4 rounded-xl shadow-inner border border-slate-700 dark:border-slate-500 relative">
            {keys.map((key) => (
              <div 
                key={key.id}
                onMouseDown={() => playNote(key.id, key.freq)}
                className={`
                  w-16 mx-1 border-2 border-b-8 rounded-b-lg cursor-pointer transition-all flex items-end justify-center pb-4
                  ${activeKey === key.id 
                    ? 'bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-500 border-b-4 translate-y-2' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 dark:border-slate-500 shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:bg-slate-50 dark:bg-slate-900'
                  }
                `}
              >
                <span className="font-bold text-slate-800 dark:text-slate-100 text-xl pointer-events-none">{key.note}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
            Programming Concept: Event Listeners (When Sprite Clicked -{'>'} Play Sound)
          </div>
        </div>

      </div>
    </div>
  );
}
