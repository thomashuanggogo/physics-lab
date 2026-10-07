import React, { useState } from 'react';
import { PhysicsQuestion, PhysicsCategory } from '../types/physics';
import { SI_BASE_UNITS } from '../data/physicsQuestions';
import { soundManager } from '../utils/audio';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface CustomQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (q: PhysicsQuestion) => void;
}

export const CustomQuestionModal: React.FC<CustomQuestionModalProps> = ({
  isOpen,
  onClose,
  onAddQuestion,
}) => {
  const [title, setTitle] = useState('');
  const [symbol, setSymbol] = useState('');
  const [category, setCategory] = useState<PhysicsCategory>('mechanics');
  const [standardUnit, setStandardUnit] = useState('');
  const [formula, setFormula] = useState('');
  const [formulaExplanation, setFormulaExplanation] = useState('');
  const [numUnits, setNumUnits] = useState<string[]>([]);
  const [denUnits, setDenUnits] = useState<string[]>([]);
  const [derivation, setDerivation] = useState('');
  const [hint, setHint] = useState('');

  if (!isOpen) return null;

  const addNumUnit = (u: string) => {
    soundManager.playClick();
    setNumUnits([...numUnits, u]);
  };
  const removeNumUnit = (idx: number) => {
    soundManager.playRemove();
    setNumUnits(numUnits.filter((_, i) => i !== idx));
  };

  const addDenUnit = (u: string) => {
    soundManager.playClick();
    setDenUnits([...denUnits, u]);
  };
  const removeDenUnit = (idx: number) => {
    soundManager.playRemove();
    setDenUnits(denUnits.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !formula) return;

    // Convert units to dimension symbols
    const numDim = numUnits.map((u) => {
      const match = SI_BASE_UNITS.find((b) => b.symbol === u);
      return match ? match.dimensionSymbol : 'L';
    });
    const denDim = denUnits.map((u) => {
      const match = SI_BASE_UNITS.find((b) => b.symbol === u);
      return match ? match.dimensionSymbol : 'T';
    });

    const newQuestion: PhysicsQuestion = {
      id: `custom_${Date.now()}`,
      category: category === 'all' ? 'mechanics' : category,
      categoryLabel:
        category === 'mechanics'
          ? '力學基礎'
          : category === 'energy'
          ? '能量與功'
          : category === 'electromagnetism'
          ? '電學與磁學'
          : category === 'thermo'
          ? '熱力學'
          : '波動與光學',
      title: title.trim(),
      symbol: symbol.trim() || 'X',
      standardUnit: standardUnit.trim() || '自訂單位',
      formula: formula.trim(),
      formulaExplanation: formulaExplanation.trim() || '自訂物理公式',
      unitAns: {
        num: numUnits,
        den: denUnits,
      },
      dimensionAns: {
        num: numDim,
        den: denDim,
      },
      steps: [
        { text: '公式定義', subtext: formula, highlight: title },
        {
          text: '拆解組合',
          subtext: '分子分母',
          highlight: `${numUnits.join('·') || '1'} / (${denUnits.join('·') || '1'})`,
        },
      ],
      derivationSummary: derivation.trim() || '由公式經基本量代入拆解得出。',
      realWorldExample: '自訂物理量應用情境。',
      hint: hint.trim() || '參考公式中各物理量之乘除對應關係。',
      hintFormula: formula,
    };

    soundManager.playCorrect();
    onAddQuestion(newQuestion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                新增自訂物理題目
              </h3>
              <p className="text-xs text-slate-500">
                自訂物理量、公式與答案基本單位，隨時匯出至教材
              </p>
            </div>
          </div>
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                物理量名稱 *
              </label>
              <input
                type="text"
                required
                placeholder="例如：萬有引力常數 G"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                代表符號
              </label>
              <input
                type="text"
                placeholder="例如：G, η, Φ"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                主題分類
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PhysicsCategory)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="mechanics">力學基礎</option>
                <option value="energy">能量與功</option>
                <option value="electromagnetism">電學與磁學</option>
                <option value="thermo">熱力學</option>
                <option value="waves">波動與光學</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                標準導出單位
              </label>
              <input
                type="text"
                placeholder="例如：N·m²/kg²"
                value={standardUnit}
                onChange={(e) => setStandardUnit(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              計算定義公式 *
            </label>
            <input
              type="text"
              required
              placeholder="例如：G = F × r² / (m₁ × m₂)"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              公式中文意義說明
            </label>
            <input
              type="text"
              placeholder="例如：萬有引力與質量乘積成正比、與距離平方成反比"
              value={formulaExplanation}
              onChange={(e) => setFormulaExplanation(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Unit selection for answer */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-800 mb-1">
                正解分子單位 (點選加入)：
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SI_BASE_UNITS.map((u) => (
                  <button
                    key={`btn-num-${u.symbol}`}
                    type="button"
                    onClick={() => addNumUnit(u.symbol)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 shadow-2xs"
                  >
                    + {u.symbol}
                  </button>
                ))}
              </div>
              <div className="min-h-10 bg-white p-2 rounded-xl border border-slate-200 flex flex-wrap gap-2 items-center">
                {numUnits.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    (分子目前無單位，若需要請點上方加入)
                  </span>
                ) : (
                  numUnits.map((u, i) => (
                    <span
                      key={i}
                      className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-xs px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      {u}
                      <button
                        type="button"
                        onClick={() => removeNumUnit(i)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-800 mb-1">
                正解分母單位 (點選加入)：
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SI_BASE_UNITS.map((u) => (
                  <button
                    key={`btn-den-${u.symbol}`}
                    type="button"
                    onClick={() => addDenUnit(u.symbol)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 shadow-2xs"
                  >
                    + {u.symbol}
                  </button>
                ))}
              </div>
              <div className="min-h-10 bg-white p-2 rounded-xl border border-slate-200 flex flex-wrap gap-2 items-center">
                {denUnits.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    (分母目前無單位，若無分母可保留空白)
                  </span>
                ) : (
                  denUnits.map((u, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-800 border border-blue-200 font-mono font-bold text-xs px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      {u}
                      <button
                        type="button"
                        onClick={() => removeDenUnit(i)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              拆解觀念或推導說明
            </label>
            <textarea
              rows={2}
              placeholder="說明這個物理量如何由基本量推導而來..."
              value={derivation}
              onChange={(e) => setDerivation(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              解題引導提示 (Hint)
            </label>
            <input
              type="text"
              placeholder="答錯或點提示時出現的引導"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>儲存並加入題庫</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
