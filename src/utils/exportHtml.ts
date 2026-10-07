import { PhysicsQuestion, GameMode } from '../types/physics';

export function generateStandaloneHtml(
  questions: PhysicsQuestion[],
  activeMode: GameMode = 'unit'
): string {
  const jsonQuestions = JSON.stringify(questions, null, 2);

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>物理單位與因次拼圖實驗室 (離線獨立版)</title>
<style>
  :root {
    --bg-page: #f8fafc;
    --card-bg: #ffffff;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --primary: #059669;
    --primary-hover: #047857;
    --accent-blue: #2563eb;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif; }
  body { background: var(--bg-page); color: var(--text-main); min-height: 100vh; line-height: 1.6; }
  header { background: #fff; border-bottom: 1px solid var(--border); padding: 12px 24px; position: sticky; top: 0; z-index: 40; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .header-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .brand { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.15rem; color: #047857; }
  .pills { display: flex; align-items: center; gap: 10px; }
  .pill { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; border-radius: 9999px; padding: 4px 14px; font-size: 0.85rem; font-weight: 600; }
  .pill b { color: #0284c7; font-size: 1rem; }
  .mode-badge { background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; border-radius: 8px; padding: 4px 10px; font-size: 0.8rem; font-weight: 700; cursor: pointer; }
  .mode-badge.active { background: #059669; color: white; border-color: #059669; }

  main.container { max-width: 1100px; margin: 24px auto; padding: 0 16px; display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
  @media (max-width: 860px) { main.container { grid-template-columns: 1fr; } }

  .card { background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.04); padding: 24px; }
  .tag { display: inline-block; background: #e0f2fe; color: #0369a1; font-size: 0.75rem; font-weight: 700; border-radius: 999px; padding: 2px 10px; margin-bottom: 8px; }
  h2.q-title { font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
  .q-sub { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px; }

  .formula-banner { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #2563eb; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
  .formula-code { font-family: "Courier New", Courier, monospace; font-size: 1.25rem; font-weight: 800; color: #1e3a8a; }
  .formula-tag { font-size: 0.8rem; font-weight: 600; color: #475569; background: #e2e8f0; padding: 3px 10px; border-radius: 6px; }

  .workspace { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 24px; margin: 20px 0; text-align: center; }
  .slots-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 140px; }
  .slots-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin: 6px 0; }
  .slot { width: 72px; height: 72px; border: 2.5px dashed #94a3b8; border-radius: 14px; background: white; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s ease; user-select: none; }
  .slot:hover { border-color: #3b82f6; transform: translateY(-2px); }
  .slot.filled { border-style: solid; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08); }
  .slot .symbol { font-size: 1.5rem; font-weight: 800; }
  .slot .name { font-size: 0.65rem; color: #64748b; margin-top: 1px; }
  .slot.empty { color: #cbd5e1; font-size: 1.5rem; font-weight: 700; }
  .slot.wrong { animation: shake 0.35s ease; border-color: #ef4444; background: #fef2f2; }
  .fraction-bar { width: 100%; max-width: 380px; height: 4px; background: #334155; border-radius: 4px; margin: 10px auto; }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }

  .btn-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 20px; }
  button { font-family: inherit; cursor: pointer; border: none; outline: none; border-radius: 12px; font-weight: 700; transition: all 0.15s; }
  .btn-primary { background: var(--primary); color: white; padding: 12px 28px; font-size: 1rem; box-shadow: 0 2px 6px rgba(5,150,105,0.3); }
  .btn-primary:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-1px); }
  .btn-primary:disabled { background: #cbd5e1; color: #94a3b8; box-shadow: none; cursor: not-allowed; }
  .btn-ghost { background: #f1f5f9; color: #334155; padding: 12px 20px; font-size: 0.95rem; }
  .btn-ghost:hover { background: #e2e8f0; }

  .palette-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
  .unit-btn { border: 2px solid #e2e8f0; background: white; border-radius: 12px; padding: 12px 8px; text-align: center; cursor: pointer; transition: all 0.15s; }
  .unit-btn:hover { border-color: #3b82f6; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.06); }
  .unit-btn.selected { border-color: #2563eb; background: #eff6ff; }
  .unit-btn .sym { font-size: 1.3rem; font-weight: 800; }
  .unit-btn .lbl { font-size: 0.75rem; color: #64748b; margin-top: 2px; }
  .unit-btn .key { display: inline-block; background: #f1f5f9; font-size: 0.65rem; padding: 1px 6px; border-radius: 4px; margin-top: 4px; color: #475569; }

  .deriv-panel { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 14px; padding: 18px; margin-top: 20px; animation: fadeIn 0.3s ease; }
  .deriv-panel h4 { color: #166534; font-size: 1.05rem; font-weight: 800; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .step-flow { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 12px 0; }
  .step-node { background: white; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 6px 12px; font-size: 0.85rem; font-weight: 700; color: #166534; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  .step-arrow { color: #10b981; font-weight: 900; }
  .deriv-detail { font-size: 0.85rem; color: #374151; margin-top: 10px; line-height: 1.5; border-top: 1px dashed #bbf7d0; padding-top: 10px; }

  .hint-panel { background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 14px; margin-top: 16px; color: #92400e; font-size: 0.9rem; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

  .done-screen { text-align: center; padding: 40px 20px; }
  .score-huge { font-size: 4rem; font-weight: 900; color: #059669; margin: 12px 0; }

  /* Audio toggle */
  .sound-btn { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 10px; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 4px; }
</style>
</head>
<body>

<header>
  <div class="header-inner">
    <div class="brand">
      <span>⚛️</span>
      <span>物理單位與因次拼圖實驗室 (離線版)</span>
    </div>
    <div class="pills">
      <button class="mode-badge active" id="btnModeUnit" onclick="switchMode('unit')">📐 SI 單位模式</button>
      <button class="mode-badge" id="btnModeDim" onclick="switchMode('dimension')">🔬 因次分析模式</button>
      <div class="pill">進度 <b id="uiProgress">1/7</b></div>
      <div class="pill">得分 <b id="uiScore">0</b> 分</div>
      <button class="sound-btn" id="btnSound" onclick="toggleMute()">🔊 音效開</button>
    </div>
  </div>
</header>

<main class="container">
  <div class="card" id="quizCard">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span class="tag" id="qCategory">力學基礎</span>
      <span style="font-size:0.8rem; color:#64748b; font-weight:600;" id="qStandardUnit">標準單位: N</span>
    </div>
    <h2 class="q-title" id="qTitle">力 (Force / 牛頓 N)</h2>
    <div class="q-sub" id="qFormulaExp">牛頓第二運動定律：力等於質量乘以加速度</div>

    <div class="formula-banner">
      <div class="formula-code" id="qFormula">F = m × a</div>
      <span class="formula-tag" id="modePrompt">以 SI 基本單位拼湊組合</span>
    </div>

    <div class="workspace">
      <div style="font-size:0.85rem; color:#64748b; margin-bottom:8px; font-weight:600;">拼圖操作區（點擊選中右側單位，再點擊格子置入）</div>
      <div class="slots-wrap">
        <div class="slots-row" id="numRow"></div>
        <div class="fraction-bar" id="fracBar"></div>
        <div class="slots-row" id="denRow"></div>
      </div>
    </div>

    <div class="btn-row">
      <button class="btn-primary" id="btnSubmit" onclick="checkAnswer()" disabled>提交答案</button>
      <button class="btn-ghost" onclick="clearSlots()">清空重填</button>
      <button class="btn-ghost" onclick="toggleHint()">💡 觀念提示</button>
      <button class="btn-ghost" id="btnSkip" onclick="skipQuestion()">跳過此題 ➔</button>
    </div>

    <div id="feedbackArea"></div>
  </div>

  <div class="card" id="paletteCard">
    <h3 style="font-size:1.05rem; font-weight:800; margin-bottom:4px;" id="paletteTitle">基本單位庫 (點選填入)</h3>
    <p style="font-size:0.75rem; color:#64748b; margin-bottom:12px;">點選下方卡片後，點擊左側虛線格子置入單位。</p>
    <div class="palette-grid" id="paletteGrid"></div>
  </div>
</main>

<div class="card container done-screen" id="doneScreen" style="display:none; margin-top:40px;">
  <span style="font-size:3rem;">🎉</span>
  <h2 style="font-size:1.8rem; font-weight:900; color:#047857; margin-top:8px;">恭喜完成本輪物理挑戰！</h2>
  <div class="score-huge" id="finalScore">100</div>
  <p style="color:#64748b; margin-bottom:24px;">你已經成功掌握物理公式與基本量拆解的邏輯關係。</p>
  <div class="btn-row">
    <button class="btn-primary" onclick="restartQuiz()">再玩一次</button>
  </div>
</div>

<script>
// ================= 音效合成引擎 =================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isMuted = false;
function playTone(freq, type, dur, vol = 0.08) {
  if (isMuted) return;
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}
const sfx = {
  click: () => playTone(720, 'sine', 0.08, 0.05),
  correct: () => {
    playTone(523.25, 'sine', 0.2, 0.08);
    setTimeout(() => playTone(659.25, 'sine', 0.25, 0.08), 90);
    setTimeout(() => playTone(783.99, 'sine', 0.35, 0.09), 180);
  },
  wrong: () => {
    playTone(180, 'sawtooth', 0.2, 0.06);
    setTimeout(() => playTone(140, 'sawtooth', 0.25, 0.06), 110);
  },
  complete: () => {
    [523, 659, 783, 1046].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.3, 0.08), i * 140));
  }
};
function toggleMute() {
  isMuted = !isMuted;
  document.getElementById('btnSound').textContent = isMuted ? '🔇 靜音中' : '🔊 音效開';
}

// ================= 資料 =================
const QUESTIONS = ${jsonQuestions};

const SI_UNITS = [
  { s: 'm', n: '公尺', c: '#2563eb', bg: '#eff6ff', hotkey: '1' },
  { s: 'kg', n: '公斤', c: '#16a34a', bg: '#f0fdf4', hotkey: '2' },
  { s: 's', n: '秒', c: '#db2777', bg: '#fdf2f8', hotkey: '3' },
  { s: 'A', n: '安培', c: '#d97706', bg: '#fffbeb', hotkey: '4' },
  { s: 'K', n: '克耳文', c: '#ea580c', bg: '#fff7ed', hotkey: '5' },
  { s: 'mol', n: '莫耳', c: '#9333ea', bg: '#faf5ff', hotkey: '6' },
  { s: 'cd', n: '燭光', c: '#0891b2', bg: '#ecfeff', hotkey: '7' }
];

const DIMENSIONS = [
  { s: 'L', n: '長度 Length', c: '#2563eb', bg: '#eff6ff', hotkey: '1' },
  { s: 'M', n: '質量 Mass', c: '#16a34a', bg: '#f0fdf4', hotkey: '2' },
  { s: 'T', n: '時間 Time', c: '#db2777', bg: '#fdf2f8', hotkey: '3' },
  { s: 'I', n: '電流 Current', c: '#d97706', bg: '#fffbeb', hotkey: '4' },
  { s: 'Θ', n: '溫度 Temp', c: '#ea580c', bg: '#fff7ed', hotkey: '5' },
  { s: 'N', n: '物質量 Amount', c: '#9333ea', bg: '#faf5ff', hotkey: '6' },
  { s: 'J', n: '發光強度 Lum', c: '#0891b2', bg: '#ecfeff', hotkey: '7' }
];

let currentMode = '${activeMode}';
let curIndex = 0;
let score = 0;
let firstTry = 0;
let isAnsweredFirstTry = true;
let selectedItem = null;
let slots = { num: [], den: [] };
let isLocked = false;

function switchMode(mode) {
  sfx.click();
  currentMode = mode;
  document.getElementById('btnModeUnit').className = 'mode-badge ' + (mode === 'unit' ? 'active' : '');
  document.getElementById('btnModeDim').className = 'mode-badge ' + (mode === 'dimension' ? 'active' : '');
  document.getElementById('paletteTitle').textContent = mode === 'unit' ? 'SI 基本單位庫 (點選填入)' : '物理基本因次庫 (點選填入)';
  document.getElementById('modePrompt').textContent = mode === 'unit' ? '以 SI 基本單位拼湊' : '以因次量號 [M][L][T] 拼湊';
  selectedItem = null;
  loadQuestion();
  renderPalette();
}

function renderPalette() {
  const list = currentMode === 'unit' ? SI_UNITS : DIMENSIONS;
  const container = document.getElementById('paletteGrid');
  container.innerHTML = '';
  list.forEach(item => {
    const btn = document.createElement('div');
    const isSel = selectedItem && selectedItem.s === item.s;
    btn.className = 'unit-btn ' + (isSel ? 'selected' : '');
    btn.style.borderColor = isSel ? item.c : '#e2e8f0';
    btn.innerHTML = '<div class="sym" style="color:'+item.c+'">'+item.s+'</div>' +
                    '<div class="lbl">'+item.n+'</div>' +
                    '<span class="key">按 '+item.hotkey+'</span>';
    btn.onclick = () => {
      sfx.click();
      selectedItem = (selectedItem && selectedItem.s === item.s) ? null : item;
      renderPalette();
    };
    container.appendChild(btn);
  });
}

function loadQuestion() {
  isLocked = false;
  isAnsweredFirstTry = true;
  const q = QUESTIONS[curIndex];
  const targetAns = currentMode === 'unit' ? q.unitAns : q.dimensionAns;
  slots = {
    num: Array(targetAns.num.length).fill(null),
    den: Array(targetAns.den.length).fill(null)
  };

  document.getElementById('qCategory').textContent = q.categoryLabel;
  document.getElementById('qStandardUnit').textContent = '標準單位: ' + q.standardUnit;
  document.getElementById('qTitle').textContent = q.title;
  document.getElementById('qFormulaExp').textContent = q.formulaExplanation;
  document.getElementById('qFormula').textContent = q.formula;
  document.getElementById('uiProgress').textContent = (curIndex + 1) + '/' + QUESTIONS.length;
  document.getElementById('uiScore').textContent = Math.round((firstTry / QUESTIONS.length) * 100);
  document.getElementById('feedbackArea').innerHTML = '';
  renderSlots();
}

function renderSlots() {
  const numRow = document.getElementById('numRow');
  const denRow = document.getElementById('denRow');
  const fracBar = document.getElementById('fracBar');
  numRow.innerHTML = '';
  denRow.innerHTML = '';

  slots.num.forEach((val, i) => numRow.appendChild(createSlotElem('num', i, val)));
  if (slots.den.length > 0) {
    fracBar.style.display = 'block';
    slots.den.forEach((val, i) => denRow.appendChild(createSlotElem('den', i, val)));
  } else {
    fracBar.style.display = 'none';
  }

  const allFilled = [...slots.num, ...slots.den].every(x => x !== null);
  document.getElementById('btnSubmit').disabled = !allFilled || isLocked;
}

function createSlotElem(side, index, value) {
  const el = document.createElement('div');
  el.className = 'slot ' + (value ? 'filled' : 'empty');
  const paletteList = currentMode === 'unit' ? SI_UNITS : DIMENSIONS;

  if (value) {
    const item = paletteList.find(u => u.s === value) || { c: '#059669', n: '' };
    el.style.borderColor = item.c;
    el.style.backgroundColor = item.bg || '#fff';
    el.innerHTML = '<span class="symbol" style="color:'+item.c+'">'+value+'</span>' +
                   '<span class="name">'+item.n+'</span>';
  } else {
    el.textContent = '?';
  }

  el.onclick = () => {
    if (isLocked) return;
    sfx.click();
    if (selectedItem) {
      slots[side][index] = selectedItem.s;
    } else {
      slots[side][index] = null;
    }
    renderSlots();
  };
  return el;
}

function clearSlots() {
  if (isLocked) return;
  sfx.click();
  slots.num.fill(null);
  slots.den.fill(null);
  renderSlots();
}

function isMultisetEqual(a, b) {
  if (a.length !== b.length) return false;
  const sA = [...a].sort().join('|');
  const sB = [...b].sort().join('|');
  return sA === sB;
}

function checkAnswer() {
  if (isLocked) return;
  const q = QUESTIONS[curIndex];
  const targetAns = currentMode === 'unit' ? q.unitAns : q.dimensionAns;

  const numCorrect = isMultisetEqual(slots.num, targetAns.num);
  const denCorrect = isMultisetEqual(slots.den, targetAns.den);

  if (numCorrect && denCorrect) {
    onCorrect();
  } else {
    onWrong();
  }
}

function onCorrect() {
  isLocked = true;
  sfx.correct();
  if (isAnsweredFirstTry) {
    firstTry++;
  }
  document.getElementById('uiScore').textContent = Math.round((firstTry / QUESTIONS.length) * 100);

  const q = QUESTIONS[curIndex];
  let stepsHtml = '<div class="step-flow">';
  q.steps.forEach((st, idx) => {
    stepsHtml += '<div class="step-node">' + st.text + ' ➔ <span style="color:#047857">' + st.highlight + '</span></div>';
    if (idx < q.steps.length - 1) {
      stepsHtml += '<span class="step-arrow">➔</span>';
    }
  });
  stepsHtml += '</div>';

  document.getElementById('feedbackArea').innerHTML =
    '<div class="deriv-panel">' +
      '<h4>✅ 完全正確！物理觀念與公式推導拆解：</h4>' +
      stepsHtml +
      '<div class="deriv-detail"><b>詳細解析：</b>' + q.derivationSummary + '<br><span style="color:#0284c7;">🌍 實際物理例證：' + q.realWorldExample + '</span></div>' +
    '</div>';

  setTimeout(() => {
    if (curIndex < QUESTIONS.length - 1) {
      curIndex++;
      loadQuestion();
    } else {
      showDone();
    }
  }, 4200);
}

function onWrong() {
  isAnsweredFirstTry = false;
  sfx.wrong();
  document.querySelectorAll('.slot').forEach(el => el.classList.add('wrong'));
  setTimeout(() => {
    document.querySelectorAll('.slot').forEach(el => el.classList.remove('wrong'));
  }, 400);

  const q = QUESTIONS[curIndex];
  document.getElementById('feedbackArea').innerHTML =
    '<div class="hint-panel"><b>💡 思考方向：</b>' + q.hint + '<br><small>參考公式：' + q.hintFormula + '</small></div>';
}

function toggleHint() {
  sfx.click();
  const q = QUESTIONS[curIndex];
  document.getElementById('feedbackArea').innerHTML =
    '<div class="hint-panel"><b>💡 提示：</b>' + q.hint + '<br><small>拆解輔助：' + q.hintFormula + '</small></div>';
}

function skipQuestion() {
  sfx.click();
  if (curIndex < QUESTIONS.length - 1) {
    curIndex++;
    loadQuestion();
  } else {
    showDone();
  }
}

function showDone() {
  sfx.complete();
  document.getElementById('quizCard').style.display = 'none';
  document.getElementById('paletteCard').style.display = 'none';
  document.getElementById('doneScreen').style.display = 'block';
  document.getElementById('finalScore').textContent = Math.round((firstTry / QUESTIONS.length) * 100);
}

function restartQuiz() {
  curIndex = 0;
  firstTry = 0;
  document.getElementById('quizCard').style.display = 'block';
  document.getElementById('paletteCard').style.display = 'block';
  document.getElementById('doneScreen').style.display = 'none';
  loadQuestion();
}

// 鍵盤快速鍵 1 ~ 7
window.addEventListener('keydown', (e) => {
  const list = currentMode === 'unit' ? SI_UNITS : DIMENSIONS;
  const match = list.find(u => u.hotkey === e.key);
  if (match) {
    sfx.click();
    selectedItem = (selectedItem && selectedItem.s === match.s) ? null : match;
    renderPalette();
  }
});

// 初始化
renderPalette();
loadQuestion();
</script>
</body>
</html>`;
}

export function downloadStandaloneHtmlFile(
  questions: PhysicsQuestion[],
  activeMode: GameMode = 'unit',
  filename: string = '物理單位與因次拼圖實驗室_離線單檔.html'
) {
  const htmlContent = generateStandaloneHtml(questions, activeMode);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
