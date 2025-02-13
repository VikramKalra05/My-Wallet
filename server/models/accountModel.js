const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
    accountName: {type: String, required: true},
    // color: {type: String},
    balance: {type: Number, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true}
},{
    versionKey: false
})

const AccountModel = mongoose.model("account", accountSchema);

module.exports = {
    AccountModel
}
