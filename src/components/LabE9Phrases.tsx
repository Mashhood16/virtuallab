import { useState } from 'react';
import { 
 BookOpen, Search, Target, CheckCircle, Activity, 
 Info, Check, ChevronRight
} from 'lucide-react';
import LabHeader from './LabHeader';

type PhraseType = "Adjectival Phrase" | "Adverbial Phrase" | "Noun Phrase" | "Verb Phrase";

interface SentencePart {
 type: 'text' | 'phrase';
 id?: string;
 content: string;
 correctType?: PhraseType;
 hint?: string;
}

interface Sentence {
 id: number;
 parts: SentencePart[];
}

const sentences: Sentence[] = [
 {
 id: 1,
 parts: [
  { type: 'text', content: "The ancient tree " },
  { type: 'phrase', id: '1-p1', content: "in the dense forest", correctType: "Adjectival Phrase", hint: "Describes which tree (a noun)." },
  { type: 'text', content: " stood " },
  { type: 'phrase', id: '1-p2', content: "for a thousand years", correctType: "Adverbial Phrase", hint: "Describes how long it stood (modifies a verb)." },
  { type: 'text', content: "." }
 ]
 },
 {
 id: 2,
 parts: [
  { type: 'text', content: "The athlete ran " },
  { type: 'phrase', id: '2-p1', content: "with incredible speed", correctType: "Adverbial Phrase", hint: "Describes how the athlete ran." },
  { type: 'text', content: " " },
  { type: 'phrase', id: '2-p2', content: "towards the finish line", correctType: "Adverbial Phrase", hint: "Describes where the athlete ran." },
  { type: 'text', content: "." }
 ]
 },
 {
 id: 3,
 parts: [
  { type: 'text', content: "A gift " },
  { type: 'phrase', id: '3-p1', content: "of immense value", correctType: "Adjectival Phrase", hint: "Describes the gift (a noun)." },
  { type: 'text', content: " was delivered " },
  { type: 'phrase', id: '3-p2', content: "in the morning", correctType: "Adverbial Phrase", hint: "Describes when it was delivered." },
  { type: 'text', content: "." }
 ]
 }
];

export default function LabE9Phrases({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
 const [activePhraseId, setActivePhraseId] = useState<string | null>(null);
 const [resolvedPhrases, setResolvedPhrases] = useState<Set<string>>(new Set());
 const [logs, setLogs] = useState<{ id: number; message: string; timestamp: string; type: 'success' | 'error' }[]>([]);
 
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const currentSentence = sentences[currentSentenceIdx];
 const activePhrasePart = currentSentence.parts.find(p => p.id === activePhraseId);

 const allPhrasesInSentence = currentSentence.parts.filter(p => p.type === 'phrase');
 const sentenceCompleted = allPhrasesInSentence.every(p => resolvedPhrases.has(p.id!));

 const addLog = (message: string, type: 'success' | 'error') => {
 setLogs(prev => [{
  id: Date.now(),
  message,
  timestamp: new Date().toLocaleTimeString(),
  type
 }, ...prev].slice(0, 5));
 };

 const handleClassify = (selectedType: PhraseType) => {
 if (!activePhrasePart) return;

 if (selectedType === activePhrasePart.correctType) {
  setResolvedPhrases(prev => {
  const newSet = new Set(prev);
  newSet.add(activePhrasePart.id!);
  return newSet;
  });
  addLog(`Correctly identified "${activePhrasePart.content}" as an ${selectedType}.`, 'success');
  setActivePhraseId(null);
 } else {
  addLog(`Incorrect classification for "${activePhrasePart.content}". Try again.`, 'error');
 }
 };

 const advanceSentence = () => {
 if (currentSentenceIdx < sentences.length - 1) {
  setCurrentSentenceIdx(prev => prev + 1);
  setActivePhraseId(null);
 }
 };

 const questions = [
 {
  q: "Which type of phrase modifies a noun or pronoun?",
  options: [
  "Adverbial Phrase",
  "Adjectival Phrase",
  "Noun Phrase"
  ],
  correct: 1
 },
 {
  q: "In the sentence 'She walked to the store', what is 'to the store'?",
  options: [
  "Adverbial Phrase (Prepositional)",
  "Adjectival Phrase (Prepositional)",
  "Verb Phrase"
  ],
  correct: 0
 },
 {
  q: "Which phrase describes WHEN, WHERE, HOW, or WHY an action happened?",
  options: [
  "Adjectival Phrase",
  "Noun Phrase",
  "Adverbial Phrase"
  ],
  correct: 2
 }
 ];

 const calculateScore = () => {
 let score = 0;
 questions.forEach((q, idx) => {
  if (assessmentAnswers[idx] === q.correct) score++;
 });
 return score;
 };

 return (
 <div className="min-h-screen bg-slate-50 dark:bg-[#121212] dark:!bg-[#000000] flex flex-col font-sans">
  <LabHeader title="Phrase Dynamics: Adjectival & Adverbial" onExit={onExit} />
  
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
  
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b]  ? 'block' : 'hidden'} lg:block`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <BookOpen className="w-5 h-5 text-blue-500" />
   Theory Guide
   </h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mt-4 mb-2">1. What is a Phrase?</h3>
   <p>A phrase is a group of words that acts as a single part of speech in a sentence. Crucially, a phrase lacks a subject and a verb working together (unlike a clause).</p>
   
   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mt-4 mb-2">2. Adjectival Phrases</h3>
   <p>An adjectival phrase acts like an adjective. It modifies or describes a noun or a pronoun. It provides more information about the noun, helping to specify or describe it.</p>
   <ul className="list-disc pl-5 my-2">
    <li><strong>Example:</strong> The book <em className="text-emerald-600 dark:text-emerald-400">on the top shelf</em> is mine. (Modifies "book")</li>
    <li><strong>Example:</strong> A girl <em className="text-emerald-600 dark:text-emerald-400">with red hair</em> won the race. (Modifies "girl")</li>
   </ul>
   
   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mt-4 mb-2">3. Adverbial Phrases</h3>
   <p>An adverbial phrase acts like an adverb. It modifies a verb, an adjective, or another adverb by telling <em>when, where, how,</em> or <em>why</em> the action occurs.</p>
   <ul className="list-disc pl-5 my-2">
    <li><strong>When:</strong> We will leave <em className="text-amber-600 dark:text-amber-400">in a few minutes</em>.</li>
    <li><strong>Where:</strong> He parked his car <em className="text-amber-600 dark:text-amber-400">behind the building</em>.</li>
    <li><strong>How:</strong> She spoke <em className="text-amber-600 dark:text-amber-400">in a soft whisper</em>.</li>
    <li><strong>Why:</strong> I went to the store <em className="text-amber-600 dark:text-amber-400">for some milk</em>.</li>
   </ul>
   
   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mt-4 mb-2">4. Prepositional Phrases</h3>
   <p>Often, both adjectival and adverbial phrases take the form of <strong>prepositional phrases</strong>. A prepositional phrase begins with a preposition (in, on, at, under, to, of) and ends with a noun or pronoun (the object of the preposition).</p>
   <p>To determine if a prepositional phrase is adjectival or adverbial, look at what it modifies:</p>
   <ul className="list-disc pl-5 my-2">
    <li>If it modifies a noun, it's adjectival. (e.g., The boy <em className="text-blue-600 dark:text-blue-400">in the pool</em>)</li>
    <li>If it modifies a verb, it's adverbial. (e.g., He swam <em className="text-blue-600 dark:text-blue-400">in the pool</em>)</li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <Activity className="w-5 h-5 text-indigo-500" />
   Classification Controls
   </h2>
   
   {/* Control Panel / Classify UI */}
   <div className={`w-full rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] p-4 mb-4 shrink-0 flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   {activePhrasePart ? (
    <div className="animate-in fade-in slide-in-from-top-2">
    <h3 className="text-indigo-900 dark:text-indigo-300 font-bold mb-3 flex items-center gap-2">
     <Target className="w-4 h-4" />
     Classify: "{activePhrasePart.content}"
    </h3>
    <div className="grid grid-cols-2 gap-2 mb-3">
     {(["Adjectival Phrase", "Adverbial Phrase", "Noun Phrase", "Verb Phrase"] as PhraseType[]).map(type => (
     <button
      key={type}
      onClick={() => handleClassify(type)}
      className={`py-2 px-3 bg-slate-50 dark:bg-[#1c1b1b] border border-slate-200 dark:border-[#2a2a2a] rounded-lg text-sm font-medium text-slate-700 dark:text-[#a1a1aa] hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 dark:hover:border-indigo-500 transition-colors text-left flex-col `}
     >
      {type}
     </button>
     ))}
    </div>
    <div className={`flex items-start gap-2 text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50 flex-col `}>
     <Info className="w-4 h-4 shrink-0 mt-0.5" />
     <p><strong>Hint:</strong> {activePhrasePart.hint}</p>
    </div>
    </div>
   ) : (
    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-[#71717a] py-6">
    <Target className="w-8 h-8 mb-2 opacity-50" />
    <p className="text-sm text-center">Click a highlighted phrase in the simulation to classify it.</p>
    </div>
   )}
   </div>

   {/* Logs */}
   <div className="rounded-xl border border-slate-200 dark:border-[#2a2a2a] p-4 flex-1 flex flex-col min-h-[150px] mb-4 overflow-hidden">
   <h3 className="text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Activity className="w-4 h-4 text-emerald-500" />
    Action Logs
   </h3>
   <div className="flex-1 overflow-y-auto space-y-2 pr-2 text-sm">
    {logs.length === 0 && (
    <p className="text-slate-500 dark:text-[#71717a] italic">No actions recorded...</p>
    )}
    {logs.map(log => (
    <div key={log.id} className="flex gap-2">
     <span className="text-slate-400 dark:text-[#52525b] font-mono shrink-0">[{log.timestamp}]</span>
     <span className={log.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
     {log.message}
     </span>
    </div>
    ))}
   </div>
   </div>

   {/* Assessment */}
   <div className="rounded-xl border border-slate-200 dark:border-[#2a2a2a] p-4 shrink-0">
   <h3 className="text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-3 flex items-center gap-2">
    <CheckCircle className="w-4 h-4 text-rose-500" />
    Quick Assessment
   </h3>
   {!assessmentSubmitted ? (
    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
    {questions.map((q, qIdx) => (
     <div key={qIdx} className="space-y-2">
     <p className="text-xs font-medium text-slate-800 dark:text-[#ffffff]">
      {qIdx + 1}. {q.q}
     </p>
     <div className="space-y-1">
      {q.options.map((opt, oIdx) => (
      <label key={oIdx} className="flex items-start gap-2 cursor-pointer group">
       <input
       type="radio"
       name={`phrase-q-${qIdx}`}
       className="mt-0.5 w-3.5 h-3.5 text-rose-600 bg-slate-100 border-slate-300 dark:bg-[#1c1b1b] dark:border-[#2a2a2a]"
       checked={assessmentAnswers[qIdx] === oIdx}
       onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
       />
       <span className="text-xs text-slate-600 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-[#ffffff]">
       {opt}
       </span>
      </label>
      ))}
     </div>
     </div>
    ))}
    <button
     onClick={() => setAssessmentSubmitted(true)}
     disabled={Object.keys(assessmentAnswers).length < questions.length}
     className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 dark:disabled:bg-[#1c1b1b] disabled:text-slate-500 dark:disabled:text-[#71717a] disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
    >
     Submit
    </button>
    </div>
   ) : (
    <div className="text-center py-2">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 mb-2">
     <span className="text-lg font-bold">{calculateScore()}/{questions.length}</span>
    </div>
    <p className="text-xs text-slate-600 dark:text-[#a1a1aa] mb-3">
     {calculateScore() === questions.length ? 'Perfect score!' : 'Review the theory and try again.'}
    </p>
    <button
     onClick={() => {
     setAssessmentSubmitted(false);
     setAssessmentAnswers({});
     }}
     className="text-xs text-rose-600 dark:text-rose-400 font-medium hover:underline"
    >
     Retake Assessment
    </button>
    </div>
   )}
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative flex items-center justify-center p-8 overflow-hidden min-h-[500px] `}>
   <div className="absolute top-4 left-4 right-4 flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1c1b1b] z-20">
   <div className="flex items-center gap-2">
    <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Dissection Engine</h2>
   </div>
   <div className="text-xs font-medium text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#1c1b1b] px-3 py-1 rounded-full shadow-sm">
    Sentence {currentSentenceIdx + 1} of {sentences.length}
   </div>
   </div>

   <div className="w-full flex flex-col items-center justify-center relative z-10 mt-12">
   {/* The sentence container */}
   <div className="w-full max-w-2xl rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 text-center leading-loose text-xl lg:text-2xl text-slate-800 dark:text-[#ffffff] transition-all duration-300">
    {currentSentence.parts.map((part, i) => {
    if (part.type === 'text') {
     return <span key={i} className="mx-1">{part.content}</span>;
    } else {
     const isResolved = resolvedPhrases.has(part.id!);
     const isActive = activePhraseId === part.id;
     return (
     <button
      key={i}
      onClick={() => !isResolved && setActivePhraseId(part.id!)}
      className={`inline-block px-3 py-1 rounded-lg mx-1 transition-all font-medium border-b-4 ${isResolved ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-600 cursor-default scale-95' : isActive ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 border-indigo-400 dark:border-indigo-500 scale-105 shadow-md' : 'bg-slate-200 dark:bg-[#1c1b1b] text-slate-700 dark:text-slate-300 border-slate-400 dark:border-[#2a2a2a] hover:bg-slate-300 dark:hover:bg-[#2a2a2a] cursor-pointer' }`}
     >
      {part.content}
      {isResolved && <Check className="w-5 h-5 inline ml-2 mb-0.5" />}
     </button>
     );
    }
    })}
   </div>

   {/* Completion State */}
   {sentenceCompleted && (
    <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4">
    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-4">
     <CheckCircle className="w-6 h-6" />
     <span>Sentence Analyzed Successfully!</span>
    </div>
    {currentSentenceIdx < sentences.length - 1 ? (
     <button
     onClick={advanceSentence}
     className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 mx-auto"
     >
     Next Sentence <ChevronRight className="w-5 h-5" />
     </button>
    ) : (
     <div className="px-6 py-3 bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 font-bold inline-block">
     All sentences completely dissected! 🎉
     </div>
    )}
    </div>
   )}
   </div>

   {/* Decorative background elements */}
   <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20 dark:opacity-10 z-0">
   <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
   <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
   <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
   </div>
  </section>
  </main>
 </div>
 );
}

