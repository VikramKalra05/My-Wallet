const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
    try {
        
        const user = await UserModel.find();
        // await user.save();
        res.status(200).send(user)

    } catch (error) {
        res.status(400).send({err: `Something went wrong, ${error}`})
    }
}

const registerUserController = async (req, res) => {
  // console.log(req?.body);
  // if(!req.body.name || !req.body.email || !req.body.password){
  //     res.status(400).send({err: `Name, Email or Password cannot be empty`})
  //     return
  // }
  const { name, email, password } = req.body;

  if (password?.length < 8) {
    res.status(400).send({ err: `Password should have atleas 8 characters` });
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

module.exports = {
    registerUserController,
    getAllUsers
}