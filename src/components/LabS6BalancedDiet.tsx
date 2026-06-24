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
    <div className="flex flex-col h-screen bg-rose-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 3: Balanced Diet Activities" />

      <div className="flex-1 flex flex-col p-8 items-center overflow-y-auto">
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setTab('roleplay')}
            className={`px-6 py-3 rounded-xl border-2 font-bold ${tab === 'roleplay' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-600 hover:border-rose-300'}`}
          >
            Activity 3.2: Royal Chef Role Play
          </button>
          <button 
            onClick={() => setTab('diary')}
            className={`px-6 py-3 rounded-xl border-2 font-bold ${tab === 'diary' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-600 hover:border-orange-300'}`}
          >
            Activity 3.4: Daily Food Diary
          </button>
        </div>

        {tab === 'roleplay' && (
          <div className="w-full max-w-4xl bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-rose-800 mb-6 flex items-center gap-2"><UserPlus /> Classroom Role Play Organizer</h2>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                  <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">👑 The Royal Family</h3>
                  <p className="text-sm text-amber-800">1 Student acts as the King or Queen. They will listen to all the pitches and ultimately hire the new personal chef based on the healthiest and tastiest meal.</p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">🩺 The Royal Advisors</h3>
                  <p className="text-sm text-blue-800">5-6 Students act as advisors (e.g., Doctor, Fitness Instructor, Nutritionist). They can ask the chef candidates questions about vitamins, calories, and fats.</p>
                </div>
              </div>

              <div className="bg-rose-50 p-6 rounded-xl border border-rose-200">
                 <h3 className="font-bold text-rose-900 mb-4 flex items-center gap-2"><Utensils /> Chef Candidates</h3>
                 <p className="text-sm text-rose-800 mb-6">The rest of the class acts as candidates for the royal chef position. Each candidate must prepare a pitch for their ideal meal.</p>
                 
                 <div className="bg-slate-50 p-4 rounded-lg border border-rose-100">
                   <h4 className="font-bold text-sm text-slate-700 mb-2">Pitch Guidelines:</h4>
                   <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                     <li>What is the meal?</li>
                     <li>What food groups does it cover?</li>
                     <li>Why is it healthy for the King/Queen?</li>
                     <li>How is it cooked? (e.g. baked, not fried)</li>
                   </ul>
                 </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-4">
              <MessageCircle className="w-6 h-6 text-slate-400 shrink-0" />
              <p className="text-sm text-slate-600 italic">"Your Majesty, I propose a grilled salmon salad with quinoa. It provides Omega-3 for your brain, complex carbohydrates for lasting energy, and essential vitamins to keep you ruling for years to come!"</p>
            </div>
          </div>
        )}

        {tab === 'diary' && (
          <div className="w-full max-w-5xl bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-orange-800 mb-2 flex items-center gap-2"><Apple /> My Healthy Plate Diary</h2>
            <p className="text-slate-600 mb-8 text-center max-w-2xl">Fill out this food diary to plan a balanced diet for a single day. Ensure you include items from all five major food groups across your meals.</p>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-orange-100 text-orange-900">
                    <th className="p-4 border border-slate-200">Meal</th>
                    <th className="p-4 border border-slate-200">Fruit 🍎</th>
                    <th className="p-4 border border-slate-200">Grain 🍞</th>
                    <th className="p-4 border border-slate-200">Dairy 🥛</th>
                    <th className="p-4 border border-slate-200">Protein 🍗</th>
                    <th className="p-4 border border-slate-200">Vegetable 🥦</th>
                  </tr>
                </thead>
                <tbody>
                  {['breakfast', 'lunch', 'dinner'].map((meal) => (
                    <tr key={meal} className="hover:bg-slate-50">
                      <td className="p-4 border border-slate-200 font-bold text-slate-700 capitalize">{meal === 'lunch' ? 'Lunchbox' : meal}</td>
                      {['fruit', 'grain', 'dairy', 'protein', 'veg'].map((group) => (
                        <td key={group} className="p-2 border border-slate-200">
                          <input 
                            type="text" 
                            className="w-full p-2 text-sm border border-slate-200 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
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

            <button className="mt-8 px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700">Save Food Diary</button>
          </div>
        )}

      </div>
    </div>
  );
}
