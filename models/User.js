/**
 * created by Stephen on 2018/4/24
*/

var mongoose = require("mongoose")

var usersSchema = require("../schemas/User")

module.exports = mongoose.model("User", usersSchema)