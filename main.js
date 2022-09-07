const host = "localhost:8080";
let socket

// function
const setUUID = async () => {
  const res = await axios.get("http://" + host + "/uuid");
  chrome.storage.sync.set({uuid: res.data.uuid});
}

const getUUID = async () => {
  const uuid = await chrome.storage.sync.get("uuid");
  return uuid.uuid;
}

socket = io.connect("http://" + host);
socket.on("connect", () => {
  console.log("socket connected");
});

socket.on("event",  (value) => {
  // send backgroud.js
  chrome.runtime.sendMessage({type: "event", value: value});
});

const start = async () => {
  await setUUID();
  const uuid = await getUUID();

  document.getElementById("uuid").textContent = uuid;
  await socket.emit("join", uuid);
};

// event
button.addEventListener("click", async () => await start());