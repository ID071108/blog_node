/**
 * created by Stephen on 2018/5/3
*/

var mongoose = require("mongoose");

var CategoriesSchema = require("../schemas/Categories");

module.exports = mongoose.model("Category", CategoriesSchema);