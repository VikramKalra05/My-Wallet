const mongoose = require("mongoose");
const express = require("express");
const { UserModel } = require("../models/userModel");
const { registerUserController, getAllUsers, loginUserController, getUserDashboard } = require("../controllers/userController");
const { auth } = require("../middleware/auth.middleware");

const userRouter = express.Router();

// userRouter.get("/all", getAllUsers);
userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);
userRouter.post("/logout", loginUserController);
userRouter.get("/dashboard", auth, getUserDashboard)

module.exports = {
    userRouter
}