const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    file_path: {
        type: String,
        unique: true,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    dislike: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
}, { timestamps: true });

model = mongoose.model('resolutions', schema);
module.exports = model