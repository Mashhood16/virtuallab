import { useState } from 'react';
import { ArrowLeft, Folder, File, Trash2, Monitor, RotateCcw, Save, Plus, FilePlus } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

type FileSystemItem = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId: string | null;
  content?: string;
  deleted?: boolean;
};

export default function LabC6FileManagement2({ onExit }: LabProps) {
  const [items, setItems] = useState<FileSystemItem[]>([
    { id: 'desktop', name: 'Desktop', type: 'folder', parentId: null },
    { id: 'recycle_bin', name: 'Recycle Bin', type: 'folder', parentId: null },
  ]);
  const [currentFolderId, setCurrentFolderId] = useState<string>('desktop');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [inputName, setInputName] = useState('');
  
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');

  const currentItems = items.filter(i => i.parentId === currentFolderId && !i.deleted);
  const recycleBinItems = items.filter(i => i.deleted);
  
  const currentFolder = items.find(i => i.id === currentFolderId);
  const hasNameFolder = items.some(i => i.parentId === 'desktop' && i.type === 'folder' && i.name.trim().length > 0 && i.name.toLowerCase() !== 'new folder');
  const hasActivityFile = items.some(i => i.type === 'file' && i.name.toLowerCase() === 'activity' && i.content && i.content.length > 5);

  const handleCreateFolder = () => {
    if (inputName.trim()) {
      setItems([...items, {
        id: `item_${Date.now()}`,
        name: inputName.trim(),
        type: 'folder',
        parentId: currentFolderId
      }]);
    }
    setIsCreatingFolder(false);
    setInputName('');
  };

  const handleCreateFile = () => {
    if (inputName.trim()) {
      setItems([...items, {
        id: `item_${Date.now()}`,
        name: inputName.trim(),
        type: 'file',
        parentId: currentFolderId,
        content: ''
      }]);
    }
    setIsCreatingFile(false);
    setInputName('');
  };

  const handleDelete = () => {
    if (selectedItemId) {
      setItems(items.map(i => i.id === selectedItemId ? { ...i, deleted: true } : i));
      setSelectedItemId(null);
    }
  };

  const handleRecover = () => {
    if (selectedItemId) {
      // Find item and set deleted to false, move to desktop if parent is deleted
      setItems(items.map(i => {
        if (i.id === selectedItemId) {
          return { ...i, deleted: false, parentId: 'desktop' };
        }
        return i;
      }));
      setSelectedItemId(null);
    }
  };

  const handleSaveFile = () => {
    if (editingFileId) {
      setItems(items.map(i => i.id === editingFileId ? { ...i, content: fileContent } : i));
      setEditingFileId(null);
    }
  };

  if (editingFileId) {
    const file = items.find(i => i.id === editingFileId);
    return (
      <div className="flex h-screen font-sans bg-slate-50 p-8">
        <div className="flex-1 bg-slate-50 rounded-xl shadow-lg border border-slate-200 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <File className="w-6 h-6 text-blue-500" /> 
              Editing {file?.name}.txt
            </h2>
            <button 
              onClick={handleSaveFile}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors"
            >
              <Save className="w-5 h-5" /> Save & Close
            </button>
          </div>
          <div className="mb-4 text-slate-500 text-sm">
            Write down the names of the subjects you are currently studying.
          </div>
          <textarea 
            value={fileContent}
            onChange={e => setFileContent(e.target.value)}
            className="flex-1 w-full border border-slate-300 rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-slate-700 leading-relaxed"
            placeholder="e.g. Mathematics, English, Computer Science..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 text-slate-800">
      <LabHeader onExit={onExit} title="File and Folder Management 2" subtitle="Create, edit, delete & recover files and folders" />
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-2">Tasks to Complete:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li className={hasNameFolder ? 'text-green-600 line-through' : ''}>Create a folder saved by your name on the Desktop.</li>
            <li className={hasActivityFile ? 'text-green-600 line-through' : ''}>Open it, create a file named 'activity', and write subjects inside.</li>
            <li>Delete the folder and practice recovering the 'activity' file from the Recycle Bin.</li>
          </ul>
        </div>

        <div className="flex-1 bg-slate-50 rounded-xl shadow-sm border border-slate-300 flex flex-col overflow-hidden">
          {/* Simulated File Explorer Header */}
          <div className="bg-slate-100 border-b border-slate-300 p-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (currentFolder?.parentId) setCurrentFolderId(currentFolder.parentId);
                  else setCurrentFolderId('desktop');
                }}
                disabled={currentFolderId === 'desktop' || currentFolderId === 'recycle_bin'}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-slate-50 border border-slate-300 px-3 py-1 rounded shadow-inner text-sm min-w-[300px] flex items-center gap-2 text-slate-600">
                {currentFolderId === 'desktop' ? <Monitor className="w-4 h-4" /> : currentFolderId === 'recycle_bin' ? <Trash2 className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                {currentFolder?.name}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentFolderId('desktop')} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded text-sm font-bold flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Desktop
              </button>
              <button onClick={() => setCurrentFolderId('recycle_bin')} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded text-sm font-bold flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Recycle Bin
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-slate-100 border-b border-slate-300 px-4 py-2 flex items-center gap-2">
            <button onClick={() => setIsCreatingFolder(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-sm font-bold transition-colors">
              <Plus className="w-4 h-4" /> New Folder
            </button>
            <button onClick={() => setIsCreatingFile(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition-colors">
              <FilePlus className="w-4 h-4" /> New File
            </button>
            {selectedItemId && currentFolderId !== 'recycle_bin' && (
              <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-bold transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
            {selectedItemId && currentFolderId === 'recycle_bin' && (
              <button onClick={handleRecover} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-sm font-bold transition-colors">
                <RotateCcw className="w-4 h-4" /> Recover
              </button>
            )}
          </div>

          {/* File Grid */}
          <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
            {isCreatingFolder && (
              <div className="mb-6 p-4 border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-950 rounded-lg max-w-sm">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Folder Name</label>
                <div className="flex gap-2">
                  <input 
                    autoFocus
                    type="text" 
                    value={inputName} 
                    onChange={e => setInputName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                    className="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded"
                  />
                  <button onClick={handleCreateFolder} className="px-3 py-1.5 bg-amber-600 text-white rounded font-bold">OK</button>
                  <button onClick={() => setIsCreatingFolder(false)} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-bold">Cancel</button>
                </div>
              </div>
            )}

            {isCreatingFile && (
              <div className="mb-6 p-4 border border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 rounded-lg max-w-sm">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New File Name (.txt)</label>
                <div className="flex gap-2">
                  <input 
                    autoFocus
                    type="text" 
                    value={inputName} 
                    onChange={e => setInputName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateFile()}
                    className="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded"
                  />
                  <button onClick={handleCreateFile} className="px-3 py-1.5 bg-blue-600 text-white rounded font-bold">OK</button>
                  <button onClick={() => setIsCreatingFile(false)} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-bold">Cancel</button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-6">
              {(currentFolderId === 'recycle_bin' ? recycleBinItems : currentItems).length === 0 && !isCreatingFolder && !isCreatingFile && (
                <div className="w-full text-center py-12 text-slate-400">
                  {currentFolderId === 'recycle_bin' ? 'Recycle bin is empty.' : 'This folder is empty.'}
                </div>
              )}
              
              {(currentFolderId === 'recycle_bin' ? recycleBinItems : currentItems).map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  onDoubleClick={() => {
                    if (currentFolderId === 'recycle_bin') return; // Cannot open deleted items directly
                    if (item.type === 'folder') {
                      setCurrentFolderId(item.id);
                      setSelectedItemId(null);
                    } else if (item.type === 'file') {
                      setEditingFileId(item.id);
                      setFileContent(item.content || '');
                    }
                  }}
                  className={`w-28 flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-transparent transition-colors ${
                    selectedItemId === item.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-100'
                  }`}
                >
                  {item.type === 'folder' ? (
                    <Folder className={`w-12 h-12 ${selectedItemId === item.id ? 'text-amber-500' : 'text-amber-400'} ${currentFolderId === 'recycle_bin' ? 'opacity-50' : ''}`} fill="currentColor" />
                  ) : (
                    <File className={`w-12 h-12 ${selectedItemId === item.id ? 'text-blue-500' : 'text-blue-400'} ${currentFolderId === 'recycle_bin' ? 'opacity-50' : ''}`} />
                  )}
                  <span className="text-sm font-medium text-center break-words w-full truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-100 border-t border-slate-200 p-2 text-xs text-slate-500">
            {(currentFolderId === 'recycle_bin' ? recycleBinItems : currentItems).length} items | {selectedItemId ? '1 item selected' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
