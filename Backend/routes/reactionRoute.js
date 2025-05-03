const express = require("express");
const router = express.Router();

// reaction controller
const { postReaction, deleteReaction, getReactionsByQuestionId } = require("../controller/reactionController");

// reaction post route
router.post("/", postReaction);

// reaction delete route
router.delete("/:answerid", deleteReaction);

// reaction get route
router.get("/:questionid", getReactionsByQuestionId);

module.exports = router;