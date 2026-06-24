import { useState } from 'react';
import { CheckCircle, Droplet, Flame, RotateCcw, Info } from 'lucide-react';
import LabHeader from './LabHeader';

interface TubeState {
  id: string;
  content: string; 
  reagent: string | null;
  heated: boolean;
}

export default function LabB9Biochemistry({ onExit }: { onExit: () => void }) {
  const initialTubes: TubeState[] = [
    { id: 'A', content: 'starch', reagent: null, heated: false },
    { id: 'B', content: 'protein', reagent: null, heated: false },
    { id: 'C', content: 'glucose', reagent: null, heated: false },
    { id: 'D', content: 'lipid', reagent: null, heated: false },
  ];

  const [tubes, setTubes] = useState<TubeState[]>(initialTubes);
  const [selectedTubeId, setSelectedTubeId] = useState<string>('A');
  const [waterBathOn, setWaterBathOn] = useState(false);

  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [showResults, setShowResults] = useState(false);

  const getLiquidColor = (t: TubeState) => {
    if (!t.reagent) return '#e2e8f0'; 
    if (t.reagent === 'iodine') return t.content === 'starch' ? '#1e1b4b' : '#fef08a';
    if (t.reagent === 'biuret') return t.content === 'protein' ? '#a855f7' : '#bfdbfe';
    if (t.reagent === 'benedict') {
      if (t.content === 'glucose' && t.heated) return '#ef4444'; 
      return '#3b82f6';
    }
    if (t.reagent === 'ethanol') return t.content === 'lipid' ? '#ffffff' : '#e2e8f0';
    return '#e2e8f0';
  };

  const applyReagent = (reagent: string) => {
    setTubes(prev => prev.map(t => t.id === selectedTubeId ? { ...t, reagent } : t));
  };

  const toggleHeat = () => {
    setWaterBathOn(!waterBathOn);
    if (!waterBathOn) {
      setTubes(prev => prev.map(t => ({ ...t, heated: true })));
    }
  };

  const washTubes = () => {
    setTubes(initialTubes);
    setWaterBathOn(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Biochemistry Lab" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 grow">
        {/* Theory */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Info className="mr-2 text-rose-600" /> Macromolecule Tests
          </h2>
          <div className="space-y-4 text-slate-600 text-sm">
            <p>You have 4 unknown solutions (A, B, C, D). Use the reagents to identify the macromolecule in each.</p>
            
            <div className="space-y-3">
              <div className="bg-amber-50 p-3 rounded border border-amber-100">
                <strong>1. Iodine Test (Starch)</strong><br/>
                Turns from yellow to <span className="font-bold text-indigo-900">blue-black</span> if starch is present.
              </div>
              <div className="bg-purple-50 p-3 rounded border border-purple-100">
                <strong>2. Biuret Test (Proteins)</strong><br/>
                Turns from light blue to <span className="font-bold text-purple-600">purple</span> if proteins are present.
              </div>
              <div className="bg-blue-50 p-3 rounded border border-blue-100">
                <strong>3. Benedict's Test (Reducing Sugars)</strong><br/>
                Turns from blue to <span className="font-bold text-red-500">brick-red</span> if glucose is present, <em>but requires heating in a water bath</em>.
              </div>
              <div className="bg-slate-100 p-3 rounded border border-slate-200">
                <strong>4. Ethanol Emulsion Test (Lipids)</strong><br/>
                Forms a <span className="font-bold text-white bg-slate-400 px-1 rounded">milky white</span> emulsion if lipids are present.
              </div>
            </div>
          </div>
        </div>

        {/* Simulation */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Lab Bench</h2>
            <button onClick={washTubes} className="flex items-center text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded">
              <RotateCcw className="w-4 h-4 mr-1" /> Wash Tubes
            </button>
          </div>
          
          <div className="flex justify-around items-end h-48 mb-8 border-b-4 border-slate-800 pb-2 relative">
            {tubes.map(t => (
              <div 
                key={t.id} 
                onClick={() => setSelectedTubeId(t.id)}
                className="flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-2"
              >
                <div className={`mb-2 font-bold ${selectedTubeId === t.id ? 'text-rose-600 scale-110' : 'text-slate-500'}`}>
                  Tube {t.id}
                  {selectedTubeId === t.id && <span className="block w-2 h-2 bg-rose-600 rounded-full mx-auto mt-1"></span>}
                </div>
                {/* SVG Test Tube */}
                <svg width="40" height="120" viewBox="0 0 40 120">
                  <path d="M10,0 L10,100 A10,10 0 0,0 30,100 L30,0" fill="transparent" stroke="rgba(255,255,255,0.5)" strokeWidth="4" />
                  <path d="M10,0 L10,100 A10,10 0 0,0 30,100 L30,0" fill="transparent" stroke="#cbd5e1" strokeWidth="2" />
                  <path d="M12,40 L12,100 A8,8 0 0,0 28,100 L28,40 Z" fill={getLiquidColor(t)} className="transition-colors duration-500" />
                  {t.heated && waterBathOn && <circle cx="20" cy="80" r="2" fill="white" className="animate-ping" />}
                </svg>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
            <button onClick={() => applyReagent('iodine')} className="flex items-center justify-center p-3 border border-amber-300 bg-amber-50 hover:bg-amber-100 rounded-lg font-bold text-amber-800 transition-colors">
              <Droplet className="w-4 h-4 mr-2" /> Add Iodine
            </button>
            <button onClick={() => applyReagent('biuret')} className="flex items-center justify-center p-3 border border-purple-300 bg-purple-50 hover:bg-purple-100 rounded-lg font-bold text-purple-800 transition-colors">
              <Droplet className="w-4 h-4 mr-2" /> Add Biuret
            </button>
            <button onClick={() => applyReagent('benedict')} className="flex items-center justify-center p-3 border border-blue-300 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold text-blue-800 transition-colors">
              <Droplet className="w-4 h-4 mr-2" /> Add Benedict's
            </button>
            <button onClick={() => applyReagent('ethanol')} className="flex items-center justify-center p-3 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-lg font-bold text-slate-800 transition-colors">
              <Droplet className="w-4 h-4 mr-2" /> Add Ethanol
            </button>
          </div>

          <button 
            onClick={toggleHeat} 
            className={`flex items-center justify-center p-4 rounded-lg font-bold text-white transition-colors ${waterBathOn ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            <Flame className="w-5 h-5 mr-2" /> 
            {waterBathOn ? 'Turn Off Hot Water Bath' : 'Place Tubes in Hot Water Bath'}
          </button>
        </div>

        {/* Assessment */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <CheckCircle className="mr-2 text-rose-600" /> Identification
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Based on your tests, identify the contents of Tube A and Tube C.</p>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                1. What macromolecule is in Tube A?
              </label>
              <select 
                value={q1} 
                onChange={(e) => setQ1(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-rose-500 outline-none"
              >
                <option value="">Select...</option>
                <option value="starch">Starch</option>
                <option value="protein">Protein</option>
                <option value="glucose">Glucose</option>
                <option value="lipid">Lipid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                2. What macromolecule is in Tube C?
              </label>
              <select 
                value={q2} 
                onChange={(e) => setQ2(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-rose-500 outline-none"
              >
                <option value="">Select...</option>
                <option value="starch">Starch</option>
                <option value="protein">Protein</option>
                <option value="glucose">Glucose</option>
                <option value="lipid">Lipid</option>
              </select>
            </div>

            <button 
              onClick={() => setShowResults(true)}
              className="w-full bg-rose-600 text-white font-bold py-3 rounded-lg hover:bg-rose-700 transition-colors mt-auto"
            >
              Verify Findings
            </button>

            {showResults && (
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-200">
                <p className="font-bold text-rose-800">Results:</p>
                <ul className="text-sm space-y-2 mt-2">
                  <li>Tube A: {q1 === 'starch' ? '✅ Correct (Blue-black with Iodine)' : '❌ Incorrect'}</li>
                  <li>Tube C: {q2 === 'glucose' ? "✅ Correct (Brick-red with Benedict's + Heat)" : '❌ Incorrect'}</li>
                </ul>
                <p className="mt-2 text-xs text-rose-700 font-bold">
                  (Note: Tube B is Protein, Tube D is Lipid)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
