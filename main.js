const host = "localhost:8080";

// function
const setUUID = async () => {
  const res = await axios.get("http://" + host + "/uuid");
  chrome.storage.sync.set({uuid: res.data.uuid});
}

const getUUID = async () => {
  const uuid = await chrome.storage.sync.get("uuid");
  return uuid.uuid;
}

const socket = io.connect("http://" + host);
socket.on("connect", () => {
  console.log("socket connected");
});

socket.on("event",  (value) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if(value === "test") {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          document.querySelector("#tabTopics2 > a").click();
        },
      });
    }
  });
});

const start = async () => {
  await setUUID();
  const uuid = await getUUID();

  document.getElementById("uuid").textContent = uuid;
  await socket.emit("join", uuid);
};

// event
button.addEventListener("click", async () => await start());