chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message.action === "storeData") {
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
  chrome.storage.local.get(['notes', 'highlights'], (result) => {
    sendResponse({ notes: result.notes, highlights: result.highlights });
  });
  return true;
}
});