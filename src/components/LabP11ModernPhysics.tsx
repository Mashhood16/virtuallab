import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Activity, Zap, CheckCircle2, XCircle } from 'lucide-react';

const SvgGrid = () => (
    <g opacity="0.1">
        {Array.from({length: 11}).map((_, i) => (
            <line key={`v${i}`} x1={i*30} y1="0" x2={i*30} y2="300" stroke="white" strokeWidth="1" />
        ))}
        {Array.from({length: 11}).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i*30} x2="300" y2={i*30} stroke="white" strokeWidth="1" />
        ))}
    </g>
);

export default function LabP11ModernPhysics({ onExit }: { onExit?: () => void }) {
    const [activeTab, setActiveTab] = useState<'mass-energy' | 'pet-scan' | 'synchrotron'>('mass-energy');

    // Fission State
    const [fissionState, setFissionState] = useState<'idle' | 'fissioning' | 'done'>('idle');
    const [fissionProgress, setFissionProgress] = useState(0);
    const [fissionDeltaM, setFissionDeltaM] = useState<string>('');
    const [fissionEnergy, setFissionEnergy] = useState<string>('');
    const [fissionCorrect, setFissionCorrect] = useState<boolean | null>(null);

    // PET Scan State
    const [petState, setPetState] = useState<'idle' | 'annihilating' | 'done'>('idle');
    const [petProgress, setPetProgress] = useState(0);
    const [petGammaEnergy, setPetGammaEnergy] = useState<string>('');
    const [petCorrect, setPetCorrect] = useState<boolean | null>(null);

    // Synchrotron State
    const [syncRunning, setSyncRunning] = useState(false);
    const [syncAngle, setSyncAngle] = useState(0);
    const [syncBField, setSyncBField] = useState<number>(2.0); // T
    const [syncRadius, setSyncRadius] = useState<number>(30); // m
    const [syncMomentum, setSyncMomentum] = useState<string>('');
    const [syncCorrect, setSyncCorrect] = useState<boolean | null>(null);

    // Tab change handler
    const handleTabChange = (tab: 'mass-energy' | 'pet-scan' | 'synchrotron') => {
        setActiveTab(tab);
        setFissionState('idle');
        setFissionProgress(0);
        setPetState('idle');
        setPetProgress(0);
        setSyncRunning(false);
    };

    // Animation Effects
    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        const render = (time: number) => {
            const deltaTime = time - lastTime;
            lastTime = time;
            if (fissionState === 'fissioning') {
                setFissionProgress(prev => {
                    const next = prev + deltaTime / 2000;
                    if (next >= 1) {
                        setFissionState('done');
                        return 1;
                    }
                    return next;
                });
            }
            animationFrameId = requestAnimationFrame(render);
        };
        if (fissionState === 'fissioning') {
            animationFrameId = requestAnimationFrame(render);
        }
        return () => cancelAnimationFrame(animationFrameId);
    }, [fissionState]);

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        const render = (time: number) => {
            const deltaTime = time - lastTime;
            lastTime = time;
            if (petState === 'annihilating') {
                setPetProgress(prev => {
                    const next = prev + deltaTime / 2000;
                    if (next >= 1) {
                        setPetState('done');
                        return 1;
                    }
                    return next;
                });
            }
            animationFrameId = requestAnimationFrame(render);
        };
        if (petState === 'annihilating') {
            animationFrameId = requestAnimationFrame(render);
        }
        return () => cancelAnimationFrame(animationFrameId);
    }, [petState]);

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        const render = (time: number) => {
            const deltaTime = time - lastTime;
            lastTime = time;
            if (syncRunning) {
                setSyncAngle(prev => (prev + syncBField * 40 * (deltaTime / 1000)) % 360);
            }
            animationFrameId = requestAnimationFrame(render);
        };
        if (syncRunning) {
            animationFrameId = requestAnimationFrame(render);
        }
        return () => cancelAnimationFrame(animationFrameId);
    }, [syncRunning, syncBField]);

    // Validation Checkers
    const checkFission = () => {
        const dM = parseFloat(fissionDeltaM);
        const E = parseFloat(fissionEnergy);
        const expectedDM = 0.2148;
        const expectedE = 200.1;
        if (Math.abs(dM - expectedDM) < 0.005 && Math.abs(E - expectedE) < 1.0) {
            setFissionCorrect(true);
        } else {
            setFissionCorrect(false);
        }
    };

    const checkPet = () => {
        const E = parseFloat(petGammaEnergy);
        if (Math.abs(E - 511) < 2) {
            setPetCorrect(true);
        } else {
            setPetCorrect(false);
        }
    };

    const checkSync = () => {
        const p = parseFloat(syncMomentum);
        // p = q * B * r => (1.6e-19) * B * r. Input is expecting magnitude of 10^-18.
        // So expected value = 0.16 * B * r.
        const expectedP = 0.16 * syncBField * syncRadius; 
        if (Math.abs(p - expectedP) < 0.2) {
            setSyncCorrect(true);
        } else {
            setSyncCorrect(false);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    {onExit && (
                        <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-slate-600" />
                        </button>
                    )}
                    <h1 className="text-2xl font-bold text-slate-800">Virtual Lab: Modern Physics</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Theory */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full overflow-y-auto">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity className="text-indigo-600" />
                        Theory & Context
                    </h2>
                    
                    {activeTab === 'mass-energy' && (
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p><strong>Mass-Energy Equivalence</strong> is the principle that mass and energy are mutually convertible, expressed by Einstein's famous equation:</p>
                            <span className="text-xl font-semibold text-center block text-slate-800">E = Δm c²</span>
                            <p>In nuclear fission, a heavy nucleus (like Uranium-235) absorbs a neutron and splits into lighter nuclei, releasing more neutrons and a vast amount of energy.</p>
                            <p>The total mass of the products is strictly <em>less</em> than the reactants. This missing mass (Δm) is converted directly into energy.</p>
                            <div className="bg-slate-50 p-4 rounded-lg text-sm font-mono border border-slate-200 space-y-1 mt-4">
                                <p className="text-indigo-700 font-bold mb-2">Reference Data:</p>
                                <p>1 amu = 931.5 MeV</p>
                                <p>Mass U-235 = 235.0439 amu</p>
                                <p>Mass Neutron = 1.0087 amu</p>
                                <p>Mass Ba-141 = 140.9144 amu</p>
                                <p>Mass Kr-92 = 91.8973 amu</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pet-scan' && (
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p><strong>Positron Emission Tomography (PET)</strong> is a medical imaging technique that utilizes antimatter.</p>
                            <p>A radioactive tracer emits a <strong>positron</strong> (e⁺), the antimatter counterpart of an electron. When a positron encounters an electron (e⁻) in the tissue, they <strong>annihilate</strong> each other.</p>
                            <p>Their entire mass is converted into pure energy in the form of two identical <strong>gamma ray</strong> (γ) photons emitted in exactly opposite directions to conserve momentum.</p>
                            <span className="text-xl font-semibold text-center block text-slate-800 mt-2 mb-2">E = 2m<sub>e</sub>c²</span>
                            <div className="bg-slate-50 p-4 rounded-lg text-sm font-mono border border-slate-200 space-y-1 mt-4">
                                <p className="text-indigo-700 font-bold mb-2">Reference Data:</p>
                                <p>Mass of e⁻ = 0.511 MeV/c²</p>
                                <p>Mass of e⁺ = 0.511 MeV/c²</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'synchrotron' && (
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>A <strong>Synchrotron</strong> is a cyclic particle accelerator. Unlike a cyclotron where the particle spirals outwards, a synchrotron keeps particles in a closed loop of constant radius.</p>
                            <p>This is achieved by synchronizing the increasing magnetic field (B) with the increasing momentum (p) of the particle, guided by the equation:</p>
                            <span className="text-xl font-semibold text-center block text-slate-800">p = q B r</span>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>p</strong> = momentum (kg·m/s)</li>
                                <li><strong>q</strong> = particle charge (C)</li>
                                <li><strong>B</strong> = magnetic field (T)</li>
                                <li><strong>r</strong> = radius of the ring (m)</li>
                            </ul>
                            <div className="bg-slate-50 p-4 rounded-lg text-sm font-mono border border-slate-200 mt-4">
                                <p className="text-indigo-700 font-bold mb-2">Reference Data:</p>
                                <p>Charge of proton (q) = 1.6 × 10<sup>-19</sup> C</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Middle Column: Visualizer */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
                    <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
                        <button onClick={() => handleTabChange('mass-energy')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'mass-energy' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>Fission</button>
                        <button onClick={() => handleTabChange('pet-scan')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'pet-scan' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>PET Scan</button>
                        <button onClick={() => handleTabChange('synchrotron')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'synchrotron' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>Synchrotron</button>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <svg width="100%" height="300" viewBox="0 0 300 300" className="bg-slate-900 rounded-xl overflow-hidden shadow-inner">
                            <SvgGrid />
                            
                            {activeTab === 'mass-energy' && (
                                <>
                                    {fissionProgress < 0.5 ? (
                                        <>
                                            <circle cx={150 + Math.sin(fissionProgress * 100) * (fissionProgress * 10)} cy={150 + Math.cos(fissionProgress * 120) * (fissionProgress * 10)} r="30" fill="#3b82f6" />
                                            <text x={150 + Math.sin(fissionProgress * 100) * (fissionProgress * 10)} y={150 + Math.cos(fissionProgress * 120) * (fissionProgress * 10) + 4} fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">U-235</text>
                                            
                                            <circle cx={50 + fissionProgress * 2 * 100} cy="150" r="6" fill="#ef4444" />
                                            <text x={50 + fissionProgress * 2 * 100} y="135" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">n</text>
                                        </>
                                    ) : (
                                        <>
                                            <circle cx={150 - (fissionProgress - 0.5) * 2 * 100} cy={150 - (fissionProgress - 0.5) * 2 * 60} r="18" fill="#8b5cf6" />
                                            <text x={150 - (fissionProgress - 0.5) * 2 * 100} y={150 - (fissionProgress - 0.5) * 2 * 60 + 4} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Kr-92</text>
                                            
                                            <circle cx={150 + (fissionProgress - 0.5) * 2 * 80} cy={150 + (fissionProgress - 0.5) * 2 * 90} r="24" fill="#10b981" />
                                            <text x={150 + (fissionProgress - 0.5) * 2 * 80} y={150 + (fissionProgress - 0.5) * 2 * 90 + 4} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Ba-141</text>
                                            
                                            <circle cx={150 - (fissionProgress - 0.5) * 2 * 60} cy={150 + (fissionProgress - 0.5) * 2 * 100} r="5" fill="#ef4444" />
                                            <circle cx={150 + (fissionProgress - 0.5) * 2 * 110} cy={150 - (fissionProgress - 0.5) * 2 * 40} r="5" fill="#ef4444" />
                                            <circle cx={150 + (fissionProgress - 0.5) * 2 * 40} cy={150 + (fissionProgress - 0.5) * 2 * 120} r="5" fill="#ef4444" />
                                            
                                            <circle cx="150" cy="150" r={(fissionProgress - 0.5) * 2 * 150} fill="#f59e0b" opacity={1 - (fissionProgress - 0.5) * 2} />
                                        </>
                                    )}
                                </>
                            )}

                            {activeTab === 'pet-scan' && (
                                <>
                                    {petProgress < 0.5 ? (
                                        <>
                                            <circle cx={50 + petProgress * 2 * 100} cy="150" r="8" fill="#3b82f6" />
                                            <text x={50 + petProgress * 2 * 100} y="130" fill="#3b82f6" fontSize="14" textAnchor="middle" fontWeight="bold">e⁻</text>
                                            
                                            <circle cx={250 - petProgress * 2 * 100} cy="150" r="8" fill="#ef4444" />
                                            <text x={250 - petProgress * 2 * 100} y="130" fill="#ef4444" fontSize="14" textAnchor="middle" fontWeight="bold">e⁺</text>
                                        </>
                                    ) : (
                                        <>
                                            <line x1="150" y1="150" x2={150 - (petProgress - 0.5) * 2 * 150} y2="150" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10 5" />
                                            <circle cx={150 - (petProgress - 0.5) * 2 * 150} cy="150" r="4" fill="#f59e0b" />
                                            <text x={150 - (petProgress - 0.5) * 2 * 100} y="135" fill="#f59e0b" fontSize="16" textAnchor="middle" fontWeight="bold">γ</text>

                                            <line x1="150" y1="150" x2={150 + (petProgress - 0.5) * 2 * 150} y2="150" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10 5" />
                                            <circle cx={150 + (petProgress - 0.5) * 2 * 150} cy="150" r="4" fill="#f59e0b" />
                                            <text x={150 + (petProgress - 0.5) * 2 * 100} y="175" fill="#f59e0b" fontSize="16" textAnchor="middle" fontWeight="bold">γ</text>
                                            
                                            <circle cx="150" cy="150" r={(petProgress - 0.5) * 2 * 60} fill="#f59e0b" opacity={1 - (petProgress - 0.5) * 2} />
                                        </>
                                    )}
                                </>
                            )}

                            {activeTab === 'synchrotron' && (
                                <>
                                    <g opacity="0.4">
                                        {Array.from({length: 6}).map((_, i) => 
                                            Array.from({length: 6}).map((_, j) => (
                                                <g key={`b${i}-${j}`} transform={`translate(${i*60 + 30}, ${j*60 + 30})`}>
                                                    <line x1="-4" y1="-4" x2="4" y2="4" stroke="#94a3b8" strokeWidth="2" />
                                                    <line x1="-4" y1="4" x2="4" y2="-4" stroke="#94a3b8" strokeWidth="2" />
                                                </g>
                                            ))
                                        )}
                                    </g>
                                    
                                    <circle cx="150" cy="150" r={syncRadius * 2} stroke="#334155" strokeWidth="24" fill="none" />
                                    <circle cx="150" cy="150" r={syncRadius * 2} stroke="#475569" strokeWidth="20" fill="none" strokeDasharray="10 10" />
                                    
                                    <circle cx={150 + Math.cos(syncAngle * Math.PI / 180) * (syncRadius * 2)} cy={150 + Math.sin(syncAngle * Math.PI / 180) * (syncRadius * 2)} r="8" fill="#ef4444" />
                                </>
                            )}
                        </svg>

                        {/* Interactive Controls */}
                        <div className="w-full mt-6">
                            {activeTab === 'mass-energy' && (
                                <div className="flex justify-center gap-4">
                                    <button 
                                        onClick={() => { setFissionState('fissioning'); setFissionProgress(0); setFissionCorrect(null); }}
                                        disabled={fissionState === 'fissioning'}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-full font-medium transition-colors"
                                    >
                                        <Zap className="w-4 h-4" /> Trigger Fission
                                    </button>
                                    <button 
                                        onClick={() => { setFissionState('idle'); setFissionProgress(0); }}
                                        className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-full font-medium transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" /> Reset
                                    </button>
                                </div>
                            )}

                            {activeTab === 'pet-scan' && (
                                <div className="flex justify-center gap-4">
                                    <button 
                                        onClick={() => { setPetState('annihilating'); setPetProgress(0); setPetCorrect(null); }}
                                        disabled={petState === 'annihilating'}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-full font-medium transition-colors"
                                    >
                                        <Zap className="w-4 h-4" /> Launch Particles
                                    </button>
                                    <button 
                                        onClick={() => { setPetState('idle'); setPetProgress(0); }}
                                        className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-full font-medium transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" /> Reset
                                    </button>
                                </div>
                            )}

                            {activeTab === 'synchrotron' && (
                                <div className="space-y-4 px-4">
                                    <div className="flex justify-center gap-4 mb-2">
                                        <button 
                                            onClick={() => setSyncRunning(!syncRunning)}
                                            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-colors ${syncRunning ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                                        >
                                            {syncRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} 
                                            {syncRunning ? 'Pause Ring' : 'Start Ring'}
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm text-slate-600 font-medium">
                                            <label>Magnetic Field (B)</label>
                                            <span>{syncBField.toFixed(1)} T</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" max="5" step="0.1"
                                            value={syncBField}
                                            onChange={e => { setSyncBField(parseFloat(e.target.value)); setSyncCorrect(null); }}
                                            className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm text-slate-600 font-medium">
                                            <label>Ring Radius (r)</label>
                                            <span>{syncRadius} m</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="10" max="50" step="1"
                                            value={syncRadius}
                                            onChange={e => { setSyncRadius(parseInt(e.target.value)); setSyncCorrect(null); }}
                                            className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Assessment */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full overflow-y-auto">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity className="text-indigo-600" />
                        Data Logging & Analysis
                    </h2>

                    {activeTab === 'mass-energy' && (
                        <div className="space-y-5">
                            <p className="text-sm text-slate-600">Simulate a U-235 fission event. Use the reference data to calculate the missing mass, then convert it to energy.</p>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Calculate Mass Defect (Δm)</label>
                                <div className="flex gap-2 items-center">
                                    <input 
                                        type="number"
                                        value={fissionDeltaM}
                                        onChange={e => { setFissionDeltaM(e.target.value); setFissionCorrect(null); }}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. 0.2148"
                                    />
                                    <span className="text-slate-600 font-medium">amu</span>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Calculate Energy Released (E)</label>
                                <div className="flex gap-2 items-center">
                                    <input 
                                        type="number"
                                        value={fissionEnergy}
                                        onChange={e => { setFissionEnergy(e.target.value); setFissionCorrect(null); }}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. 200.1"
                                    />
                                    <span className="text-slate-600 font-medium">MeV</span>
                                </div>
                            </div>

                            <button 
                                onClick={checkFission}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm"
                            >
                                Check Answers
                            </button>
                            
                            {fissionCorrect !== null && (
                                <div className={`p-4 rounded-md flex items-start gap-3 border ${fissionCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                    {fissionCorrect ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                                    <span className="text-sm leading-relaxed">{fissionCorrect ? 'Correct! The mass defect is ~0.2148 amu, yielding ~200.1 MeV of pure energy.' : 'Incorrect. Check your sums! Mass Defect = (Reactants Mass) - (Products Mass).'}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'pet-scan' && (
                        <div className="space-y-5">
                            <p className="text-sm text-slate-600">A positron and electron annihilate completely. Determine the energy of a single emitted gamma photon.</p>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Gamma Photon Energy (E<sub>γ</sub>)</label>
                                <div className="flex gap-2 items-center">
                                    <input 
                                        type="number"
                                        value={petGammaEnergy}
                                        onChange={e => { setPetGammaEnergy(e.target.value); setPetCorrect(null); }}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. 511"
                                    />
                                    <span className="text-slate-600 font-medium">keV</span>
                                </div>
                            </div>

                            <button 
                                onClick={checkPet}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm"
                            >
                                Check Answers
                            </button>

                            {petCorrect !== null && (
                                <div className={`p-4 rounded-md flex items-start gap-3 border ${petCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                    {petCorrect ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                                    <span className="text-sm leading-relaxed">{petCorrect ? 'Correct! Since 2 photons are emitted, each carries half the total energy (0.511 MeV = 511 keV).' : 'Incorrect. The total mass is 2 * 0.511 MeV/c², which converts to energy that is shared equally by two photons.'}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'synchrotron' && (
                        <div className="space-y-5">
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-sm space-y-2 font-mono">
                                <p className="text-indigo-700 font-bold border-b border-slate-200 pb-1">Sensor Readout:</p>
                                <p>B-Field : {syncBField.toFixed(1)} T</p>
                                <p>Radius  : {syncRadius} m</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Calculate Proton Momentum (p)</label>
                                <div className="flex gap-2 items-center">
                                    <input 
                                        type="number"
                                        value={syncMomentum}
                                        onChange={e => { setSyncMomentum(e.target.value); setSyncCorrect(null); }}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-0"
                                        placeholder="e.g. 9.6"
                                    />
                                    <span className="text-slate-600 font-medium whitespace-nowrap text-sm">× 10<sup>-18</sup> kg·m/s</span>
                                </div>
                            </div>

                            <button 
                                onClick={checkSync}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm"
                            >
                                Check Answers
                            </button>

                            {syncCorrect !== null && (
                                <div className={`p-4 rounded-md flex items-start gap-3 border ${syncCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                    {syncCorrect ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                                    <span className="text-sm leading-relaxed">{syncCorrect ? 'Correct! You successfully computed the proton momentum for the current track configuration.' : 'Incorrect. Use p = q * B * r, where q = 1.6 × 10^-19 C. Watch your powers of 10!'}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
