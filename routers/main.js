/**
 * created by shuwang on 2018/4/24
*/

var express = require("express");
var router = express.Router();
var Category = require("../models/Category");
var Content = require("../models/Content");
let Types = '';

router.get("/", function (req, res, next) {
    var data = {
        userInfo: req.userInfo,
        categories: [],

        page: Number(req.query.page || 1),
        limit: 10,
        pages: 0
    }
    Category.find().limit(6).then(function (categories) {
        data.categories = categories;
        Content.count().then(function (count) {
            /**
             * 从数据库读取全部数据
             * limit(number) 限制获取数据的条数
             * skip 忽略数据的条数
             * */
            var page = parseInt(data.page) || 1;
            // 总页数数组数组形式
            var pagesArr = []
            // 计算总页数
            data.pages = Math.ceil(count / data.limit);
            page = Math.min(page, data.pages);
            page = Math.max(page, 1);
            var skip = (page - 1) * data.limit;
            for (let i = 0; i < data.pages; i++) {
                pagesArr.push(i);
            }
            data.pagesArr = pagesArr;
            // 根据指定页数与每页显示的条数展示数据
            Content.find().sort({ _id: -1 }).limit(data.limit).skip(skip).populate(["type", "user"]).then(function (contents) {
                data.contents = contents;
                res.render("main/index", data);
            });
        }).catch(function (err) {
            console.log(err);
        });
    }).catch(function (err) {
        console.log(err);
    });

})

module.exports = router