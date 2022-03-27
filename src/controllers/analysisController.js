const Book = require("../models/book");
const Comment = require("../models/comment");
const Like = require("../models/like");
const Question = require("../models/question");
const Rank = require("../models/rank");
const Tutor = require("../models/tutor");
const User = require("../models/user")

const year = new Date().getFullYear();

exports.overview = async (req, res) => {
    try {
        const userLength = await User.find();
        const tutorLength = await Tutor.find();
        const postLength = await Question.find();
        const likeLength = await Like.find();
        const commentLength = await Comment.find();
        const bookLength = await Book.find();
        return res.status(200).json({
            user: {
                length: userLength.length,
                data: userLength
            },
            tutor: {
                length: tutorLength.length,
                data: tutorLength
            },
            post: {
                length: postLength.length,
                data: postLength
            },
            like: {
                length: likeLength.length,
                data: likeLength
            },
            comment: {
                length: commentLength.length,
                data: commentLength
            },
            book: {
                length: bookLength.length,
                data: bookLength
            },
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "something is wrong!", error: error.messages });
    }

}

exports.getRank = async (req, res) => {
    try {
        const rank = await Rank.find().sort({point: -1});
        return res.status(200).json({
           rank: rank
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "something is wrong!", error: error.messages });
    }

}

exports.analysisChart = async (req, res) => {
    try {

        // let dataPerMonth = [];
        let postAna = [];
        let likeAna = [];
        let bookAna = [];
        let commentAna = [];
        console.log(year);
        for (let index = 1; index <= 12; index++) {
            let start = new Date(year, (index - 1), 1);
            let end = new Date(year, index, 1);

            const post = await Question.find({
                "Date": {
                    "$gte": start,
                    "$lte": end
                }
            });

            const book = await Book.find({
                "date": {
                    "$gte": start,
                    "$lte": end
                }
            });

            const like = await Like.find({
                "Date": {
                    "$gte": start,
                    "$lte": end
                }
            });

            const comment = await Comment.find({
                "Date": {
                    "$gte": start,
                    "$lte": end
                }
            });
            postAna = postAna.concat(post.length);
            likeAna = likeAna.concat(like.length);
            commentAna = commentAna.concat(comment.length);
            bookAna = bookAna.concat(book.length);
        }
        return res.status(200).json({
            post: postAna,
            like: likeAna,
            comment: commentAna,
            book: bookAna,
            year: year,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "something is wrong!", error: error.messages });
    }

}