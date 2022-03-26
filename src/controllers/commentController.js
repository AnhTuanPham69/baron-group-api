// Comment Controller 
// Author: Tuanpham

// import Model
const Question = require('../models/question');
const Comment = require('../models/comment')
const User = require('../models/user');
const Vote = require('../models/vote');
const Reply = require('../models/reply');
const Notification = require('../models/notification');

exports.postComment = async (req, res) => {
    const User_ID = req.body.User_ID;
    const image = req.body.Image;
    const { id } = req.params;
    try {
        let question = await Question.findById(id).populate({ path: 'comments', strictPopulate: false });
        if (!question) {
            return res.status(404).json({ message: "This post does not exist!" });
        }
        const postOwner = await User.findById(question.User_ID);
        const user = req.user;
        
        if (user) {
            const newComment = new Comment({
                Post_ID: question._id,
                User_ID: user._id,
                User_Name: user.name,
                Role:user.role,
                Avatar: user.avatar,
                Content: req.body.Content,
                Image: image,
            });
            await newComment.save();
            let idCmt = newComment._id;
            question.comments = question.comments.concat(idCmt);
            await question.save();

            if(postOwner._id.toString() !== user._id.toString()){
                const contentNotice =  `${user.name} đã bình luận bài viết của bạn`
                const typeNotice = `${id}`;
                const newNotice = new Notification({            
                    User_ID: postOwner._id,
                    Content: `${contentNotice}`,
                    Url: typeNotice,
                    Avt: postOwner.avatar});
                await newNotice.save();
            }
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
        return res.status(500).json({ message: "Something is wrong!", err: err.messages });
    }
}

//Reply Comment
exports.replyComment = async (req, res) => {
    const idComment = req.params.idCmt;
    const idUser = req.body.User_ID;
    const content = req.body.Content;
        if(!content) content="no content";
    const user = req.user;
    try {
        const comment = await Comment.findById(idComment);
        
        
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

        console.log("user: ", user.name);

        const newReply = {
            User_ID: uid,
            Comment_ID: cid,
            Content: content,
            Avatar: user.avatar,
            User_Name: user.name,
            Image: image
        }
        const reply = new Reply(newReply);
        await reply.save();
        comment.replies = comment.replies.concat(reply);
        await comment.save();
        const commentOwner = await User.findById(comment.User_ID);
        console.log("Notice: "+ commentOwner.User_Name +" reply");
       ;
        if(commentOwner._id.toString() != user._id.toString()){
            console.log("Uer",comment)
            let contentNotice =  `${user.name} đã trả lời bình luận bài viết của bạn`
            const typeNotice = `${comment._id}`;
            const newNotice = new Notification({
                User_ID: commentOwner._id,
                Content: `${contentNotice}`,
                Url: typeNotice,
                Avt: commentOwner.avatar
            });
            await newNotice.save();

            contentNotice =  `Bạn đang theo dõi bình luận của ${comment.User_Name}`
            const otherNotice = new Notification({
                User_ID: user._id,
                Content: `${contentNotice}`,
                Url: typeNotice,
                Avt: user.avatar
            });
          
            await otherNotice.save();
        }
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
        const user = req.user;
        if (user) {
            const vote = await Vote.findOne({ User_ID: user._id, Comment_ID: comment._id})
            if (!vote) {
                const vote = {
                    User_ID: user._id,
                    Comment_ID: comment._id,
                    Star: star
                }
                const newVote = new Vote(vote);
                await newVote.save();
                const listVote = await Vote.findOne({ Comment_ID: comment._id });

                comment.votes = listVote;
                await comment.save();
                const commentOwner = await User.findById(comment.User_ID);
                if(commentOwner._id.toString() != user._id.toString()){
                    let contentNotice =  `${user.name} đã đánh giá ${star} sao cho bình luận của bạn`
                    let typeNotice = `${comment._id}`;
                    let newNotice = new Notification({            
                        User_ID: commentOwner._id,
                        Content: `${contentNotice}`,
                        Url: typeNotice,
                        Avt: commentOwner.avatar});
                    await newNotice.save();
        
                    contentNotice =  `Bạn đang theo dõi bình luận của ${commentOwner.name}`
                    const otherNotice = new Notification({            
                        User_ID: user._id,
                        Content: `${contentNotice}`,
                        Url: typeNotice,
                        Avt: user.avatar});
                    await otherNotice.save();
                
                }else{
                    return res.status(403).json({ message: "Bạn không thể đánh giá bình luận của chính mình"});
                }
                const commentVoted = await Comment.findById(comment._id).populate('votes');
                return res.status(200).json({ message: "Voting success!", "Comment": commentVoted });

            } else {
                return res.status(403).json({ message: "Bạn đã vote trước đó rồi, nếu muốn vote lại vui lòng gỡ bình chọn cũ"}
                );
            }
        }
        if (!comment) {
            return res.status(404).json({ message: "This comment does not exist!" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Vote failed", error: error.messages });
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

    const idComment = req.params.idComment;
    const user = req.user;
    try {
        const comment = await Comment.findById(idComment);
        const findVote = await Vote.findOne({Comment_ID: comment._id, User_ID: req.user._id});

        await Vote.deleteOne(findVote._id);

        
                // Thông báo
                const contentNotice = "Xóa đánh giá thành công";
                const typeNotice = `post/${comment.Post_ID}/comment/${comment._id}`;
                const newNotice = new Notification({            
                    User_ID: user._id,
                    Content: `${contentNotice}`,
                    Url: typeNotice,
                    Avt: user.avatar});
                await newNotice.save();

        let vote = await Vote.find();
        let count = vote.count;
        return res.status(200).json({ message: "Delete vote is successful!", quantity: count, "List Vote": vote });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something is wrong!", err });
    }
}