const host = "localhost:8080";
const socket = io.connect("http://" + host);

socket.on("connect", () => {
  console.log("socket connected");
});

socket.on("event", (value) => {
  console.log(value);
});

// 関数
const setUUID = async () => {
  const res = await axios.get("http://" + host + "/uuid");
  chrome.storage.sync.set({uuid: res.data.uuid});
}

const getUUID = async () => {
  const uuid = await chrome.storage.sync.get("uuid");
  return uuid.uuid;
}

const start = async () => {
  const uuid = await getUUID();
  console.log(uuid);
  await socket.emit("join", uuid);
}

const stop = async () => {
  const uuid = await getUUID();
  socket.leave(uuid);
}

// イベント
button.addEventListener("click", async () => start());
