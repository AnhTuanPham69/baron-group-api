const Tutor = require("../models/tutor");
const User = require("../models/user");

//Date
const date = require('date-and-time');
const sendEmail = require("../config/mail");
const now = new Date();
const time = date.format(now, 'HH:mm DD/MM/YYYY');

exports.getListTutor = async (req, res) => {

    try {
        const listTutor = await Tutor.find();

        return res.status(200).json({ listTutor: listTutor});

    } catch (error) {
        return res.status(500).json({ message: "Something is wrong!", error: error.messages });
    }

}

exports.registerTutor = async (req, res) => {

    const user = req.user;
    const data = req.body;
    console.log(data);
    try {
        const newTutor = new Tutor(
            req.body
        );
        newTutor.uid = user._id;
        newTutor.save();
        // Thông báo
        const contentNotice = "Chúng tôi đang xem xét yêu cầu trở thành gia sư của bạn";
        const typeNotice = `tutor:accept/${user._id}`;
        const newNotice = new Notification({
            User_ID: user._id,
            Content: `${time}: ${contentNotice}`,
            Date: now,
            Avt: user.avatar,
            Url: typeNotice
        });
        await newNotice.save();
        user.notifications = user.notifications.concat(newNotice);
        await user.save();

        return res.status(200).json({
            message: "Vui lòng đợi quản trị viên chấp thuận yêu cầu của bạn",
            res: req.body
        });
    } catch (error) {
        return res.status(500).json({ message: "Something is wrong!", error: error.messages });
    }

}


exports.acceptTutor = async (req, res) => {

    const uid = req.params.uid;
    try {
        const newTutor = await User.findById(uid);
        const tutorInfor = await Tutor.findOne({uid: uid});
        if(!newTutor || !tutorInfor){
            return res.status(404).json({ message: "This tutor does not exist" });
        }
        newTutor.role = "tutor";
        tutorInfor.status = "accepted";
        // Thông báo
        const contentNotice = "Bạn đã được chấp nhận trở thành gia sư";
        const typeNotice = `tutor:accept/${newTutor._id}`;
        const newNotice = new Notification({
            User_ID: newTutor._id,
            Content: `${contentNotice}`,
            Date: now,
            Avt: newTutor.avatar,
            Url: typeNotice
        });
        await newNotice.save();
        newTutor.notifications = newTutor.notifications.concat(newNotice);
        await newTutor.save();
        await tutorInfor.save();
        //Gửi mail đăng nhập (toEmail, subject, message)
        let subject = "Ứng Dụng LearnEx: Yêu cầu trở thành quản trị viên của bạn được chấp nhận ";
        let mes = `<b>Cảm ơn bạn đã quân tâm đến ứng dụng của chúng tôi</b><br/> <br/>
        Sau khi xem xét kỹ lưỡng hồ sơ của bạn chúng tôi đã quyết định chấp nhận bạn trở thành gia sư cho ứng dụng LearnEx<br/>
        Mong rằng bạn có thể hỗ trợ và góp phần hợp tác giúp ứng dụng phát triển hơn nữa trong tương lai.<br/><br/>
        <b>Chúng Tôi Xin Chân Thành Cảm Ơn</b> <br/>`;
        await sendEmail(newTutor.email, subject, mes);

        return res.status(200).json({ message: `Accepting tutor: ${newTutor.name} is successful` });

    } catch (error) {
        return res.status(500).json({ message: "Something is wrong!", error: error.messages });
    }

}