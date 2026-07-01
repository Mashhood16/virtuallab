import type { DragEvent } from 'react';
import { useState, } from 'react';
import { ArrowLeft, RefreshCw, BookOpen, Type, Target, ShieldCheck, AlertCircle , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

interface WordItem {
 id: string;
 word: string;
 category: string;
}

const INITIAL_WORDS: WordItem[] = [
 { id: 'w1', word: 'happiness', category: 'abstract' },
 { id: 'w2', word: 'team', category: 'collective' },
 { id: 'w3', word: 'London', category: 'proper' },
 { id: 'w4', word: 'dog', category: 'common' },
 { id: 'w5', word: 'she', category: 'pronoun' },
 { id: 'w6', word: 'bunch', category: 'collective' },
 { id: 'w7', word: 'courage', category: 'abstract' },
 { id: 'w8', word: 'river', category: 'common' },
 { id: 'w9', word: 'Ganges', category: 'proper' },
 { id: 'w10', word: 'they', category: 'pronoun' },
];

const CATEGORIES = [
 { id: 'common', label: 'Common', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-blue-300 dark:border-blue-700' },
 { id: 'proper', label: 'Proper', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 border-green-300 dark:border-green-700' },
 { id: 'abstract', label: 'Abstract', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700' },
 { id: 'collective', label: 'Collective', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 border-orange-300 dark:border-orange-700' },
 { id: 'pronoun', label: 'Pronoun', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200 border-pink-300 dark:border-pink-700' },
];

interface ArticleQuestion {
 id: string;
 textParts: string[]; // e.g. ["I saw ", " elephant at ", " zoo."]
 answers: string[]; // e.g. ["an", "the"]
}

const ARTICLE_QUESTIONS: ArticleQuestion[] = [
 { id: 'a1', textParts: ["I saw ", " elephant at ", " zoo."], answers: ["an", "the"] },
 { id: 'a2', textParts: ["She is ", " honest girl."], answers: ["an"] },
 { id: 'a3', textParts: ["He bought ", " new car."], answers: ["a"] },
 { id: 'a4', textParts: ["", " sun rises in ", " east."], answers: ["the", "the"] },
];

export default function LabE6NounsPronouns({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [activeTab, setActiveTab] = useState<'nouns' | 'articles'>('nouns');

 // Nouns State
 const [unassignedWords, setUnassignedWords] = useState<WordItem[]>(INITIAL_WORDS);
 const [assignedWords, setAssignedWords] = useState<Record<string, WordItem[]>>({
 common: [], proper: [], abstract: [], collective: [], pronoun: []
 });
 const [draggedWord, setDraggedWord] = useState<WordItem | null>(null);
 const [nounScore, setNounScore] = useState<number | null>(null);
 const [selectedWord, setSelectedWord] = useState<WordItem | null>(null); // For click fallback

 // Articles State
 const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
 const [articleScore, setArticleScore] = useState<number | null>(null);

 // --- Nouns Logic ---
 const handleDragStart = (e: DragEvent<HTMLDivElement>, word: WordItem, source: string) => {
 setDraggedWord(word);
 e.dataTransfer.setData('text/plain', source);
 };

 const handleDrop = (e: DragEvent<HTMLDivElement>, targetCategory: string) => {
 e.preventDefault();
 if (!draggedWord) return;
 
 const source = e.dataTransfer.getData('text/plain');
 moveWord(draggedWord, source, targetCategory);
 setDraggedWord(null);
 };

 const moveWord = (word: WordItem, source: string, targetCategory: string) => {
 if (source === targetCategory) return;

 if (source === 'unassigned') {
  setUnassignedWords(prev => prev.filter(w => w.id !== word.id));
 } else {
  setAssignedWords(prev => ({
  ...prev,
  [source]: prev[source].filter(w => w.id !== word.id)
  }));
 }

 if (targetCategory === 'unassigned') {
  setUnassignedWords(prev => [...prev, word]);
 } else {
  setAssignedWords(prev => ({
  ...prev,
  [targetCategory]: [...prev[targetCategory], word]
  }));
 }
 setNounScore(null);
 setSelectedWord(null);
 };

 const handleWordClick = (word: WordItem, source: string) => {
 if (selectedWord?.id === word.id) {
  setSelectedWord(null);
 } else {
  setSelectedWord({ ...word, category: source }); // category here temporarily holds the source location
 }
 };

 const handleBinClick = (targetCategory: string) => {
 if (selectedWord) {
  moveWord(selectedWord, selectedWord.category, targetCategory);
 }
 };

 const checkNouns = () => {
 let correct = 0;
 Object.entries(assignedWords).forEach(([cat, words]) => {
  words.forEach(w => {
  if (w.category === cat) correct++;
  });
 });
 setNounScore(correct);
 };

 const resetNouns = () => {
 setUnassignedWords(INITIAL_WORDS);
 setAssignedWords({ common: [], proper: [], abstract: [], collective: [], pronoun: [] });
 setNounScore(null);
 setSelectedWord(null);
 };

 // --- Articles Logic ---
 const handleArticleSelect = (qId: string, blankIndex: number, article: string) => {
 setUserAnswers(prev => {
  const currentQAnswers = prev[qId] ? [...prev[qId]] : new Array(ARTICLE_QUESTIONS.find(q => q.id === qId)?.answers.length).fill('');
  currentQAnswers[blankIndex] = article;
  return { ...prev, [qId]: currentQAnswers };
 });
 setArticleScore(null);
 };

 const checkArticles = () => {
 let correct = 0;
 let totalBlanks = 0;
 ARTICLE_QUESTIONS.forEach(q => {
  q.answers.forEach((ans, i) => {
  totalBlanks++;
  if (userAnswers[q.id] && userAnswers[q.id][i] === ans) {
   correct++;
  }
  });
 });
 setArticleScore(correct);
 };

 const resetArticles = () => {
 setUserAnswers({});
 setArticleScore(null);
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950 font-sans select-none text-slate-900 dark:text-[#ffffff]">
  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 shadow-sm border-b border-slate-200 dark:border-neutral-900 z-10">
  <div className="flex items-center space-x-3">
   <button
   onClick={onExit}
   className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
   >
   <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-[#71717a]" />
   </button>
   <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
   Nouns, Pronouns & Articles
   </h1>
  </div>
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 ml-4 dark:bg-[#121212]"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  <div className="flex overflow-x-auto hide-scrollbar bg-slate-100 dark:bg-[#121212] rounded-lg p-1">
   <button
   onClick={() => setActiveTab('nouns')}
   className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${ activeTab === 'nouns' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300' }`}
   >
   Word Categories
   </button>
   <button
   onClick={() => setActiveTab('articles')}
   className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${ activeTab === 'articles' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300' }`}
   >
   Articles (a, an, the)
   </button>
  </div>
  </div>

  {/* Main Content */}
  <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden lg:overflow-y-auto">
  
  {/* Left Column - Controls & Instructions */}
  <div className="w-full lg:w-1/3 p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-neutral-900 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] z-0">
   <div className="space-y-6">
   <div>
    <h2 className="text-2xl font-bold mb-2 flex items-center">
    {activeTab === 'nouns' ? (
     <><Target className="w-6 h-6 mr-2 text-indigo-500" /> Categorizer</>
    ) : (
     <><BookOpen className="w-6 h-6 mr-2 text-indigo-500" /> Article Fill</>
    )}
    </h2>
    <p className="text-slate-600 dark:text-[#71717a]">
    {activeTab === 'nouns' 
     ? "Drag words into their correct grammatical buckets. If you're on a mobile device, you can click a word to select it, then click a bucket to drop it."
     : "Choose the correct article (a, an, the) for each blank in the sentences below."}
    </p>
   </div>

   <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
    <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 flex items-center mb-2">
    <AlertCircle className="w-4 h-4 mr-2" /> Quick Rules
    </h3>
    {activeTab === 'nouns' ? (
    <ul className="text-sm text-indigo-700 dark:text-indigo-400 space-y-1 list-disc pl-5">
     <li><strong>Proper:</strong> Specific names (Capitalized).</li>
     <li><strong>Common:</strong> General items or things.</li>
     <li><strong>Abstract:</strong> Ideas or feelings you can't touch.</li>
     <li><strong>Collective:</strong> Groups of things.</li>
     <li><strong>Pronoun:</strong> Words taking place of nouns (he, she).</li>
    </ul>
    ) : (
    <ul className="text-sm text-indigo-700 dark:text-indigo-400 space-y-1 list-disc pl-5">
     <li><strong>A:</strong> Before consonant sounds.</li>
     <li><strong>An:</strong> Before vowel sounds.</li>
     <li><strong>The:</strong> For specific or unique nouns.</li>
    </ul>
    )}
   </div>

   <div className="pt-6 border-t border-slate-200 dark:border-neutral-900 space-y-4">
    {activeTab === 'nouns' ? (
    <>
     <button
     onClick={checkNouns}
     className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
     >
     <ShieldCheck className="w-5 h-5 mr-2" /> Check Categories
     </button>
     <button
     onClick={resetNouns}
     className="w-full py-3 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-[#121212] dark:hover:bg-slate-700 text-slate-800 dark:text-[#ffffff] rounded-xl font-semibold transition-colors flex items-center justify-center whitespace-nowrap flex-shrink-0"
     >
     <RefreshCw className="w-5 h-5 mr-2" /> Reset
     </button>
     {nounScore !== null && (
     <div className={`p-4 rounded-xl text-center font-bold text-lg ${ nounScore === INITIAL_WORDS.length ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' }`}>
      Score: {nounScore} / {INITIAL_WORDS.length}
     </div>
     )}
    </>
    ) : (
    <>
     <button
     onClick={checkArticles}
     className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
     >
     <ShieldCheck className="w-5 h-5 mr-2" /> Check Articles
     </button>
     <button
     onClick={resetArticles}
     className="w-full py-3 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-[#121212] dark:hover:bg-slate-700 text-slate-800 dark:text-[#ffffff] rounded-xl font-semibold transition-colors flex items-center justify-center whitespace-nowrap flex-shrink-0"
     >
     <RefreshCw className="w-5 h-5 mr-2" /> Reset
     </button>
     {articleScore !== null && (
     <div className={`p-4 rounded-xl text-center font-bold text-lg ${ articleScore === ARTICLE_QUESTIONS.reduce((acc, q) => acc + q.answers.length, 0) ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' }`}>
      Score: {articleScore} / {ARTICLE_QUESTIONS.reduce((acc, q) => acc + q.answers.length, 0)}
     </div>
     )}
    </>
    )}
   </div>
   </div>
  </div>

  {/* Right Column - Interactive Canvas */}
  <div className="w-full lg:w-2/3 p-4 sm:p-8 lg:overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col relative">
   
   {activeTab === 'nouns' ? (
   <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
    {/* Unassigned Words Pool */}
    <div 
    className="mb-8 p-6 bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-neutral-900 min-h-[150px]"
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => handleDrop(e, 'unassigned')}
    onClick={() => handleBinClick('unassigned')}
    >
    <h3 className="text-lg font-semibold mb-4 flex items-center text-slate-700 dark:text-[#a1a1aa]">
     <Type className="w-5 h-5 mr-2" /> Word Pool (Drag from here)
    </h3>
    <div className="flex flex-wrap gap-3">
     {unassignedWords.map(w => (
     <div
      key={w.id}
      draggable
      onDragStart={(e) => handleDragStart(e, w, 'unassigned')}
      onClick={(e) => { e.stopPropagation(); handleWordClick(w, 'unassigned'); }}
      className={`px-4 py-2 border-2 rounded-lg shadow-sm cursor-grab active:cursor-grabbing font-medium hover:scale-105 transition-transform ${ selectedWord?.id === w.id ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' : 'border-slate-200 dark:border-[#1c1b1b]' }`}
     >
      {w.word}
     </div>
     ))}
     {unassignedWords.length === 0 && (
     <div className="text-slate-400 dark:text-[#71717a] italic py-2">All words categorized!</div>
     )}
    </div>
    </div>

    {/* Category Bins */}
    <div className="flex flex-col lg:grid sm:grid-cols-2 lg:grid-cols-3 gap-0 lg:gap-6 lg:flex-1 overflow-y-auto lg:overflow-visible">
    {CATEGORIES.map(cat => (
     <div
     key={cat.id}
     onDragOver={(e) => e.preventDefault()}
     onDrop={(e) => handleDrop(e, cat.id)}
     onClick={() => handleBinClick(cat.id)}
     className={`flex flex-col rounded-2xl border-2 p-4 transition-colors duration-200 min-h-[200px] ${ selectedWord ? 'hover:bg-slate-50 dark:hover:bg-[#121212]/50 cursor-pointer border-dashed border-blue-400' : 'border-slate-200 dark:border-[#1c1b1b]' }`}
     >
     <div className={`px-3 py-1 rounded-full text-sm font-semibold border inline-block self-start mb-4 ${cat.color}`}>
      {cat.label}
     </div>
     <div className="flex flex-wrap gap-2 flex-1 content-start">
      {assignedWords[cat.id].map(w => {
      let isError = false;
      if (nounScore !== null && w.category !== cat.id) isError = true;

      return (
       <div
       key={w.id}
       draggable
       onDragStart={(e) => handleDragStart(e, w, cat.id)}
       onClick={(e) => { e.stopPropagation(); handleWordClick(w, cat.id); }}
       className={`px-3 py-1 border-2 rounded-md shadow-sm cursor-grab active:cursor-grabbing text-sm font-medium hover:scale-105 transition-transform ${ isError ? 'border-red-500 text-red-600 dark:text-red-400' : selectedWord?.id === w.id ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' : 'border-slate-200 dark:border-[#1c1b1b]' }`}
       >
       {w.word}
       </div>
      )
      })}
     </div>
     </div>
    ))}
    </div>
   </div>
   ) : (
   <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full items-center justify-center space-y-8">
    {ARTICLE_QUESTIONS.map((q, qIndex) => (
    <div key={q.id} className="w-full bg-white dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-neutral-900 text-lg md:text-xl leading-loose">
     <div className="flex items-center flex-wrap">
     <span className="font-bold text-slate-400 mr-4">{qIndex + 1}.</span>
     {q.textParts.map((part, i) => (
      <span key={i} className="flex items-center flex-wrap">
      <span>{part}</span>
      {i < q.textParts.length - 1 && (
       <div className="mx-2 inline-block">
       <select
        value={userAnswers[q.id]?.[i] || ''}
        onChange={(e) => handleArticleSelect(q.id, i, e.target.value)}
        className={`appearance-none bg-slate-100 dark:bg-[#121212] border-b-2 border-slate-300 dark:border-slate-600 px-3 py-1 font-semibold text-blue-600 dark:text-blue-400 focus:outline-none focus:border-blue-500 cursor-pointer ${ articleScore !== null ? userAnswers[q.id]?.[i] === q.answers[i] ? 'border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' : '' }`}
       >
        <option value="" disabled>___</option>
        <option value="a">a</option>
        <option value="an">an</option>
        <option value="the">the</option>
        <option value="x">(no article)</option>
       </select>
       </div>
      )}
      </span>
     ))}
     </div>
    </div>
    ))}
   </div>
   )}
  </div>
  </div>
 </div>
 );
}
