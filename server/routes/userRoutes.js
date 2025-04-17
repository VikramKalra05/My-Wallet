const mongoose = require("mongoose");
const express = require("express");
const { UserModel } = require("../models/userModel");
const {
  registerUserController,
  getAllUsers,
  loginUserController,
  getUserDashboard,
  updateUserDetails,
  resetPasswordController,
  deleteAccount,
  logoutUserController,
} = require("../controllers/userController");
const { auth } = require("../middleware/auth.middleware");
const { uploadMiddleware } = require("../middleware/upload.middleware");

const userRouter = express.Router();

// TODO: Implement admin middleware and uncomment if needed
// userRouter.get("/all", auth, adminAuth, getAllUsers);
userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);
userRouter.post("/reset-password", resetPasswordController);
userRouter.get("/logout", auth, logoutUserController);
userRouter.get("/dashboard", auth, getUserDashboard);
userRouter.patch("/update", auth, uploadMiddleware, updateUserDetails);
userRouter.delete("/delete", auth, deleteAccount);

module.exports = {
  userRouter,
};
