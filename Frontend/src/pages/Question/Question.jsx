import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCircleArrowRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import axiosBaseURL from "../../Utility/axios";
import Layout from "../../Components/Layout/Layout";
import Loader from "../../Components/Loader/Loader";
import NotFound from "../../Components/NotFound/NotFound";
import styles from "./Question.module.css";

const Question = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Validate title
    if (!title.trim()) {
      errors.title = "Title is required.";
      isValid = false;
    } else if (title.length > 100) {
      errors.title = "Title should not exceed 100 characters.";
      isValid = false;
    }

    // Validate description
    if (!description.trim()) {
      errors.description = "Description is required.";
      isValid = false;
    }

    setErrorMessage(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    setLoading(true);
    setError(false);

    try {
      const response = await axiosBaseURL.post(
        "/questions/question",
        {title, description,},
        {headers: {Authorization: `Bearer ${token}`,},}
      );

      setTitle("");
      setDescription("");
      toast.success("Question posted successfully!", { autoClose: 1500 });
      setTimeout(() => { navigate("/questions") }, 1500);
    } catch (error) {
      console.error("Error posting question:", error);
      if (error.response) {
        toast.error(error.response.data.msg, { autoClose: 1500 });
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Layout>
        {!loading && !error ? (
          <div className={styles.container}>
            <h1 className={styles.heading}>What Do You Want to Know?</h1>
            <div className={styles.stepsContainer}>
              <div className={styles.steps}>
                <h3>Steps to Write a Good Question</h3>
                <hr className={styles.line} />
                <ul className={styles.checkList}>
                  <li>
                    <FaCircleArrowRight className={styles.icon} />
                    <p>Summarize your problem in a one-line title.</p>
                  </li>
                  <li>
                    <FaCircleArrowRight className={styles.icon} />
                    <p>Describe your problem in more detail.</p>
                  </li>
                  <li>
                    <FaCircleArrowRight className={styles.icon} />
                    <p>Describe what you tried and expected to happen.</p>
                  </li>
                  <li>
                    <FaCircleArrowRight className={styles.icon} />
                    <p>Review your question and post it to the site.</p>
                  </li>
                </ul>
              </div>
              <div className={styles.question}>
                <h3>What’s On Your Mind? Ask Away</h3>
                <form onSubmit={handleSubmit}>
                  <div>
                    {errorMessage.title && (
                      <div className={styles.error}>{errorMessage.title}</div>
                    )}
                    <input
                      type="text"
                      placeholder="question title..."
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (errorMessage.title)
                          setErrorMessage({ ...errorMessage, title: "" });
                      }}
                    />
                  </div>
                  <div>
                    {errorMessage.description && (
                      <div className={styles.error}>
                        {errorMessage.description}
                      </div>
                    )}
                    <textarea
                      placeholder="question description..."
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errorMessage.description)
                          setErrorMessage({ ...errorMessage, description: "" });
                      }}
                    />
                  </div>
                  <button type="submit">Post Your Question</button>
                </form>
              </div>
            </div>
          </div>
        ) : error ?
          <NotFound />
          :
          <Loader />
        }
      </Layout>
    </div>
  );
}

export default Question;