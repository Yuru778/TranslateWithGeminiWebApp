# Gemini 網頁翻譯助手 (Gemini Web Translator)

這是一個簡單且強大的 Chrome 擴充功能，旨在提升您的閱讀與翻譯體驗。它允許您在瀏覽任何網頁時，選取文字並透過右鍵選單，直接將其傳送到 Google Gemini 進行翻譯。

## ✨ 主要功能

*   **右鍵快速翻譯**：選取文字後，右鍵點擊即可看到 "Send to Gemini Translate..." 選項。
*   **自動化流程**：
    *   自動開啟 Google Gemini 網頁。
    *   **自動建立「臨時對話」** (Temporary Chat)：確保您的翻譯內容不會留存在主要的對話紀錄中，保持隱私與整潔。
    *   自動填入翻譯提示詞 (Translate to Traditional Chinese) 並發送。
*   **智慧處理**：若側邊選單未展開，擴充功能會自動嘗試展開選單以找到「臨時對話」按鈕。

## 🚀 安裝教學

1.  **下載程式碼**：將此專案下載或 Clone 到您的電腦上。
2.  **開啟擴充功能管理頁面**：
    *   在 Chrome 瀏覽器網址列輸入 `chrome://extensions/` 並按下 Enter。
3.  **啟用開發人員模式**：
    *   開啟頁面右上角的「開發人員模式」開關。
4.  **載入擴充功能**：
    *   點擊左上角的「載入未封裝項目」 (Load unpacked)。
    *   選擇包含此專案檔案 (`manifest.json`, `background.js` 等) 的資料夾 (`d:\TAStuff\TranslateUsingGeminiWeb`)。

## 📖 使用方法

1.  在任何網頁上，使用滑鼠反白選取您想要翻譯的文字。
2.  點擊滑鼠右鍵，選擇選單中的 **"Send to Gemini Translate..."**。
3.  Chrome 會自動開啟一個新的 Gemini 分頁。
4.  稍等片刻，擴充功能會自動點擊「臨時對話」，貼上文字並開始翻譯。

## 🛠️ 檔案結構

*   `manifest.json`: 擴充功能的設定檔，定義權限與背景腳本。
*   `background.js`: 處理右鍵選單的點擊事件，並負責開啟新分頁。
*   `content_gemini.js`: 注入到 Gemini 頁面的腳本，負責自動化操作 (點擊按鈕、貼上文字)。

## ⚠️ 注意事項

*   此擴充功能依賴 Gemini 網頁版的介面元素 (DOM)。如果 Google 更新了 Gemini 的網頁結構，此擴充功能可能會暫時失效，需要更新選擇器 (Selectors)。
*   請確保您已登入 Google Gemini 帳號。

---
**Enjoy seamless translation with Gemini!**
