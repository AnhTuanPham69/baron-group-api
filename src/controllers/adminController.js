// Admin Controller 
// Author: Tuanpham

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const sendEmail = require('../config/mail');
const os = require('os');
const date = require('date-and-time')

const now = new Date();
const time = date.format(now, 'HH:mm DD/MM/YYYY');

exports.login = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    try {
        const user = await Admin.findOne({ username: username });
        if (!user) {
            return res.status(401).json({
                message: "Username or Password is not match"
            });
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Password is not match"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY)
        user.tokens = user.tokens.concat({ token })
        await user.save();

        //Gửi mail đăng nhập (toEmail, subject, message)
        let subject = "Đăng Nhập Thành Công";
        let mes = `<b>Đăng nhập thành công tài khoản quản trị viên trên thiết bị : ${os.hostname()}</b>
                    <br/>Vào lúc: ${time} `;
        await sendEmail(user.email, subject, mes);

        res.status(201).json({
            message: "Login is successful",
            token: token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err, req: req.body });
    }
}

// create Admin account
exports.create_user = async (req, res) => {
    const {
        email,
        username
    } = req.body;
    try {
        let user = await Admin.findOne({ email: email });
        if (user) return res.status(403).json('Email already registered for another account');

        user = await Admin.findOne({ username });
        if (user) return res.status(403).json('User name already registered for another account');

        const newUser = new Admin(req.body);
        const savedUser = await newUser.save();
        const token = jwt.sign({
            id: savedUser._id,
        }, process.env.JWT_KEY);

        res.status(201).json({
            user: savedUser,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err, req: req.body });
    }
}

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    try {
        let user = await Admin.findOne({ email: email });

        if (!user) return res.status(203).json({status: 403, message: 'Email is incorrect'});

        const newPass = Math.random().toString(36).substring(2, 7);

        user.password = newPass;

        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY)
        user.tokens = user.tokens.concat({ token })
        await user.save();

        //Gửi mail đăng nhập (toEmail, subject, message)
        let subject = "Mail thay đổi mật khẩu";
        let mes = `<p> Mật khẩu mới của quý khách là: <b>${newPass}</b> </br> Tài khoản: ${user.username} </p>
        <hr/>
        <b>Yêu cầu này được thực hiện trên thiết bị: ${os.hostname()}</b>
                  <br/>Vào lúc: ${time} `;
        await sendEmail(user.email, subject, mes);

        res.status(201).json({
            message: "Mật khẩu mới đã được gửi qua email",
            token: token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err, req: req.body });
    }
}

// Change Password
exports.changePassword = async (req, res) => {
    const username = req.body.username;
    const oldPw = req.body.oldPw;
    const newPw = req.body.newPw;
    try {
        let user = await Admin.findOne({ username: username });

        if (!user) return res.status(200).json({status: 404, message: 'username is incorrect'});

        const isPasswordMatch = await bcrypt.compare(oldPw, user.password)
        if (!isPasswordMatch) {
            return res.status(200).json({
                status: 401,
                message: "Password is not match"
            });
        }

        user.password = newPw;
        await user.save();

        //Gửi mail đăng nhập (toEmail, subject, message)
        let subject = "Mail thay đổi mật khẩu";
        let mes = `<p><b>Thay đổi mật khẩu thành công</b></p>
        <hr/>
        <b>Yêu cầu này được thực hiện trên thiết bị: ${os.hostname()}</b>
                  <br/>Vào lúc: ${time} `;
        await sendEmail(user.email, subject, mes);
        res.status(201).json({
            message: "Change password is successful"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err, req: req.body });
    }
}


