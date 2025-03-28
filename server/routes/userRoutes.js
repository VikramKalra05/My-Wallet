const mongoose = require("mongoose");
const express = require("express");
const { UserModel } = require("../models/userModel");
const {
  registerUserController,
  getAllUsers,
  loginUserController,
  getUserDashboard,
  updateUserDetails,
} = require("../controllers/userController");
const { auth } = require("../middleware/auth.middleware");
const { upload } = require("../config/cloudinary"); // Import Cloudinary upload middleware

const userRouter = express.Router();

// TODO: Implement admin middleware and uncomment if needed
// userRouter.get("/all", auth, adminAuth, getAllUsers);
userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);
userRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ msg: "Logged out successfully" });
});
userRouter.get("/dashboard", auth, getUserDashboard);
userRouter.patch("/update", auth, upload, updateUserDetails);

module.exports = {
  userRouter,
};
