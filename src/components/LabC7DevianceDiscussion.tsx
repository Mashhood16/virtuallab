import { useState } from 'react';
import { User, Users, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7DevianceDiscussion({ onExit }: LabProps) {
  const [chatLog, setChatLog] = useState<{sender: 'teacher' | 'student', text: string}[]>([
    { sender: 'teacher', text: "Class, today we're discussing deviant behavior online, like cyberbullying or spreading rumors. Imagine you see a classmate making hurtful comments about someone else on social media. What is your first reaction?" }
  ]);
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const scenarios = [
    {
      options: [
        { text: "Join in and make a joke so I fit in.", isCorrect: false, reply: "That is participating in deviant behavior. Let's aim for empathy instead." },
        { text: "Ignore it completely, it's not my problem.", isCorrect: false, reply: "While it avoids conflict, being a bystander doesn't help the victim or stop the behavior." },
        { text: "Take a screenshot and report it to a trusted adult, then check on the victim privately.", isCorrect: true, reply: "Excellent. That shows empathy and takes responsible action to resolve the conflict." }
      ]
    },
    {
      teacherPrompt: "Let's say the person making the comments finds out you reported them and gets angry at you in school. How do you practice conflict resolution?",
      options: [
        { text: "Yell at them and tell everyone what they did.", isCorrect: false, reply: "Aggression escalates the conflict. We need a more respectful approach." },
        { text: "Stay calm, explain that their words were hurtful, and say you won't tolerate bullying.", isCorrect: true, reply: "Perfect. Remaining calm and setting firm, respectful boundaries is the core of conflict resolution." },
        { text: "Deny that I reported them to avoid getting into a fight.", isCorrect: false, reply: "Lying doesn't solve the root issue and damages trust. Assertiveness is better." }
      ]
    },
    {
      teacherPrompt: "Finally, how can we build a culture of tolerance and respect in our digital lives?",
      options: [
        { text: "Only interact with people who agree with me.", isCorrect: false, reply: "That creates an echo chamber. Tolerance means respecting diverse viewpoints." },
        { text: "Think before posting, respect differences, and support those who are targeted.", isCorrect: true, reply: "Spot on! Empathy and active support are how we build a positive digital community." },
        { text: "Create fake accounts so I can argue without consequences.", isCorrect: false, reply: "That is classic deviant behavior and violates digital ethics." }
      ]
    }
  ];

  const handleSelectOption = (opt: any) => {
    setChatLog(prev => [
      ...prev,
      { sender: 'student', text: opt.text },
      { sender: 'teacher', text: opt.reply }
    ]);

    if (opt.isCorrect) {
      if (scenarioIndex < scenarios.length - 1) {
        setTimeout(() => {
          setChatLog(prev => [
            ...prev,
            { sender: 'teacher', text: scenarios[scenarioIndex + 1].teacherPrompt! }
          ]);
          setScenarioIndex(scenarioIndex + 1);
        }, 1500);
      } else {
        setScenarioIndex(scenarioIndex + 1); // Mark complete
      }
    }
  };

  const isComplete = scenarioIndex >= scenarios.length;

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <LabHeader onExit={onExit} title="Class Discussion on Deviance" />

        <h1 className="text-3xl font-bold mb-2">Class Discussion on Deviance</h1>
        <p className="text-slate-600 mb-8">Participate in the dialogue by choosing responses that demonstrate empathy, tolerance, and conflict resolution.</p>

        <div className="max-w-3xl mx-auto w-full flex flex-col h-[700px] bg-slate-50 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          
          {/* Chat Window */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50">
            {chatLog.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                {msg.sender === 'teacher' && (
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                )}
                
                <div className={`p-4 rounded-2xl max-w-[80%] ${msg.sender === 'student' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>

                {msg.sender === 'student' && (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ml-3 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}

            {isComplete && (
               <div className="mt-8 bg-emerald-100 text-emerald-800 p-4 rounded-xl flex items-center justify-center border border-emerald-300 shadow-sm animate-in zoom-in">
                 <CheckCircle className="w-6 h-6 mr-3" />
                 <span className="font-bold">Discussion Complete!</span> You've mastered digital conflict resolution.
               </div>
            )}
          </div>

          {/* Response Options */}
          {!isComplete && chatLog[chatLog.length - 1].sender === 'teacher' && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Select your response:</h3>
              {scenarios[scenarioIndex].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  className="p-3 bg-slate-100 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-lg text-left transition-colors text-slate-700 font-medium text-sm"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
