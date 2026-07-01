import os
import re

COMP1 = """import { useState } from 'react';
import { BookOpen, CheckCircle, RefreshCcw, ArrowLeft, Tag } from 'lucide-react';
import { useTheme } from '../store';

export default function LabE12AdvancedGrammar({ onExit }: { onExit?: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'verbals' | 'parts'>('verbals');

  const verbalsSentences = [
    { text: "Swimming in the ocean is his favorite hobby.", type: "Gerund", target: "Swimming" },
    { text: "She wants to learn Japanese next year.", type: "Infinitive", target: "to learn" },
    { text: "The broken vase lay on the floor.", type: "Participle", target: "broken" }
  ];

  const [selectedVerbal, setSelectedVerbal] = useState<number | null>(null);
  const [verbalFeedback, setVerbalFeedback] = useState("");

  const checkVerbal = (type: string) => {
    if (selectedVerbal === null) return;
    if (verbalsSentences[selectedVerbal].type === type) {
      setVerbalFeedback("Correct! You identified the exact verbal type.");
    } else {
      setVerbalFeedback(`Incorrect. It is actually a ${verbalsSentences[selectedVerbal].type}.`);
    }
  };

  return (
    <div className={`w-full h-[calc(100vh-72px)] flex flex-col lg:flex-row ${isDark ? 'bg-[#121212] text-white' : 'bg-slate-50 text-slate-800'}`}>
      {/* LEFT PANEL */}
      <div className={`w-full lg:w-1/3 flex flex-col ${isDark ? 'bg-[#1c1b1b] border-r border-[#2a2a2a]' : 'bg-white border-r border-slate-200'} shadow-xl z-10`}>
        <div className={`p-6 flex-shrink-0 border-b ${isDark ? 'border-[#2a2a2a]' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Advanced Grammar Dissector</h2>
            {onExit && (
              <button onClick={onExit} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-slate-100'}`} title="Go Back">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Master advanced parts of speech and verbals (Gerunds, Infinitives, Participles).
          </p>
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => setActiveTab('verbals')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'verbals' ? 'bg-[#4158D1] text-white' : isDark ? 'bg-[#2a2a2a] text-gray-400' : 'bg-slate-100 text-slate-600'}`}
            >
              Verbals
            </button>
            <button 
              onClick={() => setActiveTab('parts')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'parts' ? 'bg-[#4158D1] text-white' : isDark ? 'bg-[#2a2a2a] text-gray-400' : 'bg-slate-100 text-slate-600'}`}
            >
              Advanced Parts
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'verbals' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#4158D1]" /> Verbal Identification
              </h3>
              <p className="text-sm opacity-80">Select a sentence, then identify the verbal contained within it.</p>
              
              <div className="space-y-3">
                {verbalsSentences.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedVerbal(idx); setVerbalFeedback(""); }}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedVerbal === idx ? 'border-[#4158D1] shadow-md' : isDark ? 'border-[#2a2a2a] hover:border-gray-500' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>{s.text}</p>
                  </button>
                ))}
              </div>

              {selectedVerbal !== null && (
                <div className={`p-4 rounded-xl mt-4 border ${isDark ? 'bg-black border-[#2a2a2a]' : 'bg-blue-50 border-blue-100'}`}>
                  <p className="mb-3 text-sm font-semibold">Identify the verbal type of the highlighted phrase: <span className="text-[#4158D1] underline">{verbalsSentences[selectedVerbal].target}</span></p>
                  <div className="flex gap-2">
                    {["Gerund", "Infinitive", "Participle"].map(type => (
                      <button 
                        key={type}
                        onClick={() => checkVerbal(type)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border whitespace-nowrap ${isDark ? 'bg-[#1c1b1b] border-gray-600 hover:bg-[#2a2a2a]' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {verbalFeedback && (
                    <p className={`mt-3 text-sm font-medium ${verbalFeedback.includes('Correct') ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {verbalFeedback}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'parts' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Advanced Syntax Analysis</h3>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-black border-[#2a2a2a]' : 'bg-slate-50 border-slate-200'}`}>
                <p className="text-sm opacity-80 mb-4">Analyze the conjunctions and modifiers in this sentence:</p>
                <p className={`text-lg font-bold p-3 rounded bg-opacity-20 ${isDark ? 'bg-white' : 'bg-black'}`}>
                  "Neither the director nor the actors were prepared for the incredibly harsh critique."
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Neither ... nor</span>
                    <span className="text-[#4158D1]">Correlative Conjunction</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">incredibly</span>
                    <span className="text-[#4158D1]">Adverb of Degree</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Simulation Space */}
      <div className={`flex-1 flex flex-col relative overflow-hidden ${isDark ? 'bg-[#0a0a0a]' : 'bg-slate-100'}`}>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center opacity-30 pointer-events-none">
            <BookOpen className="w-32 h-32 mx-auto mb-6" />
            <h2 className="text-3xl font-bold tracking-widest">ADVANCED GRAMMAR MATRIX</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

COMP2 = """import { useState } from 'react';
import { Clock, CheckCircle, RefreshCcw, ArrowLeft, History } from 'lucide-react';
import { useTheme } from '../store';

export default function LabE12TensesMechanics({ onExit }: { onExit?: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [mode, setMode] = useState<'tenses' | 'mechanics'>('tenses');

  const [tenseScenario, setTenseScenario] = useState("By the time we arrive, the movie ______ (start).");
  const [tenseAns, setTenseAns] = useState("");
  const [feedback, setFeedback] = useState("");

  const checkTense = () => {
    if (tenseAns.toLowerCase().includes("will have started")) {
      setFeedback("Correct! Future Perfect tense is required here.");
    } else {
      setFeedback("Incorrect. Hint: Think about an action completed before a future point (Future Perfect).");
    }
  };

  return (
    <div className={`w-full h-[calc(100vh-72px)] flex flex-col lg:flex-row ${isDark ? 'bg-[#121212] text-white' : 'bg-slate-50 text-slate-800'}`}>
      {/* LEFT PANEL */}
      <div className={`w-full lg:w-1/3 flex flex-col ${isDark ? 'bg-[#1c1b1b] border-r border-[#2a2a2a]' : 'bg-white border-r border-slate-200'} shadow-xl z-10`}>
        <div className={`p-6 flex-shrink-0 border-b ${isDark ? 'border-[#2a2a2a]' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Chronology Engine</h2>
            {onExit && (
              <button onClick={onExit} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-slate-100'}`} title="Go Back">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Master all 12 tenses, aspect of time, and mechanical conventions.
          </p>
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => setMode('tenses')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${mode === 'tenses' ? 'bg-[#4158D1] text-white' : isDark ? 'bg-[#2a2a2a] text-gray-400' : 'bg-slate-100 text-slate-600'}`}
            >
              Temporal Analysis
            </button>
            <button 
              onClick={() => setMode('mechanics')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${mode === 'mechanics' ? 'bg-[#4158D1] text-white' : isDark ? 'bg-[#2a2a2a] text-gray-400' : 'bg-slate-100 text-slate-600'}`}
            >
              Mechanics
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {mode === 'tenses' && (
            <>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-black border-[#2a2a2a]' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                  <History className="w-5 h-5 text-[#4158D1]" /> Timeline Projection
                </h3>
                <p className="font-medium text-lg mb-4">{tenseScenario}</p>
                <input
                  type="text"
                  value={tenseAns}
                  onChange={(e) => setTenseAns(e.target.value)}
                  placeholder="Type conjugated verb..."
                  className={`w-full min-w-0 p-3 rounded-lg border focus:ring-2 focus:outline-none ${isDark ? 'bg-[#1c1b1b] border-gray-600 focus:ring-[#4158D1] text-white' : 'bg-white border-slate-300 focus:ring-blue-500 text-slate-900'}`}
                />
                <button
                  onClick={checkTense}
                  className="mt-4 w-full py-3 bg-[#4158D1] text-white font-bold rounded-xl hover:bg-[#5560F1] transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Verify Timeline
                </button>
                {feedback && (
                  <p className={`mt-3 font-medium ${feedback.includes('Correct') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {feedback}
                  </p>
                )}
              </div>
            </>
          )}

          {mode === 'mechanics' && (
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-black border-[#2a2a2a]' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className="font-semibold text-lg mb-3">Hyphenation & Punctuation</h3>
              <p className="text-sm opacity-80 mb-4">Identify the correct mechanics for compound adjectives.</p>
              <div className="space-y-3">
                <div className={`p-3 rounded border ${isDark ? 'border-gray-700' : 'border-slate-300'}`}>
                  <p className="font-bold">Correct:</p>
                  <p className="text-emerald-500">The well-known author arrived.</p>
                </div>
                <div className={`p-3 rounded border ${isDark ? 'border-gray-700' : 'border-slate-300'}`}>
                  <p className="font-bold">Incorrect:</p>
                  <p className="text-rose-500">The author is well-known.</p>
                  <p className="text-xs opacity-70 mt-1">(Do not hyphenate compound adjectives when they follow the noun, unless standard).</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Simulation Space */}
      <div className={`flex-1 flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-[#0a0a0a]' : 'bg-slate-100'}`}>
        <div className="text-center opacity-30 pointer-events-none">
          <Clock className="w-32 h-32 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold tracking-widest">TEMPORAL ENGINE ONLINE</h2>
        </div>
      </div>
    </div>
  );
}
"""

COMP3 = """import { useState } from 'react';
import { Layers, CheckCircle, RefreshCcw, ArrowLeft, Network } from 'lucide-react';
import { useTheme } from '../store';

export default function LabE12SemanticsStructure({ onExit }: { onExit?: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const semanticsPairs = [
    { word: "Cheap", denotation: "Low in cost", connotation: "Poor quality (Negative)" },
    { word: "Inexpensive", denotation: "Low in cost", connotation: "Good value (Positive)" },
    { word: "Stubborn", denotation: "Unwilling to change", connotation: "Unreasonable (Negative)" },
    { word: "Persistent", denotation: "Unwilling to change", connotation: "Determined (Positive)" }
  ];

  return (
    <div className={`w-full h-[calc(100vh-72px)] flex flex-col lg:flex-row ${isDark ? 'bg-[#121212] text-white' : 'bg-slate-50 text-slate-800'}`}>
      {/* LEFT PANEL */}
      <div className={`w-full lg:w-1/3 flex flex-col ${isDark ? 'bg-[#1c1b1b] border-r border-[#2a2a2a]' : 'bg-white border-r border-slate-200'} shadow-xl z-10`}>
        <div className={`p-6 flex-shrink-0 border-b ${isDark ? 'border-[#2a2a2a]' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Rhetoric Synthesizer</h2>
            {onExit && (
              <button onClick={onExit} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-slate-100'}`} title="Go Back">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Explore Semantic Concepts (Connotation vs Denotation) and Structural Connectives.
          </p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-[#4158D1]" /> Connotation vs Denotation
            </h3>
            <div className="space-y-4">
              {semanticsPairs.map((pair, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${isDark ? 'bg-black border-[#2a2a2a]' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h4 className="text-xl font-bold mb-2">{pair.word}</h4>
                  <p className="text-sm"><span className="font-semibold text-blue-500">Denotation:</span> {pair.denotation}</p>
                  <p className="text-sm"><span className="font-semibold text-purple-500">Connotation:</span> {pair.connotation}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Network className="w-5 h-5 text-[#4158D1]" /> Transitional Devices
            </h3>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-black border-[#2a2a2a]' : 'bg-white border-slate-200 shadow-sm'}`}>
              <p className="text-sm mb-3">Which connective best links these ideas?</p>
              <div className={`p-3 rounded-lg bg-opacity-10 mb-4 ${isDark ? 'bg-white' : 'bg-black'}`}>
                "The project was underfunded. ______ , the team managed to deliver exceptional results."
              </div>
              <div className="flex gap-2">
                <button className={`flex-1 py-2 text-sm font-semibold rounded-lg border ${isDark ? 'border-gray-600 hover:bg-[#2a2a2a]' : 'border-slate-300 hover:bg-slate-100'}`}>Therefore</button>
                <button className={`flex-1 py-2 text-sm font-semibold rounded-lg border bg-[#4158D1] text-white border-transparent`}>Nevertheless</button>
                <button className={`flex-1 py-2 text-sm font-semibold rounded-lg border ${isDark ? 'border-gray-600 hover:bg-[#2a2a2a]' : 'border-slate-300 hover:bg-slate-100'}`}>Similarly</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Simulation Space */}
      <div className={`flex-1 flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-[#0a0a0a]' : 'bg-slate-100'}`}>
        <div className="text-center opacity-30 pointer-events-none">
          <Layers className="w-32 h-32 mx-auto mb-6" />
          <h2 className="text-3xl font-bold tracking-widest">SEMANTIC ANALYSIS CORE</h2>
        </div>
      </div>
    </div>
  );
}
"""

def write_comp(name, code):
    path = f"src/components/{name}.tsx"
    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print(f"Created {path}")

write_comp("LabE12AdvancedGrammar", COMP1)
write_comp("LabE12TensesMechanics", COMP2)
write_comp("LabE12SemanticsStructure", COMP3)

# Update labModules.ts
modules_data = """
  {
    id: "e12-1",
    title: "Advanced Grammar Dissector",
    subject: "english",
    classLevel: 12,
    desc: "Master advanced parts of speech and verbals (Gerunds, Infinitives, Participles).",
    built: true
  },
  {
    id: "e12-2",
    title: "Chronology Engine",
    subject: "english",
    classLevel: 12,
    desc: "Master all 12 tenses, aspect of time, and mechanical conventions.",
    built: true
  },
  {
    id: "e12-3",
    title: "Rhetoric Synthesizer",
    subject: "english",
    classLevel: 12,
    desc: "Explore Semantic Concepts (Connotation vs Denotation) and Structural Connectives.",
    built: true
  },
"""

lab_modules_path = "src/data/labModules.ts"
with open(lab_modules_path, "r", encoding="utf-8") as f:
    content = f.read()

if "id: \"e12-1\"" not in content:
    content = content.replace("export const LAB_MODULES: LabModule[] = [", "export const LAB_MODULES: LabModule[] = [" + modules_data)
    with open(lab_modules_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated labModules.ts")
else:
    print("labModules.ts already contains e12 labs")

# Update SubjectSelection.ts mapping for Router
# We need to add mapping to the routing system. Wait, routing is dynamically driven by LabSelector?
# Yes, typically in ModuleSelection.tsx or somewhere similar, but let's check if there's a huge switch statement.
