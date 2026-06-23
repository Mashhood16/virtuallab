import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Activity, Play, ShieldAlert, CheckCircle, XCircle, Beaker } from 'lucide-react';

interface AntibioticData {
  name: string;
  code: string;
  zones: {
    [key: string]: number;
  };
}

const antibiotics: AntibioticData[] = [
  { name: 'Penicillin (P)', code: 'P', zones: { EColi: 0, SAureus: 28, PAeruginosa: 0 } },
  { name: 'Tetracycline (TE)', code: 'TE', zones: { EColi: 24, SAureus: 26, PAeruginosa: 12 } },
  { name: 'Chloramphenicol (C)', code: 'C', zones: { EColi: 16, SAureus: 22, PAeruginosa: 0 } },
];

const bacteriaTypes = [
  { id: 'EColi', name: 'Escherichia coli' },
  { id: 'SAureus', name: 'Staphylococcus aureus' },
  { id: 'PAeruginosa', name: 'Pseudomonas aeruginosa' }
];

export default function LabB11Microbiology({ onExit }: { onExit?: () => void }) {
  const [bacteria, setBacteria] = useState<string>('EColi');
  const [incubating, setIncubating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [caliperValue, setCaliperValue] = useState<number>(10);
  
  // Assessment
  const [assessAbx, setAssessAbx] = useState<string>('P');
  const [assessResult, setAssessResult] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let interval: number;
    if (incubating && progress < 1) {
      interval = window.setInterval(() => {
        setProgress(p => {
          if (p >= 1) {
            setIncubating(false);
            return 1;
          }
          return p + 0.05;
        });
      }, 100);
    }
    return () => window.clearInterval(interval);
  }, [incubating, progress]);

  const handleIncubate = () => {
    setProgress(0);
    setIncubating(true);
    setFeedback(null);
  };

  const handleBacteriaChange = (newBacteria: string) => {
    setBacteria(newBacteria);
    setProgress(0);
    setIncubating(false);
  };

  const checkAnswer = () => {
    if (!assessResult) {
      setFeedback("Please select a resistance profile.");
      return;
    }
    const abx = antibiotics.find(a => a.code === assessAbx);
    if (!abx) return;
    const zone = abx.zones[bacteria];
    let correctResult = 'R';
    if (zone >= 20) correctResult = 'S';
    else if (zone >= 15) correctResult = 'I';

    if (assessResult === correctResult) {
      setFeedback("Correct! You have accurately classified the bacteria's resistance profile.");
    } else {
      setFeedback("Incorrect. Remember: Zone ≥ 20mm is Susceptible (S), 15-19mm is Intermediate (I), and < 15mm is Resistant (R).");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-blue-700 text-white p-4 flex items-center shadow-md justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="hover:bg-blue-600 p-2 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Microbiology: Antibiotic Resistance</h1>
        </div>
        <div className="flex items-center gap-2">
          <Beaker size={24} />
          <span className="font-semibold">Virtual Lab B11</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column: Theory & Setup */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-3">
              <BookOpen className="text-blue-600" /> Theory & Setup
            </h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              The <strong>Kirby-Bauer disc diffusion test</strong> measures the sensitivity of bacteria to antibiotics. 
              Antibiotic discs are placed on a bacteria-streaked agar plate. A clear "zone of inhibition" forms if the bacteria are susceptible.
            </p>
          </div>

          <div className="space-y-5 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-700">Inoculation Controls</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">Select Bacteria Strain</label>
              <select 
                value={bacteria} 
                onChange={(e) => handleBacteriaChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-blue-500 bg-white text-sm"
              >
                {bacteriaTypes.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button 
                onClick={handleIncubate}
                disabled={incubating || progress === 1}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                <Play size={18} /> {progress === 1 ? 'Incubation Complete' : incubating ? 'Incubating...' : 'Start Incubation (37°C)'}
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column: Simulator */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-blue-600" /> Agar Plate View
            </h2>
            <div className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded">Interactive Model</div>
          </div>
          
          <div className="w-full max-w-sm aspect-square relative mt-12 bg-slate-900 rounded-2xl p-4 shadow-inner">
            <svg viewBox="0 0 100 100" className="w-full h-full object-contain filter drop-shadow-xl">
              {/* Dish */}
              <circle cx="50" cy="50" r="48" fill="#fef3c7" stroke="#fbbf24" strokeWidth="2" opacity="0.9" />
              
              {/* Bacteria Lawn */}
              <circle cx="50" cy="50" r="47" fill="#b45309" opacity={0.1 + progress * 0.5} />

              {/* Antibiotics and Halos */}
              {antibiotics.map((abx, i) => {
                const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
                const cx = 50 + 25 * Math.cos(angle);
                const cy = 50 + 25 * Math.sin(angle);
                
                const targetZone = abx.zones[bacteria];
                const targetRadius = targetZone > 0 ? targetZone / 2 : 3;
                const currentRadius = 3 + (targetRadius - 3) * progress;

                return (
                  <g key={abx.code}>
                    {/* Halo (Clear Zone) */}
                    {targetZone > 0 && (
                      <circle cx={cx} cy={cy} r={currentRadius} fill="#fef3c7" opacity={progress * 0.9} />
                    )}
                    {/* Disc */}
                    <circle cx={cx} cy={cy} r="3" fill="white" stroke="#94a3b8" strokeWidth="0.5" />
                    <text x={cx} y={cy + 1} fontSize="2.5" textAnchor="middle" fill="#333" fontWeight="bold">
                      {abx.code}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Caliper overlay visually matching SVG sizing. Scale factor ~ 2.5 on a typical screen */}
            {progress === 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 bg-white/95 p-3 rounded-xl shadow-lg border border-slate-200 w-4/5 z-20 backdrop-blur-sm">
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Measurement Caliper</span>
                  <span className="text-sm font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{caliperValue} mm</span>
                </div>
                <input 
                  type="range" min="0" max="40" step="1" 
                  value={caliperValue} onChange={(e) => setCaliperValue(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="w-full flex justify-center mt-1">
                  <div className="h-3 border-x-2 border-blue-600 relative transition-all" style={{ width: `${caliperValue * 2.5}px` }}>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-blue-600/50" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assessment */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-6">
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex-1 flex flex-col">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 text-lg">
              <ShieldAlert className="text-blue-600" /> Resistance Profiling
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Measure the diameter of the zone of inhibition for each antibiotic using the caliper tool. 
              Classify the bacteria's susceptibility based on standard breakpoints.
            </p>
            
            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Select Antibiotic Disc</label>
                <select 
                  value={assessAbx} onChange={(e) => setAssessAbx(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-blue-500 bg-white"
                >
                  {antibiotics.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Interpretation</label>
                <select 
                  value={assessResult} onChange={(e) => setAssessResult(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-blue-500 bg-white"
                >
                  <option value="">Select Profile...</option>
                  <option value="S">Susceptible (Zone ≥ 20mm)</option>
                  <option value="I">Intermediate (Zone 15-19mm)</option>
                  <option value="R">Resistant (Zone &lt; 15mm)</option>
                </select>
              </div>

              <button 
                onClick={checkAnswer}
                className="w-full mt-4 bg-slate-800 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm"
              >
                Check Answer
              </button>

              {feedback && (
                <div className={`mt-4 text-sm p-4 rounded-lg flex items-start gap-3 border ${feedback.includes('Correct') ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                  {feedback.includes('Correct') ? <CheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-600" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-rose-600" />}
                  <span className="flex-1 leading-relaxed">{feedback}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
