import { useState } from 'react';
import {Target, CheckCircle, Activity, Search, RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabB11Cytology({ onExit }: { onExit?: () => void }) {
  const [activeTab] = useState<'sem' | 'stem'>('sem');
  const [magIndex, setMagIndex] = useState<number>(0);
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);

  // Assessment States
  const [q1Ans, setQ1Ans] = useState('');
  const [q2Ans, setQ2Ans] = useState('');
  const [q3Ans, setQ3Ans] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const magLevels = [1, 1000, 100000, 10000000, 50000000];
  const currentMag = magLevels[magIndex];

  const handleCheckAnswers = () => {
    let score = 0;
    if (q1Ans.trim() === '5') score++;
    if (q2Ans.toLowerCase().includes('pancreas') || q2Ans.toLowerCase().includes('beta')) score++;
    if (q3Ans.toLowerCase().includes('pluripotent')) score++;
    
    if (score === 3) setFeedback('Excellent! All answers are correct.');
    else setFeedback(`You got ${score}/3 correct. Check your calculations and theory.`);
  };

  const getSvgContent = () => {
    if (currentMag === 1) {
      // Whole cell
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500 fill-current opacity-80 animate-pulse">
          <circle cx="50" cy="50" r="40" className="text-blue-200 fill-current" />
          <circle cx="50" cy="50" r="10" className="text-blue-800 fill-current" />
          <path d="M 30 40 Q 40 30 50 40 T 70 40" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    } else if (currentMag === 1000) {
      // Nucleus
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-600 fill-current">
          <circle cx="50" cy="50" r="48" className="text-indigo-200 fill-current" />
          <circle cx="30" cy="40" r="8" className="text-indigo-800 fill-current" />
          <circle cx="60" cy="60" r="6" className="text-indigo-800 fill-current" />
          <circle cx="45" cy="30" r="4" className="text-indigo-800 fill-current" />
        </svg>
      );
    } else if (currentMag === 100000) {
      // Chromosomes
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full text-purple-700 stroke-current" strokeWidth="4" strokeLinecap="round">
          <path d="M 40 20 L 60 80 M 60 20 L 40 80" />
          <circle cx="50" cy="50" r="4" className="fill-current text-purple-900" stroke="none" />
          <path d="M 20 30 L 30 70 M 30 30 L 20 70" />
          <circle cx="25" cy="50" r="3" className="fill-current text-purple-900" stroke="none" />
        </svg>
      );
    } else if (currentMag === 10000000) {
      // Chromatin Fiber
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full text-fuchsia-600 fill-none stroke-current" strokeWidth="3">
          <path d="M 10 50 Q 20 10 30 50 T 50 50 T 70 50 T 90 50" />
          <circle cx="30" cy="50" r="6" className="fill-current" />
          <circle cx="50" cy="50" r="6" className="fill-current" />
          <circle cx="70" cy="50" r="6" className="fill-current" />
        </svg>
      );
    } else {
      // DNA Double Helix
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full text-pink-600 stroke-current fill-none" strokeWidth="2">
          <path d="M 20 10 Q 50 50 80 90 M 80 10 Q 50 50 20 90" />
          <line x1="35" y1="30" x2="65" y2="30" />
          <line x1="40" y1="40" x2="60" y2="40" />
          <line x1="45" y1="50" x2="55" y2="50" />
          <line x1="40" y1="60" x2="60" y2="60" />
          <line x1="35" y1="70" x2="65" y2="70" />
        </svg>
      );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <LabHeader onExit={onExit} title="Grade 11: Advanced Cytology & Stem Cells" />

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
        
        {/* Column 1: Theory */}
        <section className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Theory & Context</h2>
          {activeTab === 'sem' ? (
            <div className="text-slate-600 space-y-4">
              <p><strong>Scanning Electron Microscopy (SEM)</strong> allows biologists to observe the surface of cellular structures at incredibly high magnifications.</p>
              <p>Using an electron beam instead of light, modern electron microscopes can achieve magnifications up to <strong>50,000,000x</strong>.</p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2">Magnification Formula</h3>
                <p className="font-mono text-sm bg-slate-50 p-2 rounded border border-blue-200 text-center">Magnification (M) = Image Size (I) / Actual Size (A)</p>
                <p className="text-sm mt-2 text-blue-700">Remember to convert your units! 1 mm = 1000 µm = 1,000,000 nm.</p>
              </div>
            </div>
          ) : (
            <div className="text-slate-600 space-y-4">
              <p><strong>Induced Pluripotent Stem Cells (iPSCs)</strong> are adult cells genetically reprogrammed to an embryonic stem cell-like state.</p>
              <p>Because they are pluripotent, they can differentiate into any cell type in the body, offering massive potential for regenerative medicine.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Pancreas:</strong> Beta cells for Type 1 Diabetes.</li>
                <li><strong>Heart:</strong> Cardiomyocytes for myocardial infarction.</li>
                <li><strong>Brain:</strong> Dopaminergic neurons for Parkinson's Disease.</li>
              </ul>
            </div>
          )}
        </section>

        {/* Column 2: Interactive Simulator */}
        <section className="bg-slate-900 rounded-xl shadow-inner border-4 border-slate-800 p-6 flex flex-col relative overflow-hidden">
          {activeTab === 'sem' ? (
            <>
              <div className="absolute top-4 left-4 text-green-400 font-mono text-sm bg-black/50 px-3 py-1 rounded">
                MAG: {currentMag.toLocaleString()}x
              </div>
              <div className="flex-1 flex items-center justify-center relative">
                <div className="w-64 h-64 border-2 border-slate-700 rounded-full bg-slate-950 p-4 shadow-2xl flex items-center justify-center overflow-hidden relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] rounded-full pointer-events-none"></div>
                  {getSvgContent()}
                </div>
              </div>
              <div className="mt-6 bg-slate-800 p-4 rounded-lg flex flex-col gap-3">
                <label className="text-slate-300 font-semibold text-sm flex justify-between">
                  <span>Adjust Focus & Magnification</span>
                  <Search size={16} />
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="4" 
                  step="1"
                  value={magIndex}
                  onChange={(e) => setMagIndex(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>1x</span>
                  <span>10³x</span>
                  <span>10⁵x</span>
                  <span>10⁷x</span>
                  <span>5x10⁷x</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-white text-center font-bold mb-4">iPSC Differentiation Protocol</h3>
              <div className="flex-1 flex flex-col items-center justify-center gap-8">
                {/* iPSC Source */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-600 flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-700 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                    <RefreshCw className="text-white animate-spin-slow" size={24} />
                  </div>
                  <span className="text-emerald-100 font-semibold">Patient iPSCs</span>
                </div>
                
                {/* Arrows & Targets */}
                <div className="flex gap-4 w-full justify-around">
                  {[
                    { id: 'brain', name: 'Brain (Neurons)', icon: <Activity /> },
                    { id: 'heart', name: 'Heart (Cardiomyocytes)', icon: <Activity /> },
                    { id: 'pancreas', name: 'Pancreas (Beta Cells)', icon: <Target /> }
                  ].map(organ => (
                    <button
                      key={organ.id}
                      onClick={() => setSelectedOrgan(organ.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${selectedOrgan === organ.id ? 'bg-slate-700 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-800 border-slate-600 hover:border-slate-400'}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedOrgan === organ.id ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-300'}`}>
                        {organ.icon}
                      </div>
                      <span className="text-xs text-slate-200 font-medium">{organ.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              {selectedOrgan && (
                <div className="mt-4 p-3 bg-emerald-900/30 border border-emerald-800 rounded text-emerald-200 text-sm text-center animate-pulse">
                  Differentiating iPSCs to {selectedOrgan} lineage... Protocol complete.
                </div>
              )}
            </>
          )}
        </section>

        {/* Column 3: Assessment */}
        <section className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <CheckCircle className="text-blue-600" /> Lab Assessment
          </h2>
          
          <div className="space-y-6 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                1. An electron micrograph shows a mitochondrion measuring 50 mm in length. The actual size of the mitochondrion is 10 µm. What is the magnification? (Enter just the number in thousands, e.g., if 5000, enter 5)
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={q1Ans}
                  onChange={(e) => setQ1Ans(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="text-slate-500 font-mono">x10³</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                2. Which organ target requires differentiation into Beta Cells to treat Type 1 Diabetes?
              </label>
              <input 
                type="text" 
                value={q2Ans}
                onChange={(e) => setQ2Ans(e.target.value)}
                placeholder="Organ name..."
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                3. What term describes the potency of iPSCs, allowing them to form any of the three germ layers?
              </label>
              <input 
                type="text" 
                value={q3Ans}
                onChange={(e) => setQ3Ans(e.target.value)}
                placeholder="Potency type..."
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button 
              onClick={handleCheckAnswers}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              <CheckCircle size={20} /> Verify Results
            </button>

            {feedback && (
              <div className={`p-4 rounded-lg font-medium text-sm ${feedback.includes('Excellent') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {feedback}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
