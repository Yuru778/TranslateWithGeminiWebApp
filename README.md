# Gemini 網頁翻譯助手 (Gemini Web Translator)

這是一個功能完整且美觀的 Chrome 擴充功能，讓您在瀏覽任何網頁時，選取文字即可快速送至 Google Gemini 進行翻譯。擴充功能會自動開啟 Gemini 網頁、建立「臨時對話」(Temporary Chat)、切換至 **快捷型 (Flash) 模型**，並自動貼上翻譯提示與文字，完成全自動化流程。

## ✨ 主要功能

* **右鍵快速翻譯**：選取文字後，右鍵點擊即可看到 `"Send to Gemini Translate..."` 選項。
* **自動化流程**：
  * 自動開啟 Google Gemini 網頁。
  * **自動建立「臨時對話」**：確保翻譯內容不會留存在主要對話紀錄中，保護隱私。
  * **自動切換至快捷型 (Flash) 模型**：在送出翻譯請求前，會檢查並強制切換為回應速度更快的 Flash 模型，避免使用思考型模型造成延遲。
  * 自動填入翻譯提示詞 (Translate to Traditional Chinese) 並發送。
* **智慧處理**：若側邊選單未展開，擴充功能會自動嘗試展開選單以找到「臨時對話」按鈕，確保在各種 UI 狀態下都能正常運作。

## 🚀 安裝教學

1. **下載程式碼**：將此專案下載或 Clone 到您的電腦上。
2. **開啟擴充功能管理頁面**：在 Chrome 地址列輸入 `chrome://extensions/` 並按下 Enter。
3. **啟用開發人員模式**：開啟頁面右上角的「開發人員模式」開關。
4. **載入擴充功能**：點擊左上角的「載入未封裝項目」 (Load unpacked)，選擇包含此專案檔案 (`manifest.json`, `background.js` 等) 的資料夾 (`d:\TAStuff\TranslateUsingGeminiWeb`)。

## 📖 使用方法

1. 在任何網頁上，使用滑鼠反白選取您想要翻譯的文字。
2. 點擊滑鼠右鍵，選擇選單中的 **"Send to Gemini Translate..."**。
3. Chrome 會自動開啟一個新的 Gemini 分頁。
4. 稍等片刻，擴充功能會自動點擊「臨時對話」，切換至 Flash 模型，貼上文字並開始翻譯。

## 🛠️ 檔案結構

* `manifest.json`：擴充功能的設定檔，定義權限與背景腳本。
* `background.js`：處理右鍵選單的點擊事件，負責開啟新分頁。
* `content_gemini.js`：注入到 Gemini 頁面的腳本，負責自動化操作（點擊按鈕、切換模型、貼上文字）。

## ⚠️ 注意事項

* 本擴充功能依賴 Gemini 網頁版的介面元素 (DOM)。若 Google 更新了 Gemini 的網頁結構，可能需要更新選擇器 (Selectors)。
* 請確保您已登入 Google Gemini 帳號。
* 若發現模型未自動切換為 Flash，請檢查 Gemini 網頁左上角的模型切換按鈕是否仍可點擊，或重新載入擴充功能。

---

**Enjoy seamless translation with Gemini!**
