const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authenticationMiddleware");

//user controller
const { register, login, checkUser } = require("../controller/userController");

//register route
router.post("/register", register);

//login user
router.post("/login", login);

//check user
router.get("/check", authenticationMiddleware, checkUser);

module.exports = router;