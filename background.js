import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const host = "localhost:8080";

const socket = io("ws://" + host);

socket.on('connect', () => {
  console.log('connected');
});
