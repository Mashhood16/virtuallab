import { useState } from 'react';
import { BookOpen, Target, Mic, CheckCircle2, ChevronRight } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10SentenceNarrationProps {
 onExit?: () => void;
}

const NARRATION_SCENARIOS = [
 {
 speaker: "Mayor",
 direct: "I will build a new hospital tomorrow.",
 parts: [
  { id: 'p1', text: "The mayor said that", type: "intro" },
  { id: 'p2', text: "he", type: "pronoun" },
  { id: 'p3', text: "would build", type: "verb" },
  { id: 'p4', text: "a new hospital", type: "object" },
  { id: 'p5', text: "the next day.", type: "time" }
 ],
 incorrectOptions: [
  { id: 'i1', text: "I", type: "pronoun" },
  { id: 'i2', text: "will build", type: "verb" },
  { id: 'i3', text: "tomorrow.", type: "time" }
 ]
 },
 {
 speaker: "Detective",
 direct: "Where are you going?",
 parts: [
  { id: 'p1', text: "The detective asked", type: "intro" },
  { id: 'p2', text: "where", type: "question_word" },
  { id: 'p3', text: "I", type: "pronoun" },
  { id: 'p4', text: "was going.", type: "verb" }
 ],
 incorrectOptions: [
  { id: 'i1', text: "where was I going.", type: "verb" },
  { id: 'i2', text: "where are you going.", type: "verb" },
  { id: 'i3', text: "if", type: "question_word" }
 ]
 },
 {
 speaker: "Teacher",
 direct: "Did you finish your homework?",
 parts: [
  { id: 'p1', text: "The teacher asked", type: "intro" },
  { id: 'p2', text: "if", type: "question_word" },
  { id: 'p3', text: "I", type: "pronoun" },
  { id: 'p4', text: "had finished", type: "verb" },
  { id: 'p5', text: "my homework.", type: "object" }
 ],
 incorrectOptions: [
  { id: 'i1', text: "did I finish", type: "verb" },
  { id: 'i2', text: "finished", type: "verb" },
  { id: 'i3', text: "your homework.", type: "object" },
  { id: 'i4', text: "that", type: "intro" }
 ]
 }
];

export default function LabE10SentenceNarration({ onExit = () => {} }: LabE10SentenceNarrationProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 
 const [currentScenario, setCurrentScenario] = useState(0);
 const [constructed, setConstructed] = useState<any[]>([]);
 const [availablePieces, setAvailablePieces] = useState(() => {
 const scene = NARRATION_SCENARIOS[0];
 return [...scene.parts, ...scene.incorrectOptions].sort(() => Math.random() - 0.5);
 });

 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const questions = [
 {
  q: "Which type of sentence contains two independent clauses joined by a conjunction?",
  options: ["Simple", "Complex", "Compound", "Compound-Complex"],
  correct: 2
 },
 {
  q: "How does the time word 'yesterday' change in indirect speech?",
  options: ["the previous day", "the next day", "today", "yesterday"],
  correct: 0
 },
 {
  q: "Convert to indirect speech: She asked, 'Do you like tea?'",
  options: [
  "She asked do I like tea.",
  "She asked if I liked tea.",
  "She asked that I liked tea.",
  "She asked if I like tea."
  ],
  correct: 1
 }
 ];

 const handleSelectPiece = (piece: any) => {
 setConstructed(prev => [...prev, piece]);
 setAvailablePieces(prev => prev.filter(p => p.id !== piece.id));
 };

 const handleRemovePiece = (piece: any) => {
 setConstructed(prev => prev.filter(p => p.id !== piece.id));
 setAvailablePieces(prev => [...prev, piece]);
 };

 const checkConstruction = () => {
 const correctOrder = NARRATION_SCENARIOS[currentScenario].parts;
 if (constructed.length !== correctOrder.length) return false;
 
 for (let i = 0; i < constructed.length; i++) {
  if (constructed[i].id !== correctOrder[i].id) return false;
 }
 return true;
 };

 const nextScenario = () => {
 const nextIdx = (currentScenario + 1) % NARRATION_SCENARIOS.length;
 setCurrentScenario(nextIdx);
 setConstructed([]);
 const scene = NARRATION_SCENARIOS[nextIdx];
 setAvailablePieces([...scene.parts, ...scene.incorrectOptions].sort(() => Math.random() - 0.5));
 };

 const calculateScore = () => {
 let score = 0;
 questions.forEach((q, idx) => {
  if (assessmentAnswers[idx] === q.correct) score++;
 });
 return score;
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#000000] font-sans text-slate-900 dark:text-[#ffffff]">
  <LabHeader title="Unit 7: The Reporter's Desk (Narration)" variant="dark" onExit={onExit} />
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#2a2a2a]'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center  'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#2a2a2a]'}`}
   >Lab</button>
  </div>

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg: overflow-y-auto lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-4">
   <BookOpen className="w-5 h-5 text-[#4158D1] dark:text-[#6b81fb]" />
   <h2 className="text-lg font-bold text-slate-900 dark:text-[#ffffff]">Grammar Theory</h2>
   </div>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[calc(100vh-250px)] lg:h-[calc(100vh-180px)] pr-2">
   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-3">1. Types of Sentences</h3>
   <p>In English grammar, sentences are categorized by their structure. Understanding these structures is crucial before learning how to report speech:</p>
   <ul className="list-disc pl-5 space-y-2 mb-6">
    <li><strong>Simple Sentence:</strong> Contains a single independent clause (one subject and one predicate) and expresses a complete thought. <br/><em className="text-slate-500 dark:text-[#71717a]">Example: The reporter took notes.</em></li>
    <li><strong>Compound Sentence:</strong> Contains two or more independent clauses joined by a coordinating conjunction (for, and, nor, but, or, yet, so) or a semicolon. <br/><em className="text-slate-500 dark:text-[#71717a]">Example: The mayor spoke, and the reporter took notes.</em></li>
    <li><strong>Complex Sentence:</strong> Contains one independent clause and at least one dependent (subordinate) clause. <br/><em className="text-slate-500 dark:text-[#71717a]">Example: Because the mayor spoke quickly, the reporter had to write fast.</em></li>
    <li><strong>Compound-Complex Sentence:</strong> Contains two or more independent clauses and at least one dependent clause.</li>
   </ul>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-3">2. Direct vs. Indirect Speech (Narration)</h3>
   <p><strong>Direct Speech</strong> quotes the exact words spoken. They are enclosed in quotation marks. <br/><em className="text-slate-500 dark:text-[#71717a]">Example: She said, "I am reading a book."</em></p>
   <p className="mt-2 mb-4"><strong>Indirect Speech (Reported Speech)</strong> conveys the meaning of what was said without using the exact words. Quotation marks are removed, and a conjunction (like 'that') is often used.</p>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-3">3. Rules for Converting to Indirect Speech</h3>
   
   <h4 className="font-medium text-slate-700 dark:text-[#ffffff] mt-4 mb-2">A. Tense Changes (Backshifting)</h4>
   <p>If the reporting verb (e.g., said, asked) is in the past tense, the tense in the reported clause generally shifts back one step in the past:</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><strong>Simple Present ➔ Simple Past</strong> (e.g., "I walk" ➔ he walked)</li>
    <li><strong>Present Continuous ➔ Past Continuous</strong> (e.g., "I am walking" ➔ he was walking)</li>
    <li><strong>Present Perfect ➔ Past Perfect</strong> (e.g., "I have walked" ➔ he had walked)</li>
    <li><strong>Simple Past ➔ Past Perfect</strong> (e.g., "I walked" ➔ he had walked)</li>
    <li><strong>Modals:</strong> will ➔ would, can ➔ could, may ➔ might, must ➔ had to.</li>
   </ul>

   <h4 className="font-medium text-slate-700 dark:text-[#ffffff] mt-4 mb-2">B. Pronoun Changes</h4>
   <p>Pronouns change to reflect the perspective of the reporter rather than the original speaker.</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li>First-person pronouns (I, we, my) change to match the subject of the reporting verb (he, she, they, his/her).</li>
    <li>Second-person pronouns (you, your) change to match the object of the reporting verb (me, him, her, us).</li>
   </ul>

   <h4 className="font-medium text-slate-700 dark:text-[#ffffff] mt-4 mb-2">C. Time and Place Expressions</h4>
   <p>Words indicating proximity in time and space shift to indicate distance:</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li>Now ➔ Then / At that time</li>
    <li>Today ➔ That day</li>
    <li>Tomorrow ➔ The next day / The following day</li>
    <li>Yesterday ➔ The previous day / The day before</li>
    <li>Here ➔ There</li>
    <li>This / These ➔ That / Those</li>
   </ul>

   <h4 className="font-medium text-slate-700 dark:text-[#ffffff] mt-4 mb-2">D. Reporting Questions</h4>
   <p>When converting questions to indirect speech:</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li>Change the reporting verb to "asked", "inquired", or "wondered".</li>
    <li><strong>Yes/No Questions:</strong> Use "if" or "whether" as the connector.</li>
    <li><strong>WH- Questions:</strong> Keep the original question word (who, what, where, when, why, how) as the connector.</li>
    <li><strong>Word Order:</strong> Change the sentence structure from interrogative (verb-subject) back to declarative (subject-verb). Do not use a question mark.</li>
    <li><em className="text-slate-500 dark:text-[#71717a]">Example (WH): He asked, "Where are you going?" ➔ He asked where I was going.</em></li>
    <li><em className="text-slate-500 dark:text-[#71717a]">Example (Y/N): She asked, "Do you like tea?" ➔ She asked if I liked tea.</em></li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-3 mb-4">
   <Target className="w-5 h-5 text-[#4158D1] dark:text-[#6b81fb]" />
   <h2 className="text-lg font-bold text-slate-900 dark:text-[#ffffff]">Word Bank & Assessment</h2>
   </div>

   <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 h-[calc(100vh-250px)] lg:h-[calc(100vh-180px)]">
   {/* Word Bank */}
   <div className={`w-full p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-shrink-0 flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
    <h3 className="text-sm font-bold text-slate-700 dark:text-[#a1a1aa] mb-3">Available Words (Click to add)</h3>
    <div className="flex flex-wrap gap-2">
    {availablePieces.map((piece: any, idx) => (
     <button
     key={idx}
     onClick={() => handleSelectPiece(piece)}
     className={`px-3 py-2 bg-[#4158D1]/10 dark:bg-[#4158D1]/20 border border-[#4158D1]/30 dark:border-[#4158D1]/40 text-[#4158D1] dark:text-[#6b81fb] rounded-lg text-sm font-medium hover:bg-[#4158D1]/20 dark:hover:bg-[#4158D1]/40 transition-colors flex-col `}
     >
     {piece.text}
     </button>
    ))}
    {availablePieces.length === 0 && (
     <span className="text-sm text-slate-400 dark:text-[#71717a] italic">All words used.</span>
    )}
    </div>
   </div>

   {/* Knowledge Check */}
   <div className={`p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a] flex-1 flex-col `}>
    <h3 className="text-sm font-bold text-slate-700 dark:text-[#a1a1aa] mb-3">Knowledge Check</h3>
    {!assessmentSubmitted ? (
    <div className="space-y-4">
     {questions.map((q, qIdx) => (
     <div key={qIdx} className="space-y-2">
      <p className="text-sm font-medium text-slate-800 dark:text-[#ffffff]">
      {qIdx + 1}. {q.q}
      </p>
      <div className="space-y-1">
      {q.options.map((opt, oIdx) => (
       <label key={oIdx} className="flex items-start gap-2 cursor-pointer group">
       <input
        type="radio"
        name={`question-${qIdx}`}
        className="mt-1 text-[#4158D1] focus:ring-[#4158D1] bg-white dark:bg-[#1c1b1b] border-slate-300 dark:border-[#2a2a2a]"
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
     className="w-full mt-2 py-2 px-4 bg-[#4158D1] hover:bg-[#3144a8] disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors text-sm"
     >
     Submit Assessment
     </button>
    </div>
    ) : (
    <div className="text-center py-4">
     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4158D1]/10 dark:bg-[#4158D1]/20 text-[#4158D1] dark:text-[#6b81fb] mb-3">
     <span className="text-2xl font-bold">{calculateScore()}/{questions.length}</span>
     </div>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
     {calculateScore() === questions.length 
      ? "Perfect score! You are a master reporter." 
      : "Good effort! Review the theory and try again."}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
     }}
     className="w-full py-2 px-4 bg-slate-100 dark:bg-[#2a2a2a] hover:bg-slate-200 dark:hover:bg-[#3a3a3a] text-slate-700 dark:text-[#ffffff] rounded-lg font-medium transition-colors text-sm"
     >
     Retry Assessment
     </button>
    </div>
    )}
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative flex items-center justify-center p-4 md:p-8 overflow-hidden min-h-[500px] `}>
   <div className="w-full max-w-lg rounded-xl shadow-lg border border-slate-200 dark:border-[#2a2a2a] p-6 flex flex-col gap-8">
   
   {/* Speaker Bubble */}
   <div className="flex gap-4 items-start">
    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
    <Mic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    </div>
    <div className="bg-slate-100 dark:bg-[#1c1b1b] p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-[#2a2a2a] w-full">
    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#71717a] block mb-1">
     {NARRATION_SCENARIOS[currentScenario].speaker}
    </span>
    <p className="text-lg font-bold text-slate-900 dark:text-[#ffffff]">
     "{NARRATION_SCENARIOS[currentScenario].direct}"
    </p>
    </div>
   </div>

   {/* Reporter Notepad */}
   <div className="flex gap-4 items-start">
    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
    <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
    </div>
    <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-2xl rounded-tl-none border border-yellow-200 dark:border-yellow-900/30 min-h-[120px] w-full">
    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#71717a] block mb-3">
     Your Report (Indirect Speech)
    </span>
    <div className="flex flex-wrap gap-2">
     {constructed.map((piece, idx) => (
     <button
      key={idx}
      onClick={() => handleRemovePiece(piece)}
      className="px-3 py-1.5 bg-slate-700 dark:bg-[#2a2a2a] text-white rounded-lg text-sm shadow hover:bg-slate-800 dark:hover:bg-[#1c1b1b] transition-colors"
      title="Click to remove"
     >
      {piece.text}
     </button>
     ))}
     {constructed.length === 0 && (
     <span className="text-sm text-slate-400 dark:text-[#71717a] italic mt-1">Select words from the Word Bank to write your report...</span>
     )}
    </div>
    </div>
   </div>

   {checkConstruction() && (
    <div className="mt-2 p-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 flex flex-col items-center gap-3">
    <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
     <CheckCircle2 className="w-5 h-5" /> Perfect Report!
    </div>
    <button
     onClick={nextScenario}
     className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
    >
     Next Scenario <ChevronRight className="w-4 h-4" />
    </button>
    </div>
   )}
   </div>
  </section>
  </main>
 </div>
 );
}

