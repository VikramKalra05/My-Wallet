const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const blacklistSchema = mongoose.Schema({
    token: {type: String, required: true}
}, {
    versionKey: false
})

const BlacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = {
    BlacklistModel
}