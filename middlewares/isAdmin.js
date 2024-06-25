const isLoggedIn = require("./isLoggedIn");
const User = require("../models/usermodel");

const isAdmin = async (req, res, next) => {
    try {
        // First, check if the user is logged in
        await isLoggedIn(req, res, async () => {
            // Fetch the user based on the ID set in the isLoggedIn middleware
            const user = await User.findById(req.userAuthId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check if the user is an admin
            if (user.roles !== "admin") {
                return res.status(403).json({ message: "Access denied. Admin only" });
            }

            next();
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = isAdmin;