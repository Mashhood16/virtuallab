import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, BookOpen, Feather, Info, Target, RefreshCcw } from 'lucide-react';

type Mode = 'vocab' | 'stylistics';

const VOCAB_QUESTIONS = [
 {
 type: 'silent',
 question: "Which letter is silent in the word 'mnemonic'?",
 options: ['m', 'n', 'e', 'c'],
 answer: 'm',
 explanation: "The initial 'm' in 'mnemonic' is silent."
 },
 {
 type: 'idiom',
 question: "What does the idiom 'beat around the bush' mean?",
 options: ['To destroy nature', 'To avoid talking about what is important', 'To act impulsively', 'To go on a long hike'],
 answer: 'To avoid talking about what is important',
 explanation: "It means to delay or avoid getting to the point of a topic."
 },
 {
 type: 'connotation',
 question: "Which word has a more positive connotation for someone who asks many questions?",
 options: ['Nosy', 'Inquisitive', 'Prying', 'Interfering'],
 answer: 'Inquisitive',
 explanation: "'Inquisitive' implies a healthy desire to learn, while the others imply rude intrusion."
 },
 {
 type: 'transition',
 question: "Which transitional device fits best: 'The experiment failed; _______, we must rethink our hypothesis.'",
 options: ['furthermore', 'nevertheless', 'consequently', 'similarly'],
 answer: 'consequently',
 explanation: "'Consequently' indicates that rethinking the hypothesis is a result of the failure."
 }
];

const LITERARY_QUOTES = [
 { 
 quote: "All the world's a stage, and all the men and women merely players.", 
 author: "William Shakespeare", 
 device: "Metaphor" 
 },
 { 
 quote: "It was the best of times, it was the worst of times...", 
 author: "Charles Dickens", 
 device: "Anaphora" 
 },
 { 
 quote: "The pen is mightier than the sword.", 
 author: "Edward Bulwer-Lytton", 
 device: "Synecdoche" 
 },
 { 
 quote: "I wandered lonely as a cloud...", 
 author: "William Wordsworth", 
 device: "Simile" 
 },
 { 
 quote: "Water, water, everywhere, nor any drop to drink.", 
 author: "Samuel Taylor Coleridge", 
 device: "Irony" 
 },
 { 
 quote: "Parting is such sweet sorrow.", 
 author: "William Shakespeare", 
 device: "Oxymoron" 
 },
 { 
 quote: "The leaves danced in the wind.", 
 author: "Unknown", 
 device: "Personification" 
 },
 { 
 quote: "I've told you a million times!", 
 author: "Common phrase", 
 device: "Hyperbole" 
 }
];

const LITERARY_DEVICES = [
 'Simile', 'Metaphor', 'Personification', 'Hyperbole', 'Alliteration',
 'Oxymoron', 'Synecdoche', 'Anaphora', 'Irony', 'Paradox'
];

export default function LabE11VocabularyStylistics({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [mode, setMode] = useState<Mode>('vocab');
 
 // Vocab State
 const [vocabIndex, setVocabIndex] = useState(0);
 const [vocabFeedback, setVocabFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

 // Stylistics State
 const [quoteIndex, setQuoteIndex] = useState(0);
 const [stylisticsFeedback, setStylisticsFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

 const handleModeSwitch = (newMode: Mode) => {
 setMode(newMode);
 setVocabFeedback(null);
 setStylisticsFeedback(null);
 setVocabIndex(0);
 setQuoteIndex(0);
 };

 const handleVocabAnswer = (selectedOption: string) => {
 const q = VOCAB_QUESTIONS[vocabIndex];
 if (selectedOption === q.answer) {
  setVocabFeedback({ isCorrect: true, message: `Correct! ${q.explanation}` });
 } else {
  setVocabFeedback({ isCorrect: false, message: `Incorrect. The correct answer was "${q.answer}". ${q.explanation}` });
 }
 };

 const handleStylisticsAnswer = (selectedDevice: string) => {
 const q = LITERARY_QUOTES[quoteIndex];
 if (selectedDevice === q.device) {
  setStylisticsFeedback({ isCorrect: true, message: `Spot on! This quote is an excellent example of ${q.device}.` });
 } else {
  setStylisticsFeedback({ isCorrect: false, message: `Not quite. The correct literary device is ${q.device}.` });
 }
 };

 const nextVocab = () => {
 setVocabIndex((prev) => (prev + 1) % VOCAB_QUESTIONS.length);
 setVocabFeedback(null);
 };

 const nextQuote = () => {
 setQuoteIndex((prev) => (prev + 1) % LITERARY_QUOTES.length);
 setStylisticsFeedback(null);
 };

 return (
 <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] select-none">
  {/* Header */}
  <header className="flex items-center justify-between p-4 shadow-sm z-10 border-b border-slate-200 dark:border-[#1c1b1b]">
  <div className="flex items-center gap-3">
   {onExit && (
   <button onClick={onExit} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#1c1b1b] transition-colors whitespace-nowrap flex-shrink-0">
    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-[#a1a1aa]" />
   </button>
   )}
   <h1 className="text-lg md:text-xl font-bold text-emerald-700 dark:text-emerald-400">Lab E11: Vocabulary & Stylistics</h1>
  </div>
  </header>

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

  {/* Main Layout */}
  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 overflow-y-auto lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4">Vocabulary & Stylistics</h2>
   
   <p className="mb-4">Understanding vocabulary nuances and rhetorical stylistics is essential for advanced English comprehension and eloquent expression. This guide explores distinct facets of word choice and literary devices.</p>
   
   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mt-6 mb-2">1. Vocabulary Nuances</h3>
   <ul className="list-disc pl-5 space-y-2 mb-6">
    <li><strong>Silent Letters:</strong> Many English words contain letters that are not pronounced (e.g., the 'm' in <em>mnemonic</em>, 'k' in <em>knight</em>, 'b' in <em>subtle</em>).</li>
    <li><strong>Idioms:</strong> Phrases whose meanings cannot be deduced from the literal definitions of their words. Example: <em>"Beat around the bush"</em> means to avoid the main topic.</li>
    <li><strong>Connotation vs. Denotation:</strong> 
    <ul className="list-circle pl-5 mt-1">
     <li><em>Denotation:</em> The literal dictionary definition.</li>
     <li><em>Connotation:</em> The emotional or cultural associations a word carries. Example: <em>Inquisitive</em> (positive) vs. <em>Nosy</em> (negative).</li>
    </ul>
    </li>
    <li><strong>Transitional Devices:</strong> Words or phrases that bridge ideas. Example: <em>Furthermore</em> (addition), <em>Nevertheless</em> (contrast), <em>Consequently</em> (result).</li>
   </ul>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mt-6 mb-2">2. Literary Devices (Stylistics)</h3>
   <p className="mb-2">Stylistics involves analyzing how writers use language for effect. Key figures of speech include:</p>
   <ul className="list-disc pl-5 space-y-2">
    <li><strong>Simile:</strong> A comparison using "like" or "as". (<em>"I wandered lonely as a cloud."</em>)</li>
    <li><strong>Metaphor:</strong> A direct comparison asserting one thing is another. (<em>"All the world's a stage."</em>)</li>
    <li><strong>Personification:</strong> Giving human traits to non-human entities. (<em>"The leaves danced in the wind."</em>)</li>
    <li><strong>Hyperbole:</strong> Extreme exaggeration for emphasis. (<em>"I've told you a million times!"</em>)</li>
    <li><strong>Alliteration:</strong> Repetition of initial consonant sounds. (<em>"Peter Piper picked a peck..."</em>)</li>
    <li><strong>Oxymoron:</strong> Combining contradictory terms. (<em>"Parting is such sweet sorrow."</em>)</li>
    <li><strong>Synecdoche:</strong> Using a part to represent the whole. (<em>"The pen is mightier than the sword."</em> - 'pen' for writing, 'sword' for violence.)</li>
    <li><strong>Anaphora:</strong> Repetition of a word or phrase at the beginning of successive clauses. (<em>"It was the best of times, it was the worst of times."</em>)</li>
    <li><strong>Irony:</strong> A contrast between expectation and reality. (<em>"Water, water, everywhere, nor any drop to drink."</em>)</li>
    <li><strong>Paradox:</strong> A statement that appears contradictory but holds truth.</li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
   <Target className="w-5 h-5 text-emerald-500" /> Lab Modes
   </h2>
   <div className="flex flex-col gap-3">
   <button
    onClick={() => handleModeSwitch('vocab')}
    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${ mode === 'vocab' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 shadow-sm' : 'border-slate-200 dark:border-[#2a2a2a] hover:border-emerald-300 hover:bg-white dark:hover:bg-[#121212]' }`}
   >
    <div className="font-semibold text-slate-800 dark:text-[#ffffff] mb-1 flex items-center gap-2">
    <BookOpen className="w-4 h-4" /> Comprehensive Vocabulary
    </div>
    <div className="text-xs text-slate-500 dark:text-[#71717a]">Test dictionary skills, connotation vs denotation, idioms, and transitions.</div>
   </button>
   
   <button
    onClick={() => handleModeSwitch('stylistics')}
    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${ mode === 'stylistics' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 shadow-sm' : 'border-slate-200 dark:border-[#2a2a2a] hover:border-emerald-300 hover:bg-white dark:hover:bg-[#121212]' }`}
   >
    <div className="font-semibold text-slate-800 dark:text-[#ffffff] mb-1 flex items-center gap-2">
    <Feather className="w-4 h-4" /> Literary Devices
    </div>
    <div className="text-xs text-slate-500 dark:text-[#71717a]">Map poetic and rhetorical devices to famous literary quotes.</div>
   </button>
   </div>

   <div className={`bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-5 rounded-xl mt-auto flex-col `}>
   <h3 className="font-semibold flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-300">
    <Info className="w-4 h-4" /> Lab Instructions
   </h3>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
    {mode === 'vocab' 
    ? "Read the vocabulary question carefully. It may test your knowledge of silent letters, idiomatic expressions, nuanced connotations, or sentence flow using transitional devices. Select the best option."
    : "Analyze the provided literary quote. Determine which primary Figure of Speech or rhetorical device is being employed by the author to create stylistic effect, then select it from the grid."
    }
   </p>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className={`w-full max-w-2xl rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-[#1c1b1b] transition-all flex-col `}>
   
   {/* Vocab Mode */}
   {mode === 'vocab' && (
    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
    <div className="flex w-full justify-between items-center mb-8">
     <span className={`px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-full text-xs font-semibold uppercase tracking-wider flex-col `}>
     Drill: {VOCAB_QUESTIONS[vocabIndex].type}
     </span>
     <span className="text-sm font-medium text-slate-500 dark:text-[#71717a]">
     Question {vocabIndex + 1} of {VOCAB_QUESTIONS.length}
     </span>
    </div>
    
    <div className="text-xl md:text-2xl font-medium text-center mb-10 text-slate-800 dark:text-[#ffffff] min-h-[80px] flex items-center justify-center">
     {VOCAB_QUESTIONS[vocabIndex].question}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
     {VOCAB_QUESTIONS[vocabIndex].options.map(opt => (
      <button
      key={opt}
      onClick={() => handleVocabAnswer(opt)}
      disabled={vocabFeedback !== null}
      className="px-6 py-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a] hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-[#1c1b1b] dark:hover:border-emerald-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-[#ffffff] shadow-sm text-left flex items-center"
      >
      {opt}
      </button>
     ))}
    </div>

    {vocabFeedback && (
     <div className={`mt-8 w-full p-5 rounded-xl flex items-start gap-4 shadow-sm ${vocabFeedback.isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-300'} animate-in slide-in-from-bottom-4 duration-300`}>
     {vocabFeedback.isCorrect ? <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
     <div className="flex-1">
      <p className="font-medium text-lg mb-1">{vocabFeedback.isCorrect ? 'Correct!' : 'Incorrect'}</p>
      <p className="opacity-90">{vocabFeedback.message}</p>
      <button
      onClick={nextVocab}
      className="mt-4 flex items-center gap-2 text-sm font-bold bg-white/50 dark:bg-[#121212]/50 px-4 py-2 rounded-lg hover:bg-white/80 dark:hover:bg-[#121212]/80 transition-colors whitespace-nowrap flex-shrink-0"
      >
      Next Question <RefreshCcw className="w-4 h-4" />
      </button>
     </div>
     </div>
    )}
    </div>
   )}

   {/* Stylistics Mode */}
   {mode === 'stylistics' && (
    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
    <div className="flex w-full justify-between items-center mb-6">
     <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-semibold uppercase tracking-wider">
     Literary Devices
     </span>
     <span className="text-sm font-medium text-slate-500 dark:text-[#71717a]">
     Quote {quoteIndex + 1} of {LITERARY_QUOTES.length}
     </span>
    </div>
    
    <div className="w-full bg-slate-50 dark:bg-[#1c1b1b] border border-slate-200 dark:border-[#2a2a2a] rounded-2xl p-8 mb-8 relative shadow-inner">
     <div className="text-xl md:text-2xl font-serif text-center text-slate-800 dark:text-[#ffffff] mb-4 italic">
     "{LITERARY_QUOTES[quoteIndex].quote}"
     </div>
     <div className="text-center text-sm font-medium text-slate-500 dark:text-[#71717a] uppercase tracking-widest">
     — {LITERARY_QUOTES[quoteIndex].author}
     </div>
    </div>

    <div className="w-full">
     <label className="block text-sm font-medium text-slate-700 dark:text-[#a1a1aa] mb-4 text-center">
     Identify the primary literary device used:
     </label>
     <div className="flex flex-wrap justify-center gap-3">
     {LITERARY_DEVICES.map(device => (
      <button
      key={device}
      onClick={() => handleStylisticsAnswer(device)}
      disabled={stylisticsFeedback !== null}
      className="border border-slate-300 dark:border-[#2a2a2a] hover:border-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 dark:hover:border-indigo-500 text-slate-700 dark:text-[#a1a1aa] px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap flex-shrink-0"
      >
      {device}
      </button>
     ))}
     </div>
    </div>

    {stylisticsFeedback && (
     <div className={`mt-8 w-full p-5 rounded-xl flex items-start gap-4 shadow-sm ${stylisticsFeedback.isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-300'} animate-in slide-in-from-bottom-4 duration-300`}>
     {stylisticsFeedback.isCorrect ? <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
     <div className="flex-1">
      <p className="font-medium text-lg mb-1">{stylisticsFeedback.isCorrect ? 'Masterful Analysis!' : 'Keep Analyzing'}</p>
      <p className="opacity-90">{stylisticsFeedback.message}</p>
      <button
      onClick={nextQuote}
      className="mt-4 flex items-center gap-2 text-sm font-bold bg-white/50 dark:bg-[#121212]/50 px-4 py-2 rounded-lg hover:bg-white/80 dark:hover:bg-[#121212]/80 transition-colors whitespace-nowrap flex-shrink-0"
      >
      {stylisticsFeedback.isCorrect ? 'Analyze Next Quote' : 'Skip to Next'} <RefreshCcw className="w-4 h-4" />
      </button>
     </div>
     </div>
    )}
    </div>
   )}

   </div>
  </section>

  </main>
 </div>
 );
}

