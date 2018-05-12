/**
 * created by shuwang on 2018/4/24
*/
// 加载express模块
var express = require("express");
// 创建app应用
var app = express();
// 加载数据库模块
var mongoose = require("mongoose");
// 加载body-parser用户提交过来的数据
var bodyParser = require("body-parser");
// 加载cookies模块
var Cookies = require("cookies");
// 加载用户模块
var User = require("./models/User");
// 加载模版处理模块
var swig = require("swig");
// 在开发过程中需要取消模版缓存
swig.setDefaults({
    cache: false
});
app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);
    let userInfo = req.cookies.get("userInfo");
    req.userInfo = {};
    if (userInfo) {
        try {
            req.userInfo = JSON.parse(userInfo);
            // 获取当前登录用户的信息
            User.findById(userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            }).catch(function(e){
                console.log(e);
                // next();
            });
        } catch (e) {
            next();
        }
    }
    next();
});
// 设置静态文件托管
// 当用户返回的路径是/public直接返回public目录下的文件
app.use("/public", express.static(__dirname + "/public"))
// 添加bodyparser中间件
app.use(bodyParser.urlencoded({ extended: true }));

/* 配置应用模版
 * 定义当前应用使用的模版引擎
 * 第一个参数：模版引擎的名称，同时也是模版文件的后缀，第二个参数表示用于解析处理模版内容的方法
*/
app.engine("html", swig.renderFile)
// 这是设置模版文件存放的目录，第一个参数必须使views。第二个是目录
app.set("views", "./views")
// 注册所使用的模版引擎，第一个参数必须是view engine，第二个参数和app.engine一致
app.set("view engine", "html")

// 根据不同的功能划分模块
app.use("/admin", require("./routers/admin"))
app.use("/api", require("./routers/api"))
app.use("/", require("./routers/main"))

// 监听http请求
mongoose.connect("mongodb://localhost:27018/blog", function (err) {
    if (err) {
        console.log("数据库连接失败")
    } else {
        console.log("数据库连接成功")
        app.listen(8081)
    }
})