// Comment model 
// Author: Tuanpham

// Post Model 
// Author: Tuanpham

const mongoose = require('mongoose')

const rankShema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: 'User',
        required: [true,"Id người dùng phải được cung cấp"]
    },
    point:{
        type: Number,
        default: 0
    },
    star:{
        type: Number,
        default: 0
    },
    avgStar:{
        type: Number,
        default: 0
    },
    votes: {
        type: Number,
        default: 0
    }
});

const Rank = mongoose.model("Rank", rankShema);

module.exports = Rank