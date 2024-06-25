const verifyToken = require("../utils/verifytoken");

const isLoggedIn = (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        const token = authHeader.split(" ")[1]; // Assumes format is "Bearer token"
        
        // Verify the token
        const decodedUser = verifyToken(token);
        if (!decodedUser) {
            throw new Error("Invalid/Expired token, please login again");
        }

        // Save the user ID into req object
        req.userAuthId = decodedUser._id;
        next();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = isLoggedIn;