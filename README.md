# dialog

仿照Tim的设计来写的一个在线聊天系统

使用Vue作为主框架来使用

使用NodeJS来作为服务端交互(src/server/server.js)


    
## 使用框架

+ vue
+ koa或者express都可以
+ ws

## 要点

1. 首先通过`ws.Server`创建`WebSocketServer`构造函数
2. `new WebSocketServer`里指定的`server`是监听的端口
3. 通过`WebSocketServer`创建的实例，监听`connection`事件来连接,回调函数里有`ws`参数
4. 通过监听`ws`里的`message`来拿到前端返回的数据


+ 服务端具体代码：

```javascript
const Koa = require("koa");
const ws = require("ws");
const app = new Koa();

let server = app.listen(3000, () => {
    console.log("running...")
});

let WebSocketServer = ws.Server;
let wss = new WebSocketServer({
    server: server
})

wss.broadcast = function (data) {
    wss.clients.forEach(function (client) {
        client.send(data);
    });
};

wss.on("connection", function (ws) {
    ws.wss = wss;
    ws.on('message', function (message) {
        console.log(message);
        this.wss.broadcast(message);
    });

})

```

+ 客户端具体代码：

```javascript
 methods: {
        outputMessage() {
            var ws = new WebSocket("ws://localhost:3000/ws/chat");
            let _this = this;
            ws.onopen = () => {
                // 点击发送按钮，将文本框的信息发送服务端
                ws.send(_this.data);
            };
            // this.webSocket();
        },
        webSocket() {
            var ws = new WebSocket("ws://localhost:3000/ws/chat");
            let _this = this;
            // ws.onopen = () => {
            //     // 点击发送按钮，将文本框的信息发送服务端
            //     ws.send(_this.data);
            // };
            ws.onmessage = function(event) {
                console.log(event);
                _this.message.push(event.data);
            };
        }
    },
    mounted() {
        this.webSocket();
    }

```





