import React, { useEffect, useState } from "react";
import axiosBaseURL from "../../Utility/axios";
import Layout from "../../Components/Layout/Layout";
import styles from "./MyQuestions.module.css";
import { useNavigate } from "react-router-dom";

const MyQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMyQuestions = async () => {
        try {
            const response = await axiosBaseURL.get("/questions/my-questions", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setQuestions(response.data.questions);
        } catch (err) {
            console.error("Error fetching questions:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionClick = (questionid) => {
        navigate(`/questions/${questionid}`);
    };

    useEffect(() => {
        fetchMyQuestions();
    }, []);

    return (
        <Layout>
            <div className={styles.container}>
                <h2 className={styles.pageTitle}>My Questions</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : questions.length === 0 ? (
                    <p>You haven't asked any questions yet.</p>
                ) : (
                    <ul className={styles.questionList}>
                        {questions.map((q, index) => (
                            <li
                                key={index}
                                className={styles.questionItem}
                                onClick={() => handleQuestionClick(q.questionid)}
                            >
                                <div className={styles.listContainer}>
                                    <p className={styles.username}>{q.username}</p>
                                </div>

                                <div className={styles.questionText}>
                                    <strong>{q.title}</strong>
                                    <p>
                                        {new Date(q.tag).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>

                                <button className={styles.arrowBtn}>➡</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
};

export default MyQuestions;
