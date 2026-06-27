import { useState } from 'react';
import { CheckCircle, AlertTriangle, Monitor, MousePointer, Eye, Volume2 } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6HealthCampaign({ onExit }: LabProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const topics = [
    { id: 'eye_strain', icon: Eye, label: 'Digital Eye Strain', color: 'text-blue-500', bg: 'bg-blue-100', desc: 'Prolonged screen time can cause dry eyes and blurred vision.' },
    { id: 'posture', icon: Monitor, label: 'Poor Posture', color: 'text-orange-500', bg: 'bg-orange-100', desc: 'Slouching over devices leads to neck and back pain.' },
    { id: 'rsi', icon: MousePointer, label: 'Repetitive Strain', color: 'text-rose-500', bg: 'bg-rose-100', desc: 'Continuous typing/clicking can injure wrists and hands.' },
    { id: 'hearing', icon: Volume2, label: 'Hearing Loss', color: 'text-emerald-500', bg: 'bg-emerald-100', desc: 'Loud headphones over long periods damage hearing.' }
  ];

  const handlePublish = () => {
    if (selectedTopic && campaignTitle && campaignMessage) {
      setIsPublished(true);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Health Awareness Campaign" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">
        

        <p className="text-slate-600 dark:text-slate-300 mb-8">Design a community awareness campaign about the adverse health effects of ICT use.</p>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-6 flex flex-col flex-1">
          {isPublished ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4">{campaignTitle}</h2>
              <div className={`p-6 rounded-xl border-2 border-dashed max-w-2xl w-full mb-8 ${topics.find(t => t.id === selectedTopic)?.bg}`}>
                <p className="text-xl font-medium text-slate-700 dark:text-slate-200">{campaignMessage}</p>
              </div>
              <button 
                onClick={() => setIsPublished(false)}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:bg-slate-800 rounded-lg font-bold transition-colors"
              >
                Create Another Campaign
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <h3 className="text-xl font-bold mb-4">Step 1: Choose a Health Issue</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {topics.map(topic => {
                  const Icon = topic.icon;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                        selectedTopic === topic.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 dark:border-slate-700 dark:border-slate-500 hover:border-slate-300 dark:border-slate-700 dark:border-slate-500'
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${topic.bg}`}>
                        <Icon className={`w-6 h-6 ${topic.color}`} />
                      </div>
                      <div>
                        <div className="font-bold mb-1">{topic.label}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{topic.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={`transition-opacity duration-300 ${selectedTopic ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <h3 className="text-xl font-bold mb-4">Step 2: Design Campaign Message</h3>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Campaign Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Save Your Eyes!"
                      value={campaignTitle}
                      onChange={(e) => setCampaignTitle(e.target.value)}
                      className="w-full p-3 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Awareness Message</label>
                    <textarea 
                      rows={3}
                      placeholder="Write a catchy slogan or advice..."
                      value={campaignMessage}
                      onChange={(e) => setCampaignMessage(e.target.value)}
                      className="w-full p-3 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-auto">
                  <button 
                    onClick={handlePublish}
                    disabled={!campaignTitle || !campaignMessage}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 dark:bg-slate-800 disabled:cursor-not-allowed transition-colors"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    Publish Campaign
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
