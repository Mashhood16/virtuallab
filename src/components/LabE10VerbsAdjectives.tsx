import { useState } from 'react';
import { BookOpen, Target, CheckCircle2, Activity, ArrowRightLeft, Type, ListChecks } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10VerbsAdjectivesProps {
 onExit?: () => void;
}

const VOICE_EXERCISES = [
 {
 active: "The chef cooked a delicious meal.",
 passive: "A delicious meal was cooked by the chef.",
 subject: "The chef",
 verb: "cooked",
 object: "a delicious meal"
 },
 {
 active: "The students are solving the math problem.",
 passive: "The math problem is being solved by the students.",
 subject: "The students",
 verb: "are solving",
 object: "the math problem"
 },
 {
 active: "The author has written three books.",
 passive: "Three books have been written by the author.",
 subject: "The author",
 verb: "has written",
 object: "three books"
 }
];

const ADJECTIVE_ORDER_PUZZLE = [
 { word: "old", type: "Age" },
 { word: "beautiful", type: "Opinion" },
 { word: "Italian", type: "Origin" },
 { word: "red", type: "Color" },
 { word: "car", type: "Noun" }
];

export default function LabE10VerbsAdjectives({ onExit = () => {} }: LabE10VerbsAdjectivesProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);
 const [isPassive, setIsPassive] = useState(false);
 
 const [adjectiveOrder, setAdjectiveOrder] = useState<typeof ADJECTIVE_ORDER_PUZZLE>([]);
 const [availableAdjectives, setAvailableAdjectives] = useState<typeof ADJECTIVE_ORDER_PUZZLE>([...ADJECTIVE_ORDER_PUZZLE].sort(() => Math.random() - 0.5));

 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const questions = [
 {
  q: "Which verb is Transitive in: 'He opened the door quietly'?",
  options: ["He", "opened", "door", "quietly"],
  correct: 1
 },
 {
  q: "Identify the correct order of adjectives:",
  options: [
  "A red big plastic ball",
  "A big red plastic ball",
  "A plastic big red ball",
  "A big plastic red ball"
  ],
  correct: 1
 },
 {
  q: "Convert to Passive Voice: 'The teacher graded the exams.'",
  options: [
  "The exams graded the teacher.",
  "The teacher was grading the exams.",
  "The exams were graded by the teacher.",
  "The exams have been graded."
  ],
  correct: 2
 }
 ];

 const handleSelectAdjective = (item: typeof ADJECTIVE_ORDER_PUZZLE[0]) => {
 setAvailableAdjectives(prev => prev.filter(a => a.word !== item.word));
 setAdjectiveOrder(prev => [...prev, item]);
 };

 const handleRemoveAdjective = (item: typeof ADJECTIVE_ORDER_PUZZLE[0]) => {
 setAdjectiveOrder(prev => prev.filter(a => a.word !== item.word));
 setAvailableAdjectives(prev => [...prev, item]);
 };

 const checkAdjectiveOrder = () => {
 if (adjectiveOrder.length !== ADJECTIVE_ORDER_PUZZLE.length) return false;
 const correctOrder = ["Opinion", "Size", "Age", "Shape", "Color", "Origin", "Material", "Purpose", "Noun"];
 
 let lastIndex = -1;
 for (const item of adjectiveOrder) {
  const currentIndex = correctOrder.indexOf(item.type);
  if (currentIndex < lastIndex && item.type !== "Noun") return false;
  if (item.type === "Noun" && currentIndex !== correctOrder.length - 1) return false;
  lastIndex = currentIndex;
 }
 return adjectiveOrder[adjectiveOrder.length - 1].type === "Noun";
 };

 const calculateScore = () => {
 let score = 0;
 questions.forEach((q, idx) => {
  if (assessmentAnswers[idx] === q.correct) score++;
 });
 return score;
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans text-slate-900 dark:text-[#ffffff]">
  <LabHeader title="Unit 2: Action & Description" variant="dark" onExit={onExit} />
  
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
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-6">
   <div className={`p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex-col `}>
    <BookOpen className="w-5 h-5" />
   </div>
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">Verbs & Adjectives</h2>
   </div>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-xl font-bold text-slate-900 dark:text-[#ffffff] mb-4">Verbs: Transitive and Intransitive</h3>
   <p>Verbs are action words, but they behave differently depending on whether they transfer action to an object.</p>
   
   <h4 className="font-bold text-slate-800 dark:text-[#e4e4e7] mt-4 mb-2">Transitive Verbs</h4>
   <p>A <strong>transitive verb</strong> requires a direct object to complete its meaning. The action passes from the subject to the receiver (object).</p>
   <ul className="list-disc pl-5 mb-4 space-y-1">
    <li><em>The dog <strong>chased</strong> the ball.</em> (chased what? the ball)</li>
    <li><em>She <strong>wrote</strong> a letter.</em> (wrote what? a letter)</li>
   </ul>

   <h4 className="font-bold text-slate-800 dark:text-[#e4e4e7] mt-4 mb-2">Intransitive Verbs</h4>
   <p>An <strong>intransitive verb</strong> does not require an object. The action simply occurs without being transferred to anything else.</p>
   <ul className="list-disc pl-5 mb-4 space-y-1">
    <li><em>The baby <strong>slept</strong>.</em></li>
    <li><em>The sun <strong>shines</strong> brightly.</em> ("brightly" is an adverb, not an object)</li>
   </ul>

   <hr className="my-6 border-slate-200 dark:border-[#2a2a2a]" />

   <h3 className="text-xl font-bold text-slate-900 dark:text-[#ffffff] mb-4">Active vs. Passive Voice</h3>
   <p>Voice determines whether the subject of the sentence is performing or receiving the action.</p>
   
   <h4 className="font-bold text-slate-800 dark:text-[#e4e4e7] mt-4 mb-2">Active Voice</h4>
   <p>In active voice, the subject performs the action. It makes sentences clearer and more direct.</p>
   <p className={`bg-slate-100 dark:bg-[#1c1b1b] p-3 rounded-lg my-2 font-mono text-xs flex-col `}>Structure: Subject + Verb + Object</p>
   <p><em>Example:</em> <strong>The chef</strong> (subject) <strong>cooked</strong> (verb) <strong>the meal</strong> (object).</p>

   <h4 className="font-bold text-slate-800 dark:text-[#e4e4e7] mt-4 mb-2">Passive Voice</h4>
   <p>In passive voice, the subject receives the action. This is useful when the actor is unknown or less important than the action itself.</p>
   <p className={`bg-slate-100 dark:bg-[#1c1b1b] p-3 rounded-lg my-2 font-mono text-xs flex-col `}>Structure: Object + "to be" + Past Participle + "by" + Subject</p>
   <p><em>Example:</em> <strong>The meal</strong> (object) <strong>was cooked</strong> (verb) <strong>by the chef</strong> (subject).</p>

   <hr className="my-6 border-slate-200 dark:border-[#2a2a2a]" />

   <h3 className="text-xl font-bold text-slate-900 dark:text-[#ffffff] mb-4">The Royal Order of Adjectives</h3>
   <p>When using multiple adjectives before a noun, English follows a strict, albeit often unspoken, sequence. Native speakers naturally use this order without thinking about it.</p>
   
   <ol className="list-decimal pl-5 space-y-2 mb-4">
    <li><strong>Opinion/Observation:</strong> beautiful, ugly, delicious</li>
    <li><strong>Size:</strong> big, small, enormous</li>
    <li><strong>Age:</strong> old, new, ancient</li>
    <li><strong>Shape:</strong> round, square, flat</li>
    <li><strong>Color:</strong> red, blue, green</li>
    <li><strong>Origin:</strong> Italian, lunar, American</li>
    <li><strong>Material:</strong> wooden, metal, plastic</li>
    <li><strong>Purpose:</strong> sleeping (bag), roasting (pan)</li>
   </ol>
   
   <p><em>Example:</em> "A beautiful (opinion) little (size) old (age) round (shape) red (color) Italian (origin) wooden (material) mixing (purpose) bowl (noun)."</p>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-3 mb-6">
   <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
    <Activity className="w-5 h-5" />
   </div>
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">Interactive Controls</h2>
   </div>

   <div className="flex-1 overflow-y-auto pr-2 space-y-8">
   
   {/* Voice Controls */}
   <div className="p-5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
    <h3 className="text-md font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
    <ArrowRightLeft className="w-4 h-4 text-indigo-500" /> Voice Conversion
    </h3>
    
    <div className="flex flex-col gap-4">
    <button 
     onClick={() => setIsPassive(!isPassive)}
     className="w-full py-2 bg-[#4158D1] hover:bg-[#3142a3] text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
    >
     {isPassive ? 'Switch to Active Voice' : 'Switch to Passive Voice'}
    </button>

    <div className="flex justify-between items-center text-sm font-medium text-slate-600 dark:text-[#a1a1aa]">
     <span>Sentence {activeVoiceIndex + 1} of {VOICE_EXERCISES.length}</span>
     <div className="flex gap-2">
     {VOICE_EXERCISES.map((_, i) => (
      <button 
      key={i}
      onClick={() => setActiveVoiceIndex(i)}
      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs transition-colors ${activeVoiceIndex === i ? 'bg-[#4158D1] text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-[#1c1b1b] dark:hover:bg-[#2a2a2a] dark:text-[#71717a]'}`}
      >
      {i + 1}
      </button>
     ))}
     </div>
    </div>
    </div>
   </div>

   {/* Adjective Pool Controls */}
   <div className="p-5 rounded-xl border border-slate-200 dark:border-[#2a2a2a]">
    <h3 className="text-md font-bold text-slate-800 dark:text-[#ffffff] mb-3 flex items-center gap-2">
    <Type className="w-4 h-4 text-indigo-500" /> Adjective Pool
    </h3>
    <p className="text-xs text-slate-500 dark:text-[#71717a] mb-4">Click words to add them to the sentence in the Simulation window.</p>
    
    <div className="flex flex-wrap gap-2">
    {availableAdjectives.length > 0 ? (
     availableAdjectives.map((item, i) => (
     <button
      key={i}
      onClick={() => handleSelectAdjective(item)}
      className="px-3 py-1.5 bg-slate-100 dark:bg-[#1c1b1b] border border-slate-200 dark:border-[#2a2a2a] text-slate-700 dark:text-[#a1a1aa] rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-[#2a2a2a] transition-colors shadow-sm"
     >
      {item.word}
     </button>
     ))
    ) : (
     <p className="text-sm text-slate-400 italic">No words left in pool.</p>
    )}
    </div>
   </div>

   {/* Assessment Component */}
   <div className="p-5 rounded-xl border border-slate-200 dark:border-[#2a2a2a]">
    <h3 className="text-md font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
    <ListChecks className="w-4 h-4 text-indigo-500" /> Knowledge Check
    </h3>

    {!assessmentSubmitted ? (
    <div className="space-y-6">
     {questions.map((q, qIdx) => (
     <div key={qIdx} className="space-y-3">
      <p className="text-sm font-medium text-slate-800 dark:text-[#e4e4e7]">
      {qIdx + 1}. {q.q}
      </p>
      <div className="space-y-2">
      {q.options.map((opt, oIdx) => (
       <label key={oIdx} className="flex items-start gap-3 cursor-pointer group">
       <input
        type="radio"
        name={`question-${qIdx}`}
        className="mt-1 text-indigo-600 bg-slate-100 dark:bg-[#121212] border-slate-300 dark:border-[#2a2a2a] focus:ring-indigo-500"
        checked={assessmentAnswers[qIdx] === oIdx}
        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
       />
       <span className="text-sm text-slate-600 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-slate-100">
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
     className="w-full mt-4 py-2 px-4 bg-[#4158D1] hover:bg-[#3142a3] disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-lg font-bold transition-colors shadow-sm disabled:shadow-none dark:disabled:bg-[#2a2a2a] dark:disabled:text-[#71717a]"
     >
     Submit Evaluation
     </button>
    </div>
    ) : (
    <div className="text-center py-6">
     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
     <span className="text-2xl font-bold">{calculateScore()}/{questions.length}</span>
     </div>
     <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] mb-2">Assessment Complete</h3>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-6">
     {calculateScore() === questions.length 
      ? "Perfect score! You've mastered verbs and adjectives." 
      : "Good effort! Review the rules of passive voice and adjective ordering to improve."}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
     }}
     className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-slate-100 dark:bg-[#1c1b1b] hover:bg-slate-200 dark:hover:bg-[#2a2a2a] text-slate-700 dark:text-[#ffffff] rounded-lg font-medium transition-colors border border-slate-200 dark:border-[#2a2a2a]"
     >
     Retry Quiz
     </button>
    </div>
    )}
   </div>

   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative flex items-center justify-center p-4 md:p-8 overflow-hidden min-h-[500px] `}>
   <div className="w-full max-w-2xl flex flex-col gap-6 overflow-y-auto max-h-full pr-2">
    
    {/* Voice Visualizer */}
    <div className="p-6 rounded-xl border border-slate-200 dark:border-[#2a2a2a] shadow-sm flex flex-col items-center justify-center min-h-[200px]">
     <span className={`text-xs font-bold uppercase tracking-wider mb-4 px-3 py-1 rounded-full ${isPassive ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
      {isPassive ? 'Passive Voice' : 'Active Voice'}
     </span>
     
     <p className="text-2xl font-medium text-slate-900 dark:text-[#ffffff] py-4 text-center leading-relaxed">
      {isPassive ? VOICE_EXERCISES[activeVoiceIndex].passive : VOICE_EXERCISES[activeVoiceIndex].active}
     </p>
     
     <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs md:text-sm font-medium">
      <div className="flex flex-col items-center gap-1">
      <span className="text-slate-500 dark:text-[#71717a] text-[10px] uppercase tracking-wider">Subject</span>
      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg text-blue-700 dark:text-blue-300">
       {VOICE_EXERCISES[activeVoiceIndex].subject}
      </span>
      </div>
      <div className="flex flex-col items-center gap-1">
      <span className="text-slate-500 dark:text-[#71717a] text-[10px] uppercase tracking-wider">Verb</span>
      <span className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-lg text-rose-700 dark:text-rose-300">
       {VOICE_EXERCISES[activeVoiceIndex].verb}
      </span>
      </div>
      <div className="flex flex-col items-center gap-1">
      <span className="text-slate-500 dark:text-[#71717a] text-[10px] uppercase tracking-wider">Object</span>
      <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg text-amber-700 dark:text-amber-300">
       {VOICE_EXERCISES[activeVoiceIndex].object}
      </span>
      </div>
     </div>
    </div>

    {/* Adjective Output Visualizer */}
    <div className="p-6 rounded-xl border border-slate-200 dark:border-[#2a2a2a] shadow-sm flex flex-col items-center min-h-[220px]">
     <div className="flex items-center gap-2 mb-4">
     <Target className="w-5 h-5 text-indigo-500" />
     <h4 className="text-md font-bold text-slate-800 dark:text-[#ffffff]">Target Sentence</h4>
     </div>
     
     <p className="text-sm text-slate-500 dark:text-[#a1a1aa] mb-4 text-center">
     Arrange the adjectives in the correct order to describe the noun. Click to remove.
     </p>

     <div className="w-full min-h-[100px] p-4 border-2 border-dashed border-indigo-200 dark:border-[#2a2a2a] rounded-xl flex flex-wrap gap-2 justify-center items-center bg-indigo-50/30 dark:bg-[#1c1b1b]">
      {adjectiveOrder.map((item, i) => (
      <button
       key={i}
       onClick={() => handleRemoveAdjective(item)}
       className="px-4 py-2 bg-[#4158D1] text-white rounded-lg text-sm font-bold hover:bg-[#3142a3] transition-colors shadow-md flex flex-col items-center"
      >
       <span>{item.word}</span>
       <span className="text-[10px] text-indigo-200 font-normal mt-0.5">{item.type}</span>
      </button>
      ))}
      {adjectiveOrder.length === 0 && (
      <span className="text-sm text-slate-400 dark:text-[#71717a]">Empty sentence...</span>
      )}
     </div>

     {adjectiveOrder.length === ADJECTIVE_ORDER_PUZZLE.length && (
      <div className={`mt-6 w-full p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${checkAdjectiveOrder() ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400' : 'bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400'}`}>
      {checkAdjectiveOrder() ? (
       <><CheckCircle2 className="w-5 h-5" /> Perfect adjective order!</>
      ) : (
       <>Incorrect order. Remember the rule!</>
      )}
      </div>
     )}
    </div>

   </div>
  </section>

  </main>
 </div>
 );
}
