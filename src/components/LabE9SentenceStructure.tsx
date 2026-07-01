import { useState, useMemo } from 'react';
import { GitMerge, CheckCircle2, XCircle, BookOpen, Terminal, Shield, Combine, MoveRight } from 'lucide-react';
import LabHeader from './LabHeader';

const COLLIDER_DATA = [
 {
 clause1: "If you heat ice,",
 clause2: "it melts.",
 type: "Zero Conditional",
 rule: "Used for general truths. (If + present simple, present simple).",
 wrongOptions: ["it will melt.", "it would melt.", "it is melting."]
 },
 {
 clause1: "If it rains tomorrow,",
 clause2: "we will cancel the picnic.",
 type: "Type-1 Conditional",
 rule: "Used for future possibilities. (If + present simple, will + base verb).",
 wrongOptions: ["we would cancel the picnic.", "we canceled the picnic.", "we cancel the picnic."]
 },
 {
 clause1: "Although he was tired,",
 clause2: "he finished his homework.",
 type: "Complex Sentence",
 rule: "A dependent clause joined with an independent clause.",
 wrongOptions: ["but he finished his homework.", "so he finished his homework.", "and he finished his homework."]
 },
 {
 clause1: "Unless you study hard,",
 clause2: "you will fail the exam.",
 type: "Type-1 Conditional",
 rule: "Unless means 'if not'. Requires future tense in main clause.",
 wrongOptions: ["you fail the exam.", "you would fail the exam.", "you have failed the exam."]
 },
 {
 clause1: "When the sun goes down,",
 clause2: "it gets dark.",
 type: "Zero Conditional",
 rule: "General fact. (When + present simple, present simple).",
 wrongOptions: ["it will get dark.", "it would get dark.", "it got dark."]
 }
];

const ASSESSMENT_QUESTIONS = [
 {
 question: "Which tense is used in the main clause of a Type 1 conditional?",
 options: ["Simple Present", "Simple Past", "Future (will + verb)", "Present Perfect"],
 correct: 2
 },
 {
 question: "What does a Zero Conditional express?",
 options: ["A hypothetical situation", "A general truth or scientific fact", "A past regret", "A future possibility"],
 correct: 1
 },
 {
 question: "What must be attached to a dependent clause to make it a complete sentence?",
 options: ["A preposition", "A subordinating conjunction", "An independent clause", "An adjective"],
 correct: 2
 }
];

export default function LabE9SentenceStructure({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentIndex, setCurrentIndex] = useState(0);
 const [selectedOption, setSelectedOption] = useState<string | null>(null);
 const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle');
 const [logs, setLogs] = useState<{ id: number; message: string; success: boolean }[]>([]);
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
 const [controlView, setControlView] = useState<'options' | 'assessment'>('options');

 const currentData = COLLIDER_DATA[currentIndex];
 
 const options = useMemo(() => {
 return [currentData.clause2, ...currentData.wrongOptions].sort((a, b) => a.length - b.length);
 }, [currentIndex, currentData]);

 const handleSelect = (opt: string) => {
 setSelectedOption(opt);
 if (opt === currentData.clause2) {
  setResult('success');
  setLogs((prev) => [{ id: Date.now(), message: `Collided: "${currentData.clause1} ${opt}" (${currentData.type})`, success: true }, ...prev]);
 } else {
  setResult('error');
  setLogs((prev) => [{ id: Date.now(), message: `Collision Failed: Tense/Logic mismatch with "${opt}"`, success: false }, ...prev]);
 }
 };

 const nextCollider = () => {
 setCurrentIndex((prev) => (prev + 1) % COLLIDER_DATA.length);
 setSelectedOption(null);
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
 <div className="min-h-screen flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#a1a1aa] selection:bg-indigo-200 dark:selection:bg-indigo-900">
  <LabHeader title="Clause Collider: Conditionals & Structure" variant="blue" onExit={onExit} />
  
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
  
  {/* Window 1 (Theory) */}
  <section className={`rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <div className="flex items-center gap-2 mb-6">
   <BookOpen className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
   <h2 className="font-semibold text-slate-800 dark:text-[#ffffff]">Grammar Manual</h2>
   </div>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">1. Dependent vs Independent Clauses</h3>
   <p>
    An <strong>independent clause</strong> can stand alone as a complete sentence. A <strong>dependent clause</strong> has a subject and a verb but cannot stand alone because it begins with a subordinating conjunction (e.g., if, when, because).
   </p>
   <div className={`bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800/50 mb-6 mt-2 flex-col `}>
    <p className="font-mono text-xs text-indigo-800 dark:text-indigo-300">
    Dep: If you study hard,<br/>Ind: you will pass the exam.
    </p>
   </div>

   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">2. Zero Conditional</h3>
   <p>
    Used to express general truths, scientific facts, or habits. The condition always has the same result.
   </p>
   <ul className="list-disc pl-5 my-2">
    <li><strong>Structure:</strong> If + Present Simple, Present Simple</li>
   </ul>
   <div className={`bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800/50 mb-6 mt-2 flex-col `}>
    <p className="font-mono text-xs text-indigo-800 dark:text-indigo-300">
    Example: If you heat ice, it melts.
    </p>
   </div>

   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">3. Type 1 Conditional</h3>
   <p>
    Used to express real or very probable situations in the present or future.
   </p>
   <ul className="list-disc pl-5 my-2">
    <li><strong>Structure:</strong> If + Present Simple, Will + Base Verb</li>
   </ul>
   <div className={`bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800/50 mb-6 mt-2 flex-col `}>
    <p className="font-mono text-xs text-indigo-800 dark:text-indigo-300">
    Example: If it rains, I will stay at home.
    </p>
   </div>
   
   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">4. Conjunctions & Logic</h3>
   <p>
    Words like <strong>although</strong>, <strong>unless</strong>, and <strong>because</strong> set up specific logical relationships:
   </p>
   <ul className="list-disc pl-5 my-2">
    <li><strong>Although:</strong> Contrast or unexpected result.</li>
    <li><strong>Unless:</strong> Means "if not".</li>
    <li><strong>Because:</strong> Shows cause and effect.</li>
   </ul>
   </div>
  </section>

  {/* Window 2 (Controls) */}
  <section className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex gap-2 mb-6">
   <button 
    onClick={() => setControlView('options')}
    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex-1 ${controlView === 'options' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 dark:text-[#a1a1aa] hover:bg-slate-200 dark:hover:bg-[#2a2a2a]'}`}
   >
    Clause Options
   </button>
   <button 
    onClick={() => setControlView('assessment')}
    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex-1 ${controlView === 'assessment' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 dark:text-[#a1a1aa] hover:bg-slate-200 dark:hover:bg-[#2a2a2a]'}`}
   >
    Assessment
   </button>
   </div>

   <div className="flex-1 overflow-y-auto pr-2">
   {controlView === 'options' ? (
    <div className="space-y-6">
    <div>
     <h3 className="text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-3 uppercase tracking-wider">Select Independent Clause</h3>
     <div className="grid grid-cols-1 gap-3">
     {options.map(opt => (
      <button
      key={opt}
      disabled={result === 'success'}
      onClick={() => handleSelect(opt)}
      className={`p-4 rounded-xl text-left font-medium transition-all border-2 ${ selectedOption === opt ? result === 'success' ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : ' border-slate-200 dark:border-[#2a2a2a] hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md text-slate-700 dark:text-[#e4e4e7]' } disabled:opacity-75`}
      >
      {opt}
      </button>
     ))}
     </div>
    </div>

    {logs.length > 0 && (
     <div>
     <h3 className="text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-3 uppercase tracking-wider flex items-center gap-2">
      <Terminal className="w-4 h-4" /> Collision Logs
     </h3>
     <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto pr-2">
      {logs.map(log => (
      <div key={log.id} className={`p-2 rounded border-l-2 ${log.success ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-slate-700 dark:text-[#a1a1aa]' : 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300'}`}>
       <span className="opacity-50">[{new Date(log.id).toLocaleTimeString()}]</span> {log.message}
      </div>
      ))}
     </div>
     </div>
    )}
    </div>
   ) : (
    <div className="space-y-6">
    {!assessmentSubmitted ? (
     <>
     {ASSESSMENT_QUESTIONS.map((q, idx) => (
      <div key={idx} className="space-y-2">
      <p className="text-sm font-medium text-slate-800 dark:text-[#ffffff]">{idx + 1}. {q.question}</p>
      <div className="space-y-2">
       {q.options.map((opt, optIdx) => (
       <label key={optIdx} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-[#2a2a2a] p-2 rounded transition-colors">
        <input
        type="radio"
        name={`q-${idx}`}
        checked={assessmentAnswers[idx] === optIdx}
        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [idx]: optIdx }))}
        className="text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
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
      className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
     >
      Submit Assessment
     </button>
     </>
    ) : (
     <div className="flex flex-col items-center justify-center py-12 space-y-4">
     <div className="text-5xl font-bold text-indigo-500 dark:text-indigo-400">
      {calculateScore()} / {ASSESSMENT_QUESTIONS.length}
     </div>
     <p className="text-slate-600 dark:text-[#a1a1aa] font-medium">Assessment Completed</p>
     <button
      onClick={() => { setAssessmentSubmitted(false); setAssessmentAnswers({}); }}
      className="px-6 py-2 mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
     >
      Retake
     </button>
     </div>
    )}
    </div>
   )}
   </div>
  </section>

  {/* Window 3 (Simulation) */}
  <section className={`bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/20 dark:to-purple-900/20 z-0"></div>
   
   <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-6">
   <div className="flex items-center gap-2 mb-4">
    <Combine className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
    <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">Clause Collider</h2>
   </div>
   
   <div className="w-full border-2 border-slate-300 dark:border-[#2a2a2a] rounded-2xl p-6 flex flex-col justify-center text-center shadow-sm relative">
    <span className="text-xs font-bold text-slate-400 dark:text-[#71717a] uppercase tracking-widest absolute top-3 left-0 w-full">Dependent Clause</span>
    <span className="text-xl md:text-2xl font-medium mt-4 text-slate-800 dark:text-[#ffffff]">{currentData.clause1}</span>
   </div>
   
   <div className="flex justify-center items-center">
    <GitMerge className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
   </div>

   <div className={`w-full border-2 rounded-2xl p-6 flex flex-col justify-center text-center relative transition-colors ${ selectedOption ? result === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-lg' : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 shadow-md' : 'border-dashed border-indigo-300 dark:border-indigo-700 text-slate-400 dark:text-[#71717a]' }`}>
    <span className="text-xs font-bold opacity-60 uppercase tracking-widest absolute top-3 left-0 w-full">Independent Clause</span>
    <span className="text-xl md:text-2xl font-medium mt-4">{selectedOption || "Awaiting Selection..."}</span>
   </div>

   {result !== 'idle' && (
    <div className={`mt-4 w-full flex flex-col items-center justify-center p-4 rounded-xl animate-in fade-in zoom-in duration-300 gap-4 text-center ${ result === 'success' ? 'bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800' }`}>
    <div className={`flex flex-col items-center gap-2 ${result === 'success' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
     {result === 'success' ? <CheckCircle2 className="w-8 h-8 shrink-0" /> : <XCircle className="w-8 h-8 shrink-0" />}
     <div>
     <p className="font-bold text-lg">{result === 'success' ? 'Collision Successful!' : 'Tense/Logic Mismatch!'}</p>
     {result === 'success' && (
      <p className="text-sm opacity-90 mt-1"><strong>{currentData.type}</strong>: {currentData.rule}</p>
     )}
     </div>
    </div>
    {result === 'success' && (
     <button onClick={nextCollider} className="mt-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
     Next Sentence <MoveRight className="w-4 h-4" />
     </button>
    )}
    </div>
   )}
   </div>
  </section>
  </main>
 </div>
 );
}
