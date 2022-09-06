const host = "localhost:8080";
const socket = io.connect("http://" + host);

socket.on("connect", () => {
  console.log("socket connected");
});

socket.on("event", (value) => {
  console.log(value);
});

buttonJoin.addEventListener("click", async () => {
  const uuid = document.getElementById("uuid").value;
  await socket.emit("join", uuid);
})

buttonEvent.addEventListener("click", async () => {
  const uuid = document.getElementById("uuid").value;
  const event = document.getElementById("event").value;
  data = {
    uuid: uuid,
    event: event
  }
  await socket.emit("event", data);
})