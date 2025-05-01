const express = require("express");
const router = express.Router();

// answer controller
const { allAnswers, postAnswer, deleteAnswer } = require("../controller/answerController");

// Endpoint to retrieve answers for a specific question
router.get("/:questionid", allAnswers);

// Endpoint to post an answer for a specific question
router.post("/", postAnswer);

// Endpoint to delete an answer
router.delete("/:answerid", deleteAnswer);

module.exports = router;