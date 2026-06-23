import { useState } from 'react';
import { Flame, Factory, Wrench, Info, ArrowLeft, ArrowDown, Settings, Play } from 'lucide-react';

interface Props {
  onExit?: () => void;
}

export default function LabC11OrganicSynthesis({ onExit }: Props) {
  // Distillation state
  const [temperature, setTemperature] = useState<number>(20);
  
  // Retrosynthesis state
  const [targetMolecule] = useState<string>('Ethanol (CH3CH2OH)');
  const [precursor1, setPrecursor1] = useState<string>('');
  const [reagent, setReagent] = useState<string>('');
  const [retroFeedback, setRetroFeedback] = useState<string | null>(null);

  // Assessment state
  const [carbonCount, setCarbonCount] = useState<string>('');
  const [crackFeedback, setCrackFeedback] = useState<string | null>(null);

  const getActiveFraction = () => {
    if (temperature < 40) return 'None';
    if (temperature < 150) return 'Gasoline (C5-C12)';
    if (temperature < 250) return 'Kerosene (C11-C15)';
    if (temperature < 350) return 'Diesel (C15-C19)';
    return 'Heavy Fuel/Bitumen (>C20)';
  };

  const checkRetrosynthesis = () => {
    if (precursor1 === 'Ethene (CH2=CH2)' && reagent === 'H2O / H+') {
      setRetroFeedback('Correct! Hydration of ethene yields ethanol.');
    } else if (precursor1 === 'Chloroethane (CH3CH2Cl)' && reagent === 'Aqueous KOH') {
      setRetroFeedback('Correct! Nucleophilic substitution yields ethanol.');
    } else {
      setRetroFeedback('Incorrect. Those precursors/reagents do not directly yield ethanol.');
    }
  };

  const checkCracking = () => {
    // Cracking Decane C10H22 -> Octane C8H18 + Ethene C2H4
    if (carbonCount === '2') {
      setCrackFeedback('Correct! C10H22 -> C8H18 + C2H4 (Ethene). Carbon is conserved.');
    } else {
      setCrackFeedback('Incorrect. Count the carbons! 10 = 8 + x.');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <header className="bg-rose-700 text-white p-4 flex justify-between items-center shadow-md shrink-0">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Factory className="w-6 h-6" /> Petrochemical & Synthesis Lab
        </h1>
        {onExit && (
          <button onClick={onExit} className="px-4 py-2 bg-rose-800 hover:bg-rose-900 rounded font-medium transition-colors">
            Exit Lab
          </button>
        )}
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 min-h-0">
        
        {/* Column 1: Theory */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-rose-600" /> Theory & Context
          </h2>
          
          <div className="space-y-4 text-sm text-slate-700">
            <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
              <h3 className="font-semibold text-rose-800 mb-2">Fractional Distillation</h3>
              <p>Crude oil is separated into fractions based on boiling points. Lighter molecules (fewer carbons) boil at lower temperatures and rise higher in the column.</p>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <h3 className="font-semibold text-amber-800 mb-2">Catalytic Cracking</h3>
              <p>Longer, less valuable alkanes are broken into shorter alkanes and alkenes using heat and a zeolite catalyst.</p>
              <p className="font-mono bg-white p-1 mt-2 rounded text-xs border border-amber-200 text-center">
                Long Alkane → Shorter Alkane + Alkene
              </p>
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <h3 className="font-semibold text-indigo-800 mb-2">Retrosynthetic Analysis</h3>
              <p>Working backwards from a target molecule to simpler precursor molecules. The "⇒" arrow means "is made from".</p>
            </div>
          </div>
        </div>

        {/* Column 2: Simulator */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 shrink-0">
            <Settings className="w-5 h-5 text-rose-600" /> Tower Simulator
          </h2>

          <div className="flex-1 flex items-center justify-center relative mb-4 min-h-[300px]">
            {/* Distillation Tower */}
            <div className="w-24 h-64 bg-slate-300 border-4 border-slate-700 rounded-t-full relative flex flex-col justify-between p-2 pb-0 z-10 shrink-0">
              {/* Trays */}
              <div className={`w-full h-1 bg-slate-400 my-2 transition-shadow ${temperature >= 40 && temperature < 150 ? 'shadow-[0_0_10px_2px_rgba(59,130,246,0.8)]' : ''}`}></div>
              <div className={`w-full h-1 bg-slate-400 my-2 transition-shadow ${temperature >= 150 && temperature < 250 ? 'shadow-[0_0_10px_2px_rgba(234,179,8,0.8)]' : ''}`}></div>
              <div className={`w-full h-1 bg-slate-400 my-2 transition-shadow ${temperature >= 250 && temperature < 350 ? 'shadow-[0_0_10px_2px_rgba(239,68,68,0.8)]' : ''}`}></div>
              <div className={`w-full h-1 bg-slate-400 my-2 transition-shadow ${temperature >= 350 ? 'shadow-[0_0_10px_2px_rgba(0,0,0,0.5)]' : ''}`}></div>
              
              {/* Heat source */}
              <div className="w-full h-8 bg-slate-800 mt-2 rounded-t flex justify-center items-end pb-1 relative">
                 {temperature > 30 && <Flame className="w-6 h-6 text-orange-500 animate-pulse absolute bottom-1 transition-transform" style={{transform: `scale(${temperature/150})`}} />}
              </div>
            </div>

            {/* Labels */}
            <div className="absolute left-1/2 ml-16 flex flex-col justify-between h-64 py-6 text-xs font-bold text-slate-400 pointer-events-none">
               <div className={`transition-colors ${temperature >= 40 && temperature < 150 ? 'text-blue-600 text-sm' : ''}`}>Gasoline (40-150°C)</div>
               <div className={`transition-colors ${temperature >= 150 && temperature < 250 ? 'text-yellow-600 text-sm' : ''}`}>Kerosene (150-250°C)</div>
               <div className={`transition-colors ${temperature >= 250 && temperature < 350 ? 'text-red-600 text-sm' : ''}`}>Diesel (250-350°C)</div>
               <div className={`transition-colors ${temperature >= 350 ? 'text-slate-900 text-sm' : ''}`}>Bitumen (&gt;350°C)</div>
            </div>
          </div>

          <div className="mt-auto shrink-0">
            <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
              <span>Furnace Temperature</span>
              <span className="font-mono text-rose-600">{temperature}°C</span>
            </label>
            <input 
              type="range" 
              min="20" 
              max="400" 
              value={temperature} 
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
            <div className="mt-4 p-3 bg-slate-100 rounded text-center text-sm font-medium border border-slate-200">
              Active Fraction: <span className="text-rose-700">{getActiveFraction()}</span>
            </div>
          </div>
        </div>

        {/* Column 3: Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col overflow-y-auto">
          
          <div className="mb-6 shrink-0">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-rose-600" /> Retrosynthesis Puzzle
            </h2>
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg flex flex-col items-center">
              <div className="font-bold text-indigo-900 mb-2 border-2 border-indigo-300 p-2 rounded bg-white">
                {targetMolecule}
              </div>
              <ArrowDown className="w-6 h-6 text-indigo-400 my-1" />
              <div className="text-xs font-mono text-indigo-600 mb-1">Select Disconnection</div>
              
              <select value={precursor1} onChange={e => setPrecursor1(e.target.value)} className="w-full p-2 text-sm border rounded mb-2 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="">Select Precursor...</option>
                <option value="Ethene (CH2=CH2)">Ethene (CH2=CH2)</option>
                <option value="Ethanal (CH3CHO)">Ethanal (CH3CHO)</option>
                <option value="Chloroethane (CH3CH2Cl)">Chloroethane (CH3CH2Cl)</option>
              </select>

              <select value={reagent} onChange={e => setReagent(e.target.value)} className="w-full p-2 text-sm border rounded mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="">Select Forward Reagent...</option>
                <option value="H2O / H+">H2O / H+ (Hydration)</option>
                <option value="Aqueous KOH">Aqueous KOH (Subst.)</option>
                <option value="KMnO4 / H+">KMnO4 / H+ (Oxidation)</option>
              </select>

              <button onClick={checkRetrosynthesis} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm w-full font-medium hover:bg-indigo-700 transition-colors">
                Check Synthesis Path
              </button>
              
              {retroFeedback && (
                <div className={`mt-3 p-2 text-xs text-center rounded border w-full font-medium ${retroFeedback.includes('Correct') ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                  {retroFeedback}
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto border-t border-slate-200 pt-4 shrink-0">
            <h3 className="font-bold text-slate-800 mb-2">Catalytic Cracking Equation</h3>
            <p className="text-sm text-slate-600 mb-3">
              Balance the cracking of Decane (C10H22) to produce Octane (C8H18) and an alkene:
            </p>
            <div className="flex items-center gap-2 font-mono text-sm mb-3 justify-center bg-slate-50 p-2 rounded border border-slate-200">
              <span>C10H22</span>
              <ArrowLeft className="w-4 h-4 mx-1 transform rotate-180 text-slate-400" />
              <span>C8H18</span>
              <span>+</span>
              <div className="flex items-center">
                <span>C</span>
                <input type="text" value={carbonCount} onChange={e => setCarbonCount(e.target.value)} className="w-8 border border-slate-300 rounded text-center mx-1 focus:outline-none focus:ring-1 focus:ring-amber-500" />
                <span>H4</span>
              </div>
            </div>
            
            <button onClick={checkCracking} className="w-full bg-amber-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-amber-600 flex justify-center items-center gap-2 transition-colors">
              <Play className="w-4 h-4 fill-white" /> Check Equation
            </button>
            
            {crackFeedback && (
              <div className={`mt-3 p-2 text-xs rounded border font-medium ${crackFeedback.includes('Correct') ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                {crackFeedback}
              </div>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
}
