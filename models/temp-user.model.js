const mongoose = require("mongoose");

const TempSchema = mongoose.Schema(
  {
    username: String,
    password: String,
    fullName: String,
    email: String,
    dob: Date,
    gender: String,
    idType: String,
    image: String,
    accLevel: String,
    reff: String,
    regDate: {
      type: Date,
      default: () => Date.now(),
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    cur: {
      type: String,
      default: "USD",
    },
    realBal: {
      type: Number,
      default: 0,
    },
    practiceBal: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Inactive",
    },
    securityCode: String, // Code sent for verification
    createdAt: { type: Date, default: () => Date.now(), expires: 300 }, // Expires in 5 minutes
  },
  { collection: "temps" }
);

module.exports = mongoose.model("Temp", TempSchema);
