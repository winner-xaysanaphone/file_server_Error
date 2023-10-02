const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    system: String,
    err_definitions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'err_definitions'
        }
    ],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
}, { timestamps: true });

model = mongoose.model('module', schema);
module.exports = model