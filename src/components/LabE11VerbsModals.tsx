import { useState } from 'react';
import { ArrowLeft, Check, BookOpen, List, Activity, HelpCircle, AlertCircle } from 'lucide-react';

const SCENARIOS = [
 {
 id: 1,
 type: "Modal Verbs",
 situation: "You see very dark clouds in the sky and hear loud thunder.",
 question: "Which modal verb best completes the deduction: 'It ___ rain soon.'?",
 options: ["must", "can't", "ought to", "would"],
 answer: "must",
 feedback: "'Must' is used for strong deductions based on clear present evidence."
 },
 {
 id: 2,
 type: "Linking Verbs",
 situation: "Sentence: 'The chef's special soup tastes incredible.'",
 question: "What role does the verb 'tastes' play in this sentence?",
 options: ["Transitive", "Intransitive", "Linking", "Helping"],
 answer: "Linking",
 feedback: "'Tastes' connects the subject (soup) to an adjective describing it (incredible), making it a linking verb."
 },
 {
 id: 3,
 type: "Transitive vs. Intransitive",
 situation: "Sentence: 'The alarm clock rang loudly at 6 AM.'",
 question: "Is the action verb 'rang' transitive or intransitive?",
 options: ["Transitive", "Intransitive", "Linking", "Modal"],
 answer: "Intransitive",
 feedback: "The verb 'rang' is intransitive because it does not take a direct object; 'loudly' is an adverb."
 },
 {
 id: 4,
 type: "Finite vs. Non-finite Verbs",
 situation: "Sentence: 'They plan to travel to Japan next year.'",
 question: "Identify the non-finite verb (infinitive) in the sentence.",
 options: ["plan", "to travel", "travel", "to Japan"],
 answer: "to travel",
 feedback: "'To travel' is an infinitive, which is a non-finite verb form that doesn't change with subject or tense."
 },
 {
 id: 5,
 type: "Regular vs. Irregular Verbs",
 situation: "Consider the past tense of the verb 'catch'.",
 question: "Is 'catch' a regular or irregular verb, and what is its past tense form?",
 options: ["Regular: catched", "Irregular: caught", "Regular: caught", "Irregular: catch"],
 answer: "Irregular: caught",
 feedback: "Irregular verbs don't form their past tense by adding '-ed'. The past of 'catch' is 'caught'."
 },
 {
 id: 6,
 type: "Modal Verbs",
 situation: "You want to politely ask a stranger for the time.",
 question: "Which modal verb makes the request most polite: '___ you tell me the time, please?'",
 options: ["Must", "Should", "Could", "May"],
 answer: "Could",
 feedback: "'Could' is used to make polite requests."
 }
];

export default function LabE11VerbsModals({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
 const [selectedOption, setSelectedOption] = useState<string | null>(null);
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const scenario = SCENARIOS[currentScenarioIndex];

 const handleCheck = () => {
 if (selectedOption === scenario.answer) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 const handleNext = () => {
 setSelectedOption(null);
 setIsCorrect(null);
 setCurrentScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#121212] font-sans text-slate-900 dark:text-[#ffffff]">
  <header className="flex items-center p-4 bg-white dark:bg-[#1c1b1b] shadow-sm z-10 border-b border-slate-200 dark:border-[#2a2a2a]">
  <button 
   onClick={onExit} 
   className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#2a2a2a] transition-colors whitespace-nowrap flex-shrink-0"
  >
   <ArrowLeft size={24} />
  </button>
  <h1 className="text-2xl font-bold flex-1 flex items-center gap-2">
   <Activity className="text-indigo-500" />
   Verbs & Modals
  </h1>
  </header>

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
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex flex-col lg:h-full  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
   <BookOpen size={20} className="text-[#4158D1]" />
   Study Notes
   </h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Introduction to Verbs</h3>
   <p className="mb-4">Verbs describe an action, state, or occurrence. They form the main part of the predicate of a sentence.</p>

   <h4 className="text-md font-bold text-slate-800 dark:text-white mb-2 mt-4">Action vs. Linking Verbs</h4>
   <ul className="list-disc pl-5 mb-4 space-y-2">
    <li><strong>Action verbs</strong> express physical or mental actions (e.g., run, think, jump). <em>Example: She runs every morning.</em></li>
    <li><strong>Linking verbs</strong> connect the subject to a complement that describes it (e.g., is, seems, tastes). <em>Example: The soup tastes delicious.</em></li>
   </ul>

   <h4 className="text-md font-bold text-slate-800 dark:text-white mb-2 mt-4">Transitive vs. Intransitive Verbs</h4>
   <ul className="list-disc pl-5 mb-4 space-y-2">
    <li><strong>Transitive verbs</strong> require a direct object to complete their meaning. <em>Example: She wrote a letter. (Object: a letter)</em></li>
    <li><strong>Intransitive verbs</strong> do not take an object. <em>Example: He slept peacefully.</em></li>
   </ul>

   <h4 className="text-md font-bold text-slate-800 dark:text-white mb-2 mt-4">Finite vs. Non-finite Verbs</h4>
   <ul className="list-disc pl-5 mb-4 space-y-2">
    <li><strong>Finite verbs</strong> change their form according to tense, person, and number. <em>Example: I walk. He walks.</em></li>
    <li><strong>Non-finite verbs</strong> (infinitives, participles, gerunds) do not change form. <em>Example: I want to walk. He wants to walk.</em></li>
   </ul>

   <h4 className="text-md font-bold text-slate-800 dark:text-white mb-2 mt-4">Regular vs. Irregular Verbs</h4>
   <ul className="list-disc pl-5 mb-4 space-y-2">
    <li><strong>Regular verbs</strong> form their past tense by adding '-ed' or '-d'. <em>Example: play → played.</em></li>
    <li><strong>Irregular verbs</strong> have unique past tense forms that don't follow the regular rule. <em>Example: catch → caught, go → went.</em></li>
   </ul>

   <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 mt-6">Modal Verbs</h3>
   <p className="mb-4">Modal verbs are helping verbs that express necessity, possibility, permission, or ability. They are never used alone and are always followed by the base form of the verb.</p>
   <ul className="list-disc pl-5 space-y-3">
    <li><strong>Must:</strong> Expresses strong obligation or a logical deduction based on clear evidence. <em>Example: It must be raining.</em></li>
    <li><strong>Might / May:</strong> Expresses possibility or is used to ask for formal permission. <em>Example: It might rain later.</em></li>
    <li><strong>Should / Ought to:</strong> Used for giving advice, recommendation, or expressing expectation. <em>Example: You should study more.</em></li>
    <li><strong>Can / Could:</strong> Expresses ability, possibility, or is used for polite requests. <em>Example: Could you help me?</em></li>
    <li><strong>Will / Would:</strong> Used for future intentions, conditionals, or polite offers. <em>Example: I will go to the store.</em></li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col lg:h-full  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
   <List size={20} className="text-[#4158D1]" />
   Scenario Simulator
   </h2>
   
   <div className="flex-grow flex flex-col justify-between overflow-y-auto pr-2">
   <div>
    <div className="mb-6">
    <p className="text-sm font-semibold text-slate-500 dark:text-[#a1a1aa] mb-1">Scenario {currentScenarioIndex + 1} of {SCENARIOS.length}</p>
    <p className="text-lg font-medium text-slate-800 dark:text-white">{scenario.type}</p>
    </div>
    
    <p className="text-sm font-bold text-slate-700 dark:text-[#a1a1aa] mb-3 uppercase tracking-wider">Select the best answer:</p>
    <div className="space-y-3 mb-6">
    {scenario.options.map(opt => (
     <button
     key={opt}
     disabled={isCorrect === true}
     onClick={() => {
      if (isCorrect !== true) {
      setSelectedOption(opt);
      setIsCorrect(null);
      }
     }}
     className={`w-full p-4 rounded-xl font-semibold text-base text-left transition-all border-2 flex items-center justify-between group ${ selectedOption === opt ? 'bg-indigo-50 border-[#4158D1] text-[#4158D1] dark:bg-[#4158D1]/20 dark:border-[#4158D1] dark:text-indigo-300' : 'bg-white border-slate-200 text-slate-700 hover:border-[#4158D1]/50 hover:bg-slate-50 dark:bg-[#121212] dark:border-[#2a2a2a] dark:text-[#ffffff] dark:hover:bg-[#2a2a2a]' } ${isCorrect === true ? 'opacity-60 cursor-not-allowed' : ''}`}
     >
     <span>{opt}</span>
     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedOption === opt ? 'border-[#4158D1]' : 'border-slate-300 dark:border-slate-600 group-hover:border-[#4158D1]/50'}`}>
      {selectedOption === opt && <div className={`w-2.5 h-2.5 bg-[#4158D1] rounded-full flex-col `} />}
     </div>
     </button>
    ))}
    </div>
   </div>

   <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#2a2a2a]">
    {isCorrect === false && (
    <div className="mb-4 text-rose-500 font-medium flex items-center gap-2">
     <AlertCircle size={20} />
     Incorrect, review the options.
    </div>
    )}
    
    {isCorrect === null || isCorrect === false ? (
    <button 
     onClick={handleCheck}
     disabled={!selectedOption}
     className={`w-full py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 ${ selectedOption ? 'bg-[#4158D1] hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-[#71717a]' }`}
    >
     Verify Answer <Check size={20} />
    </button>
    ) : (
    <button 
     onClick={handleNext}
     className={`w-full py-3 bg-[#4158D1] hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 flex-col `}
    >
     Next Scenario
    </button>
    )}
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] lg:h-full flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   
   <div className={`p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-[#1c1b1b] flex flex-col relative `}>
   
   <div className="mb-8">
    <p className="text-lg text-slate-600 dark:text-[#71717a] mb-2 font-medium">Situation:</p>
    <p className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-[#ffffff] mb-6 italic border-l-4 border-[#4158D1] pl-4">"{scenario.situation}"</p>
    
    <div className="flex items-start gap-3 mt-6 bg-slate-50 dark:bg-[#1c1b1b] p-6 rounded-xl border border-slate-100 dark:border-[#2a2a2a]">
    <HelpCircle className="text-[#4158D1] mt-1 flex-shrink-0" size={24} />
    <p className="text-xl font-medium text-slate-800 dark:text-[#ffffff]">{scenario.question}</p>
    </div>
   </div>

   {isCorrect === true && (
    <div className="mt-4 p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl animate-in fade-in slide-in-from-bottom-4">
    <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 mb-2">
     <Check size={20} /> Correct!
    </div>
    <p className="text-slate-700 dark:text-[#a1a1aa] leading-relaxed">
     {scenario.feedback}
    </p>
    </div>
   )}
   
   </div>
   
  </section>
  </main>
 </div>
 );
}
