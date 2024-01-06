
const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, enter data is incorrect!");
        error.statusCode = 422;
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    try {
        const hashedPw = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hashedPw,
            name: name
        });
        const result = await user.save();

        res.status(201).json({
            message: "User created successfully !",
            userId: result._id
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error("A user with this eamil could not be found !");
            error.statusCode = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            const error = new Error("Wrong Password !");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        }, "supersecretkey", { expiresIn: "1h" });
        res.status(200).json({
            message: "Login successfully !",
            token: token,
            userId: user._id.toString()
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};