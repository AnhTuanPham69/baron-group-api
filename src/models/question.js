// Post Model 
// Author: Tuanpham

const mongoose = require('mongoose')
// const validator = require('validator')
// const bcrypt = require('bcryptjs')

const questionShema = new mongoose.Schema({
    User_ID: {
        type: String,
        required: true
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
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    }]
   
});

module.exports = mongoose.model('Question', questionShema);