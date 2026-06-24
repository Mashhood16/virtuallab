import { useState } from 'react';
import { Flame, Wind } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS6Separation({ onExit }: LabProps) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const getContainerContent = () => {
    if (step === 0) return 'Sand & Salt mixture';
    if (step === 1) return 'Dissolving in Water (Sand settles)';
    if (step === 2) return 'Filtration (Sand in filter, salt water below)';
    if (step === 3) return 'Evaporation (Salt crystals remain)';
  };

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-sky-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 7: Separation of Mixtures" />

      <div className="flex-1 flex p-8 items-center justify-center gap-16">
        
        <div className="w-96 bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-sky-800">Experiment Steps</h2>
          
          <div className="space-y-4 relative">
            {/* Progress line */}
            <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-slate-200 z-0"></div>

            <button 
              onClick={nextStep} disabled={step !== 0}
              className={`w-full p-4 rounded-xl text-left border-2 flex items-center gap-4 transition-colors relative z-10 bg-slate-50 ${step === 0 ? 'border-sky-500 shadow-md' : step > 0 ? 'border-slate-200 text-slate-500' : 'border-slate-200 text-slate-400 opacity-50'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${step === 0 ? 'bg-sky-500' : step > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}>1</div>
              <div className="flex-1">
                <h3 className={`font-bold ${step === 0 ? 'text-sky-800' : ''}`}>Initial Mixture</h3>
                <p className="text-xs">Observe salt and sand mixed.</p>
              </div>
            </button>

            <button 
              onClick={nextStep} disabled={step !== 1}
              className={`w-full p-4 rounded-xl text-left border-2 flex items-center gap-4 transition-colors relative z-10 bg-slate-50 ${step === 1 ? 'border-sky-500 shadow-md' : step > 1 ? 'border-slate-200 text-slate-500' : 'border-slate-200 text-slate-400 opacity-50'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${step === 1 ? 'bg-sky-500' : step > 1 ? 'bg-emerald-500' : 'bg-slate-300'}`}>2</div>
              <div className="flex-1">
                <h3 className={`font-bold ${step === 1 ? 'text-sky-800' : ''}`}>Dissolving</h3>
                <p className="text-xs">Add water. Salt dissolves, sand does not.</p>
              </div>
            </button>

            <button 
              onClick={nextStep} disabled={step !== 2}
              className={`w-full p-4 rounded-xl text-left border-2 flex items-center gap-4 transition-colors relative z-10 bg-slate-50 ${step === 2 ? 'border-sky-500 shadow-md' : step > 2 ? 'border-slate-200 text-slate-500' : 'border-slate-200 text-slate-400 opacity-50'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${step === 2 ? 'bg-sky-500' : step > 2 ? 'bg-emerald-500' : 'bg-slate-300'}`}>3</div>
              <div className="flex-1">
                <h3 className={`font-bold ${step === 2 ? 'text-sky-800' : ''}`}>Filtration</h3>
                <p className="text-xs">Filter to separate sand from salt water.</p>
              </div>
            </button>

            <button 
              onClick={nextStep} disabled={step !== 3}
              className={`w-full p-4 rounded-xl text-left border-2 flex items-center gap-4 transition-colors relative z-10 bg-slate-50 ${step === 3 ? 'border-sky-500 shadow-md' : step > 3 ? 'border-slate-200 text-slate-500' : 'border-slate-200 text-slate-400 opacity-50'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${step === 3 ? 'bg-sky-500' : step > 3 ? 'bg-emerald-500' : 'bg-slate-300'}`}>4</div>
              <div className="flex-1">
                <h3 className={`font-bold ${step === 3 ? 'text-sky-800' : ''}`}>Evaporation</h3>
                <p className="text-xs">Boil off water to recover pure salt.</p>
              </div>
            </button>
          </div>
          
          {step === 3 && (
            <button onClick={() => setStep(0)} className="w-full mt-6 py-2 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-bold hover:bg-emerald-200">Restart Separation</button>
          )}
        </div>

        {/* Visualizer */}
        <div className="w-[500px] h-[500px] bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-500 mb-8">{getContainerContent()}</h3>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            
            {step === 0 && (
              <div className="w-48 h-32 border-b-4 border-l-4 border-r-4 border-slate-300 rounded-b-xl relative flex items-end px-2 pb-2">
                {/* Mixed pile */}
                <div className="w-full h-8 bg-amber-200/80 rounded flex flex-wrap gap-[1px] p-[2px] overflow-hidden">
                  {[...Array(100)].map((_, i) => (
                    <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-amber-700' : 'bg-slate-50'}`}></div>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="w-48 h-48 border-b-4 border-l-4 border-r-4 border-slate-300 rounded-b-xl relative flex flex-col justify-end bg-blue-50/50">
                {/* Water level */}
                <div className="absolute bottom-0 w-full h-32 bg-blue-400/40 border-t-2 border-blue-300/50 rounded-b-lg"></div>
                {/* Settled sand */}
                <div className="w-full h-6 bg-amber-700/80 z-10 rounded-b-lg relative">
                  <div className="absolute top-0 w-full h-1 bg-amber-800/40"></div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col items-center gap-2">
                {/* Funnel & Filter Paper */}
                <div className="relative w-24 h-24">
                  <div className="absolute top-0 w-24 h-16 bg-slate-50 border-l-4 border-r-4 border-slate-300 funnel-shape z-10"></div>
                  {/* Filter paper inside */}
                  <div className="absolute top-2 left-2 w-20 h-12 bg-orange-100 funnel-shape z-20"></div>
                  {/* Sand caught */}
                  <div className="absolute top-8 left-6 w-12 h-4 bg-amber-700 z-30 rounded"></div>
                  {/* Drip */}
                  <div className="absolute bottom-0 left-11 w-2 h-8 bg-slate-300 z-10"></div>
                  <div className="absolute -bottom-4 left-11 w-2 h-2 bg-blue-300 rounded-full animate-ping z-10"></div>
                </div>
                {/* Collecting Beaker */}
                <div className="w-32 h-24 border-b-4 border-l-4 border-r-4 border-slate-300 rounded-b-xl relative flex items-end">
                   <div className="w-full h-16 bg-blue-300/40 rounded-b-lg border-t-2 border-blue-200/50"></div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center">
                {/* Boiling Beaker */}
                <div className="w-32 h-24 border-b-4 border-l-4 border-r-4 border-slate-300 rounded-b-xl relative flex items-end p-2 bg-blue-50/20">
                  {/* Recovered salt */}
                  <div className="w-full h-2 bg-slate-50 border border-slate-100 rounded-sm"></div>
                  {/* Steam */}
                  <div className="absolute -top-12 left-4 text-slate-300 animate-pulse"><Wind /></div>
                  <div className="absolute -top-16 right-4 text-slate-300 animate-pulse delay-75"><Wind /></div>
                </div>
                {/* Bunsen Burner */}
                <div className="mt-4 flex flex-col items-center">
                  <Flame className="w-10 h-10 text-orange-500 fill-orange-500 animate-pulse" />
                  <div className="w-12 h-6 bg-slate-800 rounded-t-md"></div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .funnel-shape { clip-path: polygon(0 0, 100% 0, 60% 100%, 40% 100%); }
      `}} />
    </div>
  );
}
