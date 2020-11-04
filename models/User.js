const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    fullName: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    address: {
        type: String,
        default: ''
    },
    rol: {
        type: String,
        default: 'member'
    },
    factors: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    date: {
        type: String,
        default: new Date()
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;