
const { validationResult } = require('express-validator');

const path = require('path');
const fs = require('fs');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
    try {
        const result = await Post.find();
        const data = await Post.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "User_details"
                }
            },
            {
                $addFields: {
                    User_details: {
                        $first: '$User_details'
                    }
                }
            },
            {
                $addFields: {
                    "User_details.profilePicURL": { $concat: ["http://localhost:3001/", "$User_details.profilePic"] }
                }
            },
            {
                $addFields: {
                    imageURL: { $concat: ["http://localhost:3001/", "$imageUrl"] }
                }
            },
            {
                $project: {
                    _id: 1,
                    imageUrl: 1,
                    imageURL: 1,
                    content: 1,
                    createdBy: 1,
                    likes: 1,
                    comments: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    User_details: {
                        name: 1,
                        email: 1,
                        profilePic: 1,
                        profilePicURL: 1,
                    }
                }
            }
        ]);

        // console.log(data);
        // console.log("http://localhost:3001/" + data?.post[0]?.imageUrl);
        // data.post.map((value) => {
        //     value.imageURL = "http://localhost:3001/" + value.imageURL;
        // });

        res.status(200).json({
            message: "Fetched posts successfully!",
            post: data
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error("No image file provided");
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.userId + "-" + req.file.originalname;
    const content = req.body.content;
    const post = Post({
        content: content,
        imageUrl: imageUrl,
        createdBy: req.userId,
    })

    try {
        await post.save();
        const user = await User.findById(req.userId);
        user.posts.push(post);
        await user.save();
        res.status(201).json({
            message: "Post created successfully",
            post: post,
            creator: {
                _id: user._id,
                name: user.name
            }
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        throw error;
    }
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path.replace("\\", "/");
    }
    if (!imageUrl) {
        const error = new Error("No file picked!");
        error.statusCode = 422;
        throw error;
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("Could not find post!");
            error.statusCode = 404;
            throw error;
        }
        if (post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.content = content;
        post.imageUrl = imageUrl;
        const result = await post.save();
        res.status(200).json({
            message: "Post updated successfully!",
            post: result
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("Could not find post!");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: "Post fetch successfully!",
            post: post
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    // console.log(postId);
    try {
        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error("Could not find post!");
            error.statusCode = 404;
            throw error;
        }
        // console.log(post.createdBy);
        if (post.createdBy.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        // console.log(post);
        clearImage(post.imageUrl);
        await Post.findByIdAndDelete(postId);

        const user = await User.findById(req.userId);
        user.posts.pull(postId);
        await user.save();

        res.status(200).json({
            message: "Post deleted successfully!",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateLikes = async (req, res, next) => {
    const postId = req.body.postId;
    if (!postId) {
        const error = new Error("Data is incorrect !!");
        error.statusCode = 422;
        throw error;
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("Could not find post !!!");
            error.statusCode = 404;
            throw error;
        }
        const userId = req.userId;
        const result = await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
        res.status(200).json({
            message: "Successfully like the post!",
            post: result
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

const clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, err => {
        console.log(err);
    });
};