const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authenticationMiddleware");

//user controller
const { register, login, checkUser, forgotPassword, resetPassword, getAllUsers, deleteUser } = require("../controller/userController");

//register route
router.post("/register", register);

//login user
router.post("/login", login);

//check user
router.get("/check", authenticationMiddleware, checkUser);

//forgot password
router.post("/forgot-password", forgotPassword);

//reset password
router.post("/reset-password/:token", resetPassword);

//all users
router.get("/all-users", authenticationMiddleware, getAllUsers);

//delete user
router.delete("/delete-user/:userid", authenticationMiddleware, deleteUser);

module.exports = router;