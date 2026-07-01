import { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, FileEdit, History, ArrowRight, PenTool } from 'lucide-react';
import LabHeader from './LabHeader';

const EDITOR_DATA = [
 {
 id: 1,
 original: "The company announced it was 'downsizing' its workforce and letting go of several 'associates'.",
 issue: "Euphemism",
 options: ["downsizing", "firing", "terminating", "letting go"],
 correct: "firing",
 prompt: "Replace the corporate euphemism 'downsizing' with a more direct, accurate term for mass job losses:",
 rule: "A euphemism is a mild or indirect word substituted for one considered to be too harsh or blunt."
 },
 {
 id: 2,
 original: "He experienced an 'awfully good' day at the amusement park.",
 issue: "Oxymoron",
 options: ["terribly good", "awfully good", "extremely good", "badly good"],
 correct: "extremely good",
 prompt: "Identify and replace the oxymoron 'awfully good' with a standard intensifier:",
 rule: "An oxymoron is a figure of speech in which apparently contradictory terms appear in conjunction (e.g., 'awfully good', 'deafening silence')."
 },
 {
 id: 3,
 original: "We need a well known expert to review this high risk project.",
 issue: "Hyphenation",
 options: ["well known expert", "well-known expert", "well known-expert"],
 correct: "well-known expert",
 prompt: "Fix the compound adjective describing the expert:",
 rule: "Use a hyphen to join two or more words serving as a single adjective before a noun (e.g., 'well-known expert', 'high-risk project')."
 },
 {
 id: 4,
 original: "She bought a state of the art computer system.",
 issue: "Hyphenation",
 options: ["state of the art computer", "state-of-the-art computer", "state of-the-art computer"],
 correct: "state-of-the-art computer",
 prompt: "Hyphenate the compound adjective 'state of the art':",
 rule: "Hyphenate phrasal adjectives when they precede the noun they modify."
 },
 {
 id: 5,
 original: "The dog 'passed away' last night.",
 issue: "Euphemism",
 options: ["passed away", "went to sleep", "died", "kicked the bucket"],
 correct: "died",
 prompt: "Replace the euphemism 'passed away' with a literal biological term:",
 rule: "While euphemisms soften the blow of harsh news, journalistic or academic writing often requires literal, direct terms."
 }
];

export default function LabE9PunctuationVocabulary({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentIndex, setCurrentIndex] = useState(0);
 const [selectedOption, setSelectedOption] = useState<string | null>(null);
 const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle');
 const [logs, setLogs] = useState<{ id: number; original: string; choice: string; status: 'success' | 'error' }[]>([]);

 // Assessment State
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const currentData = EDITOR_DATA[currentIndex];

 const handleSelect = (opt: string) => {
 setSelectedOption(opt);
 const isCorrect = opt === currentData.correct;
 setResult(isCorrect ? 'success' : 'error');

 if (isCorrect) {
  setLogs(prev => [
  { id: Date.now(), original: currentData.original, choice: opt, status: 'success' as const },
  ...prev
  ].slice(0, 5));
 } else {
  setLogs(prev => [
  { id: Date.now(), original: currentData.original, choice: opt, status: 'error' as const },
  ...prev
  ].slice(0, 5));
 }
 };

 const nextTask = () => {
 setCurrentIndex((prev) => (prev + 1) % EDITOR_DATA.length);
 setSelectedOption(null);
 setResult('idle');
 };

 const assessmentQuestions = [
 {
  id: 1,
  q: "Which of the following is an example of an oxymoron?",
  options: ["A friendly giant", "A deafening silence", "A loud noise"],
  correct: "A deafening silence"
 },
 {
  id: 2,
  q: "When should you use a hyphen in a compound adjective?",
  options: [
  "When it appears AFTER the noun it modifies.",
  "When it appears BEFORE the noun it modifies.",
  "Never."
  ],
  correct: "When it appears BEFORE the noun it modifies."
 },
 {
  id: 3,
  q: "What is the primary purpose of a euphemism?",
  options: [
  "To make an expression more offensive or harsh.",
  "To combine two contradictory terms.",
  "To substitute a mild or indirect term for a harsh one."
  ],
  correct: "To substitute a mild or indirect term for a harsh one."
 }
 ];

 const calculateScore = () => {
 let score = 0;
 assessmentQuestions.forEach(q => {
  if (assessmentAnswers[q.id] === q.correct) score++;
 });
 return score;
 };

 return (
 <div className="min-h-screen bg-slate-50 dark:bg-[#000000] font-sans flex flex-col">
  <LabHeader title="Editor's Desk: Vocabulary & Punctuation" variant="dark" onExit={onExit} />

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
  
  {/* Window 1: Theory */}
  <section className={`rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <div className="flex items-center gap-3 mb-4">
   <BookOpen className="w-6 h-6 text-[#4158D1] dark:text-[#4158D1]" />
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">The Style Guide</h2>
   </div>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   
   <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] border-b border-slate-200 dark:border-[#2a2a2a] pb-2 flex items-center gap-2 mb-3">
    <PenTool className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
    Euphemisms
   </h3>
   <p className="mb-3">A <strong>euphemism</strong> is a polite, mild, or indirect word or expression substituted for one considered to be too harsh, blunt, or unpleasant. While euphemisms are polite in everyday conversation, editors often remove them to ensure clarity, objectivity, and directness in academic or journalistic writing.</p>
   <div className={`bg-slate-50 dark:bg-[#1c1b1b] p-4 rounded-lg border border-slate-200 dark:border-[#2a2a2a] mb-6 flex-col `}>
    <ul className="space-y-3 m-0 p-0 list-none">
    <li className="flex items-center gap-3">
     <span className="line-through text-rose-500 dark:text-rose-400 w-24">Died</span> 
     <ArrowRight className="w-4 h-4 text-slate-400" /> 
     <span className="text-emerald-600 dark:text-emerald-400 font-medium">Passed away</span>
    </li>
    <li className="flex items-center gap-3">
     <span className="line-through text-rose-500 dark:text-rose-400 w-24">Fired</span> 
     <ArrowRight className="w-4 h-4 text-slate-400" /> 
     <span className="text-emerald-600 dark:text-emerald-400 font-medium">Let go</span>
    </li>
    <li className="flex items-center gap-3">
     <span className="line-through text-rose-500 dark:text-rose-400 w-24">Used cars</span> 
     <ArrowRight className="w-4 h-4 text-slate-400" /> 
     <span className="text-emerald-600 dark:text-emerald-400 font-medium">Pre-owned</span>
    </li>
    </ul>
   </div>

   <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] border-b border-slate-200 dark:border-[#2a2a2a] pb-2 flex items-center gap-2 mb-3">
    <PenTool className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
    Oxymorons
   </h3>
   <p className="mb-3">An <strong>oxymoron</strong> is a figure of speech that places two seemingly contradictory or opposite words side by side to create a rhetorical effect or reveal a paradox. They can add stylistic flair but should be used intentionally rather than accidentally.</p>
   <div className={`bg-slate-50 dark:bg-[#1c1b1b] p-4 rounded-lg border border-slate-200 dark:border-[#2a2a2a] mb-6 flex-col `}>
    <ul className="list-disc pl-5 m-0 space-y-1">
    <li><strong>Deafening silence:</strong> A silence so noticeable that it feels loud.</li>
    <li><strong>Open secret:</strong> A fact that is supposed to be hidden but is known to many.</li>
    <li><strong>Awfully good:</strong> Using a negative intensifier for a positive word.</li>
    <li><strong>Living dead:</strong> Zombies or the undead.</li>
    </ul>
   </div>

   <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] border-b border-slate-200 dark:border-[#2a2a2a] pb-2 flex items-center gap-2 mb-3">
    <PenTool className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
    Hyphenation Rules
   </h3>
   <p className="mb-3">Use a hyphen to join two or more words serving as a <strong>single adjective</strong> before a noun. This is known as a compound adjective. Hyphenation prevents ambiguity for the reader.</p>
   <ul className="list-disc pl-5 m-0 space-y-3">
    <li>
    <strong>Hyphenate before the noun:</strong><br/>
    <span className="text-slate-500 dark:text-[#71717a] italic">"He is a well-known author."</span>
    </li>
    <li>
    <strong>Do NOT hyphenate after the noun:</strong><br/>
    <span className="text-slate-500 dark:text-[#71717a] italic">"The author is well known."</span>
    </li>
    <li>
    <strong>Do NOT hyphenate with '-ly' adverbs:</strong><br/>
    <span className="text-slate-500 dark:text-[#71717a] italic">"A highly regarded expert."</span>
    </li>
   </ul>

   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-3 mb-6">
   <FileEdit className="w-6 h-6 text-amber-600 dark:text-amber-400" />
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">Proofreading Desk</h2>
   </div>
   
   <div className="flex-1 overflow-y-auto pr-2">
   <div className="space-y-6">
    
    <div className="space-y-3">
    <div className={`inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-200 dark:border-amber-800 `}>
     Target: {currentData.issue}
    </div>
    
    <div className="p-5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] shadow-sm">
     <p className="text-lg font-serif text-slate-800 dark:text-[#ffffff] leading-relaxed">
     "{currentData.original}"
     </p>
    </div>
    </div>

    <div className="space-y-4">
    <p className="text-sm font-medium text-slate-600 dark:text-[#a1a1aa]">{currentData.prompt}</p>
    
    <div className="grid grid-cols-1 gap-3">
     {currentData.options.map(opt => (
     <button
      key={opt}
      disabled={result === 'success'}
      onClick={() => handleSelect(opt)}
      className={`w-full p-4 rounded-xl text-left font-serif transition-all border-2 ${ selectedOption === opt ? result === 'success' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md text-emerald-900 dark:text-emerald-100' : 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 shadow-md text-rose-900 dark:text-rose-100' : ' border-slate-200 dark:border-[#2a2a2a] hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-[#ffffff] hover:shadow-md' } disabled:opacity-75`}
     >
      {opt}
     </button>
     ))}
    </div>
    </div>

    {result !== 'idle' && (
    <div className={`mt-6 p-5 rounded-xl animate-in fade-in zoom-in duration-300 ${ result === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800' }`}>
     <div className="flex items-start gap-3">
     {result === 'success' ? <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />}
     <div>
      <p className={`font-bold ${result === 'success' ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-800 dark:text-rose-400'}`}>
      {result === 'success' ? 'Revision Approved!' : 'Needs Revision!'}
      </p>
      <p className={`text-sm mt-1 ${result === 'success' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
      {result === 'success' ? currentData.rule : 'Check the style guide rules and try again.'}
      </p>
     </div>
     </div>
     {result === 'success' && (
     <button onClick={nextTask} className="mt-4 flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#4158D1] hover:bg-[#3142a3] text-white font-bold rounded-lg transition-colors">
      Next Assignment <ArrowRight className="w-4 h-4" />
     </button>
     )}
    </div>
    )}
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="w-full h-full flex flex-col">
   <div className="flex items-center gap-3 mb-6 w-full">
    <History className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
    <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">Revision Logs & Assessment</h2>
   </div>
   
   <div className="flex-1 w-full overflow-y-auto pr-2 space-y-8 text-left">
    
    <div className="space-y-4">
    <h3 className="font-semibold text-slate-900 dark:text-[#ffffff] border-b border-slate-200 dark:border-[#2a2a2a] pb-2">Recent Edits</h3>
    {logs.length === 0 ? (
     <p className="text-sm text-slate-500 dark:text-[#71717a] italic">No revisions made yet.</p>
    ) : (
     <div className="space-y-3">
     {logs.map(log => (
      <div key={log.id} className="text-sm p-4 rounded-lg border border-slate-200 dark:border-[#2a2a2a] shadow-sm">
      <div className="text-slate-600 dark:text-[#a1a1aa] mb-2 italic line-clamp-2">"{log.original}"</div>
      <div className={`font-medium flex items-center gap-2 ${log.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
       {log.status === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
       <span className="line-clamp-2">Selected: {log.choice}</span>
      </div>
      </div>
     ))}
     </div>
    )}
    </div>

    <div className="space-y-4 pt-4">
    <h3 className="font-semibold text-slate-900 dark:text-[#ffffff] border-b border-slate-200 dark:border-[#2a2a2a] pb-2">Style Guide Assessment</h3>
    
    {assessmentQuestions.map((q, i) => (
     <div key={q.id} className="space-y-3 p-4 rounded-lg border border-slate-200 dark:border-[#2a2a2a]">
     <p className="text-sm font-medium text-slate-800 dark:text-[#ffffff]">{i + 1}. {q.q}</p>
     <div className="space-y-2">
      {q.options.map(opt => {
      const isSelected = assessmentAnswers[q.id] === opt;
      const isCorrect = opt === q.correct;
      const showCorrect = assessmentSubmitted && isCorrect;
      const showWrong = assessmentSubmitted && isSelected && !isCorrect;

      return (
       <label key={opt} className={`flex items-start gap-2 text-sm p-3 rounded-md border cursor-pointer transition-colors ${ showCorrect ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' : showWrong ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200' : isSelected ? 'bg-slate-100 dark:bg-[#1c1b1b] border-slate-300 dark:border-slate-600' : 'border-slate-200 dark:border-[#2a2a2a] hover:bg-slate-50 dark:hover:bg-[#1c1b1b]' }`}>
       <input
        type="radio"
        name={`vocab-q-${q.id}`}
        value={opt}
        disabled={assessmentSubmitted}
        checked={isSelected}
        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [q.id]: opt }))}
        className="mt-0.5"
       />
       <span className="flex-1 text-slate-700 dark:text-[#a1a1aa] leading-tight">{opt}</span>
       </label>
      );
      })}
     </div>
     </div>
    ))}

    <button
     onClick={() => setAssessmentSubmitted(true)}
     disabled={assessmentSubmitted || Object.keys(assessmentAnswers).length < assessmentQuestions.length}
     className="w-full mt-4 py-3 px-4 bg-[#4158D1] hover:bg-[#3142a3] disabled:bg-slate-300 disabled:dark:bg-[#2a2a2a] disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors shadow-md"
    >
     {assessmentSubmitted ? `Score: ${calculateScore()} / ${assessmentQuestions.length}` : 'Submit Assessment'}
    </button>
    </div>

   </div>
   </div>
  </section>

  </main>
 </div>
 );
}
