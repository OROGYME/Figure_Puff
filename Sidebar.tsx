
import React, { useState } from 'react';
import { BookmarkFolder } from '../types';
import { translations as t } from '../i18n';

interface SidebarProps {
  activeCategory: string | 'All';
  setActiveCategory: (cat: string) => void;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  viewMode: 'all' | 'bookmarks' | 'folder';
  currentFolderId: string | null;
  onSelectFolder: (id: string) => void;
  onSetBookmarks: () => void;
  folders: BookmarkFolder[];
  onCreateFolder: (name: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
  resetDisplay: () => void;
  onAddFigure: () => void;
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, setActiveCategory, categories, setCategories, viewMode, currentFolderId, onSelectFolder, onSetBookmarks, folders, onCreateFolder, onRenameFolder, onDeleteFolder, resetDisplay, onAddFigure, isAdmin 
}) => {
  const [newCat, setNewCat] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newFolder, setNewFolder] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [catEditValue, setCatEditValue] = useState('');

  const deleteCategory = (cat: string) => {
    if (window.confirm(`카테고리 "${cat}"을(를) 삭제할까요?`)) {
      setCategories(prev => prev.filter(c => c !== cat));
      if (activeCategory === cat) setActiveCategory('All');
    }
  };

  const handleRenameCategory = (oldName: string) => {
    if (catEditValue.trim() && catEditValue !== oldName) {
      setCategories(prev => prev.map(c => c === oldName ? catEditValue.trim() : c));
      if (activeCategory === oldName) setActiveCategory(catEditValue.trim());
    }
    setEditingCat(null);
  };

  return (
    <aside className="w-64 bg-white/60 border-r border-purple-50 p-6 flex flex-col gap-8 hidden md:flex">
      <section className="space-y-1">
        <button 
          onClick={resetDisplay} 
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'all' && activeCategory === 'All' ? 'bg-purple-100 text-purple-700 shadow-sm' : 'text-purple-400 hover:bg-purple-50'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth={2} strokeLinecap="round"/></svg>
          {t.all}
        </button>
        <button 
          onClick={onSetBookmarks} 
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'bookmarks' ? 'bg-pink-100 text-pink-700 shadow-sm' : 'text-pink-300 hover:text-pink-600 hover:bg-pink-50'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth={2} strokeLinecap="round"/></svg>
          {t.bookmarks}
        </button>
      </section>

      {isAdmin && (
        <section>
          <button 
            onClick={onAddFigure} 
            className="w-full py-3.5 bg-purple-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3} strokeLinecap="round"/></svg>
            피규어 추가
          </button>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4 px-3">
          <h3 className="text-[10px] font-black text-purple-300 uppercase tracking-widest">카테고리</h3>
          {isAdmin && (
            <button onClick={() => setIsAddingCat(!isAddingCat)} className="text-purple-300 hover:text-purple-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={2} strokeLinecap="round"/></svg>
            </button>
          )}
        </div>
        
        {isAddingCat && (
          <input 
            autoFocus 
            className="w-full bg-white border-2 border-purple-100 rounded-xl px-3 py-2.5 text-xs mb-3 focus:outline-none focus:border-purple-300" 
            placeholder="새 카테고리..." 
            onKeyDown={e => {
              if(e.key === 'Enter' && newCat) {
                if(!categories.includes(newCat)) {
                  setCategories([...categories, newCat.trim()]);
                  setNewCat('');
                  setIsAddingCat(false);
                }
              }
            }}
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
          />
        )}

        <div className="space-y-1.5">
          {/* 전체 카테고리 버튼 */}
          <button 
            onClick={() => setActiveCategory('All')} 
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeCategory === 'All' 
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-100' 
                : 'text-purple-400 hover:bg-purple-50'
            }`}
          >
            모든 카테고리
          </button>

          {categories.map(cat => (
            <div key={cat} className="group flex items-center gap-1">
              {editingCat === cat ? (
                <input 
                  autoFocus
                  className="flex-1 bg-white border border-purple-200 rounded-lg px-2 py-1.5 text-xs text-purple-900 focus:outline-none"
                  value={catEditValue}
                  onChange={e => setCatEditValue(e.target.value)}
                  onBlur={() => handleRenameCategory(cat)}
                  onKeyDown={e => e.key === 'Enter' && handleRenameCategory(cat)}
                />
              ) : (
                <button 
                  onClick={() => setActiveCategory(cat)} 
                  className={`flex-1 text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-100' 
                      : 'text-purple-400 hover:bg-purple-50'
                  }`}
                >
                  {cat}
                </button>
              )}
              
              {isAdmin && editingCat !== cat && (
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => { setEditingCat(cat); setCatEditValue(cat); }}
                    className="p-1.5 text-purple-300 hover:text-purple-500"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth={2} strokeLinecap="round"/></svg>
                  </button>
                  <button 
                    onClick={() => deleteCategory(cat)} 
                    className="p-1.5 text-red-200 hover:text-red-400"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3} strokeLinecap="round"/></svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 px-3">
          <h3 className="text-[10px] font-black text-purple-300 uppercase tracking-widest">{t.folders}</h3>
          <button onClick={() => setIsAddingFolder(!isAddingFolder)} className="text-purple-300 hover:text-purple-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={2} strokeLinecap="round"/></svg>
          </button>
        </div>
        
        {isAddingFolder && (
          <input 
            autoFocus
            className="w-full bg-white border-2 border-purple-100 rounded-xl px-3 py-2.5 text-xs mb-3 focus:outline-none focus:border-purple-300" 
            placeholder={t.folderNamePlaceholder} 
            onKeyDown={e => {
              if(e.key === 'Enter' && newFolder) {
                onCreateFolder(newFolder.trim());
                setNewFolder('');
                setIsAddingFolder(false);
              }
            }}
            value={newFolder}
            onChange={e => setNewFolder(e.target.value)}
          />
        )}
        
        <div className="space-y-1.5">
          {folders.map(folder => (
            <button 
              key={folder.id} 
              onClick={() => onSelectFolder(folder.id)} 
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all truncate border ${
                currentFolderId === folder.id 
                  ? 'bg-purple-100 text-purple-900 border-purple-200 shadow-sm' 
                  : 'text-purple-600 border-transparent hover:bg-white/80'
              }`}
            >
              {folder.name}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;
