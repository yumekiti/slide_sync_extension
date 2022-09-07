// slide
const next = async () => {
  await document.querySelector("#tabTopics2 > a").click();
};

// socket
const host = "localhost:8080";
const socket = io.connect("http://" + host);

socket.on("connect", () => {
  console.log("socket connected");
});

socket.on("event", async (value) => {
  console.log(value);
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: next,
  });
});

// function
const setUUID = async () => {
  const res = await axios.get("http://" + host + "/uuid");
  chrome.storage.sync.set({uuid: res.data.uuid});
}

const getUUID = async () => {
  const uuid = await chrome.storage.sync.get("uuid");
  return uuid.uuid;
}

const start = async () => {
  await setUUID();
  const uuid = await getUUID();
  document.getElementById("uuid").textContent = uuid;
  await socket.emit("join", uuid);
}

// event
button.addEventListener("click", async () => {
  await start()
  await chrome.runtime.sendMessage({ type: "start" });
});
