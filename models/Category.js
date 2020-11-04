const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
        type: String,
        require: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    date: {
        type: String,
        default: new Date()
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;