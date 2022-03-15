// Comment Controller 
// Author: Tuanpham

// import Model
const Question = require('../models/question');
const Comment = require('../models/comment')
const User = require('../models/user');
const Vote = require('../models/vote');

//import Firebase
const db = require('../config/firebaseService');
const Reply = require('../models/reply');

const docRef = db.collection('users');

//Date
const now = new Date();


exports.postComment = async (req, res) => {
    const User_ID = req.body.User_ID;
    const image = req.body.Image;
    const { id } = req.params;
    try {
        let question = await Question.findById(id).populate({ path: 'comments', strictPopulate: false });
        if (!question) {
            return res.status(404).json({ message: "This post does not exist!" });
        }
        const user = await User.findOne({ idFirebase: User_ID });
        console.log(user.User_Name);
        if (user) {
            const newComment = new Comment({
                Post_ID: question._id,
                User_ID: user._id,
                User_Name: user.name,
                Avatar: user.avatar,
                Content: req.body.Content,
                Image: image,
                Date: now
            });
            await newComment.save();
            let idCmt = newComment._id;
            question.comments = question.comments.concat(idCmt);
            await question.save();
        } else {
            return res.status(404).json({ message: "User does not exist", "List Comment": question.comments });
        }
        question = await Question.findById(id).populate('comments');
        return res.status(200).json({ message: "Comment success!", "List Comment": question.comments });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!", err: { err } });
    }
}

exports.getComment = async (req, res) => {
    const { id } = req.params;
    try {
        let question = await Question.findById(id).populate('comments');

        if (!question) {
            return res.status(404).json({ message: "This post does not exist!" });
        }
        return res.status(200).json({ message: "Getting success!", "List Comment": question.comments });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!", err: { err } });
    }
}

//Reply Comment
exports.replyComment = async (req, res) => {
    const idComment = req.params.idCmt;
    const idUser = req.body.User_ID;
    const content = req.body.Content;
        if(!content) content="no content";
    try {
        const comment = await Comment.findById(idComment);
        
        const user = await User.findOne({ idFirebase: idUser });
        if(!user){
            return res.status(404).json({ message: "This user does not exist!" });
        }
        console.log("user id: "+user._id);
        if (!comment) {
            return res.status(404).json({ message: "This comment does not exist!" });
        }
        let image = req.body.image;
        if(!image) image = null
        const cid = comment._id;
        const uid = user._id;
        console.log(user.name);
        // content = `@${comment.User_Name}: ${content}`;
        const newReply = {
            User_ID: uid,
            Comment_ID: cid,
            Content: content,
            Date: now,
            Avatar: user.avatar,
            User_Name: user.name,
            Image: image
        }
        const reply = new Reply(newReply);
        await reply.save();
        comment.replies = comment.replies.concat(reply);
        await comment.save();
        const getComment = await Comment.findById(idComment).populate('replies');
        return res.status(200).json({ message: "replying success!", "Comment": getComment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Posting failed", error });
    }
}

exports.getReplyComment = async (req, res) => {
    const idComment = req.params.idCmt;
    try {
        const comment = await Comment.findById(idComment).populate('replies');
 
        return res.status(200).json({ message: "Getting success!", "Reply Comment": comment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Getting failed", error });
    }
}


// Vote  function
exports.voteComment = async (req, res) => {
    const idComment = req.params.idCmt;
    const idUser = req.body.User_ID;
    const star = req.body.star;
    try {
        const comment = await Comment.findById(idComment);
        const user = await User.findOne({ idFirebase: idUser });
        if (user) {
            const vote = await Vote.findOne({ User_ID: user._id })
            if (!vote) {
                const vote = {
                    User_ID: user._id,
                    Comment_ID: comment._id,
                    Date: now,
                    Star: star
                }
                const newVote = new Vote(vote);
                await newVote.save();
                const listVote = await Vote.findOne({ Comment_ID: comment._id });

                comment.votes = listVote;
                await comment.save();

                const commentVoted = await Comment.findById(comment._id).populate('votes');
                return res.status(200).json({ message: "Voting success!", "Comment": commentVoted });

            } else {
                return res.status(200).json({ message: "Bạn đã vote trước đó rồi, nếu muốn vote lại vui lòng gỡ bình chọn cũ"}
                );
            }
        }
        if (!comment) {
            return res.status(404).json({ message: "This comment does not exist!" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Vote failed", error });
    }
}

exports.getVote = async (req, res) => {
    const idComment = req.params.idCmt;
    try {
        let vote = await Comment.findById(idComment).populate("votes");
        return res.status(200).json({ message: "Voting success!", "List Vote": vote });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!", err });
    }
}

exports.getOneVote = async (req, res) => {
    const idVote = req.params.voteId;
    try {
        const vote = await Vote.findById(idVote);
        return res.status(200).json({ message: "Voting success!", "List Vote": vote });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!", err });
    }
}

exports.deleteVote = async (req, res) => {

    const idComment = req.body.idComment;
    const user = req.body.User_ID;
    try {
        const comment = await Comment.findById(idComment);
        const findVote = await Vote.findOne({Comment_ID: comment._id, User_ID: req.user._id});
        await Vote.deleteOne(findVote._id);
        let vote = await Vote.find();
        let count = vote.count;
        return res.status(200).json({ message: "Delete vote is successful!", quantity: count, "List Vote": vote });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!", err });
    }
}