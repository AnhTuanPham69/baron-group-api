// Post Model 
// Author: Tuanpham

const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');


const questionShema = new mongoose.Schema({
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
        type: String,
        required: true
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
    Date: {
        type: Date
    },
    Status: {
        type: String
    },
    comments: [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Comment'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    }]
   
});

questionShema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: 'all' });
const Question = mongoose.model('Question', questionShema);
module.exports = Question;