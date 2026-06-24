import { useState, useEffect, useRef } from 'react';
import { Smartphone, Shield, ShieldAlert, CheckCircle, Activity, AlertTriangle, MessageSquare, AlertOctagon } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit?: () => void;
}

type Message = {
    id: number;
    sender: string;
    text: string;
    type: 'phishing' | 'bullying' | 'fakeNews' | 'info';
    options: { text: string; safeChoice: boolean; impactText: string }[];
};

const scenarios: Message[] = [
    {
        id: 1,
        sender: "Security Alert",
        text: "Your account will be suspended! Click here to verify your password immediately: http://verify-secure-login.com/login",
        type: 'phishing',
        options: [
            { text: "Click the link and enter password", safeChoice: false, impactText: "You fell for a phishing attack! Your account is compromised." },
            { text: "Ignore and delete message", safeChoice: true, impactText: "Good job! Recognizing fake URLs and urgency is key to avoiding phishing." }
        ]
    },
    {
        id: 2,
        sender: "School Gossip Page",
        text: "Did you hear what Alex did? Everyone is sharing this embarrassing photo! [Forward Message?]",
        type: 'bullying',
        options: [
            { text: "Forward to friends", safeChoice: false, impactText: "You participated in cyberbullying. Always think before sharing." },
            { text: "Report the post and don't share", safeChoice: true, impactText: "Excellent! Stopping the spread of hurtful content helps others." }
        ]
    },
    {
        id: 3,
        sender: "Daily News Feed",
        text: "BREAKING: Scientists discover aliens living in the core of the Earth! Share to spread the truth!",
        type: 'fakeNews',
        options: [
            { text: "Share immediately", safeChoice: false, impactText: "You spread fake news! Always verify sources before sharing." },
            { text: "Check reliable sources first", safeChoice: true, impactText: "Smart move! Cross-checking facts prevents misinformation." }
        ]
    }
];

export default function LabCS9CyberSafety({ onExit }: LabProps) {
    const [currentScenario, setCurrentScenario] = useState<number>(0);
    const [safetyScore, setSafetyScore] = useState<number>(100);
    const [chatLog, setChatLog] = useState<{sender: string, text: string, userAction: string, safe: boolean, impact: string}[]>([]);
    
    // Assessment State
    const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
    const [finalFeedback, setFinalFeedback] = useState('');
    const endOfSimRef = useRef<boolean>(false);

    useEffect(() => {
        if (currentScenario === -1) {
            endOfSimRef.current = true;
        }
    }, [currentScenario]);

    const handleChoice = (option: { text: string; safeChoice: boolean; impactText: string }) => {
        setChatLog(prev => [...prev, {
            sender: scenarios[currentScenario].sender,
            text: scenarios[currentScenario].text,
            userAction: option.text,
            safe: option.safeChoice,
            impact: option.impactText
        }]);

        if (!option.safeChoice) {
            setSafetyScore(prev => Math.max(0, prev - 34)); // deduct 34 so 3 mistakes = ~0
        }

        if (currentScenario < scenarios.length - 1) {
            setCurrentScenario(prev => prev + 1);
        } else {
            setCurrentScenario(-1); // End of simulator
        }
    };

    const calculateFinalAssessment = () => {
        setAssessmentScore(safetyScore);
        if (safetyScore >= 90) setFinalFeedback("Outstanding! You made extremely safe digital choices.");
        else if (safetyScore >= 50) setFinalFeedback("Fair. You survived, but fell for some traps. Review the safety rules.");
        else setFinalFeedback("Danger! Your digital footprint is severely compromised. Please retake the module.");
    };

    const gaugeWidth = `${safetyScore}%`;
    const gaugeColor = safetyScore > 70 ? 'bg-green-500' : safetyScore > 40 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
            <LabHeader onExit={onExit} title="Cyber Safety & Digital Footprint" />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Column 1: Theory */}
                <div className="bg-slate-50 p-6 rounded-xl shadow-sm flex flex-col gap-4 border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <AlertOctagon className="w-6 h-6 text-teal-600" />
                        Digital Threats
                    </h2>
                    <div className="text-sm text-slate-600 space-y-4">
                        <p>In the digital world, every action you take contributes to your <strong>Digital Footprint</strong>. Being aware of online threats is crucial for maintaining your privacy and safety.</p>
                        
                        <div className="space-y-2">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-500"/> Phishing</h3>
                            <p className="pl-6 border-l-2 border-red-200">Deceptive attempts to steal sensitive information by masquerading as a trustworthy entity (e.g., fake login links, urgent warnings).</p>
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-orange-500"/> Cyberbullying</h3>
                            <p className="pl-6 border-l-2 border-orange-200">Using digital platforms to harass, embarrass, or target individuals. Sharing harmful content makes you a participant.</p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500"/> Fake News</h3>
                            <p className="pl-6 border-l-2 border-yellow-200">False or misleading information presented as news. Always verify the source before clicking "Share".</p>
                        </div>
                    </div>
                </div>

                {/* Column 2: Simulator */}
                <div className="bg-slate-50 p-6 rounded-xl shadow-sm flex flex-col items-center border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <Smartphone className="w-6 h-6 text-teal-600" />
                        Device Simulator
                    </h2>
                    
                    <div className="w-full max-w-xs bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800 relative mt-4 h-[500px] flex flex-col">
                        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-10">
                            <div className="w-32 h-6 bg-slate-800 rounded-b-xl"></div>
                        </div>
                        
                        <div className="flex-1 bg-slate-100 rounded-3xl overflow-hidden flex flex-col relative">
                            {/* Screen Header */}
                            <div className="bg-teal-600 p-4 pt-8 text-white shadow">
                                <p className="text-center font-semibold text-sm">Messages</p>
                            </div>

                            {/* Screen Body */}
                            <div className="flex-1 p-4 flex flex-col justify-end">
                                {currentScenario !== -1 ? (
                                    <div className="animate-in slide-in-from-bottom-4 fade-in">
                                        <p className="text-xs text-slate-500 mb-1 font-semibold">{scenarios[currentScenario].sender}</p>
                                        <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm border border-slate-200 mb-4">
                                            {scenarios[currentScenario].text}
                                        </div>
                                        
                                        <div className="flex flex-col gap-2 mt-4">
                                            {scenarios[currentScenario].options.map((opt, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => handleChoice(opt)}
                                                    className="w-full bg-teal-500 text-white py-2 px-4 rounded-xl text-sm font-semibold hover:bg-teal-600 transition-colors shadow-sm"
                                                >
                                                    {opt.text}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                        <Shield className="w-12 h-12 text-teal-500 mb-2" />
                                        <h3 className="font-bold text-lg text-slate-800">Simulation Complete</h3>
                                        <p className="text-sm text-slate-600 mt-2">Check the Analysis panel for your results.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Analysis */}
                <div className="bg-slate-50 p-6 rounded-xl shadow-sm flex flex-col h-full border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-teal-600" />
                        Safety Log & Analysis
                    </h2>

                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <span className="font-semibold text-sm text-slate-700">Overall Safety Score</span>
                            <span className="font-bold text-lg text-teal-700">{safetyScore}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                            <div className={`h-full transition-all duration-700 ease-out ${gaugeColor}`} style={{ width: gaugeWidth }}></div>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 shadow-inner space-y-3">
                        <h3 className="font-semibold text-sm text-slate-700 border-b pb-1 border-slate-200">Action History</h3>
                        {chatLog.length === 0 ? (
                            <p className="text-xs text-slate-500 italic text-center mt-4">Make choices on the device to log data.</p>
                        ) : (
                            chatLog.map((log, i) => (
                                <div key={i} className={`p-3 rounded border text-xs shadow-sm ${log.safe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <p className="font-semibold mb-1 flex items-center gap-1">
                                        {log.safe ? <CheckCircle className="w-3 h-3 text-green-600"/> : <ShieldAlert className="w-3 h-3 text-red-600"/>}
                                        Scenario: {log.sender}
                                    </p>
                                    <p className="text-slate-600 mb-2">You chose: "{log.userAction}"</p>
                                    <p className={`font-semibold ${log.safe ? 'text-green-700' : 'text-red-700'}`}>{log.impact}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="bg-teal-50 p-5 rounded-lg border border-teal-200 shadow-sm">
                        <h3 className="font-bold text-teal-900 mb-2 text-sm">Final Assessment</h3>
                        <p className="text-xs text-teal-800 mb-4">Complete all scenarios to generate your final safety report.</p>
                        
                        <button 
                            onClick={calculateFinalAssessment}
                            disabled={currentScenario !== -1}
                            className={`w-full py-2 rounded-md transition-colors text-sm font-semibold shadow-sm ${currentScenario === -1 ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                        >
                            Generate Report
                        </button>
                        
                        {assessmentScore !== null && (
                            <div className="mt-4 p-3 bg-slate-50 rounded border border-teal-100 shadow-sm">
                                <p className="text-sm font-bold text-slate-800">Score: {assessmentScore}/100</p>
                                <p className="text-xs text-slate-600 mt-1">{finalFeedback}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
