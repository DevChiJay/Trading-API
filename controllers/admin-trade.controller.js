const Trade = require("../models/trade.model");

async function getUserTrades(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
    const query = { userId: req.params.userId };

    // Pagination logic
    const skip = (page - 1) * limit;

    const [trades, total] = await Promise.all([
      Trade.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Trade.countDocuments(query),
    ]);

    if (!trades.length) {
      return res.status(404).json({ message: "No trades found." });
    }

    return res.status(200).json({
      trades,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

async function deleteTrade(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Invalid trade ID" });
    }

    const deletedTrade = await Trade.findByIdAndDelete(id);

    if (!deletedTrade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    return res.status(200).json({
      message: "Trade deleted successfully",
    });
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getUserTrades,
  deleteTrade,
};
