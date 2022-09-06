// モジュール読み込み
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const shortid = require('shortid');

// サーバーポートの指定
const PORT = process.env.PORT || 8080;

// cors
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}
app.use(allowCrossDomain)

// uuid を返す
app.get("/uuid", (req, res) => {
  res.json({uuid: shortid.generate()});
});

// 双方向通信開始
io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on('join', (value) => {
    socket.emit('welcome', value);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

// サーバーの実行
http.listen(PORT, () => {
  console.log("server listening. Port:" + PORT);
});