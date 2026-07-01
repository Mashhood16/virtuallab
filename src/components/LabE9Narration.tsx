import { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, Mic, NotebookPen, History, FileText, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

const NARRATION_DATA = [
 {
 id: 1,
 direct: 'He said, "I am writing a letter now."',
 indirectStart: "He said that",
 options: ["he was writing a letter then.", "he is writing a letter now.", "I was writing a letter then."],
 correct: "he was writing a letter then.",
 rule: "Present Continuous -> Past Continuous. 'Now' changes to 'then'. 'I' changes to 'he'."
 },
 {
 id: 2,
 direct: 'She said to me, "You can do this."',
 indirectStart: "She told me that",
 options: ["I could do that.", "I can do this.", "you could do that."],
 correct: "I could do that.",
 rule: "'said to' becomes 'told'. 'can' becomes 'could'. 'this' becomes 'that'. 'you' (object) becomes 'I'."
 },
 {
 id: 3,
 direct: 'The teacher said, "The earth revolves around the sun."',
 indirectStart: "The teacher said that",
 options: ["the earth revolves around the sun.", "the earth revolved around the sun.", "the earth had revolved around the sun."],
 correct: "the earth revolves around the sun.",
 rule: "Universal truths do NOT change tense when converted to indirect speech."
 },
 {
 id: 4,
 direct: 'Ali said, "I have passed the examination."',
 indirectStart: "Ali said that",
 options: ["he had passed the examination.", "he has passed the examination.", "I had passed the examination."],
 correct: "he had passed the examination.",
 rule: "Present Perfect changes to Past Perfect ('have passed' -> 'had passed')."
 },
 {
 id: 5,
 direct: 'He said, "I will go to Lahore tomorrow."',
 indirectStart: "He said that",
 options: ["he would go to Lahore the next day.", "he will go to Lahore tomorrow.", "he would go to Lahore tomorrow."],
 correct: "he would go to Lahore the next day.",
 rule: "'will' becomes 'would'. 'tomorrow' becomes 'the next day'."
 }
];

export default function LabE9Narration({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentIndex, setCurrentIndex] = useState(0);
 const [selectedOption, setSelectedOption] = useState<string | null>(null);
 const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle');
 const [logs, setLogs] = useState<{ id: number; direct: string; indirect: string; status: 'success' | 'error' }[]>([]);

 // Assessment State
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const currentData = NARRATION_DATA[currentIndex];

 const handleSelect = (opt: string) => {
 setSelectedOption(opt);
 const isCorrect = opt === currentData.correct;
 setResult(isCorrect ? 'success' : 'error');

 if (isCorrect) {
  setLogs(prev => [
  { id: Date.now(), direct: currentData.direct, indirect: `${currentData.indirectStart} ${opt}`, status: 'success' as const },
  ...prev
  ].slice(0, 5)); // Keep last 5
 } else {
  setLogs(prev => [
  { id: Date.now(), direct: currentData.direct, indirect: `Attempted: ${opt}`, status: 'error' as const },
  ...prev
  ].slice(0, 5));
 }
 };

 const nextQuote = () => {
 setCurrentIndex((prev) => (prev + 1) % NARRATION_DATA.length);
 setSelectedOption(null);
 setResult('idle');
 };

 const assessmentQuestions = [
 {
  id: 1,
  q: "When converting to indirect speech, what does 'tomorrow' change to?",
  options: ["the previous day", "the next day", "that day"],
  correct: "the next day"
 },
 {
  id: 2,
  q: "If the reporting verb is in the past tense (e.g., 'said'), the simple present tense inside the quotes changes to:",
  options: ["present continuous", "past perfect", "simple past"],
  correct: "simple past"
 },
 {
  id: 3,
  q: "Convert: He said, \"Honesty is the best policy.\"",
  options: [
  "He said that honesty was the best policy.",
  "He said that honesty is the best policy.",
  "He said that honesty had been the best policy."
  ],
  correct: "He said that honesty is the best policy."
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
 <div className="flex flex-col min-h-screen bg-slate-50 dark:!bg-[#000000] font-sans text-slate-900 dark:text-[#a1a1aa]">
  <LabHeader title="Reporter's Notepad: Narration" variant="dark" onExit={onExit} />
  
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
   <div className="flex items-center gap-3 mb-4">
   <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">Narration Rules</h2>
   </div>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <p>
    <strong>Direct Speech</strong> quotes the exact words spoken by a person. It is enclosed in quotation marks.
    <br/><em className="text-slate-500 dark:text-[#71717a]">Example: She said, "I am happy."</em>
   </p>
   <p className="mt-4">
    <strong>Indirect Speech</strong> (or Reported Speech) conveys the meaning of what was said without using the exact words. Quotation marks are removed, and a conjunction like "that" is often used.
    <br/><em className="text-slate-500 dark:text-[#71717a]">Example: She said that she was happy.</em>
   </p>

   <h3 className="text-lg font-semibold text-slate-900 dark:text-[#ffffff] mt-6 mb-2">1. The SON Rule for Pronouns</h3>
   <p>Pronouns in the reported speech change according to the <strong>SON</strong> (Subject, Object, No change) rule:</p>
   <ul className="list-disc pl-5 space-y-2 mt-2">
    <li><strong>First Person (I, we, me, us, my, our):</strong> Changes according to the <strong>Subject</strong> of the reporting verb.
    <br/><span className="text-xs text-slate-500 dark:text-[#71717a]"><em>Direct: He said, "I like coffee." &rarr; Indirect: He said that he liked coffee.</em></span>
    </li>
    <li><strong>Second Person (you, your):</strong> Changes according to the <strong>Object</strong> of the reporting verb.
    <br/><span className="text-xs text-slate-500 dark:text-[#71717a]"><em>Direct: She said to me, "You are late." &rarr; Indirect: She told me that I was late.</em></span>
    </li>
    <li><strong>Third Person (he, she, it, they, his, her, their):</strong> <strong>No</strong> change.
    <br/><span className="text-xs text-slate-500 dark:text-[#71717a]"><em>Direct: I said, "He is busy." &rarr; Indirect: I said that he was busy.</em></span>
    </li>
   </ul>

   <h3 className="text-lg font-semibold text-slate-900 dark:text-[#ffffff] mt-6 mb-2">2. Tense Step-Backs</h3>
   <p>If the reporting verb (e.g., <em>said</em>, <em>told</em>) is in the past tense, the tense of the reported speech usually "steps back" one tense into the past:</p>
   <div className="overflow-x-auto mt-2">
    <table className="w-full text-left text-sm border-collapse">
    <thead>
     <tr className="border-b border-slate-200 dark:border-[#1c1b1b]">
     <th className="py-2">Direct Speech Tense</th>
     <th className="py-2">Indirect Speech Tense</th>
     </tr>
    </thead>
    <tbody className="divide-y divide-slate-200 dark:divide-[#1c1b1b]">
     <tr><td className="py-2">Simple Present</td><td className="py-2">Simple Past</td></tr>
     <tr><td className="py-2">Present Continuous</td><td className="py-2">Past Continuous</td></tr>
     <tr><td className="py-2">Present Perfect</td><td className="py-2">Past Perfect</td></tr>
     <tr><td className="py-2">Simple Past</td><td className="py-2">Past Perfect</td></tr>
     <tr><td className="py-2">will / can / may</td><td className="py-2">would / could / might</td></tr>
    </tbody>
    </table>
   </div>
   
   <div className={`bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-3 mt-4 text-sm rounded-r-md text-slate-800 dark:text-[#a1a1aa] flex-col `}>
    <strong>Exception:</strong> If the reported speech states a <strong>universal truth</strong>, <strong>habitual fact</strong>, or <strong>scientific principle</strong>, the tense does NOT change, even if the reporting verb is in the past tense.
    <br/><span className="text-xs"><em>Direct: The teacher said, "The earth revolves around the sun."<br/>Indirect: The teacher said that the earth revolves around the sun.</em></span>
   </div>

   <h3 className="text-lg font-semibold text-slate-900 dark:text-[#ffffff] mt-6 mb-2">3. Changes in Time and Place Words</h3>
   <p>Words expressing nearness in time and place change into words expressing distance:</p>
   <ul className="list-disc pl-5 space-y-1 mt-2">
    <li><strong>Now</strong> &rarr; Then</li>
    <li><strong>Here</strong> &rarr; There</li>
    <li><strong>Today</strong> &rarr; That day</li>
    <li><strong>Tomorrow</strong> &rarr; The next day</li>
    <li><strong>Yesterday</strong> &rarr; The previous day</li>
    <li><strong>This</strong> &rarr; That</li>
    <li><strong>These</strong> &rarr; Those</li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-3 mb-6">
   <Mic className="w-6 h-6 text-rose-500 dark:text-rose-400" />
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">Live Interview</h2>
   </div>

   <div className="flex-1 overflow-y-auto pr-2 space-y-6">
   <div className="space-y-2">
    <span className="text-sm font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-widest">Direct Quote</span>
    <div className={`text-xl font-serif font-medium text-slate-800 dark:text-[#ffffff] italic p-5 rounded-r-xl border-l-4 border-rose-400 shadow-sm flex-col `}>
    {currentData.direct}
    </div>
   </div>

   <div className="space-y-3">
    <span className="text-sm font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-widest">Select Completion</span>
    {currentData.options.map(opt => (
    <button
     key={opt}
     disabled={result === 'success'}
     onClick={() => handleSelect(opt)}
     className={`w-full p-4 rounded-xl text-left font-serif text-base transition-all border-2 ${ selectedOption === opt ? result === 'success' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md text-emerald-900 dark:text-emerald-100' : 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 shadow-md text-rose-900 dark:text-rose-100' : ' border-slate-200 dark:border-[#2a2a2a] hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-[#ffffff] hover:shadow-md' } disabled:opacity-75`}
    >
     {opt}
    </button>
    ))}
   </div>

   {result !== 'idle' && (
    <div className={`mt-6 p-5 rounded-xl animate-in fade-in zoom-in duration-300 ${ result === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50' : 'bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700/50' }`}>
    <div className="flex items-start gap-3">
     {result === 'success' ? <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />}
     <div>
     <p className={`font-bold ${result === 'success' ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
      {result === 'success' ? 'Published!' : 'Editor Rejected!'}
     </p>
     <p className={`text-sm mt-1 ${result === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
      {result === 'success' ? currentData.rule : 'Check the tense step-back and pronoun shifts.'}
     </p>
     </div>
    </div>
    {result === 'success' && (
     <button onClick={nextQuote} className={`mt-4 flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#000000] dark:bg-white text-white dark:text-black font-bold rounded-lg hover:bg-[#121212] dark:hover:bg-gray-200 transition-colors flex-col `}>
     Next Interview <ArrowRight className="w-4 h-4" />
     </button>
    )}
    </div>
   )}
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="absolute inset-0 bg-[#faf9f6] dark:bg-[#121212] overflow-y-auto">
   <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #94a3b8 31px, #94a3b8 32px)', backgroundPositionY: '32px' }}></div>
   <div className="absolute top-0 bottom-0 left-12 w-px bg-red-400 opacity-40 pointer-events-none"></div>

   <div className="relative z-10 pl-16 pr-8 py-8 space-y-10 min-h-full">
    {/* Current Draft */}
    <div>
    <div className="flex items-center gap-2 mb-4">
     <NotebookPen className="w-5 h-5 text-slate-500 dark:text-[#71717a]" />
     <span className="text-sm font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-widest">Reported Draft</span>
    </div>
    <div className="flex flex-wrap items-baseline gap-2 text-xl font-serif text-slate-800 dark:text-[#ffffff]">
     <span>{currentData.indirectStart}</span>
     <div className={`flex-1 min-w-[200px] border-b-2 border-dashed pb-1 transition-colors ${ selectedOption ? result === 'success' ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'border-rose-500 text-rose-700 dark:text-rose-400' : 'border-slate-400 text-slate-500 dark:text-[#a1a1aa]' }`}>
     {selectedOption || '...'}
     </div>
    </div>
    </div>

    {/* Logs */}
    <div className="space-y-4">
    <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-[#1c1b1b] pb-2">
     <History className="w-5 h-5 text-slate-500 dark:text-[#71717a]" />
     <span className="text-sm font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-widest">Editorial Log</span>
    </div>
    {logs.length === 0 ? (
     <p className="text-sm text-slate-500 dark:text-[#71717a] italic">No drafts submitted yet.</p>
    ) : (
     <div className="space-y-3">
     {logs.map(log => (
      <div key={log.id} className="text-sm p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]/50 shadow-sm">
      <div className="text-slate-500 dark:text-[#71717a] mb-1 line-clamp-1">{log.direct}</div>
      <div className={`font-medium flex items-center gap-2 ${log.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
       {log.status === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
       <span className="line-clamp-2">{log.indirect}</span>
      </div>
      </div>
     ))}
     </div>
    )}
    </div>

    {/* Knowledge Check */}
    <div className="space-y-4 pt-4">
    <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-[#1c1b1b] pb-2">
     <FileText className="w-5 h-5 text-slate-500 dark:text-[#71717a]" />
     <span className="text-sm font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-widest">Knowledge Check</span>
    </div>
    
    {assessmentQuestions.map((q, i) => (
     <div key={q.id} className="space-y-2 bg-white dark:bg-[#1c1b1b]/50 p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
     <p className="text-sm font-medium text-slate-800 dark:text-[#ffffff]">{i + 1}. {q.q}</p>
     <div className="space-y-2">
      {q.options.map(opt => {
      const isSelected = assessmentAnswers[q.id] === opt;
      const isCorrect = opt === q.correct;
      const showCorrect = assessmentSubmitted && isCorrect;
      const showWrong = assessmentSubmitted && isSelected && !isCorrect;

      return (
       <label key={opt} className={`flex items-start gap-2 text-sm p-3 rounded-lg border cursor-pointer transition-colors ${ showCorrect ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-200' : showWrong ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-700/50 text-rose-800 dark:text-rose-200' : isSelected ? 'bg-slate-50 dark:bg-[#2a2a2a] border-slate-300 dark:border-slate-500' : 'border-slate-200 dark:border-[#2a2a2a] hover:bg-slate-50 dark:hover:bg-[#2a2a2a]' }`}>
       <input
        type="radio"
        name={`q-${q.id}`}
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
     className="w-full mt-4 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:dark:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors shadow-sm disabled:shadow-none"
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
