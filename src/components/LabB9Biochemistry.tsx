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
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
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
 if (t.reagent === 'biuret') return t.content === 'protein' ? '#5560F1' : '#bfdbfe';
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
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Biochemistry Lab" />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 grow overflow-y-auto lg:overflow-visible">
  {/* Theory */}
  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
   <Info className="mr-2 text-rose-600" /> Macromolecule Tests
   </h2>
   <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] text-sm">
   <p>You have 4 unknown solutions (A, B, C, D). Use the reagents to identify the macromolecule in each.</p>
   
   <div className="space-y-3">
    <div className={`bg-amber-50 p-3 rounded border border-amber-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <strong>1. Iodine Test (Starch)</strong><br/>
    Turns from yellow to <span className="font-bold text-indigo-900 dark:text-[#ffffff]">blue-black</span> if starch is present.
    </div>
    <div className={`bg-indigo-50 p-3 rounded border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <strong>2. Biuret Test (Proteins)</strong><br/>
    Turns from light blue to <span className="font-bold text-indigo-600">purple</span> if proteins are present.
    </div>
    <div className="bg-blue-50 p-3 rounded border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
    <strong>3. Benedict's Test (Reducing Sugars)</strong><br/>
    Turns from blue to <span className="font-bold text-red-500">brick-red</span> if glucose is present, <em>but requires heating in a water bath</em>.
    </div>
    <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b]">
    <strong>4. Ethanol Emulsion Test (Lipids)</strong><br/>
    Forms a <span className="font-bold text-white bg-slate-400 dark:bg-[#121212] px-1 rounded">milky white</span> emulsion if lipids are present.
    </div>
   </div>
   </div>
  </div>

  {/* Simulation */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   <div className="flex justify-between items-center mb-6">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">Lab Bench</h2>
   <button onClick={washTubes} className="flex items-center text-sm bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] px-3 py-1 rounded">
    <RotateCcw className="w-4 h-4 mr-1" /> Wash Tubes
   </button>
   </div>
   
   <div className="flex justify-around items-end h-48 mb-8 border-b-4 border-[#1c1b1b] dark:border-[#1c1b1b] pb-2 relative">
   {tubes.map(t => (
    <div 
    key={t.id} 
    onClick={() => setSelectedTubeId(t.id)}
    className="flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-2"
    >
    <div className={`mb-2 font-bold ${selectedTubeId === t.id ? 'text-rose-600 scale-110' : 'text-slate-500 dark:text-[#a1a1aa]'}`}>
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

   <div className="grid grid-cols-2 gap-3 mb-4 mt-auto ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <button onClick={() => applyReagent('iodine')} className="flex items-center justify-center p-3 border border-amber-300 bg-amber-50 hover:bg-amber-100 rounded-lg font-bold text-amber-800 transition-colors dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff]">
    <Droplet className="w-4 h-4 mr-2" /> Add Iodine
   </button>
   <button onClick={() => applyReagent('biuret')} className="flex items-center justify-center p-3 border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-bold text-indigo-800 transition-colors dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff]">
    <Droplet className="w-4 h-4 mr-2" /> Add Biuret
   </button>
   <button onClick={() => applyReagent('benedict')} className="flex items-center justify-center p-3 border border-blue-300 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold text-blue-800 transition-colors dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff]">
    <Droplet className="w-4 h-4 mr-2" /> Add Benedict's
   </button>
   <button onClick={() => applyReagent('ethanol')} className="flex items-center justify-center p-3 border border-slate-300 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:bg-slate-100 dark:bg-[#121212] rounded-lg font-bold text-slate-800 dark:text-[#ffffff] transition-colors">
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
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
   <CheckCircle className="mr-2 text-rose-600" /> Identification
   </h2>
   
   <div className="space-y-4">
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">Based on your tests, identify the contents of Tube A and Tube C.</p>
   
   <div>
    <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">
    1. What macromolecule is in Tube A?
    </label>
    <select 
    value={q1} 
    onChange={(e) => setQ1(e.target.value)}
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-rose-500 outline-none"
    >
    <option value="">Select...</option>
    <option value="starch">Starch</option>
    <option value="protein">Protein</option>
    <option value="glucose">Glucose</option>
    <option value="lipid">Lipid</option>
    </select>
   </div>

   <div>
    <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">
    2. What macromolecule is in Tube C?
    </label>
    <select 
    value={q2} 
    onChange={(e) => setQ2(e.target.value)}
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-rose-500 outline-none"
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
    className="w-full bg-rose-600 text-white font-bold py-3 rounded-lg hover:bg-rose-700 transition-colors mt-auto dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40"
   >
    Verify Findings
   </button>

   {showResults && (
    <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
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
