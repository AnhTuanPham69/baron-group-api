// Post Controller 
// Author: Tuanpham

//Firebase data
const db = require('../config/firebaseService');
const docRef = db.collection('users');

// import Model
const Question = require('../models/question');
const Like = require('../models/like');
const User = require('../models/user');
const Analysis = require('../models/analysis');


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
                return res.status(200).json({ message: "Getting success!", "List Post": question });
            } else {
                return res.status(404).json({ message: "Not found user!" });
            }
        });
    } catch (err) {
        return res.status(500).json({ message: "Something is wrong!", err: err });
    }
}

exports.getListQuestion = async (req, res) => {
    try {
        let listpost = await Question.find().populate('comments').populate('likes');
        return res.status(200).json({ message: "Getting success!", "listPost": listpost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!" });
    }
}

exports.getQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        let question = await Question.findById(id).populate('comments');
        if (!question) return res.status(404).json({ message: "This post does not exist" });
        return res.status(200).json({ message: "Getting success!", "data": question });
    } catch (err) {
        return res.status(500).json({ message: "Something is wrong!", err: err });
    }
}

exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        let question = await Question.findOne({ _id: id });
        if (!question)
            return res
                .status(404)
                .json("This post does not exist");
        await Question.findByIdAndUpdate(id, {
            $set: req.body,
        }).populate('comments');
        question = await Question.findOne({ _id: id }).populate('comments');
        res.status(200).json(question);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await Question.deleteById(id);
        return res.status(200).json("Deleted");
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};


// Like function
exports.likeQuestion = async (req, res) => {
    const { id } = req.params;
    const User_ID = req.body.User_ID;

    try {
        const user = await User.findOne({ idFirebase: User_ID });
        const post = await Question.findById(id).populate('likes');
        if(user){
            const like = await Like.findOne({ User_ID: user._id })
            if(!like){
                let newLike = new Like({
                    User_ID: user._id,
                    User_Name: user.name,
                    Post_ID: id,
                    Date: now
                });
                await newLike.save();
            }else{
                await Like.findOneAndDelete({ User_ID: user._id }, {Post_ID: post._id}); 
            }
        }

        const likeList = await Like.find({ Post_ID: id });
        post.likes = likeList;
        await post.save();
       const refpost = await Question.findById(id).populate('likes'); 
        length = likeList.length;
        return res.status(200).json({ message: "Quantity Like", "quantityLike": length, "listLike": likeList, post: refpost});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Lost connect!" });
    }
}

exports.getLike = async (req, res) => {
    const { id } = req.params;
    try {
        like = await Like.find({ Post_ID: id });
        length = like.length;
        return res.status(200).json({ message: "Quantity Like", "quantityLike": length, "listLike": like });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Lost connect!" });
    }
}


