const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Promise封装读取函数
let _readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
        });
    });
};

// Promise封装写入函数
let _writeFile = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data), "utf8", (err) => {
            if (err) reject(err);
            resolve("写入成功");
        });
    });
};

// 账号信息文件
const accountFile = path.join(__dirname, "accountData.json");
// 聊天数据文件
const dialogFile = path.join(__dirname, "dialogData.json");

//注册模块
router.post("/register", async (req, res) => {
    const data = await _readFile(accountFile);
    data.push({ ...req.body });
    _writeFile(accountFile, data);
    res.redirect("http://localhost:8080/#/index/dialog");
});

// 登录模块
router.post("/signIn", async (req, res) => {
    const data = await _readFile(accountFile);
    const password = req.body["password"];
    const username = req.body["id"];
    let signInData = data.filter((item) => {
        return item["password"] == password && item["id"] == username;
    });

    // 手动跳转
    if (signInData.length != 0) {
        res.redirect("http://localhost:8080/#/index/dialog");
    } else {
        res.redirect("http://localhost:8080/#/register");
    }
});

// 获取当前用户数据
router.get("/getUser", async (req, res) => {
    const data = await _readFile(accountFile);
    res.end(JSON.stringify(data));
});

// 获取聊天的数据
router.get("/getDialogData", async (req, res) => {
    const data = await _readFile(dialogFile);
    res.end(JSON.stringify(data));
});

// 上传图片接口
router.post("/pictureUpload/*", (req, res) => {
    const filePath = "./uploads/images/" + req.body.fileName; //路径从app.js级开始找--
    const base64 = req.body.body.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
    const dataBuffer = new Buffer(base64, "base64"); //把base64码转成buffer对象，
    fs.writeFile(filePath, dataBuffer, function(err) {
        if (err) throw err;
        console.log("图片上传成功");
    });
});

// 获取服务器上的所有图片
router.get("/getPictureUrl", (req, res) => {
    const dirPath = path.resolve(__dirname, "uploads", "images");
    fs.readdir(dirPath, (err, data) => {
        res.end(JSON.stringify(data));
    });
});

// 获取图片准确地址
router.get("/getPicture/*", (req, res) => {
    const fileName = req.url.split("/");
    console.log(req.url)
    res.sendFile(__dirname + "/uploads/images/" + fileName[fileName.length - 1]);
});

// 上传文件接口
router.post("/fileUpload/*", (req, res) => {
    const filePath = "./uploads/files/" + req.body.fileName; //路径从app.js级开始找--
    const base64 = req.body.body.replace(/^data:+.\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
    const dataBuffer = new Buffer(req.body.body, "base64"); //把base64码转成buffer对象，
    fs.writeFile(filePath, dataBuffer, function(err) {
        if (err) throw err;
        console.log("文件上传成功");
    });
});

// 当前在线
let currentOnLine = [];
router.post("/getCurrentOnLine", (req, res) => {
    console.log(req.body);
    let flag = currentOnLine.some((item) => {
        return item.name === req.body.name;
    });
    flag || currentOnLine.push(req.body);
    res.end(JSON.stringify(currentOnLine));
});

module.exports = router;
