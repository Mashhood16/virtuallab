import { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Sparkles, Layers, AlertCircle , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

type Word = { id: string; text: string; category: string; type: string };

const INITIAL_WORDS: Word[] = [
 { id: 'a1', text: 'a', category: 'Article', type: 'Indefinite' },
 { id: 'a2', text: 'an', category: 'Article', type: 'Indefinite' },
 { id: 'a3', text: 'the', category: 'Article', type: 'Definite' },
 { id: 'q1', text: 'five', category: 'Quantitative Adjective', type: 'Exact' },
 { id: 'q2', text: 'many', category: 'Quantitative Adjective', type: 'Indefinite' },
 { id: 'q3', text: 'some', category: 'Quantitative Adjective', type: 'Indefinite' },
 { id: 'ql1', text: 'shiny', category: 'Qualitative Adjective', type: 'Appearance' },
 { id: 'ql2', text: 'huge', category: 'Qualitative Adjective', type: 'Size' },
 { id: 'ql3', text: 'ferocious', category: 'Qualitative Adjective', type: 'Personality' },
 { id: 'p1', text: 'my', category: 'Possessive Adjective', type: '1st Person' },
 { id: 'p2', text: 'their', category: 'Possessive Adjective', type: '3rd Person' },
 { id: 'c1', text: 'fire-breathing', category: 'Compound Adjective', type: 'Action' },
 { id: 'c2', text: 'well-known', category: 'Compound Adjective', type: 'Status' },
 { id: 'n1', text: 'dragon', category: 'Noun', type: 'Singular' },
 { id: 'n2', text: 'dragons', category: 'Noun', type: 'Plural' },
 { id: 'n3', text: 'alien', category: 'Noun', type: 'Singular' },
 { id: 'n4', text: 'aliens', category: 'Noun', type: 'Plural' },
];

const QUESTIONS = [
 {
 id: 1,
 instruction: "Build a phrase with a definite article, a qualitative adjective, and a singular noun.",
 check: (words: Word[]) => {
  const types = words.map(w => w.category);
  if (types.join(',') !== 'Article,Qualitative Adjective,Noun') return false;
  return words[0].type === 'Definite' && words[2].type === 'Singular';
 }
 },
 {
 id: 2,
 instruction: "Describe something using a possessive adjective, a quantitative adjective, and a plural noun.",
 check: (words: Word[]) => {
  const types = words.map(w => w.category);
  if (types.join(',') !== 'Possessive Adjective,Quantitative Adjective,Noun') return false;
  return words[2].type === 'Plural';
 }
 },
 {
 id: 3,
 instruction: "Create a descriptive phrase with an indefinite article, a compound adjective, and a singular noun.",
 check: (words: Word[]) => {
  const types = words.map(w => w.category);
  if (types.join(',') !== 'Article,Compound Adjective,Noun') return false;
  return words[0].type === 'Indefinite' && words[2].type === 'Singular';
 }
 }
];

export default function LabE7ArticlesAdjectives({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [selectedWords, setSelectedWords] = useState<Word[]>([]);
 const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
 const [showSuccess, setShowSuccess] = useState(false);
 const [showError, setShowError] = useState(false);
 const [assessmentInput, setAssessmentInput] = useState('');
 const [assessmentResult, setAssessmentResult] = useState<string | null>(null);

 const wordsByCategory = useMemo(() => {
 return INITIAL_WORDS.reduce((acc, word) => {
  if (!acc[word.category]) acc[word.category] = [];
  acc[word.category].push(word);
  return acc;
 }, {} as Record<string, Word[]>);
 }, []);

 const handleWordClick = (word: Word) => {
 setSelectedWords([...selectedWords, word]);
 setShowError(false);
 };

 const handleRemoveWord = (index: number) => {
 const newWords = [...selectedWords];
 newWords.splice(index, 1);
 setSelectedWords(newWords);
 setShowError(false);
 };

 const handleCheckAnswer = () => {
 const question = QUESTIONS[currentQuestionIdx];
 if (question.check(selectedWords)) {
  setShowSuccess(true);
  setShowError(false);
 } else {
  setShowError(true);
  setShowSuccess(false);
 }
 };

 const handleNextQuestion = () => {
 if (currentQuestionIdx < QUESTIONS.length - 1) {
  setCurrentQuestionIdx(currentQuestionIdx + 1);
  setSelectedWords([]);
  setShowSuccess(false);
  setShowError(false);
 }
 };

 const handleCheckAssessment = () => {
 const text = assessmentInput.toLowerCase().trim();
 const words = text.split(/\s+/);
 if (words.length >= 2 && (words.includes('a') || words.includes('an') || words.includes('the'))) {
  setAssessmentResult('Great job! You used an article correctly.');
 } else {
  setAssessmentResult('Try again! Make sure to include an article (a, an, the).');
 }
 };

 const categoryCounts = selectedWords.reduce((acc, w) => {
 acc[w.category] = (acc[w.category] || 0) + 1;
 return acc;
 }, {} as Record<string, number>);
 
 const maxCount = Math.max(1, ...Object.values(categoryCounts));
 const categories = Object.keys(categoryCounts);

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff]">
  {/* Header */}
  <header className="flex items-center p-4 shadow-sm z-10">
  <button onClick={onExit} className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap flex-shrink-0 transition-colors">
   <ArrowLeft size={20} />
  </button>
  <h1 className="text-lg md:text-xl font-bold">Noun Modder: Articles & Adjectives</h1>
  
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-white/20 transition-colors shrink-0 ml-4 dark:bg-[#121212]"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </header>

  {/* Main layout */}
  <div className="flex-1 flex flex-col md:flex-row lg:overflow-hidden">
  {/* Left Column: Controls */}
  <div className="w-full md:w-1/2 lg:w-5/12 p-6 flex flex-col gap-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b]">
   
   {/* Current Task */}
   <div className="bg-indigo-50 dark:bg-indigo-900/30 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800">
   <div className="flex justify-between items-start mb-2">
    <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Current Challenge {currentQuestionIdx + 1}/3</h2>
    {showSuccess && <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-bold"><CheckCircle2 size={16} className="mr-1"/> Correct!</span>}
   </div>
   <p className="text-lg font-medium text-slate-800 dark:text-[#ffffff] mb-4">
    {QUESTIONS[currentQuestionIdx].instruction}
   </p>
   <div className="flex gap-2">
    <button 
    onClick={handleCheckAnswer}
    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    <Sparkles size={18} /> Check Phrase
    </button>
    {showSuccess && currentQuestionIdx < QUESTIONS.length - 1 && (
    <button 
     onClick={handleNextQuestion}
     className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold whitespace-nowrap flex-shrink-0 transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
    >
     Next
    </button>
    )}
   </div>
   {showError && (
    <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
    <AlertCircle size={16} /> That doesn't look quite right. Check the categories!
    </p>
   )}
   </div>

   {/* Word Bank */}
   <div className="flex-1">
   <div className="flex justify-between items-center mb-4">
    <h3 className="font-semibold text-lg flex items-center gap-2"><Layers size={20}/> Word Bank</h3>
    <button onClick={() => setSelectedWords([])} className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 whitespace-nowrap flex-shrink-0">
    <RotateCcw size={14} /> Clear
    </button>
   </div>
   
   <div className="space-y-6">
    {Object.entries(wordsByCategory).map(([category, words]) => (
    <div key={category}>
     <h4 className="text-xs font-bold text-slate-400 dark:text-[#71717a] uppercase tracking-wider mb-2">{category}</h4>
     <div className="flex flex-wrap gap-2">
     {words.map(w => (
      <button
       key={w.id}
       onClick={() => handleWordClick(w)}
       className="px-3 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-[#ffffff] rounded-md hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900 dark:hover:text-indigo-200 border border-slate-200 dark:border-[#1c1b1b] whitespace-nowrap flex-shrink-0 transition-colors"
      >
       {w.text}
      </button>
     ))}
     </div>
    </div>
    ))}
   </div>
   </div>

   {/* Assessment Section */}
   <div className="p-4 bg-slate-100 dark:bg-[#121212]/80 rounded-xl border border-slate-200 dark:border-[#1c1b1b] mt-auto">
   <h3 className="font-semibold mb-2 flex items-center gap-2"><Sparkles size={16}/> Assessment: Sentence Builder</h3>
   <p className="text-sm mb-3 text-slate-600 dark:text-[#71717a]">
    Type a custom phrase using exactly one article and one noun.
   </p>
   <div className="flex gap-2">
    <input 
    type="text" 
    value={assessmentInput}
    onChange={(e) => setAssessmentInput(e.target.value)}
    placeholder="e.g. the cat..."
    className="flex-1 min-w-0 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button 
    onClick={handleCheckAssessment}
    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md whitespace-nowrap flex-shrink-0 transition-colors font-medium dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    Check Answer
    </button>
   </div>
   {assessmentResult && (
    <p className={`text-sm mt-2 font-medium ${assessmentResult.includes('Great') ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
     {assessmentResult}
    </p>
   )}
   </div>
  </div>

  {/* Right Column: Canvas */}
  <div className="w-full md:w-1/2 lg:w-7/12 p-8 flex flex-col relative bg-slate-50 dark:bg-[#121212] lg:overflow-y-auto">
   
   <div className="flex flex-col items-center justify-center space-y-12 w-full max-w-2xl mx-auto mb-8">
    <div className="text-center">
    <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] mb-2">Phrase Visualizer</h2>
    <p className="text-slate-500 dark:text-[#71717a]">Click words in your phrase to remove them.</p>
    </div>
    
    {/* Visualizer output */}
    <div className="min-h-[200px] w-full flex flex-col items-center justify-center p-8 bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    {selectedWords.length === 0 ? (
     <p className="text-slate-400 dark:text-[#71717a] text-lg">Your phrase will appear here...</p>
    ) : (
     <div className="flex flex-wrap gap-4 items-end justify-center">
      {selectedWords.map((word, idx) => (
       <div key={idx} onClick={() => handleRemoveWord(idx)} className="flex flex-col items-center cursor-pointer group hover:-translate-y-1 transition-transform">
       <span className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-[#ffffff] mb-2">{word.text}</span>
       <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full group-hover:bg-red-100 group-hover:text-red-800 dark:group-hover:bg-red-900 dark:group-hover:text-red-200 transition-colors">
        {word.category}
       </span>
       </div>
      ))}
     </div>
    )}
    </div>

    {/* Emoji visualization if noun is present */}
    <div className="text-8xl transform hover:scale-110 transition-transform duration-300">
    {selectedWords.find(w => w.category === 'Noun') ? (
     (() => {
      const noun = selectedWords.find(w => w.category === 'Noun')?.text.toLowerCase() || '';
      if (noun.includes('dragon')) return '🐉';
      if (noun.includes('alien')) return '👽';
      if (noun.includes('car')) return '🚗';
      if (noun.includes('spaceship')) return '🚀';
      return '📦';
     })()
    ) : <span className="opacity-10 dark:opacity-5">📦</span>}
    </div>
   </div>

   {/* Data Logging & Graph */}
   <div className="w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
    <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-semibold mb-2">Word Data Table</h3>
    <div className="overflow-x-auto">
     <table className="w-full text-sm text-left">
      <thead className="bg-slate-100 dark:bg-slate-700">
       <tr>
       <th className="px-3 py-2 rounded-tl-lg">Word</th>
       <th className="px-3 py-2">Category</th>
       <th className="px-3 py-2 rounded-tr-lg">Type</th>
       </tr>
      </thead>
      <tbody>
       {selectedWords.length === 0 ? (
       <tr><td colSpan={3} className="px-3 py-2 text-center text-slate-500">No data logged yet</td></tr>
       ) : (
       selectedWords.map((w, i) => (
        <tr key={i} className="border-b border-slate-100 dark:border-[#1c1b1b]">
         <td className="px-3 py-2 font-medium">{w.text}</td>
         <td className="px-3 py-2">{w.category}</td>
         <td className="px-3 py-2">{w.type}</td>
        </tr>
       ))
       )}
      </tbody>
     </table>
    </div>
    </div>

    <div className="bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-semibold mb-2">Category Graph</h3>
    <svg viewBox="0 0 200 150" className="w-full h-auto bg-slate-50 dark:bg-[#121212] rounded-lg">
     {categories.length === 0 ? (
      <text x="100" y="75" textAnchor="middle" fill="#94a3b8" fontSize="12">Add words to see graph</text>
     ) : (
      categories.map((cat, i) => {
       const count = categoryCounts[cat];
       const barHeight = (count / maxCount) * 100;
       const barWidth = 160 / Math.max(categories.length, 1) - 10;
       const x = 20 + i * (barWidth + 10);
       const y = 130 - barHeight;
       return (
       <g key={cat}>
        <rect x={x} y={y} width={barWidth} height={barHeight} fill="#6366f1" rx="2" />
        <text x={x + barWidth/2} y={y - 5} textAnchor="middle" fill="#64748b" fontSize="10">{count}</text>
        <text x={x + barWidth/2} y="145" textAnchor="middle" fill="#64748b" fontSize="8" className="truncate">
         {cat.includes(' ') ? cat.split(' ')[0] : cat}
        </text>
       </g>
       );
      })
     )}
     <line x1="15" y1="130" x2="195" y2="130" stroke="#cbd5e1" strokeWidth="2" />
    </svg>
    </div>
   </div>

  </div>
  </div>
 </div>
 );
}
