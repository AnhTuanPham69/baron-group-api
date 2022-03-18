const date = require('date-and-time');
const now = new Date();
const time = date.format(now, 'HH:mm DD/MM/YYYY');


exports.handleNotice = async (uid, content, type) => {
    return {
        User_ID: uid,
        Content: `${time}: ${content}`,
        Date: now,
        Url: type
    }
}

exports.getNotice = async (req, res) => {
    const user = req.user;
    try {
        let list = await Notification.find({User_ID: user._id});
        if(!list){
            return res.status(204).json({ message: "No notice!"});  
        }
        return res.status(200).json({ message: "Getting success!", "notificatons": list });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!" });
    }
}

exports.getOneNotice = async (req, res) => {
    const idNoti = req.params.id;
    try {
        let notice = await Notification.find(idNoti);
        if(!notice){
            return res.status(204).json({ message: "No notice!"});  
        }
        notice.Readed = true;
        await notice.save();
        notice = await Notification.find(idNoti);
        return res.status(200).json({ message: "Getting success!", "notificatons": notice });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!" });
    }
}