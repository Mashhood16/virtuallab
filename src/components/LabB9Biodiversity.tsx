import { useState, useMemo } from 'react';
import { CheckCircle, Info } from 'lucide-react';
import LabHeader from './LabHeader';

interface Organism {
  id: string;
  name: string;
  emoji: string;
  correctClass: string;
}

const ALL_ORGANISMS: Organism[] = [
  { id: '1', name: 'Bat', emoji: '🦇', correctClass: 'Mammal' },
  { id: '2', name: 'Penguin', emoji: '🐧', correctClass: 'Bird' },
  { id: '3', name: 'Turtle', emoji: '🐢', correctClass: 'Reptile' },
  { id: '4', name: 'Frog', emoji: '🐸', correctClass: 'Amphibian' },
  { id: '5', name: 'Shark', emoji: '🦈', correctClass: 'Fish' },
  { id: '6', name: 'Butterfly', emoji: '🦋', correctClass: 'Insect' },
  { id: '7', name: 'Whale', emoji: '🐋', correctClass: 'Mammal' },
  { id: '8', name: 'Snake', emoji: '🐍', correctClass: 'Reptile' },
  { id: '9', name: 'Owl', emoji: '🦉', correctClass: 'Bird' },
  { id: '10', name: 'Salmon', emoji: '🐟', correctClass: 'Fish' },
  { id: '11', name: 'Ant', emoji: '🐜', correctClass: 'Insect' },
  { id: '12', name: 'Salamander', emoji: '🦎', correctClass: 'Amphibian' },
];

const BUCKETS = ['Mammal', 'Bird', 'Reptile', 'Amphibian', 'Fish', 'Insect'];

export default function LabB9Biodiversity({ onExit }: { onExit: () => void }) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [showResults, setShowResults] = useState(false);

  const correctSorting = useMemo(() => {
    return ALL_ORGANISMS.filter(o => placements[o.id] === o.correctClass).length;
  }, [placements]);

  const handleBucketClick = (bucket: string) => {
    if (selectedOrg) {
      setPlacements(prev => ({ ...prev, [selectedOrg]: bucket }));
      setSelectedOrg(null);
    }
  };

  const unsortedOrganisms = ALL_ORGANISMS.filter(o => !placements[o.id]);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} variant="emerald" title="Biodiversity & Taxonomy Lab" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 grow">
        {/* Theory Column */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Info className="mr-2 text-emerald-600" /> Taxonomic Classification
          </h2>
          <div className="space-y-4 text-slate-600 text-sm">
            <p>
              Taxonomy is the science of naming, describing, and classifying organisms. The standard hierarchy from broadest to most specific is:
              <strong> Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species</strong>.
            </p>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h3 className="font-bold text-emerald-800 mb-2">Key Classes (Vertebrates + Insects)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Mammals:</strong> Warm-blooded, have hair/fur, produce milk.</li>
                <li><strong>Birds:</strong> Warm-blooded, have feathers, lay hard-shelled eggs.</li>
                <li><strong>Reptiles:</strong> Cold-blooded, scaly skin, lay leathery eggs.</li>
                <li><strong>Amphibians:</strong> Cold-blooded, start life in water with gills, adults breathe with lungs.</li>
                <li><strong>Fish:</strong> Cold-blooded, live entirely in water, breathe through gills.</li>
                <li><strong>Insects (Arthropods):</strong> Invertebrates with a three-part body, three pairs of jointed legs.</li>
              </ul>
            </div>
            <p className="italic text-emerald-700">
              Note: A bat is a mammal, not a bird. A whale is a mammal, not a fish!
            </p>
          </div>
        </div>

        {/* Simulation Column */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Taxonomic Sorting Area</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {BUCKETS.map(bucket => (
              <div 
                key={bucket} 
                onClick={() => handleBucketClick(bucket)}
                className={`border-2 rounded-xl p-3 min-h-[120px] transition-colors ${selectedOrg ? 'border-emerald-400 bg-emerald-50 cursor-pointer hover:bg-emerald-100' : 'border-slate-200 bg-slate-50'}`}
              >
                <h3 className="text-center font-bold text-slate-700 text-sm border-b border-slate-200 pb-1 mb-2">{bucket}</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.entries(placements).filter(([, b]) => b === bucket).map(([orgId]) => {
                    const org = ALL_ORGANISMS.find(o => o.id === orgId);
                    return (
                      <div 
                        key={orgId} 
                        className="text-3xl cursor-pointer hover:scale-110 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlacements(p => {
                            const newP = { ...p };
                            delete newP[orgId];
                            return newP;
                          });
                        }}
                        title={`Remove ${org?.name}`}
                      >
                        {org?.emoji}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Unsorted Organisms</h3>
            <div className="flex flex-wrap gap-3 bg-slate-100 p-4 rounded-xl min-h-[80px] items-center border border-slate-200">
              {unsortedOrganisms.length === 0 ? (
                <p className="text-slate-400 text-sm italic mx-auto">All organisms sorted!</p>
              ) : (
                unsortedOrganisms.map(org => (
                  <button
                    key={org.id}
                    onClick={() => setSelectedOrg(org.id)}
                    className={`text-4xl transition-transform hover:scale-110 ${selectedOrg === org.id ? 'scale-125 ring-4 ring-emerald-400 rounded-full bg-slate-50' : ''}`}
                    title={org.name}
                  >
                    {org.emoji}
                  </button>
                ))
              )}
            </div>
            {selectedOrg && (
              <p className="text-center text-emerald-600 font-bold mt-2 animate-pulse">
                Click a bucket to place {ALL_ORGANISMS.find(o => o.id === selectedOrg)?.name}
              </p>
            )}
          </div>
        </div>

        {/* Assessment Column */}
        <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <CheckCircle className="mr-2 text-emerald-600" /> Lab Assessment
          </h2>
          
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2">Sorting Progress</h3>
              <p className="text-sm text-slate-600">
                Organisms sorted: <span className="font-bold">{Object.keys(placements).length} / 12</span>
              </p>
              {showResults && (
                <p className={`text-sm font-bold mt-2 ${correctSorting === 12 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  Correct placements: {correctSorting} / 12
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                1. Which of the sorted organisms is an invertebrate?
              </label>
              <select 
                value={q1} 
                onChange={(e) => setQ1(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select...</option>
                <option value="Frog">Frog</option>
                <option value="Snake">Snake</option>
                <option value="Butterfly">Butterfly</option>
                <option value="Bat">Bat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                2. Why is a whale classified as a mammal and not a fish?
              </label>
              <select 
                value={q2} 
                onChange={(e) => setQ2(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select...</option>
                <option value="size">It is too large to be a fish</option>
                <option value="lungs">It breathes air with lungs and has hair/milk</option>
                <option value="ocean">It lives in the deep ocean</option>
              </select>
            </div>

            <button 
              onClick={() => setShowResults(true)}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors mt-auto"
            >
              Check Answers & Placements
            </button>

            {showResults && (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="font-bold text-emerald-800">Results:</p>
                <ul className="text-sm space-y-1 mt-2">
                  <li>Sorting Accuracy: {correctSorting}/12</li>
                  <li>Question 1: {q1 === 'Butterfly' ? '✅ Correct' : '❌ Incorrect (Insects are invertebrates)'}</li>
                  <li>Question 2: {q2 === 'lungs' ? '✅ Correct' : '❌ Incorrect'}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
