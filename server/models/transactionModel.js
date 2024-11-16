const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    amount: {type: Number, required: true},
    date: {type: Date, required: true},
    type: {
        typeName: {type: String},
        id: {type: Number, required: true}    
    },
    status: {type: String},
    payee: {type: String},
    label: {type: String},
    userId: {type: id},
    category: {
        categoryName: {type: String},
        id: {type: Number, required: true}    
    },
},{
    versionKey: false
})

const TranctionModel = mongoose.model("transaction", transactionSchema);

module.exports = {
    TranctionModel
}

//tokens, expenses, blacklist