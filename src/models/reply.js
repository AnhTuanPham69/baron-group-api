// Comment model 
// Author: Tuanpham

// Post Model 
// Author: Tuanpham

const mongoose = require('mongoose')

const replyShema = new mongoose.Schema({
    User_ID: {
        type: String,
        required: true
    },
    User_Name: {
        type: String
    },
    Avatar: {
        type: String
    },
    Comment_ID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment'
    },
    Content: {
        type: String
    },
    Date: {
        type: Date,
        default: Date.now
    },
    Avatar: {
        type: String
    },
    Image: {
        type: String
    }
});
const Reply = mongoose.model("Reply", replyShema);
module.exports = Reply;