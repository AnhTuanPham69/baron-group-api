const Tutor = require("../models/tutor");
const User = require("../models/user");

//Firebase data
const db = require("../config/firebaseService");
const docRef = db.collection("users");

//Date
const date = require('date-and-time');
const sendEmail = require("../config/mail");
const Notification = require("../models/notification");
const now = new Date();
const time = date.format(now, 'HH:mm DD/MM/YYYY');

exports.listCheckTutor = async (req, res) => {

    try {
        const listTutor = await Tutor.find({status: 'waiting'});

        return res.status(200).json({ listTutor: listTutor});

    } catch (error) {
        return res.status(500).json({ message: "Something is wrong!", error: error.messages });
    }

}

exports.getListTutor = async (req, res) => {

    try {
        const listTutor = await Tutor.find({status: 'accepted'});

        return res.status(200).json({ listTutor: listTutor});

    } catch (error) {
        return res.status(500).json({ message: "Something is wrong!", error: error.messages });
    }

}

exports.registerTutor = async (req, res) => {

    const user = req.user;
    const data = req.body;
    try {
       const checkTutor = await Tutor.findOne({uid: user._id});
       if(checkTutor){
           if(checkTutor.status == "waiting"){
            return res.status(403).json({
                message: "Bạn đã đăng ký trở thành tutor trước đó rồi, vui lòng đợi phản hồi của quản trị viên",
            });
           }else{
            return res.status(403).json({
                message: "Mã định danh của gia sư này đã tồn tại vui lòng sử dụng tài khoản khác để đăng ký",
            });
           }

       }
        const newTutor = new Tutor(
            req.body
        );
        newTutor.uid = user._id;
        newTutor.avatar = user.avatar;
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
        console.log(error);
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
        const resFirebase = await docRef.doc(newTutor.idFirebase).set({
            role: "tutor"
        }, { merge: true });
        if(!resFirebase){
            return res.status(404).json({ message: "This tutor does not exist" });
        }
        newTutor.role = "tutor";
        tutorInfor.status = "accepted";
        tutorInfor.checked = true;
        
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
        await sendEmail(tutorInfor.email, subject, mes);

        return res.status(200).json({ message: `Accepting tutor: ${newTutor.name} is successful` });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something is wrong!", error: error.messages });
    }

}