import { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, TrendingUp, LineChart } from 'lucide-react';

export default function LabM12Functions({ onExit }: { onExit?: () => void }) {
    const [activeTab, setActiveTab] = useState<'market' | 'growth'>('market');

    // Market State
    const [ms, setMs] = useState(2);
    const [cs, setCs] = useState(10);
    const [md, setMd] = useState(-2);
    const [cd, setCd] = useState(70);

    const [ansQ, setAnsQ] = useState('');
    const [ansP, setAnsP] = useState('');
    const [marketFeedback, setMarketFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

    // Growth State
    const [p0, setP0] = useState(50);
    const [r, setR] = useState(0.05);
    const [t, setT] = useState(10);

    const [ansPop, setAnsPop] = useState('');
    const [growthFeedback, setGrowthFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

    const checkMarket = () => {
        const trueQ = (cd - cs) / (ms - md);
        const trueP = ms * trueQ + cs;
        const qParsed = parseFloat(ansQ);
        const pParsed = parseFloat(ansP);
        if (!isNaN(qParsed) && !isNaN(pParsed) && Math.abs(qParsed - trueQ) < 0.1 && Math.abs(pParsed - trueP) < 0.1) {
            setMarketFeedback('correct');
        } else {
            setMarketFeedback('incorrect');
        }
    };

    const checkGrowth = () => {
        const truePop = p0 * Math.exp(r * t);
        const popParsed = parseFloat(ansPop);
        if (!isNaN(popParsed) && Math.abs(popParsed - Math.round(truePop)) <= 1) {
            setGrowthFeedback('correct');
        } else {
            setGrowthFeedback('incorrect');
        }
    };

    // Graph Dimensions
    const width = 400;
    const height = 300;
    const padding = 40;

    // Market SVG Scaling
    const scaleX_M = (q: number) => padding + (q / 30) * (width - 2 * padding);
    const scaleY_M = (p: number) => height - padding - (p / 120) * (height - 2 * padding);

    // Growth SVG Scaling
    const maxP = Math.max(100, p0 * Math.exp(r * 20));
    const growthPath = useMemo(() => {
        let d = '';
        for (let t_val = 0; t_val <= 20; t_val += 0.5) {
            const p_val = p0 * Math.exp(r * t_val);
            const x = padding + (t_val / 20) * (width - 2 * padding);
            const y = height - padding - (p_val / maxP) * (height - 2 * padding);
            if (t_val === 0) d += `M ${x},${y} `;
            else d += `L ${x},${y} `;
        }
        return d;
    }, [p0, r, maxP, width, height, padding]);

    const scaleX_G = (t_val: number) => padding + (t_val / 20) * (width - 2 * padding);
    const scaleY_G = (p_val: number) => height - padding - (p_val / maxP) * (height - 2 * padding);

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none text-slate-800">
            {/* Header */}
            <div className="flex items-center p-4 bg-white shadow-sm border-b border-slate-200 shrink-0">
                <button onClick={() => onExit?.()} className="p-2 mr-4 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Grade 12: Functions Visualizer</h1>
            </div>

            <div className="flex-1 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
                    
                    {/* Column 1: Theory */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col overflow-y-auto border border-slate-100">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Theoretical Concepts</h2>
                        
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
                                <LineChart className="w-5 h-5 mr-2" /> Market Equilibrium
                            </h3>
                            <p className="text-sm text-slate-600 mb-3">
                                In economics, the market equilibrium is the point where the supply of a good matches demand.
                            </p>
                            <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                                <li><strong>Supply Function S(q)</strong>: An upward sloping line reflecting higher prices encouraging more production.</li>
                                <li><strong>Demand Function D(q)</strong>: A downward sloping line reflecting higher prices reducing consumer demand.</li>
                            </ul>
                            <div className="bg-slate-50 p-3 rounded-lg mt-3 text-center">
                                { "$$ S(q) = m_s q + c_s $$" }
                                <br/>
                                { "$$ D(q) = m_d q + c_d $$" }
                            </div>
                            <p className="text-sm text-slate-600 mt-2">
                                At equilibrium, { "$$ S(q) = D(q) $$" }.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-emerald-700 mb-2 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" /> Continuous Exponential Growth
                            </h3>
                            <p className="text-sm text-slate-600 mb-3">
                                Population demographics or continuous compound interest is modeled by:
                            </p>
                            <div className="bg-slate-50 p-3 rounded-lg mt-3 text-center">
                                { "$$ P(t) = P_0 e^{rt} $$" }
                            </div>
                            <ul className="text-sm text-slate-600 space-y-2 mt-3 list-disc list-inside">
                                <li>{ "$$ P_0 $$" } is the initial quantity.</li>
                                <li>{ "$$ r $$" } is the continuous growth rate.</li>
                                <li>{ "$$ t $$" } is time.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 2: Simulation */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col border border-slate-100">
                        <div className="flex space-x-2 mb-6 bg-slate-100 p-1 rounded-lg shrink-0">
                            <button
                                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${activeTab === 'market' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setActiveTab('market')}
                            >
                                <LineChart className="w-4 h-4 mr-2" />
                                Market Equilibrium
                            </button>
                            <button
                                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${activeTab === 'growth' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setActiveTab('growth')}
                            >
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Exponential Growth
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center">
                            {activeTab === 'market' && (
                                <div className="w-full flex flex-col items-center">
                                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md bg-slate-50 rounded-lg shadow-inner mb-6">
                                        {/* Axes */}
                                        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#94a3b8" strokeWidth="2" />
                                        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#94a3b8" strokeWidth="2" />
                                        <text x={width - padding + 5} y={height - padding + 4} fontSize="10" fill="#64748b">Quantity</text>
                                        <text x={padding - 10} y={padding - 5} fontSize="10" fill="#64748b" textAnchor="end">Price</text>

                                        {/* Supply Line */}
                                        <line 
                                            x1={scaleX_M(0)} y1={scaleY_M(cs)} 
                                            x2={scaleX_M(30)} y2={scaleY_M(ms * 30 + cs)} 
                                            stroke="#2563eb" strokeWidth="3" 
                                        />
                                        <text x={scaleX_M(28)} y={scaleY_M(ms * 28 + cs) - 10} fill="#2563eb" fontSize="12" fontWeight="bold">S(q)</text>

                                        {/* Demand Line */}
                                        <line 
                                            x1={scaleX_M(0)} y1={scaleY_M(cd)} 
                                            x2={scaleX_M(30)} y2={scaleY_M(md * 30 + cd)} 
                                            stroke="#dc2626" strokeWidth="3" 
                                        />
                                        <text x={scaleX_M(28)} y={scaleY_M(md * 28 + cd) + 15} fill="#dc2626" fontSize="12" fontWeight="bold">D(q)</text>

                                        {/* Intersection Dot */}
                                        {((cd - cs) / (ms - md)) >= 0 && ((cd - cs) / (ms - md)) <= 30 && (
                                            <circle 
                                                cx={scaleX_M((cd - cs) / (ms - md))} 
                                                cy={scaleY_M(ms * ((cd - cs) / (ms - md)) + cs)} 
                                                r="5" fill="#16a34a" 
                                            />
                                        )}
                                    </svg>
                                    
                                    <div className="w-full grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
                                        <div>
                                            <label className="block text-xs font-semibold text-blue-800 mb-1">Supply Slope (m_s): {ms}</label>
                                            <input type="range" min="1" max="5" step="0.5" value={ms} onChange={(e) => setMs(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-blue-800 mb-1">Supply Intercept (c_s): {cs}</label>
                                            <input type="range" min="0" max="40" step="5" value={cs} onChange={(e) => setCs(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-red-800 mb-1">Demand Slope (m_d): {md}</label>
                                            <input type="range" min="-5" max="-1" step="0.5" value={md} onChange={(e) => setMd(parseFloat(e.target.value))} className="w-full accent-red-600" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-red-800 mb-1">Demand Intercept (c_d): {cd}</label>
                                            <input type="range" min="50" max="120" step="5" value={cd} onChange={(e) => setCd(parseFloat(e.target.value))} className="w-full accent-red-600" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'growth' && (
                                <div className="w-full flex flex-col items-center">
                                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md bg-slate-50 rounded-lg shadow-inner mb-6">
                                        {/* Axes */}
                                        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#94a3b8" strokeWidth="2" />
                                        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#94a3b8" strokeWidth="2" />
                                        <text x={width - padding + 5} y={height - padding + 4} fontSize="10" fill="#64748b">Time (t)</text>
                                        <text x={padding - 10} y={padding - 5} fontSize="10" fill="#64748b" textAnchor="end">Population</text>

                                        {/* Exponential Curve */}
                                        <path d={growthPath} fill="none" stroke="#10b981" strokeWidth="3" />

                                        {/* Current Time Dot */}
                                        <circle 
                                            cx={scaleX_G(t)} 
                                            cy={scaleY_G(p0 * Math.exp(r * t))} 
                                            r="5" fill="#059669" 
                                        />
                                        <line 
                                            x1={scaleX_G(t)} y1={scaleY_G(p0 * Math.exp(r * t))} 
                                            x2={scaleX_G(t)} y2={height - padding} 
                                            stroke="#059669" strokeWidth="1" strokeDasharray="4 4" 
                                        />
                                    </svg>
                                    
                                    <div className="w-full grid grid-cols-1 gap-4 bg-emerald-50 p-4 rounded-lg">
                                        <div>
                                            <label className="block text-xs font-semibold text-emerald-800 mb-1">Initial Population (P_0): {p0}</label>
                                            <input type="range" min="10" max="100" step="10" value={p0} onChange={(e) => setP0(parseFloat(e.target.value))} className="w-full accent-emerald-600" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-emerald-800 mb-1">Growth Rate (r): {(r * 100).toFixed(0)}%</label>
                                            <input type="range" min="0.01" max="0.15" step="0.01" value={r} onChange={(e) => setR(parseFloat(e.target.value))} className="w-full accent-emerald-600" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-emerald-800 mb-1">Time (t): {t} years</label>
                                            <input type="range" min="0" max="20" step="1" value={t} onChange={(e) => setT(parseFloat(e.target.value))} className="w-full accent-emerald-600" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Assessment */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col border border-slate-100">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Analysis & Assessment</h2>

                        {activeTab === 'market' && (
                            <div className="flex-1 flex flex-col">
                                <p className="text-sm text-slate-600 mb-4">Given the current market conditions set in the simulator:</p>
                                <div className="bg-slate-100 p-4 rounded-lg mb-6 font-mono text-center text-sm">
                                    S(q) = {ms}q + {cs}
                                    <br />
                                    D(q) = {md}q + {cd}
                                </div>
                                <p className="text-sm font-semibold mb-4 text-slate-800">Calculate the equilibrium quantity (q*) and price (p*):</p>
                                
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Equilibrium Quantity (q*)</label>
                                        <input 
                                            type="number" 
                                            value={ansQ} 
                                            onChange={(e) => setAnsQ(e.target.value)} 
                                            className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter q..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Equilibrium Price (p*)</label>
                                        <input 
                                            type="number" 
                                            value={ansP} 
                                            onChange={(e) => setAnsP(e.target.value)} 
                                            className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter p..."
                                        />
                                    </div>
                                </div>

                                <button 
                                    onClick={checkMarket}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Check Answer
                                </button>

                                {marketFeedback === 'correct' && (
                                    <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center">
                                        <CheckCircle2 className="w-5 h-5 mr-2" /> Correct! Market is in equilibrium.
                                    </div>
                                )}
                                {marketFeedback === 'incorrect' && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                                        <XCircle className="w-5 h-5 mr-2" /> Incorrect. Equate S(q) and D(q) and try again.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'growth' && (
                            <div className="flex-1 flex flex-col">
                                <p className="text-sm text-slate-600 mb-4">A population starts and grows continuously based on your parameters:</p>
                                <div className="bg-slate-100 p-4 rounded-lg mb-6 font-mono text-center text-sm">
                                    P_0 = {p0}
                                    <br />
                                    r = {r}
                                    <br />
                                    t = {t}
                                </div>
                                <p className="text-sm font-semibold mb-4 text-slate-800">Calculate the population P(t) at the given time. (Round to nearest whole number):</p>
                                
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Population at time t</label>
                                        <input 
                                            type="number" 
                                            value={ansPop} 
                                            onChange={(e) => setAnsPop(e.target.value)} 
                                            className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Enter P(t)..."
                                        />
                                    </div>
                                </div>

                                <button 
                                    onClick={checkGrowth}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Check Answer
                                </button>

                                {growthFeedback === 'correct' && (
                                    <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center">
                                        <CheckCircle2 className="w-5 h-5 mr-2" /> Correct! Population successfully projected.
                                    </div>
                                )}
                                {growthFeedback === 'incorrect' && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                                        <XCircle className="w-5 h-5 mr-2" /> Incorrect. Use P(t) = P_0 * e^(rt) and try again.
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
