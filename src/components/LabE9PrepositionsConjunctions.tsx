import { useState } from 'react';
import { BookOpen, Beaker, Terminal, CheckCircle2, XCircle, Shield, MoveRight } from 'lucide-react';
import LabHeader from './LabHeader';

const BRIDGE_DATA = [
 {
 islandA: "We stayed inside",
 islandB: "the heavy rain.",
 options: ["because of", "in addition to", "even though", "so that"],
 correct: "because of",
 type: "Compound Preposition"
 },
 {
 islandA: "She will",
 islandB: "take the train nor fly.",
 options: ["either / or", "neither / nor", "not only / but also", "both / and"],
 correct: "neither / nor",
 type: "Correlative Conjunction"
 },
 {
 islandA: "I will call you",
 islandB: "I arrive at the station.",
 options: ["as soon as", "even though", "in front of", "so that"],
 correct: "as soon as",
 type: "Subordinating Conjunction"
 },
 {
 islandA: "The car was parked",
 islandB: "the fire hydrant.",
 options: ["because of", "in addition to", "in front of", "instead of"],
 correct: "in front of",
 type: "Compound Preposition"
 },
 {
 islandA: "We should study",
 islandB: "we can pass the exam.",
 options: ["so that", "even if", "because of", "although"],
 correct: "so that",
 type: "Subordinating Conjunction"
 }
];

const ASSESSMENT_QUESTIONS = [
 {
 question: "Which of the following is a compound preposition?",
 options: ["And", "Although", "In front of", "Because"],
 correct: 2
 },
 {
 question: "Which conjunction type joins a dependent clause to an independent clause?",
 options: ["Coordinating", "Subordinating", "Correlative", "None of the above"],
 correct: 1
 },
 {
 question: "What is the acronym for coordinating conjunctions?",
 options: ["BOSSFAN", "FANBOYS", "BOYSFAN", "FABNOYS"],
 correct: 1
 }
];

export default function LabE9PrepositionsConjunctions({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentIndex, setCurrentIndex] = useState(0);
 const [selectedBridge, setSelectedBridge] = useState<string | null>(null);
 const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle');
 const [logs, setLogs] = useState<{ id: number; message: string; success: boolean }[]>([]);
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const currentData = BRIDGE_DATA[currentIndex];

 const handleBuild = (option: string) => {
 setSelectedBridge(option);
 if (option === currentData.correct) {
  setResult('success');
  setLogs((prev) => [{ id: Date.now(), message: `Bridge constructed: "${currentData.islandA} [${option}] ${currentData.islandB}" (${currentData.type})`, success: true }, ...prev]);
 } else {
  setResult('error');
  setLogs((prev) => [{ id: Date.now(), message: `Bridge failed: "${currentData.islandA} [${option}] ${currentData.islandB}" is structurally unsound.`, success: false }, ...prev]);
 }
 };

 const nextIsland = () => {
 setCurrentIndex((prev) => (prev + 1) % BRIDGE_DATA.length);
 setSelectedBridge(null);
 setResult('idle');
 };

 const calculateScore = () => {
 let score = 0;
 ASSESSMENT_QUESTIONS.forEach((q, idx) => {
  if (assessmentAnswers[idx] === q.correct) score++;
 });
 return score;
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#121212] dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#a1a1aa] selection:bg-[#4158D1]/20">
  <LabHeader title="Bridge Builder: Prepositions & Conjunctions" onExit={onExit} />
  
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

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg: overflow-y-auto lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] overflow-hidden flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 mb-4 shrink-0">
   <BookOpen className="w-5 h-5 text-[#4158D1]" />
   <h2 className="font-semibold text-slate-800 dark:text-white">Grammar Manual</h2>
   </div>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
   <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-0">1. Subordinating Conjunctions</h3>
   <p>
    These conjunctions introduce a <strong>dependent clause</strong> and tie it to an <strong>independent clause</strong>. They show cause and effect, time, or condition.
   </p>
   <ul className="list-disc pl-5 mb-4 space-y-1">
    <li><strong>Examples:</strong> because, although, since, as soon as, unless.</li>
    <li><em>I will call you <strong>as soon as</strong> I arrive.</em></li>
   </ul>

   <h3 className="text-lg font-bold text-slate-800 dark:text-white">2. Coordinating Conjunctions</h3>
   <p>
    They connect words, phrases, or clauses of equal grammatical rank. Remember the acronym <strong>FANBOYS</strong>.
   </p>
   <ul className="list-disc pl-5 mb-4 space-y-1">
    <li><strong>F</strong>or, <strong>A</strong>nd, <strong>N</strong>or, <strong>B</strong>ut, <strong>O</strong>r, <strong>Y</strong>et, <strong>S</strong>o.</li>
    <li><em>She wanted to go, <strong>but</strong> it was raining.</em></li>
   </ul>

   <h3 className="text-lg font-bold text-slate-800 dark:text-white">3. Correlative Conjunctions</h3>
   <p>
    These come in pairs and connect equal parts of a sentence.
   </p>
   <ul className="list-disc pl-5 mb-4 space-y-1">
    <li><strong>Examples:</strong> either/or, neither/nor, not only/but also.</li>
    <li><em>He will <strong>neither</strong> take the train <strong>nor</strong> fly.</em></li>
   </ul>

   <h3 className="text-lg font-bold text-slate-800 dark:text-white">4. Compound Prepositions</h3>
   <p>
    A compound preposition is a two- or three-word phrase that functions as a single preposition. They show spatial, temporal, or logical relationships.
   </p>
   <ul className="list-disc pl-5 mb-4 space-y-1">
    <li><strong>Examples:</strong> in front of, because of, in addition to, next to.</li>
    <li><em>The car was parked <strong>in front of</strong> the fire hydrant.</em></li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-2 mb-6 shrink-0">
   <Terminal className="w-5 h-5 text-[#4158D1]" />
   <h2 className="font-semibold text-slate-800 dark:text-white">Bridge Controls</h2>
   </div>
   
   <div className="flex-1 overflow-y-auto pr-2 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
   {/* Materials Selection */}
   <div>
    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
    Available Materials
    </div>
    <div className="grid grid-cols-2 gap-3">
    {currentData.options.map(opt => (
     <button
     key={opt}
     disabled={result === 'success'}
     onClick={() => handleBuild(opt)}
     className={`p-3 rounded-lg font-medium text-sm transition-all border-2 ${ selectedBridge === opt ? result === 'success' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' : ' border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#4158D1] dark:hover:border-[#4158D1]' } disabled:opacity-75`}
     >
     {opt.replace(' / ', ' ... ')}
     </button>
    ))}
    </div>

    {result !== 'idle' && (
    <div className={`mt-4 flex items-center justify-between p-3 rounded-lg animate-in fade-in zoom-in duration-300 gap-3 ${ result === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800' }`}>
     <div className={`flex items-center gap-2 ${result === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
     {result === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
     <span className="font-semibold text-sm">{result === 'success' ? 'Bridge Built!' : 'Integrity Failed!'}</span>
     </div>
     {result === 'success' && (
     <button onClick={nextIsland} className={`px-3 py-1.5 bg-[#4158D1] hover:bg-[#3144a5] text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5 flex-col `}>
      Next <MoveRight className="w-3.5 h-3.5" />
     </button>
     )}
    </div>
    )}
   </div>

   {/* Knowledge Assessment */}
   <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
    <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-white">
    <Shield className="w-4 h-4 text-[#4158D1]" />
    <h3 className="font-semibold text-sm uppercase tracking-wider">Knowledge Assessment</h3>
    </div>
    
    <div className="space-y-6">
    {!assessmentSubmitted ? (
     <>
     {ASSESSMENT_QUESTIONS.map((q, idx) => (
      <div key={idx} className="space-y-2">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{idx + 1}. {q.question}</p>
      <div className="space-y-1">
       {q.options.map((opt, optIdx) => (
       <label key={optIdx} className={`flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded transition-colors flex-col `}>
        <input
        type="radio"
        name={`q-${idx}`}
        checked={assessmentAnswers[idx] === optIdx}
        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [idx]: optIdx }))}
        className="text-[#4158D1] focus:ring-[#4158D1]"
        />
        <span className="text-slate-600 dark:text-[#a1a1aa]">{opt}</span>
       </label>
       ))}
      </div>
      </div>
     ))}
     <button
      onClick={() => setAssessmentSubmitted(true)}
      disabled={Object.keys(assessmentAnswers).length < ASSESSMENT_QUESTIONS.length}
      className={`w-full py-2 bg-[#4158D1] hover:bg-[#3144a5] disabled:bg-slate-300 disabled:dark:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex-col `}
     >
      Submit Assessment
     </button>
     </>
    ) : (
     <div className="flex flex-col items-center justify-center space-y-3 py-6 rounded-xl border border-slate-200 dark:border-slate-700">
     <div className="text-3xl font-bold text-[#4158D1]">
      {calculateScore()} / {ASSESSMENT_QUESTIONS.length}
     </div>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa] font-medium">Assessment Completed</p>
     <button
      onClick={() => { setAssessmentSubmitted(false); setAssessmentAnswers({}); }}
      className="px-4 py-2 text-sm font-medium text-[#4158D1] bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
     >
      Retake
     </button>
     </div>
    )}
    </div>
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative p-4 md:p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   
   <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{ backgroundImage: 'radial-gradient(#4158D1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
   
   <div className="flex flex-col items-center justify-center w-full max-w-2xl gap-8 relative z-10 flex-grow">
   <div className="flex items-center gap-2 mb-2 bg-white/80 dark:bg-[#121212]/80 backdrop-blur px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800">
    <Beaker className="w-5 h-5 text-[#4158D1]" />
    <h2 className="font-semibold text-slate-800 dark:text-white">Bridge Simulation</h2>
   </div>

   <div className="flex flex-col md:flex-row items-stretch justify-center w-full gap-4">
    <div className="flex-1 bg-sky-100 dark:bg-sky-900/40 border-2 border-sky-300 dark:border-sky-700 rounded-xl p-4 md:p-6 flex items-center justify-center text-center shadow-sm relative min-h-[100px] md:min-h-[120px]">
    <span className="text-base md:text-xl font-medium text-sky-900 dark:text-sky-100">{currentData.islandA}</span>
    </div>
    
    <div className="flex flex-col justify-center items-center px-2 md:px-4">
    <div className={`h-6 w-2 md:h-2 md:w-12 ${result === 'success' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'} transition-colors`}></div>
    <div className={`px-4 py-3 rounded-lg border-2 font-bold text-center min-w-[120px] md:min-w-[140px] whitespace-pre-wrap transition-all shadow-md ${ selectedBridge ? result === 'success' ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300' : 'border-red-500 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : 'border-dashed border-[#4158D1] bg-indigo-50 dark:bg-indigo-900/30 text-[#4158D1] dark:text-indigo-300' }`}>
     {selectedBridge || '???'}
    </div>
    <div className={`h-6 w-2 md:h-2 md:w-12 ${result === 'success' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'} transition-colors`}></div>
    </div>

    <div className="flex-1 bg-indigo-100 dark:bg-indigo-900/40 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl p-4 md:p-6 flex items-center justify-center text-center shadow-sm relative min-h-[100px] md:min-h-[120px]">
    <span className="text-base md:text-xl font-medium text-indigo-900 dark:text-indigo-100">{currentData.islandB}</span>
    </div>
   </div>
   </div>

   {/* Construction Logs Mini View */}
   <div className="w-full mt-auto bg-white/80 dark:bg-[#121212]/80 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-800 p-4 max-h-40 flex flex-col z-10">
   <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 shrink-0">Construction Logs</div>
   <div className="overflow-y-auto space-y-2 font-mono text-xs scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 pr-2">
    {logs.length === 0 ? (
    <p className="text-slate-400 dark:text-[#71717a] text-center mt-2">Waiting for operations...</p>
    ) : (
    logs.map(log => (
     <div key={log.id} className={`p-2 rounded border-l-2 ${log.success ? 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-500 text-slate-700 dark:text-slate-300' : 'bg-red-50/50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'}`}>
     <span className="opacity-50">[{new Date(log.id).toLocaleTimeString()}]</span> {log.message}
     </div>
    ))
    )}
   </div>
   </div>
  </section>

  </main>
 </div>
 );
}
