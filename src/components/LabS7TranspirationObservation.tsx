import { useState, useEffect } from 'react';
import { Clock, Info } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7TranspirationObservation({ onExit }: LabProps) {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: number;
    if (running && time < 100) {
      interval = window.setInterval(() => {
        setTime(t => Math.min(100, t + 10));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [running, time]);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-green-50 font-sans">
      <LabHeader onExit={onExit} title="Unit 1: Transpiration Observation" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-green-100 max-w-2xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Water Loss in Plants</h2>
          <p className="text-slate-600 mb-6">Two branches are covered with clear polythene bags. One branch has leaves, and the other has been stripped bare. Wait to observe condensation forming inside the bags.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setRunning(!running)}
              disabled={time === 100}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              <Clock className="w-5 h-5 mr-2" />
              {running ? 'Pause Time' : time === 100 ? 'Experiment Complete' : 'Wait 30 Minutes'}
            </button>
            <button 
              onClick={() => { setTime(0); setRunning(false); }}
              className="flex items-center px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Experiment Setup */}
        <div className="flex gap-12 items-end justify-center">
          
          {/* Branch A (With Leaves) */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-slate-700 mb-2">Branch A (With Leaves)</h3>
            <div className="relative w-48 h-64 flex justify-center items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
              {/* Plant Stem */}
              <div className="w-4 h-40 bg-green-700 relative z-10">
                {/* Leaves */}
                <div className="absolute top-4 -left-6 w-12 h-6 bg-green-500 rounded-full rotate-[-20deg]"></div>
                <div className="absolute top-12 -right-6 w-12 h-6 bg-green-500 rounded-full rotate-[20deg]"></div>
                <div className="absolute top-20 -left-6 w-12 h-6 bg-green-500 rounded-full rotate-[-10deg]"></div>
                <div className="absolute top-28 -right-6 w-12 h-6 bg-green-500 rounded-full rotate-[30deg]"></div>
              </div>
              
              {/* Polythene Bag */}
              <div className="absolute bottom-8 w-40 h-48 border-2 border-slate-300 bg-slate-100/30 rounded-t-3xl rounded-b-lg border-dashed flex justify-center items-center z-20">
                {/* Condensation Drops */}
                <div 
                  className="w-full h-full relative transition-opacity duration-1000"
                  style={{ opacity: time / 100 }}
                >
                  <div className="absolute top-4 left-8 w-2 h-2 bg-blue-400 rounded-full drop-shadow"></div>
                  <div className="absolute top-12 right-6 w-3 h-3 bg-blue-400 rounded-full drop-shadow"></div>
                  <div className="absolute top-24 left-4 w-2 h-2 bg-blue-400 rounded-full drop-shadow"></div>
                  <div className="absolute top-32 right-12 w-2 h-2 bg-blue-400 rounded-full drop-shadow"></div>
                  <div className="absolute top-10 left-20 w-3 h-3 bg-blue-400 rounded-full drop-shadow"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Branch B (No Leaves) */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-slate-700 mb-2">Branch B (Bare)</h3>
            <div className="relative w-48 h-64 flex justify-center items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
              {/* Plant Stem */}
              <div className="w-4 h-40 bg-green-700 relative z-10">
                 {/* Empty knots where leaves were */}
                 <div className="absolute top-4 -left-1 w-2 h-2 bg-green-900 rounded-full"></div>
                 <div className="absolute top-12 -right-1 w-2 h-2 bg-green-900 rounded-full"></div>
                 <div className="absolute top-20 -left-1 w-2 h-2 bg-green-900 rounded-full"></div>
              </div>
              
              {/* Polythene Bag */}
              <div className="absolute bottom-8 w-40 h-48 border-2 border-slate-300 bg-slate-100/30 rounded-t-3xl rounded-b-lg border-dashed z-20">
                 {/* No condensation */}
              </div>
            </div>
          </div>

        </div>

        {time === 100 && (
          <div className="mt-8 p-4 bg-green-100 text-green-800 rounded-xl border border-green-200 text-center font-medium max-w-xl">
            <div className="flex justify-center mb-2"><Info className="w-6 h-6" /></div>
            Water droplets appeared only in the bag covering the leafy branch! This shows that water evaporates from the aerial parts of the plant, specifically the leaves, through a process called transpiration.
          </div>
        )}
      </div>
    </div>
  );
}
