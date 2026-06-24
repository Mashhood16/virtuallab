import { useState } from 'react';
import { Beaker, Thermometer, CheckCircle2, Droplets, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

interface ComponentProps {
  onExit?: () => void;
}

type Mode = 'reactions' | 'water' | 'converter';

interface Reagent {
  id: string;
  name: string;
  formula: string;
  type: 'acid' | 'metal' | 'carbonate';
  color: string;
}

const REAGENTS: Reagent[] = [
  { id: 'hcl', name: 'Hydrochloric Acid', formula: 'HCl', type: 'acid', color: 'bg-blue-200' },
  { id: 'h2so4', name: 'Sulfuric Acid', formula: 'H2SO4', type: 'acid', color: 'bg-yellow-100' },
  { id: 'mg', name: 'Magnesium', formula: 'Mg', type: 'metal', color: 'bg-gray-400' },
  { id: 'caco3', name: 'Calcium Carbonate', formula: 'CaCO3', type: 'carbonate', color: 'bg-slate-200' }
];

export default function LabC9EnvironmentalChem({ onExit }: ComponentProps) {
  const [activeMode, setActiveMode] = useState<Mode>('reactions');
  
  // Reactions State
  const [selectedReagents, setSelectedReagents] = useState<Reagent[]>([]);
  const [equation, setEquation] = useState<string>('');
  const [reactionComplete, setReactionComplete] = useState(false);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; delay: number }[]>([]);

  // Water State
  const [impurityLevel, setImpurityLevel] = useState<number>(0);
  
  // Converter State
  const [converterTemp, setConverterTemp] = useState<number>(100);

  // Assessment State
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [feedback, setFeedback] = useState('');

  // Handle bottle click
  const handleBottleClick = (reagent: Reagent) => {
    if (reactionComplete) {
      setSelectedReagents([reagent]);
      setReactionComplete(false);
      setEquation(reagent.formula);
      setBubbles([]);
      return;
    }

    if (selectedReagents.length < 2 && !selectedReagents.find(r => r.id === reagent.id)) {
      const newReagents = [...selectedReagents, reagent];
      setSelectedReagents(newReagents);
      
      let newEq = newReagents.map(r => r.formula).join(' + ');
      
      if (newReagents.length === 2) {
        const hasAcid = newReagents.find(r => r.type === 'acid');
        const hasMetal = newReagents.find(r => r.type === 'metal');
        const hasCarbonate = newReagents.find(r => r.type === 'carbonate');

        if (hasAcid && hasMetal) {
          const acid = hasAcid.id === 'hcl' ? '2HCl' : 'H2SO4';
          const salt = hasAcid.id === 'hcl' ? 'MgCl2' : 'MgSO4';
          newEq = `Mg + ${acid} → ${salt} + H2(g)`;
          triggerReaction();
        } else if (hasAcid && hasCarbonate) {
          const acid = hasAcid.id === 'hcl' ? '2HCl' : 'H2SO4';
          const salt = hasAcid.id === 'hcl' ? 'CaCl2' : 'CaSO4';
          newEq = `CaCO3 + ${acid} → ${salt} + H2O(l) + CO2(g)`;
          triggerReaction();
        } else {
          newEq += ' → No Reaction';
          setReactionComplete(true);
        }
      }
      setEquation(newEq);
    }
  };

  const triggerReaction = () => {
    setReactionComplete(true);
    const newBubbles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: 30 + Math.random() * 40,
      delay: Math.random() * 2
    }));
    setBubbles(newBubbles);
  };

  const resetReactions = () => {
    setSelectedReagents([]);
    setEquation('');
    setReactionComplete(false);
    setBubbles([]);
  };

  const checkAssessment = () => {
    let score = 0;
    if (answer1.toLowerCase().includes('co2') || answer1.toLowerCase().includes('carbon dioxide')) score++;
    if (answer2 === '102') score++;
    
    if (score === 2) setFeedback('Perfect! All answers correct.');
    else if (score === 1) setFeedback('Partial correct. Check your answers.');
    else setFeedback('Incorrect. Review the theory and try again.');
  };

  const boilingPoint = 100 + (impurityLevel * 0.5);
  const meltingPoint = 0 - (impurityLevel * 0.5);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <LabHeader onExit={onExit} title="Grade 9 Chemistry: Environmental Chemistry" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
        
        {/* Column 1: Theory */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <Beaker className="w-5 h-5 text-emerald-600" /> Theory & Context
          </h2>
          
          <div className="space-y-4 text-sm text-slate-700">
            <div className="bg-emerald-50 p-3 rounded-lg">
              <h3 className="font-bold text-emerald-800 mb-1">1. Acid Reactions</h3>
              <p>Acids react with metals to produce a salt and <b>Hydrogen gas (H₂)</b>.</p>
              <p>Acids react with metal carbonates to produce a salt, water, and <b>Carbon Dioxide gas (CO₂)</b>.</p>
              <p className="font-mono text-xs mt-2 bg-slate-50 p-1 rounded">Acid + Metal → Salt + Hydrogen</p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-1">2. Water Purity</h3>
              <p>Pure water boils exactly at 100°C and melts at 0°C. Impurities elevate the boiling point and depress the melting point.</p>
            </div>

            <div className="bg-slate-100 p-3 rounded-lg">
              <h3 className="font-bold text-slate-800 mb-1">3. Catalytic Converters</h3>
              <p>Found in car exhausts, they use catalysts (like Pt, Pd, Rh) and high temperatures to convert harmful gases like Nitrogen Monoxide (NO) and Carbon Monoxide (CO) into harmless Nitrogen (N₂) and Carbon Dioxide (CO₂).</p>
            </div>
          </div>
        </div>

        {/* Column 2: Interactive Simulator */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <div className="flex gap-2 mb-4 border-b pb-2">
            <button 
              onClick={() => setActiveMode('reactions')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeMode === 'reactions' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-100'}`}
            >
              Reaction Mixer
            </button>
            <button 
              onClick={() => setActiveMode('water')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeMode === 'water' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'}`}
            >
              Water Purity Test
            </button>
            <button 
              onClick={() => setActiveMode('converter')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeMode === 'converter' ? 'bg-slate-200 text-slate-800' : 'hover:bg-slate-100'}`}
            >
              Catalytic Converter
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
            {activeMode === 'reactions' && (
              <div className="w-full flex flex-col items-center gap-6">
                {/* Bottles */}
                <div className="flex gap-4 mb-4">
                  {REAGENTS.map(reagent => {
                    const isSelected = selectedReagents.find(r => r.id === reagent.id);
                    return (
                      <button
                        key={reagent.id}
                        onClick={() => handleBottleClick(reagent)}
                        className={`flex flex-col items-center gap-1 transition-transform ${isSelected ? 'scale-90 opacity-50' : 'hover:-translate-y-1'}`}
                      >
                        <div className={`w-12 h-16 rounded-t-xl rounded-b-md border-2 border-slate-300 relative overflow-hidden flex items-end ${reagent.color}`}>
                          <div className="absolute top-0 w-full h-3 bg-slate-50/40 border-b border-slate-300"></div>
                          {reagent.type === 'metal' || reagent.type === 'carbonate' ? (
                            <div className="w-full h-1/2 bg-slate-600/20" />
                          ) : (
                            <div className="w-full h-3/4 bg-slate-50/20" />
                          )}
                        </div>
                        <span className="text-xs font-bold font-mono">{reagent.formula}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Flask */}
                <div className="relative w-32 h-40">
                  <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
                    <path d="M40 10 L40 40 L10 100 A10 10 0 0 0 20 115 L80 115 A10 10 0 0 0 90 100 L60 40 L60 10 Z" fill="none" stroke="#cbd5e1" strokeWidth="4"/>
                    {selectedReagents.length > 0 && (
                      <path d="M15 90 L85 90 L80 110 A5 5 0 0 1 75 113 L25 113 A5 5 0 0 1 20 110 Z" fill="#93c5fd" className="opacity-60"/>
                    )}
                    {reactionComplete && bubbles.map(b => (
                      <circle key={b.id} cx={b.x} cy="110" r="2" fill="white" className="animate-ping" style={{ animationDuration: '2s', animationDelay: `${b.delay}s`, animationIterationCount: 'infinite' }} />
                    ))}
                  </svg>
                </div>

                {/* Equation Display */}
                <div className="w-full bg-slate-900 text-emerald-400 font-mono p-4 rounded-lg text-center min-h-[60px] flex items-center justify-center text-lg">
                  {equation || "Select reagents to build equation..."}
                </div>

                <button onClick={resetReactions} className="text-sm text-slate-500 hover:text-slate-800">Clear Flask</button>
              </div>
            )}

            {activeMode === 'water' && (
              <div className="w-full flex flex-col items-center gap-6">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center">
                    <Thermometer className="w-12 h-12 text-red-500 mb-2" />
                    <div className="text-2xl font-bold">{boilingPoint.toFixed(1)}°C</div>
                    <div className="text-xs text-slate-500">Boiling Point</div>
                  </div>
                  
                  <div className="w-32 h-32 rounded-full border-4 border-blue-200 flex items-center justify-center relative overflow-hidden bg-blue-50">
                    <Droplets className="w-10 h-10 text-blue-400 opacity-50" />
                    {impurityLevel > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center flex-wrap gap-1 p-4 opacity-30">
                        {Array.from({ length: Math.min(20, impurityLevel * 2) }).map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-800"></div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <Thermometer className="w-12 h-12 text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">{meltingPoint.toFixed(1)}°C</div>
                    <div className="text-xs text-slate-500">Melting Point</div>
                  </div>
                </div>

                <div className="w-full max-w-xs mt-6">
                  <label className="text-sm font-bold flex justify-between">
                    <span>Added Impurities (Salt)</span>
                    <span>{impurityLevel} g</span>
                  </label>
                  <input 
                    type="range" min="0" max="10" value={impurityLevel} 
                    onChange={(e) => setImpurityLevel(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            )}

            {activeMode === 'converter' && (
              <div className="w-full flex flex-col items-center gap-8">
                <div className="w-full max-w-sm flex items-center justify-between">
                  <div className="flex flex-col gap-2 font-mono text-sm">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">2NO</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">2CO</span>
                  </div>
                  
                  <ArrowRight className="text-slate-400" />
                  
                  <div className="relative w-32 h-20 bg-slate-700 rounded-xl flex items-center justify-center shadow-inner overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2 opacity-30">
                      {Array.from({length: 8}).map((_, i) => <div key={i} className="bg-slate-400 rounded-sm" />)}
                    </div>
                    {converterTemp >= 400 && (
                      <div className="absolute inset-0 bg-orange-500/20 animate-pulse" />
                    )}
                    <span className="text-white font-bold z-10 text-xs">Catalyst (Pt/Pd)</span>
                  </div>

                  <ArrowRight className="text-slate-400" />

                  <div className="flex flex-col gap-2 font-mono text-sm">
                    {converterTemp >= 400 ? (
                      <>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded transition-all">N₂</span>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded transition-all">2CO₂</span>
                      </>
                    ) : (
                      <>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded opacity-50">2NO</span>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded opacity-50">2CO</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-full max-w-xs text-center">
                  <div className="text-sm font-bold mb-2">Exhaust Temperature: {converterTemp}°C</div>
                  <input 
                    type="range" min="100" max="600" step="50" value={converterTemp} 
                    onChange={(e) => setConverterTemp(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-500 mt-2">
                    {converterTemp >= 400 ? "Optimal operating temperature reached." : "Too cold for catalytic conversion!"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Assessment */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Assessment
          </h2>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                1. What gas is produced when Calcium Carbonate (CaCO₃) reacts with Hydrochloric Acid (HCl)?
              </label>
              <input 
                type="text" 
                value={answer1}
                onChange={(e) => setAnswer1(e.target.value)}
                placeholder="Name or formula..."
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                2. If a water sample is contaminated with 4g of salt, what is its expected boiling point (°C)? (Hint: check simulator)
              </label>
              <input 
                type="number" 
                value={answer2}
                onChange={(e) => setAnswer2(e.target.value)}
                placeholder="e.g. 100"
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>

            <button 
              onClick={checkAssessment}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
            >
              Check Answers
            </button>

            {feedback && (
              <div className={`p-3 rounded-lg text-sm font-medium ${feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
