// Post Controller 
// Author: Tuanpham

//Firebase data
const db = require('../config/firebaseService');
const docRef = db.collection('users');

// import Model
const Question = require('../models/question');

//Date
const now = new Date();

exports.postQuestion = async (req, res) => {
    let User_ID = req.body.User_ID;
    try {
        docRef.doc(User_ID).get().then(async (data) => {
            if (data.exists) {
               const newPost = new Question({
                User_ID: User_ID,
                Title: req.body.Title,
                Content: req.body.Content,
                Class: req.body.Class,
                Subject: req.body.Subject,
                Image: req.body.Image,
                Status: req.body.Status,
                Date: now
            });
               await newPost.save();
               const id = newPost._id;
               let question = await Question.findById(id).populate('comments');
               return res.status(200).json({ message: "Getting success!", "List Post": question});
            } else {
                return res.status(404).json({ message: "Not found user!" });
            }
        });
    } catch(err) {
        return res.status(500).json({ message: "Something is wrong!", err: err });
    }
}

exports.getListQuestion = async (req, res) => {
    try {
        
        let listpost = await Question.find().populate('comments');
        return res.status(200).json({ message: "Getting success!", "List Post": listpost});

    } catch(err) {
        return res.status(500).json({ message: "Something is wrong!", err: err });
    }
}

exports.getQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        let question = await Question.findById(id).populate('comments');
        return res.status(200).json({ message: "Getting success!", "List Post": question});

    } catch(err) {
        return res.status(500).json({ message: "Something is wrong!", err: err });
    }
}