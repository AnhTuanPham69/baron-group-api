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
    Title: {
        type: String,
        required: true
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
        type: String
    },
    Status: {
        type: String
    }
   
});

module.exports = mongoose.model('Question', questionShema);