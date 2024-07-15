const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized: Please login" });
  }
  next();
};
 
module.exports = isLoggedIn;