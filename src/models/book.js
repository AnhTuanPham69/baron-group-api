// Comment model 
// Author: Tuanpham

// Book Model 
// Author: Tuanpham

const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');

const bookShema = new mongoose.Schema({
    uid: {
        type: String,
        required: [true,"Chưa cung cấp ID của người đăng"]
    },
    seller:{
        type: String
    },
    name: {
        type: String,
        required: [true,"Bạn chưa nhập tên của sách"]
    },
    phone: {
        type: String
    },
    address:{
        type: String
    },
    issuing_company: {
        type: String
    },
    publishing_date:{
        type: String
    },
    price: {
        type: String,
        required: [true,"Bạn chưa nhập giá của sách"]
    },
    isChecked:{
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "new"
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        required: [true,"Bạn chưa cung cấp hình ảnh của sách"]
    }
});

bookShema.plugin(mongoose_delete, { deletedAt : true });

const Book = mongoose.model("Book", bookShema);
module.exports = Book;