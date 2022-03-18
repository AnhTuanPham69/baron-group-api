const mongoose = require('mongoose')

const notificationShema = new mongoose.Schema({
    User_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Content: {
        type: String
    },
    Url: {
        type: String
    },
    Readed:{
        type: Boolean,
        default: false
    },
    Date: {
        type: Date
    }
});
const Notification = mongoose.model("Notification", notificationShema);
module.exports = Notification;