const express = require("express");
const User = require("../models/usermodel");
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');
const isTrainer = require('../middlewares/isTrainer');
const isLoggedIn = require('../middlewares/isLoggedIn');
const {
    getUsers,
    getUserProfile,
    registerUser,
    loginUser,
    updateById,
    deleteUsers,
} = require("../controllers/userController");



router.get("/", isAdmin, getUsers);
router.get("/:id", isLoggedIn, getUserProfile);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.put("/update/:id", isLoggedIn, updateById)
router.delete("/delete/:id", isLoggedIn, isAdmin, deleteUsers);


module.exports = router;