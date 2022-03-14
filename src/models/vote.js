// Comment model 
// Author: Tuanpham

// Post Model 
// Author: Tuanpham

const mongoose = require('mongoose')

const voteShema = new mongoose.Schema({
    User_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true,"Id người dùng phải được cung cấp"]
    },
    User_Name:{
        type: String
    },
    Star:{
        type: Number,
        required: [true, "Bạn chưa chọn số sao đánh giá"],  
        max: [5,"Không được vượt quá 5 sao"],
        min: [0,"Không được đánh giá dưới 0 sao"]
    },
    Comment_ID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment'
    },
    Date: {
        type: Date
    }
});

const Vote = mongoose.model("Vote", voteShema);

module.exports = Vote