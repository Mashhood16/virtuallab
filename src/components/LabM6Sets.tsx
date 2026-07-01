import { useState, useEffect } from 'react';
import type { DragEvent } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Info, RotateCcw } from 'lucide-react';

type Region = 'pool' | 'A' | 'B' | 'both' | 'none';

type Item = {
 id: string;
 name: string;
 correct: Region;
 region: Region;
};

const SCENARIOS = {
 biology: {
 title: "Biological Classification",
 setA: "Mammals",
 setB: "Can Fly",
 items: [
  { id: 'bat', name: 'Bat', correct: 'both' as Region },
  { id: 'dog', name: 'Dog', correct: 'A' as Region },
  { id: 'eagle', name: 'Eagle', correct: 'B' as Region },
  { id: 'snake', name: 'Snake', correct: 'none' as Region },
  { id: 'whale', name: 'Whale', correct: 'A' as Region },
  { id: 'bee', name: 'Bee', correct: 'B' as Region },
  { id: 'frog', name: 'Frog', correct: 'none' as Region },
 ]
 },
 students: {
 title: "Student Hobbies",
 setA: "Plays Football",
 setB: "Plays Music",
 items: [
  { id: 'john', name: 'John (Football)', correct: 'A' as Region },
  { id: 'emma', name: 'Emma (Both)', correct: 'both' as Region },
  { id: 'ali', name: 'Ali (Music)', correct: 'B' as Region },
  { id: 'sara', name: 'Sara (Neither)', correct: 'none' as Region },
  { id: 'mike', name: 'Mike (Football)', correct: 'A' as Region },
  { id: 'lisa', name: 'Lisa (Music)', correct: 'B' as Region },
  { id: 'alex', name: 'Alex (Both)', correct: 'both' as Region },
 ]
 }
};

export default function LabM6Sets({ onExit }: { onExit?: () => void }) {
 const [activeScenario, setActiveScenario] = useState<'biology' | 'students'>('biology');
 const [items, setItems] = useState<Item[]>([]);
 const [feedback, setFeedback] = useState<boolean | null>(null);

 useEffect(() => {
 resetScenario();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [activeScenario]);

 const resetScenario = () => {
 setItems(SCENARIOS[activeScenario].items.map(i => ({ ...i, region: 'pool' })));
 setFeedback(null);
 };

 const onDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
 e.dataTransfer.setData('itemId', id);
 };

 const handleDrop = (e: DragEvent<HTMLDivElement>, region: Region) => {
 e.preventDefault();
 const id = e.dataTransfer.getData('itemId');
 if (id) {
  setItems(prev => prev.map(item => item.id === id ? { ...item, region } : item));
  setFeedback(null);
 }
 };

 const onDragOver = (e: DragEvent<HTMLDivElement>) => {
 e.preventDefault();
 };

 const checkAnswers = () => {
 if (items.some(i => i.region === 'pool')) {
  alert("Please place all items on the canvas before verifying.");
  return;
 }
 const allCorrect = items.every(i => i.region === i.correct);
 setFeedback(allCorrect);
 };

 const renderItem = (item: Item) => (
 <div
  key={item.id}
  draggable
  onDragStart={(e) => onDragStart(e, item.id)}
  className="px-4 py-2 bg-white dark:!bg-[#121212] border-2 border-slate-300 dark:border-[#1c1b1b] rounded-xl shadow-md text-sm font-bold cursor-grab active:cursor-grabbing hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-1 transition-all z-30 select-none text-slate-700 dark:text-[#ffffff] inline-block"
 >
  {item.name}
 </div>
 );

 const scenario = SCENARIOS[activeScenario];

 return (
 <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans select-none">
  {/* Header */}
  <div className="flex items-center justify-between p-4 shadow-sm z-10 shrink-0 border-b border-slate-200 dark:border-[#1c1b1b]">
  <div className="flex items-center gap-4">
   <button onClick={onExit} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors" title="Go Back">
   <ArrowLeft className="w-6 h-6" />
   </button>
   <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Unit 4: Set Theory Canvas</h1>
  </div>
  <div className="flex gap-2 bg-slate-100 dark:bg-[#121212] p-1 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
   <button onClick={() => setActiveScenario('biology')} className={`px-4 py-2 rounded-md font-medium transition-all ${activeScenario === 'biology' ? ' shadow text-indigo-600 dark:text-indigo-400' : 'hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
   Biology Lab
   </button>
   <button onClick={() => setActiveScenario('students')} className={`px-4 py-2 rounded-md font-medium transition-all ${activeScenario === 'students' ? ' shadow text-indigo-600 dark:text-indigo-400' : 'hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
   Student Clubs
   </button>
  </div>
  </div>

  <div className="flex flex-1 overflow-hidden">
  {/* Left Column: Controls & Pool */}
  <div className="w-full max-w-md p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6 shrink-0 shadow-lg z-0">
   
   <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
   <h2 className="text-lg font-black mb-2 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
    <Info className="w-5 h-5" /> Mission: {scenario.title}
   </h2>
   <p className="text-sm text-indigo-900 dark:text-indigo-200 mb-4 leading-relaxed">
    Drag the items from the pool below into the correct regions of the Venn Diagram. 
    If an item belongs to both sets, drag it to the intersection!
   </p>
   <div className="flex flex-col gap-2 text-sm p-3 rounded-xl border border-indigo-100 dark:border-indigo-800">
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-teal-950/20 dark:border-teal-900" />
    <span className="font-bold">Set A:</span> {scenario.setA}
    </div>
    <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-pink-500" />
    <span className="font-bold">Set B:</span> {scenario.setB}
    </div>
   </div>
   </div>

   <div className="flex-1 min-w-0 bg-slate-50 dark:bg-[#121212]/50 rounded-2xl p-5 border border-slate-200 dark:border-[#1c1b1b]/50 flex flex-col min-h-[250px]">
    <div className="flex justify-between items-center mb-4">
    <h3 className="font-bold text-slate-700 dark:text-[#a1a1aa]">Item Pool</h3>
    <button onClick={resetScenario} className="text-xs flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors font-bold px-2 py-1 rounded bg-slate-200 dark:bg-slate-700">
     <RotateCcw className="w-3 h-3" /> Reset
    </button>
    </div>
    
    <div 
    className="flex-1 min-w-0 border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-xl p-4 flex flex-wrap content-start gap-3 transition-colors"
    onDragOver={onDragOver} 
    onDrop={(e) => handleDrop(e, 'pool')}
    >
    {items.filter(i => i.region === 'pool').map(renderItem)}
    {items.filter(i => i.region === 'pool').length === 0 && (
     <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-[#71717a] font-bold italic text-center text-sm">
     All items placed!
     </div>
    )}
    </div>
   </div>

   <div className="flex flex-col gap-3">
   <button onClick={checkAnswers} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
    Verify Organization
   </button>
   
   {feedback !== null && (
    <div className={`p-4 rounded-xl font-medium animate-in slide-in-from-bottom-2 flex items-start gap-3 border ${feedback ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800'}`}>
    {feedback ? <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 shrink-0 mt-0.5" />}
    <div className="flex flex-col">
     <span className="font-black">{feedback ? 'Perfect!' : 'Not quite right.'}</span>
     <span className="text-sm">{feedback ? 'All items are correctly categorized.' : 'Review the definitions of Set A and Set B and try moving some items.'}</span>
    </div>
    </div>
   )}
   </div>
  </div>

  {/* Right Column: Simulation Stage */}
  <div className="flex-1 min-w-0 p-8 bg-slate-100/50 dark:bg-slate-950 flex items-center justify-center lg:overflow-y-auto">
   
   <div 
    className="relative w-full max-w-4xl aspect-[4/3] min-h-[500px] bg-white dark:!bg-[#121212] rounded-[3rem] shadow-2xl border border-slate-200 dark:border-neutral-900 flex flex-col p-8 overflow-hidden transition-colors"
    onDragOver={onDragOver}
    onDrop={(e) => handleDrop(e, 'none')}
   >
    <h3 className="text-slate-400 dark:text-[#71717a] font-black tracking-widest uppercase text-xl mb-4 shrink-0 px-4">
    Universe
    </h3>

    <div className="flex-1 min-w-0 relative flex items-center justify-center">
    {/* Visual Venn Diagram */}
    <div className="relative w-[600px] h-[400px] pointer-events-none">
     
     {/* Set A Circle */}
     <div 
      className="absolute left-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border-[8px] border-blue-500 bg-blue-500/10 /20 shadow-lg flex flex-col items-start pt-16 pl-12 pointer-events-auto transition-colors hover:bg-blue-500/20 /30 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
      onDragOver={onDragOver}
      onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'A'); }}
     >
      <div className="bg-blue-500 text-white font-black px-4 py-1.5 rounded-full text-sm mb-4 shadow-sm whitespace-nowrap /20 dark:border-teal-900 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">Set A: {scenario.setA}</div>
      <div className="flex flex-wrap gap-2 w-48 justify-start">
      {items.filter(i => i.region === 'A').map(renderItem)}
      </div>
     </div>

     {/* Set B Circle */}
     <div 
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border-[8px] border-pink-500 bg-pink-500/10 /20 shadow-lg flex flex-col items-end pt-16 pr-12 pointer-events-auto transition-colors hover:bg-pink-500/20 /30 dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40"
      onDragOver={onDragOver}
      onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'B'); }}
     >
      <div className="bg-pink-500 text-white font-black px-4 py-1.5 rounded-full text-sm mb-4 shadow-sm whitespace-nowrap dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40">Set B: {scenario.setB}</div>
      <div className="flex flex-wrap gap-2 w-48 justify-end">
      {items.filter(i => i.region === 'B').map(renderItem)}
      </div>
     </div>

     {/* Intersection (Invisible Drop Zone perfectly covering overlap) */}
     <div 
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[280px] rounded-[70px] z-20 pointer-events-auto flex flex-col items-center justify-center pt-8 border-4 border-dashed border-transparent hover:border-indigo-400 dark:hover:border-indigo-500 bg-indigo-500/0 hover:bg-indigo-500/10 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
      onDragOver={onDragOver}
      onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'both'); }}
     >
      <span className="text-xs font-black text-indigo-800 dark:text-indigo-200 mb-2 opacity-50 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded-lg">A ∩ B</span>
      <div className="flex flex-col gap-2 w-full items-center">
       {items.filter(i => i.region === 'both').map(renderItem)}
      </div>
     </div>

    </div>
    </div>

    {/* Items in the Universe (None of the sets) */}
    <div className="h-28 w-full shrink-0 border-t-2 border-dashed border-slate-200 dark:border-neutral-900 pt-4 flex flex-col items-center">
    <span className="text-xs font-bold text-slate-400 dark:text-slate-600 mb-2">Items strictly in the Universe (Outside both sets)</span>
    <div className="flex flex-wrap justify-center gap-3 w-full max-w-3xl pointer-events-none">
     <div className="pointer-events-auto flex flex-wrap gap-3">
     {items.filter(i => i.region === 'none').map(renderItem)}
     </div>
    </div>
    </div>
   </div>

  </div>
  </div>
 </div>
 );
}
