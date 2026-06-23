import { useState } from 'react';
import { ArrowLeft, Target, Activity, Calculator, CheckCircle, XCircle } from 'lucide-react';

interface Point { x: number; y: number }

export default function LabP11PhysicalQuantities({ onExit }: { onExit?: () => void }) {
  const [shots, setShots] = useState<Point[]>([]);
  const [meanGuess, setMeanGuess] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleShoot = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 150;
    const y = e.clientY - rect.top - 150;
    setShots([...shots, { x, y }]);
  };

  const clearShots = () => {
    setShots([]);
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (shots.length === 0) return;
    const meanX = shots.reduce((acc, s) => acc + s.x, 0) / shots.length;
    const guess = parseFloat(meanGuess);
    if (Math.abs(meanX - guess) < 2) {
      setFeedback('Correct! You estimated the systematic error in X accurately.');
    } else {
      setFeedback(`Incorrect. The actual mean X is ${meanX.toFixed(1)}.`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-slate-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {onExit && (
            <button onClick={onExit} className="hover:bg-slate-700 p-2 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-bold flex items-center gap-2"><Target className="text-blue-400" /> Physical Quantities & Errors</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 gap-4 p-4 min-h-0">
        {/* Theory */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            Accuracy & Precision
          </h2>
          <div className="prose prose-sm text-slate-600">
            <p><strong>Accuracy</strong> refers to how close a measured value is to the true or accepted value. High accuracy means low <em>systematic error</em>.</p>
            <p><strong>Precision</strong> refers to how close measurements of the same item are to each other. High precision means low <em>random error</em>.</p>
            <p>In our target shooting simulator, the center of the target (0,0) represents the true value.</p>
            <ul className="list-disc pl-4 space-y-1 mt-2">
              <li>Click on the target to simulate shots.</li>
              <li>Observe how the spread (precision) and offset from center (accuracy) change.</li>
              <li>Calculate the mean X coordinate of your shots to estimate the systematic error in the horizontal direction.</li>
            </ul>
          </div>
        </div>

        {/* Simulator */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Target Simulator</h2>
          <svg width="300" height="300" className="bg-slate-100 rounded-full border border-slate-300 cursor-crosshair shadow-inner" onClick={handleShoot}>
            {/* Target rings */}
            <circle cx="150" cy="150" r="140" fill="white" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="150" cy="150" r="105" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="150" cy="150" r="70" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="2" />
            <circle cx="150" cy="150" r="35" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
            
            {/* Axes */}
            <line x1="150" y1="0" x2="150" y2="300" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
            <line x1="0" y1="150" x2="300" y2="150" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />

            {/* Shots */}
            {shots.map((s, i) => (
              <circle key={i} cx={150 + s.x} cy={150 + s.y} r="5" fill="#1e293b" />
            ))}
          </svg>
          <div className="mt-4 flex gap-3">
            <button onClick={clearShots} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors">
              Clear Target
            </button>
          </div>
        </div>

        {/* Assessment */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-500" />
            Data Analysis
          </h2>
          
          <div className="mb-4 max-h-48 overflow-y-auto border border-slate-200 rounded p-2 bg-slate-50">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-300 text-slate-600">
                  <th className="pb-1 px-2">Shot</th>
                  <th className="pb-1 px-2">X Coord</th>
                  <th className="pb-1 px-2">Y Coord</th>
                </tr>
              </thead>
              <tbody>
                {shots.map((s, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="py-1 px-2">{i + 1}</td>
                    <td className="py-1 px-2">{s.x.toFixed(1)}</td>
                    <td className="py-1 px-2">{s.y.toFixed(1)}</td>
                  </tr>
                ))}
                {shots.length === 0 && <tr><td colSpan={3} className="py-2 px-2 text-slate-400 italic">No shots taken yet.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Calculate Mean X coordinate (Systematic Error in X):
              </label>
              <input
                type="number"
                value={meanGuess}
                onChange={(e) => setMeanGuess(e.target.value)}
                placeholder="Enter mean X"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button 
              onClick={checkAnswer}
              disabled={shots.length === 0}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Check Answer
            </button>

            {feedback && (
              <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${feedback.includes('Correct') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {feedback.includes('Correct') ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                <span>{feedback}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
