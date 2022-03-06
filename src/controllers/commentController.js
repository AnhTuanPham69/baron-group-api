// Comment Controller 
// Author: Tuanpham

// import Model
const Question = require('../models/question');
const Comment = require('../models/comment')

//import Firebase
const db = require('../config/firebaseService');
const docRef = db.collection('users');

//Date
const now = new Date();


exports.postComment = async (req, res) => {
    const User_ID = req.body.User_ID;
    const image = req.body.Image;
    const { id } = req.params;
    try {
        const question = await Question.findById(id).populate({path: 'comments', strictPopulate: false});
        if(!question){
            return res.status(404).json({ message: "This post does not exist!"});
        }
        docRef.doc(User_ID).get().then(async (data) => {
            if (data.exists) {
                let username = data.data().name;
                let avt = data.data().avatar;
                if(!avt) avt= "https://p.kindpng.com/picc/s/421-4212356_user-white-icon-png-transparent-png.png";
                console.log("User data:"+data.data().name);
                const newComment = new Comment({
                    Post_ID: question._id,
                    User_ID: User_ID,
                    User_Name: username,
                    Avatar: avt,
                    Content: req.body.Content,
                    Image: image,
                    Date: now
                });
                await newComment.save();
                let idCmt = newComment._id;
                question.comments = question.comments.concat(idCmt);
                await question.save();
                const listCmt = await Question.findById( id ).populate({path: 'comments', strictPopulate: false});
                return res.status(200).json({ message: "Getting success!", "List Comment": listCmt.comments});
            } else {
                return res.status(404).json({ message: "Not found user!" });
            }
            
        });
                        
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