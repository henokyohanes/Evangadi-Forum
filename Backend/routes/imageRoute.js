const express = require("express");
const router = express.Router();

//image controller
const { profileImage } = require("../controller/imageController");

//image route
router.post("/upload", profileImage);

module.exports = router;