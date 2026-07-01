import { useState } from 'react';
import {CheckCircle2 } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8Detergent({ onExit }: LabProps) {
 const [ingredients, setIngredients] = useState<string[]>([]);
 const [isShaking, setIsShaking] = useState(false);
 const [isDone, setIsDone] = useState(false);

 const required = ['Washing Soda', 'Baking Soda', 'Borax', 'Essential Oil'];

 const addIngredient = (ing: string) => {
 if (!ingredients.includes(ing)) {
  setIngredients([...ingredients, ing]);
 }
 };

 const mix = () => {
 if (ingredients.length === 4) {
  setIsShaking(true);
  setTimeout(() => {
  setIsShaking(false);
  setIsDone(true);
  }, 1500);
 }
 };

 return (
 <div className="lg:overflow-y-auto flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Act 11.4: DIY Detergent" subtitle="Combine raw powders to make washing powder" />

  <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 max-w-5xl mx-auto w-full">
  
  {/* Ingredients Shelf */}
  <div className="w-full md:w-64 flex flex-col gap-3">
   <h3 className="font-bold" style={{color: 'rgb(var(--slate-700))'}}>Ingredients (Select All)</h3>
   {required.map(ing => (
   <button 
    key={ing}
    onClick={() => addIngredient(ing)}
    disabled={ingredients.includes(ing) || isDone}
    className={`p-4 text-left rounded-xl border-2 transition-all flex justify-between items-center ${ingredients.includes(ing) ? 'bg-emerald-50 border-emerald-500 text-emerald-800 opacity-50' : 'bg-slate-50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] hover:border-slate-300 dark:border-[#1c1b1b]'}`}
   >
    <span className="font-bold" style={{color: ingredients.includes(ing) ? undefined : 'rgb(var(--slate-800))'}}>{ing}</span>
    {ingredients.includes(ing) && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
   </button>
   ))}
  </div>

  {/* The Container */}
  <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-3xl shadow-lg border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col items-center justify-center relative min-h-[400px]">
   
   <div className={`w-48 h-64 border-8 border-slate-300 dark:border-[#1c1b1b] rounded-xl relative overflow-hidden flex flex-col justify-end bg-slate-50 dark:bg-[#121212] transition-transform duration-75 ${isShaking ? 'animate-[shake_0.1s_infinite]' : ''}`}>
    
    {/* Cap */}
    <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 w-32 h-6 bg-blue-500 rounded-t-lg z-20 /20 dark:border-teal-900 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40" />

    {/* Layers based on ingredients */}
    {ingredients.map((ing) => (
    <div 
     key={ing} 
     className={`w-full h-1/4 flex items-center justify-center font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-[#a1a1aa] ${isDone ? 'bg-slate-200 dark:bg-slate-700 dark:bg-[#121212]' : 'bg-blue-100 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800'}`}
     style={{ 
     backgroundColor: isDone ? '#f1f5f9' : 
         ing === 'Washing Soda' ? '#e0f2fe' : 
         ing === 'Baking Soda' ? '#f0f9ff' : 
         ing === 'Borax' ? '#bae6fd' : '#fef08a'
     }}
    >
     {!isDone && ing}
    </div>
    ))}

    {isDone && (
    <div className="absolute inset-0 flex items-center justify-center">
     <div className="bg-slate-50 dark:bg-[#121212]/80 px-4 py-2 rounded font-bold text-slate-800 dark:text-[#ffffff] rotate-[-15deg] border-2 border-slate-300 dark:border-[#1c1b1b]">
     DETERGENT
     </div>
    </div>
    )}
   </div>

   <div className="mt-12 h-16">
   {!isDone ? (
    <button 
    onClick={mix}
    disabled={ingredients.length < 4 || isShaking}
    className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${ingredients.length === 4 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg active:scale-95' : 'bg-slate-200 dark:bg-[#121212] text-slate-400'}`}
    >
    {isShaking ? 'Shaking...' : ingredients.length === 4 ? 'Shake & Mix!' : 'Add all ingredients first'}
    </button>
   ) : (
    <div className="text-emerald-600 font-bold text-xl flex items-center gap-2">
    <CheckCircle2 className="w-6 h-6" /> Ready for Laundry!
    </div>
   )}
   </div>

  </div>
  </div>
  <style dangerouslySetInnerHTML={{__html: `
  @keyframes shake {
   0% { transform: translate(2px, 1px) rotate(0deg); }
   10% { transform: translate(-1px, -2px) rotate(-2deg); }
   20% { transform: translate(-3px, 0px) rotate(2deg); }
   30% { transform: translate(0px, 2px) rotate(0deg); }
   40% { transform: translate(1px, -1px) rotate(2deg); }
   50% { transform: translate(-1px, 2px) rotate(-2deg); }
   60% { transform: translate(-3px, 1px) rotate(0deg); }
   70% { transform: translate(2px, 1px) rotate(-2deg); }
   80% { transform: translate(-1px, -1px) rotate(2deg); }
   90% { transform: translate(2px, 2px) rotate(0deg); }
   100% { transform: translate(1px, -2px) rotate(-2deg); }
  }
  `}} />
 </div>
 );
}
