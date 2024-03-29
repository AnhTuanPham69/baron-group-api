const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    idFirebase: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        }
    ],
    idRank:
    {
        type: String,
        ref: "Rank",
        default: false
    }
    ,
    role: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true
    },
    phone: {
        type: String
    },
    avatar: {
        type: String,
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
        default: "active"
    },
    checked: {
        type: Boolean
    },
    address: {
        type: String
    },
    register_date: {
        type: String
    },
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification"
        }
    ],
})

// validate: value => {
//     if (!validator.isEmail(value)) {
//         throw new Error({error: 'Invalid Email address'})
//     }
// }

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (userName, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ userName })
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
