// Comment model 
// Author: Tuanpham

// Post Model 
// Author: Tuanpham

const mongoose = require('mongoose')
const validator = require('validator')
const Question = require('./question')

const likeShema = new mongoose.Schema({
    User_ID: {
        type: String,
        required: true
    },
    User_Name:{
        type: String
    },
    Post_ID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question'
    },
    Date: {
        type: Date
    }
});

module.exports = mongoose.model("Like", likeShema);