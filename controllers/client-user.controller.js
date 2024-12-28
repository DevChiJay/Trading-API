const User = require("../models/user.model");
const { transporter } = require("../config/mailer");
const { defaultOptions, contactUsForm } = require("../util/email-options");

async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password field

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User found",
      user,
    });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true } // Return the updated document and validate fields
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function uploadID(req, res, next) {
  try {
    // Check if the idType and image are provided
    const { idType } = req.body;
    const image = req.file;

    if (!idType || !image) {
      return res.status(400).json({ error: "ID type and image are required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user's ID document info
    user.idType = idType;
    user.image = image.filename;
    user.status = "Pending";

    await user.save();

    return res.status(200).json({
      message: "ID uploaded successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "New password required" });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function userReff(req, res, next) {
  const user = req.user;
  const { page = 1, limit = 10 } = req.query;
  const query = { reff: user.username };

  try {
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Calculate pagination values
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select("fullName regDate")
      .skip(skip)
      .limit(Number(limit))
      .sort({ regDate: -1 });

    if (users.length === 0) {
      return res.status(200).json({
        message: "No referred users found.",
      });
    }

    const total = await User.countDocuments(query);

    res.status(200).json({
      reffs: users,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

async function contactUs(req, res, next) {
  const enteredData = {
    ...req.body,
  };
  try {
    await transporter.sendMail(
      defaultOptions("support@wesleyshirley.com.com", contactUsForm(enteredData))
    );

    res.json({ message: "Email Sent Successfully!" });
  } catch (error) {
    console.error("Error in contactUs:", error);
    next(error);
  }
}

module.exports = {
  getUser,
  updateUser,
  uploadID,
  resetPassword,
  userReff,
  contactUs,
};
