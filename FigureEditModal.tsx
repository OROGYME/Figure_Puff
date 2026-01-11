
import React, { useState } from 'react';
import { Figure, AngleImage } from '../types';

interface FigureEditModalProps {
  figure: Partial<Figure>;
  categories: string[];
  onClose: () => void;
  onSave: (fig: Partial<Figure>) => void;
  t: (key: string) => string;
}

export default function FigureEditModal({ figure, categories, onClose, onSave, t }: FigureEditModalProps) {
  const [formData, setFormData] = useState<Partial<Figure>>({
    name: figure.name || '',
    character: figure.character || '',
    source: figure.source || '직접 등록',
    sourceUrl: figure.sourceUrl || '',
    category: figure.category || categories[0] || '미분류',
    description: figure.description || '',
    isLocked: figure.isLocked || false,
    angles: figure.angles && figure.angles.length > 0 ? [...figure.angles] : [
      { label: '정면', url: '' },
      { label: '뒷면', url: '' },
    ],
    ...figure
  });

  const handleAngleChange = (index: number, field: keyof AngleImage, value: string) => {
    const newAngles = [...(formData.angles || [])];
    newAngles[index] = { ...newAngles[index], [field]: value };
    setFormData({ ...formData, angles: newAngles });
  };

  const addAngleSlot = () => {
    const newAngles = [...(formData.angles || []), { label: '추가 각도', url: '' }];
    setFormData({ ...formData, angles: newAngles });
  };

  const removeAngleSlot = (index: number) => {
    const newAngles = (formData.angles || []).filter((_, i) => i !== index);
    setFormData({ ...formData, angles: newAngles });
  };

  const handleSave = () => {
    if (!formData.name?.trim()) {
      alert("피규어 이름을 입력해주세요.");
      return;
    }
    if (!formData.angles || formData.angles.filter(a => a.url.trim()).length === 0) {
      alert("최소 하나 이상의 이미지 URL이 필요합니다.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-purple-950/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-purple-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-purple-900">{figure.id ? '피규어 정보 수정' : '새 피규어 등록'}</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-purple-300 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={formData.isLocked} 
                onChange={e => setFormData({...formData, isLocked: e.target.checked})}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
              <span className="group-hover:text-purple-500 transition-colors">수정 잠금</span>
            </label>
            <button onClick={onClose} className="text-purple-300 hover:text-purple-600 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-purple-300 tracking-wider">피규어 명칭</label>
              <input 
                className="w-full bg-purple-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-200 transition-all" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="제품명을 입력하세요"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-purple-300 tracking-wider">캐릭터 이름</label>
              <input 
                className="w-full bg-purple-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-200 transition-all" 
                value={formData.character} 
                onChange={e => setFormData({...formData, character: e.target.value})} 
                placeholder="캐릭터명을 입력하세요"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-purple-300 tracking-wider">카테고리</label>
              <select 
                className="w-full bg-purple-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-200 transition-all appearance-none cursor-pointer" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-purple-300 tracking-wider">출처 이름</label>
              <input 
                className="w-full bg-purple-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-200 transition-all" 
                value={formData.source} 
                onChange={e => setFormData({...formData, source: e.target.value})} 
                placeholder="제조사 또는 플랫폼"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-purple-300 tracking-wider">출처 링크 (URL)</label>
            <input 
              className="w-full bg-purple-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-200 transition-all" 
              value={formData.sourceUrl} 
              onChange={e => setFormData({...formData, sourceUrl: e.target.value})} 
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-purple-300 tracking-wider">상세 설명</label>
            <textarea 
              className="w-full bg-purple-50 border-none rounded-xl px-4 py-2.5 text-sm h-20 resize-none focus:ring-2 focus:ring-purple-200 transition-all" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="피규어의 특징을 짧게 설명해주세요..."
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-purple-50">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase text-purple-300 tracking-widest">각도별 이미지 관리</label>
              <button 
                onClick={addAngleSlot}
                className="text-[10px] font-black text-purple-600 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3} strokeLinecap="round"/></svg>
                이미지 추가
              </button>
            </div>
            
            <div className="space-y-2.5">
              {formData.angles?.map((angle, idx) => (
                <div key={idx} className="flex gap-2 items-start group">
                  <div className="w-20">
                    <input 
                      className="w-full bg-purple-100 border-none rounded-xl px-2 py-2 text-[10px] font-black uppercase focus:ring-1 focus:ring-purple-300 transition-all text-center"
                      value={angle.label}
                      onChange={e => handleAngleChange(idx, 'label', e.target.value)}
                      placeholder="라벨"
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      className="w-full bg-purple-50 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-purple-200 transition-all" 
                      placeholder="이미지 URL"
                      value={angle.url} 
                      onChange={e => handleAngleChange(idx, 'url', e.target.value)} 
                    />
                  </div>
                  {formData.angles && formData.angles.length > 1 && (
                    <button 
                      onClick={() => removeAngleSlot(idx)}
                      className="p-2 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2} strokeLinecap="round"/></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-purple-50 flex gap-4">
          <button 
            onClick={handleSave} 
            className="flex-1 bg-purple-600 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all active:scale-95"
          >
            저장하기
          </button>
          <button 
            onClick={onClose} 
            className="px-8 bg-white text-purple-400 font-bold py-3.5 rounded-2xl border border-purple-100 hover:bg-purple-50 transition-all"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
