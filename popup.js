const host = "localhost:8080";

// イベント
buttonSet.addEventListener("click", async () => {
  console.log("button clicked");
  const uuid = await getUuid();
  chrome.storage.sync.set({uuid: uuid})
});

const getUuid = async () => {
  const res = await axios.get("http://" + host + "/uuid");
  return res.data.uuid;
}

buttonGet.addEventListener("click", async () => {
  chrome.storage.sync.get(["uuid"], (result) => {
    console.log(result.uuid);
  });
});