import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Info, CheckCircle, Database } from 'lucide-react';

interface LabProps {
    onExit?: () => void;
}

export default function LabC10AdditionPolymerisation({ onExit }: LabProps) {
    const [monomers, setMonomers] = useState<number>(5);
    const [temp, setTemp] = useState<number>(150); // Celsius
    const [pressure, setPressure] = useState<number>(1000); // atm
    const [catalyst, setCatalyst] = useState<boolean>(true);
    
    const [isReacting, setIsReacting] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    
    interface DataPoint {
        monomers: number;
        temp: number;
        pressure: number;
        catalyst: boolean;
        yieldPercent: number;
    }
    const [data, setData] = useState<DataPoint[]>([]);
    
    const [unknownMonomers] = useState<number>(Math.floor(Math.random() * 500) + 100);
    const [assessmentAns, setAssessmentAns] = useState<string>('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const animationRef = useRef<number>(0);

    useEffect(() => {
        if (isReacting) {
            const reactionSpeed = catalyst ? (temp * pressure) / 10000 : (temp * pressure) / 50000;
            const animate = () => {
                setProgress(p => {
                    if (p >= 100) {
                        setIsReacting(false);
                        return 100;
                    }
                    return p + reactionSpeed;
                });
                animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isReacting, temp, pressure, catalyst]);

    const handleReact = () => {
        setProgress(0);
        setIsReacting(true);
    };

    const handleReset = () => {
        setProgress(0);
        setIsReacting(false);
    };

    const recordData = () => {
        const yieldP = Math.min(100, (progress / 100) * 100);
        setData([...data, {
            monomers,
            temp,
            pressure,
            catalyst,
            yieldPercent: yieldP
        }]);
    };

    const checkAnswer = () => {
        const molarMassEthene = 28.05;
        const expected = unknownMonomers * molarMassEthene;
        if (Math.abs(parseFloat(assessmentAns) - expected) < 1) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">Addition Polymerisation: Polyethylene</h1>
                {onExit && <button onClick={onExit} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded">Exit</button>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 flex-grow">
                <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col space-y-4 border border-slate-200">
                    <h2 className="text-xl font-semibold flex items-center"><Info className="mr-2 text-blue-600"/> Setup & Theory</h2>
                    <p className="text-sm text-slate-700">
                        Addition polymerisation involves linking ethene monomers by breaking their C=C double bonds to form a continuous chain. High pressure, temperature, and Ziegler-Natta catalysts improve the reaction rate.
                    </p>
                    
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium">Monomers (n): {monomers}</label>
                            <input type="range" min="3" max="15" value={monomers} onChange={(e) => setMonomers(parseInt(e.target.value))} className="w-full" disabled={isReacting || progress > 0} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Temperature (°C): {temp}</label>
                            <input type="range" min="20" max="300" value={temp} onChange={(e) => setTemp(parseInt(e.target.value))} className="w-full" disabled={isReacting || progress > 0} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Pressure (atm): {pressure}</label>
                            <input type="range" min="1" max="2000" value={pressure} onChange={(e) => setPressure(parseInt(e.target.value))} className="w-full" disabled={isReacting || progress > 0} />
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" checked={catalyst} onChange={(e) => setCatalyst(e.target.checked)} className="mr-2" disabled={isReacting || progress > 0}/>
                            <label className="text-sm font-medium">Use Catalyst</label>
                        </div>
                        
                        <div className="flex space-x-2 pt-4">
                            <button onClick={handleReact} disabled={isReacting || progress > 0} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 flex justify-center items-center">
                                <Play className="w-4 h-4 mr-1"/> React
                            </button>
                            <button onClick={handleReset} className="flex-1 bg-slate-600 text-white py-2 rounded hover:bg-slate-700 flex justify-center items-center">
                                <RotateCcw className="w-4 h-4 mr-1"/> Reset
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center border border-slate-200 relative overflow-hidden">
                    <h2 className="text-xl font-semibold absolute top-4 left-4">Reaction Chamber</h2>
                    <div className="w-full h-64 mt-12 bg-slate-100 rounded border border-slate-300 relative flex items-center justify-center overflow-x-auto">
                        <svg width={Math.max(500, monomers * 30 + 100)} height="200" viewBox={`0 0 ${Math.max(500, monomers * 30 + 100)} 200`}>
                            {Array.from({ length: monomers }).map((_, i) => {
                                const startX = 50 + i * 35;
                                const targetX = 50 + i * 25;
                                const currentX = startX + (targetX - startX) * (progress / 100);
                                const isLinked = progress > 50;

                                return (
                                    <g key={i} transform={`translate(${currentX}, 100)`}>
                                        <circle cx="-5" cy="0" r="4" fill="#333" />
                                        <circle cx="5" cy="0" r="4" fill="#333" />
                                        <circle cx="-10" cy="-10" r="2" fill="#999" />
                                        <circle cx="-10" cy="10" r="2" fill="#999" />
                                        <circle cx="10" cy="-10" r="2" fill="#999" />
                                        <circle cx="10" cy="10" r="2" fill="#999" />
                                        <line x1="-5" y1="0" x2="-10" y2="-10" stroke="#333" strokeWidth="1" />
                                        <line x1="-5" y1="0" x2="-10" y2="10" stroke="#333" strokeWidth="1" />
                                        <line x1="5" y1="0" x2="10" y2="-10" stroke="#333" strokeWidth="1" />
                                        <line x1="5" y1="0" x2="10" y2="10" stroke="#333" strokeWidth="1" />
                                        {isLinked ? (
                                            <line x1="-5" y1="0" x2="5" y2="0" stroke="#333" strokeWidth="2" />
                                        ) : (
                                            <>
                                                <line x1="-5" y1="-2" x2="5" y2="-2" stroke="#333" strokeWidth="1.5" />
                                                <line x1="-5" y1="2" x2="5" y2="2" stroke="#333" strokeWidth="1.5" />
                                            </>
                                        )}
                                        {isLinked && i < monomers - 1 && (
                                            <line x1="5" y1="0" x2="20" y2="0" stroke="#333" strokeWidth="2" strokeDasharray={progress < 100 ? "2,2" : "none"} />
                                        )}
                                    </g>
                                );
                            })}
                        </svg>
                        {progress > 0 && <div className="absolute bottom-2 text-sm font-semibold">Conversion: {Math.round(progress)}%</div>}
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-lg font-mono">
                            n CH₂=CH₂ &rarr; [-CH₂-CH₂-]<sub className="text-xs">n</sub>
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col space-y-4 border border-slate-200">
                    <h2 className="text-xl font-semibold flex items-center"><Database className="mr-2 text-blue-600"/> Data & Analysis</h2>
                    
                    <button onClick={recordData} disabled={progress < 100} className="w-full bg-blue-100 text-blue-700 py-2 rounded font-medium hover:bg-blue-200 disabled:opacity-50">
                        Record Data Point
                    </button>

                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-2 border">n</th>
                                    <th className="p-2 border">T(°C)</th>
                                    <th className="p-2 border">Cat.</th>
                                    <th className="p-2 border">Yield(%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((d, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="p-2 border">{d.monomers}</td>
                                        <td className="p-2 border">{d.temp}</td>
                                        <td className="p-2 border">{d.catalyst ? 'Yes' : 'No'}</td>
                                        <td className="p-2 border">{Math.round(d.yieldPercent)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-slate-100 p-3 rounded">
                        <h3 className="font-semibold text-sm mb-2 flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-600"/> Assessment</h3>
                        <p className="text-xs mb-2">A polymer chain is formed from {unknownMonomers} ethene monomers. What is the expected molar mass of the resulting polyethylene chain? (Use Ethene = 28.05 g/mol)</p>
                        <div className="flex space-x-2">
                            <input type="number" value={assessmentAns} onChange={(e) => setAssessmentAns(e.target.value)} placeholder="g/mol" className="flex-1 px-2 py-1 border rounded text-sm"/>
                            <button onClick={checkAnswer} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Check</button>
                        </div>
                        {isCorrect !== null && (
                            <p className={`text-xs mt-2 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                {isCorrect ? 'Correct! Mass is conserved.' : 'Incorrect. Multiply n by the molar mass.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
