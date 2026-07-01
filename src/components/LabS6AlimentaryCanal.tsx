import { useState } from 'react';
import { CheckCircle, Info } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS6AlimentaryCanal({ onExit }: LabProps) {
 // Simplified ordering task instead of full drag-and-drop to keep it lightweight
 const [order, setOrder] = useState<string[]>([]);
 const organs = ['Mouth', 'Pharynx', 'Esophagus', 'Stomach', 'Small Intestine', 'Large Intestine', 'Rectum'];

 const handleSelect = (organ: string) => {
 if (!order.includes(organ)) {
  setOrder([...order, organ]);
 }
 };

 const handleRemove = (organ: string) => {
 setOrder(order.filter(o => o !== organ));
 };

 const isCorrect = () => {
 return order.length === organs.length && order.every((o, i) => o === organs[i]);
 };

 return (
 <div className="flex flex-col h-screen bg-rose-50 dark:!bg-[#000000] font-sans">
  <LabHeader onExit={onExit} title="Unit 4: Alimentary Canal Pathway" />

  <div className="flex-1 flex flex-col p-8 items-center lg:overflow-y-auto">
  <div className="w-full max-w-4xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8">
   
   <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-xl mb-8 flex gap-4 dark:bg-[#121212] dark:border-[#1c1b1b]">
   <Info className="w-8 h-8 shrink-0 mt-1" />
   <div>
    <h2 className="font-bold text-lg mb-2">Build the Digestive Pathway</h2>
    <p className="text-sm leading-relaxed">
    In Activity 4.2 and 4.3, you learned how each digestive organ is positioned and connected, forming the pathway of food. Click the organs below in the correct order to construct the Alimentary Canal from start to finish.
    </p>
   </div>
   </div>

   <div className="flex gap-8">
   {/* Bank of organs */}
   <div className="w-1/3 bg-slate-50 dark:bg-[#121212] p-6 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-4">Available Organs</h3>
    <div className="flex flex-col gap-2">
     {[...organs].sort().map(organ => {
     const isUsed = order.includes(organ);
     return (
      <button
      key={organ}
      onClick={() => handleSelect(organ)}
      disabled={isUsed}
      className={`p-3 text-left font-bold border-2 rounded-lg transition-colors ${isUsed ? 'bg-slate-100 dark:bg-[#121212]/50 border-slate-200 dark:border-[#1c1b1b] text-slate-400 dark:text-slate-600 cursor-not-allowed' : ' border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:border-rose-400 dark:hover:border-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 shadow-sm'}`}
      >
      {organ}
      </button>
     );
     })}
    </div>
   </div>

   {/* Construction Area */}
   <div className="flex-1 bg-slate-50 dark:bg-[#121212] p-6 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
    <div className="flex items-center justify-between mb-4">
     <h3 className="font-bold text-slate-700 dark:text-[#ffffff]">The Pathway</h3>
     <button onClick={() => setOrder([])} className="text-sm text-slate-500 dark:text-[#71717a] hover:text-slate-800 dark:hover:text-slate-100 font-bold">Clear All</button>
    </div>
    
    <div className="flex flex-col gap-2">
     {order.length === 0 && (
     <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded-xl">
      Select an organ from the left to start the pathway.
     </div>
     )}
     {order.map((organ, index) => (
     <div key={organ} className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full bg-[#121212] dark:bg-slate-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
      {index + 1}
      </div>
      <div className="flex-1 p-3 bg-white border-2 border-rose-400 text-rose-900 dark:!bg-[#121212] dark:border-rose-600 dark:text-rose-100 font-bold rounded-lg flex justify-between items-center shadow-sm">
      {organ}
      <button onClick={() => handleRemove(organ)} className="text-rose-400 hover:text-rose-700 font-normal text-sm px-2">&times; Remove</button>
      </div>
     </div>
     ))}
    </div>

    {order.length === organs.length && (
     <div className={`mt-6 p-4 rounded-xl border-2 flex items-center gap-3 font-bold ${isCorrect() ? 'bg-emerald-50 dark:bg-emerald-900/50 border-emerald-500 text-emerald-800 dark:text-emerald-200' : 'bg-red-50 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200'}`}>
     {isCorrect() ? (
      <>
      <CheckCircle className="w-6 h-6 text-emerald-500" />
      Excellent! You have correctly constructed the alimentary canal.
      </>
     ) : (
      "That is incorrect. Please clear and try again."
     )}
     </div>
    )}
   </div>
   </div>

  </div>
  </div>
 </div>
 );
}
