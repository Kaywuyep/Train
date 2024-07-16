const express = require("express");
const User = require("../models/usermodel");
const axios = require('axios');
const router = express.Router();
//const isAdmin = require('../middlewares/isAdmin');
//const isTrainer = require('../middlewares/isTrainer');
const isLoggedIn = require('../middlewares/isLoggedIn');
const {
    getUsers,
    dashboard,
    profile,
    getUserProfile,
    registerUser,
    loginUser,
    updateById,
    deleteUsers,
    logout
} = require("../controllers/userController");
const getWorkouts = require('../models/workoutModel');


router.get("/signup", (req, res) => {
    //res.setHeader('Content-Type', 'text/css');
    res.render("signup", {
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  });
router.post("/signup", registerUser);
router.get("/login", (req, res) => {
    res.render("login", {
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  });
router.post("/login", loginUser);
router.get('/dashboard', isLoggedIn, dashboard);
router.get('/profile', isLoggedIn, profile);
router.get('/comingSoon', (req, res) => {
  if (isLoggedIn) {
    res.render('comingSoon', {
      user: req.session.user.name,
      roles: req.session.user.roles,
    });
  } else {
    res.redirect('/dashboard'); 
  }
});
router.get("/home", (req, res) => {
  res.render("home");
});
//router.get("/", isAdmin, getUsers);
router.get("/:id", getUserProfile);
router.put("/update/:id", isLoggedIn, updateById)
router.delete("/delete/:id", isLoggedIn, deleteUsers);
router.get("/delete/:id", (req, res) => {
  if (isLoggedIn) {
  res.render("deleteUser", {
    user: req.session.user.name,
    roles: req.session.user.roles,
    //success_msg: req.flash('success_msg'),
    //error_msg: req.flash('error_msg')
  });
} else {
  res.redirect('/login');
}
});
router.get("/logout", isLoggedIn, logout);


module.exports = router;