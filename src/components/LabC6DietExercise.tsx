import { useState } from 'react';
import { Activity, Pizza, Flame } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6DietExercise({ onExit }: LabProps) {
  const [caloriesIn, setCaloriesIn] = useState(2000);
  const [caloriesOut, setCaloriesOut] = useState(2000);

  const foods = [
    { name: 'Apple', cal: 95 },
    { name: 'Burger', cal: 500 },
    { name: 'Pizza Slice', cal: 285 },
    { name: 'Salad', cal: 150 },
    { name: 'Soda', cal: 140 }
  ];

  const exercises = [
    { name: 'Walking (30m)', cal: 150 },
    { name: 'Running (30m)', cal: 300 },
    { name: 'Cycling (30m)', cal: 250 },
    { name: 'Swimming (30m)', cal: 200 },
    { name: 'Yoga (30m)', cal: 100 }
  ];

  const netCalories = caloriesIn - caloriesOut;

  const getStatus = () => {
    if (netCalories > 200) return { text: 'Weight Gain', color: 'text-orange-500' };
    if (netCalories < -200) return { text: 'Weight Loss', color: 'text-blue-500' };
    return { text: 'Weight Maintenance', color: 'text-green-500' };
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Eating and Exercise Research" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">
        

        <p className="text-slate-600 dark:text-slate-300 mb-8">Investigate the relationship between calories consumed and calories burned.</p>

        <div className="flex gap-8 flex-1">
          
          <div className="w-1/3 flex flex-col gap-6">
            {/* Calories In */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-rose-600">
                <Pizza className="w-5 h-5" /> Consumed (Food)
              </h2>
              <div className="text-4xl font-bold text-rose-500 mb-6">{caloriesIn} kcal</div>
              <div className="space-y-2">
                {foods.map(f => (
                  <button 
                    key={f.name}
                    onClick={() => setCaloriesIn(c => c + f.cal)}
                    className="w-full flex justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500 hover:border-rose-300 hover:bg-rose-50 transition-colors"
                  >
                    <span className="font-medium">{f.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">+{f.cal}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setCaloriesIn(2000)} className="w-full mt-4 text-sm text-slate-400 hover:text-slate-600 dark:text-slate-300">Reset to Base BMR (2000)</button>
            </div>

            {/* Calories Out */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-600">
                <Flame className="w-5 h-5" /> Burned (Exercise)
              </h2>
              <div className="text-4xl font-bold text-indigo-500 mb-6">{caloriesOut} kcal</div>
              <div className="space-y-2">
                {exercises.map(e => (
                  <button 
                    key={e.name}
                    onClick={() => setCaloriesOut(c => c + e.cal)}
                    className="w-full flex justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <span className="font-medium">{e.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">+{e.cal}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setCaloriesOut(2000)} className="w-full mt-4 text-sm text-slate-400 hover:text-slate-600 dark:text-slate-300">Reset to Base BMR (2000)</button>
            </div>
          </div>

          {/* Results Analysis */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-8 flex flex-col">
            <h2 className="text-2xl font-bold mb-8">Science Analysis</h2>

            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Balance Scale Visualization */}
              <div className="relative w-full max-w-md h-64 mb-12">
                <div className="absolute bottom-0 w-4 h-32 bg-slate-800 dark:bg-slate-800 left-1/2 -translate-x-1/2 rounded-t-sm"></div>
                <div 
                  className="absolute bottom-32 w-full h-2 bg-slate-600 dark:bg-slate-800 rounded-full transition-transform duration-500 ease-in-out origin-center"
                  style={{ transform: `rotate(${Math.max(-20, Math.min(20, -(caloriesIn - caloriesOut) * 0.01))}deg)` }}
                >
                  <div className="absolute -left-6 -top-12 w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-rose-500/30 text-xs">IN</div>
                  <div className="absolute -right-6 -top-12 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30 text-xs">OUT</div>
                </div>
              </div>

              <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 w-full max-w-md">
                <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Net Calories</div>
                <div className={`text-5xl font-bold mb-4 ${netCalories > 0 ? 'text-rose-500' : netCalories < 0 ? 'text-indigo-500' : 'text-slate-800 dark:text-slate-100'}`}>
                  {netCalories > 0 ? '+' : ''}{netCalories}
                </div>
                <div className={`text-2xl font-bold ${getStatus().color}`}>
                  Result: {getStatus().text}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-blue-900 mt-8">
              <h3 className="font-bold flex items-center gap-2 mb-2"><Activity className="w-5 h-5" /> Concept Summary</h3>
              <p className="leading-relaxed">
                The human body follows the law of conservation of energy. If the energy consumed (calories from food) is greater than the energy expended (basal metabolic rate + physical activity), the excess energy is stored as fat. If expended energy is greater, the body burns stored fat to compensate.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
