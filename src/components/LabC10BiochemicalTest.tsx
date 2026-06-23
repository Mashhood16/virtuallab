import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Info, CheckCircle, Database } from 'lucide-react';

interface LabProps {
    onExit?: () => void;
}

export default function LabC10BiochemicalTest({ onExit }: LabProps) {
    const [hCGConc, setHCGConc] = useState<number>(25); // mIU/mL
    const [sampleVol, setSampleVol] = useState<number>(3); // drops
    
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [flowProgress, setFlowProgress] = useState<number>(0);
    
    interface DataPoint {
        volume: number;
        concentration: number;
        testLineIntensity: number;
    }
    const [data, setData] = useState<DataPoint[]>([]);
    
    const [unknownOD] = useState<number>(Math.floor(Math.random() * 80) + 10);
    const [assessmentAns, setAssessmentAns] = useState<string>('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const animationRef = useRef<number>(0);

    const maxIntensity = 100;
    const testIntensity = Math.min(maxIntensity, (hCGConc * sampleVol) / 1.5);
    const controlIntensity = 90;

    useEffect(() => {
        if (isRunning) {
            const animate = () => {
                setFlowProgress(p => {
                    const nextP = p + 0.5;
                    if (nextP >= 100) {
                        setIsRunning(false);
                        return 100;
                    }
                    return nextP;
                });
                animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isRunning]);

    const handleRun = () => {
        setFlowProgress(0);
        setIsRunning(true);
    };

    const handleReset = () => {
        setFlowProgress(0);
        setIsRunning(false);
    };

    const recordData = () => {
        setData([...data, {
            volume: sampleVol,
            concentration: hCGConc,
            testLineIntensity: parseFloat(testIntensity.toFixed(1))
        }]);
    };

    const checkAnswer = () => {
        const expected = unknownOD / 2;
        if (Math.abs(parseFloat(assessmentAns) - expected) < 2) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const testColorOpacity = flowProgress > 60 ? ((flowProgress - 60) / 40) * (testIntensity / 100) : 0;
    const controlColorOpacity = flowProgress > 80 ? ((flowProgress - 80) / 20) * (controlIntensity / 100) : 0;

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
            <div className="bg-pink-600 text-white p-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">Biochemical Test: hCG Lateral Flow Assay</h1>
                {onExit && <button onClick={onExit} className="px-4 py-2 bg-pink-700 hover:bg-pink-800 rounded">Exit</button>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 flex-grow">
                <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col space-y-4 border border-slate-200">
                    <h2 className="text-xl font-semibold flex items-center"><Info className="mr-2 text-pink-600"/> Setup & Theory</h2>
                    <p className="text-sm text-slate-700">
                        Pregnancy tests use a lateral flow assay to detect human chorionic gonadotropin (hCG) in urine.
                        Antibodies conjugated to color particles bind hCG and are captured at the Test (T) line. Unbound antibodies are captured at the Control (C) line.
                    </p>
                    
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium">Sample hCG Conc (mIU/mL): {hCGConc}</label>
                            <input type="range" min="0" max="100" value={hCGConc} onChange={(e) => setHCGConc(parseInt(e.target.value))} className="w-full" disabled={isRunning || flowProgress > 0} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Sample Volume (drops): {sampleVol}</label>
                            <input type="range" min="1" max="5" value={sampleVol} onChange={(e) => setSampleVol(parseInt(e.target.value))} className="w-full" disabled={isRunning || flowProgress > 0} />
                        </div>
                        
                        <div className="flex space-x-2 pt-4">
                            <button onClick={handleRun} disabled={isRunning || flowProgress > 0} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 flex justify-center items-center">
                                <Play className="w-4 h-4 mr-1"/> Apply Sample
                            </button>
                            <button onClick={handleReset} className="flex-1 bg-slate-600 text-white py-2 rounded hover:bg-slate-700 flex justify-center items-center">
                                <RotateCcw className="w-4 h-4 mr-1"/> Reset
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center border border-slate-200 relative overflow-hidden">
                    <h2 className="text-xl font-semibold absolute top-4 left-4">Test Strip</h2>
                    <div className="w-full h-64 mt-12 bg-slate-100 rounded border border-slate-300 relative flex items-center justify-center">
                        <svg width="100%" height="100%" viewBox="0 0 500 200">
                            <rect x="50" y="70" width="400" height="60" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" rx="10"/>
                            <circle cx="90" cy="100" r="15" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2"/>
                            <rect x="200" y="80" width="150" height="40" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" rx="4"/>
                            
                            <text x="240" y="140" fill="#64748b" fontSize="16" fontWeight="bold">T</text>
                            <text x="310" y="140" fill="#64748b" fontSize="16" fontWeight="bold">C</text>
                            <text x="90" y="140" fill="#64748b" fontSize="12" textAnchor="middle">Sample</text>

                            <clipPath id="flowClip">
                                <rect x="200" y="80" width={150 * (flowProgress / 100)} height="40" />
                            </clipPath>
                            <rect x="200" y="80" width="150" height="40" fill="#fbcfe8" opacity="0.3" clipPath="url(#flowClip)"/>

                            <rect x="235" y="80" width="10" height="40" fill={`rgba(219, 39, 119, ${testColorOpacity})`} />
                            <rect x="305" y="80" width="10" height="40" fill={`rgba(219, 39, 119, ${controlColorOpacity})`} />
                        </svg>
                        <div className="absolute bottom-4 left-4 text-sm font-semibold">
                            Status: {flowProgress === 0 ? 'Ready' : flowProgress < 100 ? 'Running...' : 'Complete'}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col space-y-4 border border-slate-200">
                    <h2 className="text-xl font-semibold flex items-center"><Database className="mr-2 text-pink-600"/> Data & Analysis</h2>
                    
                    <button onClick={recordData} disabled={flowProgress < 100} className="w-full bg-pink-100 text-pink-700 py-2 rounded font-medium hover:bg-pink-200 disabled:opacity-50">
                        Measure Optical Density (OD)
                    </button>

                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-2 border">Vol(drops)</th>
                                    <th className="p-2 border">hCG(mIU/mL)</th>
                                    <th className="p-2 border">Test OD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((d, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="p-2 border">{d.volume}</td>
                                        <td className="p-2 border">{d.concentration}</td>
                                        <td className="p-2 border font-bold text-pink-600">{d.testLineIntensity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-slate-100 p-3 rounded">
                        <h3 className="font-semibold text-sm mb-2 flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-600"/> Assessment</h3>
                        <p className="text-xs mb-2">Based on your data using 3 drops of sample, a linear relationship exists: <code>OD = Conc * 2</code>. An unknown sample yields an OD of {unknownOD}. What is its hCG concentration?</p>
                        <div className="flex space-x-2">
                            <input type="number" value={assessmentAns} onChange={(e) => setAssessmentAns(e.target.value)} placeholder="mIU/mL" className="flex-1 px-2 py-1 border rounded text-sm"/>
                            <button onClick={checkAnswer} className="bg-pink-600 text-white px-3 py-1 rounded text-sm hover:bg-pink-700">Check</button>
                        </div>
                        {isCorrect !== null && (
                            <p className={`text-xs mt-2 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                {isCorrect ? 'Correct! You successfully interpolated the concentration.' : 'Incorrect. Use the formula Conc = OD / 2.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
