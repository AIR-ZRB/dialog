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
    console.log(data);
    res.end(JSON.stringify(data));  
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
