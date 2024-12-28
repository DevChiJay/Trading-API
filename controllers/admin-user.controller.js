const fs = require("fs");
const path = require("path");
const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const Trade = require("../models/trade.model");
const Trx = require("../models/transaction.model");
const mailer = require("../config/mailer");
const mailOptions = require("../util/email-options");

async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

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
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
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

async function getAllUsers(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit).lean();

    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      message: "Users fetched successfully.",
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await Trade.deleteMany({ userId: user._id });
    await Trx.deleteMany({ userId: user._id });

    // if (user.image) {
    //   const photoPath = path.join(__dirname, "../user-data/images", user.image);
    //   fs.unlink(photoPath, (err) => {
    //     if (err && err.code !== "ENOENT") {
    //       console.error("Error deleting photo:", err);
    //     } else {
    //       console.log("Photo deleted successfully or does not exist.");
    //     }
    //   });
    // }

    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
      message: "User and associated data deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
}

async function contactUser(req, res, next) {
  const adminOptions = {
    ...req.body,
    detail: "<p>This message was sent from our service desk!</p>",
  };
  try {
    await mailer.contactDefault(mailOptions.contactUser(adminOptions));
    return res.status(200).json({
      message: "Email sent successfully.",
    });
  } catch (error) {
    next(error);
  }
}

async function getApproval(req, res, next) {
  try {
    const usersForApproval = await User.find({
      idType: { $ne: null }, // Users with a non-null idType
      status: { $ne: "Active" }, // Users whose status is not 'Active'
    });

    if (usersForApproval.length === 0) {
      return res.status(404).json({
        message: "No users found for approval.",
      });
    }

    return res.status(200).json({
      message: "Users found for approval.",
      users: usersForApproval,
    });
  } catch (error) {
    console.error("Error fetching users for approval:", error);
    return next(error);
  }
}

async function activateUser(req, res, next) {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const activeUser = await User.findByIdAndUpdate(
      userId,
      { status: "Active" },
      { new: true, runValidators: true }
    );

    if (!activeUser) {
      return res.status(404).json({ error: "User not found" });
    }
    mailer.contactDefault(mailOptions.activateUser(activeUser));

    return res.status(200).json({
      message: "User activated successfully.",
    });
  } catch (error) {
    console.error("Error activating user:", error.message);
    next(error);
  }
}

async function suspendUser(req, res, next) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const suspendedUser = await User.findByIdAndUpdate(
      userId,
      { status: "Suspended" },
      { new: true, runValidators: true } // Ensure updated document is returned and validators are run
    );

    if (!suspendedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    mailer.contactDefault(mailOptions.blockAccount(suspendedUser));

    return res.status(200).json({
      message: "User suspended successfully.",
    });
  } catch (error) {
    console.error("Error suspending user:", error);
    return next(error);
  }
}

async function fundUser(req, res, next) {
  try {
    const { userId } = req.params;
    const { realBal, practiceBal } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    if (realBal == null && practiceBal == null) {
      return res.status(400).json({
        message: "Either realBal or practiceBal must be provided.",
      });
    }

    const realBalToAdd = parseFloat(realBal) || 0;
    const practiceBalToAdd = parseFloat(practiceBal) || 0;

    // Find the user and update their balances
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          realBal: realBalToAdd,
          practiceBal: practiceBalToAdd,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    mailer.contactDefault(mailOptions.creditAccount(updatedUser, ));

    return res.status(200).json({
      message: "User balances updated successfully.",
      user: {
        id: updatedUser._id,
        realBal: updatedUser.realBal,
        practiceBal: updatedUser.practiceBal,
      },
    });
  } catch (error) {
    console.error("Error funding user:", error);
    return next(error); // Pass error to next middleware
  }
}

module.exports = {
  getUser,
  updateUser,
  getAllUsers,
  deleteUser,
  contactUser,
  getApproval,
  activateUser,
  suspendUser,
  fundUser,
};
