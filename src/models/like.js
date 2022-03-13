// Comment model 
// Author: Tuanpham

// Post Model 
// Author: Tuanpham

const mongoose = require('mongoose')

const likeShema = new mongoose.Schema({
    User_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    User_Name:{
        type: String
    },
    isLike:{
        type: Boolean,
        default: true
    },
    Post_ID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question'
    },
    Date: {
        type: Date
    }
});
const Like = mongoose.model("Like", likeShema);
module.exports = Like