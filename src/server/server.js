const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const http = require("http");

// 解析POST请求
const bodyParser = require('body-parser');/*post方法*/
app.use(bodyParser.json());// 添加json解析
app.use(bodyParser.urlencoded({ extended: false }));

// 跨域设置
let allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
};
app.use(allowCrossDomain);

let _readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(JSON.parse(data))
            }
        })
    })
}

let _writeFile = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data), "utf8", (err) => {
            if (err) {
                reject(err)
            } else {
                resolve("写入成功")
            }
        })
    })
}




const accountData = path.join(__dirname, "accountData.json");
app.post("/register", (req, res) => {
    _readFile(accountData)
        .then((data) => {
            let newData = data
            newData.push({ ...req.body })
            _writeFile(accountData, newData)
        })
        .then(() => {
            res.redirect("http://localhost:8080/#/index")
        })
})

app.post("/signIn", (req, res) => {
    let signInData = "";
    _readFile(accountData)
        .then((data) => {
            signInData = data.filter(element => {
                return element["password"] == req.body["password"] && element["id"] == req.body["id"]
            });
        })
        .then(() => {
            if (signInData.length != 0) {
                res.redirect("http://localhost:8080/#/index")
            } else {
                res.redirect("http://localhost:8080/#/register")
            }
        })
})


// 聊天的数据
const dialogData = path.join(__dirname, "dialogData.json");
app.get("/dialogData", (req, res) => {
    _readFile(dialogData)
        .then((data) => {
            res.end(JSON.stringify(data));
        })
})


let wsServer = app.listen(3000, () => {
    console.log("running...")
})



// webSocket部分
let WebSocketServer = require('ws').Server
let wss = new WebSocketServer({
    server: wsServer
});
let i = 0;

wss.broadcast = function (data) {
    wss.clients.forEach(function (client) {
        client.send(data);
    });
};

wss.on('connection', function (ws) {
    console.log(`[SERVER] connection()`);

    // 形参message是从前端接收过来的，前端接收的是什么返回的就是什么
    ws.on('message', function (message) {
        let mess = JSON.parse(message);

        console.log(message)


        // 这里优化，不应该每次都写入
        // 每次写入会导致消息有时不会同步
        // _readFile(dialogData)
        //     .then((data) => {
        //         let addCurrentData = data.filter(item => item.groupName === mess.groupName);
        //         let addIndex = 0;
                
        //         data.forEach((item, index) => {
        //             if (item.groupName === mess.groupName) {
        //                 addIndex = index;
        //             }
        //         })

        //         delete mess.groupName;
        //         data[addIndex].data.push(mess);
                

        //         console.log(data);


        //         return data;
        //     })
        //     .then((data) => {
        //         // _writeFile(dialogData, data)
        //     })


        // 这里是返回给前端的数据
        wss.broadcast(message);










    })









});


