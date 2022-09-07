// event
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "event") {
    console.log(request.value);
  }
});