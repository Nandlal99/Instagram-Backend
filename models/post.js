
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [],
    comments: []
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);