
import React from 'react';
import { Figure } from '../types';
import { translations as t } from '../i18n';

interface FigureGridProps {
  figures: Figure[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelect: (figure: Figure) => void;
  onCharacterClick: (character: string) => void;
  currentFolderId?: string | null;
  onRemoveFromFolder?: (figId: string, folderId: string) => void;
}

const FigureGrid: React.FC<FigureGridProps> = ({ figures, favorites, onToggleFavorite, onSelect, onCharacterClick, currentFolderId, onRemoveFromFolder }) => {
  if (figures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-sky-200">
        <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={1} strokeLinecap="round" />
        </svg>
        <p className="text-xl font-bold">{t.noResults}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
      {figures.map(figure => (
        <div 
          key={figure.id}
          className="group relative bg-white rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:shadow-purple-100 transition-all hover:-translate-y-2 border-b-4 border-purple-50 flex flex-col h-full"
          onClick={() => onSelect(figure)}
        >
          <div className="aspect-[3/4] overflow-hidden relative flex-shrink-0">
            <img 
              src={figure.thumbnail} 
              alt={figure.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              loading="lazy"
            />
            {/* Watermark */}
            <div className="absolute bottom-3 right-3 bg-purple-900/40 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-widest font-black text-white/90 select-none">
              © {figure.source}
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(figure.id);
                  }}
                  className={`p-3 rounded-full backdrop-blur-md transition-all shadow-xl ${favorites.includes(figure.id) ? 'bg-pink-500 text-white shadow-pink-200' : 'bg-white/80 text-pink-300 hover:bg-pink-500 hover:text-white'}`}
                >
                  <svg className="w-5 h-5" fill={favorites.includes(figure.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth={2} strokeLinecap="round" />
                  </svg>
                </button>

                {currentFolderId && onRemoveFromFolder && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromFolder(figure.id, currentFolderId);
                    }}
                    className="p-3 rounded-full backdrop-blur-md transition-all shadow-xl bg-white/80 text-red-400 hover:bg-red-500 hover:text-white"
                    title={t.delete}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="p-5 bg-white flex-1 flex flex-col">
            <h4 className="font-black text-sm line-clamp-2 mb-2 text-purple-900 leading-tight h-10 overflow-hidden">{figure.name}</h4>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCharacterClick(figure.character);
              }}
              className={`text-left text-[11px] font-black uppercase tracking-wider leading-tight line-clamp-2 break-all hover:text-purple-600 transition-colors ${figure.category.includes('여성') ? 'text-pink-400' : 'text-purple-400'}`}
            >
              #{figure.character}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FigureGrid;
