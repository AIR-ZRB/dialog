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


## 组件

为了组件能有良好的复用性，很多东西是不能写死的

+ editGroup组件往外暴露了一个方法，提交时可以根据是创建还是修改了实现不同的业务


## 问题


如果你出现了`GET http://localhost..... net::ERR_CONNECTION_REFUSED`的情况
可以重启一下项目`npm run dev`或者`npm run serve`具体查看`package.json`的`script`

出现这个问题的原因是因为你切换无线网络，导致开发服务器的IP地址换了，这样开发服务器会不知道如何确定访问源。


## 最后


吐槽一下，ElementUI这个库不是很好用






