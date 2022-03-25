// Comment model 
// Author: Tuanpham

// Post Model 
// Author: Tuanpham

const mongoose = require('mongoose')

const commentShema = new mongoose.Schema({
    User_ID: {
        type: String,
        required: true
    },
    User_Name: {
        type: String
    },
    Post_ID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question'
    },
    Content: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    },
    Active: {
        type: String
    },
    Avatar: {
        type: String
    },
    Role: {
        type: String
    },
    Image: {
        type: String
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ],
    votes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vote'
        }
    ]
});
const Comment = mongoose.model("Comment", commentShema);
module.exports = Comment;