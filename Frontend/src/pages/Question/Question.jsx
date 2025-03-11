import React, { useState } from "react";
import Layout from "../../Components/Layout/Layout";
import axiosBaseURL from "../../Utility/axios";
import classes from "./Question.module.css";
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
        <div>
          <h1 className={classes.heading}>What Do You Want to Know?</h1>
          <div className={classes.all}>
            <div className={classes.steps}>
              <h3 className={classes.heading_title}>
                Steps to Write a Good Question
              </h3>
              <hr className={classes.line} />
              <ul className={classes.checklist}>
                <li className={classes.checklistItem}>
                  <FaCircleArrowRight size={30} className={classes.icon} />
                  <p>Summarize your problem in a one-line title</p>
                </li>
                <li className={classes.checklistItem}>
                  <FaCircleArrowRight size={30} className={classes.icon} />
                  <p>Describe your problem in more detail</p>
                </li>
                <li className={classes.checklistItem}>
                  <FaCircleArrowRight size={30} className={classes.icon} />
                  <p>Describe what you tried and what you expected to happen</p>
                </li>
                <li className={classes.checklistItem}>
                  <FaCircleArrowRight size={30} className={classes.icon} />
                  <p>Review your question and post it to the site</p>
                </li>
              </ul>
            </div>
            {error && <div className={classes.error}>{error}</div>}
            <div className={classes.question}>
              <h3>What’s On Your Mind? Ask Away</h3>
              <form className={classes.box} onSubmit={handleSubmit}>
                <div className={classes.inputholder}>
                  <input
                    type="text"
                    placeholder="Question Title..."
                    className={classes.input1}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="Question Description "
                    className={classes.description}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className={classes.btnholder}>
                  <button type="submit" className={classes.btn}>
                    Post Your Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Question;
