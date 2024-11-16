const express = require("express");
const { auth } = require("../middleware/auth.middleware");

const expenseRouter = express.Router();

expenseRouter.get("/", auth, (req, res) => {
    
})