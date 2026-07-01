import { useState } from 'react';
import type { DragEvent } from 'react';
import { ArrowLeft, Shapes, CircleDot } from 'lucide-react';

export default function LabM7SetsAlgebra({ onExit }: { onExit?: () => void }) {
 const [activeTab, setActiveTab] = useState<'sets' | 'algebra'>('sets');
 
 // Sets State
 type Region = 'unassigned' | 'A' | 'B' | 'Intersection' | 'Universal';
 
 const [elements, setElements] = useState<{ id: number; region: Region }[]>([
 { id: 1, region: 'unassigned' },
 { id: 2, region: 'unassigned' },
 { id: 3, region: 'unassigned' },
 { id: 4, region: 'unassigned' },
 { id: 5, region: 'unassigned' },
 { id: 6, region: 'unassigned' },
 { id: 7, region: 'unassigned' },
 { id: 8, region: 'unassigned' },
 ]);

 const handleDragStart = (e: DragEvent<HTMLDivElement>, id: number) => {
 e.dataTransfer.setData('text/plain', id.toString());
 };

 const handleDrop = (e: DragEvent<HTMLDivElement>, targetRegion: Region) => {
 e.preventDefault();
 const id = parseInt(e.dataTransfer.getData('text/plain'));
 if (!isNaN(id)) {
  setElements(prev => prev.map(el => el.id === id ? { ...el, region: targetRegion } : el));
 }
 };

 const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
 e.preventDefault();
 };

 const checkSets = () => {
 const correctMap: Record<number, Region> = {
  1: 'A', 2: 'A',
  3: 'Intersection', 4: 'Intersection',
  5: 'B', 6: 'B',
  7: 'Universal', 8: 'Universal'
 };
 return elements.every(el => el.region === correctMap[el.id]);
 };

 // Algebra State
 const [term, setTerm] = useState(1);
 const [userPattern, setUserPattern] = useState('');
 const [algebraFeedback, setAlgebraFeedback] = useState('');

 const checkAlgebra = () => {
 const formatted = userPattern.replace(/\s+/g, '').toLowerCase();
 if (formatted === '3n+1' || formatted === '1+3n') {
  setAlgebraFeedback('Correct! 3n + 1 is the right expression.');
 } else {
  setAlgebraFeedback('Incorrect. Try counting the sticks for n=1, n=2, etc.');
 }
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] select-none">
  <header className="flex items-center p-4 shadow-sm z-10">
  <button
   onClick={onExit}
   className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
  >
   <ArrowLeft className="w-6 h-6" />
  </button>
  <h1 className="text-lg md:text-xl font-bold flex-1">Unit 5 & 6: Sets & Algebra Lab</h1>
  <div className="flex space-x-2">
   <button onClick={() => setActiveTab('sets')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'sets' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Sets</button>
   <button onClick={() => setActiveTab('algebra')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'algebra' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Algebra</button>
  </div>
  </header>

  <div className="lg:flex-1 min-w-0 flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 p-4 lg: overflow-y-auto lg:overflow-visible">
  {/* Left Controls */}
  <div className={`w-full bg-white dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col lg:overflow-y-auto  ? 'flex' : 'hidden'} lg:flex`}>
   {activeTab === 'sets' && (
   <div className="space-y-6 animate-in fade-in duration-300">
    <h2 className="text-lg font-semibold flex items-center">
    <CircleDot className="w-5 h-5 mr-2 text-indigo-500" />
    Venn Diagram Workspace
    </h2>
    <div className={`w-full bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800  'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    <p className="font-semibold mb-2">Given Sets:</p>
    <p className="font-mono mb-1">Universal Set (U) = {'{1, 2, 3, 4, 5, 6, 7, 8}'}</p>
    <p className="font-mono mb-1">A = {'{1, 2, 3, 4}'}</p>
    <p className="font-mono mb-1">B = {'{3, 4, 5, 6}'}</p>
    </div>
    <p className="text-sm text-slate-600 dark:text-[#71717a]">Drag the elements into the correct regions on the Venn diagram.</p>
    
    <div className={`w-full lg:min-h-[80px] p-4 bg-white lg:bg-slate-100 dark:bg-white lg:bg-slate-700 rounded-lg flex flex-wrap gap-2 border-2 border-dashed border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}
     onDrop={(e) => handleDrop(e, 'unassigned')}
     onDragOver={handleDragOver}>
    {elements.filter(e => e.region === 'unassigned').map(el => (
     <div key={el.id} draggable onDragStart={(e) => handleDragStart(e, el.id)}
      className="w-10 h-10 bg-white dark:bg-slate-600 rounded-full shadow flex items-center justify-center cursor-grab active:cursor-grabbing font-bold text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform">
     {el.id}
     </div>
    ))}
    {elements.filter(e => e.region === 'unassigned').length === 0 && (
     <span className="text-slate-400 dark:text-[#71717a] italic text-sm self-center">All elements placed!</span>
    )}
    </div>

    <button 
    onClick={() => alert(checkSets() ? 'Perfect! You placed all elements correctly.' : 'Not quite. Check your placement and try again.')}
    className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    Check Answer
    </button>
   </div>
   )}

   {activeTab === 'algebra' && (
   <div className="space-y-6 animate-in fade-in duration-300">
    <h2 className="text-lg font-semibold flex items-center">
    <Shapes className="w-5 h-5 mr-2 text-amber-500" />
    Algebraic Patterns
    </h2>
    <p className="text-sm text-slate-600 dark:text-[#71717a]">Observe the sequence of matchstick squares on the right.</p>
    
    <div>
    <label className="block text-sm font-medium mb-1">Number of Squares (n): {term}</label>
    <input type="range" min="1" max="10" step="1" value={term} onChange={(e) => setTerm(Number(e.target.value))} className="w-full accent-amber-600" />
    </div>

    <div className="bg-amber-50 dark:bg-amber-900/30 p-5 rounded-lg border border-amber-100 dark:border-amber-800 mt-4">
    <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">Deduce the Pattern</h3>
    <p className="text-sm mb-4">Let <span className="font-mono font-bold">n</span> be the number of squares. Write an algebraic expression for the total number of matchsticks required.</p>
    <div className="flex space-x-2">
     <input type="text" value={userPattern} onChange={(e) => setUserPattern(e.target.value)} className="flex-1 min-w-0 px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-[#1c1b1b] focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g., 2n + 1" />
     <button onClick={checkAlgebra} className="whitespace-nowrap flex-shrink-0 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors shadow-sm dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40">Check</button>
    </div>
    {algebraFeedback && <p className={`mt-3 text-sm font-medium ${algebraFeedback.includes('Correct') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{algebraFeedback}</p>}
    </div>
   </div>
   )}
  </div>

  {/* Right Stage */}
  <div className="bg-white dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col relative overflow-hidden items-center justify-center">
   
   {activeTab === 'sets' && (
   <div 
    className="w-full h-full min-h-[400px] border-4 border-dashed border-slate-200 dark:border-[#1c1b1b] rounded-xl relative p-4 bg-slate-50 dark:bg-[#121212] animate-in zoom-in duration-300"
    onDrop={(e) => handleDrop(e, 'Universal')}
    onDragOver={handleDragOver}
   >
    <div className="absolute top-4 left-4 font-bold text-2xl text-slate-400">U</div>
    
    {/* Universal Elements */}
    <div className="absolute inset-0 p-12 flex flex-wrap gap-3 content-start pointer-events-none z-0">
    {elements.filter(e => e.region === 'Universal').map(el => (
     <div key={el.id} draggable onDragStart={(e) => handleDragStart(e, el.id)}
      className="w-10 h-10 bg-white dark:bg-slate-600 rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing font-bold text-indigo-600 dark:text-indigo-400 pointer-events-auto hover:scale-110 transition-transform">
     {el.id}
     </div>
    ))}
    </div>

    {/* Venn Circles Container */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    {/* Circle A */}
    <div 
     className="w-56 h-56 rounded-full border-4 border-blue-400 bg-blue-100/40 dark:bg-blue-900/40 absolute -translate-x-16 flex flex-wrap content-center justify-center gap-2 pointer-events-auto shadow-sm"
     onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'A'); }}
     onDragOver={handleDragOver}
    >
     <span className="absolute top-6 left-8 font-bold text-xl text-blue-600 dark:text-blue-400">A</span>
     {elements.filter(e => e.region === 'A').map(el => (
     <div key={el.id} draggable onDragStart={(e) => handleDragStart(e, el.id)}
       className="w-10 h-10 z-10 bg-white dark:bg-slate-600 rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing font-bold text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform">
      {el.id}
     </div>
     ))}
    </div>

    {/* Circle B */}
    <div 
     className="w-56 h-56 rounded-full border-4 border-red-400 bg-red-100/40 dark:bg-red-900/40 absolute translate-x-16 flex flex-wrap content-center justify-center gap-2 pointer-events-auto shadow-sm"
     onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'B'); }}
     onDragOver={handleDragOver}
    >
     <span className="absolute top-6 right-8 font-bold text-xl text-red-600 dark:text-red-400">B</span>
     {elements.filter(e => e.region === 'B').map(el => (
     <div key={el.id} draggable onDragStart={(e) => handleDragStart(e, el.id)}
       className="w-10 h-10 z-10 bg-white dark:bg-slate-600 rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing font-bold text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform">
      {el.id}
     </div>
     ))}
    </div>

    {/* Intersection Area */}
    <div 
     className="w-28 h-40 absolute z-20 flex flex-wrap content-center justify-center gap-2 pointer-events-auto"
     onDrop={(e) => { e.stopPropagation(); handleDrop(e, 'Intersection'); }}
     onDragOver={handleDragOver}
    >
     {elements.filter(e => e.region === 'Intersection').map(el => (
     <div key={el.id} draggable onDragStart={(e) => handleDragStart(e, el.id)}
       className="w-10 h-10 bg-white dark:bg-slate-600 rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing font-bold text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform">
      {el.id}
     </div>
     ))}
    </div>
    </div>
   </div>
   )}

   {activeTab === 'algebra' && (
   <div className="w-full h-full flex flex-col items-center justify-center space-y-12 animate-in zoom-in duration-300">
    <div className="text-3xl font-bold bg-slate-100 dark:bg-slate-700 px-6 py-2 rounded-full shadow-inner text-amber-600 dark:text-amber-400">
    n = {term}
    </div>
    <div className="flex justify-center items-center py-8">
    {Array.from({ length: term }).map((_, i) => (
     <div key={i} className={`w-20 h-20 border-t-8 border-b-8 border-r-8 ${i === 0 ? 'border-l-8' : ''} border-amber-600 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-sm transition-all duration-300`}></div>
    ))}
    </div>
    <div className="text-xl">
    Total Matchsticks = <span className="font-bold text-2xl text-amber-600 dark:text-amber-400">{term * 3 + 1}</span>
    </div>
    <div className="text-sm text-slate-500 dark:text-[#71717a] max-w-sm text-center bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    💡 <strong>Hint:</strong> The first square requires 4 sticks. Each additional square shares one side with the previous square, so it only requires 3 more sticks!
    </div>
   </div>
   )}

  </div>
  </div>
 </div>
 );
}
