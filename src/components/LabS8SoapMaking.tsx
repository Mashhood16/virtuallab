import { useState } from 'react';
import { RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8SoapMaking({ onExit }: LabProps) {
  const [step, setStep] = useState(0);
  const [hasGloves, setHasGloves] = useState(false);
  const [hasGoggles, setHasGoggles] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const steps = [
    { title: "Safety Gear", desc: "Wear protective equipment." },
    { title: "Lye Solution", desc: "Dissolve 15g Lye in 30g Water." },
    { title: "Heat Oils", desc: "Heat 56g coconut oil and 28g olive oil to 50°C." },
    { title: "Saponification", desc: "Blend lye and oils into a paste." },
    { title: "Curing", desc: "Pour into molds and cure for 2 days." }
  ];

  const handleNextStep = () => {
    if (step === 0 && (!hasGloves || !hasGoggles)) {
      setErrorMsg("Lye is highly caustic! You MUST wear gloves and goggles.");
      return;
    }
    setErrorMsg('');
    if (step < steps.length - 1) setStep(step + 1);
  };

  const reset = () => {
    setStep(0);
    setHasGloves(false);
    setHasGoggles(false);
    setErrorMsg('');
  };

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 11.2: Soap Making" subtitle="The chemical process of saponification" rightContent={<>{rightJsx}</>} />

      <div className="flex-1 flex flex-col p-6 gap-6 max-w-4xl mx-auto w-full">
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl shadow-sm border border-slate-200">
           {steps.map((s, i) => (
             <div key={i} className="flex flex-col items-center relative z-10 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-blue-500 text-white ring-4 ring-blue-100' : 'bg-slate-200 text-slate-500'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div className="text-xs font-bold text-slate-600 text-center max-w-[80px]">{s.title}</div>
             </div>
           ))}
        </div>

        {errorMsg && (
          <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-xl font-bold flex items-center gap-2 animate-bounce">
            <AlertTriangle className="w-5 h-5" /> {errorMsg}
          </div>
        )}

        <div className="flex-1 bg-slate-50 rounded-3xl shadow-lg border border-slate-200 p-8 flex flex-col items-center justify-center relative min-h-[400px]">
          
          {/* Step 0: Safety */}
          {step === 0 && (
            <div className="flex flex-col items-center gap-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="text-blue-500" /> Prepare for Chemistry
              </h2>
              <div className="flex gap-6">
                <button 
                  onClick={() => setHasGloves(!hasGloves)}
                  className={`w-32 h-32 rounded-2xl border-4 flex flex-col items-center justify-center gap-2 transition-all ${hasGloves ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}
                >
                  <div className="text-4xl">🧤</div>
                  <span className="font-bold text-sm">Gloves</span>
                </button>
                <button 
                  onClick={() => setHasGoggles(!hasGoggles)}
                  className={`w-32 h-32 rounded-2xl border-4 flex flex-col items-center justify-center gap-2 transition-all ${hasGoggles ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}
                >
                  <div className="text-4xl">🥽</div>
                  <span className="font-bold text-sm">Goggles</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Lye Solution */}
          {step === 1 && (
            <div className="flex flex-col items-center gap-8 w-full max-w-md">
              <div className="flex gap-4 items-end">
                 <div className="flex flex-col items-center">
                    <div className="text-3xl mb-2">💧</div>
                    <div className="text-sm font-bold text-blue-600">30g Water</div>
                 </div>
                 <div className="text-2xl font-bold text-slate-400 mb-6">+</div>
                 <div className="flex flex-col items-center">
                    <div className="text-3xl mb-2">🧂</div>
                    <div className="text-sm font-bold text-red-600">15g Pure Lye</div>
                 </div>
              </div>
              <div className="w-48 h-48 bg-slate-100 rounded-b-3xl border-4 border-t-0 border-slate-300 relative flex flex-col justify-end p-2 overflow-hidden">
                <div className="w-full h-2/3 bg-blue-100/80 rounded-b-xl border-t-2 border-white/50 backdrop-blur-sm animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-red-800 bg-red-100 px-2 py-1 rounded">CAUTION: Gets Hot!</div>
              </div>
            </div>
          )}

          {/* Step 2: Heat Oils */}
          {step === 2 && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-64 h-32 bg-slate-800 rounded-xl relative flex justify-center shadow-xl border-b-8 border-slate-900">
                 {/* Pan */}
                 <div className="absolute -top-8 w-48 h-16 bg-slate-400 rounded-b-xl border-x-4 border-b-4 border-slate-500 flex flex-col justify-end overflow-hidden">
                    <div className="w-full h-10 bg-amber-200/90" />
                 </div>
                 {/* Handle */}
                 <div className="absolute top-[-20px] -right-16 w-20 h-4 bg-slate-900 rounded-r-full" />
                 
                 {/* Fire */}
                 <div className="absolute top-4 flex gap-2">
                    <div className="w-4 h-8 bg-orange-500 rounded-t-full animate-[pulse_0.5s_infinite]" />
                    <div className="w-4 h-10 bg-orange-400 rounded-t-full animate-[pulse_0.7s_infinite_0.1s]" />
                    <div className="w-4 h-8 bg-orange-500 rounded-t-full animate-[pulse_0.6s_infinite_0.2s]" />
                 </div>

                 <div className="absolute bottom-4 font-mono text-red-500 text-2xl font-bold tracking-widest">50°C</div>
              </div>
            </div>
          )}

          {/* Step 3: Saponification */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-lg font-bold text-slate-600 mb-4">Chemical Reaction Occurring...</div>
              <div className="w-48 h-48 bg-slate-200 rounded-full border-8 border-slate-300 relative flex items-center justify-center animate-spin-slow">
                 <div className="absolute inset-2 bg-amber-100 rounded-full mix-blend-multiply" />
                 <div className="absolute inset-4 bg-blue-100/50 rounded-full" />
                 <div className="w-32 h-32 bg-yellow-50 rounded-full flex items-center justify-center shadow-inner">
                    <span className="font-bold text-amber-800 rotate-12">Thick Paste</span>
                 </div>
              </div>
            </div>
          )}

          {/* Step 4: Curing */}
          {step === 4 && (
            <div className="flex flex-col items-center gap-8">
              <div className="flex gap-4">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-24 h-16 bg-amber-100 border-2 border-amber-200 rounded shadow-md flex items-center justify-center transform -rotate-2 hover:rotate-0 transition-transform">
                     <span className="text-amber-800/20 font-bold uppercase tracking-widest text-xl">SOAP</span>
                   </div>
                 ))}
              </div>
              <div className="bg-emerald-100 text-emerald-800 px-6 py-4 rounded-xl border border-emerald-200 text-center">
                <h3 className="font-bold text-lg">Curing Complete!</h3>
                <p className="text-sm">The lye and oil have fully reacted (saponified) to create safe, usable soap bars.</p>
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="absolute bottom-6 w-full flex justify-center">
            {step < steps.length - 1 && (
              <button 
                onClick={handleNextStep}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
              >
                Proceed: {steps[step + 1].title}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
