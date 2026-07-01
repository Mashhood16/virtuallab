import { useState } from 'react';
import { ArrowLeft, Box, Landmark, Users, CheckCircle2, XCircle } from 'lucide-react';

export default function LabM8RootsFinance({ onExit }: { onExit?: () => void }) {
 const [activeTab, setActiveTab] = useState<'volume' | 'partnership' | 'inheritance'>('volume');

 // Volume State
 const perfectCubes = [125, 216, 343, 512, 729, 1000, 1331, 1728, 2197, 2744, 3375, 4096, 5832, 8000];
 const [cubeIndex, setCubeIndex] = useState(5); // 1000
 const volume = perfectCubes[cubeIndex];
 const [volAns, setVolAns] = useState('');
 const [volFeedback, setVolFeedback] = useState<{status: 'idle'|'correct'|'incorrect', msg: string}>({status: 'idle', msg: ''});
 const sideLength = Math.round(Math.pow(volume, 1/3));

 const checkVol = () => {
 if (Math.abs(parseFloat(volAns) - sideLength) < 0.1) {
  setVolFeedback({status: 'correct', msg: 'Correct! You calculated the cube root (side length).'});
 } else {
  setVolFeedback({status: 'incorrect', msg: `Incorrect. Try taking the cube root of ${volume}.`});
 }
 };

 // Partnership State
 const [invA, setInvA] = useState(5000);
 const [timeA, setTimeA] = useState(12);
 const [invB, setInvB] = useState(8000);
 const [timeB, setTimeB] = useState(6);
 const [profit, setProfit] = useState(3000);
 const [partAns, setPartAns] = useState('');
 const [partFeedback, setPartFeedback] = useState<{status: 'idle'|'correct'|'incorrect', msg: string}>({status: 'idle', msg: ''});

 const ratioA = invA * timeA;
 const ratioB = invB * timeB;
 const totalRatio = ratioA + ratioB;
 const shareA = totalRatio > 0 ? (ratioA / totalRatio) * profit : 0;
 const shareB = totalRatio > 0 ? (ratioB / totalRatio) * profit : 0;

 const checkPart = () => {
 if (Math.abs(parseFloat(partAns) - shareA) < 1) {
  setPartFeedback({status: 'correct', msg: 'Correct! You calculated Partner A\'s share.'});
 } else {
  setPartFeedback({status: 'incorrect', msg: `Incorrect. The investment ratio is ${ratioA}:${ratioB}.`});
 }
 };

 // Inheritance State
 const estateOptions = [24000, 48000, 72000, 96000, 120000, 144000, 240000];
 const [estateIdx, setEstateIdx] = useState(2); // 72000
 const estate = estateOptions[estateIdx];
 const [hasWidow, setHasWidow] = useState(true);
 const [hasMother, setHasMother] = useState(true);
 const [sons, setSons] = useState(1);
 const [daughters, setDaughters] = useState(1);
 
 const [inhAns, setInhAns] = useState('');
 const [inhFeedback, setInhFeedback] = useState<{status: 'idle'|'correct'|'incorrect', msg: string}>({status: 'idle', msg: ''});

 const childrenCount = sons + daughters;
 const widowShare = (hasWidow && childrenCount > 0) ? estate * (1/8) : (hasWidow ? estate * (1/4) : 0);
 const motherShare = (hasMother && childrenCount > 0) ? estate * (1/6) : (hasMother ? estate * (1/3) : 0);
 const remaining = Math.max(0, estate - widowShare - motherShare);
 
 const childTotalShares = (sons * 2) + daughters;
 const singleDaughterShare = childTotalShares > 0 ? remaining / childTotalShares : 0;
 const singleSonShare = singleDaughterShare * 2;

 const checkInh = () => {
 if (childrenCount === 0) {
  setInhFeedback({status: 'incorrect', msg: 'Please add at least one child (son/daughter) to calculate.'});
  return;
 }
 if (Math.abs(parseFloat(inhAns) - singleDaughterShare) < 1) {
  setInhFeedback({status: 'correct', msg: 'Correct! You calculated a daughter\'s exact share.'});
 } else {
  setInhFeedback({status: 'incorrect', msg: 'Incorrect. Remember to subtract Widow and Mother shares first if children exist, then split remaining (Sons:2, Daughters:1).'});
 }
 };

 // Isometric math for Volume SVG
 const s = sideLength * 2.5; // Scale up visual
 const p0 = "0,0";
 const p1 = `0,${-s}`;
 const p2 = `${s*0.866},${-s*0.5}`;
 const p3 = `${s*0.866},${s*0.5}`;
 const p4 = `0,${s}`;
 const p5 = `${-s*0.866},${s*0.5}`;
 const p6 = `${-s*0.866},${-s*0.5}`;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff]">
  <header className="flex items-center p-4 border-b border-slate-200 dark:border-[#1c1b1b] shrink-0 overflow-x-auto">
  <button onClick={onExit} className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap flex-shrink-0">
   <ArrowLeft className="w-6 h-6" />
  </button>
  <h1 className="text-lg md:text-xl font-bold flex-1 whitespace-nowrap mr-4">Class 8: Roots & Finance Labs</h1>
  <div className="flex flex-wrap gap-2">
   <button 
   onClick={() => setActiveTab('volume')}
   className={`px-4 py-2 rounded-md font-medium whitespace-nowrap flex-shrink-0 transition-colors ${activeTab === 'volume' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] hover:bg-slate-300 dark:hover:bg-slate-600'}`}
   >
   <Box className="w-4 h-4 inline-block mr-2" />
   Cube Roots
   </button>
   <button 
   onClick={() => setActiveTab('partnership')}
   className={`px-4 py-2 rounded-md font-medium whitespace-nowrap flex-shrink-0 transition-colors ${activeTab === 'partnership' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] hover:bg-slate-300 dark:hover:bg-slate-600'}`}
   >
   <Landmark className="w-4 h-4 inline-block mr-2" />
   Partnership
   </button>
   <button 
   onClick={() => setActiveTab('inheritance')}
   className={`px-4 py-2 rounded-md font-medium whitespace-nowrap flex-shrink-0 transition-colors ${activeTab === 'inheritance' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] hover:bg-slate-300 dark:hover:bg-slate-600'}`}
   >
   <Users className="w-4 h-4 inline-block mr-2" />
   Inheritance
   </button>
  </div>
  </header>

  <main className="flex flex-1 lg:overflow-hidden flex-col lg:flex-row">
  {/* Left Column: Controls */}
  <div className="flex-1 min-w-0 lg:w-1/2 p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6">
   
   {activeTab === 'volume' && (
   <>
    <div className="bg-white dark:!bg-[#121212] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
     <Box className="w-5 h-5 text-blue-500" />
     Architectural Volume Simulator
    </h2>
    <div className="space-y-6">
     <div>
     <label className="block text-sm font-medium mb-1">Volume of Cubic Structure (m³)</label>
     <input 
      type="range" min="0" max={perfectCubes.length - 1} 
      value={cubeIndex} onChange={(e) => setCubeIndex(parseInt(e.target.value))}
      className="w-full accent-blue-600"
     />
     <div className="text-right font-mono text-lg font-bold text-blue-600 dark:text-blue-400">{volume} m³</div>
     </div>
    </div>
    </div>

    <div className="bg-white dark:!bg-[#121212] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-bold mb-4">Assessment</h2>
    <p className="mb-4 text-sm">
     Find the exact side length of the cubic structure by calculating the <strong>cube root</strong> of the volume.
    </p>
    <div className="flex items-center gap-3">
     <input 
     type="number" 
     value={volAns} 
     onChange={e => setVolAns(e.target.value)}
     placeholder="Side Length (m)"
     className="flex-1 min-w-0 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg dark:bg-[#121212]"
     />
     <button onClick={checkVol} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap flex-shrink-0 transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
     Check Answer
     </button>
    </div>
    {volFeedback.status !== 'idle' && (
     <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${volFeedback.status === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
     {volFeedback.status === 'correct' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
     <span>{volFeedback.msg}</span>
     </div>
    )}
    </div>
   </>
   )}

   {activeTab === 'partnership' && (
   <>
    <div className="bg-white dark:!bg-[#121212] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
     <Landmark className="w-5 h-5 text-green-500" />
     Compound Partnership
    </h2>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
     {/* Partner A */}
     <div className="space-y-4 bg-slate-50 dark:bg-[#121212]/50 p-4 rounded-lg border border-slate-100 dark:border-[#1c1b1b]">
     <h3 className="font-bold text-blue-600 dark:text-blue-400 border-b border-blue-200 dark:border-blue-800 pb-2">Partner A</h3>
     <div>
      <label className="block text-sm font-medium mb-1">Investment ($)</label>
      <input type="number" step="1000" value={invA} onChange={e => setInvA(parseInt(e.target.value)||0)} className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-[#1c1b1b]" />
     </div>
     <div>
      <label className="block text-sm font-medium mb-1">Duration (Months)</label>
      <input type="range" min="1" max="12" value={timeA} onChange={e => setTimeA(parseInt(e.target.value))} className="w-full accent-blue-600" />
      <div className="text-right text-xs font-mono font-bold">{timeA} mos</div>
     </div>
     </div>
     
     {/* Partner B */}
     <div className="space-y-4 bg-slate-50 dark:bg-[#121212]/50 p-4 rounded-lg border border-slate-100 dark:border-[#1c1b1b]">
     <h3 className="font-bold text-green-600 dark:text-green-400 border-b border-green-200 dark:border-green-800 pb-2">Partner B</h3>
     <div>
      <label className="block text-sm font-medium mb-1">Investment ($)</label>
      <input type="number" step="1000" value={invB} onChange={e => setInvB(parseInt(e.target.value)||0)} className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-[#1c1b1b]" />
     </div>
     <div>
      <label className="block text-sm font-medium mb-1">Duration (Months)</label>
      <input type="range" min="1" max="12" value={timeB} onChange={e => setTimeB(parseInt(e.target.value))} className="w-full accent-green-600" />
      <div className="text-right text-xs font-mono font-bold">{timeB} mos</div>
     </div>
     </div>
    </div>

    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg">
     <label className="block text-sm font-bold mb-1 text-yellow-800 dark:text-yellow-500">Total Profit Earned ($)</label>
     <input type="number" step="1000" value={profit} onChange={e => setProfit(parseInt(e.target.value)||0)} className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-[#1c1b1b] font-bold" />
    </div>
    </div>

    <div className="bg-white dark:!bg-[#121212] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-bold mb-4">Assessment</h2>
    <p className="mb-4 text-sm">
     Calculate <strong>Partner A's</strong> exact share of the profit using equivalent investment ratios.
    </p>
    <div className="flex items-center gap-3">
     <span className="font-bold text-lg">$</span>
     <input 
     type="number" 
     value={partAns} 
     onChange={e => setPartAns(e.target.value)}
     placeholder="Partner A's Share"
     className="flex-1 min-w-0 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg dark:bg-[#121212]"
     />
     <button onClick={checkPart} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap flex-shrink-0 transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
     Check Answer
     </button>
    </div>
    {partFeedback.status !== 'idle' && (
     <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${partFeedback.status === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
     {partFeedback.status === 'correct' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
     <span>{partFeedback.msg}</span>
     </div>
    )}
    </div>
   </>
   )}

   {activeTab === 'inheritance' && (
   <>
    <div className="bg-white dark:!bg-[#121212] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
     <Users className="w-5 h-5 text-indigo-500" />
     Islamic Inheritance Split
    </h2>
    <div className="space-y-6">
     <div>
     <label className="block text-sm font-medium mb-1">Net Estate ($)</label>
     <input 
      type="range" min="0" max={estateOptions.length - 1} 
      value={estateIdx} onChange={(e) => setEstateIdx(parseInt(e.target.value))}
      className="w-full accent-indigo-600"
     />
     <div className="text-right font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">${estate}</div>
     </div>

     <div className="grid grid-cols-2 gap-4">
     <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg cursor-pointer">
      <input type="checkbox" checked={hasWidow} onChange={e => setHasWidow(e.target.checked)} className="w-5 h-5 accent-indigo-600" />
      <span className="font-medium text-sm">Widow Survives</span>
     </label>
     <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg cursor-pointer">
      <input type="checkbox" checked={hasMother} onChange={e => setHasMother(e.target.checked)} className="w-5 h-5 accent-orange-600" />
      <span className="font-medium text-sm">Mother Survives</span>
     </label>
     </div>

     <div className="grid grid-cols-2 gap-4">
     <div>
      <label className="block text-sm font-medium mb-1 text-blue-600 dark:text-blue-400">Number of Sons</label>
      <input type="number" min="0" max="10" value={sons} onChange={e => setSons(parseInt(e.target.value)||0)} className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-[#1c1b1b]" />
     </div>
     <div>
      <label className="block text-sm font-medium mb-1 text-pink-600 dark:text-pink-400">Number of Daughters</label>
      <input type="number" min="0" max="10" value={daughters} onChange={e => setDaughters(parseInt(e.target.value)||0)} className="w-full p-2 border rounded-md dark:bg-slate-950 dark:border-[#1c1b1b]" />
     </div>
     </div>
    </div>
    </div>

    <div className="bg-white dark:!bg-[#121212] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h2 className="text-lg font-bold mb-4">Assessment</h2>
    <p className="mb-4 text-sm">
     Calculate the exact financial share allocated to <strong>ONE Daughter</strong> (assuming 2:1 ratio for sons to daughters from the remainder).
    </p>
    <div className="flex items-center gap-3">
     <span className="font-bold text-lg">$</span>
     <input 
     type="number" 
     value={inhAns} 
     onChange={e => setInhAns(e.target.value)}
     placeholder="Daughter's Share"
     className="flex-1 min-w-0 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg dark:bg-[#121212]"
     />
     <button onClick={checkInh} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap flex-shrink-0 transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
     Check Answer
     </button>
    </div>
    {inhFeedback.status !== 'idle' && (
     <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${inhFeedback.status === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
     {inhFeedback.status === 'correct' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
     <span>{inhFeedback.msg}</span>
     </div>
    )}
    </div>
   </>
   )}

  </div>

  {/* Right Column: Simulation Stage */}
  <div className="flex-1 min-w-0 lg:w-1/2 p-6 flex flex-col items-center justify-start bg-slate-100 dark:bg-slate-950 relative lg:overflow-y-auto">
   
   {activeTab === 'volume' && (
   <div className="flex flex-col items-center justify-center w-full h-full max-w-lg">
    <h3 className="text-xl font-bold mb-8 text-center">3D Cube Representation</h3>
    
    <div className="w-full aspect-square relative bg-white dark:!bg-[#121212] rounded-xl shadow-lg border border-slate-200 dark:border-[#1c1b1b] flex items-center justify-center">
    <svg viewBox="-100 -100 200 200" className="w-full h-full max-w-[80%] max-h-[80%] overflow-visible drop-shadow-xl transition-all duration-500">
     {/* Isometric Cube Faces */}
     <polygon points={`${p0} ${p2} ${p1} ${p6}`} fill="#60a5fa" stroke="#3b82f6" strokeWidth="1" className="dark:fill-blue-500 dark:stroke-blue-400 transition-all duration-300"/>
     <polygon points={`${p0} ${p2} ${p3} ${p4}`} fill="#3b82f6" stroke="#2563eb" strokeWidth="1" className="dark:fill-blue-600 dark:stroke-blue-500 transition-all duration-300"/>
     <polygon points={`${p0} ${p6} ${p5} ${p4}`} fill="#93c5fd" stroke="#60a5fa" strokeWidth="1" className="dark:fill-blue-400 dark:stroke-blue-300 transition-all duration-300"/>
     
     {/* Dimension Annotations */}
     <line x1="2" y1={s + 5} x2={s*0.866 + 2} y2={s*0.5 + 5} stroke="currentColor" strokeWidth="1.5" className="text-slate-500 dark:text-[#71717a]" />
     <text x={s*0.433 + 6} y={s*0.75 + 16} fontSize="10" textAnchor="middle" fill="currentColor" className="font-mono font-bold text-slate-700 dark:text-[#a1a1aa]">
     ? m
     </text>
    </svg>
    </div>
    <div className="mt-6 text-center text-slate-600 dark:text-[#71717a] bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] w-full">
    Volume = Side × Side × Side = <span className="font-bold text-slate-800 dark:text-[#ffffff]">{volume} m³</span>
    </div>
   </div>
   )}

   {activeTab === 'partnership' && (
   <div className="flex flex-col items-center justify-center w-full h-full max-w-lg">
    <h3 className="text-xl font-bold mb-8 text-center">Profit Distribution</h3>
    
    <div className="w-full bg-white dark:!bg-[#121212] p-6 rounded-xl shadow-lg border border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6">
    
    <div className="flex flex-col gap-2">
     <div className="text-sm font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wider">Equivalent Investment (Ratio)</div>
     <div className="w-full h-12 flex rounded-lg overflow-hidden text-white font-bold text-xs sm:text-sm shadow-inner transition-all duration-500">
     <div style={{width: totalRatio > 0 ? `${(ratioA/totalRatio)*100}%` : '50%'}} className="bg-blue-500 flex flex-col items-center justify-center transition-all duration-500 border-r border-blue-600 dark:bg-teal-950/20 dark:border-teal-900">
      <span>Partner A</span>
      <span className="font-mono opacity-90">{ratioA.toLocaleString()}</span>
     </div>
     <div style={{width: totalRatio > 0 ? `${(ratioB/totalRatio)*100}%` : '50%'}} className="bg-green-500 flex flex-col items-center justify-center transition-all duration-500 dark:bg-[#121212] dark:border-[#1c1b1b]">
      <span>Partner B</span>
      <span className="font-mono opacity-90">{ratioB.toLocaleString()}</span>
     </div>
     </div>
    </div>

    <div className="flex justify-center my-2">
     <div className="px-4 py-2 bg-slate-100 dark:bg-[#121212] rounded-full border border-slate-200 dark:border-[#1c1b1b] font-bold text-slate-700 dark:text-[#a1a1aa]">
     Total Profit: ${profit.toLocaleString()}
     </div>
    </div>

    <div className="flex flex-col gap-2">
     <div className="text-sm font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wider">Final Profit Share</div>
     <div className="w-full h-16 flex rounded-lg overflow-hidden text-white font-bold text-sm shadow-inner transition-all duration-500">
     <div style={{width: totalRatio > 0 ? `${(ratioA/totalRatio)*100}%` : '50%'}} className="bg-blue-600 flex flex-col items-center justify-center transition-all duration-500 border-r border-blue-700">
      <span className="text-xs opacity-80">Partner A</span>
      <span className="text-lg">${Math.round(shareA).toLocaleString()}</span>
     </div>
     <div style={{width: totalRatio > 0 ? `${(ratioB/totalRatio)*100}%` : '50%'}} className="bg-green-600 flex flex-col items-center justify-center transition-all duration-500">
      <span className="text-xs opacity-80">Partner B</span>
      <span className="text-lg">${Math.round(shareB).toLocaleString()}</span>
     </div>
     </div>
    </div>

    </div>
   </div>
   )}

   {activeTab === 'inheritance' && (
   <div className="flex flex-col items-center w-full max-w-lg">
    <h3 className="text-xl font-bold mb-6 text-center">Inheritance Distribution Tree</h3>
    
    <div className="w-full flex flex-col gap-3 font-mono text-sm">
    
    {/* Net Estate */}
    <div className="flex justify-between items-center p-4 bg-white dark:!bg-[#121212] border dark:border-[#1c1b1b] rounded-xl shadow-md z-10">
     <span className="font-bold text-lg text-slate-700 dark:text-[#ffffff]">Net Estate</span>
     <span className="font-bold text-xl text-emerald-600 dark:text-emerald-400">${estate.toLocaleString()}</span>
    </div>

    {/* Deductions */}
    <div className="flex flex-col gap-2 ml-4 sm:ml-8 border-l-2 border-slate-300 dark:border-[#1c1b1b] pl-4 py-2">
     {hasWidow && (
     <div className="flex justify-between items-center p-3 bg-white dark:!bg-[#121212] border-l-4 border-l-indigo-500 dark:border-[#1c1b1b] rounded-lg shadow-sm">
      <span className="text-slate-600 dark:text-[#a1a1aa]">Widow ({childrenCount > 0 ? '1/8' : '1/4'})</span>
      <span className="font-bold text-indigo-600 dark:text-indigo-400">${widowShare.toLocaleString()}</span>
     </div>
     )}
     {hasMother && (
     <div className="flex justify-between items-center p-3 bg-white dark:!bg-[#121212] border-l-4 border-l-orange-500 dark:border-[#1c1b1b] rounded-lg shadow-sm">
      <span className="text-slate-600 dark:text-[#a1a1aa]">Mother ({childrenCount > 0 ? '1/6' : '1/3'})</span>
      <span className="font-bold text-orange-600 dark:text-orange-400">${Math.round(motherShare).toLocaleString()}</span>
     </div>
     )}
    </div>

    {/* Remainder */}
    <div className="flex justify-between items-center p-3 mt-2 bg-slate-200 dark:!bg-[#121212] border dark:border-[#1c1b1b] rounded-lg shadow-sm z-10">
     <span className="font-semibold text-slate-700 dark:text-[#a1a1aa]">Remainder for Children</span>
     <span className="font-bold text-slate-800 dark:text-[#ffffff]">${Math.round(remaining).toLocaleString()}</span>
    </div>

    {/* Children Split */}
    {childrenCount > 0 && (
     <div className="grid grid-cols-2 gap-3 mt-2 ml-4 sm:ml-8 pl-4 border-l-2 border-slate-300 dark:border-[#1c1b1b] py-2">
     {Array.from({length: sons}).map((_, i) => (
      <div key={`s-${i}`} className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-center shadow-sm flex flex-col justify-center">
      <div className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">Son {i+1} (2x)</div>
      <div className="font-bold text-blue-700 dark:text-blue-300">${Math.round(singleSonShare).toLocaleString()}</div>
      </div>
     ))}
     {Array.from({length: daughters}).map((_, i) => (
      <div key={`d-${i}`} className="p-3 bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 rounded-lg text-center shadow-sm flex flex-col justify-center">
      <div className="text-xs text-pink-600 dark:text-pink-400 font-bold uppercase tracking-wider mb-1">Daughter {i+1} (1x)</div>
      <div className="font-bold text-pink-700 dark:text-pink-300">${Math.round(singleDaughterShare).toLocaleString()}</div>
      </div>
     ))}
     </div>
    )}
    {childrenCount === 0 && remaining > 0 && (
     <div className="ml-4 sm:ml-8 pl-4 py-2 text-slate-500 text-sm italic">
      * Remaining estate goes to extended family (Asabah) which is beyond Class 8 scope.
     </div>
    )}

    </div>
   </div>
   )}

  </div>
  </main>
 </div>
 );
}
