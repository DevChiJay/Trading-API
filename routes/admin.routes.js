const express = require("express");

const adminTradeCtrl = require("../controllers/admin-trade.controller");
const adminTrxCtrl = require("../controllers/admin-transaction.controller");
const adminUserCtrl = require("../controllers/admin-user.controller");

const router = express.Router();

router.get("/user-trades/:userId", adminTradeCtrl.getUserTrades);

router.delete("/delete-trade/:id", adminTradeCtrl.deleteTrade);

router.get("/transactions/:userId", adminTrxCtrl.getUserTransactions);

router.get("/pending/transactions", adminTrxCtrl.getPendingTransactions);

router.post("/approve-trx/:id", adminTrxCtrl.approveTransaction);

router.delete("/delete-trx/:id", adminTrxCtrl.deleteTransaction);

router.get("/users", adminUserCtrl.getAllUsers);

router.get("/user/:id", adminUserCtrl.getUser);

router.post("/update-user/:id", adminUserCtrl.updateUser);

router.delete("/delete/:id", adminUserCtrl.deleteUser);

router.post("/contact-user", adminUserCtrl.contactUser);

router.get("/users-for-approval", adminUserCtrl.getApproval);

router.post("/activate/:id", adminUserCtrl.activateUser);

router.post("/suspend/:userId", adminUserCtrl.suspendUser);

router.post("/add-fund/:userId", adminUserCtrl.fundUser);

module.exports = router;
