const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    trxId: String,
    type: String,
    amount: { type: Number, default: 0 },
    method: String,
    walletAddress: String,
    status: { type: String, default: "Pending" },
    date: {
      type: Date,
      default: () => Date.now(),
    },
  },
  { collection: "transactions" }
);

TransactionSchema.virtual("fmDate").get(function () {
  return this.date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
});

TransactionSchema.virtual("fmAmount").get(function () {
  return this.amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});

TransactionSchema.statics.getAllForUser = function (user) {
  return this.find({
    username: user,
  }).sort({ date: -1 });
};

module.exports = mongoose.model("Transaction", TransactionSchema);
