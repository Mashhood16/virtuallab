import { useState, useEffect } from 'react';
import { Beaker, CheckCircle, RotateCcw, MousePointerClick } from 'lucide-react';
import LabHeader from './LabHeader';

type CrossType = 'monohybrid' | 'dihybrid';

export default function LabB10Genetics({ onExit }: { onExit: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [crossType, setCrossType] = useState<CrossType>('monohybrid');
 const [trials, setTrials] = useState<string[]>([]);
 const [selectedMale, setSelectedMale] = useState<string | null>(null);
 const [selectedFemale, setSelectedFemale] = useState<string | null>(null);

 const [q1, setQ1] = useState('');
 const [q2, setQ2] = useState('');
 const [feedback, setFeedback] = useState('');

 const monoGametes = ['Y', 'y'];
 const diGametes = ['YR', 'Yr', 'yR', 'yr'];

 useEffect(() => {
 if (selectedMale && selectedFemale) {
  const t = setTimeout(() => {
  let phenotype = '';
  if (crossType === 'monohybrid') {
   const hasY = selectedMale === 'Y' || selectedFemale === 'Y';
   phenotype = hasY ? 'Yellow' : 'Green';
  } else {
   const hasY = selectedMale.includes('Y') || selectedFemale.includes('Y');
   const hasR = selectedMale.includes('R') || selectedFemale.includes('R');
   phenotype = `${hasY ? 'Yellow' : 'Green'} ${hasR ? 'Round' : 'Wrinkled'}`;
  }
  setTrials((prev) => [...prev, phenotype]);
  setSelectedMale(null);
  setSelectedFemale(null);
  }, 600);
  return () => clearTimeout(t);
 }
 }, [selectedMale, selectedFemale, crossType]);

 const handleModeSwitch = (mode: CrossType) => {
 setCrossType(mode);
 setTrials([]);
 setSelectedMale(null);
 setSelectedFemale(null);
 setQ1('');
 setQ2('');
 setFeedback('');
 };

 const renderBead = (gamete: string) => {
 let bg = 'bg-slate-300 dark:bg-[#121212]';
 if (gamete.includes('Y')) bg = 'bg-yellow-400 text-yellow-900';
 if (gamete.includes('y')) bg = 'bg-green-500 text-green-900';

 let borderStyle = 'border-solid border-white';
 if (gamete.includes('r')) borderStyle = 'border-dashed border-slate-600 dark:border-slate-500';

 return (
  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-md border-2 ${borderStyle} ${bg} transition-transform`}>
  {gamete}
  </div>
 );
 };

 const handleDrawMale = () => {
 if (selectedMale) return;
 const pool = crossType === 'monohybrid' ? monoGametes : diGametes;
 setSelectedMale(pool[Math.floor(Math.random() * pool.length)]);
 };

 const handleDrawFemale = () => {
 if (selectedFemale) return;
 const pool = crossType === 'monohybrid' ? monoGametes : diGametes;
 setSelectedFemale(pool[Math.floor(Math.random() * pool.length)]);
 };

 const autoDraw = (count: number) => {
 let newTrials = [...trials];
 const pool = crossType === 'monohybrid' ? monoGametes : diGametes;
 for (let i = 0; i < count; i++) {
  const g1 = pool[Math.floor(Math.random() * pool.length)];
  const g2 = pool[Math.floor(Math.random() * pool.length)];
  let phenotype = '';
  if (crossType === 'monohybrid') {
  const hasY = g1 === 'Y' || g2 === 'Y';
  phenotype = hasY ? 'Yellow' : 'Green';
  } else {
  const hasY = g1.includes('Y') || g2.includes('Y');
  const hasR = g1.includes('R') || g2.includes('R');
  phenotype = `${hasY ? 'Yellow' : 'Green'} ${hasR ? 'Round' : 'Wrinkled'}`;
  }
  newTrials.push(phenotype);
 }
 setTrials(newTrials);
 };

 const getPhenotypeCounts = () => {
 const counts: Record<string, number> = {};
 trials.forEach((t) => {
  counts[t] = (counts[t] || 0) + 1;
 });
 return counts;
 };
 const phenotypeCounts = getPhenotypeCounts();

 const handleCheck = () => {
 let isQ1Correct = false;
 let isQ2Correct = false;

 if (crossType === 'monohybrid') {
  isQ1Correct = q1.trim() === '3:1';
  isQ2Correct = q2.trim().toLowerCase() === 'green';
 } else {
  isQ1Correct = q1.trim() === '9:3:3:1';
  isQ2Correct = q2.trim().toLowerCase() === 'green wrinkled';
 }

 if (isQ1Correct && isQ2Correct) {
  setFeedback('Correct! You have successfully identified the theoretical ratios and recessive phenotypes.');
 } else if (!isQ1Correct && isQ2Correct) {
  setFeedback('Q2 is correct, but the ratio in Q1 is incorrect. Check the theory again.');
 } else if (isQ1Correct && !isQ2Correct) {
  setFeedback('Q1 is correct, but the fully recessive phenotype in Q2 is incorrect.');
 } else {
  setFeedback('Both answers are incorrect. Review the theory and your observation log.');
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Virtual Lab: Mendelian Genetics" />

  
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
  <main className="lg:flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
  {/* Left Column: Theory */}
  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-6">
   <div className={`p-3 bg-blue-100 rounded-xl text-blue-600 flex-col `}>
    <Beaker className="w-6 h-6" />
   </div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">Theory & Context</h2>
   </div>

   <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa]">
   <p>
    Mendelian genetics explores how traits are passed from parents to offspring. The fundamental laws are demonstrated using statistical probabilities of fertilization.
   </p>

   <div className={`p-4 bg-blue-50 rounded-lg text-blue-900 text-sm dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] flex-col `}>
    <h3 className="font-bold mb-2 flex items-center gap-2">Law of Segregation</h3>
    <p>
    In a <strong>Monohybrid Cross (Yy × Yy)</strong>, each parent passes one randomly selected allele to the offspring. Yellow (Y) is dominant over Green (y). This leads to an expected 3:1 phenotypic ratio.
    </p>
   </div>

   <div className="p-4 bg-indigo-50 rounded-lg text-indigo-900 text-sm dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff]">
    <h3 className="font-bold mb-2 flex items-center gap-2">Law of Independent Assortment</h3>
    <p>
    In a <strong>Dihybrid Cross (YyRr × YyRr)</strong>, alleles for different traits sort independently. Round (R) is dominant over wrinkled (r). This leads to an expected 9:3:3:1 phenotypic ratio.
    </p>
   </div>
   </div>
  </div>

  {/* Middle Column: Interactive Simulator */}
  <div className="lg:col-span-1 bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   <div className="flex items-center justify-between w-full mb-6">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">Fertilization Simulator</h2>
   <button
    onClick={() => {
    setTrials([]);
    setSelectedMale(null);
    setSelectedFemale(null);
    }}
    className="p-2 hover:bg-slate-100 dark:bg-[#121212] rounded-full transition-colors"
    title="Reset Data"
   >
    <RotateCcw className="w-5 h-5 text-slate-600 dark:text-[#a1a1aa]" />
   </button>
   </div>

   <div className="flex gap-2 bg-slate-100 dark:bg-[#121212] p-1 rounded-lg mb-8 w-full">
   <button
    onClick={() => handleModeSwitch('monohybrid')}
    className={`flex-1 py-2 rounded-md font-semibold text-sm transition-colors ${ crossType === 'monohybrid' ? 'bg-slate-50 dark:bg-[#121212] shadow text-blue-700' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]' }`}
   >
    Monohybrid
   </button>
   <button
    onClick={() => handleModeSwitch('dihybrid')}
    className={`flex-1 py-2 rounded-md font-semibold text-sm transition-colors ${ crossType === 'dihybrid' ? 'bg-slate-50 dark:bg-[#121212] shadow text-indigo-700' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]' }`}
   >
    Dihybrid
   </button>
   </div>

   <p className="text-sm text-slate-500 dark:text-[#71717a] mb-6 text-center">
   Click each bowl to randomly draw an allele from the parent's gamete pool, simulating fertilization.
   </p>

   <div className="flex justify-around w-full mt-4">
   {/* Male Bowl */}
   <div className="flex flex-col items-center">
    <div className="h-16 mb-4 flex items-end justify-center">
    {selectedMale ? (
     <div className="animate-bounce">{renderBead(selectedMale)}</div>
    ) : (
     <div className="w-12 h-12"></div>
    )}
    </div>
    <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-2">Paternal Gametes</h3>
    <button
    onClick={handleDrawMale}
    className={`w-32 h-32 bg-blue-100 rounded-b-full border-4 border-blue-300 shadow-inner flex flex-wrap items-center justify-center gap-1 p-3 cursor-pointer hover:bg-blue-200 transition-colors relative group `}
    >
    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-blue-900/10 rounded-b-full transition-opacity z-10">
     <MousePointerClick className="text-blue-700 w-8 h-8" />
     <span className="font-bold text-blue-800 text-sm dark:text-[#ffffff]">Draw</span>
    </div>
    {(crossType === 'monohybrid' ? monoGametes : diGametes).map((g, i) => (
     <div key={i} className="scale-75 pointer-events-none">
     {renderBead(g)}
     </div>
    ))}
    </button>
   </div>

   <div className="flex flex-col items-center justify-end pb-8">
    <span className="text-2xl font-bold text-slate-400">+</span>
   </div>

   {/* Female Bowl */}
   <div className="flex flex-col items-center">
    <div className="h-16 mb-4 flex items-end justify-center">
    {selectedFemale ? (
     <div className="animate-bounce">{renderBead(selectedFemale)}</div>
    ) : (
     <div className="w-12 h-12"></div>
    )}
    </div>
    <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-2">Maternal Gametes</h3>
    <button
    onClick={handleDrawFemale}
    className={`w-32 h-32 bg-pink-100 rounded-b-full border-4 border-pink-300 shadow-inner flex flex-wrap items-center justify-center gap-1 p-3 cursor-pointer hover:bg-pink-200 transition-colors relative group `}
    >
    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-pink-900/10 rounded-b-full transition-opacity z-10">
     <MousePointerClick className="text-pink-700 w-8 h-8" />
     <span className="font-bold text-pink-800 text-sm">Draw</span>
    </div>
    {(crossType === 'monohybrid' ? monoGametes : diGametes).map((g, i) => (
     <div key={i} className="scale-75 pointer-events-none">
     {renderBead(g)}
     </div>
    ))}
    </button>
   </div>
   </div>

   <div className="mt-12 flex gap-4 w-full">
   <button
    onClick={() => autoDraw(10)}
    className="flex-1 px-4 py-2 bg-[#121212] dark:bg-[#121212] text-white font-bold rounded-lg hover:bg-slate-700 dark:bg-[#121212] transition-colors"
   >
    Auto Draw 10
   </button>
   <button
    onClick={() => autoDraw(50)}
    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    Auto Draw 50
   </button>
   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col gap-6 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <CheckCircle className="w-6 h-6 text-green-500" /> Analysis & Assessment
   </h2>

   <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
   <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-4">Observation Log ({trials.length} trials)</h3>
   {crossType === 'monohybrid' ? (
    <div className="grid grid-cols-2 gap-3 text-sm">
    <div className="flex flex-col p-3 bg-yellow-100 rounded border border-yellow-200 text-yellow-900">
     <span className="font-semibold">Yellow</span>
     <span className="text-xl font-bold">{phenotypeCounts['Yellow'] || 0}</span>
    </div>
    <div className="flex flex-col p-3 bg-green-100 rounded border border-green-200 text-green-900 dark:text-[#ffffff]">
     <span className="font-semibold">Green</span>
     <span className="text-xl font-bold">{phenotypeCounts['Green'] || 0}</span>
    </div>
    </div>
   ) : (
    <div className="grid grid-cols-2 gap-3 text-sm">
    <div className="flex flex-col p-2 bg-yellow-100 rounded border border-yellow-300 text-yellow-900">
     <span className="font-semibold text-xs">Yellow Round</span>
     <span className="text-lg font-bold">{phenotypeCounts['Yellow Round'] || 0}</span>
    </div>
    <div className="flex flex-col p-2 bg-yellow-50 rounded border-2 border-dashed border-yellow-400 text-yellow-900">
     <span className="font-semibold text-xs">Yellow Wrinkled</span>
     <span className="text-lg font-bold">{phenotypeCounts['Yellow Wrinkled'] || 0}</span>
    </div>
    <div className="flex flex-col p-2 bg-green-100 rounded border border-green-300 text-green-900 dark:text-[#ffffff]">
     <span className="font-semibold text-xs">Green Round</span>
     <span className="text-lg font-bold">{phenotypeCounts['Green Round'] || 0}</span>
    </div>
    <div className="flex flex-col p-2 bg-green-50 rounded border-2 border-dashed border-green-400 text-green-900 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff]">
     <span className="font-semibold text-xs">Green Wrinkled</span>
     <span className="text-lg font-bold">{phenotypeCounts['Green Wrinkled'] || 0}</span>
    </div>
    </div>
   )}
   </div>

   <div className="flex flex-col gap-4 mt-auto">
   <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">
    1. Based on theory, what is the expected phenotypic ratio?
    </label>
    <input
    type="text"
    placeholder={crossType === 'monohybrid' ? 'e.g. 3:1' : 'e.g. 9:3:3:1'}
    value={q1}
    onChange={(e) => setQ1(e.target.value)}
    className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:outline-none focus:border-blue-500"
    />
   </div>
   <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">
    2. Which exact phenotype outcome is fully recessive?
    </label>
    <input
    type="text"
    placeholder={crossType === 'monohybrid' ? 'e.g. Green' : 'e.g. Green Wrinkled'}
    value={q2}
    onChange={(e) => setQ2(e.target.value)}
    className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:outline-none focus:border-blue-500"
    />
   </div>
   <button
    onClick={handleCheck}
    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md mt-2 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
    Verify Answers
   </button>
   {feedback && (
    <div
    className={`p-4 rounded-lg text-sm font-semibold border ${ feedback.includes('Correct!') ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800' }`}
    >
    {feedback}
    </div>
   )}
   </div>
  </div>
  </main>
 </div>
 );
}
