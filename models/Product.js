const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema =  new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        default: ''
    },
    body: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: ''
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    date: {
        type: String,
        default: new Date()
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;