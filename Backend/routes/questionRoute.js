const express = require("express");
const router = express.Router();

//question controller
const { question, getAllQuestions, getQuestionDetail } = require("../controller/questionController");

// Post question route
router.post("/question", question);

//All questions routes
router.get('/getQuestions',getAllQuestions);

//Question Detail route
router.get('/getQuestions/:questionid',getQuestionDetail);

module.exports = router;