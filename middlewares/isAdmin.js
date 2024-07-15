const isLoggedIn = require("./isLoggedIn");
const User = require("../models/usermodel");

const isAdmin = async (req, res, next) => {
  try {
    // Call the isLoggedIn middleware to check for authentication first
    await isLoggedIn(req, res, async () => {
      // Inside the callback after successful authentication:
      const userId = req.session.user && req.session.user.id?.toString(); // Access user ID

      // Retrieve user based on the retrieved ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user is an admin
      if (user.roles !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only" });
      }

      // User is logged in and an admin, proceed to the next middleware
      next();
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = isAdmin;