import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiAccountCircleFill } from "react-icons/ri";
import { AppState } from "../../Routes/Router";
import axiosBaseURL, { axiosImageURL } from "../../Utility/axios";
import Layout from "../../Components/Layout/Layout";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./Home.module.css";

const Home = () => {

  const { user } = useContext(AppState);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 8;
  const navigate = useNavigate();

  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {

        setLoading(true);
        setError(false);

        const response = await axiosBaseURL.get("/questions/getQuestions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setQuestions(response.data.questions);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle click event to navigate to detail page
  const handleQuestionClick = (questionid) => {
    navigate(`/getQuestions/${questionid}`);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filter questions based on search term
  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navigate to the "Ask Question" page
  const handleAskQuestionClick = () => {
    navigate("/questions/ask");
  };

  return (
    <Layout>
        {!loading && !error ? (<main className={styles.mainContent}>
          {/* header container */}
          <div className={styles.headerContainer}>
            <button onClick={handleAskQuestionClick}>
              Ask Question
            </button>
            <h2>
              <span className={styles.span}>Welcome</span> {user.username}
            </h2>
          </div>
          {/* search bar */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <h2>Questions</h2>
          {filteredQuestions.length === 0 ? (
            <div className={styles.noMatchMessage}>
              No matching questions found.
            </div>
          ) : (
            <ul className={styles.questionList}>
              {currentQuestions.map((q, index) => (
                <li
                  className={styles.questionItem}
                  onClick={() => handleQuestionClick(q.questionid)}
                  key={index}
                >
                  <div className={styles.listContainer}>
                    <div className={styles.profileImgContainer}>
                      {q.profileimg ? (
                        <img
                          src={`${axiosImageURL}${q.profileimg}`}
                          className={styles.profileImg}
                          alt="Profile Image"
                          loading="lazy"
                        />
                      ) : (
                        <RiAccountCircleFill className={styles.profileImgCircle} />
                      )}
                    </div>
                  </div>
                  {/* Question Text */}
                  <div className={styles.questionText}>
                    <strong>{q.title}</strong>
                    {/* Date */}
                    <p>
                      {new Date(q.tag).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className={styles.username}>{q.username}</p>
                  </div>
                  <button>➡</button>
                </li>
              ))}
            </ul>
          )}
          {/* Pagination Controls */}
        {filteredQuestions.length > 0 && <div className={styles.pagination}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(filteredQuestions.length / questionsPerPage)}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastQuestion >= filteredQuestions.length}
          >
            Next
          </button>
        </div>}
        </main>) : error ? <NotFound /> : <Loader /> }
    </Layout>
  );
}

export default Home;