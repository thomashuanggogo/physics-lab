import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PhysicsQuestion, GameMode } from '../types/physics';
import { soundManager } from '../utils/audio';
import { 
  Trophy, 
  RotateCcw, 
  Download, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  Award,
  Layers
} from 'lucide-react';

interface CompletionScreenProps {
  score: number;
  firstTryCount: number;
  totalQuestions: number;
  questions: PhysicsQuestion[];
  mode: GameMode;
  onRestart: () => void;
  onOpenReview: () => void;
  onExportHtml: () => void;
  onToggleMode: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  score,
  firstTryCount,
  totalQuestions,
  questions,
  mode,
  onRestart,
  onOpenReview,
  onExportHtml,
  onToggleMode,
}) => {
  useEffect(() => {
    soundManager.playComplete();

    // Trigger celebratory confetti burst
    const end = Date.now() + 2 * 1000;
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const percentage = Math.round((firstTryCount / totalQuestions) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 md:p-12 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
      {/* Trophy Badge */}
      <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-lg shadow-amber-400/20 mb-6">
        <Trophy className="w-10 h-10 animate-bounce" />
      </div>

      <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
        挑戰圓滿完成！
      </span>

      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
        物理單位推導大師
      </h2>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
        你已經徹底掌握了本單元各物理量由基本量 (SI Base Units) 所組成的數學與物理結構！
      </p>

      {/* Score Grid */}
      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="text-xs text-slate-500 font-semibold mb-1">完成題數</div>
          <div className="text-2xl font-black font-mono text-slate-900">
            {totalQuestions} 題
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="text-xs text-emerald-700 font-semibold mb-1">初次答對</div>
          <div className="text-2xl font-black font-mono text-emerald-700">
            {firstTryCount} 題
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="text-xs text-blue-700 font-semibold mb-1">總評得分</div>
          <div className="text-2xl font-black font-mono text-blue-700">
            {score} 分
          </div>
        </div>
      </div>

      {/* Learned Concepts Pills */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-8 text-left">
        <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>本輪成功推導之物理量：</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {questions.map((q) => (
            <span
              key={q.id}
              className="text-xs font-medium bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs"
            >
              <b className="font-mono text-emerald-700">{q.symbol}</b>
              <span>{q.title.split(' ')[0]}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => {
            soundManager.playClick();
            onRestart();
          }}
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>重新挑戰本輪</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onToggleMode();
          }}
          className="px-5 py-3 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-extrabold text-sm transition-all flex items-center gap-2"
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>{mode === 'unit' ? '切換至「因次分析模式」' : '切換至「SI 單位模式」'}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onExportHtml();
          }}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>下載離線 HTML 單檔</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onOpenReview();
          }}
          className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors flex items-center gap-1.5"
        >
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>查看全部推導筆記</span>
        </button>
      </div>
    </div>
  );
};
