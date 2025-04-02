const express = require("express");
const router = express.Router();

// answer controller
const { allAnswers, postAnswer } = require("../controller/answerController");

// Endpoint to retrieve answers for a specific question
router.get("/:questionid", allAnswers);

// Endpoint to post an answer for a specific question
router.post("/", postAnswer);

module.exports = router;