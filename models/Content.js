/**
 * created by Stephen on 2018/5/5
*/

var mongoose = require("mongoose");

var ContentSchema = require("../schemas/Content");

module.exports = mongoose.model("Content", ContentSchema);