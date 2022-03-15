const mongoose = require('mongoose')

const notificationShema = new mongoose.Schema({
    User_ID: {
        type: String,
        required: true,
        ref: "User"
    },
    Content: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    Date: {
        type: Date
    }
});
const Notification = mongoose.model("Notification", notificationShema);
module.exports = Notification;