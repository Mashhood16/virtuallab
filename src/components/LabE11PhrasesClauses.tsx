import { useState, MouseEvent } from 'react';
import { ArrowLeft, Check, RefreshCw, Layers } from 'lucide-react';

type ChunkType = 'independent' | 'dependent' | 'prep_phrase' | 'noun_clause' | 'relative_clause' | 'adverb_clause' | 'none';

interface Chunk {
 id: string;
 text: string;
 correctType: ChunkType;
}

interface Sentence {
 id: number;
 chunks: Chunk[];
}

const CATEGORIES: { id: ChunkType; label: string; color: string; bg: string; border: string }[] = [
 { id: 'independent', label: 'Independent Clause', color: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-100 dark:bg-indigo-900/40', border: 'border-indigo-300 dark:border-indigo-700' },
 { id: 'dependent', label: 'Dependent Clause', color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-100 dark:bg-orange-900/40', border: 'border-orange-300 dark:border-orange-700' },
 { id: 'prep_phrase', label: 'Prepositional Phrase', color: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-100 dark:bg-teal-900/40', border: 'border-teal-300 dark:border-teal-700' },
 { id: 'noun_clause', label: 'Noun Clause', color: 'text-pink-700 dark:text-pink-300', bg: 'bg-pink-100 dark:bg-pink-900/40', border: 'border-pink-300 dark:border-pink-700' },
 { id: 'relative_clause', label: 'Relative Clause', color: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-100 dark:bg-indigo-900/40', border: 'border-indigo-300 dark:border-indigo-700' },
 { id: 'adverb_clause', label: 'Adverb Clause', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/40', border: 'border-emerald-300 dark:border-emerald-700' },
];

const SENTENCES: Sentence[] = [
 {
 id: 1,
 chunks: [
  { id: '1-1', text: 'Because it was raining heavily, ', correctType: 'adverb_clause' },
  { id: '1-2', text: 'we decided ', correctType: 'independent' },
  { id: '1-3', text: 'that we should stay ', correctType: 'noun_clause' },
  { id: '1-4', text: 'inside the house.', correctType: 'prep_phrase' }
 ]
 },
 {
 id: 2,
 chunks: [
  { id: '2-1', text: 'The ancient manuscript, ', correctType: 'none' },
  { id: '2-2', text: 'which was discovered ', correctType: 'relative_clause' },
  { id: '2-3', text: 'under the floorboards, ', correctType: 'prep_phrase' },
  { id: '2-4', text: 'revealed secrets ', correctType: 'independent' },
  { id: '2-5', text: 'although it was damaged.', correctType: 'adverb_clause' }
 ]
 },
 {
 id: 3,
 chunks: [
  { id: '3-1', text: 'Whoever finishes first ', correctType: 'noun_clause' },
  { id: '3-2', text: 'will receive the grand prize ', correctType: 'independent' },
  { id: '3-3', text: 'at the ceremony.', correctType: 'prep_phrase' }
 ]
 }
];

export default function LabE11PhrasesClauses({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTool, setActiveTool] = useState<ChunkType>('independent');
 const [chunkAssignments, setChunkAssignments] = useState<Record<string, ChunkType>>({});
 const [feedback, setFeedback] = useState<Record<string, boolean | null>>({});
 const [score, setScore] = useState<number | null>(null);

 const handleChunkClick = (chunkId: string, correctType: ChunkType) => {
 if (correctType === 'none') return;

 setChunkAssignments(prev => ({
  ...prev,
  [chunkId]: activeTool
 }));
 setFeedback(prev => ({ ...prev, [chunkId]: null }));
 };

 const clearChunk = (e: MouseEvent, chunkId: string) => {
 e.stopPropagation();
 setChunkAssignments(prev => {
  const next = { ...prev };
  delete next[chunkId];
  return next;
 });
 setFeedback(prev => {
  const next = { ...prev };
  delete next[chunkId];
  return next;
 });
 };

 const checkAnswers = () => {
 let currentScore = 0;
 let totalAssessable = 0;
 const newFeedback: Record<string, boolean> = {};
 
 SENTENCES.forEach(sentence => {
  sentence.chunks.forEach(chunk => {
  if (chunk.correctType !== 'none') {
   totalAssessable++;
   const isCorrect = chunkAssignments[chunk.id] === chunk.correctType;
   newFeedback[chunk.id] = isCorrect;
   if (isCorrect) currentScore++;
  }
  });
 });
 
 setFeedback(newFeedback);
 setScore(currentScore);
 };

 const reset = () => {
 setChunkAssignments({});
 setFeedback({});
 setScore(null);
 };

 const getToolStyles = (type: ChunkType) => {
 const category = CATEGORIES.find(c => c.id === type);
 if (!category) return 'bg-slate-100 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] border-slate-300 dark:border-slate-600';
 return `${category.bg} ${category.color} ${category.border} border-2 font-bold`;
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#121212] font-sans select-none text-slate-900 dark:text-[#ffffff]">
  {/* Header */}
  <div className="w-full shadow-sm p-4 flex items-center justify-between z-10 flex-shrink-0 border-b border-slate-200 dark:border-[#1c1b1b]">
  <div className="flex items-center gap-4">
   <button
   onClick={onExit}
   className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
   title="Go Back"
   >
   <ArrowLeft className="w-6 h-6" />
   </button>
   <h1 className="text-lg md:text-xl font-bold">Lab: Phrases & Clauses Highlighter</h1>
  </div>
  <div className="flex items-center gap-2">
   {score !== null && (
   <span className="font-semibold text-lg mr-4 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
    Score: {score}
   </span>
   )}
   <button
   onClick={reset}
   className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0"
   >
   <RefreshCw className="w-4 h-4" /> Reset
   </button>
  </div>
  </div>

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

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg: overflow-y-auto lg:overflow-visible">
  {/* Window 1: Theory */}
  <section className={`rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] overflow-hidden ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-full pr-2 pb-10">
   <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Phrases and Clauses</h2>
   <p className="mb-2">A <strong>clause</strong> is a group of words that contains a subject and a verb.</p>
   <ul className="list-disc pl-5 space-y-2 mb-4">
    <li><strong>Independent Clause:</strong> Can stand alone as a complete sentence. <em>(e.g., The sun is shining.)</em></li>
    <li><strong>Dependent Clause:</strong> Cannot stand alone and begins with a subordinating conjunction or relative pronoun. <em>(e.g., Because it is raining...)</em></li>
   </ul>
   
   <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800 dark:text-white">Types of Dependent Clauses</h3>
   <ul className="list-disc pl-5 space-y-2 mb-4">
    <li><strong>Noun Clause:</strong> Functions as a noun in the sentence. <em>(e.g., I know <strong>what you did</strong>.)</em></li>
    <li><strong>Relative Clause (Adjective Clause):</strong> Modifies a noun or pronoun. <em>(e.g., The book <strong>that I borrowed</strong> is great.)</em></li>
    <li><strong>Adverb Clause:</strong> Functions as an adverb, modifying verbs, adjectives, or other adverbs. <em>(e.g., He left <strong>when the bell rang</strong>.)</em></li>
   </ul>

   <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800 dark:text-white">Phrases</h3>
   <p className="mb-2">A <strong>phrase</strong> is a group of related words that does <em>not</em> contain both a subject and a verb. It functions as a single part of speech.</p>
   <ul className="list-disc pl-5 space-y-2">
    <li><strong>Prepositional Phrase:</strong> Begins with a preposition and ends with a noun or pronoun object. <em>(e.g., <strong>under the bed</strong>, <strong>in the morning</strong>)</em></li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col lg:h-full ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="mb-6 flex-shrink-0">
   <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 dark:text-white">
    <Layers className="w-5 h-5 text-indigo-500" />
    Syntactic Tools
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    Select a syntactic category below, then click on the corresponding chunks in the Simulation Stage to highlight them.
   </p>
   </div>

   <div className="flex flex-col gap-3 flex-grow overflow-y-auto pr-2 pb-4">
   {CATEGORIES.map(category => (
    <button
    key={category.id}
    onClick={() => setActiveTool(category.id)}
    className={`text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
     activeTool === category.id
     ? \`\${category.bg} \${category.border} \${category.color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#1c1b1b] ring-\${category.border.split('-')[1]}-400 scale-[1.02]\`
     : ' border-slate-200 dark:border-[#2a2a2a] hover:bg-slate-50 dark:hover:bg-[#2a2a2a]'
    }`}
    >
    <div className="font-bold text-md">{category.label}</div>
    </button>
   ))}
   </div>

   <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#2a2a2a] flex-shrink-0">
   <button
    onClick={checkAnswers}
    className={`w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-colors whitespace-nowrap shadow-md dark:bg-indigo-500 dark:hover:bg-indigo-400 flex-col `}
   >
    <Check className="w-6 h-6" /> Evaluate Analysis
   </button>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="w-full h-full flex flex-col overflow-y-auto pr-2">
   <div className="mb-6 max-w-3xl mx-auto w-full text-center md:text-left flex-shrink-0">
    <h2 className="text-xl md:text-2xl font-bold mb-2 dark:text-white">Sentence Analysis Stage</h2>
    <p className="text-sm md:text-base text-slate-600 dark:text-[#a1a1aa]">
    Apply your selected syntactic tools to classify the highlighted chunks.
    </p>
   </div>
   
   <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-8">
    {SENTENCES.map(sentence => (
    <div key={sentence.id} className={`rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-[#1c1b1b] leading-loose text-base md:text-lg flex-col `}>
     <div className="flex flex-wrap items-center gap-y-6">
     {sentence.chunks.map(chunk => {
      const assignedType = chunkAssignments[chunk.id];
      const category = CATEGORIES.find(c => c.id === assignedType);
      const isEvaluated = feedback[chunk.id] !== undefined && feedback[chunk.id] !== null;
      const isCorrect = feedback[chunk.id] === true;
      
      if (chunk.correctType === 'none') {
      return <span key={chunk.id} className="text-slate-800 dark:text-[#ffffff] mr-1">{chunk.text}</span>;
      }

      return (
      <span
       key={chunk.id}
       onClick={() => handleChunkClick(chunk.id, chunk.correctType)}
       className={`relative group cursor-pointer px-2 py-1 mx-1 rounded-lg border-2 transition-all inline-block ${assignedType ? getToolStyles(assignedType) : 'bg-slate-100 dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'} ${isEvaluated && !isCorrect ? 'ring-2 ring-red-500 animate-pulse' : ''}`}
      >
       {chunk.text}
       
       {/* Clear button overlay */}
       {assignedType && !isEvaluated && (
       <button
        onClick={(e) => clearChunk(e, chunk.id)}
        className={`absolute -top-3 -right-3 rounded-full text-slate-400 hover:text-red-500 shadow-sm border border-slate-200 dark:border-[#1c1b1b] opacity-0 group-hover:opacity-100 transition-opacity flex-col `}
       >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
       </button>
       )}
       
       {/* Label Badge */}
       {assignedType && (
       <span className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm transition-opacity z-10 border ${category?.border} opacity-0 group-hover:opacity-100`}>
        {category?.label}
       </span>
       )}

       {/* Result Icon */}
       {isEvaluated && (
       <span className="absolute -bottom-3 right-0 transform translate-x-1/4 translate-y-1/4 z-20 rounded-full p-0.5 shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
        {isCorrect ? (
        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
        ) : (
        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
        )}
       </span>
       )}
      </span>
      );
     })}
     </div>
    </div>
    ))}
   </div>
   </div>
  </section>
  </main>
 </div>
 );
}
