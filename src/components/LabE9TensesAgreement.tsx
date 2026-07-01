import { useState } from 'react';
import { 
 Clock, CheckCircle, AlertTriangle, Activity, 
 ShieldCheck, Zap, 
 BookOpen, Target, Settings, GitCommit
} from 'lucide-react';
import LabHeader from './LabHeader';

interface Anomaly {
 id: number;
 sentenceStart: string;
 sentenceEnd: string;
 baseVerb: string;
 expectedTimeframe: string;
 expectedAspect: string;
 expectedSubjectNumber: string;
 correctVerb: string;
 hint: string;
}

const anomalies: Anomaly[] = [
 {
 id: 1,
 sentenceStart: "Neither the captain nor the crew members ",
 sentenceEnd: " the coordinates when the system crashed.",
 baseVerb: "calculate",
 expectedTimeframe: "Past",
 expectedAspect: "Continuous",
 expectedSubjectNumber: "Plural",
 correctVerb: "were calculating",
 hint: "An ongoing action interrupted by another action in the past. Proximity rule: 'crew members' is plural."
 },
 {
 id: 2,
 sentenceStart: "The fleet of starships ",
 sentenceEnd: " in orbit for three weeks by tomorrow.",
 baseVerb: "wait",
 expectedTimeframe: "Future",
 expectedAspect: "Perfect Continuous",
 expectedSubjectNumber: "Singular",
 correctVerb: "will have been waiting",
 hint: "Action continuing up to a point in the future. 'Fleet' acts as a single entity."
 },
 {
 id: 3,
 sentenceStart: "Everybody in the station ",
 sentenceEnd: " a daily ration of water.",
 baseVerb: "receive",
 expectedTimeframe: "Present",
 expectedAspect: "Simple",
 expectedSubjectNumber: "Singular",
 correctVerb: "receives",
 hint: "'Everybody' is an indefinite pronoun and takes a singular verb. General fact -> Present Simple."
 },
 {
 id: 4,
 sentenceStart: "By the time the rescue team arrives, the survivors ",
 sentenceEnd: " all their supplies.",
 baseVerb: "consume",
 expectedTimeframe: "Future",
 expectedAspect: "Perfect",
 expectedSubjectNumber: "Plural",
 correctVerb: "will have consumed",
 hint: "Action completed before a future moment. 'Survivors' is plural."
 }
];

export default function LabE9TensesAgreement({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentAnomalyIdx, setCurrentAnomalyIdx] = useState(0);
 const [timeframe, setTimeframe] = useState("Present");
 const [aspect, setAspect] = useState("Simple");
 const [subjectNumber, setSubjectNumber] = useState("Singular");
 const [simulationStatus, setSimulationStatus] = useState<'idle' | 'success' | 'error'>('idle');
 const [logs, setLogs] = useState<{ id: number; message: string; timestamp: string; type: 'success' | 'error' }[]>([]);
 
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const currentAnomaly = anomalies[currentAnomalyIdx];

 const handleFixTimeline = () => {
 if (!currentAnomaly) return;

 if (
  timeframe === currentAnomaly.expectedTimeframe &&
  aspect === currentAnomaly.expectedAspect &&
  subjectNumber === currentAnomaly.expectedSubjectNumber
 ) {
  setSimulationStatus('success');
  addLog(`Stabilized Timeline #${currentAnomaly.id}: Used ${timeframe} ${aspect} (${subjectNumber}) -> "${currentAnomaly.correctVerb}"`, 'success');
  setTimeout(() => {
  if (currentAnomalyIdx < anomalies.length - 1) {
   setCurrentAnomalyIdx(prev => prev + 1);
   setSimulationStatus('idle');
   setTimeframe("Present");
   setAspect("Simple");
   setSubjectNumber("Singular");
  } else {
   setCurrentAnomalyIdx(prev => prev + 1);
  }
  }, 2000);
 } else {
  setSimulationStatus('error');
  addLog(`Failed to stabilize Timeline #${currentAnomaly.id}: Invalid parameters selected.`, 'error');
 }
 };

 const addLog = (message: string, type: 'success' | 'error') => {
 setLogs(prev => [{
  id: Date.now(),
  message,
  timestamp: new Date().toLocaleTimeString(),
  type
 }, ...prev].slice(0, 5));
 };

 const questions = [
 {
  q: "Which sentence demonstrates the correct application of the 'Proximity Rule'?",
  options: [
  "Either the commander or the officers is going to the surface.",
  "Either the commander or the officers are going to the surface.",
  "Either the officers or the commander are going to the surface."
  ],
  correct: 1
 },
 {
  q: "Select the correct tense for an action that started in the past, continues into the present, and emphasizes duration:",
  options: [
  "Present Perfect",
  "Present Continuous",
  "Present Perfect Continuous"
  ],
  correct: 2
 },
 {
  q: "Identify the correct verb agreement: 'The jury ___ finally reached a verdict.'",
  options: [
  "have",
  "has",
  "are"
  ],
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
 <div className="min-h-screen bg-slate-50 dark:!bg-[#000000] flex flex-col font-sans">
  <LabHeader title="Tenses & Subject-Verb Agreement" onExit={onExit} />
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative">
   <button 
   onClick={() => setActiveMobileTab('theory')}
   className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-gray-700'}`}
  >
   Theory
  </button>
   <button 
   onClick={() => setActiveMobileTab('lab')}
   className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-gray-700'}`}
  >Lab</button>
  </div>

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-[#2a2a2a]">
   <div className={`p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex-col `}>
    <BookOpen className="w-6 h-6" />
   </div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">Theory Matrix</h2>
   </div>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] flex items-center gap-2 mb-4">
    <Clock className="w-5 h-5 text-indigo-500" />
    The Tense Timeline
   </h3>
   <p>Tenses establish when an action occurs. They consist of a <strong>Timeframe</strong> (Past, Present, Future) and an <strong>Aspect</strong> (Simple, Continuous, Perfect, Perfect Continuous).</p>
   
   <ul className="space-y-4 my-4">
    <li>
    <strong className="text-slate-800 dark:text-[#ffffff]">Simple:</strong> General facts, habitual actions, or completed actions.
    <br/><em className="text-slate-500 dark:text-slate-400">Example: She writes code.</em>
    </li>
    <li>
    <strong className="text-slate-800 dark:text-[#ffffff]">Continuous (Progressive):</strong> Ongoing actions happening at a specific time.
    <br/><em className="text-slate-500 dark:text-slate-400">Example: She is writing code right now.</em>
    </li>
    <li>
    <strong className="text-slate-800 dark:text-[#ffffff]">Perfect:</strong> Actions completed before a certain point in time.
    <br/><em className="text-slate-500 dark:text-slate-400">Example: She has written the code.</em>
    </li>
    <li>
    <strong className="text-slate-800 dark:text-[#ffffff]">Perfect Continuous:</strong> Ongoing actions leading up to a specific point.
    <br/><em className="text-slate-500 dark:text-slate-400">Example: She has been writing code for two hours.</em>
    </li>
   </ul>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] flex items-center gap-2 mt-8 mb-4">
    <GitCommit className="w-5 h-5 text-emerald-500" />
    Subject-Verb Agreement
   </h3>
   <p>The verb must always align with its subject in number (singular or plural) and person.</p>
   
   <div className="space-y-4 mt-4">
    <div className={`bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex-col `}>
    <h4 className="font-medium text-emerald-800 dark:text-emerald-400 mb-1">1. The Proximity Rule</h4>
    <p className="text-sm">When subjects are joined by <em>or</em>, <em>nor</em>, <em>either...or</em>, or <em>neither...nor</em>, the verb agrees with the subject closest to it.</p>
    <p className={`text-sm font-mono mt-2 bg-white dark:bg-[#1a1a1a] p-2 rounded text-slate-600 dark:text-[#a1a1aa] flex-col `}>Neither the captain nor the <span className="text-emerald-600 dark:text-emerald-400 font-bold">officers are</span> present.</p>
    </div>
    
    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
    <h4 className="font-medium text-indigo-800 dark:text-indigo-400 mb-1">2. Collective Nouns</h4>
    <p className="text-sm">Nouns like <em>team, jury, fleet, family</em> take a singular verb when acting as a single unit, but a plural verb if members act individually.</p>
    </div>

    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
    <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-1">3. Indefinite Pronouns</h4>
    <p className="text-sm">Pronouns like <em>everyone, nobody, somebody, anything</em> are always singular.</p>
    </div>
   </div>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-[#2a2a2a]">
   <div className="flex items-center gap-3">
    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
    <Settings className="w-6 h-6" />
    </div>
    <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">Controls & Assessment</h2>
   </div>
   </div>

   <div className="overflow-y-auto h-[500px] pr-2 space-y-8">
   {/* Controls */}
   <div className="space-y-6">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Activity className="w-5 h-5 text-indigo-500" />
    Timeline Parameters
    </h3>
    <div className="space-y-5">
    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#a1a1aa] mb-2">Subject Number</label>
     <div className="flex bg-slate-200 dark:bg-[#121212] p-1 rounded-lg">
     {['Singular', 'Plural'].map(num => (
      <button
      key={num}
      onClick={() => setSubjectNumber(num)}
      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${ subjectNumber === num ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-[#a1a1aa] hover:text-slate-900 dark:hover:text-slate-200' }`}
      >
      {num}
      </button>
     ))}
     </div>
    </div>

    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#a1a1aa] mb-2">Timeframe</label>
     <div className="flex bg-slate-200 dark:bg-[#121212] p-1 rounded-lg">
     {['Past', 'Present', 'Future'].map(tf => (
      <button
      key={tf}
      onClick={() => setTimeframe(tf)}
      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${ timeframe === tf ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-[#a1a1aa] hover:text-slate-900 dark:hover:text-slate-200' }`}
      >
      {tf}
      </button>
     ))}
     </div>
    </div>

    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#a1a1aa] mb-2">Aspect</label>
     <div className="grid grid-cols-2 gap-2">
     {['Simple', 'Continuous', 'Perfect', 'Perfect Continuous'].map(asp => (
      <button
      key={asp}
      onClick={() => setAspect(asp)}
      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${ aspect === asp ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'border-slate-300 dark:border-[#2a2a2a] text-slate-600 dark:text-[#a1a1aa] hover:border-slate-400 dark:hover:border-slate-600' }`}
      >
      {asp}
      </button>
     ))}
     </div>
    </div>
    </div>
    
    <button
    onClick={handleFixTimeline}
    disabled={simulationStatus === 'success' || currentAnomalyIdx >= anomalies.length}
    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${ simulationStatus === 'success' || currentAnomalyIdx >= anomalies.length ? 'bg-slate-300 dark:bg-[#2a2a2a] text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg' }`}
    >
    <Zap className="w-5 h-5" /> Inject Correct Conjugation
    </button>
   </div>

   {/* Assessment Section */}
   <div className="border-t border-slate-200 dark:border-[#2a2a2a] pt-6">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] flex items-center gap-2 mb-6">
    <Target className="w-5 h-5 text-rose-500" />
    Knowledge Assessment
    </h3>
    
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
        className="mt-1 w-4 h-4 text-rose-600 bg-slate-100 border-slate-300 focus:ring-rose-500 dark:bg-[#121212] dark:border-[#2a2a2a]"
        checked={assessmentAnswers[qIdx] === oIdx}
        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
       />
       <span className="text-sm text-slate-600 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-slate-200">
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
     className="w-full py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 dark:disabled:bg-[#2a2a2a] disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
     >
     Submit Evaluation
     </button>
    </div>
    ) : (
    <div className="text-center py-6">
     <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 mb-4">
     <span className="text-3xl font-bold">{calculateScore()}/{questions.length}</span>
     </div>
     <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">Assessment Complete</h3>
     <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">
     {calculateScore() === questions.length ? 'Perfect mastery of the temporal matrix!' : 'Review the theory matrix and try again.'}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
     }}
     className="text-sm text-rose-600 dark:text-rose-400 font-medium hover:underline"
     >
     Retake Assessment
     </button>
    </div>
    )}
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="w-full h-full flex flex-col">
   <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Activity className="w-6 h-6 text-indigo-500" />
    Simulation View
    </h2>
    <div className="text-sm font-medium text-slate-500 px-3 py-1 rounded-full border border-slate-200 dark:border-[#1c1b1b]">
    Anomaly {Math.min(currentAnomalyIdx + 1, anomalies.length)} of {anomalies.length}
    </div>
   </div>

   <div className="flex-1 flex flex-col justify-center space-y-6">
    {currentAnomalyIdx < anomalies.length ? (
    <div className="bg-[#121212] rounded-xl p-6 border border-neutral-800 shadow-inner relative overflow-hidden">
     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-50 animate-pulse"></div>
     <h3 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
     <AlertTriangle className="w-4 h-4" /> Temporal Anomaly Detected
     </h3>
     <p className="text-lg text-slate-300 font-mono leading-relaxed">
     {currentAnomaly.sentenceStart}
     <span className="inline-block px-2 py-1 bg-black text-slate-400 border border-neutral-700 rounded mx-1">
      [{currentAnomaly.baseVerb}]
     </span>
     {currentAnomaly.sentenceEnd}
     </p>
     
     {simulationStatus === 'error' && (
     <div className="mt-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-300 text-sm">
      <strong>Hint:</strong> {currentAnomaly.hint}
     </div>
     )}
     {simulationStatus === 'success' && (
     <div className="mt-4 p-3 bg-emerald-900/30 border border-emerald-800/50 rounded-lg text-emerald-400 text-sm font-mono flex items-center gap-2">
      <CheckCircle className="w-4 h-4" /> Timeline Stabilized: "{currentAnomaly.correctVerb}"
     </div>
     )}
    </div>
    ) : (
    <div className="text-center p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
     <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
     <h3 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] mb-2">All Timelines Stable</h3>
     <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">You have successfully corrected all temporal anomalies.</p>
     <button 
     onClick={() => {
      setCurrentAnomalyIdx(0);
      setSimulationStatus('idle');
      setLogs([]);
     }}
     className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
     >
     Restart Simulation
     </button>
    </div>
    )}

    {/* Logs Panel */}
    <div className="bg-[#121212] rounded-xl border border-neutral-800 p-4 mt-auto h-48 flex flex-col">
    <div className="flex items-center gap-2 mb-3">
     <Activity className="w-4 h-4 text-slate-400" />
     <h3 className="text-sm font-bold text-slate-300">System Logs</h3>
    </div>
    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
     {logs.length === 0 ? (
     <p className="text-slate-500 text-xs italic">Awaiting stabilization attempts...</p>
     ) : (
     logs.map(log => (
      <div key={log.id} className="flex gap-3 text-xs">
      <span className="text-slate-600 font-mono shrink-0">[{log.timestamp}]</span>
      <span className={log.type === 'success' ? 'text-emerald-400' : 'text-red-400'}>
       {log.message}
      </span>
      </div>
     ))
     )}
    </div>
    </div>
   </div>
   </div>
  </section>

  </main>
 </div>
 );
}
