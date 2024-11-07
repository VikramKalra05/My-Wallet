const mongoose = require("mongoose");
const express = require("express");
const { UserModel } = require("../models/userModel");
const { registerUserController, getAllUsers } = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/all", getAllUsers);
userRouter.post("/register", registerUserController)

module.exports = {
    userRouter
}