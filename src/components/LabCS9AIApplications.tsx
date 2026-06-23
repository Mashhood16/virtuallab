import { useState, useEffect } from 'react';
import { Network, Brain, CheckCircle2, Activity, ShieldAlert, ArrowRight } from 'lucide-react';

interface LabProps {
  onExit?: () => void;
}

type AINode = {
    id: string;
    label: string;
    category: 'Root' | 'NLP' | 'Healthcare' | 'Manufacturing';
    issue: string;
    solution: string;
    unlocked: boolean;
    x: number;
    y: number;
    parentId?: string;
};

const initialNodes: AINode[] = [
    { id: 'ai', label: 'Artificial Intelligence', category: 'Root', issue: '', solution: '', unlocked: true, x: 50, y: 15 },
    { id: 'nlp', label: 'NLP', category: 'NLP', issue: 'Training data bias', solution: 'Diverse dataset curation', unlocked: false, x: 20, y: 45, parentId: 'ai' },
    { id: 'health', label: 'Healthcare', category: 'Healthcare', issue: 'Patient Data Privacy', solution: 'Anonymization & Consent', unlocked: false, x: 50, y: 45, parentId: 'ai' },
    { id: 'mfg', label: 'Manufacturing', category: 'Manufacturing', issue: 'Job Displacement', solution: 'Worker reskilling programs', unlocked: false, x: 80, y: 45, parentId: 'ai' },
    { id: 'chatbot', label: 'Chatbots', category: 'NLP', issue: 'Hallucinations', solution: 'Fact-checking algorithms', unlocked: false, x: 10, y: 75, parentId: 'nlp' },
    { id: 'translation', label: 'Translation', category: 'NLP', issue: 'Cultural nuance loss', solution: 'Human-in-the-loop review', unlocked: false, x: 30, y: 75, parentId: 'nlp' },
    { id: 'imaging', label: 'Medical Imaging', category: 'Healthcare', issue: 'False Positives', solution: 'Doctor verification', unlocked: false, x: 50, y: 75, parentId: 'health' },
    { id: 'qc', label: 'Quality Control', category: 'Manufacturing', issue: 'Sensor failures', solution: 'Redundant systems', unlocked: false, x: 80, y: 75, parentId: 'mfg' },
];

export default function LabCS9AIApplications({ onExit }: LabProps) {
    const [nodes, setNodes] = useState<AINode[]>(initialNodes);
    const [selectedNode, setSelectedNode] = useState<AINode | null>(null);
    const [logs, setLogs] = useState<{node: string; issue: string; solved: boolean}[]>([]);
    const [assessmentScenario, setAssessmentScenario] = useState(0);
    const [assessmentAnswer, setAssessmentAnswer] = useState('');
    const [assessmentFeedback, setAssessmentFeedback] = useState('');

    const scenarios = [
        { text: "A hospital uses AI to scan X-rays, but the system occasionally flags normal scans as anomalous. What is the primary functional issue?", answer: "False Positives" },
        { text: "An AI language model outputs text that heavily favors a specific demographic because of the texts it read on the internet. What ethical issue is this?", answer: "Training data bias" },
    ];

    useEffect(() => {
        setAssessmentScenario(Math.floor(Math.random() * scenarios.length));
    }, []);

    const handleNodeClick = (node: AINode) => {
        setSelectedNode(node);
    };

    const solveIssue = () => {
        if (!selectedNode || selectedNode.id === 'ai') return;
        setNodes(nodes.map(n => n.id === selectedNode.id ? { ...n, unlocked: true } : n));
        setLogs(prev => [...prev, { node: selectedNode.label, issue: selectedNode.issue, solved: true }]);
        setSelectedNode({ ...selectedNode, unlocked: true });
    };

    const checkAssessment = () => {
        if (!scenarios[assessmentScenario]) return;
        if (assessmentAnswer.toLowerCase().trim() === scenarios[assessmentScenario].answer.toLowerCase()) {
            setAssessmentFeedback("Correct! You have identified the key issue.");
        } else {
            setAssessmentFeedback(`Incorrect. Hint: Think about ${scenarios[assessmentScenario].answer.substring(0,3)}...`);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold flex items-center gap-2"><Network className="w-6 h-6"/> AI Applications & Ethics</h1>
                {onExit && <button onClick={onExit} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg font-semibold transition-colors">Exit Lab</button>}
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Column 1: Theory */}
                <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-4 border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Brain className="w-6 h-6 text-indigo-600" />
                        Theory & Context
                    </h2>
                    <div className="text-sm text-slate-600 space-y-3">
                        <p><strong>Artificial Intelligence (AI)</strong> systems are designed to perform tasks that typically require human intelligence, such as visual perception, speech recognition, and decision-making.</p>
                        <p>However, real-world AI applications face significant functional and ethical challenges:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Healthcare:</strong> Patient privacy and the risk of false diagnoses.</li>
                            <li><strong>NLP (Natural Language Processing):</strong> Inheriting human biases from training data and generating false information (hallucinations).</li>
                            <li><strong>Manufacturing:</strong> Job displacement and over-reliance on automated quality control.</li>
                        </ul>
                        <div className="mt-4 p-3 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
                            <p className="font-semibold text-indigo-900 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Objective</p>
                            <p className="mt-1">Explore the tech tree, identify the risks associated with each domain, and deploy solutions to make the AI safe for use.</p>
                        </div>
                    </div>
                </div>

                {/* Column 2: Simulator */}
                <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <Network className="w-6 h-6 text-indigo-600" />
                        AI Tech Tree Simulator
                    </h2>
                    <p className="text-xs text-slate-500 mb-4 text-center">Click locked nodes (gray) to analyze their issues. Solve them to unlock the tech.</p>
                    
                    <div className="relative w-full aspect-square max-w-md border-2 border-indigo-50 rounded-xl bg-slate-50 overflow-hidden shadow-inner">
                        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                            {nodes.map(node => {
                                if (!node.parentId) return null;
                                const parent = nodes.find(n => n.id === node.parentId);
                                if (!parent) return null;
                                return (
                                    <line 
                                        key={`edge-${node.id}`}
                                        x1={parent.x} y1={parent.y} 
                                        x2={node.x} y2={node.y}
                                        stroke={node.unlocked ? "#4f46e5" : "#cbd5e1"}
                                        strokeWidth="0.8"
                                    />
                                );
                            })}
                            {nodes.map(node => (
                                <g key={node.id} onClick={() => handleNodeClick(node)} className="cursor-pointer transition-transform hover:scale-105" transform={`translate(${node.x}, ${node.y})`}>
                                    <circle 
                                        r="4" 
                                        fill={node.unlocked ? "#4f46e5" : "#e2e8f0"} 
                                        stroke={node.unlocked ? "#3730a3" : "#94a3b8"} 
                                        strokeWidth="0.5" 
                                    />
                                    <text y="7" fontSize="3" textAnchor="middle" fill="#334155" className="font-semibold pointer-events-none">
                                        {node.label}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </div>

                    {selectedNode && selectedNode.id !== 'ai' && (
                        <div className="mt-4 w-full bg-indigo-50 p-4 rounded-lg border border-indigo-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="font-bold text-indigo-900 mb-1">{selectedNode.label} Analysis</h3>
                            <p className="text-sm mb-3"><span className="font-semibold text-slate-700">Identified Risk:</span> {selectedNode.issue}</p>
                            {selectedNode.unlocked ? (
                                <div className="flex items-center gap-2 text-sm text-green-700 font-semibold bg-green-50 p-2 rounded border border-green-200">
                                    <CheckCircle2 className="w-4 h-4"/> Solved: {selectedNode.solution}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-slate-600">Propose Solution:</p>
                                    <button onClick={solveIssue} className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2 shadow-sm">
                                        Deploy: {selectedNode.solution} <ArrowRight className="w-4 h-4"/>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Column 3: Analysis */}
                <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col h-full border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-indigo-600" />
                        Analysis & Assessment
                    </h2>
                    
                    <div className="flex-1 min-h-[200px] overflow-y-auto bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 shadow-inner">
                        <h3 className="font-semibold text-sm text-slate-700 mb-3 border-b pb-1 border-slate-200">Security Log</h3>
                        {logs.length === 0 ? (
                            <p className="text-xs text-slate-500 italic text-center mt-8">No issues resolved yet.<br/>Interact with the tech tree.</p>
                        ) : (
                            <ul className="space-y-2">
                                {logs.map((log, i) => (
                                    <li key={i} className="text-xs p-2 bg-white rounded border border-green-200 flex justify-between items-center shadow-sm animate-in slide-in-from-left-2">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700">{log.node}</span>
                                            <span className="text-slate-500">{log.issue}</span>
                                        </div>
                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200 shadow-sm">
                        <h3 className="font-bold text-indigo-900 mb-2 text-sm flex items-center gap-2">Knowledge Check</h3>
                        {scenarios[assessmentScenario] && (
                            <p className="text-sm text-indigo-900 mb-4">{scenarios[assessmentScenario].text}</p>
                        )}
                        <div className="flex flex-col gap-3">
                            <input 
                                type="text" 
                                value={assessmentAnswer}
                                onChange={e => setAssessmentAnswer(e.target.value)}
                                placeholder="Type the issue name exactly..."
                                className="px-3 py-2 border border-indigo-300 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
                            />
                            <button 
                                onClick={checkAssessment}
                                className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-sm"
                            >
                                Check Answer
                            </button>
                            {assessmentFeedback && (
                                <div className={`mt-2 p-2 rounded text-xs font-semibold ${assessmentFeedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                    {assessmentFeedback}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
