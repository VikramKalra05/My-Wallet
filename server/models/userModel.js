const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    googleId: {type: String, sparse: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: false},
    phone: {type: Number},
    photo: {type: String},
},{
    versionKey: false
})

const UserModel = mongoose.model("user", userSchema);

module.exports = {
    UserModel
}

//tokens, expenses, blacklist