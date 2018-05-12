/**
 * created by shuwang on 2018/4/24
 */

var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Category = require("../models/Category");
var Content = require("../models/Content");

var responseData;

router.use(function (req, res, next) {
    next();
});

router.get("/", function (req, res, next) {
    res.render("admin/index", {
        username: req.userInfo.username
    });
});

/**
 * 用户管理
 * @api find() 从数据库读取部数据，不指定参数读取全部的数据
 * limit(number) 限制获取数据的条数
 * skip 忽略数据的条数
 * sort({_id: -1}) 根据传入的参数进行排序，1为升序-1为降序
 * */
router.get("/user", function (req, res, next) {
    // 计算总的条数
    User.count().then(function (count) {
        var page = parseInt(req.query.page) || 1;
        var pageSize = parseInt(req.query.pageSize) || 10
        // 总页数数组数组形式
        var pagesArr = [];
        // 计算总页数
        var pages = Math.ceil(count / pageSize);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * pageSize;
        for (let i = 0; i < pages; i++) {
            pagesArr.push(i);
        }
        // 根据指定页数与每页显示的条数展示数据
        User.find().sort({ _id: -1 }).limit(pageSize).skip(skip).then(function (users) {
            res.render("admin/user_index", {
                userInfo: req.userInfo,
                users: users,
                count: count,
                page: page,
                pages: pages,
                pageSize: pageSize,
                pagesArr: pagesArr
            });
        });
    });
});

/**
 * 分类首页
 * */
router.get("/category", function (req, res, next) {
    Category.count().then(function (count) {
        /**
     * 从数据库读取全部数据
     * limit(number) 限制获取数据的条数
     * skip 忽略数据的条数
     * */
        var page = parseInt(req.query.page) || 1;
        var pageSize = parseInt(req.query.pageSize) || 10;
        // 总页数数组数组形式
        var pagesArr = []
        // 计算总页数
        var pages = Math.ceil(count / pageSize);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * pageSize;
        for (let i = 0; i < pages; i++) {
            pagesArr.push(i);
        }
        // 根据指定页数与每页显示的条数展示数据
        Category.find().sort({ _id: -1 }).limit(pageSize).skip(skip).then(function (types) {
            res.render("admin/category_index", {
                userInfo: req.userInfo,
                types: types,
                count: count,
                page: page,
                pages: pages,
                pageSize: pageSize,
                pagesArr: pagesArr
            });
        });
    }).catch(function (err) {
        console.log(err);
    });
});

/**
 * 添加分类
 * */
router.get("/category/add", function (req, res, next) {
    res.render("admin/category_add", {
        userInfo: req.userInfo
    });
});
// 保存分类信息
router.post("/category/add", function (req, res, next) {
    var type = req.body.type || '';
    Category.findOne({
        type: type
    }).then(function (typeInfo) {
        // 如果存在表示数据库中存在相同的记录
        if (typeInfo) {
            responseData.message = "当前类别已经存在";
            res.json(responseData);
            return;
        }
        // 保存到数据库
        let category = new Category({
            type: type
        });
        return category.save();

    }).then(function (typeObj) {
        responseData = {
            code: 1,
            message: "添加分类成功"
        }
        res.json(responseData);
    }).catch(function (err) {
        console.log(err)
    });
});

/**
 * 分类编辑 - 修改
*/
router.get("/category/edit", function (req, res, next) {
    var id = req.query.id;
    Category.findOne({
        _id: id
    }).then(function (result) {
        if (result) {
            res.json({
                code: 1,
                data: result
            });
            return;
        }
        else {
            res.json({
                code: 0,
                data: result
            });
            return;
        }
    }).catch(function (err) {
        console.log(err);
    });
});

/**
 * 分类编辑 - 保存
*/
router.post("/category/edit", function (req, res, next) {
    var id = req.body.id;
    var type = req.body.type;
    Category.findOne({
        // 查询当前数据库之中： 不为当前id && type不与将要修改的值相同的记录
        _id: { $ne: id },
        type: type
    }).then(function (result) {
        // 如果存在相同的记录
        if (result) {
            res.json({
                code: 0,
                message: "修改失败，已存在相同类别名称"
            });
            return;
        }
        else {
            Category.update({
                _id: id
            }, {
                    type: type
                }).then(function (updated) {
                    if (updated) {
                        res.json({
                            code: 1,
                            message: "修改成功"
                        });
                    }
                    else {
                        res.json({
                            code: 0,
                            message: "修改失败，请重试"
                        });
                    }
                    return;
                });
        }
    })
});
/**
 * 分类编辑 - 删除
*/
router.get("/category/delete", function (req, res, next) {
    var id = req.query.id;
    Category.remove({
        _id: id,

    }).then(function (result) {
        // 如果存在相同的记录
        if (result) {
            res.json({
                code: 1,
                message: "删除成功"
            });
            return;
        }
        else {
            res.json({
                code: 0,
                message: "删除失败"
            });

            return;
        }
    })
});

/**
 * 分类编辑 - 保存
*/
router.post("/category/edit", function (req, res, next) {
    var id = req.body.id;
    var type = req.body.type;
    Category.findOne({
        // 查询当前数据库之中： 不为当前id && type不与将要修改的值相同的记录
        _id: { $ne: id },
        type: type
    }).then(function (result) {
        // 如果存在相同的记录
        if (result) {
            res.json({
                code: 0,
                message: "修改失败，已存在相同类别名称"
            });
            return;
        }
        else {
            Category.update({
                _id: id
            }, {
                    type: type
                }).then(function (updated) {
                    if (updated) {
                        res.json({
                            code: 1,
                            message: "修改成功"
                        });
                    }
                    else {
                        res.json({
                            code: 0,
                            message: "修改失败，请重试"
                        });
                    }
                    return;
                });
        }
    })
});
/**
 * 内容管理模块*******内容管理模块*******内容管理模块****内容管理模块******内容管理模块********内容管理模块********
*/
// 读取内容列表
router.get("/content", function (req, res, next) {
    Content.count().then(function (count) {
        /**
     * 从数据库读取全部数据
     * limit(number) 限制获取数据的条数
     * skip 忽略数据的条数
     * */
        var page = parseInt(req.query.page) || 1;
        var pageSize = parseInt(req.query.pageSize) || 10
        // 总页数数组数组形式
        var pagesArr = []
        // 计算总页数
        var pages = Math.ceil(count / pageSize);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * pageSize;
        for (let i = 0; i < pages; i++) {
            pagesArr.push(i);
        }
        // 根据指定页数与每页显示的条数展示数据
        Content.find().sort({ _id: -1 }).limit(pageSize).skip(skip).populate("type").populate("user").then(function (contents) {
            res.render("admin/content_index", {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                page: page,
                pages: pages,
                pageSize: pageSize,
                pagesArr: pagesArr
            });
        });
    }).catch(function (err) {
        console.log(err);
    });
});
// 跳转到添加内容页
router.get("/content/add", function (req, res, next) {
    var _categories = [];
    Category.find().sort({ _id: -1 }).then(function (categories) {
        if (categories) {
            _categories = categories;
        }
        else {
            _categories.push({
                type: "类别不存在或者读取失败"
            });
        }
        res.render("admin/content_add", {
            userInfo: req.userInfo,
            categories: _categories
        });
    });
});
// 保存内容
router.post("/content/add", function (req, res, next) {
    new Content({
        type: req.body.type,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        descript: req.body.descript,
        content: req.body.content
    }).save().then(function (success) {
        if (success) {
            res.json({
                code: 1,
                message: "内容保存成功"
            });
        }
        else {
            res.json({
                code: 0,
                message: "内容保存失败"
            });
        }
    }).catch(function (e) {

    });
});
// 内容编辑 - 修改
router.get("/content/edit", function (req, res, next) {
    var id = req.query.id;
    var _categories = [];
    Category.find().sort({ _id: -1 }).then(function (categories) {
        if (categories) {
            _categories = categories;
        }
        else {
            _categories.push({
                type: "类别不存在或者读取失败"
            });
        }
        return Content.findOne({
            _id: id
        }).populate("type");
    }).then(function (result) {
        console.log(result, "resultresultresult");
        if (result) {
            res.render("admin/content_edit", {
                userInfo: req.userInfo,
                categories: _categories,
                type: result.type,
                title: result.title,
                descript: result.descript,
                content: result.content,
                id: result._id
            });
            return;
        }
        else {
            res.render("admin/content_edit", {
                userInfo: req.userInfo,
                categories: _categories,
                type: "读取失败",
                title: "读取失败",
                descript: "读取失败",
                content: "读取失败",
            });
            return;
        }
    }).catch(function (err) {
        console.log(err);
    });
});

/**
 * 内容编辑 - 保存
*/
router.post("/content/edit", function (req, res, next) {
    Content.update({
        _id: req.body.id
    }, {
            type: req.body.type,
            title: req.body.title,
            descript: req.body.descript,
            content: req.body.content
        }).then(function (updated) {
            if (updated) {
                res.json({
                    code: 1,
                    message: "修改成功"
                });
            }
            else {
                res.json({
                    code: 0,
                    message: "修改失败，请重试"
                });
            }
            return;
        });
});
/**
 * 内容编辑 - 删除
*/
router.get("/content/delete", function (req, res, next) {
    Content.remove({
        _id: req.query.id,
    }).then(function (result) {
        // 如果存在相同的记录
        if (result) {
            res.json({
                code: 1,
                message: "删除成功"
            });
            return;
        }
        else {
            res.json({
                code: 0,
                message: "删除失败"
            });
            return;
        }
    })
});

module.exports = router;