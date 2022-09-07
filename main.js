const host = "192.168.11.6:3333";

// function
const setUUID = async () => {
  const res = await axios.get("http://" + host + "/uuid");
  chrome.storage.sync.set({ uuid: res.data.uuid });
};

const getUUID = async () => {
  const uuid = await chrome.storage.sync.get("uuid");
  return uuid.uuid;
};

const socket = io.connect("http://" + host);
socket.on("connect", () => {
  console.log("socket connected");
});

socket.on("event", (value) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (value === "next") {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          document
            .querySelector(
              "#react-page > div > div > div.prototype--documentationContainer--JPUjj > div > div.prototype--content--fG_eb > div.prototype--contentMiddle--2lFG_ > div.prototype--footerContainer--1oDS_ > div > div.footer--frameCounterContainer__OLD--rJtYh > div > button:nth-child(3)"
            )
            .click();
        },
      });
    }
    if (value === "prev") {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          document
            .querySelector(
              "#react-page > div > div > div.prototype--documentationContainer--JPUjj > div > div.prototype--content--fG_eb > div.prototype--contentMiddle--2lFG_ > div.prototype--footerContainer--1oDS_ > div > div.footer--frameCounterContainer__OLD--rJtYh > div > button:nth-child(1)"
            )
            .click();
        },
      });
    }
  });
});

const start = async () => {
  await setUUID();
  const uuid = await getUUID();
  const link = "http://" + host + "/room/" + uuid;

  document.getElementById("qrcode").innerHTML = "";
  new QRCode(document.getElementById("qrcode"), {
    text: link,
    width: 128,
    height: 128,
    colorDark: "#ffffff",
    colorLight: "#000000",
    correctLevel: QRCode.CorrectLevel.H,
  });

  // add input
  document.getElementById("uuid").innerHTML =
    "<input type='text' value='" +
    link +
    "' readonly> <button id='copy'>Copy text</button>";
  document.getElementById("copy").addEventListener("click", () => {
    const copyText = document.querySelector("input");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
  });
  await socket.emit("join", uuid);
};

// event
button.addEventListener("click", async () => await start());
