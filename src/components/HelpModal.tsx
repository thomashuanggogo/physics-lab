import React from 'react';
import { soundManager } from '../utils/audio';
import { 
  X, 
  Download, 
  HelpCircle, 
  Laptop, 
  Keyboard, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Volume2
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportHtml: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  onExportHtml,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                新手使用導覽與匯出說明
              </h3>
              <p className="text-xs text-slate-600">
                解答「如何匯出？」以及「如何在此介面遊玩？」
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-lg hover:bg-emerald-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: Exporting */}
          <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-4.5">
            <div className="flex items-center gap-2 font-black text-emerald-950 text-base mb-2">
              <Download className="w-5 h-5 text-emerald-700" />
              <span>「所以我現在可以匯出了嗎？」—— 可以，隨時都能一鍵下載！</span>
            </div>
            <p className="text-xs text-emerald-900 mb-3">
              點擊右上角的綠色按鈕 <b className="bg-emerald-700 text-white px-2 py-0.5 rounded">📥 匯出離線 HTML</b>，瀏覽器會立即下載一份單一的 <b>.html</b> 檔案到你的「下載」資料夾中：
            </p>
            <ul className="text-xs space-y-1.5 text-emerald-900 font-medium list-disc list-inside bg-white/80 p-3 rounded-xl border border-emerald-200">
              <li><b>100% 獨立離線運行</b>：不需要安裝 Node.js、不需要網路連線。</li>
              <li><b>完整保留所有功能</b>：內建 Web Audio 音效、公式拆解流程、單位因次雙模式。</li>
              <li><b>跨裝置相容</b>：傳到學生平板、學校大螢幕、甚至隨身碟都能直接點兩下在 Chrome 或 Edge 打開。</li>
            </ul>

            <div className="mt-3.5 flex justify-end">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onExportHtml();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>立即下載這份 HTML 檔案</span>
              </button>
            </div>
          </div>

          {/* Section 2: How this interface works */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <Laptop className="w-4 h-4 text-blue-600" />
              <span>本測驗的核心介面玩法</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px]">1</span>
                  觀察藍色公式區
                </div>
                <p className="text-slate-500">
                  每題會給出核心物理定義（例如 <code className="text-blue-700 font-mono">F = m × a</code>），並標註該物理量是乘積還是相除。
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px]">2</span>
                  點選單位放入格子
                </div>
                <p className="text-slate-500">
                  點擊右側 7 個基本單位（或按快捷鍵 1~7），然後點擊左側虛線方框置入。若要移除，再次點擊已填入的格子即可。
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[11px]">3</span>
                  提交與逐步觀念拆解
                </div>
                <p className="text-slate-500">
                  答對時會響起清脆音階，並自動展開「公式逐步拆解圖解」，讓學生看清物理公式如何一步步堆疊成基本單位！
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[11px]">4</span>
                  音效與快捷鍵控制
                </div>
                <p className="text-slate-500">
                  右上角喇叭圖示可調整音量或一鍵靜音；電腦使用者直接按鍵盤數字 1~7 能極速切換單位。
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Dual Modes */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-indigo-700">
              <Layers className="w-4 h-4" />
              <span>雙模式切換特色</span>
            </h4>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p>
                <b>• SI 基本單位模式</b>：專注於公尺 (m)、公斤 (kg)、秒 (s)、安培 (A)、克耳文 (K) 等實體單位。
              </p>
              <p>
                <b>• 因次分析模式</b>：專注於理論物理中的長度 [L]、質量 [M]、時間 [T] 等因次符號，可輔導高階物理觀念。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            隨時點擊右上角「❓」即可再次開啟本指南
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors"
          >
            我知道了，開始練習
          </button>
        </div>
      </div>
    </div>
  );
};
