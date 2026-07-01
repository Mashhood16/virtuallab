import { useState, useEffect } from 'react';
import { BookOpen, Map, Settings, Activity, CheckCircle2, XCircle, Grid } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit?: () => void;
}

export default function LabCS10ComputationalThinking({ onExit }: LabProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // Map Abstraction State
 const [mapDetails, setMapDetails] = useState({
 trees: true,
 houses: true,
 cars: true,
 roads: true,
 parks: true
 });
 
 // Modular Program Design State
 const [modules, setModules] = useState<{id: number, name: string, x: number, y: number}[]>([
 { id: 1, name: 'Main Program', x: 50, y: 50 },
 { id: 2, name: 'Input Handling', x: 200, y: 50 },
 { id: 3, name: 'Data Processing', x: 50, y: 150 },
 { id: 4, name: 'Output Generation', x: 200, y: 150 },
 ]);
 const [draggingId, setDraggingId] = useState<number | null>(null);

 // Assessment State
 const [question, setQuestion] = useState<{q: string, a: string}>({q: '', a: ''});
 const [answer, setAnswer] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
 const [logs, setLogs] = useState<string[]>([]);
 const [activeTab, setActiveTab] = useState<'abstraction' | 'modular'>('abstraction');

 useEffect(() => {
 generateQuestion();
 }, [activeTab]);

 const generateQuestion = () => {
 if (activeTab === 'abstraction') {
  setQuestion({
  q: "What process involves removing unnecessary details to focus on essential features?",
  a: "abstraction"
  });
 } else {
  setQuestion({
  q: "What design approach breaks a program into smaller, manageable, and independent parts?",
  a: "modular"
  });
 }
 setAnswer('');
 setIsCorrect(null);
 };

 const toggleDetail = (key: keyof typeof mapDetails) => {
 setMapDetails(prev => {
  const next = { ...prev, [key]: !prev[key] };
  addLog(`Toggled map detail: ${key} to ${next[key] ? 'visible' : 'hidden'}`);
  return next;
 });
 };

 const handleDragStart = (id: number) => {
 setDraggingId(id);
 };

 const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
 e.preventDefault();
 };

 const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
 e.preventDefault();
 if (draggingId === null) return;
 const rect = e.currentTarget.getBoundingClientRect();
 const x = e.clientX - rect.left - 50; // offset for centering roughly
 const y = e.clientY - rect.top - 20;
 
 setModules(prev => prev.map(m => m.id === draggingId ? { ...m, x, y } : m));
 setDraggingId(null);
 addLog(`Moved module ${draggingId} to x:${Math.round(x)}, y:${Math.round(y)}`);
 };

 const checkAnswer = () => {
 if (answer.trim().toLowerCase().includes(question.a.toLowerCase())) {
  setIsCorrect(true);
  addLog(`Assessment Passed: Correctly identified ${question.a}`);
 } else {
  setIsCorrect(false);
 }
 };

 const addLog = (msg: string) => {
 setLogs(prev => [...prev, msg]);
 };

 const countVisible = Object.values(mapDetails).filter(v => v).length;
 const abstractionLevel = 100 - (countVisible / 5) * 100;

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Computational Thinking Lab" />

  <div className="flex-1 p-6">
  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:h-full overflow-y-auto lg:overflow-visible">
   
   {/* Column 1: Theory */}
   <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col lg:h-full lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 mb-4 text-rose-600">
    <BookOpen className="w-5 h-5" />
    <h2 className="text-lg font-semibold">Theory: Core Concepts</h2>
   </div>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] space-y-4">
    <p>
    <strong>Computational Thinking</strong> involves solving problems, designing systems, and understanding human behavior by drawing on the concepts fundamental to computer science.
    </p>
    <h3 className="text-slate-800 dark:text-[#ffffff] font-semibold mt-4">1. Abstraction</h3>
    <p>
    Abstraction is the process of filtering out – ignoring – the characteristics that we don't need in order to concentrate on those that we do. It simplifies complex systems.
    </p>
    <p>
    <em>Example:</em> A subway map ignores exact geographical curves and above-ground details like trees, showing only stations and connecting lines.
    </p>
    
    <h3 className="text-slate-800 dark:text-[#ffffff] font-semibold mt-4">2. Modular Design</h3>
    <p>
    Modular programming is a software design technique that separates the functionality of a program into independent, interchangeable modules.
    </p>
    <p>
    Each module contains everything necessary to execute only one aspect of the desired functionality.
    </p>
   </div>
   </div>

   {/* Column 2: Simulation */}
   <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex flex-col lg:h-full  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2 text-cyan-600">
    <Settings className="w-5 h-5" />
    <h2 className="text-lg font-semibold">Interactive Exercises</h2>
    </div>
   </div>

   <div className="flex gap-2 mb-4 border-b pb-2">
    <button 
    onClick={() => setActiveTab('abstraction')}
    className={`px-3 py-1 rounded ${activeTab === 'abstraction' ? 'bg-cyan-100 text-cyan-800 font-medium' : 'text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-100 dark:bg-[#121212]'}`}
    >
    Map Abstraction
    </button>
    <button 
    onClick={() => setActiveTab('modular')}
    className={`px-3 py-1 rounded ${activeTab === 'modular' ? 'bg-cyan-100 text-cyan-800 font-medium' : 'text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-100 dark:bg-[#121212]'}`}
    >
    Modular Design
    </button>
   </div>

   <div className="flex-1 flex flex-col relative">
    {activeTab === 'abstraction' && (
    <div className="flex flex-col h-full gap-4">
     <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-sm text-slate-700 dark:text-[#ffffff] flex-col `}>
     Click the buttons below to remove details from the map, increasing its level of abstraction.
     </div>
     <div className="flex gap-2 flex-wrap">
     {Object.keys(mapDetails).map((key) => (
      <button
      key={key}
      onClick={() => toggleDetail(key as keyof typeof mapDetails)}
      className={`px-3 py-1 rounded border text-sm capitalize ${mapDetails[key as keyof typeof mapDetails] ? 'bg-green-100 border-green-300 text-green-800' : 'bg-slate-200 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b] text-slate-500 dark:text-[#a1a1aa]'}`}
      >
      {mapDetails[key as keyof typeof mapDetails] ? `Hide ${key}` : `Show ${key}`}
      </button>
     ))}
     </div>
     <div className="flex items-center gap-4 text-sm font-medium">
     Abstraction Level: 
     <div className={`flex-1 h-3 bg-slate-200 dark:bg-[#121212] rounded-full lg:overflow- flex-col `}>
      <div className="h-full bg-cyan-500 transition-all" style={{ width: `${abstractionLevel}%` }}></div>
     </div>
     {abstractionLevel}%
     </div>
     
     {/* Visual Map */}
     <div className={`w-full lg:flex-1 border-2 border-dashed border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] rounded-xl relative overflow- bg-amber-50 mt-2 p-4 dark:bg-[#121212] lg:dark:bg-[#121212] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     {mapDetails.roads && (
      <div className={`absolute top-1/2 left-0 right-0 h-8 bg-slate-400 dark:bg-[#121212] transform -translate-y-1/2 flex items-center justify-center text-white text-xs font-bold tracking-widest opacity-80 flex-col `}>
      MAIN ROAD
      </div>
     )}
     {mapDetails.parks && (
      <div className="absolute top-4 right-4 w-32 h-32 bg-green-200 rounded-full border-4 border-green-300 opacity-60"></div>
     )}
     {mapDetails.trees && (
      <>
      <div className="absolute top-10 right-10 text-3xl">🌲</div>
      <div className="absolute top-20 right-24 text-3xl">🌳</div>
      <div className="absolute bottom-10 left-10 text-3xl">🌲</div>
      </>
     )}
     {mapDetails.houses && (
      <>
      <div className="absolute top-10 left-10 text-4xl">🏠</div>
      <div className="absolute top-24 left-20 text-4xl">🏡</div>
      </>
     )}
     {mapDetails.cars && (
      <>
      <div className="absolute top-1/2 left-20 text-2xl transform -translate-y-1/2 -mt-1">🚗</div>
      <div className="absolute top-1/2 right-20 text-2xl transform -translate-y-1/2 mt-1 rotate-180">🚙</div>
      </>
     )}
     {abstractionLevel === 100 && (
      <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold text-xl uppercase tracking-wider">
      Pure Abstraction
      </div>
     )}
     </div>
    </div>
    )}

    {activeTab === 'modular' && (
    <div className="flex flex-col h-full gap-4">
     <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-sm text-slate-700 dark:text-[#ffffff]">
     Drag and arrange the program modules to structure the application visually.
     </div>
     
     <div 
     className="flex-1 border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-xl relative bg-blue-50 mt-2 dark:bg-teal-950/20 dark:border-teal-900"
     onDragOver={handleDragOver}
     onDrop={handleDrop}
     >
     {modules.map(mod => (
      <div
      key={mod.id}
      draggable
      onDragStart={() => handleDragStart(mod.id)}
      style={{ left: mod.x, top: mod.y, position: 'absolute' }}
      className="bg-slate-50 dark:bg-[#121212] border-2 border-blue-400 shadow-md rounded p-3 cursor-grab active:cursor-grabbing text-sm font-semibold text-blue-800 flex items-center gap-2 dark:text-[#ffffff]"
      >
      <Grid className="w-4 h-4 text-blue-400" />
      {mod.name}
      </div>
     ))}
     {/* Optional connecting lines could go here using SVG, kept simple for now */}
     <svg className="absolute inset-0 pointer-events-none w-full h-full">
      {/* Just drawing lines between main program and others if they exist */}
      {modules.slice(1).map(mod => {
      const main = modules[0];
      return (
       <line 
       key={mod.id}
       x1={main.x + 60} y1={main.y + 20} 
       x2={mod.x + 60} y2={mod.y + 20} 
       stroke="#93c5fd" strokeWidth="2" strokeDasharray="4"
       />
      );
      })}
     </svg>
     </div>
    </div>
    )}
   </div>
   </div>

   {/* Column 3: Analysis/Assessment */}
   <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex flex-col h-full">
   <div className="flex items-center gap-2 mb-4 text-blue-600">
    <Activity className="w-5 h-5" />
    <h2 className="text-lg font-semibold">Assessment & Logs</h2>
   </div>

   <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 dark:bg-teal-950/20 dark:border-teal-900">
    <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2 dark:text-[#ffffff]">
    <Map className="w-4 h-4" />
    Knowledge Check
    </h3>
    <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-3">
    {question.q}
    </p>
    <div className="flex gap-2 flex-col">
    <input
     type="text"
     value={answer}
     onChange={(e) => setAnswer(e.target.value)}
     className="border rounded px-3 py-2 flex-1 outline-none focus:border-blue-400 text-sm"
     placeholder="Type your answer..."
    />
    <button
     onClick={checkAnswer}
     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     Verify Answer
    </button>
    </div>
    {isCorrect !== null && (
    <div className={`mt-3 p-2 rounded flex items-center gap-2 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
     {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
     <span className="font-medium text-sm">{isCorrect ? 'Correct! Good understanding.' : 'Incorrect, try again.'}</span>
    </div>
    )}
   </div>

   <div className="flex-1 flex flex-col">
    <h3 className="font-medium text-slate-700 dark:text-[#ffffff] mb-2">Activity Tracker</h3>
    <div className="flex-1 bg-slate-50 dark:bg-[#121212] border rounded p-3 lg:overflow-y-auto text-sm font-mono text-slate-600 dark:text-[#a1a1aa]">
    {logs.length === 0 && <span className="text-slate-400">No actions recorded.</span>}
    {logs.map((log, i) => (
     <div key={i} className="mb-1 border-b border-slate-100 pb-1">
     <span className="text-slate-400 mr-2">[{i + 1}]</span>
     {log}
     </div>
    ))}
    </div>
   </div>
   
   </div>
  </div>
  </div>
 </div>
 );
}
