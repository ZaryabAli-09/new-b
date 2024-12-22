const express = require("express");
const router = express.Router();
const User = require("../../models/user.models.js");
const {
  verifyUser,
  verifyAdmin,
} = require("../../middlewares/auth.middlewares.js");
// Admin route to get all users

router.get("/get", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Do not return passwords

    res.status(200).json({
      message: "Retrieved users successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:userId", verifyAdmin, async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    // Update user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/update/:userId", verifyAdmin, async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const updateFields = {};
    if (req.body.user_role !== undefined) {
      updateFields.user_role = req.body.user_role;
    }
    if (req.body.hasAccess !== undefined) {
      updateFields.hasAccess = req.body.hasAccess;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
