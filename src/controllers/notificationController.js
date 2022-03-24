const date = require('date-and-time');
const Notification = require('../models/notification');
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
        let list = await Notification.find({ User_ID: user._id }).limit(20).sort('-Date');
        let unread = await Notification.find({ User_ID: user._id, Readed: false }).limit(20).sort('-Date');;
        if (!list) {
            return res.status(204).json({ message: "No notice!" });
        }
        return res.status(200).json({ message: "Getting success!", "notificatons": list, unread: unread, unread_length: unread.length });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!" });
    }
}

exports.getAllNotice = async (req, res) => {
    const user = req.user;
    try {
        let list = await Notification.find({ User_ID: user._id }).sort('-Date');
        let unread = await Notification.find({ User_ID: user._id, Readed: false }).sort('-Date');;
        if (!list) {
            return res.status(204).json({ message: "No notice!" });
        }
        return res.status(200).json({ message: "Getting success!", "notificatons": list, unread: unread, unread_length: unread.length });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!" });
    }
}

exports.readAll = async (req, res) => {
    const user = req.user;
    try {
        let list = await Notification.updateMany({ User_ID: user._id }, { $set: { Readed: true } });
        if (!list) {
            return res.status(204).json({ message: "No notice!" });
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
        let notice = await Notification.findById(idNoti);
        if (!notice) {
            return res.status(204).json({ message: "No notice!" });
        }
        notice.Readed = true;
        await notice.save();
        notice = await Notification.findById(idNoti);
        return res.status(200).json({ message: "Getting success!", "notificatons": notice });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!" });
    }
}

exports.delete = async (req, res) => {
    const idNoti = req.params.id;
    try {
        let notice = await Notification.findByIdAndDelete(idNoti);
        notice = await Notification.findById(idNoti);
        return res.status(200).json({ message: "Deleting success!", "notificatons": notice });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!", err: err.messages });
    }
}

exports.deleteAll = async (req, res) => {
    const idNoti = req.params.id;
    const user = req.user;
    try {
        let notice = await Notification.deleteMany({User_ID: user._id});
        notice = await Notification.findById(idNoti);
        return res.status(200).json({ message: "Deleting success!", "notificatons": notice });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!", err: err.messages });
    }
}