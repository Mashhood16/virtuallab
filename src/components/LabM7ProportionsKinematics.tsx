import { useState, useEffect } from 'react';
import { ArrowLeft, Utensils, Droplets, Car, Calculator, Check, RefreshCw, Play } from 'lucide-react';

export default function LabM7ProportionsKinematics({ onExit }: { onExit?: () => void }) {
 const [activeTab, setActiveTab] = useState<'proportions' | 'kinematics'>('proportions');

 // Proportions State
 const [propMode, setPropMode] = useState<'recipe' | 'taps'>('recipe');
 const [recipeServings, setRecipeServings] = useState(4);
 const baseRecipe = { flour: 200, sugar: 100, milk: 150 }; // for 4 servings
 
 const [recipeQ, setRecipeQ] = useState({ targetServings: 10, answer: 500 });
 const [recipeInput, setRecipeInput] = useState('');
 const [recipeFeedback, setRecipeFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 const [taps, setTaps] = useState(1);
 const [tankLevel, setTankLevel] = useState(0);
 const [virtualTime, setVirtualTime] = useState(0);
 const [isTankFilling, setIsTankFilling] = useState(false);
 
 const [tapsQ, setTapsQ] = useState({ targetTaps: 3, answer: 20 });
 const [tapsInput, setTapsInput] = useState('');
 const [tapsFeedback, setTapsFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 // Kinematics State
 const [distance, setDistance] = useState(100);
 const [time, setTime] = useState(2);
 const [kinProgress, setKinProgress] = useState(0);
 const [kinTime, setKinTime] = useState(0);
 const [isCarMoving, setIsCarMoving] = useState(false);
 
 const [kinQ, setKinQ] = useState({ dist: 150, time: 3, answer: 50 });
 const [kinInput, setKinInput] = useState('');
 const [kinFeedback, setKinFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 const generateRecipeQ = () => {
 const targetServings = Math.floor(Math.random() * 8) + 5; // 5 to 12
 const answer = (baseRecipe.flour / 4) * targetServings;
 setRecipeQ({ targetServings, answer });
 setRecipeInput('');
 setRecipeFeedback('idle');
 };

 const generateTapsQ = () => {
 const allowedTaps = [2, 3, 4, 5, 6, 10];
 const targetTaps = allowedTaps[Math.floor(Math.random() * allowedTaps.length)];
 const answer = 60 / targetTaps;
 setTapsQ({ targetTaps, answer });
 setTapsInput('');
 setTapsFeedback('idle');
 };

 const generateKinQ = () => {
 const times = [2, 3, 4, 5];
 const targetTime = times[Math.floor(Math.random() * times.length)];
 const speeds = [30, 40, 50, 60, 80];
 const speed = speeds[Math.floor(Math.random() * speeds.length)];
 const dist = speed * targetTime;
 setKinQ({ dist, time: targetTime, answer: speed });
 setKinInput('');
 setKinFeedback('idle');
 };

 useEffect(() => {
 generateRecipeQ();
 generateTapsQ();
 generateKinQ();
 }, []); // eslint-disable-line react-hooks/exhaustive-deps

 // Animations
 useEffect(() => {
 let interval: ReturnType<typeof setInterval>;
 if (isTankFilling && tankLevel < 100) {
  interval = setInterval(() => {
  setTankLevel(prev => {
   const next = prev + (taps * 0.5);
   if (next >= 100) {
   setIsTankFilling(false);
   return 100;
   }
   return next;
  });
  setVirtualTime(prev => prev + 0.3); 
  }, 50);
 } else if (tankLevel >= 100 && isTankFilling) {
  setIsTankFilling(false);
 }
 return () => clearInterval(interval);
 }, [isTankFilling, tankLevel, taps]);

 useEffect(() => {
 let interval: ReturnType<typeof setInterval>;
 if (isCarMoving && kinProgress < 100) {
  interval = setInterval(() => {
  setKinProgress(prev => {
   const next = prev + 1.25;
   if (next >= 100) {
   setIsCarMoving(false);
   return 100;
   }
   return next;
  });
  setKinTime(prev => prev + (time / 80));
  }, 50);
 } else if (kinProgress >= 100 && isCarMoving) {
  setIsCarMoving(false);
 }
 return () => clearInterval(interval);
 }, [isCarMoving, kinProgress, time]);

 const handleStartTank = () => {
 setTankLevel(0);
 setVirtualTime(0);
 setIsTankFilling(true);
 };

 const handleStartCar = () => {
 setKinProgress(0);
 setKinTime(0);
 setIsCarMoving(true);
 };

 const checkRecipeAnswer = () => {
 if (parseInt(recipeInput) === recipeQ.answer) setRecipeFeedback('correct');
 else setRecipeFeedback('incorrect');
 };

 const checkTapsAnswer = () => {
 if (parseInt(tapsInput) === tapsQ.answer) setTapsFeedback('correct');
 else setTapsFeedback('incorrect');
 };

 const checkKinAnswer = () => {
 if (parseInt(kinInput) === kinQ.answer) setKinFeedback('correct');
 else setKinFeedback('incorrect');
 };

 return (
 <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans select-none">
  {/* Header */}
  <header className="flex items-center p-4 shadow-sm z-20 shrink-0">
  {onExit && (
   <button onClick={onExit} className="mr-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-600 dark:text-[#a1a1aa]">
   <ArrowLeft className="w-6 h-6" />
   </button>
  )}
  <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">Class 7 Labs: Proportions & Kinematics</h1>
  </header>
  
  {/* Main Content */}
  <main className="flex-1 min-w-0 flex lg:overflow-hidden">
  {/* Left Column: Controls & Workspace */}
  <div className="w-[400px] lg:w-[450px] flex flex-col border-r border-slate-200 dark:border-[#1c1b1b] p-6 lg:overflow-y-auto z-10 shadow-[2px_0_10px_rgba(0,0,0,0.05)]">
   {/* Tabs */}
   <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1 mb-6 shrink-0">
   <button 
    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${activeTab === 'proportions' ? ' text-blue-600 dark:text-blue-400 shadow' : 'text-slate-600 dark:text-[#ffffff] hover:text-slate-800 dark:hover:text-white'}`}
    onClick={() => setActiveTab('proportions')}
   >
    Proportions
   </button>
   <button 
    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${activeTab === 'kinematics' ? ' text-blue-600 dark:text-blue-400 shadow' : 'text-slate-600 dark:text-[#ffffff] hover:text-slate-800 dark:hover:text-white'}`}
    onClick={() => setActiveTab('kinematics')}
   >
    Kinematics
   </button>
   </div>

   {activeTab === 'proportions' && (
   <div className="space-y-6 flex-1 pr-2">
    <div className="flex gap-2 mb-4 bg-slate-100 dark:bg-[#121212] p-1 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <button 
     onClick={() => setPropMode('recipe')} 
     className={`flex-1 py-1 px-3 text-sm font-bold rounded-md transition-colors ${propMode === 'recipe' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:text-[#a1a1aa] dark:hover:text-slate-200'}`}
    >
     Recipe (Direct)
    </button>
    <button 
     onClick={() => setPropMode('taps')} 
     className={`flex-1 py-1 px-3 text-sm font-bold rounded-md transition-colors ${propMode === 'taps' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:text-[#a1a1aa] dark:hover:text-slate-200'}`}
    >
     Tank (Inverse)
    </button>
    </div>

    {propMode === 'recipe' && (
    <>
     <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
     <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
      <Utensils className="w-5 h-5 text-orange-500" /> Target Servings
     </h3>
     <input type="range" min="1" max="20" value={recipeServings} onChange={(e) => setRecipeServings(parseInt(e.target.value))} className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer" />
     <div className="flex justify-between text-sm mt-2 font-medium text-slate-600 dark:text-[#71717a]">
      <span>1</span>
      <span className="text-orange-600 dark:text-orange-400 font-bold">{recipeServings} Servings</span>
      <span>20</span>
     </div>
     </div>

     <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
     <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
      <Calculator className="w-5 h-5" /> Calculate
     </h3>
     <p className="text-slate-700 dark:text-[#a1a1aa] mb-4 font-medium leading-relaxed">
      A recipe for 4 servings requires 200g of flour. How much flour is needed for <strong className="text-slate-900 dark:text-white">{recipeQ.targetServings}</strong> servings?
     </p>
     <div className="flex flex-wrap gap-2">
      <input 
      type="number" 
      value={recipeInput} 
      onChange={(e) => setRecipeInput(e.target.value)}
      className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg px-4 py-2 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Your answer (g)..."
      />
      <button onClick={checkRecipeAnswer} className="whitespace-nowrap flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
      <Check className="w-5 h-5" /> Check
      </button>
     </div>
     {recipeFeedback !== 'idle' && (
      <div className={`mt-3 p-3 rounded-lg font-bold flex items-center justify-between ${recipeFeedback === 'correct' ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-400'}`}>
      <span>{recipeFeedback === 'correct' ? 'Correct! Well done.' : 'Incorrect. Use the simulator!'}</span>
      {recipeFeedback === 'correct' && (
       <button onClick={generateRecipeQ} className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-md transition-colors" title="Next Question">
       <RefreshCw className="w-5 h-5" />
       </button>
      )}
      </div>
     )}
     </div>
    </>
    )}

    {propMode === 'taps' && (
    <>
     <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
     <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
      <Droplets className="w-5 h-5 text-blue-500" /> Active Taps
     </h3>
     <input type="range" min="1" max="10" value={taps} onChange={(e) => {
      setTaps(parseInt(e.target.value));
      setIsTankFilling(false);
      setTankLevel(0);
      setVirtualTime(0);
     }} className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer" />
     <div className="flex justify-between text-sm mt-2 font-medium text-slate-600 dark:text-[#71717a]">
      <span>1</span>
      <span className="text-blue-600 dark:text-blue-400 font-bold">{taps} Taps</span>
      <span>10</span>
     </div>
     <button onClick={handleStartTank} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
      <Play className="w-5 h-5" /> Fill Tank
     </button>
     </div>

     <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
     <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
      <Calculator className="w-5 h-5" /> Calculate
     </h3>
     <p className="text-slate-700 dark:text-[#a1a1aa] mb-4 font-medium leading-relaxed">
      If 1 tap takes 60 minutes to fill a tank, how long will <strong className="text-slate-900 dark:text-white">{tapsQ.targetTaps}</strong> taps take?
     </p>
     <div className="flex flex-wrap gap-2">
      <input 
      type="number" 
      value={tapsInput} 
      onChange={(e) => setTapsInput(e.target.value)}
      className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg px-4 py-2 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Your answer (mins)..."
      />
      <button onClick={checkTapsAnswer} className="whitespace-nowrap flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
      <Check className="w-5 h-5" /> Check
      </button>
     </div>
     {tapsFeedback !== 'idle' && (
      <div className={`mt-3 p-3 rounded-lg font-bold flex items-center justify-between ${tapsFeedback === 'correct' ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-400'}`}>
      <span>{tapsFeedback === 'correct' ? 'Correct! Nice job.' : 'Incorrect. Try testing it!'}</span>
      {tapsFeedback === 'correct' && (
       <button onClick={generateTapsQ} className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-md transition-colors" title="Next Question">
       <RefreshCw className="w-5 h-5" />
       </button>
      )}
      </div>
     )}
     </div>
    </>
    )}
   </div>
   )}

   {activeTab === 'kinematics' && (
   <div className="space-y-6 flex-1 pr-2">
    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
     <Car className="w-5 h-5 text-emerald-500" /> Route Distance
    </h3>
    <input type="range" min="10" max="500" step="10" value={distance} onChange={(e) => {
     setDistance(parseInt(e.target.value));
     setIsCarMoving(false);
     setKinProgress(0);
     setKinTime(0);
    }} className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer" />
    <div className="flex justify-between text-sm mt-2 font-medium text-slate-600 dark:text-[#71717a]">
     <span>10 km</span>
     <span className="text-emerald-600 dark:text-emerald-400 font-bold">{distance} km</span>
     <span>500 km</span>
    </div>
    </div>

    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
     <Calculator className="w-5 h-5 text-indigo-500" /> Journey Time
    </h3>
    <input type="range" min="1" max="10" value={time} onChange={(e) => {
     setTime(parseInt(e.target.value));
     setIsCarMoving(false);
     setKinProgress(0);
     setKinTime(0);
    }} className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer" />
    <div className="flex justify-between text-sm mt-2 font-medium text-slate-600 dark:text-[#71717a]">
     <span>1 hour</span>
     <span className="text-indigo-600 dark:text-indigo-400 font-bold">{time} hours</span>
     <span>10 hours</span>
    </div>
    <button onClick={handleStartCar} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
     <Play className="w-5 h-5" /> Start Journey
    </button>
    </div>

    {/* Question Box */}
    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
     <Calculator className="w-5 h-5" /> Calculate Speed
    </h3>
    <p className="text-slate-700 dark:text-[#a1a1aa] mb-4 font-medium leading-relaxed">
     Calculate the average speed of a car that travels <strong className="text-slate-900 dark:text-white">{kinQ.dist} km</strong> in <strong className="text-slate-900 dark:text-white">{kinQ.time} hours</strong>.
    </p>
    <div className="flex flex-wrap gap-2">
     <input 
     type="number" 
     value={kinInput} 
     onChange={(e) => setKinInput(e.target.value)}
     className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg px-4 py-2 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
     placeholder="Your answer (km/h)..."
     />
     <button onClick={checkKinAnswer} className="whitespace-nowrap flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
     <Check className="w-5 h-5" /> Check
     </button>
    </div>
    {kinFeedback !== 'idle' && (
     <div className={`mt-3 p-3 rounded-lg font-bold flex items-center justify-between ${kinFeedback === 'correct' ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-400'}`}>
     <span>{kinFeedback === 'correct' ? 'Correct! Excellent.' : 'Incorrect. Try D ÷ T!'}</span>
     {kinFeedback === 'correct' && (
      <button onClick={generateKinQ} className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-md transition-colors" title="Next Question">
      <RefreshCw className="w-5 h-5" />
      </button>
     )}
     </div>
    )}
    </div>
   </div>
   )}
  </div>
  
  {/* Right Column: Simulation Stage */}
  <div className="flex-1 min-w-0 flex items-center justify-center bg-slate-100 dark:bg-[#121212]/50 p-6 lg:overflow-y-auto relative">
   
   {activeTab === 'proportions' && propMode === 'recipe' && (
   <div className="flex flex-col items-center justify-center w-full h-full">
    <h2 className="text-2xl font-bold mb-12 text-slate-700 dark:text-[#a1a1aa]">
    Ingredients Required
    </h2>
    <div className="flex gap-12 items-end h-64 border-b-4 border-slate-300 dark:border-[#1c1b1b] pb-2 px-12">
    <div className="flex flex-col items-center gap-3">
     <div className="w-24 bg-orange-50 dark:bg-orange-900/20 border-x-4 border-b-4 border-orange-200 dark:border-orange-800 rounded-b-xl relative overflow-hidden shadow-inner" style={{ height: '200px' }}>
     <div className="absolute bottom-0 w-full bg-orange-300 dark:bg-orange-600 transition-all duration-500" style={{ height: `${(recipeServings * 10)}px`, maxHeight: '200px' }}></div>
     </div>
     <span className="font-bold text-slate-700 dark:text-[#a1a1aa] uppercase tracking-widest text-sm">Flour</span>
     <span className="text-orange-600 dark:text-orange-400 font-black text-xl">{(baseRecipe.flour / 4) * recipeServings}g</span>
    </div>
    
    <div className="flex flex-col items-center gap-3">
     <div className="w-24 bg-slate-50 dark:bg-[#121212]/50 border-x-4 border-b-4 border-slate-200 dark:border-[#1c1b1b] rounded-b-xl relative overflow-hidden shadow-inner" style={{ height: '200px' }}>
     <div className="absolute bottom-0 w-full bg-slate-200 dark:bg-slate-400 transition-all duration-500" style={{ height: `${(recipeServings * 5)}px`, maxHeight: '200px' }}></div>
     </div>
     <span className="font-bold text-slate-700 dark:text-[#a1a1aa] uppercase tracking-widest text-sm">Sugar</span>
     <span className="text-slate-600 dark:text-[#71717a] font-black text-xl">{(baseRecipe.sugar / 4) * recipeServings}g</span>
    </div>

    <div className="flex flex-col items-center gap-3">
     <div className="w-24 bg-blue-50 dark:bg-blue-900/20 border-x-4 border-b-4 border-blue-200 dark:border-blue-800 rounded-b-xl relative overflow-hidden shadow-inner" style={{ height: '200px' }}>
     <div className="absolute bottom-0 w-full bg-blue-300 dark:bg-blue-600 transition-all duration-500" style={{ height: `${(recipeServings * 7.5)}px`, maxHeight: '200px' }}></div>
     </div>
     <span className="font-bold text-slate-700 dark:text-[#a1a1aa] uppercase tracking-widest text-sm">Milk</span>
     <span className="text-blue-600 dark:text-blue-400 font-black text-xl">{(baseRecipe.milk / 4) * recipeServings}ml</span>
    </div>
    </div>
   </div>
   )}

   {activeTab === 'proportions' && propMode === 'taps' && (
   <div className="flex flex-col items-center justify-center w-full h-full relative">
    <div className="relative w-full max-w-xl h-[400px] flex flex-col items-center justify-end">
    {/* Taps */}
    <div className="absolute top-0 w-full flex justify-around px-12">
     {Array.from({ length: taps }).map((_, i) => (
     <div key={i} className="flex flex-col items-center">
      <div className="w-8 h-8 bg-slate-400 dark:bg-slate-500 rounded-t-md shadow"></div>
      <div className="w-4 h-6 bg-slate-300 dark:bg-slate-600 shadow-inner"></div>
      {isTankFilling && <div className="w-2 h-40 bg-blue-400 dark:bg-blue-500 animate-pulse opacity-80"></div>}
     </div>
     ))}
    </div>
    
    {/* Tank */}
    <div className="w-80 h-56 border-8 border-slate-300 dark:border-[#1c1b1b] rounded-b-3xl relative overflow-hidden bg-white/40 dark:bg-[#121212]/40 backdrop-blur shadow-2xl">
     {/* Water level */}
     <div 
     className="absolute bottom-0 w-full bg-blue-500/80 dark:bg-blue-600/80 transition-all duration-[50ms]" 
     style={{ height: `${tankLevel}%` }}
     >
     {/* Surface reflection */}
     <div className="w-full h-2 bg-white/30 dark:bg-[#121212]"></div>
     </div>
    </div>
    
    {/* Time Display */}
    <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 bg-white dark:!bg-[#121212] p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-[#1c1b1b] w-48 text-center">
     <div className="text-sm text-slate-500 dark:text-[#71717a] font-bold uppercase mb-2 tracking-widest">Time Taken</div>
     <div className="text-4xl font-black text-blue-600 dark:text-blue-400 font-mono">
     {Math.round(virtualTime)} <span className="text-xl">min</span>
     </div>
    </div>
    </div>
   </div>
   )}

   {activeTab === 'kinematics' && (
   <div className="flex flex-col items-center justify-center w-full h-full p-8">
    <div className="w-full max-w-4xl flex flex-col items-center">
    {/* Environment */}
    <div className="w-full h-40 bg-sky-200 dark:bg-sky-900/50 rounded-t-3xl relative overflow-hidden flex items-end border-t border-x border-slate-200 dark:border-[#1c1b1b]">
     {/* Decorative sun */}
     <div className="absolute top-8 right-12 w-16 h-16 bg-yellow-300 rounded-full opacity-80 blur-[2px]"></div>
    </div>
    
    {/* Road */}
    <div className="w-full h-32 bg-slate-600 dark:bg-[#121212] relative overflow-hidden flex items-center shadow-inner border-x border-slate-200 dark:border-[#1c1b1b]">
     <div className="w-full h-2 border-y-4 border-dashed border-white/40 dark:border-white/20"></div>
     
     {/* Car */}
     <div 
     className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-[50ms]" 
     style={{ left: `${kinProgress * 0.88 + 2}%` }} 
     >
     <Car className="w-20 h-20 text-red-500 dark:text-red-400 drop-shadow-xl" fill="currentColor" />
     </div>
    </div>
    
    {/* Road Labels */}
    <div className="w-full flex justify-between px-6 mt-4 text-slate-500 dark:text-[#71717a] font-bold text-lg">
     <span>0 km</span>
     <span>{distance} km</span>
    </div>

    {/* Dashboard */}
    <div className="mt-12 bg-white dark:!bg-[#121212] p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-[#1c1b1b] flex gap-16 text-center">
     <div>
     <div className="text-sm text-slate-500 dark:text-[#71717a] font-bold uppercase mb-2 tracking-widest">Distance</div>
     <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
      {Math.round((kinProgress / 100) * distance)} <span className="text-xl">km</span>
     </div>
     </div>
     <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
     <div>
     <div className="text-sm text-slate-500 dark:text-[#71717a] font-bold uppercase mb-2 tracking-widest">Time Elapsed</div>
     <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
      {kinTime.toFixed(1)} <span className="text-xl">h</span>
     </div>
     </div>
    </div>
    </div>
   </div>
   )}
  </div>
  </main>
 </div>
 );
}
