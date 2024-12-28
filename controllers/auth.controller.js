const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const TempUser = require("../models/temp-user.model");
const mailer = require("../config/mailer");
const mailOptions = require("../util/email-options");

const JWT_SECRET = process.env.JWT_SECRET || "Major-Lock";

// Joi validation schema
const userSignupSchema = Joi.object({
  username: Joi.string().min(4).max(30).required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow(""),
  country: Joi.string(),
  address: Joi.string().allow(""),
  dob: Joi.string().allow(""),
  cur: Joi.string(),
});

async function userLogin(req, res) {
  const { email, password } = req.body;

  // Perform a case-insensitive search for the username
  const user = await User.findOne({
    email: { $regex: `^${email}$`, $options: "i" },
  });
  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });
  if (user.status === "Suspended")
    return res.status(400).json({ error: "User suspended, contact support." });

  if (password !== user.password)
    return res.status(400).json({ error: "Invalid email or password" });

  const token = jwt.sign(
    { id: user._id, username: user.username, role: "user" },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
}

async function userSignup(req, res, next) {
  try {
    // Validate request body using Joi
    const { error } = userSignupSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { username, email } = req.body;

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // const existingTempUser = await TempUser.findOne({ email });
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Generate a random 6-digit security code
    // const securityCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      ...req.body,
      practiceBal: 5500,
    });
    await user.save();

    // Send the security code to the user's email
    mailer.contactDefault(mailOptions.createAccount(user));

    res.status(200).json({
      message: "Signup successful. Proceed to Sign in.",
    });
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const email = req.body.email;
    const securityCode = req.body.securityCode;

    const tempUser = await TempUser.findOne({ email, securityCode });
    if (!tempUser) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification code" });
    }

    console.log(tempUser);

    // Move the user from TempUser to User collection
    const newUser = new User({
      ...tempUser,
    });
    await newUser.save();

    // Delete the temp user
    await TempUser.deleteOne({ email });

    res.status(200).json({
      message: "Email verified successfully. Please Sign in",
    });
  } catch (error) {
    next(error);
  }
}

async function adminLogin(req, res) {
  const { username, password } = req.body;
  const admin = await Admin.findOne({
    username: { $regex: `^${username}$`, $options: "i" },
  });

  if (!admin) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign(
    { id: admin._id, username: admin.username, role: "admin" },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
}

async function adminSignup(req, res) {
  const { username, password } = req.body;
  let admin = await Admin.findOne({ username });

  if (admin) return res.status(400).json({ error: "User already exists" });

  // const hashedPassword = await bcrypt.hash(password, 12);
  admin = new Admin({ username, password });
  await admin.save();

  const token = jwt.sign(
    { id: admin._id, username: admin.username },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
}

module.exports = {
  userLogin,
  userSignup,
  verifyEmail,
  adminLogin,
  adminSignup,
};
