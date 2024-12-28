const express = require("express");

const clientUserController = require("../controllers/client-user.controller");

const router = express.Router();

router.post("/contact-us", clientUserController.contactUs);

module.exports = router;
