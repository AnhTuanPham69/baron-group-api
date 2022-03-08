// Post Controller 
// Author: Tuanpham

//Firebase data
const db = require('../config/firebaseService');
const docRef = db.collection('users');

// import Model
const Question = require('../models/question');
const Like = require('../models/like');
// root 
 const rootUser = require('./service/userService')
//Date
const now = new Date();

exports.postQuestion = async (req, res) => {
    let User_ID = req.body.User_ID;
    try {
        docRef.doc(User_ID).get().then(async (data) => {
            if (data.exists) {
                let username = data.data().name;
                let avt = data.data().avatar;
               const newPost = new Question({
                User_ID: User_ID,
                Title: req.body.Title,
                Content: req.body.Content,
                Class: req.body.Class,
                Subject: req.body.Subject,
                Image: req.body.Image,
                Status: req.body.Status,
                Date: now,
                User_Name: username,
                Avatar: avt
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

// Like function

// method: Post

// root: getLike function

const getlike = async (Post_ID) =>{
    try {
        const like = await Like.findOne({Post_ID: Post_ID});
        console.log("sl like: "+like.li);
        if(!like) return false;
        
        return like;
    } catch (error) {
        console.log(error);
        if(!getLike) return false;
    }
}

const islike = async (Post_ID, User_ID) =>{
    try {
        const like = await Like.findOne({Post_ID: Post_ID});
        if (like.User_ID == User_ID){
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
    }

}


exports.likeQuestion = async (req, res) => {
    const { id } = req.params;
    const User_ID = req.body.User_ID;

    try {
        const data = await docRef.doc(User_ID).get();
            if (data.exists) {
                const username = data.data().name;
               const isLike = await Like.findOne({User_ID: User_ID});
               if(!isLike){
                   const newLike = new Like({
                       User_ID: User_ID,
                       Post_ID: id,
                       Date: now,
                       User_Name: username
                   });
                   await newLike.save();
                   let sl = await Like.find({Post_ID: id});
                   return res.status(200).json({ message: "Like success!", "quantityLike": sl});
               }else{
                  const dislike = isLike._id;
                  await Like.findByIdAndRemove(dislike);
                  let sl = await Like.find({Post_ID: id});
                  return res.status(200).json({ message: "Like success!", "quantityLike": sl});
               }
            } else {
              return res.status(404).json({ message: "Invalid request. User does not exist", "quantityLike": user});
            }

    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Lost connect!" });
    }
}

