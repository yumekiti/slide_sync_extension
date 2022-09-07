chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({"url": "./normal_popup.html" });
});