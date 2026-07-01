import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Info, CheckCircle, Database } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit?: () => void;
}

export default function LabC10CondensationPolymerisation({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [acidMoles, setAcidMoles] = useState<number>(10);
 const [alcoholMoles, setAlcoholMoles] = useState<number>(10);
 const [temp, setTemp] = useState<number>(250);
 
 const [isReacting, setIsReacting] = useState<boolean>(false);
 const [progress, setProgress] = useState<number>(0);
 
 interface DataPoint {
  acid: number;
  alcohol: number;
  temp: number;
  waterMass: number;
  petMoles: number;
 }
 const [data, setData] = useState<DataPoint[]>([]);
 
 const [unknownMoles] = useState<number>(Math.floor(Math.random() * 50) + 10);
 const [assessmentAns, setAssessmentAns] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const animationRef = useRef<number>(0);

 useEffect(() => {
  if (isReacting) {
   const reactionSpeed = (temp / 300) * 0.5;
   const animate = () => {
    setProgress(p => {
     if (p >= 100) {
      setIsReacting(false);
      return 100;
     }
     return p + reactionSpeed;
    });
    animationRef.current = requestAnimationFrame(animate);
   };
   animationRef.current = requestAnimationFrame(animate);
  }
  return () => {
   if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };
 }, [isReacting, temp]);

 const handleReact = () => {
  setProgress(0);
  setIsReacting(true);
 };

 const handleReset = () => {
  setProgress(0);
  setIsReacting(false);
 };

 const limitingMoles = Math.min(acidMoles, alcoholMoles);
 const waterMoles = 2 * limitingMoles * (progress / 100);
 const waterMass = waterMoles * 18.015;

 const recordData = () => {
  setData([...data, {
   acid: acidMoles,
   alcohol: alcoholMoles,
   temp,
   waterMass: parseFloat(waterMass.toFixed(2)),
   petMoles: parseFloat((limitingMoles * (progress / 100)).toFixed(2))
  }]);
 };

 const checkAnswer = () => {
  const expected = 2 * unknownMoles * 18.015;
  if (Math.abs(parseFloat(assessmentAns) - expected) < 2) {
   setIsCorrect(true);
  } else {
   setIsCorrect(false);
  }
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Condensation Polymerisation: PET Synthesis" />

   
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 flex-grow overflow-y-auto lg:overflow-visible">
    <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-lg p-4 flex flex-col space-y-4 border border-slate-200 dark:border-[#1c1b1b]  ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-semibold flex items-center"><Info className="mr-2 text-indigo-600"/> Setup & Theory</h2>
     <p className="text-sm text-slate-700 dark:text-[#ffffff]">
      Condensation polymerisation joins monomers by eliminating small molecules like water. 
      PET is made from terephthalic acid (a dicarboxylic acid) and ethylene glycol (a diol).
      Each linkage forms an ester bond and releases H₂O.
     </p>
     
     <div className="space-y-4 mt-4">
      <div>
       <label className="block text-sm font-medium">Terephthalic Acid (moles): {acidMoles}</label>
       <input type="range" min="1" max="50" value={acidMoles} onChange={(e) => setAcidMoles(parseInt(e.target.value))} className="w-full" disabled={isReacting || progress > 0} />
      </div>
      <div>
       <label className="block text-sm font-medium">Ethylene Glycol (moles): {alcoholMoles}</label>
       <input type="range" min="1" max="50" value={alcoholMoles} onChange={(e) => setAlcoholMoles(parseInt(e.target.value))} className="w-full" disabled={isReacting || progress > 0} />
      </div>
      <div>
       <label className="block text-sm font-medium">Temperature (°C): {temp}</label>
       <input type="range" min="100" max="300" value={temp} onChange={(e) => setTemp(parseInt(e.target.value))} className="w-full" disabled={isReacting || progress > 0} />
      </div>
      
      <div className="flex space-x-2 pt-4">
       <button onClick={handleReact} disabled={isReacting || progress > 0} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 flex justify-center items-center dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
        <Play className="w-4 h-4 mr-1"/> React
       </button>
       <button onClick={handleReset} className="flex-1 bg-slate-600 dark:bg-[#121212] text-white py-2 rounded hover:bg-slate-700 dark:bg-[#121212] flex justify-center items-center dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">
        <RotateCcw className="w-4 h-4 mr-1"/> Reset
       </button>
      </div>
     </div>
    </div>

    <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-lg p-4 flex flex-col items-center justify-center border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative overflow-  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-xl font-semibold absolute top-4 left-4">Molecular View</h2>
     <div className="w-full h-64 mt-12 bg-slate-100 dark:bg-[#121212] rounded border border-slate-300 dark:border-[#1c1b1b] relative flex items-center justify-center overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 500 200">
       <g transform="translate(50, 100)">
        <rect x="0" y="-15" width="40" height="30" fill="#3b82f6" rx="4" />
        <text x="20" y="5" fill="white" fontSize="12" textAnchor="middle">Acid</text>
        
        <rect x={60 - (20 * progress / 100)} y="-15" width="40" height="30" fill="#ef4444" rx="4" />
        <text x={80 - (20 * progress / 100)} y="5" fill="white" fontSize="12" textAnchor="middle">Diol</text>

        <rect x={120 - (40 * progress / 100)} y="-15" width="40" height="30" fill="#3b82f6" rx="4" />
        <text x={140 - (40 * progress / 100)} y="5" fill="white" fontSize="12" textAnchor="middle">Acid</text>

        <rect x={180 - (60 * progress / 100)} y="-15" width="40" height="30" fill="#ef4444" rx="4" />
        <text x={200 - (60 * progress / 100)} y="5" fill="white" fontSize="12" textAnchor="middle">Diol</text>

        {progress > 30 && (
         <circle cx="50" cy={-20 + (progress)} r="4" fill="#0ea5e9" opacity={1 - progress/100} />
        )}
        {progress > 60 && (
         <circle cx="110" cy={-40 + (progress)} r="4" fill="#0ea5e9" opacity={1 - progress/100} />
        )}
        {progress > 80 && (
         <circle cx="170" cy={-60 + (progress)} r="4" fill="#0ea5e9" opacity={1 - progress/100} />
        )}
       </g>
      </svg>
      
      <div className="absolute bottom-2 left-2 text-sm font-semibold">Limiting Reactant: {acidMoles < alcoholMoles ? 'Acid' : alcoholMoles < acidMoles ? 'Diol' : 'None (Equimolar)'}</div>
      <div className="absolute bottom-2 right-2 text-sm font-semibold text-blue-600">Water Released: {waterMass.toFixed(1)} g</div>
     </div>
     <div className="mt-4 text-center w-full px-4">
      <p className="text-sm font-mono overflow-x-auto whitespace-nowrap">
       n HOOC-C₆H₄-COOH + n HO-CH₂-CH₂-OH &rarr; [-OC-C₆H₄-COO-CH₂-CH₂-O-]<sub className="text-xs">n</sub> + 2n H₂O
      </p>
     </div>
    </div>

    <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-lg p-4 flex flex-col space-y-4 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b]  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
     <h2 className="text-xl font-semibold flex items-center"><Database className="mr-2 text-indigo-600"/> Data & Analysis</h2>
     
     <button onClick={recordData} disabled={progress < 100} className="w-full bg-indigo-100 text-indigo-700 py-2 rounded font-medium hover:bg-indigo-200 disabled:opacity-50">
      Record Final Yield
     </button>

     <div className="flex-1 lg:overflow-y-auto">
      <table className="w-full text-sm text-left border-collapse">
       <thead className="bg-slate-100 dark:bg-[#121212]">
        <tr>
         <th className="p-2 border">Acid(mol)</th>
         <th className="p-2 border">Diol(mol)</th>
         <th className="p-2 border">H₂O(g)</th>
        </tr>
       </thead>
       <tbody>
        {data.map((d, i) => (
         <tr key={i} className="border-b">
          <td className="p-2 border">{d.acid}</td>
          <td className="p-2 border">{d.alcohol}</td>
          <td className="p-2 border">{d.waterMass}</td>
         </tr>
        ))}
       </tbody>
      </table>
     </div>

     <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded">
      <h3 className="font-semibold text-sm mb-2 flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-600"/> Assessment</h3>
      <p className="text-xs mb-2">If {unknownMoles} moles of terephthalic acid fully react with excess ethylene glycol, what mass of water (in g) is released? (Assume 2 water molecules per repeating unit, H₂O = 18.015 g/mol)</p>
      <div className="flex space-x-2">
       <input type="number" value={assessmentAns} onChange={(e) => setAssessmentAns(e.target.value)} placeholder="Mass (g)" className="flex-1 px-2 py-1 border rounded text-sm"/>
       <button onClick={checkAnswer} className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">Check</button>
      </div>
      {isCorrect !== null && (
       <p className={`text-xs mt-2 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
        {isCorrect ? 'Correct! Mass = 2 * n * 18.015.' : 'Incorrect. Check your stoichiometry.'}
       </p>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
