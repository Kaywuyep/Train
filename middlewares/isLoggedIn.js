const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    //return res.status(401).json({ message: "Unauthorized: Please login" });
    return res.redirect('/v1/api/users/login')
  }
  next();
};
 
module.exports = isLoggedIn;