const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    orders: [{
        title: {
            type: String,
            require: true
        },
        price: {
            type: String,
            require: true
        },
        count: {
            type: Number,
            require: true
        }
    }]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;