const dbConnection = require("../db/config");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid"); // random question id generator

// function to Post question 
async function question(req, res) {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide all required fields",
    });
  }

  try {
    const userid = req.user.userid;
    const questionid = uuidv4();
    const tag = new Date().toISOString().slice(0, 19).replace("T", " ");
    const [question] = await dbConnection.query(
      "select * from questions where title = ? and userid= ? and description= ?",
      [title, userid, description]
    );

    // Check if the user has already created a question
    if (question.length > 0 && userid != 0 && description) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "You have already created this question" });
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
      msg: "Question created successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Unexpected error occured. Please try again" });
  }
}

// function to get all question
async function getAllQuestions(req, res) {
  try {
    const username = req.user.username;

    // Fetch the logged-in user's profile image
    const [userResult] = await dbConnection.query(
      "SELECT profileimg FROM users WHERE username = ?",
      [username]
    );

    const profileimg = userResult[0]?.profileimg || null;

    const [results] = await dbConnection.query(`
      SELECT u.username, u.profileimg, q.title ,q.questionid, q.tag
      FROM questions q, users u where q.userid=u.userid
      order by tag DESC
    `);
    
    // Use await and destructure the result
    res.json({ 
      user: { username, profileimg },
      questions: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// function to Get question details
async function getQuestionDetail(req, res) {
  const { questionid } = req.params;

  try {
    // Fetch question details
    const [questionResult] = await dbConnection.query(
      `SELECT questionid,description,title FROM questions WHERE questionid = ?`,
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
      question: questionResult[0],
      answers: answersResult,
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// function to get my questions
async function getMyQuestions(req, res) {
  try {
    const userid = req.user.userid;

    const [questions] = await dbConnection.query(
      `SELECT title, questionid, tag 
        FROM questions 
        WHERE userid = ?
        ORDER BY tag DESC`,
      [userid]
    );

    return res.status(200).json({
      msg: "Fetched your questions successfully",
      questions,
    });
  } catch (error) {
    console.error("Error fetching your questions:", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
}

module.exports = { getAllQuestions, getQuestionDetail, question, getMyQuestions };