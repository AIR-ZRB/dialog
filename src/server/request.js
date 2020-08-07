const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

const mailTransport = nodemailer.createTransport({
    host: "mail.qq.com",
    service: "QQ",
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth: {
        user: "1824735904@qq.com",
        pass: "",
    },
});
let verificationCode = 0;

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
    // 如果验证码不正确
    const data = await _readFile(accountFile);
    if (req.body.verificationCode != verificationCode ) {
        res.end("false");
        return;
    }

    let flag = data.some((item)=>{
        return item.id == req.body.id;
    })

    if(flag.length !=0 ){
        res.end("false");
        return;
    }
  

    res.end("true");
    console.log(data)
    // 信息添加，后期可修改
    req.body.picture =
        "https://pic1.zhimg.com/80/v2-0d3a635ba2703360e0aac4afc71e91b2_720w.jpg";
    req.body.sex = "男";
    // ------
    data.push({ ...req.body });
    _writeFile(accountFile, data);
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
    signInData.length != 0 ? res.end("true") : res.end("false");
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
    console.log(req.url);
    res.sendFile(
        __dirname + "/uploads/images/" + fileName[fileName.length - 1]
    );
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

// 发送邮件验证码
router.post("/sendEmail", function(req, res, next) {
    verificationCode = Math.random() * 1000000;
    verificationCode = parseInt(verificationCode);

    var options = {
        from: "1824735904@qq.com",
        to: req.body.id,
        subject: "一封来自Air Dialog的邮件",
        text: `亲爱的用户，这是你的验证码：${verificationCode}`,
    };
    mailTransport.sendMail(options, function(err, msg) {
        if (err) throw err;
        console.log(msg);
        res.render("index", { title: "已接收：" + msg.accepted });
    });
});

module.exports = router;
