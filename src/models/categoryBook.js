const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');

const BookCategoryShema = new mongoose.Schema({
    name:{
        type: String
    },
    slideImg: {
        type: String
    }
});

BookCategoryShema.plugin(mongoose_delete, { deletedAt : true });

const BookCategory = mongoose.model("BookCategory", BookCategoryShema);
module.exports = BookCategory;