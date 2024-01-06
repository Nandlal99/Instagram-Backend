
const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.updateUserDetail = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        throw error;
    }
    // if (!req.file) {
    //     const error = new Error("No image file provided");
    //     error.statusCode = 422;
    //     throw error;
    // }
    const { name, description } = req.body;
    // const profilePic = req.userId + "-" + req.file.originalname;
    const userId = req?.userId;
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
                $set: { name: name, description: description },
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
        res.status(200).json({
            message: "User fetch successfull !!!",
            user: user
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}