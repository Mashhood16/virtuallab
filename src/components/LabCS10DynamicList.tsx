import { useState, useEffect } from 'react';
import { Plus, Minus, Database, FileText } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit?: () => void;
}

export default function LabCS10DynamicList({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [array, setArray] = useState<string[]>(['Apple', 'Banana', 'Cherry']);
 const [inputValue, setInputValue] = useState('');
 const [insertIndex, setInsertIndex] = useState(0);
 const [removeIndex, setRemoveIndex] = useState(0);
 const [logs, setLogs] = useState<string[]>([]);
 
 const [assessmentIndex, setAssessmentIndex] = useState(1);
 const [assessmentAnswer, setAssessmentAnswer] = useState('');
 const [assessmentResult, setAssessmentResult] = useState<boolean | null>(null);

 const addLog = (msg: string) => setLogs(p => [...p, msg]);

 const pushItem = () => {
  if (!inputValue) return;
  setArray(prev => [...prev, inputValue]);
  addLog(`Pushed '${inputValue}' to end.`);
  setInputValue('');
 };

 const unshiftItem = () => {
  if (!inputValue) return;
  setArray(prev => [inputValue, ...prev]);
  addLog(`Unshifted '${inputValue}' to start.`);
  setInputValue('');
 };

 const insertAt = () => {
  if (!inputValue || insertIndex < 0 || insertIndex > array.length) return;
  setArray(prev => {
   const arr = [...prev];
   arr.splice(insertIndex, 0, inputValue);
   return arr;
  });
  addLog(`Inserted '${inputValue}' at index ${insertIndex}.`);
  setInputValue('');
 };

 const popItem = () => {
  if (array.length === 0) return;
  const item = array[array.length - 1];
  setArray(prev => prev.slice(0, -1));
  addLog(`Popped '${item}' from end.`);
 };

 const shiftItem = () => {
  if (array.length === 0) return;
  const item = array[0];
  setArray(prev => prev.slice(1));
  addLog(`Shifted '${item}' from start.`);
 };

 const removeAt = () => {
  if (removeIndex < 0 || removeIndex >= array.length) return;
  const item = array[removeIndex];
  setArray(prev => {
   const arr = [...prev];
   arr.splice(removeIndex, 1);
   return arr;
  });
  addLog(`Removed '${item}' at index ${removeIndex}.`);
 };

 useEffect(() => {
  if (array.length > 0) {
   setAssessmentIndex(Math.floor(Math.random() * array.length));
  } else {
   setAssessmentIndex(0);
  }
 }, [array]);

 const checkAssessment = () => {
  if (array.length === 0) {
   setAssessmentResult(assessmentAnswer === 'none' || assessmentAnswer === '');
   return;
  }
  if (assessmentAnswer.toLowerCase() === array[assessmentIndex]?.toLowerCase()) {
   setAssessmentResult(true);
  } else {
   setAssessmentResult(false);
  }
 };

 return (
  <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
   <LabHeader onExit={onExit} title="Dynamic List Lab" />

   
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
  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
    {/* Theory */}
    <section className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b]  ? 'block' : 'hidden'} lg:block`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <FileText className="mr-2 text-teal-500" /> Theory
     </h2>
     <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]">
      <p>
       An <strong>Array</strong> is a fundamental data structure consisting of a collection of elements identified by index or key.
      </p>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Common Operations</h3>
      <ul className="list-disc pl-5 space-y-1">
       <li><strong>Push / Pop:</strong> Add or remove from the end of the array. Very fast (O(1)).</li>
       <li><strong>Unshift / Shift:</strong> Add or remove from the beginning. Slower (O(n)) because all other elements must be shifted.</li>
       <li><strong>Insert / Remove at Index:</strong> Modifying elements in the middle also requires shifting elements (O(n)).</li>
      </ul>
     </div>
    </section>

    {/* Simulation */}
    <section className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <Database className="mr-2 text-teal-500" /> Simulation
     </h2>
     
     <div className={`mb-6 border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-4 bg-slate-50 dark:bg-[#121212] overflow-x-auto `}>
      <div className="flex items-end gap-2 min-h-[80px]">
       {array.length === 0 ? (
        <span className="text-slate-400 italic mx-auto">Array is empty</span>
       ) : (
        array.map((item, idx) => (
         <div key={idx} className="flex flex-col items-center">
          <div className="text-xs text-slate-400 mb-1">{idx}</div>
          <div className={`px-4 py-3 bg-teal-100 border-2 border-teal-500 text-teal-900 font-bold rounded-md shadow-sm flex-col `}>
           {item}
          </div>
         </div>
        ))
       )}
      </div>
     </div>

     <div className="space-y-4">
      <div className="flex gap-2">
       <input 
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Value..."
        className="flex-grow p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-teal-500"
       />
       <button onClick={pushItem} className={`flex items-center px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 dark:text-white dark:text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40 flex-col `}>
        <Plus size={16} className="mr-1" /> Push
       </button>
       <button onClick={unshiftItem} className={`flex items-center px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 dark:text-white dark:text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40 flex-col `}>
        <Plus size={16} className="mr-1" /> Unshift
       </button>
      </div>
      
      <div className="flex gap-2">
       <input 
        type="number"
        value={insertIndex}
        onChange={(e) => setInsertIndex(parseInt(e.target.value) || 0)}
        className="w-20 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-teal-500"
       />
       <button onClick={insertAt} className="flex-grow flex items-center justify-center px-3 py-2 bg-teal-100 text-teal-800 border border-teal-300 rounded-md hover:bg-teal-200">
        Insert at Index
       </button>
      </div>

      <hr className="my-2 border-slate-200 dark:border-[#1c1b1b]" />

      <div className="flex gap-2">
       <button onClick={popItem} className="flex-grow flex justify-center items-center px-3 py-2 bg-red-100 text-red-800 border border-red-300 rounded-md hover:bg-red-200">
        <Minus size={16} className="mr-1" /> Pop
       </button>
       <button onClick={shiftItem} className="flex-grow flex justify-center items-center px-3 py-2 bg-red-100 text-red-800 border border-red-300 rounded-md hover:bg-red-200">
        <Minus size={16} className="mr-1" /> Shift
       </button>
      </div>

      <div className="flex gap-2">
       <input 
        type="number"
        value={removeIndex}
        onChange={(e) => setRemoveIndex(parseInt(e.target.value) || 0)}
        className="w-20 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-red-500"
       />
       <button onClick={removeAt} className="flex-grow flex items-center justify-center px-3 py-2 bg-red-100 text-red-800 border border-red-300 rounded-md hover:bg-red-200">
        Remove at Index
       </button>
      </div>
     </div>
    </section>

    {/* Analysis */}
    <section className="bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <FileText className="mr-2 text-teal-500" /> Data & Assessment
     </h2>
     
     <div className="mb-6 flex-grow">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-[#71717a] uppercase mb-2">Operation Log</h3>
      <div className="bg-[#000000] dark:bg-[#121212] rounded-lg p-3 h-48 lg:overflow-y-auto font-mono text-xs text-green-400">
       {logs.length === 0 && <span className="text-slate-500 dark:text-[#71717a]">No operations yet.</span>}
       {logs.map((log, i) => (
        <div key={i}>{`> ${log}`}</div>
       ))}
      </div>
     </div>

     <div className="bg-teal-50 rounded-lg p-4">
      <h3 className="font-bold text-teal-900 mb-2">Knowledge Check</h3>
      <p className="text-sm text-teal-800 mb-4">
       Based on the current array state above, what is the exact string value at index <strong>{assessmentIndex}</strong>?
      </p>
      <div className="flex gap-2">
       <input 
        type="text" 
        value={assessmentAnswer}
        onChange={(e) => setAssessmentAnswer(e.target.value)}
        className="flex-grow p-2 border border-teal-200 rounded-md focus:ring-2 focus:ring-teal-500"
        placeholder="Value..."
       />
       <button 
        onClick={checkAssessment}
        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 dark:text-white dark:text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40"
       >
        Check
       </button>
      </div>
      {assessmentResult !== null && (
       <p className={`mt-2 text-sm font-semibold ${assessmentResult ? 'text-green-600' : 'text-red-600'}`}>
        {assessmentResult ? 'Correct!' : 'Incorrect, check the array indices.'}
       </p>
      )}
     </div>
    </section>
   </main>
  </div>
 );
}
