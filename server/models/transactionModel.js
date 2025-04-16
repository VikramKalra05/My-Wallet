const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    amount: { type: Number, required: true }, // required
    date: { type: Date, required: true }, // required
    type: {
      typeName: { type: String },
      id: { type: Number, required: true }, // required
    },
    status: { type: String, default: "Cleared" },
    paymentType: { type: String, default: "" },
    payee: { type: String, default: "" },
    note: { type: String, default: "" },
    label: { type: String, default: "" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }, // required
    account: {
      accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
      },
      accountName: { type: String },
    },
    category: { 
      categoryName: { type: String },
      id: { type: mongoose.Types.ObjectId, required: true }, //required
      subCategory: {
        subCategoryName: { type: String },
        id: { type: mongoose.Types.ObjectId },
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