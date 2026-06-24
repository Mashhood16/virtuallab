import { useState } from 'react';
import { BookOpen, Activity, Edit3, Wind, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB10RespiratorySystem({ onExit }: { onExit: () => void }) {
  const [exhales, setExhales] = useState(0);
  const [diaphragmPull, setDiaphragmPull] = useState(0);

  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [score, setScore] = useState<number | null>(null);

  const volume = 100 + diaphragmPull;
  const pressure = (10000 / volume).toFixed(1);

  const checkAnswers = () => {
    let s = 0;
    const ans1 = q1.toLowerCase();
    const ans2 = q2.toLowerCase();
    if (ans1.includes("carbon dioxide") || ans1.includes("co2") || ans1.includes("precipitate") || ans1.includes("calcium carbonate")) s += 50;
    if (ans2.includes("volume") && (ans2.includes("pressure") || ans2.includes("decreas") || ans2.includes("invers"))) s += 50;
    setScore(s);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Top Header */}
      <LabHeader onExit={onExit} title="Lab B10.3: Respiratory Mechanics" subtitle="Gas Exchange & Boyle's Law Model" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-grow">
        
        {/* Left Column: Theory */}
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-sky-100 text-sky-600 rounded-lg"><BookOpen className="w-6 h-6" /></div>
            <h2 className="text-xl font-bold text-slate-800">Theory & Context</h2>
          </div>
          <div className="prose prose-slate text-sm flex-grow overflow-y-auto pr-2">
            <h3 className="font-semibold text-slate-800">1. Testing Exhaled Air</h3>
            <p>
              Cellular respiration produces Carbon Dioxide (CO₂) as a waste product, which is expelled from the body via the lungs. 
              We can test for the presence of CO₂ using <strong>limewater</strong> (calcium hydroxide solution). 
              When CO₂ bubbles through limewater, it reacts to form calcium carbonate (CaCO₃), an insoluble white precipitate that turns the clear solution "milky" or cloudy.
            </p>
            <h3 className="font-semibold text-slate-800 mt-4">2. Mechanics of Breathing</h3>
            <p>
              Breathing relies on <strong>Boyle's Law</strong>, which states that the pressure of a gas is inversely proportional to its volume (P ∝ 1/V) at a constant temperature.
              When you inhale, the diaphragm muscle contracts and pulls downward. This increases the volume of the thoracic cavity (chest). 
              Because volume increases, intrapulmonary pressure decreases below atmospheric pressure, forcing air into the lungs.
            </p>
          </div>
        </div>

        {/* Middle Column: Simulator */}
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Activity className="w-6 h-6" /></div>
            <h2 className="text-xl font-bold text-slate-800">Interactive Simulator</h2>
          </div>
          
          <div className="flex flex-col gap-6 flex-grow overflow-y-auto pr-2 pb-8">
            
            {/* Station 1: Limewater */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Station 1: CO₂ Indicator</h3>
              <p className="text-xs text-slate-500 mb-4">Exhale into the tube to bubble gas through clear limewater.</p>
              
              <div className="flex items-center justify-center gap-8">
                <div className="relative w-24 h-32 bg-slate-50 border-b-4 border-x-4 border-slate-300 rounded-b-xl overflow-hidden flex flex-col justify-end">
                  {/* Tube */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-24 bg-slate-300 rounded-b-full z-10" />
                  
                  {/* Limewater Liquid */}
                  <div 
                    className="w-full transition-all duration-700 ease-in-out relative"
                    style={{ 
                      height: '60%', 
                      backgroundColor: `rgba(255, 255, 255, ${Math.min(exhales * 0.25, 0.95)})`,
                      backdropFilter: 'blur(1px)',
                      borderTop: '2px solid rgba(200,200,200,0.5)'
                    }}
                  >
                    {/* Bubbles */}
                    {exhales > 0 && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 animate-bounce">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-50 shadow-sm" />
                          <div className="w-2 h-2 rounded-full bg-slate-50 shadow-sm" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                   <button onClick={() => setExhales(prev => prev + 1)} className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                     <Wind className="w-4 h-4"/> Exhale Gas
                   </button>
                   <button onClick={() => setExhales(0)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium transition-colors">
                     Replace Limewater
                   </button>
                </div>
              </div>
            </div>

            {/* Station 2: Bell Jar Model */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Station 2: Bell Jar Lung Model</h3>
              <p className="text-xs text-slate-500 mb-4">Pull the rubber diaphragm down to observe changes in volume and pressure.</p>
              
              <div className="flex items-start justify-between px-2 gap-4">
                
                {/* Stats Panel */}
                <div className="flex flex-col gap-4 text-xs font-mono bg-slate-800 text-emerald-400 p-3 rounded-lg shadow-inner w-32">
                  <div>
                    <span className="text-slate-400 block">Thoracic Vol</span>
                    <span className="text-lg">{volume} mL</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Intrapulmonary Pressure</span>
                    <span className="text-lg">{pressure} mmHg</span>
                  </div>
                </div>

                {/* Bell Jar Container */}
                <div className="relative w-32 h-48 mt-2 mx-auto">
                  {/* Glass Jar */}
                  <div className="absolute inset-0 bg-blue-50/40 border-4 border-slate-300 rounded-t-[3rem] border-b-0 overflow-hidden" />
                  
                  {/* Trachea & Bronchi */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-12 bg-slate-600 rounded-t-sm z-10" />
                  <div className="absolute top-12 left-1/2 -translate-x-[6px] w-2 h-8 bg-slate-600 -rotate-45 origin-top z-10" />
                  <div className="absolute top-12 left-1/2 w-2 h-8 bg-slate-600 rotate-45 origin-top z-10" />

                  {/* Lungs (Balloons) */}
                  <div 
                    className="absolute top-16 left-[20%] bg-pink-400/90 rounded-full transition-all duration-100 ease-linear origin-top shadow-sm z-0"
                    style={{ 
                      width: `${16 + diaphragmPull * 0.15}px`,
                      height: `${24 + diaphragmPull * 0.3}px`
                    }}
                  />
                  <div 
                    className="absolute top-16 right-[20%] bg-pink-400/90 rounded-full transition-all duration-100 ease-linear origin-top shadow-sm z-0"
                    style={{ 
                      width: `${16 + diaphragmPull * 0.15}px`,
                      height: `${24 + diaphragmPull * 0.3}px`
                    }}
                  />

                  {/* Diaphragm (Rubber Sheet) */}
                  <div 
                    className="absolute bottom-0 left-0 w-full h-8 bg-red-500 rounded-t-[50%] transition-all duration-100 ease-linear"
                    style={{ transform: `translateY(${diaphragmPull * 0.25}px)` }}
                  />
                  
                  {/* Slider Control */}
                  <input 
                    type="range" min="0" max="100" 
                    value={diaphragmPull} 
                    onChange={(e) => setDiaphragmPull(Number(e.target.value))}
                    className="absolute -bottom-8 w-full accent-red-600 cursor-ns-resize"
                  />
                </div>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-10">Slide to pull diaphragm</p>
            </div>

          </div>
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Edit3 className="w-6 h-6" /></div>
            <h2 className="text-xl font-bold text-slate-800">Assessment</h2>
          </div>
          
          <div className="flex-grow flex flex-col gap-6 overflow-y-auto pr-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                1. What specific chemical product causes the limewater to turn cloudy, and what does this prove about human exhaled air?
              </label>
              <textarea 
                value={q1}
                onChange={e => setQ1(e.target.value)}
                placeholder="Name the gas and the resulting precipitate..."
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none text-sm"
                rows={4}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                2. Explain how pulling the diaphragm down causes the balloons to inflate, making sure to reference Boyle's Law.
              </label>
              <textarea 
                value={q2}
                onChange={e => setQ2(e.target.value)}
                placeholder="Relate volume and pressure..."
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none text-sm"
                rows={4}
              />
            </div>

            <button 
              onClick={checkAnswers}
              className="w-full py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" /> Check Answers
            </button>

            {score !== null && (
              <div className={`p-4 rounded-xl border ${score === 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                <h3 className="font-bold mb-1">Score: {score}%</h3>
                {score < 100 && (
                  <p className="text-sm">Make sure you identified Carbon Dioxide (CO2) for Q1 and discussed the inverse relationship of Volume and Pressure for Q2.</p>
                )}
                {score === 100 && (
                  <p className="text-sm">Excellent! You accurately linked chemical waste products and the physical gas laws driving respiration.</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
