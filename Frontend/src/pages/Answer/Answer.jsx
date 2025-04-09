import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosBaseURL, { axiosImageURL } from "../../Utility/axios";
import { RiAccountCircleFill } from "react-icons/ri";
import { TbMessageQuestion } from "react-icons/tb";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { toast } from "react-toastify";
import Layout from "../../Components/Layout/Layout";
import Loader from "../../Components/Loader/Loader";
import NotFound from "../../Components/NotFound/NotFound";
import styles from "./Answer.module.css";

const Answer = () => {
  const { questionid } = useParams();
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [userReactions, setUserReactions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 8;
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch question, answers, and reactions
  const fetchQuestion = async () => {
    setLoading(true);
    setError(false);
    try {
      const [questionRes, reactionRes] = await Promise.all([
        axiosBaseURL.get(`/questions/getQuestions/${questionid}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axiosBaseURL.get(`/reactions/${questionid}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setQuestion(questionRes.data.question);
      const answersWithReactions = questionRes.data.answers.map((ans) => {
        const reaction = reactionRes.data[ans.answerid] || {};
        return {
          ...ans,
          id: ans.answerid,
          likes: reaction?.likes || 0,
          dislikes: reaction?.dislikes || 0,
          userReaction: reaction.reaction || null,
        };
      });

      setAnswers(answersWithReactions);
      const userReactionMap = {};
      for (const answerId in reactionRes.data) {
        const reaction = reactionRes.data[answerId];
        if (reaction.reaction) {
          userReactionMap[answerId] = reaction.reaction;
        }
      }
      setUserReactions(userReactionMap);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (questionid && token) {
      fetchQuestion();
    }
  }, [questionid, token]);

  // Submit answer
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (answerText.trim() === "") {
      setErrorMessage("Answer cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await axiosBaseURL.post(
        `/answers`,
        { questionid, answer: answerText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswerText("");
      setErrorMessage("");
      toast.success("Answer Submitted Successfully", { autoClose: 1500 });
      fetchQuestion();
    } catch (error) {
      console.error("Failed to submit answer:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
        { autoClose: 1500 }
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Handle reaction (like/dislike)
  const handleReaction = async (answerId, reactionType) => {
    const currentReaction = userReactions[answerId];

    try {
      if (currentReaction === reactionType) {
        await axiosBaseURL.delete(`/reactions/${answerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserReactions((prev) => {
          const updated = { ...prev };
          delete updated[answerId];
          return updated;
        });
      } else {
        await axiosBaseURL.post(
          "/reactions",
          { answerid: answerId, reaction: reactionType },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserReactions((prev) => ({ ...prev, [answerId]: reactionType }));
      }

      // Refetch merged data with correct reaction count
      await fetchQuestion();
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  // Pagination logic
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = answers.slice(indexOfFirstAnswer, indexOfLastAnswer);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      {!loading && !error ? (
        <div className={styles.container}>
          <div className={styles.questionSection}>
            <div className={styles.title}>
              <TbMessageQuestion className={styles.questionIcon} />
              <h2> {question.title}</h2>
            </div>
            <p>{question.description}</p>
          </div>

          {/* Display Answers */}
          <div className={styles.answersSection}>
            <h2>Answers From The Community</h2>
            {answers && answers.length > 0 ? (
              currentAnswers.map((ans, index) => (
                <div key={index} className={styles.answerItem}>
                  <div className={styles.answerInfo}>
                    <div className={styles.profileImgContainer}>
                      {ans.profileimg ? (
                        <img
                          src={`${axiosImageURL}${ans.profileimg}`}
                          alt="Profile Image"
                          className={styles.profileImg}
                          loading="lazy"
                        />
                      ) : (
                        <RiAccountCircleFill
                          className={styles.ProfileImgCircle}
                        />
                      )}
                    </div>
                    <p>{ans.username}</p>
                  </div>
                  <div className={styles.answerContent}>
                    <p>{ans.answer}</p>
                    <div className={styles.reactions}>
                      <button
                        className={`${styles.likeButton} ${
                          userReactions[ans.answerid] === "liked"
                            ? styles.activeLike
                            : ""
                        }`}
                        onClick={() => handleReaction(ans.answerid, "liked")}
                        aria-label="Like"
                        disabled={userReactions[ans.answerid] === "disliked"}
                      >
                        <FaThumbsUp /> {ans.likes}
                      </button>
                      <button
                        className={`${styles.dislikeButton} ${
                          userReactions[ans.answerid] === "disliked"
                            ? styles.activeDislike
                            : ""
                        }`}
                        onClick={() => handleReaction(ans.answerid, "disliked")}
                        aria-label="Dislike"
                        disabled={userReactions[ans.answerid] === "liked"}
                      >
                        <FaThumbsDown /> {ans.dislikes}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noAnswers}>
                No answers yet. Be the first to answer!
              </p>
            )}
          </div>
          {/* Pagination Controls */}
          {answers && answers.length > 0 && (
            <div className={styles.pagination}>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of{" "}
                {Math.ceil(answers.length / answersPerPage)}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastAnswer >= answers.length}
              >
                Next
              </button>
            </div>
          )}
          {/* Answer Form */}
          <div className={styles.answerForm}>
            <h2>Answer The Top Question</h2>
            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}
            <textarea
              placeholder="Your answer ..."
              rows={4}
              value={answerText}
              onChange={(e) => {
                setAnswerText(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
            />
            <Link to="/questions">Back to Question page</Link>
          </div>
          {/* Submit Button */}
          <button onClick={handleAnswerSubmit} className={styles.submitButton}>
            Post Answer
          </button>
        </div>
      ) : error ? (
        <NotFound />
      ) : (
        <Loader />
      )}
    </Layout>
  );
};

export default Answer;