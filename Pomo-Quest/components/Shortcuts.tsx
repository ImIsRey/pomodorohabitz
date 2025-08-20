import React, { useState, useEffect } from 'react';
import { Shortcut, GameAction } from '../types';
import LinkIcon from './icons/LinkIcon';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';

interface ShortcutsProps {
  shortcuts: Shortcut[];
  dispatch: React.Dispatch<GameAction>;
}

const ShortcutItem: React.FC<{ shortcut: Shortcut, dispatch: React.Dispatch<GameAction> }> = ({ shortcut, dispatch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(shortcut.name);
  const [content, setContent] = useState(shortcut.content);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>('#');

  useEffect(() => {
    let objectUrl: string | undefined;
    
    const createBlobUrl = async () => {
      if (shortcut.type === 'pdf' && shortcut.content.startsWith('data:application/pdf')) {
        try {
          const response = await fetch(shortcut.content);
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          setPdfBlobUrl(objectUrl);
        } catch (error) {
          console.error("Error creating blob URL for PDF:", error);
          setPdfBlobUrl('#'); // Fallback
        }
      }
    };

    createBlobUrl();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [shortcut.content, shortcut.type]);

  const handleSave = () => {
    if (name.trim() && (shortcut.type === 'pdf' || (shortcut.type === 'url' && content.trim()))) {
      dispatch({ type: 'UPDATE_SHORTCUT', payload: { ...shortcut, name: name.trim(), content } });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setName(shortcut.name);
    setContent(shortcut.content);
    setIsEditing(false);
  }

  const handleDelete = () => {
    dispatch({ type: 'REMOVE_SHORTCUT', payload: shortcut.id });
  };
  
  const getHref = () => {
    if (shortcut.type === 'pdf') {
      return pdfBlobUrl;
    }
    try {
      new URL(shortcut.content);
      return shortcut.content;
    } catch (_) {
      return '#';
    }
  };

  return (
    <li className="bg-amber-50 dark:bg-gray-700 p-2 rounded-md transition-colors">
      {isEditing ? (
        <div className="flex flex-col space-y-2">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full bg-amber-100 dark:bg-gray-600 border-2 border-amber-200 dark:border-gray-500 rounded-md p-1 focus:outline-none focus:border-emerald-500"/>
            {shortcut.type === 'url' ? (
                <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder="URL" className="w-full bg-amber-100 dark:bg-gray-600 border-2 border-amber-200 dark:border-gray-500 rounded-md p-1 focus:outline-none focus:border-emerald-500"/>
            ) : (
                <p className="text-sm text-stone-500 dark:text-gray-400 p-1">Editing PDF content is not supported.</p>
            )}
            <div className="flex justify-end space-x-2">
                <button onClick={handleCancel} className="bg-gray-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-gray-600">Cancel</button>
                <button onClick={handleSave} className="bg-emerald-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-emerald-600">Save</button>
            </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <a href={getHref()} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline truncate flex-grow flex items-center min-w-0">
            {shortcut.type === 'pdf' ? (
                <DocumentTextIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            ) : (
                <LinkIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            )}
            <span className="truncate">{shortcut.name}</span>
          </a>
          <div className="flex items-center flex-shrink-0 ml-2">
            <button onClick={() => setIsEditing(true)} className="text-stone-500 dark:text-gray-400 hover:text-blue-500 p-1"><PencilIcon className="h-4 w-4" /></button>
            <button onClick={handleDelete} className="text-stone-500 dark:text-gray-400 hover:text-red-500 p-1"><TrashIcon className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </li>
  );
}


const Shortcuts: React.FC<ShortcutsProps> = ({ shortcuts, dispatch }) => {
  const [addType, setAddType] = useState<'url' | 'pdf'>('url');
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState('');

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setPdfFile(file);
        setPdfFileName(file.name);
        if (!newName) {
            setNewName(file.name.replace(/\.[^/.]+$/, ""));
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addType === 'url' && newName.trim() && newUrl.trim()) {
      dispatch({ type: 'ADD_SHORTCUT', payload: { name: newName.trim(), type: 'url', content: newUrl.trim() } });
      resetForm('url');
    } else if (addType === 'pdf' && newName.trim() && pdfFile) {
        const pdfData = await toBase64(pdfFile);
        dispatch({ type: 'ADD_SHORTCUT', payload: { name: newName.trim(), type: 'pdf', content: pdfData }});
        resetForm('pdf');
    }
  };
  
  const resetForm = (type: 'url' | 'pdf') => {
    setAddType(type);
    setNewName('');
    setNewUrl('');
    setPdfFile(null);
    setPdfFileName('');
  }
  
  const isFormInvalid = addType === 'url'
    ? !newName.trim() || !newUrl.trim()
    : !newName.trim() || !pdfFile;

  return (
    <div className="bg-amber-100 dark:bg-gray-800 rounded-lg p-4 shadow-lg transition-colors">
      <h2 className="text-xl font-bold mb-4 font-pixel text-emerald-600 dark:text-emerald-400 flex items-center">
        <LinkIcon className="h-5 w-5 mr-2" />
        Shortcuts
      </h2>

      <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
        {shortcuts.map(shortcut => (
          <ShortcutItem key={shortcut.id} shortcut={shortcut} dispatch={dispatch} />
        ))}
        {shortcuts.length === 0 && (
          <li className="text-center text-stone-500 p-3">No shortcuts yet.</li>
        )}
      </ul>
      
      <div className="flex border-b border-gray-300 dark:border-gray-600 mb-4">
        <button type="button" onClick={() => resetForm('url')} className={`px-4 py-2 font-semibold transition-colors ${addType === 'url' ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>Link</button>
        <button type="button" onClick={() => resetForm('pdf')} className={`px-4 py-2 font-semibold transition-colors ${addType === 'pdf' ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>PDF</button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Shortcut Name"
          className="w-full bg-amber-50 dark:bg-gray-700 border-2 border-amber-200 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:border-emerald-500 transition-colors text-gray-800 dark:text-gray-100"
          required
        />
        {addType === 'url' ? (
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-amber-50 dark:bg-gray-700 border-2 border-amber-200 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:border-emerald-500 transition-colors text-gray-800 dark:text-gray-100"
            required
          />
        ) : (
          <div>
            <label htmlFor="pdf-upload" className="w-full bg-amber-50 dark:bg-gray-700 border-2 border-dashed border-amber-300 dark:border-gray-600 rounded-md p-2 flex items-center justify-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors text-gray-800 dark:text-gray-100">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-stone-500" />
              <span className="text-stone-600 dark:text-stone-300 truncate">{pdfFileName || 'Upload a PDF'}</span>
            </label>
            <input
              id="pdf-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="application/pdf"
            />
          </div>
        )}
        <button type="submit" disabled={isFormInvalid} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-md flex items-center justify-center font-semibold disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Shortcut
        </button>
      </form>
    </div>
  );
};

export default Shortcuts;