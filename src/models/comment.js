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
        type: Date
    },
    Active: {
        type: String
    },
    Avatar: {
        type: String
    },
    Image: {
        type: String
    }
});

module.exports = mongoose.model("Comment", commentShema);