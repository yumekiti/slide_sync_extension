// イベント
button.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: main,
  });
});

// 関数
const main = () => {
  document.querySelector("#tabTopics7 > a").click();
}