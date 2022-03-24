// Tutor Post Model 
// Author: Tuanpham

const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');


const TutorPostShema = new mongoose.Schema({
    User_ID: {
        type: String,
        required: true
    },
    Type: {
        type: String,
    },
    User_Name: {
        type: String
    },
    Avatar: {
        type: String
    },
    Title: {
        type: String
    },
    Content: {
        type: String
    },
    Class: {
        type: String
    },
    Subject: {
        type: String
    },
    Image: {
        type: String
    },
    Video:{
        type: String
    },
    Date: {
        type: Date,
        default: Date.now
    },
    Status: {
        type: String
    }
   
});

TutorPostShema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: 'all' });
const TutorPost = mongoose.model('TutorPost', TutorPostShema);
module.exports = TutorPost;