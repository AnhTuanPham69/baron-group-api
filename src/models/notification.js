const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');

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
    Avt: {
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

notificationShema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: 'all' });

const Notification = mongoose.model("Notification", notificationShema);
module.exports = Notification;