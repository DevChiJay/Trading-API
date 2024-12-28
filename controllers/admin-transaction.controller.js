const User = require("../models/user.model");
const Trx = require("../models/transaction.model");
const mailer = require("../config/mailer");
const mailOptions = require("../util/email-options");

async function getUserTransactions(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
    const query = { userId: req.params.userId };

    // Pagination logic
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Trx.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Trx.countDocuments(query),
    ]);

    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found." });
    }

    return res.status(200).json({
      transactions,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

async function getPendingTransactions(req, res, next) {
  try {
    const pendingTransactions = await Trx.find({
      status: "Pending",
    });

    return res.status(200).json({
      message: "Transactions found.",
      pending: pendingTransactions,
    });
  } catch (err) {
    next(err);
  }
}

async function approveTransaction(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    const transaction = await Trx.findById(id);
    const user = await User.findById(transaction.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    transaction.status = "Approved";
    if (transaction.type === "deposit") {
      user.realBal += transaction.amount;
      await Promise.all([user.save(), transaction.save()]);
    } else {
      await transaction.save();
    }
    mailer.contactDefault(mailOptions.approveTransaction(user, transaction));

    return res.status(200).json({
      message: "Transaction approved successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function deleteTransaction(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    const deletedTransaction = await Trx.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUserTransactions,
  getPendingTransactions,
  approveTransaction,
  deleteTransaction,
};
