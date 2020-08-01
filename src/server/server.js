const express = require("express");
const app = express();
const router = require("./request");

// 解析POST请求
const bodyParser = require("body-parser"); /*post方法*/
const { RSA_NO_PADDING } = require("constants");
const { cpuUsage } = require("process");
const { isRegExp } = require("util");
app.use(bodyParser.json()); // 添加json解析
app.use(bodyParser.urlencoded({ extended: false }));

// 跨域设置
let allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
};
app.use(allowCrossDomain);
app.use("/",router);



// webSocket部分
let wsServer = app.listen(3000, () => {
    console.log("running...");
});

let WebSocketServer = require("ws").Server;
let wss = new WebSocketServer({
    server: wsServer,
});
let i = 0;

wss.broadcast = function(data) {
    wss.clients.forEach(function(client) {
        client.send(data);
    });
};

wss.on("connection", function(ws) {
    console.log(`[SERVER] connection()`);

    // 形参message是从前端接收过来的，前端接收的是什么返回的就是什么
    ws.on("message", function(message) {
        wss.broadcast(message);
    });
});