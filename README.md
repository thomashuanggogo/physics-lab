# 物理單位與因次拼圖實驗室 (Physics Unit Lab)

互動式物理單位與因次拆解拼圖測驗，支援 Web Audio 音效回饋、公式逐步拆解圖解、多模式測驗與一鍵匯出離線單一 HTML 檔案。

---

## 🚀 如何在 GitHub 上運作？

### 情況一：想要透過「GitHub Pages」發布成公開網頁
因為這是 Vite + React (TypeScript) 專案，瀏覽器無法直接執行未編譯的 `.tsx` 原始碼，必須經過建置（Build）。

**設定步驟：**
1. 將專案推送到 GitHub。
2. 進入你的 GitHub Repo 頁面，點選上方 **Settings** ➔ 左側選單 **Pages**。
3. 在 **Build and deployment** 下方的 **Source**，請從原本的 `Deploy from a branch` 切換選擇為 **`GitHub Actions`**。
4. 專案內已包含 `.github/workflows/deploy.yml`，它會在每次 Push 時自動執行 `npm run build` 並部署到你的專屬網址（例如 `https://<你的帳號>.github.io/<專案名稱>/`）！

---

### 情況二：在自己的電腦本機執行 (Local Development)
如果你把專案 clone 到電腦上：
```bash
# 1. 安裝套件（必須執行，否則沒有 node_modules 會無法運作）
npm install

# 2. 啟動開發伺服器
npm run dev
```
啟動後打開瀏覽器訪問 `http://localhost:3000` 即可。

---

### 情況三：想要「單一 HTML 檔案、雙擊即可開啟、完全不用安裝任何環境」
如果你只想在課堂上、投影機或隨身碟中離線使用：
- 請直接使用專案內的 [`public/物理單位與因次拼圖實驗室_離線單檔.html`](./public/物理單位與因次拼圖實驗室_離線單檔.html)。
- 或者在執行中的網頁右上角點擊 **「📥 匯出離線 HTML」**，即可下載完全自包含的單檔版本。
