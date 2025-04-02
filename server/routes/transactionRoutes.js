const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { createTransaction, getTotalTransactions, deleteTransaction, getAllTransactions, getAllUserTransactions, updateTransaction } = require("../controllers/transactionController");

const transactionRouter = express.Router();

transactionRouter.get("/total-transactions", auth, getAllUserTransactions)
transactionRouter.get("/all", auth, getAllTransactions)
transactionRouter.post("/create", auth, createTransaction);
transactionRouter.delete("/delete", auth, deleteTransaction);
transactionRouter.patch("/update", auth, updateTransaction);
// transactionRouter.get("/categories", auth, getCategories);

module.exports = {
    transactionRouter
}