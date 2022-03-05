// Comment Controller 
// Author: Tuanpham

// import Model
const Question = require('../models/question');
const Comment = require('../models/comment')

//import Firebase
const db = require('../config/firebaseService');
const docRef = db.collection('users');

//Date
const date = require('date-and-time')

const now = new Date();
const time = date.format(now, 'HH:mm DD/MM/YYYY');

exports.postComment = async (req, res) => {
    const User_ID = req.body.User_ID;
    const { id } = req.params;
    try {
        const question = await Question.findById(id).populate({path: 'comments', strictPopulate: false});
        if(!question){
            return res.status(404).json({ message: "This post does not exist!"});
        }
        docRef.doc(User_ID).get().then(async (data) => {
            if (data.exists) {
                let username = data._fieldsProto.name.stringValue;
                const newComment = new Comment({
                    Post_ID: question._id,
                    User_ID: User_ID,
                    User_Name: username,
                    Content: req.body.Content,
                    Date: now
                });
                await newComment.save();
                let id = newComment._id;
                question.comments = question.comments.concat(id);
                await question.save();
            } else {
                return res.status(404).json({ message: "Not found user!" });
            }
            
        });
                        
        const listCmt = await Question.findById( id ).populate({path: 'comments', strictPopulate: false});
        console.log(listCmt);
        return res.status(200).json({ message: "Getting success!", "List Comment": listCmt.comments});
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!", err: {err} });
    }
}

exports.getComment = async (req, res) => {
    const { id } = req.params;
    try {  
                let question = await Question.findById(id).populate({path: 'comments', strictPopulate: false});
                if(!question){
                    return res.status(404).json({ message: "This post does not exist!"});
                }
                    return res.status(200).json({ message: "Getting success!", "List Comment": question.comments});
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!", err: {err} });
    }
}