const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const tutorSchema = mongoose.Schema({
    uid:{
        
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: "User",
       
    },
    listPost:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "TutorPost",
    }],
    cv:{
        type: String
    },
    avatar:{
        type: String
    },
    name: {
        type: String
    },
    birthday: {
        type: String
    },
    specialize: {
        type: String
    },
    address_area: {
        type: String
    },
    level: {
        type: String
    },
    gender: {
        type: String
    },    
    email: {
        type: String
    },
    phone: {
        type: String
    },
    class: {
        type: String
    },
    subject: {
        type: String
    },
    followers: {
        type: Number,
    },
    followings: {
        type: Number,
    },
    // Trạng thái xem user có vi phạm tiêu chuẩn cộng đồng và bị ban hay không. Mặc định: active
    status: {
        type: String,
        default: 'waiting'
    },
    checked: {
        type: Boolean,
        default: false
    },
    address: {
        type: String
    },
    register_date:{
        type: Date,
        default: Date.now
    }
})

tutorSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const Tutor = mongoose.model('Tutor', tutorSchema)

module.exports = Tutor
