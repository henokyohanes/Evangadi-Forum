import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosBaseURL, { axiosImageURL } from "../../Utility/axios";
import Layout from "../../Components/Layout/Layout";
import classes from "./Answer.module.css";
import { RiAccountCircleFill } from "react-icons/ri";
import { TbMessageQuestion } from "react-icons/tb";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { toast } from "react-toastify";

const Answer = () => {
  const { questionid } = useParams();
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userReactions, setUserReactions] = useState({});

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
  useEffect(() => {
    const storedCounts = localStorage.getItem(`answerCounts_${questionid}`);
    const parsedCounts = storedCounts ? JSON.parse(storedCounts) : {};

    const fetchQuestion = async () => {
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
      }
    };

    if (questionid && token) {
      fetchQuestion();
    }
  }, [questionid, token]);

  // Handle submitting a new answer
  const handleAnswerSubmit = async () => {
    if (answerText.trim() === "") {
      setErrorMessage("Answer cannot be empty.");
      return;
    }

    try {
      const response = await axiosBaseURL.post(
        `/answers`,
        { questionid, answer: answerText.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Answer Submitted Successfully");
      setAnswerText("");

      // Add the new answer to the state
      const newAnswer = {
        ...response.data,
        likes: 0,
        dislikes: 0,
        id: response.data._id,
      };
      setAnswers([newAnswer, ...answers]);

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

      // Clear error message if any
      setErrorMessage("");
    } catch (error) {
      setSubmitting("");
      toast.error(error.response?.data?.message || "An error occurred.");
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

  return (
    <Layout>
      <div className={classes.container}>
        <h1 className={classes.questionTitle}>
          <TbMessageQuestion /> {question.title}
        </h1>
        <p className={classes.questionDetails}>{question.description}</p>

        {/* Display Answers */}
        <div className={classes.answersSection}>
          <h5>Answers From The Community</h5>

          {answers && answers.length > 0 ? (
            answers.map((ans) => (
              <div key={ans.id} className={classes.answerItem}>
                <div className={classes.answerInfo}>
                  <div className={classes.answerInfoCard}>
                    {ans.profileimg ? (
                      <img
                        src={`${axiosImageURL}${ans.profileimg}`}
                        alt={`${ans.username}'s profile`}
                        loading="lazy"
                        style={{
                          width: "4em",
                          height: "4em",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <RiAccountCircleFill className={classes.Profilecircle} />
                    )}
                  </div>
                  <p className={classes.answerDetails}>{ans.username}</p>
                </div>
                <div className={classes.answerContent}>
                  <p className={classes.answerText}>{ans.answer}</p>
                  <div className={classes.reactions}>
                    <button
                      className={`${classes.likeButton} ${
                        userReactions[ans.id] === "liked"
                          ? classes.activeLike
                          : ""
                      }`}
                      onClick={() => handleLike(ans.id)}
                      aria-label="Like"
                      disabled={userReactions[ans.id] === "disliked"}
                    >
                      <FaThumbsUp /> {ans.likes}
                    </button>
                    <button
                      className={`${classes.dislikeButton} ${
                        userReactions[ans.id] === "disliked"
                          ? classes.activeDislike
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
            <p className={classes.noAnswers}>
              No answers yet. Be the first to answer!
            </p>
          )}
        </div>

        {/* Answer Form */}
        <div className={classes.answerForm}>
          <h5>Answer The Top Question</h5>
          <Link to="/" className={classes.HomelinkButton}>
            Go to Question page
          </Link>

          <textarea
            placeholder="Your answer ..."
            rows={4}
            className={classes.answerdescription}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
          />
        </div>
        {/* Submit Button */}
        <button onClick={handleAnswerSubmit} className={classes.submitButton}>
          Post Answer
        </button>
        {submitting && (
          <p className={classes.submittingMessage}>{submitting}</p>
        )}
        {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
      </div>
    </Layout>
  );
};

export default Answer;
