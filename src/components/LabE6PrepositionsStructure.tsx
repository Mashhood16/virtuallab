import { useState } from 'react';
import { ArrowLeft, Check, RefreshCw, Navigation, Box, MousePointer2 , Sun, Moon} from 'lucide-react';
import { useTheme } from '../store';

export default function LabE6PrepositionsStructure({ onExit }: { onExit?: () => void }) {
 const { theme, toggleTheme } = useTheme();
 const [prep, setPrep] = useState('over');
 const [animating, setAnimating] = useState(false);

 const initialSentence = [
 { word: "The", tag: "Article", correct: "Article", locked: true },
 { word: "dog", tag: "", correct: "Subject", locked: false },
 { word: "ran", tag: "", correct: "Verb", locked: false },
 { word: "through", tag: "", correct: "Preposition", locked: false },
 { word: "the", tag: "Article", correct: "Article", locked: true },
 { word: "park", tag: "", correct: "Object", locked: false }
 ];
 const [tokens, setTokens] = useState(initialSentence);
 const [selectedToken, setSelectedToken] = useState<number | null>(null);
 const [parserFeedback, setParserFeedback] = useState<string | null>(null);

 const availableTags = ["Subject", "Verb", "Preposition", "Object"];

 const triggerAnimation = () => {
 setAnimating(true);
 setTimeout(() => setAnimating(false), 2000);
 };

 const handleApplyTag = (tag: string) => {
 if (selectedToken !== null) {
  const newTokens = [...tokens];
  newTokens[selectedToken].tag = tag;
  setTokens(newTokens);
  setSelectedToken(null);
  setParserFeedback(null);
 }
 };

 const checkParser = () => {
 const allCorrect = tokens.every(t => t.tag === t.correct);
 if (allCorrect) {
  setParserFeedback("Perfect! You correctly identified the sentence structure.");
 } else {
  setParserFeedback("Some tags are incorrect. Keep trying!");
 }
 };

 const resetParser = () => {
 setTokens(initialSentence);
 setParserFeedback(null);
 setSelectedToken(null);
 };

 const styleSheet = `
 @keyframes moveOver {
  0% { transform: translate(40px, 150px); }
  50% { transform: translate(150px, 50px); }
  100% { transform: translate(260px, 150px); }
 }
 @keyframes moveUnder {
  0% { transform: translate(40px, 150px); }
  50% { transform: translate(150px, 250px); }
  100% { transform: translate(260px, 150px); }
 }
 @keyframes moveThrough {
  0% { transform: translate(40px, 150px); opacity: 1; }
  50% { transform: translate(150px, 150px); opacity: 0.2; }
  100% { transform: translate(260px, 150px); opacity: 1; }
 }
 @keyframes moveAround {
  0% { transform: translate(40px, 150px) scale(1); }
  25% { transform: translate(150px, 100px) scale(0.8); }
  50% { transform: translate(200px, 150px) scale(1.2); }
  75% { transform: translate(150px, 200px) scale(0.8); }
  100% { transform: translate(260px, 150px) scale(1); }
 }
 @keyframes moveInto {
  0% { transform: translate(40px, 150px); opacity: 1; }
  100% { transform: translate(150px, 150px); opacity: 0; }
 }
 `;

 const getCircleStyle = () => {
 if (animating) {
  return {
  animation: `move${prep.charAt(0).toUpperCase() + prep.slice(1)} 2s forwards`
  };
 }
 if (prep === 'into') {
  return { transform: 'translate(150px, 150px)', opacity: 0 };
 }
 return { transform: 'translate(40px, 150px)', opacity: 1 };
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans select-none overflow-hidden">
  <style>{styleSheet}</style>
  <header className="flex items-center justify-between p-4 shadow-sm z-10">
  <div className="flex items-center gap-4">
   <button onClick={onExit} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors whitespace-nowrap flex-shrink-0">
   <ArrowLeft className="w-5 h-5" />
   </button>
   <h1 className="text-lg md:text-xl font-bold">Prepositions & Structure Lab</h1>
  </div>
  
  <button
   onClick={toggleTheme}
   className="p-2 rounded-full hover:bg-white/20 transition-colors shrink-0 ml-4 dark:bg-[#121212]"
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </header>

  <main className="lg:flex-1 flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 lg: overflow-y-auto lg:overflow-visible">
  {/* Left Column: Controls & Workspace */}
  <div className="flex flex-col p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] space-y-8">
   
   <section className={`bg-white dark:!bg-[#121212] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
    <Navigation className="w-5 h-5 text-blue-500" />
    Prepositions of Direction
   </h2>
   <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
    {['over', 'under', 'through', 'around', 'into'].map(p => (
    <button
     key={p}
     onClick={() => { setPrep(p); setAnimating(false); }}
     className={`py-2 px-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${prep === p ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:hover:bg-slate-600'}`}
    >
     {p}
    </button>
    ))}
   </div>
   <button
    onClick={triggerAnimation}
    disabled={animating}
    className={`w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 disabled: disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors whitespace-nowrap flex-shrink-0 flex justify-center items-center gap-2 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40 flex-col `}
   >
    <Box className="w-5 h-5" /> Simulate Movement
   </button>
   </section>

   <section className={`bg-blue-50 dark:bg-[#121212]/80 rounded-2xl p-6 border border-blue-100 dark:border-[#1c1b1b] lg:flex-1 flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold mb-4 text-blue-900 dark:text-blue-300 flex items-center gap-2">
    <MousePointer2 className="w-5 h-5" /> Sentence Parser
   </h2>
   <p className="text-sm text-slate-600 dark:text-[#71717a] mb-4">
    Click a word below, then select its grammatical tag to map the sentence structure.
   </p>

   <div className="flex flex-wrap gap-2 mb-6">
    {tokens.map((t, i) => (
    <button
     key={i}
     disabled={t.locked}
     onClick={() => setSelectedToken(i)}
     className={`py-2 px-3 rounded-lg text-lg font-medium transition-colors whitespace-nowrap flex-shrink-0 ${ t.locked ? 'bg-transparent text-slate-400 cursor-not-allowed border border-transparent' : selectedToken === i ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-2 border-blue-500' : t.tag ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-[#ffffff] border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600' }`}
    >
     {t.word}
    </button>
    ))}
   </div>

   {selectedToken !== null && (
    <div className={`mb-6 p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] animate-in fade-in slide-in-from-top-2 flex-col `}>
    <p className="text-sm font-bold text-slate-500 mb-3">Tag for "{tokens[selectedToken].word}":</p>
    <div className="grid grid-cols-2 gap-2">
     {availableTags.map(tag => (
     <button
      key={tag}
      onClick={() => handleApplyTag(tag)}
      className="py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-slate-600 text-slate-700 dark:text-[#ffffff] text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
     >
      {tag}
     </button>
     ))}
    </div>
    </div>
   )}

   <div className="mt-auto pt-4 border-t border-blue-200 dark:border-[#1c1b1b] flex items-center justify-between">
    <button
    onClick={checkParser}
    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
    <Check className="w-5 h-5" /> Check Structure
    </button>
    {parserFeedback && (
    <div className="flex items-center gap-3">
     <span className={`text-sm font-bold max-w-[150px] leading-tight ${parserFeedback.includes('Perfect') ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
     {parserFeedback.includes('Perfect') ? 'Correct!' : 'Keep trying!'}
     </span>
     <button onClick={resetParser} className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-[#a1a1aa] rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 whitespace-nowrap flex-shrink-0">
     <RefreshCw className="w-4 h-4" />
     </button>
    </div>
    )}
   </div>
   </section>

  </div>

  {/* Right Column: Simulation Canvas */}
  <div className="bg-slate-200 dark:bg-[#121212]/50 p-6 flex flex-col items-center justify-center relative overflow-hidden gap-8 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex">
   
   {/* Simulation Canvas */}
   <div className="w-full max-w-lg aspect-video bg-white dark:!bg-[#121212] rounded-3xl shadow-xl border border-slate-100 dark:border-[#1c1b1b] relative overflow-hidden ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block">
   <svg width="100%" height="100%" viewBox="0 0 300 300" className="absolute inset-0">
    {/* Obstacle */}
    {prep === 'through' ? (
    <rect x="120" y="100" width="60" height="100" className="fill-slate-400 dark:fill-slate-600 opacity-50" />
    ) : prep === 'into' ? (
    <path d="M120 120 h60 v60 h-60 z" className="fill-slate-200 dark:fill-slate-700 stroke-slate-400 stroke-2" />
    ) : (
    <rect x="120" y="120" width="60" height="60" className="fill-slate-800 dark:fill-slate-500" rx="8" />
    )}
    
    {/* Character */}
    <circle 
    cx="0" cy="0" r="15" 
    className="fill-blue-500"
    style={getCircleStyle()}
    />
   </svg>
   <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
    <span className="bg-white/90 dark:bg-[#121212]/90 px-4 py-2 rounded-full text-sm font-bold text-slate-700 dark:text-[#ffffff] shadow-sm">
    The ball goes <span className="text-blue-500">{prep}</span> the box.
    </span>
   </div>
   </div>

   {/* Structural Diagram */}
   <div className={`w-full max-w-lg bg-white dark:!bg-[#121212] p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">Sentence Map</h3>
   <div className="flex flex-wrap gap-2 justify-center">
    {tokens.map((t, i) => (
    <div key={i} className="flex flex-col items-center">
     <div className={`px-3 py-2 rounded-lg font-mono text-lg border ${t.tag ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-slate-200 dark:border-[#1c1b1b]'}`}>
     {t.word}
     </div>
     {t.tag && (
     <>
      <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-slate-700 px-2 py-1 rounded">
      {t.tag}
      </div>
     </>
     )}
    </div>
    ))}
   </div>
   </div>

  </div>
  </main>
 </div>
 );
}
