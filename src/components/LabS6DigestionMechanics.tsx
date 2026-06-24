import { useState } from 'react';
import { Utensils, Scissors as KnifeIcon } from 'lucide-react'; // Using Scissors for Knife
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS6DigestionMechanics({ onExit }: LabProps) {
  const [bananaState, setBananaState] = useState<'whole' | 'pieces' | 'crushed' | 'mashed'>('whole');

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-orange-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 4: Physical Digestion Mechanics" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-orange-100 max-w-2xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">Relating Tools to Digestion</h2>
          <p className="text-slate-600 mb-6">Physical digestion involves breaking down food into smaller pieces without chemical changes. Apply the tools to the banana to simulate this process.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setBananaState('pieces')}
              disabled={bananaState !== 'whole'}
              className="flex flex-col items-center gap-3 p-4 bg-orange-100 rounded-xl hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed w-32 border border-orange-200"
            >
              <KnifeIcon className="w-8 h-8 text-orange-700" />
              <span className="font-bold text-orange-900">Knife</span>
              <span className="text-xs text-orange-700 font-medium">(Incisors)</span>
            </button>
            <button 
              onClick={() => setBananaState('crushed')}
              disabled={bananaState !== 'pieces'}
              className="flex flex-col items-center gap-3 p-4 bg-amber-100 rounded-xl hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed w-32 border border-amber-200"
            >
              <Utensils className="w-8 h-8 text-amber-700" />
              <span className="font-bold text-amber-900">Spoon</span>
              <span className="text-xs text-amber-700 font-medium">(Premolars)</span>
            </button>
            <button 
              onClick={() => setBananaState('mashed')}
              disabled={bananaState !== 'crushed'}
              className="flex flex-col items-center gap-3 p-4 bg-yellow-100 rounded-xl hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed w-32 border border-yellow-200"
            >
              <Utensils className="w-8 h-8 text-yellow-700 rotate-180" />
              <span className="font-bold text-yellow-900">Fork</span>
              <span className="text-xs text-yellow-700 font-medium">(Molars/Tongue)</span>
            </button>
          </div>
        </div>

        {/* The Bowl and Banana */}
        <div className="w-96 h-96 relative flex items-center justify-center">
          {/* Wooden Cutting Board / Bowl */}
          <div className="absolute w-full h-full bg-orange-200 rounded-full border-8 border-orange-300 shadow-inner overflow-hidden flex items-center justify-center">
            
            {bananaState === 'whole' && (
              <div className="w-48 h-16 bg-yellow-400 rounded-full border-2 border-yellow-500 transform -rotate-12 shadow-lg relative flex items-center overflow-hidden">
                 <div className="w-4 h-full bg-green-500 absolute left-0"></div>
                 <div className="w-4 h-full bg-slate-800 absolute right-0"></div>
              </div>
            )}

            {bananaState === 'pieces' && (
              <div className="flex gap-2 flex-wrap justify-center p-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="w-12 h-12 bg-yellow-200 rounded-full border-2 border-yellow-300 flex items-center justify-center">
                    <div className="w-6 h-6 border border-yellow-400 rounded-full border-dashed"></div>
                  </div>
                ))}
              </div>
            )}

            {bananaState === 'crushed' && (
              <div className="w-48 h-48 bg-yellow-100 rounded-full blob-shape border-2 border-yellow-300 relative">
                 <div className="absolute w-8 h-8 bg-slate-50/50 rounded-full top-8 left-12 blur-sm"></div>
                 <div className="absolute w-6 h-6 bg-yellow-300/50 rounded-full bottom-12 right-12 blur-sm"></div>
              </div>
            )}

            {bananaState === 'mashed' && (
              <div className="w-64 h-64 bg-yellow-50 rounded-full flex items-center justify-center relative">
                 {/* Milk added */}
                 <div className="w-56 h-56 bg-slate-50/80 rounded-full blob-shape-alt border border-yellow-100 flex items-center justify-center shadow-inner">
                    <div className="w-40 h-40 bg-yellow-100/80 blob-shape border border-yellow-200"></div>
                 </div>
              </div>
            )}
            
          </div>
        </div>

        {bananaState === 'mashed' && (
          <div className="mt-8 p-4 bg-green-100 text-green-800 rounded-xl border border-green-200 text-center font-medium max-w-xl">
            You successfully simulated physical digestion! The knife acted as incisors to cut, the spoon acted as premolars to crush, and the fork (with milk/saliva) acted as molars and the tongue to mash it into a swallowable bolus.
            <button onClick={() => setBananaState('whole')} className="block mx-auto mt-4 px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700">Reset</button>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .blob-shape { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
        .blob-shape-alt { border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%; }
      `}} />
    </div>
  );
}
