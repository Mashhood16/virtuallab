import { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, Search, FileText } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit?: () => void;
}

export default function LabCS10JSAlgorithms({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [array] = useState<number[]>([11, 23, 34, 45, 56, 67, 78, 89, 90]);
 const [target, setTarget] = useState<number>(45);
 const [searchType, setSearchType] = useState<'linear' | 'binary'>('linear');
 
 const [step, setStep] = useState<number>(0);
 const [left, setLeft] = useState<number>(0);
 const [right, setRight] = useState<number>(array.length - 1);
 const [mid, setMid] = useState<number>(-1);
 const [currentIndex, setCurrentIndex] = useState<number>(-1);
 const [found, setFound] = useState<boolean | null>(null);
 const [logs, setLogs] = useState<string[]>([]);

 const [assessmentTarget, setAssessmentTarget] = useState<number>(0);
 const [assessmentAnswer, setAssessmentAnswer] = useState<string>('');
 const [assessmentResult, setAssessmentResult] = useState<boolean | null>(null);

 useEffect(() => {
  setAssessmentTarget(array[Math.floor(Math.random() * array.length)]);
 }, [array]);

 const reset = () => {
  setStep(0);
  setLeft(0);
  setRight(array.length - 1);
  setMid(-1);
  setCurrentIndex(-1);
  setFound(null);
  setLogs([]);
 };

 useEffect(() => {
  reset();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [searchType, target]);

 const nextStep = () => {
  if (found !== null) return;

  if (searchType === 'linear') {
   const nextIdx = step;
   if (nextIdx >= array.length) {
    setFound(false);
    setLogs(prev => [...prev, `Target ${target} not found.`]);
    return;
   }
   setCurrentIndex(nextIdx);
   if (array[nextIdx] === target) {
    setFound(true);
    setLogs(prev => [...prev, `Found ${target} at index ${nextIdx} in ${step + 1} steps.`]);
   } else {
    setLogs(prev => [...prev, `Step ${step + 1}: Index ${nextIdx} is ${array[nextIdx]}. Not a match.`]);
    setStep(step + 1);
   }
  } else {
   if (left > right) {
    setFound(false);
    setLogs(prev => [...prev, `Target ${target} not found.`]);
    return;
   }
   const currentMid = Math.floor((left + right) / 2);
   setMid(currentMid);
   setCurrentIndex(currentMid);
   
   if (array[currentMid] === target) {
    setFound(true);
    setLogs(prev => [...prev, `Found ${target} at index ${currentMid} in ${step + 1} steps.`]);
   } else if (array[currentMid] < target) {
    setLogs(prev => [...prev, `Step ${step + 1}: ${array[currentMid]} < ${target}. Searching right half.`]);
    setLeft(currentMid + 1);
    setStep(step + 1);
   } else {
    setLogs(prev => [...prev, `Step ${step + 1}: ${array[currentMid]} > ${target}. Searching left half.`]);
    setRight(currentMid - 1);
    setStep(step + 1);
   }
  }
 };

 const checkAssessment = () => {
  let l = 0;
  let r = array.length - 1;
  let steps = 0;
  while (l <= r) {
   steps++;
   const m = Math.floor((l + r) / 2);
   if (array[m] === assessmentTarget) break;
   else if (array[m] < assessmentTarget) l = m + 1;
   else r = m - 1;
  }
  if (parseInt(assessmentAnswer) === steps) {
   setAssessmentResult(true);
  } else {
   setAssessmentResult(false);
  }
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Algorithms Lab" />

   
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
  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
    {/* Theory Column */}
    <section className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <FileText className="mr-2 text-indigo-500" /> Theory & Setup
     </h2>
     <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]">
      <p>
       In computer science, searching algorithms are used to find a specific element within a data structure.
      </p>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Linear Search</h3>
      <p>
       Checks each element in the array sequentially until the target is found.
       Time complexity: <strong>O(n)</strong>.
      </p>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Binary Search</h3>
      <p>
       Works only on <strong>sorted</strong> arrays. It repeatedly divides the search interval in half.
       Time complexity: <strong>O(log n)</strong>.
      </p>
      
      <div className={`mt-6 p-4 bg-indigo-50 rounded-lg dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
       <h4 className="font-semibold text-indigo-800 mb-2 dark:text-[#ffffff]">Lab Setup</h4>
       <div className="space-y-4">
        <div>
         <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Search Type</label>
         <select 
          className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-indigo-500"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'linear' | 'binary')}
         >
          <option value="linear">Linear Search</option>
          <option value="binary">Binary Search</option>
         </select>
        </div>
        <div>
         <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">Target Value</label>
         <input 
          type="number"
          className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-indigo-500"
          value={target}
          onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
         />
        </div>
       </div>
      </div>
     </div>
    </section>

    {/* Simulation Column */}
    <section className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <Search className="mr-2 text-indigo-500" /> Simulation
     </h2>
     
     <div className="flex-grow flex flex-col items-center justify-center min-h-[300px]">
      <div className="flex flex-wrap justify-center gap-2 mb-8">
       {array.map((val, idx) => {
        let bgColor = 'bg-slate-100 dark:bg-[#121212]';
        let borderColor = 'border-slate-300 dark:border-[#1c1b1b]';
        let textColor = 'text-slate-700 dark:text-[#ffffff]';

        if (searchType === 'linear') {
         if (idx === currentIndex) {
          bgColor = found ? 'bg-green-100' : 'bg-yellow-100';
          borderColor = found ? 'border-green-500' : 'border-yellow-500';
         } else if (idx < step) {
          bgColor = 'bg-red-50';
          borderColor = 'border-red-200';
          textColor = 'text-slate-400';
         }
        } else {
         if (idx === currentIndex) {
          bgColor = found ? 'bg-green-100' : 'bg-indigo-100';
          borderColor = found ? 'border-green-500' : 'border-indigo-500';
         } else if (idx >= left && idx <= right) {
          bgColor = 'bg-blue-50';
          borderColor = 'border-blue-300';
         } else if (step > 0) {
          bgColor = 'bg-slate-50 dark:bg-[#121212]';
          borderColor = 'border-slate-200 dark:border-[#1c1b1b]';
          textColor = 'text-slate-400';
         }
        }

        return (
         <div key={idx} className={`relative w-12 h-12 flex items-center justify-center rounded-md border-2 font-bold transition-colors duration-300 ${bgColor} ${borderColor} ${textColor}`}>
          {val}
          {searchType === 'binary' && idx === left && step > 0 && <span className="absolute -bottom-6 text-xs text-blue-600 font-semibold">L</span>}
          {searchType === 'binary' && idx === right && step > 0 && <span className="absolute -top-6 text-xs text-blue-600 font-semibold">R</span>}
          {searchType === 'binary' && idx === mid && step > 0 && <span className="absolute -bottom-6 text-xs text-indigo-600 font-semibold">M</span>}
         </div>
        );
       })}
      </div>
      
      <div className="flex gap-4">
       <button 
        onClick={nextStep}
        disabled={found !== null}
        className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40 flex-col `}
       >
        <Play size={18} className="mr-2" />
        Step
       </button>
       <button 
        onClick={reset}
        className={`flex items-center px-4 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-md hover:bg-slate-300 dark:bg-[#121212] transition-colors flex-col `}
       >
        <RotateCcw size={18} className="mr-2" />
        Reset
       </button>
      </div>
      
      {found !== null && (
       <div className={`mt-6 p-3 rounded-lg font-medium flex items-center ${found ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        <CheckCircle className="mr-2" size={20} />
        {found ? `Target found in ${step + (searchType === 'linear' ? 1 : 0)} steps!` : 'Target not found in array.'}
       </div>
      )}
     </div>
    </section>

    {/* Analysis Column */}
    <section className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <FileText className="mr-2 text-indigo-500" /> Data & Assessment
     </h2>
     
     <div className="mb-6 flex-grow">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-[#71717a] uppercase mb-2">Execution Log</h3>
      <div className="bg-[#000000] dark:bg-[#121212] rounded-lg p-3 h-48 lg:overflow-y-auto font-mono text-xs text-green-400">
       {logs.length === 0 && <span className="text-slate-500 dark:text-[#71717a]">Awaiting execution...</span>}
       {logs.map((log, i) => (
        <div key={i}>{`> ${log}`}</div>
       ))}
      </div>
     </div>

     <div className="bg-indigo-50 rounded-lg p-4 dark:bg-[#121212] dark:border-[#1c1b1b]">
      <h3 className="font-bold text-indigo-900 mb-2 dark:text-[#ffffff]">Knowledge Check</h3>
      <p className="text-sm text-indigo-800 mb-4 dark:text-[#ffffff]">
       How many steps would a <strong>Binary Search</strong> take to find the value <strong>{assessmentTarget}</strong> in the default array?
      </p>
      <div className="flex gap-2">
       <input 
        type="number" 
        value={assessmentAnswer}
        onChange={(e) => setAssessmentAnswer(e.target.value)}
        className="w-20 p-2 border border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500"
        placeholder="Steps"
       />
       <button 
        onClick={checkAssessment}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
       >
        Check
       </button>
      </div>
      {assessmentResult !== null && (
       <p className={`mt-2 text-sm font-semibold ${assessmentResult ? 'text-green-600' : 'text-red-600'}`}>
        {assessmentResult ? 'Correct!' : 'Incorrect, try again.'}
       </p>
      )}
     </div>
    </section>
   </main>
  </div>
 );
}
