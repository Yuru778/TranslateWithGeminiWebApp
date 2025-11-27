chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "send-to-gemini",
      title: "Send to Gemini Translate...",
      contexts: ["selection"]
    });
    
    
    chrome.contextMenus.create({
      id: "translate-page",
      title: "Translate Page...",
      contexts: ["page", "link", "image"]
    });
    console.log("Context menus created successfully (v2)!"); 
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("右鍵選單被點擊了！");
  if (info.menuItemId === "send-to-gemini") {
    const selectedText = info.selectionText;
    openGeminiAndSend(selectedText);
  } else if (info.menuItemId === "translate-page") {
    // Execute script to get all text from the page
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText
    }, (results) => {
      if (results && results[0] && results[0].result) {
        const pageText = results[0].result;
        openGeminiAndSend(pageText);
      } else {
        console.error("Failed to retrieve page text.");
      }
    });
  }
});

function openGeminiAndSend(text) {
    // Open Gemini in a new tab
    chrome.tabs.create({ url: "https://gemini.google.com/app" }, (newTab) => {
      // Wait for the tab to load before sending the message
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          
          // Send the text to the content script
          chrome.tabs.sendMessage(tabId, {
            action: "pasteAndSend",
            text: text
          });
        }
      });
    });
}
