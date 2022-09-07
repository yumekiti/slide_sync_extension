// function
const start = async () => {
  console.log("start");
};

// event
chrome.runtime.onMessage.addListener( async (request, sender, sendResponse) => {
  if (request.type === "start") {
    await start();
  }
});