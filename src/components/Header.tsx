import React, { useState } from 'react';
import { GameMode, PhysicsCategory } from '../types/physics';
import { soundManager } from '../utils/audio';
import { 
  Volume2, 
  VolumeX, 
  Download, 
  BookOpen, 
  PlusCircle, 
  HelpCircle, 
  Atom, 
  Layers, 
  Filter
} from 'lucide-react';

interface HeaderProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  selectedCategory: PhysicsCategory;
  onCategoryChange: (cat: PhysicsCategory) => void;
  currentIdx: number;
  totalQuestions: number;
  score: number;
  onOpenReview: () => void;
  onOpenCustom: () => void;
  onOpenHelp: () => void;
  onExportHtml: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  selectedCategory,
  onCategoryChange,
  currentIdx,
  totalQuestions,
  score,
  onOpenReview,
  onOpenCustom,
  onOpenHelp,
  onExportHtml,
}) => {
  const [muted, setMuted] = useState(soundManager.getMuted());
  const [volume, setVolume] = useState(soundManager.getVolume());
  const [showVolSlider, setShowVolSlider] = useState(false);

  const toggleMute = () => {
    const nextState = !muted;
    soundManager.setMuted(nextState);
    setMuted(nextState);
    if (!nextState) {
      soundManager.playClick();
    }
  };

  const handleVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    soundManager.setVolume(v);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Mode */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Atom className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
              物理單位與因次拼圖
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                公式拆解加強版
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden md:block">
              透過乘除拆解基本量，培養物理直覺與因次驗算能力
            </p>
          </div>
        </div>

        {/* Center: Mode Switch */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => {
              soundManager.playClick();
              onModeChange('unit');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === 'unit'
                ? 'bg-white text-emerald-800 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            SI 基本單位模式
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onModeChange('dimension');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === 'dimension'
                ? 'bg-white text-indigo-800 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            因次分析 [M][L][T]
          </button>
        </div>

        {/* Right side stats & tools */}
        <div className="flex items-center gap-2">
          {/* Progress pill */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <span className="text-slate-400">進度</span>
            <span className="font-mono text-emerald-700 font-bold">
              {currentIdx + 1}/{totalQuestions}
            </span>
          </div>

          {/* Score pill */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
            <span className="text-emerald-600">得分</span>
            <span className="font-mono text-emerald-700 font-extrabold text-sm">
              {score}
            </span>
          </div>

          {/* Sound Controls */}
          <div className="relative">
            <button
              onClick={toggleMute}
              onMouseEnter={() => setShowVolSlider(true)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title={muted ? '解除靜音' : '靜音'}
              aria-label="音效開關"
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>

            {showVolSlider && (
              <div 
                onMouseLeave={() => setShowVolSlider(false)}
                className="absolute right-0 top-full mt-1 bg-white border border-slate-200 shadow-lg rounded-xl p-3 z-40 w-40 flex flex-col gap-2"
              >
                <div className="flex justify-between text-xs text-slate-600 font-medium">
                  <span>音量大小</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolChange}
                  className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Formula handbook button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenReview();
            }}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors hidden sm:flex items-center gap-1 text-xs font-bold"
            title="查看完整公式與因次對照表"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>公式手冊</span>
          </button>

          {/* Custom Question Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenCustom();
            }}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors hidden md:flex items-center gap-1 text-xs font-bold"
            title="新增自訂物理公式題目"
          >
            <PlusCircle className="w-4 h-4 text-teal-600" />
            <span>新增題目</span>
          </button>

          {/* Guide / Help button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenHelp();
            }}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
            title="操作導覽與使用說明"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
          </button>

          {/* Export Standalone HTML Button - Highlighted for user! */}
          <button
            onClick={() => {
              soundManager.playClick();
              onExportHtml();
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 group ring-2 ring-emerald-500/30"
            title="下載獨立單一 HTML 檔案，免連網即可在任何電腦/投影機/平板直接開啟"
          >
            <Download className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="font-extrabold">匯出離線 HTML</span>
          </button>
        </div>
      </div>

      {/* Category selector row */}
      <div className="bg-slate-50 border-t border-slate-100 px-4 py-1.5 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-medium whitespace-nowrap pl-1">
            <Filter className="w-3 h-3" />
            <span>主題分類：</span>
          </div>
          {(
            [
              { id: 'all', label: '全部單元 (All)' },
              { id: 'mechanics', label: '力學基礎' },
              { id: 'energy', label: '能量與功' },
              { id: 'electromagnetism', label: '電學與磁學' },
              { id: 'waves', label: '波動與光學' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                onCategoryChange(cat.id);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
