import React, { useState, useEffect, useMemo } from 'react';
import { GameMode, PhysicsCategory, PhysicsQuestion } from './types/physics';
import { PHYSICS_QUESTIONS, SI_BASE_UNITS } from './data/physicsQuestions';
import { soundManager } from './utils/audio';
import { downloadStandaloneHtmlFile } from './utils/exportHtml';
import { Header } from './components/Header';
import { QuizWorkspace } from './components/QuizWorkspace';
import { UnitLibrary } from './components/UnitLibrary';
import { ReviewModal } from './components/ReviewModal';
import { CustomQuestionModal } from './components/CustomQuestionModal';
import { HelpModal } from './components/HelpModal';
import { CompletionScreen } from './components/CompletionScreen';
import { Download, Sparkles, Check } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<GameMode>('unit');
  const [selectedCategory, setSelectedCategory] = useState<PhysicsCategory>('all');
  const [questionsList, setQuestionsList] = useState<PhysicsQuestion[]>(PHYSICS_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // Scoring
  const [firstTryCount, setFirstTryCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Modals
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [isCustomOpen, setIsCustomOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [showExportToast, setShowExportToast] = useState<boolean>(false);

  // Filtered questions based on selectedCategory
  const activeQuestions = useMemo(() => {
    if (selectedCategory === 'all') return questionsList;
    return questionsList.filter((q) => q.category === selectedCategory);
  }, [questionsList, selectedCategory]);

  const currentQuestion = activeQuestions[currentIdx] || activeQuestions[0];

  // Calculated score out of 100
  const score = useMemo(() => {
    if (activeQuestions.length === 0) return 0;
    return Math.round((firstTryCount / activeQuestions.length) * 100);
  }, [firstTryCount, activeQuestions.length]);

  // Handle category change
  const handleCategoryChange = (cat: PhysicsCategory) => {
    setSelectedCategory(cat);
    setCurrentIdx(0);
    setFirstTryCount(0);
    setIsCompleted(false);
    setSelectedSymbol(null);
  };

  // Handle mode change (SI units vs Dimensions)
  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode);
    setSelectedSymbol(null);
  };

  // When user answers
  const handleAnswerResult = (isCorrect: boolean, isFirstTry: boolean) => {
    if (isCorrect && isFirstTry) {
      setFirstTryCount((prev) => prev + 1);
    }
  };

  // Next question
  const handleNextQuestion = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedSymbol(null);
    } else {
      setIsCompleted(true);
    }
  };

  // Restart
  const handleRestart = () => {
    setCurrentIdx(0);
    setFirstTryCount(0);
    setIsCompleted(false);
    setSelectedSymbol(null);
  };

  // Add custom question
  const handleAddQuestion = (q: PhysicsQuestion) => {
    setQuestionsList((prev) => [...prev, q]);
    // Switch to category of added question
    setSelectedCategory(q.category);
    setCurrentIdx(0);
    setIsCompleted(false);
  };

  // Export standalone HTML file
  const handleExportHtml = () => {
    downloadStandaloneHtmlFile(
      questionsList,
      mode,
      `物理單位與因次拼圖實驗室_${mode === 'unit' ? 'SI單位版' : '因次分析版'}.html`
    );
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 4000);
  };

  // Global keyboard shortcuts (1~7 to select units, Esc to deselect)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        setSelectedSymbol(null);
        return;
      }

      const match = SI_BASE_UNITS.find((u) => u.hotkey === e.key);
      if (match) {
        soundManager.playSelect();
        const sym = mode === 'unit' ? match.symbol : match.dimensionSymbol;
        setSelectedSymbol((prev) => (prev === sym ? null : sym));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        currentIdx={currentIdx}
        totalQuestions={activeQuestions.length}
        score={score}
        onOpenReview={() => setIsReviewOpen(true)}
        onOpenCustom={() => setIsCustomOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onExportHtml={handleExportHtml}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {!isCompleted ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
            {/* Left Area: Quiz Interactive Workspace */}
            {currentQuestion ? (
              <QuizWorkspace
                key={`${currentQuestion.id}-${mode}`}
                question={currentQuestion}
                mode={mode}
                selectedSymbol={selectedSymbol}
                onAnswerResult={handleAnswerResult}
                onNextQuestion={handleNextQuestion}
              />
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <p className="text-slate-500 font-medium">該分類目前沒有題目。</p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  查看全部題目
                </button>
              </div>
            )}

            {/* Right Area: 7 SI Base Units / Dimensions Palette */}
            <aside className="sticky top-32">
              <UnitLibrary
                mode={mode}
                selectedSymbol={selectedSymbol}
                onSelectUnit={(sym) => setSelectedSymbol(sym)}
              />

              {/* Quick Export Callout in Sidebar */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 shadow-xs flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>想在教室或離線電腦使用？</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  點擊下方按鈕即可下載單一離線 HTML 檔案，包含所有音效與公式拆解，不用連網即可打開。
                </p>
                <button
                  onClick={handleExportHtml}
                  className="w-full mt-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下載獨立 HTML 檔案</span>
                </button>
              </div>
            </aside>
          </div>
        ) : (
          /* Completion Screen */
          <CompletionScreen
            score={score}
            firstTryCount={firstTryCount}
            totalQuestions={activeQuestions.length}
            questions={activeQuestions}
            mode={mode}
            onRestart={handleRestart}
            onOpenReview={() => setIsReviewOpen(true)}
            onExportHtml={handleExportHtml}
            onToggleMode={() => handleModeChange(mode === 'unit' ? 'dimension' : 'unit')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span>⚛️ 物理單位與因次拼圖實驗室</span>
            <span className="text-slate-300">•</span>
            <span>支援 Web Audio 互動合成音效</span>
            <span className="text-slate-300">•</span>
            <span>高中/大一普通物理觀念養成</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              新手說明與匯出教學
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={handleExportHtml}
              className="text-emerald-700 hover:text-emerald-800 font-bold"
            >
              一鍵匯出 HTML
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Export Toast Notification */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              HTML 單檔已成功匯出並下載！
            </div>
            <div className="text-[11px] text-slate-300">
              檔案已存至你的下載資料夾，任何瀏覽器皆可雙擊離線開啟。
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        questions={questionsList}
        mode={mode}
      />

      <CustomQuestionModal
        isOpen={isCustomOpen}
        onClose={() => setIsCustomOpen(false)}
        onAddQuestion={handleAddQuestion}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onExportHtml={handleExportHtml}
      />
    </div>
  );
}
