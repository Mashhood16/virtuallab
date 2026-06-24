import { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, MousePointerClick, RefreshCw} from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP9Inertia({ onExit }: { onExit?: () => void }) {
  const [flickForce, setFlickForce] = useState(50);
  const [animationState, setAnimationState] = useState<'idle' | 'flicking' | 'done'>('idle');
  
  // Coin and Card positions
  const [cardX, setCardX] = useState(0);
  const [coinX, setCoinX] = useState(0);
  const [coinY, setCoinY] = useState(0); // 0 is top of glass, positive is dropping down
  
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const resetSim = () => {
    clearInterval(intervalRef.current);
    setCardX(0);
    setCoinX(0);
    setCoinY(0);
    setAnimationState('idle');
    setFeedback(null);
  };

  const flick = () => {
    clearInterval(intervalRef.current);
    setAnimationState('flicking');
    
    let currentFrame = 0;
    const maxFrames = 30;
    
    intervalRef.current = window.setInterval(() => {
      currentFrame++;
      
      if (flickForce < 40) {
        // Force too low - friction moves both slowly
        setCardX(prev => prev + 2);
        setCoinX(prev => prev + 2);
      } else {
        // Force sufficient - card moves fast, coin stays due to inertia, then drops
        setCardX(prev => prev + flickForce / 2);
        if (currentFrame > 5) {
          // Card has moved out from under
          setCoinY(prev => Math.min(prev + 10, 100)); // Drop into glass
        }
      }

      if (currentFrame >= maxFrames) {
        clearInterval(intervalRef.current);
        setAnimationState('done');
      }
    }, 16);
  };

  const checkAnalysis = () => {
    if (q1 === 'b' && q2 === 'a') {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none text-slate-800">
      <LabHeader onExit={onExit} title="Physics Grade 9: Inertia" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Column 1: Theory */}
        <div className="bg-slate-50 rounded-xl shadow-sm border p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold border-b pb-2">Theory: Newton's First Law</h2>
          <div className="prose prose-sm space-y-4">
            <p>
              <strong>Newton's First Law of Motion (Law of Inertia):</strong> An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.
            </p>
            <p>
              <strong>Inertia</strong> is the tendency of an object to resist changes in its state of motion. The more mass an object has, the more inertia it has.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-900 mt-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2"><MousePointerClick size={16}/> The Coin Drop Experiment</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li>A coin rests on a cardboard card over a glass.</li>
                <li>If you apply a <em>slow/small force</em> to the card, friction pulls the coin along with it.</li>
                <li>If you apply a <em>sharp, large force</em> (flick), the card accelerates rapidly. The static friction is overcome quickly, and the coin's inertia keeps it in place until gravity pulls it straight down.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Column 2: Simulator */}
        <div className="bg-slate-50 rounded-xl shadow-sm border p-6 flex flex-col items-center">
          <h2 className="text-lg font-bold border-b pb-2 w-full mb-6">Simulator</h2>

          <div className="relative w-64 h-80 bg-gradient-to-b from-blue-50 to-slate-100 rounded-xl border-2 border-slate-200 overflow-hidden mb-8 shadow-inner">
            {/* Glass */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-40 border-x-4 border-b-4 border-blue-200 bg-blue-50/50 rounded-b-xl shadow-sm backdrop-blur-sm"></div>
            
            {/* Card */}
            <div 
              className="absolute w-40 h-2 bg-[#d4a373] shadow-md border-b border-[#bc8a5f]"
              style={{ bottom: '160px', left: `calc(50% - 80px + ${cardX}px)` }}
            ></div>
            
            {/* Coin */}
            <div 
              className="absolute w-12 h-4 bg-yellow-400 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] border border-yellow-600 z-10"
              style={{ bottom: `calc(162px - ${coinY}px)`, left: `calc(50% - 24px + ${coinX}px)` }}
            >
              <div className="absolute inset-1 rounded-full border border-yellow-500/50"></div>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 flex justify-between mb-1">
                <span>Flick Force</span>
                <span>{flickForce} N</span>
              </label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={flickForce} 
                onChange={(e) => setFlickForce(parseInt(e.target.value))}
                disabled={animationState !== 'idle'}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={flick}
                disabled={animationState !== 'idle'}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors shadow-md active:scale-95"
              >
                FLICK!
              </button>
              <button 
                onClick={resetSim}
                className="px-4 py-3 bg-slate-200 text-slate-800 font-bold rounded-lg hover:bg-slate-300 transition-colors"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Analysis */}
        <div className="bg-slate-50 rounded-xl shadow-sm border p-6 flex flex-col gap-6">
          <h2 className="text-lg font-bold border-b pb-2">Analysis</h2>

          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded border">
              <p className="text-sm font-semibold mb-2">1. Why did the coin drop into the glass when flicked hard?</p>
              <div className="space-y-2 text-sm">
                <label className="flex items-start gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded">
                  <input type="radio" name="q1" checked={q1==='a'} onChange={()=>setQ1('a')} className="mt-1" />
                  <span>The card transferred its kinetic energy to the coin.</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded">
                  <input type="radio" name="q1" checked={q1==='b'} onChange={()=>setQ1('b')} className="mt-1" />
                  <span>The coin's inertia resisted sideways motion while gravity pulled it down.</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded">
                  <input type="radio" name="q1" checked={q1==='c'} onChange={()=>setQ1('c')} className="mt-1" />
                  <span>The flicking force pushed the coin directly downward.</span>
                </label>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded border">
              <p className="text-sm font-semibold mb-2">2. If you slowly pull the card instead of flicking it, what happens?</p>
              <div className="space-y-2 text-sm">
                <label className="flex items-start gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded">
                  <input type="radio" name="q2" checked={q2==='a'} onChange={()=>setQ2('a')} className="mt-1" />
                  <span>Static friction is not broken; the coin moves with the card.</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded">
                  <input type="radio" name="q2" checked={q2==='b'} onChange={()=>setQ2('b')} className="mt-1" />
                  <span>The coin will float in the air.</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded">
                  <input type="radio" name="q2" checked={q2==='c'} onChange={()=>setQ2('c')} className="mt-1" />
                  <span>The coin drops into the glass immediately.</span>
                </label>
              </div>
            </div>

            <button 
              onClick={checkAnalysis}
              disabled={!q1 || !q2}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Submit Answers
            </button>

            {feedback === 'correct' && (
              <div className="p-3 bg-green-100 text-green-800 rounded-lg flex items-start gap-2">
                <CheckCircle size={20} className="shrink-0 mt-0.5" />
                <span>Great job! The rapid force overcomes static friction quickly, allowing the coin's inertia to keep it over the glass until it falls.</span>
              </div>
            )}
            {feedback === 'incorrect' && (
              <div className="p-3 bg-red-100 text-red-800 rounded-lg flex items-start gap-2">
                <XCircle size={20} className="shrink-0 mt-0.5" />
                <span>Some answers are incorrect. Review the theory on inertia and friction, and try again.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
