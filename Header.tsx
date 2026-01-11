
import React from 'react';
import { translations as t } from '../i18n';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, isAdmin, onToggleAdmin }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-50 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-8 flex-1">
        <h1 className="text-2xl font-black tracking-tighter text-purple-500 select-none italic">
          FIGURE<span className="text-pink-400">PUFF</span>
        </h1>
        
        <div className="relative flex-1 max-w-xl group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.search}
            className="w-full bg-sky-50 border border-sky-100 rounded-full py-2.5 px-6 pl-12 text-sm text-sky-900 placeholder:text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-8">
        <button 
          onClick={onToggleAdmin}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${isAdmin ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-400 hover:bg-purple-100'}`}
        >
          {isAdmin ? '관리자 모드 ON' : '관리자 모드'}
        </button>
      </div>
    </header>
  );
};

export default Header;
