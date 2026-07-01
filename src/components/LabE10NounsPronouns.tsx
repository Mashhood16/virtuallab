import { useState } from 'react';
import { BookOpen, Target, CheckCircle2, Check } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10NounsPronounsProps {
 onExit?: () => void;
}

interface DraggableWord {
 id: string;
 word: string;
 category: 'Concrete Noun' | 'Abstract Noun' | 'Collective Noun' | 'Personal Pronoun' | 'Relative Pronoun' | 'Reflexive Pronoun';
}

const WORDS: DraggableWord[] = [
 { id: 'w1', word: 'Courage', category: 'Abstract Noun' },
 { id: 'w2', word: 'Flock', category: 'Collective Noun' },
 { id: 'w3', word: 'Microscope', category: 'Concrete Noun' },
 { id: 'w4', word: 'Themselves', category: 'Reflexive Pronoun' },
 { id: 'w5', word: 'Who', category: 'Relative Pronoun' },
 { id: 'w6', word: 'They', category: 'Personal Pronoun' },
 { id: 'w7', word: 'Wisdom', category: 'Abstract Noun' },
 { id: 'w8', word: 'Committee', category: 'Collective Noun' }
];

const CATEGORIES = [
 'Concrete Noun', 'Abstract Noun', 'Collective Noun', 
 'Personal Pronoun', 'Relative Pronoun', 'Reflexive Pronoun'
];

export default function LabE10NounsPronouns({ onExit = () => {} }: LabE10NounsPronounsProps) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [placedWords, setPlacedWords] = useState<Record<string, string>>({});
 const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
 
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const questions = [
 {
  q: "Which of the following is an Abstract Noun?",
  options: ["Guitar", "Happiness", "Orchestra", "She"],
  correct: 1
 },
 {
  q: "Identify the Relative Pronoun in the sentence: 'The book that I read was fascinating.'",
  options: ["The", "I", "that", "was"],
  correct: 2
 },
 {
  q: "Which word is a Collective Noun?",
  options: ["Mountains", "Honesty", "Swarm", "Himself"],
  correct: 2
 },
 {
  q: "What type of pronoun is 'Themselves'?",
  options: ["Personal", "Reflexive", "Demonstrative", "Indefinite"],
  correct: 1
 }
 ];

 const handleCategoryClick = (category: string) => {
 if (selectedWordId) {
  setPlacedWords(prev => ({
  ...prev,
  [selectedWordId]: category
  }));
  setSelectedWordId(null);
 }
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
  <LabHeader title="Unit 1: The Identity Matrix (Nouns & Pronouns)" variant="dark" onExit={onExit} />
  
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

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg: overflow-y-auto lg:overflow-visible">
  
  {/* Window 1 (Theory) */}
  <section className={`rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <div className="flex items-center gap-3 mb-6">
   <div className={`p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex-col `}>
    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
   </div>
   <h2 className="text-xl font-semibold text-slate-900 dark:text-[#ffffff]">Theory</h2>
   </div>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] mb-2">Introduction to Nouns and Pronouns</h3>
   <p>Nouns and pronouns serve as the foundational building blocks of English grammar. Understanding their distinct subcategories is crucial for constructing clear, accurate, and descriptive sentences.</p>
   
   <h4 className="text-base font-bold text-slate-900 dark:text-[#ffffff] mt-4 mb-2">Types of Nouns</h4>
   <p>A noun is a word that names a person, place, thing, or idea.</p>
   <ul className="list-disc pl-5 space-y-2">
    <li><strong>Concrete Nouns:</strong> Physical entities that can be experienced through the five senses. Examples include <em>apple, microscope, table, ocean</em>.</li>
    <li><strong>Abstract Nouns:</strong> Ideas, concepts, qualities, or states of being that cannot be physically touched. Examples include <em>freedom, joy, courage, wisdom</em>.</li>
    <li><strong>Collective Nouns:</strong> Words that denote a group or collection of individuals or things acting as a single unit. Examples include <em>flock, committee, swarm, orchestra</em>.</li>
    <li><strong>Proper Nouns:</strong> Specific names of people, places, or brands, always capitalized (e.g., <em>London, Google</em>).</li>
   </ul>

   <h4 className="text-base font-bold text-slate-900 dark:text-[#ffffff] mt-4 mb-2">Types of Pronouns</h4>
   <p>A pronoun is a word that takes the place of one or more nouns to avoid repetition.</p>
   <ul className="list-disc pl-5 space-y-2">
    <li><strong>Personal Pronouns:</strong> Refer to specific people, animals, or things. They can act as subjects (<em>I, he, she, they</em>) or objects (<em>me, him, them</em>).</li>
    <li><strong>Relative Pronouns:</strong> Used to connect a clause or phrase to a noun or pronoun. They include words like <em>who, whom, whose, which, that</em>.</li>
    <li><strong>Reflexive Pronouns:</strong> Used when the subject and the object of a sentence are the same entity. They end in -self or -selves (e.g., <em>myself, themselves, herself</em>).</li>
    <li><strong>Demonstrative Pronouns:</strong> Point to specific things to indicate their proximity. Examples: <em>this, that, these, those</em>.</li>
    <li><strong>Indefinite Pronouns:</strong> Refer to non-specific people or things. Examples: <em>someone, anything, everybody</em>.</li>
   </ul>

   <h4 className="text-base font-bold text-slate-900 dark:text-[#ffffff] mt-4 mb-2">The Identity Matrix</h4>
   <p>In this lab, you will act as a classification engine, separating nouns and pronouns into their specific functional groups. Focus on the core meaning and contextual use of each word.</p>
   </div>
  </section>

  {/* Window 2 (Controls) */}
  <section className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex items-center gap-3 mb-6">
   <div className={`p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-col `}>
    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
   </div>
   <h2 className="text-xl font-semibold text-slate-900 dark:text-[#ffffff]">Controls & Quiz</h2>
   </div>

   <div className="flex flex-col gap-6 overflow-y-auto pr-2 flex-grow h-[500px]">
   {/* Word Pool block */}
   <div>
    <p className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-3">1. Select a word from the pool:</p>
    <div className="flex flex-wrap gap-2 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
    {WORDS.filter(w => !placedWords[w.id]).map(w => (
     <button
     key={w.id}
     onClick={() => setSelectedWordId(selectedWordId === w.id ? null : w.id)}
     className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${ selectedWordId === w.id ? 'bg-blue-600 text-white shadow-md scale-105' : ' text-slate-700 dark:text-[#ffffff] hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200 dark:border-[#2a2a2a]' }`}
     >
     {w.word}
     </button>
    ))}
    {Object.keys(placedWords).length === WORDS.length && (
     <div className="text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center gap-2">
     <CheckCircle2 className="w-4 h-4" /> All words classified!
     </div>
    )}
    </div>
   </div>

   {/* Knowledge Check block */}
   <div className="pt-6 border-t border-slate-200 dark:border-[#2a2a2a]">
    <p className="text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-4">2. Knowledge Check:</p>
    
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
        className="mt-1 w-4 h-4 text-blue-600 dark:text-blue-400 border-slate-300 dark:border-[#2a2a2a]"
        checked={assessmentAnswers[qIdx] === oIdx}
        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
       />
       <span className="text-sm text-slate-700 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-[#ffffff]">
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
     className={`w-full mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 disabled:text-slate-500 disabled:dark:text-slate-400 text-white rounded-lg font-medium transition-colors flex-col `}
     >
     Submit Evaluation
     </button>
    </div>
    ) : (
    <div className="text-center py-6">
     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
     <span className="text-2xl font-bold">{calculateScore()}/{questions.length}</span>
     </div>
     <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] mb-2">Assessment Complete</h3>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-6">
     {calculateScore() === questions.length 
      ? "Perfect score! You have mastered nouns and pronouns." 
      : "Good effort! Review the classifications and try again to improve your score."}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
      setPlacedWords({});
      setSelectedWordId(null);
     }}
     className="flex items-center justify-center gap-2 w-full py-2 px-4 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-[#ffffff] border border-slate-200 dark:border-[#2a2a2a] rounded-lg font-medium transition-colors"
     >
     Retry Lab
     </button>
    </div>
    )}
   </div>
   </div>
  </section>

  {/* Window 3 (Simulation) */}
  <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative flex items-center justify-center p-8 overflow-hidden min-h-[500px] `}>
   <div className="w-full h-full flex flex-col">
   <div className="text-center mb-6">
    <h3 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">Classification Matrix</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">Assign the selected word to its correct category.</p>
   </div>

   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 flex-grow content-start overflow-y-auto pr-2 pb-4">
    {CATEGORIES.map(cat => {
    const itemsInCat = WORDS.filter(w => placedWords[w.id] === cat);
    const isHovered = selectedWordId !== null;
    
    return (
     <button
     key={cat}
     onClick={() => handleCategoryClick(cat)}
     disabled={!selectedWordId}
     className={`p-4 rounded-xl border-2 text-left transition-all min-h-[120px] flex flex-col ${ isHovered ? 'border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 hover:border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 cursor-pointer shadow-sm' : 'border-slate-200 dark:border-[#2a2a2a] opacity-90 cursor-default' }`}
     >
     <h4 className="text-sm font-bold text-slate-500 dark:text-[#a1a1aa] uppercase tracking-wider mb-3">{cat}</h4>
     <div className="space-y-2 flex-grow">
      {itemsInCat.map(w => (
      <div key={w.id} className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-[#1c1b1b] p-2 rounded-lg border border-slate-100 dark:border-[#2a2a2a]">
       <span className={`font-medium ${w.category === cat ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400 line-through'}`}>
       {w.word}
       </span>
       {w.category === cat ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 ml-auto" /> : null}
      </div>
      ))}
     </div>
     </button>
    );
    })}
   </div>
   </div>
  </section>

  </main>
 </div>
 );
}
