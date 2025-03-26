const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const getAllUsers = async (req, res) => {
  try {
    const user = await UserModel.find();
    // await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ err: `Something went wrong, ${error}` });
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const user = await UserModel.findOne({ _id: userId });
    const details = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      isFirstLogin: user.isFirstLogin,
      photo: user?.photo
    };
    // await user.save();
    res.status(200).send({ message: "Welcome to your wallet!", details });
  } catch (error) {
    res.status(400).send({ err: `Something went wrong, ${error}` });
  }
};

const registerUserController = async (req, res) => {
  // console.log(req?.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).send({ err: `Name, Email or Password cannot be empty` });
    return;
  }

  if (password?.length < 8) {
    res.status(400).send({ err: `Password should have atleast 8 characters` });
    return;
  }

  try {
    const isUser = await UserModel.findOne({ email });

    if (isUser) {
      res.status(200).send({ msg: `User already exists` });
      return;
    }

    bcrypt.hash(password, 8, async (err, hash) => {
      if (err) {
        res.status(500).send({ err: "Something went wrong while hashing" });
      } else {
        const user = new UserModel({ name, email, password: hash });
        await user.save();
        res.status(200).send({ msg: "User has been registered" });
      }
    });
  } catch (error) {
    res.status(400).send({ err: `Resister failed, ${error}` });
  }
};

const loginUserController = async (req, res) => {
  const data = req.body;

  var isEmailLogin = false;

  if (data.email) {
    isEmailLogin = true;
  } else if (!data.phone) { 
    res.status(400).send({ msg: `Email or phone number required` });
    return;
  }
  
  if(!data.password){
    res.status(400).send({ msg: `Password required for login` });
    return;
  }

  if (data.password.length < 8) {
    res.status(400).send({ msg: `Invalid Password! Password should be of length 8 or more` });
    return;
  }

  try {
    const user = isEmailLogin
      ? await UserModel.findOne({ email: data.email })
      : await UserModel.findOne({ phone: data.phone });

    if (!user) {
      res.status(404).send({ msg: `User does not exist` });
      return;
    }

    bcrypt.compare(data.password, user.password, async (err, hash) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res
          .status(500)
          .send({ msg: "Server error during password verification" });
      }

      if (hash) {
        // Generate JWT token (avoiding embedding full user object)
        const token = jwt.sign(
          { userId: user._id, email: user.email, name: user.name },
          process.env.secretKey,
          { expiresIn: "7d" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,  // Set to true only if using HTTPS
          sameSite: "Lax"
        });

        return res.status(200).send({
          msg: "Login successful",
          token: token,
        });
      } else {
        return res.status(401).send({ msg: "Incorrect Password" });
      }
    });
  } catch (error) {
    res.status(400).send({ err: `Login failed, ${error}` });
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  getUserDashboard,
  getAllUsers,
};
