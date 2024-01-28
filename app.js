
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
// const multer = require('multer');
// const mongoose = require('mongoose');

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const { Result } = require('express-validator');

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, req.userId + '-' + file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/png' ||
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/jpeg') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));


app.use(bodyParser.json());
app.use(express.static('images'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Controll-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Controll-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/user", userRoutes);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({
        message: message
    });
});

module.exports = app;


















// mongoose.connect('mongodb+srv://nandlal:wvtbvkDhdmKiyzBy@cluster0.qaa1jk5.mongodb.net/instagramClone?retryWrites=true&w=majority')
//     .then(result => {
//         app.listen(3001, () => {
//             console.log("I am building social media app like Instagram");
//         })
//     })
//     .catch(err => {
//         console.log(err);
//     });




// wvtbvkDhdmKiyzBy ----password mongodb