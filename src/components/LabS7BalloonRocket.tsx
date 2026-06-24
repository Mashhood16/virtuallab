import { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabS7BalloonRocket({ onExit }: LabProps) {
  const [launched, setLaunched] = useState(false);
  const [position, setPosition] = useState(0); // 0 to 100
  const [air, setAir] = useState(100);

  useEffect(() => {
    let interval: number;
    if (launched && position < 100) {
      interval = window.setInterval(() => {
        setPosition(p => Math.min(100, p + 2));
        setAir(a => Math.max(0, a - 2));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [launched, position]);

  const reset = () => {
    setLaunched(false);
    setPosition(0);
    setAir(100);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-900 font-sans">
      <LabHeader onExit={onExit} variant="dark" title="Unit 8: Force and Motion (Balloon Rocket)" />

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 max-w-2xl w-full text-center mb-8">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Action and Reaction Forces</h2>
          <p className="text-slate-300 mb-6">A balloon is taped to a straw threaded on a string. Release the pinched neck of the balloon and observe Newton's Third Law of Motion in action.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setLaunched(true)}
              disabled={launched}
              className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Release Balloon
            </button>
            <button 
              onClick={reset}
              className="flex items-center px-6 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="w-full max-w-5xl mt-16 relative">
           
           {/* The String */}
           <div className="w-full h-1 bg-slate-600 absolute top-1/2 -mt-[0.5px]"></div>
           
           {/* Supports */}
           <div className="absolute top-1/2 -mt-16 left-0 w-4 h-32 bg-slate-700 rounded shadow-lg border border-slate-600"></div>
           <div className="absolute top-1/2 -mt-16 right-0 w-4 h-32 bg-slate-700 rounded shadow-lg border border-slate-600"></div>

           {/* The Rocket Assembly */}
           <div 
             className="absolute top-1/2 -mt-16 transition-all duration-75 ease-linear flex flex-col items-center"
             style={{ left: `calc(20px + ${position * 0.8}%)` }}
           >
              {/* Force Vectors (Visible during launch) */}
              {launched && position < 100 && (
                 <>
                   {/* Action Force (Air pushing back) */}
                   <div className="absolute top-1/2 left-[-60px] flex items-center">
                     <span className="text-cyan-400 font-bold mr-2 whitespace-nowrap text-sm drop-shadow-md">Action (Air)</span>
                     <div className="w-12 h-1 bg-cyan-400 relative">
                        <div className="absolute left-0 top-1/2 -mt-1.5 w-3 h-3 border-l-2 border-b-2 border-cyan-400 transform rotate-45"></div>
                     </div>
                   </div>
                   {/* Reaction Force (Balloon pushing forward) */}
                   <div className="absolute top-1/2 right-[-80px] flex items-center">
                     <div className="w-12 h-1 bg-red-400 relative">
                        <div className="absolute right-0 top-1/2 -mt-1.5 w-3 h-3 border-t-2 border-r-2 border-red-400 transform rotate-45"></div>
                     </div>
                     <span className="text-red-400 font-bold ml-2 whitespace-nowrap text-sm drop-shadow-md">Reaction (Thrust)</span>
                   </div>
                 </>
              )}

              {/* Straw */}
              <div className="w-24 h-4 bg-yellow-400/80 rounded-sm border border-yellow-500 mb-2 relative z-10">
                 {/* Tape */}
                 <div className="absolute top-1 left-4 w-4 h-12 bg-slate-50/50 -rotate-12 backdrop-blur-sm z-30"></div>
                 <div className="absolute top-1 right-4 w-4 h-12 bg-slate-50/50 rotate-12 backdrop-blur-sm z-30"></div>
              </div>

              {/* Balloon */}
              <div className="relative flex items-center z-20">
                 {/* Balloon Neck */}
                 <div className="w-6 h-4 bg-red-500 rounded-l"></div>
                 {/* Balloon Body (shrinks as air leaves) */}
                 <div 
                   className="bg-red-500 rounded-[30%_50%_50%_30%_/_50%_50%_50%_50%] transition-all duration-75 origin-left"
                   style={{ width: `${60 + air}px`, height: `${40 + air * 0.8}px` }}
                 ></div>

                 {/* Escaping Air Particles */}
                 {launched && air > 0 && (
                   <div className="absolute left-[-40px] top-1/2 -mt-2 w-12 h-4 overflow-hidden">
                     <div className="w-2 h-2 bg-slate-50/50 rounded-full animate-[slide_0.2s_linear_infinite]"></div>
                     <div className="w-3 h-3 bg-slate-50/50 rounded-full animate-[slide_0.3s_linear_infinite_0.1s]"></div>
                   </div>
                 )}
                 <style>{`
                   @keyframes slide {
                     from { transform: translateX(40px); opacity: 1; }
                     to { transform: translateX(0px); opacity: 0; }
                   }
                 `}</style>
              </div>
           </div>
        </div>

        {position === 100 && (
          <div className="mt-32 p-6 bg-slate-800 shadow-xl text-slate-200 rounded-xl border-t-4 border-red-500 max-w-2xl text-center">
            <h3 className="text-red-400 font-bold text-lg mb-2">Newton's Third Law</h3>
            <p><strong>"For every action, there is an equal and opposite reaction."</strong><br/><br/>The <em>action</em> is the balloon pushing the air out backwards. The <em>reaction</em> is the air pushing the balloon forwards with an equal amount of force!</p>
          </div>
        )}
      </div>
    </div>
  );
}
