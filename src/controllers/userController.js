const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

//Firebase data
const db = require("../config/firebaseService");
const Tutor = require("../models/tutor");
const Vote = require("../models/vote");
const sendEmail = require("../config/mail");
const docRef = db.collection("users");

exports.newUser = async (req, res) => {
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
    const newTutor = req.body;
    const newUser = new User(newTutor);
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
    if (!listUser) {
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
    res.status(500).json(err.messages);
  }
};

exports.getOne = async (req, res) => {
  const user = req.user;
  if(!user){
    return res.status(404).json({ message: "Not found user!" });
  }
  try {
    const userSystem = await User.findById(user._id).populate('notifications');
    if(!userSystem){
      return res.status(404).json({ message: "Not found user!" });
    }
    return res.status(200).json({ message: "Getting success!", user: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.messages });
  }
};

exports.update = async (req, res) => {
  try {
    let user = req.user;
    if (user && user._id.toString() !== req.params.id)
      return res
        .status(403)
        .json("Not Allowed!");

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
    const user = await User.findById(id);
    await User.findByIdAndDelete(id);
    return res.status(200).json(`Deleted ${user.name}`);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.ban = async (req, res) => {
  const reason = req.body.reason;
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if(user){
    user.status = "banned";
    await user.save();
            //Gửi mail đăng nhập (toEmail, subject, message)
            let subject = "Thư cảnh báo từ ứng dụng learnEx";
            let mes = `<b>Chúng tôi rất tiếc phải thông báo rằng bạn bắt buộc bị ngưng sử dụng dịch vụ từ ứng dụng chúng tôi</b>
            </br>
            <b>Lí do: </b> ${reason} </br>
            Nếu điều này là do hiểu lầm từ hệ thống hoặc có thắc mắc vui lòng liên hệ hotline <b>07991 xxxxx</b> </br>
            để được hỗ trợ
              `;
            await sendEmail(user.email, subject, mes).catch(()=>{
              return res.status(503).json("503: can't send mail");
            });
    
    return res.status(200).json(`Banned ${user.name}`);
          }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.active = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    user.status = "active"
    await user.save();
    return res.status(200).json("Successful!");
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
      let id = doc.id;
      let data = doc.data();
      const user = {
        _id: id,
        _data: data
      }
      list.push(user);
    });
    if (!list) {
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

exports.syncUser = async (req, res) => {
  try {
    const listUser = await docRef.get();
    try {
      listUser.forEach(async doc => {
        const id = doc.id;
        let data = doc.data();
        const user = {
          idFirebase: id,
          name: data.name,
          avatar: data.avatar,
          email: data.email,
          role: data.role,
          active: data.active,
          address: data.address,
          register_date: data.register_date
        }
        await User.findOneAndUpdate({ idFirebase: id }, { $set: user }, { new: true, upsert: true });
      });
    } catch (error) {
      return res
        .status(500)
        .json({
          error: error
        });
    }

    const list = await User.find();
    return res
      .status(200)
      .json({
        message: "Getting success!",
        listUser: list
      });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

exports.register = (req, res) => {
  const idUser = req.body.User_ID;
  docRef.doc(idUser).get().then(async (data) => {
    let infor = data.data();
    console.log(infor);
    
    const user = {
      idFirebase: idUser,
      name: infor.name,
      avatar: infor.avatar,
      email: infor.email,
      role: infor.role,
      active: infor.active,
      address: infor.address,
      register_date: infor.register_date
    }
    const newUser = await User.findOneAndUpdate({ idFirebase: idUser }, { $set: user }, { new: true, upsert: true });

    const token = jwt.sign(
      {
        id: newUser._id
      },
      process.env.JWT_KEY
    );
    return res.status(201).json({
      user: newUser,
      token,
    })
  }).catch((err) => {
    console.log(err);
    return res.status(401).json({
      error: "Registration failed!"
    })
  });
}

exports.loginFb = async (req, res) => {
  const idUser = req.body.User_ID;
    const newUser = await User.findOne({ idFirebase: idUser }).populate('notifications');
    if(newUser){
      const token = jwt.sign(
        {
          id: newUser._id
        },
        process.env.JWT_KEY
      );
      return res.status(201).json({
        mes: "Login is successful!",
        user: newUser,
        token,
      })
    }

    docRef.doc(idUser).get().then(async (data) => {
      let infor = data.data();
      const user = {
        idFirebase: idUser,
        name: infor.name,
        avatar: infor.avatar,
        email: infor.email,
        role: infor.role,
        active: infor.active,
        address: infor.address,
        register_date: infor.register_date
      }
      const newUser = new User(user);
      await newUser.save();
      const token = jwt.sign(
        {
          id: newUser._id
        },
        process.env.JWT_KEY
      );
      return res.status(201).json({
        user: newUser,
        token,
      })
    }).catch((err) => {
      console.log(err);
      return res.status(401).json({
        error: "Registration failed!"
      })
    });
}
