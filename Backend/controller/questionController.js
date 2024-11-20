const dbConnection = require("../db/config");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid"); // random question id generator

// Post question 
async function question(req, res) {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all required fields",
    });
  }
  try {
    const userid = req.user.userid; // Getting the user id from authMiddleware
    const questionid = uuidv4();
    const tag = new Date().toISOString().slice(0, 19).replace("T", " "); // to get the created date
    const [question] = await dbConnection.query(
      "select * from questions where title = ? and userid= ? and description= ?",
      [title, userid, description]
    );

    // Check if the user has already created a question
    if (question.length > 0 && userid != 0 && description) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "You already created a question" });
    }
    // Query to insert the question
    await dbConnection.query(
      "INSERT INTO questions (title,description,questionid,userid,tag) VALUES (?,?,?,?,?)",
      [title, description, questionid, userid, tag]
    );
    const [rows] = await dbConnection.query(
      "SELECT * FROM questions where title = ? or userid= ? ORDER BY tag DESC",
      [userid, title]
    );
    return res.status(StatusCodes.CREATED).json({
      message: "Question created successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Unexpected error occured." });
  }
}

// get all question
async function getAllQuestions(req, res) {
  try {
    const username = req.user.username; // Get the username from the auth middleware

    // Fetch the logged-in user's profile image
    const [userResult] = await dbConnection.query(
      "SELECT profileimg FROM users WHERE username = ?",
      [username]
    );
    const profileimg = userResult[0]?.profileimg || null; // Use the first result or null if not found

    const [results] = await dbConnection.query(
      "SELECT u.username, u.profileimg, q.title ,q.questionid, q.tag FROM questions q, users u where q.userid=u.userid order by tag DESC"
    );
    
    // Use await and destructure the result
    res.json({ 
      user: { username, profileimg },
      questions: results }); // Send the result as a JSON response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get question details
async function getQuestionDetail(req, res) {
  const { questionid } = req.params;

  try {
    // Fetch question details
    const [questionResult] = await dbConnection.query(
      "SELECT questionid,description,title FROM questions WHERE questionid = ?",
      [questionid]
    );

    // If no question found, return a 404 error
    if (questionResult.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Fetch answers along with the user who posted the answer
    const [answersResult] = await dbConnection.query(
      `SELECT a.answerid, a.answer, u.username, u.profileimg FROM answers a
          LEFT JOIN users u ON a.userid = u.userid
          WHERE a.questionid = ?`,
      [questionid]
    );

    // Combine question details and answers into one response
    const response = {
      question: questionResult[0], // The question detail
      answers: answersResult, // List of answers with usernames
    };

    res.json(response); // Send the response as a JSON object
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllQuestions, getQuestionDetail, question };
