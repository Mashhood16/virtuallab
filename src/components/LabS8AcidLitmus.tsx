import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

const SOLUTIONS = [
  { id: 'lemon', name: 'Lemon Juice', type: 'acid' },
  { id: 'vinegar', name: 'Vinegar', type: 'acid' },
  { id: 'apple', name: 'Cut Apple', type: 'acid' },
];

export default function LabS8AcidLitmus({ onExit }: LabProps) {
  const [selected, setSelected] = useState(SOLUTIONS[0]);
  const [testedBlue, setTestedBlue] = useState<'idle'|'dipping'|'tested'>('idle');
  const [testedRed, setTestedRed] = useState<'idle'|'dipping'|'tested'>('idle');

  const reset = () => {
    setTestedBlue('idle');
    setTestedRed('idle');
  };

  const dipBlue = () => {
    setTestedBlue('dipping');
    setTimeout(() => setTestedBlue('tested'), 1000);
  };
  const dipRed = () => {
    setTestedRed('dipping');
    setTimeout(() => setTestedRed('tested'), 1000);
  };

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 dark:bg-slate-900 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 7.1: Effects of Acids on Litmus" subtitle="Test different materials with litmus paper" rightContent={<button onClick={reset} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-md font-medium hover:bg-slate-300 dark:bg-slate-800"><RefreshCw className="w-4 h-4" /> Reset</button>} />

      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 max-w-6xl mx-auto w-full">
        {/* Solution Select */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Select Material</h3>
          {SOLUTIONS.map(s => (
            <button 
              key={s.id}
              onClick={() => { setSelected(s); reset(); }}
              className={`p-3 text-left rounded-lg font-bold border-2 transition-colors ${selected.id === s.id ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 dark:border-slate-700 dark:border-slate-500 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm border p-6 flex flex-col items-center justify-center relative min-h-[400px]">
          
          <div className="relative w-64 h-64 flex flex-col items-center justify-center mb-8">
            {/* The Material Bowl/Object */}
            <div className="absolute bottom-4 w-40 h-20 bg-slate-200 dark:bg-slate-800 rounded-b-full border-t border-slate-300 dark:border-slate-700 dark:border-slate-500 shadow-inner flex items-end justify-center pb-2 z-10 overflow-hidden">
              <div className="w-full h-12 bg-amber-200/50 absolute bottom-0" />
            </div>

            {/* Litmus Papers (Draggable visually via buttons here) */}
            <div className="absolute top-0 flex gap-12 w-full justify-center">
              {/* Blue Litmus */}
              <div className={`w-8 h-32 bg-blue-300 border border-blue-400 rounded-sm shadow-md transition-all duration-700 ease-out ${testedBlue === 'dipping' ? 'translate-y-20' : ''} relative overflow-hidden`}>
                <div className={`absolute bottom-0 w-full h-1/2 transition-colors duration-1000 ${testedBlue !== 'idle' ? 'bg-red-400' : 'bg-blue-300'}`} />
                {testedBlue === 'tested' && <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[6px] font-bold text-red-800">RED</div>}
              </div>

              {/* Red Litmus */}
              <div className={`w-8 h-32 bg-red-400 border border-red-500 rounded-sm shadow-md transition-all duration-700 ease-out ${testedRed === 'dipping' ? 'translate-y-20' : ''} relative overflow-hidden`}>
                <div className={`absolute bottom-0 w-full h-1/2 transition-colors duration-1000 ${testedRed !== 'idle' ? 'bg-red-400' : 'bg-red-400'}`} />
                {testedRed === 'tested' && <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[6px] font-bold text-red-800">STAYS RED</div>}
              </div>
            </div>
          </div>

          <div className="flex gap-6 w-full max-w-sm">
            <button 
              onClick={dipBlue}
              disabled={testedBlue !== 'idle'}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50"
            >
              Dip Blue Litmus
            </button>
            <button 
              onClick={dipRed}
              disabled={testedRed !== 'idle'}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50"
            >
              Dip Red Litmus
            </button>
          </div>

          {(testedBlue === 'tested' || testedRed === 'tested') && (
            <div className="mt-8 px-6 py-4 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-xl max-w-md text-center animate-fade-in">
              <h3 className="font-bold text-lg mb-2">Observation</h3>
              {testedBlue === 'tested' && <p className="mb-1 text-red-600 font-medium">Blue Litmus turned RED.</p>}
              {testedRed === 'tested' && <p className="mb-1 text-red-600 font-medium">Red Litmus stayed RED.</p>}
              <p className="text-sm mt-2 text-slate-600 dark:text-slate-300">This indicates that <strong>{selected.name}</strong> contains an ACID.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
