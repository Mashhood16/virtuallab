import { useState } from 'react';
import { BookOpen, Target, PenTool, ChevronRight, Hash } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10VocabularyStylisticsProps {
 onExit?: () => void;
}

const STYLISTIC_CHALLENGES = [
 {
 type: "Figure of Speech",
 text: "The wind whispered through the dark and gloomy forest.",
 options: ["Simile", "Metaphor", "Personification", "Alliteration"],
 correct: 2,
 explanation: "Personification gives human qualities (whispering) to non-human things (the wind)."
 },
 {
 type: "Punctuation",
 text: "My favorite colors are blue, green, and red___",
 options: ["Comma (,)", "Semicolon (;)", "Colon (:)", "Period (.)"],
 correct: 3,
 explanation: "A period is required to end this declarative sentence."
 },
 {
 type: "Word Origins (Prefix)",
 text: "What does the prefix 'un-' mean in the word 'unbelievable'?",
 options: ["Again", "Not", "Before", "Too much"],
 correct: 1,
 explanation: "The prefix 'un-' means 'not' or the opposite of."
 },
 {
 type: "Connotation vs Denotation",
 text: "Which word has a more positive connotation?",
 options: ["Cheap", "Inexpensive", "Stingy", "Thrifty"],
 correct: 1,
 explanation: "'Inexpensive' implies good value without the negative aspect of low quality associated with 'cheap'."
 }
];

export default function LabE10VocabularyStylistics({ onExit = () => {} }: LabE10VocabularyStylisticsProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 
 const [currentChallenge, setCurrentChallenge] = useState(0);
 const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
 
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const questions = [
 {
  q: "Which figure of speech is: 'He is a shining star'?",
  options: ["Simile", "Metaphor", "Personification", "Oxymoron"],
  correct: 1
 },
 {
  q: "What punctuation is used to join two independent clauses without a conjunction?",
  options: ["Comma", "Semicolon", "Colon", "Hyphen"],
  correct: 1
 },
 {
  q: "Which of the following contains an Oxymoron?",
  options: [
  "As brave as a lion",
  "The stars danced playfully",
  "Deafening silence",
  "She sells seashells"
  ],
  correct: 2
 }
 ];

 const handleSelectAnswer = (idx: number) => {
 if (selectedAnswer === null) {
  setSelectedAnswer(idx);
 }
 };

 const nextChallenge = () => {
 setCurrentChallenge((prev) => (prev + 1) % STYLISTIC_CHALLENGES.length);
 setSelectedAnswer(null);
 };

 const calculateScore = () => {
 let score = 0;
 questions.forEach((q, idx) => {
  if (assessmentAnswers[idx] === q.correct) score++;
 });
 return score;
 };

 return (
 <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#000000] text-slate-900 dark:text-[#ffffff]">
  <LabHeader title="Unit 8: Vocabulary & Stylistics" onExit={onExit} />
  
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
   <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
    <BookOpen className="w-5 h-5 text-[#4158D1]" />
    Vocabulary & Stylistics
   </h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
    <p>Stylistics is a branch of applied linguistics concerned with the study of style in texts. In English grammar and composition, understanding stylistics allows you to make deliberate choices about words, sentence structures, and figures of speech to achieve a specific effect on the reader.</p>
    
    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-4 mb-2">1. Figures of Speech</h3>
    <p>Figures of speech enhance meaning by taking language beyond its literal definition:</p>
    <ul className="list-disc pl-5 space-y-1 mb-4">
     <li><strong>Simile:</strong> A comparison between two unlike things using "like" or "as" (e.g., <em>"as brave as a lion"</em>).</li>
     <li><strong>Metaphor:</strong> A direct comparison between two unlike things without using "like" or "as" (e.g., <em>"he is a shining star"</em>).</li>
     <li><strong>Personification:</strong> Attributing human characteristics to non-human entities or inanimate objects (e.g., <em>"the wind whispered"</em>).</li>
     <li><strong>Alliteration:</strong> The repetition of initial consonant sounds in neighboring words (e.g., <em>"she sells seashells"</em>).</li>
     <li><strong>Oxymoron:</strong> A figure of speech that combines contradictory terms (e.g., <em>"deafening silence"</em>, <em>"jumbo shrimp"</em>).</li>
    </ul>

    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-4 mb-2">2. Vocabulary Choices</h3>
    <p>Words carry both literal meanings and associated feelings:</p>
    <ul className="list-disc pl-5 space-y-1 mb-4">
     <li><strong>Denotation:</strong> The literal, dictionary definition of a word.</li>
     <li><strong>Connotation:</strong> The emotional, cultural, or social associations a word carries. For example, "inexpensive" has a positive connotation (good value), while "cheap" has a negative connotation (poor quality).</li>
    </ul>

    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-4 mb-2">3. Morphology (Word Origins)</h3>
    <p>Understanding word parts helps deduce the meaning of unfamiliar vocabulary:</p>
    <ul className="list-disc pl-5 space-y-1 mb-4">
     <li><strong>Prefixes:</strong> Added to the beginning of a root word to alter its meaning (e.g., <em>un-</em> meaning "not", as in <em>unbelievable</em>).</li>
     <li><strong>Suffixes:</strong> Added to the end of a word to change its grammatical function or meaning (e.g., <em>-able</em> meaning "capable of").</li>
     <li><strong>Root Words:</strong> The core meaning of a word, often derived from Latin or Greek.</li>
    </ul>

    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-4 mb-2">4. Punctuation for Style</h3>
    <p>Punctuation guides the reader and affects the pacing of the text:</p>
    <ul className="list-disc pl-5 space-y-1 mb-4">
     <li><strong>Period (.):</strong> Ends a declarative sentence, establishing a firm stop.</li>
     <li><strong>Comma (,):</strong> Indicates a brief pause, separates items in a list, or joins clauses with a conjunction.</li>
     <li><strong>Semicolon (;):</strong> Links two related independent clauses without a conjunction, showing a close relationship between the ideas.</li>
     <li><strong>Colon (:):</strong> Introduces a list, a quotation, or an explanation, drawing attention to what follows.</li>
    </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
    <PenTool className="w-5 h-5 text-[#4158D1]" />
    Stylist's Workbench
   </h2>
   
   <div className="flex-1 flex flex-col">
   <div className="mb-4 flex justify-between items-center">
    <span className="text-sm font-medium text-slate-600 dark:text-[#a1a1aa]">
    Challenge {currentChallenge + 1} of {STYLISTIC_CHALLENGES.length}
    </span>
    <span className={`px-3 py-1 bg-[#4158D1]/10 text-[#4158D1] dark:text-[#889cf6] text-xs font-bold rounded-full flex-col `}>
    {STYLISTIC_CHALLENGES[currentChallenge].type}
    </span>
   </div>

   <div className={`p-6 rounded-xl border border-slate-200 dark:border-[#2a2a2a] text-center mb-6 shadow-sm flex-col `}>
    <p className="text-lg font-medium text-slate-900 dark:text-white leading-relaxed italic">
    "{STYLISTIC_CHALLENGES[currentChallenge].text}"
    </p>
   </div>

   <div className="grid grid-cols-2 gap-3 flex-1 mb-6">
    {STYLISTIC_CHALLENGES[currentChallenge].options.map((opt, idx) => {
    const isSelected = selectedAnswer === idx;
    const isAnswered = selectedAnswer !== null;
    const isCorrect = idx === STYLISTIC_CHALLENGES[currentChallenge].correct;

    return (
     <button
     key={idx}
     onClick={() => handleSelectAnswer(idx)}
     disabled={isAnswered}
     className={`p-3 rounded-xl font-medium text-sm transition-all border-2 flex items-center justify-center ${ !isAnswered ? 'border-slate-200 dark:border-[#2a2a2a] hover:border-[#4158D1] hover:bg-[#4158D1]/5 dark:hover:bg-[#4158D1]/20 text-slate-700 dark:text-[#a1a1aa]' : isSelected ? isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' : isCorrect ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300 opacity-70' : 'border-slate-200 dark:border-[#2a2a2a] text-slate-400 dark:text-slate-600 opacity-40' }`}
     >
     {opt}
     </button>
    );
    })}
   </div>

   {selectedAnswer !== null && (
    <div className="mt-auto flex flex-col gap-4">
    <div className={`p-4 rounded-lg text-sm font-medium flex gap-3 ${ selectedAnswer === STYLISTIC_CHALLENGES[currentChallenge].correct ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200' : ' border border-slate-200 dark:border-[#2a2a2a] text-slate-800 dark:text-[#a1a1aa]' }`}>
     <Hash className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-70" />
     <p>{STYLISTIC_CHALLENGES[currentChallenge].explanation}</p>
    </div>
    <button
     onClick={nextChallenge}
     className={`flex items-center justify-center gap-2 w-full py-3 bg-[#4158D1] hover:bg-[#3144a5] text-white rounded-lg font-bold transition-colors shadow-sm flex-col `}
    >
     Next Challenge <ChevronRight className="w-5 h-5" />
    </button>
    </div>
   )}
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="w-full max-w-md h-full flex flex-col">
   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-300 dark:border-[#1c1b1b]">
    <Target className="w-6 h-6 text-[#4158D1]" />
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Knowledge Check</h2>
   </div>

   <div className="flex-1 overflow-y-auto pr-2">
    {!assessmentSubmitted ? (
    <div className="space-y-6">
     {questions.map((q, qIdx) => (
     <div key={qIdx} className="space-y-3">
      <p className="text-sm font-medium text-slate-800 dark:text-white">
      {qIdx + 1}. {q.q}
      </p>
      <div className="space-y-2">
      {q.options.map((opt, oIdx) => (
       <label key={oIdx} className="flex items-start gap-3 cursor-pointer group">
       <input
        type="radio"
        name={`question-${qIdx}`}
        className="mt-1 w-4 h-4 text-[#4158D1] border-slate-300 dark:border-[#2a2a2a]"
        checked={assessmentAnswers[qIdx] === oIdx}
        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
       />
       <span className="text-sm text-slate-700 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-white">
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
     className="w-full mt-6 py-3 px-4 bg-[#4158D1] hover:bg-[#3144a5] disabled:bg-slate-300 disabled:dark:bg-slate-800 disabled:text-slate-500 disabled:dark:text-slate-500 text-white rounded-lg font-bold transition-colors"
     >
     Submit Evaluation
     </button>
    </div>
    ) : (
    <div className="text-center py-8 h-full flex flex-col justify-center">
     <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#4158D1]/10 text-[#4158D1] mb-6 mx-auto">
     <span className="text-4xl font-bold">{calculateScore()}/{questions.length}</span>
     </div>
     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Assessment Complete</h3>
     <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">
     {calculateScore() === questions.length 
      ? "Perfect score! Your stylistic skills are top-notch." 
      : "Good effort! Review the figures of speech to improve."}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
     }}
     className="flex items-center justify-center gap-2 w-full py-3 px-4 hover:bg-slate-50 dark:hover:bg-[#1c1b1b] text-slate-800 dark:text-white border border-slate-200 dark:border-[#2a2a2a] rounded-lg font-bold transition-colors"
     >
     Retry Assessment
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

