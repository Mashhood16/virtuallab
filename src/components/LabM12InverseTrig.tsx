import { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Camera, Building2 } from 'lucide-react';

export default function LabM12InverseTrig({ onExit }: { onExit?: () => void }) {
    const [activeTab, setActiveTab] = useState<'survey' | 'optics'>('survey');

    // Survey State
    const [distance, setDistance] = useState(50);
    const [angleDeg, setAngleDeg] = useState(30);
    const [ansHeight, setAnsHeight] = useState('');
    const [surveyFeedback, setSurveyFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

    // Optics State
    const [widthObj, setWidthObj] = useState(10);
    const [distObj, setDistObj] = useState(15);
    const [ansFov, setAnsFov] = useState('');
    const [opticsFeedback, setOpticsFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

    const checkSurvey = () => {
        const trueHeight = distance * Math.tan((angleDeg * Math.PI) / 180);
        const parsed = parseFloat(ansHeight);
        if (!isNaN(parsed) && Math.abs(parsed - trueHeight) < 0.1) {
            setSurveyFeedback('correct');
        } else {
            setSurveyFeedback('incorrect');
        }
    };

    const checkOptics = () => {
        const trueFovRad = 2 * Math.atan(widthObj / (2 * distObj));
        const trueFovDeg = trueFovRad * 180 / Math.PI;
        const parsed = parseFloat(ansFov);
        if (!isNaN(parsed) && Math.abs(parsed - trueFovDeg) < 0.1) {
            setOpticsFeedback('correct');
        } else {
            setOpticsFeedback('incorrect');
        }
    };

    // SVG scaling calculations for Survey
    const trueHeight = distance * Math.tan((angleDeg * Math.PI) / 180);
    const maxDimensionS = Math.max(100, trueHeight);
    const scaleS = 250 / maxDimensionS;
    const pxDistS = distance * scaleS;
    const pxHeightS = trueHeight * scaleS;

    const surveyorX = 50;
    const surveyorY = 300;
    const bldgX = surveyorX + pxDistS;
    const bldgTopY = surveyorY - pxHeightS;
    
    const rArcS = 40;
    const angleRad = angleDeg * Math.PI / 180;
    const endArcX_S = surveyorX + rArcS * Math.cos(angleRad);
    const endArcY_S = surveyorY - rArcS * Math.sin(angleRad);
    const surveyArcPath = `M ${surveyorX + rArcS},${surveyorY} A ${rArcS},${rArcS} 0 0,0 ${endArcX_S},${endArcY_S}`;

    // SVG scaling calculations for Optics
    const trueFovRad = 2 * Math.atan(widthObj / (2 * distObj));
    const maxDimensionO = Math.max(distObj, widthObj);
    const scaleO = 250 / maxDimensionO;
    const pxDistO = distObj * scaleO;
    const pxWidthO = widthObj * scaleO;

    const camX = 200;
    const camY = 350;
    const objY = camY - pxDistO;
    const objLeftX = camX - pxWidthO / 2;
    const objRightX = camX + pxWidthO / 2;

    const rArcO = 50;
    const halfAngle = trueFovRad / 2;
    const arcLeftX = camX - rArcO * Math.sin(halfAngle);
    const arcLeftY = camY - rArcO * Math.cos(halfAngle);
    const arcRightX = camX + rArcO * Math.sin(halfAngle);
    const arcRightY = camY - rArcO * Math.cos(halfAngle);
    const fovArcPath = `M ${arcLeftX},${arcLeftY} A ${rArcO},${rArcO} 0 0,1 ${arcRightX},${arcRightY}`;

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none text-slate-800">
            {/* Header */}
            <div className="flex items-center p-4 bg-white shadow-sm border-b border-slate-200 shrink-0">
                <button onClick={() => onExit?.()} className="p-2 mr-4 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Grade 12: Inverse Trigonometry Simulator</h1>
            </div>

            <div className="flex-1 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
                    
                    {/* Column 1: Theory */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col overflow-y-auto border border-slate-100">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Theoretical Concepts</h2>
                        
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-indigo-700 mb-2 flex items-center">
                                <Building2 className="w-5 h-5 mr-2" /> Surveying Heights
                            </h3>
                            <p className="text-sm text-slate-600 mb-3">
                                Using a clinometer or theodolite, surveyors measure the angle of elevation to the top of a building.
                            </p>
                            <p className="text-sm text-slate-600 mb-3">
                                If the horizontal distance is { "$$ d $$" }, the height { "$$ h $$" } is found using:
                            </p>
                            <div className="bg-slate-50 p-3 rounded-lg mt-3 text-center text-sm overflow-x-auto">
                                { "$$ \\tan(\\theta) = \\frac{h}{d} \\implies h = d \\tan(\\theta) $$" }
                            </div>
                            <p className="text-sm text-slate-600 mt-3">
                                Conversely, to find the angle given dimensions, we use the inverse tangent: { "$$ \\theta = \\arctan(\\frac{h}{d}) $$" }
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-purple-700 mb-2 flex items-center">
                                <Camera className="w-5 h-5 mr-2" /> Optics & Field of View
                            </h3>
                            <p className="text-sm text-slate-600 mb-3">
                                In 3D graphics and camera optics, the Field of View (FOV) determines how much of the scene is visible.
                            </p>
                            <p className="text-sm text-slate-600 mb-3">
                                For an object of width { "$$ w $$" } perfectly framed at distance { "$$ d $$" }, the angle { "$$ \\alpha $$" } subtended at the lens is found using right triangles:
                            </p>
                            <div className="bg-slate-50 p-3 rounded-lg mt-3 text-center text-sm overflow-x-auto">
                                { "$$ \\tan\\left(\\frac{\\alpha}{2}\\right) = \\frac{w/2}{d} $$" }
                            </div>
                            <p className="text-sm text-slate-600 mt-3 text-center font-semibold">
                                { "$$ \\alpha = 2 \\arctan\\left(\\frac{w}{2d}\\right) $$" }
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Simulation */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col border border-slate-100">
                        <div className="flex space-x-2 mb-6 bg-slate-100 p-1 rounded-lg shrink-0">
                            <button
                                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${activeTab === 'survey' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setActiveTab('survey')}
                            >
                                <Building2 className="w-4 h-4 mr-2" />
                                Surveying
                            </button>
                            <button
                                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${activeTab === 'optics' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setActiveTab('optics')}
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                Optics FOV
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center">
                            {activeTab === 'survey' && (
                                <div className="w-full flex flex-col items-center">
                                    <svg viewBox="0 0 400 350" className="w-full max-w-md bg-slate-50 rounded-lg shadow-inner mb-6">
                                        {/* Ground */}
                                        <line x1="20" y1={surveyorY} x2="380" y2={surveyorY} stroke="#94a3b8" strokeWidth="3" />
                                        
                                        {/* Building */}
                                        <rect x={bldgX} y={bldgTopY} width="40" height={pxHeightS} fill="#64748b" rx="2" />
                                        
                                        {/* Surveyor */}
                                        <circle cx={surveyorX} cy={surveyorY - 10} r="6" fill="#334155" />
                                        <line x1={surveyorX} y1={surveyorY - 4} x2={surveyorX} y2={surveyorY} stroke="#334155" strokeWidth="3" />

                                        {/* Line of sight */}
                                        <line 
                                            x1={surveyorX} y1={surveyorY} 
                                            x2={bldgX} y2={bldgTopY} 
                                            stroke="#4f46e5" strokeWidth="2" strokeDasharray="5 5" 
                                        />

                                        {/* Angle Arc */}
                                        <path d={surveyArcPath} fill="none" stroke="#4f46e5" strokeWidth="2" />
                                        <text x={surveyorX + rArcS + 10} y={surveyorY - 15} fill="#4f46e5" fontSize="12" fontWeight="bold">{angleDeg}°</text>

                                        {/* Distance label */}
                                        <text x={surveyorX + pxDistS / 2} y={surveyorY + 20} fill="#64748b" fontSize="12" textAnchor="middle">d = {distance}m</text>
                                    </svg>
                                    
                                    <div className="w-full grid grid-cols-1 gap-4 bg-indigo-50 p-4 rounded-lg">
                                        <div>
                                            <label className="block text-xs font-semibold text-indigo-800 mb-1">Horizontal Distance (d): {distance} m</label>
                                            <input type="range" min="10" max="100" step="5" value={distance} onChange={(e) => setDistance(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-indigo-800 mb-1">Angle of Elevation (θ): {angleDeg}°</label>
                                            <input type="range" min="10" max="80" step="1" value={angleDeg} onChange={(e) => setAngleDeg(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'optics' && (
                                <div className="w-full flex flex-col items-center">
                                    <svg viewBox="0 0 400 400" className="w-full max-w-md bg-slate-50 rounded-lg shadow-inner mb-6">
                                        {/* Camera */}
                                        <circle cx={camX} cy={camY} r="8" fill="#1e293b" />
                                        <rect x={camX - 15} y={camY + 8} width="30" height="15" fill="#334155" rx="2" />

                                        {/* Object */}
                                        <line x1={objLeftX} y1={objY} x2={objRightX} y2={objY} stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
                                        <text x={camX} y={objY - 15} fill="#b45309" fontSize="12" fontWeight="bold" textAnchor="middle">Width = {widthObj}</text>

                                        {/* Sight lines */}
                                        <line x1={camX} y1={camY} x2={objLeftX} y2={objY} stroke="#9333ea" strokeWidth="2" strokeDasharray="5 5" />
                                        <line x1={camX} y1={camY} x2={objRightX} y2={objY} stroke="#9333ea" strokeWidth="2" strokeDasharray="5 5" />
                                        
                                        {/* Center line */}
                                        <line x1={camX} y1={camY} x2={camX} y2={objY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                                        <text x={camX + 5} y={camY - pxDistO / 2} fill="#64748b" fontSize="12">d={distObj}</text>

                                        {/* FOV Arc */}
                                        <path d={fovArcPath} fill="none" stroke="#9333ea" strokeWidth="2" />
                                        <text x={camX} y={camY - rArcO - 10} fill="#9333ea" fontSize="12" fontWeight="bold" textAnchor="middle">FOV (α)</text>
                                    </svg>
                                    
                                    <div className="w-full grid grid-cols-1 gap-4 bg-purple-50 p-4 rounded-lg">
                                        <div>
                                            <label className="block text-xs font-semibold text-purple-800 mb-1">Object Width (w): {widthObj} units</label>
                                            <input type="range" min="5" max="50" step="1" value={widthObj} onChange={(e) => setWidthObj(parseFloat(e.target.value))} className="w-full accent-purple-600" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-purple-800 mb-1">Camera Distance (d): {distObj} units</label>
                                            <input type="range" min="5" max="50" step="1" value={distObj} onChange={(e) => setDistObj(parseFloat(e.target.value))} className="w-full accent-purple-600" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Assessment */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col border border-slate-100">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Analysis & Assessment</h2>

                        {activeTab === 'survey' && (
                            <div className="flex-1 flex flex-col">
                                <p className="text-sm text-slate-600 mb-4">A surveyor looks at a building under the conditions shown in the simulation:</p>
                                <div className="bg-slate-100 p-4 rounded-lg mb-6 font-mono text-center text-sm">
                                    Distance (d) = {distance} m
                                    <br />
                                    Angle (θ) = {angleDeg}°
                                </div>
                                <p className="text-sm font-semibold mb-4 text-slate-800">Calculate the true height of the building (h). (Round to 2 decimal places):</p>
                                
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Building Height (h)</label>
                                        <input 
                                            type="number" 
                                            value={ansHeight} 
                                            onChange={(e) => setAnsHeight(e.target.value)} 
                                            className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Enter h..."
                                        />
                                    </div>
                                </div>

                                <button 
                                    onClick={checkSurvey}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Check Answer
                                </button>

                                {surveyFeedback === 'correct' && (
                                    <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center">
                                        <CheckCircle2 className="w-5 h-5 mr-2" /> Correct! Height calculated successfully.
                                    </div>
                                )}
                                {surveyFeedback === 'incorrect' && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                                        <XCircle className="w-5 h-5 mr-2" /> Incorrect. Use h = d * tan(θ) and check degrees/radians.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'optics' && (
                            <div className="flex-1 flex flex-col">
                                <p className="text-sm text-slate-600 mb-4">An object needs to be perfectly framed by a 3D camera with these parameters:</p>
                                <div className="bg-slate-100 p-4 rounded-lg mb-6 font-mono text-center text-sm">
                                    Width (w) = {widthObj}
                                    <br />
                                    Distance (d) = {distObj}
                                </div>
                                <p className="text-sm font-semibold mb-4 text-slate-800">Calculate the required Field of View (FOV) angle in DEGREES. (Round to 2 decimal places):</p>
                                
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">FOV Angle (α) in degrees</label>
                                        <input 
                                            type="number" 
                                            value={ansFov} 
                                            onChange={(e) => setAnsFov(e.target.value)} 
                                            className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter α..."
                                        />
                                    </div>
                                </div>

                                <button 
                                    onClick={checkOptics}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Check Answer
                                </button>

                                {opticsFeedback === 'correct' && (
                                    <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center">
                                        <CheckCircle2 className="w-5 h-5 mr-2" /> Correct! FOV angle successfully rendered.
                                    </div>
                                )}
                                {opticsFeedback === 'incorrect' && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                                        <XCircle className="w-5 h-5 mr-2" /> Incorrect. Use α = 2 * arctan(w / 2d) and convert to degrees.
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
