// Post Controller 
// Author: Tuanpham

// import Model
const Question = require('../models/question');
const Like = require('../models/like');
const User = require('../models/user');
const Notification = require('../models/notification');
const Rank = require('../models/rank');


exports.postQuestion = async (req, res) => {
    const user = req.user;
    try {
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const newPost = new Question(req.body);
        newPost.User_ID = user._id;
        newPost.Avatar = user.avatar;
        newPost.User_Name = user.name;

        await newPost.save();
        const id = newPost._id;

        // Thông báo
        const contentNotice = "Đăng bài viết thành công";
        const typeNotice = `${id}`;
        const newNotice = new Notification({
            User_ID: user._id,
            Content: `${contentNotice}`,
            Url: typeNotice,
            Avt: user.avatar
        });
        await newNotice.save();
        user.notifications = user.notifications.concat(newNotice);
        user.posts = user.posts.concat(newPost);
        await user.save();

        const question = await Question.find().populate('comments').sort('-date');;

        return res.status(200).json({ message: "Getting success!", "List Post": question });

    } catch (err) {
        return res.status(500).json({ message: "Something is wrong!", err: err.messages });
    }
}

exports.getListQuestion = async (req, res) => {
    try {
        let listpost = await Question.find().populate('comments').populate('likes').sort('-date');
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
    const user = req.user;
    try {
        let post = await Question.findById(id);
        const postOwner = post.User_ID;
        if (postOwner != req.user._id) {
            return res.status(403).json("Not allow!");
        }
        if (!post)
            return res
                .status(404)
                .json("This post does not exist");
        await Question.findByIdAndUpdate(id, {
            $set: req.body,
        }).populate('comments');
        post = await Question.findOne({ _id: id }).populate('comments');

        // Thông báo
        let contentNotice = "Cập nhật bài viết thành công";
        let typeNotice = `post/${id}`;
        const newNotice = new Notification({
            User_ID: user._id,
            Content: `${contentNotice}`,
            Url: typeNotice,
            Avt: user.avatar
        });
        await newNotice.save();
        user.notifications = user.notifications.concat(newNotice);
        await user.save();

        return res.status(200).json(post);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    const user = req.user;
    try {
        const { id } = req.params;
        const post = await Question.findById(id).populate('likes');
        if(!post){
            return res.status(404).json({message: "This post does not exist"})
        }
        const postOwner = post.User_ID;
        if (postOwner != req.user._id) {
            return res.status(403).json("Not allow!");
        }
        await Question.deleteById(id);

        // Thông báo
        const contentNotice = "Xóa bài viết thành công";
        const typeNotice = `post:deleted`;
        const newNotice = new Notification({
            User_ID: user._id,
            Content: `${contentNotice}`,
            Url: typeNotice,
            Avt: user.avatar
        });
        await newNotice.save();
        user.notifications = user.notifications.concat(newNotice);
        await user.save();
        const listPost = await Question.find().populate('likes').populate("comments").sort('-date');;
        return res.status(200).json({ message: "Deleted", listPost: listPost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: err.messages});
    }
};


// Like function
exports.likeQuestion = async (req, res) => {
    const { id } = req.params;
    const User_ID = req.body.User_ID;
    try {
        const user = req.user;
        const post = await Question.findById(id).populate('likes');
        if (!post) {
            return res.status(404).json({ message: "Bài post này không tồn tại" });
        }
        const postOwner = await User.findById(post.User_ID);
        if (user) {
            const like = await Like.findOne({ User_ID: user._id, Post_ID: post._id })
            
            if (!like) {
                let newLike = new Like({
                    User_ID: user._id,
                    User_Name: user.name,
                    Post_ID: id,
                    isLike: true
                });
                await newLike.save();
                if(postOwner.idRank == false){
                    console.log("Chưa có id rank");
                   let newRank = await new Rank({uid: postOwner._id});
                   postOwner.idRank = newRank._id.toString();
                  await newRank.save();
                  await postOwner.save();
                }
                const rank = await Rank.findOne({uid: postOwner._id});
                if(rank){
                    console.log("cộng điểm");
                    rank.point = rank.point + 1;
                    await rank.save();
                }

                if (postOwner._id.toString() !== user._id.toString()) {
                    // Thông báo
                    let contentNotice = `${user.name} đã like bài viết của bạn`;
                    let typeNotice = `${id}`;
                    let newNotice = new Notification({
                        User_ID: post.User_ID,
                        Content: `${contentNotice}`,
                        Url: typeNotice,
                        Avt: postOwner.avatar
                    });
                    await newNotice.save();

                    contentNotice = `Bạn đã like bài viết của ${postOwner.name}`;
                    typeNotice = `post/${id}`;
                    newNotice = new Notification({
                        User_ID: user._id,
                        Content: `${contentNotice}`,
                        Url: typeNotice,
                        Avt: user.avatar
                    });
                    await newNotice.save();
                }

            } else if (like.isLike == true) {
                like.isLike = false;
                await like.save();
                await Like.findByIdAndDelete(like._id);
                const rank = await Rank.findOne({uid: post.User_ID});
                if(rank){
                    console.log("trừ điểm");
                    rank.point = rank.point - 1;
                    await rank.save();
                }
            } else {
                like.isLike = true;
                await like.save();
            }
        }

        const likeList = await Like.find({ Post_ID: id });
        post.likes = likeList;
        await post.save();
        const refpost = await Question.findById(id).populate('likes');
        length = likeList.length;
        return res.status(200).json({ message: "Quantity Like", "quantityLike": length, "listLike": likeList, post: refpost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Lost connect!" });
    }
}

exports.getLike = async (req, res) => {
    const { id } = req.params;
    try {
        const like = await Like.find({ Post_ID: id }).sort('-date');;
        const length = like.length;
        return res.status(200).json({ message: "Quantity Like", "quantityLike": length, "listLike": like });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Lost connect!" });
    }
}

exports.getTotalLike = async (req, res) => {
    try {
        const like = await Like.find();
        const length = like.length;
        return res.status(200).json({ message: "Quantity Like", "total": length, "listLike": like });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Lost connect!" });
    }
}



