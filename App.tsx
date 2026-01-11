
import React, { useState, useMemo, useEffect } from 'react';
import { Figure, BookmarkFolder } from './types';
import { translations as t } from './i18n';
import Header from './components/Header';
import FigureGrid from './components/FigureGrid';
import Sidebar from './components/Sidebar';
import FigureModal from './components/FigureModal';
import FigureEditModal from './components/FigureEditModal';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Data State
  const [userFigures, setUserFigures] = useState<Figure[]>([]);
  const [categories, setCategories] = useState<string[]>(['여성 캐릭터', '남성 캐릭터', '퍼리']);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>([
    { id: 'default', name: '내 컬렉션', figureIds: [] }
  ]);

  // UI State
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(null);
  const [editingFigure, setEditingFigure] = useState<Figure | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'bookmarks' | 'folder'>('all');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Persistence (기존 게시글 보존 보장)
  useEffect(() => {
    const savedFavs = localStorage.getItem('fp_favs');
    const savedFolders = localStorage.getItem('fp_folders');
    const savedUserFigs = localStorage.getItem('fp_user_figs');
    const savedCats = localStorage.getItem('fp_cats');
    const savedAdmin = localStorage.getItem('fp_admin_mode');
    
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    if (savedFolders) setFolders(JSON.parse(savedFolders));
    if (savedUserFigs) {
      const parsed = JSON.parse(savedUserFigs);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setUserFigures(parsed);
      }
    }
    if (savedCats) setCategories(JSON.parse(savedCats));
    if (savedAdmin) setIsAdmin(JSON.parse(savedAdmin));
  }, []);

  useEffect(() => {
    localStorage.setItem('fp_favs', JSON.stringify(favorites));
    localStorage.setItem('fp_folders', JSON.stringify(folders));
    localStorage.setItem('fp_user_figs', JSON.stringify(userFigures));
    localStorage.setItem('fp_cats', JSON.stringify(categories));
    localStorage.setItem('fp_admin_mode', JSON.stringify(isAdmin));
  }, [favorites, folders, userFigures, categories, isAdmin]);

  // Derived Figures (카테고리 및 검색 필터링)
  const filteredFigures = useMemo(() => {
    let list = [...userFigures];
    
    if (viewMode === 'bookmarks') {
      list = list.filter(f => favorites.includes(f.id));
    } else if (viewMode === 'folder' && currentFolderId) {
      const folder = folders.find(f => f.id === currentFolderId);
      if (folder) {
        list = list.filter(f => folder.figureIds.includes(f.id));
      } else {
        list = [];
      }
    }

    if (activeCategory !== 'All') {
      list = list.filter(f => f.category === activeCategory);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(f => 
        f.name.toLowerCase().includes(q) || 
        f.character.toLowerCase().includes(q)
      );
    }
    
    return list;
  }, [userFigures, activeCategory, searchQuery, viewMode, currentFolderId, favorites, folders]);

  const selectedFigure = useMemo(() => 
    filteredFigures.find(f => f.id === selectedFigureId) || null
  , [selectedFigureId, filteredFigures]);

  // 캐릭터 이름 클릭 시 해당 캐릭터로 검색
  const handleCharacterClick = (characterName: string) => {
    setSearchQuery(characterName);
    setActiveCategory('All');
    setViewMode('all');
    setCurrentFolderId(null);
    setSelectedFigureId(null); // 모달 닫기
  };

  const navigateFigure = (direction: 'next' | 'prev') => {
    if (!selectedFigureId || filteredFigures.length <= 1) return;
    const currentIndex = filteredFigures.findIndex(f => f.id === selectedFigureId);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % filteredFigures.length;
    } else {
      nextIndex = (currentIndex - 1 + filteredFigures.length) % filteredFigures.length;
    }
    setSelectedFigureId(filteredFigures[nextIndex].id);
  };

  const addOrUpdateFigure = async (figData: Partial<Figure>) => {
    const normalizedName = figData.name?.trim().toLowerCase();
    const isDuplicate = userFigures.some(f => 
      f.id !== figData.id && f.name.trim().toLowerCase() === normalizedName
    );

    if (isDuplicate) {
      alert("이미 동일한 이름의 피규어가 존재합니다.");
      return;
    }

    if (figData.id) {
      const resultFig = { ...userFigures.find(f => f.id === figData.id)!, ...figData } as Figure;
      setUserFigures(prev => prev.map(f => f.id === resultFig.id ? resultFig : f));
    } else {
      const resultFig = {
        ...figData,
        id: Date.now().toString(),
        isUserAdded: true,
        isLocked: false,
        thumbnail: figData.angles?.[0]?.url || 'https://picsum.photos/800/1000',
      } as Figure;
      setUserFigures(prev => [resultFig, ...prev]);
    }
    setEditingFigure(null);
  };

  const deleteFigure = (id: string) => {
    if (window.confirm('이 피규어를 삭제할까요?')) {
      setUserFigures(prev => prev.filter(f => f.id !== id));
      setSelectedFigureId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7ff]">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
          setCategories={setCategories}
          viewMode={viewMode}
          currentFolderId={currentFolderId}
          onSelectFolder={id => { setViewMode('folder'); setCurrentFolderId(id); }}
          onSetBookmarks={() => { setViewMode('bookmarks'); setCurrentFolderId(null); }}
          folders={folders}
          onCreateFolder={name => setFolders(prev => [...prev, { id: Date.now().toString(), name, figureIds: [] }])}
          onRenameFolder={(id, name) => setFolders(prev => prev.map(f => f.id === id ? { ...f, name } : f))}
          onDeleteFolder={id => setFolders(prev => prev.filter(f => f.id !== id))}
          resetDisplay={() => { setViewMode('all'); setCurrentFolderId(null); setActiveCategory('All'); setSearchQuery(''); }}
          onAddFigure={() => setEditingFigure({} as Figure)}
          isAdmin={isAdmin}
        />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 border-b border-purple-100 pb-4 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-purple-900">
                  {viewMode === 'folder' ? folders.find(f => f.id === currentFolderId)?.name : viewMode === 'bookmarks' ? t.bookmarks : t.all}
                  {activeCategory !== 'All' && <span className="text-purple-300 ml-3 text-2xl font-medium">/ {activeCategory}</span>}
                  {searchQuery && <span className="text-pink-300 ml-3 text-2xl font-medium italic">" {searchQuery} "</span>}
                </h2>
                <p className="text-purple-400 mt-1 italic">{filteredFigures.length}개의 피규어</p>
              </div>
            </div>

            <FigureGrid 
              figures={filteredFigures}
              favorites={favorites}
              onToggleFavorite={id => setFavorites(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
              onSelect={f => setSelectedFigureId(f.id)}
              onCharacterClick={handleCharacterClick}
              currentFolderId={viewMode === 'folder' ? currentFolderId : null}
              onRemoveFromFolder={(figId, fId) => setFolders(p => p.map(f => f.id === fId ? { ...f, figureIds: f.figureIds.filter(x => x !== figId) } : f))}
            />
          </div>
        </main>
      </div>

      {selectedFigure && (
        <FigureModal 
          figure={selectedFigure} 
          onClose={() => setSelectedFigureId(null)}
          onToggleFavorite={id => setFavorites(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
          isFavorite={favorites.includes(selectedFigure.id)}
          folders={folders}
          onAddToFolder={(figId, fId) => setFolders(p => p.map(f => f.id === fId ? { ...f, figureIds: Array.from(new Set([...f.figureIds, figId])) } : f))}
          onEdit={fig => setEditingFigure(fig)}
          onDelete={id => deleteFigure(id)}
          onCharacterClick={handleCharacterClick}
          isAdmin={isAdmin}
          onNavigate={navigateFigure}
        />
      )}

      {editingFigure && (
        <FigureEditModal 
          figure={editingFigure}
          categories={categories}
          onClose={() => setEditingFigure(null)}
          onSave={addOrUpdateFigure}
          t={(k) => (t as any)[k] || k}
        />
      )}
    </div>
  );
};

export default App;
