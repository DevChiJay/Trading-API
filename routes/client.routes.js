const express = require("express");

const clientTradeController = require("../controllers/client-trade.controller");
const clientTrxController = require("../controllers/client-transaction.controller");
const clientUserController = require("../controllers/client-user.controller");
const imageUpload = require('../middlewares/image-upload')

const router = express.Router();

router.get("/trades", clientTradeController.getTrades);

router.post("/execute-trade", clientTradeController.executeTrade);

router.get("/transactions", clientTrxController.getTransactions);

router.post("/deposit", clientTrxController.depositFund);

router.post("/withdraw", clientTrxController.withdrawFund);

router.get("/user", clientUserController.getUser);

router.post("/update",  clientUserController.updateUser);

router.post("/upload", imageUpload, clientUserController.uploadID);

router.post("/reset-pass", clientUserController.resetPassword);

router.get("/reff", clientUserController.userReff);

module.exports = router;
