chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
  
  // Listener for messages from other parts of the extension (e.g., content scripts or popup)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "add-note") {
        // Code to add a note on the webpage
      }
    });
    
    
    
    if (message.action === "storeData") {
      // Attempt to save notes and highlights to local storage
      try {
        chrome.storage.local.set(
          { notes: message.notesContent, highlights: message.highlightContent },
          () => {
            sendResponse({ status: "success" });
          }
        );
      } catch (error) {
        console.error("Error storing data:", error);
        sendResponse({ status: "failure" });
      }
      return true; 
    } else if (message.action === "retrieveData") {
      // Load notes and highlights from local storage
      chrome.storage.local.get(['notes', 'highlights'], (result) => {
        sendResponse({ notes: result.notes, highlights: result.highlights });
      });
      return true; // Indicates that sendResponse will be called asynchronously
    }
  });