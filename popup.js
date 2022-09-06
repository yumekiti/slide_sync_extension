const host = "localhost:8080";
const socket = io.connect("http://" + host);

socket.on("connect", () => {
  console.log("socket connected");
});

socket.on("welcome", (value) => {
  console.log(value);
});

// イベント
buttonSet.addEventListener("click", async () => {
  console.log("button clicked");
  const uuid = await getUuid();
  chrome.storage.sync.set({uuid: uuid});
});

const getUuid = async () => {
  const res = await axios.get("http://" + host + "/uuid");
  return res.data.uuid;
}

buttonGet.addEventListener("click", async () => {
  chrome.storage.sync.get(["uuid"], (result) => {
    const uuid = result.uuid
    socket.emit("join", uuid);
  });
});
