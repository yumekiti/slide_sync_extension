const getEvent = (value) => {
  console.log(value);
}

// event
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "event") {
    getEvent(request.value);
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({"url": "./normal_popup.html" });
});