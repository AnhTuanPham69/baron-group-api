// Post Controller 
// Author: Tuanpham

//Firebase data
const db = require('../config/firebaseService');
const docRef = db.collection('users');

// import Model
const Question = require('../models/question');

exports.postQuestion = async (req, res) => {
    let User_ID = req.body.User_ID;
    try {
        docRef.doc(User_ID).get().then((data) => {
            if (data.exists) {
            //    const user = data.data();
               const newPost = new Question(req.body);
               newPost.save();
                return res.status(200).json({ message: "Getting success!", "response": newPost});
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
        
        let listpost = await Question.find();
        return res.status(200).json({ message: "Getting success!", "List Post": listpost});

    } catch(err) {
        return res.status(500).json({ message: "Something is wrong!", err: err });
    }
}

exports.getQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        
        let question = await Question.findOne({_id: id});
        return res.status(200).json({ message: "Getting success!", "List Post": question});

    } catch(err) {
        return res.status(500).json({ message: "Something is wrong!", err: err });
    }
}