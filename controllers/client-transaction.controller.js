const User = require("../models/user.model");
const Trx = require("../models/transaction.model");

const randNum = Math.floor(1000000 + Math.random() * 9000000);

async function getTransactions(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
    const userId = req.user.id;
    const query = { userId };

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
    next(err)
  }
}

async function depositFund(req, res, next) {
  try {
    // Validate request body
    if (!req.body.amount || req.body.amount <= 0) {
      return res.status(400).json({ error: "Invalid deposit amount" });
    }

    const deposit = new Trx({
      ...req.body,
      userId: req.user.id,
      status: "Pending",
      trxId: "TD20" + randNum,
      type: "deposit",
    });

    await deposit.save();

    return res.status(200).json({
      message: "Deposit successful, please wait for confirmation",
      deposit,
    });
  } catch (err) {
    next(err)
  }
}

async function withdrawFund(req, res, next) {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Invalid withdrawal amount. Please enter a valid amount.",
      });
    }

    // Atomic balance check and decrement
    const user = await User.findOneAndUpdate(
      { _id: req.user.id, realBal: { $gte: amount } },
      { $inc: { realBal: -amount } },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        error: "Insufficient funds. Please withdraw only available funds.",
      });
    }

    const withdrawal = new Trx({
      ...req.body,
      userId: user._id,
      status: "Pending",
      trxId: "WTR05" + randNum,
      type: "withdrawal",
    });

    await withdrawal.save();

    return res.status(200).json({
      message: "Withdrawal successful, please wait for your funds to arrive.",
      withdrawal,
    });
  } catch (err) {
    next(err)
  }
}

module.exports = { getTransactions, depositFund, withdrawFund };
