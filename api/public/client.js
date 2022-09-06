const host = "localhost:8080";
const socket = io.connect("http://" + host);

socket.on("connect", () => {
  console.log("socket connected");
});

socket.on("welcome", (value) => {
  console.log(value);
});

button.addEventListener("click", async () => {
  const input = document.getElementById("input").value;
  socket.emit("join", input);
})