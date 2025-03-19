const mongoose = require("mongoose");

const currencySchema = mongoose.Schema({
    baseCurrency: {type: String, default: "INR"},
    rates: {type: String, default: "INR"},
    date: {type: Date, default: Date.now(), index: true},
}, {
    versionKey: false
})