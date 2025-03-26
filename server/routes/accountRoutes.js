const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { createNewAccount, getUserAccounts, updateUserAccount, deleteAccount } = require("../controllers/accountController");

const accountRouter = express.Router();

// accountRouter.get("/total-transactions", auth, getAllUserTransactions)
accountRouter.get("/all", auth, getUserAccounts)
accountRouter.post("/create", auth, createNewAccount);
accountRouter.patch("/update", auth, updateUserAccount);
accountRouter.delete("/delete", auth, deleteAccount);

module.exports = {
    accountRouter
}