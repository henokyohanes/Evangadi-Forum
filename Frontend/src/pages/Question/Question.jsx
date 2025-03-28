import React, { useState } from "react";
import Layout from "../../Components/Layout/Layout";
import axiosBaseURL from "../../Utility/axios";
import styles from "./Question.module.css";
import { FaCircleArrowRight } from "react-icons/fa6";
import { toast } from "react-toastify";

const Question = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get the token from localStorage

    try {
      const response = await axiosBaseURL.post(
        "/questions/question",
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Question posted successfully!");
        console.log("successful");
        setTitle("");
        setDescription("");
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      }
    } catch (error) {
      toast.error(error.response.data.msg);
      setError(error.response.data.msg || "Error posting question.");
    }
  };

  return (
    <>
      <Layout>
        <div className={styles.container}>
          <h1 className={styles.heading}>What Do You Want to Know?</h1>
          <div className={styles.stepsContainer}>
            <div className={styles.steps}>
              <h3>
                Steps to Write a Good Question
              </h3>
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
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.question}>
              <h3>What’s On Your Mind? Ask Away</h3>
              <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="question title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="question description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <button type="submit">
                    Post Your Question
                  </button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Question;
