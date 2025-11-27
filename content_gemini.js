
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for element: ${selector}`));
    }, timeout);
  });
}

async function clickNewChat() {
    console.log("Attempting to find and click 'New Chat' button...");
    
    // Prioritize Temporary Chat selectors
    const tempChatSelectors = [
        '[data-test-id="temp-chat-button"]', // Strongest selector
        'button.temp-chat-button',
        'button[mattooltip="臨時對話"]',
        'button[aria-label="臨時對話"]', 
        'div[role="button"][aria-label="臨時對話"]',
        'span[aria-label="臨時對話"]',
        'button[aria-label="Temporary chat"]',
        'div[role="button"][aria-label="Temporary chat"]'
    ];

    // Standard New Chat selectors as fallback
    const standardChatSelectors = [
        'button[aria-label="New chat"]', // English
        'div[role="button"][aria-label="New chat"]',
        'button[aria-label="新增對話"]', // Traditional Chinese
        'div[role="button"][aria-label="新增對話"]',
        '.new-chat-button',
        '[data-test-id="new-chat-button"]' 
    ];

    // Helper to try clicking a button from selectors
    const tryClick = (selectors) => {
        for (const selector of selectors) {
            const btn = document.querySelector(selector);
            // Check if visible (offsetParent is a simple check, but not perfect for fixed/absolute)
            // For Gemini's side menu, offsetParent is usually null if hidden.
            if (btn && btn.offsetParent !== null) { 
                console.log(`Found visible button with selector: ${selector}`);
                btn.click();
                return true;
            }
        }
        return false;
    };

    // Helper to find button by text content
    const tryClickByText = (texts) => {
        const allButtons = Array.from(document.querySelectorAll('button, div[role="button"], span'));
        const btn = allButtons.find(b => {
             if (!b.offsetParent) return false;
             const text = b.textContent?.trim();
             return texts.includes(text);
        });
        
        if (btn) {
            console.log(`Found button by text: ${btn.textContent}`);
            btn.click();
            return true;
        }
        return false;
    };

    // --- Strategy ---
    
    // 1. Try Temporary Chat immediately (multiple attempts in case of loading)
    for (let i = 0; i < 3; i++) {
        if (tryClick(tempChatSelectors)) return true;
        if (tryClickByText(["臨時對話", "Temporary chat"])) return true;
        await new Promise(r => setTimeout(r, 500)); // Short wait
    }

    // 2. If not found, try opening the side menu to find Temporary Chat
    console.log("Temporary Chat button not found or not visible. Trying to expand side menu...");
    const menuButtonSelectors = [
        '[data-test-id="side-nav-menu-button"]',
        'button[aria-label="主選單"]',
        'button[aria-label="Main menu"]',
        'button[aria-label="Expand menu"]',
        'button[mattooltip="主選單"]',
        'button[mattooltip="Main menu"]'
    ];

    let menuClicked = false;
    for (const selector of menuButtonSelectors) {
        const menuBtn = document.querySelector(selector);
        if (menuBtn) {
            console.log(`Found Side Menu button: ${selector}. Clicking...`);
            menuBtn.click();
            menuClicked = true;
            break;
        }
    }

    if (menuClicked) {
        // Wait for animation/expansion
        console.log("Waiting for side menu to expand...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 3. Try finding the Temporary Chat button again after menu expand
        if (tryClick(tempChatSelectors)) return true;
        if (tryClickByText(["臨時對話", "Temporary chat"])) return true;
    }

    // 4. If Temporary Chat is still not found, fallback to Standard New Chat
    console.log("Temporary Chat button not found. Falling back to Standard New Chat...");
    if (tryClick(standardChatSelectors)) return true;
    if (tryClickByText(["New chat", "新增對話"])) return true;


    console.log("Could not find 'New Chat' button with any known selector.");
    return false;
}

async function ensureFlashModel() {
    console.log("Attempting to ensure 'Flash' (快捷型) model...");
    
    // 1. Find the model switcher button.
    // It is usually a button with text like "Gemini Advanced", "Gemini", "Thinking", etc.
    // We look for a button that has a popup menu and contains relevant text.
    const buttons = Array.from(document.querySelectorAll('button, div[role="button"]'));
    const modelSwitcher = buttons.find(b => {
        // Must be visible
        if (!b.offsetParent) return false;
        
        const text = b.textContent?.trim() || "";
        const isModelText = text.includes("Gemini") || text.includes("Advanced") || text.includes("Thinking") || text.includes("思考");
        
        // It usually has aria-expanded or aria-haspopup
        const isMenuTrigger = b.getAttribute('aria-expanded') !== null || b.getAttribute('aria-haspopup') !== null;

        return isModelText && isMenuTrigger;
    });

    if (!modelSwitcher) {
        console.log("Could not find model switcher button. Skipping model check.");
        return;
    }

    // Check if we are already in Flash mode (heuristic)
    // If the switcher text contains "Flash" and NOT "Thinking", we might be good.
    // But "Gemini 1.5 Flash" vs "Gemini 2.0 Flash Thinking".
    if (modelSwitcher.textContent.includes("Flash") && !modelSwitcher.textContent.includes("Thinking") && !modelSwitcher.textContent.includes("思考")) {
        console.log("Already in Flash model (based on button text).");
        return;
    }

    console.log(`Found potential model switcher: "${modelSwitcher.textContent}". Clicking to open menu...`);
    modelSwitcher.click();

    // Wait for menu to open
    await new Promise(r => setTimeout(r, 1000));

    // 2. Find "Flash" or "快捷型" option in the menu
    // We search all clickable elements that might be menu items.
    const candidates = Array.from(document.querySelectorAll('[role="menuitem"], [role="option"], li, button, span'));
    
    const flashOption = candidates.find(item => {
        if (!item.offsetParent) return false; // Must be visible
        const text = item.textContent?.trim() || "";
        
        // We want "Flash" or "快捷" but NOT "Thinking" (思考)
        const isFlash = text.includes("Flash") || text.includes("快捷");
        const isThinking = text.includes("Thinking") || text.includes("思考");
        
        return isFlash && !isThinking; 
    });

    if (flashOption) {
        console.log(`Found Flash option: "${flashOption.textContent}". Clicking...`);
        flashOption.click();
        // Wait for the switch to happen
        await new Promise(r => setTimeout(r, 1000));
    } else {
        console.log("Flash option not found in menu. Closing menu...");
        // Try to close by clicking the switcher again
        modelSwitcher.click();
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "pasteAndSend") {
        const text = request.text;
        console.log("Received text to translate:", text);

        (async () => {
            // Check if we are on the base app URL. If not, or if we want to force a new chat, try clicking "New Chat".
            // The user wants to force a new temporary chat.
            const isCleanAppUrl = window.location.href === "https://gemini.google.com/app";
            
            console.log("Current URL:", window.location.href);
            
            // Attempt to click new chat.
            // Note: clickNewChat is now async
            let newChatClicked = await clickNewChat();
            
            // If we clicked new chat, wait a bit for the UI to reset.
            if (newChatClicked) {
                console.log("Clicked New Chat. Waiting for UI to settle...");
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            } else {
                console.log("Did not click New Chat (not found or already on fresh page).");
            }

            // Ensure we are using the Flash model
            await ensureFlashModel();

            try {
                // Wait for the input area to be ready
                const inputSelector = 'div[contenteditable="true"]';
                const inputArea = await waitForElement(inputSelector, 10000);
                
                // Focus and clear (if any)
                inputArea.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand('delete', false, null);

                // Construct the prompt
                const prompt = `Please translate the following text to Traditional Chinese:\n\n${text}`;
                console.log("Prompt constructed:", prompt);

                // Alternative insertion method: Direct DOM manipulation + Event
                // This is often more robust if execCommand fails on newlines or length.
                inputArea.innerText = prompt;
                inputArea.dispatchEvent(new Event('input', { bubbles: true }));

                // Wait for the send button to become active/visible
                const sendButtonSelector = 'button[aria-label="Send message"], button[aria-label="傳送訊息"]'; 
                const sendButton = await waitForElement(sendButtonSelector, 5000);

                if (sendButton) {
                    // Small delay to ensure button is clickable
                    await new Promise(resolve => setTimeout(resolve, 500));
                    sendButton.click();
                    console.log("Clicked send button.");
                } else {
                    console.error("Send button not found.");
                }

            } catch (error) {
                console.error("Error during automation:", error);
            }
        })();
    }
});
