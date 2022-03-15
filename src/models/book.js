// Comment model 
// Author: Tuanpham

// Post Model 
// Author: Tuanpham

const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');

const bookShema = new mongoose.Schema({
    User_ID: {
        type: String,
        required: [true,"Chưa cung cấp ID của người đăng"]
    },
    UserName: {
        type: String
    },
    Avatar: {
        type: String
    },
    Name: {
        type: String,
        required: [true,"Bạn chưa nhập tên của sách"]
    },
    Phone: {
        type: String
    },
    Content: {
        type: String
    },
    Price: {
        type: Number,
        required: [true,"Bạn chưa nhập giá của sách"]
    },
    Date: {
        type: Date
    },
    Image: {
        type: String,
        required: [true,"Bạn chưa cung cấp hình ảnh của sách"]
    }
});

bookShema.plugin(mongoose_delete, { deletedAt : true });

const Book = mongoose.model("Book", bookShema);
module.exports = Book;