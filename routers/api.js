/**
 * created by shuwang on 2018/4/24
*/

var express = require("express");
var router = express.Router();
var User = require("../models/User");
//统一返回数据格式
var responseData;
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ""
    }
    next()
})

router.get("/user-admin", function (req, res, next) {
    res.send("User admin")
})
/**
 * 注册用户操作
*/
router.post("/user/register", function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let password_confirm = req.body.password_confirm;
    User.findOne({
        username: username
    }).then(function (userInfo) {
        // 如果存在表示数据库中存在相同的记录
        if (userInfo) {
            responseData.message = "当前用户名已经被使用";
            res.json(responseData);
            return;
        }
        // 保存到数据库
        let user = new User({
            username: username,
            password: password,
            isAdmin: false
        });
        return user.save();

    }).then(function (newUserInfo) {
        responseData = {
            code: 1,
            message: "注册成功"
        }
        res.json(responseData);
    }).catch(function (err) {
        console.log(err)
    });

});

/**
 * 登录操作
*/
router.post("/user/signin", function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        // 如果存在表示数据库中存在相同的记录
        if (!userInfo) {
            responseData.message = "用户名或密码错误";
            res.json(responseData);
            return;
        }
        responseData = {
            code: 1,
            messgae: "登录成功",
            username: userInfo.username,
            isAdmin: userInfo.isAdmin
        }
        req.cookies.set("userInfo", JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username,
            password: userInfo.password,
            isAdmin: userInfo.isAdmin
        }));
        console.log(responseData, "responseDataresponseDataresponseDataresponseDataresponseDataresponseData");
        res.json(responseData);
    })
});

/**
 * 退出
*/
router.get("/user/signout", function (req, res, next) {
    req.cookies.set("userInfo", JSON.stringify({}));
    responseData.code = 1;
    res.json(responseData);
});

module.exports = router;