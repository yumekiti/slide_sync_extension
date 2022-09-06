// モジュール読み込み
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const shortid = require('shortid');

// サーバーポートの指定
const PORT = process.env.PORT || 8080;

// cors
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  next()
}
app.use(allowCrossDomain)

// uuid を返す
app.get("/uuid", (req, res) => {
  // uuid を生成
  const uuid = shortid.generate();
  // uuid を json で返す
  res.json({ uuid: uuid });
});

// 双方向通信開始
io.on("connection", (socket) => {
  socket.on('join', (value) => {
    socket.broadcast.emit('welcome', value);
  });
});

// サーバーの実行
http.listen(PORT, () => {
  console.log("server listening. Port:" + PORT);
});