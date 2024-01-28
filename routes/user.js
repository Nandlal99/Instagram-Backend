


const express = require('express');
const router = express.Router();

const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");
const upload = require("../middleware/multer");

// Post -- update the user details
router.post("/edit", isAuth, upload.single('profilePic'), userController.updateUserDetail);

router.get("/details", isAuth, userController.getUserDetail);

module.exports = router;