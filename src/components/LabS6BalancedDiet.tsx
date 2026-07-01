import { useState } from 'react';
import { UserPlus, Apple, MessageCircle, Utensils } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabS6BalancedDiet({ onExit }: LabProps) {
 const [tab, setTab] = useState<'roleplay' | 'diary'>('roleplay');

 // Diary State
 const [diary, setDiary] = useState({
 breakfast: { fruit: '', grain: '', dairy: '', protein: '', veg: '' },
 lunch: { fruit: '', grain: '', dairy: '', protein: '', veg: '' },
 dinner: { fruit: '', grain: '', dairy: '', protein: '', veg: '' },
 });

 return (
 <div className="flex flex-col h-screen bg-rose-50 font-sans dark:!bg-[#000000] dark:border-[#1c1b1b]">
  <LabHeader onExit={onExit} title="Unit 3: Balanced Diet Activities" />

  <div className="flex-1 flex flex-col p-8 items-center lg:overflow-y-auto">
  
  <div className="flex gap-4 mb-8">
   <button 
   onClick={() => setTab('roleplay')}
   className={`px-6 py-3 rounded-xl border-2 font-bold ${tab === 'roleplay' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-rose-300'}`}
   >
   Activity 3.2: Royal Chef Role Play
   </button>
   <button 
   onClick={() => setTab('diary')}
   className={`px-6 py-3 rounded-xl border-2 font-bold ${tab === 'diary' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-orange-300'}`}
   >
   Activity 3.4: Daily Food Diary
   </button>
  </div>

  {tab === 'roleplay' && (
   <div className="w-full max-w-4xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8">
   <h2 className="text-2xl font-bold text-rose-800 mb-6 flex items-center gap-2"><UserPlus /> Classroom Role Play Organizer</h2>
   
   <div className="grid grid-cols-2 gap-8">
    <div className="space-y-6">
    <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
     <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2 dark:text-[#ffffff]">👑 The Royal Family</h3>
     <p className="text-sm text-amber-800 dark:text-[#ffffff]">1 Student acts as the King or Queen. They will listen to all the pitches and ultimately hire the new personal chef based on the healthiest and tastiest meal.</p>
    </div>
    
    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 dark:bg-teal-950/20 dark:border-teal-900">
     <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2 dark:text-[#ffffff]">🩺 The Royal Advisors</h3>
     <p className="text-sm text-blue-800 dark:text-[#ffffff]">5-6 Students act as advisors (e.g., Doctor, Fitness Instructor, Nutritionist). They can ask the chef candidates questions about vitamins, calories, and fats.</p>
    </div>
    </div>

    <div className="bg-rose-50 p-6 rounded-xl border border-rose-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
     <h3 className="font-bold text-rose-900 mb-4 flex items-center gap-2"><Utensils /> Chef Candidates</h3>
     <p className="text-sm text-rose-800 mb-6">The rest of the class acts as candidates for the royal chef position. Each candidate must prepare a pitch for their ideal meal.</p>
     
     <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-rose-100">
     <h4 className="font-bold text-sm text-slate-700 dark:text-[#ffffff] mb-2">Pitch Guidelines:</h4>
     <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-[#a1a1aa] space-y-1">
      <li>What is the meal?</li>
      <li>What food groups does it cover?</li>
      <li>Why is it healthy for the King/Queen?</li>
      <li>How is it cooked? (e.g. baked, not fried)</li>
     </ul>
     </div>
    </div>
   </div>

   <div className="mt-8 p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg flex items-start gap-4">
    <MessageCircle className="w-6 h-6 text-slate-400 shrink-0" />
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] italic">"Your Majesty, I propose a grilled salmon salad with quinoa. It provides Omega-3 for your brain, complex carbohydrates for lasting energy, and essential vitamins to keep you ruling for years to come!"</p>
   </div>
   </div>
  )}

  {tab === 'diary' && (
   <div className="w-full max-w-5xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col items-center">
   <h2 className="text-2xl font-bold text-orange-800 mb-2 flex items-center gap-2"><Apple /> My Healthy Plate Diary</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-8 text-center max-w-2xl">Fill out this food diary to plan a balanced diet for a single day. Ensure you include items from all five major food groups across your meals.</p>

   <div className="w-full overflow-x-auto">
    <table className="w-full text-left border-collapse border border-slate-200 dark:border-[#1c1b1b] rounded-lg overflow-hidden">
    <thead>
     <tr className="bg-orange-100 text-orange-900">
     <th className="p-4 border border-slate-200 dark:border-[#1c1b1b]">Meal</th>
     <th className="p-4 border border-slate-200 dark:border-[#1c1b1b]">Fruit 🍎</th>
     <th className="p-4 border border-slate-200 dark:border-[#1c1b1b]">Grain 🍞</th>
     <th className="p-4 border border-slate-200 dark:border-[#1c1b1b]">Dairy 🥛</th>
     <th className="p-4 border border-slate-200 dark:border-[#1c1b1b]">Protein 🍗</th>
     <th className="p-4 border border-slate-200 dark:border-[#1c1b1b]">Vegetable 🥦</th>
     </tr>
    </thead>
    <tbody>
     {['breakfast', 'lunch', 'dinner'].map((meal) => (
     <tr key={meal} className="hover:bg-slate-50 dark:bg-[#121212]">
      <td className="p-4 border border-slate-200 dark:border-[#1c1b1b] font-bold text-slate-700 dark:text-[#ffffff] capitalize">{meal === 'lunch' ? 'Lunchbox' : meal}</td>
      {['fruit', 'grain', 'dairy', 'protein', 'veg'].map((group) => (
      <td key={group} className="p-2 border border-slate-200 dark:border-[#1c1b1b]">
       <input 
       type="text" 
       className="w-full p-2 text-sm border border-slate-200 dark:border-[#1c1b1b] rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
       placeholder="..."
       value={(diary as any)[meal][group]}
       onChange={(e) => setDiary({...diary, [meal]: {...(diary as any)[meal], [group]: e.target.value}})}
       />
      </td>
      ))}
     </tr>
     ))}
    </tbody>
    </table>
   </div>

   <button className="mt-8 px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40">Save Food Diary</button>
   </div>
  )}

  </div>
 </div>
 );
}
