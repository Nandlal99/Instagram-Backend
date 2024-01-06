
const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const User = require("../models/user");

const authController = require("../controllers/auth");

// PUT --  /auth/signup
router.put("/signup", authController.signup);

// POST --  /auth/login
router.post("/login", authController.login);

module.exports = router;