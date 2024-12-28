const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
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
  },
  { collection: "users" }
);

UserSchema.statics.findByUsername = function (user) {
  return this.findOne({ username: new RegExp(user, "i") });
};

UserSchema.virtual("fmRealBal").get(function () {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(this.realBal);
});

UserSchema.virtual("fmPracticeBal").get(function () {
  return this.practiceBal.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});

UserSchema.virtual("imageUrl").get(function () {
  return `/users/assets/images/${this.image}`;
});

module.exports = mongoose.model("User", UserSchema);
