import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosBaseURL from "../../Utility/axios";
import Layout from "../../Components/Layout/Layout";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./MyQuestions.module.css";

const MyQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 8;
    const navigate = useNavigate();

    const fetchMyQuestions = async () => {
        setLoading(true);
        setError(false);

        try {
            const response = await axiosBaseURL.get("/questions/my-questions", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setQuestions(response.data.questions);
        } catch (err) {
            console.error("Error fetching questions:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionClick = (questionid) => {
        navigate(`/getQuestions/${questionid}`);
    };

    useEffect(() => {
        fetchMyQuestions();
    }, []);

    // Pagination logic
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(
        indexOfFirstQuestion,
        indexOfLastQuestion
    );

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Layout>
            {!loading && !error ? (
                <div className={styles.container}>
                    <h2>My Questions</h2>
                    {questions.length === 0 ? (
                        <div className={styles.noMatchMessage}>
                            You haven't asked any questions yet.
                        </div>
                    ) : (
                        <ul className={styles.questionList}>
                            {currentQuestions.map((q, index) => (
                                <li
                                    key={index}
                                    className={styles.questionItem}
                                    onClick={() => handleQuestionClick(q.questionid)}
                                >
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
                                    <button>➡</button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {questions.length > 0 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of{" "}
                                {Math.ceil(questions.length / questionsPerPage)}
                            </span>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={indexOfLastQuestion >= questions.length}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : error ? (
                <NotFound />
            ) : (
                <Loader />
            )}
        </Layout>
    );
};

export default MyQuestions;
