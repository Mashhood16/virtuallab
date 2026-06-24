import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7ReverseFlowchart({ onExit }: LabProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const options = [
    "To decide whether to eat lunch or dinner.",
    "To determine where a student should be based on the time of day.",
    "To calculate a student's final grade.",
    "To plan a weekend vacation."
  ];

  const correctOption = 1; // "To determine where a student should be..."

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto items-center">
        <LabHeader onExit={onExit} title="Reverse Engineering a Flowchart" />

        <div className="max-w-4xl w-full">
          <h1 className="text-3xl font-bold mb-2">Reverse Engineering a Flowchart</h1>
          <p className="text-slate-600 mb-8">Analyze the flowchart below and identify the original problem it was designed to solve.</p>

          <div className="flex gap-8">
            {/* Flowchart Visual */}
            <div className="flex-1 bg-slate-50 p-8 rounded-xl shadow border border-slate-200 flex flex-col items-center">
              <div className="px-6 py-2 bg-blue-100 border-2 border-blue-400 rounded-full font-bold mb-6">Start</div>
              <div className="w-1 h-6 bg-slate-300" />
              <div className="px-6 py-3 bg-indigo-50 border-2 border-indigo-300 font-medium skew-x-[-15deg] mb-6">
                <span className="block skew-x-[15deg]">Check Time (T)</span>
              </div>
              
              <div className="w-1 h-6 bg-slate-300" />
              
              <div className="w-32 h-32 bg-yellow-50 border-2 border-yellow-400 rotate-45 flex items-center justify-center mb-6">
                <span className="-rotate-45 font-bold text-center">Is T <br/> between<br/> 8am - 2pm?</span>
              </div>

              <div className="flex w-full justify-between px-12 -mt-16 mb-16">
                <div className="flex items-center">
                  <div className="w-12 h-1 bg-slate-300" />
                  <span className="mx-2 font-bold text-emerald-600">Yes</span>
                  <div className="px-4 py-2 bg-emerald-50 border-2 border-emerald-300 skew-x-[-15deg]">
                     <span className="block skew-x-[15deg]">Go to School</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mx-2 font-bold text-rose-600">No</span>
                  <div className="w-12 h-1 bg-slate-300" />
                </div>
              </div>

              <div className="w-32 h-32 bg-yellow-50 border-2 border-yellow-400 rotate-45 flex items-center justify-center mb-6 relative">
                <span className="-rotate-45 font-bold text-center">Is T <br/> between<br/> 4pm - 6pm?</span>
                <div className="absolute -top-24 right-40 w-1 h-24 bg-slate-300" />
              </div>

              <div className="flex w-full justify-between px-12 -mt-16 mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-1 bg-slate-300" />
                  <span className="mx-2 font-bold text-emerald-600">Yes</span>
                  <div className="px-4 py-2 bg-emerald-50 border-2 border-emerald-300 skew-x-[-15deg]">
                     <span className="block skew-x-[15deg]">Go to Playground</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mx-2 font-bold text-rose-600">No</span>
                  <div className="w-1 h-16 bg-slate-300" />
                </div>
              </div>
              
              <div className="px-4 py-2 bg-slate-100 border-2 border-slate-400 skew-x-[-15deg] mb-6 ml-auto mr-12">
                 <span className="block skew-x-[15deg]">Stay at Home</span>
              </div>

              <div className="w-1 h-6 bg-slate-300 mb-6" />
              <div className="px-6 py-2 bg-rose-100 border-2 border-rose-400 rounded-full font-bold">End</div>
            </div>

            {/* Quiz Panel */}
            <div className="w-96 flex flex-col gap-4">
              <h3 className="font-bold text-xl mb-2 text-slate-800">What is the problem statement?</h3>
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedOption === i 
                      ? (i === correctOption ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-rose-100 border-rose-500 text-rose-900') 
                      : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-medium">{opt}</span>
                  {selectedOption === i && i === correctOption && <CheckCircle className="w-5 h-5 text-emerald-600 mt-2" />}
                </button>
              ))}

              {selectedOption !== null && selectedOption !== correctOption && (
                <p className="text-rose-600 font-bold mt-2">Incorrect. Look at the decisions being made based on time.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
