
const { validationResult } = require("express-validator");

const User = require("../models/user");
const Post = require("../models/post");
// const uploadOnCloudinary = require("../utils/cloudinary");

exports.updateUserDetail = async (req, res, next) => {
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
    console.log(req.file);
    const { name, description } = req.body;


    // const avatarLocalPath = req.file?.path;
    // if (!avatarLocalPath) {
    //     const error = new Error("No image file provided");
    //     error.statusCode = 422;
    //     throw error;
    // }
    // const avatar = await uploadOnCloudinary(avatarLocalPath);
    // if (!avatar) {
    //     const error = new Error("No image file provided");
    //     error.statusCode = 422;
    //     throw error;
    // }
    // console.log(avatar.url);


    const profilePic = req.userId + "-" + req.file.originalname;
    const userId = req?.userId;
    const userUpdateFields = {
        name: name,
        description: description,
        profilePic: profilePic
    };
    try {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error("Could not find user!");
            error.statusCode = 404;
            throw error;
        }
        const updatedUser = await User.updateOne(
            { _id: userId },
            {
                $set: userUpdateFields,
                $currentDate: { lastModified: true }
            }
        );
        // console.log(updatedUser);
        res.status(200).json({
            message: "User update successfully !!"
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getUserDetail = async (req, res, next) => {
    const userId = req?.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error("Could not find user!");
            error.statusCode = 404;
            throw error;
        }

        const data = await User.aggregate([
            {
                $match: {
                    name: user?.name,
                    email: user?.email
                }
            },
            {
                $lookup:
                {
                    from: "posts",
                    localField: "_id",
                    foreignField: "createdBy",
                    as: "post_details"
                }
            },
            // {
            //     $addFields: {
            //         post_details: {
            //             $first: '$post_details'
            //         }
            //     }
            // },
            // {
            //     $addFields: {
            //         profilePicURL: { $concat: ["http://localhost:3001/", "$profilePic"] }
            //     }
            // },
            // {
            //     $addFields: {
            //         "post_details.imageURL": { $concat: ["http://localhost:3001/", "$post_details.imageUrl"] }
            //     }
            // },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    description: 1,
                    profilePic: 1,
                    follower: 1,
                    following: 1,
                    posts: 1,
                    post_details: 1,
                }
            }
        ]);

        // console.log(data[0]);
        const result = { ...data[0], baseURL: "http://localhost:3001/" };
        // console.log(result);

        res.status(200).json({
            message: "User fetch successfull !!!",
            user: result
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}