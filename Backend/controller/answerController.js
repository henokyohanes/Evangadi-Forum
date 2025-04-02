const dbconnection = require("../db/config");

// function to retrieve answers for a specific question
const allAnswers = async (req, res) => {
  const { questionid } = req.params; // Get the question ID from the request parameters

  // Validate input
  if (!questionid) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Question ID is required.",
    });
  }

  // Query to retrieve answers for the specified questionid
  const getAnswersSql = `
    SELECT a.answerid AS answer_id, 
            a.answer AS content, 
            u.username AS user_name 
            FROM answers a 
            JOIN users u ON a.userid = u.userid 
            WHERE a.questionid = ?
            ORDER BY a.answerid DESC
  `;

  try {
    // Use async/await with the query
    const [results] = await dbconnection.query(getAnswersSql, [questionid]);

    // Check if any answers were found
    if (results.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }

    // Successful response with the answers
    res.status(200).json({ answers: results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// function to post an answer
const postAnswer = async (req, res) => {
  const { questionid, answer } = req.body;
  const userid = req.user.userid;

  // Validate input
  if (!questionid || !answer) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide answer",
    });
  }

  // Query to check if the question exists
  const getQuestionSql = "SELECT * FROM questions WHERE questionid = ?";

  try {
    // Fetch the question to ensure it exists
    const [questionResult] = await dbconnection.query(getQuestionSql, [
      questionid,
    ]);

    // Check if the question exists
    if (questionResult.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "Question not found",
      });
    }

    // Query to check if the user has already posted the same answer for the question
    const checkDuplicateAnswerSql = `
      SELECT * FROM answers 
      WHERE userid = ? AND questionid = ? AND answer = ?
    `;

    const [existingAnswer] = await dbconnection.query(
      checkDuplicateAnswerSql,
      [userid, questionid, answer]
    );

    // If a duplicate answer exists, return a 409 Conflict response
    if (existingAnswer.length > 0) {
      return res.status(409).json({
        error: "Conflict",
        message: "You have already posted this answer for the question.",
      });
    }

    // Insert answer into the answers table using the user ID from the request
    const insertAnswerSql = `
      INSERT INTO answers (userid, questionid, answer) 
      VALUES (?, ?, ?)
    `;

    // execute the query
    await dbconnection.query(insertAnswerSql, [userid, questionid, answer]);

    // Successful response
    res.status(201).json({ message: "Answer posted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

module.exports = { allAnswers, postAnswer };