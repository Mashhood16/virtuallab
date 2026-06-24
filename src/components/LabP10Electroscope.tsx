import { useState, useEffect } from 'react';
import { RefreshCw, Plus, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

export default function LabP10Electroscope({ onExit }: LabProps) {
  const [qRod, setQRod] = useState<number>(5); // microCoulombs
  const [distance, setDistance] = useState<number>(5); // cm (0 means touching)
  const [qNet, setQNet] = useState<number>(0); // net charge on the electroscope
  const [noise, setNoise] = useState<number>(0);

  // Periodic noise for angle measurement
  useEffect(() => {
    const interval = setInterval(() => {
      setNoise((Math.random() - 0.5) * 1.5); // +/- 0.75 deg noise
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // When distance goes to 0, conduction happens (charge transfers to electroscope)
  useEffect(() => {
    if (distance === 0) {
      // Transfer charge proportional to the rod's charge.
      // To prevent infinite loop/feedback, only transfer if there's a difference.
      if (Math.abs(qNet - qRod * 0.5) > 0.1) {
        setQNet(qRod * 0.5);
      }
    }
  }, [distance, qRod, qNet]);

  // Induced charge on the leaves (opposite to the top disc, so same sign as rod)
  // Inverse square-ish relation to distance for induction effect
  const inductionFactor = distance === 0 ? 0 : 5 / Math.pow(distance + 1, 1.5);
  const qLeafInduced = distance === 0 ? 0 : qRod * inductionFactor;

  // Total effective charge on the leaf determining the repulsion
  const effectiveCharge = qNet + qLeafInduced;
  
  // Angle calculation (max ~85 degrees)
  const rawAngle = Math.min(85, Math.pow(effectiveCharge, 2) * 2.5);
  const measuredAngle = rawAngle === 0 ? 0 : Math.max(0, rawAngle + noise);

  // Data Logging
  const [dataPoints, setDataPoints] = useState<Array<{ id: number; qRod: number; d: number; qNet: number; angle: number }>>([]);
  const recordData = () => {
    setDataPoints((prev) => [
      ...prev,
      { id: Date.now(), qRod, d: distance, qNet: parseFloat(qNet.toFixed(1)), angle: measuredAngle }
    ]);
  };
  const clearData = () => setDataPoints([]);

  const groundElectroscope = () => {
    setQNet(0);
  };

  // Assessment
  const [assessmentAnswer, setAssessmentAnswer] = useState<string>('');
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  
  const checkAnswer = () => {
    const val = assessmentAnswer.trim().toLowerCase();
    if (val === 'repel' || val === 'repels' || val === 'diverge' || val === 'diverges') {
      setAssessmentStatus('correct');
    } else {
      setAssessmentStatus('incorrect');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <LabHeader onExit={onExit} title="Unit 15: Gold-Leaf Electroscope" subtitle="Detect electric charge via induction and conduction." />

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto w-full">
        
        {/* Column 1: Theory & Setup */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Theory</h2>
            <p className="text-slate-600 text-sm mb-3">
              An electroscope detects charge. When a charged rod is brought near the brass disc, it induces a charge separation (<strong>Induction</strong>). 
              Electrons are repelled or attracted, leaving the gold leaf with a net charge that causes it to repel from the fixed brass stem.
            </p>
            <p className="text-slate-600 text-sm mb-3">
              If the rod touches the disc (<strong>Conduction</strong>), electrons are transferred, leaving the electroscope permanently charged.
            </p>
            <p className="text-xs text-slate-500 bg-slate-100 p-2 rounded">
              The angle of deflection θ is roughly proportional to the square of the charge on the leaf.
            </p>
          </div>

          <div className="h-px bg-slate-200" />

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Experiment Setup</h2>
            
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">Rod Charge (Q_rod)</label>
                <span className={`text-sm font-mono ${qRod > 0 ? 'text-blue-600' : qRod < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                  {qRod > 0 ? '+' : ''}{qRod} μC
                </span>
              </div>
              <input 
                type="range" min="-10" max="10" step="1" value={qRod}
                onChange={(e) => setQRod(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700">Rod Distance (d)</label>
                <span className="text-sm font-mono text-emerald-600">{distance} cm</span>
              </div>
              <input 
                type="range" min="0" max="20" step="0.5" value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <p className="text-xs text-slate-500 mt-1">d = 0 means touching (Conduction).</p>
            </div>

            <button 
              onClick={groundElectroscope}
              className="w-full py-2 bg-slate-800 text-white rounded font-medium hover:bg-slate-700 transition-colors"
            >
              Ground Electroscope (Reset Net Charge)
            </button>
          </div>
        </div>

        {/* Column 2: Simulation */}
        <div className="bg-slate-100 rounded-2xl shadow-inner border border-slate-300 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Angle Display overlay */}
          <div className="absolute top-4 right-4 bg-slate-50 p-3 rounded-lg border border-slate-300 shadow-sm flex flex-col items-center z-20">
            <span className="text-xs font-bold text-slate-500 uppercase">Deflection Angle θ</span>
            <span className="text-2xl font-mono font-bold text-slate-800">{measuredAngle.toFixed(1)}°</span>
          </div>

          <div className="relative w-[300px] h-[400px] flex justify-center">
            
            {/* Charged Rod */}
            <div 
              className="absolute left-1/2 w-48 h-8 rounded-full border-2 z-30 flex items-center justify-evenly transition-all duration-300 shadow-md"
              style={{
                transform: `translateX(-50%) translateY(${20 + (distance * 8)}px)`,
                backgroundColor: qRod > 0 ? '#60a5fa' : qRod < 0 ? '#f87171' : '#cbd5e1',
                borderColor: qRod > 0 ? '#2563eb' : qRod < 0 ? '#dc2626' : '#94a3b8'
              }}
            >
               {[...Array(5)].map((_, i) => (
                 <span key={i} className="text-white font-bold text-xl leading-none">
                   {qRod > 0 ? '+' : qRod < 0 ? '-' : '0'}
                 </span>
               ))}
               <div className="absolute -right-16 text-slate-600 font-mono text-sm bg-slate-50/80 px-1 rounded">Rod</div>
            </div>

            {/* Electroscope Structure */}
            <div className="absolute bottom-10 flex flex-col items-center">
              
              {/* Brass Disc */}
              <div className="w-20 h-6 bg-yellow-500 rounded-full border-2 border-yellow-600 z-20 flex justify-center items-center shadow-md relative">
                 <div className="absolute top-1/2 -translate-y-1/2 text-slate-800 text-xs font-bold mix-blend-overlay">Disc</div>
              </div>
              
              {/* Insulator plug */}
              <div className="w-12 h-6 bg-slate-800 -mt-2 z-10" />

              {/* Glass Flask Envelope */}
              <div className="absolute top-8 w-48 h-56 border-4 border-sky-200/60 bg-sky-50/30 rounded-t-xl rounded-b-[4rem] z-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.8)]" />

              {/* Brass Rod (Stem) */}
              <div className="w-2 h-44 bg-yellow-500 border-x border-yellow-600 z-10 relative flex justify-center">
                {/* Leaf Pivot Pivot */}
                <div className="absolute bottom-6 w-3 h-3 bg-yellow-700 rounded-full" />
                
                {/* Fixed Stem extension */}
                <div className="absolute bottom-0 w-2 h-6 bg-yellow-500 border-x border-yellow-600" />
                
                {/* Movable Gold Leaf */}
                <div 
                  className="absolute bottom-6 w-1.5 h-20 bg-yellow-400 origin-top shadow-sm border border-yellow-500 transition-transform duration-[400ms] ease-out z-20 rounded-b-full" 
                  style={{ transform: `rotate(-${rawAngle}deg)` }}
                />
              </div>

            </div>

          </div>

          <div className="absolute bottom-4 left-4 flex gap-2">
            <div className="bg-slate-50/80 px-2 py-1 rounded text-xs border border-slate-300 text-slate-600 font-mono shadow-sm">
              Q_net: {qNet.toFixed(1)} μC
            </div>
          </div>
        </div>

        {/* Column 3: Data & Analysis */}
        <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Data Logging</h2>
            <button 
              onClick={recordData}
              className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Record
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-6 border border-slate-200 rounded-lg max-h-[200px]">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-600 uppercase bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2">Q_rod (μC)</th>
                  <th className="px-4 py-2">d (cm)</th>
                  <th className="px-4 py-2">Q_net (μC)</th>
                  <th className="px-4 py-2">Angle θ</th>
                </tr>
              </thead>
              <tbody>
                {dataPoints.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-slate-500 italic">No data recorded yet.</td>
                  </tr>
                ) : (
                  dataPoints.map((dp) => (
                    <tr key={dp.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-2 font-mono">{dp.qRod}</td>
                      <td className="px-4 py-2 font-mono">{dp.d}</td>
                      <td className="px-4 py-2 font-mono">{dp.qNet}</td>
                      <td className="px-4 py-2 font-mono">{dp.angle.toFixed(1)}°</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="h-px bg-slate-200 mb-6" />

          {/* Assessment Section */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Analysis Check</h2>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-slate-700 mb-3">
                <strong>Problem:</strong> A neutral electroscope is touched by a negatively charged rod, then the rod is removed. A positively charged rod is then brought <em>near</em> the disc (not touching). Does the leaf angle increase, decrease, or remain the same? Explain why, or simply type <strong>decrease</strong>, <strong>increase</strong>, or <strong>repel</strong>.
              </p>
              <p className="text-xs text-slate-500 mb-3">(Hint: What happens to the electrons on the leaf when a positive rod is brought near the disc?)</p>
              <div className="flex gap-2 items-center">
                <input 
                  type="text" 
                  placeholder="e.g. decrease"
                  value={assessmentAnswer}
                  onChange={(e) => { setAssessmentAnswer(e.target.value); setAssessmentStatus('idle'); }}
                  className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={checkAnswer}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
                >
                  Check
                </button>
              </div>
              {assessmentStatus === 'correct' && (
                <div className="mt-3 flex items-start gap-1 text-emerald-700 text-sm font-medium bg-emerald-100 p-2 rounded">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> 
                  Correct! The positive rod attracts electrons up to the disc, leaving the leaf less negative, so the repulsion (and angle) decreases. (Or if it was neutral, it diverges/repels).
                </div>
              )}
              {assessmentStatus === 'incorrect' && (
                <div className="mt-3 flex items-center gap-1 text-rose-600 text-sm font-medium">
                  <XCircle className="w-4 h-4" /> Incorrect. Try simulating it! Give the electroscope negative charge, then bring a positive rod near.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
