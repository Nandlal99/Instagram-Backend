
const express = require('express');

const router = express.Router();
const { body } = require('express-validator');

const feedController = require("../controllers/feed");
const isAuth = require('../middleware/is-auth');
const upload = require('../middleware/multer');

// GET --  /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

// POST --  /feed/post
router.post("/post", isAuth, upload.single('image'), [
    body('content').trim().isLength({ min: 5 })
], feedController.createPost);

// PUT --  /feed/post/:postId
router.put("/post/:postId", isAuth, [
    body('content').trim().isLength({ min: 5 })
], feedController.updatePost);

// GET --  /feed/post/:postId
router.get("/post/:postId", isAuth, feedController.getPost);

// DELETE --  /feed/post/:postId
router.delete("/post/:postId", isAuth, feedController.deletePost);


module.exports = router;