import { useState } from 'react';
import { BookOpen, Target, Scissors, CheckCircle2, ChevronRight, XCircle, FileText, CheckSquare, Layers } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10PhrasesClausesProps {
 onExit?: () => void;
}

const DISSECTION_SENTENCES = [
 {
 text: "The student who studied hard passed the exam.",
 segments: [
  { text: "The student", type: "Noun Phrase", isClause: false },
  { text: "who studied hard", type: "Adjective Clause", isClause: true },
  { text: "passed the exam", type: "Verb Phrase", isClause: false }
 ],
 targetType: "Clause",
 correctIndex: 1
 },
 {
 text: "Running in the park is my favorite hobby.",
 segments: [
  { text: "Running in the park", type: "Gerund Phrase", isClause: false },
  { text: "is", type: "Verb", isClause: false },
  { text: "my favorite hobby", type: "Noun Phrase", isClause: false }
 ],
 targetType: "Gerund Phrase",
 correctIndex: 0
 },
 {
 text: "I believe that she will succeed.",
 segments: [
  { text: "I believe", type: "Independent Clause", isClause: true },
  { text: "that she will succeed", type: "Noun Clause", isClause: true }
 ],
 targetType: "Noun Clause",
 correctIndex: 1
 }
];

export default function LabE10PhrasesClauses({ onExit = () => {} }: LabE10PhrasesClausesProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentSentence, setCurrentSentence] = useState(0);
 const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
 const [hasAnswered, setHasAnswered] = useState(false);
 
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const questions = [
 {
  q: "What is the main difference between a phrase and a clause?",
  options: [
  "A phrase has a subject and a verb; a clause does not.",
  "A clause has a subject and a verb; a phrase does not.",
  "Phrases are always longer than clauses.",
  "Clauses cannot stand alone."
  ],
  correct: 1
 },
 {
  q: "Identify the Adverb Clause: 'She left the party because she was tired.'",
  options: [
  "She left",
  "left the party",
  "because she was tired",
  "was tired"
  ],
  correct: 2
 },
 {
  q: "Which of the following is a Prepositional Phrase?",
  options: ["Walking fast", "To the store", "She said", "Is going"],
  correct: 1
 }
 ];

 const handleSegmentSelect = (idx: number) => {
 if (hasAnswered) return;
 setSelectedSegment(idx);
 setHasAnswered(true);
 };

 const nextSentence = () => {
 setCurrentSentence((prev) => (prev + 1) % DISSECTION_SENTENCES.length);
 setSelectedSegment(null);
 setHasAnswered(false);
 };

 const calculateScore = () => {
 let score = 0;
 questions.forEach((q, idx) => {
  if (assessmentAnswers[idx] === q.correct) score++;
 });
 return score;
 };

 const currentData = DISSECTION_SENTENCES[currentSentence];

 return (
 <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#121212] font-sans text-slate-900 dark:text-[#ffffff]">
  <LabHeader title="Unit 6: Syntactic Blueprints (Phrases & Clauses)" variant="dark" onExit={onExit} />
  
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
   <BookOpen className="w-6 h-6 text-[#4158D1]" />
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">Theory: Phrases & Clauses</h2>
   </div>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mt-0 mb-2">The Building Blocks of Sentences</h3>
   <p>
    In English grammar, both phrases and clauses serve as the foundational syntactic structures that compose a sentence. Understanding their differences is crucial for mastering sentence structure, preventing grammatical errors like fragments and run-ons, and enhancing writing style.
   </p>

   <div className={`bg-slate-50 dark:bg-[#1c1b1b] p-4 rounded-lg border border-slate-200 dark:border-[#2a2a2a] my-4 flex-col `}>
    <h4 className="font-bold text-[#4158D1] dark:text-[#4158D1] mb-2 mt-0">The Golden Rule</h4>
    <p className="mb-0">
    A <strong>Clause</strong> must contain both a subject and a verb. A <strong>Phrase</strong> does NOT contain both a subject and a verb.
    </p>
   </div>

   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mt-6 mb-2">Types of Phrases</h3>
   <p>A phrase functions as a single part of speech within a sentence but lacks a subject-verb pair.</p>
   <ul className="list-disc pl-5 space-y-2">
    <li>
    <strong>Noun Phrase:</strong> Functions as a noun in the sentence. It consists of a noun and its modifiers.
    <br /><em>Example: The remarkably intelligent dog barked loudly.</em>
    </li>
    <li>
    <strong>Verb Phrase:</strong> Consists of a main verb and its helping verbs.
    <br /><em>Example: She <strong>has been reading</strong> for hours.</em>
    </li>
    <li>
    <strong>Prepositional Phrase:</strong> Begins with a preposition and ends with an object (noun/pronoun).
    <br /><em>Example: The keys are <strong>on the kitchen table</strong>.</em>
    </li>
    <li>
    <strong>Gerund Phrase:</strong> Begins with an -ing verb and functions as a noun.
    <br /><em>Example: <strong>Running in the park</strong> is relaxing.</em>
    </li>
   </ul>

   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mt-6 mb-2">Types of Clauses</h3>
   <p>Clauses contain both a subject and a verb. They are divided into two primary categories:</p>
   <ul className="list-disc pl-5 space-y-2">
    <li>
    <strong>Independent Clause:</strong> Expresses a complete thought and can stand alone as a sentence.
    <br /><em>Example: The sun set behind the mountains.</em>
    </li>
    <li>
    <strong>Dependent (Subordinate) Clause:</strong> Contains a subject and a verb but does not express a complete thought. It relies on an independent clause to form a complete sentence. Dependent clauses are further categorized by their function:
    <ul className="list-circle pl-5 mt-2 space-y-1">
     <li><strong>Noun Clause:</strong> Acts as a noun. <br /><em>Example: I wonder <strong>what she is thinking</strong>.</em></li>
     <li><strong>Adjective Clause:</strong> Acts as an adjective to modify a noun. Usually begins with relative pronouns (who, which, that). <br /><em>Example: The book <strong>that I borrowed</strong> is fascinating.</em></li>
     <li><strong>Adverb Clause:</strong> Acts as an adverb to modify a verb, adjective, or another adverb. Usually begins with subordinating conjunctions (because, although, when). <br /><em>Example: We stayed inside <strong>because it was raining</strong>.</em></li>
    </ul>
    </li>
   </ul>

   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mt-6 mb-2">Dissection Strategy</h3>
   <p>
    When analyzing a sentence, look for the verbs first. For every main verb, there is usually a corresponding subject. If a group of words contains this pairing, it's a clause. If it lacks this pairing, it's a phrase. Notice how clauses can be nested inside other clauses!
   </p>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-3 mb-6">
   <CheckSquare className="w-6 h-6 text-[#4158D1]" />
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">Controls & Assessment</h2>
   </div>

   <div className="flex-1 overflow-y-auto pr-2 space-y-6">
   
   {/* Sentence Navigator */}
   <div className={`w-full p-5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
    <h3 className="text-md font-bold text-slate-800 dark:text-[#ffffff] mb-3 flex items-center gap-2">
    <FileText className="w-4 h-4" /> Dissection Engine Controls
    </h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    Use the engine in the simulation window to interactively break down sentences and identify syntactic blueprints.
    </p>
    <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-slate-700 dark:text-[#a1a1aa]">
     Current Sentence: {currentSentence + 1} of {DISSECTION_SENTENCES.length}
    </span>
    <button
     onClick={nextSentence}
     className={`flex items-center gap-2 px-4 py-2 bg-[#4158D1] hover:bg-[#3144a5] text-white rounded-lg font-bold transition-colors shadow-sm text-sm flex-col `}
    >
     Skip / Next <ChevronRight className="w-4 h-4" />
    </button>
    </div>
   </div>

   {/* Assessment Section */}
   <div className="p-5 rounded-xl border border-slate-200 dark:border-[#2a2a2a]">
    <h3 className="text-md font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
    <Target className="w-4 h-4" /> Knowledge Check
    </h3>
    
    {!assessmentSubmitted ? (
    <div className="space-y-6">
     {questions.map((q, qIdx) => (
     <div key={qIdx} className="space-y-3">
      <p className="text-sm font-semibold text-slate-800 dark:text-[#ffffff]">
      {qIdx + 1}. {q.q}
      </p>
      <div className="space-y-2">
      {q.options.map((opt, oIdx) => (
       <label key={oIdx} className="flex items-start gap-3 cursor-pointer group">
       <input
        type="radio"
        name={`question-${qIdx}`}
        className="mt-1 w-4 h-4 text-[#4158D1] bg-slate-100 dark:bg-[#1c1b1b] border-slate-300 dark:border-[#2a2a2a] focus:ring-[#4158D1]"
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
     className="w-full mt-4 py-2.5 px-4 bg-[#4158D1] hover:bg-[#3144a5] disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white rounded-lg font-medium transition-colors shadow-sm"
     >
     Submit Evaluation
     </button>
    </div>
    ) : (
    <div className="text-center py-6">
     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#4158D1] dark:text-blue-400 mb-4 shadow-sm border border-blue-200 dark:border-blue-800/50">
     <span className="text-2xl font-bold">{calculateScore()}/{questions.length}</span>
     </div>
     <h4 className="text-md font-bold text-slate-900 dark:text-[#ffffff] mb-2">Assessment Complete</h4>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-6">
     {calculateScore() === questions.length 
      ? "Perfect score! You have mastered identifying phrases and clauses." 
      : "Good effort! Remember the golden rule: clauses have a subject and a verb."}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
     }}
     className="w-full py-2 px-4 bg-slate-100 dark:bg-[#1c1b1b] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-[#ffffff] border border-slate-200 dark:border-[#2a2a2a] rounded-lg font-medium transition-colors"
     >
     Retry Assessment
     </button>
    </div>
    )}
   </div>
   
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative flex flex-col p-6 overflow-hidden min-h-[500px] `}>
   <div className="flex items-center gap-3 mb-6">
   <Layers className="w-6 h-6 text-[#4158D1]" />
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">Dissection Engine</h2>
   </div>

   <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
   <div className="p-8 rounded-2xl border border-slate-200 dark:border-[#1c1b1b] w-full shadow-sm flex flex-col items-center">
    
    <div className="text-center mb-8">
    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#4158D1] dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
     Target: {currentData.targetType}
    </span>
    <p className="text-md font-medium text-slate-600 dark:text-[#a1a1aa]">
     Analyze the sentence below. Click on the segment that functions as a <strong className="text-slate-900 dark:text-[#ffffff]">{currentData.targetType}</strong>:
    </p>
    </div>
    
    <div className="bg-slate-50 dark:bg-[#1c1b1b] p-6 rounded-xl border border-slate-200 dark:border-[#2a2a2a] text-center w-full flex flex-wrap justify-center gap-3 shadow-inner">
    {currentData.segments.map((seg, idx) => {
     
     let bgClass = " hover:bg-blue-50 dark:hover:bg-blue-900/20 border-slate-200 dark:border-[#2a2a2a] text-slate-800 dark:text-[#ffffff] shadow-sm";
     
     if (hasAnswered) {
     if (idx === currentData.correctIndex) {
      bgClass = "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm";
     } else if (idx === selectedSegment) {
      bgClass = "bg-rose-100 dark:bg-rose-900/40 border-rose-500 text-rose-800 dark:text-rose-300 shadow-sm";
     } else {
      bgClass = "bg-slate-100 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] text-slate-500 dark:text-slate-600 opacity-50";
     }
     }

     return (
     <button
      key={idx}
      onClick={() => handleSegmentSelect(idx)}
      disabled={hasAnswered}
      className={`px-5 py-3 border-2 rounded-lg font-medium text-lg transition-all ${bgClass} transform ${!hasAnswered && 'hover:-translate-y-0.5'}`}
     >
      {seg.text}
     </button>
     );
    })}
    </div>

    {hasAnswered && (
    <div className={`mt-8 p-5 w-full rounded-xl border-2 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 ${ selectedSegment === currentData.correctIndex ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-200' : 'border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-200' }`}>
     {selectedSegment === currentData.correctIndex ? (
     <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
     ) : (
     <XCircle className="w-6 h-6 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
     )}
     <div>
     <h4 className="font-bold mb-1 text-lg">
      {selectedSegment === currentData.correctIndex ? "Correct Identification!" : "Incorrect Identification"}
     </h4>
     <p className="text-sm opacity-90 leading-relaxed">
      "<strong className="font-semibold">{currentData.segments[currentData.correctIndex].text}</strong>" is a {currentData.segments[currentData.correctIndex].type}.
      {currentData.segments[currentData.correctIndex].isClause 
      ? " It forms a clause because it contains both a subject and a verb." 
      : " It is a phrase because it lacks a subject-verb pairing."}
     </p>
     </div>
    </div>
    )}

    {hasAnswered && (
    <div className="mt-8">
     <button
     onClick={nextSentence}
     className="flex items-center gap-2 px-6 py-3 bg-[#4158D1] hover:bg-[#3144a5] text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
     >
     Analyze Next Sentence <ChevronRight className="w-5 h-5" />
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
