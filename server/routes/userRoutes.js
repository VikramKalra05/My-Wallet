const mongoose = require("mongoose");
const express = require("express");
const { UserModel } = require("../models/userModel");
const { registerUserController, getAllUsers, loginUserController, getUserDashboard } = require("../controllers/userController");
const { auth } = require("../middleware/auth.middleware");

const userRouter = express.Router();

// TODO: Implement admin middleware and uncomment if needed
// userRouter.get("/all", auth, adminAuth, getAllUsers);
userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);
// TODO: Implement proper logout controller
userRouter.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.status(200).send({ msg: "Logged out successfully" });
});
userRouter.get("/dashboard", auth, getUserDashboard);
// TODO: Implement proper update controller
userRouter.patch("/update", auth, async (req, res) => {
    res.status(501).send({ msg: "Update functionality not implemented yet" });
});

module.exports = {
    userRouter
}