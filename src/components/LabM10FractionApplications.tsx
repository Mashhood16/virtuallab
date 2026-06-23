import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle2, XCircle, Car, Train, Clock, Hammer } from 'lucide-react';

export default function LabM10FractionApplications({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<'travel' | 'work'>('travel');
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  // Travel state
  const [distance, setDistance] = useState(120);
  const [carSpeed, setCarSpeed] = useState(40);
  const [trainSpeed, setTrainSpeed] = useState(60);

  // Work state
  const [timeA, setTimeA] = useState(3);
  const [timeB, setTimeB] = useState(6);

  // Assessment state
  const [ans, setAns] = useState('');
  const [status, setStatus] = useState<'none' | 'correct' | 'incorrect'>('none');

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setTime(t => {
          const newT = t + 0.05;
          let maxT = 0;
          if (mode === 'travel') {
            maxT = distance / Math.min(carSpeed, trainSpeed);
          } else {
            maxT = 1 / (1/timeA + 1/timeB);
          }
          if (newT >= maxT) {
            setIsPlaying(false);
            return maxT;
          }
          return newT;
        });
      }, 50);
    }
    return () => window.clearInterval(timer);
  }, [isPlaying, mode, distance, carSpeed, trainSpeed, timeA, timeB]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setAns('');
    setStatus('none');
  };

  const handleModeChange = (m: 'travel' | 'work') => {
    setMode(m);
    reset();
  };

  const checkAns = () => {
    let correct = 0;
    if (mode === 'travel') {
      correct = Math.abs((distance / carSpeed) - (distance / trainSpeed));
    } else {
      correct = 1 / (1/timeA + 1/timeB);
    }
    
    if (Math.abs(parseFloat(ans) - correct) <= 0.05) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }
  };

  // derived values for UI
  const carProgress = Math.min(100, (carSpeed * time / distance) * 100);
  const trainProgress = Math.min(100, (trainSpeed * time / distance) * 100);

  const bricksTotal = 60;
  const rateA = 1 / timeA;
  const rateB = 1 / timeB;
  const bricksA = Math.min(bricksTotal, Math.floor(rateA * time * bricksTotal));
  const bricksB = Math.min(bricksTotal - bricksA, Math.floor(rateB * time * bricksTotal));

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-slate-800 text-white p-4 flex items-center shadow-md shrink-0">
        <button onClick={onExit} className="flex items-center text-slate-300 hover:text-white transition-colors">
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </button>
        <h1 className="text-xl font-bold ml-6">Rational & Fraction Applications Lab</h1>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Theory Column */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Theory & Formulas</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-slate-700">
            {mode === 'travel' ? (
              <>
                <p><strong>Distance, Speed, and Time</strong> are related by rational equations.</p>
                <div className="bg-blue-50 p-4 rounded-lg text-center font-mono font-bold text-blue-800">
                  Time = Distance / Speed
                </div>
                <p>When comparing two vehicles covering the same distance, the difference in their travel times can be expressed as:</p>
                <div className="bg-slate-100 p-4 rounded-lg text-center font-mono font-bold">
                  Δt = |(d / v₁) - (d / v₂)|
                </div>
                <p className="text-sm text-slate-500 mt-4">In this simulator, observe how varying the speeds affects the completion time for a fixed distance.</p>
              </>
            ) : (
              <>
                <p><strong>Work Rate Problems</strong> involve adding fractions. If someone can complete a job in <em>t</em> hours, their rate is <em>1/t</em> jobs per hour.</p>
                <div className="bg-green-50 p-4 rounded-lg text-center font-mono font-bold text-green-800">
                  Rate = 1 / Time
                </div>
                <p>When two workers collaborate, their combined rate is the sum of their individual rates:</p>
                <div className="bg-slate-100 p-4 rounded-lg text-center font-mono font-bold">
                  Combined Rate = (1/t₁) + (1/t₂)
                </div>
                <p>The total time to complete the job together is the reciprocal of the combined rate.</p>
              </>
            )}
          </div>
        </div>

        {/* Interactive Column */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <div className="flex space-x-2 mb-6">
            <button 
              onClick={() => handleModeChange('travel')}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg font-medium transition-colors ${mode === 'travel' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Car size={18} className="mr-2" /> Travel Race
            </button>
            <button 
              onClick={() => handleModeChange('work')}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg font-medium transition-colors ${mode === 'work' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Hammer size={18} className="mr-2" /> Work Rates
            </button>
          </div>

          {/* Visualizer */}
          <div className="relative h-64 bg-slate-100 rounded-xl mb-6 overflow-hidden border border-slate-200 flex flex-col justify-center p-4">
            {mode === 'travel' ? (
              <div className="space-y-8 w-full relative">
                <div className="relative h-12 w-full border-b-2 border-dashed border-slate-400">
                  <div className="absolute bottom-0 text-slate-500 text-xs font-bold font-mono">Car (v={carSpeed})</div>
                  <Car className="absolute bottom-1 text-blue-500 transition-all duration-75" size={32} style={{ left: `calc(${carProgress}% - 32px)` }} />
                </div>
                <div className="relative h-12 w-full border-b-2 border-slate-800">
                  <div className="absolute bottom-0 text-slate-500 text-xs font-bold font-mono">Train (v={trainSpeed})</div>
                  <Train className="absolute bottom-1 text-red-500 transition-all duration-75" size={32} style={{ left: `calc(${trainProgress}% - 32px)` }} />
                </div>
                <div className="absolute right-0 top-0 h-full border-r-4 border-green-500 opacity-50"></div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col">
                <div className="text-center font-bold text-slate-600 mb-2">Wall Progress (60 Bricks)</div>
                <div className="flex-1 grid grid-cols-10 gap-1 content-start">
                  {Array.from({ length: bricksTotal }).map((_, i) => {
                    let bgColor = 'bg-slate-200';
                    if (i < bricksA) bgColor = 'bg-blue-500';
                    else if (i < bricksA + bricksB) bgColor = 'bg-green-500';
                    return <div key={i} className={`h-4 rounded-sm ${bgColor} transition-colors duration-100`} />
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs font-bold">
                  <span className="text-blue-600">Worker A: {bricksA} bricks</span>
                  <span className="text-green-600">Worker B: {bricksB} bricks</span>
                </div>
              </div>
            )}
            
            <div className="absolute top-2 right-4 font-mono font-bold text-slate-700 flex items-center bg-white/80 px-2 py-1 rounded">
              <Clock size={16} className="mr-2" />
              {time.toFixed(1)} h
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isPlaying ? <Pause size={20} className="mr-2"/> : <Play size={20} className="mr-2"/>}
              {isPlaying ? 'Pause' : 'Start'}
            </button>
            <button 
              onClick={reset}
              className="flex items-center px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              <RotateCcw size={20} className="mr-2"/>
              Reset
            </button>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {mode === 'travel' ? (
              <>
                <div>
                  <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                    <span>Distance (km)</span>
                    <span>{distance} km</span>
                  </div>
                  <input type="range" min="10" max="300" step="10" value={distance} onChange={e => {setDistance(Number(e.target.value)); reset()}} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                    <span>Car Speed (km/h)</span>
                    <span>{carSpeed} km/h</span>
                  </div>
                  <input type="range" min="10" max="150" step="5" value={carSpeed} onChange={e => {setCarSpeed(Number(e.target.value)); reset()}} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                    <span>Train Speed (km/h)</span>
                    <span>{trainSpeed} km/h</span>
                  </div>
                  <input type="range" min="10" max="150" step="5" value={trainSpeed} onChange={e => {setTrainSpeed(Number(e.target.value)); reset()}} className="w-full" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex justify-between text-sm font-medium text-blue-700 mb-1">
                    <span>Worker A Time (hours)</span>
                    <span>{timeA} h</span>
                  </div>
                  <input type="range" min="1" max="12" step="1" value={timeA} onChange={e => {setTimeA(Number(e.target.value)); reset()}} className="w-full accent-blue-600" />
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium text-green-700 mb-1">
                    <span>Worker B Time (hours)</span>
                    <span>{timeB} h</span>
                  </div>
                  <input type="range" min="1" max="12" step="1" value={timeB} onChange={e => {setTimeB(Number(e.target.value)); reset()}} className="w-full accent-green-600" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Assessment Column */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Data Analysis</h2>
          <div className="flex-1 space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-slate-700 font-medium mb-3">
                {mode === 'travel' 
                  ? `Given the distance of ${distance}km, how many more hours does the slower vehicle take compared to the faster vehicle?` 
                  : `If Worker A takes ${timeA}h and Worker B takes ${timeB}h, how many hours does it take them to build the wall together?`}
              </p>
              <p className="text-xs text-slate-500 mb-4">(Round to 2 decimal places if needed)</p>
              
              <div className="flex items-center space-x-3">
                <input 
                  type="number" 
                  step="0.01"
                  value={ans}
                  onChange={e => setAns(e.target.value)}
                  placeholder="e.g. 1.25"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                  onClick={checkAns}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Check
                </button>
              </div>

              {status === 'correct' && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
                  <CheckCircle2 size={20} className="mr-2 shrink-0" />
                  <span className="font-medium">Correct! Great calculation.</span>
                </div>
              )}
              {status === 'incorrect' && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                  <XCircle size={20} className="mr-2 shrink-0" />
                  <span className="font-medium">Not quite right. Use the formulas from the left panel.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
