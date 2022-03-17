const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');

const BookCategoryShema = new mongoose.Schema({
    
});
bookShema.plugin(mongoose_delete, { deletedAt : true });

const BookCategory = mongoose.model("Book", BookCategoryShema);
module.exports = BookCategory;