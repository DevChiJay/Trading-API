const express = require("express");

const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/auth/login", authController.userLogin);

router.post('/auth/signup', authController.userSignup);

router.post('/auth/verify', authController.verifyEmail);

router.post("/admin/login", authController.adminLogin);

router.post("/admin/signup", authController.adminSignup);

module.exports = router;
