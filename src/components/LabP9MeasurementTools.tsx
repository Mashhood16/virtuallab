import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Ruler, Target } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP9MeasurementTools({ onExit }: { onExit?: () => void }) {
  const [objectWidth, setObjectWidth] = useState<number>(0);
  const [jawX, setJawX] = useState<number>(50); // 0 to 50 mm
  const [objectPlaced, setObjectPlaced] = useState<boolean>(false);
  const [readingInput, setReadingInput] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    generateNewObject();
  }, []);

  const generateNewObject = () => {
    const newWidth = Math.floor(Math.random() * 300 + 105) / 10; // 10.5 to 40.4 mm
    setObjectWidth(newWidth);
    setJawX(50);
    setObjectPlaced(false);
    setReadingInput('');
    setFeedback(null);
  };

  const handleSlider = (val: number) => {
    if (objectPlaced && val < objectWidth) {
      setJawX(objectWidth);
    } else {
      setJawX(val);
    }
  };

  const checkAnswer = () => {
    const inputNum = parseFloat(readingInput);
    if (!isNaN(inputNum) && Math.abs(inputNum - objectWidth) < 0.05) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  // SVG rendering constants
  const pixelsPerMm = 8;
  const zeroOffset = 80; // px position of 0 mm on main scale
  
  // Create ticks for main scale (0 to 60 mm)
  const mainTicks = [];
  for (let i = 0; i <= 60; i++) {
    mainTicks.push(i);
  }

  // Vernier ticks (0 to 10)
  const vernierTicks = [];
  for (let i = 0; i <= 10; i++) {
    vernierTicks.push(i);
  }

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none text-slate-800">
      <LabHeader onExit={onExit} title="Physics Grade 9: Vernier Caliper" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Column 1: Theory */}
        <div className="bg-slate-50 rounded-xl shadow-sm border p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold border-b pb-2">Theory: Measurement</h2>
          <div className="prose prose-sm">
            <p>
              A <strong>Vernier Caliper</strong> is an instrument used to measure internal and external dimensions accurately.
            </p>
            <ul className="list-disc pl-4 space-y-2">
              <li><strong>Main Scale:</strong> Reads in millimeters (mm). Read the mark just to the left of the zero on the Vernier scale.</li>
              <li><strong>Vernier Scale:</strong> Provides precision up to 0.1 mm. Find the Vernier mark that perfectly aligns with any mark on the Main scale.</li>
            </ul>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4 text-blue-900">
              <strong>Formula:</strong><br />
              Total Reading = Main Scale Reading + (Vernier Division &times; Least Count)<br />
              <em>Here, Least Count = 0.1 mm</em>
            </div>
            <h3 className="font-semibold mt-4">Instructions:</h3>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Click <strong>Place Object</strong>.</li>
              <li>Drag the slider to close the jaws onto the object.</li>
              <li>Zoom in on the scales mentally and read the value.</li>
              <li>Enter your reading and check.</li>
            </ol>
          </div>
        </div>

        {/* Column 2: Simulator */}
        <div className="bg-slate-50 rounded-xl shadow-sm border p-6 flex flex-col items-center">
          <h2 className="text-lg font-bold border-b pb-2 w-full mb-4">Interactive Simulator</h2>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setObjectPlaced(true);
                if (jawX < objectWidth) setJawX(objectWidth);
              }}
              disabled={objectPlaced}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Target size={18} /> Place Object
            </button>
            <button
              onClick={generateNewObject}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2"
            >
              <RotateCcw size={18} /> New Object
            </button>
          </div>

          <div className="relative w-full max-w-lg bg-slate-100 rounded-lg p-4 border overflow-hidden flex justify-center mb-6">
            <svg width="100%" viewBox="0 0 600 300" className="bg-slate-50 border shadow-inner rounded">
              {/* Main Scale Beam */}
              <rect x="20" y="100" width="560" height="60" fill="#e2e8f0" stroke="#94a3b8" />
              {mainTicks.map(tick => (
                <g key={tick} transform={`translate(${zeroOffset + tick * pixelsPerMm}, 100)`}>
                  <line x1="0" y1="0" x2="0" y2={tick % 10 === 0 ? "20" : (tick % 5 === 0 ? "15" : "10")} stroke="#334155" strokeWidth="1.5" />
                  {tick % 10 === 0 && <text x="0" y="35" textAnchor="middle" fontSize="12" fill="#334155">{tick / 10}</text>}
                </g>
              ))}

              {/* Fixed Jaw */}
              <path d={`M 20 100 L ${zeroOffset} 100 L ${zeroOffset} 220 L ${zeroOffset - 20} 220 L ${zeroOffset - 20} 160 L 20 160 Z`} fill="#cbd5e1" stroke="#94a3b8" />
              <line x1={zeroOffset} y1="100" x2={zeroOffset} y2="220" stroke="#475569" strokeWidth="2" />

              {/* Object */}
              {objectPlaced && (
                <rect 
                  x={zeroOffset} 
                  y="160" 
                  width={objectWidth * pixelsPerMm} 
                  height="60" 
                  fill="#f59e0b" 
                  stroke="#d97706" 
                  rx="4"
                />
              )}

              {/* Sliding Jaw & Vernier Scale */}
              <g transform={`translate(${jawX * pixelsPerMm}, 0)`}>
                {/* Sliding Jaw Body */}
                <path d={`M ${zeroOffset} 160 L ${zeroOffset} 220 L ${zeroOffset + 20} 220 L ${zeroOffset + 20} 180 L ${zeroOffset + 120} 180 L ${zeroOffset + 120} 100 L ${zeroOffset} 100 Z`} fill="#cbd5e1" stroke="#94a3b8" />
                <line x1={zeroOffset} y1="100" x2={zeroOffset} y2="220" stroke="#475569" strokeWidth="2" />
                
                {/* Vernier scale window */}
                <rect x={zeroOffset + 5} y="100" width="90" height="25" fill="#f8fafc" stroke="#94a3b8" />
                {vernierTicks.map(tick => (
                  <g key={tick} transform={`translate(${zeroOffset + 10 + tick * (0.9 * pixelsPerMm)}, 100)`}>
                    <line x1="0" y1="0" x2="0" y2={tick % 5 === 0 ? "15" : "10"} stroke="#b91c1c" strokeWidth="1.5" />
                    {tick % 5 === 0 && <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#b91c1c">{tick}</text>}
                  </g>
                ))}
              </g>
            </svg>
          </div>

          <div className="w-full max-w-lg space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex justify-between">
              <span>Adjust Jaw Position</span>
              <span>{jawX.toFixed(1)} mm</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="50" 
              step="0.1" 
              value={jawX} 
              onChange={(e) => handleSlider(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        {/* Column 3: Analysis */}
        <div className="bg-slate-50 rounded-xl shadow-sm border p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold border-b pb-2">Analysis & Record</h2>
          
          <div className="bg-slate-50 border rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Enter Reading (mm)</label>
              <input 
                type="number" 
                step="0.1"
                placeholder="e.g. 15.3"
                value={readingInput}
                onChange={(e) => setReadingInput(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            
            <button 
              onClick={checkAnswer}
              disabled={!readingInput || !objectPlaced || jawX !== objectWidth}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Check Answer
            </button>

            {(!objectPlaced || jawX !== objectWidth) && readingInput && (
              <p className="text-xs text-orange-600 flex items-center gap-1">
                <Target size={14} /> Please clamp the object tightly before measuring.
              </p>
            )}

            {feedback === 'correct' && (
              <div className="p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 border border-green-200">
                <CheckCircle size={20} />
                <span>Correct! The object is exactly {objectWidth.toFixed(1)} mm wide.</span>
              </div>
            )}
            
            {feedback === 'incorrect' && (
              <div className="p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 border border-red-200">
                <XCircle size={20} />
                <span>Incorrect. Check the main scale before the vernier zero, then find the matching vernier line.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
