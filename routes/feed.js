
const express = require('express');

const router = express.Router();
const { body } = require('express-validator');

const feedController = require("../controllers/feed");
const isAuth = require('../middleware/is-auth');
const upload = require('../middleware/multer');

// GET --  /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

// POST --  /feed/post
router.post("/post", isAuth, upload.single('image'), feedController.createPost);

// PUT --  /feed/post/:postId
router.put("/post/:postId", isAuth, feedController.updatePost);

// GET --  /feed/post/:postId
router.get("/post/:postId", isAuth, feedController.getPost);

// POST -- /feed/post/updateLike ---- update likes count, User like the post  
router.post("/post/updateLike", isAuth, feedController.updateLikes);

// DELETE --  /feed/post/:postId
router.delete("/post/:postId", isAuth, feedController.deletePost);


module.exports = router;