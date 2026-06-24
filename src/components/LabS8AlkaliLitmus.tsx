import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8AlkaliLitmus({ onExit }: LabProps) {
  const [testedBlue, setTestedBlue] = useState(false);
  const [testedRed, setTestedRed] = useState(false);

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 7.2: Effects of Alkalies on Litmus" subtitle="Test Sodium Hydroxide with litmus paper" />

      <div className="flex-1 flex flex-col p-6 gap-6 max-w-4xl mx-auto w-full items-center justify-center">
        
        <div className="bg-slate-50 rounded-2xl shadow-sm border p-8 flex flex-col items-center justify-center relative min-h-[450px] w-full">
          
          <h2 className="text-xl font-bold mb-8 text-slate-700">Aqueous Sodium Hydroxide (NaOH)</h2>

          <div className="relative w-64 h-64 flex flex-col items-center justify-center mb-8">
            {/* The Beaker */}
            <div className="absolute bottom-0 w-48 h-32 border-4 border-slate-300 rounded-b-3xl border-t-0 bg-slate-50/50 shadow-inner z-10 flex flex-col justify-end overflow-hidden">
              <div className="w-full h-3/4 bg-blue-50/50 relative">
                 <div className="absolute bottom-2 left-10 w-2 h-2 bg-slate-50 rounded-sm" />
                 <div className="absolute bottom-3 right-12 w-2 h-2 bg-slate-50 rounded-sm" />
              </div>
            </div>

            {/* Litmus Papers */}
            <div className="absolute top-0 flex gap-12 w-full justify-center">
              {/* Blue Litmus */}
              <div className={`w-8 h-32 bg-blue-300 border border-blue-400 rounded-sm shadow-md transition-transform duration-1000 ${testedBlue ? 'translate-y-24' : ''} relative overflow-hidden`}>
                <div className={`absolute bottom-0 w-full h-1/2 transition-colors duration-1000 ${testedBlue ? 'bg-blue-300' : 'bg-blue-300'}`} />
              </div>

              {/* Red Litmus */}
              <div className={`w-8 h-32 bg-red-400 border border-red-500 rounded-sm shadow-md transition-transform duration-1000 ${testedRed ? 'translate-y-24' : ''} relative overflow-hidden`}>
                <div className={`absolute bottom-0 w-full h-1/2 transition-colors duration-1000 ${testedRed ? 'bg-blue-300' : 'bg-red-400'}`} />
              </div>
            </div>
          </div>

          <div className="flex gap-6 w-full max-w-sm">
            <button 
              onClick={() => setTestedBlue(true)}
              disabled={testedBlue}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50"
            >
              Dip Blue Litmus
            </button>
            <button 
              onClick={() => setTestedRed(true)}
              disabled={testedRed}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50"
            >
              Dip Red Litmus
            </button>
          </div>

          {(testedBlue || testedRed) && (
            <div className="mt-8 px-6 py-4 bg-slate-100 border border-slate-300 rounded-xl max-w-md text-center animate-fade-in">
              <h3 className="font-bold text-lg mb-2">Observation</h3>
              {testedBlue && <p className="mb-1 text-blue-600 font-medium">Blue Litmus stayed BLUE.</p>}
              {testedRed && <p className="mb-1 text-blue-600 font-medium">Red Litmus turned BLUE.</p>}
              <p className="text-sm mt-2 text-slate-600">This indicates that <strong>Sodium Hydroxide</strong> is an ALKALI (Base).</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
