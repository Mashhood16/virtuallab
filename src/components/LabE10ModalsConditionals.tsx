import { useState } from 'react';
import { BookOpen, Target, Cpu, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10ModalsConditionalsProps {
 onExit?: () => void;
}

const LOGIC_GATES = [
 { 
 ifClause: "If it rains tomorrow,", 
 type: "First Conditional",
 matches: [
  { text: "we will cancel the picnic.", isCorrect: true, explanation: "First conditional uses Present Simple + Future Simple for real possibilities." },
  { text: "we would cancel the picnic.", isCorrect: false, explanation: "Incorrect. 'Would' is used in Second Conditional." },
  { text: "we cancel the picnic.", isCorrect: false, explanation: "Incorrect. Main clause needs 'will' for First Conditional." }
 ]
 },
 { 
 ifClause: "If I had a million dollars,", 
 type: "Second Conditional",
 matches: [
  { text: "I will buy an island.", isCorrect: false, explanation: "Incorrect. 'Will' is used for First Conditional (real possibilities)." },
  { text: "I would buy an island.", isCorrect: true, explanation: "Second conditional uses Past Simple + 'Would' + Verb for imaginary situations." },
  { text: "I bought an island.", isCorrect: false, explanation: "Incorrect tense for the main clause." }
 ]
 },
 {
 ifClause: "You are feeling very sick.",
 type: "Modal of Necessity",
 matches: [
  { text: "You might see a doctor.", isCorrect: false, explanation: "Too weak. 'Might' shows possibility." },
  { text: "You can see a doctor.", isCorrect: false, explanation: "Too weak. 'Can' shows ability or permission." },
  { text: "You must see a doctor.", isCorrect: true, explanation: "'Must' shows strong necessity or obligation." }
 ]
 }
];

export default function LabE10ModalsConditionals({ onExit = () => {} }: LabE10ModalsConditionalsProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentGate, setCurrentGate] = useState(0);
 const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
 
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const questions = [
 {
  q: "Which modal verb expresses strong obligation?",
  options: ["Can", "May", "Must", "Might"],
  correct: 2
 },
 {
  q: "Which sentence is a First Conditional?",
  options: [
  "If I were you, I would study harder.",
  "If it snows, we will build a snowman.",
  "I must finish this assignment.",
  "If I had known, I would have gone."
  ],
  correct: 1
 },
 {
  q: "What does the Second Conditional express?",
  options: [
  "General truths (Zero Conditional)",
  "Real future possibilities",
  "Imaginary or unrealistic situations",
  "Past regrets"
  ],
  correct: 2
 }
 ];

 const handleMatchSelect = (idx: number) => {
 if (selectedMatch === null) {
  setSelectedMatch(idx);
 }
 };

 const nextGate = () => {
 setCurrentGate((prev) => (prev + 1) % LOGIC_GATES.length);
 setSelectedMatch(null);
 };

 const calculateScore = () => {
 let score = 0;
 questions.forEach((q, idx) => {
  if (assessmentAnswers[idx] === q.correct) score++;
 });
 return score;
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#121212] font-sans text-slate-900 dark:text-[#ffffff]">
  <LabHeader title="Unit 5: Possibility Engine (Modals & Conditionals)" variant="dark" onExit={onExit} />
  
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
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] overflow-hidden flex flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-6">
   <BookOpen className="w-6 h-6 text-[#4158D1] dark:text-blue-400" />
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">Modals & Conditionals</h2>
   </div>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto flex-1 pr-2">
   <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff]">Modal Verbs</h3>
   <p>Modal verbs are auxiliary verbs that express necessity or possibility. English modal verbs include must, shall, will, should, would, can, could, may, and might.</p>
   
   <h4 className="text-md font-semibold text-slate-800 dark:text-[#e4e4e7] mt-4">Necessity and Obligation</h4>
   <ul className="list-disc pl-5 space-y-1">
    <li><strong>Must:</strong> Expresses strong obligation or logical conclusion. (e.g., <em>"You must wear a seatbelt."</em>)</li>
    <li><strong>Have to:</strong> Often used interchangeably with must, but usually implies external obligation. (e.g., <em>"I have to work tomorrow."</em>)</li>
    <li><strong>Should:</strong> Expresses advice or a weaker obligation. (e.g., <em>"You should see a doctor."</em>)</li>
   </ul>

   <h4 className="text-md font-semibold text-slate-800 dark:text-[#e4e4e7] mt-4">Ability and Permission</h4>
   <ul className="list-disc pl-5 space-y-1">
    <li><strong>Can / Could:</strong> Expresses ability or polite requests. (e.g., <em>"Can you help me?"</em>, <em>"She could play the piano well."</em>)</li>
    <li><strong>May:</strong> Expresses formal permission. (e.g., <em>"May I leave the room?"</em>)</li>
   </ul>

   <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] mt-6">Conditional Sentences</h3>
   <p>Conditionals describe the result of a certain condition. They usually begin with "if".</p>

   <h4 className="text-md font-semibold text-slate-800 dark:text-[#e4e4e7] mt-4">Zero Conditional</h4>
   <p>Used for general truths and facts.</p>
   <ul className="list-disc pl-5 space-y-1">
    <li><strong>Structure:</strong> If + Present Simple, ... Present Simple</li>
    <li><strong>Example:</strong> <em>"If you heat ice, it melts."</em></li>
   </ul>

   <h4 className="text-md font-semibold text-slate-800 dark:text-[#e4e4e7] mt-4">First Conditional</h4>
   <p>Used for real or highly possible situations in the present or future.</p>
   <ul className="list-disc pl-5 space-y-1">
    <li><strong>Structure:</strong> If + Present Simple, ... will + infinitive</li>
    <li><strong>Example:</strong> <em>"If it rains, I will stay home."</em></li>
   </ul>

   <h4 className="text-md font-semibold text-slate-800 dark:text-[#e4e4e7] mt-4">Second Conditional</h4>
   <p>Used for imaginary, unlikely, or impossible situations in the present or future.</p>
   <ul className="list-disc pl-5 space-y-1">
    <li><strong>Structure:</strong> If + Past Simple, ... would + infinitive</li>
    <li><strong>Example:</strong> <em>"If I won the lottery, I would buy a boat."</em></li>
   </ul>

   <h4 className="text-md font-semibold text-slate-800 dark:text-[#e4e4e7] mt-4">Third Conditional</h4>
   <p>Used for imaginary situations in the past (regrets or unfulfilled conditions).</p>
   <ul className="list-disc pl-5 space-y-1">
    <li><strong>Structure:</strong> If + Past Perfect, ... would have + past participle</li>
    <li><strong>Example:</strong> <em>"If I had studied harder, I would have passed."</em></li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls (Knowledge Check) */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-3 mb-6">
   <Target className="w-6 h-6 text-[#4158D1] dark:text-blue-400" />
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">Knowledge Check</h2>
   </div>
   
   <div className="flex-1 overflow-y-auto pr-2">
   {!assessmentSubmitted ? (
    <div className="space-y-6">
    {questions.map((q, qIdx) => (
     <div key={qIdx} className="space-y-3">
     <p className="text-sm font-medium text-slate-800 dark:text-[#ffffff]">
      {qIdx + 1}. {q.q}
     </p>
     <div className="space-y-2">
      {q.options.map((opt, oIdx) => (
      <label key={oIdx} className="flex items-start gap-3 cursor-pointer group">
       <input
       type="radio"
       name={`question-${qIdx}`}
       className="mt-1 w-4 h-4 text-[#4158D1] bg-slate-100 dark:bg-[#121212]/50 border-slate-300 dark:border-[#2a2a2a]"
       checked={assessmentAnswers[qIdx] === oIdx}
       onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
       />
       <span className="text-sm text-slate-700 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-slate-100">
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
     className={`w-full mt-4 py-2 px-4 bg-[#4158D1] hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors flex-col `}
    >
     Submit Evaluation
    </button>
    </div>
   ) : (
    <div className="text-center py-8">
    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#4158D1] dark:text-blue-400 mb-4 flex-col `}>
     <span className="text-3xl font-bold">{calculateScore()}/{questions.length}</span>
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-[#a1a1aa] mb-2">Assessment Complete</h3>
    <p className="text-slate-600 dark:text-[#71717a] mb-6">
     {calculateScore() === questions.length 
     ? "Perfect score! You've mastered modals and conditionals." 
     : "Good effort! Review the definitions of First and Second Conditionals to improve."}
    </p>
    <button
     onClick={() => {
     setAssessmentSubmitted(false);
     setAssessmentAnswers({});
     }}
     className={`flex items-center justify-center gap-2 w-full py-2 px-4 bg-slate-200 dark:bg-[#2a2a2a] hover:bg-slate-300 dark:hover:bg-[#333333] text-slate-700 dark:text-[#ffffff] rounded-lg font-medium transition-colors flex-col `}
    >
     Retry Lab
    </button>
    </div>
   )}
   </div>
  </section>

  {/* Window 3: Simulation (Logic Engine) */}
  <section className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-4 md:p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="w-full max-w-xl flex flex-col h-full rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-6 overflow-hidden">
   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-[#2a2a2a] shrink-0">
    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-[#4158D1] dark:text-blue-400 rounded-lg">
    <Cpu className="w-6 h-6" />
    </div>
    <h2 className="text-xl font-bold text-slate-900 dark:text-[#a1a1aa]">Logic Engine</h2>
   </div>
   
   <div className="flex-1 flex flex-col overflow-hidden">
    <div className="mb-6 flex justify-between items-center shrink-0">
    <span className="text-sm font-medium text-slate-600 dark:text-[#71717a]">
     Scenario {currentGate + 1} of {LOGIC_GATES.length}
    </span>
    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-[#4158D1] dark:text-blue-300 text-xs font-bold rounded-full">
     {LOGIC_GATES[currentGate].type}
    </span>
    </div>

    <div className="bg-slate-50 dark:bg-[#1c1b1b] p-6 rounded-xl border border-slate-200 dark:border-[#2a2a2a] text-center mb-6 shadow-sm shrink-0">
    <p className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">
     "{LOGIC_GATES[currentGate].ifClause}"
    </p>
    </div>

    <div className="space-y-3 flex-1 overflow-y-auto pr-2">
    <p className="text-sm font-medium text-slate-600 dark:text-[#71717a] mb-2">Select the correct continuation:</p>
    {LOGIC_GATES[currentGate].matches.map((match, idx) => {
     const isSelected = selectedMatch === idx;
     const isAnswered = selectedMatch !== null;
     
     return (
     <button
      key={idx}
      onClick={() => handleMatchSelect(idx)}
      disabled={isAnswered}
      className={`w-full p-4 rounded-xl text-left transition-all border-2 flex flex-col gap-2 ${ !isAnswered ? 'border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:bg-[#121212]' : isSelected ? match.isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-500' : 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 dark:border-rose-500' : match.isCorrect ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 opacity-70' : 'border-slate-200 dark:border-[#2a2a2a] dark:bg-[#121212] opacity-40' }`}
     >
      <div className="flex justify-between items-center w-full">
      <span className={`font-medium ${ isAnswered && (isSelected || match.isCorrect) ? match.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300' : 'text-slate-700 dark:text-[#ffffff]' }`}>
       {match.text}
      </span>
      {isAnswered && isSelected && match.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
      {isAnswered && isSelected && !match.isCorrect && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
      </div>
      
      {isAnswered && (isSelected || match.isCorrect) && (
      <div className={`text-sm mt-2 p-2 rounded bg-white/50 dark:bg-[#1c1b1b] ${ match.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400' }`}>
       {match.explanation}
      </div>
      )}
     </button>
     );
    })}
    </div>

    {selectedMatch !== null && (
    <div className="mt-4 flex justify-end pt-4 border-t border-slate-200 dark:border-[#2a2a2a] shrink-0">
     <button
     onClick={nextGate}
     className="flex items-center gap-2 px-6 py-2 bg-[#4158D1] hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-md"
     >
     Next Scenario <ChevronRight className="w-5 h-5" />
     </button>
    </div>
    )}
   </div>
   </div>
  </section>
  </main>
 </div>
 );
}
