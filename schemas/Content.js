/**
 * created by shuwang on 2018/5/5
*/
var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    // 关联字段-内容分类的id
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    // 关联字段-内容分类的id
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // 内容标题
    title: {
        type: String,
    },
    // 内容
    descript: {
        type: String,
        default: ""
    },
    // 内容
    content: {
        type: String,
        default: ""
    },
    // 添加时间
    addTime: {
        type: Date,
        default: new Date()
    },
    // 阅读量
    views: {
        type: Number,
        default: 0
    }
});