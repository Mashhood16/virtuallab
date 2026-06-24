import { useState } from 'react';
import { TestTube, Flame, CheckCircle, Info } from 'lucide-react';
import LabHeader from './LabHeader';

type Sample = 'glucose' | 'starch' | 'protein' | 'lipid' | null;
type Reagent = 'benedict' | 'iodine' | 'biuret' | 'sudan' | null;

export default function LabB11Biomolecules({ onExit }: { onExit?: () => void }) {
  const [selectedSample, setSelectedSample] = useState<Sample>(null);
  const [selectedReagent, setSelectedReagent] = useState<Reagent>(null);
  const [isHeated, setIsHeated] = useState(false);

  // Assessment States
  const [unk1, setUnk1] = useState('');
  const [unk2, setUnk2] = useState('');
  const [unk3, setUnk3] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const getTubeColor = () => {
    if (!selectedSample || !selectedReagent) return 'fill-blue-100'; // Default water color
    
    // Benedict's Test (Needs Heat)
    if (selectedReagent === 'benedict') {
      if (selectedSample === 'glucose') {
        return isHeated ? 'fill-orange-500' : 'fill-blue-300';
      }
      return 'fill-blue-300'; // Negative
    }

    // Iodine Test
    if (selectedReagent === 'iodine') {
      if (selectedSample === 'starch') return 'fill-slate-900'; // Blue-black
      return 'fill-yellow-500'; // Negative (iodine color)
    }

    // Biuret Test
    if (selectedReagent === 'biuret') {
      if (selectedSample === 'protein') return 'fill-purple-500'; // Purple
      return 'fill-blue-200'; // Negative
    }

    // Sudan III Test
    if (selectedReagent === 'sudan') {
      if (selectedSample === 'lipid') return 'fill-red-500'; // Red stained lipid layer
      return 'fill-pink-100'; // Negative
    }

    return 'fill-blue-100';
  };

  const handleReset = () => {
    setSelectedSample(null);
    setSelectedReagent(null);
    setIsHeated(false);
  };

  const checkAssessment = () => {
    let score = 0;
    if (unk1.toLowerCase() === 'protein') score++;
    if (unk2.toLowerCase() === 'starch') score++;
    if (unk3.toLowerCase() === 'lipid' || unk3.toLowerCase() === 'fat') score++;

    if (score === 3) setFeedback('Perfect! All unknown samples identified correctly.');
    else setFeedback(`You identified ${score}/3 unknowns correctly. Keep analyzing the test reactions.`);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <header className="bg-emerald-800 text-white p-4 shadow-md flex items-center justify-between z-10">
        <LabHeader onExit={onExit} variant="emerald" title="Grade 11: Biochemical Food Tests" />
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
        
        {/* Column 1: Theory */}
        <section className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Theory & Principles</h2>
          <div className="space-y-4 text-sm text-slate-700">
            <p>Identifying biological molecules involves specific chemical reagents that produce characteristic color changes.</p>
            
            <div className="bg-orange-50 border-l-4 border-orange-400 p-3">
              <h3 className="font-bold text-orange-800">1. Reducing Sugars (Benedict's)</h3>
              <p>Benedict's reagent contains Cu²⁺ ions. When <strong>heated</strong> with reducing sugars (like glucose), it is reduced to Cu⁺, forming an orange-red precipitate of copper(I) oxide.</p>
            </div>

            <div className="bg-slate-100 border-l-4 border-slate-800 p-3">
              <h3 className="font-bold text-slate-800">2. Starch (Iodine)</h3>
              <p>Iodine solution (I₂ dissolved in KI) slips inside the amylose helix of starch, forming a deep <strong>blue-black</strong> complex.</p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-3">
              <h3 className="font-bold text-purple-800">3. Proteins (Biuret)</h3>
              <p>Biuret reagent detects peptide bonds. In alkaline conditions, Cu²⁺ ions coordinate with nitrogen atoms in peptide bonds, turning the solution <strong>purple/violet</strong>.</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-3">
              <h3 className="font-bold text-red-800">4. Lipids (Sudan III / Emulsion)</h3>
              <p>Sudan III is a fat-soluble dye that stains lipids <strong>red</strong>. Alternatively, ethanol forms a cloudy white emulsion with lipids.</p>
            </div>
          </div>
        </section>

        {/* Column 2: Interactive Simulator */}
        <section className="bg-slate-100 rounded-xl shadow-inner border border-slate-300 p-6 flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TestTube className="text-emerald-600" /> Virtual Chemistry Bench
          </h3>
          
          <div className="w-48 h-64 relative mb-8 flex justify-center items-end border-b-4 border-slate-300">
            {/* The SVG Test Tube */}
            <svg viewBox="0 0 100 200" className="w-24 h-48 drop-shadow-lg transition-transform hover:scale-105">
              {/* Liquid Content */}
              <path d="M 30 50 L 30 180 A 20 20 0 0 0 70 180 L 70 50 Z" className={`${getTubeColor()} transition-colors duration-1000`} />
              
              {/* Boiling Bubbles if heated and liquid is present */}
              {isHeated && selectedSample && (
                <g className="text-white fill-current opacity-60 animate-bounce">
                  <circle cx="40" cy="150" r="3" />
                  <circle cx="60" cy="130" r="4" />
                  <circle cx="50" cy="170" r="2" />
                  <circle cx="45" cy="100" r="3" />
                </g>
              )}

              {/* Glass Tube Outline */}
              <path d="M 30 10 L 30 180 A 20 20 0 0 0 70 180 L 70 10" className="stroke-slate-400 fill-none opacity-50" strokeWidth="4" />
              <ellipse cx="50" cy="10" rx="20" ry="5" className="stroke-slate-400 fill-none opacity-50" strokeWidth="4" />
              
              {/* Highlight */}
              <path d="M 35 30 L 35 170" className="stroke-white fill-none opacity-60" strokeWidth="2" strokeLinecap="round" />
            </svg>

            {/* Heat Source Indicator */}
            {isHeated && (
              <div className="absolute -bottom-8 animate-pulse text-orange-500">
                <Flame size={40} />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="w-full space-y-4 bg-slate-50 p-4 rounded-lg shadow-sm">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">1. Add Sample</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { id: 'glucose', label: 'Glucose' },
                  { id: 'starch', label: 'Starch' },
                  { id: 'protein', label: 'Egg Albumen' },
                  { id: 'lipid', label: 'Vegetable Oil' }
                ].map(s => (
                  <button 
                    key={s.id}
                    onClick={() => { setSelectedSample(s.id as Sample); setIsHeated(false); }}
                    className={`text-sm py-1 rounded border transition-colors ${selectedSample === s.id ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">2. Add Reagent</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { id: 'benedict', label: "Benedict's" },
                  { id: 'iodine', label: 'Iodine' },
                  { id: 'biuret', label: 'Biuret' },
                  { id: 'sudan', label: 'Sudan III' }
                ].map(r => (
                  <button 
                    key={r.id}
                    onClick={() => setSelectedReagent(r.id as Reagent)}
                    className={`text-sm py-1 rounded border transition-colors ${selectedReagent === r.id ? 'bg-blue-100 border-blue-500 text-blue-800 font-bold' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <button 
                onClick={() => setIsHeated(true)}
                disabled={!selectedReagent || !selectedSample}
                className="flex-1 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Flame size={18} /> Apply Heat
              </button>
              <button 
                onClick={handleReset}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-semibold"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Column 3: Assessment */}
        <section className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <CheckCircle className="text-emerald-600" /> Data Analysis
          </h2>
          
          <div className="bg-blue-50 p-3 rounded-lg flex gap-3 text-sm text-blue-800 border border-blue-100 mb-2">
            <Info className="shrink-0 mt-0.5" size={18} />
            <p>Determine the biomolecules present in three unknown samples based on their lab results.</p>
          </div>

          <div className="space-y-5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="font-semibold text-slate-800 mb-2">Unknown Sample A</p>
              <p className="text-xs text-slate-600 mb-2 italic">Observation: Turned purple upon adding Biuret reagent. Remained blue with Benedict's after heating.</p>
              <select 
                value={unk1} onChange={e => setUnk1(e.target.value)}
                className="w-full p-2 border rounded text-sm bg-slate-50"
              >
                <option value="">Select Biomolecule...</option>
                <option value="glucose">Reducing Sugar</option>
                <option value="starch">Starch</option>
                <option value="protein">Protein</option>
                <option value="lipid">Lipid</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="font-semibold text-slate-800 mb-2">Unknown Sample B</p>
              <p className="text-xs text-slate-600 mb-2 italic">Observation: Turned blue-black instantly when Iodine drops were added.</p>
              <select 
                value={unk2} onChange={e => setUnk2(e.target.value)}
                className="w-full p-2 border rounded text-sm bg-slate-50"
              >
                <option value="">Select Biomolecule...</option>
                <option value="glucose">Reducing Sugar</option>
                <option value="starch">Starch</option>
                <option value="protein">Protein</option>
                <option value="lipid">Lipid</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="font-semibold text-slate-800 mb-2">Unknown Sample C</p>
              <p className="text-xs text-slate-600 mb-2 italic">Observation: Formed a red stained layer floating on top of the water after adding Sudan III.</p>
              <select 
                value={unk3} onChange={e => setUnk3(e.target.value)}
                className="w-full p-2 border rounded text-sm bg-slate-50"
              >
                <option value="">Select Biomolecule...</option>
                <option value="glucose">Reducing Sugar</option>
                <option value="starch">Starch</option>
                <option value="protein">Protein</option>
                <option value="lipid">Lipid</option>
              </select>
            </div>

            <button 
              onClick={checkAssessment}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-sm"
            >
              Submit Lab Report
            </button>

            {feedback && (
              <div className={`p-4 rounded-lg font-medium text-sm text-center ${feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
