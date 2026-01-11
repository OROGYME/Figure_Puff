
import React, { useState, useRef, useEffect } from 'react';
import { Figure, BookmarkFolder } from '../types';
import { translations as t } from '../i18n';

interface FigureModalProps {
  figure: Figure;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  folders: BookmarkFolder[];
  onAddToFolder: (figId: string, folderId: string) => void;
  onEdit: (fig: Figure) => void;
  onDelete: (id: string) => void;
  onCharacterClick: (character: string) => void;
  isAdmin: boolean;
  onNavigate: (direction: 'next' | 'prev') => void;
}

const FigureModal: React.FC<FigureModalProps> = ({ 
  figure, onClose, onToggleFavorite, isFavorite, folders, onAddToFolder, onEdit, onDelete, onCharacterClick, isAdmin, onNavigate 
}) => {
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 특정 인덱스의 이미지로 스크롤
  const scrollToImage = (index: number) => {
    imageRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 키보드 내비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNavigate('next');
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* 배경 */}
      <div className="absolute inset-0 bg-purple-950/70 backdrop-blur-xl" onClick={onClose} />
      
      {/* 모달 컨테이너 */}
      <div className="relative w-full max-w-7xl h-full max-h-[95vh] bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border-8 border-white animate-in zoom-in-95 duration-200">
        
        {/* 게시글 이동 화살표 */}
        <button 
          onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/20 hover:bg-white/90 rounded-full transition-all text-purple-900 shadow-lg group"
        >
          <svg className="w-8 h-8 group-active:scale-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/20 hover:bg-white/90 rounded-full transition-all text-purple-900 shadow-lg group"
        >
          <svg className="w-8 h-8 group-active:scale-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* 메인 세로 스크롤 갤러리 */}
        <div 
          ref={scrollRef}
          className="flex-1 flex flex-col overflow-y-auto bg-purple-50 scroll-smooth snap-y snap-mandatory scrollbar-hide"
        >
          {figure.angles.map((angle, idx) => (
            <div 
              key={idx} 
              ref={el => { imageRefs.current[idx] = el; }}
              className="relative w-full min-h-full h-full flex items-center justify-center p-8 snap-start snap-always"
            >
              <img 
                src={angle.url} 
                className="max-w-full max-h-full object-contain drop-shadow-2xl" 
                alt={`${figure.name} - ${angle.label}`}
              />
              <div className="absolute top-8 right-8 bg-white/40 backdrop-blur-md px-4 py-2 rounded-2xl text-[12px] uppercase tracking-widest font-black text-purple-900">
                {angle.label || (idx + 1)}
              </div>
            </div>
          ))}
          <div className="absolute bottom-8 left-8 bg-purple-900/10 backdrop-blur-sm px-4 py-2 rounded-2xl text-[10px] uppercase tracking-widest font-black text-purple-900/40 select-none">
            © {figure.source}
          </div>
        </div>

        {/* 정보 사이드바 */}
        <div className="w-full md:w-[400px] p-8 flex flex-col bg-white overflow-y-auto border-l border-purple-50">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase text-purple-300 tracking-widest bg-purple-50 px-3 py-1 rounded-lg">
                {figure.category}
              </span>
              
              {isAdmin && (
                <div className="flex gap-2">
                  <button 
                    disabled={figure.isLocked}
                    onClick={() => onEdit(figure)} 
                    className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth={2} strokeLinecap="round"/></svg>
                  </button>
                  <button 
                    onClick={() => onDelete(figure.id)} 
                    className="p-1.5 rounded-lg text-red-300 hover:bg-red-50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round"/></svg>
                  </button>
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-black text-purple-900 leading-tight mb-3 break-words">{figure.name}</h2>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onCharacterClick(figure.character)}
                className="text-left text-pink-500 font-black text-sm uppercase tracking-wider break-all hover:text-pink-600 transition-colors"
              >
                #{figure.character}
              </button>
              {figure.sourceUrl ? (
                <a 
                  href={figure.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sky-500 text-[11px] font-bold hover:underline flex items-center gap-1 group"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {figure.source} 바로가기
                </a>
              ) : (
                <span className="text-purple-300 text-[11px] font-bold italic">{figure.source}</span>
              )}
            </div>
          </div>

          {/* 퀵 갤러리 그리드 */}
          <div className="mb-6">
            <h4 className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-3">전체 각도 모아보기</h4>
            <div className="grid grid-cols-4 gap-2">
              {figure.angles.map((angle, idx) => (
                <button 
                  key={idx}
                  onClick={() => scrollToImage(idx)}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-purple-300 transition-all bg-purple-50 group"
                >
                  <img src={angle.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={angle.label} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 flex-1 overflow-y-auto pr-2 min-h-[80px]">
            <h4 className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-2">상세 설명</h4>
            <p className="text-purple-900/70 leading-relaxed text-[13px] whitespace-pre-line">
              {figure.description || '상세 설명이 없습니다.'}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-purple-50">
            <button 
              onClick={() => onToggleFavorite(figure.id)} 
              className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95 ${
                isFavorite 
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-100' 
                  : 'bg-pink-50 text-pink-500 hover:bg-pink-100'
              }`}
            >
              {isFavorite ? '북마크 저장됨' : '북마크 추가'}
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowFolderMenu(!showFolderMenu)} 
                className="w-full py-3.5 bg-purple-50 text-purple-600 font-black text-sm rounded-2xl hover:bg-purple-100 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={2} strokeLinecap="round"/></svg>
                폴더 지정
              </button>
              
              {showFolderMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-3 bg-white border border-purple-50 rounded-2xl overflow-hidden shadow-2xl z-20 animate-in slide-in-from-bottom-2">
                  <div className="p-2 max-h-40 overflow-y-auto">
                    {folders.map(f => (
                      <button 
                        key={f.id} 
                        onClick={() => { onAddToFolder(figure.id, f.id); setShowFolderMenu(false); }} 
                        className="w-full text-left px-4 py-2.5 hover:bg-purple-50 text-xs font-bold text-purple-900 transition-all rounded-xl mb-1 last:mb-0 flex items-center justify-between"
                      >
                        {f.name}
                        {f.figureIds.includes(figure.id) && <svg className="w-3 h-3 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-2 text-purple-300 hover:text-purple-600 bg-white/50 backdrop-blur rounded-full shadow-sm transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  );
};

export default FigureModal;
