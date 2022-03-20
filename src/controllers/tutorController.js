const Tutor = require("../models/tutor");
const User = require("../models/user");

//Date
const date = require('date-and-time');
const sendEmail = require("../config/mail");
const now = new Date();
const time = date.format(now, 'HH:mm DD/MM/YYYY');

exports.registerTutor = async (req, res) => {

    const user = req.user;
    const data = req.body;
    console.log(data);
    try {
        const newTutor = new Tutor(
            user
        );
        return res.status(200).json({
            message: "Vui lòng đợi quản trị viên chấp thuận yêu cầu của bạn",
            res: req.body
        });
    } catch (error) {

    }

}


exports.acceptTutor = async (req, res) => {

    const uid = req.params.uid;
    const data = req.body;
    console.log(data);

    try {
        const newTutor = User.findById(uid);
        newTutor.role = "tutor";

        // Thông báo
        const contentNotice = "Bạn đã được chấp nhận trở thành gia sư";
        const typeNotice = `tutor:accept/${newTutor._id}`;
        const newNotice = new Notification({
            User_ID: newTutor._id,
            Content: `${time}: ${contentNotice}`,
            Date: now,
            Url: typeNotice
        });
        await newNotice.save();
        newTutor.notifications = newTutor.notifications.concat(newNotice);
        await newTutor.save();
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