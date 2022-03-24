const Tutor = require("../models/tutor");
const User = require("../models/user");

//Firebase data
const db = require("../config/firebaseService");
const docRef = db.collection("users");

//Date
const date = require('date-and-time');
const sendEmail = require("../config/mail");
const Notification = require("../models/notification");
const TutorPost = require("../models/tutorPost");
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
        let subject = "Ứng Dụng LearnEx: Yêu cầu trở thành gia sư của bạn được chấp nhận ";
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

exports.tutorPost = async (req, res) => {
    const user = req.user;
    try {
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const tutor = await Tutor.findOne({uid: user._id});
        const newPost = new TutorPost(req.body);
        newPost.User_ID =  user._id;
        newPost.Avatar =  user.avatar;
        newPost.User_Name =  user.name;

        await newPost.save();

        const id = newPost._id;

        // Thông báo
        const contentNotice = "Đăng bài viết thành công";
        const typeNotice = `/tutor/post/${id}`;
        const newNotice = new Notification({            
            User_ID: user._id,
            Content: `${contentNotice}`,
            Date: now,
            Url: typeNotice,
            Avt: user.avatar});
        await newNotice.save();
        user.notifications = user.notifications.concat(newNotice);
        user.posts = user.posts.concat(newPost);
        await user.save();

        const question = await TutorPost.find();

        return res.status(200).json({ message: "Getting success!", "List Post": question });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!", err: err.messages });
    }
}

exports.getListPost = async (req, res) => {
    try {
        let listpost = await TutorPost.find();
        return res.status(200).json({ message: "Getting success!", "listPost": listpost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!" });
    }
}

exports.getTutorPost = async (req, res) => {
    const { id } = req.params;
    try {
        let question = await TutorPost.findById(id);
        if (!question) return res.status(404).json({ message: "This post does not exist" });
        return res.status(200).json({ message: "Getting success!", "data": question });
    } catch (err) {
        return res.status(500).json({ message: "Something is wrong!", err: err });
    }
}

exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        let post = await TutorPost.findById(id);
        const postOwner = post.User_ID;
        if (postOwner != req.user._id) {
            return res.status(403).json("Not allow!");
        }
        if (!post)
            return res
                .status(404)
                .json("This post does not exist");
        await TutorPost.findByIdAndUpdate(id, {
            $set: req.body,
        }).populate('comments');
        post = await TutorPost.findOne({ _id: id }).populate('comments');

        // Thông báo
        let contentNotice = "Cập nhật bài viết thành công";
        let typeNotice = `post/${id}`;
        const newNotice = new Notification({
            User_ID: user._id,
            Content: `${time}: ${contentNotice}`,
            Date: now,
            Url: typeNotice,
            Avt: user.avatar
        });
        await newNotice.save();
        user.notifications = user.notifications.concat(newNotice);
        await user.save();

        return res.status(200).json(post);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    const user = req.user;
    try {
        const { id } = req.params;
        const post = await TutorPost.findById(id);
        const postOwner = post.User_ID;
        if (postOwner != req.user._id) {
            return res.status(403).json("Not allow!");
        }
        await TutorPost.deleteById(id);

        // Thông báo
        const contentNotice = "Xóa bài viết thành công";
        const typeNotice = `post:deleted`;
        const newNotice = new Notification( {
                    User_ID: user._id,
                    Content: `${time}: ${contentNotice}`,
                    Date: now,
                    Url: typeNotice,
                    Avt: user.avatar
        });
        await newNotice.save();
        user.notifications = user.notifications.concat(newNotice);
        await user.save();
        const listPost = await TutorPost.find();
        return res.status(200).json({message: "Deleted", listPost: listPost});
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};