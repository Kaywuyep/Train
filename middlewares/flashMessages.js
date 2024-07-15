const session = require('express-session');
const flash = require('connect-flash');

const flashMiddleware = (app) => {
  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  }));

  app.use(flash());

  app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
  });
};

module.exports = flashMiddleware;