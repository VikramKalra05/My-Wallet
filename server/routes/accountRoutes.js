const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { createNewAccount, getUserAccounts } = require("../controllers/accountController");

const accountRouter = express.Router();

// accountRouter.get("/total-transactions", auth, getAllUserTransactions)
accountRouter.get("/all", auth, getUserAccounts)
accountRouter.post("/create", auth, createNewAccount);
// accountRouter.delete("/delete", auth, deleteAccount);

module.exports = {
    accountRouter
}