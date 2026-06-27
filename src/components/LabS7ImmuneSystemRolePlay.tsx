import { useState } from 'react';
import { Bug } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7ImmuneSystemRolePlay({ onExit }: LabProps) {
  const [phase, setPhase] = useState(0); // 0: start, 1: breach, 2: T-cells, 3: B-cells

  const advance = () => {
    setPhase(p => Math.min(3, p + 1));
  };

  const reset = () => {
    setPhase(0);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-purple-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Unit 3: Immune System Role Play" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-purple-100 max-w-3xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">The Body's Defense Army</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">Step through this simulation to see how the skin, T-Cells, and B-Cells act as the lines of defense against invading pathogens (germs).</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={advance}
              disabled={phase === 3}
              className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
            >
              {phase === 0 ? 'Cause a Cut (Skin Breach)' : phase === 1 ? 'Deploy T-Cells' : phase === 2 ? 'Deploy B-Cells (Antibodies)' : 'Body Defended!'}
            </button>
            <button 
              onClick={reset}
              className="flex items-center px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:bg-slate-800 font-medium"
            >
              Reset Simulation
            </button>
          </div>
        </div>

        {/* Play Area */}
        <div className="relative w-full max-w-4xl h-[500px] bg-red-100 dark:bg-red-950/20 rounded-3xl overflow-hidden shadow-inner border-4 border-red-200 dark:border-red-900/50 flex">
          
          {/* Outside (Pathogens) */}
          <div className="w-1/4 bg-slate-800 dark:bg-slate-800 h-full p-4 flex flex-col items-center justify-center relative">
            <h3 className="text-white font-bold mb-4 z-10 text-center">Outside World<br/>(Pathogens)</h3>
            
            {/* Pathogens */}
            {phase === 0 && (
              <div className="flex gap-2 flex-wrap justify-center mt-8">
                <Bug className="text-green-400 w-8 h-8 animate-bounce" />
                <Bug className="text-green-500 w-8 h-8 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <Bug className="text-green-400 w-8 h-8 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
          </div>

          {/* Skin Barrier */}
          <div className={`w-8 h-full transition-colors duration-500 flex flex-col relative z-20 ${phase === 0 ? 'bg-orange-300' : 'bg-red-500'}`}>
            <div className="absolute inset-0 flex items-center justify-center -rotate-90 text-sm font-bold text-orange-900 tracking-widest whitespace-nowrap">
              {phase === 0 ? 'INTACT SKIN (1ST LINE)' : 'WOUND / CUT'}
            </div>
            {/* The Cut */}
            {phase > 0 && <div className="absolute top-1/2 -mt-16 left-0 right-0 h-32 bg-red-900/50 backdrop-blur-sm border-t border-b border-red-900 animate-pulse"></div>}
          </div>

          {/* Inside Body (Bloodstream) */}
          <div className="flex-1 bg-red-50 dark:bg-red-900/20 relative p-8">
            <h3 className="font-bold text-red-900/50 dark:text-red-100/50 text-2xl absolute top-8 right-8">Inside the Body</h3>

            {/* Pathogens entering */}
            {phase >= 1 && (
              <div className={`absolute transition-all duration-1000 ${phase === 1 ? 'top-1/2 left-20' : phase === 2 ? 'top-1/3 left-40' : 'top-1/2 left-60 opacity-20'}`}>
                <div className="flex gap-4">
                  <Bug className="text-green-600 w-12 h-12 animate-pulse" />
                  <Bug className="text-green-600 w-12 h-12 animate-pulse" />
                </div>
                {phase === 1 && <div className="text-xs font-bold text-red-600 mt-2 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded shadow">Pathogens invading!</div>}
              </div>
            )}

            {/* T-Cells (Second Line) */}
            {phase >= 2 && (
              <div className={`absolute transition-all duration-1000 ${phase === 2 ? 'top-1/3 left-60' : 'top-1/4 left-80'}`}>
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-blue-400 animate-bounce">
                  T
                </div>
                {phase === 2 && (
                  <div className="absolute -top-12 left-1/2 -ml-24 w-48 text-xs font-bold text-blue-800 bg-blue-100 px-3 py-2 rounded-lg shadow-md border border-blue-300">
                    "I am the T-Cell! I destroy infected cells and signal the B-Cells!"
                  </div>
                )}
              </div>
            )}

            {/* B-Cells (Third Line / Antibodies) */}
            {phase >= 3 && (
              <div className="absolute top-2/3 left-1/2 transition-all duration-1000">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-[50%_20%_50%_20%] flex items-center justify-center text-white shadow-lg border-4 border-purple-400">
                    B
                  </div>
                  {/* Antibodies shooting out */}
                  <div className="flex gap-2">
                    <span className="text-purple-600 font-bold text-2xl animate-[ping_1s_ease-out_infinite]">Y</span>
                    <span className="text-purple-600 font-bold text-2xl animate-[ping_1s_ease-out_infinite_0.3s]">Y</span>
                  </div>
                </div>
                <div className="absolute -top-16 left-0 w-64 text-xs font-bold text-purple-800 bg-purple-100 px-3 py-2 rounded-lg shadow-md border border-purple-300">
                  "I am the B-Cell! I create specific 'Y' shaped antibodies to neutralize the pathogens and remember them for next time!"
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
