const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const userService = require('./service/userService');

//Firebase data
const db = require("../config/firebaseService");
const docRef = db.collection("users");

exports.create_user = async (req, res) => {
  const { email, userName, phone } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user)
      return res
        .status(403)
        .json("Email already registered for another account");

    user = await User.findOne({ phone: phone });
    if (user)
      return res
        .status(403)
        .json("Phone already registered for another account");

    user = await User.findOne({ userName: userName });
    if (user)
      return res
        .status(403)
        .json("User name already registered for another account");

    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    const token = jwt.sign(
      {
        id: savedUser._id,
      },
      process.env.JWT_KEY
    );
    newUser.token.push(token);
    await newUser.save();
    res.status(201).json({
      user: savedUser,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err, req: req.body });
  }
};

exports.login = async (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;
  try {
    const user = await User.findOne({ userName });
    if (!user) throw "Username or password is incorrect";

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({
        message: "Password is not match",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    res.status(201).json({
      message: "Login is successful",
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getAll = async (req, res) => {
  try {
    const listUser = await User.find();
    console.log(listUser);
    if(!listUser){
      return res
      .status(404)
      .json({
        message: "Not found User"
      });
    }
      return res
      .status(200)
      .json({
        message: "Getting success!",
        list_user: listUser,
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getOne = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("id user: "+id);
    docRef.doc(id).get().then((data) => {
        if (data.exists) {
           const user = data.data();
            return res.status(200).json({ message: "Getting success!", user: user});
        } else {
            return res.status(404).json({ message: "Not found user!" });
        }
    });
    // user = await userService.getOneUser(id);
    // console.log("user: "+ user);
    // if(user === false){
    //   return res.status(404).json({ message: "Not found user!" });
    // }
    // return res.status(200).json({ message: "Getting success!", user: user});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

exports.update = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    let user = await User.findOne({ phoneNumber: phoneNumber });
    if (user && user._id.toString() !== req.params.id)
      return res
        .status(403)
        .json("Phone number already registered for another account");

    const updateUser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(updateUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await UserVaccine.deleteMany({ user: id });
    await UserPlace.deleteMany({ user: id });
    await User.findByIdAndDelete(id);
    return res.status(200).json("Deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.listUserFirebase = async (req, res) => {
  try {
    const listUser = await docRef.get();
    const list = [];
    listUser.forEach(doc => {
      let id=doc.id;
      let data = doc.data();
      const user ={
        _id : id,
         _data: data
      }
      list.push(user);
    });
    if(!list){
      return res
      .status(404)
      .json({
        message: "Not have user!"
      });
    }
    return res
    .status(200)
    .json({
      message: "Getting success!",
      list_user: list,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};
