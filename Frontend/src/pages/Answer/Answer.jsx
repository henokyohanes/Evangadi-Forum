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

  // Load user reactions from localStorage on component mount
  useEffect(() => {
    if (userId && questionid) {
      const storedReactions = localStorage.getItem(
        `answerReactions_${questionid}_${userId}`
      );
      if (storedReactions) {
        setUserReactions(JSON.parse(storedReactions));
      }
    }
  }, [questionid, userId]);

  // Save user reactions to localStorage whenever they change
  useEffect(() => {
    if (userId && questionid) {
      localStorage.setItem(
        `answerReactions_${questionid}_${userId}`,
        JSON.stringify(userReactions)
      );
    }
  }, [userReactions, questionid, userId]);

  // Load like and dislike counts from localStorage
  const storedCounts = localStorage.getItem(`answerCounts_${questionid}`);
  const parsedCounts = storedCounts ? JSON.parse(storedCounts) : {};

  const fetchQuestion = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axiosBaseURL.get(
        `/questions/getQuestions/${questionid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestion(response.data.question);
      // Initialize each answer with likes and dislikes from localStorage
      const initializedAnswers = response.data.answers.map((ans) => ({
        ...ans,
        likes: parsedCounts[ans._id]?.likes || 0,
        dislikes: parsedCounts[ans._id]?.dislikes || 0,
        id: ans._id,
      }));
      setAnswers(initializedAnswers || []);
    } catch (error) {
      console.error("Failed to fetch question:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questionid && token) {
      fetchQuestion();
    }
  }, [questionid, token]);

  // Handle submitting a new answer
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (answerText.trim() === "") {
      setErrorMessage("Answer cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const response = await axiosBaseURL.post(
        `/answers`,
        { questionid, answer: answerText.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new answer to the state
      const newAnswer = {
        ...response.data,
        likes: 0,
        dislikes: 0,
        id: response.data.id || response.data._id,
      };

      fetchQuestion();
      setAnswerText("");
      setErrorMessage("");
      toast.success("Answer Submitted Successfully", { autoClose: 1500 });

      // Initialize counts in localStorage
      const storedCounts =
        JSON.parse(localStorage.getItem(`answerCounts_${questionid}`)) || {};
      const updatedCounts = {
        ...storedCounts,
        [newAnswer.id]: { likes: 0, dislikes: 0 },
      };
      localStorage.setItem(
        `answerCounts_${questionid}`,
        JSON.stringify(updatedCounts)
      );
    } catch (error) {
      console.error("Failed to submit answer:", error);
      if (error.response) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred. Please try again.",
          {
            autoClose: 1500,
          }
        );
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle liking an answer
  const handleLike = (answerId) => {
    const currentReaction = userReactions[answerId];

    // If the user already liked this answer, do nothing
    if (currentReaction === "liked") return;

    // Clone current counts from localStorage
    const storedCounts =
      JSON.parse(localStorage.getItem(`answerCounts_${questionid}`)) || {};
    const answerCounts = storedCounts[answerId] || { likes: 0, dislikes: 0 };

    // Determine the new reaction
    let likesChange = 0;
    let dislikesChange = 0;

    if (currentReaction === "disliked") {
      dislikesChange = -1;
    }

    likesChange = 1;

    // Update counts based on reaction
    const updatedCounts = {
      ...storedCounts,
      [answerId]: {
        likes: (answerCounts.likes || 0) + likesChange,
        dislikes: (answerCounts.dislikes || 0) + dislikesChange,
      },
    };

    // Update localStorage
    localStorage.setItem(
      `answerCounts_${questionid}`,
      JSON.stringify(updatedCounts)
    );

    // Update state counts
    setAnswers((prevAnswers) =>
      prevAnswers.map((ans) =>
        ans.id === answerId
          ? {
              ...ans,
              likes: ans.likes + likesChange,
              dislikes: ans.dislikes + dislikesChange,
            }
          : ans
      )
    );

    // Update user reactions
    setUserReactions((prevReactions) => ({
      ...prevReactions,
      [answerId]: "liked",
    }));
  };

  // Handle disliking an answer
  const handleDislike = (answerId) => {
    const currentReaction = userReactions[answerId];

    if (currentReaction === "disliked") return;

    // Clone current counts from localStorage
    const storedCounts =
      JSON.parse(localStorage.getItem(`answerCounts_${questionid}`)) || {};
    const answerCounts = storedCounts[answerId] || { likes: 0, dislikes: 0 };

    // Determine the new reaction
    let likesChange = 0;
    let dislikesChange = 0;

    if (currentReaction === "liked") {
      likesChange = -1;
    }

    dislikesChange = 1;

    // Update counts based on reaction
    const updatedCounts = {
      ...storedCounts,
      [answerId]: {
        likes: (answerCounts.likes || 0) + likesChange,
        dislikes: (answerCounts.dislikes || 0) + dislikesChange,
      },
    };

    // Update localStorage
    localStorage.setItem(
      `answerCounts_${questionid}`,
      JSON.stringify(updatedCounts)
    );

    // Update state counts
    setAnswers((prevAnswers) =>
      prevAnswers.map((ans) =>
        ans.id === answerId
          ? {
              ...ans,
              likes: ans.likes + likesChange,
              dislikes: ans.dislikes + dislikesChange,
            }
          : ans
      )
    );

    // Update user reactions
    setUserReactions((prevReactions) => ({
      ...prevReactions,
      [answerId]: "disliked",
    }));
  };

  // Pagination logic
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = answers.slice(
    indexOfFirstAnswer,
    indexOfLastAnswer
  );

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
                          src={`${axiosImageURL}${ans.profileImg}`}
                          alt="Profile Image"
                          className={styles.profileImg}
                          loading="lazy"
                        />
                      ) : (
                        <RiAccountCircleFill className={styles.ProfileImgCircle} />
                      )}
                    </div>
                    <p>{ans.username}</p>
                  </div>
                  <div className={styles.answerContent}>
                    <p>{ans.answer}</p>
                    <div className={styles.reactions}>
                      <button
                        className={`${styles.likeButton} ${
                          userReactions[ans.id] === "liked"
                            ? styles.activeLike
                            : ""
                        }`}
                        onClick={() => handleLike(ans.id)}
                        aria-label="Like"
                        disabled={userReactions[ans.id] === "disliked"}
                      >
                        <FaThumbsUp /> {ans.likes}
                      </button>
                      <button
                        className={`${styles.dislikeButton} ${
                          userReactions[ans.id] === "disliked"
                            ? styles.activeDislike
                            : ""
                        }`}
                        onClick={() => handleDislike(ans.id)}
                        aria-label="Dislike"
                        disabled={userReactions[ans.id] === "liked"}
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
          {answers && answers.length > 0 && <div className={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {Math.ceil(answers.length / answersPerPage)}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastAnswer >= answers.length}
            >
              Next
            </button>
          </div>}
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
            <Link to="/">Back to Question page</Link>
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