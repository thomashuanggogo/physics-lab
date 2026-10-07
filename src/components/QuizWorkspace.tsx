import React, { useState, useEffect } from 'react';
import { PhysicsQuestion, GameMode } from '../types/physics';
import { SI_BASE_UNITS } from '../data/physicsQuestions';
import { soundManager } from '../utils/audio';
import { 
  Lightbulb, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';

interface QuizWorkspaceProps {
  question: PhysicsQuestion;
  mode: GameMode;
  selectedSymbol: string | null;
  onAnswerResult: (isCorrect: boolean, isFirstTry: boolean) => void;
  onNextQuestion: () => void;
}

export const QuizWorkspace: React.FC<QuizWorkspaceProps> = ({
  question,
  mode,
  selectedSymbol,
  onAnswerResult,
  onNextQuestion,
}) => {
  const targetAns = mode === 'unit' ? question.unitAns : question.dimensionAns;

  // State for slots
  const [numSlots, setNumSlots] = useState<(string | null)[]>([]);
  const [denSlots, setDenSlots] = useState<(string | null)[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isFirstTry, setIsFirstTry] = useState<boolean>(true);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<number | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number>(0);

  // Initialize or reset slots on question change or mode change
  useEffect(() => {
    setNumSlots(Array(targetAns.num.length).fill(null));
    setDenSlots(Array(targetAns.den.length).fill(null));
    setIsAnswered(false);
    setIsFirstTry(true);
    setShowHint(false);
    setIsShaking(false);
    if (autoAdvanceTimer) {
      clearInterval(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    setTimerRemaining(0);
  }, [question.id, mode]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) clearInterval(autoAdvanceTimer);
    };
  }, [autoAdvanceTimer]);

  const handleSlotClick = (side: 'num' | 'den', index: number) => {
    if (isAnswered) return;

    if (selectedSymbol) {
      soundManager.playClick();
      if (side === 'num') {
        const next = [...numSlots];
        next[index] = selectedSymbol;
        setNumSlots(next);
      } else {
        const next = [...denSlots];
        next[index] = selectedSymbol;
        setDenSlots(next);
      }
    } else {
      // Remove current slot
      const currentVal = side === 'num' ? numSlots[index] : denSlots[index];
      if (currentVal !== null) {
        soundManager.playRemove();
        if (side === 'num') {
          const next = [...numSlots];
          next[index] = null;
          setNumSlots(next);
        } else {
          const next = [...denSlots];
          next[index] = null;
          setDenSlots(next);
        }
      }
    }
  };

  const handleClear = () => {
    if (isAnswered) return;
    soundManager.playClick();
    setNumSlots(Array(targetAns.num.length).fill(null));
    setDenSlots(Array(targetAns.den.length).fill(null));
  };

  // Check Multiset Equality (order doesn't matter, e.g. kg·m equals m·kg)
  const isMultisetEqual = (a: (string | null)[], b: string[]) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort().join('|');
    const sortedB = [...b].sort().join('|');
    return sortedA === sortedB;
  };

  const handleSubmit = () => {
    if (isAnswered) return;

    const numOk = isMultisetEqual(numSlots, targetAns.num);
    const denOk = isMultisetEqual(denSlots, targetAns.den);

    if (numOk && denOk) {
      // Correct!
      soundManager.playCorrect();
      setIsAnswered(true);
      onAnswerResult(true, isFirstTry);

      // Setup 5 second countdown before auto advance
      setTimerRemaining(5);
      const interval = window.setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onNextQuestion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setAutoAdvanceTimer(interval);
    } else {
      // Wrong!
      soundManager.playWrong();
      setIsFirstTry(false);
      setShowHint(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 450);
      onAnswerResult(false, isFirstTry);
    }
  };

  const allFilled = [...numSlots, ...denSlots].every((x) => x !== null);

  const getUnitInfo = (sym: string) => {
    return (
      SI_BASE_UNITS.find((u) => (mode === 'unit' ? u.symbol === sym : u.dimensionSymbol === sym)) || {
        color: '#059669',
        bgLight: '#ecfdf5',
        name: sym,
        dimensionName: sym,
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 flex flex-col gap-6">
      {/* Top Question Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {question.categoryLabel}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              物理符號: <b className="font-mono text-slate-800">{question.symbol}</b>
            </span>
          </div>
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
            標準導出單位: <b className="font-mono text-blue-700">{question.standardUnit}</b>
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          {question.title}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {question.formulaExplanation}
        </p>
      </div>

      {/* Physics Formula Showcase Box */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-200/70 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            核心定義與運算公式
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-blue-950 tracking-wide">
            {question.formula}
          </div>
        </div>

        <div className="text-xs text-slate-600 bg-white/80 backdrop-blur-xs border border-blue-100 rounded-xl p-3 max-w-sm">
          <div className="font-bold text-slate-800 mb-0.5">
            {mode === 'unit' ? '🎯 拼圖目標：SI 基本單位' : '🔬 拼圖目標：因次符號'}
          </div>
          <div>
            {mode === 'unit'
              ? `找出分子需 ${targetAns.num.length} 個單位，分母需 ${targetAns.den.length} 個基本單位。`
              : `長度 [L]、質量 [M]、時間 [T] 的冪次組合。`}
          </div>
        </div>
      </div>

      {/* Interactive Slot Canvas */}
      <div
        className={`bg-slate-50/80 border-2 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center transition-all ${
          isShaking
            ? 'border-rose-400 bg-rose-50/30 animate-[wiggle_0.4s_ease-in-out]'
            : isAnswered
            ? 'border-emerald-400 bg-emerald-50/20'
            : 'border-dashed border-slate-300'
        }`}
      >
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>單位組合架構區 (點擊格子填入或清除)</span>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[140px] w-full max-w-md">
          {/* Numerator Slots */}
          <div className="flex flex-wrap gap-3 justify-center items-center py-2">
            {numSlots.length === 0 ? (
              <span className="text-sm text-slate-400 font-semibold italic">
                (分子無單位 / 純數常數 1)
              </span>
            ) : (
              numSlots.map((val, idx) => {
                const info = val ? getUnitInfo(val) : null;
                return (
                  <button
                    key={`num-${idx}`}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSlotClick('num', idx)}
                    className={`w-16 h-16 md:w-18 md:h-18 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-150 relative ${
                      val
                        ? 'border-solid shadow-sm hover:scale-105 active:scale-95'
                        : 'border-dashed border-slate-300 hover:border-blue-400 bg-white hover:bg-blue-50/30'
                    }`}
                    style={{
                      borderColor: info ? info.color : undefined,
                      backgroundColor: info ? info.bgLight : undefined,
                    }}
                    title={val ? `點擊移除 ${val}` : '點擊填入所選單位'}
                  >
                    {val ? (
                      <>
                        <span
                          className="font-black font-mono text-xl md:text-2xl"
                          style={{ color: info?.color }}
                        >
                          {val}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {mode === 'unit' ? info?.name : info?.dimensionName}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-300 font-bold text-xl">?</span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Fraction Division Bar */}
          {targetAns.den.length > 0 && (
            <div className="w-full max-w-sm h-1.5 bg-slate-750 bg-slate-800 rounded-full my-3 relative shadow-xs">
              <span className="absolute -right-7 -top-2.5 text-[10px] font-bold text-slate-400 bg-white px-1 rounded">
                除以 ÷
              </span>
            </div>
          )}

          {/* Denominator Slots */}
          {targetAns.den.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center items-center py-2">
              {denSlots.map((val, idx) => {
                const info = val ? getUnitInfo(val) : null;
                return (
                  <button
                    key={`den-${idx}`}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSlotClick('den', idx)}
                    className={`w-16 h-16 md:w-18 md:h-18 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-150 relative ${
                      val
                        ? 'border-solid shadow-sm hover:scale-105 active:scale-95'
                        : 'border-dashed border-slate-300 hover:border-blue-400 bg-white hover:bg-blue-50/30'
                    }`}
                    style={{
                      borderColor: info ? info.color : undefined,
                      backgroundColor: info ? info.bgLight : undefined,
                    }}
                    title={val ? `點擊移除 ${val}` : '點擊填入所選單位'}
                  >
                    {val ? (
                      <>
                        <span
                          className="font-black font-mono text-xl md:text-2xl"
                          style={{ color: info?.color }}
                        >
                          {val}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {mode === 'unit' ? info?.name : info?.dimensionName}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-300 font-bold text-xl">?</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {!isAnswered ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={!allFilled}
              className={`px-8 py-3.5 rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center gap-2 ${
                allFilled
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-102 cursor-pointer shadow-emerald-600/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>提交答案</span>
            </button>

            <button
              onClick={handleClear}
              className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>清空重填</span>
            </button>

            <button
              onClick={() => {
                soundManager.playHint();
                setShowHint(!showHint);
              }}
              className="px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-sm transition-colors flex items-center gap-1.5"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>觀念提示</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onNextQuestion();
              }}
              className="px-4 py-3 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors flex items-center gap-1"
            >
              <span>跳過此題</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 w-full justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>太棒了！已完全解出該物理量之基本因次組合。</span>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                if (autoAdvanceTimer) clearInterval(autoAdvanceTimer);
                onNextQuestion();
              }}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <span>下一題 ({timerRemaining}s)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Guided Hint Panel (Show when hint is clicked or when wrong) */}
      {showHint && !isAnswered && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-amber-900 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm leading-relaxed">
              <div className="font-bold text-amber-950 mb-1">💡 物理直覺與拆解引導：</div>
              <p className="mb-2">{question.hint}</p>
              <div className="inline-block bg-white/90 border border-amber-300 rounded-lg px-2.5 py-1 font-mono font-bold text-amber-900 text-xs">
                建議依據：{question.hintFormula}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-Step Formula Decomposition Flowchart (Appears when Correct) */}
      {isAnswered && (
        <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl p-5 md:p-6 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>觀念深植：公式如何一步步拆解為基本量？</span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-white/80 px-2.5 py-1 rounded-full border border-emerald-200">
              步驟拆解圖解
            </span>
          </div>

          {/* Visual Step Nodes with Flow Arrows */}
          <div className="flex flex-wrap items-center gap-2.5 my-3">
            {question.steps.map((st, i) => (
              <React.Fragment key={i}>
                <div className="bg-white border-2 border-emerald-200 rounded-xl px-3.5 py-2.5 shadow-xs flex flex-col">
                  <span className="font-extrabold text-xs text-slate-800">
                    {st.text}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {st.subtext}
                    </span>
                    <span className="text-xs font-black font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {st.highlight}
                    </span>
                  </div>
                </div>
                {i < question.steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Detailed Derivation Summary & Real World Connection */}
          <div className="mt-4 pt-3 border-t border-emerald-200/80 text-xs text-slate-700 flex flex-col gap-2">
            <div>
              <span className="font-bold text-emerald-950">📚 推導詳解：</span>
              <span>{question.derivationSummary}</span>
            </div>
            <div className="text-slate-600 flex items-start gap-1.5 bg-white/70 p-2.5 rounded-xl border border-emerald-200">
              <span className="font-bold text-blue-700 shrink-0">🌍 生活中的物理：</span>
              <span>{question.realWorldExample}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
