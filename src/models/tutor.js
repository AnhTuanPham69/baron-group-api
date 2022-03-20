const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const tutorSchema = mongoose.Schema({
    uid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    phone: {
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
    },
    checked: {
        type: Boolean
    },
    address: {
        type: String
    },
    register_date:{
        type: Date,
        default: Date.now
    },
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification"
        }
    ],
})

tutorSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

tutorSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

tutorSchema.statics.findByCredentials = async (userName, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ userName } )
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

const Tutor = mongoose.model('Tutor', tutorSchema)

module.exports = Tutor
