import React from 'react';
import { BaseUnit, GameMode } from '../types/physics';
import { SI_BASE_UNITS } from '../data/physicsQuestions';
import { soundManager } from '../utils/audio';
import { Sparkles, Keyboard } from 'lucide-react';

interface UnitLibraryProps {
  mode: GameMode;
  selectedSymbol: string | null;
  onSelectUnit: (symbol: string | null) => void;
}

export const UnitLibrary: React.FC<UnitLibraryProps> = ({
  mode,
  selectedSymbol,
  onSelectUnit,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{mode === 'unit' ? 'SI 基本單位庫' : '基本因次符號庫'}</span>
        </h3>
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <Keyboard className="w-3 h-3" />
          快捷鍵 1~7
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        {mode === 'unit'
          ? '點選下方 7 大國際標準基本量單位，再點擊左方空格放入或替換。'
          : '點選長度 [L]、質量 [M]、時間 [T] 等因次符號進行因次分析。'}
      </p>

      {/* Grid of 7 units */}
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2.5">
        {SI_BASE_UNITS.map((unit) => {
          const symbolToUse = mode === 'unit' ? unit.symbol : unit.dimensionSymbol;
          const nameToUse = mode === 'unit' ? unit.name : unit.dimensionName;
          const isSelected = selectedSymbol === symbolToUse;

          return (
            <button
              key={unit.symbol}
              type="button"
              onClick={() => {
                if (isSelected) {
                  soundManager.playRemove();
                  onSelectUnit(null);
                } else {
                  soundManager.playSelect();
                  onSelectUnit(symbolToUse);
                }
              }}
              style={{
                borderColor: isSelected ? unit.color : undefined,
                backgroundColor: isSelected ? unit.bgLight : undefined,
              }}
              className={`w-full group text-left p-3 rounded-xl border-2 transition-all duration-150 flex items-center justify-between gap-3 relative ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm translate-y-[-1px]'
                  : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Big Symbol Badge */}
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center font-black font-mono text-lg transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: unit.bgLight,
                    color: unit.color,
                  }}
                >
                  {symbolToUse}
                </div>

                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {nameToUse}
                  </div>
                  <div className="text-[11px] text-slate-400 capitalize font-medium">
                    {mode === 'unit' ? unit.english : `[${unit.dimensionSymbol}]`}
                  </div>
                </div>
              </div>

              {/* Hotkey Tag */}
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono font-bold bg-slate-100 group-hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/60">
                  {unit.hotkey}
                </span>
                {isSelected && (
                  <span className="text-[10px] font-bold text-emerald-600 mt-1">
                    已選取
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Physics Tip */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <span className="font-bold text-slate-800">💡 提示：</span>
        {mode === 'unit'
          ? '所有的物理量（力、能量、電壓）都可以由這 7 個 SI 基本單位透過乘除運算完全表示！'
          : '因次分析利用 [M][L][T] 檢驗方程式左右兩邊是否齊次（因次守恆）。'}
      </div>
    </div>
  );
};
