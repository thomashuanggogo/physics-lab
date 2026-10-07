import React, { useState } from 'react';
import { PhysicsQuestion, GameMode } from '../types/physics';
import { PHYSICS_QUESTIONS } from '../data/physicsQuestions';
import { soundManager } from '../utils/audio';
import { X, Search, Printer, BookOpen, Layers } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions?: PhysicsQuestion[];
  mode: GameMode;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  questions = PHYSICS_QUESTIONS,
  mode,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = questions.filter((q) => {
    const matchSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.formula.toLowerCase().includes(search.toLowerCase()) ||
      q.standardUnit.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || q.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                物理公式與單位/因次速查手冊
              </h3>
              <p className="text-xs text-slate-500">
                所有物理量的定義公式、SI 基本量分解與生活實例
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="列印這份複習單"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">列印講義</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between bg-white">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="搜尋物理量名稱、符號、公式或單位..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto text-xs">
            {['all', 'mechanics', 'energy', 'electromagnetism', 'waves'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all'
                    ? '全部'
                    : cat === 'mechanics'
                    ? '力學'
                    : cat === 'energy'
                    ? '能量'
                    : cat === 'electromagnetism'
                    ? '電磁'
                    : '波動'}
                </button>
              )
            )}
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 rounded-2xl p-4 hover:border-emerald-300 transition-all bg-white shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    {item.symbol}
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {item.title}
                  </span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                    {item.categoryLabel}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {item.standardUnit}
                </div>
              </div>

              {/* Formula & SI breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">
                    定義公式
                  </div>
                  <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">
                    {item.formula}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {item.formulaExplanation}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Layers className="w-3 h-3 text-emerald-600" />
                    <span>SI 基本單位 / 因次式</span>
                  </div>
                  <div className="font-mono font-bold text-emerald-800 text-sm mt-0.5">
                    SI: {item.unitAns.num.join(' · ') || '1'}
                    {item.unitAns.den.length > 0 && ` / (${item.unitAns.den.join(' · ')})`}
                  </div>
                  <div className="font-mono font-semibold text-indigo-700 text-xs mt-0.5">
                    因次: [{item.dimensionAns.num.join('') || '1'}]
                    {item.dimensionAns.den.length > 0 &&
                      ` / [${item.dimensionAns.den.join('')}]`}
                  </div>
                </div>
              </div>

              {/* Derivation summary */}
              <div className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                <span className="font-bold text-slate-700">拆解推導：</span>
                {item.derivationSummary}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
