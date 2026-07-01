import { useState, useRef, useEffect } from 'react';
import {CheckCircle, XCircle, Play, Save } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabCS12DataStructures({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [activeTab, setActiveTab] = useState<'Stack' | 'Queue' | 'Tree'>('Tree');
 
 // Stack State
 const [stack, setStack] = useState<number[]>([]);
 const pushStack = () => setStack([...stack, Math.floor(Math.random() * 100)]);
 const popStack = () => setStack(stack.slice(0, -1));

 // Queue State
 const [queue, setQueue] = useState<number[]>([]);
 const enqueue = () => setQueue([...queue, Math.floor(Math.random() * 100)]);
 const dequeue = () => setQueue(queue.slice(1));

 // Tree State
 const [activeNode, setActiveNode] = useState<string | null>(null);
 const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 const treeNodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
 const preOrder = ['A', 'B', 'D', 'E', 'C', 'F', 'G'];
 const inOrder = ['D', 'B', 'E', 'A', 'F', 'C', 'G'];
 const postOrder = ['D', 'E', 'B', 'F', 'G', 'C', 'A'];

 const animateTraversal = (sequence: string[]) => {
 if (timeoutRef.current) clearTimeout(timeoutRef.current);
 setActiveNode(null);
 let i = 0;
 const step = () => {
  if (i < sequence.length) {
  setActiveNode(sequence[i]);
  i++;
  timeoutRef.current = setTimeout(step, 800);
  } else {
  timeoutRef.current = setTimeout(() => setActiveNode(null), 800);
  }
 };
 step();
 };

 useEffect(() => {
 return () => {
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
 };
 }, []);

 // Assessment State
 const [q1, setQ1] = useState('');
 const [q2, setQ2] = useState('');
 const [q3, setQ3] = useState('');
 
 const [q1Status, setQ1Status] = useState<boolean | null>(null);
 const [q2Status, setQ2Status] = useState<boolean | null>(null);
 const [q3Status, setQ3Status] = useState<boolean | null>(null);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} variant="dark" title="Interactive Memory Management" />

  
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
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 overflow-y-auto lg:overflow-visible">
  {/* Theory Column */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 text-teal-800 border-b pb-2">Theory & Context</h2>
   <div className="space-y-4 text-slate-700 dark:text-[#ffffff] lg:overflow-y-auto pr-2 flex-1 text-sm">
   <p>
    <strong>Data Structures</strong> organize and store data to enable efficient access and modification.
   </p>
   <h3 className="font-semibold text-teal-700 mt-2">Stacks (LIFO)</h3>
   <p>
    A Stack follows the Last-In-First-Out principle. Operations like <code>Push</code> (add to top) and <code>Pop</code> (remove from top) execute in O(1) time. Used in undo mechanisms and call stacks.
   </p>
   <h3 className="font-semibold text-teal-700 mt-2">Queues (FIFO)</h3>
   <p>
    A Queue follows the First-In-First-Out principle. <code>Enqueue</code> adds to the back, <code>Dequeue</code> removes from the front. Used in task scheduling and breadth-first search.
   </p>
   <h3 className="font-semibold text-teal-700 mt-2">Binary Trees</h3>
   <p>
    A hierarchical structure where each node has at most two children. 
    <br/>- <strong>Pre-Order:</strong> Root, Left, Right
    <br/>- <strong>In-Order:</strong> Left, Root, Right
    <br/>- <strong>Post-Order:</strong> Left, Right, Root
   </p>
   </div>
  </div>

  {/* Simulation Column */}
  <div className={`bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold mb-4 text-teal-800 border-b pb-2">Visualizer</h2>
   
   <div className="flex gap-2 mb-4">
   <button onClick={() => setActiveTab('Tree')} className={`px-4 py-1 rounded-full text-sm font-bold ${activeTab === 'Tree' ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}>Tree</button>
   <button onClick={() => setActiveTab('Stack')} className={`px-4 py-1 rounded-full text-sm font-bold ${activeTab === 'Stack' ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}>Stack</button>
   <button onClick={() => setActiveTab('Queue')} className={`px-4 py-1 rounded-full text-sm font-bold ${activeTab === 'Queue' ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}>Queue</button>
   </div>

   <div className={`flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] p-4 relative lg:overflow- `}>
   {activeTab === 'Tree' && (
    <div className="w-full flex flex-col items-center">
    <svg width="100%" height="220" viewBox="0 0 300 200" className="mt-2">
     <line x1="150" y1="30" x2="75" y2="100" stroke="#94a3b8" strokeWidth="2" />
     <line x1="150" y1="30" x2="225" y2="100" stroke="#94a3b8" strokeWidth="2" />
     <line x1="75" y1="100" x2="37.5" y2="170" stroke="#94a3b8" strokeWidth="2" />
     <line x1="75" y1="100" x2="112.5" y2="170" stroke="#94a3b8" strokeWidth="2" />
     <line x1="225" y1="100" x2="187.5" y2="170" stroke="#94a3b8" strokeWidth="2" />
     <line x1="225" y1="100" x2="262.5" y2="170" stroke="#94a3b8" strokeWidth="2" />

     {treeNodes.map((node, i) => {
     const coords = [
      { x: 150, y: 30 }, { x: 75, y: 100 }, { x: 225, y: 100 },
      { x: 37.5, y: 170 }, { x: 112.5, y: 170 }, { x: 187.5, y: 170 }, { x: 262.5, y: 170 }
     ];
     const isActive = activeNode === node;
     return (
      <g key={node}>
      <circle cx={coords[i].x} cy={coords[i].y} r="18" fill={isActive ? '#14b8a6' : '#e2e8f0'} stroke="#0f766e" strokeWidth="2" className="transition-colors duration-300" />
      <text x={coords[i].x} y={coords[i].y} textAnchor="middle" dy=".3em" fill={isActive ? '#ffffff' : '#0f766e'} fontSize="14" fontWeight="bold">
       {node}
      </text>
      </g>
     );
     })}
    </svg>
    <div className="flex gap-2 mt-4">
     <button onClick={() => animateTraversal(preOrder)} className={`px-3 py-1 bg-[#121212] dark:bg-[#121212] text-white text-xs rounded hover:bg-slate-700 dark:bg-[#121212] flex items-center gap-1 flex-col `}><Play size={12}/> Pre-Order</button>
     <button onClick={() => animateTraversal(inOrder)} className={`px-3 py-1 bg-[#121212] dark:bg-[#121212] text-white text-xs rounded hover:bg-slate-700 dark:bg-[#121212] flex items-center gap-1 flex-col `}><Play size={12}/> In-Order</button>
     <button onClick={() => animateTraversal(postOrder)} className={`px-3 py-1 bg-[#121212] dark:bg-[#121212] text-white text-xs rounded hover:bg-slate-700 dark:bg-[#121212] flex items-center gap-1 flex-col `}><Play size={12}/> Post-Order</button>
    </div>
    </div>
   )}

   {activeTab === 'Stack' && (
    <div className="w-full flex flex-col items-center h-full justify-end pb-4">
    <div className="flex gap-2 mb-6">
     <button onClick={pushStack} className="px-4 py-2 bg-teal-600 text-white rounded font-bold hover:bg-teal-700 dark:text-white dark:text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40">Push</button>
     <button onClick={popStack} disabled={stack.length === 0} className="px-4 py-2 bg-rose-500 text-white rounded font-bold hover:bg-rose-600 disabled:opacity-50 dark:text-white dark:text-white dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40">Pop</button>
    </div>
    <div className="w-32 border-x-4 border-b-4 border-[#1c1b1b] dark:border-[#1c1b1b] min-h-[150px] flex flex-col-reverse items-center justify-start p-1 bg-slate-50 dark:bg-[#121212]">
     {stack.map((val, idx) => (
     <div key={idx} className="w-full bg-teal-500 text-white text-center font-bold py-2 mb-1 rounded border border-teal-700 animate-fade-in dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40">
      {val}
     </div>
     ))}
     {stack.length === 0 && <span className="text-slate-400 text-sm mt-auto mb-2">Empty Stack</span>}
    </div>
    </div>
   )}

   {activeTab === 'Queue' && (
    <div className="w-full flex flex-col items-center h-full justify-center">
    <div className="flex gap-2 mb-6">
     <button onClick={enqueue} className="px-4 py-2 bg-teal-600 text-white rounded font-bold hover:bg-teal-700 dark:text-white dark:text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40">Enqueue</button>
     <button onClick={dequeue} disabled={queue.length === 0} className="px-4 py-2 bg-rose-500 text-white rounded font-bold hover:bg-rose-600 disabled:opacity-50 dark:text-white dark:text-white dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40">Dequeue</button>
    </div>
    <div className="w-full max-w-sm h-20 border-y-4 border-[#1c1b1b] dark:border-[#1c1b1b] flex items-center p-1 bg-slate-50 dark:bg-[#121212] overflow-x-auto gap-1">
     {queue.length === 0 && <span className="text-slate-400 text-sm mx-auto">Empty Queue</span>}
     {queue.map((val, idx) => (
     <div key={idx} className="min-w-[3rem] h-full bg-teal-500 text-white flex items-center justify-center font-bold rounded border border-teal-700">
      {val}
     </div>
     ))}
    </div>
    <div className="w-full max-w-sm flex justify-between mt-2 text-xs font-bold text-slate-500 dark:text-[#71717a]">
     <span>← Front (Dequeue)</span>
     <span>Back (Enqueue) ←</span>
    </div>
    </div>
   )}
   </div>
  </div>

  {/* Assessment Column */}
  <div className="bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <h2 className="text-xl font-bold mb-4 text-teal-800 border-b pb-2">Analysis & Assessment</h2>
   
   <div className="space-y-4 lg:overflow-y-auto pr-2">
   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <label className="block text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-2">Q1: If an empty Stack performs Push(5), Push(10), Pop(), Push(3), what is the top element?</label>
    <div className="flex gap-2">
    <input type="text" value={q1} onChange={e => setQ1(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Enter number..." />
    <button onClick={() => setQ1Status(q1.trim() === '3')} className="bg-teal-600 text-white px-3 py-1 rounded font-bold text-sm dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40">Check</button>
    </div>
    {q1Status === true && <p className="text-green-600 text-xs font-bold mt-1 flex items-center"><CheckCircle size={12} className="mr-1"/> Correct</p>}
    {q1Status === false && <p className="text-red-500 text-xs font-bold mt-1 flex items-center"><XCircle size={12} className="mr-1"/> Incorrect</p>}
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <label className="block text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-2">Q2: Based on the visualizer Tree, what is the exact Pre-Order traversal sequence? (e.g. A,B,C...)</label>
    <div className="flex gap-2">
    <input type="text" value={q2} onChange={e => setQ2(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="A,B,D,E,C,F,G" />
    <button onClick={() => setQ2Status(q2.replace(/\s/g, '').toUpperCase() === 'A,B,D,E,C,F,G')} className="bg-teal-600 text-white px-3 py-1 rounded font-bold text-sm dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40">Check</button>
    </div>
    {q2Status === true && <p className="text-green-600 text-xs font-bold mt-1 flex items-center"><CheckCircle size={12} className="mr-1"/> Correct</p>}
    {q2Status === false && <p className="text-red-500 text-xs font-bold mt-1 flex items-center"><XCircle size={12} className="mr-1"/> Incorrect</p>}
   </div>

   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <label className="block text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-2">Q3: Which data structure operates on a FIFO (First-In-First-Out) principle?</label>
    <div className="flex gap-2">
    <input type="text" value={q3} onChange={e => setQ3(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="e.g. Stack or Queue" />
    <button onClick={() => setQ3Status(q3.trim().toLowerCase() === 'queue')} className="bg-teal-600 text-white px-3 py-1 rounded font-bold text-sm dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40">Check</button>
    </div>
    {q3Status === true && <p className="text-green-600 text-xs font-bold mt-1 flex items-center"><CheckCircle size={12} className="mr-1"/> Correct</p>}
    {q3Status === false && <p className="text-red-500 text-xs font-bold mt-1 flex items-center"><XCircle size={12} className="mr-1"/> Incorrect</p>}
   </div>

   <div className="pt-4 border-t border-slate-200 dark:border-[#1c1b1b] mt-6">
    <button 
    onClick={() => {
     if (onExit) onExit();
    }}
    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
    <Save size={20} />
    Submit Results & Exit
    </button>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
