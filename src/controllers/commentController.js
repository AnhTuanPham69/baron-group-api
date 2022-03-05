// Comment Controller 
// Author: Tuanpham

// import Model
const Question = require('../models/question');
const Comment = require('../models/comment')

//import Firebase
const db = require('../config/firebaseService');
const docRef = db.collection('users');

exports.postComment = async (req, res) => {
    let User_ID = req.body.User_ID;
    let Post_ID = req.params;
    try {
        docRef.doc(User_ID).get().then(async (data) => {
            if (data.exists) {
        
                const question = await Question.findOne({_id: Post_ID});
                if(!question){
                    return res.status(404).json({ message: "This post does not exist!"});
                }
                const newComment = new Comment({
                    Post_ID: question._id,
                    User_ID: User_ID,
                    Content: req.body.Content
                });
                await newComment.save();
                let id = newComment._id;
                question.comments = question.comments.concat(id);
                await question.save();
                
                const listCmt = await Question.findById( Post_ID ).populate({path: 'comments', strictPopulate: false});
                console.log(listCmt.comments);
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
                let question = await Question.findById(id).populate({path: 'comments', strictPopulate: false});;
                if(!question){
                    return res.status(404).json({ message: "This post does not exist!"});
                }
                    return res.status(200).json({ message: "Getting success!", "List Comment": question.comments});
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!", err: {err} });
    }
}