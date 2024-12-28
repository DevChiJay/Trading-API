const mongoose = require("mongoose");

const TradeSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    acctype: String,
    asset: String,
    type: String,
    amount: {
      type: Number,
      default: 0,
    },
    status: String,
    date: {
      type: Date,
      default: () => Date.now(),
    },
    updateAt: {
      type: Date,
      default: () => Date.now() + 30 * 1000,
    },
  },
  { collection: "trades" }
);

TradeSchema.virtual("fmDate").get(function () {
  return this.date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
});

TradeSchema.virtual("fmAmount").get(function () {
  return this.amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});

module.exports = mongoose.model("Trade", TradeSchema);
