import { useState, useEffect } from 'react';
import { Play, ClipboardList, CheckCircle, Flame } from 'lucide-react';
import LabHeader from './LabHeader';

interface Props {
 onExit: () => void;
}

const ChemicalBottle = ({ label, color, onClick }: { label: string, color: string, onClick: () => void }) => (
 <button onClick={onClick} className="flex flex-col items-center p-2 bg-slate-50 dark:bg-[#121212] border rounded shadow hover:bg-slate-50 dark:bg-[#121212] transition-colors">
 <div className="relative w-10 h-16 border-2 border-gray-400 rounded-b-lg rounded-t-sm overflow-hidden flex items-end">
  <div className="w-full" style={{ height: '60%', backgroundColor: color }}></div>
 </div>
 <span className="text-xs font-bold mt-1 text-gray-700 dark:text-[#ffffff]">{label}</span>
 </button>
);

const EquationDisplay = ({ equation }: { equation: string[] }) => (
 <div className="min-h-[4rem] flex flex-wrap items-center justify-center bg-[#000000] dark:bg-[#121212] text-green-400 font-mono text-sm md:text-lg rounded p-4 shadow-inner mb-4 overflow-hidden gap-y-2 text-center">
 {equation.length === 0 ? <span className="text-gray-500">Awaiting reaction...</span> : 
  equation.map((part, i) => part === 'NEWLINE' ? <div key={i} className="w-full h-1"></div> : <span key={i} className="mx-1 animate-pulse">{part}</span>)
 }
 </div>
);

const SvgGraph = ({ data, xKey, yKey, width = 300, height = 200, xLabel, yLabel }: any) => {
 if (data.length === 0) return <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center text-gray-500">No Data Logged</div>;
 
 const minX = Math.min(...data.map((d: any) => d[xKey]));
 const maxX = Math.max(...data.map((d: any) => d[xKey]), minX + 5);
 const minY = Math.min(...data.map((d: any) => d[yKey]));
 const maxY = Math.max(...data.map((d: any) => d[yKey]), minY + 5);
 
 const padX = (maxX - minX) * 0.1 || 5;
 const padY = (maxY - minY) * 0.1 || 5;
 
 const scaleX = (val: number) => 40 + ((val - (minX - padX)) / ((maxX + padX) - (minX - padX))) * (width - 60);
 const scaleY = (val: number) => height - 30 - ((val - (minY - padY)) / ((maxY + padY) - (minY - padY))) * (height - 50);

 const points = data.map((d: any) => `${scaleX(d[xKey])},${scaleY(d[yKey])}`).join(' ');

 return (
 <div className="w-full overflow-x-auto">
  <svg width={width} height={height} className="bg-slate-50 dark:bg-[#121212] rounded shadow-sm border border-gray-200">
  <line x1={40} y1={height - 30} x2={width - 20} y2={height - 30} stroke="black" strokeWidth="2" />
  <line x1={40} y1={20} x2={40} y2={height - 30} stroke="black" strokeWidth="2" />
  <polyline points={points} fill="none" stroke="red" strokeWidth="2" />
  {data.map((d: any, i: number) => (
   <circle key={i} cx={scaleX(d[xKey])} cy={scaleY(d[yKey])} r="4" fill="blue" />
  ))}
  <text x={width / 2} y={height - 5} fontSize="12" textAnchor="middle">{xLabel}</text>
  <text x={10} y={height / 2} fontSize="12" textAnchor="middle" transform={`rotate(-90, 10, ${height / 2})`}>{yLabel}</text>
  </svg>
 </div>
 );
};

export default function LabC9Electrochemistry({ onExit }: Props) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [activeTab] = useState<'redox' | 'rust'>('redox');
 const [equation, setEquation] = useState<string[]>([]);
 
 // Redox State (KMnO4 + FeSO4)
 const [volAdded, setVolAdded] = useState<number>(0);
 const [temp, setTemp] = useState<number>(20.0);
 const [beakerColor, setBeakerColor] = useState<string>('rgba(200,200,200,0.1)');
 const [titrationData, setTitrationData] = useState<Array<{id: number, vol: number, temp: number}>>([]);

 // Rusting State
 const [hasWater, setHasWater] = useState<boolean>(false);
 const [hasOxygen, setHasOxygen] = useState<boolean>(false);
 const [hasSalt, setHasSalt] = useState<boolean>(false);
 const [rustLevel, setRustLevel] = useState<number>(0);
 const [timeDays, setTimeDays] = useState<number>(0);

 // Assessment
 const [answer, setAnswer] = useState<string>('');
 const [feedback, setFeedback] = useState<string>('');

 // Redox Logic
 const addTitrant = () => {
 if (volAdded >= 100) return;
 setEquation(['MnO4-(aq)', '+', '5Fe2+(aq)', '+', '8H+(aq)']);
 setTimeout(() => {
  setVolAdded(v => {
  const newV = v + 10;
  let newTemp = 20.0;
  if (newV <= 50) {
   // Exothermic reaction until equivalence point (50mL)
   newTemp = 20 + newV * 0.2;
   setBeakerColor('rgba(200,200,200,0.1)'); // Fe3+ is pale yellow but mostly clear here
   setEquation(prev => [...prev.filter(p => p !== 'NEWLINE'), 'NEWLINE', '->', 'Mn2+(aq)', '+', '5Fe3+(aq)', '+', '4H2O(l)']);
  } else {
   // Cooling down after equivalence point
   newTemp = 20 + 50 * 0.2 - (newV - 50) * 0.05;
   setBeakerColor('rgba(128,0,128,0.5)'); // Purple KMnO4 excess
   setEquation(['Excess MnO4- remains']);
  }
  setTemp(Number(newTemp.toFixed(1)));
  return newV;
  });
 }, 800);
 };

 const recordRedoxData = () => {
 setTitrationData(prev => [...prev, { id: Date.now(), vol: volAdded, temp }]);
 };

 // Rusting Logic
 useEffect(() => {
 if (activeTab !== 'rust') return;
 const interval = setInterval(() => {
  setTimeDays(t => t + 1);
  if (hasWater && hasOxygen) {
  const rate = hasSalt ? 4 : 1;
  setRustLevel(r => Math.min(r + rate, 100));
  setEquation(['4Fe(s)', '+', '3O2(g)', '+', '6H2O(l)', 'NEWLINE', '->', '4Fe(OH)3(s)']);
  } else {
  setEquation(['No reaction (requires O2 and H2O)']);
  }
 }, 1000);
 return () => clearInterval(interval);
 }, [hasWater, hasOxygen, hasSalt, activeTab]);

 const checkAnswer = () => {
 if (activeTab === 'redox') {
  const val = parseFloat(answer);
  if (Math.abs(val - 50) < 2) setFeedback("Correct! The peak temperature indicates the equivalence point at 50 mL.");
  else setFeedback("Incorrect. Look for the peak on the temperature vs volume graph.");
 } else {
  if (answer.trim().toLowerCase().includes('salt') || answer.trim().toLowerCase().includes('nacl')) {
  setFeedback("Correct! Salt acts as an electrolyte to accelerate the rusting process.");
  } else {
  setFeedback("Incorrect. What did you add to make it rust faster?");
  }
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} variant="blue" title="Grade 9 Chemistry: Electrochemistry & Redox" />

  
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
  {/* Theory Column */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-4 rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 flex items-center text-orange-800"><ClipboardList className="mr-2" /> Theory & Setup</h2>
   {activeTab === 'redox' ? (
   <div className="space-y-4 text-slate-700 dark:text-[#ffffff]">
    <p><strong>Redox Reactions:</strong> A reaction involving the transfer of electrons. Potassium Permanganate (KMnO₄) is a strong oxidizing agent that is deep purple, but turns colorless (Mn²⁺) when reduced by Fe²⁺.</p>
    <p><strong>Thermochemistry:</strong> This redox reaction is exothermic. By tracking temperature changes as we add titrant, we can locate the equivalence point where temperature peaks.</p>
    <p><strong>Experiment:</strong> Add 10mL increments of KMnO₄ to the FeSO₄ beaker. Record volume and temperature, then find the equivalence point.</p>
   </div>
   ) : (
   <div className="space-y-4 text-slate-700 dark:text-[#ffffff]">
    <p><strong>Corrosion of Iron (Rusting):</strong> Rusting is an electrochemical redox process. Iron oxidizes to form hydrated iron(III) oxide.</p>
    <p><strong>Conditions for Rusting:</strong> Both water (H₂O) and oxygen (O₂) must be present. Electrolytes like salt (NaCl) accelerate the rate of corrosion.</p>
    <p><strong>Experiment:</strong> Subject an iron nail to different conditions and observe the rate of rust formation over simulated days.</p>
   </div>
   )}
  </div>

  {/* Simulation Column */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] p-4 rounded-lg shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold mb-4 flex items-center text-orange-800 w-full"><Flame className="mr-2" /> Interactive Simulator</h2>
   
   <EquationDisplay equation={equation} />

   {activeTab === 'redox' ? (
   <div className="flex flex-col w-full items-center">
    <div className="mb-4">
    <ChemicalBottle label="Add 10mL KMnO₄" color="#800080" onClick={addTitrant} />
    </div>

    <div className={`relative w-48 h-64 border-4 border-gray-300 rounded-b-3xl rounded-t-sm flex items-end justify-center bg-gray-50 overflow- shadow-inner mb-4 flex-col `}>
    <div className="w-full transition-all duration-1000" style={{ height: `${40 + volAdded/2}%`, backgroundColor: beakerColor }}></div>
    
    {/* SVG Thermometer */}
    <div className="absolute right-4 top-10 w-6 h-32 bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] border-2 border-gray-400 rounded-full flex flex-col justify-end items-center pb-1 z-10 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
     <div className="w-2 rounded-t-full bg-red-500 transition-all duration-500" style={{ height: `${(temp - 20) * 8}px` }}></div>
     <div className="w-4 h-4 bg-red-500 rounded-full absolute bottom-1"></div>
    </div>
    <div className="absolute right-12 top-20 text-sm font-bold text-red-600 bg-slate-50 dark:bg-[#121212]/80 px-1 rounded">{temp.toFixed(1)}°C</div>
    </div>
    <div className="text-sm font-bold text-gray-600">Total Volume Added: {volAdded} mL</div>
   </div>
   ) : (
   <div className="flex flex-col w-full items-center">
    <div className="flex gap-4 mb-8">
    <button onClick={() => setHasWater(!hasWater)} className={`px-4 py-2 text-white rounded font-bold ${hasWater ? 'bg-blue-600' : 'bg-gray-400'}`}>Toggle Water</button>
    <button onClick={() => setHasOxygen(!hasOxygen)} className={`px-4 py-2 text-white rounded font-bold ${hasOxygen ? 'bg-green-600' : 'bg-gray-400'}`}>Toggle Oxygen</button>
    <button onClick={() => setHasSalt(!hasSalt)} className={`px-4 py-2 text-white rounded font-bold ${hasSalt ? 'bg-yellow-500' : 'bg-gray-400'}`}>Toggle Salt</button>
    </div>

    <div className="relative w-64 h-32 border-b-4 border-gray-400 flex items-center justify-center bg-sky-50 overflow-hidden">
    {/* Iron Nail */}
    <div className="relative w-48 h-6 bg-slate-400 dark:bg-[#121212] rounded flex items-center justify-end shadow-inner border border-slate-500 dark:border-[#1c1b1b]">
     <div className="w-4 h-8 bg-slate-500 dark:bg-[#121212] rounded-r-sm mr-[-4px]"></div>
     {/* Rust Overlay */}
     <div className="absolute inset-0 bg-orange-800 mix-blend-color-burn" style={{ opacity: rustLevel / 100 }}></div>
    </div>
    {/* Water overlay */}
    {hasWater && <div className="absolute bottom-0 w-full h-16 bg-blue-500/30 dark:bg-teal-950/20 dark:border-teal-900"></div>}
    </div>
    
    <div className="mt-4 text-center">
    <div className="text-xl font-mono text-gray-700 dark:text-[#ffffff]">Day: {timeDays}</div>
    <div className="text-sm text-orange-800 font-bold">Rust Level: {rustLevel.toFixed(0)}%</div>
    </div>
   </div>
   )}
  </div>

  {/* Data & Assessment Column */}
  <div className="bg-slate-50 dark:!bg-[#121212] p-4 rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <h2 className="text-xl font-bold mb-4 flex items-center text-orange-800"><CheckCircle className="mr-2" /> Data & Analysis</h2>
   
   {activeTab === 'redox' && (
   <>
    <button onClick={recordRedoxData} className="mb-4 w-full py-2 bg-orange-100 text-orange-800 rounded font-bold hover:bg-orange-200 flex items-center justify-center">
    <Play className="mr-2" size={16} /> Record Measurement
    </button>

    <div className="flex-grow lg:overflow-y-auto mb-4 border rounded">
    <table className="w-full text-sm text-left">
     <thead className="bg-gray-50 sticky top-0">
     <tr><th className="p-2">KMnO₄ Added (mL)</th><th className="p-2">Temp (°C)</th></tr>
     </thead>
     <tbody>
     {titrationData.map(d => (
      <tr key={d.id} className="border-t"><td className="p-2">{d.vol}</td><td className="p-2">{d.temp.toFixed(1)}</td></tr>
     ))}
     </tbody>
    </table>
    </div>

    <div className="mb-4">
     <SvgGraph data={titrationData} xKey="vol" yKey="temp" xLabel="Volume (mL)" yLabel="Temperature (°C)" />
    </div>
   </>
   )}

   <div className={`bg-orange-50 p-4 rounded border border-orange-100 ${activeTab === 'rust' ? 'mt-auto' : ''}`}>
   <h3 className="font-bold text-orange-900 mb-2">Assessment</h3>
   <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-2">
    {activeTab === 'redox' 
    ? "Based on the thermometric data graph, what volume of KMnO₄ corresponds to the equivalence point?" 
    : "Which of the toggled chemicals acts as an electrolyte to rapidly accelerate the rusting reaction?"}
   </p>
   <div className="flex gap-2">
    <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder={activeTab === 'redox' ? "Enter volume..." : "Enter chemical..."} className="flex-grow p-2 border rounded" />
    <button onClick={checkAnswer} className="px-4 py-2 bg-orange-600 text-white rounded font-bold hover:bg-orange-700 dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40">Check</button>
   </div>
   {feedback && <div className={`mt-2 text-sm font-bold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>}
   </div>
  </div>
  </div>
 </div>
 );
}
