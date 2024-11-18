const express = require("express");
const { auth } = require("../middleware/auth.middleware");

const expenseRouter = express.Router();

expenseRouter.get("/", auth, (req, res) => {
    res.json({msg: "You have 0 expenses"})
})

module.exports = {
    expenseRouter
}