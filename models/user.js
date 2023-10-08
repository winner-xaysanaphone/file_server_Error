const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: String,
    teller_id: { type: String, unique: true, required: true },
    tel: String,
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['root', 'user'],
        default: 'user'
    },
    branch_code: {
        type: String,
        required: true,
        default: '0'
    },
    department: String,
    status: {
        type: String,
        enum: ["lock", "normal", "disabled"],
        default: 'normal'
    }
}, { timestamps: true });

model = mongoose.model('user', schema);
module.exports = model