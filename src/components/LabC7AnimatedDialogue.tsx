import { useState } from 'react';
import { Play, Image as ImageIcon } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7AnimatedDialogue({ onExit }: LabProps) {
  const [bgSet, setBgSet] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [, setStep] = useState(-1);
  const [chatLog, setChatLog] = useState<{sprite: number, text: string}[]>([]);

  const runAnimation = () => {
    if (playing || !bgSet) return;
    setPlaying(true);
    setChatLog([]);
    setStep(0);

    const timeline = [
      { t: 0, s: 1, txt: "Hello!" },
      { t: 2000, s: 2, txt: "Hi there!" },
      { t: 4000, s: 1, txt: "Nice weather today." },
      { t: 6000, s: 2, txt: "Yes, perfect for coding!" },
      { t: 8000, s: 0, txt: "DONE" }
    ];

    timeline.forEach(event => {
      setTimeout(() => {
        if (event.s === 0) {
          setPlaying(false);
        } else {
          setStep(event.t);
          setChatLog([{sprite: event.s, text: event.txt}]);
        }
      }, event.t);
    });
  };

  const currentMsg = chatLog[0];

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Animated Dialogue" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">

        <p className="text-slate-600 dark:text-slate-300 mb-8">Set the stage background and run the dialogue script between two sprites.</p>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-6 flex gap-8 max-w-5xl mx-auto w-full">
          
          {/* Controls */}
          <div className="w-64 flex flex-col gap-6 border-r border-slate-200 dark:border-slate-700 dark:border-slate-500 pr-8">
            <div>
              <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-2 text-sm uppercase tracking-wider">Background</h2>
              <button 
                onClick={() => setBgSet(true)}
                className={`w-full py-3 px-4 rounded-lg font-bold border-2 flex items-center justify-center transition-colors ${bgSet ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:border-slate-500'}`}
              >
                <ImageIcon className="w-4 h-4 mr-2" /> {bgSet ? 'Park Set' : 'Set Background'}
              </button>
            </div>

            <div className="flex-1">
              <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-2 text-sm uppercase tracking-wider">Script Outline</h2>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500 text-sm font-mono text-slate-600 dark:text-slate-300 space-y-2">
                <p className="text-purple-600 font-bold">Sprite 1:</p>
                <p className="ml-4 bg-blue-100 text-blue-800 p-1 rounded inline-block">say "Hello!" for 2 secs</p>
                
                <p className="text-orange-600 font-bold mt-2">Sprite 2:</p>
                <p className="ml-4 bg-orange-100 text-orange-800 p-1 rounded inline-block">wait 2 secs</p>
                <p className="ml-4 bg-blue-100 text-blue-800 p-1 rounded inline-block">say "Hi there!" for 2 secs</p>
              </div>
            </div>

            <button 
              onClick={runAnimation}
              disabled={!bgSet || playing}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
            >
              <Play className="w-5 h-5 mr-2 fill-current" /> Play Scene
            </button>
          </div>

          {/* Stage */}
          <div className="flex-1">
            <div className={`w-full aspect-video rounded-xl border-4 overflow-hidden relative ${bgSet ? 'border-blue-300' : 'border-slate-200 dark:border-slate-700 dark:border-slate-500 bg-slate-100 dark:bg-slate-800'}`}>
              
              {/* Background Image */}
              {bgSet && (
                <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=1000" alt="Park" className="absolute inset-0 w-full h-full object-cover" />
              )}

              {/* Sprite 1 */}
              <div className="absolute bottom-12 left-20 flex flex-col items-center">
                {currentMsg?.sprite === 1 && (
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl rounded-bl-none shadow-lg mb-2 max-w-[200px] border-2 border-blue-200 animate-in fade-in slide-in-from-bottom-2">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{currentMsg.text}</p>
                  </div>
                )}
                <div className="w-24 h-32 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg border-4 border-white">1</div>
              </div>

              {/* Sprite 2 */}
              <div className="absolute bottom-12 right-20 flex flex-col items-center">
                {currentMsg?.sprite === 2 && (
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl rounded-br-none shadow-lg mb-2 max-w-[200px] border-2 border-orange-200 animate-in fade-in slide-in-from-bottom-2">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{currentMsg.text}</p>
                  </div>
                )}
                <div className="w-24 h-32 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg border-4 border-white">2</div>
              </div>

              {!bgSet && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-slate-400 font-bold text-xl uppercase tracking-widest bg-slate-50 dark:bg-slate-900/80 px-6 py-2 rounded-lg">Select Background First</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
