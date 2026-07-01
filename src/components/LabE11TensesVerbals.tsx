import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Clock, Check } from 'lucide-react';

const STORY_PARTS = [
 {
 id: 1,
 text: "By the time the rescue team ",
 options: ["arrives", "arrived", "had arrived", "will arrive"],
 correct: "arrived",
 type: "tense",
 hint: "Simple Past (Action completed in the past)",
 timelinePos: "past",
 label: "Team Arrival"
 },
 {
 id: 2,
 text: ", the hikers ",
 options: ["already waited", "had already waited", "have already been waiting", "had already been waiting"],
 correct: "had already been waiting",
 type: "tense",
 hint: "Past Perfect Continuous (Action ongoing up to a point in the past)",
 timelinePos: "past-perfect",
 label: "Hikers Waiting"
 },
 {
 id: 3,
 text: " for hours. Right now, they ",
 options: ["rested", "rest", "are resting", "will rest"],
 correct: "are resting",
 type: "tense",
 hint: "Present Continuous (Happening currently)",
 timelinePos: "present",
 label: "Resting"
 },
 {
 id: 4,
 text: " safely at the base camp. ",
 options: ["To survive", "Surviving", "Survived", "Survive"],
 correct: "Surviving",
 type: "verbal",
 hint: "Gerund acting as the subject of the sentence",
 timelinePos: "general",
 label: "Surviving"
 },
 {
 id: 5,
 text: " such an ordeal requires resilience. By this time tomorrow, they ",
 options: ["will travel", "will have traveled", "will be traveling", "travel"],
 correct: "will be traveling",
 type: "tense",
 hint: "Future Continuous (Action that will be in progress at a specific future time)",
 timelinePos: "future",
 label: "Traveling Home"
 },
 {
 id: 6,
 text: " back to their homes, looking forward to ",
 options: ["settle down", "settling down", "settled down", "have settled down"],
 correct: "settling down",
 type: "phrasal",
 hint: "Gerund after the phrasal verb 'look forward to'",
 timelinePos: "general",
 label: "Settling Down"
 }
];

export default function LabE11TensesVerbals({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [answers, setAnswers] = useState<Record<number, string>>({});
 const [feedback, setFeedback] = useState<Record<number, boolean | null>>({});
 const [score, setScore] = useState<number | null>(null);

 const handleSelect = (id: number, value: string) => {
 setAnswers(prev => ({ ...prev, [id]: value }));
 setFeedback(prev => ({ ...prev, [id]: null })); // Reset feedback for this part on change
 };

 const checkAnswers = () => {
 let currentScore = 0;
 const newFeedback: Record<number, boolean> = {};
 STORY_PARTS.forEach(part => {
  const isCorrect = answers[part.id] === part.correct;
  newFeedback[part.id] = isCorrect;
  if (isCorrect) currentScore++;
 });
 setFeedback(newFeedback);
 setScore(currentScore);
 };

 const reset = () => {
 setAnswers({});
 setFeedback({});
 setScore(null);
 };

 const renderTimelineEvent = (part: typeof STORY_PARTS[0]) => {
 const isCorrect = feedback[part.id];
 
 let positionClass = "";
 switch (part.timelinePos) {
  case "past-perfect": positionClass = "left-[10%]"; break;
  case "past": positionClass = "left-[30%]"; break;
  case "present": positionClass = "left-[50%]"; break;
  case "future": positionClass = "left-[80%]"; break;
  case "general": positionClass = "left-[50%] top-[70%]"; break;
 }

 return (
  <div 
  key={part.id} 
  className={`absolute flex flex-col items-center transition-all duration-500 ease-in-out ${positionClass} ${part.timelinePos === 'general' ? 'translate-y-8' : '-translate-y-1/2 top-1/2'}`}
  style={{ opacity: isCorrect ? 1 : 0.3 }}
  >
  <div className={`w-4 h-4 rounded-full border-2 ${isCorrect ? 'bg-green-500 border-green-600' : 'bg-slate-300 border-slate-400 dark:bg-slate-700 dark:border-slate-600'}`}></div>
  <div className="mt-2 text-xs font-medium text-slate-700 dark:text-[#a1a1aa] text-center w-24">
   {part.label}
   {isCorrect && <div className="text-[10px] text-green-600 dark:text-green-400 font-bold mt-1">{answers[part.id]}</div>}
  </div>
  </div>
 );
 };

 return (
 <div className="flex flex-col min-h-screen bg-slate-50 dark:!bg-[#000000] font-sans text-slate-900 dark:text-[#ffffff]">
  {/* Header */}
  <header className="w-full shadow-sm p-4 flex items-center justify-between z-10 flex-shrink-0">
  <div className="flex items-center gap-4">
   <button
   onClick={onExit}
   className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
   title="Go Back"
   >
   <ArrowLeft className="w-6 h-6" />
   </button>
   <h1 className="text-lg md:text-xl font-bold">Lab: Tenses & Verbals</h1>
  </div>
  <div className="flex items-center gap-2">
   {score !== null && (
   <span className="font-semibold text-lg mr-4">
    Score: {score} / {STORY_PARTS.length}
   </span>
   )}
   <button
   onClick={reset}
   className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0"
   >
   <RefreshCw className="w-4 h-4" /> Reset
   </button>
  </div>
  </header>

  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative">
   <button 
   onClick={() => setActiveMobileTab('theory')}
   className={`lg:w-full py-3 text-sm font-bold rounded-lg transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
  >
   Theory
  </button>
   <button 
   onClick={() => setActiveMobileTab('lab')}
   className={`lg:w-full py-3 text-sm font-bold rounded-lg transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
  >Lab</button>
  </div>

  {/* Main Content Area */}
  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Grammar Theory</h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[calc(100vh-16rem)] pr-2">
   <p>
    Mastering tenses and verbals helps ensure that your narrative timeline remains consistent and logical. Here's a breakdown of the concepts covered in this lab.
   </p>

   <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg mt-6">1. Past and Past Perfect</h3>
   <p>
    When narrating events in the past, it is important to distinguish the sequence of actions.
   </p>
   <ul className="list-disc pl-5 mt-2 space-y-2">
    <li>
    <strong>Simple Past:</strong> Used for an action that was completely finished in the past. <br/>
    <em>Example: "The rescue team <strong>arrived</strong>."</em>
    </li>
    <li>
    <strong>Past Perfect Continuous:</strong> Emphasizes the ongoing nature of an action that happened <em>before</em> another action in the past. <br/>
    <em>Example: "The hikers <strong>had been waiting</strong> for hours by the time the team arrived."</em>
    </li>
   </ul>

   <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg mt-6">2. Present Tenses</h3>
   <p>
    The <strong>Present Continuous</strong> tense describes actions happening right now or around the present moment. It is formed with the present tense of "to be" + present participle (-ing). <br/>
    <em>Example: "Right now, they <strong>are resting</strong>."</em>
   </p>

   <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg mt-6">3. Verbals: Gerunds</h3>
   <p>
    A <strong>Gerund</strong> is a verb ending in <em>-ing</em> that functions entirely as a noun.
   </p>
   <ul className="list-disc pl-5 mt-2 space-y-2">
    <li>
    <strong>As a Subject:</strong> A gerund can act as the main subject of a sentence. <br/>
    <em>Example: "<strong>Surviving</strong> such an ordeal requires resilience."</em>
    </li>
    <li>
    <strong>Object of a Preposition:</strong> Gerunds must be used after prepositions or phrasal verbs ending in a preposition. <br/>
    <em>Example: "Looking forward to <strong>settling</strong> down."</em> (Note: "to" is a preposition here, not an infinitive marker.)
    </li>
   </ul>

   <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg mt-6">4. Future Tenses</h3>
   <p>
    The <strong>Future Continuous</strong> tense describes an action that will be in progress at a specific time in the future. It is formed with <em>will be</em> + present participle. <br/>
    <em>Example: "By this time tomorrow, they <strong>will be traveling</strong>."</em>
   </p>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="mb-6">
   <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-800 dark:text-white">
    <Clock className="w-5 h-5 text-blue-500" />
    Narrative Editor
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    Fix the tense inconsistencies and select the correct verbal forms in the story below.
   </p>
   </div>

   <div className={`flex-1 text-lg leading-[2.5] p-6 rounded-xl border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col `}>
   {STORY_PARTS.map((part) => (
    <span key={part.id}>
    <span>{part.text}</span>
    <span className="inline-block relative">
     <select
     className={`appearance-none bg-slate-50 dark:bg-[#1c1b1b] border-b-2 font-semibold text-blue-600 dark:text-blue-400 px-3 py-1 mx-1 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer ${feedback[part.id] === true ? 'border-green-500 text-green-600 dark:text-green-400' : ''} ${feedback[part.id] === false ? 'border-red-500 text-red-600 dark:text-red-400' : 'border-blue-300 dark:border-blue-700'}`}
     value={answers[part.id] || ""}
     onChange={(e) => handleSelect(part.id, e.target.value)}
     >
     <option value="" disabled>Select...</option>
     {part.options.map(opt => (
      <option key={opt} value={opt}>{opt}</option>
     ))}
     </select>
     {feedback[part.id] === true && (
     <CheckCircle className={`w-4 h-4 text-green-500 absolute -top-2 -right-2 rounded-full flex-col `} />
     )}
     {feedback[part.id] === false && (
     <XCircle className={`w-4 h-4 text-red-500 absolute -top-2 -right-2 rounded-full flex-col `} />
     )}
    </span>
    {feedback[part.id] === false && (
     <span className="block text-xs text-red-600 dark:text-red-400 mt-1 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-200 dark:border-red-800/50 max-w-sm">
     Hint: {part.hint}
     </span>
    )}
    </span>
   ))}
   </div>

   <div className="mt-6 flex justify-end">
   <button
    onClick={checkAnswers}
    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-sm dark:bg-blue-500 dark:hover:bg-blue-400 w-full justify-center md:w-auto"
   >
    <Check className="w-5 h-5" /> Check Narrative
   </button>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex flex-col items-center justify-center p-4 md:p-8 lg:min-h-[300px] md:lg:min-h-[500px] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="w-full mb-8 z-10 self-start">
   <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Temporal Visualization</h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    As you correct the tenses, the events will snap to their proper place on the timeline.
   </p>
   </div>
   
   <div className="flex-1 w-full relative rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex items-center p-8 shadow-inner overflow-x-auto min-h-[300px]">
   {/* Timeline Axis */}
   <div className="absolute left-8 right-8 h-1 bg-slate-300 dark:bg-slate-600 top-1/2 -translate-y-1/2 rounded-full min-w-[500px]"></div>
   
   {/* Markers */}
   <div className="absolute left-[10%] top-1/2 w-0.5 h-6 bg-slate-400 dark:bg-slate-500 -translate-y-1/2 -ml-[1px]"></div>
   <div className="absolute left-[30%] top-1/2 w-0.5 h-6 bg-slate-400 dark:bg-slate-500 -translate-y-1/2 -ml-[1px]"></div>
   <div className="absolute left-[50%] top-1/2 w-0.5 h-8 bg-blue-500 dark:bg-blue-400 -translate-y-1/2 -ml-[1px]"></div>
   <div className="absolute left-[80%] top-1/2 w-0.5 h-6 bg-slate-400 dark:bg-slate-500 -translate-y-1/2 -ml-[1px]"></div>

   {/* Axis Labels */}
   <div className="absolute left-[10%] top-1/2 mt-6 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-wider">Past Perfect</div>
   <div className="absolute left-[30%] top-1/2 mt-6 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-wider">Past</div>
   <div className="absolute left-[50%] top-1/2 mt-8 -translate-x-1/2 text-sm font-bold text-blue-500 uppercase tracking-wider">Present</div>
   <div className="absolute left-[80%] top-1/2 mt-6 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-wider">Future</div>

   {/* Events */}
   {STORY_PARTS.map(renderTimelineEvent)}
   </div>
  </section>

  </main>
 </div>
 );
}
