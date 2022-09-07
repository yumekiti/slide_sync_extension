chrome.action.onClicked.addListener((tab) => {
  chrome.windows.create({
    "url": "./normal_popup.html",
    "type": "popup",
    "width": 300,
    "height": 300,
  });
});