
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    profilePic: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    follower: [
        {
            type: String,
            default: ""
        }
    ],
    following: [
        {
            type: String,
            default: ""
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);