const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    error_message: String,
    description: String,
    views: { type: Number, default: 0 },
    priority: {
        type: String,
        Enum: ['high', 'average', 'low'],
        default: 'average'
    },
    Environment: String,
    root_cause: [String],
    resolutions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'resolutions'
    }],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true });

model = mongoose.model('err_definitions', schema);



module.exports = model