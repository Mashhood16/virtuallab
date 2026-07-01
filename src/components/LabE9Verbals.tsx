import { useState, useEffect } from 'react';
import { 
 BookOpen, CheckCircle, AlertCircle, Play, Pause,
 History, HelpCircle, Activity, Info, 
 ArrowRight, Filter, Settings, FileText
} from 'lucide-react';
import LabHeader from './LabHeader';

type VerbalType = 'Gerund' | 'Participle' | 'Infinitive';

interface PhraseItem {
 id: number;
 text: string;
 highlight: string;
 verbalType: VerbalType;
 explanation: string;
}

const CONVEYOR_ITEMS: PhraseItem[] = [
 { id: 1, text: "I enjoy running every morning.", highlight: "running", verbalType: "Gerund", explanation: "Functions as a noun (direct object of 'enjoy')." },
 { id: 2, text: "The running water was very cold.", highlight: "running", verbalType: "Participle", explanation: "Functions as an adjective describing 'water'." },
 { id: 3, text: "To run a marathon is her dream.", highlight: "To run", verbalType: "Infinitive", explanation: "Functions as a noun (subject of the sentence)." },
 { id: 4, text: "The broken vase lay on the floor.", highlight: "broken", verbalType: "Participle", explanation: "Functions as an adjective modifying 'vase'." },
 { id: 5, text: "Swimming is my favorite sport.", highlight: "Swimming", verbalType: "Gerund", explanation: "Functions as a noun (subject of the sentence)." },
 { id: 6, text: "She wants to eat dinner early.", highlight: "to eat", verbalType: "Infinitive", explanation: "Functions as a noun (direct object of 'wants')." },
 { id: 7, text: "The fascinating book kept me awake.", highlight: "fascinating", verbalType: "Participle", explanation: "Functions as an adjective modifying 'book'." },
];

const ASSESSMENT_QUESTIONS = [
 {
 question: 'A verbal that ends in -ing and functions as a noun is called a:',
 options: ['Participle', 'Infinitive', 'Gerund', 'Verb'],
 answer: 2
 },
 {
 question: 'In the sentence "She has a lot of work to do," what role does the infinitive "to do" play?',
 options: ['Noun', 'Adjective', 'Adverb', 'Preposition'],
 answer: 1
 },
 {
 question: 'Which of the following is a participle functioning as an adjective?',
 options: ['Sleeping is important.', 'I love to sleep.', 'The sleeping baby is peaceful.', 'He went to sleep.'],
 answer: 2
 }
];

export default function LabE9Verbals({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [queue, setQueue] = useState<PhraseItem[]>([]);
 const [currentItem, setCurrentItem] = useState<PhraseItem | null>(null);
 const [sortedLog, setSortedLog] = useState<{ item: PhraseItem, isCorrect: boolean }[]>([]);
 const [isSimulationRunning, setIsSimulationRunning] = useState(false);
 const [feedbackMsg, setFeedbackMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

 const [assessmentScores, setAssessmentScores] = useState<number[]>(Array(ASSESSMENT_QUESTIONS.length).fill(-1));
 const [showResults, setShowResults] = useState(false);

 useEffect(() => {
 resetConveyor();
 }, []);

 const resetConveyor = () => {
 const shuffled = [...CONVEYOR_ITEMS].sort(() => Math.random() - 0.5);
 setQueue(shuffled);
 setCurrentItem(shuffled[0] || null);
 setSortedLog([]);
 setFeedbackMsg(null);
 setIsSimulationRunning(false);
 };

 const advanceConveyor = (currentQueue: PhraseItem[]) => {
 const nextQueue = currentQueue.slice(1);
 setQueue(nextQueue);
 setCurrentItem(nextQueue.length > 0 ? nextQueue[0] : null);
 if (nextQueue.length === 0) {
  setIsSimulationRunning(false);
 }
 };

 const handleSort = (selectedType: VerbalType) => {
 if (!currentItem || !isSimulationRunning) return;

 const isCorrect = currentItem.verbalType === selectedType;
 
 setSortedLog(prev => [{ item: currentItem, isCorrect }, ...prev]);
 
 if (isCorrect) {
  setFeedbackMsg({ text: `Correct! ${currentItem.highlight} is a ${selectedType}.`, type: 'success' });
 } else {
  setFeedbackMsg({ text: `Incorrect. ${currentItem.highlight} is a ${currentItem.verbalType}.`, type: 'error' });
 }

 advanceConveyor(queue);
 
 setTimeout(() => {
  setFeedbackMsg(null);
 }, 3000);
 };

 const handleAssessment = (qIndex: number, optIndex: number) => {
 const newScores = [...assessmentScores];
 newScores[qIndex] = optIndex;
 setAssessmentScores(newScores);
 };

 const calculateScore = () => {
 let score = 0;
 assessmentScores.forEach((ans, i) => {
  if (ans === ASSESSMENT_QUESTIONS[i].answer) score++;
 });
 return score;
 };

 const highlightText = (text: string, highlight: string) => {
 const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
 return (
  <span>
  {parts.map((part, i) => 
   part.toLowerCase() === highlight.toLowerCase() ? (
   <strong key={i} className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-1 rounded">{part}</strong>
   ) : (
   <span key={i}>{part}</span>
   )
  )}
  </span>
 );
 };

 return (
 <div className="min-h-screen bg-slate-50 dark:bg-[#000000] flex flex-col font-sans">
  <LabHeader title="Verbals: Gerunds, Participles & Infinitives" onExit={onExit} />
  
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
   <div className="flex items-center gap-3 mb-6">
   <div className={`p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-col `}>
    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
   </div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">Verbals Theory</h2>
   </div>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[calc(100vh-16rem)] pr-2">
   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Info className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
    What is a Verbal?
   </h3>
   <p>
    A verbal is a verb form that does <strong>not</strong> function as a verb in the sentence. Instead, it functions as a noun, an adjective, or an adverb. There are three types of verbals: Gerunds, Participles, and Infinitives.
   </p>

   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mt-6 mb-2 flex items-center gap-2">
    <Activity className="w-5 h-5 text-orange-500 dark:text-orange-400" />
    1. Gerunds
   </h3>
   <p>A <strong>gerund</strong> is a verbal that ends in <em>-ing</em> and functions as a <strong>noun</strong>.</p>
   <ul className="list-disc pl-5 mt-2 space-y-1">
    <li><strong>Subject:</strong> <em>Swimming</em> is excellent exercise.</li>
    <li><strong>Direct Object:</strong> She enjoys <em>reading</em>.</li>
    <li><strong>Object of a Preposition:</strong> He was rewarded for <em>working</em> hard.</li>
    <li><strong>Subject Complement:</strong> My favorite hobby is <em>baking</em>.</li>
   </ul>

   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mt-6 mb-2 flex items-center gap-2">
    <Filter className="w-5 h-5 text-green-500 dark:text-green-400" />
    2. Participles
   </h3>
   <p>A <strong>participle</strong> is a verbal that functions as an <strong>adjective</strong> to modify a noun or pronoun.</p>
   <ul className="list-disc pl-5 mt-2 space-y-1">
    <li><strong>Present Participles</strong> end in <em>-ing</em>. (e.g., The <em>crying</em> baby needs milk.)</li>
    <li><strong>Past Participles</strong> end in <em>-ed</em>, <em>-en</em>, <em>-d</em>, <em>-t</em>, or <em>-n</em>. (e.g., The <em>broken</em> vase lay on the floor.)</li>
   </ul>
   <div className={`mt-4 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg p-3 border-l-4 border-slate-400 dark:border-[#a1a1aa] flex-col `}>
    <p className="text-sm italic">
    Tip: Don't confuse participles with gerunds or progressive verbs. Participles always describe a noun!
    </p>
   </div>

   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mt-6 mb-2 flex items-center gap-2">
    <ArrowRight className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
    3. Infinitives
   </h3>
   <p>An <strong>infinitive</strong> is a verbal consisting of the word <em>to</em> plus a verb. It may function as a noun, an adjective, or an adverb.</p>
   <ul className="list-disc pl-5 mt-2 space-y-1">
    <li><strong>Noun (Subject):</strong> <em>To travel</em> is her dream.</li>
    <li><strong>Noun (Direct Object):</strong> He wants <em>to eat</em>.</li>
    <li><strong>Adjective:</strong> I have a lot of work <em>to do</em>. (Modifies 'work')</li>
    <li><strong>Adverb:</strong> She went home <em>to rest</em>. (Modifies 'went')</li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col h-[calc(100vh-12rem)] lg:h-auto  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center justify-between mb-4">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" />
    Controls
   </h2>
   </div>

   <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
   
   {/* Sorting Controls */}
   <div className={`w-full p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
    <div className="flex items-center justify-between mb-4">
    <span className="font-semibold text-slate-700 dark:text-[#a1a1aa]">Simulation State</span>
    <button
     onClick={() => isSimulationRunning ? setIsSimulationRunning(false) : (queue.length === 0 ? resetConveyor() : setIsSimulationRunning(true))}
     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-bold shadow-sm transition-all ${ isSimulationRunning ? 'bg-amber-500 hover:bg-amber-600' : queue.length === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700' }`}
    >
     {isSimulationRunning ? <><Pause className="w-4 h-4" /> Pause</> : (queue.length === 0 ? <><History className="w-4 h-4" /> Restart</> : <><Play className="w-4 h-4" /> Start</>)}
    </button>
    </div>

    {isSimulationRunning && currentItem && (
    <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-lg text-center">
     <p className="text-sm font-medium text-slate-800 dark:text-[#ffffff]">
     "{highlightText(currentItem.text, currentItem.highlight)}"
     </p>
    </div>
    )}
    
    <div className="grid grid-cols-3 gap-2">
    <button
     onClick={() => handleSort('Gerund')}
     disabled={!isSimulationRunning || !currentItem}
     className="py-2 px-1 bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:hover:bg-orange-900/60 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-lg transition-all active:scale-95 text-xs text-center border border-orange-200 dark:border-orange-800"
    >
     Gerund
    </button>
    <button
     onClick={() => handleSort('Participle')}
     disabled={!isSimulationRunning || !currentItem}
     className="py-2 px-1 bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-lg transition-all active:scale-95 text-xs text-center border border-green-200 dark:border-green-800"
    >
     Participle
    </button>
    <button
     onClick={() => handleSort('Infinitive')}
     disabled={!isSimulationRunning || !currentItem}
     className="py-2 px-1 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-lg transition-all active:scale-95 text-xs text-center border border-indigo-200 dark:border-indigo-800"
    >
     Infinitive
    </button>
    </div>

    {feedbackMsg && (
    <div className={`mt-4 p-2 rounded-lg text-xs text-center font-bold ${ feedbackMsg.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' }`}>
     {feedbackMsg.text}
    </div>
    )}
   </div>

   {/* Log Section */}
   <div className="p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a]">
    <h3 className="text-md font-semibold text-slate-800 dark:text-[#ffffff] mb-3 flex items-center gap-2">
    <History className="w-4 h-4 text-emerald-500" />
    Sorting Log
    </h3>
    <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
    {sortedLog.length === 0 ? (
     <div className="text-xs text-slate-500 dark:text-[#a1a1aa] italic text-center p-2">
     No items sorted yet. Start the conveyor!
     </div>
    ) : (
     sortedLog.map((log, idx) => (
     <div key={idx} className={`p-2 rounded border flex flex-col gap-1 ${ log.isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50' }`}>
      <div className="flex justify-between items-start">
      <span className="font-medium text-xs text-slate-800 dark:text-[#ffffff] line-clamp-1">
       "{log.item.text}"
      </span>
      {log.isCorrect ? (
       <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
      ) : (
       <AlertCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
      )}
      </div>
      <div className="text-[10px] text-slate-600 dark:text-[#a1a1aa]">
      <span className="font-bold">{log.item.highlight}</span> is a <span className="font-bold">{log.item.verbalType}</span>.
      </div>
     </div>
     ))
    )}
    </div>
   </div>

   {/* Assessment Section */}
   <div className="p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a]">
    <h3 className="text-md font-semibold text-slate-800 dark:text-[#ffffff] mb-3 flex items-center gap-2">
    <HelpCircle className="w-4 h-4 text-emerald-500" />
    Knowledge Check
    </h3>
    <div className="space-y-4">
    {ASSESSMENT_QUESTIONS.map((q, qIndex) => (
     <div key={qIndex} className="space-y-2">
     <p className="text-xs font-medium text-slate-800 dark:text-[#ffffff]">
      {qIndex + 1}. {q.question}
     </p>
     <div className="space-y-1">
      {q.options.map((opt, oIndex) => {
      const isSelected = assessmentScores[qIndex] === oIndex;
      const isCorrect = showResults && oIndex === q.answer;
      const isWrong = showResults && isSelected && oIndex !== q.answer;
      
      let btnClass = "bg-slate-50 dark:bg-[#1c1b1b] border-slate-200 dark:border-[#2a2a2a] text-slate-700 dark:text-[#a1a1aa] hover:bg-slate-100 dark:hover:bg-[#2a2a2a]";
      
      if (isSelected && !showResults) {
       btnClass = "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300";
      } else if (isCorrect) {
       btnClass = "bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600 text-green-800 dark:text-green-300";
      } else if (isWrong) {
       btnClass = "bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-600 text-red-800 dark:text-red-300";
      } else if (showResults) {
       btnClass = "bg-slate-50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] text-slate-400 opacity-50";
      }

      return (
       <button
       key={oIndex}
       disabled={showResults}
       onClick={() => handleAssessment(qIndex, oIndex)}
       className={`w-full text-left px-3 py-1.5 rounded border text-xs transition-colors ${btnClass}`}
       >
       {opt}
       </button>
      );
      })}
     </div>
     </div>
    ))}

    {!showResults ? (
     <button
     onClick={() => setShowResults(true)}
     disabled={assessmentScores.includes(-1)}
     className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${ assessmentScores.includes(-1) ? 'bg-slate-100 dark:bg-[#1c1b1b] text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' }`}
     >
     Check Answers
     </button>
    ) : (
     <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#1c1b1b] border border-slate-200 dark:border-[#2a2a2a] text-center space-y-2">
     <div className="text-lg font-black text-slate-800 dark:text-[#ffffff]">
      {calculateScore()} / {ASSESSMENT_QUESTIONS.length}
     </div>
     <button
      onClick={() => {
      setShowResults(false);
      setAssessmentScores(Array(ASSESSMENT_QUESTIONS.length).fill(-1));
      }}
      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
     >
      <History className="w-3 h-3" />
      Retry Assessment
     </button>
     </div>
    )}
    </div>
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative flex items-center justify-center p-8 overflow-hidden min-h-[500px] `}>
   {/* Conveyor Belt Background */}
   <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-24 bg-slate-200 dark:bg-[#121212] flex items-center overflow-hidden border-y-4 border-slate-300 dark:border-[#2a2a2a]">
   <div className="w-[200%] h-full flex opacity-20">
    {Array.from({ length: 20 }).map((_, i) => (
    <div key={i} className="flex-1 border-r-4 border-slate-400 dark:border-[#2a2a2a] skew-x-[20deg]" />
    ))}
   </div>
   </div>

   {/* Current Item */}
   <div className="z-10 w-full max-w-lg">
   {!isSimulationRunning && queue.length > 0 && (
    <div className="text-center p-8 rounded-xl shadow-xl border border-slate-200 dark:border-[#2a2a2a]">
    <h3 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-2">Simulation Paused</h3>
    <p className="text-slate-500 dark:text-[#a1a1aa]">Go to Controls and press Start to sort phrases!</p>
    </div>
   )}

   {queue.length === 0 && (
    <div className="text-center p-8 rounded-xl shadow-xl border border-slate-200 dark:border-[#2a2a2a]">
    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
    <h3 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-2">All Items Sorted!</h3>
    <p className="text-slate-500 dark:text-[#a1a1aa]">Check your log or restart the conveyor from Controls.</p>
    </div>
   )}

   {isSimulationRunning && currentItem && (
    <div className="text-center p-8 rounded-xl shadow-xl border-2 border-indigo-200 dark:border-indigo-800 animate-in zoom-in duration-300">
    <FileText className="w-10 h-10 text-indigo-500 dark:text-indigo-400 mx-auto mb-4" />
    <p className="text-xl text-slate-800 dark:text-[#ffffff] font-medium leading-relaxed">
     "{highlightText(currentItem.text, currentItem.highlight)}"
    </p>
    <div className="mt-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
     Identify the highlighted verbal
    </div>
    </div>
   )}
   </div>

   {/* Feedback Overlay */}
   {feedbackMsg && (
   <div className={`absolute top-6 inset-x-6 p-4 rounded-lg text-center font-bold shadow-lg animate-in slide-in-from-top-2 ${ feedbackMsg.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700' }`}>
    {feedbackMsg.text}
   </div>
   )}
  </section>

  </main>
 </div>
 );
}
