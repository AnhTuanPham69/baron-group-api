// import Model
const Question = require('../models/question');
const Like = require('../models/like');
const User = require('../models/user');
const Analysis = require('../models/analysis');
const Book = require('../models/book');
const BookCategory = require('../models/categoryBook');


//Date
const now = new Date();

exports.postBook = async (req, res) => {
    let User_ID = req.body.User_ID;
    try {
        const user = req.user;
        if(!user){
            return res.status(500).json({ message: "User không được cung cấp"});
        }
        const book = req.body;
         book.uid = user._id;
        const newBook = new Book(book);
        await newBook.save();
        
        return res.status(200).json({
            message: "Posting book success",
            book: newBook
        })
    } catch (err) {
        return res.status(500).json({ message: "Something is wrong!", err: err.message });
    }
}

exports.createCategory = async (req, res) => {
    try {
        const user = req.user;
        if(!user){
            return res.status(500).json({ message: "User không được cung cấp"});
        }
        const book = req.body;
        const newCategory = new BookCategory(book);
        await newCategory.save();
        return res.status(200).json({
            message: "Posting category's book success",
            category: newCategory
        })
    } catch (err) {
        return res.status(500).json({ message: "Something is wrong!", err: err.message });
    }
}

exports.getListCategory = async (req, res) => {
    try {
        const user = req.user;
        if(!user){
            return res.status(403).json({ message: "Not Allowed!"});
        }

        const listCategory = await BookCategory.find();
        
        return res.status(200).json({
            message: "getting category's book success",
            category: listCategory
        })
    } catch (err) {
        return res.status(500).json({ message: "Something is wrong!", err: err.message });
    }
}

exports.getBook = async (req, res) => {
    try {
        const book = await Book.find();
        
        return res.status(200).json({
            message: "Getting book success",
            book: book
        })
    } catch (err) {
        return res.status(500).json({ message: "Something is wrong!", err: err.message });
    }
}

exports.getOneBook = async (req, res) => {
    const id = req.params.id;
    try {
        const book = await Book.findById(id);
        if(!book){
            return res.status(404).json({
                message: "This book does not exist!"
            })
        }
        return res.status(200).json({
            message: "Getting book success",
            book: book
        })
    } catch (err) {
        return res.status(500).json({ message: "Something is wrong!", err: err.message });
    }
}

exports.updateBook = async (req, res) => {
    const id = req.params.id;
    const update = req.body
    console.log(update);
    try {

        let book = await Book.findById(id);
        if(!book){
            return res.status(404).json({
                message: "This book does not exist!"
            })
        }
        await Book.findByIdAndUpdate(id,{
            $set: update
        });

        book = await Book.findById(id);
        return res.status(200).json({
            message: "Updating book success",
            book: book
        })
    } catch (err) {
        return res.status(500).json({ message: "Something is wrong!", err: err.message });
    }
}

exports.deleteBook = async (req, res) => {
    const id = req.params.id;
    try {
        await Book.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Deleting book success"
        })
    } catch (err) {
        return res.status(500).json({ message: "Something is wrong!", err: err.message });
    }
}
