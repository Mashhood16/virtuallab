import { useState } from 'react';
import { ArrowLeft, Folder, File, CheckCircle, Monitor } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

type FileSystemItem = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId: string | null;
};

export default function LabC6FileManagement1({ onExit }: LabProps) {
  const [items, setItems] = useState<FileSystemItem[]>([
    { id: 'drive_d', name: 'Drive D:', type: 'folder', parentId: null },
    { id: 'desktop', name: 'Desktop', type: 'folder', parentId: null },
  ]);
  const [currentFolderId, setCurrentFolderId] = useState<string>('drive_d');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [inputName, setInputName] = useState('');

  const currentItems = items.filter(i => i.parentId === currentFolderId);
  const currentFolder = items.find(i => i.id === currentFolderId);
  const selectedItem = items.find(i => i.id === selectedItemId);

  // Validation Flags
  const hasRollNumFolderInD = items.some(i => i.parentId === 'drive_d' && i.type === 'folder' && /\d/.test(i.name)); // Expecting some number for roll number
  const hasHomeworkFolder = items.some(i => i.parentId !== null && i.name.toLowerCase() === 'homework');
  const hasAssignmentOnDesktop = items.some(i => i.parentId === 'desktop' && i.name.toLowerCase() === 'assignment');
  const isComplete = hasRollNumFolderInD && hasHomeworkFolder && hasAssignmentOnDesktop;

  const handleCreate = () => {
    if (inputName.trim()) {
      setItems([...items, {
        id: `item_${Date.now()}`,
        name: inputName.trim(),
        type: 'folder',
        parentId: currentFolderId
      }]);
    }
    setIsCreating(false);
    setInputName('');
  };

  const handleRename = () => {
    if (selectedItemId && inputName.trim()) {
      setItems(items.map(i => i.id === selectedItemId ? { ...i, name: inputName.trim() } : i));
    }
    setIsRenaming(false);
    setInputName('');
    setSelectedItemId(null);
  };

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <button onClick={onExit} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors w-fit">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-2">File and Folder Management 1</h1>
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-2">Tasks to Complete:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li className={hasRollNumFolderInD ? 'text-green-600 line-through' : ''}>Create a folder in Drive D: saved by your roll number (e.g., "Roll 42").</li>
            <li className={hasHomeworkFolder ? 'text-green-600 line-through' : ''}>Open it and create a sub-folder named 'homework'.</li>
            <li className={hasAssignmentOnDesktop ? 'text-green-600 line-through' : ''}>Copy this folder to the Desktop and rename it 'assignment'.</li>
          </ul>
        </div>

        {isComplete && (
          <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg mb-6 flex items-center gap-3 font-bold">
            <CheckCircle className="w-6 h-6" /> All tasks completed successfully!
          </div>
        )}

        <div className="flex-1 bg-slate-50 rounded-xl shadow-sm border border-slate-300 flex flex-col overflow-hidden">
          {/* Simulated File Explorer Header */}
          <div className="bg-slate-100 border-b border-slate-300 p-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (currentFolder?.parentId) setCurrentFolderId(currentFolder.parentId);
                  else setCurrentFolderId('drive_d');
                }}
                disabled={currentFolderId === 'drive_d' || currentFolderId === 'desktop'}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-slate-50 border border-slate-300 px-3 py-1 rounded shadow-inner text-sm min-w-[300px] flex items-center gap-2 text-slate-600">
                {currentFolderId === 'desktop' ? <Monitor className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                {currentFolder?.name}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentFolderId('desktop')} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded text-sm font-bold flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Desktop
              </button>
              <button onClick={() => setCurrentFolderId('drive_d')} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded text-sm font-bold flex items-center gap-2">
                <HardDriveIcon className="w-4 h-4" /> Drive D:
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <LabHeader onExit={onExit} title="Lab" />

          {/* File Grid */}
          <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
            {isCreating && (
              <div className="mb-6 p-4 border border-blue-300 bg-blue-50 rounded-lg max-w-sm">
                <label className="block text-sm font-bold text-slate-700 mb-2">New Folder Name</label>
                <div className="flex gap-2">
                  <input 
                    autoFocus
                    type="text" 
                    value={inputName} 
                    onChange={e => setInputName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                  />
                  <button onClick={handleCreate} className="px-3 py-1.5 bg-blue-600 text-white rounded font-bold">OK</button>
                  <button onClick={() => setIsCreating(false)} className="px-3 py-1.5 bg-slate-200 rounded font-bold">Cancel</button>
                </div>
              </div>
            )}

            {isRenaming && selectedItem && (
              <div className="mb-6 p-4 border border-amber-300 bg-amber-50 rounded-lg max-w-sm">
                <label className="block text-sm font-bold text-slate-700 mb-2">Rename '{selectedItem.name}'</label>
                <div className="flex gap-2">
                  <input 
                    autoFocus
                    type="text" 
                    value={inputName} 
                    onChange={e => setInputName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRename()}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                  />
                  <button onClick={handleRename} className="px-3 py-1.5 bg-amber-600 text-white rounded font-bold">OK</button>
                  <button onClick={() => setIsRenaming(false)} className="px-3 py-1.5 bg-slate-200 rounded font-bold">Cancel</button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-6">
              {currentItems.length === 0 && !isCreating && !isRenaming && (
                <div className="w-full text-center py-12 text-slate-400">
                  This folder is empty.
                </div>
              )}
              {currentItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  onDoubleClick={() => {
                    if (item.type === 'folder') {
                      setCurrentFolderId(item.id);
                      setSelectedItemId(null);
                    }
                  }}
                  className={`w-28 flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-transparent transition-colors ${
                    selectedItemId === item.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-100'
                  }`}
                >
                  {item.type === 'folder' ? (
                    <Folder className={`w-12 h-12 ${selectedItemId === item.id ? 'text-amber-500' : 'text-amber-400'}`} fill="currentColor" />
                  ) : (
                    <File className={`w-12 h-12 ${selectedItemId === item.id ? 'text-blue-500' : 'text-blue-400'}`} />
                  )}
                  <span className="text-sm font-medium text-center break-words w-full truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-100 border-t border-slate-200 p-2 text-xs text-slate-500">
            {currentItems.length} items | {selectedItemId ? '1 item selected' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

// Temporary Icon Component to keep lucide imports simple
function HardDriveIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>;
}
