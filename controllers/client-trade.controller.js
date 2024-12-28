const User = require("../models/user.model");
const Trade = require("../models/trade.model");

function getRandomResult(multiplier) {
  const random = Math.floor(Math.random() * 7);
  return random < multiplier ? "loss" : "profit";
}

async function getTrades(req, res, next) {
  const user = req.user;
  const { page = 1, limit = 10 } = req.query;

  try {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const query = { userId: user.id };
    const skip = (page - 1) * limit;

    // Fetch practice and real trades with pagination
    const [practiceTrades, realTrades, practiceTotal, realTotal] =
      await Promise.all([
        Trade.find({ ...query, acctype: "practice" })
          .sort({ date: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Trade.find({ ...query, acctype: "real" })
          .sort({ date: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Trade.countDocuments({ ...query, acctype: "practice" }),
        Trade.countDocuments({ ...query, acctype: "real" }),
      ]);

    if (practiceTotal === 0 && realTotal === 0) {
      return res
        .status(200)
        .json({ message: "No trades found for this user." });
    }

    res.status(200).json({
      message: "Trades retrieved successfully.",
      practiceTrades: {
        data: practiceTrades,
        total: practiceTotal,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(practiceTotal / limit),
      },
      realTrades: {
        data: realTrades,
        total: realTotal,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(realTotal / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function executeTrade(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    const updateNumber = +req.body.updateAt;
    const multiplier = +req.body.multiplier;

    // Validate account type
    if (!["practice", "real"].includes(req.body.acctype)) {
      return res.status(400).json({ error: "Invalid trade account type" });
    }
    const trade = new Trade({
      ...req.body,
      updateAt: Date.now() + updateNumber * 1000,
      userId: user._id,
      status: "Pending",
    });

    await trade.save();

    // Schedule trade expiration and balance updates
    const interval = setInterval(async () => {
      try {
        const now = new Date();
        const expiredDocs = await Trade.find({
          updateAt: { $lte: now },
          status: "Pending",
          amount: parseFloat(req.body.amount), // Fallback to 0 if NaN
        });

        if (expiredDocs.length === 0) {
          clearInterval(interval); // Clear the interval if no expired trades remain
          return;
        }

        for (const doc of expiredDocs) {
          if (doc.acctype === "practice") {
            doc.status = getRandomResult(2);
            if (doc.status === "loss") {
              await User.updateOne(
                { _id: user._id },
                { $inc: { practiceBal: -doc.amount } }
              );
            } else {
              await User.updateOne(
                { _id: user._id },
                { $inc: { practiceBal: doc.amount * multiplier } }
              );
            }
          } else if (doc.acctype === "real") {
            doc.status = getRandomResult(4);
            if (doc.status === "loss") {
              await User.updateOne(
                { _id: user._id },
                { $inc: { realBal: -doc.amount } }
              );
            } else {
              await User.updateOne(
                { _id: user._id },
                { $inc: { realBal: doc.amount * multiplier } }
              );
            }
          }

          await doc.save(); // Save the updated trade document
          console.log(`Updated trade document with ID: ${doc._id}`);
        }
      } catch (error) {
        console.error("Error updating expired trades:", error);
      }
    }, 30 * 1000);

    res.status(200).json({ message: "Trade executed successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = { getTrades, executeTrade };
