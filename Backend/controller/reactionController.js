const dbconnection = require("../db/config");

// Function to handle POST (like/dislike) reactions
const postReaction = async (req, res) => {
  const { answerid, reaction } = req.body;
  const userId = req.user.userid;

  if (!["liked", "disliked"].includes(reaction)) {
    return res.status(400).json({ message: "Invalid reaction type" });
  }

  try {
    // If the user is trying to "unlike" an already liked answer, delete the reaction
    if (reaction === "liked") {
      const [existingLike] = await dbconnection.query(
        `SELECT * FROM reactions WHERE userid = ? AND answerid = ?`,
        [userId, answerid]
      );

      if (existingLike.length > 0) {
        // User has already liked the answer, so we delete the like
        await dbconnection.query(
          `DELETE FROM reactions WHERE userid = ? AND answerid = ?`,
          [userId, answerid]
        );

        // Recalculate the likes/dislikes counts
        const [counts] = await dbconnection.query(
          `SELECT 
            SUM(CASE WHEN reaction_type = 'liked' THEN 1 ELSE 0 END) AS likes,
            SUM(CASE WHEN reaction_type = 'disliked' THEN 1 ELSE 0 END) AS dislikes
            FROM reactions WHERE answerid = ?`,
          [answerid]
        );

        // Update the answers table with new counts
        await dbconnection.query(
          `UPDATE answers SET likes = ?, dislikes = ? WHERE answerid = ?`,
          [counts[0].likes, counts[0].dislikes, answerid]
        );

        return res.status(200).json({ message: "Like removed" });
      }
    }

    // Save or update the reaction (for a new reaction or dislike)
    await dbconnection.query(
      `INSERT INTO reactions (userid, answerid, reaction_type)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE reaction_type = VALUES(reaction_type)`,
      [userId, answerid, reaction]
    );

    // Recalculate likes and dislikes
    const [counts] = await dbconnection.query(
      `SELECT 
        SUM(CASE WHEN reaction_type = 'liked' THEN 1 ELSE 0 END) AS likes,
        SUM(CASE WHEN reaction_type = 'disliked' THEN 1 ELSE 0 END) AS dislikes
        FROM reactions WHERE answerid = ?`,
      [answerid]
    );

    // Update the answers table with new counts
    await dbconnection.query(
      `UPDATE answers SET likes = ?, dislikes = ? WHERE answerid = ?`,
      [counts[0].likes, counts[0].dislikes, answerid]
    );

    res.status(200).json({ message: "Reaction recorded" });
  } catch (err) {
    console.error("Error in postReaction:", err);
    res.status(500).json({ message: "Error saving reaction" });
  }
};

// Function to handle DELETE (remove reaction)
const deleteReaction = async (req, res) => {
  const { answerid } = req.params;
  const userId = req.user.userid;

  try {
    // Check if the user has already reacted to the answer
    const [existingReaction] = await dbconnection.query(
      `SELECT * FROM reactions WHERE userid = ? AND answerid = ?`,
      [userId, answerid]
    );

    if (existingReaction.length === 0) {
      return res.status(400).json({ message: "No reaction found to delete" });
    }

    // Delete the user's reaction
    await dbconnection.query(
      `DELETE FROM reactions WHERE userid = ? AND answerid = ?`,
      [userId, answerid]
    );

    // Recalculate likes and dislikes
    const [counts] = await dbconnection.query(
      `SELECT 
        SUM(CASE WHEN reaction_type = 'liked' THEN 1 ELSE 0 END) AS likes,
        SUM(CASE WHEN reaction_type = 'disliked' THEN 1 ELSE 0 END) AS dislikes
        FROM reactions WHERE answerid = ?`,
      [answerid]
    );

    // Update the answers table with new counts
    await dbconnection.query(
      `UPDATE answers SET likes = ?, dislikes = ? WHERE answerid = ?`,
      [counts[0].likes, counts[0].dislikes, answerid]
    );

    res.status(200).json({ message: "Reaction removed" });
  } catch (err) {
    console.error("Error in deleteReaction:", err);
    res.status(500).json({ message: "Error removing reaction" });
  }
};

// Function to get reactions for answers related to a question
const getReactionsByQuestionId = async (req, res) => {
  const userId = req.user.userid;
  const { questionid } = req.params;

  try {
    const [answers] = await dbconnection.query(
      `SELECT answerid FROM answers WHERE questionid = ?`,
      [questionid]
    );

    const answerIds = answers.map((a) => a.answerid);
    if (answerIds.length === 0) return res.json({});

    const [userReactions] = await dbconnection.query(
      `SELECT answerid, reaction_type 
        FROM reactions 
        WHERE userid = ? AND answerid IN (?)`,
      [userId, answerIds]
    );

    // Get reaction counts
    const [reactionCounts] = await dbconnection.query(
      `SELECT 
        answerid, 
        SUM(CASE WHEN reaction_type = 'liked' THEN 1 ELSE 0 END) AS likes,
        SUM(CASE WHEN reaction_type = 'disliked' THEN 1 ELSE 0 END) AS dislikes
        FROM reactions
        WHERE answerid IN (?)
        GROUP BY answerid`,
      [answerIds]
    );

    // Create a map of answer IDs to reactions
    const reactionsMap = {};
    answerIds.forEach((id) => {
      reactionsMap[id] = {
        reaction: null,
        likes: 0,
        dislikes: 0,
      };
    });

    userReactions.forEach((r) => {
      if (reactionsMap[r.answerid]) {
        reactionsMap[r.answerid].reaction = r.reaction_type;
      }
    });

    // Update reaction counts
    reactionCounts.forEach((r) => {
      if (reactionsMap[r.answerid]) {
        reactionsMap[r.answerid].likes = r.likes || 0;
        reactionsMap[r.answerid].dislikes = r.dislikes || 0;
      }
    });

    res.json(reactionsMap);
  } catch (err) {
    console.error("Error in getReactionsByQuestionId:", err);
    res.status(500).json({ message: "Error fetching reactions" });
  }
};

module.exports = { postReaction, deleteReaction, getReactionsByQuestionId };