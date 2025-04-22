const express = require("express");
const router = express.Router();

//question controller
const { question, getAllQuestions, getQuestionDetail, getMyQuestions } = require("../controller/questionController");

// Post question route
router.post('/question', question);

//All questions routes
router.get('/getQuestions',getAllQuestions);

//My questions routes
router.get('/my-questions',getMyQuestions);

//Question Detail route
router.get('/getQuestions/:questionid',getQuestionDetail);

module.exports = router;