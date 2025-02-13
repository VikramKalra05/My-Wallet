const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    title: { type: String, required: true, max: 250}, // required
    description: { type: String, default: "" },
    amount: { type: Number, required: true }, // required
    date: { type: Date, required: true }, // required
    type: {
      typeName: { type: String },
      id: { type: Number, required: true }, // required
    },
    status: { type: String },
    payee: { type: String, default: "" },
    label: { type: String, default: "" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }, // required
    category: { 
      categoryName: { type: String },
      id: { type: Number, required: true }, //required
      subCategory: {
        subCategoryName: { type: String },
        id: { type: Number },
      },
    },
  },
  {
    versionKey: false,
  }
);

const TransactionModel = mongoose.model("transaction", transactionSchema);

module.exports = {
  TransactionModel,
};

//tokens, expenses, blacklist
