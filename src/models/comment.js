// Comment model 
// Author: Tuanpham

// Post Model 
// Author: Tuanpham

const mongoose = require('mongoose')
const validator = require('validator')

const commentShema = new mongoose.Schema({
    User_ID: {
        type: String,
        required: true,
        unique: true
    },
    Post_ID: {
        type: String,
        required: true
    },
    Content: {
        type: String,
        required: true
    },
    Image: {
        type: String
    },
    Date: {
        type: String
    },
    Active: {
        type: String
    }
});

module.exports = mongoose.model('Comment', commentShema);