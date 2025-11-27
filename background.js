chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "send-to-gemini",
    title: "Send to Gemini Translate...",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "send-to-gemini") {
    const selectedText = info.selectionText;
    
    // Open Gemini in a new tab
    chrome.tabs.create({ url: "https://gemini.google.com/app" }, (newTab) => {
      // Wait for the tab to load before sending the message
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          
          // Send the selected text to the content script
          chrome.tabs.sendMessage(tabId, {
            action: "pasteAndSend",
            text: selectedText
          });
        }
      });
    });
  }
});
