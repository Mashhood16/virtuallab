import { useState, useRef, useEffect } from 'react';
import { BarChart2, Play, RotateCcw, CheckCircle, XCircle, Pause } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabCS11Algorithms({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const initialArray = [45, 12, 38, 8, 25];
 
 const [sim, setSim] = useState({
 array: [...initialArray],
 i: 0,
 j: 0,
 swaps: 0,
 isSorted: false
 });
 
 const [isPlaying, setIsPlaying] = useState<boolean>(false);
 const timerRef = useRef<number | null>(null);

 const performStep = () => {
 setSim(prev => {
  if (prev.isSorted) return prev;
  const arr = [...prev.array];
  let { i, j, swaps } = prev;

  if (i >= arr.length - 1) {
  return { ...prev, isSorted: true };
  }

  if (arr[j] > arr[j + 1]) {
  const temp = arr[j];
  arr[j] = arr[j + 1];
  arr[j + 1] = temp;
  swaps++;
  }

  j++;
  if (j >= arr.length - i - 1) {
  j = 0;
  i++;
  }

  const sorted = i >= arr.length - 1;
  return { array: arr, i, j, swaps, isSorted: sorted };
 });
 };

 useEffect(() => {
 if (isPlaying && !sim.isSorted) {
  timerRef.current = setTimeout(() => {
  performStep();
  }, 500);
 } else if (sim.isSorted) {
  setIsPlaying(false);
 }
 return () => {
  if (timerRef.current) clearTimeout(timerRef.current);
 };
 }, [isPlaying, sim]);

 const togglePlay = () => setIsPlaying(!isPlaying);
 
 const resetSort = () => {
 setIsPlaying(false);
 if (timerRef.current) clearTimeout(timerRef.current);
 setSim({
  array: [...initialArray],
  i: 0,
  j: 0,
  swaps: 0,
  isSorted: false
 });
 };

 const [ansCode, setAnsCode] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const checkAnswer = () => {
 if (ansCode.replace(/\s+/g, '') === '12,38,8,25,45') {
  setFeedback('Correct! The largest element (45) bubbled up to the very end.');
 } else {
  setFeedback('Incorrect. Remember, in pass 1, the largest element moves to the very end of the array.');
 }
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="CS11: Algorithm Visualization" />

  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <BarChart2 className="text-indigo-500" />
   Bubble Sort Theory
   </h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] flex-1 lg:overflow-y-auto">
   <p>
    <strong>Bubble Sort</strong> is a simple sorting algorithm that repeatedly steps through the input list element by element.
   </p>
   <ul className="space-y-2 mt-4">
    <li>It compares the current element with the one after it.</li>
    <li>If they are out of order, it <strong>swaps</strong> them.</li>
    <li>This process is repeated until the list is sorted.</li>
   </ul>
   <p className="mt-4">
    During each pass, the largest remaining element "bubbles" up to its correct position at the end of the array.
   </p>
   <div className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-3 rounded-md mt-4 text-xs font-mono flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    <p>For i from 0 to N-1:</p>
    <p className="ml-4">For j from 0 to N-i-1:</p>
    <p className="ml-8 text-indigo-600">if arr[j] &gt; arr[j+1]:</p>
    <p className="ml-12 text-indigo-600">swap(arr[j], arr[j+1])</p>
   </div>
   </div>
  </div>

  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <Play className="text-amber-500" />
   Sorting Array Simulator
   </h2>
   
   <div className="flex-1 w-full flex flex-col items-center justify-center">
   <div className="flex items-end justify-center h-64 gap-4 mb-8">
    {sim.array.map((val, idx) => {
    const isComparing = !sim.isSorted && (idx === sim.j || idx === sim.j + 1);
    const isSortedPortion = idx >= sim.array.length - sim.i && sim.i > 0;
    
    let color = 'bg-blue-400';
    if (sim.isSorted) color = 'bg-green-500';
    else if (isSortedPortion) color = 'bg-green-400';
    else if (isComparing) color = 'bg-amber-400';

    return (
     <div key={idx} className="flex flex-col items-center">
     <div 
      className={`w-16 transition-all duration-300 rounded-t-md ${color} shadow-sm flex items-end justify-center pb-2`}
      style={{ height: `${val * 4}px` }}
     >
      <span className="font-bold text-white text-sm">{val}</span>
     </div>
     </div>
    );
    })}
   </div>

   <div className="flex gap-4 mb-6">
    <button
    onClick={togglePlay}
    disabled={sim.isSorted}
    className={`flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40 flex-col `}
    >
    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
    {isPlaying ? 'Pause' : 'Play'}
    </button>
    <button
    onClick={performStep}
    disabled={sim.isSorted || isPlaying}
    className={`flex items-center gap-2 px-6 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-md font-semibold hover:bg-slate-300 dark:bg-[#121212] disabled:opacity-50 transition-colors flex-col `}
    >
    Step Forward
    </button>
    <button
    onClick={resetSort}
    className="flex items-center gap-2 px-6 py-2 bg-rose-100 text-rose-700 rounded-md font-semibold hover:bg-rose-200 transition-colors"
    >
    <RotateCcw size={18} />
    Reset
    </button>
   </div>
   
   <div className="flex gap-8 text-sm font-semibold text-slate-600 dark:text-[#a1a1aa]">
    <div className="bg-slate-100 dark:bg-[#121212] px-4 py-2 rounded-md">Pass: <span className="text-indigo-600">{sim.i}</span></div>
    <div className="bg-slate-100 dark:bg-[#121212] px-4 py-2 rounded-md">Comparisons/Swaps: <span className="text-amber-600">{sim.swaps}</span></div>
   </div>
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col `}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <CheckCircle className="text-green-500" />
   Memory Swap Analysis
   </h2>
   <div className="flex-1">
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-4">
    Consider the initial array state in the simulator: <strong>[45, 12, 38, 8, 25]</strong>.
   </p>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">
    Track the memory swaps manually. After the <strong>first full pass</strong> (i=0 completes, all adjacent elements compared once), what is the exact state of the array?
   </p>

   <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">Enter the array elements separated by commas:</label>
    <input
    type="text"
    value={ansCode}
    onChange={e => setAnsCode(e.target.value)}
    placeholder="e.g. 10, 20, 30, 40, 50"
    className="w-full px-4 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono"
    />
   </div>
   
   <button
    onClick={checkAnswer}
    className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    Check Answer
   </button>

   {feedback && (
    <div className={`mt-4 p-4 rounded-md flex items-start gap-3 ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle className="shrink-0 mt-0.5" size={18} /> : <XCircle className="shrink-0 mt-0.5" size={18} />}
    <p className="text-sm font-medium">{feedback}</p>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
