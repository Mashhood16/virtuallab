import { useState } from 'react';
import { Beaker, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS6FatDetection({ onExit }: LabProps) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const getTubeContent = () => {
    if (step === 0) return 'empty';
    if (step === 1) return 'food';
    if (step === 2) return 'ethanol';
    if (step === 3) return 'shaken';
    if (step === 4) return 'cloudy';
  };

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 3: Fat Detection in Food" />

      <div className="flex-1 flex p-8 items-center justify-center gap-16">
        
        <div className="w-96 bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-amber-700">Lab Procedure</h2>
          
          <div className="space-y-4">
            <button 
              onClick={nextStep} disabled={step !== 0}
              className={`w-full p-4 rounded-xl text-left border-2 flex items-center justify-between transition-colors ${step === 0 ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold' : step > 0 ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-slate-200 text-slate-400'}`}
            >
              <span>1. Add crushed food sample to test tube</span>
              {step > 0 && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            </button>
            <button 
              onClick={nextStep} disabled={step !== 1}
              className={`w-full p-4 rounded-xl text-left border-2 flex items-center justify-between transition-colors ${step === 1 ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold' : step > 1 ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-slate-200 text-slate-400'}`}
            >
              <span>2. Add Ethanol above food level</span>
              {step > 1 && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            </button>
            <button 
              onClick={nextStep} disabled={step !== 2}
              className={`w-full p-4 rounded-xl text-left border-2 flex items-center justify-between transition-colors ${step === 2 ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold' : step > 2 ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-slate-200 text-slate-400'}`}
            >
              <span>3. Shake test tube well</span>
              {step > 2 && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            </button>
            <button 
              onClick={nextStep} disabled={step !== 3}
              className={`w-full p-4 rounded-xl text-left border-2 flex items-center justify-between transition-colors ${step === 3 ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold' : step > 3 ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-slate-200 text-slate-400'}`}
            >
              <span>4. Add Water and observe</span>
              {step > 3 && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            </button>
          </div>

          {step === 4 && (
            <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
              <h3 className="font-bold flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5" /> Test Complete</h3>
              <p className="text-sm">A cloudy, milky-white emulsion has formed at the top of the liquid. This positive result indicates the presence of lipids (fats) in the food sample.</p>
              <button onClick={() => setStep(0)} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded font-bold text-sm hover:bg-emerald-700">Reset Experiment</button>
            </div>
          )}
        </div>

        <div className="w-80 h-128 bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-end relative overflow-hidden">
          {/* Test Tube */}
          <div className={`w-16 h-80 border-4 border-t-0 border-slate-300 rounded-b-3xl relative overflow-hidden transition-transform duration-500 ${step === 3 ? 'animate-shake' : ''}`}>
            {/* Contents based on step */}
            {getTubeContent() === 'food' && (
              <div className="absolute bottom-0 w-full h-8 bg-amber-800 rounded-b-2xl"></div>
            )}
            {getTubeContent() === 'ethanol' && (
              <>
                <div className="absolute bottom-8 w-full h-24 bg-blue-100/50 backdrop-blur-sm"></div>
                <div className="absolute bottom-0 w-full h-8 bg-amber-800 rounded-b-2xl"></div>
              </>
            )}
            {getTubeContent() === 'shaken' && (
              <div className="absolute bottom-0 w-full h-32 bg-amber-600/60 rounded-b-2xl backdrop-blur-md flex items-center justify-center">
                <div className="w-full h-full opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900 to-transparent"></div>
              </div>
            )}
            {getTubeContent() === 'cloudy' && (
              <>
                <div className="absolute bottom-32 w-full h-16 bg-slate-50/90 backdrop-blur-xl border-t border-slate-200"></div>
                <div className="absolute bottom-0 w-full h-32 bg-amber-600/30 rounded-b-2xl"></div>
              </>
            )}
            
            {/* Glass reflection */}
            <div className="absolute top-0 left-2 w-2 h-full bg-slate-50/40 rounded-full"></div>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <Beaker className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-slate-500 font-bold uppercase tracking-wider text-sm">Test Tube</span>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes shake {
              0%, 100% { transform: translateX(0) rotate(0); }
              25% { transform: translateX(-10px) rotate(-5deg); }
              50% { transform: translateX(10px) rotate(5deg); }
              75% { transform: translateX(-10px) rotate(-5deg); }
            }
            .animate-shake { animation: shake 0.5s ease-in-out infinite; }
          `}} />
        </div>

      </div>
    </div>
  );
}
