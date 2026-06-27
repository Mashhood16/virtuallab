import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

const SOLUTIONS = [
  { id: 'hcl', name: 'HCl', type: 'Strong Acid', ph: 1, color: 'bg-red-500' },
  { id: 'lemon', name: 'Lemon Juice', type: 'Weak Acid', ph: 3, color: 'bg-orange-400' },
  { id: 'water', name: 'Distilled Water', type: 'Neutral', ph: 7, color: 'bg-green-500' },
  { id: 'sugar', name: 'Sugar Solution', type: 'Neutral', ph: 7, color: 'bg-green-500' },
  { id: 'soap', name: 'Soap Solution', type: 'Weak Base', ph: 9, color: 'bg-teal-400' },
  { id: 'naoh', name: 'NaOH', type: 'Strong Base', ph: 14, color: 'bg-purple-700' },
];

export default function LabS8DeterminingPH({ onExit }: LabProps) {
  const [selected, setSelected] = useState(SOLUTIONS[0]);
  const [isTested, setIsTested] = useState<'idle'|'dipping'|'tested'>('idle');

  const reset = () => setIsTested('idle');

  const dipPaper = () => {
    setIsTested('dipping');
    setTimeout(() => setIsTested('tested'), 1000);
  };

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 dark:bg-slate-900 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 7.4: Determining pH" subtitle="Test different solutions with universal pH paper" rightContent={<button onClick={reset} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-md font-medium hover:bg-slate-300 dark:bg-slate-700"><RefreshCw className="w-4 h-4" /> Reset</button>} />

      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 max-w-6xl mx-auto w-full">
        {/* Solution Select */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Select Solution</h3>
          {SOLUTIONS.map(s => (
            <button 
              key={s.id}
              onClick={() => { setSelected(s); reset(); }}
              className={`p-3 text-left rounded-lg font-bold border-2 transition-colors ${selected.id === s.id ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 dark:border-slate-700 dark:border-slate-500 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm border p-6 flex flex-col items-center relative min-h-[500px]">
          
          {/* pH Color Chart */}
          <div className="w-full max-w-lg mb-8 border border-slate-200 dark:border-slate-700 dark:border-slate-500 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-800 dark:bg-slate-800 text-white text-center py-1 text-xs font-bold uppercase tracking-wider">Universal pH Chart</div>
            <div className="flex h-12 w-full text-xs font-bold text-white text-center leading-[3rem]">
              <div className="flex-1 bg-[#ef4444]">1</div>
              <div className="flex-1 bg-[#f97316]">3</div>
              <div className="flex-1 bg-[#eab308]">5</div>
              <div className="flex-1 bg-[#22c55e]">7</div>
              <div className="flex-1 bg-[#14b8a6]">9</div>
              <div className="flex-1 bg-[#3b82f6]">11</div>
              <div className="flex-1 bg-[#7e22ce]">14</div>
            </div>
          </div>

          <div className="relative w-64 h-64 flex flex-col items-center justify-center mb-8">
            {/* Beaker */}
            <div className="absolute bottom-0 w-40 h-32 border-4 border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-b-3xl border-t-0 bg-slate-50 dark:bg-slate-900/50 shadow-inner z-10 flex flex-col justify-end overflow-hidden">
              <div className="w-full h-3/4 bg-slate-100 dark:bg-slate-800/80 relative backdrop-blur-sm" />
            </div>

            {/* pH Paper */}
            <div className={`absolute top-0 w-8 h-40 bg-[#fde047] border border-[#ca8a04] rounded-sm shadow-md transition-all duration-700 ease-out ${isTested === 'dipping' ? 'translate-y-20' : ''} relative overflow-hidden`}>
              <div className={`absolute bottom-0 w-full h-1/2 transition-colors duration-1000 ${isTested !== 'idle' ? selected.color : 'bg-[#fde047]'}`} />
              {isTested === 'tested' && <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[6px] font-bold text-white drop-shadow">pH {selected.ph}</div>}
            </div>
          </div>

          <div className="text-center mb-8">
            <button 
              onClick={dipPaper}
              disabled={isTested !== 'idle'}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 text-xl shadow-lg transition-transform active:scale-95"
            >
              Dip pH Paper
            </button>
          </div>

          {isTested === 'tested' && (
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 dark:border-slate-500 rounded-xl max-w-sm text-center animate-fade-in w-full">
              <h3 className="font-bold text-xl mb-1 text-slate-800 dark:text-slate-100">pH = {selected.ph}</h3>
              <p className="text-lg font-bold" style={{ color: `var(--tw-colors-${selected.color.split('-')[1]}-${selected.color.split('-')[2]})` }}>
                {selected.type.toUpperCase()}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
