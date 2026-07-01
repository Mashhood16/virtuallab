import { useState } from 'react';
import { BookOpen, Target, Clock, Settings, Activity } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10ConjunctionsTensesProps {
 onExit?: () => void;
}

const TENSES_TIMELINE = [
 { tense: 'Past Perfect', sentence: 'He had finished the report.' },
 { tense: 'Past Continuous', sentence: 'He was finishing the report.' },
 { tense: 'Past Indefinite', sentence: 'He finished the report.' },
 { tense: 'Present Perfect', sentence: 'He has finished the report.' },
 { tense: 'Present Continuous', sentence: 'He is finishing the report.' },
 { tense: 'Present Indefinite', sentence: 'He finishes the report.' },
 { tense: 'Future Indefinite', sentence: 'He will finish the report.' }
];

export default function LabE10ConjunctionsTenses({ onExit = () => {} }: LabE10ConjunctionsTensesProps) {
 const [timelineIndex, setTimelineIndex] = useState(5); // Default to Present Indefinite
 
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const questions = [
 {
  q: "Which pair is a Correlative Conjunction?",
  options: ["Although / Yet", "Either / Or", "Because / So", "If / Then"],
  correct: 1
 },
 {
  q: "Identify the tense: 'They have been playing for two hours.'",
  options: [
  "Present Perfect",
  "Present Continuous",
  "Present Perfect Continuous",
  "Past Continuous"
  ],
  correct: 2
 },
 {
  q: "Which conjunction shows Concession?",
  options: ["Because", "Although", "When", "If"],
  correct: 1
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
 <div className="min-h-screen flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans text-slate-900 dark:text-[#ffffff]">
  <LabHeader title="Unit 4: Chronology & Connections" variant="dark" onExit={onExit} />

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
   <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-[#2a2a2a]">
   <BookOpen className="w-5 h-5 text-[#4158D1]" />
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Grammar Theory</h2>
   </div>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mt-2 mb-2">1. Conjunctions</h3>
   <p>Conjunctions are words that connect words, phrases, or clauses. Understanding how they function is crucial for creating coherent and structurally sound sentences.</p>
   
   <h4 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Coordinating Conjunctions</h4>
   <p>These join elements of equal grammatical rank. The most common ones can be remembered with the acronym <strong>FANBOYS</strong>: For, And, Nor, But, Or, Yet, So.</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><strong>And:</strong> Adds information (e.g., "I like apples <em>and</em> oranges.")</li>
    <li><strong>But:</strong> Shows contrast (e.g., "It is raining, <em>but</em> we will go.")</li>
   </ul>

   <h4 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Correlative Conjunctions</h4>
   <p>These work in pairs to join equal elements. Common pairs include:</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><em>Either / Or:</em> Offers a choice between two options.</li>
    <li><em>Neither / Nor:</em> Negates both options.</li>
    <li><em>Not only / But also:</em> Emphasizes addition.</li>
   </ul>
   
   <h4 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Subordinating Conjunctions</h4>
   <p>These introduce dependent clauses and show the relationship between the dependent and independent clauses.</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><strong>Reason:</strong> Because, since, as (e.g., "We stayed in <em>because</em> it was raining.")</li>
    <li><strong>Concession:</strong> Although, though, even though (e.g., "<em>Although</em> it was late, he kept working.")</li>
    <li><strong>Condition:</strong> If, unless, provided that (e.g., "You will fail <em>unless</em> you study.")</li>
    <li><strong>Time:</strong> When, while, before, after (e.g., "Call me <em>when</em> you arrive.")</li>
   </ul>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mt-8 mb-2">2. Tenses</h3>
   <p>Tenses indicate the time of an action or state of being. English has three main time frames: Past, Present, and Future, each subdivided into four aspects.</p>

   <h4 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Present Tense</h4>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><strong>Indefinite (Simple):</strong> Habitual actions or general truths (e.g., "He <em>finishes</em> the report.")</li>
    <li><strong>Continuous:</strong> Actions happening right now (e.g., "He <em>is finishing</em> the report.")</li>
    <li><strong>Perfect:</strong> Actions completed in the past with a connection to the present (e.g., "He <em>has finished</em> the report.")</li>
    <li><strong>Perfect Continuous:</strong> Actions that started in the past and continue into the present (e.g., "He <em>has been finishing</em> the report.")</li>
   </ul>

   <h4 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Past Tense</h4>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><strong>Indefinite (Simple):</strong> Completed actions in the past (e.g., "He <em>finished</em> the report.")</li>
    <li><strong>Continuous:</strong> Actions ongoing at a specific time in the past (e.g., "He <em>was finishing</em> the report.")</li>
    <li><strong>Perfect:</strong> Actions completed before another past action (e.g., "He <em>had finished</em> the report.")</li>
   </ul>

   <h4 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">Future Tense</h4>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><strong>Indefinite (Simple):</strong> Actions that will happen (e.g., "He <em>will finish</em> the report.")</li>
    <li><strong>Continuous:</strong> Actions that will be ongoing in the future.</li>
    <li><strong>Perfect:</strong> Actions that will be completed by a certain future time.</li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-[#2a2a2a]">
   <Settings className="w-5 h-5 text-[#4158D1]" />
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Interactive Controls</h2>
   </div>
   
   <div className="flex-1 overflow-y-auto pr-2 space-y-6">
   {/* Tense Slider */}
   <div className={`p-5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] shadow-sm flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
    <div className="flex items-center gap-2 mb-2">
    <Clock className="w-4 h-4 text-slate-500" />
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">Chronology Slider</h3>
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Move the slider to shift the sentence backwards and forwards in time.</p>
    
    <div className="relative px-2">
    <input 
     type="range" 
     min="0" 
     max={TENSES_TIMELINE.length - 1} 
     value={timelineIndex}
     onChange={(e) => setTimelineIndex(parseInt(e.target.value))}
     className={`w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4158D1] flex-col `}
    />
    <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
     <span>Past</span>
     <span>Present</span>
     <span>Future</span>
    </div>
    </div>
   </div>

   {/* Knowledge Check */}
   <div className={`p-5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] shadow-sm flex-col `}>
    <div className="flex items-center gap-2 mb-4">
    <Target className="w-4 h-4 text-slate-500" />
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">Knowledge Check</h3>
    </div>
    
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
        className="mt-1 w-4 h-4 text-[#4158D1] bg-slate-100 dark:bg-[#1c1b1b] border-slate-300 dark:border-[#2a2a2a] accent-[#4158D1]"
        checked={assessmentAnswers[qIdx] === oIdx}
        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
       />
       <span className="text-sm text-slate-700 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
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
     className="w-full mt-4 py-2.5 px-4 bg-[#4158D1] hover:bg-[#3144a5] disabled:bg-slate-200 disabled:text-slate-400 text-[#ffffff] rounded-lg font-medium transition-colors dark:disabled:bg-[#1c1b1b] dark:disabled:text-slate-600 shadow-sm"
     >
     Submit Evaluation
     </button>
    </div>
    ) : (
    <div className="text-center py-4">
     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#4158D1] dark:text-blue-400 mb-3 border border-blue-100 dark:border-blue-800/30">
     <span className="text-2xl font-bold">{calculateScore()}/{questions.length}</span>
     </div>
     <h3 className="text-base font-bold text-slate-900 dark:text-[#ffffff] mb-2">Assessment Complete</h3>
     <p className="text-sm text-slate-600 dark:text-[#71717a] mb-6 px-2">
     {calculateScore() === questions.length 
      ? "Perfect score! You've mastered conjunctions and tenses." 
      : "Good effort! Review the rules of tenses and correlative conjunctions to improve."}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
     }}
     className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-slate-100 dark:bg-[#1c1b1b] hover:bg-slate-200 dark:hover:bg-[#2a2a2a] text-slate-700 dark:text-[#a1a1aa] rounded-lg font-medium transition-colors border border-slate-200 dark:border-[#2a2a2a]"
     >
     Retry Lab
     </button>
    </div>
    )}
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative flex items-center justify-center p-8 overflow-hidden min-h-[500px] `}>
   <div className="absolute top-4 left-4 flex items-center gap-2">
   <Activity className="w-5 h-5 text-[#4158D1]" />
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">Tense Visualization</h2>
   </div>

   <div className="w-full max-w-xl text-center">
   <div className="p-8 md:p-12 rounded-2xl shadow-lg border border-slate-200 dark:border-[#2a2a2a] relative">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#4158D1] text-[#ffffff] px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-md whitespace-nowrap">
     {TENSES_TIMELINE[timelineIndex].tense}
    </div>
    
    <Clock className="w-12 h-12 text-[#4158D1] mx-auto mb-6 opacity-80" />
    
    <p className="text-2xl md:text-3xl font-medium text-slate-800 dark:text-[#ffffff] leading-tight min-h-[80px] flex items-center justify-center">
     "{TENSES_TIMELINE[timelineIndex].sentence}"
    </p>
    
    {/* Visual Timeline Marker */}
    <div className="mt-12 flex justify-between items-center relative">
     <div className="absolute left-0 right-0 h-1.5 bg-slate-100 dark:bg-[#1c1b1b] top-1/2 -translate-y-1/2 rounded-full overflow-hidden">
      <div 
      className="h-full bg-[#4158D1] transition-all duration-300"
      style={{ width: `${(timelineIndex / (TENSES_TIMELINE.length - 1)) * 100}%` }}
      />
     </div>
     
     {['Past', 'Present', 'Future'].map((label, idx) => {
      const isActive = 
      (idx === 0 && timelineIndex <= 2) || 
      (idx === 1 && timelineIndex >= 3 && timelineIndex <= 5) || 
      (idx === 2 && timelineIndex === 6);
      
      const isPassed = 
      (idx === 0 && timelineIndex > 2) ||
      (idx === 1 && timelineIndex > 5);

      return (
      <div key={label} className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${ isActive ? 'bg-[#4158D1] text-[#ffffff] shadow-md' : isPassed ? 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'bg-white dark:bg-[#1c1b1b] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-[#2a2a2a]' }`}>
       {label}
      </div>
      );
     })}
    </div>
   </div>
   
   <div className="mt-8 flex justify-center space-x-2">
    {TENSES_TIMELINE.map((_, idx) => (
    <div 
     key={idx} 
     className={`w-2 h-2 rounded-full transition-all duration-300 ${ idx === timelineIndex ? 'bg-[#4158D1] w-6' : 'bg-slate-300 dark:bg-slate-700' }`}
    />
    ))}
   </div>
   </div>
  </section>
  
  </main>
 </div>
 );
}
